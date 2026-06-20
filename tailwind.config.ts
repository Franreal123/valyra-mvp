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
        // Valyra brand palette
        valyra: {
          blue: "#1f5673",
          ink: "#1f3a4a",
          lime: "#7fc242",
          paper: "#efe5d8", // kept for accent fills (token grid, badges)
          canvas: "#f7f4ee", // clean app background (replaces the gridded paper)
          line: "#e6ddcf", // hairline / subtle borders on the canvas
        },
        // CSS-variable hooks kept for theme-aware surfaces
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        // Soft, modern elevation for cards and surfaces.
        card: "0 1px 2px rgba(31,58,74,0.04), 0 12px 28px -16px rgba(31,58,74,0.18)",
        pop: "0 8px 40px -12px rgba(31,58,74,0.28)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
