/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        jiggle: {
          "0%, 100%": { transform: "rotate(-1.3deg) scale(0.985)" },
          "50%": { transform: "rotate(1.3deg) scale(0.985)" },
        },
      },
      animation: {
        jiggle: "jiggle 0.15s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
