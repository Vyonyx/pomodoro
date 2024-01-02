/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "salmon": "#FA6E72",
        "light-grey": "#DBE0FB",
        "purp": {
          "light": "#252955",
          DEFAULT: "#1E2240",
          "dark": "#141935",
        },
      },
    },
  },
  plugins: [],
};
