/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'skylight-primary': '#4F9CF7',
        'skylight-secondary': '#F0F9FF',
        'skylight-background': '#FFFFFF',
        'skylight-card': '#FAFBFD',
        'skylight-hover': '#F1F5F9',
      }
    },
  },
  plugins: [],
}