/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0052FF',
        'brand-gold': '#D4AF37',
        'brand-darkBlue': '#020617',
        'brand-dark': '#0f172a',
        'brand-light': '#F8FAFC',
        'brand-border': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

