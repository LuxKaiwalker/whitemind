/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6347",
        accent: "#008080",
        dark: "#333333",
      },
    },
  },
  plugins: [],
}