import { defineConfig, Plugin, ResolvedConfig } from "vite";
import shopify from "vite-plugin-shopify";
import shopifyClean from "@driver-digital/vite-plugin-shopify-clean";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import pageReload from "vite-plugin-page-reload";

function copyFile(src: string, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function removeFile(dest: string) {
  if (fs.existsSync(dest)) {
    try {
      fs.unlinkSync(dest);
    } catch (err) {
      console.error(`Failed to remove file: ${dest}`);
    }
  }
}

function copyPublicToAssetsPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "vite-plugin-copy-public",
    apply: "serve", // Only runs during 'npm run dev'
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      const publicDir = path.resolve(config.root, "public");
      const assetsDir = path.resolve(config.root, "assets");

      const watcher = chokidar.watch(publicDir, {
        ignoreInitial: false,
        usePolling: true,
      });

      watcher.on("add", (filePath) => {
        const relativePath = path.relative(publicDir, filePath);
        const destPath = path.resolve(assetsDir, relativePath);
        copyFile(filePath, destPath);
      });

      watcher.on("change", (filePath) => {
        const relativePath = path.relative(publicDir, filePath);
        const destPath = path.resolve(assetsDir, relativePath);
        copyFile(filePath, destPath);
      });

      watcher.on("unlink", (filePath) => {
        const relativePath = path.relative(publicDir, filePath);
        const destPath = path.resolve(assetsDir, relativePath);
        removeFile(destPath);
      });
    },
  };
}

export default defineConfig({
  publicDir: "public",

  build: {
    manifest: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].[hash].min.js",
        chunkFileNames: "[name].[hash].min.js",
        assetFileNames: "[name].[hash].min[extname]",
      },
    },
  },

  plugins: [
    shopify({
      sourceCodeDir: "src",
      entrypointsDir: "src/entrypoints",
    }),
    shopifyClean(),
    copyPublicToAssetsPlugin(),
    tailwindcss(),
    pageReload("/tmp/theme.update", {
      delay: 2000,
    }),
  ],
});
