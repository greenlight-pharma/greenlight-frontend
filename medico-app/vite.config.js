import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

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
    // [DOIS-PAINEIS] Uma entrada por painel. O Vite gera um bundle para cada
    // e extrai o que é comum (React, lib/) num chunk compartilhado — então o
    // médico não baixa o código do administrativo, nem o contrário, e o
    // código compartilhado não é duplicado.
    outDir: process.env.VITE_OUT_DIR || "dist",
    sourcemap: true,
    // Um build por painel, cada um autocontido em sua própria pasta
    // (/painel-medico e /painel-admin). Custa duplicar o chunk do React,
    // mas evita que uma pasta dependa de assets da outra — o que tornaria
    // impossível publicar, mover ou reverter um painel sem mexer no outro.
    // São dois produtos, com logins e públicos diferentes.
    rollupOptions: {
      input: fileURLToPath(
        new URL(process.env.VITE_ENTRY || "./index.html", import.meta.url)
      ),
    },
  },
  server: {
    port: 5173,
  },
});
