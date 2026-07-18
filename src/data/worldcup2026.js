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
  "South Africa": { flag: "🇿🇦", primary: "#007A4D", secondary: "#FFB612" },
  "South Korea": { flag: "🇰🇷", primary: "#003478", secondary: "#C60C30" },
  Czechia: { flag: "🇨🇿", primary: "#11457E", secondary: "#D7141A" },
  // Group B
  Canada: { flag: "🇨🇦", primary: "#FF0000", secondary: "#FFFFFF" },
  Bosnia: { flag: "🇧🇦", primary: "#002F6C", secondary: "#FECB00" },
  Qatar: { flag: "🇶🇦", primary: "#8A1538", secondary: "#FFFFFF" },
  Switzerland: { flag: "🇨🇭", primary: "#D52B1E", secondary: "#FFFFFF" },
  // Group C
  Brazil: { flag: "🇧🇷", primary: "#009C3B", secondary: "#FFDF00" },
  Morocco: { flag: "🇲🇦", primary: "#006233", secondary: "#C1272D" },
  Haiti: { flag: "🇭🇹", primary: "#00209F", secondary: "#D21034" },
  Scotland: { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", primary: "#005EB8", secondary: "#FFFFFF" },
  // Group D
  USA: { flag: "🇺🇸", primary: "#3C3B6E", secondary: "#B22234" },
  Paraguay: { flag: "🇵🇾", primary: "#D52B1E", secondary: "#0038A8" },
  Australia: { flag: "🇦🇺", primary: "#00843D", secondary: "#FFCD00" },
  Turkey: { flag: "🇹🇷", primary: "#E30A17", secondary: "#FFFFFF" },
  // Group E
  Germany: { flag: "🇩🇪", primary: "#DD0000", secondary: "#FFCE00" },
  "Curaçao": { flag: "🇨🇼", primary: "#002B7F", secondary: "#F9E814" },
  "Ivory Coast": { flag: "🇨🇮", primary: "#FF8200", secondary: "#009A44" },
  Ecuador: { flag: "🇪🇨", primary: "#FFDD00", secondary: "#034EA2" },
  // Group F
  Netherlands: { flag: "🇳🇱", primary: "#FF6600", secondary: "#21468B" },
  Japan: { flag: "🇯🇵", primary: "#BC002D", secondary: "#FFFFFF" },
  Sweden: { flag: "🇸🇪", primary: "#006AA7", secondary: "#FECC00" },
  Tunisia: { flag: "🇹🇳", primary: "#E70013", secondary: "#FFFFFF" },
  // Group G
  Belgium: { flag: "🇧🇪", primary: "#E30613", secondary: "#FDDA24" },
  Egypt: { flag: "🇪🇬", primary: "#CE1126", secondary: "#000000" },
  Iran: { flag: "🇮🇷", primary: "#239F40", secondary: "#DA0000" },
  "New Zealand": { flag: "🇳🇿", primary: "#00247D", secondary: "#CC142B" },
  // Group H
  Spain: { flag: "🇪🇸", primary: "#AA151B", secondary: "#F1BF00" },
  "Cabo Verde": { flag: "🇨🇻", primary: "#003893", secondary: "#CF2027" },
  Saudi: { flag: "🇸🇦", primary: "#006C35", secondary: "#FFFFFF" },
  Uruguay: { flag: "🇺🇾", primary: "#0038A8", secondary: "#FCD116" },
  // Group I
  France: { flag: "🇫🇷", primary: "#0055A4", secondary: "#EF4135" },
  Senegal: { flag: "🇸🇳", primary: "#00853F", secondary: "#FDEF42" },
  Iraq: { flag: "🇮🇶", primary: "#CE1126", secondary: "#007A3D" },
  Norway: { flag: "🇳🇴", primary: "#BA0C2F", secondary: "#00205B" },
  // Group J
  Argentina: { flag: "🇦🇷", primary: "#74ACDF", secondary: "#FFFFFF" },
  Algeria: { flag: "🇩🇿", primary: "#006233", secondary: "#D21034" },
  Austria: { flag: "🇦🇹", primary: "#ED2939", secondary: "#FFFFFF" },
  Jordan: { flag: "🇯🇴", primary: "#007A3D", secondary: "#CE1126" },
  // Group K
  Portugal: { flag: "🇵🇹", primary: "#006600", secondary: "#FF0000" },
  "DR Congo": { flag: "🇨🇩", primary: "#007FFF", secondary: "#F7D618" },
  Uzbekistan: { flag: "🇺🇿", primary: "#1EB53A", secondary: "#0099B5" },
  Colombia: { flag: "🇨🇴", primary: "#FCD116", secondary: "#003893" },
  // Group L
  England: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#CF101A", secondary: "#FFFFFF" },
  Croatia: { flag: "🇭🇷", primary: "#FF0000", secondary: "#171796" },
  Ghana: { flag: "🇬🇭", primary: "#006B3F", secondary: "#FCD116" },
  Panama: { flag: "🇵🇦", primary: "#005293", secondary: "#D21034" },
};

// Group draw — 12 groups of four.
export const GROUPS = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cabo Verde", "Saudi", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
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
