import { describe, it, expect } from "vitest";
import {
  classifyExamToPanel,
  getExamDescription,
  agruparPorPainel,
  normalizeForPanel,
  EXAM_PANELS,
  EXAM_DESCRIPTIONS,
} from "./examPanels.js";

describe("dados de referência", () => {
  it("os 13 painéis e as 161 descrições vieram inteiros do original", () => {
    expect(EXAM_PANELS).toHaveLength(13);
    expect(EXAM_DESCRIPTIONS).toHaveLength(161);
  });
});

describe("normalizeForPanel", () => {
  it("minúsculas e sem acento — e SÓ isso", () => {
    expect(normalizeForPanel("Hemoglobina Glicada")).toBe("hemoglobina glicada");
    expect(normalizeForPanel("CA 15-3")).toBe("ca 15-3"); // pontuação preservada
  });
});

describe("classifyExamToPanel", () => {
  it("classifica exames comuns", () => {
    expect(classifyExamToPanel("Hemoglobina").label).toBe("Hemograma");
    expect(classifyExamToPanel("Creatinina").label).toBe("Função Renal");
    expect(classifyExamToPanel("CA 15-3").label).toBe("Marcadores Tumorais");
  });

  it("exame desconhecido cai em Outros, não some", () => {
    expect(classifyExamToPanel("Exame Inventado").label).toBe("Outros");
  });

  // [QUIRK-HBA1C] Comportamento HERDADO do medico.html, travado aqui de
  // propósito: "Hemoglobina Glicada (HbA1c)" contém "hemoglobina", e o painel
  // Hemograma é testado ANTES do painel Glicemia — então a HbA1c aparece sob
  // Hemograma, não sob "Glicemia e Diabetes".
  //
  // NÃO foi corrigido no refactor porque mudar agrupamento de exame é decisão
  // clínica, não técnica. Se a decisão for mover, basta pôr o painel
  // "glicemia" antes de "hemograma" em EXAM_PANELS — e este teste quebra,
  // que é o objetivo dele.
  it("HbA1c cai em Hemograma (comportamento herdado — ver [QUIRK-HBA1C])", () => {
    expect(classifyExamToPanel("Hemoglobina Glicada (HbA1c)").label).toBe("Hemograma");
  });
});

describe("getExamDescription", () => {
  it("descreve o que o exame mede", () => {
    expect(getExamDescription("Hematócrito")).toMatch(/volume sanguíneo/i);
  });

  it("não inventa descrição para exame desconhecido", () => {
    expect(getExamDescription("Exame Inventado")).toBeNull();
  });

  it("nenhuma descrição interpreta resultado alterado", () => {
    // O princípio da lista: diz o que MEDE, nunca o que significa estar fora.
    const proibido = /indica |sugere |significa que|doença|diagnóstic/i;
    const violacoes = EXAM_DESCRIPTIONS.filter((d) => proibido.test(d.text));
    expect(violacoes.map((v) => v.match)).toEqual([]);
  });
});

describe("agruparPorPainel", () => {
  it("agrupa preservando a ordem de chegada", () => {
    const grupos = agruparPorPainel([
      { name: "Hemoglobina" },
      { name: "Creatinina" },
      { name: "Hematócrito" },
    ]);
    expect(grupos.map((g) => g.label)).toEqual(["Hemograma", "Função Renal"]);
    expect(grupos[0].exams).toHaveLength(2);
  });
});
