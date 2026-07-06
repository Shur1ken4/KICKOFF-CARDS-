// Kickoff Cards — collection + staking engine. All state lives in localStorage
// (no backend). A player owns cards; before a match they BACK a card on a call;
// when the match resolves, a winning call EARNS a bonus card and a losing call
// BURNS the staked card forever. Card points (not money) decide the league.

import { PLAYERS, getPlayer, tierMeta, LEGENDS, RARES, COMMONS } from "../data/players.js";
import { getTeam, groupOf } from "../data/worldcup2026.js";
import { getPrediction, difficultyMeta } from "../data/cardPredictions.js";

const KEY = (scope) => `kc:collection:${scope}`;
const TEAM_CARD_POINTS = 10;

// A scope namespaces a player's collection. Inside a league we scope to
// `${leagueId}:${wallet}` so points feed that league; otherwise per-wallet.
export function collectionScope({ leagueId, wallet } = {}) {
  if (leagueId && wallet) return `${leagueId}:${wallet}`;
  if (wallet) return `w:${wallet}`;
  return "solo";
}

function safeParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

const emptyState = () => ({
  seeded: false,
  owned: [], // card descriptors
  burned: [], // { ...card, burnedAt, matchId }
  stakes: {}, // matchId -> [{ cardKey, predictionId, placedAt }]
  log: [], // [{ matchId, cardKey, predictionId, won, rewardKey, at }]
});

export function getCollection(scope) {
  return safeParse(localStorage.getItem(KEY(scope)), emptyState());
}

function save(scope, state) {
  localStorage.setItem(KEY(scope), JSON.stringify(state));
  return state;
}

// --- Card descriptors --------------------------------------------------------
export function playerCard(id) {
  const p = getPlayer(id);
  if (!p) return null;
  return { key: `p:${p.id}`, kind: "player", id: p.id, tier: p.tier, name: p.name, team: p.team, pos: p.pos };
}

export function teamCard(name) {
  return { key: `t:${name}`, kind: "team", id: name, tier: "team", name };
}

export function cardPoints(card) {
  return card.kind === "team" ? TEAM_CARD_POINTS : tierMeta(card.tier).points;
}

// Display props for the <Card> component.
export function cardDisplay(card) {
  if (card.kind === "team") {
    const t = getTeam(card.name);
    const g = groupOf(card.name);
    return {
      tier: "team",
      title: card.name,
      subtitle: g ? `Group ${g}` : "National team",
      flag: t.flag,
      accent: t.primary,
      points: TEAM_CARD_POINTS,
    };
  }
  const t = getTeam(card.team);
  return {
    tier: card.tier,
    title: card.name,
    subtitle: `${card.pos} · ${card.team}`,
    flag: t.flag,
    accent: t.primary,
    points: tierMeta(card.tier).points,
    // Full-bleed card art at public/cards/<id>.png. When the file is missing the
    // <Card> component falls back to the drawn HTML face automatically.
    image: `/cards/${card.id}.png`,
  };
}

// --- Seeding the starter collection -----------------------------------------
// Called once at registration with the teams + players the user picked.
export function seedCollection(scope, { teams = [], players = [] } = {}) {
  const state = getCollection(scope);
  if (state.seeded) return state;
  const owned = [];
  const seen = new Set();
  players.forEach((id) => {
    const c = playerCard(id);
    if (c && !seen.has(c.key)) {
      owned.push(c);
      seen.add(c.key);
    }
  });
  teams.forEach((name) => {
    const c = teamCard(name);
    if (!seen.has(c.key)) {
      owned.push(c);
      seen.add(c.key);
    }
  });
  state.owned = owned;
  state.seeded = true;
  return save(scope, state);
}

export function ownedCards(scope) {
  return getCollection(scope).owned;
}

export function totalPoints(scope) {
  return getCollection(scope).owned.reduce((sum, c) => sum + cardPoints(c), 0);
}

// --- Staking -----------------------------------------------------------------
export function getStakes(scope, matchId) {
  return getCollection(scope).stakes[matchId] || [];
}

// Back a card on a prediction for a match. A card can only be staked once per
// match; team + player stakes are tracked together.
export function backCard(scope, matchId, { cardKey, predictionId }) {
  const state = getCollection(scope);
  const list = state.stakes[matchId] || [];
  if (list.some((s) => s.cardKey === cardKey)) {
    return { error: "That card is already staked on this match.", state };
  }
  list.push({ cardKey, predictionId, placedAt: Date.now() });
  state.stakes[matchId] = list;
  return { state: save(scope, state) };
}

export function unbackCard(scope, matchId, cardKey) {
  const state = getCollection(scope);
  const list = state.stakes[matchId] || [];
  state.stakes[matchId] = list.filter((s) => s.cardKey !== cardKey);
  return save(scope, state);
}

// --- Resolution --------------------------------------------------------------
export function winnerOf(result) {
  if (result.homeScore > result.awayScore) return "home";
  if (result.awayScore > result.homeScore) return "away";
  return "draw";
}

function sideOf(result, teamName) {
  if (teamName === result.home) return "home";
  if (teamName === result.away) return "away";
  return null;
}

function goalsByPlayer(result, playerName) {
  return (result.events || []).filter(
    (e) => e.type === "goal" && e.player === playerName
  ).length;
}

function scoreFor(result, side) {
  return side === "home" ? result.homeScore : result.awayScore;
}

// Evaluate a single call against the final result.
export function evaluateCall(card, prediction, result) {
  const kind = prediction.kind;
  const teamName = card.kind === "team" ? card.name : card.team;
  const side = sideOf(result, teamName);
  if (!side) return false; // card's team not in this match
  const oppSide = side === "home" ? "away" : "home";
  const won = winnerOf(result) === side;
  const margin = scoreFor(result, side) - scoreFor(result, oppSide);

  switch (kind) {
    case "player_team_win":
      return won;
    case "player_scores":
      return goalsByPlayer(result, card.name) >= 1;
    case "player_scores_and_wins":
      return won && goalsByPlayer(result, card.name) >= 1;
    case "player_brace":
      return goalsByPlayer(result, card.name) >= 2;
    case "team_not_lose":
      return winnerOf(result) === side || winnerOf(result) === "draw";
    case "team_win":
      return won;
    case "team_lose":
      return winnerOf(result) === oppSide;
    case "team_clean_sheet":
      return won && scoreFor(result, oppSide) === 0;
    case "team_win_by_two":
      return won && margin >= 2;
    default:
      return false;
  }
}

// Pick a fresh bonus card from a reward tier's pool (a player card).
function rewardCard(tierKey) {
  const pool = tierKey === "legend" ? LEGENDS : tierKey === "rare" ? RARES : COMMONS;
  const pick = pool[Math.floor(Math.random() * pool.length)] || PLAYERS[0];
  return playerCard(pick.id);
}

// Upset bonus: backing a weaker player and being right pays better than backing
// a superstar to do the obvious. The reward tier from the call's difficulty is
// shifted by the staked player's tier — common players earn up a tier, legends
// earn down a tier. Team cards are unaffected.
const REWARD_ORDER = ["common", "rare", "legend"];
export function rewardTierFor(card, prediction) {
  const base = difficultyMeta(prediction.difficulty).reward;
  if (!card || card.kind !== "player") return base;
  const shift = card.tier === "common" ? 1 : card.tier === "legend" ? -1 : 0;
  const idx = REWARD_ORDER.indexOf(base);
  const next = Math.min(REWARD_ORDER.length - 1, Math.max(0, idx + shift));
  return REWARD_ORDER[next];
}

// Resolve every open stake for a match. Returns per-stake outcomes so the UI can
// animate wins (earn) and burns. Idempotent per match: clears stakes after.
export function resolveStakes(scope, matchId, result) {
  const state = getCollection(scope);
  const stakes = state.stakes[matchId] || [];
  if (!stakes.length) return { outcomes: [], state };

  const outcomes = [];
  stakes.forEach((s) => {
    const card = state.owned.find((c) => c.key === s.cardKey);
    const prediction = getPrediction(s.predictionId);
    if (!card || !prediction) return;
    const won = evaluateCall(card, prediction, result);

    if (won) {
      const tierKey = rewardTierFor(card, prediction);
      const bonus = rewardCard(tierKey);
      // Add a fresh copy of the reward card (allow duplicates as collectibles).
      const copy = { ...bonus, key: `${bonus.key}#${Date.now()}${outcomes.length}`, bonus: true };
      state.owned.push(copy);
      outcomes.push({ cardKey: s.cardKey, card, prediction, won: true, reward: copy });
      state.log.unshift({ matchId, cardKey: s.cardKey, predictionId: s.predictionId, won: true, rewardKey: copy.key, at: Date.now() });
    } else {
      // Burn the staked card forever.
      state.owned = state.owned.filter((c) => c.key !== s.cardKey);
      state.burned.unshift({ ...card, burnedAt: Date.now(), matchId });
      outcomes.push({ cardKey: s.cardKey, card, prediction, won: false });
      state.log.unshift({ matchId, cardKey: s.cardKey, predictionId: s.predictionId, won: false, at: Date.now() });
    }
  });

  delete state.stakes[matchId];
  state.log = state.log.slice(0, 50);
  return { outcomes, state: save(scope, state) };
}

export function getBurned(scope) {
  return getCollection(scope).burned;
}
