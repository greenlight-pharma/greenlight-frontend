import { useState, useMemo } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState, Empty } from "../../components/Loading.jsx";
import Modal from "../../components/Modal.jsx";
import Message from "../../components/Message.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { formatBRPhone, normalizeBRPhone } from "../../lib/phone.js";
import {
  STATUS, ROTULO, ACAO, ACAO_GRAVE, ACAO_PEDE_PESSOA,
  proximosEstados, ordenarFila,
} from "./status.js";
import {
  useUnidades, useVagas, useCriarVaga, useMudarStatus,
  useFila, useEntrarNaFila, useSairDaFila,
  useIndicadores, useLinhaBase, useRegistrarLinhaBase,
} from "./api.js";

// [AGENDA-UBS] Agenda real da unidade. Não é mais maquete: lê e escreve na
// API, e cada ação vira evento no log que a prefeitura vai auditar.
//
// Regra que organiza a tela toda: os botões de uma linha vêm da MÁQUINA DE
// ESTADOS, nunca de uma lista fixa. Se "cancelar" não é legal a partir de
// "paciente presente", o botão não existe — em vez de existir, ser clicado
// e devolver erro. O servidor valida de novo de qualquer jeito; a tela só
// evita oferecer o que ela já sabe que não pode.

const hojeISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const horaDe = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo",
  });

export default function AgendaUbsPage() {
  const unidades = useUnidades();
  const [unidadeId, setUnidadeId] = useState(null);
  const [data, setData] = useState(hojeISO);
  const [aba, setAba] = useState("agenda");

  const lista = unidades.data || [];
  const atual = unidadeId ?? lista[0]?.id ?? null;

  if (unidades.isLoading) return <Loading label="Carregando unidades..." />;
  if (unidades.error) return <ErrorState error={unidades.error} onRetry={unidades.refetch} />;

  if (!lista.length) {
    return (
      <>
        <PageHeader title="Agenda da unidade" />
        <div className="card">
          <Empty label="Nenhuma unidade cadastrada." />
          <div className="modal-context">
            💡 Cadastre a UBS no <strong>Painel Administrativo → Unidades</strong>. O
            código da unidade é o mesmo que vai no QR de autorização, para amarrar
            cada adesão à unidade que cadastrou o paciente.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Agenda da unidade"
        subtitle="Confirmação, cancelamento e reaproveitamento de vagas"
      />

      <div className="card no-print">
        <div className="grid-2">
          <div>
            <label htmlFor="agUnidade">Unidade</label>
            <select
              id="agUnidade"
              value={atual || ""}
              onChange={(e) => setUnidadeId(Number(e.target.value))}
            >
              {lista.map((u) => (
                <option key={u.id} value={u.id}>{u.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="agData">Dia</label>
            <input
              id="agData"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="abas">
        {[
          ["agenda", "Agenda do dia"],
          ["fila", "Fila de espera"],
          ["indicadores", "Indicadores do contrato"],
        ].map(([id, texto]) => (
          <button
            key={id}
            className={aba === id ? "aba ativa" : "aba"}
            onClick={() => setAba(id)}
          >
            {texto}
          </button>
        ))}
      </div>

      {aba === "agenda" && <AbaAgenda unidadeId={atual} data={data} />}
      {aba === "fila" && <AbaFila unidadeId={atual} />}
      {aba === "indicadores" && <AbaIndicadores unidadeId={atual} />}
    </>
  );
}

// ------------------------------------------------------------
function AbaAgenda({ unidadeId, data }) {
  const vagas = useVagas(unidadeId, data);
  const fila = useFila(unidadeId);
  const mudar = useMudarStatus(unidadeId, data);
  const [nova, setNova] = useState(false);
  const [confirmando, setConfirmando] = useState(null);
  const [escolhendoPessoa, setEscolhendoPessoa] = useState(null);
  const [erro, setErro] = useState("");

  async function aplicar(vaga, para, extra = {}) {
    setErro("");
    try {
      await mudar.mutateAsync({ id: vaga.id, para, ...extra });
    } catch (e) {
      // O 409 do servidor traz a lista do que seria permitido. Mostrar isso
      // é melhor que "erro ao salvar": normalmente significa que outra
      // pessoa mexeu na mesma vaga enquanto esta tela estava aberta.
      setErro(e.message);
      vagas.refetch();
    }
  }

  function acionar(vaga, para) {
    if (ACAO_PEDE_PESSOA.has(para)) {
      // Agendar a partir de uma oferta já feita usa quem recebeu a oferta —
      // não faz sentido perguntar de novo.
      if (para === STATUS.AGENDADA && vaga.ofertaParaFone) {
        return aplicar(vaga, para, { fone: vaga.ofertaParaFone });
      }
      return setEscolhendoPessoa({ vaga, para });
    }
    if (ACAO_GRAVE.has(para)) return setConfirmando({ vaga, para });
    return aplicar(vaga, para);
  }

  return (
    <>
      <div className="card">
        <div className="linha-acoes">
          <button className="primary btn-compacto" onClick={() => setNova(true)}>
            ➕ Nova vaga
          </button>
        </div>

        {erro && <Message type="error">{erro}</Message>}

        {vagas.isLoading && <Loading />}
        {vagas.error && <ErrorState error={vagas.error} onRetry={vagas.refetch} />}
        {!vagas.isLoading && !vagas.error && !(vagas.data || []).length && (
          <Empty label="Nenhuma vaga nesse dia. Crie a grade ou importe do sistema da Secretaria." />
        )}

        {(vagas.data || []).length > 0 && (
          <div className="tabela-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Especialidade</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {(vagas.data || []).map((v) => (
                  <tr key={v.id}>
                    <td><strong>{horaDe(v.inicioEm)}</strong></td>
                    <td>
                      {v.pacienteNome || <span className="texto-suave">—</span>}
                      {v.pacienteFone && (
                        <div className="small">{formatBRPhone(v.pacienteFone)}</div>
                      )}
                      {v.status === STATUS.VAGA_OFERECIDA && v.ofertaParaFone && (
                        <div className="small">
                          Oferecida a {formatBRPhone(v.ofertaParaFone)}
                          {v.ofertaExpiraEm && <> · expira {horaDe(v.ofertaExpiraEm)}</>}
                        </div>
                      )}
                    </td>
                    <td>
                      {v.especialidade}
                      {v.tipoProcedimento && <div className="small">{v.tipoProcedimento}</div>}
                    </td>
                    <td>
                      <span className={`situacao situacao-${ROTULO[v.status]?.tom || "neutro"}`}>
                        {ROTULO[v.status]?.texto || v.status}
                      </span>
                    </td>
                    <td className="col-acoes">
                      {proximosEstados(v.status).length === 0 ? (
                        <span className="texto-suave small">encerrada</span>
                      ) : (
                        proximosEstados(v.status).map((p) => (
                          <button
                            key={p}
                            className="btn-mini"
                            disabled={mudar.isPending}
                            onClick={() => acionar(v, p)}
                          >
                            {ACAO[p] || p}
                          </button>
                        ))
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {nova && (
        <NovaVagaModal unidadeId={unidadeId} data={data} onClose={() => setNova(false)} />
      )}

      <ConfirmDialog
        open={!!confirmando}
        title={confirmando ? ACAO[confirmando.para] : ""}
        confirmLabel={confirmando ? ACAO[confirmando.para] : "Confirmar"}
        danger
        onCancel={() => setConfirmando(null)}
        onConfirm={async () => {
          await aplicar(confirmando.vaga, confirmando.para);
          setConfirmando(null);
        }}
      >
        <p>
          {confirmando && (
            <>
              Vaga das <strong>{horaDe(confirmando.vaga.inicioEm)}</strong>
              {confirmando.vaga.pacienteNome && <> — {confirmando.vaga.pacienteNome}</>}.
            </>
          )}
        </p>
        <p className="small">Esta ação fica registrada no histórico da vaga.</p>
      </ConfirmDialog>

      {escolhendoPessoa && (
        <EscolherPessoaModal
          fila={ordenarFila(fila.data || [])}
          acao={escolhendoPessoa.para}
          onClose={() => setEscolhendoPessoa(null)}
          onEscolher={async (p) => {
            await aplicar(escolhendoPessoa.vaga, escolhendoPessoa.para, {
              fone: p.fone,
              nome: p.nome,
            });
            setEscolhendoPessoa(null);
          }}
        />
      )}
    </>
  );
}

// [OFERTA] A escolha é manual nesta versão, de propósito.
//
// A oferta sequencial automática (a parte de IA) precisa saber a quem a
// vaga já foi oferecida, e isso se deriva do log de eventos — trabalho da
// próxima fatia. Até lá, quem decide é a recepção, e o log registra
// origem "equipe". Automatizar sem esse controle produziria a oferta
// duplicada que a máquina de estados existe para impedir.
function EscolherPessoaModal({ fila, acao, onClose, onEscolher }) {
  return (
    <Modal open title={ACAO[acao]} onClose={onClose}>
      {!fila.length ? (
        <Empty label="Fila de espera vazia para esta unidade." />
      ) : (
        <>
          <div className="modal-context">
            💡 A fila já vem ordenada: prioridade clínica primeiro, depois tempo de espera.
          </div>
          <table className="tabela">
            <tbody>
              {fila.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nome || "(sem nome)"}</strong>
                    <div className="small">{formatBRPhone(p.fone)} · {p.especialidade}</div>
                  </td>
                  <td>
                    <span className={`prioridade prioridade-${p.prioridade}`}>
                      {p.prioridade}
                    </span>
                  </td>
                  <td className="col-acoes">
                    <button className="btn-mini" onClick={() => onEscolher(p)}>
                      Escolher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Modal>
  );
}

function NovaVagaModal({ unidadeId, data, onClose }) {
  const criar = useCriarVaga(unidadeId, data);
  const [f, setF] = useState({
    especialidade: "", tipoProcedimento: "", profissional: "",
    hora: "08:00", pacienteNome: "", pacienteFone: "",
  });
  const [erro, setErro] = useState("");
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!f.especialidade.trim()) return setErro("Informe a especialidade.");
    let fone = null;
    if (f.pacienteFone) {
      const n = normalizeBRPhone(f.pacienteFone);
      if (!n.ok) return setErro(n.reason);
      fone = n.phone;
    }
    try {
      await criar.mutateAsync({
        especialidade: f.especialidade.trim(),
        tipoProcedimento: f.tipoProcedimento.trim() || null,
        profissional: f.profissional.trim() || null,
        // O horário é digitado no fuso de quem está na UBS.
        inicioEm: new Date(`${data}T${f.hora}:00-03:00`).toISOString(),
        pacienteNome: f.pacienteNome.trim() || null,
        pacienteFone: fone,
      });
      onClose();
    } catch (e2) {
      setErro(e2.message);
    }
  }

  return (
    <Modal open title="Nova vaga" onClose={onClose}>
      <form onSubmit={salvar}>
        <div className="grid-2">
          <div>
            <label htmlFor="nvEsp">Especialidade</label>
            <input id="nvEsp" value={f.especialidade}
              onChange={(e) => set("especialidade", e.target.value)}
              placeholder="Clínica geral" />
          </div>
          <div>
            <label htmlFor="nvHora">Horário</label>
            <input id="nvHora" type="time" value={f.hora}
              onChange={(e) => set("hora", e.target.value)} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label htmlFor="nvTipo">Tipo de procedimento</label>
            <input id="nvTipo" value={f.tipoProcedimento}
              onChange={(e) => set("tipoProcedimento", e.target.value)}
              placeholder="Consulta de rotina" />
          </div>
          <div>
            <label htmlFor="nvProf">Profissional</label>
            <input id="nvProf" value={f.profissional}
              onChange={(e) => set("profissional", e.target.value)} />
          </div>
        </div>

        {/* Especialidade e tipo não são enfeite: o contrato cobra taxa de
            faltas POR especialidade e POR tipo de procedimento. */}
        <div className="modal-context">
          💡 Deixe paciente em branco para criar uma <strong>vaga livre</strong>, que
          entra direto no reaproveitamento.
        </div>

        <div className="grid-2">
          <div>
            <label htmlFor="nvNome">Paciente (opcional)</label>
            <input id="nvNome" value={f.pacienteNome}
              onChange={(e) => set("pacienteNome", e.target.value)} />
          </div>
          <div>
            <label htmlFor="nvFone">Telefone (opcional)</label>
            <input id="nvFone" inputMode="numeric" value={f.pacienteFone}
              onChange={(e) => set("pacienteFone", e.target.value)} />
          </div>
        </div>

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary" disabled={criar.isPending}>
            {criar.isPending ? "Criando..." : "Criar vaga"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------
function AbaFila({ unidadeId }) {
  const fila = useFila(unidadeId);
  const entrar = useEntrarNaFila(unidadeId);
  const sair = useSairDaFila(unidadeId);
  const [f, setF] = useState({ nome: "", fone: "", especialidade: "", prioridade: "normal" });
  const [erro, setErro] = useState("");
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));

  async function adicionar(e) {
    e.preventDefault();
    setErro("");
    const n = normalizeBRPhone(f.fone);
    if (!n.ok) return setErro(n.reason);
    if (!f.especialidade.trim()) return setErro("Informe a especialidade.");
    try {
      await entrar.mutateAsync({ ...f, fone: n.phone, especialidade: f.especialidade.trim() });
      setF({ nome: "", fone: "", especialidade: "", prioridade: "normal" });
    } catch (e2) {
      setErro(e2.message);
    }
  }

  const ordenada = useMemo(() => ordenarFila(fila.data || []), [fila.data]);

  return (
    <>
      <div className="card">
        <h3>Entrar na fila</h3>
        <form onSubmit={adicionar}>
          <div className="grid-2">
            <div>
              <label htmlFor="flNome">Nome</label>
              <input id="flNome" value={f.nome} onChange={(e) => set("nome", e.target.value)} />
            </div>
            <div>
              <label htmlFor="flFone">Telefone (WhatsApp)</label>
              <input id="flFone" inputMode="numeric" value={f.fone}
                onChange={(e) => set("fone", e.target.value)} />
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label htmlFor="flEsp">Especialidade</label>
              <input id="flEsp" value={f.especialidade}
                onChange={(e) => set("especialidade", e.target.value)} />
            </div>
            <div>
              <label htmlFor="flPrio">Prioridade</label>
              <select id="flPrio" value={f.prioridade}
                onChange={(e) => set("prioridade", e.target.value)}>
                <option value="normal">Normal</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
          <Message type="error">{erro}</Message>
          <div className="modal-actions">
            <button className="primary" disabled={entrar.isPending}>
              {entrar.isPending ? "Adicionando..." : "Adicionar à fila"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Fila de espera ({ordenada.length})</h3>
        <div className="card-subtitle">
          Ordenada por prioridade clínica e, dentro dela, por tempo de espera.
        </div>
        {fila.isLoading && <Loading />}
        {!fila.isLoading && !ordenada.length && <Empty label="Ninguém na fila." />}
        {ordenada.length > 0 && (
          <table className="tabela">
            <thead>
              <tr>
                <th>#</th><th>Paciente</th><th>Especialidade</th>
                <th>Prioridade</th><th>Espera desde</th><th></th>
              </tr>
            </thead>
            <tbody>
              {ordenada.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>
                    {p.nome || "(sem nome)"}
                    <div className="small">{formatBRPhone(p.fone)}</div>
                  </td>
                  <td>{p.especialidade}</td>
                  <td>
                    <span className={`prioridade prioridade-${p.prioridade}`}>
                      {p.prioridade}
                    </span>
                  </td>
                  <td className="small">
                    {new Date(p.solicitadoEm).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="col-acoes">
                    <button className="btn-icon btn-archive" title="Remover da fila"
                      onClick={() => sair.mutate(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ------------------------------------------------------------
// [INDICADORES] A aba que sustenta o contrato.
function AbaIndicadores({ unidadeId }) {
  const fim = hojeISO();
  const inicio = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }, []);
  const ind = useIndicadores(unidadeId, inicio, fim);
  const base = useLinhaBase(unidadeId);
  const [registrando, setRegistrando] = useState(false);

  if (ind.isLoading) return <Loading label="Calculando indicadores..." />;
  if (ind.error) return <ErrorState error={ind.error} onRetry={ind.refetch} />;

  const d = ind.data || {};
  const i = d.indicadores || {};
  const pct = (v) => (v == null ? "—" : `${(v * 100).toFixed(1)}%`);

  return (
    <>
      {/* O aviso vem do servidor, e é o mais importante da tela: sem linha
          de base não existe "antes", e sem "antes" a redução não é
          demonstrável — por melhor que o resultado pareça. */}
      {d.aviso && (
        <Message type="warning">
          ⚠️ {d.aviso}{" "}
          <button className="btn-mini" onClick={() => setRegistrando(true)}>
            Registrar linha de base
          </button>
        </Message>
      )}

      <div className="card">
        <h3>Últimos 30 dias</h3>
        <div className="card-subtitle">
          {inicio.split("-").reverse().join("/")} a {fim.split("-").reverse().join("/")}
        </div>

        <div className="ind-grid">
          <Indicador rotulo="Agendados" valor={i.agendados} />
          <Indicador rotulo="Compareceram" valor={i.compareceram} />
          <Indicador rotulo="Faltas" valor={i.faltas} />
          <Indicador rotulo="Taxa de faltas" valor={pct(i.taxaDeFaltas)} destaque />
          <Indicador rotulo="Cancelamentos" valor={i.cancelamentos} />
          <Indicador rotulo="Cancelamentos antecipados" valor={i.cancelamentosAntecipados} />
          <Indicador rotulo="Vagas ofertadas à fila" valor={i.vagasOfertadas} />
          <Indicador rotulo="Vagas recuperadas" valor={i.vagasRecuperadas} destaque />
        </div>

        {/* O vocabulário aqui é deliberado. O documento de impacto separa
            desperdício bruto de economia capturada; a tela não pode desfazer
            esse cuidado escrevendo "economia" onde o dado é capacidade. */}
        <div className="adesao-nota">
          ℹ️ <strong>Vaga recuperada</strong> conta apenas quando a vaga cancelada foi
          preenchida por outra pessoa <strong>e essa pessoa compareceu</strong>. É
          capacidade de atendimento recuperada — não é redução automática de despesa.
        </div>
      </div>

      {d.comparacao && (
        <div className="card">
          <h3>Comparação com a linha de base</h3>
          <div className="ind-grid">
            <Indicador rotulo="Taxa antes" valor={pct(d.comparacao.taxaBase)} />
            <Indicador rotulo="Taxa agora" valor={pct(d.comparacao.taxaAtual)} />
            <Indicador
              rotulo="Redução relativa"
              valor={pct(d.comparacao.reducaoRelativa)}
              destaque
            />
          </div>
          <div className="small">
            Fonte da linha de base: <strong>{d.comparacao.linhaBase?.fonte}</strong> ·
            período {d.comparacao.linhaBase?.periodoInicio?.slice(0, 10)} a{" "}
            {d.comparacao.linhaBase?.periodoFim?.slice(0, 10)}
          </div>
        </div>
      )}

      <div className="card">
        <h3>Origem das ações</h3>
        <div className="ind-grid">
          <Indicador rotulo="🤖 Automático" valor={i.acoesPorIA} />
          <Indicador rotulo="👤 Equipe" valor={i.acoesPorEquipe} />
        </div>
        <div className="small">
          Separar as duas colunas é o que permite responder, na prestação de contas,
          quanto do resultado veio do sistema e quanto veio do trabalho da equipe.
        </div>
      </div>

      {(base.data || []).length > 0 && (
        <div className="card">
          <h3>Linhas de base registradas</h3>
          <table className="tabela">
            <thead>
              <tr><th>Período</th><th>Agendados</th><th>Faltas</th><th>Fonte</th></tr>
            </thead>
            <tbody>
              {base.data.map((b) => (
                <tr key={b.id}>
                  <td>
                    {String(b.periodoInicio).slice(0, 10)} a {String(b.periodoFim).slice(0, 10)}
                  </td>
                  <td>{b.totalAgendados ?? "—"}</td>
                  <td>{b.totalFaltas}</td>
                  <td className="small">{b.fonte}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!d.aviso && (
        <button className="btn-mini" onClick={() => setRegistrando(true)}>
          Registrar outra linha de base
        </button>
      )}

      {registrando && (
        <LinhaBaseModal unidadeId={unidadeId} onClose={() => setRegistrando(false)} />
      )}
    </>
  );
}

function Indicador({ rotulo, valor, destaque }) {
  return (
    <div className={destaque ? "ind-card destaque" : "ind-card"}>
      <div className="ind-valor">{valor ?? 0}</div>
      <div className="ind-rotulo">{rotulo}</div>
    </div>
  );
}

function LinhaBaseModal({ unidadeId, onClose }) {
  const registrar = useRegistrarLinhaBase(unidadeId);
  const [f, setF] = useState({
    periodoInicio: "", periodoFim: "", totalAgendados: "",
    totalRealizados: "", totalFaltas: "", fonte: "", especialidade: "",
  });
  const [erro, setErro] = useState("");
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      await registrar.mutateAsync({
        ...f,
        especialidade: f.especialidade.trim() || null,
        totalAgendados: f.totalAgendados === "" ? null : Number(f.totalAgendados),
        totalRealizados: f.totalRealizados === "" ? null : Number(f.totalRealizados),
        totalFaltas: Number(f.totalFaltas),
      });
      onClose();
    } catch (e2) {
      setErro(e2.message);
    }
  }

  return (
    <Modal open title="Registrar linha de base" onClose={onClose}>
      <form onSubmit={salvar}>
        {/* Este texto existe porque a linha de base é a única peça do módulo
            que não tem conserto depois. */}
        <div className="modal-context">
          💡 É a taxa de faltas <strong>antes</strong> da Vytal entrar. O contrato
          paga por redução, e o “antes” não é reconstituível depois — sem ele, nenhum
          resultado posterior é demonstrável.
        </div>

        <div className="grid-2">
          <div>
            <label htmlFor="lbIni">Início do período</label>
            <input id="lbIni" type="date" value={f.periodoInicio}
              onChange={(e) => set("periodoInicio", e.target.value)} />
          </div>
          <div>
            <label htmlFor="lbFim">Fim do período</label>
            <input id="lbFim" type="date" value={f.periodoFim}
              onChange={(e) => set("periodoFim", e.target.value)} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label htmlFor="lbAgend">Agendados no período</label>
            <input id="lbAgend" type="number" min="0" value={f.totalAgendados}
              onChange={(e) => set("totalAgendados", e.target.value)} />
            <div className="small">
              Se a Secretaria só tiver atendimentos realizados, preencha o campo ao
              lado — agendados = realizados + faltas.
            </div>
          </div>
          <div>
            <label htmlFor="lbReal">Atendimentos realizados</label>
            <input id="lbReal" type="number" min="0" value={f.totalRealizados}
              onChange={(e) => set("totalRealizados", e.target.value)} />
          </div>
        </div>

        <label htmlFor="lbFaltas">Faltas no período</label>
        <input id="lbFaltas" type="number" min="0" value={f.totalFaltas}
          onChange={(e) => set("totalFaltas", e.target.value)} />

        <label htmlFor="lbFonte">Fonte do número</label>
        <input id="lbFonte" value={f.fonte}
          onChange={(e) => set("fonte", e.target.value)}
          placeholder="Ex.: planilha da Secretaria, ofício nº 123/2026" />
        <div className="small">
          Obrigatório. “De onde veio esse número?” é a primeira pergunta de qualquer auditoria.
        </div>

        <Message type="error">{erro}</Message>

        <div className="modal-actions">
          <button type="button" className="btn-secondary-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary" disabled={registrar.isPending}>
            {registrar.isPending ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
