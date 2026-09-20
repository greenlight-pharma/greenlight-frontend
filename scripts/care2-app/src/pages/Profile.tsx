import { useState } from "react";
import { api, errorText, session } from "../api";
import { PLACEHOLDER_NAME, parseRegistration, patientReads, registrationBody, registrationComplete, type Doctor, type Registration } from "../models";
import { Button, Dialog, Field, Notice, RegistrationFields, useLoad } from "../ui";

/** Editar nome e registro. `required`: conta antiga com nome provisório; não fecha sem completar. */
export function ProfileDialog({ required = false, onClose }: { required?: boolean; onClose: () => void }) {
  const current = session.get()?.doctor;
  const [name, setName] = useState(current?.name && current.name !== PLACEHOLDER_NAME ? current.name : "");
  const [registration, setRegistration] = useState<Registration>(parseRegistration(current?.crm, current?.profissao));
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  useLoad(async (alive) => { try { const p = await api<{ doctor: Doctor }>("/auth/perfil"); if (!alive()) return; if (p.doctor.name && p.doctor.name !== PLACEHOLDER_NAME) setName(p.doctor.name); setRegistration(parseRegistration(p.doctor.crm, p.doctor.profissao)); } catch { /* fica com o que a sessão tem */ } }, []);
  async function save() {
    if (busy) return; setBusy(true); setError(null);
    try { const r = await api<{ doctor: Doctor }>("/auth/perfil", { method: "PATCH", body: { name: name.trim(), ...registrationBody(registration) } }); session.updateDoctor(r.doctor); onClose(); }
    catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  return <Dialog title={required ? "Como seus pacientes conhecem você?" : "Nome e registro"} onClose={onClose} locked={required || busy}>
    <p className="muted">Seu nome aparece nas mensagens que o paciente recebe pelo WhatsApp.{required ? " Complete antes de continuar." : ""}</p>
    <Field label="Nome completo" placeholder="Como o paciente conhece você" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
    <RegistrationFields value={registration} onChange={setRegistration} />
    {name.trim().length >= 2 && <p className="muted small">O paciente lê: “{patientReads(name, registration.profession || "medico")}”.</p>}
    <Notice>{error}</Notice>
    <Button className="big" icon="check" busy={busy} disabled={name.trim().length < 3 || !registrationComplete(registration)} onClick={save}>Salvar</Button>
    {required && <button className="link" onClick={() => session.logout()}>Sair da conta</button>}
  </Dialog>;
}
