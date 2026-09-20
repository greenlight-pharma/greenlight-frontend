import type { Doctor, Session } from "./models";

// Mesmo servidor do app iOS e Android (greenlight-backend).
export const BASE_URL = (import.meta.env.VITE_CARE2_API_URL as string | undefined) ?? "https://greenlight-backend-production-35c8.up.railway.app";
const KEY = "vytal-care2.sessao";

export class ServiceError extends Error {
  status: number; payload: Record<string, unknown>;
  constructor(message: string, status = 0, payload: Record<string, unknown> = {}) { super(message); this.status = status; this.payload = payload; }
}
type Listener = (s: Session | null, message?: string) => void;
const listeners = new Set<Listener>();
// [PREVIA] /?previa=1 em desenvolvimento abre com dados sintéticos e sem rede, como o --design-preview do app.
const DEMO = import.meta.env.DEV && new URLSearchParams(location.search).has("previa");
let current: Session | null = DEMO ? { token: "previa", doctor: { name: "Helena Prado", email: "previa@example.invalid", crm: "CRM/PR 12345", profissao: "medico", tipoConta: new URLSearchParams(location.search).get("previa") === "familia" ? "pessoal" : "profissional" } } : read();
function read(): Session | null { try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as Session) : null; } catch { return null; } }
function emit(message?: string) { listeners.forEach((l) => l(current, message)); }

export const session = {
  get: () => current,
  subscribe(l: Listener) { listeners.add(l); return () => { listeners.delete(l); }; },
  save(token: string, doctor: Doctor) {
    if (!token) throw new ServiceError("Não foi possível validar a sessão. Entre novamente.");
    current = { token, doctor: { name: doctor.name, email: doctor.email, crm: doctor.crm, profissao: doctor.profissao, tipoConta: doctor.tipoConta ?? "profissional", phone: doctor.phone ?? null } };
    if (DEMO) return emit();
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* sessão só na memória */ }
    emit();
  },
  /** Atualiza nome e registro guardados, sem trocar o token. */
  updateDoctor(d: Doctor) { if (current) this.save(current.token, { ...current.doctor, name: d.name ?? current.doctor.name, crm: d.crm ?? current.doctor.crm, profissao: d.profissao ?? current.doctor.profissao, tipoConta: d.tipoConta ?? current.doctor.tipoConta, phone: d.phone !== undefined ? d.phone : current.doctor.phone }); },
  logout(message?: string) { current = null; try { localStorage.removeItem(KEY); } catch { /* nada guardado */ } emit(message); },
};

export async function api<T = unknown>(path: string, options: { method?: string; body?: unknown; authenticated?: boolean } = {}): Promise<T> {
  const { method = "GET", body, authenticated = true } = options;
  if (DEMO) { const { demoResponse } = await import("./demo"); try { return demoResponse(path, method, body) as T; } catch (e) { throw new ServiceError(errorText(e)); } }
  const token = authenticated ? current?.token : undefined;
  let response: Response;
  try {
    response = await fetch(BASE_URL + path, { method, cache: "no-store", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch { throw new ServiceError("Não foi possível conectar. Verifique a internet e tente novamente."); }
  const text = await response.text();
  let payload: any = {};
  try { payload = text ? JSON.parse(text) : {}; } catch { payload = {}; }
  if (!response.ok) {
    let message: string = payload?.error ?? payload?.message ?? "Não foi possível concluir. Tente novamente.";
    if (response.status === 402) message = payload?.error ?? "O limite de pacientes desta conta foi atingido. Os pacientes atuais continuam recebendo os lembretes normalmente.";
    if (response.status === 401 && authenticated && current?.token === token) { message = "Sua sessão expirou. Entre novamente."; session.logout(message); }
    throw new ServiceError(message, response.status, payload ?? {});
  }
  return payload as T;
}
export const errorText = (e: unknown) => (e instanceof Error ? e.message : "Não foi possível concluir. Tente novamente.");
