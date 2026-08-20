import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O painel é servido como arquivo ESTÁTICO (o backend é API pura, não serve
// HTML), hoje em https://www.vytalsaude.com.br/painel-medico.
//
// [BASE-ABSOLUTA] A base é o caminho ABSOLUTO da pasta, não "./".
// Com base relativa, abrir /painel-medico (sem a barra final) fazia o
// "./assets/..." resolver para a pasta PAI — /assets/... — que não existe:
// a página carregava em branco, com 404 nos scripts. Só funcionava com a
// barra no fim, e ninguém digita a barra no fim.
// Com caminho absoluto as duas formas funcionam, sem depender de redirect
// de barra no servidor (que afetaria o site inteiro, não só o painel).
//
// Para publicar em outro caminho, passe VITE_BASE=/outro/ no build.
//
// O roteamento é por hash (ver App.jsx): hospedagem estática não tem rewrite
// pra SPA, e sem hash um F5 em /pacientes daria 404.
export default defineConfig({
  base: process.env.VITE_BASE || "/painel-medico/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
