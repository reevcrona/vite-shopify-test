import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import shopifyClean from "@driver-digital/vite-plugin-shopify-clean";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    shopify({
      sourceCodeDir: "src",
      entrypointsDir: "src/entrypoints",
    }),
    shopifyClean(),
    tailwindcss(),
  ],
  build: {
    emptyOutDir: false,
  },
});
