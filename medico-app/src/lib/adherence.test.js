import { describe, it, expect } from "vitest";
import {
  extrairRespostas,
  extrairRespostasBrutas,
  dosesEsperadas,
  resumoPorMedicacao,
  mapaDeFalhas,
  evolucaoSemanal,
  sinalDeAdesao,
} from "./adherence.js";

// Data fixa: os testes não podem mudar de resultado conforme a hora em que rodam.
const AGORA = new Date("2026-08-31T12:00:00");
const DIA = 86400000;

const ev = (resposta, diasAtras, medId = 1, nome = "Losartana", horario = "08:00") => ({
  id: `${medId}-${diasAtras}-${resposta}-${Math.random()}`,
  type: "medication_response",
  createdAt: new Date(AGORA.getTime() - diasAtras * DIA).toISOString(),
  payload: { medicationId: medId, medicationName: nome, scheduleTime: horario, response: resposta },
});

const medicacao = (extra = {}) => ({
  id: 1,
  medicationName: "Losartana",
  dose: "50mg",
  scheduleTimes: "08:00,20:00",
  startDate: "2026-08-01",
  endDate: null,
  status: "ativo",
  ...extra,
});

describe("extrairRespostas", () => {
  it("ignora eventos que não são resposta de medicação", () => {
    expect(extrairRespostas([ev("tomou", 1), { type: "checkin", payload: {} }])).toHaveLength(1);
  });

  it("aceita payload em string (jsonb devolvido como texto)", () => {
    const e = ev("tomou", 1);
    e.payload = JSON.stringify(e.payload);
    expect(extrairRespostas([e])[0].resposta).toBe("tomou");
  });
});

describe("dosesEsperadas", () => {
  it("2x ao dia em 30 dias, contando só o que já passou hoje", () => {
    // 29 dias completos × 2 = 58, mais hoje: às 12:00 só a dose das 08:00
    // já aconteceu → 59.
    expect(dosesEsperadas(medicacao(), { dias: 30, agora: AGORA })).toBe(59);
  });

  it("NÃO conta dose futura — a das 20h ainda não aconteceu ao meio-dia", () => {
    expect(dosesEsperadas(medicacao(), { dias: 1, agora: AGORA })).toBe(1);
    expect(
      dosesEsperadas(medicacao(), { dias: 1, agora: new Date("2026-08-31T21:00:00") })
    ).toBe(2);
  });

  it("respeita a data de início: prescrição de 3 dias não é cobrada por 30", () => {
    // 29 e 30 completos (4 doses) + hoje só a das 08:00 = 5
    expect(dosesEsperadas(medicacao({ startDate: "2026-08-29" }), { dias: 30, agora: AGORA })).toBe(5);
  });

  it("respeita a data de término: para de contar quando o tratamento acabou", () => {
    const med = medicacao({ startDate: "2026-08-01", endDate: "2026-08-07" });
    expect(dosesEsperadas(med, { dias: 30, agora: AGORA })).toBe(14); // 7 dias × 2
  });

  it("horário em formato legado não gera denominador inventado", () => {
    expect(dosesEsperadas(medicacao({ scheduleTimes: "8;00 e 20;00" }), { agora: AGORA })).toBe(0);
  });

  it("prescrição que ainda não começou devolve zero", () => {
    expect(dosesEsperadas(medicacao({ startDate: "2026-12-01" }), { agora: AGORA })).toBe(0);
  });
});

describe("resumoPorMedicacao — os três estados", () => {
  const oitoTomouDoisNao = [
    ...Array.from({ length: 8 }, (_, i) => ev("tomou", i)),
    ...Array.from({ length: 2 }, (_, i) => ev("nao_tomou", i + 8)),
  ];

  it("silêncio é contado, não descartado", () => {
    const [r] = resumoPorMedicacao(oitoTomouDoisNao, [medicacao()], { dias: 30, agora: AGORA });
    expect(r.esperadas).toBe(59);
    expect(r.tomou).toBe(8);
    expect(r.nao_tomou).toBe(2);
    expect(r.respondidas).toBe(10);
    expect(r.semResposta).toBe(49);
  });

  // O ponto que motivou a mudança: os dois cálculos contam histórias opostas.
  it("a taxa antiga (sobre respostas) inflava a adesão", () => {
    const [r] = resumoPorMedicacao(oitoTomouDoisNao, [medicacao()], { dias: 30, agora: AGORA });
    const taxaAntiga = Math.round((r.tomou / r.respondidas) * 100);

    expect(taxaAntiga).toBe(80);
    expect(r.taxaConfirmada).toBe(14);
    // Paciente que praticamente abandonou o tratamento aparecia como 80%.
  });

  it("sem prescrição datada devolve null em vez de número inventado", () => {
    const [r] = resumoPorMedicacao([ev("tomou", 1)], [medicacao({ scheduleTimes: "8;00" })], {
      agora: AGORA,
    });
    expect(r.esperadas).toBe(0);
    expect(r.taxaConfirmada).toBeNull();
  });

  it("resposta de medicação arquivada não some do histórico", () => {
    const r = resumoPorMedicacao([ev("tomou", 1, 99, "Amoxicilina")], [medicacao()], { agora: AGORA });
    expect(r).toHaveLength(2);
    expect(r.find((x) => x.medicationId === 99).tomou).toBe(1);
  });

  it("sem resposta nunca fica negativo", () => {
    const eventos = Array.from({ length: 200 }, (_, i) => ev("tomou", i % 5));
    const [r] = resumoPorMedicacao(eventos, [medicacao()], { dias: 30, agora: AGORA });
    expect(r.semResposta).toBeGreaterThanOrEqual(0);
  });
});

describe("mapaDeFalhas", () => {
  it("encontra o horário que mais falha", () => {
    const eventos = [
      ev("tomou", 1, 1, "Losartana", "08:00"),
      ev("tomou", 2, 1, "Losartana", "08:00"),
      ev("nao_tomou", 1, 1, "Losartana", "20:00"),
      ev("nao_tomou", 2, 1, "Losartana", "20:00"),
      ev("nao_tomou", 3, 1, "Losartana", "20:00"),
    ];
    const { porHorario } = mapaDeFalhas(eventos, [medicacao()], { agora: AGORA });

    expect(porHorario.find((h) => h.horario === "08:00").falhas).toBe(0);
    expect(porHorario.find((h) => h.horario === "20:00").falhas).toBe(3);
  });

  // [SILENCIO-POR-HORARIO] O defeito que a versão anterior tinha: um horário
  // onde o paciente PARA DE RESPONDER aparecia com zero falhas e parecia o
  // melhor do tratamento.
  it("enxerga o horário em que o paciente sumiu, não só onde ele recusou", () => {
    // Manhã: responde sempre. Noite: só respondeu 2 vezes em 30 dias.
    const eventos = [
      ...Array.from({ length: 25 }, (_, i) => ev("tomou", i, 1, "Losartana", "08:00")),
      ev("tomou", 1, 1, "Losartana", "20:00"),
      ev("tomou", 2, 1, "Losartana", "20:00"),
    ];
    const { porHorario } = mapaDeFalhas(eventos, [medicacao()], { dias: 30, agora: AGORA });

    const manha = porHorario.find((h) => h.horario === "08:00");
    const noite = porHorario.find((h) => h.horario === "20:00");

    // Nenhum dos dois tem recusa declarada...
    expect(manha.falhas).toBe(0);
    expect(noite.falhas).toBe(0);
    // ...mas o silêncio da noite é gritante, e agora aparece.
    expect(noite.semResposta).toBeGreaterThan(manha.semResposta * 2);
  });

  it("agrupa por dia da semana em ordem cronológica", () => {
    const { porDiaSemana } = mapaDeFalhas(
      [ev("nao_tomou", 0), ev("nao_tomou", 1), ev("tomou", 2)],
      [medicacao()],
      { agora: AGORA }
    );
    const indices = porDiaSemana.map((d) => d.indice);
    expect([...indices].sort((a, b) => a - b)).toEqual(indices);
  });
});

describe("evolucaoSemanal", () => {
  it("devolve uma linha por semana, da mais antiga para a atual", () => {
    const e = evolucaoSemanal([ev("tomou", 1)], [medicacao()], { semanas: 4, agora: AGORA });
    expect(e).toHaveLength(4);
    expect(e[3].rotulo).toBe("Esta semana");
    expect(new Date(e[0].inicio) < new Date(e[3].inicio)).toBe(true);
  });

  it("mostra melhora quando as respostas se concentram na semana atual", () => {
    const eventos = [
      ...Array.from({ length: 10 }, (_, i) => ev("tomou", i % 6)),
      ev("tomou", 25),
    ];
    const e = evolucaoSemanal(eventos, [medicacao()], { semanas: 4, agora: AGORA });
    expect(e[3].tomou).toBeGreaterThan(e[0].tomou);
  });
});

describe("sinalDeAdesao", () => {
  it("efeito colateral tem prioridade sobre qualquer taxa", () => {
    const resumo = resumoPorMedicacao([ev("tomou", 1), ev("efeito_colateral", 1)], [medicacao()], {
      agora: AGORA,
    });
    expect(sinalDeAdesao(resumo).nivel).toBe("erro");
  });

  // Silêncio é sinal próprio: quem avisa que não tomou está no radar;
  // quem sumiu, não está.
  it("silêncio alto vira alerta com texto próprio", () => {
    const s = sinalDeAdesao(resumoPorMedicacao([ev("tomou", 1)], [medicacao()], { agora: AGORA }));
    expect(s.nivel).toBe("alerta");
    expect(s.texto).toMatch(/sem resposta/);
  });

  it("sem doses esperadas não inventa número", () => {
    const resumo = resumoPorMedicacao([], [medicacao({ scheduleTimes: "8;00" })], { agora: AGORA });
    expect(sinalDeAdesao(resumo).nivel).toBe("sem-dados");
  });
});

// ------------------------------------------------------------
// [UMA-RESPOSTA-POR-DOSE] O bug de 2/set/2026: o paciente clicou "Já tomei"
// e, horas depois, "Ainda não tomei" na MESMA mensagem. Contou duas doses.
describe("uma resposta por dose", () => {
  const comDose = (resposta, doseEm, minutosDepois) => ({
    id: `${resposta}-${minutosDepois}`,
    type: "medication_response",
    createdAt: new Date(AGORA.getTime() + minutosDepois * 60000).toISOString(),
    payload: {
      medicationId: 1,
      medicationName: "Losartana",
      doseEm,
      scheduleTime: "08:00",
      response: resposta,
    },
  });

  it("clicar de novo na mesma mensagem CORRIGE, não soma outra dose", () => {
    const eventos = [
      comDose("tomou", "2026-08-31T08:00", 0),
      comDose("nao_tomou", "2026-08-31T08:00", 240), // 4h depois, mesma dose
    ];
    const r = extrairRespostas(eventos);
    expect(r).toHaveLength(1);
    expect(r[0].resposta).toBe("nao_tomou"); // vale a última
  });

  it("doses diferentes do mesmo remédio continuam contando separado", () => {
    const eventos = [
      comDose("tomou", "2026-08-31T08:00", 0),
      comDose("tomou", "2026-08-31T20:00", 720),
    ];
    expect(extrairRespostas(eventos)).toHaveLength(2);
  });

  it("o resumo não conta a dose corrigida duas vezes", () => {
    const eventos = [
      comDose("tomou", "2026-08-31T08:00", 0),
      comDose("nao_tomou", "2026-08-31T08:00", 240),
    ];
    const [resumo] = resumoPorMedicacao(eventos, [medicacao()], { agora: AGORA });
    expect(resumo.respondidas).toBe(1);
    expect(resumo.tomou).toBe(0);
    expect(resumo.nao_tomou).toBe(1);
  });

  // Eventos antigos não têm doseEm. O par medicação+dia+horário resolve.
  it("evento antigo sem doseEm agrupa por dia e horário", () => {
    const antigo = (resposta, min) => ({
      id: `a-${min}`,
      type: "medication_response",
      createdAt: new Date(AGORA.getTime() + min * 60000).toISOString(),
      payload: { medicationId: 1, medicationName: "Losartana", scheduleTime: "08:00", response: resposta },
    });
    const r = extrairRespostas([antigo("tomou", 0), antigo("nao_tomou", 60)]);
    expect(r).toHaveLength(1);
    expect(r[0].resposta).toBe("nao_tomou");
  });

  // Sem doseEm E sem scheduleTime não dá para saber se é a mesma dose.
  // Agrupar no chute descartaria resposta legítima — melhor manter as duas.
  it("sem identidade nenhuma, não agrupa no chute", () => {
    const sem = (resposta, min) => ({
      id: `s-${min}`,
      type: "medication_response",
      createdAt: new Date(AGORA.getTime() + min * 60000).toISOString(),
      payload: { medicationId: 1, medicationName: "Losartana", response: resposta },
    });
    expect(extrairRespostas([sem("tomou", 0), sem("nao_tomou", 60)])).toHaveLength(2);
  });

  it("o histórico bruto preserva as duas, para o médico ver a correção", () => {
    const eventos = [
      comDose("tomou", "2026-08-31T08:00", 0),
      comDose("nao_tomou", "2026-08-31T08:00", 240),
    ];
    expect(extrairRespostasBrutas(eventos)).toHaveLength(2);
  });
});

describe("adesão e efeito colateral são perguntas diferentes", () => {
  const naDose = (resposta, min) => ({
    id: `x-${resposta}-${min}`,
    type: "medication_response",
    createdAt: new Date(AGORA.getTime() + min * 60000).toISOString(),
    payload: {
      medicationId: 1, medicationName: "Losartana",
      doseEm: "2026-08-31T08:00", scheduleTime: "08:00", response: resposta,
    },
  });

  // Tomou o remédio e depois passou mal: as DUAS coisas são verdade.
  it("tomou + efeito colateral na mesma dose convivem", () => {
    const r = extrairRespostas([naDose("tomou", 0), naDose("efeito_colateral", 30)]);
    expect(r).toHaveLength(2);
    expect(r.map((x) => x.resposta).sort()).toEqual(["efeito_colateral", "tomou"]);
  });

  it("mas corrigir tomou -> não tomei continua sendo uma coisa só", () => {
    const r = extrairRespostas([naDose("tomou", 0), naDose("nao_tomou", 30)]);
    expect(r).toHaveLength(1);
    expect(r[0].resposta).toBe("nao_tomou");
  });

  it("clicar duas vezes em efeito colateral não conta dois relatos", () => {
    const r = extrairRespostas([naDose("efeito_colateral", 0), naDose("efeito_colateral", 30)]);
    expect(r).toHaveLength(1);
  });
});

// [DOSE-LEGADA] Eventos anteriores ao carimbo de dose no botão: a correção
// contava dobrado porque cada clique ficava sozinho no seu grupo.
describe("dose legada, atribuída pela janela", () => {
  const medUmaVez = { id: 7, medicationName: "Losartana", scheduleTimes: "21:00" };
  const legado = (resposta, createdAt, id) => ({
    id,
    type: "medication_response",
    createdAt,
    payload: { medicationId: 7, medicationName: "Losartana", response: resposta },
  });

  it("junta a correção feita depois da meia-noite na dose da noite", () => {
    const eventos = [
      legado("tomou", "2026-09-01T21:05:00-03:00", 1),
      legado("nao_tomou", "2026-09-02T00:09:00-03:00", 2),
    ];
    const r = extrairRespostas(eventos, [medUmaVez]);
    expect(r).toHaveLength(1);
    expect(r[0].resposta).toBe("nao_tomou");
  });

  it("mantém separadas as respostas de doses diferentes", () => {
    const medDuasVezes = { id: 7, medicationName: "Losartana", scheduleTimes: "08:00,20:00" };
    const eventos = [
      legado("tomou", "2026-09-01T08:05:00-03:00", 1),
      legado("nao_tomou", "2026-09-01T20:05:00-03:00", 2),
    ];
    expect(extrairRespostas(eventos, [medDuasVezes])).toHaveLength(2);
  });

  it("não agrupa quando a dose seguinte já passou (resposta atrasada)", () => {
    const medDuasVezes = { id: 7, medicationName: "Losartana", scheduleTimes: "08:00,20:00" };
    const eventos = [
      legado("tomou", "2026-09-01T21:00:00-03:00", 1),
      legado("nao_tomou", "2026-09-01T21:05:00-03:00", 2),
    ];
    // as duas caem na MESMA janela (20:00) — aqui agrupar é o certo
    expect(extrairRespostas(eventos, [medDuasVezes])).toHaveLength(1);
  });

  it("sem medicação conhecida, cada evento continua sozinho", () => {
    const eventos = [
      legado("tomou", "2026-09-01T21:05:00-03:00", 1),
      legado("nao_tomou", "2026-09-02T00:09:00-03:00", 2),
    ];
    expect(extrairRespostas(eventos, [])).toHaveLength(2);
  });

  it("efeito colateral convive com a resposta de adesão da mesma dose", () => {
    const eventos = [
      legado("tomou", "2026-09-01T21:05:00-03:00", 1),
      legado("efeito_colateral", "2026-09-01T22:00:00-03:00", 2),
    ];
    expect(extrairRespostas(eventos, [medUmaVez])).toHaveLength(2);
  });
});
