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
      screens: { xs: '375px' },
      colors: {
        bg: 'var(--cc-bg)',
        fg: 'var(--cc-fg)',
        green: { 500: 'var(--cc-green)' },
        surface: 'var(--cc-surface)',
        brand: '#22c55e',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
