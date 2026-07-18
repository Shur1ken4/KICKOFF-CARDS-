// Kickoff Cards — collection + staking engine. All state lives in localStorage
// (no backend). A player owns cards; before a match they BACK a card on a call;
// when the match resolves, a winning call EARNS a bonus card and a losing call
// BURNS the staked card forever. Card points (not money) decide the league.

import { PLAYERS, getPlayer, tierMeta, LEGENDS, RARES, COMMONS } from "../data/players.js";
import { getTeam, groupOf, TEAMS } from "../data/worldcup2026.js";
import { getPrediction, difficultyMeta } from "../data/cardPredictions.js";

const KEY = (scope) => `kc:collection:${scope}`;
const TEAM_CARD_POINTS = 10;

// Team card art lives at public/cards/teams/<slug>.png (see
// scripts/split-team-cards.py). Slug matches the generated filenames.
const teamSlug = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
  burned: [], // { ...card, burnedAt, matchId, canRevive }
  stakes: {}, // matchId -> [{ cardKey, predictionId, placedAt }]
  log: [], // [{ matchId, cardKey, predictionId, won, rewardKey, at }]
  points: 0, // Instinct Points — earned on winning calls, spent to revive cards
  revived: [], // card keys that have already used their one revival
});

// Instinct Points earned when a call LANDS, scaled by how bold the call was.
// Bolder reads pay out far more — this is the skill currency, separate from a
// card's collection value.
const POINTS_BY_DIFFICULTY = { easy: 5, medium: 10, hard: 25, extreme: 60 };

// Cost to revive a burned card, by the card's tier. A legend costs ~two perfect
// legendary calls to bring back; a common, two safe wins.
const REVIVE_COST = { common: 20, team: 35, rare: 50, legend: 120 };

export function reviveCost(card) {
  return REVIVE_COST[card?.tier] ?? REVIVE_COST.common;
}

export function getPoints(scope) {
  return getCollection(scope).points || 0;
}

// A stored card is only valid if its underlying player/team still exists in the
// current data. Player pools change across versions (e.g. a name dropped from
// players.js) but old localStorage saves persist, which would otherwise surface
// phantom cards. Filtering on read keeps every collection consistent with the
// live data without touching legit earned/burned history.
function knownCard(card) {
  if (!card) return false;
  if (card.kind === "player") return !!getPlayer(card.id);
  if (card.kind === "team") return Object.prototype.hasOwnProperty.call(TEAMS, card.name);
  return false;
}

export function getCollection(scope) {
  const state = safeParse(localStorage.getItem(KEY(scope)), emptyState());
  if (Array.isArray(state.owned)) state.owned = state.owned.filter(knownCard);
  if (Array.isArray(state.burned)) state.burned = state.burned.filter(knownCard);
  return state;
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
      // Full-bleed team card art. A missing file falls back to the drawn face.
      image: `/cards/teams/${teamSlug(card.name)}.png`,
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

// A curated starter set for the wallet-less demo scope so the /collection
// "money shot" always showcases our best art — the legend + rare player photo
// cards — instead of only team crests. Additive and idempotent (own `demoSeeded`
// flag): it only fills in missing showcase cards and never removes anything a
// real player earned or burned through play.
const DEMO_SHOWCASE_PLAYERS = [
  "messi", "mbappe", "vinicius", "haaland", "bellingham", "kane", // legends
  "pedri", "son", "yamal", "olise", // rares
];

export function seedDemoShowcase(scope) {
  const state = getCollection(scope);
  if (state.demoSeeded) return state;
  const owned = state.owned || [];
  const seen = new Set(owned.map((c) => c.key));
  DEMO_SHOWCASE_PLAYERS.forEach((id) => {
    const c = playerCard(id);
    if (c && !seen.has(c.key)) {
      owned.push(c);
      seen.add(c.key);
    }
  });
  state.owned = owned;
  state.seeded = true;
  state.demoSeeded = true;
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

function cardsByPlayer(result, playerName, cardType) {
  return (result.events || []).filter(
    (e) => e.type === cardType && e.player === playerName
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
    case "player_substituted":
      return (result.events || []).some(
        (e) => e.type === "sub" && e.player === card.name
      );
    case "player_hat_trick":
      return goalsByPlayer(result, card.name) >= 3;
    case "player_yellow_card":
      return cardsByPlayer(result, card.name, "yellow") >= 1;
    case "player_red_card":
      return cardsByPlayer(result, card.name, "red") >= 1;
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
      // Award Instinct Points for landing the call — bolder calls pay more.
      const pts = POINTS_BY_DIFFICULTY[prediction.difficulty] || 0;
      state.points = (state.points || 0) + pts;
      outcomes.push({ cardKey: s.cardKey, card, prediction, won: true, reward: copy, points: pts });
      state.log.unshift({ matchId, cardKey: s.cardKey, predictionId: s.predictionId, won: true, rewardKey: copy.key, points: pts, at: Date.now() });
    } else {
      // Burn the staked card. It lands in the graveyard, where it can be revived
      // ONCE with Instinct Points — a second burn is permanent.
      state.owned = state.owned.filter((c) => c.key !== s.cardKey);
      const canRevive = !(state.revived || []).includes(card.key);
      state.burned.unshift({ ...card, burnedAt: Date.now(), matchId, canRevive });
      outcomes.push({ cardKey: s.cardKey, card, prediction, won: false, points: 0 });
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

// Instinct Points a call is worth if it lands (badge value on each option).
export function callPoints(prediction) {
  return POINTS_BY_DIFFICULTY[prediction?.difficulty] ?? 0;
}

// Bring a burned card back from the graveyard by spending Instinct Points. Each
// card can only be revived once — a card that burns again is gone for good.
export function reviveCard(scope, cardKey) {
  const state = getCollection(scope);
  const idx = (state.burned || []).findIndex((c) => c.key === cardKey);
  if (idx === -1) return { error: "That card isn't in the graveyard.", state };

  const entry = state.burned[idx];
  if (entry.canRevive === false || (state.revived || []).includes(cardKey)) {
    return { error: "This card has already used its one revival.", state };
  }

  const cost = reviveCost(entry);
  if ((state.points || 0) < cost) {
    return { error: `Need ${cost} Instinct Points to revive this card.`, state };
  }

  state.points = (state.points || 0) - cost;
  state.burned.splice(idx, 1);
  const { burnedAt, matchId, canRevive, ...card } = entry;
  state.owned.push(card);
  state.revived = [...(state.revived || []), cardKey];
  return { ok: true, cost, state: save(scope, state) };
}
