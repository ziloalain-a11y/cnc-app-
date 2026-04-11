import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cnc: {
          red: "#8B0000",
          "red-hover": "#A50000",
          "red-dark": "#6B0000",
          dark: "#1a1a1a",
          gray: "#4a4a4a",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            a: { color: "#8B0000" },
            "a:hover": { color: "#6B0000" },
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
