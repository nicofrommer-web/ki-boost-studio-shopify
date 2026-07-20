/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aura: {
          sand: "#F5F2EB",
          sandDark: "#EAE4D6",
          terracotta: "#C86D51",
          terracottaDark: "#B25A40",
          ink: "#2B2A28",
          stone: "#8C8578",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 32px -16px rgba(43, 42, 40, 0.25)",
      },
    },
  },
  plugins: [],
};
