export function timeAgo(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export const fmtPct = (n) => `${Number(n || 0).toFixed(0)}%`;
export const fmtPct1 = (n) => `${Number(n || 0).toFixed(1)}%`;

export function signed(n, digits = 1) {
  const v = Number(n || 0);
  const s = v.toFixed(digits);
  return v > 0 ? `+${s}` : s;
}

export const EVENT_ICON = {
  goal: "⚽",
  red: "🟥",
  yellow: "🟨",
  sub: "🔄",
  event: "•",
};
