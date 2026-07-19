import { useEffect, useState } from "react";
import { MOCK_FIXTURES } from "../data/mockData.js";
import { hasLiveAccess, subscribeAuth, txline, normalizeFixtures } from "../services/txline.js";
import { cacheFixtures } from "../lib/fixturesCache.js";

const POLL_MS = 15000;

export function useFixtures() {
  const [fixtures, setFixtures] = useState(MOCK_FIXTURES);
  const [source, setSource] = useState(hasLiveAccess() ? "live" : "mock");
  // Tracks live access so the polling effect re-runs the instant a wallet
  // finishes activating — no page reload needed.
  const [access, setAccess] = useState(hasLiveAccess());

  // Re-check access whenever the TxLINE auth state changes.
  useEffect(() => subscribeAuth(setAccess), []);

  useEffect(() => {
    if (!access) return;
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
  }, [access]);

  // Sort: live first, then upcoming, then finished; soonest kickoff first within
  // a group so the earliest fixture of a pairing is the one we keep below.
  const order = { live: 0, ht: 0, upcoming: 1, finished: 2 };
  const kickoffMs = (f) => {
    const t = f.kickoff ? new Date(f.kickoff).getTime() : NaN;
    return Number.isNaN(t) ? 0 : t;
  };
  const sorted = [...fixtures].sort((a, b) => {
    const s = (order[a.status] ?? 3) - (order[b.status] ?? 3);
    return s !== 0 ? s : kickoffMs(a) - kickoffMs(b);
  });

  // De-duplicate repeated fixtures for the same pairing. The TxLINE sample feed
  // can list the same two teams multiple times (different FixtureIds/kickoffs),
  // which surfaced as duplicate rows. Keep the first — i.e. the most-live /
  // soonest — occurrence per home→away pair.
  const seen = new Set();
  const deduped = sorted.filter((f) => {
    const key = `${f.home}\u0000${f.away}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { fixtures: deduped, source };
}
