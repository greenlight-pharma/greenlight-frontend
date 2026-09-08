import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SamuApp from "./samu/SamuApp.jsx";
import { configureSession } from "./lib/auth.js";
import "./styles/index.css";

// Sessão própria: o token do SAMU tem role "samu" e não abre nada do Vytal,
// mas a chave separada evita que um painel herde o token do outro numa
// máquina compartilhada.
configureSession("samuToken", "samuData");

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SamuApp />
    </QueryClientProvider>
  </React.StrictMode>
);
