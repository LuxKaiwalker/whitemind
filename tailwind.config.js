/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#008080",
        accent_dark: "#004040",

        light_gray: "#f4f4f4",
        gray: "#d9d9d9",
        dark: "#333333",
      },
      backgroundImage: {
        "home-light": "url('/assets/pictures/home_background_light.jpg')",
        "home-dark": "url('/assets/pictures/home_background.jpg')",
      },
    },
  },
  plugins: [],
}