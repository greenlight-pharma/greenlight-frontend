import { api } from "../lib/api.js";

// Endpoints da passagem de plantão. A regra mora no backend (samu.js); aqui
// é só o transporte.
export const samuApi = {
  login: (registro, senha) =>
    api.post("/samu/auth/login", { registro, senha }, { auth: false }),
  catalogo: () => api.get("/samu/catalogo"),
  bases: () => api.get("/samu/bases"),
  viaturas: (baseId) => api.get(`/samu/viaturas${baseId ? `?baseId=${baseId}` : ""}`),
  profissionais: (baseId) =>
    api.get(`/samu/profissionais${baseId ? `?baseId=${baseId}` : ""}`),

  // clienteId é gerado no aparelho: se o envio for repetido (rede oscilando,
  // toque duplo), o servidor devolve o mesmo plantão em vez de abrir outro.
  iniciarPlantao: (corpo) => api.post("/samu/plantoes", corpo),
  plantao: (id) => api.get(`/samu/plantoes/${id}`),
  salvarConferencia: (id, corpo) => api.put(`/samu/plantoes/${id}/conferencia`, corpo),
  pendenciaManual: (id, corpo) => api.post(`/samu/plantoes/${id}/pendencias`, corpo),
  resolverPendencia: (id) => api.post(`/samu/pendencias/${id}/resolver`),
  finalizar: (id, corpo) => api.post(`/samu/plantoes/${id}/finalizar`, corpo),
  historico: (viaturaId) => api.get(`/samu/viaturas/${viaturaId}/historico`),
};

// [RASCUNHO-LOCAL] A conferência é longa e feita dentro da ambulância. Se a
// rede cair ou a tela recarregar no meio, perder tudo faria o plantão voltar
// ao papel na primeira vez que acontecesse. O rascunho fica no aparelho e só
// é apagado quando o servidor confirma o salvamento.
const CHAVE = (plantaoId) => `samuRascunho:${plantaoId}`;

export function lerRascunho(plantaoId) {
  try {
    const cru = localStorage.getItem(CHAVE(plantaoId));
    return cru ? JSON.parse(cru) : null;
  } catch {
    return null;
  }
}

export function salvarRascunho(plantaoId, dados) {
  try {
    localStorage.setItem(CHAVE(plantaoId), JSON.stringify({ ...dados, em: Date.now() }));
  } catch {
    // cota cheia ou modo privado: o rascunho é conveniência, não o registro
  }
}

export function limparRascunho(plantaoId) {
  try {
    localStorage.removeItem(CHAVE(plantaoId));
  } catch {}
}

// O catálogo muda raramente e é preciso para conferir offline.
const CHAVE_CATALOGO = "samuCatalogo";

export function catalogoEmCache() {
  try {
    const cru = localStorage.getItem(CHAVE_CATALOGO);
    return cru ? JSON.parse(cru) : null;
  } catch {
    return null;
  }
}

export function guardarCatalogo(catalogo) {
  try {
    localStorage.setItem(CHAVE_CATALOGO, JSON.stringify(catalogo));
  } catch {}
}

export function idDeCliente() {
  return `samu-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
