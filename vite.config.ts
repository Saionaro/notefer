import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "./lib",
    lib: {
      name: "notefer",
      fileName: "index",
      entry: "./src/index.ts",
      formats: ["es", "cjs", "umd"],
    }
  },
  plugins: [dts()]
});
