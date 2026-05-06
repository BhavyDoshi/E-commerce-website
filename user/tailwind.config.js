/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './context/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        accent: '#d97706',
        accentSoft: '#fde68a',
        sand: '#f5efe4',
      },
      boxShadow: {
        glow: '0 18px 50px rgba(217, 119, 6, 0.18)',
      },
    },
  },
  plugins: [],
};
