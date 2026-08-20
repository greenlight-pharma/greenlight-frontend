import { describe, it, expect } from "vitest";
import { rastreiosAplicaveis } from "./screening.js";

describe("rastreiosAplicaveis", () => {
  it("mulher de 55 anos: colo, mama, colorretal, PA e glicemia", () => {
    const r = rastreiosAplicaveis({ patientAge: 55, biologicalSex: "feminino" });
    expect(r.itens.map((i) => i.nome)).toEqual([
      "Câncer de colo do útero",
      "Câncer de mama",
      "Câncer colorretal",
      "Pressão arterial (rastreio de hipertensão)",
      "Glicemia (rastreio de diabetes)",
    ]);
  });

  it("homem de 55 anos não recebe rastreio feminino", () => {
    const r = rastreiosAplicaveis({ patientAge: 55, biologicalSex: "masculino" });
    expect(r.itens.some((i) => i.sexo === "feminino")).toBe(false);
  });

  it("mulher de 30 anos: fora da faixa de mama e colorretal", () => {
    const r = rastreiosAplicaveis({ patientAge: 30, biologicalSex: "feminino" });
    expect(r.itens.map((i) => i.nome)).not.toContain("Câncer de mama");
    expect(r.itens.map((i) => i.nome)).not.toContain("Câncer colorretal");
  });

  it("sem idade ou sexo, não adivinha", () => {
    expect(rastreiosAplicaveis({ biologicalSex: "feminino" })).toEqual({
      ok: false,
      faltando: ["idade"],
    });
    expect(rastreiosAplicaveis({}).faltando).toEqual(["idade", "sexo biológico"]);
  });

  it("divergências entre diretrizes vêm junto (não são omitidas)", () => {
    const r = rastreiosAplicaveis({ patientAge: 55, biologicalSex: "feminino" });
    expect(r.itens.find((i) => i.nome === "Câncer de mama").divergencia).toMatch(/40–74/);
  });
});
