import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aurora: "#7B4DFF",
        ink: "#101828"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 24, 40, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
