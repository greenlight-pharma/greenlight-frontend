import { parseScheduleTimes } from "../../lib/schedule.js";

// [DOC-OUTPUT] Documentos de saída — receita / atestado / pedido de exame.
// Para IMPRIMIR, ASSINAR e CARIMBAR: o sistema NÃO assina nada e NÃO inventa
// CRM. O rodapé diz isso em todos eles.
//
// Virou função pura (era montagem de string lendo getElementById), então o
// formato do documento pode ser testado — inclusive o rodapé de validade,
// que é o item com implicação legal.

const REGUA = "-".repeat(56);

export const TIPOS = {
  receita: { titulo: "RECEITUÁRIO MÉDICO", arquivo: "receita" },
  atestado: { titulo: "ATESTADO MÉDICO", arquivo: "atestado" },
  pedido: { titulo: "SOLICITAÇÃO DE EXAMES", arquivo: "pedido_exames" },
};

/** Pré-preenche a receita com as medicações ativas do prontuário. */
export function receitaDasMedicacoes(medications = []) {
  return medications
    .filter((m) => m.status === "ativo" && !m.archivedAt)
    .map((m) => {
      const horarios = parseScheduleTimes(m.scheduleTimes);
      const linhas = [`${m.medicationName}${m.dose ? ` — ${m.dose}` : ""}`];
      if (horarios.ok && horarios.times.length) {
        linhas.push(`   Horários: ${horarios.times.join(", ")}`);
      }
      if (m.instructions) linhas.push(`   ${m.instructions}`);
      return linhas.join("\n");
    })
    .join("\n\n");
}

export function montarDocumento({ tipo, medico, paciente, corpo, cid, indicacao, hoje }) {
  const t = TIPOS[tipo];
  const data =
    hoje || new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  const L = [t.titulo, ""];
  L.push(`Médico(a): ${medico?.nome?.trim() || "_______________________________"}`);
  L.push(`CRM: ${medico?.crm?.trim() || "____________________"}`);
  L.push("");
  L.push(`Paciente: ${paciente?.name || "—"}`);
  L.push(`Idade: ${paciente?.patientAge ? `${paciente.patientAge} anos` : "—"}`);
  L.push(REGUA);
  L.push("");

  const texto = String(corpo || "").trim();

  if (tipo === "receita") {
    L.push(texto || "(sem itens)");
  } else if (tipo === "atestado") {
    L.push(texto || "(texto do atestado não preenchido)");
    if (cid?.trim()) {
      L.push("");
      L.push(`CID: ${cid.trim()}`);
    }
  } else {
    L.push("Solicito os exames abaixo:");
    L.push("");
    L.push(texto || "(nenhum exame listado)");
    if (indicacao?.trim()) {
      L.push("");
      L.push(`Indicação clínica: ${indicacao.trim()}`);
    }
  }

  L.push("", "");
  L.push(`Local e data: _________________________, ${data}`);
  L.push("", "");
  L.push("_________________________________________");
  L.push("Assinatura e carimbo do médico");
  L.push("");
  L.push(REGUA);
  L.push("Documento sem validade sem a assinatura e o carimbo do médico.");

  return { titulo: t.titulo, arquivo: t.arquivo, texto: L.join("\n") };
}
