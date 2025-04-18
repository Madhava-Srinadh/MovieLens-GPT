/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none", // Hide scrollbar in IE & Edge
          "scrollbar-width": "none", // Hide scrollbar in Firefox
        },
      };

      addUtilities(newUtilities, ["responsive"]);
    },
  ],
};
