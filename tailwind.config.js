/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace']
      },
      colors: {
        dark: '#0f172a',
        primary: '#3b82f6',
        secondary: '#475569'
      }
    }
  },
  plugins: []
}
