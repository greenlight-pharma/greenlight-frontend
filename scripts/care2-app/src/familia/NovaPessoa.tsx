import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, errorText, ServiceError } from "../api";
import { AppContext } from "../App";
import { registrationNotice, withCountry, type PatientRegistration } from "../models";
import { Button, Dialog, Field, Icon, Notice, Option } from "../ui";

/** [PESSOAL] Quem vai receber os lembretes: a própria pessoa ou alguém da família. */
export default function NovaPessoa({ onClose, paraMim: inicial }: { onClose: () => void; paraMim?: boolean }) {
  const app = useContext(AppContext);
  const eu = app?.session.doctor;
  const meuFone = (eu?.phone ?? "").replace(/^55/, "");
  const [paraMim, setParaMim] = useState<boolean | null>(inicial ?? null);
  const [name, setName] = useState(inicial ? eu?.name ?? "" : ""), [phone, setPhone] = useState(inicial ? meuFone : "");
  const [consent, setConsent] = useState(false), [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null), [limit, setLimit] = useState(false), [done, setDone] = useState<string | null>(null);
  const navigate = useNavigate();
  function escolher(mim: boolean) { setParaMim(mim); setName(mim ? eu?.name ?? "" : ""); setPhone(mim ? meuFone : ""); setError(null); }
  async function salvar() {
    if (busy) return; setBusy(true); setError(null);
    try {
      const r = await api<PatientRegistration>("/patients/manual", { method: "POST", body: { name: name.trim(), phone: withCountry(phone), notifyPatient: !paraMim && notify } });
      const aviso = registrationNotice(r);
      if (aviso) setDone(aviso.replace(/paciente/g, "pessoa")); else onClose();
    } catch (e) {
      if (e instanceof ServiceError && e.status === 402) { setError(e.message); setLimit(true); } else setError(errorText(e));
    } finally { setBusy(false); }
  }
  if (done) return <Dialog title="Pronto" onClose={onClose}><Notice tone="info">{done}</Notice><Button className="big" icon="check" onClick={onClose}>Concluir</Button></Dialog>;
  const pode = name.trim().length >= 2 && phone.length >= 10 && (paraMim || consent);
  return <Dialog title="Quem vai receber os lembretes?" onClose={onClose} locked={busy}>
    <div className="row" style={{ alignItems: "stretch" }}>
      <Option on={paraMim === true} icon="user" onClick={() => escolher(true)}>Eu mesmo</Option>
      <Option on={paraMim === false} icon="heart" onClick={() => escolher(false)}>Alguém da família</Option>
    </div>
    {paraMim !== null && <>
      <Field label={paraMim ? "Seu nome" : "Nome da pessoa"} placeholder="Nome completo" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
      <Field label={paraMim ? "Seu WhatsApp" : "WhatsApp da pessoa"} placeholder="DDD + número" inputMode="tel" autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} hint="É para este número que os lembretes vão. Só números do Brasil." />
      {!paraMim && <label className="row" style={{ alignItems: "flex-start" }}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
        <span><span style={{ fontWeight: 500 }}>{name.trim().split(/\s+/)[0] || "A pessoa"} sabe e concorda em receber os lembretes</span><br /><span className="muted small">Ela pode parar a qualquer momento respondendo PARAR no WhatsApp.</span></span></label>}
      {!paraMim && <label className="row" style={{ alignItems: "flex-start" }}><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
        <span><span style={{ fontWeight: 500 }}>Mandar a mensagem de boas-vindas agora</span><br /><span className="muted small">Explica que os lembretes vão chegar por ali e como pedir para parar.</span></span></label>}
      <div className="row muted small"><Icon name="shield" size={16} />Confira o número antes de salvar.</div>
    </>}
    <Notice>{error}</Notice>
    {limit && <Button className="plain big" onClick={() => { onClose(); navigate("/conta"); }}>Ver planos</Button>}
    {paraMim !== null && <Button className="big" icon="plus" busy={busy} disabled={!pode} onClick={salvar}>Salvar</Button>}
  </Dialog>;
}
