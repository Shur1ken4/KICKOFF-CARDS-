// League state — persisted entirely in localStorage (no backend for the MVP).
// A league's id IS its 6-character join code.

import { ALL_TEAM_NAMES } from "../data/teams";
import { MOCK_TEAM_WIN_PROB } from "../data/mockData";

const INDEX_KEY = "mml:leagues";
const leagueKey = (id) => `mml:league:${id}`;
const ME_KEY = (id) => `mml:me:${id}`;

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function safeParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

export function generateCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function readIndex() {
  return safeParse(localStorage.getItem(INDEX_KEY), []);
}

function writeIndex(ids) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

export function getLeague(id) {
  if (!id) return null;
  return safeParse(localStorage.getItem(leagueKey(id.toUpperCase())), null);
}

export function saveLeague(league) {
  localStorage.setItem(leagueKey(league.id), JSON.stringify(league));
  const idx = readIndex();
  if (!idx.includes(league.id)) writeIndex([...idx, league.id]);
  return league;
}

export function getAllLeagues() {
  return readIndex()
    .map((id) => getLeague(id))
    .filter(Boolean);
}

// Identity is the connected Solana wallet address: a member's `id` IS their
// wallet public key, so the same wallet maps to the same player across devices.
// `wallet` should be the base58 public key string; `name` is an optional display
// label (falls back to a shortened address).
export function shortWallet(addr) {
  if (!addr) return "Player";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function createLeague(leagueName, { wallet, name } = {}) {
  if (!wallet) return { error: "Connect a Solana wallet to create a league." };
  let id = generateCode();
  while (getLeague(id)) id = generateCode();
  const league = {
    id,
    name: leagueName.trim() || "My League",
    createdAt: Date.now(),
    drafted: false,
    members: [
      {
        id: wallet,
        wallet,
        name: name?.trim() || shortWallet(wallet),
        isCreator: true,
        teams: [],
      },
    ],
  };
  saveLeague(league);
  setMe(id, wallet);
  return { league };
}

export function joinLeague(code, { wallet, name } = {}) {
  if (!wallet) return { error: "Connect a Solana wallet to join a league." };
  const id = code.trim().toUpperCase();
  const league = getLeague(id);
  if (!league) return { error: "No league found with that code." };
  // Wallet already in this league → just resume.
  if (league.members.some((m) => m.id === wallet)) {
    setMe(id, wallet);
    return { league };
  }
  if (league.drafted) return { error: "This league has already drafted teams." };
  league.members.push({
    id: wallet,
    wallet,
    name: name?.trim() || shortWallet(wallet),
    isCreator: false,
    teams: [],
  });
  saveLeague(league);
  setMe(id, wallet);
  return { league };
}

// Demo helper: populate a league with sample friends so the leaderboard can be
// shown on a single device (there's no backend for friends to join in a demo).
const DEMO_NAMES = ["Sam", "Priya", "Diego", "Yuki", "Marcus"];
export function addDemoMembers(id, count = 3) {
  const league = getLeague(id);
  if (!league || league.drafted) return league;
  const taken = new Set(league.members.map((m) => m.name));
  const pool = DEMO_NAMES.filter((n) => !taken.has(n));
  for (let i = 0; i < count && pool.length; i++) {
    league.members.push({ id: uid(), name: pool.shift(), isCreator: false, teams: [] });
  }
  saveLeague(league);
  return league;
}

// Random draft: each member gets 2–3 teams depending on league size.
export function startDraft(id) {
  const league = getLeague(id);
  if (!league) return null;
  const teamsPerMember = league.members.length <= 4 ? 3 : 2;
  const pool = shuffle([...ALL_TEAM_NAMES]);
  league.members = league.members.map((m) => ({
    ...m,
    teams: pool.splice(0, teamsPerMember),
  }));
  league.drafted = true;
  league.draftedAt = Date.now();
  saveLeague(league);
  return league;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- "Me" identity per league ------------------------------------------------
export function setMe(leagueId, memberId) {
  localStorage.setItem(ME_KEY(leagueId), memberId);
}
export function getMe(leagueId) {
  return localStorage.getItem(ME_KEY(leagueId));
}

// --- Portfolio valuation -----------------------------------------------------
// A member's portfolio value = sum of current win probability across their teams.
// `liveProbs` overlays fresh odds (e.g. from the featured live match) on top of
// the static baseline snapshot.
export function teamValue(teamName, liveProbs = {}) {
  if (liveProbs[teamName] != null) return liveProbs[teamName];
  return MOCK_TEAM_WIN_PROB[teamName] ?? 25;
}

export function memberValue(member, liveProbs = {}) {
  return member.teams.reduce((sum, t) => sum + teamValue(t, liveProbs), 0);
}

export function rankMembers(league, liveProbs = {}) {
  if (!league) return [];
  const rows = league.members.map((m) => ({
    ...m,
    value: memberValue(m, liveProbs),
    teamValues: m.teams.map((t) => ({ team: t, value: teamValue(t, liveProbs) })),
  }));
  rows.sort((a, b) => b.value - a.value);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}
