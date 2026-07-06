// Original World Cup 2026 emblem — NOT the official FIFA mark (which is a
// registered trademark). An independent fan-project mark in the same editorial
// spirit: a bold black "26" with a gold trophy. Original geometry & type;
// legally distinct and safe to ship in a hackathon submission.

export function WorldCupMark({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="World Cup 2026"
    >
      <defs>
        <linearGradient id="wc-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE7A0" />
          <stop offset="0.45" stopColor="#FFC72C" />
          <stop offset="1" stopColor="#B8790A" />
        </linearGradient>
      </defs>

      {/* gold trophy, centred above the numerals */}
      <g fill="url(#wc-gold)">
        {/* cup bowl */}
        <path d="M25 6 h14 v7 c0 5 -3 8.5 -7 8.5 c-4 0 -7 -3.5 -7 -8.5 Z" />
        {/* handles */}
        <path d="M25 7 c-4.6 0 -4.8 8 -0.5 8.8 v-2.6 c-1.9 -0.7 -1.9 -3.6 0.5 -3.6 Z" />
        <path d="M39 7 c4.6 0 4.8 8 0.5 8.8 v-2.6 c1.9 -0.7 1.9 -3.6 -0.5 -3.6 Z" />
        {/* stem + base */}
        <rect x="30.4" y="21.5" width="3.2" height="5" />
        <path d="M26.5 26.5 h11 l2 4 h-15 Z" />
      </g>

      {/* bold black "26" */}
      <text
        x="32"
        y="58"
        textAnchor="middle"
        fontFamily='"Inter Tight", Inter, system-ui, sans-serif'
        fontWeight="900"
        fontSize="30"
        letterSpacing="-1.5"
        fill="#000000"
      >
        26
      </text>
    </svg>
  );
}

// Thin colourful top ribbon — the World Cup spectrum as a hairline banner.
export function WorldCupRibbon({ className = "" }) {
  return <div className={`wc-ribbon h-1 w-full ${className}`} aria-hidden="true" />;
}

export default WorldCupMark;
