/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans, Inter)', 'sans-serif'],
        heading: ['var(--font-heading, Poppins)', 'sans-serif'],
      },
      colors: {
        page: 'var(--bg-page, #ffffff)',
        card: 'var(--bg-card, #f9fafb)',
        header: 'var(--bg-header, #ffffff)',
        footer: 'var(--bg-footer, #112240)',
        top: 'var(--bg-top, #ffffff)',
        mid: 'var(--bg-mid, #ffffff)',
        txtPrimary: 'var(--text-primary, #111827)',
        txtSecondary: 'var(--text-secondary, #6b7280)',
        title: 'var(--color-title, #111827)',
        subtitle: 'var(--color-subtitle, #6b7280)',
        content: 'var(--color-content, #111827)',

        brand: {
          blue: 'var(--color-brand-blue, #0052FF)',
          blueLight: '#F0F5FF',
          darkBlue: '#0A1931',
          navy: '#112240',
          slate: '#233554',
          orange: 'var(--color-brand-orange, #FF6B00)',
          orangeLight: '#FFF5EB',
          orangeHover: 'var(--color-brand-orange, #E65600)',
          gold: '#FFD700',
          green: '#10B981',
          border: '#E2E8F0',
          light: '#F8FAFC',
          dark: '#0f172a'
        }
      },
      fontSize: {
        base: ['var(--font-size-base, 1rem)', { lineHeight: '1.6' }],
        heading: ['var(--font-size-heading, 3rem)', { lineHeight: '1.3', fontWeight: '800', paddingBottom: '0.1em' }],
        subtitle: ['var(--font-size-subtitle, 1.125rem)', { lineHeight: '1.8' }],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
