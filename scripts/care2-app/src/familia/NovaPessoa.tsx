import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, errorText, ServiceError } from "../api";
import { AppContext } from "../App";
import { registrationNotice, type PatientRegistration } from "../models";
import {phoneCountries,phoneParts,internationalPhone,type CountryCode} from '../phone-country';
import { Button, Dialog, Field, Icon, Notice, Option } from "../ui";

/** [PESSOAL] Quem vai receber os lembretes: a própria pessoa ou alguém da família. */
export default function NovaPessoa({ onClose, paraMim: inicial, onboarding=false, onSaved }: { onClose: () => void; paraMim?: boolean; onboarding?:boolean; onSaved?:(phone:string)=>Promise<void> }) {
  const app = useContext(AppContext);
  const eu = app?.session.doctor;
  const meuFone = phoneParts(eu?.phone ?? "");
  const [country,setCountry]=useState<CountryCode>(inicial?meuFone.country:"BR");
  const [paraMim, setParaMim] = useState<boolean | null>(inicial ?? null);
  const [name, setName] = useState(inicial ? eu?.name ?? "" : ""), [phone, setPhone] = useState(inicial ? meuFone.local : "");
  const fullPhone=internationalPhone(phone,country);
  const concluir = async () => { if(onSaved){await onSaved(fullPhone!);return;} onClose(); };
  const [consent, setConsent] = useState(false), [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null), [limit, setLimit] = useState(false), [done, setDone] = useState<string | null>(null);
  const navigate = useNavigate();
  function escolher(mim: boolean) { setParaMim(mim); setName(mim ? eu?.name ?? "" : ""); setPhone(mim ? meuFone.local : ""); setCountry(mim?meuFone.country:"BR"); setError(null); }
  async function salvar() {
    if (busy || !fullPhone) return; setBusy(true); setError(null);
    try {
      const r = await api<PatientRegistration>("/patients/manual", { method: "POST", body: { name: name.trim(), phone: fullPhone, notifyPatient: !paraMim && notify } });
      const aviso = registrationNotice(r);
      if (aviso) setDone(aviso.replace(/paciente/g, "pessoa")); else await concluir();
    } catch (e) {
      if (e instanceof ServiceError && e.status === 402) { setError(e.message); setLimit(true); } else setError(errorText(e));
    } finally { setBusy(false); }
  }
  if (done) return <Dialog title="Pronto" onClose={concluir}><Notice tone="info">{done}</Notice><Button className="big" icon="check" onClick={concluir}>Concluir</Button></Dialog>;
  const pode = name.trim().length >= 2 && Boolean(fullPhone) && (paraMim || consent);
  return <Dialog title={onboarding?(paraMim?"Seus dados":"Dados do familiar"):"Quem vai receber os lembretes?"} onClose={onClose} locked={busy}>
    {!onboarding&&<div className="row" style={{ alignItems: "stretch" }}>
      <Option on={paraMim === true} icon="user" onClick={() => escolher(true)}>Eu mesmo</Option>
      <Option on={paraMim === false} icon="heart" onClick={() => escolher(false)}>Alguém da família</Option>
    </div>}
    {paraMim !== null && <>
      <Field label={paraMim ? "Seu nome" : "Nome da pessoa"} placeholder="Nome completo" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="row" style={{alignItems:"flex-start",gap:12}}>
        <label className="field" style={{width:"42%",minWidth:0}}><span>País do WhatsApp</span><select value={country} disabled={busy} onChange={e=>setCountry(e.target.value as CountryCode)} style={{width:"100%"}}>{phoneCountries.map(c=><option key={c.country} value={c.country}>{c.flag} +{c.code} · {c.name}</option>)}</select></label>
        <div style={{flex:1,minWidth:0}}><Field label={paraMim ? "Seu WhatsApp" : "WhatsApp da pessoa"} placeholder={country==='BR'?"DDD + número":"Número do WhatsApp"} inputMode="tel" autoComplete="off" value={phone} disabled={busy} onChange={e=>{const value=e.target.value;if(value.trim().startsWith('+')){const parts=phoneParts(value);if(internationalPhone(value,parts.country)){setCountry(parts.country);setPhone(parts.local);return;}}setPhone(value.slice(0,25));}} hint="Os lembretes chegam neste número." /></div>
      </div>
      {phone&&!fullPhone&&<p className="muted small">Confira o número e o país selecionado.</p>}
      {country!=='BR'&&<p className="muted small">Os horários dos lembretes seguem o horário de Brasília.</p>}
      {!paraMim && <label className="row" style={{ alignItems: "flex-start" }}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
        <span><span style={{ fontWeight: 500 }}>{name.trim().split(/\s+/)[0] || "A pessoa"} sabe e concorda em receber os lembretes</span><br /><span className="muted small">Para sair, basta responder PARAR.</span></span></label>}
      {!paraMim && <label className="row" style={{ alignItems: "flex-start" }}><input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--blue)", flexShrink: 0, marginTop: 2 }} />
        <span><span style={{ fontWeight: 500 }}>Enviar boas-vindas</span><br /><span className="muted small">Avisa sobre os lembretes no WhatsApp.</span></span></label>}
      <div className="row muted small"><Icon name="shield" size={16} />Confira o número antes de salvar.</div>
    </>}
    <Notice>{error}</Notice>
    {limit && <Button className="plain big" onClick={() => { onClose(); navigate("/conta"); }}>Ver planos</Button>}
    {paraMim !== null && <Button className="big" icon="plus" busy={busy} disabled={!pode} onClick={salvar}>{onboarding?"Continuar":"Salvar"}</Button>}
  </Dialog>;
}
