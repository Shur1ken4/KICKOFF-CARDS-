import { useEffect, useState } from "react";
import { MOCK_FIXTURES } from "../data/mockData.js";
import { hasLiveAccess, txline, normalizeFixtures } from "../services/txline.js";
import { cacheFixtures } from "../lib/fixturesCache.js";

const POLL_MS = 15000;

export function useFixtures() {
  const [fixtures, setFixtures] = useState(MOCK_FIXTURES);
  const [source, setSource] = useState(hasLiveAccess() ? "live" : "mock");

  useEffect(() => {
    if (!hasLiveAccess()) return;
    let cancelled = false;
    async function poll() {
      try {
        const fx = normalizeFixtures(await txline.matches());
        if (cancelled || !fx.length) return;
        cacheFixtures(fx);
        setFixtures(fx);
        setSource("live");
      } catch {
        if (!cancelled) setSource("fallback");
      }
    }
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Sort: live first, then upcoming, then finished.
  const order = { live: 0, ht: 0, upcoming: 1, finished: 2 };
  const sorted = [...fixtures].sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));

  return { fixtures: sorted, source };
}
