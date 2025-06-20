const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-inter)", ...fontFamily.sans] },
      colors: { brand: { DEFAULT: "#28A745", dark: "#1f7e38" } }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
