// just to enable the vscode tailwindcss extension works
import { type Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
