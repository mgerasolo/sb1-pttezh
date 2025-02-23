/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1929',
          800: '#0F2744',
          700: '#1A365D',
          600: '#2A4A7F',
        },
      },
    },
  },
  plugins: [],
};