import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";

// [MEDICOES] Pressão e glicemia informadas pelo paciente (ou pela equipe).

export const TIPO = { PRESSAO: "pressao", GLICEMIA: "glicemia" };
export const ROTULO = { pressao: "Pressão", glicemia: "Glicemia" };
export const EXEMPLO = { pressao: "12 por 8 ou 120/80", glicemia: "110" };

const chave = (phone) => ["paciente", phone, "medicoes"];

export function useMedicoes(phone) {
  return useQuery({
    queryKey: chave(phone),
    queryFn: () => api.get(`/patients/${phone}/medicoes?dias=90`),
    enabled: Boolean(phone),
  });
}

export function useMedicoesAgendadas(phone) {
  return useQuery({
    queryKey: [...chave(phone), "agendadas"],
    queryFn: () => api.get(`/patients/${phone}/medicoes-agendadas`),
    enabled: Boolean(phone),
  });
}

export function useAgendarMedicao(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/patients/${phone}/medicoes-agendadas`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: chave(phone) }),
  });
}

export function useArquivarMedicaoAgendada(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.del(`/medicoes-agendadas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: chave(phone) }),
  });
}

// Medida feita no balcão. O backend lê o texto com o MESMO leitor do
// WhatsApp e aplica o mesmo limiar — a equipe não tem um caminho
// privilegiado que pula o alerta.
export function useRegistrarMedicao(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/patients/${phone}/medicoes`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: chave(phone) }),
  });
}
