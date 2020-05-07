import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  output: {
    name: "NanoNotif",
    file: "./lib/index.js",
    format: "umd",
  },
  plugins: [typescript(), terser()],
};
