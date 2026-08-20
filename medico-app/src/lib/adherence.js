// [ADESAO] O backend JÁ coleta adesão e o painel antigo não mostrava.
//
// Como o dado nasce: o cron dispara o lembrete e cria uma pending_action.
// O paciente responde 1 (tomou), 2 (não tomou) ou 3 (efeito colateral), e o
// bot grava em patient_events com type="medication_response" e payload
// { medicationId, medicationName, dose, scheduleTime, response }.
// A rota GET /patients/:phone/history devolve esses eventos (últimos 100).
//
// Aqui transformamos esse fluxo bruto no que o médico precisa ver na consulta:
// "esse paciente tomou 4 de 12 doses da losartana no último mês".
//
// LIMITE IMPORTANTE, e ele precisa aparecer na tela: só existe evento quando
// o paciente RESPONDE. Silêncio não gera registro. Então não dá pra dizer
// "não tomou" a partir da ausência — só "não respondeu". O denominador
// honesto é o total de respostas, não o total de doses esperadas, e é assim
// que a UI apresenta.

export const RESPOSTA = {
  tomou: { label: "Tomou", tipo: "ok", icone: "✅" },
  nao_tomou: { label: "Não tomou", tipo: "alerta", icone: "⚠️" },
  efeito_colateral: { label: "Efeito colateral", tipo: "erro", icone: "🚨" },
};

/** Extrai só os eventos de resposta a lembrete, já com o payload aberto. */
export function extrairRespostas(events = []) {
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
        dose: payload.dose || "",
        scheduleTime: payload.scheduleTime || "",
        resposta: payload.response || null,
      };
    })
    .filter((r) => r.resposta);
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

/**
 * Agrega por medicação, opcionalmente limitando a uma janela de dias.
 * Devolve, por medicationId: totais, taxa e a última resposta.
 */
export function resumoPorMedicacao(events = [], { dias = 30, hoje = new Date() } = {}) {
  const corte = new Date(hoje);
  corte.setDate(corte.getDate() - dias);

  const porMed = new Map();

  for (const r of extrairRespostas(events)) {
    if (r.createdAt && new Date(r.createdAt) < corte) continue;

    const chave = r.medicationId ?? r.medicationName;
    if (!porMed.has(chave)) {
      porMed.set(chave, {
        medicationId: r.medicationId,
        medicationName: r.medicationName,
        tomou: 0,
        nao_tomou: 0,
        efeito_colateral: 0,
        total: 0,
        ultima: null,
      });
    }
    const item = porMed.get(chave);
    if (item[r.resposta] !== undefined) item[r.resposta] += 1;
    item.total += 1;
    if (!item.ultima || new Date(r.createdAt) > new Date(item.ultima.createdAt)) {
      item.ultima = r;
    }
  }

  return [...porMed.values()].map((item) => ({
    ...item,
    // Percentual sobre RESPOSTAS, não sobre doses esperadas — ver nota acima.
    taxa: item.total ? Math.round((item.tomou / item.total) * 100) : null,
  }));
}

/** Sinal para a lista de pacientes: quem precisa de atenção primeiro. */
export function sinalDeAdesao(resumo) {
  if (!resumo?.length) return { nivel: "sem-dados", texto: "Sem resposta registrada" };

  const efeitos = resumo.reduce((s, r) => s + r.efeito_colateral, 0);
  if (efeitos > 0) {
    return { nivel: "erro", texto: `${efeitos} relato(s) de efeito colateral` };
  }

  const tomou = resumo.reduce((s, r) => s + r.tomou, 0);
  const total = resumo.reduce((s, r) => s + r.total, 0);
  if (!total) return { nivel: "sem-dados", texto: "Sem resposta registrada" };

  const taxa = Math.round((tomou / total) * 100);
  if (taxa < 60) return { nivel: "alerta", texto: `${taxa}% de adesão nas respostas` };
  return { nivel: "ok", texto: `${taxa}% de adesão nas respostas` };
}
