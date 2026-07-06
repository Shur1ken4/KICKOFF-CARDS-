/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme — retained for the Live Match View ("market crash" energy).
        bg: "#080810",
        surface: "#11111C",
        "surface-2": "#161624",
        border: "#1E1E30",
        primary: "#25C46A",
        goal: "#FFB800",
        danger: "#FF4444",
        "text-primary": "#F2F2F2",
        "text-secondary": "#8888AA",
        gold: "#FFD700",
        silver: "#C0C0C0",
        bronze: "#CD7F32",
        // a16z speedrun light theme — Home / League / chrome (editorial broadsheet).
        ink: "#000000",
        paper: "#FFFFFF",
        canvas: "#E5E7EB",
        sand: "#E2DFD8",
        graphite: "#5E5D5C",
        // World Cup 2026 brand palette — bright, vivid tones.
        wc: {
          purple: "#A435F0",
          maroon: "#E0347A",
          red: "#FF5A3C",
          green: "#25C46A",
          lime: "#B6E84A",
        },
        // Kickoff Cards collectible tiers.
        tier: {
          legend: "#E4B23C",
          rare: "#7C6CF0",
          common: "#9CA3AF",
        },
      },
      borderRadius: {
        card: "16px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        // messinaSansCondensed substitute for uppercase eyebrow labels.
        condensed: ['"Inter Tight"', "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInTop: {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%": { boxShadow: "0 0 0 0 var(--pulse-color, rgba(37,196,106,0.7))" },
          "100%": { boxShadow: "0 0 0 60px rgba(0,0,0,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        slideDown: "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        slideInTop: "slideInTop 0.3s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
        pulseGlow: "pulseGlow 0.6s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
