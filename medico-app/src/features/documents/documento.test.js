import { describe, it, expect } from "vitest";
import { montarDocumento, receitaDasMedicacoes } from "./documento.js";

const paciente = { name: "Maria Silva", patientAge: 62 };
const medico = { nome: "Dra. Ana", crm: "SP 123456" };

describe("montarDocumento", () => {
  it("todo documento avisa que não vale sem assinatura e carimbo", () => {
    for (const tipo of ["receita", "atestado", "pedido"]) {
      const d = montarDocumento({ tipo, medico, paciente, corpo: "x", hoje: "19/08/2026" });
      expect(d.texto).toContain("Documento sem validade sem a assinatura e o carimbo");
      expect(d.texto).toContain("Assinatura e carimbo do médico");
    }
  });

  it("não inventa CRM quando o médico não preencheu", () => {
    const d = montarDocumento({ tipo: "receita", medico: {}, paciente, corpo: "x" });
    expect(d.texto).toContain("CRM: ____________________");
    // \w casaria com o próprio underscore da linha em branco — checar letra/dígito.
    expect(d.texto).not.toMatch(/CRM: [A-Za-z0-9]/);
  });

  it("atestado só inclui CID quando informado", () => {
    const sem = montarDocumento({ tipo: "atestado", medico, paciente, corpo: "Afastar 2 dias" });
    expect(sem.texto).not.toContain("CID:");
    const com = montarDocumento({ tipo: "atestado", medico, paciente, corpo: "Afastar 2 dias", cid: "J06" });
    expect(com.texto).toContain("CID: J06");
  });

  it("corpo vazio é dito explicitamente, não sai em branco", () => {
    expect(montarDocumento({ tipo: "receita", medico, paciente, corpo: "" }).texto).toContain("(sem itens)");
    expect(montarDocumento({ tipo: "pedido", medico, paciente, corpo: "" }).texto).toContain("(nenhum exame listado)");
  });

  it("idade ausente vira travessão, não 'undefined anos'", () => {
    const d = montarDocumento({ tipo: "receita", medico, paciente: { name: "X" }, corpo: "y" });
    expect(d.texto).toContain("Idade: —");
  });
});

describe("receitaDasMedicacoes", () => {
  it("inclui só as ativas, com horários e orientações", () => {
    const texto = receitaDasMedicacoes([
      { medicationName: "Losartana", dose: "50mg", scheduleTimes: "08:00,20:00", instructions: "Após refeição", status: "ativo" },
      { medicationName: "Antiga", dose: "1g", scheduleTimes: "08:00", status: "encerrado" },
    ]);
    expect(texto).toContain("Losartana — 50mg");
    expect(texto).toContain("Horários: 08:00, 20:00");
    expect(texto).toContain("Após refeição");
    expect(texto).not.toContain("Antiga");
  });

  it("horário em formato legado não vira linha de horário inventada", () => {
    const texto = receitaDasMedicacoes([
      { medicationName: "X", dose: "1", scheduleTimes: "8;00 e 20;00", status: "ativo" },
    ]);
    expect(texto).not.toContain("Horários:");
  });
});
