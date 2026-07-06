// Live prediction game — gives players something to DO during a match instead
// of passively watching. Players predict who scores the next goal; correct
// picks earn points + build a streak. Persisted in localStorage (no backend).
//
// A "scope" namespaces a player's prediction state. When playing inside a
// league we scope to `${leagueId}:${wallet}` so points feed that league's
// standings; otherwise we fall back to a per-wallet (or solo) scope so the
// featured demo match is still playable without a league.

const KEY = (scope) => `mml:pred:${scope}`;

const BASE_POINTS = 10; // correct next-goal prediction
const STREAK_BONUS = 2; // added per consecutive correct pick

export function predictionScope({ leagueId, wallet } = {}) {
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
  points: 0,
  streak: 0,
  best: 0,
  correct: 0,
  total: 0,
  open: null, // { matchId, pick, atMinute }
  history: [], // [{ matchId, pick, actual, correct, points, minute }]
});

export function getPredictions(scope) {
  return safeParse(localStorage.getItem(KEY(scope)), emptyState());
}

function save(scope, state) {
  localStorage.setItem(KEY(scope), JSON.stringify(state));
  return state;
}

// Lock in a prediction for the next goal. `pick` is a team name (home or away).
export function placePrediction(scope, { matchId, pick, atMinute }) {
  const state = getPredictions(scope);
  state.open = { matchId, pick, atMinute };
  return save(scope, state);
}

// Resolve the open prediction against the team that actually scored next.
// Returns { resolved, correct, awarded, state }. No-op when there's no open
// prediction or it belongs to a different match.
export function resolvePrediction(scope, { matchId, actualTeam, atMinute }) {
  const state = getPredictions(scope);
  const open = state.open;
  if (!open || open.matchId !== matchId) {
    return { resolved: false, correct: false, awarded: 0, state };
  }

  const correct = open.pick === actualTeam;
  let awarded = 0;
  if (correct) {
    state.streak += 1;
    awarded = BASE_POINTS + (state.streak - 1) * STREAK_BONUS;
    state.points += awarded;
    state.correct += 1;
    state.best = Math.max(state.best, state.streak);
  } else {
    state.streak = 0;
  }
  state.total += 1;
  state.history.unshift({
    matchId,
    pick: open.pick,
    actual: actualTeam,
    correct,
    points: awarded,
    minute: atMinute,
  });
  state.history = state.history.slice(0, 20);
  state.open = null;

  return { resolved: true, correct, awarded, state: save(scope, state) };
}

// Discard an open prediction (e.g. match ended with no further goal).
export function clearOpenPrediction(scope) {
  const state = getPredictions(scope);
  if (!state.open) return state;
  state.open = null;
  return save(scope, state);
}

// Total prediction points for a wallet across every league scope — used to
// surface a player's bonus on a league leaderboard.
export function pointsForWallet(wallet, leagueId) {
  if (!wallet) return 0;
  const scoped = getPredictions(predictionScope({ leagueId, wallet }));
  return scoped.points;
}
