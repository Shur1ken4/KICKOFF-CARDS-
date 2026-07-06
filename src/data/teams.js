// Kickoff Cards uses the full 48-team World Cup 2026 dataset in worldcup2026.js.
// This module re-exports it so the reused match engine + chart components keep
// importing team colours/flags/helpers from a single place.

export {
  TEAMS,
  GROUPS,
  getTeam,
  teamColor,
  teamFlag,
  groupOf,
  ALL_TEAM_NAMES,
  withAlpha,
} from "./worldcup2026.js";
