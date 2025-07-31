/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        // Thai fonts
        'heading-th': ['Sriracha', 'cursive'],
        'body-th': ['Sriracha', 'cursive'],
        // English fonts
        'heading-en': ['Fredoka One', 'cursive'],
        'body-en': ['Nunito', 'sans-serif'],
        // Japanese fonts
        'heading-ja': ['M PLUS Rounded 1c', 'sans-serif'],
        'body-ja': ['M PLUS Rounded 1c', 'sans-serif'],
        // Custom names
        'sriracha': ['Sriracha', 'cursive'],
        'fredoka': ['Fredoka One', 'cursive'],
        'nunito': ['Nunito', 'sans-serif'],
        'heading': ['Sriracha', 'Fredoka One', 'M PLUS Rounded 1c', 'cursive'],
        'body': ['Sriracha', 'Nunito', 'M PLUS Rounded 1c', 'sans-serif'],
        // Keep old names for backwards compatibility
        'kid': ['Sriracha', 'Fredoka One', 'M PLUS Rounded 1c', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
