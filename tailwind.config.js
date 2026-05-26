/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070809",
          900: "#0c0e10",
          800: "#15181c",
          700: "#1e2229",
          600: "#2a2f38",
          500: "#3a414c",
          400: "#5b6371",
          300: "#8a93a3",
          200: "#b8c0cc",
          100: "#e6e9ef",
        },
        accent: {
          lime: "#c5f02d",
          cyan: "#22e3d8",
          amber: "#ffb547",
          rose: "#ff5470",
          violet: "#a78bfa",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(197, 240, 45, 0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04), 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
