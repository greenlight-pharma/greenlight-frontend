import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api.js";
import { API_URL } from "../../lib/config.js";
import { getToken } from "../../lib/auth.js";

const MAX_BYTES = 10 * 1024 * 1024; // o backend recusa acima disso

/** Lê o arquivo como base64 puro (sem o prefixo data:...;base64,). */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

export function useUploadExam(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, examDate, notes, examType }) => {
      // Validar ANTES de ler o arquivo inteiro em memória: um PDF de 40MB
      // convertido em base64 trava o navegador do posto antes de o backend
      // sequer recusar.
      if (file.type !== "application/pdf") {
        throw new Error("Apenas arquivos PDF são aceitos.");
      }
      if (file.size > MAX_BYTES) {
        throw new Error(
          `Arquivo de ${(file.size / 1024 / 1024).toFixed(1)}MB. O limite é 10MB.`
        );
      }
      return api.post(`/patients/${phone}/exams`, {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileDataBase64: await toBase64(file),
        examDate: examDate || null,
        notes: notes || null,
        examType: examType || null,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

export function useDeleteExam(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.del(`/patients/${phone}/exams/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

export function useAnalyzeExam(phone) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/patients/${phone}/exams/${id}/analyze`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["paciente", phone] }),
  });
}

/**
 * Download do PDF. Não dá pra usar <a href> direto: a rota exige o header
 * Authorization, que um link comum não envia. Baixamos com fetch e
 * entregamos via blob — revogando a URL depois pra não vazar memória
 * (o painel antigo criava object URLs e nunca revogava).
 */
export async function downloadExam(phone, exam) {
  const resp = await fetch(`${API_URL}/patients/${phone}/exams/${exam.id}/download`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!resp.ok) throw new Error("Não foi possível baixar o exame.");
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = exam.fileName || "exame.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
