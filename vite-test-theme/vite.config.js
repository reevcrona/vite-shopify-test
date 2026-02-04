import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    shopify({
      sourceCodeDir: "src",
      entrypointsDir: "src/entrypoints",
    }),
    tailwindcss(),
  ],
  build: {
    emptyOutDir: false,
  },
});
