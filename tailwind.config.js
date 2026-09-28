/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#F7F1E8',
          ivory: '#FFFDF8',
          burgundy: '#6E1F2A',
          'burgundy-dark': '#4A1420',
          'burgundy-secondary': '#8E3A46',
          'burgundy-soft': '#E8CDD0',
          espresso: '#24191A',
          'warm-gray': '#756A68',
          beige: '#E5D9CC',
          olive: '#66745A',
          ochre: '#B68132',
          red: '#A63D40',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '10px',
        'lg': '12px',
        'card': '16px',
        'container': '20px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(36, 25, 26, 0.04)',
        'card': '0 4px 12px rgba(36, 25, 26, 0.03)',
      },
    },
  },
  plugins: [],
};
