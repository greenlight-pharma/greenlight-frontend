// Visitante no Brasil? Vem do /status (IP consultado no servidor, faixas do LACNIC).
// null = ainda não sabemos. O que só vale no Brasil fica escondido fora dele.
import { useSyncExternalStore } from 'react';
let brasil = null; const subs = new Set();
export const SO_BRASIL = new Set(['enamed']);
export function definirBrasil(v) { const n = v === true; if (brasil !== n) { brasil = n; subs.forEach((f) => f()); } }
export const useBrasil = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => brasil);
export const liberado = (id, b) => !SO_BRASIL.has(id) || b === true;
