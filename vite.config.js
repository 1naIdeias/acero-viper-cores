import { defineConfig } from "vite";

/* Gera um build que também abre com duplo clique (file://):
   bundle em formato clássico (iife), sem type="module". */
const classicScript = () => ({
  name: "classic-script",
  enforce: "post",
  transformIndexHtml(html) {
    return html
      .replace(/<script type="module" crossorigin/g, "<script defer")
      .replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"');
  },
});

export default defineConfig({
  base: "./",
  server: { host: true, port: 5173, open: true },
  preview: { host: true, port: 4173 },
  plugins: [classicScript()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: { format: "iife", inlineDynamicImports: true },
    },
  },
});
