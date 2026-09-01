import { useState } from "react";
import PageHeader from "../../components/PageHeader.jsx";
import { Loading, ErrorState, Empty } from "../../components/Loading.jsx";
import Message from "../../components/Message.jsx";
import { useUnidades, useCriarUnidade } from "../../features/agendaUbs/api.js";

// [UNIDADES] Cadastro das UBS. É a raiz de todo o módulo de agenda: cada
// vaga, cada fila e cada indicador do contrato é POR UNIDADE.
//
// O código não é um apelido interno. Ele é o mesmo que vai impresso no QR
// de autorização do balcão, e é por ele que a adesão de um paciente se
// amarra à unidade que o cadastrou. Trocar o código depois de imprimir o
// cartaz quebra essa ligação em silêncio — os cadastros continuam entrando,
// só param de ser atribuídos a alguém.
function normalizaCodigo(v) {
  return String(v || "")
    .toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9 _-]/g, "-").replace(/-+/g, "-").slice(0, 31)
    .replace(/^[- ]+/, "");
}

export default function UnidadesPage() {
  const unidades = useUnidades();
  const criar = useCriarUnidade();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tocado, setTocado] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const codigoEfetivo = tocado
    ? normalizaCodigo(codigo)
    : normalizaCodigo(nome.trim().replace(/\s+/g, "-"));

  async function salvar(e) {
    e.preventDefault();
    setErro(""); setOk("");
    if (!nome.trim()) return setErro("Informe o nome da unidade.");
    if (!codigoEfetivo) return setErro("Informe o código da unidade.");
    try {
      await criar.mutateAsync({ nome: nome.trim(), codigo: codigoEfetivo });
      setOk(`Unidade "${nome.trim()}" salva com o código ${codigoEfetivo}.`);
      setNome(""); setCodigo(""); setTocado(false);
    } catch (e2) {
      setErro(e2.message);
    }
  }

  return (
    <>
      <PageHeader
        title="Unidades"
        subtitle="As UBS atendidas. Base de toda a agenda e dos indicadores do contrato."
      />

      <div className="card">
        <h3>Cadastrar unidade</h3>
        <form onSubmit={salvar}>
          <div className="grid-2">
            <div>
              <label htmlFor="unNome">Nome</label>
              <input id="unNome" value={nome} placeholder="UBS Jardim Oriente"
                onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <label htmlFor="unCodigo">Código</label>
              <input id="unCodigo" value={codigoEfetivo}
                onChange={(e) => { setTocado(true); setCodigo(e.target.value); }} />
              <div className="small">
                O mesmo que vai no QR de autorização. Evite mudar depois de imprimir
                o cartaz.
              </div>
            </div>
          </div>

          <Message type="error">{erro}</Message>
          {ok && <Message type="success">{ok}</Message>}

          <div className="modal-actions">
            <button className="primary" disabled={criar.isPending}>
              {criar.isPending ? "Salvando..." : "Salvar unidade"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Unidades cadastradas</h3>
        {unidades.isLoading && <Loading />}
        {unidades.error && <ErrorState error={unidades.error} onRetry={unidades.refetch} />}
        {!unidades.isLoading && !(unidades.data || []).length && (
          <Empty label="Nenhuma unidade cadastrada ainda." />
        )}
        {(unidades.data || []).length > 0 && (
          <table className="tabela">
            <thead><tr><th>Nome</th><th>Código</th><th>Cadastrada em</th></tr></thead>
            <tbody>
              {unidades.data.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.nome}</strong></td>
                  <td><code>{u.codigo}</code></td>
                  <td className="small">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
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
