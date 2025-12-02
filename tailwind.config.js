const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}", "./pages/**/*.{ts,tsx,js,jsx}", "./src/**/*.{ts,tsx,js,jsx}", "./**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins-rounded)", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        glow: "glow 4s linear infinite",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        glow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { opacity: "0.1" },
          "50%": { opacity: "0.2" },
          "100%": { opacity: "0.1" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        youbuidl: {
          primary: "#CDEB63",
          "primary-focus": "#b9e34f",
          "primary-content": "#0b0b0b",
          secondary: "#7dd3fc",
          accent: "#f472b6",
          neutral: "#111827",
          "base-100": "#ffffff",
        },
      },
      "light",
      "dark",
    ],
    darkTheme: "dark",
  },
};
