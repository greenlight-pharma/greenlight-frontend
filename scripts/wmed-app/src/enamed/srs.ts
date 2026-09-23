// Repetição espaçada dos flashcards (adaptação do SM-2, o algoritmo do Anki).
//
// Dois laços, como na proposta do Rodrigo:
//   1) DENTRO da sessão — quem errou volta poucas perguntas depois e continua
//      voltando até acertar;
//   2) ENTRE sessões — quem acertou ganha uma data de vencimento que CRESCE a
//      cada acerto (não é um intervalo fixo, senão o card ficaria voltando
//      para sempre no mesmo ritmo).
//
// A nota tem 4 níveis (desempenho + confiança). "Revisar de novo" NÃO é nota:
// é um marcador independente, porque o aluno pode acertar com confiança e
// ainda assim querer sinalizar o card.
//
// O cálculo roda no cliente (funciona offline) e o estado resultante é
// no WMed é persistido localmente por conta; sincronização ainda não integrada.

export type Nota = "errei" | "chute" | "inseguro" | "confiante";

export interface EstadoCard {
  cardKey: string; // "areaId:temaIdx:cardIdx"
  ease: number; // fator de facilidade
  intervalo: number; // dias até a próxima revisão
  due: string | null; // ISO; null = nunca estudado
  reps: number; // acertos consecutivos
  lapses: number; // erros após já ter acertado
  marcado: boolean; // sinalizador do aluno
}

// Constantes ajustáveis. Os valores de partida vieram da proposta do Rodrigo;
// a diferença é que os intervalos passam a crescer em vez de ficarem fixos.
export const SRS = {
  EASE_INICIAL: 2.5,
  EASE_MIN: 1.3,
  EASE_MAX: 3.5,
  // Teto do intervalo: acima disso não faz sentido para um ciclo de prova anual.
  MAX_INTERVALO: 180,
  // Recirculação dentro da sessão, em número de cards à frente.
  REQUEUE_ERREI: 5,
  REQUEUE_CHUTE: 15,
  // Primeiro intervalo (dias) quando o aluno acerta um card novo.
  PRIMEIRO_INSEGURO: 1, // volta na próxima sessão
  PRIMEIRO_CONFIANTE: 10, // vira ~25-30 dias já na revisão seguinte
  // Tetos diários: sem isso a fila vira "487 atrasados" e o aluno desiste.
  NOVOS_POR_DIA: 20,
  REVISOES_POR_DIA: 50,
};

const DIA_MS = 24 * 60 * 60 * 1000;

const limitar = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function estadoInicial(cardKey: string): EstadoCard {
  return {
    cardKey,
    ease: SRS.EASE_INICIAL,
    intervalo: 0,
    due: null,
    reps: 0,
    lapses: 0,
    marcado: false,
  };
}

export function estaVencido(e: EstadoCard | undefined, agora = new Date()) {
  if (!e || !e.due) return false;
  return new Date(e.due).getTime() <= agora.getTime();
}

// Aplica a nota e devolve o novo estado + em quantos cards ele deve reaparecer
// ainda nesta sessão (null = sai da sessão, volta só no vencimento).
export function aplicarNota(
  atual: EstadoCard,
  nota: Nota,
  agora = new Date(),
): { estado: EstadoCard; requeue: number | null } {
  const e: EstadoCard = { ...atual };

  if (nota === "errei" || nota === "chute") {
    // Errou (ou acertou por sorte): perde o progresso e volta na mesma sessão.
    if (e.reps > 0) e.lapses += 1;
    e.reps = 0;
    e.intervalo = 0;
    e.due = new Date(agora.getTime()).toISOString();
    e.ease = limitar(
      e.ease - (nota === "errei" ? 0.2 : 0.15),
      SRS.EASE_MIN,
      SRS.EASE_MAX,
    );
    return {
      estado: e,
      requeue: nota === "errei" ? SRS.REQUEUE_ERREI : SRS.REQUEUE_CHUTE,
    };
  }

  // Acertou: sai da sessão e ganha vencimento futuro.
  e.reps += 1;
  if (nota === "inseguro") {
    e.ease = limitar(e.ease - 0.05, SRS.EASE_MIN, SRS.EASE_MAX);
    // O "+1" garante crescimento: sem ele, 1 x 1,2 arredonda de volta para 1
    // e o card ficaria voltando todo dia para sempre.
    e.intervalo =
      e.reps <= 1
        ? SRS.PRIMEIRO_INSEGURO
        : Math.max(e.intervalo + 1, Math.round(e.intervalo * 1.2));
  } else {
    e.ease = limitar(e.ease + 0.1, SRS.EASE_MIN, SRS.EASE_MAX);
    e.intervalo =
      e.reps <= 1
        ? SRS.PRIMEIRO_CONFIANTE
        : Math.max(e.intervalo + 1, Math.round(e.intervalo * e.ease));
  }
  e.intervalo = Math.min(e.intervalo, SRS.MAX_INTERVALO);
  e.due = new Date(agora.getTime() + e.intervalo * DIA_MS).toISOString();
  return { estado: e, requeue: null };
}

export interface ItemFila {
  cardKey: string;
  ti: number;
  ci: number;
  q: string;
  a: string;
}

// Monta a fila da sessão: primeiro o que venceu (mais atrasado antes), depois
// cards novos — respeitando os tetos diários.
export function montarFila(
  deck: { q: string; a: string; ti: number; ci: number }[],
  areaId: string,
  estados: Record<string, EstadoCard>,
  agora = new Date(),
): ItemFila[] {
  const vencidos: { item: ItemFila; due: number }[] = [];
  const novos: ItemFila[] = [];

  for (const c of deck) {
    const cardKey = `${areaId}:${c.ti}:c${c.ci}`;
    const item: ItemFila = { cardKey, ti: c.ti, ci: c.ci, q: c.q, a: c.a };
    const e = estados[cardKey];
    if (!e || !e.due) {
      novos.push(item);
    } else if (estaVencido(e, agora)) {
      vencidos.push({ item, due: new Date(e.due).getTime() });
    }
  }

  vencidos.sort((x, y) => x.due - y.due);
  return [
    ...vencidos.slice(0, SRS.REVISOES_POR_DIA).map((v) => v.item),
    ...novos.slice(0, SRS.NOVOS_POR_DIA),
  ];
}

// Quantos cards de uma área estão disponíveis hoje (vencidos + novos, com teto).
export function contarPendentes(
  deck: { ti: number; ci: number }[],
  areaId: string,
  estados: Record<string, EstadoCard>,
  agora = new Date(),
): number {
  let vencidos = 0;
  let novos = 0;
  for (const c of deck) {
    const e = estados[`${areaId}:${c.ti}:c${c.ci}`];
    if (!e || !e.due) novos++;
    else if (estaVencido(e, agora)) vencidos++;
  }
  return (
    Math.min(vencidos, SRS.REVISOES_POR_DIA) + Math.min(novos, SRS.NOVOS_POR_DIA)
  );
}
