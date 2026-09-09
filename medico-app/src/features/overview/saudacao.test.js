import { describe, it, expect } from "vitest";
import { primeiroNome } from "./OverviewPage.jsx";

// O painel dizia "Olá, Dr." para quem cadastrou o nome com título — que é a
// maioria. Pegava a primeira palavra sem olhar o que ela era.
describe("saudação do painel", () => {
  it("ignora o título e usa o nome", () => {
    expect(primeiroNome("Dr. Dilson Panisio")).toBe("Dilson");
    expect(primeiroNome("Dra. Ana Souza")).toBe("Ana");
    expect(primeiroNome("DOUTOR Carlos")).toBe("Carlos");
    expect(primeiroNome("Drª Beatriz Lima")).toBe("Beatriz");
  });

  it("funciona sem título", () => {
    expect(primeiroNome("Dilson Panisio")).toBe("Dilson");
    expect(primeiroNome("Ana")).toBe("Ana");
  });

  it("nome vazio não quebra a tela", () => {
    expect(primeiroNome("")).toBe("doutor(a)");
    expect(primeiroNome(null)).toBe("doutor(a)");
    expect(primeiroNome("   ")).toBe("doutor(a)");
  });

  it("nome que é SÓ o título ainda cumprimenta alguém", () => {
    expect(primeiroNome("Dr.")).toBe("Dr.");
  });
});
