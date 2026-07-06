// Small localStorage cache of fixture metadata (id -> team names), written by
// useFixtures after a live TxLINE poll. The live match view reads it to seed the
// match header immediately — the /scores snapshot carries no team names, so
// without this a real fixture would render blank names / "Match not found".

const KEY = "kc:fixtures";

function safeParse(str, fallback) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

export function cacheFixtures(list = []) {
  const map = safeParse(localStorage.getItem(KEY), {});
  list.forEach((f) => {
    if (!f?.id) return;
    map[f.id] = {
      id: f.id,
      home: f.home || "",
      away: f.away || "",
      competition: f.competition || "World Cup",
    };
  });
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable */
  }
}

export function getCachedFixture(id) {
  if (!id) return null;
  return safeParse(localStorage.getItem(KEY), {})[id] || null;
}
