// Perguntas grátis sem conta: o servidor é quem conta e decide (cookie assinado + banco).
// Aqui fica só uma cópia do total já usado, para o site saber quando abrir o cadastro sem ida e volta.
const KEY = '2d_anon_used';
let memory = 0;
export function anonUsed() {
 try { return Math.max(memory, parseInt(localStorage.getItem(KEY), 10) || 0); } catch { return memory; }
}
export function saveAnonUsed(n) {
 memory = Math.max(0, n | 0);
 try { localStorage.setItem(KEY, String(memory)); } catch { /* sem armazenamento: vale só nesta página */ }
}
