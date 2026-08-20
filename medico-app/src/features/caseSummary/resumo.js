// [CASE-SUMMARY] Resumo do caso para TRANSFERÊNCIA DE CUIDADO.
//
// Portado do medico.html mantendo a ordem e o texto das seções — inclusive
// duas decisões que não são estéticas:
//
// 1. Alergias vêm ANTES de tudo (logo após identificação). Quem recebe o
//    paciente precisa ver alergia antes de qualquer outra coisa.
// 2. Alergia não registrada é escrita como "NÃO REGISTRADO (não assumir
//    ausência)". Campo em branco seria lido como "não tem alergia" — e essa
//    leitura errada mata.
//
// Virou função pura, então esses dois pontos têm teste.

const SEP = "=".repeat(56);
const SUB = "-".repeat(56);

const dataHora = (iso) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "sem data";
const dataSo = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "");

export function montarResumoDoCaso({
  patient,
  phone,
  clinicalProfile,
  anthro = [],
  appointments = [],
  medications = [],
  exams = [],
  agora,
}) {
  const L = [];
  const p = patient || {};

  L.push(SEP, "RESUMO DO CASO — TRANSFERÊNCIA DE CUIDADO", SEP);
  L.push(`Gerado em: ${dataHora(agora || new Date().toISOString())}`, "");

  L.push("1. DADOS DO PACIENTE", SUB);
  L.push(`Nome: ${p.name || "—"}`);
  L.push(`Telefone: ${p.phone || phone || "—"}`);
  L.push(`Idade: ${p.patientAge ? `${p.patientAge} anos` : "—"}`);
  L.push("");

  // Segurança: vem cedo no documento de propósito.
  L.push("ALERGIAS E COMORBIDADES", SUB);
  const cp = clinicalProfile || {};
  const alergias = String(cp.allergies || "").trim();
  const comorbidades = String(cp.chronicConditions || cp.comorbidities || "").trim();
  L.push(`Alergias: ${alergias || "NÃO REGISTRADO (não assumir ausência)"}`);
  L.push(`Comorbidades: ${comorbidades || "Não registrado"}`);
  L.push("");

  L.push("2. ANTROPOMETRIA E SINAIS VITAIS", SUB);
  if (!anthro.length) {
    L.push("Nenhum registro.");
  } else {
    for (const r of anthro) {
      const partes = [];
      if (r.weightKg != null) partes.push(`Peso ${r.weightKg} kg`);
      if (r.heightCm != null) partes.push(`Altura ${r.heightCm} cm`);
      if (r.waistCm != null) partes.push(`Circ. abd. ${r.waistCm} cm`);
      if (r.systolicBP != null || r.diastolicBP != null) {
        partes.push(`PA ${r.systolicBP ?? "?"}/${r.diastolicBP ?? "?"} mmHg`);
      }
      if (r.heartRate != null) partes.push(`FC ${r.heartRate} bpm`);
      L.push(`• ${dataHora(r.measuredAt)}: ${partes.join(" | ") || "sem valores"}`);
    }
  }
  L.push("");

  L.push("3. HISTÓRICO DE CONSULTAS", SUB);
  if (!appointments.length) {
    L.push("Nenhuma consulta registrada.");
  } else {
    for (const a of appointments) {
      const st = a.status === "concluida" ? "Concluída" : "Em atendimento";
      const quando = dataHora(a.concludedAt || a.acceptedAt);
      L.push(`• [${st}] ${quando} — Médico: ${a.doctorName || a.acceptedDoctorName || "—"}`);
      L.push(`  Motivo: ${a.reason || "não registrado"}`);
      if (a.status === "concluida" && a.closingNotes?.plan) {
        L.push(`  Plano (SOAP): ${String(a.closingNotes.plan).replace(/\s*\n\s*/g, " ")}`);
      }
    }
  }
  L.push("");

  L.push("4. MEDICAÇÕES", SUB);
  if (!medications.length) {
    L.push("Nenhuma medicação registrada.");
  } else {
    const ativas = medications.filter((m) => !m.archivedAt);
    const arquivadas = medications.filter((m) => m.archivedAt);
    L.push("Em uso:");
    if (!ativas.length) {
      L.push("  (nenhuma)");
    } else {
      for (const m of ativas) {
        let linha = `  • ${m.medicationName || "—"}${m.dose ? " " + m.dose : ""}`;
        if (m.scheduleTimes) linha += ` — horários: ${m.scheduleTimes}`;
        L.push(linha);
        if (m.instructions) L.push(`    Orientações: ${m.instructions}`);
      }
    }
    if (arquivadas.length) {
      L.push("Arquivadas (histórico):");
      for (const m of arquivadas) {
        L.push(`  • ${m.medicationName || "—"}${m.dose ? " " + m.dose : ""}`);
      }
    }
  }
  L.push("");

  const lab = exams.filter((e) => (e.examType || "lab") !== "imaging");
  const imagem = exams.filter((e) => e.examType === "imaging");

  L.push("5. EXAMES LABORATORIAIS", SUB);
  if (!lab.length) {
    L.push("Nenhum exame laboratorial anexado.");
  } else {
    for (const e of lab) {
      const quando = dataSo(e.examDate) || dataSo(e.analysisExamDate);
      L.push(`• ${e.fileName || "Exame"}${quando ? ` — realizado em ${quando}` : ""}`);
      if (e.doctorName) L.push(`  Anexado por: ${e.doctorName}`);
    }
  }
  L.push("");

  L.push("6. EXAMES DE IMAGEM", SUB);
  if (!imagem.length) {
    L.push("Nenhum exame de imagem anexado.");
  } else {
    for (const e of imagem) {
      const quando = dataSo(e.examDate) || dataSo(e.analysisExamDate);
      L.push(`• ${e.fileName || "Exame"}${quando ? ` — realizado em ${quando}` : ""}`);
      if (e.doctorName) L.push(`  Anexado por: ${e.doctorName}`);
    }
  }
  L.push("");

  L.push(SEP);
  L.push("Documento gerado pela Vytal para transferência de cuidado.");
  L.push("Conteúdo de responsabilidade do médico que o compartilha.");
  L.push(SEP);

  return L.join("\n");
}
