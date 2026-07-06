import { useEffect, useRef, useState } from "react";
import { rankMembers } from "../lib/league.js";
import { MOCK_TEAM_WIN_PROB } from "../data/mockData.js";
import { hasLiveAccess, txline, normalizeFixtures } from "../services/txline.js";

const TICK_MS = 4000; // demo cadence; live mode polls fixtures every 15s
const LIVE_POLL_MS = 15000;

// Baseline snapshot keyed per league, persisted so "delta today" is stable
// across reloads. Captured at draft time (once members actually hold teams).
function baselineKey(id) {
  return `mml:baseline:${id}`;
}

function getOrCreateBaseline(league) {
  if (!league || !league.drafted) return null;
  const key = baselineKey(league.id);
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (saved && league.members.every((m) => saved[m.id] != null)) return saved;
  } catch {
    /* ignore */
  }
  const probs = { ...MOCK_TEAM_WIN_PROB };
  const rows = rankMembers(league, probs);
  const map = {};
  rows.forEach((r) => (map[r.id] = r.value));
  localStorage.setItem(key, JSON.stringify(map));
  return map;
}

export function useLeaderboard(league) {
  const [probs, setProbs] = useState(() => ({ ...MOCK_TEAM_WIN_PROB }));
  const baseline = useRef(null);
  const useLive = hasLiveAccess();

  // (Re)capture the baseline once the league is drafted.
  if (league?.drafted && !baseline.current) baseline.current = getOrCreateBaseline(league);

  // Demo motion: gentle random walk so portfolios visibly breathe live.
  useEffect(() => {
    if (useLive) return;
    const id = setInterval(() => {
      setProbs((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          const drift = (Math.random() - 0.5) * 2.4;
          next[k] = Math.max(2, Math.min(99, Math.round((next[k] + drift) * 10) / 10));
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [useLive]);

  // Live mode: poll fixtures, overlay each playing team's win prob.
  useEffect(() => {
    if (!useLive) return;
    let cancelled = false;
    async function poll() {
      try {
        const fx = normalizeFixtures(await txline.matches());
        if (cancelled) return;
        setProbs((prev) => {
          const next = { ...prev };
          fx.forEach((m) => {
            if (m.odds?.home != null && m.home) next[m.home] = m.odds.home;
            if (m.odds?.away != null && m.away) next[m.away] = m.odds.away;
          });
          return next;
        });
      } catch {
        /* keep last-known probs */
      }
    }
    poll();
    const id = setInterval(poll, LIVE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [useLive]);

  const rows = league
    ? rankMembers(league, probs).map((r) => ({
        ...r,
        delta: baseline.current ? r.value - (baseline.current[r.id] ?? r.value) : 0,
      }))
    : [];

  return { rows, probs };
}
