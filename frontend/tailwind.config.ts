import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        protectdata: {
          '50': '#ffffea',
          '100': '#fffcc5',
          '200': '#fffa85',
          '300': '#fff046',
          '400': '#ffe21b',
          '500': '#fabf00',
          '600': '#e29700',
          '700': '#bb6b02',
          '800': '#985308',
          '900': '#7c430b',
          '950': '#482300',
        }
      }
    }
  },
  plugins: [],
};
export default config;
