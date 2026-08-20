import { describe, it, expect } from "vitest";
import { montarResumoDoCaso } from "./resumo.js";

const base = { patient: { name: "Maria", patientAge: 62, phone: "5511999998888" }, agora: "2026-08-19T12:00:00Z" };

describe("montarResumoDoCaso", () => {
  it("alergia não registrada NUNCA sai em branco", () => {
    const t = montarResumoDoCaso(base);
    expect(t).toContain("Alergias: NÃO REGISTRADO (não assumir ausência)");
  });

  it("alergias aparecem antes das consultas e das medicações", () => {
    const t = montarResumoDoCaso(base);
    expect(t.indexOf("ALERGIAS")).toBeLessThan(t.indexOf("HISTÓRICO DE CONSULTAS"));
    expect(t.indexOf("ALERGIAS")).toBeLessThan(t.indexOf("MEDICAÇÕES"));
  });

  it("separa medicações em uso das arquivadas", () => {
    const t = montarResumoDoCaso({
      ...base,
      medications: [
        { medicationName: "Losartana", dose: "50mg", scheduleTimes: "08:00" },
        { medicationName: "Amoxicilina", archivedAt: "2026-01-01" },
      ],
    });
    expect(t).toMatch(/Em uso:[\s\S]*Losartana/);
    expect(t).toMatch(/Arquivadas \(histórico\):[\s\S]*Amoxicilina/);
  });

  it("seção vazia é dita, não omitida", () => {
    const t = montarResumoDoCaso(base);
    expect(t).toContain("Nenhuma consulta registrada.");
    expect(t).toContain("Nenhuma medicação registrada.");
    expect(t).toContain("Nenhum exame laboratorial anexado.");
  });

  it("separa exame de imagem de laboratorial", () => {
    const t = montarResumoDoCaso({
      ...base,
      exams: [
        { fileName: "hemograma.pdf", examType: "lab" },
        { fileName: "raiox.pdf", examType: "imaging" },
      ],
    });
    const secImg = t.slice(t.indexOf("6. EXAMES DE IMAGEM"));
    expect(secImg).toContain("raiox.pdf");
    expect(secImg).not.toContain("hemograma.pdf");
  });

  it("responsabilidade do conteúdo é declarada", () => {
    expect(montarResumoDoCaso(base)).toContain("responsabilidade do médico que o compartilha");
  });
});
