import { describe, it, expect } from "vitest";
import {
  analisarSequencia, classificarValidade, lerValidade, gerarPendencias,
  resumoDaConferencia, formatarNumeroDocumento, GRAVIDADE, VALIDADE,
  MAX_FALTANTES_LISTADOS,
} from "./regras.js";

// [ESPELHO] Estes casos são os MESMOS do samu.test.js no greenlight-backend,
// de propósito. regras.js existe porque a conferência precisa funcionar sem
// rede; o preço é ter a lógica em dois lugares. Se um lado mudar sozinho,
// uma destas duas suítes quebra — é o alarme de divergência.

const HOJE = new Date(Date.UTC(2026, 8, 8)); // 08/09/2026

describe("sequência de documentos", () => {
  it("acha o buraco no meio", () => {
    const s = analisarSequencia(["001", "002", "003", "004", "006", "007"]);
    expect(s.quantidade).toBe(6);
    expect(s.faltantes).toEqual([5]);
    expect(formatarNumeroDocumento(s.faltantes[0], s.largura)).toBe("005");
  });

  it("sem faixa declarada NÃO afirma 'completa'", () => {
    const s = analisarSequencia(["001", "002", "003"]);
    expect(s.faltantes).toEqual([]);
    expect(s.faixaDeclarada).toBe(false);
    expect(s.completa).toBe(false);
  });

  it("com faixa declarada afirma completa e acha o que falta no fim", () => {
    expect(analisarSequencia(["001", "002", "003"], { inicio: "001", fim: "003" }).completa).toBe(true);
    expect(analisarSequencia(["001", "002", "003"], { inicio: 1, fim: 5 }).faltantes).toEqual([4, 5]);
  });

  it("número repetido não some", () => {
    const s = analisarSequencia(["101", "102", "102", "103"]);
    expect(s.duplicados).toEqual([102]);
    expect(s.quantidade).toBe(3);
  });

  it("aceita fora de ordem, com prefixo e zero à esquerda", () => {
    const s = analisarSequencia(["A-003", "001", " 002 "]);
    expect(s.presentes).toEqual([1, 2, 3]);
    expect(s.largura).toBe(3);
  });

  it("dígito a mais não gera mil faltantes", () => {
    const s = analisarSequencia(["001", "9999"]);
    expect(s.excedeuLimite).toBe(true);
    expect(s.faltantes.length).toBe(MAX_FALTANTES_LISTADOS);
  });

  it("lista vazia não vira sequência completa", () => {
    expect(analisarSequencia([]).completa).toBe(false);
  });
});

describe("validade", () => {
  it("MM/AAAA vale até o último dia do mês", () => {
    expect(classificarValidade("09/2026", HOJE).estado).toBe(VALIDADE.PROXIMO);
    expect(classificarValidade("09/2026", HOJE).diasRestantes).toBe(22);
    expect(lerValidade("09/2026").toISOString().slice(0, 10)).toBe("2026-09-30");
    expect(lerValidade("02/2028").toISOString().slice(0, 10)).toBe("2028-02-29");
  });

  it("classifica vencido, próximo, ok e ausente", () => {
    expect(classificarValidade("31/08/2026", HOJE).estado).toBe(VALIDADE.VENCIDO);
    expect(classificarValidade("20/09/2026", HOJE).estado).toBe(VALIDADE.PROXIMO);
    expect(classificarValidade("2027-01-10", HOJE).estado).toBe(VALIDADE.OK);
    expect(classificarValidade("", HOJE).estado).toBe(VALIDADE.AUSENTE);
    expect(classificarValidade("banana", HOJE).estado).toBe(VALIDADE.AUSENTE);
  });

  it("no próprio dia da validade ainda serve", () => {
    const r = classificarValidade("08/09/2026", HOJE);
    expect(r.diasRestantes).toBe(0);
    expect(r.estado).toBe(VALIDADE.PROXIMO);
  });

  it("data impossível não é aceita", () => {
    expect(lerValidade("31/02/2027")).toBe(null);
    expect(lerValidade("13/2026")).toBe(null);
  });
});

describe("pendências", () => {
  it("'não conferido' e 'quantidade 0' são diferentes", () => {
    const p = gerarPendencias({ itens: [
      { bolsa: "adulto", grupo: "TOT", tamanho: "7,5", quantidade: 0 },
      { bolsa: "adulto", grupo: "TOT", tamanho: "8,0", quantidade: null },
    ] }, HOJE);
    expect(p.find((x) => x.descricao.includes("7,5")).gravidade).toBe(GRAVIDADE.CRITICA);
    expect(p.find((x) => x.descricao.includes("8,0")).gravidade).toBe(GRAVIDADE.ATENCAO);
    expect(p.find((x) => x.descricao.includes("8,0")).descricao).toMatch(/não conferido/);
  });

  it("críticas vêm primeiro e a lista cobre tudo", () => {
    const p = gerarPendencias({
      itens: [
        { bolsa: "adulto", grupo: "TOT", tamanho: "7,5", quantidade: 0 },
        { bolsa: "adulto", grupo: "Máscara laríngea", tamanho: "Nº 4", quantidade: 2, validade: "09/2026" },
        { bolsa: "adulto", grupo: "TOT", tamanho: "7,0", quantidade: 3, validade: "01/2026" },
      ],
      documentos: [{ tipo: "dos", numeros: ["001", "002", "003", "004", "006"] }],
      manuais: [{ descricao: "Laringoscópio adulto com lâmpada fraca." }],
    }, HOJE);
    expect(p[0].gravidade).toBe(GRAVIDADE.CRITICA);
    expect(p.some((x) => /VENCIDO/.test(x.descricao))).toBe(true);
    expect(p.some((x) => /DOS nº 005 não localizado/.test(x.descricao))).toBe(true);
    expect(resumoDaConferencia(p).criticas).toBe(2);
  });

  it("conferência limpa libera o plantão", () => {
    const p = gerarPendencias({ itens: [{ grupo: "TOT", tamanho: "7,0", quantidade: 2, validade: "2028-01-01" }] }, HOJE);
    expect(p).toEqual([]);
    expect(resumoDaConferencia(p).liberado).toBe(true);
  });
});
