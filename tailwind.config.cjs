/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "pulse-sm": {
          "75%, 100%": {
            transform: "scale(1.2)",
            opacity: 0,
          },
        },
      },
      animation: {
        "pulse-sm": "pulse-sm 2s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
