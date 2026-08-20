import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { ApiError } from "./lib/api.js";
import "./styles/index.css";

// [CACHE] O medico.html recarregava tudo do zero a cada troca de tela e
// guardava resultado em variáveis soltas (cachedPatients, cachedMedications,
// dosesCache...), cada uma com sua regra de invalidação improvisada. Aqui
// isso é uma coisa só: a query tem chave, cache e invalidação explícita.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Sessão expirada não se resolve tentando de novo — o 401 já mandou
      // o médico pro login. Repetir só atrasa a mensagem.
      retry: (count, error) =>
        error instanceof ApiError && error.status === 401 ? false : count < 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
