/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      // Base colors
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // Gray scale
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },

      // Sidecare-inspired warm palette
      coral: {
        50: '#fff5f2',
        100: '#ffe9e0',
        200: '#ffd1c1',
        300: '#ffb49d',
        400: '#ff8e6e',
        500: '#ff7f50',
        600: '#f65a2f',
        700: '#e03e15',
        800: '#b83210',
        900: '#962d14',
      },
      cream: {
        50: '#fefdfb',
        100: '#fdf9f3',
        200: '#fbf3e8',
        300: '#f8ecdb',
        400: '#f5e5cd',
        500: '#f2dfc0',
      },
      burgundy: {
        600: '#8b2332',
        700: '#721d28',
        800: '#5a1720',
      },

      // Additional colors
      red: {
        100: '#fee2e2',
        300: '#fca5a5',
        500: '#ef4444',
        700: '#b91c1c',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        500: '#3b82f6',
        600: '#2563eb',
        900: '#1e3a8a',
      },
      green: {
        100: '#dcfce7',
        300: '#86efac',
        500: '#22c55e',
        700: '#15803d',
      },
      yellow: {
        100: '#fef9c3',
        300: '#fde047',
        500: '#eab308',
        700: '#a16207',
      },
      purple: {
        100: '#f3e8ff',
        700: '#7e22ce',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Playfair Display', 'Georgia', 'serif'],
    },
    extend: {
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
