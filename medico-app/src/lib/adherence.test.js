import { describe, it, expect } from "vitest";
import { extrairRespostas, resumoPorMedicacao, sinalDeAdesao } from "./adherence.js";

const ev = (resposta, dias, medId = 1, nome = "Losartana") => ({
  id: Math.random(),
  type: "medication_response",
  createdAt: new Date(Date.now() - dias * 86400000).toISOString(),
  payload: { medicationId: medId, medicationName: nome, scheduleTime: "08:00", response: resposta },
});

describe("extrairRespostas", () => {
  it("ignora eventos que não são resposta de medicação", () => {
    const events = [ev("tomou", 1), { type: "checkin", payload: {} }];
    expect(extrairRespostas(events)).toHaveLength(1);
  });

  it("aceita payload em string (jsonb devolvido como texto)", () => {
    const e = ev("tomou", 1);
    e.payload = JSON.stringify(e.payload);
    expect(extrairRespostas([e])[0].resposta).toBe("tomou");
  });
});

describe("resumoPorMedicacao", () => {
  it("conta por medicação e calcula a taxa sobre respostas", () => {
    const events = [ev("tomou", 1), ev("tomou", 2), ev("nao_tomou", 3)];
    const [r] = resumoPorMedicacao(events);
    expect(r.tomou).toBe(2);
    expect(r.nao_tomou).toBe(1);
    expect(r.taxa).toBe(67);
  });

  it("respeita a janela de dias", () => {
    const events = [ev("tomou", 1), ev("tomou", 90)];
    expect(resumoPorMedicacao(events, { dias: 30 })[0].total).toBe(1);
  });

  it("separa medicações diferentes", () => {
    const events = [ev("tomou", 1, 1, "Losartana"), ev("tomou", 1, 2, "Metformina")];
    expect(resumoPorMedicacao(events)).toHaveLength(2);
  });
});

describe("sinalDeAdesao", () => {
  it("efeito colateral tem prioridade sobre a taxa", () => {
    const resumo = resumoPorMedicacao([ev("tomou", 1), ev("efeito_colateral", 1)]);
    expect(sinalDeAdesao(resumo).nivel).toBe("erro");
  });

  it("adesão baixa vira alerta", () => {
    const resumo = resumoPorMedicacao([ev("nao_tomou", 1), ev("nao_tomou", 2), ev("tomou", 3)]);
    expect(sinalDeAdesao(resumo).nivel).toBe("alerta");
  });

  it("sem evento nenhum não inventa número", () => {
    expect(sinalDeAdesao([]).nivel).toBe("sem-dados");
  });
});
