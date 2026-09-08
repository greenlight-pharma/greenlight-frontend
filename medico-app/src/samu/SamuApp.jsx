import { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { SamuAuthProvider } from "./SamuAuth.jsx";
import { useAuth } from "../features/auth/AuthContext.jsx";
import SamuLoginPage from "./SamuLoginPage.jsx";
import ConferenciaPage from "./ConferenciaPage.jsx";
import AssinaturaPage from "./AssinaturaPage.jsx";
import HistoricoPage from "./HistoricoPage.jsx";
import Message from "../components/Message.jsx";
import { samuApi, idDeCliente } from "./api.js";

// [PAINEL-SAMU] Passagem de plantão. Quarto painel, e o mais diferente dos
// outros três: o usuário não é médico do Vytal, o login é por registro do
// conselho, e a tela é usada de pé, na troca de turno, com pressa.
//
// Por isso o fluxo é linear e não um menu: escolher viatura → conferir →
// assinar. Quem está passando o plantão não navega, ele avança.
const PASSOS = { INICIO: "inicio", CONFERENCIA: "conferencia", ASSINATURA: "assinatura", FIM: "fim" };

function Shell() {
  const { isLoggedIn, doctor, logout } = useAuth();
  if (!isLoggedIn) return <SamuLoginPage />;
  return <Fluxo profissional={doctor} aoSair={logout} />;
}

function Fluxo({ profissional, aoSair }) {
  const [passo, setPasso] = useState(PASSOS.INICIO);
  const [viaturas, setViaturas] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [viaturaId, setViaturaId] = useState("");
  const [entreganteId, setEntreganteId] = useState("");
  const [plantao, setPlantao] = useState(null);
  const [anteriores, setAnteriores] = useState([]);
  const [conclusao, setConclusao] = useState(null);
  const [erro, setErro] = useState("");
  const [abrindo, setAbrindo] = useState(false);
  const [verHistorico, setVerHistorico] = useState(false);

  useEffect(() => {
    samuApi.viaturas(profissional.baseId).then((r) => setViaturas(r.viaturas || [])).catch(() => {});
    samuApi.profissionais(profissional.baseId).then((r) => setProfissionais(r.profissionais || [])).catch(() => {});
  }, [profissional.baseId]);

  async function iniciar() {
    setAbrindo(true);
    setErro("");
    try {
      const r = await samuApi.iniciarPlantao({
        viaturaId,
        entreganteId: entreganteId || null,
        // Reenvio por rede oscilando não abre um segundo plantão.
        clienteId: idDeCliente(),
      });
      setPlantao(r.plantao);
      setAnteriores(r.pendenciasAnteriores || []);
      setPasso(PASSOS.CONFERENCIA);
    } catch (e) {
      setErro(e.message);
    } finally {
      setAbrindo(false);
    }
  }

  return (
    <div className="samu-app">
      <header className="samu-topo">
        <div>
          <strong>Passagem de plantão</strong>
          <div className="small">{profissional.name} · {profissional.email}</div>
        </div>
        <div className="samu-topo-acoes">
          <button onClick={() => setVerHistorico((v) => !v)}>
            {verHistorico ? "Voltar" : "Histórico"}
          </button>
          <button onClick={() => aoSair()}>Sair</button>
        </div>
      </header>

      <main className="samu-conteudo">
        {verHistorico ? (
          <HistoricoPage viaturaId={viaturaId} viaturas={viaturas} />
        ) : (
          <>
            {passo === PASSOS.INICIO && (
              <div className="card">
                <h3>Iniciar conferência</h3>
                {erro && <Message type="error">{erro}</Message>}

                <label htmlFor="viatura">Viatura</label>
                <select id="viatura" value={viaturaId} onChange={(e) => setViaturaId(e.target.value)}>
                  <option value="">Selecione…</option>
                  {viaturas.map((v) => (
                    <option key={v.id} value={v.id}>{v.prefixo}{v.tipo ? ` — ${v.tipo}` : ""}</option>
                  ))}
                </select>
                {viaturas.length === 0 && (
                  <div className="small">
                    Nenhuma viatura cadastrada nesta base. Peça ao administrador para cadastrar.
                  </div>
                )}

                <label htmlFor="entregante">Quem entrega o plantão</label>
                <select id="entregante" value={entreganteId} onChange={(e) => setEntreganteId(e.target.value)}>
                  <option value="">Selecione…</option>
                  {profissionais.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} — {p.registro}</option>
                  ))}
                </select>
                <div className="small">
                  Quem recebe é você, {profissional.name}. Na assinatura os dois confirmam com a
                  própria senha — e é ali que vale quem realmente assinou.
                </div>

                <div className="modal-actions">
                  <button className="primary" onClick={iniciar} disabled={!viaturaId || abrindo}>
                    {abrindo ? "Abrindo…" : "Iniciar conferência →"}
                  </button>
                </div>
              </div>
            )}

            {passo === PASSOS.CONFERENCIA && plantao && (
              <ConferenciaPage
                plantao={plantao}
                pendenciasAnteriores={anteriores}
                aoFinalizar={() => setPasso(PASSOS.ASSINATURA)}
              />
            )}

            {passo === PASSOS.ASSINATURA && plantao && (
              <AssinaturaPage
                plantao={plantao}
                aoVoltar={() => setPasso(PASSOS.CONFERENCIA)}
                aoConcluir={(r) => { setConclusao(r); setPasso(PASSOS.FIM); }}
              />
            )}

            {passo === PASSOS.FIM && conclusao && (
              <div className="card">
                <Message type="success">Plantão passado e assinado.</Message>
                <ul className="samu-lista">
                  {conclusao.assinantes?.map((a) => (
                    <li key={a.papel}>
                      <strong>{a.papel === "entrega" ? "Entrega" : "Recebimento"}:</strong>{" "}
                      {a.nome} — {a.registro}
                    </li>
                  ))}
                </ul>
                {/* O hash é o que responde, meses depois, "o que exatamente
                    estava escrito quando assinaram". */}
                <div className="small">
                  Registro do conteúdo assinado: <code>{conclusao.hashConteudo?.slice(0, 16)}…</code>
                </div>
                <div className="modal-actions">
                  <button
                    className="primary"
                    onClick={() => {
                      setPlantao(null); setConclusao(null); setAnteriores([]);
                      setPasso(PASSOS.INICIO);
                    }}
                  >
                    Nova passagem
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function SamuApp() {
  return (
    <HashRouter>
      <SamuAuthProvider>
        <Shell />
      </SamuAuthProvider>
    </HashRouter>
  );
}
