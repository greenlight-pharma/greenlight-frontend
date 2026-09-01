import { describe, it, expect } from "vitest";
import {
  STATUS,
  transicaoPermitida,
  proximosEstados,
  ehTerminal,
  proximaAcaoDaVaga,
  ordenarFila,
  PRAZO_OFERTA_MINUTOS,
} from "./status.js";

const AGORA = new Date("2026-09-01T10:00:00");
const MIN = 60000;

describe("transições legais", () => {
  it("o caminho normal de uma consulta que dá certo", () => {
    expect(transicaoPermitida(STATUS.AGENDADA, STATUS.AGUARDANDO_CONFIRMACAO)).toBe(true);
    expect(transicaoPermitida(STATUS.AGUARDANDO_CONFIRMACAO, STATUS.CONFIRMADA)).toBe(true);
    expect(transicaoPermitida(STATUS.CONFIRMADA, STATUS.PACIENTE_PRESENTE)).toBe(true);
  });

  it("cancelar libera a vaga — é o coração do reaproveitamento", () => {
    expect(transicaoPermitida(STATUS.CANCELADA, STATUS.VAGA_DISPONIVEL)).toBe(true);
    expect(transicaoPermitida(STATUS.VAGA_DISPONIVEL, STATUS.VAGA_OFERECIDA)).toBe(true);
    expect(transicaoPermitida(STATUS.VAGA_OFERECIDA, STATUS.AGENDADA)).toBe(true);
  });

  it("oferta recusada ou expirada devolve a vaga para a fila", () => {
    expect(transicaoPermitida(STATUS.VAGA_OFERECIDA, STATUS.VAGA_DISPONIVEL)).toBe(true);
  });

  it("quem já foi atendido não pode ser cancelado nem remarcado", () => {
    expect(transicaoPermitida(STATUS.PACIENTE_PRESENTE, STATUS.CANCELADA)).toBe(false);
    expect(transicaoPermitida(STATUS.PACIENTE_PRESENTE, STATUS.REMARCADA)).toBe(false);
    expect(ehTerminal(STATUS.PACIENTE_PRESENTE)).toBe(true);
  });

  it("falta é terminal — reabrir exige remarcar, não editar o status", () => {
    expect(ehTerminal(STATUS.FALTA)).toBe(true);
    expect(proximosEstados(STATUS.FALTA)).toEqual([]);
  });

  it("não dá para ofertar vaga que não foi liberada", () => {
    expect(transicaoPermitida(STATUS.CONFIRMADA, STATUS.VAGA_OFERECIDA)).toBe(false);
    expect(transicaoPermitida(STATUS.AGENDADA, STATUS.VAGA_OFERECIDA)).toBe(false);
  });

  it("quem não respondeu ainda pode aparecer na UBS", () => {
    // O paciente silencioso não é falta até o horário passar.
    expect(transicaoPermitida(STATUS.NAO_RESPONDEU, STATUS.PACIENTE_PRESENTE)).toBe(true);
    expect(transicaoPermitida(STATUS.NAO_RESPONDEU, STATUS.FALTA)).toBe(true);
  });
});

describe("oferta de vaga — sequencial com prazo", () => {
  const fila = [
    { id: 1, nome: "Ana", prioridade: "normal", esperandoDesde: "2026-08-01" },
    { id: 2, nome: "Bruno", prioridade: "normal", esperandoDesde: "2026-08-05" },
  ];

  it("oferta para o primeiro da fila ainda não convidado", () => {
    const vaga = { status: STATUS.VAGA_DISPONIVEL, jaOferecidoPara: [] };
    const r = proximaAcaoDaVaga(vaga, fila, AGORA);
    expect(r.acao).toBe("ofertar");
    expect(r.para.nome).toBe("Ana");
  });

  // O ponto que a especificação não resolvia.
  it("NÃO oferta a mesma vaga para duas pessoas ao mesmo tempo", () => {
    const vaga = {
      status: STATUS.VAGA_OFERECIDA,
      jaOferecidoPara: [1],
      ofertaExpiraEm: new Date(AGORA.getTime() + 10 * MIN).toISOString(),
    };
    const r = proximaAcaoDaVaga(vaga, fila, AGORA);
    expect(r.acao).toBe("aguardar");
  });

  it("oferta expirada passa para o próximo, sem repetir quem já recusou", () => {
    const vaga = {
      status: STATUS.VAGA_OFERECIDA,
      jaOferecidoPara: [1],
      ofertaExpiraEm: new Date(AGORA.getTime() - MIN).toISOString(),
    };
    const r = proximaAcaoDaVaga(vaga, fila, AGORA);
    expect(r.acao).toBe("expirar_oferta");
    expect(r.proximoDaFila.nome).toBe("Bruno");
  });

  it("fila esgotada não gera oferta em loop", () => {
    const vaga = { status: STATUS.VAGA_DISPONIVEL, jaOferecidoPara: [1, 2] };
    const r = proximaAcaoDaVaga(vaga, fila, AGORA);
    expect(r.acao).toBe("nenhuma");
    expect(r.motivo).toMatch(/esgotada/);
  });

  it("vaga já preenchida não volta a ser ofertada", () => {
    const vaga = { status: STATUS.CONFIRMADA, jaOferecidoPara: [] };
    expect(proximaAcaoDaVaga(vaga, fila, AGORA).acao).toBe("nenhuma");
  });

  it("o prazo é explícito e curto", () => {
    expect(PRAZO_OFERTA_MINUTOS).toBeLessThanOrEqual(60);
  });
});

describe("ordenação da fila", () => {
  it("prioridade clínica vem antes de tempo de espera", () => {
    const fila = ordenarFila([
      { id: 1, nome: "Antigo", prioridade: "normal", esperandoDesde: "2026-01-01" },
      { id: 2, nome: "Grave", prioridade: "alta", esperandoDesde: "2026-08-30" },
    ]);
    expect(fila[0].nome).toBe("Grave");
  });

  it("dentro da mesma prioridade, quem espera há mais tempo vem primeiro", () => {
    const fila = ordenarFila([
      { id: 1, nome: "Recente", prioridade: "normal", esperandoDesde: "2026-08-20" },
      { id: 2, nome: "Antigo", prioridade: "normal", esperandoDesde: "2026-03-10" },
    ]);
    expect(fila[0].nome).toBe("Antigo");
  });

  it("não altera o array recebido", () => {
    const original = [
      { id: 1, prioridade: "normal", esperandoDesde: "2026-08-20" },
      { id: 2, prioridade: "alta", esperandoDesde: "2026-08-21" },
    ];
    const copia = JSON.stringify(original);
    ordenarFila(original);
    expect(JSON.stringify(original)).toBe(copia);
  });
});
