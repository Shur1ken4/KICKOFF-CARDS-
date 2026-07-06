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
  },
];

// Static odds snapshot per team — used to seed portfolio values for non-featured
// teams so the leaderboard has signal even before live data arrives.
export const MOCK_TEAM_WIN_PROB = {
  France: 69,
  Brazil: 11,
  Spain: 38,
  Argentina: 33,
  England: 41,
  Germany: 29,
  Portugal: 44,
  Netherlands: 28,
  Morocco: 62,
  Japan: 24,
  USA: 38,
  Mexico: 32,
  Croatia: 35,
  Belgium: 40,
  Uruguay: 30,
  Switzerland: 27,
  Senegal: 33,
  Denmark: 31,
  Poland: 26,
  "South Korea": 22,
  Australia: 19,
  Serbia: 25,
  Ecuador: 21,
  Ghana: 18,
  Cameroon: 23,
  Canada: 20,
  Wales: 24,
  "Saudi Arabia": 16,
  Iran: 17,
  Tunisia: 19,
  "Costa Rica": 15,
  Qatar: 14,
};
