// Guarda do token e dos dados do médico. Único lugar do app que fala com o
// localStorage — antes isso estava espalhado em 6 pontos do medico.html.
const TOKEN_KEY = "doctorToken";
const DOCTOR_KEY = "doctorData";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getDoctor() {
  try {
    return JSON.parse(localStorage.getItem(DOCTOR_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setSession(token, doctor) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor || {}));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(DOCTOR_KEY);
}

// [SESSAO-EXPIRADA] O medico.html tinha 36 fetch() e NENHUM tratava 401.
// Na prática: token vencia, o médico salvava a medicação e via "Erro ao
// cadastrar" — mensagem que não diz o que houve nem o que fazer. Em UBS,
// com computador compartilhado e sessão longa, isso acontece direto.
//
// Agora a camada de API (api.js) emite este evento em QUALQUER 401, e o App
// escuta uma vez só: limpa a sessão e manda pro login com aviso claro.
const SESSION_EXPIRED = "vytal:session-expired";

export function emitSessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED));
}

export function onSessionExpired(handler) {
  window.addEventListener(SESSION_EXPIRED, handler);
  return () => window.removeEventListener(SESSION_EXPIRED, handler);
}
