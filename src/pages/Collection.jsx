import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import {
  collectionScope,
  ownedCards,
  getBurned,
  totalPoints,
  getPoints,
  reviveCard,
  reviveCost,
  cardDisplay,
  playerCard,
  teamCard,
  seedDemoShowcase,
} from "../lib/cards.js";
import { tierMeta, PLAYERS } from "../data/players.js";
import { ALL_TEAM_NAMES } from "../data/worldcup2026.js";
import { FEATURED_MATCH_ID } from "../data/mockData.js";
import Card from "../components/cards/Card.jsx";
import { CosmeticPacks, NftMint, Editions } from "../components/common/Monetization.jsx";
import TopNav from "../components/common/TopNav.jsx";
import Footer from "../components/common/Footer.jsx";

// Lead the owned grid with our best art — the legend + rare player photo cards —
// then rares, commons, and finally the team crests.
const TIER_ORDER = { legend: 0, rare: 1, common: 2, team: 3 };

export default function Collection() {
  const { address } = useWalletIdentity();
  const scope = collectionScope({ wallet: address || "demo" });
  const [tab, setTab] = useState("owned");
  // Bumped after a revive so the collection + graveyard re-read from storage.
  const [refresh, setRefresh] = useState(0);
  const [reviveError, setReviveError] = useState("");

  // For the wallet-less demo, make sure the owned grid showcases our best art
  // (legend + rare player photo cards), not just team crests. Runs once per
  // demo scope; additive so it never touches a connected player's collection.
  useEffect(() => {
    if (!address) {
      seedDemoShowcase(scope);
      setRefresh((n) => n + 1);
    }
  }, [address, scope]);

  const owned = ownedCards(scope);
  const burned = getBurned(scope);
  const points = totalPoints(scope);
  const instinct = getPoints(scope);

  const revive = (cardKey) => {
    const res = reviveCard(scope, cardKey);
    if (res.error) return setReviveError(res.error);
    setReviveError("");
    setRefresh((n) => n + 1);
  };

  const sorted = useMemo(() => {
    return [...owned].sort((a, b) => {
      const ta = TIER_ORDER[a.tier] ?? 9;
      const tb = TIER_ORDER[b.tier] ?? 9;
      if (ta !== tb) return ta - tb;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [owned]);

  const counts = useMemo(() => {
    const c = { legend: 0, rare: 0, common: 0, team: 0 };
    owned.forEach((card) => {
      c[card.tier] = (c[card.tier] || 0) + 1;
    });
    return c;
  }, [owned]);

  return (
    <div className="min-h-screen bg-paper">
      <TopNav
        extra={
          <Link
            to={`/match/${FEATURED_MATCH_ID}`}
            className="rounded-lg border border-canvas px-3 py-1.5 text-xs font-semibold text-graphite transition hover:border-ink hover:text-ink"
          >
            Demo
          </Link>
        }
      />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow wc-text-gradient">Your collection</span>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.02em] text-ink">
              {points} card points
            </h1>
            <p className="mt-1 text-sm text-graphite">
              {owned.length} card{owned.length !== 1 ? "s" : ""} in your collection ·{" "}
              {burned.length} burned
            </p>
          </div>
          {/* Instinct Points — the skill currency you spend to revive burned cards */}
          <div className="flex items-center gap-2 rounded-xl border border-canvas bg-paper px-3.5 py-2">
            <span aria-hidden="true" className="text-lg">⚡</span>
            <div className="leading-tight">
              <div className="tnum text-xl font-black text-ink">{instinct}</div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-graphite">
                Instinct pts
              </div>
            </div>
          </div>
        </div>

        {/* tier tallies */}
        <div className="mb-6 grid grid-cols-4 gap-2">
          {["legend", "rare", "common", "team"].map((t) => {
            const meta = t === "team" ? { color: "#111827", points: 10 } : tierMeta(t);
            return (
              <div
                key={t}
                className="card-light flex flex-col items-center py-3"
                style={{ borderColor: meta.color }}
              >
                <span className="tnum text-xl font-black text-ink">{counts[t] || 0}</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-graphite">
                  {t}
                </span>
              </div>
            );
          })}
        </div>

        {/* tabs */}
        <div className="mb-4 grid w-full max-w-xs grid-cols-2 overflow-hidden rounded-lg border border-canvas">
          {["owned", "burned"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 text-[12px] font-bold uppercase tracking-wide transition ${
                tab === t ? "bg-ink text-paper" : "text-graphite hover:text-ink"
              }`}
            >
              {t === "owned" ? `Owned (${owned.length})` : `Burned (${burned.length})`}
            </button>
          ))}
        </div>

        {tab === "owned" ? (
          owned.length === 0 ? (
            <EmptyState
              title="No cards yet"
              body="Pick teams and players in onboarding, or jump into the live match to start backing cards."
            />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {sorted.map((c) => (
                <Card key={c.key} {...cardDisplay(c)} disabled />
              ))}
            </div>
          )
        ) : burned.length === 0 ? (
          <EmptyState
            title="Nothing burned"
            body="When a backed call loses, the staked card burns and lands here — spend Instinct Points to revive it."
          />
        ) : (
          <>
            <p className="mb-3 text-[13px] text-graphite">
              Spend <span className="font-bold text-ink">Instinct Points</span> to revive a
              burned card. Each card can only be revived once — a second burn is permanent.
            </p>
            {reviveError && (
              <p className="mb-3 text-xs font-semibold text-danger">{reviveError}</p>
            )}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {burned.map((c, i) => {
                const cost = reviveCost(c);
                const canRevive = c.canRevive !== false;
                const affordable = instinct >= cost;
                return (
                  <div key={`${c.key}-${i}`} className="flex flex-col gap-1.5">
                    <div className="opacity-60 grayscale">
                      <Card {...cardDisplay(c)} disabled />
                    </div>
                    {canRevive ? (
                      <button
                        onClick={() => revive(c.key)}
                        disabled={!affordable}
                        className={`rounded-md px-2 py-1.5 text-[11px] font-black uppercase tracking-wide transition ${
                          affordable
                            ? "bg-ink text-paper hover:opacity-90"
                            : "cursor-not-allowed border border-canvas text-graphite"
                        }`}
                      >
                        Revive · {cost} pts
                      </button>
                    ) : (
                      <span className="rounded-md border border-canvas px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wide text-graphite">
                        Gone for good
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* monetization surfaces (informational only) */}
        <div className="mt-10 flex flex-col gap-8">
          <Editions />
          <NftMint />
          <CosmeticPacks />
        </div>

        {/* Full catalogue — every card in the game */}
        <OurCards />

        <Footer />
      </main>
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="card-light flex flex-col items-center gap-1 px-4 py-10 text-center">
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="max-w-sm text-[13px] text-graphite">{body}</p>
    </div>
  );
}

// The full card catalogue — every player card and every national-team card in
// the game, shown for browsing. Purely a showcase; these are not owned cards.
function OurCards() {
  const players = useMemo(
    () => PLAYERS.map((p) => cardDisplay(playerCard(p.id))),
    []
  );
  const teams = useMemo(
    () => ALL_TEAM_NAMES.map((name) => cardDisplay(teamCard(name))),
    []
  );

  return (
    <section className="mt-14 border-t border-canvas pt-10">
      <span className="eyebrow wc-text-gradient">Our cards</span>
      <h2 className="mt-1 text-2xl font-black tracking-[-0.02em] text-ink">
        Every card in the game
      </h2>
      <p className="mt-1 text-sm text-graphite">
        {players.length} player cards · {teams.length} national-team cards
      </p>

      <h3 className="mb-3 mt-8 text-[12px] font-black uppercase tracking-wide text-graphite">
        Players
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {players.map((c) => (
          <Card key={c.image || c.title} {...c} disabled />
        ))}
      </div>

      <h3 className="mb-3 mt-10 text-[12px] font-black uppercase tracking-wide text-graphite">
        National teams
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {teams.map((c) => (
          <Card key={c.title} {...c} disabled />
        ))}
      </div>
    </section>
  );
}
