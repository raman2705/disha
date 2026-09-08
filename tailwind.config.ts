import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "Noto Serif Devanagari", "Noto Sans Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "Times New Roman", "serif"],
        sans: ["Inter", "Noto Sans Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "ui-sans-serif", "system-ui", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "Noto Serif Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "Mangal", "Nirmala UI", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#16233B",
        muted: "#5F6C84",
        paper: "#FBF7F1",
        primary: "#3F5BD8",
        accent: "#D97C68"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(22, 35, 59, 0.09)"
      }
    }
  },
  plugins: []
};

export default config;
