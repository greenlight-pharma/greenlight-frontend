import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, errorText } from "../api";
import { AppContext } from "../App";
import { Schedule, Weekdays, parseWeekdays, timesOf, type AdherenceMedication } from "../models";
import { Button, Icon, Logo, Notice, Spinner, useLoad } from "../ui";
import { foraDaFaixa, textoMedicao, type ResumoPessoa } from "./Pessoa";

const COR: Record<string, string> = { ok: "#1B8A4F", parcial: "#E0A12B", falhou: "#D6453A", reacao: "#D6453A", sem_doses: "#D5D9E0", pendente: "#9DB9E8" };
const media = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

/** [PESSOAL] Resumo dos últimos 30 dias para levar à consulta (imprimir ou salvar em PDF). */
export default function Resumo() {
  const { phone = "" } = useParams();
  const app = useContext(AppContext)!;
  const [r, setR] = useState<ResumoPessoa | null>(null), [adesao, setAdesao] = useState<AdherenceMedication[] | null>(null), [error, setError] = useState<string | null>(null);
  useLoad(async (alive) => {
    try {
      const [a, b] = await Promise.all([api<ResumoPessoa>(`/familia/pessoas/${phone}/resumo`), api<{ resumo: AdherenceMedication[] }>(`/patients/${phone}/adesao?dias=30`)]);
      if (alive()) { setR(a); setAdesao(b.resumo ?? []); }
    } catch (e) { if (alive()) setError(errorText(e)); }
  }, [phone]);
  if (error) return <div className="page narrow"><Notice>{error}</Notice></div>;
  if (!r || !adesao) return <div className="page narrow"><div className="row muted"><Spinner />Montando o resumo…</div></div>;
  const pressoes = r.medicoes.filter((m) => m.tipo === "pressao"), glicemias = r.medicoes.filter((m) => m.tipo === "glicemia");
  const fora = r.medicoes.filter((m) => foraDaFaixa(m, r.faixa));
  const esperadas = adesao.reduce((n, m) => n + m.esperadas, 0), tomou = adesao.reduce((n, m) => n + m.tomou, 0);
  const inicio = r.dias[0]?.data ?? r.hoje;
  return <div className="page resumo" style={{ maxWidth: 860 }}>
    <div className="row between wrap no-print">
      <Link to={`/p/${phone}`} className="row small" style={{ gap: 4, fontWeight: 600 }}><Icon name="back" size={16} />{r.pessoa}</Link>
      <Button icon="upload" onClick={() => window.print()}>Imprimir ou salvar em PDF</Button>
    </div>
    <header className="row between wrap" style={{ alignItems: "flex-end", borderBottom: "2px solid var(--ink)", paddingBottom: 12 }}>
      <div><div className="row" style={{ gap: 8 }}><Logo size={30} /><b>Vytal Care</b></div><h1 style={{ marginTop: 10 }}>Resumo para a consulta</h1><div style={{ fontSize: 20, fontWeight: 600 }}>{r.pessoa}</div></div>
      <div className="muted small" style={{ textAlign: "right" }}>Período: {Schedule.display(inicio)} a {Schedule.display(r.hoje)}<br />Gerado em {Schedule.dateTime(new Date().toISOString())}<br />por {app.session.doctor.name}</div>
    </header>

    <section className="stack" style={{ gap: 8 }}>
      <h2>Remédios em uso</h2>
      {r.medicacoes.length === 0 ? <p className="muted">Nenhum remédio cadastrado.</p> : <table className="tabela"><thead><tr><th>Remédio</th><th>Horários</th><th>Até</th></tr></thead><tbody>
        {r.medicacoes.map((m) => <tr key={m.id}><td><b>{m.medicationName}</b> {m.dose}{m.instructions ? <div className="muted small">{m.instructions}</div> : null}</td><td className="tnum">{timesOf(m).join(" · ")}{parseWeekdays(m.weekdays).length < 7 ? <div className="muted small">{Weekdays.summary(parseWeekdays(m.weekdays))}</div> : null}</td><td>{m.endDate ? Schedule.display(m.endDate) : "uso contínuo"}</td></tr>)}
      </tbody></table>}
    </section>

    <section className="stack" style={{ gap: 8 }}>
      <h2>Doses confirmadas nos últimos 30 dias</h2>
      <div className="row wrap" style={{ gap: 3 }} aria-label="Um quadrado por dia">{r.dias.map((d) => <span key={d.data} title={`${Schedule.display(d.data)}: ${d.estado}`} style={{ width: 20, height: 20, borderRadius: 5, background: COR[d.estado] ?? "#ddd", display: "inline-block" }} />)}</div>
      <p className="muted small">Verde: tudo confirmado · Amarelo: parte · Vermelho: nenhuma confirmada ou relato de algo diferente · Cinza: sem dose prevista.</p>
      {esperadas > 0 && <p><b>{Math.round((tomou / esperadas) * 100)}%</b> das doses previstas foram confirmadas ({tomou} de {esperadas}).</p>}
      {adesao.length > 0 && <table className="tabela"><thead><tr><th>Remédio</th><th>Previstas</th><th>Tomou</th><th>Não tomou</th><th>Sem resposta</th><th>Relatou algo</th></tr></thead><tbody>
        {adesao.map((m) => <tr key={m.medicationName}><td>{m.medicationName}</td><td className="tnum">{m.esperadas}</td><td className="tnum">{m.tomou}</td><td className="tnum">{m.nao_tomou}</td><td className="tnum">{m.semResposta}</td><td className="tnum">{m.efeito_colateral}</td></tr>)}
      </tbody></table>}
    </section>

    <section className="stack" style={{ gap: 8 }}>
      <h2>Pressão e glicemia</h2>
      <p className="muted small">Faixa {r.faixaCombinada ? "combinada com o médico" : "de referência"}: pressão até {r.faixa.pressaoSistolica}/{r.faixa.pressaoDiastolica} · glicemia de {r.faixa.glicemiaBaixa} a {r.faixa.glicemiaAlta} mg/dL.</p>
      {r.medicoes.length === 0 ? <p className="muted">Nenhuma medição registrada no período.</p> : <>
        <div className="row wrap" style={{ gap: 24 }}>
          {pressoes.length > 0 && <div><div className="muted small">Pressão ({pressoes.length} medições)</div><b className="tnum">média {media(pressoes.map((m) => Number(m.sistolica)))}/{media(pressoes.map((m) => Number(m.diastolica)))}</b></div>}
          {glicemias.length > 0 && <div><div className="muted small">Glicemia ({glicemias.length} medições)</div><b className="tnum">média {media(glicemias.map((m) => Number(m.valor)))} mg/dL</b></div>}
          <div><div className="muted small">Fora da faixa</div><b className="tnum">{fora.length}</b></div>
        </div>
        <table className="tabela"><thead><tr><th>Quando</th><th>Medição</th><th></th></tr></thead><tbody>
          {r.medicoes.slice(0, 40).map((m) => <tr key={m.id}><td className="tnum">{Schedule.dateTime(m.medidoEm)}</td><td className="tnum">{m.tipo === "pressao" ? "Pressão" : "Glicemia"} {textoMedicao(m)}</td><td>{foraDaFaixa(m, r.faixa) ? <b style={{ color: "#D6453A" }}>fora da faixa</b> : ""}</td></tr>)}
        </tbody></table></>}
    </section>

    <p className="muted small" style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>Informações registradas pela própria pessoa, respondendo aos lembretes do Vytal Care pelo WhatsApp. "Sem resposta" quer dizer que a dose não foi confirmada, não que deixou de ser tomada. O Vytal Care não faz diagnóstico nem orienta tratamento.</p>
  </div>;
}
