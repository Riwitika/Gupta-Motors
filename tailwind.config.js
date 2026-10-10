/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#F9F6F0',
          200: '#F1ECE1',
          300: '#E5DFCFC',
        },
        charcoal: {
          950: '#0F0F10',
          900: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8',
        },
        crimson: {
          900: '#580A0A',
          800: '#7A1010',
          700: '#9B1B1B', // Restrained motorcycle crimson
          600: '#B91C1C',
          500: '#DC2626',
          100: '#FEE2E2',
          50: '#FEF2F2',
        },
        borderBase: '#E2DDD5',
        borderMuted: '#EAE6DF',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        heading: [
          'Cinzel',
          'Georgia',
          'serif',
        ],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [],
}
