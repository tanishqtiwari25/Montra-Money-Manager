export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#101b36', indigo: { DEFAULT: '#0863c7', 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#2563eb', 600: '#1d4ed8', 700: '#1457b7', 800: '#16469a', 900: '#183b76', 950: '#122849' },
        positive: '#047857', negative: '#be123c', warning: '#92400e',
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '1.25rem', control: '0.75rem' },
      boxShadow: { card: '0 2px 12px rgb(20 30 50 / 0.035)' },
      spacing: { gutter: '1.5rem', section: '2rem' },
    },
  },
  plugins: [],
};
