// "How to play" explainer — a lightweight modal that walks a new player through
// the core Kickoff Cards loop in four beats. Portaled to <body> so it's always
// centred on the viewport (triggers often live inside a backdrop-blurred sticky
// header, which would otherwise become the fixed containing block and clip the
// modal). Closes on backdrop click or Escape.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const SPECTRUM =
  "linear-gradient(100deg, #a435f0, #e0347a, #ff5a3c, #25c46a, #b6e84a)";

export function HowToPlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How to play Kickoff Cards"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#d1c1d7] bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6700a1]">
              How to play
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.02em] text-[#1c1c1b]">
              Collect · Back · Resolve
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full border border-[#d1c1d7] px-3 py-1 text-sm font-bold text-[#4e4354] transition hover:bg-[#f5f0f7] hover:text-[#1c1c1b]"
          >
            Esc
          </button>
        </div>

        <video
          className="mb-5 aspect-square w-full rounded-xl border border-[#d1c1d7] bg-[#0b0b12] object-cover"
          src="/howto.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls
        />

        <p className="text-center text-[11px] leading-relaxed text-[#4e4354]">
          Kickoff Cards is a free-to-play social card game. No real money or
          monetary value is involved.
        </p>

        <button
          onClick={onClose}
          style={{ background: SPECTRUM }}
          className="mt-4 w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all active:scale-95"
        >
          Got it — let's play →
        </button>
      </div>
    </div>,
    document.body
  );
}

// Drop-in trigger button. Manages its own open state so callers just render it.
export function HowToPlayButton({ className = "", label = "How to play", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ||
          "rounded-lg border border-[#d1c1d7] px-3 py-1.5 text-xs font-semibold text-[#4e4354] transition hover:border-[#1c1c1b] hover:text-[#1c1c1b]"
        }
      >
        {label}
      </button>
      <HowToPlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
