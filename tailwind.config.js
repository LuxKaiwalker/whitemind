/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        wBackground: "#ffffff",
        wHeader: "#212121",

        dBackground: "#1f1f1f",
        dHeader: "#101010",

        accent: "#337ab7",
        accent_dark: "#006060",
      },
      backgroundImage: {
        "home-light": "url('/assets/pictures/home_background_light.jpg')",
        "home-dark": "url('/assets/pictures/home_background.jpg')",
      },
    },
  },
  plugins: [],
}