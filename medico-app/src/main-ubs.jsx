import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UbsApp from "./ubs/UbsApp.jsx";
import { configureSession } from "./lib/auth.js";
import { ApiError } from "./lib/api.js";
import "./styles/index.css";

// [TRES-PAINEIS] Sessão própria. O login é o MESMO do médico (mesma tabela,
// mesmo /auth/login), mas a chave de armazenamento é separada: numa UBS o
// computador é compartilhado, e quem entra no painel da unidade não deve
// aparecer logado no prontuário completo por herdar o token da outra aba.
configureSession("ubsToken", "ubsData");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) =>
        error instanceof ApiError && error.status === 401 ? false : count < 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UbsApp />
    </QueryClientProvider>
  </React.StrictMode>
);
