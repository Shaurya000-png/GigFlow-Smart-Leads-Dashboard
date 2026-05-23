/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primaryHover)',
        surface: 'var(--color-surface)',
        surfaceElevated: 'var(--color-surface-elevated)',
        border: 'var(--color-border)',
        textMain: 'var(--color-textMain)',
        textMuted: 'var(--color-textMuted)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['Syne', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        premium: '-0.02em',
        label: '0.08em',
      },
      animation: {
        'fade-in': 'fade-in 0.55s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'text-reveal': 'text-reveal 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'subtle-glow': 'subtle-glow 4s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'text-reveal': {
          from: { opacity: '0', transform: 'translateY(6px)', letterSpacing: '0.06em' },
          to: { opacity: '1', transform: 'translateY(0)', letterSpacing: '-0.02em' },
        },
        'subtle-glow': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
