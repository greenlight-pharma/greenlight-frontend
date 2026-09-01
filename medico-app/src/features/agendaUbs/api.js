import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";

// [AGENDA-UBS] Camada de dados da agenda real. Substitui os dados fixos que
// a maquete usava — dados.js sai de cena.

export function useUnidades() {
  return useQuery({ queryKey: ["unidades"], queryFn: () => api.get("/agenda/unidades") });
}

export function useCriarUnidade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/agenda/unidades", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["unidades"] }),
  });
}

export function useVagas(unidadeId, data) {
  return useQuery({
    queryKey: ["vagas", unidadeId, data],
    queryFn: () => api.get(`/agenda/vagas?unidadeId=${unidadeId}&data=${data}`),
    enabled: Boolean(unidadeId && data),
    // A agenda de uma UBS muda enquanto está aberta na tela: a recepção
    // marca presença, o paciente cancela pelo WhatsApp. 30s de cache seria
    // tempo suficiente para duas pessoas agirem sobre a mesma vaga.
    staleTime: 5_000,
  });
}

export function useCriarVaga(unidadeId, data) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/agenda/vagas", { ...body, unidadeId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vagas", unidadeId, data] }),
  });
}

export function useMudarStatus(unidadeId, data) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`/agenda/vagas/${id}/status`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vagas", unidadeId, data] });
      // Indicadores derivam dos mesmos eventos: mudou o estado, mudou o número.
      qc.invalidateQueries({ queryKey: ["indicadores", unidadeId] });
    },
  });
}

export function useFila(unidadeId) {
  return useQuery({
    queryKey: ["fila", unidadeId],
    queryFn: () => api.get(`/agenda/fila?unidadeId=${unidadeId}`),
    enabled: Boolean(unidadeId),
  });
}

export function useEntrarNaFila(unidadeId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/agenda/fila", { ...body, unidadeId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fila", unidadeId] }),
  });
}

export function useSairDaFila(unidadeId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.del(`/agenda/fila/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fila", unidadeId] }),
  });
}

export function useIndicadores(unidadeId, de, ate) {
  return useQuery({
    queryKey: ["indicadores", unidadeId, de, ate],
    queryFn: () =>
      api.get(`/agenda/indicadores?unidadeId=${unidadeId}&de=${de}&ate=${ate}`),
    enabled: Boolean(unidadeId),
  });
}

export function useLinhaBase(unidadeId) {
  return useQuery({
    queryKey: ["linha-base", unidadeId],
    queryFn: () => api.get(`/agenda/linha-base?unidadeId=${unidadeId}`),
    enabled: Boolean(unidadeId),
  });
}

export function useRegistrarLinhaBase(unidadeId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/agenda/linha-base", { ...body, unidadeId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["linha-base", unidadeId] });
      qc.invalidateQueries({ queryKey: ["indicadores", unidadeId] });
    },
  });
}
