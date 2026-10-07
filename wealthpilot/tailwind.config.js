export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#101b36', indigo: { DEFAULT: '#4338ca', 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' },
        positive: '#047857', negative: '#be123c', warning: '#92400e',
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '1.25rem', control: '0.75rem' },
      boxShadow: { card: '0 8px 32px rgb(16 27 54 / 0.06)' },
      spacing: { gutter: '1.5rem', section: '2rem' },
    },
  },
  plugins: [],
};
