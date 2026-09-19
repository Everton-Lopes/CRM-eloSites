/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F19',
        bg2: '#0E1420',
        card: '#111826',
        edge: 'rgba(255,255,255,0.08)',
        text: '#E5E9F0',
        muted: '#8B95A7',
        brand: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
        },
        ok: '#34D399',
        warn: '#FBBF24',
        danger: '#F87171',
      },
      borderRadius: {
        xl2: '14px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
