import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { AppContext } from "../App";
import { formatPhone, initials, type DayGrid, type Patient } from "../models";
import { Avatar, Button, Chip, Eyebrow, Icon, Notice, Option, Spinner, Surface, useLoad } from "../ui";
import { ExpiryNotice } from "../pages/Plans";
import { diasRestantes, useFamilia } from "./Familia";
import { AvisoLinha } from "./Avisos";
import NovaPessoa from "./NovaPessoa";

const saudacao = () => { const h = Number(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", hour12: false }).format(new Date())); return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite"; };
const hojeTexto = () => { const t = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "long", day: "numeric", month: "long" }).format(new Date()); return t[0].toUpperCase() + t.slice(1); };

export default function Inicio() {
  const app = useContext(AppContext)!;
  const { session, patients, loading, error, plan, reload } = app;
  const { avisos } = useFamilia();
  const [nova, setNova] = useState<boolean | null>(null);
  const limite = plan?.limite ?? plan?.plano.limitePacientes ?? 0;
  const semPlano = plan?.plano.id === "pessoal_livre" && !plan?.vencimento;
  const recentes = avisos.slice(0, 3);
  return <div className="page">
    <div className="row between wrap" style={{ alignItems: "flex-end" }}>
      <div><Eyebrow>{hojeTexto()}</Eyebrow><h1 style={{ fontSize: 34 }}>{saudacao()}{session.doctor.name ? `, ${session.doctor.name.split(" ")[0]}` : ""}</h1><p className="care2-intro">Quem você cuida, os próximos horários e o que merece atenção hoje.</p></div>
      {patients.length > 0 && patients.length < Math.max(limite, 1) && <Button icon="plus" onClick={() => setNova(false)}>Adicionar pessoa</Button>}
    </div>

    {plan?.teste?.ativo && !plan.vencimento && <Surface className="row wrap" style={{ flexDirection: "row", alignItems: "center", background: "var(--blue-soft)", borderColor: "transparent" }}>
      <div className="grow" style={{ minWidth: 220 }}><b>{`Teste grátis: ${diasRestantes(plan.teste.ate)} ${diasRestantes(plan.teste.ate) === 1 ? "dia restante" : "dias restantes"}`}</b><div className="muted small">Tudo liberado até lá, com até 3 pessoas. Assine para os lembretes continuarem.</div></div>
      <Link to="/conta" className="btn" style={{ textDecoration: "none", color: "#fff" }}>Ver planos</Link></Surface>}
    {plan?.vencimento && <Link to="/conta" style={{ color: "inherit", textDecoration: "none" }}><ExpiryNotice expiry={plan.vencimento} used={plan.usados ?? patients.length} pessoal teste={Boolean(plan.teste)} /></Link>}
    {semPlano && <Notice tone="warn">Seu teste terminou. Assine em Conta para voltar a cadastrar pessoas e enviar lembretes.</Notice>}
    <Notice>{error}</Notice>

    {loading ? <div className="row muted" style={{ justifyContent: "center", padding: 30 }}><Spinner />Carregando…</div>
      : patients.length === 0 ? <Surface style={{ gap: 18 }}>
        <div><Eyebrow>Primeiro passo</Eyebrow><h2>Para quem são os lembretes?</h2><p className="muted">Depois você fotografa a receita e o Vytal Care cuida dos horários.</p></div>
        <div className="row" style={{ alignItems: "stretch" }}>
          <Option on={false} icon="user" onClick={() => setNova(true)}>Para mim</Option>
          <Option on={false} icon="heart" onClick={() => setNova(false)}>Para alguém da família</Option>
        </div>
      </Surface>
      : <div className="grid2">{patients.map((p) => <CartaoPessoa key={p.phone} pessoa={p} />)}</div>}

    {recentes.length > 0 && <Surface>
      <div className="row between"><h2>Avisos recentes</h2><Link to="/avisos" className="small">Ver todos</Link></div>
      <div className="stack" style={{ gap: 4 }}>{recentes.map((a) => <AvisoLinha key={a.id} aviso={a} />)}</div>
    </Surface>}
    {patients.length > 0 && avisos.length === 0 && <p className="muted small">Quando uma dose não for confirmada, uma medição sair da faixa ou um tratamento estiver terminando, o aviso aparece aqui e chega no seu e-mail.</p>}
    {nova !== null && <NovaPessoa paraMim={nova} onClose={() => { setNova(null); void reload(); }} />}
  </div>;
}

/** Cartão da pessoa: como está o dia de hoje e a sequência. */
function CartaoPessoa({ pessoa: p }: { pessoa: Patient }) {
  const [grade, setGrade] = useState<DayGrid | null>(null), [seq, setSeq] = useState<number | null>(null);
  useLoad(async (alive) => {
    api<DayGrid>(`/patients/${p.phone}/hoje`).then((g) => alive() && setGrade(g)).catch(() => {});
    api<{ sequencia: number }>(`/familia/pessoas/${p.phone}/resumo`).then((r) => alive() && setSeq(r.sequencia)).catch(() => {});
  }, [p.phone]);
  const itens = (grade?.horarios ?? []).flatMap((h) => h.itens.filter((i) => i.mine).map((i) => ({ ...i, time: h.time })));
  const passadas = itens.filter((i) => i.status !== "futuro");
  const tomadas = passadas.filter((i) => i.status === "tomou").length;
  const proxima = itens.find((i) => i.status === "futuro");
  const tom = !passadas.length ? "info" : tomadas === passadas.length ? "ok" : tomadas === 0 ? "bad" : "warn";
  return <Link to={`/p/${p.phone}`} className="surface care2-person" style={{ color: "var(--ink)", gap: 12 }}>
    <div className="row"><Avatar text={initials(p.name)} size={48} /><div className="grow"><div style={{ fontWeight: 600, fontSize: 17 }}>{p.name}</div><div className="muted small">{formatPhone(p.phone)}</div></div><span className="muted"><Icon name="chev" size={16} /></span></div>
    {p.optOut ? <Chip>Pediu para não receber mensagens</Chip> : p.remindersPaused ? <Chip tone="bad">Lembretes pausados</Chip>
      : !grade ? <span className="muted small">Carregando o dia…</span>
      : !itens.length ? <span className="muted small">Nenhum remédio hoje. Abra para fotografar a receita.</span>
      : <div className="row wrap" style={{ gap: 8 }}>
        <Chip tone={tom as "ok" | "bad" | "warn" | "info"}>{passadas.length ? `Hoje: ${tomadas} de ${passadas.length} confirmadas` : "Hoje: doses mais tarde"}</Chip>
        {!!seq && <Chip tone="ok">{seq === 1 ? "1 dia seguido" : `${seq} dias seguidos`}</Chip>}

      </div>}
    {grade && passadas.length > 0 && <div className="care2-progress" role="img" aria-label={`${tomadas} de ${passadas.length} doses passadas confirmadas`}><span style={{ width: `${100 * tomadas / passadas.length}%` }} /></div>}
    {proxima && <div className="care2-next"><Icon name="clock" size={18} /><span>Próximo às <b>{proxima.time}</b><br />{proxima.medicationName}</span></div>}
  </Link>;
}
