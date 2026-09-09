// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// [DURACAO-EXPLICITA] O formulário da web tinha um <select> cujo valor vazio
// significava "contínuo". Quem não mexia no campo cadastrava uso contínuo sem
// saber — e um antibiótico de 7 dias virava lembrete eterno. Estes testes
// travam o comportamento novo, portado do app.

const criar = vi.fn(() => Promise.resolve({}));
const atualizar = vi.fn(() => Promise.resolve({}));
vi.mock("./api.js", () => ({
  useCreateMedication: () => ({ mutateAsync: criar, isPending: false }),
  useUpdateMedication: () => ({ mutateAsync: atualizar, isPending: false }),
  useMedicationSearch: () => ({ data: [] }),
  useMedicationDoses: () => ({ data: null }),
}));

const { default: MedicationForm } = await import("./MedicationForm.jsx");

function abrir(medication) {
  render(
    <MedicationForm
      open
      onClose={() => {}}
      phone="5521999332710"
      patientName="Maria"
      medication={medication}
    />
  );
}

function salvar() {
  // jsdom não encadeia clique-no-botão -> submit do form como o navegador
  // faz; disparar o submit direto é o caminho recomendado pelo
  // testing-library e testa o mesmo handler.
  fireEvent.submit(document.querySelector("form"));
}

function preencherBasico() {
  fireEvent.change(screen.getByLabelText(/Nome da medicação/i), {
    target: { value: "Amoxicilina" },
  });
  fireEvent.change(screen.getByLabelText(/^Dose$/i), { target: { value: "500mg" } });
  // sem horário válido a validação para antes de chegar na duração
  fireEvent.click(screen.getByRole("button", { name: /1x ao dia/i }));
}

beforeEach(() => { criar.mockClear(); atualizar.mockClear(); });
afterEach(cleanup);

describe("duração no formulário da web", () => {
  it("mostra as duas opções em vez de um campo com padrão escondido", () => {
    abrir();
    expect(screen.getByText("Uso contínuo")).toBeTruthy();
    expect(screen.getByText("Por alguns dias")).toBeTruthy();
    expect(screen.getByText(/Escolha uma das duas/i)).toBeTruthy();
  });

  it("recusa salvar enquanto ninguém escolheu", async () => {
    abrir();
    preencherBasico();
    salvar();
    await waitFor(() =>
      expect(screen.getByText(/Informe por quantos dias, ou marque uso contínuo/i)).toBeTruthy()
    );
    expect(criar).not.toHaveBeenCalled();
  });

  it("uso contínuo salva SEM data de fim", async () => {
    abrir();
    preencherBasico();
    fireEvent.click(screen.getByText("Uso contínuo"));
    salvar();
    await waitFor(() => expect(criar).toHaveBeenCalled());
    expect(criar.mock.calls[0][0].endDate).toBe("");
  });

  it("'por N dias' calcula o fim contando o primeiro dia", async () => {
    abrir();
    preencherBasico();
    fireEvent.click(screen.getByText("Por alguns dias"));
    fireEvent.change(screen.getByLabelText(/Quantidade de dias/i), { target: { value: "7" } });
    salvar();
    await waitFor(() => expect(criar).toHaveBeenCalled());
    const { startDate, endDate } = criar.mock.calls[0][0];
    const dias = (new Date(endDate) - new Date(startDate)) / 86400000;
    expect(dias).toBe(6); // 7 dias de tratamento, o primeiro conta
  });

  it("editar um tratamento com prazo reabre no modo certo, com os dias", () => {
    abrir({
      id: 9, medicationName: "Amoxicilina", dose: "500mg", scheduleTimes: "08:00",
      startDate: "2026-09-01", endDate: "2026-09-10",
    });
    // 01 a 10 são 10 dias, não 9 — o primeiro dia conta
    expect(screen.getByLabelText(/Quantidade de dias/i).value).toBe("10");
  });

  it("editar um contínuo reabre como contínuo, sem cobrar escolha de novo", () => {
    abrir({
      id: 9, medicationName: "Losartana", dose: "50mg", scheduleTimes: "08:00",
      startDate: "2026-09-01", endDate: null,
    });
    expect(screen.queryByText(/Escolha uma das duas/i)).toBeNull();
    expect(screen.getByText(/Os lembretes seguem até alguém encerrar/i)).toBeTruthy();
  });
});
