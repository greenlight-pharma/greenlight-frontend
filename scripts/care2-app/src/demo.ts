import type { RegistroPrograma, Programa } from "./programas/model";
const programasDemo = new Map<string, RegistroPrograma>();
import type { Registro, Gestacao } from "./gestacao/model";
const gestacoes = new Map<string, Registro>();
// Dados sintéticos para ver o desenho sem conta. Só existe em desenvolvimento
// (import.meta.env.DEV): o build de produção não carrega este arquivo.
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const day = (n: number) => { const d = new Date(today + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };
const family = new URLSearchParams(location.search).get("previa") === "familia";
export function demoResponse(path: string, method: string, body?: unknown): unknown {
  if (path.startsWith("/care2/pessoas/") && path.includes("/programas")) {
    if(path.endsWith('/programas')) return {programas:[...programasDemo.entries()].filter(([key])=>key.startsWith(path+'/')).map(([key,r])=>({programa:key.split('/').pop(),status:r.data?.status,objetivo:r.data?.objetivo}))};
    const current=programasDemo.get(path)??{data:null,version:0};
    if(method==='GET')return current;
    const input=body as {version:number;data:Programa};
    if(input.version!==current.version)throw new Error('Prévia atualizada em outra tela. Recarregue.');
    const next={data:input.data,version:current.version+1};programasDemo.set(path,next);return next;
  }
  if (path.startsWith("/care2/pessoas/") && path.endsWith("/gestacao")) {
    const current = gestacoes.get(path) ?? { data: null, version: 0 };
    if (method === "GET") return current;
    const input = body as { version: number; data: Gestacao };
    if (input.version !== current.version) throw new Error("Prévia atualizada em outra tela. Recarregue.");
    const next = { data: input.data, version: current.version + 1 }; gestacoes.set(path, next); return next;
  }
  if (family && method === "GET") {
    if (path === "/my-patients") return [{ id: 1, patientPhone: "5500000000001", patientName: "Maria — exemplo", activeMedications: 2 }, { id: 2, patientPhone: "5500000000002", patientName: "João — exemplo", activeMedications: 1 }];
    if (path === "/minha-assinatura") return { tipoConta: "pessoal", plano: { id: "pessoal_familia", publico: "pessoal", nome: "Família", limitePacientes: 3 }, usados: 2, limite: 3, teste: { ativo: true, ate: new Date(Date.now()+5*86400000).toISOString() }, assinatura: null };
    if (path === "/assinatura/web/config") return { disponivel: true, publicKey: "pk_test_previa", planos: [{ id: "pessoal_individual", publico: "pessoal", nome: "Individual", limitePacientes: 1, preco: "R$ 14,90", precoAnual: "R$ 151,98", precoAnualCentavos: 15198, descricao: "Para uma pessoa." }, { id: "pessoal_familia", publico: "pessoal", nome: "Família", limitePacientes: 3, preco: "R$ 29,90", precoAnual: "R$ 304,98", precoAnualCentavos: 30498, descricao: "Até três pessoas." }] };
    if (path === "/familia/avisos") return { naoLidos: 1, avisos: [{ id: "exemplo", phone: "5500000000001", pessoa: "Maria — exemplo", tipo: "dose", texto: "Horário das 14:00 sem confirmação.", criadoEm: new Date().toISOString(), lidoEm: null }] };
    if (path === "/familia/config") return { config: { naoConfirmou: true, esperaMin: 60, tomou: false, medicao: true, receita: true, email: true }, phone: null, emailAtivo: true, whatsappAtivo: false };
    if (path.includes("/familia/pessoas/") && path.endsWith("/resumo")) return { pessoa: "Maria — exemplo", hoje: today, sequencia: 2, dias: [], medicacoes: [], medicoes: [], faixa: { pressaoSistolica: 140, pressaoDiastolica: 90, glicemiaAlta: 180, glicemiaBaixa: 70 }, faixaCombinada: false, receitasTerminando: [] };
  }
  // Prévia do Pix: um pedido de mentira, que nunca é pago.
  if (method === "POST" && path === "/assinatura/web/pix") return { id: "or_previa", qrCode: "00020101021226870014br.gov.bcb.pix2565previa.exemplo/qr/v2/cobv/0000000000000000000000000005204000053039865406199.905802BR5925VYTAL SAUDE TECNOLOGIA LT6009SAO PAULO62070503***6304ABCD", qrCodeUrl: null, expiraEm: new Date(Date.now() + 30 * 60e3).toISOString(), dias: 30 };
  if (method !== "GET") throw new Error("Prévia: nenhuma alteração é enviada ao servidor.");
  if (path === "/my-patients") return [{ id: 1, patientPhone: "5541998761020", patientName: "Marina Oliveira", activeMedications: 4, pendingReactions: 1 }, { id: 2, patientPhone: "5541991234410", patientName: "João Santos", activeMedications: 2 }, { id: 3, patientPhone: "5511988127733", patientName: "Ana Carvalho", activeMedications: 6 }, { id: 4, patientPhone: "5541997002218", patientName: "Roberto Pereira", activeMedications: 1, optOut: true }, { id: 5, patientPhone: "5543996540091", patientName: "Luiza Ferraz", activeMedications: 3 }];
  if (path === "/hoje") return { data: today, reacoesAAvaliar: 1, semRespostaOntem: 2, pacientes: 5, afericoesAlteradas: [{ phone: "5541991234410", patientName: "João Santos", tipo: "pressao", valor: "158/96 mmHg", medidoEm: new Date(Date.now() - 18 * 3600e3).toISOString(), nivel: "alterada", motivo: "acima de 140/90" }] };
  if (path.endsWith("/semana")) { const est = ["ok", "ok", "parcial", "ok", "falhou", "ok", "reacao"] as const; return { dias: est.map((e, i) => ({ data: day(6 - i), hoje: i === 6, estado: e, previstas: 4, tomou: e === "ok" ? 4 : e === "parcial" ? 2 : e === "reacao" ? 1 : 0, nao_tomou: 0, efeito_colateral: e === "reacao" ? 1 : 0, sem_resposta: e === "falhou" ? 4 : e === "parcial" ? 2 : 0, futuro: i === 6 ? 2 : 0 })) }; }
  if (path === "/auth/email/estado") return { confirmacaoPendente: false };
  if (path === "/auth/perfil") return { doctor: { name: "Helena Prado", email: "previa@example.invalid", crm: "CRM/PR 12345", profissao: "medico" }, incompleto: false };
  if (path === "/auth/conta/requisitos") return { exigeSenha: true };
  if (path === "/care-capabilities") return { protocolDelivery: true, measurementDelivery: true };
  if (path.startsWith("/assinatura/web/pix/")) return { status: "pendente" };
  if (path === "/assinatura/web/config") return { disponivel: true, publicKey: "pk_test_previa", franquiaMensagensPorPaciente: 120, planos: [{ id: "clinica", nome: "Clínica", limitePacientes: 60, preco: "R$ 529,90", precoAnual: "R$ 5.404,98", precoAnualCentavos: 540498, descricao: "Acompanhamento de rotina de uma agenda cheia." }, { id: "rede", nome: "Rede", limitePacientes: 150, preco: "R$ 1.299,90", precoAnual: "R$ 13.258,98", precoAnualCentavos: 1325898, descricao: "Vários profissionais ou alto volume de crônicos. Acima de 150 pacientes, sob consulta." }] };
  if (path === "/minha-assinatura") return { plano: { id: "essencial", nome: "Essencial", limitePacientes: 20 }, franquia: { mes: today.slice(0, 7), mensagens: 1980, limite: 2400, percentual: 83, aviso: "perto" }, usados: 5, limite: 20, restantes: 15, catalogo: [{ id: "gratuito", nome: "Gratuito", limitePacientes: 2 }, { id: "essencial", nome: "Essencial", limitePacientes: 20 }, { id: "clinica", nome: "Clínica", limitePacientes: 60 }, { id: "rede", nome: "Rede", limitePacientes: 150 }], assinatura: null };
  if (path.endsWith("/summary")) return { medications: [{ id: 1, isMine: true, medicationName: "Medicação exemplo A", dose: "1 comprimido", scheduleTimes: "08:00", status: "ativo", startDate: day(20) }, { id: 2, isMine: true, medicationName: "Medicação exemplo B", dose: "1 comprimido", scheduleTimes: "08:00,14:00,20:00", status: "ativo", startDate: day(20), instructions: "Após as refeições" }, { id: 3, isMine: true, medicationName: "Medicação exemplo C", dose: "1 cápsula", scheduleTimes: "22:00", status: "ativo", startDate: day(40), endDate: day(3) }, { id: 4, isMine: true, medicationName: "Medicação exemplo semanal", dose: "1 comprimido", scheduleTimes: "08:00", status: "ativo", startDate: day(20), weekdays: "1" }] };
  if (path.endsWith("/shared-medications")) return { items: [{ medicationName: "Medicação exemplo D", dose: "1 comprimido em jejum", scheduleTimes: "06:30", doctorName: "Dr(a). Profissional exemplo" }] };
  if (path.endsWith("/medicoes-agendadas")) return [{ id: 1, tipo: "pressao", scheduleTimes: "07:00,19:00" }];
  if (path.endsWith("/hoje")) return { data: today, totalMedicacoes: 3, totalDoses: 4, horarios: [{ time: "06:30", itens: [{ medicationName: "Medicação exemplo D", dose: "1 comprimido em jejum", doctorName: "Dr(a). Profissional exemplo", mine: false }] }, { time: "08:00", itens: [{ medicationId: 1, medicationName: "Medicação exemplo A", dose: "1 comprimido", mine: true, status: "efeito_colateral" }, { medicationId: 2, medicationName: "Medicação exemplo B", dose: "1 comprimido", mine: true, status: "tomou" }] }, { time: "14:00", itens: [{ medicationId: 2, medicationName: "Medicação exemplo B", dose: "1 comprimido", mine: true, status: "sem_resposta" }] }, { time: "20:00", itens: [{ medicationId: 2, medicationName: "Medicação exemplo B", dose: "1 comprimido", mine: true, status: "futuro" }] }] };
  if (path.includes("/adesao?")) return { resumo: [{ medicationId: 1, medicationName: "Medicação exemplo A", esperadas: 30, tomou: 24, nao_tomou: 2, semResposta: 4, efeito_colateral: 1, ultima: { createdAt: new Date().toISOString(), resposta: "efeito_colateral" } }, { medicationId: 2, medicationName: "Medicação exemplo B", esperadas: 90, tomou: 71, nao_tomou: 6, semResposta: 13, efeito_colateral: 0 }] };
  if (path.includes("/acompanhamento?")) {
    const bp = [128, 134, 158, 131, 126, 139, 128], item = (id: number, tipo: string, valor: string, d: number, nivel = "normal", motivo?: string) => ({ id, tipo, valor, medidoEm: day(d) + "T10:08:00.000Z", nivel, motivo });
    return { dias: 30, faixa: { pressaoSistolica: 140, pressaoDiastolica: 90, glicemiaAlta: 180, glicemiaBaixa: 70 }, resumo: { pressao: { total: 7, alteradas: 1, alertas: 0, ultima: item(1, "pressao", "128/82 mmHg", 0) }, glicemia: { total: 3, alteradas: 1, alertas: 0 } }, diasComAlteracao: [day(2), day(4)],
      porDia: bp.map((v, i) => ({ data: day(i), alterado: i === 2 || i === 4, itens: [item(i * 2 + 1, "pressao", `${v}/${v >= 140 ? 96 : 82} mmHg`, i, v >= 140 ? "alterada" : "normal", v >= 140 ? "acima de 140/90" : undefined), ...(i === 4 ? [item(90, "glicemia", "64 mg/dL", i, "alterada", "abaixo de 70")] : i < 2 ? [item(80 + i, "glicemia", "104 mg/dL", i)] : [])] })) };
  }
  if (path.startsWith("/care-protocols?templates")) return { deliveryAvailable: true, items: [{ id: 9, isTemplate: true, data: { name: "Modelo exemplo", routines: [{ id: "t1", name: "Manhã", time: "07:30", steps: ["Etapa cadastrada"], weekdays: [1, 2, 3, 4, 5] }], instructions: "", internalNote: "", duration: "continuous" } }] };
  if (path.startsWith("/care-protocols?")) return { deliveryAvailable: true, items: [{ id: 5, isTemplate: false, data: { name: "Rotina exemplo", routines: [{ id: "r1", name: "Manhã", time: "07:30", steps: ["Etapa cadastrada", "Outra etapa cadastrada"], weekdays: [0, 1, 2, 3, 4, 5, 6] }, { id: "r2", name: "Noite", time: "21:00", steps: ["Etapa cadastrada"], weekdays: [1, 3] }], instructions: "Orientação cadastrada pelo profissional", internalNote: "", duration: "continuous" } }] };
  if (path.includes("/care-responses?")) { const snap = { name: "Rotina exemplo", routineName: "Manhã", steps: ["Etapa cadastrada", "Outra etapa cadastrada"], instructions: "" }; return { deliveryAvailable: true, alerts: [{ id: "a1", snapshot: snap, status: "sent", response: "reacao", scheduledAt: day(1) + "T07:30:00", reactionAt: new Date().toISOString() }], items: [{ id: "a1", snapshot: snap, status: "sent", response: "reacao", scheduledAt: day(1) + "T07:30:00", reactionAt: new Date().toISOString() }, { id: "a2", snapshot: snap, status: "sent", response: "realizei", scheduledAt: day(2) + "T07:30:00" }, { id: "a3", snapshot: snap, status: "sent", scheduledAt: day(3) + "T07:30:00" }] }; }
  if (path.startsWith("/patients/lookup")) return { exists: false };
  throw new Error("Prévia de design: nenhuma alteração é enviada ao servidor.");
}
