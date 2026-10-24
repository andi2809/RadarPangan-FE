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
          brand: "#67151D",
          safe: "#4B9D73",
          warning: "#E69B39",
          critical: "#E85B4F",
          down: "#0369A1",
          muted: "#5C5B52",
          light: "#F8F4E9",
          paper: "#FFFDF7",
          paperMuted: "#F0EBDE",
          ink: "#1E221F",
          line: "#DED8C8",
          maroon: "#67151D",
          maroonDark: "#4C0D15",
          maroonSoft: "#F4E8E9",
          cardLight: "#FFFFFF",
          borderLight: "#DED8C8",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
