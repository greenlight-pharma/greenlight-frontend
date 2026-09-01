// ============================================================
// [AGENDA-UBS] Máquina de estados da consulta.
//
// Esta cópia é do CLIENTE, e serve para uma coisa só: saber quais botões
// mostrar. A autoridade é o backend (agenda.js), que valida toda transição
// e responde 409 com a lista do que seria permitido.
//
// Duplicação consciente. A alternativa — pedir ao servidor quais ações
// existem para cada linha — significaria uma chamada por linha numa agenda
// de centenas, para uma tabela que muda de mês em mês. Se as duas
// divergirem, quem manda é o servidor, e a tela mostra o erro dele.
//
// Os estados são os que o Rodrigo especificou. O que este módulo acrescenta
// é o que a especificação não define: QUAIS TRANSIÇÕES SÃO LEGAIS.
// Sem isso, "cancelar uma consulta já realizada" ou "ofertar uma vaga que
// não foi liberada" viram bugs difíceis de rastrear no meio de uma agenda
// de UBS com centenas de linhas.
// ============================================================

export const STATUS = {
  AGENDADA: "agendada",
  AGUARDANDO_CONFIRMACAO: "aguardando_confirmacao",
  CONFIRMADA: "confirmada",
  CANCELADA: "cancelada",
  VAGA_DISPONIVEL: "vaga_disponivel",
  VAGA_OFERECIDA: "vaga_oferecida",
  REMARCADA: "remarcada",
  PACIENTE_PRESENTE: "paciente_presente",
  PACIENTE_NAO_CHEGOU: "paciente_nao_chegou",
  NAO_RESPONDEU: "nao_respondeu",
  FALTA: "falta",
};

export const ROTULO = {
  [STATUS.AGENDADA]: { texto: "Agendada", tom: "neutro" },
  [STATUS.AGUARDANDO_CONFIRMACAO]: { texto: "Aguardando confirmação", tom: "espera" },
  [STATUS.CONFIRMADA]: { texto: "Confirmada", tom: "ok" },
  [STATUS.CANCELADA]: { texto: "Cancelada", tom: "erro" },
  [STATUS.VAGA_DISPONIVEL]: { texto: "Vaga disponível", tom: "atencao" },
  [STATUS.VAGA_OFERECIDA]: { texto: "Vaga oferecida", tom: "espera" },
  [STATUS.REMARCADA]: { texto: "Remarcada", tom: "neutro" },
  [STATUS.PACIENTE_PRESENTE]: { texto: "Paciente presente", tom: "ok" },
  [STATUS.PACIENTE_NAO_CHEGOU]: { texto: "Ainda não chegou", tom: "atencao" },
  [STATUS.NAO_RESPONDEU]: { texto: "Não respondeu", tom: "espera" },
  [STATUS.FALTA]: { texto: "Falta registrada", tom: "erro" },
};

// Transições permitidas. Tudo que não está aqui é proibido — e o motivo de
// ser explícito é que agenda de UBS tem muita mão mexendo ao mesmo tempo.
const TRANSICOES = {
  [STATUS.AGENDADA]: [STATUS.AGUARDANDO_CONFIRMACAO, STATUS.CANCELADA, STATUS.REMARCADA],
  [STATUS.AGUARDANDO_CONFIRMACAO]: [
    STATUS.CONFIRMADA,
    STATUS.CANCELADA,
    STATUS.NAO_RESPONDEU,
    STATUS.REMARCADA,
  ],
  [STATUS.CONFIRMADA]: [
    STATUS.PACIENTE_PRESENTE,
    STATUS.PACIENTE_NAO_CHEGOU,
    STATUS.CANCELADA,
    STATUS.REMARCADA,
  ],
  [STATUS.NAO_RESPONDEU]: [
    STATUS.PACIENTE_PRESENTE,
    STATUS.PACIENTE_NAO_CHEGOU,
    STATUS.CANCELADA,
    STATUS.FALTA,
    STATUS.REMARCADA,
  ],
  // Cancelar libera a vaga — é o coração do reaproveitamento.
  [STATUS.CANCELADA]: [STATUS.VAGA_DISPONIVEL],
  [STATUS.VAGA_DISPONIVEL]: [STATUS.VAGA_OFERECIDA, STATUS.AGENDADA],
  // Oferta pode ser aceita (vira agendada), recusada (volta a disponível)
  // ou expirar (volta a disponível para a próxima pessoa da fila).
  [STATUS.VAGA_OFERECIDA]: [STATUS.AGENDADA, STATUS.VAGA_DISPONIVEL],
  [STATUS.REMARCADA]: [STATUS.AGENDADA],
  [STATUS.PACIENTE_NAO_CHEGOU]: [STATUS.PACIENTE_PRESENTE, STATUS.FALTA],
  // Terminais.
  [STATUS.PACIENTE_PRESENTE]: [],
  [STATUS.FALTA]: [],
};

export function transicaoPermitida(de, para) {
  return (TRANSICOES[de] || []).includes(para);
}

export function proximosEstados(de) {
  return TRANSICOES[de] || [];
}

export function ehTerminal(status) {
  return (TRANSICOES[status] || []).length === 0;
}

// ============================================================
// [OFERTA-DE-VAGA] A decisão que a especificação não tomava.
//
// "A vaga somente deverá ser preenchida depois da confirmação do novo
// paciente" — mas se a IA oferecer a MESMA vaga para três pessoas da fila
// ao mesmo tempo, ou duas se decepcionam ou a UBS marca duas no mesmo
// horário. Nenhum dos dois é aceitável.
//
// Escolha: OFERTA SEQUENCIAL COM PRAZO. Uma pessoa por vez, com janela
// curta. Se não responder até o prazo, a oferta expira e passa para a
// próxima. É mais lento que ofertar em massa, mas nunca dá calote nem
// marca em duplicidade — e numa UBS, ligar para desmarcar alguém que já
// se organizou para ir custa mais do que a vaga vale.
// ============================================================

export const PRAZO_OFERTA_MINUTOS = 30;

/**
 * Decide o que fazer com uma vaga disponível, dada a fila e o relógio.
 * Função pura: recebe estado, devolve a próxima ação. Sem efeito colateral.
 */
export function proximaAcaoDaVaga(vaga, fila, agora = new Date()) {
  if (vaga.status === STATUS.VAGA_OFERECIDA) {
    const expiraEm = new Date(vaga.ofertaExpiraEm);
    if (agora >= expiraEm) {
      return {
        acao: "expirar_oferta",
        motivo: `Sem resposta em ${PRAZO_OFERTA_MINUTOS} min`,
        proximoDaFila: fila.find((p) => !vaga.jaOferecidoPara?.includes(p.id)) || null,
      };
    }
    return { acao: "aguardar", motivo: "Oferta em aberto, dentro do prazo" };
  }

  if (vaga.status !== STATUS.VAGA_DISPONIVEL) {
    return { acao: "nenhuma", motivo: "Vaga não está disponível para oferta" };
  }

  const candidato = fila.find((p) => !vaga.jaOferecidoPara?.includes(p.id));
  if (!candidato) {
    return { acao: "nenhuma", motivo: "Fila esgotada para esta vaga" };
  }

  return { acao: "ofertar", para: candidato, motivo: "Primeiro da fila ainda não convidado" };
}

/**
 * Ordena a fila de espera. Critério explícito, não "ordem de chegada" —
 * numa UBS a espera não é só cronológica.
 */
export function ordenarFila(pacientes) {
  const PRIORIDADE = { alta: 0, media: 1, normal: 2 };
  return [...pacientes].sort((a, b) => {
    const p = (PRIORIDADE[a.prioridade] ?? 2) - (PRIORIDADE[b.prioridade] ?? 2);
    if (p !== 0) return p;
    return new Date(a.esperandoDesde) - new Date(b.esperandoDesde);
  });
}


// Rótulo da AÇÃO, que não é o mesmo que o rótulo do estado: o botão diz o
// que a pessoa vai fazer ("Registrar presença"), não o nome do estado a que
// isso leva ("paciente_presente"). Quem opera a recepção não pensa em
// máquina de estados.
export const ACAO = {
  [STATUS.AGUARDANDO_CONFIRMACAO]: "Pedir confirmação",
  [STATUS.CONFIRMADA]: "Marcar confirmada",
  [STATUS.CANCELADA]: "Cancelar",
  [STATUS.VAGA_DISPONIVEL]: "Liberar vaga",
  [STATUS.VAGA_OFERECIDA]: "Ofertar à fila",
  [STATUS.AGENDADA]: "Agendar paciente",
  [STATUS.REMARCADA]: "Remarcar",
  [STATUS.PACIENTE_PRESENTE]: "Registrar presença",
  [STATUS.PACIENTE_NAO_CHEGOU]: "Ainda não chegou",
  [STATUS.NAO_RESPONDEU]: "Sem resposta",
  [STATUS.FALTA]: "Registrar falta",
};

// Ações que destroem informação ou fecham o caso pedem confirmação antes.
export const ACAO_GRAVE = new Set([STATUS.CANCELADA, STATUS.FALTA, STATUS.VAGA_DISPONIVEL]);

// Transições que precisam saber DE QUEM se trata antes de acontecer.
export const ACAO_PEDE_PESSOA = new Set([STATUS.VAGA_OFERECIDA, STATUS.AGENDADA]);
