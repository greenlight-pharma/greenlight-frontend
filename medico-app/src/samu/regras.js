// [ESPELHO] Cópia das regras de samu.js do backend (greenlight-backend).
//
// Duplicar lógica é ruim e eu não faria isso sem motivo. O motivo é o
// offline: a conferência precisa acusar falta, vencimento e buraco na
// numeração ENQUANTO a pessoa digita, dentro da ambulância, com ou sem rede.
// Chamar o servidor a cada tecla não funciona sem sinal.
//
// Como o risco de divergência é gerenciado: os testes daqui usam os MESMOS
// casos do samu.test.js do backend. Se um lado mudar sozinho, uma das duas
// suítes quebra.
//
// Quem manda é o servidor: ao salvar, ele recalcula e devolve as pendências
// gravadas. O que está aqui é para a pessoa ver na hora, não é o registro.

export const GRAVIDADE = { CRITICA: "critica", ATENCAO: "atencao" };
export const DIAS_AVISO_VALIDADE = 30;
export const VALIDADE = { VENCIDO: "vencido", PROXIMO: "proximo", OK: "ok", AUSENTE: "ausente" };
export const ROTULO_DOCUMENTO = { dos: "DOS", guia_rosa: "Guia rosa" };
export const MAX_FALTANTES_LISTADOS = 200;

// Material hospitalar quase sempre traz MM/AAAA, e o mês inteiro é válido:
// "06/2026" vale até 30/06, não até o dia 1º.
export function lerValidade(texto) {
  const t = String(texto || "").trim();
  if (!t) return null;
  const ymd = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) return diaUtc(+ymd[1], +ymd[2], +ymd[3]);
  const dmy = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) return diaUtc(+dmy[3], +dmy[2], +dmy[1]);
  const my = t.match(/^(\d{1,2})[/-](\d{4})$/);
  if (my) return ultimoDiaDoMes(+my[2], +my[1]);
  const ym = t.match(/^(\d{4})[/-](\d{1,2})$/);
  if (ym) return ultimoDiaDoMes(+ym[1], +ym[2]);
  return null;
}

function diaUtc(ano, mes, dia) {
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  if (d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) return null;
  return d;
}

function ultimoDiaDoMes(ano, mes) {
  if (mes < 1 || mes > 12) return null;
  return new Date(Date.UTC(ano, mes, 0));
}

export function classificarValidade(texto, hoje = new Date(), diasAviso = DIAS_AVISO_VALIDADE) {
  const limite = lerValidade(texto);
  if (!limite) return { estado: VALIDADE.AUSENTE, diasRestantes: null, limite: null };
  const hojeUtc = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));
  const diasRestantes = Math.round((limite - hojeUtc) / 86400000);
  if (diasRestantes < 0) return { estado: VALIDADE.VENCIDO, diasRestantes, limite };
  if (diasRestantes <= diasAviso) return { estado: VALIDADE.PROXIMO, diasRestantes, limite };
  return { estado: VALIDADE.OK, diasRestantes, limite };
}

// [LIMITE-DA-SEQUENCIA] Sem faixa declarada dá para achar buraco NO MEIO,
// mas é impossível saber que faltam os do FIM. Por isso `completa` só é
// verdadeiro contra uma faixa declarada — e a tela precisa dizer a diferença.
export function analisarSequencia(numeros = [], faixa = {}) {
  const lidos = [];
  const invalidos = [];
  for (const bruto of numeros) {
    const texto = String(bruto ?? "").trim();
    if (!texto) continue;
    const so = texto.replace(/\D/g, "");
    if (!so) { invalidos.push(texto); continue; }
    lidos.push({ valor: Number(so), largura: so.length });
  }
  const valores = lidos.map((l) => l.valor);
  const unicos = [...new Set(valores)].sort((a, b) => a - b);
  const duplicados = [...new Set(valores.filter((v, i) => valores.indexOf(v) !== i))].sort((a, b) => a - b);
  const largura = Math.max(1, ...lidos.map((l) => l.largura));
  const inicio = numeroOuNulo(faixa.inicio);
  const fim = numeroOuNulo(faixa.fim);
  const faixaDeclarada = inicio !== null && fim !== null && fim >= inicio;

  if (!unicos.length && !faixaDeclarada) {
    return { quantidade: 0, presentes: [], faltantes: [], duplicados: [], invalidos,
             de: null, ate: null, faixaDeclarada: false, excedeuLimite: false,
             completa: false, largura };
  }

  const de = faixaDeclarada ? inicio : unicos[0];
  const ate = faixaDeclarada ? fim : unicos[unicos.length - 1];
  const presentes = new Set(unicos);
  const faltantes = [];
  let excedeuLimite = false;
  for (let n = de; n <= ate; n++) {
    if (presentes.has(n)) continue;
    if (faltantes.length >= MAX_FALTANTES_LISTADOS) { excedeuLimite = true; break; }
    faltantes.push(n);
  }

  return { quantidade: unicos.length, presentes: unicos, faltantes, duplicados, invalidos,
           de, ate, faixaDeclarada, excedeuLimite,
           completa: faixaDeclarada && faltantes.length === 0 && duplicados.length === 0,
           largura };
}

function numeroOuNulo(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/\D/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function formatarNumeroDocumento(n, largura = 3) {
  return String(n).padStart(largura, "0");
}

export function gerarPendencias(conferencia = {}, hoje = new Date()) {
  const pendencias = [];
  const { itens = [], documentos = [], manuais = [] } = conferencia;

  for (const item of itens) {
    const onde = `${item.grupo} ${item.tamanho}`.trim();
    const bolsa = item.bolsa ? ` (bolsa ${item.bolsa})` : "";
    // "ninguém conferiu" e "conferiu e não tem" mandam procurar em lugares
    // diferentes: não podem virar a mesma frase.
    if (item.quantidade === null || item.quantidade === undefined || item.quantidade === "") {
      pendencias.push({ categoria: "material", gravidade: GRAVIDADE.ATENCAO,
        descricao: `${onde}${bolsa} — não conferido`, referencia: onde });
      continue;
    }
    if (Number(item.quantidade) === 0) {
      pendencias.push({ categoria: "material", gravidade: GRAVIDADE.CRITICA,
        descricao: `${onde}${bolsa} — em falta (quantidade 0)`, referencia: onde });
    }
    const v = classificarValidade(item.validade, hoje);
    if (v.estado === VALIDADE.VENCIDO) {
      pendencias.push({ categoria: "validade", gravidade: GRAVIDADE.CRITICA,
        descricao: `${onde}${bolsa} — VENCIDO (${item.validade})`, referencia: onde });
    } else if (v.estado === VALIDADE.PROXIMO) {
      pendencias.push({ categoria: "validade", gravidade: GRAVIDADE.ATENCAO,
        descricao: `${onde}${bolsa} — vence em ${v.diasRestantes} dia(s) (${item.validade})`,
        referencia: onde });
    }
  }

  for (const doc of documentos) {
    const rotulo = ROTULO_DOCUMENTO[doc.tipo] || "Documento";
    const s = analisarSequencia(doc.numeros, doc.faixa);
    for (const n of s.faltantes) {
      pendencias.push({ categoria: "documento", gravidade: GRAVIDADE.ATENCAO,
        descricao: `${rotulo} nº ${formatarNumeroDocumento(n, s.largura)} não localizado`,
        referencia: `${doc.tipo}:${n}` });
    }
    for (const n of s.duplicados) {
      pendencias.push({ categoria: "documento", gravidade: GRAVIDADE.CRITICA,
        descricao: `${rotulo} nº ${formatarNumeroDocumento(n, s.largura)} lançado mais de uma vez`,
        referencia: `${doc.tipo}:dup:${n}` });
    }
  }

  for (const m of manuais) {
    if (!String(m?.descricao || "").trim()) continue;
    pendencias.push({ categoria: "manual",
      gravidade: m.gravidade === GRAVIDADE.CRITICA ? GRAVIDADE.CRITICA : GRAVIDADE.ATENCAO,
      descricao: String(m.descricao).trim(), referencia: null });
  }

  const peso = { [GRAVIDADE.CRITICA]: 0, [GRAVIDADE.ATENCAO]: 1 };
  return pendencias.sort((a, b) => (peso[a.gravidade] ?? 9) - (peso[b.gravidade] ?? 9));
}

export function resumoDaConferencia(pendencias = []) {
  const criticas = pendencias.filter((p) => p.gravidade === GRAVIDADE.CRITICA).length;
  return { total: pendencias.length, criticas, atencao: pendencias.length - criticas,
           liberado: pendencias.length === 0 };
}
