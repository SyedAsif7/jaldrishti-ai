/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d17',
          900: '#0a1626',
          850: '#0e1f33',
          800: '#13283f',
          750: '#19334f',
          700: '#1f3e5f',
          600: '#2c537d',
          500: '#3e70a4'
        },
        brand: {
          teal: '#14b8a6',
          tealLight: '#2dd4bf',
          cyan: '#06b6d4',
          cyanLight: '#22d3ee',
          sky: '#38bdf8'
        },
        risk: {
          severe: '#ef4444',
          high: '#f97316',
          moderate: '#eab308',
          low: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
