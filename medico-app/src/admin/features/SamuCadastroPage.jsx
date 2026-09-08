import { useState, useEffect } from "react";
import Message from "../../components/Message.jsx";
import { api } from "../../lib/api.js";

// [CADASTRO-SAMU] Base, viatura e profissional. Só o admin cadastra: quem
// está passando plantão às 7h não deveria conseguir criar um usuário — e o
// registro do conselho é o que identifica quem assina o documento depois.
export default function SamuCadastroPage() {
  const [bases, setBases] = useState([]);
  const [viaturas, setViaturas] = useState([]);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const [base, setBase] = useState({ nome: "", local: "" });
  const [viatura, setViatura] = useState({ baseId: "", prefixo: "", tipo: "USB" });
  const [prof, setProf] = useState({ baseId: "", nome: "", registro: "", profissao: "", senha: "" });

  async function recarregar() {
    try {
      const [b, v] = await Promise.all([api.get("/samu/bases"), api.get("/samu/viaturas")]);
      setBases(b.bases || []);
      setViaturas(v.viaturas || []);
    } catch (e) {
      // Engolir o erro aqui foi o que fez a base cadastrada simplesmente não
      // aparecer no seletor, sem nada na tela explicando por quê. Quem
      // cadastrou ficou achando que o cadastro não tinha funcionado.
      setErro(`Não foi possível listar os cadastros: ${e.message}`);
    }
  }
  useEffect(() => { recarregar(); }, []);

  async function enviar(caminho, corpo, limpar) {
    setErro(""); setOk("");
    try {
      await api.post(caminho, corpo);
      setOk("Cadastrado.");
      limpar();
      recarregar();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <>
      <h2>SAMU — cadastros</h2>
      <div className="small">
        Base, viatura e profissional da passagem de plantão. O painel do plantão fica em{" "}
        <code>/painel-samu</code>.
      </div>

      {ok && <Message type="success">{ok}</Message>}
      {erro && <Message type="error">{erro}</Message>}

      <div className="card">
        <h3>Base</h3>
        <label htmlFor="bNome">Nome</label>
        <input id="bNome" value={base.nome} onChange={(e) => setBase({ ...base, nome: e.target.value })} />
        <label htmlFor="bLocal">Município / local</label>
        <input id="bLocal" value={base.local} onChange={(e) => setBase({ ...base, local: e.target.value })} />
        <div className="modal-actions">
          <button
            className="primary"
            disabled={!base.nome.trim()}
            onClick={() => enviar("/samu/bases", base, () => setBase({ nome: "", local: "" }))}
          >
            Cadastrar base
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Viatura</h3>
        <label htmlFor="vBase">Base</label>
        <select id="vBase" value={viatura.baseId} onChange={(e) => setViatura({ ...viatura, baseId: e.target.value })}>
          <option value="">Selecione…</option>
          {bases.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
        {bases.length === 0 && (
          <div className="small">Cadastre uma base acima antes de cadastrar a viatura.</div>
        )}
        <label htmlFor="vPrefixo">Prefixo</label>
        <input id="vPrefixo" placeholder="USB-01" value={viatura.prefixo}
               onChange={(e) => setViatura({ ...viatura, prefixo: e.target.value })} />
        <label htmlFor="vTipo">Tipo</label>
        <select id="vTipo" value={viatura.tipo} onChange={(e) => setViatura({ ...viatura, tipo: e.target.value })}>
          <option value="USB">USB — suporte básico</option>
          <option value="USA">USA — suporte avançado</option>
          <option value="Motolância">Motolância</option>
        </select>
        <div className="modal-actions">
          <button
            className="primary"
            disabled={!viatura.baseId || !viatura.prefixo.trim()}
            onClick={() => enviar("/samu/viaturas", viatura,
              () => setViatura({ baseId: viatura.baseId, prefixo: "", tipo: "USB" }))}
          >
            Cadastrar viatura
          </button>
        </div>
        {viaturas.length > 0 && (
          <div className="small">Cadastradas: {viaturas.map((v) => v.prefixo).join(", ")}</div>
        )}
      </div>

      <div className="card">
        <h3>Profissional</h3>
        <div className="small">
          O registro do conselho é o login — e é ele que aparece na assinatura da passagem.
        </div>
        <label htmlFor="pBase">Base</label>
        <select id="pBase" value={prof.baseId} onChange={(e) => setProf({ ...prof, baseId: e.target.value })}>
          <option value="">Selecione…</option>
          {bases.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
        {bases.length === 0 && (
          <div className="small">Cadastre uma base acima antes de cadastrar o profissional.</div>
        )}
        <label htmlFor="pNome">Nome</label>
        <input id="pNome" value={prof.nome} onChange={(e) => setProf({ ...prof, nome: e.target.value })} />
        <label htmlFor="pRegistro">Registro do conselho</label>
        <input id="pRegistro" placeholder="CRM-RJ 000000 · COREN-RJ 000000" value={prof.registro}
               onChange={(e) => setProf({ ...prof, registro: e.target.value })} />
        <label htmlFor="pProfissao">Profissão</label>
        <input id="pProfissao" placeholder="Médico, enfermeiro, técnico…" value={prof.profissao}
               onChange={(e) => setProf({ ...prof, profissao: e.target.value })} />
        <label htmlFor="pSenha">Senha inicial</label>
        <input id="pSenha" type="password" autoComplete="new-password" value={prof.senha}
               onChange={(e) => setProf({ ...prof, senha: e.target.value })} />
        <div className="modal-actions">
          <button
            className="primary"
            disabled={!prof.nome.trim() || !prof.registro.trim() || !prof.senha}
            onClick={() => enviar("/samu/profissionais", prof,
              () => setProf({ baseId: prof.baseId, nome: "", registro: "", profissao: "", senha: "" }))}
          >
            Cadastrar profissional
          </button>
        </div>
      </div>
    </>
  );
}
