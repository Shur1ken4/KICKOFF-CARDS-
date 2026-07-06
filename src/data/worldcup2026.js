// Kickoff Cards — World Cup 2026 team data.
// 48 nations across 12 groups (A–L). Each team carries a flag emoji + primary /
// secondary colours drawn from its national flag. Those colours drive the whole
// "world on one screen" look: match colour-washes, card borders and accents.
//
// NOTE: the 2026 tournament is 48 teams in 12 groups of 4. Group placements here
// are a plausible seeding used for the demo — the app never depends on real draw
// results, only on the team metadata below.

export const TEAMS = {
  // Group A
  Mexico: { flag: "🇲🇽", primary: "#006847", secondary: "#CE1126" },
  Poland: { flag: "🇵🇱", primary: "#DC143C", secondary: "#FFFFFF" },
  Egypt: { flag: "🇪🇬", primary: "#CE1126", secondary: "#000000" },
  "New Zealand": { flag: "🇳🇿", primary: "#00247D", secondary: "#CC142B" },
  // Group B
  Canada: { flag: "🇨🇦", primary: "#FF0000", secondary: "#FFFFFF" },
  Croatia: { flag: "🇭🇷", primary: "#FF0000", secondary: "#171796" },
  Nigeria: { flag: "🇳🇬", primary: "#008751", secondary: "#FFFFFF" },
  Qatar: { flag: "🇶🇦", primary: "#8A1538", secondary: "#FFFFFF" },
  // Group C
  USA: { flag: "🇺🇸", primary: "#3C3B6E", secondary: "#B22234" },
  Uruguay: { flag: "🇺🇾", primary: "#0038A8", secondary: "#FCD116" },
  Senegal: { flag: "🇸🇳", primary: "#00853F", secondary: "#FDEF42" },
  "South Korea": { flag: "🇰🇷", primary: "#003478", secondary: "#C60C30" },
  // Group D
  England: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#CF101A", secondary: "#FFFFFF" },
  Switzerland: { flag: "🇨🇭", primary: "#D52B1E", secondary: "#FFFFFF" },
  Ecuador: { flag: "🇪🇨", primary: "#FFDD00", secondary: "#034EA2" },
  Australia: { flag: "🇦🇺", primary: "#00843D", secondary: "#FFCD00" },
  // Group E
  Spain: { flag: "🇪🇸", primary: "#AA151B", secondary: "#F1BF00" },
  Denmark: { flag: "🇩🇰", primary: "#C60C30", secondary: "#FFFFFF" },
  Japan: { flag: "🇯🇵", primary: "#BC002D", secondary: "#FFFFFF" },
  "Costa Rica": { flag: "🇨🇷", primary: "#002B7F", secondary: "#CE1126" },
  // Group F
  France: { flag: "🇫🇷", primary: "#0055A4", secondary: "#EF4135" },
  Serbia: { flag: "🇷🇸", primary: "#C6363C", secondary: "#0C4076" },
  Morocco: { flag: "🇲🇦", primary: "#006233", secondary: "#C1272D" },
  Panama: { flag: "🇵🇦", primary: "#005293", secondary: "#D21034" },
  // Group G
  Brazil: { flag: "🇧🇷", primary: "#009C3B", secondary: "#FFDF00" },
  Portugal: { flag: "🇵🇹", primary: "#006600", secondary: "#FF0000" },
  Cameroon: { flag: "🇨🇲", primary: "#007A5E", secondary: "#CE1126" },
  Saudi: { flag: "🇸🇦", primary: "#006C35", secondary: "#FFFFFF" },
  // Group H
  Argentina: { flag: "🇦🇷", primary: "#74ACDF", secondary: "#FFFFFF" },
  Germany: { flag: "🇩🇪", primary: "#DD0000", secondary: "#FFCE00" },
  Ghana: { flag: "🇬🇭", primary: "#006B3F", secondary: "#FCD116" },
  Iran: { flag: "🇮🇷", primary: "#239F40", secondary: "#DA0000" },
  // Group I
  Netherlands: { flag: "🇳🇱", primary: "#FF6600", secondary: "#21468B" },
  Colombia: { flag: "🇨🇴", primary: "#FCD116", secondary: "#003893" },
  Tunisia: { flag: "🇹🇳", primary: "#E70013", secondary: "#FFFFFF" },
  Jamaica: { flag: "🇯🇲", primary: "#009B3A", secondary: "#FED100" },
  // Group J
  Belgium: { flag: "🇧🇪", primary: "#E30613", secondary: "#FDDA24" },
  Italy: { flag: "🇮🇹", primary: "#008C45", secondary: "#CD212A" },
  "Ivory Coast": { flag: "🇨🇮", primary: "#FF8200", secondary: "#009A44" },
  Norway: { flag: "🇳🇴", primary: "#BA0C2F", secondary: "#00205B" },
  // Group K
  Uzbekistan: { flag: "🇺🇿", primary: "#1EB53A", secondary: "#0099B5" },
  Peru: { flag: "🇵🇪", primary: "#D91023", secondary: "#FFFFFF" },
  Wales: { flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", primary: "#C8102E", secondary: "#00B140" },
  Algeria: { flag: "🇩🇿", primary: "#006233", secondary: "#D21034" },
  // Group L
  Austria: { flag: "🇦🇹", primary: "#ED2939", secondary: "#FFFFFF" },
  Turkey: { flag: "🇹🇷", primary: "#E30A17", secondary: "#FFFFFF" },
  Paraguay: { flag: "🇵🇾", primary: "#D52B1E", secondary: "#0038A8" },
  "South Africa": { flag: "🇿🇦", primary: "#007A4D", secondary: "#FFB612" },
};

// Group draw — 12 groups of four.
export const GROUPS = {
  A: ["Mexico", "Poland", "Egypt", "New Zealand"],
  B: ["Canada", "Croatia", "Nigeria", "Qatar"],
  C: ["USA", "Uruguay", "Senegal", "South Korea"],
  D: ["England", "Switzerland", "Ecuador", "Australia"],
  E: ["Spain", "Denmark", "Japan", "Costa Rica"],
  F: ["France", "Serbia", "Morocco", "Panama"],
  G: ["Brazil", "Portugal", "Cameroon", "Saudi"],
  H: ["Argentina", "Germany", "Ghana", "Iran"],
  I: ["Netherlands", "Colombia", "Tunisia", "Jamaica"],
  J: ["Belgium", "Italy", "Ivory Coast", "Norway"],
  K: ["Uzbekistan", "Peru", "Wales", "Algeria"],
  L: ["Austria", "Turkey", "Paraguay", "South Africa"],
};

const FALLBACK = { flag: "🏳️", primary: "#111827", secondary: "#6B7280" };

export function getTeam(name) {
  if (!name) return FALLBACK;
  return TEAMS[name] || FALLBACK;
}

export function teamColor(name) {
  return getTeam(name).primary;
}

export function teamFlag(name) {
  return getTeam(name).flag;
}

export function groupOf(name) {
  return Object.keys(GROUPS).find((g) => GROUPS[g].includes(name)) || null;
}

export const ALL_TEAM_NAMES = Object.keys(TEAMS);

// hex -> rgba string with alpha
export function withAlpha(hex, alpha) {
  const h = (hex || "#111827").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
