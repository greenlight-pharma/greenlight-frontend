import { describe, it, expect } from "vitest";
import { normalizeBRPhone, formatBRPhone, phoneVariants } from "./phone.js";

describe("normalizeBRPhone", () => {
  it("prefixa 55 em DDD+celular", () => {
    expect(normalizeBRPhone("11999998888")).toEqual({ ok: true, phone: "5511999998888" });
  });

  it("aceita fixo de 10 dígitos", () => {
    expect(normalizeBRPhone("1133334444")).toEqual({ ok: true, phone: "551133334444" });
  });

  it("não duplica o 55 quando o médico cola com DDI", () => {
    expect(normalizeBRPhone("5511999998888")).toEqual({ ok: true, phone: "5511999998888" });
  });

  it("ignora máscara e espaços", () => {
    expect(normalizeBRPhone("(11) 99999-8888")).toEqual({ ok: true, phone: "5511999998888" });
  });

  it("rejeita vazio, curto e longo", () => {
    expect(normalizeBRPhone("").ok).toBe(false);
    expect(normalizeBRPhone("119999").ok).toBe(false);
    expect(normalizeBRPhone("119999988887777").ok).toBe(false);
  });

  it("rejeita DDD inválido", () => {
    expect(normalizeBRPhone("0199999888").ok).toBe(false);
  });
});

describe("phoneVariants", () => {
  it("gera a forma legada sem o nono dígito", () => {
    expect(phoneVariants("5511999998888")).toEqual(["5511999998888", "551199998888"]);
  });

  it("gera a forma atual a partir da legada", () => {
    expect(phoneVariants("551199998888")).toEqual(["551199998888", "5511999998888"]);
  });

  it("não inventa variante para fixo", () => {
    expect(phoneVariants("551133334444")).toEqual(["551133334444"]);
  });
});

describe("formatBRPhone", () => {
  it("formata celular e fixo", () => {
    expect(formatBRPhone("5511999998888")).toBe("(11) 99999-8888");
    expect(formatBRPhone("551133334444")).toBe("(11) 3333-4444");
  });
});
