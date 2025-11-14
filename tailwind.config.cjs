// tailwind.config.cjs
module.exports = {
  darkMode: "class", // we toggle class 'dark' on <html>
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
