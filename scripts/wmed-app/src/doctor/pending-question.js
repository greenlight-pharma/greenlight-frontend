// Pergunta digitada antes do cadastro: fica só nesta aba (sessionStorage) para sobreviver à ida e
// volta do Google. É apagada ao ser usada, ao fechar o cadastro ou depois de 30 minutos.
const KEY = '2doctor-pending-question';
const MAX_AGE = 30 * 60 * 1000;
export function savePendingQuestion(text) {
 try { sessionStorage.setItem(KEY, JSON.stringify({ q: String(text).slice(0, 6000), at: Date.now() })); } catch { /* sem armazenamento: vale só o estado da página */ }
}
export function clearPendingQuestion() { try { sessionStorage.removeItem(KEY); } catch { /* segue */ } }
export function takePendingQuestion() {
 try {
  const raw = sessionStorage.getItem(KEY); if (!raw) return '';
  sessionStorage.removeItem(KEY);
  const { q, at } = JSON.parse(raw);
  return typeof q === 'string' && Date.now() - at < MAX_AGE ? q : '';
 } catch { return ''; }
}
