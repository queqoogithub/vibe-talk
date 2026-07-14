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
          pink: "#B388FF",
          "pink-light": "#DDC8FF",
          "pink-dark": "#9B6BFF",
          blue: "#A8B8E8",
          "blue-light": "#D8E0F4",
          "blue-dark": "#8898D0",
          purple: "#C9A8FF",
          "purple-light": "#EDE4FF",
          "purple-dark": "#A878D8",
          green: "#B0C8E0",
          "green-light": "#D8E4F2",
          yellow: "#E4C8E0",
          "yellow-light": "#F4E0F0",
          cream: "#F5F0FF",
          surface: "#FDFAFF",
          text: "#4A3A5C",
          "text-light": "#7A6A8C",
          border: "#E0D8F0",
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
