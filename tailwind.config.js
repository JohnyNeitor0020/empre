/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    // No necesitamos 'tailwindcss-animate' aquí
    // porque ya pusimos sus @keyframes en el index.css
  ],
}