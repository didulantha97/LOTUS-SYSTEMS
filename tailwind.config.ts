import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lotus: {
          ink: "#1f2a44",
          sand: "#f6f3eb",
          jade: "#0f766e",
          clay: "#a16207"
        }
      },
      boxShadow: {
        panel: "0 8px 40px rgba(31, 42, 68, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
