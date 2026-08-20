import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api.js";

// Chaves de cache num lugar só — errar a chave é o clássico "salvei e a
// tela não atualizou".
export const chaves = {
  agendamentos: (fase) => ["admin", "agendamentos", fase],
  medicos: ["admin", "medicos"],
  verticais: ["admin", "verticais"],
  assinaturas: ["admin", "assinaturas"],
  botConfig: ["admin", "bot-config"],
};

const ROTA_FASE = {
  abertos: "/admin/appointments/open/future",
  expirados: "/admin/appointments/expired",
  concluidas: "/admin/appointments/concluded",
  historico: "/admin/appointments/all",
};

export function useAgendamentos(fase) {
  return useQuery({
    queryKey: chaves.agendamentos(fase),
    queryFn: () => api.get(ROTA_FASE[fase]),
  });
}

export function useDoctors() {
  return useQuery({ queryKey: chaves.medicos, queryFn: () => api.get("/doctors") });
}

export function useVerticais() {
  return useQuery({ queryKey: chaves.verticais, queryFn: () => api.get("/admin/stats/verticals") });
}

export function useAssinaturas() {
  return useQuery({ queryKey: chaves.assinaturas, queryFn: () => api.get("/admin/subscriptions") });
}

export function useBotConfig() {
  return useQuery({ queryKey: chaves.botConfig, queryFn: () => api.get("/admin/bot-config") });
}

function invalidarAgendamentos(qc) {
  qc.invalidateQueries({ queryKey: ["admin", "agendamentos"] });
}

export function useCancelarAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/admin/appointments/${id}/cancel`),
    onSuccess: () => invalidarAgendamentos(qc),
  });
}

export function useArquivarLote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scope) => api.post("/admin/appointments/archive-batch", { scope }),
    onSuccess: () => invalidarAgendamentos(qc),
  });
}

export function useCriarMedico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/doctors", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.medicos }),
  });
}

export function useAlternarMedico() {
  const qc = useQueryClient();
  return useMutation({
    // O backend tem rotas distintas para desativar e reativar.
    mutationFn: ({ id, desativar }) =>
      api.post(`/admin/doctors/${id}/${desativar ? "deactivate" : "reactivate"}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.medicos }),
  });
}

export function useRemoverMedico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.del(`/admin/doctors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.medicos }),
  });
}

export function useVincularPaciente() {
  return useMutation({
    mutationFn: (body) => api.post("/doctor-patients", body),
  });
}

export function useAtualizarAssinatura() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/subscriptions/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.assinaturas }),
  });
}

export function useSalvarBotConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/admin/bot-config", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: chaves.botConfig }),
  });
}

export function useMensagemPaciente() {
  return useMutation({
    mutationFn: (body) => api.post("/admin/message/patient", body),
  });
}

export function useContarDestinatarios() {
  return useMutation({ mutationFn: () => api.get("/admin/message/broadcast-count") });
}

export function useBroadcast() {
  return useMutation({
    mutationFn: (body) => api.post("/admin/message/broadcast", body),
  });
}

// Rótulos das verticais de entrada (landing pages).
export const VERTICAIS = {
  consulta_clinica: "Consulta Clínica",
  checkup: "Check-up",
  emagrecimento: "Emagrecimento e Obesidade",
  saude_mental: "Saúde Mental",
  saude_homem: "Saúde do Homem",
  dor_cronica: "Dor Crônica",
  diabetes_hipertensao: "Diabetes e Hipertensão",
};

export const STATUS_ASSINATURA = {
  offered: { label: "Oferecida", classe: "sub-offered" },
  accepted: { label: "Aceita", classe: "sub-accepted" },
  active: { label: "Ativa", classe: "sub-active" },
  cancelled: { label: "Cancelada", classe: "sub-cancelled" },
};
