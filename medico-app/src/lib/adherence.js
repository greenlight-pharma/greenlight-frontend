// [ADESAO] O backend JÁ coleta adesão e o painel antigo não mostrava.
//
// Como o dado nasce: o cron dispara o lembrete nos horários da prescrição.
// O paciente responde tomou / não tomou / efeito colateral, e o bot grava em
// patient_events com type="medication_response". A rota
// GET /patients/:phone/history devolve esses eventos.
//
// ============================================================
// [TRES-ESTADOS] Por que o denominador é doses ESPERADAS
//
// A primeira versão deste módulo calculava adesão sobre as RESPOSTAS
// recebidas. Isso escondia a informação mais importante: o silêncio.
//
// Existem três desfechos, não dois, e eles são clinicamente opostos:
//
//   confirmada     paciente tomou e avisou
//   recusada       paciente NÃO tomou e avisou — está engajado, relatou um
//                  problema (efeito colateral, acesso, esquecimento)
//   sem resposta   não sabemos nada. Pode ter tomado e ignorado a mensagem,
//                  pode ter abandonado o tratamento, pode ter trocado de
//                  número.
//
// Tratar silêncio como "não tomou" é inventar dado. Tratá-lo como inexistente
// (dividir só pelas respostas) infla a adesão e some com o paciente que parou
// de responder — justamente o que precisa de busca ativa.
//
// Como a prescrição tem horários, data de início e duração, dá para saber
// quantas doses eram esperadas. Esse é o denominador honesto, e é o número
// que sustenta conversa com a Secretaria de Saúde.
// ============================================================

import { parseScheduleTimes } from "./schedule.js";

export const RESPOSTA = {
  tomou: { label: "Tomou", tipo: "ok", icone: "✅" },
  nao_tomou: { label: "Não tomou", tipo: "alerta", icone: "⚠️" },
  efeito_colateral: { label: "Efeito colateral", tipo: "erro", icone: "🚨" },
};

const DIA_MS = 86400000;
const soData = (d) => new Date(d).toISOString().slice(0, 10);

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

// ============================================================
// [UMA-RESPOSTA-POR-DOSE] O botão do WhatsApp não expira.
//
// Em 2/set/2026 um paciente clicou "Já tomei" às 20h e, horas depois,
// "Ainda não tomei" na MESMA mensagem. Cada clique virava um evento
// independente: a dose contou duas vezes, uma confirmada e outra recusada.
//
// Corrigir a própria resposta é legítimo — é até desejável, porque a pessoa
// que volta para consertar está engajada. O que não pode é a correção virar
// uma segunda dose.
//
// Então: guardamos TODOS os eventos (o histórico é auditoria e não se
// apaga) e, na contagem, ficamos com a ÚLTIMA resposta de cada dose.
//
// A identidade da dose vem do payload do botão (doseEm). Para eventos
// antigos, que não têm, caímos em medicação + dia + horário. E quando nem
// isso existe — respostas da Cloud API antes desta correção, que gravavam
// scheduleTime null — cada evento fica sozinho no seu grupo, porque agrupar
// no chute seria descartar resposta legítima.
// ============================================================
// [DUAS-CATEGORIAS] "Tomei" e "não tomei" são a MESMA pergunta — a segunda
// resposta corrige a primeira. Efeito colateral é outra coisa: um relato
// clínico, que convive com qualquer das duas. Tomar o remédio e depois passar
// mal é justamente o caso que mais importa registrar.
//
// Um teste que já existia pegou isso: sem separar as categorias, a correção
// apagava o relato de efeito colateral, ou vice-versa.
function categoriaDaResposta(resposta) {
  return resposta === "efeito_colateral" ? "efeito" : "adesao";
}

// [DOSE-LEGADA] Eventos gravados ANTES do carimbo de dose no botão (até
// 2/set/2026) chegam sem `doseEm` e sem `scheduleTime` — e era justamente
// nesses que o clique de correção contava dobrado, porque cada um ficava
// sozinho no seu grupo. Não dá para carimbá-los depois, mas dá para dizer em
// QUAL JANELA a resposta caiu: a dose agendada mais recente antes dela.
//
// A atribuição só vale quando a janela é inequívoca — ou seja, quando a
// resposta chegou ANTES do próximo horário agendado. Paciente que responde
// duas mensagens atrasadas de uma vez (a das 08h e a das 20h, ambas às 21h)
// cai fora da regra e mantém os dois eventos separados: aí agrupar seria
// descartar resposta legítima, que é o erro oposto e pior.
function janelaDaDose(r, med) {
  if (!med || !r.createdAt) return null;
  const { ok, times } = parseScheduleTimes(med.scheduleTimes);
  if (!ok || !times.length) return null;
  const quando = new Date(r.createdAt);
  if (Number.isNaN(quando.getTime())) return null;

  const emDia = (base, hhmm) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    const d = new Date(base);
    d.setHours(hh, mm, 0, 0);
    return d;
  };
  // Candidatos de ontem, hoje e amanhã cobrem a janela que cruza a meia-noite.
  const marcos = [];
  for (const dia of [-1, 0, 1]) {
    const base = new Date(quando.getTime() + dia * DIA_MS);
    for (const t of times) marcos.push(emDia(base, t));
  }
  marcos.sort((a, b) => a - b);

  let atual = null;
  let proximo = null;
  for (const m of marcos) {
    if (m <= quando) atual = m;
    else if (proximo === null) proximo = m;
  }
  if (!atual) return null;
  if (proximo && quando >= proximo) return null; // ambíguo: já passou a dose seguinte
  return atual.toISOString();
}

function chaveDaDose(r, med) {
  const cat = categoriaDaResposta(r.resposta);
  if (r.doseEm) return `${r.medicationId}|${r.doseEm}|${cat}`;
  if (r.scheduleTime) {
    return `${r.medicationId}|${soData(r.createdAt)}|${r.scheduleTime}|${cat}`;
  }
  const janela = janelaDaDose(r, med);
  if (janela) return `${r.medicationId}|janela:${janela}|${cat}`;
  return `evento|${r.id}`;
}

/** Extrai só os eventos de resposta a lembrete, já com o payload aberto. */
export function extrairRespostas(events = [], medications = []) {
  const porId = new Map((medications || []).map((m) => [m.id, m]));
  const todas = events
    .filter((e) => e?.type === "medication_response")
    .map((e) => {
      const payload =
        typeof e.payload === "string" ? safeParse(e.payload) : e.payload || {};
      return {
        id: e.id,
        createdAt: e.createdAt,
        medicationId: payload.medicationId,
        medicationName: payload.medicationName || "",
        dose: payload.dose || "",
        scheduleTime: payload.scheduleTime || "",
        doseEm: payload.doseEm || null,
        resposta: payload.response || null,
      };
    })
    .filter((r) => r.resposta);

  // Mais recente primeiro; o primeiro de cada dose é o que vale.
  const ordenadas = [...todas].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const vistas = new Set();
  const finais = [];
  for (const r of ordenadas) {
    const chave = chaveDaDose(r, porId.get(r.medicationId));
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    finais.push(r);
  }
  // Devolve na ordem cronológica original, que é o que as telas esperam.
  return finais.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/**
 * Todas as respostas, inclusive as substituídas. Para o histórico da tela,
 * onde ver que o paciente mudou de ideia é informação, não ruído.
 */
export function extrairRespostasBrutas(events = []) {
  return events
    .filter((e) => e?.type === "medication_response")
    .map((e) => {
      const payload =
        typeof e.payload === "string" ? safeParse(e.payload) : e.payload || {};
      return {
        id: e.id,
        createdAt: e.createdAt,
        medicationId: payload.medicationId,
        medicationName: payload.medicationName || "",
        scheduleTime: payload.scheduleTime || "",
        doseEm: payload.doseEm || null,
        resposta: payload.response || null,
      };
    })
    .filter((r) => r.resposta);
}

/**
 * Quantas doses já deveriam ter sido tomadas, dentro da janela analisada.
 *
 * Dois cuidados que mudam o número na tela:
 *
 * 1. Nunca conta dose no futuro. Às 10h, a dose das 20h de hoje ainda não
 *    aconteceu — incluí-la faria a adesão parecer pior a manhã inteira e
 *    "melhorar" sozinha ao anoitecer.
 * 2. Respeita início e término da prescrição. Medicação iniciada há 3 dias
 *    não pode ser cobrada por 30.
 */
export function dosesEsperadas(med, { dias = 30, agora = new Date() } = {}) {
  const horarios = parseScheduleTimes(med?.scheduleTimes);
  if (!horarios.ok || !horarios.times.length) return 0;

  const inicioJanela = new Date(agora.getTime() - (dias - 1) * DIA_MS);
  const inicioPrescricao = med.startDate
    ? new Date(`${soData(med.startDate)}T00:00:00`)
    : null;
  const fimPrescricao = med.endDate
    ? new Date(`${soData(med.endDate)}T23:59:59`)
    : null;

  const inicio =
    inicioPrescricao && inicioPrescricao > inicioJanela ? inicioPrescricao : inicioJanela;
  const fim = fimPrescricao && fimPrescricao < agora ? fimPrescricao : agora;
  if (fim < inicio) return 0;

  const primeiroDia = soData(inicio);
  const ultimoDia = soData(fim);
  const totalDias =
    Math.round(
      (new Date(`${ultimoDia}T00:00:00`) - new Date(`${primeiroDia}T00:00:00`)) / DIA_MS
    ) + 1;
  if (totalDias <= 0) return 0;

  // Dias completos contam todos os horários.
  let total = (totalDias - 1) * horarios.times.length;

  // No último dia, só os horários que já passaram.
  const ehHoje = ultimoDia === soData(agora);
  const horaCorte = ehHoje
    ? `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`
    : "23:59";
  total += horarios.times.filter((t) => t <= horaCorte).length;

  return Math.max(0, total);
}

/**
 * Resumo por medicação com os TRÊS estados e o denominador real.
 * `medications` vem do /summary; `events`, do /history.
 */
export function resumoPorMedicacao(
  events = [],
  medications = [],
  { dias = 30, agora = new Date() } = {}
) {
  const corte = new Date(agora.getTime() - dias * DIA_MS);
  const porMed = new Map();

  for (const med of medications) {
    porMed.set(med.id, {
      medicationId: med.id,
      medicationName: med.medicationName || "",
      dose: med.dose || "",
      esperadas: dosesEsperadas(med, { dias, agora }),
      tomou: 0,
      nao_tomou: 0,
      efeito_colateral: 0,
      respondidas: 0,
      ultima: null,
    });
  }

  for (const r of extrairRespostas(events, medications)) {
    if (r.createdAt && new Date(r.createdAt) < corte) continue;

    // Resposta de medicação fora da lista (arquivada, por exemplo) ainda
    // aparece — sem denominador, mas sem sumir do histórico clínico.
    if (!porMed.has(r.medicationId)) {
      porMed.set(r.medicationId, {
        medicationId: r.medicationId,
        medicationName: r.medicationName,
        dose: r.dose,
        esperadas: 0,
        tomou: 0,
        nao_tomou: 0,
        efeito_colateral: 0,
        respondidas: 0,
        ultima: null,
      });
    }

    const item = porMed.get(r.medicationId);
    if (item[r.resposta] !== undefined) item[r.resposta] += 1;
    item.respondidas += 1;
    if (!item.ultima || new Date(r.createdAt) > new Date(item.ultima.createdAt)) {
      item.ultima = r;
    }
  }

  return [...porMed.values()].map((item) => {
    // "Sem resposta" nunca fica negativo: se houver mais respostas que doses
    // esperadas (reenvio, teste), o excesso não vira número impossível na
    // tela do médico.
    const semResposta = Math.max(0, item.esperadas - item.respondidas);
    return {
      ...item,
      semResposta,
      // Percentual sobre doses ESPERADAS. Sem prescrição datada não há
      // denominador — devolve null em vez de um número inventado.
      taxaConfirmada: item.esperadas
        ? Math.round((item.tomou / item.esperadas) * 100)
        : null,
      taxaSilencio: item.esperadas
        ? Math.round((semResposta / item.esperadas) * 100)
        : null,
    };
  });
}

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/**
 * Mapa de falhas: em quais DIAS e HORÁRIOS o tratamento furou.
 * É o que o médico olha na consulta seguinte para achar padrão —
 * "sempre a dose da noite", "sempre no fim de semana".
 *
 * [SILENCIO-POR-HORARIO] Contar só as doses respondidas engana justamente
 * onde mais importa. Um horário em que o paciente PARA DE RESPONDER aparece
 * com zero falhas declaradas e parece o melhor horário do tratamento —
 * quando na verdade é onde ele sumiu. Por isso o mapa por horário compara
 * com as doses ESPERADAS naquele horário, e separa silêncio de recusa.
 */
export function mapaDeFalhas(events = [], medications = [], { dias = 30, agora = new Date() } = {}) {
  const corte = new Date(agora.getTime() - dias * DIA_MS);
  const porHorario = new Map();
  const porDiaSemana = new Map();

  for (const r of extrairRespostas(events, medications)) {
    if (!r.createdAt || new Date(r.createdAt) < corte) continue;

    const falhou = r.resposta === "nao_tomou";
    const quando = new Date(r.createdAt);

    const horario = r.scheduleTime || `${String(quando.getHours()).padStart(2, "0")}:00`;
    if (!porHorario.has(horario)) {
      porHorario.set(horario, { horario, total: 0, falhas: 0 });
    }
    const h = porHorario.get(horario);
    h.total += 1;
    if (falhou) h.falhas += 1;

    const indice = quando.getDay();
    const nomeDia = DIAS_SEMANA[indice];
    if (!porDiaSemana.has(nomeDia)) {
      porDiaSemana.set(nomeDia, { dia: nomeDia, indice, total: 0, falhas: 0 });
    }
    const d = porDiaSemana.get(nomeDia);
    d.total += 1;
    if (falhou) d.falhas += 1;
  }

  // Doses esperadas em cada horário, somando todas as prescrições que o
  // usam. Sem isso não dá para saber que 20:00 tem 13 respostas de 30
  // doses — ou seja, 17 silêncios.
  const esperadasPorHorario = new Map();
  for (const med of medications) {
    const horarios = parseScheduleTimes(med?.scheduleTimes);
    if (!horarios.ok) continue;
    const totalMed = dosesEsperadas(med, { dias, agora });
    if (!totalMed || !horarios.times.length) continue;
    // As doses se distribuem entre os horários da prescrição.
    const porSlot = totalMed / horarios.times.length;
    for (const t of horarios.times) {
      esperadasPorHorario.set(t, (esperadasPorHorario.get(t) || 0) + porSlot);
    }
  }

  const horarios = new Set([...porHorario.keys(), ...esperadasPorHorario.keys()]);
  const linhasHorario = [...horarios].map((h) => {
    const obs = porHorario.get(h) || { total: 0, falhas: 0 };
    const esperadas = Math.round(esperadasPorHorario.get(h) || 0);
    return {
      horario: h,
      esperadas,
      respondidas: obs.total,
      falhas: obs.falhas,
      semResposta: Math.max(0, esperadas - obs.total),
    };
  });

  return {
    porHorario: linhasHorario.sort((a, b) => a.horario.localeCompare(b.horario)),
    porDiaSemana: [...porDiaSemana.values()].sort((a, b) => a.indice - b.indice),
  };
}

/**
 * Evolução ao longo do período, agrupada por semana.
 * Responde a "está melhorando ou piorando?", que é a pergunta que muda
 * conduta na consulta seguinte.
 */
export function evolucaoSemanal(
  events = [],
  medications = [],
  { semanas = 4, agora = new Date() } = {}
) {
  const respostas = extrairRespostas(events, medications);
  const saida = [];

  for (let i = semanas - 1; i >= 0; i--) {
    const fim = new Date(agora.getTime() - i * 7 * DIA_MS);
    const inicio = new Date(fim.getTime() - 6 * DIA_MS);

    let tomou = 0;
    let naoTomou = 0;
    for (const r of respostas) {
      const q = new Date(r.createdAt);
      if (q < inicio || q > fim) continue;
      if (r.resposta === "tomou") tomou += 1;
      if (r.resposta === "nao_tomou") naoTomou += 1;
    }

    const esperadas = medications.reduce(
      (soma, med) => soma + dosesEsperadas(med, { dias: 7, agora: fim }),
      0
    );

    saida.push({
      inicio: soData(inicio),
      fim: soData(fim),
      rotulo: i === 0 ? "Esta semana" : `${i} sem. atrás`,
      tomou,
      naoTomou,
      esperadas,
      semResposta: Math.max(0, esperadas - tomou - naoTomou),
      taxa: esperadas ? Math.round((tomou / esperadas) * 100) : null,
    });
  }

  return saida;
}

/** Sinal para a lista de pacientes: quem precisa de atenção primeiro. */
export function sinalDeAdesao(resumo) {
  if (!resumo?.length) return { nivel: "sem-dados", texto: "Sem prescrição ativa" };

  const efeitos = resumo.reduce((s, r) => s + r.efeito_colateral, 0);
  if (efeitos > 0) {
    return { nivel: "erro", texto: `${efeitos} relato(s) de efeito colateral` };
  }

  const esperadas = resumo.reduce((s, r) => s + r.esperadas, 0);
  if (!esperadas) return { nivel: "sem-dados", texto: "Sem doses esperadas no período" };

  const tomou = resumo.reduce((s, r) => s + r.tomou, 0);
  const respondidas = resumo.reduce((s, r) => s + r.respondidas, 0);
  const silencio = Math.max(0, esperadas - respondidas);

  // Silêncio alto é sinal próprio, e mais urgente que adesão baixa declarada:
  // o paciente que avisa que não tomou está no radar; o que sumiu, não está.
  if (silencio / esperadas > 0.5) {
    return {
      nivel: "alerta",
      texto: `${Math.round((silencio / esperadas) * 100)}% dos lembretes sem resposta`,
    };
  }

  const taxa = Math.round((tomou / esperadas) * 100);
  if (taxa < 60) return { nivel: "alerta", texto: `${taxa}% de adesão confirmada` };
  return { nivel: "ok", texto: `${taxa}% de adesão confirmada` };
}
