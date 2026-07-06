import { useEffect, useRef, useState, useCallback } from "react";
import {
  txline,
  hasLiveAccess,
  normalizeOdds,
  normalizeScore,
  normalizeEvents,
} from "../services/txline";
import {
  FEATURED_MATCH_ID,
  MOCK_ODDS_TIMELINE,
  MOCK_EVENTS,
  MOCK_MATCH_META,
  MOCK_FIXTURES,
} from "../data/mockData";
import { getTeam } from "../data/teams";
import { getCachedFixture } from "../lib/fixturesCache.js";

const POLL_MS = 15000;
// Replay advances one match-minute every REPLAY_TICK_MS (≈45s for a full match).
const REPLAY_TICK_MS = 500;

const isMockId = (id) => typeof id === "string" && id.startsWith("mock-");

function homeProbAt(minute) {
  // Interpolate the home win prob from the mock odds timeline.
  const pts = MOCK_ODDS_TIMELINE;
  let prev = pts[0];
  for (const p of pts) {
    if (p.minute <= minute) prev = p;
    else break;
  }
  return prev.home;
}

function buildReplayState(minute, status) {
  const oddsSeries = MOCK_ODDS_TIMELINE.filter((p) => p.minute <= minute);
  const currentOdds =
    oddsSeries[oddsSeries.length - 1] || MOCK_ODDS_TIMELINE[0];

  const revealed = MOCK_EVENTS.filter((e) => e.minute <= minute);
  const lastGoal = [...revealed].reverse().find((e) => e.type === "goal");
  const score = lastGoal
    ? parseScore(lastGoal.score)
    : { home: 0, away: 0 };

  return {
    meta: {
      id: MOCK_MATCH_META.id,
      home: MOCK_MATCH_META.home,
      away: MOCK_MATCH_META.away,
      competition: MOCK_MATCH_META.competition,
    },
    status,
    minute: status === "finished" ? 90 : minute,
    score,
    events: revealed,
    oddsSeries,
    currentOdds: {
      home: currentOdds.home,
      draw: currentOdds.draw,
      away: currentOdds.away,
    },
    lastUpdated: new Date(),
    source: "replay",
    error: null,
  };
}

function parseScore(str) {
  if (!str) return { home: 0, away: 0 };
  const [h, a] = str.split(/[–-]/).map((s) => Number(s.trim()));
  return { home: h || 0, away: a || 0 };
}

function fixtureSnapshot(matchId) {
  const fx = MOCK_FIXTURES.find((f) => f.id === matchId);
  if (!fx) return null;
  return {
    meta: { id: fx.id, home: fx.home, away: fx.away, competition: "World Cup" },
    status: fx.status,
    minute: fx.minute,
    score: fx.score,
    events: [],
    oddsSeries: [{ minute: fx.minute, ...fx.odds }],
    currentOdds: fx.odds,
    lastUpdated: new Date(),
    source: "replay",
    error: null,
  };
}

// Initial state for a real (live) fixture: seed team names from the fixtures
// cache so the header renders immediately (the /scores snapshot has no names),
// avoiding a "Match not found" flash before the first poll returns.
function liveInitialState(matchId) {
  const cached = getCachedFixture(matchId);
  return {
    meta: {
      id: matchId,
      home: cached?.home || "",
      away: cached?.away || "",
      competition: cached?.competition || "World Cup",
    },
    status: "upcoming",
    minute: 0,
    score: { home: 0, away: 0 },
    events: [],
    oddsSeries: [],
    currentOdds: { home: 0, draw: 0, away: 0 },
    lastUpdated: new Date(),
    source: "loading",
    error: null,
  };
}

export function useLiveMatch(matchId, { autoStart = true } = {}) {
  const useReplay = !hasLiveAccess() || isMockId(matchId);
  const isFeatured = matchId === FEATURED_MATCH_ID || (!matchId && useReplay);

  const [state, setState] = useState(() => {
    if (isFeatured) return buildReplayState(0, "upcoming");
    if (useReplay) return fixtureSnapshot(matchId) || buildReplayState(0, "live");
    return liveInitialState(matchId);
  });
  const [replayMinute, setReplayMinute] = useState(0);
  const [playing, setPlaying] = useState(autoStart && isFeatured);
  const lastKnown = useRef(state);

  // --- Replay engine (featured match) ---------------------------------------
  useEffect(() => {
    if (!isFeatured || !playing) return;
    const id = setInterval(() => {
      setReplayMinute((m) => {
        const next = m + 1;
        if (next >= 90) {
          clearInterval(id);
          setPlaying(false);
          return 90;
        }
        return next;
      });
    }, REPLAY_TICK_MS);
    return () => clearInterval(id);
  }, [isFeatured, playing]);

  useEffect(() => {
    if (!isFeatured) return;
    const status =
      replayMinute >= 90 ? "finished" : replayMinute === 0 && !playing ? "upcoming" : "live";
    const s = buildReplayState(replayMinute, status);
    lastKnown.current = s;
    setState(s);
  }, [isFeatured, replayMinute, playing]);

  // --- Live polling (real matches) ------------------------------------------
  useEffect(() => {
    if (useReplay || !matchId) return;
    let cancelled = false;

    async function poll() {
      try {
        const [scoreRaw, oddsRaw, eventsRaw] = await Promise.all([
          txline.score(matchId),
          txline.odds(matchId),
          txline.events(matchId),
        ]);
        if (cancelled) return;
        const score = normalizeScore(scoreRaw);
        const odds = normalizeOdds(oddsRaw) || { home: 0, draw: 0, away: 0 };
        const events = normalizeEvents(eventsRaw).sort((a, b) => a.minute - b.minute);

        setState((prev) => {
          const prevSeries = prev?.oddsSeries || [];
          const lastPt = prevSeries[prevSeries.length - 1];
          const oddsSeries =
            lastPt && lastPt.minute === score.minute
              ? prevSeries
              : [...prevSeries, { minute: score.minute, ...odds }];
          const cached = getCachedFixture(matchId);
          const next = {
            meta: {
              id: matchId,
              home: prev?.meta?.home || cached?.home || "",
              away: prev?.meta?.away || cached?.away || "",
              competition: prev?.meta?.competition || cached?.competition || "World Cup",
            },
            status: score.status,
            minute: score.minute,
            score: { home: score.home, away: score.away },
            events,
            oddsSeries,
            currentOdds: odds,
            lastUpdated: new Date(),
            source: "live",
            error: null,
          };
          lastKnown.current = next;
          return next;
        });
      } catch (err) {
        if (cancelled) return;
        // Graceful degradation: keep last-known data, flag the error + staleness.
        setState((prev) => {
          const base = prev || lastKnown.current || fixtureSnapshot(matchId);
          if (!base) return prev;
          return { ...base, source: "fallback", error: err.message };
        });
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [matchId, useReplay]);

  const restart = useCallback(() => {
    setReplayMinute(0);
    setPlaying(true);
  }, []);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const teams = state
    ? { home: getTeam(state.meta.home), away: getTeam(state.meta.away) }
    : { home: getTeam(), away: getTeam() };

  return {
    ...(state || {}),
    teams,
    isLive: state?.status === "live",
    isReplay: useReplay,
    isFeatured,
    playing,
    restart,
    togglePlay,
    homeProbAt,
  };
}
