import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useFixtures } from "../hooks/useFixtures.js";
import { useTxlineAccess } from "../wallet/useTxlineAccess.js";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import LiveDataButton from "../components/common/LiveDataButton.jsx";
import TodaysMatches from "../components/league/TodaysMatches.jsx";
import TopNav from "../components/common/TopNav.jsx";
import Stepper from "../components/common/Stepper.jsx";
import { HowToPlayButton } from "../components/common/HowToPlay.jsx";
import Footer from "../components/common/Footer.jsx";
import { FEATURED_MATCH_ID, MOCK_FIXTURES } from "../data/mockData.js";
import { shortWallet } from "../lib/league.js";

// The scripted France–Brazil replay is always pinned as the featured demo, so
// judges can open the full card loop even off match-day. The real World Cup
// fixtures (live / upcoming / full-time) stream in below it from TxLINE.
const DEMO_FIXTURE = MOCK_FIXTURES.find((f) => f.id === FEATURED_MATCH_ID);

export default function Live() {
  const { fixtures, source } = useFixtures();
  const { status } = useTxlineAccess();
  const { address, connected } = useWalletIdentity();

  const isLiveFeed = source === "live";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-paper">
      {/* Live stadium photo as the page backdrop (replaces the flat white) —
          shown clean, no scrim. Content sits on opaque cards above it. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/stadiums/arena.png)" }}
        />
      </div>

      <div className="relative z-10">
      <TopNav
        width="max-w-4xl"
        extra={
          <>
            <HowToPlayButton />
            <Link
              to={`/match/${FEATURED_MATCH_ID}`}
              className="rounded-lg border border-canvas px-3 py-1.5 text-xs font-semibold text-graphite transition hover:border-ink hover:text-ink"
            >
              Demo
            </Link>
          </>
        }
      />

      {/* Shared 4-step spine — this hub is step 3: "Follow a live match" */}
      <div className="bg-paper">
        <Stepper current={3} />
      </div>

      {/* Hero */}
      <div className="wc-hero px-5 pb-5 pt-4 text-paper sm:pb-8 sm:pt-9">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow !text-paper/85">World Cup · USA · Canada · Mexico · 2026</span>
          <h1 className="mt-1.5 text-[22px] font-black leading-[0.95] tracking-[-0.03em] sm:mt-2 sm:text-3xl">
            Follow the live World Cup
          </h1>
          <p className="mt-2 max-w-lg text-[12.5px] leading-snug text-paper/85 sm:mt-3 sm:text-[14px] sm:leading-relaxed">
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

        <TodaysMatches fixtures={fixtures} heroFixture={DEMO_FIXTURE} />

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

        <div className="mt-10 rounded-xl border border-canvas bg-paper/85 px-4 py-3 backdrop-blur-sm">
          <Footer className="!mt-0 !border-t-0 !pt-0" />
        </div>
        </div>

        {/* Flying soccer balls — overlay above the schedule */}
        <div aria-hidden="true" className="wc-map-balls">
          <img src="/wc-map-balls.svg" alt="" />
        </div>
      </main>
      </div>
    </div>
  );
}
