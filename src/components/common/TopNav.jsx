import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletIdentity } from "../../wallet/useWalletIdentity.js";
import { shortWallet } from "../../lib/league.js";

// Shared top navigation for the in-app pages (Schedule / Leagues / Collection).
// Uses the same "dock" header design as the onboarding flow so the banner looks
// identical across the whole app: a glass white bar, a gradient-underline active
// link, a notification bell, and the spectrum wallet pill. `extra` renders any
// page-specific control (e.g. a league invite-code button) just left of the bell.

// World Cup 2026 brand gradient (--wc-spectrum): Purple → Pink → Orange → Green.
const SPECTRUM =
  "linear-gradient(100deg, #a435f0, #e0347a, #ff5a3c, #25c46a, #b6e84a)";

const LINKS = [
  { to: "/live", label: "Schedule" },
  // "Leagues" points at onboarding (/start) but should also stay highlighted on
  // an actual league page (/league/:id), which is reached after creating/joining.
  { to: "/start", label: "Leagues", match: (p) => p.startsWith("/league") },
  { to: "/collection", label: "Collection" },
];

// Both states carry an identical box (border-b-2 + pb-1) so the underline never
// changes an item's height/vertical position. The `nav-dock-link` class reserves
// the bold width via a hidden ::before (see index.css) so switching font-weight
// doesn't reflow neighbouring links.
function linkClass({ isActive }) {
  const base =
    "nav-dock-link border-b-2 pb-1 text-center text-[12px] uppercase tracking-[0.2em] transition-colors";
  return isActive
    ? `${base} border-[#6700a1] font-bold text-[#6700a1]`
    : `${base} border-transparent font-medium text-[#4e4354] hover:text-[#6700a1]`;
}

export default function TopNav({ extra = null }) {
  const { setVisible } = useWalletModal();
  const { address, connected } = useWalletIdentity();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const openWallet = () => {
    setVisible(true);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d1c1d7] bg-white/90 backdrop-blur-md">
      {/* 3-column grid (edges are equal 1fr) so the nav sits dead-centre on every
          page regardless of how wide the logo or the right-side controls are —
          the nav never shifts when navigating between pages. */}
      <div className="mx-auto grid h-20 w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:gap-4 md:px-10">
        <Link
          to="/"
          className="shrink-0 justify-self-start text-lg font-black uppercase tracking-tighter text-[#1c1c1b] md:text-2xl"
        >
          Kickoff <span className="wc-text-gradient">Cards</span>
        </Link>

        <nav className="hidden items-center gap-8 justify-self-center md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/start"}
              data-label={l.label}
              className={({ isActive }) =>
                linkClass({ isActive: isActive || (l.match ? l.match(pathname) : false) })
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="col-start-3 flex shrink-0 items-center justify-self-end gap-2 md:gap-4">
          {/* Desktop controls — hidden on phones to keep the bar from overflowing */}
          <div className="hidden items-center gap-2 md:flex md:gap-4">
            {extra}
            <BellIcon />
            <button
              onClick={() => setVisible(true)}
              style={{ background: SPECTRUM }}
              className="tnum rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#6700a1]/20 transition-all hover:opacity-90 active:scale-95 md:px-6 md:tracking-[0.2em]"
            >
              {connected ? shortWallet(address) : "Connect Wallet"}
            </button>
          </div>

          {/* Mobile hamburger — opens the nav + controls in a dropdown */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1c1c1b] transition-colors hover:bg-[#f5f0f7] md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="border-t border-[#d1c1d7] bg-white md:hidden">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-4">
            <nav className="flex flex-col gap-1">
              {LINKS.map((l) => {
                const active =
                  pathname === l.to || (l.match ? l.match(pathname) : false);
                return (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/start"}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-[13px] uppercase tracking-[0.15em] transition-colors ${
                      active
                        ? "bg-[#f5f0f7] font-bold text-[#6700a1]"
                        : "font-medium text-[#4e4354] hover:bg-[#f5f0f7]"
                    }`}
                  >
                    {l.label}
                  </NavLink>
                );
              })}
            </nav>

            {extra && <div className="flex flex-wrap gap-2">{extra}</div>}

            <button
              onClick={openWallet}
              style={{ background: SPECTRUM }}
              className="tnum w-full rounded-full px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#6700a1]/20 transition-all active:scale-95"
            >
              {connected ? shortWallet(address) : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon({ open }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M3 12h18" />
          <path d="M3 6h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-5 w-5 cursor-pointer text-[#4e4354] transition-colors hover:text-[#6700a1]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
