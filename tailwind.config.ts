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
        primary: "#b5d19f",
        secondary: "#1a1c20",
        tertiary: "#141416",
        pborder: "#23252e"
      }
    },
  },
  plugins: [],
};
export default config;
