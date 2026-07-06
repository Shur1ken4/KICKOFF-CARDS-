// Kickoff Cards — player card pool.
//
// Every player is a collectible card in one of three tiers:
//   • legend  — the marquee names. Gold border + shimmer. Hardest to earn, worth
//               the most card points.
//   • rare    — standout starters. Silver/violet border.
//   • common  — solid squad players. Plain border.
//
// Tier only affects card-point value and cosmetics — never match outcomes, so the
// game stays skill-based, not pay-to-win. `id` is stable and used as the card key
// in a player's collection.

export const TIERS = {
  legend: {
    key: "legend",
    label: "Legend",
    color: "#E4B23C", // gold
    glow: "rgba(228,178,60,0.55)",
    points: 30,
    shimmer: true,
  },
  rare: {
    key: "rare",
    label: "Rare",
    color: "#7C6CF0", // violet
    glow: "rgba(124,108,240,0.45)",
    points: 15,
    shimmer: false,
  },
  common: {
    key: "common",
    label: "Common",
    color: "#9CA3AF", // slate
    glow: "rgba(156,163,175,0.35)",
    points: 6,
    shimmer: false,
  },
};

export function tierMeta(tier) {
  return TIERS[tier] || TIERS.common;
}

// pos: GK / DEF / MID / FWD — purely descriptive on the card face.
export const PLAYERS = [
  // Legends
  { id: "messi", name: "Lionel Messi", team: "Argentina", pos: "FWD", tier: "legend" },
  { id: "mbappe", name: "Kylian Mbappé", team: "France", pos: "FWD", tier: "legend" },
  { id: "vinicius", name: "Vinícius Jr.", team: "Brazil", pos: "FWD", tier: "legend" },
  { id: "haaland", name: "Erling Haaland", team: "Norway", pos: "FWD", tier: "legend" },
  { id: "bellingham", name: "Jude Bellingham", team: "England", pos: "MID", tier: "legend" },
  { id: "ronaldo", name: "Cristiano Ronaldo", team: "Portugal", pos: "FWD", tier: "legend" },
  { id: "debruyne", name: "Kevin De Bruyne", team: "Belgium", pos: "MID", tier: "legend" },
  { id: "kane", name: "Harry Kane", team: "England", pos: "FWD", tier: "legend" },

  // Rares
  { id: "olise", name: "Michael Olise", team: "France", pos: "FWD", tier: "rare" },
  { id: "pedri", name: "Pedri", team: "Spain", pos: "MID", tier: "rare" },
  { id: "musiala", name: "Jamal Musiala", team: "Germany", pos: "MID", tier: "rare" },
  { id: "rodrygo", name: "Rodrygo", team: "Brazil", pos: "FWD", tier: "rare" },
  { id: "martinez", name: "Lautaro Martínez", team: "Argentina", pos: "FWD", tier: "rare" },
  { id: "leao", name: "Rafael Leão", team: "Portugal", pos: "FWD", tier: "rare" },
  { id: "gakpo", name: "Cody Gakpo", team: "Netherlands", pos: "FWD", tier: "rare" },
  { id: "son", name: "Son Heung-min", team: "South Korea", pos: "FWD", tier: "rare" },
  { id: "yamal", name: "Lamine Yamal", team: "Spain", pos: "FWD", tier: "rare" },
  { id: "wirtz", name: "Florian Wirtz", team: "Germany", pos: "MID", tier: "rare" },
  { id: "pulisic", name: "Christian Pulisic", team: "USA", pos: "FWD", tier: "rare" },
  { id: "modric", name: "Luka Modrić", team: "Croatia", pos: "MID", tier: "rare" },

  // Commons
  { id: "dembele", name: "Ousmane Dembélé", team: "France", pos: "FWD", tier: "common" },
  { id: "raphinha", name: "Raphinha", team: "Brazil", pos: "FWD", tier: "common" },
  { id: "foden", name: "Phil Foden", team: "England", pos: "MID", tier: "common" },
  { id: "gavi", name: "Gavi", team: "Spain", pos: "MID", tier: "common" },
  { id: "depay", name: "Memphis Depay", team: "Netherlands", pos: "FWD", tier: "common" },
  { id: "mitoma", name: "Kaoru Mitoma", team: "Japan", pos: "FWD", tier: "common" },
  { id: "alvarez", name: "Julián Álvarez", team: "Argentina", pos: "FWD", tier: "common" },
  { id: "davies", name: "Alphonso Davies", team: "Canada", pos: "DEF", tier: "common" },
  { id: "mane", name: "Sadio Mané", team: "Senegal", pos: "FWD", tier: "common" },
  { id: "hakimi", name: "Achraf Hakimi", team: "Morocco", pos: "DEF", tier: "common" },
  { id: "valverde", name: "Federico Valverde", team: "Uruguay", pos: "MID", tier: "common" },
  { id: "yildiz", name: "Kenan Yıldız", team: "Turkey", pos: "FWD", tier: "common" },
  { id: "lozano", name: "Hirving Lozano", team: "Mexico", pos: "FWD", tier: "common" },
  { id: "gimenez", name: "Santiago Giménez", team: "Mexico", pos: "FWD", tier: "common" },
];

const BY_ID = Object.fromEntries(PLAYERS.map((p) => [p.id, p]));
const BY_TEAM = PLAYERS.reduce((acc, p) => {
  (acc[p.team] ||= []).push(p);
  return acc;
}, {});

export function getPlayer(id) {
  return BY_ID[id] || null;
}

export function playersForTeam(team) {
  return BY_TEAM[team] || [];
}

export const LEGENDS = PLAYERS.filter((p) => p.tier === "legend");
export const RARES = PLAYERS.filter((p) => p.tier === "rare");
export const COMMONS = PLAYERS.filter((p) => p.tier === "common");
