import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useLiveMatch } from "../hooks/useLiveMatch.js";
import { generateMomentInsight } from "../services/anthropic.js";
import { withAlpha, getTeam } from "../data/worldcup2026.js";
import { timeAgo } from "../lib/format.js";
import MatchHeader from "../components/match/MatchHeader.jsx";
import EventsTimeline from "../components/match/EventsTimeline.jsx";
import OddsChart from "../components/match/OddsChart.jsx";
import MomentCard from "../components/match/MomentCard.jsx";
import MatchStory from "../components/match/MatchStory.jsx";
import StakingPanel from "../components/match/StakingPanel.jsx";
import ResolveOverlay from "../components/match/ResolveOverlay.jsx";
import Footer from "../components/common/Footer.jsx";
import { HowToPlayButton } from "../components/common/HowToPlay.jsx";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import { collectionScope, seedCollection, ownedCards, resolveStakes } from "../lib/cards.js";

const SIGNIFICANT = new Set(["goal", "red"]);
const SHIFT_THRESHOLD = 8;
const MOMENT_VISIBLE_MS = 8000;

// Demo starter collection so the featured match is fully playable without going
// through onboarding first (judges can land straight on the money shot).
const DEMO_SEED = {
  teams: ["France", "Brazil", "Argentina", "England"],
  players: ["mbappe", "olise", "dembele", "vinicius", "raphinha", "messi", "bellingham", "kane"],
};

export default function Match() {
  const { matchId } = useParams();
  const [params] = useSearchParams();
  const leagueId = params.get("league");

  const match = useLiveMatch(matchId);
  const {
    meta,
    teams,
    score,
    minute,
    status,
    events = [],
    oddsSeries = [],
    source,
    isReplay,
    isFeatured,
    playing,
    restart,
    togglePlay,
    lastUpdated,
  } = match;

  const [moment, setMoment] = useState(null);
  const [newestId, setNewestId] = useState(null);
  const [pulse, setPulse] = useState(null);
  const processed = useRef(new Set());
  const momentTimer = useRef(null);

  const goals = useMemo(() => events.filter((e) => e.type === "goal"), [events]);

  // --- Collection / staking scope ------------------------------------------
  const { address: wallet } = useWalletIdentity();
  const scope = useMemo(
    () => collectionScope({ leagueId, wallet: wallet || "demo" }),
    [leagueId, wallet]
  );
  const [stakeTick, setStakeTick] = useState(0);
  const [outcomes, setOutcomes] = useState(null);
  const [showResolve, setShowResolve] = useState(false);
  const resolvedFor = useRef(null);

  // Seed a demo collection once if this scope is empty.
  useEffect(() => {
    if (ownedCards(scope).length === 0) {
      seedCollection(scope, DEMO_SEED);
      setStakeTick((t) => t + 1);
    }
  }, [scope]);

  // --- Moment Card: fire AI insight + screen pulse on significant events -----
  useEffect(() => {
    if (!events.length) return;
    const fresh = events.filter((e) => !processed.current.has(e.id));
    if (!fresh.length) return;
    fresh.forEach((e) => processed.current.add(e.id));

    const newest = fresh[fresh.length - 1];
    setNewestId(newest.id);

    const isHome = newest.team === meta?.home;
    const sorted = [...oddsSeries].sort((a, b) => a.minute - b.minute);
    let beforePt = sorted[0];
    let afterPt = sorted[0];
    for (const p of sorted) {
      if (p.minute < newest.minute) beforePt = p;
      if (p.minute <= newest.minute) afterPt = p;
    }
    const sideVal = (p) => {
      if (!p) return 0;
      return isHome ? p.home : p.away != null ? p.away : Math.max(0, 100 - p.home - (p.draw || 0));
    };
    const oddsBefore = Math.round(newest.oddsBefore != null && isHome ? newest.oddsBefore : sideVal(beforePt));
    const oddsAfter = Math.round(newest.oddsAfter != null && isHome ? newest.oddsAfter : sideVal(afterPt));
    const shift = Math.abs(oddsAfter - oddsBefore);

    const significant = SIGNIFICANT.has(newest.type) || shift >= SHIFT_THRESHOLD;
    if (!significant) return;

    const team = getTeam(newest.team);
    setPulse(team.primary);
    setTimeout(() => setPulse(null), 600);

    setMoment({ event: newest, oddsBefore, oddsAfter, insight: "", loading: true });
    generateMomentInsight(
      newest,
      { before: oddsBefore, after: oddsAfter },
      { score: `${score?.home ?? 0}-${score?.away ?? 0}` }
    ).then((insight) => {
      setMoment((m) => (m && m.event.id === newest.id ? { ...m, insight, loading: false } : m));
    });

    clearTimeout(momentTimer.current);
    momentTimer.current = setTimeout(() => {
      setMoment((m) => (m && m.event.id === newest.id ? null : m));
    }, MOMENT_VISIBLE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  useEffect(() => () => clearTimeout(momentTimer.current), []);

  // --- Resolve staked cards when the match finishes -------------------------
  useEffect(() => {
    if (status !== "finished") return;
    if (resolvedFor.current === matchId) return;
    resolvedFor.current = matchId;
    const result = {
      home: meta?.home,
      away: meta?.away,
      homeScore: score?.home ?? 0,
      awayScore: score?.away ?? 0,
      events,
    };
    const { outcomes: res } = resolveStakes(scope, matchId, result);
    setOutcomes(res);
    if (res.length) setShowResolve(true);
    setStakeTick((t) => t + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, matchId, scope]);

  // Allow re-staking when a replay restarts.
  useEffect(() => {
    if (status !== "finished") {
      resolvedFor.current = null;
      setOutcomes(null);
      setShowResolve(false);
    }
  }, [status]);

  if (!meta) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-graphite">Match not found.</p>
        <Link to="/" className="text-ink underline">Back home</Link>
      </div>
    );
  }

  const stale = source === "fallback";

  return (
    <div
      className="min-h-screen bg-paper"
      style={pulse ? { "--pulse-color": withAlpha(pulse, 0.7) } : undefined}
    >
      {showResolve && outcomes && (
        <ResolveOverlay outcomes={outcomes} onClose={() => setShowResolve(false)} />
      )}
      <div className={pulse ? "animate-pulseGlow min-h-screen" : "min-h-screen"}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-canvas bg-paper/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-base font-black uppercase tracking-tighter text-ink sm:text-lg"
              >
                Kickoff <span className="wc-text-gradient">Cards</span>
              </Link>
              <Link
                to={leagueId ? `/league/${leagueId}` : "/live"}
                className="hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold text-graphite transition hover:text-ink sm:inline-flex"
              >
                ← {leagueId ? "Back to league" : "Back to schedule"}
              </Link>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <HowToPlayButton className="hidden rounded-lg border border-[#d1c1d7] px-3 py-1.5 text-xs font-semibold text-[#4e4354] transition hover:border-[#1c1c1b] hover:text-[#1c1c1b] sm:inline-flex" />
              <Link
                to="/collection"
                className="whitespace-nowrap rounded-lg border border-canvas bg-paper px-2.5 py-1.5 text-xs font-semibold text-graphite transition hover:border-ink hover:text-ink sm:px-3"
              >
                Collection
              </Link>
              {isFeatured && (
                <>
                  <button
                    onClick={togglePlay}
                    className="whitespace-nowrap rounded-lg border border-canvas bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-ink sm:px-3"
                  >
                    {playing ? "Pause" : status === "finished" ? "Replay" : "Play"}
                  </button>
                  <button
                    onClick={restart}
                    className="whitespace-nowrap rounded-lg border border-canvas bg-paper px-2.5 py-1.5 text-xs font-semibold text-graphite transition hover:border-ink hover:text-ink sm:px-3"
                  >
                    Restart
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-16 pt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-graphite">
            {isReplay ? (
              <span className="rounded-full border border-canvas bg-paper px-2.5 py-1 font-medium uppercase tracking-wide text-graphite">
                Replay Mode
              </span>
            ) : (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium uppercase tracking-wide text-primary">
                Live Data
              </span>
            )}
            {stale && (
              <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 font-medium text-danger">
                Connection issue — showing last known data
              </span>
            )}
            <span>Updated {timeAgo(lastUpdated)}</span>
          </div>

          {moment && (
            <div className="mb-4">
              <MomentCard moment={moment} />
            </div>
          )}

          <MatchHeader meta={meta} teams={teams} score={score} minute={minute} status={status} />

          {/* Card staking — the core Kickoff Cards loop */}
          <div className="mt-4">
            <StakingPanel
              scope={scope}
              matchId={matchId}
              meta={meta}
              status={status}
              refreshKey={stakeTick}
              outcomes={outcomes}
              onStake={() => setStakeTick((t) => t + 1)}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="order-2 h-[440px] lg:order-1">
              <EventsTimeline events={events} newestId={newestId} />
            </div>
            <div className="order-1 h-[300px] lg:order-2 lg:h-[440px]">
              <OddsChart series={oddsSeries} teams={teams} meta={meta} goals={goals} />
            </div>
          </div>

          {status === "finished" && (
            <div className="mt-4">
              <MatchStory meta={meta} teams={teams} score={score} events={events} oddsSeries={oddsSeries} />
            </div>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
}
