// Mock dataset used for (a) demo mode and (b) graceful fallback when TxLINE is
// unavailable. The featured match is a full "replay" — a virtual clock advances
// and reveals events + odds up to the current minute, so the Moment Card and the
// chart animate dramatically on demand. Judges reviewing after matches end still
// get the full cinematic experience.

// --- Featured replay match: France 2–1 Brazil -------------------------------

export const FEATURED_MATCH_ID = "mock-fra-bra";

// Odds samples over the match timeline (home = France, away = Brazil).
// Probabilities sum to ~100. The chart reveals points up to the current minute.
export const MOCK_ODDS_TIMELINE = [
  { minute: 0, home: 47, draw: 28, away: 25 },
  { minute: 5, home: 49, draw: 28, away: 23 },
  { minute: 10, home: 51, draw: 27, away: 22 },
  // Mbappé strikes (12')
  { minute: 12, home: 71, draw: 18, away: 11 },
  { minute: 20, home: 73, draw: 17, away: 10 },
  { minute: 30, home: 70, draw: 19, away: 11 },
  { minute: 34, home: 68, draw: 20, away: 12 },
  { minute: 40, home: 66, draw: 21, away: 13 },
  // Vinícius equalises (45')
  { minute: 45, home: 45, draw: 27, away: 28 },
  { minute: 50, home: 43, draw: 27, away: 30 },
  // Silva sent off (54')
  { minute: 54, home: 63, draw: 22, away: 15 },
  { minute: 60, home: 66, draw: 21, away: 13 },
  { minute: 67, home: 69, draw: 20, away: 11 },
  { minute: 75, home: 74, draw: 17, away: 9 },
  // Olise seals it (81')
  { minute: 81, home: 92, draw: 6, away: 2 },
  { minute: 88, home: 96, draw: 3, away: 1 },
  { minute: 90, home: 98, draw: 1.5, away: 0.5 },
];

// Event log. `oddsBefore`/`oddsAfter` capture the home-win-probability swing so
// the Moment Card can show "47% → 71%" without recomputing.
export const MOCK_EVENTS = [
  {
    id: "e1",
    minute: 12,
    type: "goal",
    team: "France",
    player: "Kylian Mbappé",
    detail: "Left-footed finish from the edge of the box",
    score: "1–0",
    oddsBefore: 51,
    oddsAfter: 71,
  },
  {
    id: "e2",
    minute: 34,
    type: "yellow",
    team: "Brazil",
    player: "Casemiro",
    detail: "Tactical foul to stop a counter",
    score: "1–0",
    oddsBefore: 70,
    oddsAfter: 68,
  },
  {
    id: "e3",
    minute: 45,
    type: "goal",
    team: "Brazil",
    player: "Vinícius Jr.",
    detail: "Cuts inside and curls it home",
    score: "1–1",
    oddsBefore: 66,
    oddsAfter: 45,
  },
  {
    id: "e4",
    minute: 54,
    type: "red",
    team: "Brazil",
    player: "Marquinhos",
    detail: "Last-man challenge, straight red",
    score: "1–1",
    oddsBefore: 43,
    oddsAfter: 63,
  },
  {
    id: "e5",
    minute: 67,
    type: "sub",
    team: "France",
    player: "Ousmane Dembélé",
    detail: "On for Coman, fresh legs to exploit the space",
    score: "1–1",
    oddsBefore: 66,
    oddsAfter: 69,
  },
  {
    id: "e6",
    minute: 81,
    type: "goal",
    team: "France",
    player: "Michael Olise",
    detail: "Pounces on a loose ball in the area",
    score: "2–1",
    oddsBefore: 74,
    oddsAfter: 92,
  },
];

export const MOCK_MATCH_META = {
  id: FEATURED_MATCH_ID,
  home: "France",
  away: "Brazil",
  competition: "World Cup — Quarter Final",
  finalScore: { home: 2, away: 1 },
};

// --- Fixtures list (today's matches / leaderboard source) -------------------

export const MOCK_FIXTURES = [
  {
    id: FEATURED_MATCH_ID,
    home: "France",
    away: "Brazil",
    status: "live",
    minute: 67,
    score: { home: 1, away: 1 },
    kickoff: "20:00",
    odds: { home: 69, draw: 20, away: 11 },
    lastEvent: { minute: 45, type: "goal", team: "Brazil", player: "Vinícius Jr." },
  },
  {
    id: "mock-esp-arg",
    home: "Spain",
    away: "Argentina",
    status: "live",
    minute: 23,
    score: { home: 0, away: 1 },
    kickoff: "20:00",
    odds: { home: 38, draw: 29, away: 33 },
    lastEvent: { minute: 19, type: "goal", team: "Argentina", player: "Lautaro Martínez" },
  },
  {
    id: "mock-eng-ger",
    home: "England",
    away: "Germany",
    status: "upcoming",
    minute: 0,
    score: { home: 0, away: 0 },
    kickoff: "23:00",
    odds: { home: 41, draw: 30, away: 29 },
  },
  {
    id: "mock-por-ned",
    home: "Portugal",
    away: "Netherlands",
    status: "upcoming",
    minute: 0,
    score: { home: 0, away: 0 },
    kickoff: "23:00",
    odds: { home: 44, draw: 28, away: 28 },
  },
  {
    id: "mock-mar-jpn",
    home: "Morocco",
    away: "Japan",
    status: "finished",
    minute: 90,
    score: { home: 2, away: 0 },
    kickoff: "17:00",
    odds: { home: 96, draw: 3, away: 1 },
    lastEvent: { minute: 78, type: "goal", team: "Morocco", player: "Achraf Hakimi" },
  },
  {
    id: "mock-usa-mex",
    home: "USA",
    away: "Mexico",
    status: "finished",
    minute: 90,
    score: { home: 1, away: 1 },
    kickoff: "17:00",
    odds: { home: 38, draw: 30, away: 32 },
    lastEvent: { minute: 88, type: "goal", team: "Mexico", player: "Raúl Jiménez" },
  },
];

// Static tournament-strength snapshot per team — used to seed portfolio values
// for non-featured teams so the leaderboard has signal even before live data
// arrives. Keys must match the team names in worldcup2026.js (the qualified 48).
export const MOCK_TEAM_WIN_PROB = {
  // Group A
  Mexico: 40,
  "South Africa": 20,
  "South Korea": 26,
  Czechia: 28,
  // Group B
  Canada: 30,
  Bosnia: 24,
  Qatar: 16,
  Switzerland: 34,
  // Group C
  Brazil: 62,
  Morocco: 44,
  Haiti: 12,
  Scotland: 26,
  // Group D
  USA: 42,
  Paraguay: 24,
  Australia: 22,
  Turkey: 36,
  // Group E
  Germany: 55,
  "Curaçao": 12,
  "Ivory Coast": 30,
  Ecuador: 28,
  // Group F
  Netherlands: 52,
  Japan: 34,
  Sweden: 30,
  Tunisia: 20,
  // Group G
  Belgium: 48,
  Egypt: 30,
  Iran: 24,
  "New Zealand": 12,
  // Group H
  Spain: 60,
  "Cabo Verde": 14,
  Saudi: 18,
  Uruguay: 40,
  // Group I
  France: 66,
  Senegal: 38,
  Iraq: 16,
  Norway: 40,
  // Group J
  Argentina: 64,
  Algeria: 28,
  Austria: 32,
  Jordan: 14,
  // Group K
  Portugal: 58,
  "DR Congo": 24,
  Uzbekistan: 18,
  Colombia: 42,
  // Group L
  England: 56,
  Croatia: 40,
  Ghana: 24,
  Panama: 16,
};
