// Required on every screen: makes the free-to-play, no-money nature explicit.

export default function Footer({ dark = false, className = "" }) {
  return (
    <footer
      className={`mt-10 border-t pt-4 text-center text-[11px] leading-relaxed ${
        dark ? "border-border text-text-secondary" : "border-canvas text-graphite"
      } ${className}`}
    >
      Kickoff Cards is a free-to-play social card game. No real money or monetary
      value is involved.
    </footer>
  );
}
