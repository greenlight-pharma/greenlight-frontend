import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../lib/api.js";

export function useMinhaAssinatura() {
  return useQuery({
    queryKey: ["assinatura"],
    queryFn: () => api.get("/minha-assinatura"),
  });
}

export function useCriarConta() {
  return useMutation({
    mutationFn: (body) => api.post("/auth/signup", body, { auth: false }),
  });
}

export const reais = (centavos) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
