import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLeague, getMe, addDemoMembers, shortWallet } from "../lib/league.js";
import {
  collectionScope,
  totalPoints,
  ownedCards,
  seedCollection,
} from "../lib/cards.js";
import { ALL_TEAM_NAMES } from "../data/worldcup2026.js";
import { PLAYERS } from "../data/players.js";
import { useFixtures } from "../hooks/useFixtures.js";
import TodaysMatches from "../components/league/TodaysMatches.jsx";
import { LeagueUpsell } from "../components/common/Monetization.jsx";
import Footer from "../components/common/Footer.jsx";

function CopyCode({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-2 rounded-lg border border-canvas bg-paper px-3 py-1.5 transition hover:border-ink"
      title="Copy join code"
    >
      <span className="tnum text-base font-black tracking-[0.2em] text-ink">{code}</span>
      <span className="text-[11px] font-semibold text-graphite group-hover:text-ink">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}

function pick(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

// Give demo opponents a plausible collection so the standings have signal on a
// single device (there's no backend for friends to actually join).
function ensureDemoCollection(scope) {
  if (ownedCards(scope).length) return;
  seedCollection(scope, {
    teams: pick(ALL_TEAM_NAMES, 3 + Math.floor(Math.random() * 3)),
    players: pick(PLAYERS.map((p) => p.id), 3 + Math.floor(Math.random() * 5)),
  });
}

export default function League() {
  const { id } = useParams();
  const [league, setLeague] = useState(() => getLeague(id));
  const meId = getMe(id);
  const { fixtures, source } = useFixtures();
  const isLiveFeed = source === "live";

  useEffect(() => {
    setLeague(getLeague(id));
  }, [id]);

  const standings = useMemo(() => {
    if (!league) return [];
    const rows = league.members.map((m) => {
      const scope = collectionScope({ leagueId: id, wallet: m.wallet || m.id });
      if (m.id !== meId) ensureDemoCollection(scope);
      return {
        id: m.id,
        name: m.name,
        isMe: m.id === meId,
        points: totalPoints(scope),
        cards: ownedCards(scope).length,
      };
    });
    rows.sort((a, b) => b.points - a.points);
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league, id, meId]);

  if (!league) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-bold text-ink">League not found</p>
        <p className="text-sm text-graphite">
          The code <span className="tnum font-bold text-ink">{id}</span> doesn't match any
          league on this device.
        </p>
        <Link to="/" className="btn-gradient px-4 py-2 text-sm font-bold">Back home</Link>
      </div>
    );
  }

  const addDemo = () => setLeague({ ...addDemoMembers(id, 3) });

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-canvas bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="text-sm font-black tracking-tight text-ink">
            Kickoff<span className="wc-text-gradient">Cards</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/collection" className="rounded-lg border border-canvas px-3 py-1.5 text-xs font-semibold text-graphite transition hover:text-ink">
              Collection
            </Link>
            <CopyCode code={league.id} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <div className="mb-6">
          <span className="eyebrow wc-text-gradient">World Cup 2026 · Card League</span>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.02em] text-ink">{league.name}</h1>
          <p className="mt-1 text-sm text-graphite">
            {league.members.length} member{league.members.length !== 1 ? "s" : ""} · most card points at the final wins
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Standings */}
          <div className="lg:col-span-3">
            <div className="card-light p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">Card standings</span>
                <span className="text-[11px] text-graphite">Points · card count</span>
              </div>
              <div className="flex flex-col gap-2">
                {standings.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-3"
                    style={{ borderColor: r.isMe ? "#000" : "#E5E7EB" }}
                  >
                    <span className="tnum flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-sm font-black text-ink">
                      {r.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-ink">{r.name}</span>
                        {r.isMe && (
                          <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">You</span>
                        )}
                      </div>
                      <div className="text-[11px] text-graphite">{r.cards} cards in collection</div>
                    </div>
                    <span className="tnum text-lg font-black text-ink">{r.points}</span>
                  </div>
                ))}
              </div>
              {league.members.length < 4 && (
                <button
                  onClick={addDemo}
                  className="mt-3 w-full rounded-lg border border-canvas py-2.5 text-xs font-bold text-graphite transition hover:border-ink hover:text-ink"
                >
                  + Add demo friends (try it solo)
                </button>
              )}
            </div>
          </div>

          {/* Back cards on live fixtures */}
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                  isLiveFeed
                    ? "bg-ink text-paper"
                    : "border border-canvas bg-canvas text-graphite"
                }`}
              >
                {isLiveFeed ? "Live TxLINE feed" : "Sample fixtures"}
              </span>
              <Link to="/live" className="text-[11px] font-semibold text-graphite transition hover:text-ink">
                Live hub →
              </Link>
            </div>
            <TodaysMatches fixtures={fixtures} leagueId={league.id} />
          </div>
        </div>

        <div className="mt-4">
          <LeagueUpsell />
        </div>

        <Footer />
      </main>
    </div>
  );
}
