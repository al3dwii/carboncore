/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{ts,tsx,mdx}',
    'pages/**/*.{ts,tsx,mdx}',
    'app/**/*.{ts,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--cc-bg)',
        fg: 'var(--cc-fg)',
        green: { 500: 'var(--cc-green)' },
        surface: 'var(--cc-surface)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
