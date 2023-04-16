import { defineConfig } from "vite";

export default defineConfig({
  root: "./site",
  base: "/notefer",
  build: {
    outDir: "../site-build",
  },
});
