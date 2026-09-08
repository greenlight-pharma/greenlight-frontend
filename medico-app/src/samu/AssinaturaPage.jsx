import { useState, useEffect } from "react";
import Message from "../components/Message.jsx";
import { samuApi } from "./api.js";
import { GRAVIDADE } from "./regras.js";

// [ASSINATURA] As duas pessoas assinam com a PRÓPRIA senha. Nome digitado
// não serve: o documento é usado pela coordenação para cobrar depois, e um
// nome digitado é uma pessoa só assinando pelas duas.
//
// A senha vai direto para o servidor conferir e não é guardada em lugar
// nenhum — nem em estado que sobreviva a esta tela.
export default function AssinaturaPage({ plantao, aoVoltar, aoConcluir }) {
  const [dados, setDados] = useState(null);
  const [entrega, setEntrega] = useState({ registro: "", senha: "" });
  const [recebimento, setRecebimento] = useState({ registro: "", senha: "" });
  const [declarou, setDeclarou] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    samuApi.plantao(plantao.id).then(setDados).catch((e) => setErro(e.message));
  }, [plantao.id]);

  async function assinar() {
    setEnviando(true);
    setErro("");
    try {
      const r = await samuApi.finalizar(plantao.id, {
        entregante: entrega,
        recebedor: recebimento,
        // O servidor recalcula o hash e recusa se a conferência mudou desde
        // este resumo: assinar aí seria assinar outro documento.
        hashConteudo: dados?.hashConteudo,
      });
      aoConcluir(r);
    } catch (e) {
      if (e.status === 409 && e.body?.hashConteudo) {
        setErro(
          "A conferência mudou desde o resumo que você está vendo. Reveja antes de assinar."
        );
        samuApi.plantao(plantao.id).then(setDados).catch(() => {});
      } else {
        setErro(e.message);
      }
    } finally {
      setEnviando(false);
      // A senha não fica na memória depois da tentativa.
      setEntrega((v) => ({ ...v, senha: "" }));
      setRecebimento((v) => ({ ...v, senha: "" }));
      setDeclarou(false);
    }
  }

  const pendencias = dados?.pendencias || [];
  const criticas = pendencias.filter((p) => p.gravidade === GRAVIDADE.CRITICA);
  const completo =
    declarou && entrega.registro && entrega.senha && recebimento.registro && recebimento.senha;

  return (
    <div>
      <div className="card">
        <h3>Resumo da conferência</h3>
        {!dados && <div className="small">Carregando…</div>}
        {dados && pendencias.length === 0 && (
          <Message type="success">Nenhuma pendência registrada.</Message>
        )}
        {pendencias.length > 0 && (
          <>
            <div className="small">
              {criticas.length} crítica(s) · {pendencias.length - criticas.length} de atenção
            </div>
            <ul className="samu-lista">
              {pendencias.map((p) => (
                <li key={p.id}>
                  <span className={`samu-tag ${p.gravidade === GRAVIDADE.CRITICA ? "critica" : "atencao"}`}>
                    {p.gravidade === GRAVIDADE.CRITICA ? "crítica" : "atenção"}
                  </span>{" "}
                  {p.descricao}
                </li>
              ))}
            </ul>
            {/* Pendência não impede a passagem: o plantão tem que trocar de
                qualquer jeito. O que o app garante é que ninguém assine sem
                ter visto. */}
            <div className="small">
              Pendência não impede a passagem — fica registrada e segue para o próximo plantão.
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h3>Assinatura</h3>
        <div className="small">
          Cada um assina com o próprio registro e a própria senha. Fica gravado quem assinou,
          a hora do servidor e o conteúdo exato desta conferência.
        </div>

        <div className="samu-assinatura">
          <fieldset>
            <legend>Quem entrega</legend>
            <label htmlFor="entRegistro">Registro</label>
            <input
              id="entRegistro" autoComplete="off" value={entrega.registro}
              onChange={(e) => setEntrega((v) => ({ ...v, registro: e.target.value }))}
            />
            <label htmlFor="entSenha">Senha</label>
            <input
              id="entSenha" type="password" autoComplete="off" value={entrega.senha}
              onChange={(e) => setEntrega((v) => ({ ...v, senha: e.target.value }))}
            />
          </fieldset>

          <fieldset>
            <legend>Quem recebe</legend>
            <label htmlFor="recRegistro">Registro</label>
            <input
              id="recRegistro" autoComplete="off" value={recebimento.registro}
              onChange={(e) => setRecebimento((v) => ({ ...v, registro: e.target.value }))}
            />
            <label htmlFor="recSenha">Senha</label>
            <input
              id="recSenha" type="password" autoComplete="off" value={recebimento.senha}
              onChange={(e) => setRecebimento((v) => ({ ...v, senha: e.target.value }))}
            />
          </fieldset>
        </div>

        <label className="samu-declaro">
          <input type="checkbox" checked={declarou} onChange={(e) => setDeclarou(e.target.checked)} />
          Declaramos que conferimos os itens acima.
        </label>

        {erro && <Message type="error">{erro}</Message>}

        <div className="modal-actions">
          <button onClick={aoVoltar} disabled={enviando}>← Voltar à conferência</button>
          <button className="primary" onClick={assinar} disabled={!completo || enviando}>
            {enviando ? "Assinando…" : "Finalizar e passar plantão"}
          </button>
        </div>
        <div className="small">
          A assinatura precisa de internet — é o servidor que confere as senhas. A conferência
          já salva não se perde.
        </div>
      </div>
    </div>
  );
}
