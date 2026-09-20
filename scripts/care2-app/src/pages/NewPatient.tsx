import { useEffect, useRef, useState } from "react";
import { api, errorText, ServiceError } from "../api";
import { registrationNotice, withCountry, type PatientLookup, type PatientRegistration } from "../models";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, Field, Icon, Notice } from "../ui";

export default function NewPatient({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState(""), [name, setName] = useState("");
  const [notify, setNotify] = useState(true);
  const [lookup, setLookup] = useState<PatientLookup | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null), [planLimit, setPlanLimit] = useState(false);
  const navigate = useNavigate();
  const latest = useRef("");
  // Consulta o telefone assim que fica completo, com pequena espera para não chamar o servidor a cada dígito.
  useEffect(() => {
    latest.current = phone; setLookup(null);
    if (phone.length < 10) return;
    const timer = setTimeout(async () => {
      try {
        const found = await api<PatientLookup>(`/patients/lookup?phone=${withCountry(phone)}`);
        if (latest.current !== phone) return;
        setLookup(found);
        if (found.patient?.name) setName((n) => (n.trim() ? n : found.patient!.name!));
      } catch { /* a consulta é só uma ajuda */ }
    }, 400);
    return () => clearTimeout(timer);
  }, [phone]);
  const alreadyMine = lookup?.exists === true && lookup.linkedToMe === true;
  async function save() {
    if (busy) return; setBusy(true); setError(null);
    try {
      const r = await api<PatientRegistration>("/patients/manual", { method: "POST", body: { name: name.trim(), phone: withCountry(phone), notifyPatient: notify } });
      const notice = registrationNotice(r);
      if (notice) setDone(notice); else onClose();
    } catch (e) {
      // A web não vende plano: o limite (402) só é explicado, sem oferta de compra.
      if (e instanceof ServiceError && e.status === 402) { setError(e.message); setPlanLimit(true); } else setError(errorText(e));
    } finally { setBusy(false); }
  }
  if (done) return <Dialog title="Cadastro concluído" onClose={onClose}><Notice tone="info">{done}</Notice><Button className="big" icon="check" onClick={onClose}>Concluir</Button></Dialog>;
  return <Dialog title="Novo paciente" eyebrow="Um novo vínculo de cuidado" onClose={onClose} locked={busy}>
    <p className="muted">Informe os dados para identificar o paciente e enviar os lembretes pelo WhatsApp.</p>
    <Field label="WhatsApp" placeholder="DDD + número" inputMode="tel" autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} hint="Só números do Brasil. O +55 entra sozinho." />
    <Field label="Nome do paciente" placeholder="Nome completo" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
    {alreadyMine && <Notice tone="info"><b>Este número já está entre seus pacientes.</b>{"\n"}Feche e procure por {lookup?.patient?.name ?? "ele"} na lista. Não é preciso cadastrar de novo.</Notice>}
    {lookup?.exists && !alreadyMine && lookup.otherDoctorName && <Notice tone="info"><b>Já acompanhado por {lookup.otherDoctorName}.</b>{"\n"}Você pode cadastrar mesmo assim. Os dois profissionais enviarão lembretes por este canal, e a ficha mostrará o que o outro mantém ativo.</Notice>}
    <label className="row" style={{ alignItems: "flex-start" }}><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
      <span><span style={{ fontWeight: 500 }}>Avisar o paciente pelo WhatsApp agora</span><br /><span className="muted small">Ele recebe uma mensagem dizendo que você cadastrou os lembretes e como pedir para parar.</span></span></label>
    <div className="row muted small"><Icon name="shield" size={16} />Confira o número antes de cadastrar.</div>
    <Notice>{error}</Notice>
    {planLimit && <Button className="plain big" onClick={() => { onClose(); navigate("/conta"); }}>Ver planos</Button>}
    <Button className="big" icon="plus" busy={busy} disabled={name.trim().length < 2 || phone.length < 10 || alreadyMine} onClick={save}>Cadastrar paciente</Button>
  </Dialog>;
}
