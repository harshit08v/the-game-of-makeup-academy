import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FAF8F5",
          100: "#F5F0E8",
          200: "#EBE3D5",
          300: "#DFD4C0",
          400: "#CBBBA1",
          500: "#B8A384",
          DEFAULT: "#FAF8F5",
        },
        champagne: {
          50: "#FDFBF7",
          100: "#FAF4EC",
          200: "#F4E8D7",
          300: "#EAD6BD",
          400: "#D8BC95",
          500: "#C5A16F",
          600: "#B08A56",
          700: "#926E40",
          800: "#765835",
          900: "#5D452B",
          DEFAULT: "#C5A16F",
        },
        charcoal: {
          50: "#F6F6F6",
          100: "#E7E7E7",
          200: "#D1D1D1",
          300: "#B0B0B0",
          400: "#888888",
          500: "#636363",
          600: "#4B4B4B",
          700: "#383838",
          800: "#242322",
          900: "#171615",
          950: "#0F0E0D",
          DEFAULT: "#171615",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 4px 25px -4px rgba(23, 22, 21, 0.05), 0 2px 8px -2px rgba(23, 22, 21, 0.03)",
        "luxury-lg": "0 10px 40px -10px rgba(23, 22, 21, 0.08), 0 4px 12px -2px rgba(23, 22, 21, 0.04)",
        "gold-glow": "0 0 20px -3px rgba(197, 161, 111, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
