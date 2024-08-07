import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ajo_blue: "#2D55FB",
        ajo_orange: "#EAAB40",
        ajo_purple: "rgba(24, 18, 42, 1)",
        contact_bg: "rgba(234, 171, 64, 1)",
        lighter_bg: "rgba(255,255,255,0.1)",
        ajo_offWhite: "#F2F0FF",
        ajo_darkBlue: "#221C3E",
        pendingBg: "rgba(255, 250, 241, 0.2)",
        successBg: "rgba(0, 187, 93, 0.4)",
        failedBg: "rgba(255, 62, 62, 0.2)",
        pendingText: "#CB8A14",
        successText: "#00BB5D",
        errorText: "#FF3E3E",
        purposeBg: "#F9DAA7"
      },
      backgroundImage: {
        "dropdown-icon": "url('/arrow_down.svg')", // Add this line
      },
    },
  },
  plugins: [],
};
export default config;
