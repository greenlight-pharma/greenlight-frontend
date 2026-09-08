import { useEffect, useState } from "react";
import Message from "../components/Message.jsx";
import { samuApi } from "./api.js";

// O histórico é o que a coordenação abre. Mostra a idade do problema, não só
// a existência dele: "pendente há 3 plantões" é a informação que faz agir.
export default function HistoricoPage({ viaturaId, viaturas = [] }) {
  const [selecionada, setSelecionada] = useState(viaturaId || viaturas[0]?.id || "");
  const [plantoes, setPlantoes] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!selecionada) return;
    samuApi
      .historico(selecionada)
      .then((r) => setPlantoes(r.plantoes || []))
      .catch((e) => setErro(e.message));
  }, [selecionada]);

  return (
    <div className="card">
      <h3>Histórico da viatura</h3>

      <label htmlFor="histViatura">Viatura</label>
      <select id="histViatura" value={selecionada} onChange={(e) => setSelecionada(e.target.value)}>
        {viaturas.map((v) => (
          <option key={v.id} value={v.id}>{v.prefixo}</option>
        ))}
      </select>

      {erro && <Message type="error">{erro}</Message>}

      {plantoes.length === 0 && !erro && (
        <div className="small">Nenhuma passagem registrada nesta viatura ainda.</div>
      )}

      <table className="samu-tabela">
        <thead>
          <tr>
            <th>Quando</th><th>Entrega</th><th>Recebe</th><th>Situação</th><th>Pendências</th>
          </tr>
        </thead>
        <tbody>
          {plantoes.map((p) => (
            <tr key={p.id}>
              <td>{formatarData(p.finalizado_em || p.iniciado_em)}</td>
              <td>{p.entregante_nome || "—"}</td>
              <td>{p.recebedor_nome || "—"}</td>
              <td>{p.status === "finalizado" ? "assinado" : "em conferência"}</td>
              <td>
                {Number(p.pendencias_abertas) > 0 ? (
                  <span className="samu-tag atencao">{p.pendencias_abertas} aberta(s)</span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatarData(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
