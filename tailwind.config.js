/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF1833',     // Imperial Red
          white: '#FDFDFF',   // Cool White
          yellow: '#FFBC00',  // Selective Yellow
          blue: '#003ECD',    // Persian Blue
          navy: '#002A62',    // Royal Blue
          // Soft slate utility tones for clean contrast
          slate: '#F1F4F9',
          border: '#D6DCE8',
          card: '#FFFFFF',
          darkcard: '#001E47',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'clay': '0 8px 16px -2px rgba(0, 0, 0, 0.08), 0 4px 6px -1px rgba(0, 0, 0, 0.04), inset 0 -3px 4px rgba(0, 0, 0, 0.12), inset 0 3px 4px rgba(255, 255, 255, 0.5)',
        'clay-red': '0 8px 20px -3px rgba(255, 24, 51, 0.35), inset 0 -3px 5px rgba(180, 10, 30, 0.3), inset 0 3px 5px rgba(255, 255, 255, 0.6)',
        'clay-blue': '0 10px 24px -4px rgba(0, 62, 205, 0.38), inset 0 -3px 5px rgba(0, 30, 120, 0.3), inset 0 3px 5px rgba(255, 255, 255, 0.5)',
        'clay-yellow': '0 8px 18px -3px rgba(255, 188, 0, 0.32), inset 0 -3px 5px rgba(180, 130, 0, 0.25), inset 0 3px 5px rgba(255, 255, 255, 0.7)',
        'glass': '0 12px 36px 0 rgba(0, 25, 70, 0.22)',
        'glass-dark': '0 16px 48px 0 rgba(0, 15, 45, 0.42)',
        'glow-red': '0 0 30px -4px rgba(255, 24, 51, 0.4)',
        'glow-yellow': '0 0 30px -4px rgba(255, 188, 0, 0.4)',
        'glow-blue': '0 0 35px -5px rgba(0, 62, 205, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}

