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
        ajo_blue: "#2D55FB",
        ajo_orange: "#EAAB40",
        ajo_offWhite: "#F2F0FF",
        ajo_darkBlue: "#221C3E",
      },
    },
  },
  plugins: [],
};
export default config;
