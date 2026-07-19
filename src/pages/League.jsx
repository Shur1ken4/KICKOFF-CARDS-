import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLeague, getMe, addDemoMembers, shortWallet } from "../lib/league.js";
import {
  collectionScope,
  totalPoints,
  ownedCards,
  seedCollection,
  playerCard,
  teamCard,
  cardDisplay,
} from "../lib/cards.js";
import { ALL_TEAM_NAMES } from "../data/worldcup2026.js";
import { PLAYERS } from "../data/players.js";
import { useFixtures } from "../hooks/useFixtures.js";
import TodaysMatches from "../components/league/TodaysMatches.jsx";
import { LeagueUpsell } from "../components/common/Monetization.jsx";
import Card from "../components/cards/Card.jsx";
import TopNav from "../components/common/TopNav.jsx";
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
      const isMe = m.id === meId;
      // The real player's league points mirror their one true collection — the
      // same scope the Collection page reads — so the leaderboard number always
      // matches what they actually own. Demo opponents (no real collection) keep
      // a league-scoped sample set purely for leaderboard signal.
      const scope = isMe
        ? collectionScope({ wallet: m.wallet || m.id })
        : collectionScope({ leagueId: id, wallet: m.wallet || m.id });
      if (!isMe) ensureDemoCollection(scope);
      return {
        id: m.id,
        name: m.name,
        isMe,
        points: totalPoints(scope),
        cards: ownedCards(scope).length,
      };
    });
    rows.sort((a, b) => b.points - a.points);
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league, id, meId]);

  // The current player's own picks for this league — drives the locked roster
  // below (their cards read as unlocked; the rest of the game is shaded/locked,
  // so the selection is visibly final and can't be re-rolled).
  const me = league ? league.members.find((m) => m.id === meId) : null;
  // Same unified collection scope as the standings row above — the locked roster
  // reflects the player's real owned cards, matching their leaderboard points.
  const myScope = collectionScope({ wallet: me?.wallet || me?.id });
  const myOwnedKeys = useMemo(
    () => new Set(ownedCards(myScope).map((c) => c.key)),
    [myScope]
  );

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
      <TopNav extra={<CopyCode code={league.id} />} />

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

        <LockedRoster ownedKeys={myOwnedKeys} />

        <div className="mt-4">
          <LeagueUpsell />
        </div>

        <Footer />
      </main>
    </div>
  );
}

// The player's locked-in roster for this league. Every card in the game is
// shown; the ones this player picked are unlocked (full colour), everything
// else is shaded with a "Locked" badge — a read-only reminder that the
// selection is final (no re-picking inside a league).
function LockedRoster({ ownedKeys }) {
  const players = useMemo(
    () =>
      PLAYERS.map((p) => playerCard(p.id))
        .filter(Boolean)
        .map((c) => ({ key: c.key, display: cardDisplay(c) })),
    []
  );
  const teams = useMemo(
    () =>
      ALL_TEAM_NAMES.map((name) => teamCard(name)).map((c) => ({
        key: c.key,
        display: cardDisplay(c),
      })),
    []
  );
  const unlocked =
    players.filter((p) => ownedKeys.has(p.key)).length +
    teams.filter((t) => ownedKeys.has(t.key)).length;

  const renderCard = ({ key, display }) => {
    const owned = ownedKeys.has(key);
    return (
      <div key={key} className="relative">
        <div className={owned ? "" : "opacity-40 grayscale"}>
          <Card {...display} disabled className="w-full" />
        </div>
        {!owned && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-ink/85 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-paper">
              Locked
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-10 border-t border-canvas pt-8">
      <span className="eyebrow wc-text-gradient">Your locked-in cards</span>
      <h2 className="mt-1 text-2xl font-black tracking-[-0.02em] text-ink">
        These are your picks for this league
      </h2>
      <p className="mt-1 text-sm text-graphite">
        {unlocked} card{unlocked !== 1 ? "s" : ""} unlocked · the rest are locked —
        your selection is final for this league.
      </p>

      <h3 className="mb-3 mt-6 text-[12px] font-black uppercase tracking-wide text-graphite">
        Players
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {players.map(renderCard)}
      </div>

      <h3 className="mb-3 mt-8 text-[12px] font-black uppercase tracking-wide text-graphite">
        National teams
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {teams.map(renderCard)}
      </div>
    </section>
  );
}
