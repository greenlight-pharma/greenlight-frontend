// [PREVIA] Dados sintéticos do painel de administração (/admin?previa=1, só em desenvolvimento).
const d = (n: number) => new Date(Date.now() + n * 86400000).toISOString();
const usuarios = [
  { id: 12, nome: "Helena Prado", email: "helena@exemplo.com", profissao: "medico", crm: "CRM/PR 12345", criadoEm: d(-3), ultimoAcessoEm: d(0), planoId: "clinica", planoNome: "Clínica", origem: "cartao", pago: true, ate: d(24), renova: true, ciclo: "mensal", statusPagamento: "ativa", receitaMensal: 52990, pacientes: 41, limite: 60, cortesia: null },
  { id: 9, nome: "Marcos Tavares", email: "marcos@exemplo.com", profissao: "enfermeiro", crm: null, criadoEm: d(-40), ultimoAcessoEm: d(-1), planoId: "essencial", planoNome: "Essencial", origem: "pix", pago: true, ate: d(3), renova: false, ciclo: "mensal", statusPagamento: "ativa", receitaMensal: 15992, pacientes: 14, limite: 20, cortesia: null },
  { id: 7, nome: "Clínica Bem Viver", email: "contato@exemplo.com", profissao: "medico", crm: "CRM/SP 998", criadoEm: d(-60), ultimoAcessoEm: d(-2), planoId: "rede", planoNome: "Rede", origem: "cortesia", pago: false, ate: d(80), renova: false, ciclo: null, statusPagamento: null, receitaMensal: 0, pacientes: 22, limite: 150, cortesia: { planoId: "rede", ate: d(80), motivo: "Piloto" } },
  { id: 5, nome: "Ana Ribeiro", email: "ana@exemplo.com", profissao: "nutricionista", crm: "CRN 55", criadoEm: d(-9), ultimoAcessoEm: d(-9), planoId: "gratuito", planoNome: "Gratuito", origem: "gratuito", pago: false, ate: null, renova: null, ciclo: null, statusPagamento: null, receitaMensal: 0, pacientes: 2, limite: 2, cortesia: null },
];
const pagamentos = [
  { id: "sub_1", doctorId: 12, nome: "Helena Prado", email: "helena@exemplo.com", planoNome: "Clínica", status: "ativa", tipo: "cartao", ciclo: "mensal", teste: false, cupom: null, valor: null, em: d(-3), ate: d(24) },
  { id: "or_2", doctorId: 9, nome: "Marcos Tavares", email: "marcos@exemplo.com", planoNome: "Essencial", status: "ativa", tipo: "pix", ciclo: "mensal", teste: false, cupom: "LANCA20", valor: 15992, em: d(-27), ate: d(3) },
  { id: "or_3", doctorId: 5, nome: "Ana Ribeiro", email: "ana@exemplo.com", planoNome: "Essencial", status: "expirada", tipo: "pix", ciclo: "mensal", teste: false, cupom: null, valor: 19990, em: d(-8), ate: null },
];
const cupons = [
  { codigo: "LANCA20", descricao: "Lançamento", tipo: "percentual", valor: 20, planos: ["essencial", "clinica"], ciclo: null, cobrancas: 3, maxUsos: 100, validoAte: d(100), ativo: true, createdAt: d(-30), usos: 1, descontoTotal: 3998 },
  { codigo: "CONGRESSO", descricao: "Congresso SBC", tipo: "valor", valor: 5000, planos: null, ciclo: "anual", cobrancas: 1, maxUsos: null, validoAte: d(-2), ativo: true, createdAt: d(-60), usos: 0, descontoTotal: 0 },
];
const acoes = [
  { id: "2", quem: "admin@vytal", acao: "usuario.plano", alvo: "7", alvoNome: "Clínica Bem Viver", dados: { de: "gratuito", para: "rede", ate: d(80), motivo: "Piloto" }, em: d(-1) },
  { id: "1", quem: "admin@vytal", acao: "cupom.criar", alvo: "LANCA20", dados: { tipo: "percentual", valor: 20 }, em: d(-30) },
];

export function adminDemo(path: string, method: string): unknown {
  if (method !== "GET") return { ok: true };
  if (path.startsWith("/admin/care/resumo")) return { contas: 38, novas7d: 5, novas30d: 17, ativas7d: 21, comPacientes: 24, pacientes: 312, pagantes: 9, cortesias: 2, conversao: 9 / 38, receitaMensal: 268350,
    porPlano: { essencial: { nome: "Essencial", pagantes: 6, cortesia: 1 }, clinica: { nome: "Clínica", pagantes: 2, cortesia: 0 }, rede: { nome: "Rede", pagantes: 1, cortesia: 1 } }, porOrigem: { cartao: 5, pix: 4, apple: 0 },
    vencendo: [{ id: 9, nome: "Marcos Tavares", email: "marcos@exemplo.com", planoNome: "Essencial", origem: "pix", ate: d(3) }],
    mensagens: { mes: new Date().toISOString().slice(0, 7), total: 18230, cobraveis: 16900, custoEstimado: 59150 }, pausas: { pacientes: 0, contas: 0 }, cupons: { ativos: 2, usos: 1 }, pagamentos };
  if (path.startsWith("/admin/care/usuarios/")) {
    const u = usuarios.find((x) => path.endsWith(`/${x.id}`)) ?? usuarios[0];
    return { usuario: { id: u.id, name: u.nome, email: u.email, profissao: u.profissao, crm: u.crm, createdAt: u.criadoEm, plano: u.cortesia?.planoId ?? "gratuito", planoAte: u.cortesia?.ate ?? null, planoMotivo: u.cortesia?.motivo ?? null, ultimoAcessoEm: u.ultimoAcessoEm },
      plano: { plano: { id: u.planoId, nome: u.planoNome, limitePacientes: u.limite }, usados: u.pacientes, limite: u.limite, franquia: { mensagens: u.pacientes * 70, limite: u.limite * 120, percentual: (u.pacientes * 70 * 100) / (u.limite * 120) }, web: u.origem === "cartao" || u.origem === "pix" ? { status: "ativa", tipo: u.origem, expiraEm: u.ate } : null, assinatura: null, vencimento: null },
      pausados: 0, pagamentos: pagamentos.filter((p) => p.doctorId === u.id), apple: [], cupons: u.id === 9 ? [{ codigo: "LANCA20", externoId: "or_2", desconto: 3998, createdAt: d(-27) }] : [], acoes: acoes.filter((a) => a.alvo === String(u.id)) };
  }
  if (path.startsWith("/admin/care/usuarios")) {
    const f = new URLSearchParams(path.split("?")[1]).get("filtro");
    const list = usuarios.filter((u) => !f || f === "todos" || (f === "pagantes" ? u.pago : f === "vencendo" ? u.id === 9 : u.origem === f));
    return { total: list.length, usuarios: list };
  }
  if (path.startsWith("/admin/care/cupons")) return cupons;
  if (path.startsWith("/admin/care/acoes")) return acoes;
  return {};
}
