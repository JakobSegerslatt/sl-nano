const { guessProductionMode } = require("@ngneat/tailwind");

process.env.TAILWIND_MODE = guessProductionMode() ? "build" : "watch";

module.exports = {
  prefix: "",
  content: ["./src/**/*.{html,ts,css,scss,sass,less,styl}"],
  plugins: [require("@tailwindcss/typography")],
};
