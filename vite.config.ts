import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./lib",
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs"],
      fileName: "index"
    }
  },
});
