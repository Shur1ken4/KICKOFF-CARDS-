// Kickoff Cards — the outcomes a player can back a card on before a match.
//
// You stake a card on one of these calls. If the live match data confirms the
// call, you EARN a bonus card (of the reward tier). If it fails, the staked card
// is BURNED — removed from your collection forever. No money is ever involved;
// the only stake is the card itself.
//
// Difficulty sets how bold the call is (and therefore the reward). `kind` tells
// the resolver (lib/cards.js) how to check the call against live TxLINE data:
//   player calls resolve against goal events (team + scorer);
//   team calls resolve against the final score / result.

export const DIFFICULTY = {
  easy: { key: "easy", label: "Safe call", color: "#25C46A", reward: "common" },
  medium: { key: "medium", label: "Bold call", color: "#00A1FF", reward: "common" },
  hard: { key: "hard", label: "Big call", color: "#E0347A", reward: "rare" },
  extreme: { key: "extreme", label: "Legendary call", color: "#E4B23C", reward: "legend" },
};

export function difficultyMeta(key) {
  return DIFFICULTY[key] || DIFFICULTY.medium;
}

// Calls you can make on a backed PLAYER card.
export const PLAYER_PREDICTIONS = [
  {
    id: "p_on_winning_side",
    kind: "player_team_win",
    label: "Their team wins",
    blurb: "Back this player to end up on the winning side.",
    difficulty: "easy",
    emoji: "🏆",
  },
  {
    id: "p_scores",
    kind: "player_scores",
    label: "Scores anytime",
    blurb: "Back this player to find the net during the match.",
    difficulty: "medium",
    emoji: "⚽",
  },
  {
    id: "p_scores_and_wins",
    kind: "player_scores_and_wins",
    label: "Scores in a win",
    blurb: "Back this player to score AND see their team win.",
    difficulty: "hard",
    emoji: "⚽🏆",
  },
  {
    id: "p_brace",
    kind: "player_brace",
    label: "Scores a brace",
    blurb: "Back this player for two or more goals. Legendary.",
    difficulty: "extreme",
    emoji: "⚽⚽",
  },
];

// Calls you can make on a backed TEAM card.
export const TEAM_PREDICTIONS = [
  {
    id: "t_not_lose",
    kind: "team_not_lose",
    label: "Avoid defeat",
    blurb: "Back this team to win or draw.",
    difficulty: "easy",
    emoji: "🛡️",
  },
  {
    id: "t_win",
    kind: "team_win",
    label: "Win the match",
    blurb: "Back this team for all three points.",
    difficulty: "medium",
    emoji: "🏆",
  },
  {
    id: "t_lose",
    kind: "team_lose",
    label: "Loses the match",
    blurb: "Back this team to come out on the losing side.",
    difficulty: "medium",
    emoji: "❌",
  },
  {
    id: "t_clean_sheet",
    kind: "team_clean_sheet",
    label: "Win to nil",
    blurb: "Back this team to win without conceding.",
    difficulty: "hard",
    emoji: "🧤",
  },
  {
    id: "t_win_by_two",
    kind: "team_win_by_two",
    label: "Win by 2+ goals",
    blurb: "Back this team for a commanding margin.",
    difficulty: "extreme",
    emoji: "💥",
  },
];

const BY_ID = Object.fromEntries(
  [...PLAYER_PREDICTIONS, ...TEAM_PREDICTIONS].map((p) => [p.id, p])
);

export function getPrediction(id) {
  return BY_ID[id] || null;
}
