/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: "#8b5cf6",  // Your purple brand
          light: "#c4b5fd",
          dark: "#7c3aed",
        },
      },
    },
  },
  plugins: [],
};
