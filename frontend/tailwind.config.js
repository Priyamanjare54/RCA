export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rcaBlue: "#003B73",       // royal navy blue (primary)
        rcaBlueLight: "#0057A0",  // brighter royal blue
        rcaGold: "#D4AF37",       // gold
        rcaGoldLight: "#F4D684",  // soft gold for accents
        rcaDark: "#0A0A0A",       // deep background
      },
      backgroundImage: {
        heroGradient:
          "linear-gradient(180deg, rgba(0,59,115,0.75), rgba(10,10,10,0.9))",
      },
    },
  },
};
