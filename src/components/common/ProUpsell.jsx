// MatchMuse Pro — the product's monetization surface. It communicates a clear,
// viable model (free forever for casual group play; a low-cost seasonal pass for
// power features) without faking a checkout. "Go Pro" joins a local waitlist so
// the interaction is real but takes no payment or personal data.

import { useState } from "react";

const PRO_PRICE = "4.99 USDC";
const WAITLIST_KEY = "mml:pro:waitlist";

const FREE_FEATURES = [
  "1 active league",
  "Live team portfolios & leaderboard",
  "AI Moment Cards on goals",
  "\u201CWho scores next?\u201D predictions",
];

const PRO_FEATURES = [
  "Unlimited leagues",
  "Deep AI match breakdowns",
  "Custom league name & colours",
  "Season-long stats & streak history",
  "Priority live data refresh",
];

function useWaitlist() {
  const [joined, setJoined] = useState(() => {
    try {
      return localStorage.getItem(WAITLIST_KEY) === "1";
    } catch {
      return false;
    }
  });
  const join = () => {
    try {
      localStorage.setItem(WAITLIST_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setJoined(true);
  };
  return { joined, join };
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-3.5 w-3.5 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10.5l3.5 3.5L16 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Compact single-line upsell used inside a league view.
export function ProBanner() {
  const { joined, join } = useWaitlist();
  return (
    <div className="card-light flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow wc-text-gradient">MatchMuse Pro</p>
        <p className="mt-1 text-[13px] text-graphite">
          Unlimited leagues, deep AI breakdowns & season stats ·{" "}
          <span className="font-bold text-ink">{PRO_PRICE}/season</span>
        </p>
      </div>
      {joined ? (
        <span className="shrink-0 rounded-lg border border-canvas bg-canvas px-3 py-2 text-center text-[12px] font-bold text-ink">
          On the list ✓ · launches at kickoff
        </span>
      ) : (
        <button
          onClick={join}
          className="btn-gradient shrink-0 px-4 py-2.5 text-[13px] font-bold"
        >
          Go Pro →
        </button>
      )}
    </div>
  );
}

// Full Free-vs-Pro pricing card used on the landing page.
export default function ProUpsell() {
  const { joined, join } = useWaitlist();

  return (
    <section>
      <p className="eyebrow mb-2">Pricing</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Free tier */}
        <div className="card-light flex flex-col p-5">
          <span className="eyebrow">Free</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-[-0.02em] text-ink">0 USDC</span>
            <span className="text-[12px] text-graphite">forever</span>
          </div>
          <p className="mt-1 text-[12px] text-graphite">
            Everything a group chat needs to play.
          </p>
          <ul className="mt-4 flex flex-1 flex-col gap-2 text-[13px] text-ink">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-graphite">
                  <Check />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg border border-canvas bg-canvas/60 py-2.5 text-center text-[12px] font-bold uppercase tracking-wide text-graphite">
            Current plan
          </div>
        </div>

        {/* Pro tier */}
        <div className="wc-hero flex flex-col rounded-xl p-5 text-paper">
          <div className="flex items-center justify-between">
            <span className="eyebrow !text-paper/85">MatchMuse Pro</span>
            <span className="rounded bg-paper/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
              Season pass
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-[-0.02em] text-paper">
              {PRO_PRICE}
            </span>
            <span className="text-[12px] text-paper/80">/ season</span>
          </div>
          <p className="mt-1 text-[12px] text-paper/85">
            For the friends who take bragging rights seriously.
          </p>
          <ul className="mt-4 flex flex-1 flex-col gap-2 text-[13px] text-paper">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {joined ? (
            <div className="mt-5 rounded-lg bg-paper/20 py-2.5 text-center text-[12px] font-bold text-paper">
              You're on the list ✓ · launches at kickoff 2026
            </div>
          ) : (
            <button
              onClick={join}
              className="mt-5 w-full rounded-lg bg-paper py-3 text-sm font-black text-ink transition hover:opacity-90"
            >
              Go Pro →
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-graphite">
        Free covers casual play. Pro funds the live data feed & AI — no ads, no
        wagers, no selling your data.
      </p>
    </section>
  );
}
