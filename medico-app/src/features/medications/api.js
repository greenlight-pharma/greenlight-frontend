import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import { serializeScheduleTimes } from "../../lib/schedule.js";

// Chaves de cache num lugar só. Errar a chave é o bug clássico de "salvei e a
// tela não atualizou" — com as chaves centralizadas, a invalidação é óbvia.
export const medKeys = {
  busca: (termo) => ["medicamentos", "busca", termo],
  doses: (nome) => ["medicamentos", "doses", nome],
};

/** Monta o corpo que o backend espera. Um lugar só — antes eram 2 (add/edit). */
function toBody({ phone, patientName, medicationName, dose, times, startDate, endDate, instructions, status }) {
  const body = {
    patientName: patientName || "",
    medicationName: (medicationName || "").trim(),
    dose: (dose || "").trim(),
    scheduleTimes: serializeScheduleTimes(times),
    startDate: startDate || null,
    endDate: endDate || null,
    instructions: (instructions || "").trim(),
  };
  if (phone) body.phone = phone;
  if (status) body.status = status;
  return body;
}

export function useCreateMedication(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form) => api.post("/medications", toBody({ ...form, phone })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

export function useUpdateMedication(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...form }) => api.patch(`/medications/${id}`, toBody(form)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

// DELETE aqui é soft delete (arquivamento): a linha continua no banco pro
// histórico clínico, mas sai das listas e o cron para de lembrar.
export function useArchiveMedication(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.del(`/medications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

/** Autocomplete RENAME 2024. Só busca com 2+ caracteres, como o painel antigo. */
export function useMedicationSearch(termo) {
  const q = (termo || "").trim();
  return useQuery({
    queryKey: medKeys.busca(q.toLowerCase()),
    queryFn: () => api.get(`/medications/search?q=${encodeURIComponent(q)}`),
    enabled: q.length >= 2,
    staleTime: 60 * 60 * 1000, // a RENAME não muda durante o expediente
  });
}

/** Apresentações comerciais comuns — texto informativo, não prescrição. */
export function useMedicationDoses(nome) {
  const n = (nome || "").trim();
  return useQuery({
    queryKey: medKeys.doses(n.toLowerCase()),
    queryFn: () => api.get(`/medications/doses?name=${encodeURIComponent(n)}`),
    enabled: n.length >= 3,
    staleTime: 60 * 60 * 1000,
    retry: false, // nome livre que não existe na RENAME dá 404/vazio: normal
  });
}
