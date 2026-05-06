/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './context/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        accent: '#2563eb',
        accentSoft: '#dbeafe',
        sand: '#eff6ff',
      },
      boxShadow: {
        glow: '0 18px 50px rgba(37, 99, 235, 0.16)',
      },
    },
  },
  plugins: [],
};
