// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import React from "react";

// [DURACAO] Primeiro teste de componente do projeto. Existe porque o defeito
// que o motivou não era de lógica — era de TELA: a duração não aparecia, e
// nenhum dos 150 testes de unidade podia ver isso.

const criar = vi.fn(() => Promise.resolve({}));
vi.mock("./api.js", () => ({
  useCreateMedication: () => ({ mutateAsync: criar, isPending: false }),
}));

const post = vi.fn();
vi.mock("../../lib/api.js", () => ({
  api: { post: (...a) => post(...a) },
  ApiError: class ApiError extends Error {},
}));

const { default: ReceitaFotoModal } = await import("./ReceitaFotoModal.jsx");

const ITEM_BASE = {
  dose: "500mg", presetSugerido: "1x", dosesPorDia: 1, usoCondicional: false,
  instructions: "", precisaRevisao: false, motivos: [],
};

async function abrirCom(itens) {
  post.mockResolvedValueOnce({ itens });
  render(<ReceitaFotoModal open patientName="Maria" phone="5521999" onClose={() => {}} />);
  // dispara a leitura da "foto"
  const arquivo = new File(["x"], "receita.png", { type: "image/png" });
  const input = document.querySelector('input[type="file"]');
  Object.defineProperty(input, "files", { value: [arquivo] });
  fireEvent.change(input);
  await waitFor(() => expect(screen.getByText(/Duração do tratamento/i)).toBeTruthy());
}

beforeEach(() => { criar.mockClear(); post.mockReset(); });
afterEach(cleanup);

describe("duração do tratamento na leitura da receita", () => {
  it("mostra o campo, que era o que faltava na tela", async () => {
    await abrirCom([{ ...ITEM_BASE, medicationName: "Losartana", duracaoTexto: "", duracaoDias: null, usoContinuo: false }]);
    expect(screen.getByText(/Duração do tratamento/i)).toBeTruthy();
    expect(screen.getByText(/Uso contínuo/i)).toBeTruthy();
  });

  it("quando a receita diz 'por 10 dias', já vem preenchido", async () => {
    await abrirCom([{
      ...ITEM_BASE, medicationName: "Amoxicilina",
      duracaoTexto: "de 8 em 8h por 10 dias", duracaoDias: 10, usoContinuo: false,
    }]);
    expect(screen.getByLabelText(/Quantidade de dias/i).value).toBe("10");
    // e mostra o que a receita dizia, para conferência
    expect(screen.getByText(/de 8 em 8h por 10 dias/)).toBeTruthy();
  });

  it("quando a receita diz uso contínuo, marca contínuo", async () => {
    await abrirCom([{
      ...ITEM_BASE, medicationName: "Losartana",
      duracaoTexto: "uso contínuo", duracaoDias: null, usoContinuo: true,
    }]);
    const radios = screen.getAllByRole("radio");
    expect(radios[0].checked).toBe(true);
  });

  it("quando a receita NÃO diz, avisa e recusa salvar", async () => {
    // Nenhum default é seguro: assumir contínuo faz o antibiótico lembrar
    // para sempre; assumir um prazo cala o remédio de pressão em silêncio.
    await abrirCom([{ ...ITEM_BASE, medicationName: "Losartana", duracaoTexto: "", duracaoDias: null, usoContinuo: false }]);
    expect(screen.getByText(/A receita não diz por quanto tempo/i)).toBeTruthy();

    fireEvent.click(screen.getByText(/Adicionar 1 medicação/i));
    await waitFor(() =>
      expect(screen.getByText(/Informe por quantos dias, ou marque uso contínuo/i)).toBeTruthy()
    );
    expect(criar).not.toHaveBeenCalled();
  });

  it("uso contínuo salva SEM data de fim — é assim que o cron entende 'não para'", async () => {
    await abrirCom([{
      ...ITEM_BASE, medicationName: "Losartana",
      duracaoTexto: "uso contínuo", duracaoDias: null, usoContinuo: true,
    }]);
    fireEvent.click(screen.getByText(/Adicionar 1 medicação/i));
    await waitFor(() => expect(criar).toHaveBeenCalled());
    expect(criar.mock.calls[0][0].endDate).toBe("");
  });

  it("'por N dias' salva endDate incluindo o último dia", async () => {
    await abrirCom([{
      ...ITEM_BASE, medicationName: "Amoxicilina",
      duracaoTexto: "por 10 dias", duracaoDias: 10, usoContinuo: false,
    }]);
    fireEvent.click(screen.getByText(/Adicionar 1 medicação/i));
    await waitFor(() => expect(criar).toHaveBeenCalled());
    const { startDate, endDate } = criar.mock.calls[0][0];
    const dias = (new Date(endDate) - new Date(startDate)) / 86400000;
    // 10 dias de tratamento começando hoje terminam no 10º dia, não no 11º
    expect(dias).toBe(9);
  });
});
