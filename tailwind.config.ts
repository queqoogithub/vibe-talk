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
        pastel: {
          pink: "#FF8FA8",
          "pink-light": "#FFC2D2",
          "pink-dark": "#F06080",
          blue: "#8FC7FF",
          "blue-light": "#C4E0FF",
          "blue-dark": "#6AA8E8",
          purple: "#C49FFF",
          "purple-light": "#DDC4FF",
          "purple-dark": "#A878E8",
          green: "#8FE0A8",
          "green-light": "#C4F0D2",
          yellow: "#FFE888",
          "yellow-light": "#FFF3C0",
          cream: "#F3EBE1",
          surface: "#FBF7F2",
          text: "#4A4458",
          "text-light": "#7A7288",
          border: "#E8E0E8",
        },
      },
      fontFamily: {
        sans: [
          "Prompt",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
