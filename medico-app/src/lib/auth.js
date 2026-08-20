// Guarda do token e dos dados do usuário logado. Único lugar do app que fala
// com o localStorage — antes isso estava espalhado em 6 pontos do medico.html.
//
// [DOIS-PAINEIS] Médico e administrador são sessões DIFERENTES, com chaves
// diferentes (doctorToken / adminToken), exatamente como no medico.html e no
// admin.html. Cada entrada do build chama configureSession() antes de
// renderizar. Manter separado importa: um admin logado não deve herdar
// acesso de médico a prontuário, nem o contrário.
let TOKEN_KEY = "doctorToken";
let DOCTOR_KEY = "doctorData";

export function configureSession(tokenKey, userKey) {
  TOKEN_KEY = tokenKey;
  DOCTOR_KEY = userKey;
}

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
