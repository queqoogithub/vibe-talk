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
          pink: "#FFB5C2",
          "pink-light": "#FFD4DC",
          "pink-dark": "#F598A8",
          blue: "#B5D8FF",
          "blue-light": "#D4EAFF",
          "blue-dark": "#8BBDF0",
          purple: "#D4B5FF",
          "purple-light": "#E8D5FF",
          "purple-dark": "#BA98F0",
          green: "#B5E8C3",
          "green-light": "#D4F2DD",
          yellow: "#FFF3B5",
          "yellow-light": "#FFF9D4",
          cream: "#FFF5F0",
          surface: "#FFFAF8",
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
