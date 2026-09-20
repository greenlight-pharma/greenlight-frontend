import { useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { Schedule } from "../models";
import { Icon, Surface } from "../ui";
import { useFamilia, type Aviso } from "./Familia";

const ESTILO: Record<Aviso["tipo"], [string, string, string]> = {
  dose: ["clock", "var(--warn)", "var(--warn-soft)"],
  reacao: ["alert", "var(--bad)", "var(--bad-soft)"],
  medicao: ["gauge", "var(--warn)", "var(--warn-soft)"],
  receita: ["calendar", "var(--blue)", "var(--blue-soft)"],
  tomou: ["check", "var(--ok)", "var(--ok-soft)"],
};

export function AvisoLinha({ aviso: a }: { aviso: Aviso }) {
  const [icone, cor, fundo] = ESTILO[a.tipo] ?? ESTILO.dose;
  return <Link to={`/p/${a.phone}`} className="row" style={{ alignItems: "flex-start", gap: 12, padding: "10px 4px", color: "var(--ink)", borderBottom: "1px solid var(--line)" }}>
    <div style={{ width: 40, height: 40, borderRadius: 13, background: fundo, color: cor, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={icone} size={20} /></div>
    <div className="grow"><div style={{ fontWeight: a.lidoEm ? 500 : 700 }}>{a.texto}</div><div className="muted small">{Schedule.dateTime(a.criadoEm)}</div></div>
    {!a.lidoEm && <span aria-label="novo" style={{ width: 10, height: 10, borderRadius: 5, background: "var(--blue)", marginTop: 8, flexShrink: 0 }} />}
  </Link>;
}

export default function Avisos() {
  const { avisos, naoLidos, recarregarAvisos } = useFamilia();
  // Abrir a lista marca como lidos, depois de um instante (o destaque ainda aparece).
  useEffect(() => {
    if (!naoLidos) return;
    const t = setTimeout(() => { api("/familia/avisos/lidos", { method: "POST", body: {} }).then(() => recarregarAvisos()).catch(() => {}); }, 2500);
    return () => clearTimeout(t);
  }, [naoLidos, recarregarAvisos]);
  return <div className="page narrow">
    <div className="row between wrap"><h1>Avisos</h1><Link to="/conta#avisos" className="small">Configurar avisos</Link></div>
    {avisos.length === 0 ? <Surface style={{ alignItems: "center", textAlign: "center", padding: 36 }}><span className="muted"><Icon name="check" size={36} /></span><b>Nenhum aviso por enquanto</b>
      <span className="muted">Você será avisado quando uma dose não for confirmada, quando algo diferente for relatado, quando uma medição sair da faixa ou quando um tratamento estiver terminando.</span></Surface>
      : <Surface style={{ gap: 0 }}>{avisos.map((a) => <AvisoLinha key={a.id} aviso={a} />)}</Surface>}
    <p className="muted small">Os avisos mostram o que aconteceu. O que fazer com cada um é sempre com o médico.</p>
  </div>;
}
