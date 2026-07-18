const MAP = {
  live: { label: "LIVE", cls: "bg-primary/15 text-primary border-primary/30", dot: true },
  ht: { label: "HT", cls: "bg-goal/15 text-goal border-goal/40", dot: false },
  finished: { label: "FT", cls: "bg-canvas text-graphite border-canvas", dot: false },
  upcoming: { label: "SOON", cls: "bg-canvas text-graphite border-canvas", dot: false },
};

export default function StatusBadge({ status, className = "" }) {
  const s = MAP[status] || MAP.upcoming;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${s.cls} ${className}`}
    >
      {s.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      )}
      {s.label}
    </span>
  );
}
