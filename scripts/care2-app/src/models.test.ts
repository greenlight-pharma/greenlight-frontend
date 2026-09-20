import { describe, expect, it } from "vitest";
import { MedicationNames, Schedule, Weekdays, careScheduleValidation, draftBody, draftFromMedication, draftFromOCR, emptyDraft, parseWeekdays, weekdaysValue, formatPhone, newCareDraft, parseRegistration, patientMatches, patientReads, readPatient, registrationComplete, validateDraft, withCountry } from "./models";

describe("telefone", () => {
  it("mostra só DDD e número", () => { expect(formatPhone("5512988303722")).toBe("(12) 98830-3722"); expect(formatPhone("551233334444")).toBe("(12) 3333-4444"); });
  it("coloca o 55 sozinho", () => expect(withCountry("(12) 98830-3722")).toBe("5512988303722"));
  it("busca por nome sem acento e por número", () => { const p = readPatient({ patientPhone: "5511999990001", patientName: "João Álvares" }); expect(patientMatches(p, "joao alv")).toBe(true); expect(patientMatches(p, "99999")).toBe(true); expect(patientMatches(p, "maria")).toBe(false); });
});
describe("agenda", () => {
  it("fim inclusivo", () => { expect(Schedule.end("2026-09-01", 7)).toBe("2026-09-07"); expect(Schedule.end("2026-12-30", 3)).toBe("2027-01-01"); });
  it("horários padrão por frequência", () => { expect(Schedule.defaultTimes(2)).toEqual(["08:00", "20:00"]); expect(Schedule.measurementTimes(3)).toEqual(["07:00", "13:00", "19:00"]); });
  it("valida horário", () => { expect(Schedule.valid("23:59")).toBe(true); expect(Schedule.valid("24:00")).toBe(false); expect(Schedule.valid("8:00")).toBe(false); });
});
describe("nomes de medicação", () => {
  it("mesma medicação com complemento", () => expect(MedicationNames.same("Losartana", "LOSARTANA potássica 50mg")).toBe(true));
  it("não confunde ácidos", () => expect(MedicationNames.same("Ácido fólico", "Ácido acetilsalicílico")).toBe(false));
});
describe("rascunho", () => {
  const ok = () => ({ ...emptyDraft(), name: "Losartana", dose: "1 comprimido", times: ["08:00"], duration: "continuous" as const });
  it("exige nome, dose, horário e duração", () => { expect(validateDraft(emptyDraft())).toMatch(/nome/); expect(validateDraft({ ...ok(), duration: "" })).toMatch(/contínuo/); expect(validateDraft(ok())).toBeNull(); });
  it("recusa horário repetido e dias fora da faixa", () => { expect(validateDraft({ ...ok(), times: ["08:00", "08:00"] })).toMatch(/repetidos/); expect(validateDraft({ ...ok(), duration: "days", days: "1000" })).toMatch(/999/); });
  it("receita exige conferência", () => { const d = { ...draftFromOCR({ medicationName: "Minoxidil", dose: "1 mg", usoContinuo: true, dosesPorDia: 1 }) }; expect(d.times).toEqual(["08:00"]); expect(validateDraft(d)).toMatch(/Confira/); expect(validateDraft({ ...d, reviewed: true })).toBeNull(); });
  it("linha vista em uma leitura só começa desmarcada", () => expect(draftFromOCR({ medicationName: "X", somenteEmUmaLeitura: true }).included).toBe(false));
  it("corpo com fim por dias", () => { const b = draftBody({ ...ok(), duration: "days", days: "7", times: ["20:00", "08:00"] }, readPatient({ patientPhone: "5511999990001", patientName: "Ana" }), "2026-09-01"); expect(b.endDate).toBe("2026-09-07"); expect(b.scheduleTimes).toBe("08:00,20:00"); expect(draftBody(ok(), readPatient({ phone: "1", name: "A" }), "2026-09-01").endDate).toBeNull(); });
});
describe("profissões", () => {
  it("como o paciente lê", () => { expect(patientReads("Ana Lima", "dentista")).toBe("Dr(a). Ana Lima"); expect(patientReads("Carla Souza", "enfermeiro")).toBe("Carla Souza, enfermeiro(a)"); expect(patientReads("Médico(a)", "medico")).toBe("seu profissional de saúde"); });
  it("lê o registro de volta", () => { const r = parseRegistration("CRO/SP 12345", null); expect(r).toEqual({ profession: "dentista", number: "12345", uf: "SP" }); expect(registrationComplete(r)).toBe(true); expect(registrationComplete({ profession: "medico", number: "1", uf: "PR" })).toBe(false); });
});
describe("cuidados", () => {
  it("resume dias", () => { expect(Weekdays.summary([1, 2, 3, 4, 5])).toBe("Segunda a sexta"); expect(Weekdays.summary([1, 3])).toBe("Segunda e quarta"); expect(Weekdays.summary([])).toBe("Selecione os dias"); });
  it("recusa rotinas no mesmo dia e horário", () => { const d = newCareDraft(); d.routines[0].time = "08:00"; d.routines.push({ ...d.routines[0], id: "b", weekdays: [1] }); expect(careScheduleValidation(d)).toMatch(/coincidem/); d.routines[1].time = "09:00"; expect(careScheduleValidation(d)).toBeNull(); });
});
describe("dias da semana", () => {
  it("lê o texto do servidor e devolve null para todos os dias", () => { expect(parseWeekdays("3,1")).toEqual([1, 3]); expect(parseWeekdays(null)).toHaveLength(7); expect(parseWeekdays("x")).toHaveLength(7); expect(weekdaysValue([0, 1, 2, 3, 4, 5, 6])).toBeNull(); expect(weekdaysValue([5, 1])).toEqual([1, 5]); });
  it("vai no corpo e volta da medicação", () => { const d = { ...emptyDraft(), name: "X", dose: "1", times: ["08:00"], duration: "continuous" as const, weekdays: [1] }; expect(draftBody(d, { phone: "1", name: "A", optOut: false }, "2026-09-01").weekdays).toEqual([1]); expect(draftFromMedication({ id: 1, medicationName: "X", weekdays: "1,3" }).weekdays).toEqual([1, 3]); expect(validateDraft({ ...d, weekdays: [] })).toMatch(/dia da semana/); });
});
