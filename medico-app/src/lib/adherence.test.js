import { describe, it, expect } from "vitest";
import {
  extrairRespostas,
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
