/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
      },
    },
    backgroundImage: {
      // eslint-disable-next-line quotes
      "mvx-white": "url('../dharitri-white.svg')",
    },
  },
  plugins: [],
};
