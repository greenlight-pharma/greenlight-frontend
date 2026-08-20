import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O painel é servido como arquivo ESTÁTICO (o backend é API pura, não serve
// HTML). Por isso:
// - base "./": os assets são referenciados por caminho relativo, então o build
//   funciona em qualquer subpasta (GitHub Pages, S3, /medico-app/...) sem
//   reconfigurar nada.
// - o roteamento é por hash (ver App.jsx): hospedagem estática não tem rewrite
//   pra SPA, e sem hash um F5 em /pacientes daria 404.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
