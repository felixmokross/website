import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";
import typographyStyles from "./typography";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    typography: typographyStyles,
  },
  plugins: [typographyPlugin],
} satisfies Config;
