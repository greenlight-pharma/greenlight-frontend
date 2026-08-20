// URL do backend. Em produção usa o Railway; em dev dá pra apontar pra outro
// lugar com VITE_API_URL sem editar código (era hardcoded no medico.html).
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://greenlight-backend-production-35c8.up.railway.app";
