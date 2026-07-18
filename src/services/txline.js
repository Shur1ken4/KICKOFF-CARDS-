// TxLINE World Cup data client (devnet).
//
// Authentication is the Solana-native { jwt, apiToken } pair produced by
// txlineAuth.activateLiveData(). Every data request sends:
//   Authorization: Bearer <jwt>
//   X-Api-Token: <apiToken>
//
// All calls are defensive: on any failure they throw and callers fall back to
// replay / last-known data so the UI never breaks.

import { apiBaseUrl, getStoredAuth } from "./txlineAuth.js";

// World Cup competition id for /fixtures/snapshot filtering. Left null = pull the
// whole bundle (free tier is World Cup + Int'l Friendlies only, so it's small).
const WORLD_CUP_COMPETITION_ID = null;

// Module-level auth, rehydrated from the persisted activation on load and
// refreshed by setActiveAuth() right after a wallet completes the handshake.
let activeAuth = getStoredAuth();

// Subscribers (e.g. useFixtures) that want to react the moment access changes,
// so live data can start streaming without a page reload.
const authListeners = new Set();

export function subscribeAuth(listener) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

export function setActiveAuth(auth) {
  activeAuth = auth || null;
  for (const listener of authListeners) listener(hasLiveAccess());
}

export const hasLiveAccess = () => Boolean(activeAuth?.apiToken && activeAuth?.jwt);

async function txGet(path) {
  if (!hasLiveAccess()) throw new Error("No TxLINE live access");
  const res = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Authorization: `Bearer ${activeAuth.jwt}`,
      "X-Api-Token": activeAuth.apiToken,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`TxLINE ${path} failed: ${res.status}`);
  return res.json();
}

export const txline = {
  // Fixtures metadata for the World Cup bundle.
  matches: () =>
    txGet(
      `/fixtures/snapshot${
        WORLD_CUP_COMPETITION_ID ? `?competitionId=${WORLD_CUP_COMPETITION_ID}` : ""
      }`
    ),
  // Latest 1X2 win-probability snapshot for a fixture.
  odds: (fixtureId) => txGet(`/odds/snapshot/${fixtureId}`),
  // Live score + score events for a fixture (goals, cards derive from this feed).
  score: (fixtureId) => txGet(`/scores/snapshot/${fixtureId}`),
  events: (fixtureId) => txGet(`/scores/updates/${fixtureId}`),
};

// --- Normalizers -------------------------------------------------------------
// TxLINE odds/score payload shapes aren't fully pinned for the free tier, so the
// odds/score/event normalizers stay permissive and degrade gracefully. Fixtures
// use the documented PascalCase schema.

export function normalizeOdds(raw) {
  if (!raw) return null;
  const o = Array.isArray(raw) ? raw[raw.length - 1] : raw.odds || raw.markets || raw;
  if (!o) return null;
  const toPct = (v) => {
    if (v == null) return null;
    const n = Number(v);
    if (Number.isNaN(n)) return null;
    // Accept a 0–1 probability, a percentage, or decimal odds (>1.05 → implied).
    if (n > 1.05 && n <= 1000) return Math.round((100 / n) * 10) / 10;
    return n <= 1 ? Math.round(n * 1000) / 10 : Math.round(n * 10) / 10;
  };
  const home = toPct(o.home ?? o.homeWin ?? o.home_win ?? o.h ?? o.Home ?? o.p1);
  const draw = toPct(o.draw ?? o.x ?? o.tie ?? o.Draw ?? o.px);
  const away = toPct(o.away ?? o.awayWin ?? o.away_win ?? o.a ?? o.Away ?? o.p2);
  if (home == null && away == null) return null;
  return { home: home ?? 0, draw: draw ?? 0, away: away ?? 0 };
}

export function normalizeScore(raw) {
  if (!raw) return { home: 0, away: 0, minute: 0, status: "upcoming" };
  const s = Array.isArray(raw) ? raw[raw.length - 1] : raw.score || raw;
  return {
    home: Number(s.home ?? s.homeScore ?? s.home_score ?? s.Score1 ?? 0),
    away: Number(s.away ?? s.awayScore ?? s.away_score ?? s.Score2 ?? 0),
    minute: Number(s.minute ?? s.clock ?? raw.minute ?? s.Minute ?? 0),
    status: normalizeStatus(s.status ?? raw.status ?? s.Status),
  };
}

export function normalizeStatus(status) {
  const v = String(status || "").toLowerCase();
  if (["live", "inplay", "in_play", "1h", "2h", "playing"].some((k) => v.includes(k)))
    return "live";
  if (["ht", "half"].some((k) => v.includes(k))) return "ht";
  if (["ft", "finished", "ended", "complete"].some((k) => v.includes(k)))
    return "finished";
  return "upcoming";
}

const EVENT_TYPE_MAP = {
  goal: "goal",
  redcard: "red",
  red: "red",
  red_card: "red",
  yellowcard: "yellow",
  yellow: "yellow",
  yellow_card: "yellow",
  substitution: "sub",
  sub: "sub",
};

export function normalizeEvents(raw) {
  const list = Array.isArray(raw) ? raw : raw?.events || raw?.updates || [];
  return list
    .map((e, i) => ({
      id: e.id || e.Id || `tx-${i}`,
      minute: Number(e.minute ?? e.time ?? e.Minute ?? 0),
      type:
        EVENT_TYPE_MAP[String(e.type || e.Type || "").toLowerCase().replace(/\s/g, "")] ||
        "event",
      team: e.team || e.teamName || e.Team || "",
      player: e.player || e.playerName || e.Player || "",
      detail: e.detail || e.description || "",
      score: e.score || "",
    }))
    .filter((e) => e.type !== "event" || e.minute > 0);
}

export function normalizeFixtures(raw) {
  const list = Array.isArray(raw) ? raw : raw?.fixtures || raw?.matches || [];
  return list.map((m) => {
    const p1Home = m.Participant1IsHome ?? true;
    const home = p1Home ? m.Participant1 : m.Participant2;
    const away = p1Home ? m.Participant2 : m.Participant1;
    const start = m.StartTime || m.startTime || m.kickoff || "";
    const upcoming = start ? new Date(start).getTime() > Date.now() : true;
    return {
      id: m.FixtureId ?? m.id ?? m.matchId,
      home: home || m.home || m.homeTeam,
      away: away || m.away || m.awayTeam,
      status: normalizeStatus(m.status) === "upcoming" && !upcoming ? "live" : normalizeStatus(m.status),
      minute: Number(m.minute ?? 0),
      score: {
        home: Number(m.homeScore ?? m.score?.home ?? 0),
        away: Number(m.awayScore ?? m.score?.away ?? 0),
      },
      kickoff: start,
      odds: normalizeOdds(m.odds) || { home: 0, draw: 0, away: 0 },
    };
  });
}
