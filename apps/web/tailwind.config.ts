import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      colors: {
        aurora: "#7B4DFF",
        ink: "#101828",
        surface: "#F5F5F7"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 24, 40, 0.08)",
        card: "0 4px 20px rgba(123, 77, 255, 0.05)"
      }
    }
  },
  plugins: []
};

export default config;
