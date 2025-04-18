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
          'dark-base': "#020817",
          'dark-alt': "#1E293B",
          'night-900': '#020817',
          'night-800': '#0f172a',
          'night-700': '#1e293b',
          'night-600': '#334155',
        },
        wado: {
          dark: "#020817",     // Card background
          surface: "#1E293B",  // Panels, inputs
          border: "#1E293B",   // Consistent border
          accent: "#3b82f6",   // Blue
        },
      },
    },
  },
  plugins: [],
};
