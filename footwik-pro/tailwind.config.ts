import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#04210F",
          900: "#0A0E0B",
          800: "#121813",
          700: "#16301F",
          600: "#222C25",
          500: "#26302A",
          400: "#3A463D",
        },
        grass: {
          DEFAULT: "#2BD576",
          light: "#7BF0A9",
          pale: "#9FD8B4",
          dark: "#2E7A4E",
        },
        gold: {
          DEFAULT: "#F5C542",
          dark: "#6B5A1E",
          darker: "#1A1400",
        },
        loss: "#C0141C",
        ink: {
          DEFAULT: "#F1F5EF",
          muted: "#B5C1B8",
          faint: "#9AA89D",
          soft: "#8A978D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(43,213,118,0.15), 0 8px 30px -8px rgba(43,213,118,0.25)",
        goldGlow: "0 0 0 1px rgba(245,197,66,0.25), 0 8px 30px -8px rgba(245,197,66,0.35)",
      },
      backgroundImage: {
        pitch: "radial-gradient(120% 120% at 50% -10%, #16301F 0%, #04210F 55%, #0A0E0B 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
