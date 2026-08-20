import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import { phoneVariants } from "../../lib/phone.js";

export function usePatients() {
  return useQuery({ queryKey: ["pacientes"], queryFn: () => api.get("/my-patients") });
}

/** Prontuário: dados básicos, consultas, medicações, análises e exames. */
export function usePatientSummary(phone) {
  return useQuery({
    queryKey: ["paciente", phone, "summary"],
    queryFn: () => api.get(`/patients/${phone}/summary`),
    enabled: !!phone,
  });
}

/** Histórico bruto: é daqui que sai a adesão (patient_events). */
export function usePatientHistory(phone) {
  return useQuery({
    queryKey: ["paciente", phone, "history"],
    queryFn: () => api.get(`/patients/${phone}/history`),
    enabled: !!phone,
  });
}

/**
 * [BR-PHONE-9DIG] Consulta as DUAS formas do número antes de cadastrar.
 * O backend guarda o telefone exatamente como o WhatsApp entrega, sem
 * normalizar o nono dígito; se o médico cadastrar a forma que o provedor não
 * usa, cria um paciente-fantasma que nunca recebe lembrete. Checar as duas
 * não conserta a entrega — mas impede criar o duplicado sem ninguém ver.
 */
export function usePatientLookup(canonicalPhone) {
  return useQuery({
    queryKey: ["lookup", canonicalPhone],
    enabled: !!canonicalPhone,
    queryFn: async () => {
      const variantes = phoneVariants(canonicalPhone);
      const achados = await Promise.all(
        variantes.map(async (p) => {
          try {
            const r = await api.get(`/patients/lookup?phone=${encodeURIComponent(p)}`);
            return r?.patient ? { ...r, phoneConsultado: p } : null;
          } catch {
            return null;
          }
        })
      );
      const validos = achados.filter(Boolean);
      return {
        principal: validos.find((v) => v.phoneConsultado === canonicalPhone) || null,
        // Cadastro existente na OUTRA grafia do mesmo número: é o caso que
        // silenciosamente duplica o paciente.
        emOutraGrafia: validos.find((v) => v.phoneConsultado !== canonicalPhone) || null,
      };
    },
  });
}

export function useCreateManualPatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post("/patients/manual", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pacientes"] }),
  });
}

export function useUnlinkPatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.del(`/doctor-patients/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pacientes"] }),
  });
}

export function useUpdateBasicData(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.put(`/patients/${phone}/basic-data`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

export function useClinicalProfile(phone) {
  return useQuery({
    queryKey: ["paciente", phone, "clinical-profile"],
    queryFn: () => api.get(`/patients/${phone}/clinical-profile`),
    enabled: !!phone,
  });
}

export function useSaveClinicalProfile(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.put(`/patients/${phone}/clinical-profile`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}
