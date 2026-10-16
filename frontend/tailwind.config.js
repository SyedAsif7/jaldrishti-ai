/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Authentic Environmental & Hydrological Palette
        earth: {
          bg: '#F5F2E9',         // Warm sand white
          surface: '#FFFEFA',    // Soft ivory (card surfaces)
          surfaceHover: '#F7F4EB',
          card: '#FFFEFA',
          border: '#E3DDD0',     // Subtle warm earth border
          borderDark: '#D1C9BA',
          sand: '#ECE6D8',
          stone: '#E8E2D5',
        },
        forest: {
          950: '#112823',
          900: '#17362F',
          800: '#1E433B',
          DEFAULT: '#234F46',    // Primary navigation: Deep forest green
          600: '#2C5E54',
          500: '#3D7E70',
          100: '#E4EFEA',
          50: '#F2F7F4'
        },
        water: {
          DEFAULT: '#267D9D',    // Water indicators: River blue
          dark: '#1C627C',
          light: '#4EA3C3',
          50: '#EDF6FA',
          100: '#D9EEF7'
        },
        gw: {
          DEFAULT: '#4A8B82',    // Groundwater indicators: Muted teal
          dark: '#3A7069',
          light: '#6BA79F',
          50: '#EFF7F5',
          100: '#D8EDE8'
        },
        agri: {
          DEFAULT: '#728A53',    // Agriculture indicators: Olive green
          dark: '#5A6E41',
          light: '#8FA86E',
          50: '#F4F7EF',
          100: '#E5EDD9'
        },
        ochre: {
          DEFAULT: '#C7813C',    // Drought warnings: Earth ochre
          dark: '#A66628',
          light: '#DE9954',
          50: '#FBF5EE',
          100: '#F6E6D5'
        },
        terracotta: {
          DEFAULT: '#B64D3C',    // Severe drought: Terracotta red
          dark: '#963B2C',
          light: '#CE6755',
          50: '#FAF0EE',
          100: '#F5DAD5'
        },
        charcoal: {
          DEFAULT: '#25332F',    // Primary text: Deep charcoal
          muted: '#4A5752',
          light: '#5D6B66',
          900: '#19221F'
        },
        slateGov: {
          DEFAULT: '#68736E',    // Secondary text: Slate gray
          dark: '#525B57',
          light: '#8B9691',
          border: '#D8D4CA'
        },
        // Semantic Risk mapping to the earthy palette
        risk: {
          severe: '#B64D3C',     // Terracotta red
          high: '#C7813C',       // Earth ochre
          moderate: '#DE9954',   // Warm amber / ochre
          low: '#728A53'         // Olive green
        },
        // Backward-compatibility aliases mapped to new environmental tones
        navy: {
          950: '#112823',        // Now mapped to deep forest 950
          900: '#17362F',        // Now mapped to deep forest 900
          850: '#1E433B',
          800: '#234F46',
          750: '#2C5E54',
          700: '#3D7E70',
          600: '#4A8B82',
          500: '#6BA79F'
        },
        brand: {
          teal: '#4A8B82',
          tealLight: '#6BA79F',
          cyan: '#267D9D',
          cyanLight: '#4EA3C3',
          sky: '#267D9D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(37, 51, 47, 0.06), 0 1px 2px -1px rgba(37, 51, 47, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(37, 51, 47, 0.08), 0 2px 4px -2px rgba(37, 51, 47, 0.05)',
        'dossier': '0 10px 15px -3px rgba(37, 51, 47, 0.08), 0 4px 6px -4px rgba(37, 51, 47, 0.03)',
      }
    },
  },
  plugins: [],
}
