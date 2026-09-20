import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_URL, ServiceError, errorText } from "../api";
import { findProfession } from "../models";
import { Brand, Button, Chip, Confirm, Dialog, Eyebrow, Field, Icon, Notice, Segmented, Spinner, Surface, useLoad } from "../ui";

// ============================================================
// [ADMIN] Painel de administração do Vytal Care: care.vytalsaude.com.br/admin
// Entra com o login de administrador do servidor (ADMIN_EMAIL/ADMIN_PASSWORD
// no Railway). O token fica só nesta aba (sessionStorage) e vale 12 h.
// Rotas no servidor: admin-care.js.
// ============================================================

const KEY = "vytal-care.admin";
const DEMO = import.meta.env.DEV && new URLSearchParams(location.search).has("previa");
let token: string | null = DEMO ? "previa" : (() => { try { return sessionStorage.getItem(KEY); } catch { return null; } })();
const listeners = new Set<() => void>();
function setToken(t: string | null) {
  token = t;
  try { if (t) sessionStorage.setItem(KEY, t); else sessionStorage.removeItem(KEY); } catch { /* só memória */ }
  listeners.forEach((l) => l());
}

async function adminApi<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  if (DEMO) { const { adminDemo } = await import("./demo"); return adminDemo(path, options.method ?? "GET") as T; }
  let r: Response;
  try {
    r = await fetch(BASE_URL + path, { method: options.method ?? "GET", cache: "no-store", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: options.body === undefined ? undefined : JSON.stringify(options.body) });
  } catch { throw new ServiceError("Não foi possível conectar. Verifique a internet e tente novamente."); }
  const text = await r.text();
  let payload: any = {}; try { payload = text ? JSON.parse(text) : {}; } catch { payload = {}; }
  if (r.status === 401 || r.status === 403) { if (path !== "/admin/login") setToken(null); throw new ServiceError(path === "/admin/login" ? payload?.error ?? "E-mail ou senha incorretos." : "Sua sessão de administrador expirou. Entre de novo.", r.status); }
  if (!r.ok) throw new ServiceError(payload?.error ?? "Não foi possível concluir. Tente novamente.", r.status);
  return payload as T;
}

// ---------- formatos ----------
const brl = (c?: number | null) => ((c ?? 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const day = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "—");
const dayTime = (iso?: string | null) => (iso ? new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—");
const pct = (x: number) => `${(x * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
const num = (n: number) => n.toLocaleString("pt-BR");
const ORIGEM: Record<string, string> = { cartao: "Cartão", pix: "Pix", apple: "App Store", cortesia: "Cortesia", gratuito: "Gratuito", teste: "Teste grátis" };
const TOM: Record<string, "" | "ok" | "info" | "warn"> = { cartao: "ok", pix: "ok", apple: "ok", cortesia: "info", gratuito: "", teste: "warn" };
const STATUS: Record<string, string> = { ativa: "Pago", em_atraso: "Em atraso", cancelada: "Cancelada", cancelada_sem_pagamento: "Cancelada", expirada: "Expirado", estornada: "Estornado", falhou: "Recusado", pendente: "Aguardando" };
const PLANOS = [{ id: "gratuito", nome: "Gratuito", limite: 2 }, { id: "essencial", nome: "Essencial", limite: 20 }, { id: "clinica", nome: "Clínica", limite: 60 }, { id: "rede", nome: "Rede", limite: 150 }, { id: "individual", nome: "Individual (pessoal)", limite: 1 }, { id: "familia", nome: "Família (pessoal)", limite: 3 }];
const hoje = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

// ---------- tipos ----------
type Linha = { id: number; tipoConta?: "profissional" | "pessoal"; nome: string | null; email: string; emailConfirmado?: boolean; profissao?: string | null; crm?: string | null; criadoEm?: string | null; ultimoAcessoEm?: string | null; planoId: string; planoNome: string; origem: string; pago: boolean; ate?: string | null; renova?: boolean | null; ciclo?: string | null; statusPagamento?: string | null; receitaMensal: number; pacientes: number; limite: number; cortesia?: { planoId: string; ate?: string | null; motivo?: string | null } | null };
type Pagamento = { id: string; doctorId?: number; nome?: string | null; email?: string; planoNome: string; status: string; tipo: "pix" | "cartao"; ciclo: string; teste: boolean; cupom: string | null; valor: number | null; em: string; ate?: string | null; criadoEm?: string; cartaoFinal?: string | null };
type Resumo = { emTeste?: number; contasPessoais?: number; contas: number; novas7d: number; novas30d: number; ativas7d: number; comPacientes: number; pacientes: number; pagantes: number; cortesias: number; conversao: number; receitaMensal: number;
  porPlano: Record<string, { nome: string; pagantes: number; cortesia: number }>; porOrigem: { cartao: number; pix: number; apple: number };
  vencendo: { id: number; nome: string | null; email: string; planoNome: string; origem: string; ate: string }[];
  mensagens: { mes: string; total: number; cobraveis: number; custoEstimado: number }; pausas: { pacientes: number; contas: number }; cupons: { ativos: number; usos: number }; pagamentos: Pagamento[] };
type Cupom = { codigo: string; descricao: string | null; tipo: "percentual" | "valor"; valor: number; planos: string[] | null; ciclo: string | null; cobrancas: number | null; maxUsos: number | null; validoAte: string | null; ativo: boolean; createdAt: string; usos: number; descontoTotal: number };
type Acao = { id: string; quem: string; acao: string; alvo: string | null; alvoNome?: string | null; dados: Record<string, any>; em: string };

// ============================================================
export default function Admin() {
  const [, force] = useState(0);
  useEffect(() => { const l = () => force((n) => n + 1); listeners.add(l); return () => { listeners.delete(l); }; }, []);
  if (!token) return <AdminLogin />;
  return <div className="shell">
    <aside className="sidebar">
      <Brand />
      <Eyebrow>Administração</Eyebrow>
      <nav className="nav" aria-label="Administração"><NavLink to="/admin" end><Icon name="chart" />Visão geral</NavLink><NavLink to="/admin/usuarios"><Icon name="user" />Usuários</NavLink><NavLink to="/admin/cupons"><Icon name="list" />Cupons</NavLink><NavLink to="/admin/registro"><Icon name="clock" />Registro</NavLink></nav>
      <div style={{ flexGrow: 1 }} />
      <a href="/vytal-care2/app/" className="muted small">Abrir o Vytal Care</a>
      <button type="button" className="link row" style={{ gap: 8, color: "var(--muted)", fontWeight: 500 }} onClick={() => setToken(null)}><Icon name="logout" size={18} />Sair</button>
    </aside>
    <main className="content">
      <div className="admin-bar row between"><Brand /><button type="button" className="link row" style={{ gap: 6, color: "var(--muted)" }} onClick={() => setToken(null)}><Icon name="logout" size={18} />Sair</button></div>
      <Routes>
        <Route path="/admin" element={<Overview />} />
        <Route path="/admin/usuarios" element={<Users />} />
        <Route path="/admin/usuarios/:id" element={<UserPage />} />
        <Route path="/admin/cupons" element={<Coupons />} />
        <Route path="/admin/registro" element={<Log />} />
        <Route path="*" element={<Overview />} />
      </Routes>
    </main>
    <nav className="tabbar" aria-label="Administração"><NavLink to="/admin" end><Icon name="chart" />Geral</NavLink><NavLink to="/admin/usuarios"><Icon name="user" />Usuários</NavLink><NavLink to="/admin/cupons"><Icon name="list" />Cupons</NavLink><NavLink to="/admin/registro"><Icon name="clock" />Registro</NavLink></nav>
  </div>;
}

function AdminLogin() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    try { const r = await adminApi<{ token: string }>("/admin/login", { method: "POST", body: { email: email.trim(), password } }); setToken(r.token); }
    catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }
  return <div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100%" }}>
    <Surface style={{ width: "100%", maxWidth: 420 }}>
      <Brand />
      <div><Eyebrow>Administração</Eyebrow><h1>Entrar no painel</h1></div>
      <form className="stack" onSubmit={submit}>
        <Field label="E-mail do administrador" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Senha" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Notice>{error}</Notice>
        <Button type="submit" className="big" busy={busy}>Entrar</Button>
      </form>
      <p className="muted small">Acesso restrito à equipe da Vytal. A sessão termina ao fechar a aba.</p>
    </Surface>
  </div>;
}

function useData<T>(path: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null), [error, setError] = useState<string | null>(null), [n, setN] = useState(0);
  useLoad(async (alive) => { try { const d = await adminApi<T>(path); if (alive()) { setData(d); setError(null); } } catch (e) { if (alive()) setError(errorText(e)); } }, [path, n, ...deps]);
  return { data, error, reload: () => setN((x) => x + 1) };
}
const Loading = ({ error }: { error: string | null }) => error ? <Notice>{error}</Notice> : <div className="row muted" style={{ justifyContent: "center", padding: 40 }}><Spinner />Carregando…</div>;
const Tile = ({ value, label, detail, tone }: { value: ReactNode; label: string; detail?: ReactNode; tone?: string }) =>
  <div className="tile"><b style={tone ? { color: tone } : undefined}>{value}</b><span className="muted small">{label}</span>{detail && <span className="small" style={{ color: "var(--muted)" }}>{detail}</span>}</div>;
const Table = ({ head, children }: { head: string[]; children: ReactNode }) =>
  <div className="table-wrap"><table className="table"><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
const Empty = ({ cols, children }: { cols: number; children: ReactNode }) => <tr><td colSpan={cols} className="muted" style={{ textAlign: "center", padding: 24 }}>{children}</td></tr>;

// ---------- Visão geral ----------
function Overview() {
  const { data: r, error } = useData<Resumo>("/admin/care/resumo");
  if (!r) return <div className="page"><h1>Visão geral</h1><Loading error={error} /></div>;
  const margem = r.receitaMensal - r.mensagens.custoEstimado;
  return <div className="page">
    <div><Eyebrow>{new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "numeric", month: "long", year: "numeric" })}</Eyebrow><h1>Visão geral</h1></div>
    <div className="tiles">
      <Tile value={num(r.pagantes)} label="contas com plano pago" detail={`${pct(r.conversao)} das contas`} />
      <Tile value={brl(r.receitaMensal)} label="receita mensal estimada" detail="anual e Pix anual divididos por 12" />
      <Tile value={num(r.contas)} label="contas" detail={`+${r.novas7d} em 7 dias · +${r.novas30d} em 30`} />
      <Tile value={num(r.pacientes)} label="pacientes acompanhados" detail={`${r.comPacientes} contas com paciente`} />
    </div>
    <div className="tiles">
      <Tile value={num(r.ativas7d)} label="contas ativas em 7 dias" />
      <Tile value={num(r.cortesias)} label="cortesias" detail="plano dado pelo painel" />
      <Tile value={num(r.contasPessoais ?? 0)} label="contas de família" detail={`${r.emTeste ?? 0} em teste grátis`} />
      <Tile value={num(r.mensagens.cobraveis)} label={`mensagens cobráveis em ${r.mensagens.mes.slice(5)}/${r.mensagens.mes.slice(0, 4)}`} detail={`custo estimado ${brl(r.mensagens.custoEstimado)}`} />
      <Tile value={num(r.pausas.pacientes)} label="pacientes pausados por vencimento" detail={r.pausas.contas ? `${r.pausas.contas} contas` : undefined} tone={r.pausas.pacientes ? "var(--bad)" : undefined} />
    </div>
    <div className="split wrap">
      <Surface className="grow" style={{ minWidth: 280 }}>
        <h2>Planos</h2>
        <Table head={["Plano", "Pagantes", "Cortesia"]}>
          {Object.entries(r.porPlano).map(([id, p]) => <tr key={id}><td>{p.nome}</td><td className="tnum">{p.pagantes}</td><td className="tnum">{p.cortesia}</td></tr>)}
        </Table>
        <div className="row wrap small muted"><span>Cartão: <b>{r.porOrigem.cartao}</b></span><span>Pix: <b>{r.porOrigem.pix}</b></span><span>App Store: <b>{r.porOrigem.apple}</b></span><span>Cupons ativos: <b>{r.cupons.ativos}</b> ({r.cupons.usos} usos)</span></div>
        <p className="muted small">Receita estimada menos custo estimado do WhatsApp no mês: <b style={{ color: margem < 0 ? "var(--bad)" : "var(--ok)" }}>{brl(margem)}</b>.</p>
      </Surface>
      <Surface className="grow" style={{ minWidth: 280 }}>
        <div className="row between"><h2>Vencem em 7 dias</h2>{r.vencendo.length > 0 && <Link to="/admin/usuarios?filtro=vencendo" className="small">Ver todos</Link>}</div>
        <p className="muted small">Pix, cartão cancelado ou recusado e cortesias com data. Bom momento para um contato.</p>
        {r.vencendo.length === 0 ? <p className="muted">Nenhum plano vence nos próximos 7 dias.</p>
          : <div className="stack" style={{ gap: 2 }}>{r.vencendo.slice(0, 8).map((v) => <Link key={v.id} to={`/admin/usuarios/${v.id}`} className="prow"><div className="grow"><div style={{ fontWeight: 600 }}>{v.nome || v.email}</div><div className="muted small">{v.planoNome} · {ORIGEM[v.origem]}</div></div><Chip tone="warn">{day(v.ate)}</Chip></Link>)}</div>}
      </Surface>
    </div>
    <Surface>
      <h2>Pagamentos recentes</h2>
      <Payments rows={r.pagamentos} withUser />
    </Surface>
  </div>;
}

function Payments({ rows, withUser = false }: { rows: Pagamento[]; withUser?: boolean }) {
  return <Table head={[...(withUser ? ["Conta"] : []), "Plano", "Forma", "Valor", "Situação", "Atualizado", "Acesso até"]}>
    {rows.length === 0 ? <Empty cols={withUser ? 7 : 6}>Nenhum pagamento ainda.</Empty> : rows.map((p) => <tr key={p.id}>
      {withUser && <td>{p.doctorId ? <Link to={`/admin/usuarios/${p.doctorId}`}>{p.nome || p.email}</Link> : "—"}</td>}
      <td>{p.planoNome}{p.teste && <> <Chip>teste</Chip></>}</td>
      <td>{p.tipo === "pix" ? "Pix" : `Cartão${p.cartaoFinal ? ` ${p.cartaoFinal}` : ""}`} · {p.ciclo}</td>
      <td className="tnum">{p.valor ? brl(p.valor) : "—"}{p.cupom && <div className="muted small">{p.cupom}</div>}</td>
      <td><Chip tone={p.status === "ativa" ? "ok" : ["em_atraso", "pendente"].includes(p.status) ? "warn" : ["falhou", "estornada"].includes(p.status) ? "bad" : ""}>{STATUS[p.status] ?? p.status}</Chip></td>
      <td className="tnum">{dayTime(p.em)}</td>
      <td className="tnum">{day(p.ate)}</td>
    </tr>)}
  </Table>;
}

// ---------- Usuários ----------
function ConfirmInline({ id, onDone }: { id: number; onDone: () => void }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState<string | null>(null);
  return <><button type="button" className="link small" disabled={busy} onClick={async () => { setBusy(true); setErr(null); try { await adminApi(`/admin/care/usuarios/${id}/confirmar-email`, { method: "POST", body: {} }); onDone(); } catch (e) { setErr(errorText(e)); } finally { setBusy(false); } }}>{busy ? "Confirmando…" : "Confirmar e-mail"}</button>{err && <div className="small" style={{ color: "var(--bad)" }}>{err}</div>}</>;
}

function Users() {
  const [params, setParams] = useSearchParams();
  const filtro = params.get("filtro") || "todos";
  const [q, setQ] = useState(params.get("q") || "");
  const path = `/admin/care/usuarios?filtro=${encodeURIComponent(filtro)}&q=${encodeURIComponent(params.get("q") || "")}`;
  const { data, error, reload } = useData<{ total: number; usuarios: Linha[] }>(path);
  const setParam = (k: string, v: string) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); setParams(n, { replace: true }); };
  return <div className="page">
    <h1>Usuários</h1>
    <Surface>
      <form className="row wrap" onSubmit={(e) => { e.preventDefault(); setParam("q", q.trim()); }}>
        <label className="search grow" style={{ minWidth: 220 }}><Icon name="search" size={16} /><input placeholder="Nome, e-mail, registro ou id" aria-label="Buscar usuário" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <Button type="submit" className="plain">Buscar</Button>
      </form>
      <div style={{ overflowX: "auto" }}><Segmented label="Filtro" value={filtro} onChange={(v) => setParam("filtro", v === "todos" ? "" : v)} options={[{ value: "todos", label: "Todos" }, { value: "pagantes", label: "Pagantes" }, { value: "pessoal", label: "Família" }, { value: "teste", label: "Em teste" }, { value: "cortesia", label: "Cortesia" }, { value: "gratuito", label: "Gratuito" }, { value: "vencendo", label: "Vencendo" }]} /></div>
      {!data ? <Loading error={error} /> : <>
        <span className="muted small">{data.total === 1 ? "1 conta" : `${num(data.total)} contas`}{data.total > data.usuarios.length ? ` · mostrando ${data.usuarios.length}` : ""}</span>
        <Table head={["Conta", "Plano", "Pacientes", "Vence / renova", "Criada", "Último acesso"]}>
          {data.usuarios.length === 0 ? <Empty cols={6}>Nenhuma conta encontrada.</Empty> : data.usuarios.map((u) => <tr key={u.id}>
            <td><Link to={`/admin/usuarios/${u.id}`} style={{ fontWeight: 600 }}>{u.nome || "Sem nome"}</Link><div className="muted small">{u.email}</div>{u.emailConfirmado === false && <div className="row wrap" style={{ gap: 8, marginTop: 4 }}><Chip tone="warn">E-mail não confirmado</Chip><ConfirmInline id={u.id} onDone={reload} /></div>}</td>
            <td><div>{u.planoNome}{u.tipoConta === "pessoal" && <span className="muted small"> · família</span>}</div><Chip tone={TOM[u.origem]}>{ORIGEM[u.origem]}</Chip></td>
            <td className="tnum" style={{ color: u.pacientes > u.limite ? "var(--bad)" : undefined }}>{u.pacientes} / {u.limite}</td>
            <td className="tnum">{u.planoId === "gratuito" ? "—" : u.renova ? <span className="muted">Renova {u.ate ? `(${day(u.ate)})` : ""}</span> : u.ate ? day(u.ate) : "Sem data"}</td>
            <td className="tnum">{day(u.criadoEm)}</td>
            <td className="tnum">{day(u.ultimoAcessoEm)}</td>
          </tr>)}
        </Table>
      </>}
    </Surface>
  </div>;
}

type Ficha = { usuario: { id: number; name: string | null; email: string; profissao?: string | null; crm?: string | null; phone?: string | null; createdAt?: string; plano?: string; planoAte?: string | null; planoMotivo?: string | null; ultimoAcessoEm?: string | null; emailVerificadoEm?: string | null; apple?: boolean };
  plano: { plano: { id: string; nome: string; limitePacientes: number }; usados: number; limite: number; franquia?: { mensagens: number; limite: number; percentual: number } | null; web?: { status: string; tipo?: string; expiraEm?: string } | null; assinatura?: { status?: string; expiraEm?: string } | null; vencimento?: { fase: string; venceEm: string; corteEm: string } | null };
  pausados: number; pagamentos: Pagamento[]; apple: { planoId: string; status: string; expiresAt: string; environment: string }[]; cupons: { codigo: string; externoId: string; desconto: number | null; createdAt: string }[]; acoes: Acao[] };

function UserPage() {
  const { id = "" } = useParams();
  const { data: f, error, reload } = useData<Ficha>(`/admin/care/usuarios/${encodeURIComponent(id)}`);
  const [editing, setEditing] = useState(false), [confirming, setConfirming] = useState(false), [msg, setMsg] = useState<string | null>(null);
  const nav = useNavigate();
  async function confirmEmail() {
    setConfirming(true); setMsg(null);
    try { await adminApi(`/admin/care/usuarios/${encodeURIComponent(id)}/confirmar-email`, { method: "POST", body: {} }); reload(); }
    catch (e) { setMsg(errorText(e)); } finally { setConfirming(false); }
  }
  if (!f) return <div className="page"><button className="link row" onClick={() => nav("/admin/usuarios")}><Icon name="back" size={16} />Usuários</button><Loading error={error} /></div>;
  const u = f.usuario, p = f.plano;
  const cortesia = u.plano && u.plano !== "gratuito" ? PLANOS.find((x) => x.id === u.plano) : null;
  const fase: Record<string, string> = { vence_em_breve: "Vence em breve", carencia: "Em carência", pausado: "Lembretes pausados" };
  return <div className="page">
    <button className="link row" style={{ alignSelf: "flex-start" }} onClick={() => nav(-1)}><Icon name="back" size={16} />Voltar</button>
    <div className="row between wrap">
      <div><Eyebrow>Conta #{u.id}</Eyebrow><h1>{u.name || "Sem nome"}</h1><div className="muted">{[u.email, findProfession(u.profissao)?.name, u.crm].filter(Boolean).join(" · ")}</div></div>
      <Button icon="edit" onClick={() => setEditing(true)}>Mudar plano</Button>
    </div>
    <div className="tiles">
      <Tile value={p.plano.nome} label="plano em vigor" detail={p.web ? `${p.web.tipo === "pix" ? "Pix" : "Cartão"} · ${STATUS[p.web.status] ?? p.web.status}` : cortesia ? "cortesia" : p.assinatura ? "App Store" : undefined} />
      <Tile value={`${p.usados} / ${p.limite}`} label="pacientes" tone={p.usados > p.limite ? "var(--bad)" : undefined} />
      <Tile value={p.franquia ? `${Math.round(p.franquia.percentual)}%` : "—"} label="franquia de mensagens do mês" detail={p.franquia ? `${num(Math.round(p.franquia.mensagens))} de ${num(p.franquia.limite)}` : undefined} />
      <Tile value={day(u.ultimoAcessoEm)} label="último acesso" detail={`conta criada em ${day(u.createdAt)}`} />
    </div>
    <Surface><div className="row between wrap"><div><Eyebrow>E-mail</Eyebrow>{u.emailVerificadoEm ? <b style={{ color: "var(--ok)" }}>Confirmado em {dayTime(u.emailVerificadoEm)}</b> : <b style={{ color: "var(--warn)" }}>Ainda não confirmado</b>}<p className="muted small">{u.emailVerificadoEm ? "A conta já pode cadastrar pacientes." : "Sem confirmar, a conta não cadastra pacientes. Use se o médico não recebeu o link ou o link falhou."}</p></div>{!u.emailVerificadoEm && <Button icon="check" busy={confirming} onClick={confirmEmail}>Confirmar e-mail</Button>}</div><Notice>{msg}</Notice></Surface>
    {p.vencimento && <Notice tone={p.vencimento.fase === "pausado" ? "error" : "warn"}>{`${fase[p.vencimento.fase] ?? p.vencimento.fase}: venceu ou vence em ${day(p.vencimento.venceEm)}; pausa em ${day(p.vencimento.corteEm)}.`}{f.pausados ? ` ${f.pausados} pacientes pausados agora.` : ""}</Notice>}
    {cortesia && <Surface><div className="row between wrap"><div><Eyebrow>Cortesia</Eyebrow><b>{cortesia.nome}</b> <span className="muted">{u.planoAte ? `até ${day(u.planoAte)}` : "sem data de fim"}</span>{u.planoMotivo && <div className="muted small">{u.planoMotivo}</div>}</div><Chip tone="info">Sem cobrança</Chip></div>
      <p className="muted small">O plano em vigor é sempre o maior entre a cortesia e o que a conta pagou.</p></Surface>}
    <Surface><h2>Pagamentos pela web</h2><Payments rows={f.pagamentos} /></Surface>
    {f.apple.length > 0 && <Surface><h2>App Store</h2><Table head={["Plano", "Situação", "Até", "Ambiente"]}>{f.apple.map((a, i) => <tr key={i}><td>{PLANOS.find((x) => x.id === a.planoId)?.nome ?? a.planoId}</td><td>{STATUS[a.status] ?? a.status}</td><td>{day(a.expiresAt)}</td><td>{a.environment}</td></tr>)}</Table></Surface>}
    <div className="split wrap">
      <Surface className="grow" style={{ minWidth: 260 }}><h2>Cupons usados</h2>{f.cupons.length === 0 ? <p className="muted">Nenhum.</p> : <Table head={["Cupom", "Desconto", "Quando"]}>{f.cupons.map((c) => <tr key={c.externoId}><td>{c.codigo}</td><td className="tnum">{c.desconto != null ? brl(c.desconto) : "—"}</td><td className="tnum">{day(c.createdAt)}</td></tr>)}</Table>}</Surface>
      <Surface className="grow" style={{ minWidth: 260 }}><h2>Alterações pelo painel</h2>{f.acoes.length === 0 ? <p className="muted">Nenhuma.</p> : <div className="stack" style={{ gap: 8 }}>{f.acoes.map((a, i) => <div key={i} className="small"><b>{describe(a)}</b><div className="muted">{dayTime(a.em)} · {a.quem}</div></div>)}</div>}</Surface>
    </div>
    {editing && <PlanDialog user={u} onClose={(changed) => { setEditing(false); if (changed) reload(); }} />}
  </div>;
}

function PlanDialog({ user, onClose }: { user: Ficha["usuario"]; onClose: (changed: boolean) => void }) {
  const [planoId, setPlanoId] = useState(user.plano && user.plano !== "gratuito" ? user.plano : "essencial");
  const [until, setUntil] = useState(user.planoAte ? new Date(user.planoAte).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }) : "");
  const [motivo, setMotivo] = useState(user.planoMotivo ?? ""), [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); setUntil(d.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })); };
  async function save() {
    setBusy(true); setError(null);
    try { await adminApi(`/admin/care/usuarios/${user.id}/plano`, { method: "PUT", body: { planoId, ate: planoId === "gratuito" ? null : until || null, motivo } }); onClose(true); }
    catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  return <Dialog title="Mudar plano" eyebrow={user.name || user.email} onClose={() => onClose(false)} locked={busy}>
    <p className="muted small">Dá, estende ou tira um plano sem cobrança (cortesia). Não mexe em assinatura paga: vale sempre o maior entre a cortesia e o que a conta pagou.</p>
    <label className="field"><span>Plano</span><select value={planoId} onChange={(e) => setPlanoId(e.target.value)}>{PLANOS.map((p) => <option key={p.id} value={p.id}>{p.nome} — até {p.limite} pacientes{p.id === "gratuito" ? " (tira a cortesia)" : ""}</option>)}</select></label>
    {planoId !== "gratuito" && <>
      <Field label="Vale até (vazio = sem data de fim)" type="date" min={hoje()} value={until} onChange={(e) => setUntil(e.target.value)} />
      <div className="row wrap">{[30, 90, 365].map((n) => <button key={n} type="button" className="chip info" style={{ border: 0 }} onClick={() => addDays(n)}>+{n === 365 ? "1 ano" : `${n} dias`}</button>)}<button type="button" className="chip" style={{ border: 0 }} onClick={() => setUntil("")}>Sem data</button></div>
      <Field label="Motivo (só a equipe vê)" placeholder="Ex.: parceria, piloto, suporte" value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={200} />
      {until && <p className="muted small">Depois da data, a conta volta ao Gratuito com a mesma regra de vencimento: avisos, 7 dias de carência e pausa acima de 2 pacientes.</p>}
    </>}
    <Notice>{error}</Notice>
    <div className="row" style={{ justifyContent: "flex-end" }}><Button className="plain" onClick={() => onClose(false)} disabled={busy}>Cancelar</Button><Button onClick={save} busy={busy} icon="check">Salvar</Button></div>
  </Dialog>;
}

// ---------- Cupons ----------
function Coupons() {
  const { data, error, reload } = useData<Cupom[]>("/admin/care/cupons");
  const [creating, setCreating] = useState(false), [toggling, setToggling] = useState<Cupom | null>(null), [busy, setBusy] = useState(false), [msg, setMsg] = useState<string | null>(null);
  async function toggle(c: Cupom) {
    setBusy(true);
    try { await adminApi(`/admin/care/cupons/${encodeURIComponent(c.codigo)}`, { method: "PATCH", body: { ativo: !c.ativo } }); setToggling(null); reload(); }
    catch (e) { setMsg(errorText(e)); setToggling(null); } finally { setBusy(false); }
  }
  return <div className="page">
    <div className="row between wrap"><h1>Cupons</h1><Button icon="plus" onClick={() => setCreating(true)}>Novo cupom</Button></div>
    <Notice>{msg}</Notice>
    <Surface>
      <p className="muted small">O médico digita o código ao pagar pela web. Cada conta usa um cupom uma vez; o uso conta quando o pagamento é confirmado. Para dar o plano de graça, use "Mudar plano" no usuário.</p>
      {!data ? <Loading error={error} /> : <Table head={["Código", "Desconto", "Vale para", "Usos", "Validade", "Situação", ""]}>
        {data.length === 0 ? <Empty cols={7}>Nenhum cupom ainda.</Empty> : data.map((c) => {
          const expired = c.validoAte && new Date(c.validoAte) < new Date(), full = c.maxUsos != null && c.usos >= c.maxUsos;
          return <tr key={c.codigo}>
            <td><b className="tnum">{c.codigo}</b>{c.descricao && <div className="muted small">{c.descricao}</div>}</td>
            <td>{c.tipo === "percentual" ? `${c.valor}%` : brl(c.valor)}<div className="muted small">{c.cobrancas == null ? "todas as cobranças" : c.cobrancas === 1 ? "1ª cobrança" : `${c.cobrancas} cobranças`}</div></td>
            <td>{c.planos?.length ? c.planos.map((p) => PLANOS.find((x) => x.id === p)?.nome ?? p).join(", ") : "Todos os planos"}<div className="muted small">{c.ciclo ? `só ${c.ciclo}` : "mensal e anual"}</div></td>
            <td className="tnum">{c.usos}{c.maxUsos != null ? ` / ${c.maxUsos}` : ""}{c.descontoTotal > 0 && <div className="muted small">{brl(c.descontoTotal)} dados</div>}</td>
            <td className="tnum">{c.validoAte ? day(c.validoAte) : "Sem data"}</td>
            <td><Chip tone={!c.ativo ? "" : expired || full ? "warn" : "ok"}>{!c.ativo ? "Desativado" : expired ? "Expirado" : full ? "Esgotado" : "Ativo"}</Chip></td>
            <td><button className={`link ${c.ativo ? "danger" : ""}`} onClick={() => c.ativo ? setToggling(c) : void toggle(c)}>{c.ativo ? "Desativar" : "Reativar"}</button></td>
          </tr>;
        })}
      </Table>}
    </Surface>
    {creating && <CouponDialog onClose={(done) => { setCreating(false); if (done) reload(); }} />}
    {toggling && <Confirm title={`Desativar ${toggling.codigo}?`} message="Ninguém mais consegue usar este cupom. Quem já assinou com ele continua com o desconto combinado." action="Desativar" busy={busy} onCancel={() => setToggling(null)} onConfirm={() => toggle(toggling)} />}
  </div>;
}

function CouponDialog({ onClose }: { onClose: (done: boolean) => void }) {
  const [f, setF] = useState({ codigo: "", descricao: "", tipo: "percentual" as "percentual" | "valor", valor: "", planos: [] as string[], ciclo: "", cobrancas: "", maxUsos: "", validoAte: "" });
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const togglePlan = (id: string) => setF({ ...f, planos: f.planos.includes(id) ? f.planos.filter((p) => p !== id) : [...f.planos, id] });
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    const valor = f.tipo === "valor" ? Math.round(Number(f.valor.replace(/\./g, "").replace(",", ".")) * 100) : Number(f.valor);
    try {
      await adminApi("/admin/care/cupons", { method: "POST", body: { codigo: f.codigo, descricao: f.descricao, tipo: f.tipo, valor, planos: f.planos, ciclo: f.ciclo || null, cobrancas: f.cobrancas || null, maxUsos: f.maxUsos || null, validoAte: f.validoAte || null } });
      onClose(true);
    } catch (err) { setError(errorText(err)); } finally { setBusy(false); }
  }
  return <Dialog wide title="Novo cupom" onClose={() => onClose(false)} locked={busy}>
    <form className="stack" onSubmit={save}>
      <div className="row wrap" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 200px" }}><Field label="Código" required placeholder="LANCAMENTO20" value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value.toUpperCase().replace(/\s/g, "") })} hint="Letras, números, - e _. É o que o médico digita." /></div>
        <div style={{ flex: "2 1 240px" }}><Field label="Descrição (só a equipe vê)" placeholder="Ex.: congresso SBC 2026" value={f.descricao} onChange={set("descricao")} maxLength={140} /></div>
      </div>
      <Segmented label="Tipo de desconto" value={f.tipo} onChange={(tipo) => setF({ ...f, tipo, valor: "" })} options={[{ value: "percentual", label: "Percentual" }, { value: "valor", label: "Valor fixo" }]} />
      <div className="row wrap" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 160px" }}><Field label={f.tipo === "percentual" ? "Desconto (%)" : "Desconto (R$)"} required inputMode="decimal" placeholder={f.tipo === "percentual" ? "20" : "50,00"} value={f.valor} onChange={set("valor")} hint={f.tipo === "percentual" ? "De 1 a 90%." : "O valor final nunca fica abaixo de R$ 1,00."} /></div>
        <div style={{ flex: "1 1 160px" }}><Field label="Vale em quantas cobranças" inputMode="numeric" placeholder="Todas" value={f.cobrancas} onChange={set("cobrancas")} hint="No cartão. Vazio = em todas. No Pix vale no pagamento." /></div>
      </div>
      <div className="stack" style={{ gap: 6 }}><span style={{ fontSize: 14, fontWeight: 500 }}>Planos</span>
        <div className="row wrap">{PLANOS.filter((p) => p.id !== "gratuito").map((p) => <button key={p.id} type="button" className={`chip ${f.planos.includes(p.id) ? "info" : ""}`} style={{ border: 0, padding: "8px 14px" }} aria-pressed={f.planos.includes(p.id)} onClick={() => togglePlan(p.id)}>{f.planos.includes(p.id) && "✓ "}{p.nome}</button>)}</div>
        <span className="muted small">{f.planos.length ? "Só nos planos marcados." : "Nenhum marcado = todos os planos."}</span></div>
      <div className="row wrap" style={{ alignItems: "flex-start" }}>
        <label className="field" style={{ flex: "1 1 160px" }}><span>Pagamento</span><select value={f.ciclo} onChange={set("ciclo")}><option value="">Mensal e anual</option><option value="mensal">Só mensal</option><option value="anual">Só anual</option></select></label>
        <div style={{ flex: "1 1 160px" }}><Field label="Limite de usos" inputMode="numeric" placeholder="Sem limite" value={f.maxUsos} onChange={set("maxUsos")} /></div>
        <div style={{ flex: "1 1 160px" }}><Field label="Válido até" type="date" min={hoje()} value={f.validoAte} onChange={set("validoAte")} /></div>
      </div>
      <Notice>{error}</Notice>
      <div className="row" style={{ justifyContent: "flex-end" }}><Button type="button" className="plain" onClick={() => onClose(false)} disabled={busy}>Cancelar</Button><Button type="submit" icon="check" busy={busy}>Criar cupom</Button></div>
    </form>
  </Dialog>;
}

// ---------- Registro ----------
function describe(a: Acao) {
  const d = a.dados || {};
  const nome = (id?: string) => PLANOS.find((p) => p.id === id)?.nome ?? id ?? "?";
  if (a.acao === "usuario.plano") return d.para === "gratuito" ? `Cortesia retirada (era ${nome(d.de)})` : `Plano ${nome(d.para)} ${d.ate ? `até ${day(d.ate)}` : "sem data de fim"}${d.motivo ? ` — ${d.motivo}` : ""}`;
  if (a.acao === "usuario.email") return "E-mail confirmado pelo painel";
  if (a.acao === "cupom.criar") return `Cupom ${a.alvo} criado: ${d.tipo === "percentual" ? `${d.valor}%` : brl(d.valor)}`;
  if (a.acao === "cupom.desativar") return `Cupom ${a.alvo} desativado`;
  if (a.acao === "cupom.ativar") return `Cupom ${a.alvo} reativado`;
  return a.acao;
}
function Log() {
  const { data, error } = useData<Acao[]>("/admin/care/acoes");
  return <div className="page">
    <h1>Registro</h1>
    <Surface>
      <p className="muted small">Tudo que foi mudado por este painel, do mais recente para o mais antigo.</p>
      {!data ? <Loading error={error} /> : <Table head={["Quando", "O quê", "Conta", "Quem"]}>
        {data.length === 0 ? <Empty cols={4}>Nada registrado ainda.</Empty> : data.map((a) => <tr key={a.id}>
          <td className="tnum">{dayTime(a.em)}</td><td>{describe(a)}</td>
          <td>{a.acao.startsWith("usuario.") && a.alvo ? <Link to={`/admin/usuarios/${a.alvo}`}>{a.alvoNome || `#${a.alvo}`}</Link> : "—"}</td>
          <td className="muted">{a.quem}</td></tr>)}
      </Table>}
    </Surface>
  </div>;
}
