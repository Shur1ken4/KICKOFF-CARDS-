import { Link } from "react-router-dom";

export function Logo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="mm-spark" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00c6c6" />
          <stop offset="0.5" stopColor="#398cff" />
          <stop offset="1" stopColor="#a162ff" />
        </linearGradient>
      </defs>
      <path
        d="M6 22 L12 10 L16 18 L20 8 L26 22"
        fill="none"
        stroke="url(#mm-spark)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

export default function Brand({ to = "/", className = "" }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="text-[15px] font-extrabold tracking-tight text-current">
        MatchMuse <span className="text-gradient">League</span>
      </span>
    </Link>
  );
}
