import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletIdentity } from "../wallet/useWalletIdentity.js";
import { shortWallet } from "../lib/league.js";

// New marketing landing / intro page (ported from the Stitch "Spectra Kinetic"
// export). Faithful to the design — white top nav, full-bleed dark hero, the
// spectrum-gradient KICKOFF CARDS wordmark, two CTAs and a live ticker — but
// wired to the app's real brand tokens (--wc-spectrum via .text-gradient /
// .btn-gradient), a full-bleed muted/looped YouTube video background, and
// free-to-play ticker copy (no auction / ETH / paid-drop language).

const TICKER = [
  "FREE TO PLAY · NO REAL MONEY",
  "MATCH START · USA VS MEXICO · KICKOFF SOON",
  "48 NATIONS · ONE TROPHY · WORLD CUP 2026",
  "COLLECT · BACK A CARD · SURVIVE ON LIVE DATA",
];

export default function Landing() {
  const navigate = useNavigate();
  const { setVisible } = useWalletModal();
  const { address, connected } = useWalletIdentity();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Top navigation — solid white broadsheet bar */}
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center border-b border-canvas bg-paper/95 px-5 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link
            to="/"
            className="text-lg font-black uppercase leading-none tracking-tight text-ink"
          >
            Kickoff <span className="wc-text-gradient">Cards</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/live" label="Schedule" />
            <NavLink to="/start" label="Leagues" />
            <NavLink to="/collection" label="Collection" />
          </div>
          <button
            onClick={() => (connected ? navigate("/start") : setVisible(true))}
            className="btn-gradient rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          >
            {connected ? shortWallet(address) : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="theme-dark relative flex h-screen w-full flex-col items-center justify-center overflow-hidden pt-16">
        {/* Full-bleed YouTube video background (muted, autoplay, looped). Sized to
            cover the viewport via the classic 16:9 aspect-ratio oversize trick, so
            the frame always fills the hero without letterboxing. pointer-events are
            disabled so clicks fall through to the CTAs. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <iframe
            title="World Cup background"
            src="https://www.youtube.com/embed/DQtvjqm-xxI?autoplay=1&mute=1&controls=0&loop=1&playlist=DQtvjqm-xxI&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&playsinline=1&disablekb=1"
            allow="autoplay; encrypted-media"
            frameBorder="0"
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* Dark scrim over the video for wordmark legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(8,8,16,0.72) 0%, rgba(8,8,16,0.62) 45%, rgba(8,8,16,0.9) 100%)",
          }}
        />

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-4xl px-5 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-6 text-[12px] font-bold uppercase tracking-[0.4em] text-paper/70"
          >
            World Cup · USA · Canada · Mexico · 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex flex-col items-center leading-[0.85]"
          >
            <span className="text-gradient text-[15vw] font-black uppercase tracking-tighter md:text-[128px]">
              Kickoff
            </span>
            <span className="text-gradient text-[15vw] font-black uppercase tracking-tighter md:text-[128px]">
              Cards
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mb-10 max-w-xl text-[17px] leading-relaxed text-paper/90"
          >
            Collect cards. Back one before each match.
            <br />
            <span className="font-bold text-paper">
              Survive on live World Cup data.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => navigate("/start", { state: { showHowTo: true } })}
              className="btn-gradient group inline-flex items-center gap-2 rounded-full px-9 py-4 text-[12px] font-bold uppercase tracking-[0.2em]"
            >
              Enter Kickoff Cards
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => navigate("/live")}
              className="rounded-full border-2 border-paper/40 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:border-paper"
            >
              Follow the live World Cup
            </button>
          </motion.div>
        </motion.div>

        {/* Live ticker */}
        <div className="absolute bottom-0 z-20 w-full overflow-hidden border-t border-paper/10 bg-black/30 py-3 backdrop-blur-sm">
          <div className="flex w-max animate-[kc-marquee_32s_linear_infinite] items-center gap-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] text-paper/60">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                {item}
                <span className="h-1.5 w-1.5 rounded-full wc-ribbon" />
              </span>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="text-[12px] font-bold uppercase tracking-[0.18em] text-graphite transition-colors hover:text-ink"
    >
      {label}
    </Link>
  );
}
