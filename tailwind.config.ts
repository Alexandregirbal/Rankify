import daisyui from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        gold: "#FFD700",
        silver: "#C0C0C0",
        bronze: "#CD7F32",
        primary: "#576184",
        accent: "#00a8ff",
        neutral: "#141623",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#576184",
          "accent": "#00a8ff",
          "neutral": "#141623",
          "base-100": "#1C1E26",
          "info": "#2094f3",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#ef4444",
        },
      },
      "light",
      "dark",
    ],
  },
};
export default config;
