// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: We updated "src" to "app" and added "components"
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};