import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminApp from "./admin/AdminApp.jsx";
import { configureSession } from "./lib/auth.js";
import { ApiError } from "./lib/api.js";
import "./styles/index.css";

// [DOIS-PAINEIS] Sessão do administrador tem chave própria — um admin logado
// não herda a sessão de médico, nem o contrário.
configureSession("adminToken", "adminData");

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
      <AdminApp />
    </QueryClientProvider>
  </React.StrictMode>
);
