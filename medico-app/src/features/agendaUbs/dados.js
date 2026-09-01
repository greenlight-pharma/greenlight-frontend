// [AGENDA-UBS] Dados FICTÍCIOS para a maquete.
//
// Nenhum paciente real, nenhuma chamada de API. Os nomes são inventados e a
// UBS é ilustrativa. O objetivo é mostrar o fluxo completo funcionando na
// tela para a apresentação — não simular o sistema pronto.
//
// A regra de negócio (status.js) é código real e testado; isto aqui não é.

import { STATUS } from "./status.js";

export const UNIDADE = {
  nome: "UBS Jardim Oriente",
  municipio: "Taubaté/SP",
  responsavel: "Coordenação de agenda",
};

const hoje = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const DATA_EXIBIDA = hoje();

export const CONSULTAS = [
  {
    id: 1,
    hora: "07:30",
    paciente: "Maria Aparecida Souza",
    idade: 62,
    especialidade: "Clínica geral",
    status: STATUS.PACIENTE_PRESENTE,
    origem: "manual",
    confirmadaEm: "48h antes",
  },
  {
    id: 2,
    hora: "08:00",
    paciente: "José Carlos Pereira",
    idade: 71,
    especialidade: "Cardiologia",
    status: STATUS.CONFIRMADA,
    origem: "manual",
    confirmadaEm: "48h antes",
  },
  {
    id: 3,
    hora: "08:30",
    paciente: "Antônia Ribeiro",
    idade: 58,
    especialidade: "Clínica geral",
    status: STATUS.PACIENTE_NAO_CHEGOU,
    origem: "manual",
    observacao: "Respondeu “ainda não cheguei” às 08:15",
  },
  {
    id: 4,
    hora: "09:00",
    paciente: "—",
    especialidade: "Clínica geral",
    status: STATUS.VAGA_OFERECIDA,
    origem: "ia",
    canceladaPor: "Sebastião Nunes cancelou às 07:12",
    ofertadaPara: "Rita de Cássia Alves",
    ofertaExpiraEm: "09:42",
  },
  {
    id: 5,
    hora: "09:30",
    paciente: "Francisca Lima",
    idade: 66,
    especialidade: "Clínica geral",
    status: STATUS.NAO_RESPONDEU,
    origem: "manual",
    observacao: "Sem resposta à confirmação de 48h",
  },
  {
    id: 6,
    hora: "10:00",
    paciente: "—",
    especialidade: "Cardiologia",
    status: STATUS.VAGA_DISPONIVEL,
    origem: "ia",
    canceladaPor: "Paciente cancelou às 06:40",
  },
  {
    id: 7,
    hora: "10:30",
    paciente: "Benedito Alves",
    idade: 74,
    especialidade: "Clínica geral",
    status: STATUS.AGUARDANDO_CONFIRMACAO,
    origem: "manual",
  },
  {
    id: 8,
    hora: "11:00",
    paciente: "Terezinha Gomes",
    idade: 69,
    especialidade: "Clínica geral",
    status: STATUS.AGENDADA,
    origem: "manual",
  },
];

export const FILA = [
  {
    id: 101,
    nome: "Rita de Cássia Alves",
    idade: 64,
    especialidade: "Clínica geral",
    prioridade: "alta",
    esperandoDesde: "2026-07-14",
    situacao: "convidada",
  },
  {
    id: 102,
    nome: "Sebastião Nunes",
    idade: 70,
    especialidade: "Clínica geral",
    prioridade: "normal",
    esperandoDesde: "2026-06-02",
    situacao: "aguardando",
  },
  {
    id: 103,
    nome: "Cleusa Martins",
    idade: 55,
    especialidade: "Cardiologia",
    prioridade: "alta",
    esperandoDesde: "2026-07-28",
    situacao: "aguardando",
  },
  {
    id: 104,
    nome: "Aparecido Silva",
    idade: 61,
    especialidade: "Clínica geral",
    prioridade: "normal",
    esperandoDesde: "2026-06-19",
    situacao: "aguardando",
  },
];

// [AUDITORIA] O que a IA fez e o que a equipe fez, separados.
// A coordenação precisa poder auditar e desfazer qualquer ação automática.
export const HISTORICO = [
  {
    hora: "09:12",
    autor: "ia",
    acao: "Vaga das 09:00 oferecida a Rita de Cássia Alves",
    detalhe: "Primeira da fila por prioridade alta · prazo de 30 min",
  },
  {
    hora: "07:12",
    autor: "ia",
    acao: "Vaga das 09:00 liberada após cancelamento",
    detalhe: "Sebastião Nunes respondeu “não poderei comparecer”",
  },
  {
    hora: "07:05",
    autor: "equipe",
    acao: "Encaixe manual às 11:00 — Terezinha Gomes",
    detalhe: "Registrado por Coordenação",
  },
  {
    hora: "06:40",
    autor: "ia",
    acao: "Vaga das 10:00 liberada após cancelamento",
    detalhe: "Aguardando fila de Cardiologia",
  },
  {
    hora: "Ontem 18:00",
    autor: "ia",
    acao: "Lembrete de 2h enviado a 6 pacientes",
    detalhe: "5 entregues · 1 falha de entrega",
  },
];

export const RESUMO = {
  agendadas: 8,
  confirmadas: 2,
  presentes: 1,
  semResposta: 1,
  vagasLiberadas: 2,
  vagasReaproveitadas: 0,
};
