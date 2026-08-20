import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api.js";

// [MED-CLASS] Classe farmacológica da RENAME, mostrada na meta da medicação.
// Reusa /medications/doses (que já devolve commonClass).
//
// No medico.html isso era um Map global + callback manual, com cuidado
// explícito pra não disparar N requests da mesma medicação. Aqui a chave da
// query resolve o mesmo problema: duas medicações com o mesmo nome
// compartilham a entrada de cache automaticamente.
export default function useMedicationClass(medicationName) {
  const nome = (medicationName || "").trim();
  const { data } = useQuery({
    queryKey: ["medicamentos", "doses", nome.toLowerCase()],
    queryFn: () => api.get(`/medications/doses?name=${encodeURIComponent(nome)}`),
    enabled: nome.length >= 3,
    staleTime: 60 * 60 * 1000,
    retry: false, // nome livre fora da RENAME não tem classe: é normal
  });
  return data?.commonClass || null;
}
