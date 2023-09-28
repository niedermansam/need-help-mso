/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height'
      },
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
      },
    screens: {
      xs: "480px",
    },
    },
  },
  plugins: [],
};
