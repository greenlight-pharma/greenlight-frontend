import { useState } from "react";
import { Button, Icon, Logo } from "../ui";

// [PRIMEIRO-ACESSO] Três telas, uma vez só. "Pular" existe porque profissional com pressa não lê tutorial.
const KEY = "vytal-care.onboardingVisto";
export const onboardingSeen = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return true; } };
const SLIDES = [
  ["user", "Cadastre o paciente pelo WhatsApp", "Nome e número. Ele recebe um aviso de que você vai enviar os lembretes por ali."],
  ["camera", "Uma foto, e a receita vira lembrete", "Você confere cada item antes de salvar. O Vytal Care só transporta o que foi prescrito."],
  ["chart", "As respostas chegam para você", "Tomou, não tomou, teve reação. Tudo aparece na ficha do paciente e no início."],
];
export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [page, setPage] = useState(0);
  const finish = () => { try { localStorage.setItem(KEY, "1"); } catch { /* sem armazenamento */ } onDone(); };
  const [icon, title, text] = SLIDES[page];
  return <div className="backdrop"><div className="dialog" role="dialog" aria-modal="true" aria-label="Primeiro acesso" style={{ alignItems: "center", textAlign: "center", gap: 20 }}>
    <div className="row between" style={{ width: "100%" }}><Logo size={40} /><button className="link" onClick={finish}>Pular</button></div>
    <div style={{ width: 130, height: 130, borderRadius: 38, background: "var(--blue-soft)", color: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={icon} size={56} stroke={1.4} /></div>
    <h2 style={{ fontSize: 26 }}>{title}</h2><p className="muted" style={{ maxWidth: 320 }}>{text}</p>
    <div className="row" style={{ gap: 6 }} aria-hidden="true">{SLIDES.map((_, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === page ? "var(--blue)" : "var(--fill)" }} />)}</div>
    <Button className="big" icon="chev" onClick={() => (page < SLIDES.length - 1 ? setPage(page + 1) : finish())}>{page === SLIDES.length - 1 ? "Começar" : "Continuar"}</Button>
  </div></div>;
}
