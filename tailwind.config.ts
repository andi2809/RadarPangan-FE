import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          dark: "#0F172A",
          panel: "#1E293B",
          panelBorder: "#334155",
          brand: "#0284C7",
          safe: "#16A34A",
          warning: "#CA8A04",
          critical: "#DC2626",
          down: "#0369A1",
          muted: "#64748B",
          light: "#F8FAFC",
          cardLight: "#FFFFFF",
          borderLight: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
