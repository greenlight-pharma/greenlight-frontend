// [HORARIOS] Domínio dos horários de lembrete.
//
// O contrato com o backend é uma string CSV "HH:MM,HH:MM". O cron
// (sendMedicationReminders) roda a cada minuto, pega a hora atual em
// America/Sao_Paulo e testa `scheduleTimes.split(",").includes("HH:MM")`.
// Consequências que este módulo precisa garantir:
//
// 1. É comparação de STRING EXATA. "8:00" nunca dispara — só "08:00".
//    Por isso normalizamos com zero à esquerda antes de enviar.
// 2. Espaço extra o backend já apara (.map(t => t.trim())), mas mandamos
//    limpo mesmo assim.
// 3. Horário duplicado dispararia a mesma mensagem duas vezes no mesmo
//    minuto — deduplicamos.
// 4. Ordenamos: o médico lê a prescrição em ordem cronológica.

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(value) {
  return HHMM.test(String(value || "").trim());
}

/**
 * Lê a string vinda do backend.
 * Devolve `{ok:false}` quando o valor está em formato legado (o campo já foi
 * texto livre e aceitava coisas como "8;00 e 20;00"), pra UI poder avisar em
 * vez de descartar em silêncio.
 */
export function parseScheduleTimes(raw) {
  if (!raw) return { ok: true, times: [] };
  const parts = String(raw)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.every(isValidTime)) return { ok: false, times: [] };
  return { ok: true, times: parts };
}

/** Monta a string canônica pro backend: válidos, sem duplicata, ordenados. */
export function serializeScheduleTimes(times) {
  const valid = (times || [])
    .map((t) => String(t || "").trim())
    .filter(isValidTime);
  return [...new Set(valid)].sort().join(",");
}

// [POSOLOGIA-ATALHO] Atalhos que o médico usa de fato. O backend só entende
// lista de horários, então "de 8 em 8 horas" é expandido AQUI em 3 horários
// concretos a partir do primeiro. Isso mantém o contrato intacto e ainda
// assim tira do médico a conta de cabeça (fonte de erro em consulta corrida).
export const POSOLOGIA_PRESETS = [
  { id: "1x", label: "1x ao dia", everyHours: 24, doses: 1 },
  { id: "12h", label: "De 12 em 12h (2x)", everyHours: 12, doses: 2 },
  { id: "8h", label: "De 8 em 8h (3x)", everyHours: 8, doses: 3 },
  { id: "6h", label: "De 6 em 6h (4x)", everyHours: 6, doses: 4 },
];

export function expandPosologia(firstTime, presetId) {
  const preset = POSOLOGIA_PRESETS.find((p) => p.id === presetId);
  if (!preset || !isValidTime(firstTime)) return [];

  const [h, m] = firstTime.split(":").map(Number);
  const out = [];
  for (let i = 0; i < preset.doses; i++) {
    const hour = (h + i * preset.everyHours) % 24;
    out.push(`${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return [...new Set(out)].sort();
}

// [FIM-TRATAMENTO] O painel antigo deixava endDate opcional e manual.
// Resultado: antibiótico de 7 dias vira lembrete eterno se o médico esquecer,
// porque o cron só olha status='ativo' e archivedAt — nunca a data de hoje.
// Aqui calculamos a data final a partir da duração em dias, que é como o
// médico pensa ("por 7 dias"), não como o banco guarda.
export function endDateFromDuration(startDate, durationDays) {
  const days = Number(durationDays);
  if (!startDate || !Number.isFinite(days) || days <= 0) return "";
  const d = new Date(`${startDate}T12:00:00`); // meio-dia evita virada por fuso
  d.setDate(d.getDate() + days - 1);
  return d.toISOString().slice(0, 10);
}

/** Uma medicação com endDate no passado não deveria mais lembrar ninguém. */
export function isExpired(med, today = new Date()) {
  if (!med?.endDate) return false;
  const end = String(med.endDate).slice(0, 10);
  return end < today.toISOString().slice(0, 10);
}
