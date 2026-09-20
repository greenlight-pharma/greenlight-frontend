// Regras e tipos. Espelham native/ios/Vytal/Models.swift e CareModels.swift:
// a web, o iOS e o Android têm de validar igual. O servidor valida de novo.

export type Doctor = { name?: string | null; email?: string | null; crm?: string | null; profissao?: string | null; tipoConta?: "profissional" | "pessoal" | null; phone?: string | null };
export type Session = { token: string; doctor: Doctor };

export type Patient = { phone: string; name: string; linkId?: number; optOut: boolean; activeMedications?: number; pendingReactions?: number; remindersPaused?: boolean };
export function readPatient(raw: any): Patient {
  return {
    phone: String(raw.patientPhone ?? raw.phone ?? "").replace(/\D/g, ""),
    name: raw.patientName ?? raw.name ?? "Sem nome",
    linkId: typeof raw.id === "number" ? raw.id : undefined,
    optOut: raw.optOut === true,
    activeMedications: typeof raw.activeMedications === "number" ? raw.activeMedications : undefined,
    pendingReactions: typeof raw.pendingReactions === "number" ? raw.pendingReactions : undefined,
    remindersPaused: raw.lembretesPausados === true,
  };
}
/** "(12) 98830-3722": o 55 fica no servidor, o profissional só vê DDD e número. */
export function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return raw;
  const rest = d.slice(2), split = rest.length === 9 ? 5 : 4;
  return `(${d.slice(0, 2)}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}
/** Só Brasil: a tela pede DDD + número e o 55 entra sozinho. */
export const withCountry = (local: string) => "55" + local.replace(/\D/g, "");
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
export const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
export function patientMatches(p: Patient, text: string): boolean {
  const q = text.trim();
  if (!q) return true;
  const digits = q.replace(/\D/g, "");
  return fold(p.name).includes(fold(q)) || (digits !== "" && p.phone.includes(digits));
}

export type Medication = { id: number; medicationName: string; isMine?: boolean; dose?: string; scheduleTimes?: string; startDate?: string; endDate?: string | null; status?: string; archivedAt?: string | null; instructions?: string; weekdays?: string | null };
/** [DIAS-DA-SEMANA] "1,3" do servidor -> [1,3]; ausente ou vazio -> todos os dias. */
export function parseWeekdays(raw?: string | null): number[] { const d = [...new Set(String(raw ?? "").split(",").map((x) => x.trim()).filter((x) => /^[0-6]$/.test(x)).map(Number))].sort(); return d.length ? d : [0, 1, 2, 3, 4, 5, 6]; }
/** O que vai ao servidor: null = todos os dias. */
export const weekdaysValue = (days: number[]) => (days.length === 7 || days.length === 0 ? null : [...days].sort());
export const timesOf = (m: { scheduleTimes?: string | null }) => (m.scheduleTimes ?? "").split(",").filter(Boolean);
export function medicationState(m: Medication, today = Schedule.today()): string {
  if (m.archivedAt || m.status === "encerrado" || m.status === "inativo") return "Encerrado";
  if (m.endDate && m.endDate.slice(0, 10) < today) return "Encerrado por prazo";
  if (m.startDate && m.startDate.slice(0, 10) > today) return "Início programado";
  return m.status === "ativo" ? "Em acompanhamento" : "Status não informado";
}
export type SharedMedication = { medicationName: string; dose?: string; scheduleTimes?: string; endDate?: string; doctorName?: string; weekdays?: string | null };
export type MeasurementAlert = { phone: string; patientName?: string; tipo: string; valor: string; medidoEm: string; nivel: "alerta" | "alterada"; motivo?: string };
export type TodayTotals = { data?: string; reacoesAAvaliar?: number; semRespostaOntem?: number; pacientes?: number; afericoesAlteradas?: MeasurementAlert[] };
export type WeekDay = { data: string; hoje: boolean; estado: "ok" | "parcial" | "falhou" | "reacao" | "sem_doses" | "pendente"; previstas: number; tomou: number; nao_tomou: number; efeito_colateral: number; sem_resposta: number; futuro: number };
export type DayItem = { medicationId?: number; medicationName: string; dose?: string; endDate?: string | null; doctorName?: string; mine: boolean; status?: string };
export type DayGrid = { data?: string; horarios: { time: string; itens: DayItem[] }[]; totalMedicacoes?: number; totalDoses?: number };
export type ScheduledMeasurement = { id: number; tipo: string; scheduleTimes?: string; startDate?: string; endDate?: string };
export type Plan = { id: string; nome: string; limitePacientes: number; descricao?: string; publico?: "profissional" | "pessoal"; precoCentavos?: number };
export type Quota = { mes: string; mensagens: number; limite: number; percentual: number; aviso: "perto" | "excedida" | null };
/** [VENCIMENTO] Plano pago que vence ou venceu. Ver vencimento.js no servidor. */
export type Expiry = { fase: "vence_em_breve" | "carencia" | "pausado"; venceEm: string; corteEm: string; limite: number; pausados: number };
export type SubscriptionStatus = { plano: Plan; tipoConta?: "profissional" | "pessoal"; teste?: { ate: string; ativo: boolean } | null; motivo?: string | null; franquia?: Quota | null; vencimento?: Expiry | null; limite?: number; usados?: number; restantes?: number; catalogo?: Plan[]; assinatura?: { origem?: string; planoId?: string; status?: string; expiraEm?: string; acesso?: boolean } | null; web?: { planoId?: string; status: string; expiraEm?: string; acesso?: boolean; cartaoFinal?: string | null; bandeira?: string | null; ciclo?: string; tipo?: "pix" | "cartao" } | null };
/** A cortesia pode ampliar o acesso, mas nunca representa o produto comprado. */
export function subscriptionDisplay(s: SubscriptionStatus) {
  const paidIds = [s.web, s.assinatura].filter(x => x?.acesso).map(x => x!.planoId);
  const hasPaidAccess = paidIds.length > 0;
  const candidates = [...(s.catalogo ?? []), s.plano].filter(p => paidIds.includes(p.id));
  const paidPlan = candidates.sort((a,b) => b.limitePacientes-a.limitePacientes)[0] ?? null;
  const personal = s.tipoConta === "pessoal";
  return {
    hasPaidAccess,
    paidPlan,
    displayPlan: personal && paidPlan ? paidPlan : s.plano,
    showTrialOffer: personal && Boolean(s.teste?.ativo) && !hasPaidAccess,
    trialExpiry: Boolean(s.teste && s.vencimento && new Date(s.teste.ate).getTime() === new Date(s.vencimento.venceEm).getTime()),
    trialBonus: personal && Boolean(s.teste?.ativo) && Boolean(paidPlan && s.plano.limitePacientes > paidPlan.limitePacientes),
  };
}
export type PatientLookup = { exists: boolean; linkedToMe?: boolean; otherDoctorName?: string; patient?: { name?: string } };
export type PatientRegistration = { notificationSent?: boolean; notificationStatus?: string; alreadyLinked?: boolean };
export function registrationNotice(r: PatientRegistration): string | null {
  switch (r.notificationStatus) {
    case "template_pendente": return "Paciente cadastrado. O aviso pelo WhatsApp ainda não está configurado nesta conta. Ele receberá o primeiro lembrete no horário da medicação.";
    case "opt_out": return "Paciente cadastrado, mas ele pediu para não receber mensagens da Vytal. Nenhum lembrete será enviado enquanto ele não pedir para voltar.";
    case "falhou": return "Paciente cadastrado. O aviso pelo WhatsApp não pôde ser enviado agora.";
    default: return null;
  }
}
export type OCRItem = { medicationName?: string; dose?: string; instructions?: string; posologiaTexto?: string; duracaoTexto?: string; usoContinuo?: boolean; duracaoDias?: number; usoCondicional?: boolean; dosesPorDia?: number; motivos?: string[]; divergencias?: { campo: string; outraLeitura?: string }[]; somenteEmUmaLeitura?: boolean };
export type OCRResponse = { itens: OCRItem[]; leituraDupla?: boolean; legibilidadeBaixa?: boolean };
export type AdherenceMedication = { medicationId?: number; medicationName: string; esperadas: number; tomou: number; nao_tomou: number; semResposta: number; efeito_colateral: number; ultima?: { createdAt?: string; resposta?: string } };
export type FollowupItem = { id: number; tipo: string; valor: string; medidoEm?: string; nivel?: string; motivo?: string };
export type FollowupKind = { total?: number; alteradas?: number; alertas?: number; ultima?: FollowupItem };
export type Followup = { dias?: number; faixa?: { pressaoSistolica?: number; pressaoDiastolica?: number; glicemiaAlta?: number; glicemiaBaixa?: number }; resumo?: { pressao?: FollowupKind; glicemia?: FollowupKind }; diasComAlteracao?: string[]; porDia: { data: string; alterado?: boolean; itens: FollowupItem[] }[] };

export const Schedule = {
  /** Hoje em Brasília, AAAA-MM-DD: é a data que o servidor usa. */
  today(date = new Date()): string { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(date); },
  /** Fim inclusivo: 7 dias a partir de 01 termina em 07. */
  end(start: string, days: number): string {
    const d = new Date(start + "T12:00:00Z");
    if (isNaN(d.getTime())) return start;
    d.setUTCDate(d.getUTCDate() + days - 1);
    return d.toISOString().slice(0, 10);
  },
  valid: (time: string) => /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time),
  validDate(date: string): boolean { return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date + "T12:00:00Z").getTime()); },
  quickDays: [7, 14, 30],
  /** O profissional pensa em "2 vezes ao dia", não em "08:00 e 20:00". */
  defaultTimes(n: number): string[] { return n === 1 ? ["08:00"] : n === 2 ? ["08:00", "20:00"] : n === 3 ? ["08:00", "14:00", "20:00"] : ["06:00", "12:00", "18:00", "00:00"]; },
  measurementTimes(n: number): string[] { return n === 1 ? ["07:00"] : n === 2 ? ["07:00", "19:00"] : ["07:00", "13:00", "19:00"]; },
  display(date: string): string { const d = date.slice(0, 10).split("-"); return d.length === 3 ? `${d[2]}/${d[1]}/${d[0]}` : date; },
  dateTime(iso: string): string {
    const d = new Date(iso); if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d).replace(",", " às");
  },
  time(iso: string): string {
    const d = new Date(iso); if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(d);
  },
};

export type ExistingMedication = { name: string; times: string[]; owner?: string };
export const MedicationNames = {
  /** Sem acento, minúscula, só as duas primeiras palavras. */
  key(name: string): string { return fold(name).replace(/[^a-z0-9 ]/g, "").split(" ").filter(Boolean).slice(0, 2).join(" "); },
  /** "Losartana" e "Losartana potássica" são a mesma; "Ácido fólico" e "Ácido acetilsalicílico" não. */
  same(a: string, b: string): boolean { const ka = this.key(a), kb = this.key(b); if (!ka || !kb) return false; return ka === kb || ka.startsWith(kb + " ") || kb.startsWith(ka + " "); },
  duplicates(name: string, existing: ExistingMedication[]) { return existing.filter((e) => this.same(e.name, name)); },
  describe(e: ExistingMedication): string { return `${e.name} já está cadastrada ${e.owner ? `por ${e.owner}` : "por você"}${e.times.length ? ` às ${e.times.join(", ")}` : ""}.`; },
};

export type Draft = {
  key: string; name: string; dose: string; instructions: string; original: string; source: string;
  times: string[]; weekdays: number[]; duration: "" | "continuous" | "days" | "date"; days: string; endDate: string;
  requiresReview: boolean; reviewed: boolean; included: boolean; saved: boolean; motivos: string[]; divergent: boolean; error?: string;
};
let draftSeq = 0;
export function emptyDraft(): Draft {
  return { key: `d${++draftSeq}`, name: "", dose: "", instructions: "", original: "", source: "", times: [""], weekdays: [0, 1, 2, 3, 4, 5, 6], duration: "", days: "", endDate: "", requiresReview: false, reviewed: false, included: true, saved: false, motivos: [], divergent: false };
}
export function draftFromMedication(m: Medication): Draft {
  const d = emptyDraft();
  d.name = m.medicationName; d.dose = m.dose ?? ""; d.instructions = m.instructions ?? "";
  d.times = timesOf(m).length ? timesOf(m) : [""];
  d.weekdays = parseWeekdays(m.weekdays);
  d.duration = m.endDate ? "days" : "continuous";
  if (m.endDate) {
    const start = (m.startDate ?? Schedule.today()).slice(0, 10), end = m.endDate.slice(0, 10);
    const diff = Math.round((Date.parse(end + "T12:00:00Z") - Date.parse(start + "T12:00:00Z")) / 86400000);
    d.days = String(Math.max(1, diff + 1));
  }
  return d;
}
export function draftFromOCR(item: OCRItem): Draft {
  const d = emptyDraft();
  d.name = item.medicationName ?? ""; d.dose = item.dose ?? ""; d.instructions = item.instructions ?? "";
  d.original = [item.posologiaTexto, item.duracaoTexto].filter(Boolean).join(" · ");
  d.source = [item.medicationName, item.dose, item.posologiaTexto, item.duracaoTexto, item.instructions].filter(Boolean).join(" · ");
  d.duration = item.usoContinuo === true ? "continuous" : item.duracaoDias != null ? "days" : "";
  d.days = item.duracaoDias != null ? String(item.duracaoDias) : "";
  d.motivos = item.motivos ?? []; d.divergent = (item.divergencias ?? []).length > 0;
  // "1x ao dia" escrito na receita pré-seleciona os horários padrão; sem posologia reconhecida, nada é preenchido.
  if (item.dosesPorDia && item.dosesPorDia >= 1 && item.dosesPorDia <= 4 && item.usoCondicional !== true) d.times = Schedule.defaultTimes(item.dosesPorDia);
  // Linha que só uma das leituras viu começa desmarcada: pode não existir na receita.
  d.requiresReview = true; d.included = item.usoCondicional !== true && item.somenteEmUmaLeitura !== true;
  return d;
}
export function validateDraft(d: Draft): string | null {
  if (!d.name.trim()) return "Informe o nome da medicação.";
  if (!d.dose.trim()) return "Informe a dose prescrita.";
  if (!d.times.length || d.times.some((t) => !Schedule.valid(t))) return "Preencha cada horário no formato HH:MM, de 00:00 a 23:59.";
  if (new Set(d.times).size !== d.times.length) return "Remova os horários repetidos.";
  if (!d.weekdays.length) return "Escolha pelo menos um dia da semana.";
  if (d.requiresReview && !d.reviewed) return "Confira nome, dose, horários e duração com a receita antes de continuar.";
  if (d.duration === "date") { if (!Schedule.validDate(d.endDate) || d.endDate < Schedule.today()) return "Escolha uma data final de hoje em diante."; }
  else if (d.duration !== "continuous") { const n = Number(d.days); if (d.duration !== "days" || !Number.isInteger(n) || n < 1 || n > 999) return "Escolha uso contínuo, informe de 1 a 999 dias ou uma data final."; }
  return null;
}
/** Contínuo = sem fim. Por dias = fim inclusivo a partir do início. Por data = a data escolhida. */
export function endDateValue(d: Draft, start: string): string | null {
  if (d.duration === "continuous") return null;
  if (d.duration === "date") return d.endDate;
  return Schedule.end(start, Number(d.days) || 1);
}
export function draftBody(d: Draft, patient: Patient, today = Schedule.today()) {
  return { phone: patient.phone, patientName: patient.name, medicationName: d.name.trim(), dose: d.dose.trim(), instructions: d.instructions.trim(), scheduleTimes: [...d.times].sort().join(","), weekdays: weekdaysValue(d.weekdays), startDate: today, endDate: endDateValue(d, today) };
}
export function draftPatch(d: Draft, original: Medication) {
  const body: Record<string, unknown> = { medicationName: d.name.trim(), dose: d.dose.trim(), instructions: d.instructions.trim(), scheduleTimes: [...d.times].sort().join(","), weekdays: weekdaysValue(d.weekdays) };
  const before = draftFromMedication(original);
  if (d.duration !== before.duration || d.days !== before.days) {
    const start = original.startDate ? original.startDate.slice(0, 10) : Schedule.today();
    if (!original.startDate) body.startDate = start;
    body.endDate = endDateValue(d, start);
  }
  return body;
}

// [PROFISSOES] Espelha greenlight-backend/profissoes.js.
export const PROFESSIONS = [
  { id: "medico", name: "Médico(a)", council: "CRM" }, { id: "dentista", name: "Cirurgião(ã)-dentista", council: "CRO" },
  { id: "enfermeiro", name: "Enfermeiro(a)", council: "COREN" }, { id: "farmaceutico", name: "Farmacêutico(a)", council: "CRF" },
  { id: "nutricionista", name: "Nutricionista", council: "CRN" }, { id: "fisioterapeuta", name: "Fisioterapeuta", council: "CREFITO" },
  { id: "terapeuta_ocupacional", name: "Terapeuta ocupacional", council: "CREFITO" }, { id: "fonoaudiologo", name: "Fonoaudiólogo(a)", council: "CRFa" },
  { id: "psicologo", name: "Psicólogo(a)", council: "CRP" }, { id: "biomedico", name: "Biomédico(a)", council: "CRBM" },
  { id: "educador_fisico", name: "Profissional de educação física", council: "CREF" },
];
export const UFS = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
export const PLACEHOLDER_NAME = "Médico(a)";
export const findProfession = (id?: string | null) => PROFESSIONS.find((p) => p.id === id);
/** Como o paciente lê o profissional: "Dr(a). Ana Lima" ou "Carla Souza, enfermeiro(a)". */
export function patientReads(name: string, professionId?: string | null): string {
  const n = name.trim();
  if (!n || n === PLACEHOLDER_NAME) return "seu profissional de saúde";
  const id = professionId ?? "medico";
  if (id === "medico" || id === "dentista") return `Dr(a). ${n}`;
  return `${n}, ${(findProfession(id)?.name ?? "").toLowerCase()}`;
}
export type Registration = { profession: string; number: string; uf: string };
export const registrationComplete = (r: Registration) => !!findProfession(r.profession) && r.number.replace(/[^\p{L}\p{N}]/gu, "").length >= 2 && UFS.includes(r.uf);
export const registrationBody = (r: Registration) => ({ profissao: r.profession, registroNumero: r.number.trim(), registroUf: r.uf });
/** Lê "CRO/SP 12345" de volta para os campos. */
export function parseRegistration(text?: string | null, profession?: string | null): Registration {
  const r: Registration = { profession: profession ?? "", number: "", uf: "" };
  const t = (text ?? "").trim();
  const m = t.match(/^([A-Za-z]+)\s*[/-]\s*([A-Za-z]{2})\s+(.+)$/);
  if (m) {
    r.uf = m[2].toUpperCase(); r.number = m[3];
    if (!r.profession) r.profession = PROFESSIONS.find((p) => p.council.toLowerCase() === m[1].toLowerCase())?.id ?? "";
  } else if (t) r.number = t.replace(/\D/g, "");
  return r;
}

// Protocolos de cuidados
export const Weekdays = {
  all: [0, 1, 2, 3, 4, 5, 6],
  labels: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
  valid: (days: number[]) => days.length > 0 && new Set(days).size === days.length && days.every((d) => d >= 0 && d <= 6),
  summary(days: number[]): string {
    if (!this.valid(days)) return "Selecione os dias";
    const s = new Set(days), eq = (a: number[]) => a.length === s.size && a.every((x) => s.has(x));
    if (eq(this.all)) return "Todos os dias";
    if (eq([1, 2, 3, 4, 5])) return "Segunda a sexta";
    if (eq([0, 6])) return "Sábado e domingo";
    const names = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    const l = [1, 2, 3, 4, 5, 6, 0].filter((d) => s.has(d)).map((d) => names[d]);
    const text = l.length === 1 ? l[0] : l.slice(0, -1).join(", ") + " e " + l[l.length - 1];
    return text[0].toUpperCase() + text.slice(1);
  },
};
export type CareRoutine = { id: string; name: string; time: string; steps: string[]; weekdays: number[] };
export type CareDraft = { name: string; routines: CareRoutine[]; instructions: string; internalNote: string; duration: string; days?: number | null; startDate?: string | null; endDate?: string | null };
export type CarePlan = { id: number; data: CareDraft; isTemplate: boolean };
export type CareReply = { id: string; snapshot: { name: string; routineName: string; steps: string[]; instructions: string }; status: string; response?: string; scheduledAt: string; reactionAt?: string; reviewedAt?: string };
export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));
export const newRoutine = (): CareRoutine => ({ id: newId(), name: "", time: "", steps: [""], weekdays: [...Weekdays.all] });
export const newCareDraft = (): CareDraft => ({ name: "", routines: [newRoutine()], instructions: "", internalNote: "", duration: "", days: null, startDate: null, endDate: null });
/** Protocolos antigos eram diários: só a chave ausente mantém esse comportamento. */
export function readCareDraft(raw: any): CareDraft {
  return { ...newCareDraft(), ...raw, routines: (raw?.routines ?? []).map((r: any) => ({ ...newRoutine(), ...r, weekdays: Array.isArray(r.weekdays) ? r.weekdays : [...Weekdays.all] })) };
}
export function careCopyForPatient(d: CareDraft): CareDraft {
  return { ...d, internalNote: "", startDate: null, routines: d.routines.map((r) => ({ ...r, id: newId(), steps: [...r.steps], weekdays: [...r.weekdays] })) };
}
export const hasWeeklyRoutines = (d: CareDraft) => d.routines.some((r) => Weekdays.valid(r.weekdays) && r.weekdays.length < 7);
export function careScheduleValidation(d: CareDraft): string | null {
  for (let i = 0; i < d.routines.length; i++) {
    const r = d.routines[i];
    if (!Weekdays.valid(r.weekdays)) return `Selecione pelo menos um dia da semana para a rotina ${i + 1}.`;
    if (!Schedule.valid(r.time)) return `Escolha um horário válido para a rotina ${i + 1}.`;
    const other = d.routines.slice(0, i).findIndex((o) => o.time === r.time && o.weekdays.some((w) => r.weekdays.includes(w)));
    if (other >= 0) return `As rotinas ${other + 1} e ${i + 1} coincidem em dia e horário. Ajuste os dias ou o horário.`;
  }
  return null;
}
export const CARE_AUTHORSHIP = "Todo o conteúdo é cadastrado pelo profissional de saúde. A Vytal organiza os lembretes e registra respostas; não cria nem prescreve tratamentos.";
