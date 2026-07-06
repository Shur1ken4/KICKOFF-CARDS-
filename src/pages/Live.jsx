import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useFixtures } from "../hooks/useFixtures.js";
import { useTxlineAccess } from "../wallet/useTxlineAccess.js";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import LiveDataButton from "../components/common/LiveDataButton.jsx";
import TodaysMatches from "../components/league/TodaysMatches.jsx";
import Footer from "../components/common/Footer.jsx";
import { FEATURED_MATCH_ID } from "../data/mockData.js";
import { shortWallet } from "../lib/league.js";

export default function Live() {
  const { fixtures, source } = useFixtures();
  const { status } = useTxlineAccess();
  const { address, connected } = useWalletIdentity();

  const isLiveFeed = source === "live";
  const live = fixtures.filter((f) => f.status === "live" || f.status === "ht");

  return (
    <div className="min-h-screen overflow-x-clip bg-paper">
      <header className="sticky top-0 z-30 border-b border-canvas bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="text-sm font-black tracking-tight text-ink">
            Kickoff<span className="wc-text-gradient">Cards</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to={`/match/${FEATURED_MATCH_ID}`}
              className="rounded-lg border border-canvas px-3 py-1.5 text-xs font-semibold text-graphite transition hover:text-ink"
            >
              Demo match
            </Link>
            <Link
              to="/collection"
              className="rounded-lg border border-canvas px-3 py-1.5 text-xs font-semibold text-graphite transition hover:text-ink"
            >
              Collection
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="wc-hero px-5 pb-8 pt-9 text-paper">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow !text-paper/85">World Cup · USA · Canada · Mexico · 2026</span>
          <h1 className="mt-2 text-3xl font-black leading-[0.95] tracking-[-0.03em]">
            Follow the live World Cup
          </h1>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-paper/85">
            Real fixtures, scores and match events stream in from TxLINE. Open any
            match to back your cards and watch them resolve on live data.
          </p>
        </div>
      </div>

      <main className="relative mx-auto max-w-4xl px-4 pb-16 pt-6">
        {/* Host-city flight-map watermark behind the schedule */}
        <div aria-hidden="true" className="wc-map-bg">
          <img src="/wc-map-watermark.svg" alt="" />
        </div>

        <div className="relative z-10">
        {/* Activation strip */}
        <div className="card-light mb-5 flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="eyebrow">TxLINE live data · devnet</p>
              <p className="mt-1 text-[13px] text-graphite">
                {connected ? (
                  <>Signed in as <span className="tnum font-semibold text-ink">{shortWallet(address)}</span></>
                ) : (
                  "Sign up with Solana, then activate live data — free, devnet only."
                )}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                isLiveFeed
                  ? "bg-ink text-paper"
                  : "border border-canvas bg-canvas text-graphite"
              }`}
            >
              {isLiveFeed ? "Live TxLINE feed" : "Sample fixtures"}
            </span>
          </div>

          {!connected && (
            <div>
              <WalletMultiButton />
            </div>
          )}
          <LiveDataButton connected={connected} />

          {!isLiveFeed && status !== "active" && (
            <p className="text-[12px] text-graphite">
              Showing sample fixtures. Activate live data above to load real World
              Cup matches from TxLINE.
            </p>
          )}
        </div>

        {/* Live-now callout */}
        {live.length > 0 && (
          <div className="mb-4 flex items-center gap-2 text-[13px] font-bold text-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
            </span>
            {live.length} match{live.length !== 1 ? "es" : ""} live right now
          </div>
        )}

        <TodaysMatches fixtures={fixtures} />

        {fixtures.length === 0 && (
          <div className="card-light mt-4 flex flex-col items-center gap-2 px-4 py-10 text-center">
            <p className="text-sm font-bold text-ink">No fixtures scheduled right now</p>
            <p className="max-w-sm text-[13px] text-graphite">
              Check back on a match day, or try the scripted demo to see the full
              card loop.
            </p>
            <Link
              to={`/match/${FEATURED_MATCH_ID}`}
              className="mt-1 rounded-lg bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition hover:opacity-90"
            >
              Try the demo match →
            </Link>
          </div>
        )}

        <Footer />
        </div>

        {/* Flying soccer balls — overlay above the schedule */}
        <div aria-hidden="true" className="wc-map-balls">
          <img src="/wc-map-balls.svg" alt="" />
        </div>
      </main>
    </div>
  );
}
