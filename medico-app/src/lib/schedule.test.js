import { describe, it, expect } from "vitest";
import {
  parseScheduleTimes,
  serializeScheduleTimes,
  expandPosologia,
  endDateFromDuration,
  isExpired,
} from "./schedule.js";

describe("parseScheduleTimes", () => {
  it("lê lista válida", () => {
    expect(parseScheduleTimes("08:00,20:00")).toEqual({ ok: true, times: ["08:00", "20:00"] });
  });
  it("tolera espaços", () => {
    expect(parseScheduleTimes(" 08:00 , 20:00 ").times).toEqual(["08:00", "20:00"]);
  });
  it("marca formato legado em vez de descartar calado", () => {
    expect(parseScheduleTimes("8;00 e 20;00").ok).toBe(false);
  });
  it("vazio é lista vazia válida", () => {
    expect(parseScheduleTimes("")).toEqual({ ok: true, times: [] });
  });
});

describe("serializeScheduleTimes", () => {
  it("ordena, deduplica e descarta inválidos", () => {
    expect(serializeScheduleTimes(["20:00", "08:00", "20:00", "", "9:00"])).toBe("08:00,20:00");
  });
});

describe("expandPosologia", () => {
  it("de 8 em 8 horas a partir das 06:00", () => {
    expect(expandPosologia("06:00", "8h")).toEqual(["06:00", "14:00", "22:00"]);
  });
  it("vira o dia sem estourar 24h", () => {
    expect(expandPosologia("20:00", "12h")).toEqual(["08:00", "20:00"]);
  });
  it("1x ao dia devolve só o horário informado", () => {
    expect(expandPosologia("07:30", "1x")).toEqual(["07:30"]);
  });
});

describe("endDateFromDuration", () => {
  it("7 dias a partir de 01/09 termina em 07/09", () => {
    expect(endDateFromDuration("2026-09-01", 7)).toBe("2026-09-07");
  });
  it("atravessa a virada do mês", () => {
    expect(endDateFromDuration("2026-08-28", 7)).toBe("2026-09-03");
  });
  it("duração inválida devolve vazio", () => {
    expect(endDateFromDuration("2026-09-01", 0)).toBe("");
  });
});

describe("isExpired", () => {
  it("detecta tratamento vencido", () => {
    expect(isExpired({ endDate: "2026-01-01" }, new Date("2026-08-19"))).toBe(true);
    expect(isExpired({ endDate: "2026-12-01" }, new Date("2026-08-19"))).toBe(false);
    expect(isExpired({ endDate: null }, new Date("2026-08-19"))).toBe(false);
  });
});
