/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "cc-base": "#0d1114",
        "cc-surface": "#1a1f24",
        muted: "#3b3b3b"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
