import { useState, useEffect, useMemo, useRef } from "react";
import Message from "../components/Message.jsx";
import {
  samuApi, lerRascunho, salvarRascunho, limparRascunho,
  catalogoEmCache, guardarCatalogo,
} from "./api.js";
import {
  analisarSequencia, classificarValidade, gerarPendencias, resumoDaConferencia,
  formatarNumeroDocumento, GRAVIDADE, VALIDADE, ROTULO_DOCUMENTO,
} from "./regras.js";

const TIPOS_DOC = [
  { tipo: "dos", rotulo: "Certidões de óbito (DOS)" },
  { tipo: "guia_rosa", rotulo: "Guias rosas" },
];

const chaveItem = (bolsa, grupo, tamanho) => `${bolsa}|${grupo}|${tamanho}`;

// Um rascunho só existe se alguém digitou alguma coisa.
function temConteudo(r = {}) {
  const itens = Object.values(r.itens || {});
  if (itens.some((v) => String(v?.quantidade ?? "") !== "" || v?.validade)) return true;
  const docs = Object.values(r.docs || {});
  if (docs.some((d) => d?.numeros?.length || d?.inicio || d?.fim)) return true;
  if ((r.manuais || []).length) return true;
  return Boolean(String(r.observacoes || "").trim());
}

export default function ConferenciaPage({ plantao, pendenciasAnteriores = [], aoFinalizar }) {
  const [catalogo, setCatalogo] = useState(() => catalogoEmCache() || []);
  const [itens, setItens] = useState({});
  const [docs, setDocs] = useState(() =>
    Object.fromEntries(TIPOS_DOC.map((t) => [t.tipo, { numeros: [], inicio: "", fim: "" }]))
  );
  const [observacoes, setObservacoes] = useState("");
  const [manuais, setManuais] = useState([]);
  const [novaManual, setNovaManual] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const carregou = useRef(false);

  // Catálogo do servidor, com cache: sem ele não dá para conferir offline.
  useEffect(() => {
    samuApi
      .catalogo()
      .then((r) => {
        if (r?.catalogo) { setCatalogo(r.catalogo); guardarCatalogo(r.catalogo); }
      })
      .catch(() => {
        if (!catalogoEmCache()) setErro("Não foi possível carregar a lista de materiais.");
      });
  }, []);

  // Rascunho local: a conferência é longa e feita dentro da ambulância.
  useEffect(() => {
    const r = lerRascunho(plantao.id);
    if (r) {
      setItens(r.itens || {});
      setDocs((d) => ({ ...d, ...(r.docs || {}) }));
      setObservacoes(r.observacoes || "");
      setManuais(r.manuais || []);
      // Só avisa se havia mesmo algo digitado. Anunciar "rascunho
      // recuperado" numa conferência em branco faz a pessoa procurar o que
      // foi recuperado — e desconfiar da tela logo no primeiro uso.
      if (temConteudo(r)) setAviso("Rascunho recuperado deste aparelho.");
    }
    carregou.current = true;
  }, [plantao.id]);

  useEffect(() => {
    if (!carregou.current) return;
    const atual = { itens, docs, observacoes, manuais };
    // Não grava rascunho vazio: além de inútil, era o que fazia a própria
    // tela "recuperar" o nada que ela mesma tinha acabado de salvar.
    if (temConteudo(atual)) salvarRascunho(plantao.id, atual);
  }, [plantao.id, itens, docs, observacoes, manuais]);

  // Só entra na conferência o que foi tocado. Uma bolsa inteira em branco
  // não deve virar 30 pendências de "não conferido" antes de alguém começar.
  const itensParaEnvio = useMemo(
    () =>
      Object.entries(itens)
        .filter(([, v]) => v.quantidade !== "" || v.validade)
        .map(([k, v]) => {
          const [bolsa, grupo, tamanho] = k.split("|");
          return { bolsa, grupo, tamanho, quantidade: v.quantidade, validade: v.validade || null };
        }),
    [itens]
  );

  const documentosParaEnvio = useMemo(
    () =>
      TIPOS_DOC.map((t) => ({
        tipo: t.tipo,
        numeros: docs[t.tipo].numeros,
        faixa: { inicio: docs[t.tipo].inicio, fim: docs[t.tipo].fim },
      })).filter((d) => d.numeros.length || d.faixa.inicio || d.faixa.fim),
    [docs]
  );

  const pendencias = useMemo(
    () => gerarPendencias({ itens: itensParaEnvio, documentos: documentosParaEnvio, manuais }),
    [itensParaEnvio, documentosParaEnvio, manuais]
  );
  const resumo = resumoDaConferencia(pendencias);

  function mudarItem(bolsa, grupo, tamanho, campo, valor) {
    const k = chaveItem(bolsa, grupo, tamanho);
    setItens((prev) => ({
      ...prev,
      [k]: { quantidade: "", validade: "", ...prev[k], [campo]: valor },
    }));
  }

  async function salvar(seguir) {
    setSalvando(true);
    setErro("");
    try {
      await samuApi.salvarConferencia(plantao.id, {
        itens: itensParaEnvio,
        documentos: documentosParaEnvio,
        observacoes,
      });
      // As manuais são rota própria: o salvar da conferência recalcula só as
      // automáticas, então mandá-las junto as apagaria a cada salvamento.
      for (const m of manuais.filter((x) => !x.enviada)) {
        await samuApi.pendenciaManual(plantao.id, { descricao: m.descricao });
      }
      setManuais((ms) => ms.map((m) => ({ ...m, enviada: true })));
      limparRascunho(plantao.id);
      setAviso("Conferência salva.");
      if (seguir) aoFinalizar();
    } catch (e) {
      // Sem rede o rascunho continua no aparelho — é o que separa "tente de
      // novo daqui a pouco" de "refaça tudo".
      setErro(
        e.status === 0
          ? "Sem conexão. A conferência está guardada neste aparelho — tente salvar de novo quando a rede voltar."
          : e.message
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      {pendenciasAnteriores.length > 0 && (
        <div className="card" style={{ borderLeft: "4px solid var(--alerta, #b26a00)" }}>
          <strong>⚠️ {pendenciasAnteriores.length} pendência(s) do plantão anterior</strong>
          <ul className="samu-lista">
            {pendenciasAnteriores.map((p) => (
              <li key={p.id}>{p.descricao}</li>
            ))}
          </ul>
          <div className="small">
            Elas se encerram sozinhas quando o item reaparece conferido nesta passagem.
          </div>
        </div>
      )}

      {aviso && <Message type="success">{aviso}</Message>}
      {erro && <Message type="error">{erro}</Message>}

      {catalogo.map((bolsa) => (
        <div className="card" key={bolsa.bolsa}>
          <h3 style={{ textTransform: "capitalize" }}>Bolsa {bolsa.bolsa}</h3>
          {bolsa.grupos.map((grupo) => (
            <div className="samu-grupo" key={grupo.nome}>
              <div className="samu-grupo-nome">{grupo.nome}</div>
              <table className="samu-tabela">
                <thead>
                  <tr>
                    <th>Tamanho</th>
                    <th style={{ width: 96 }}>Qtd.</th>
                    {grupo.pedeValidade && <th style={{ width: 150 }}>Validade</th>}
                    <th style={{ width: 130 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {grupo.tamanhos.map((tamanho) => {
                    const k = chaveItem(bolsa.bolsa, grupo.nome, tamanho);
                    const v = itens[k] || { quantidade: "", validade: "" };
                    const val = grupo.pedeValidade
                      ? classificarValidade(v.validade)
                      : { estado: VALIDADE.AUSENTE };
                    return (
                      <tr key={tamanho}>
                        <td>{tamanho}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            aria-label={`Quantidade de ${grupo.nome} ${tamanho}`}
                            value={v.quantidade}
                            onChange={(e) =>
                              mudarItem(bolsa.bolsa, grupo.nome, tamanho, "quantidade", e.target.value)
                            }
                          />
                        </td>
                        {grupo.pedeValidade && (
                          <td>
                            <input
                              // MM/AAAA é como a validade vem impressa na
                              // maioria dos materiais; aceita data completa
                              // também.
                              placeholder="MM/AAAA"
                              aria-label={`Validade de ${grupo.nome} ${tamanho}`}
                              value={v.validade}
                              onChange={(e) =>
                                mudarItem(bolsa.bolsa, grupo.nome, tamanho, "validade", e.target.value)
                              }
                            />
                          </td>
                        )}
                        <td>
                          {String(v.quantidade) === "0" && <span className="samu-tag critica">em falta</span>}
                          {val.estado === VALIDADE.VENCIDO && <span className="samu-tag critica">vencido</span>}
                          {val.estado === VALIDADE.PROXIMO && (
                            <span className="samu-tag atencao">vence em {val.diasRestantes}d</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}

      {TIPOS_DOC.map((t) => (
        <BlocoDocumento
          key={t.tipo}
          rotulo={t.rotulo}
          estado={docs[t.tipo]}
          aoMudar={(novo) => setDocs((d) => ({ ...d, [t.tipo]: novo }))}
        />
      ))}

      <div className="card">
        <h3>Pendências anotadas à mão</h3>
        <div className="small">
          O que o sistema não tem como ver — lâmpada de laringoscópio fraca, cinto rasgado.
        </div>
        <ul className="samu-lista">
          {manuais.map((m, i) => (
            <li key={i}>
              {m.descricao}
              {!m.enviada && <span className="small"> (será enviada ao salvar)</span>}
            </li>
          ))}
        </ul>
        <div className="samu-linha">
          <input
            placeholder="Descreva a pendência"
            value={novaManual}
            onChange={(e) => setNovaManual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && novaManual.trim()) {
                e.preventDefault();
                setManuais((m) => [...m, { descricao: novaManual.trim() }]);
                setNovaManual("");
              }
            }}
          />
          <button
            disabled={!novaManual.trim()}
            onClick={() => {
              setManuais((m) => [...m, { descricao: novaManual.trim() }]);
              setNovaManual("");
            }}
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Observações do plantão</h3>
        <textarea rows={3} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
      </div>

      <div className="card">
        <h3>Resumo</h3>
        {resumo.liberado ? (
          <Message type="success">Nenhuma pendência encontrada até aqui.</Message>
        ) : (
          <>
            <div className="small">
              {resumo.criticas} crítica(s) · {resumo.atencao} de atenção
            </div>
            <ul className="samu-lista">
              {pendencias.map((p, i) => (
                <li key={i}>
                  <span className={`samu-tag ${p.gravidade === GRAVIDADE.CRITICA ? "critica" : "atencao"}`}>
                    {p.gravidade === GRAVIDADE.CRITICA ? "crítica" : "atenção"}
                  </span>{" "}
                  {p.descricao}
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="modal-actions">
          <button onClick={() => salvar(false)} disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar conferência"}
          </button>
          <button className="primary" onClick={() => salvar(true)} disabled={salvando}>
            Salvar e ir para a assinatura →
          </button>
        </div>
      </div>
    </div>
  );
}

function BlocoDocumento({ rotulo, estado, aoMudar }) {
  const [novo, setNovo] = useState("");
  const s = analisarSequencia(estado.numeros, { inicio: estado.inicio, fim: estado.fim });

  function adicionar() {
    const v = novo.trim();
    if (!v) return;
    aoMudar({ ...estado, numeros: [...estado.numeros, v] });
    setNovo("");
  }

  return (
    <div className="card">
      <h3>{rotulo}</h3>

      <div className="samu-linha">
        <input
          placeholder="Número"
          inputMode="numeric"
          aria-label={`Número de ${rotulo}`}
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); adicionar(); }
          }}
        />
        <button onClick={adicionar} disabled={!novo.trim()}>+</button>
      </div>

      {estado.numeros.length > 0 && (
        <div className="samu-numeros">
          {estado.numeros.map((n, i) => (
            <span className="samu-numero" key={`${n}-${i}`}>
              {n}
              <button
                aria-label={`Remover ${n}`}
                onClick={() => aoMudar({ ...estado, numeros: estado.numeros.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* [LIMITE-DA-SEQUENCIA] Sem o intervalo do talão só dá para achar
          buraco no meio. Os campos existem para que a tela possa dizer
          "completa" em vez de "sem buracos no que foi conferido". */}
      <div className="samu-faixa">
        <label>Talão vai de</label>
        <input
          inputMode="numeric" placeholder="001" value={estado.inicio}
          onChange={(e) => aoMudar({ ...estado, inicio: e.target.value })}
        />
        <label>até</label>
        <input
          inputMode="numeric" placeholder="050" value={estado.fim}
          onChange={(e) => aoMudar({ ...estado, fim: e.target.value })}
        />
      </div>

      <div className="small">Quantidade lançada: <strong>{s.quantidade}</strong></div>

      {s.duplicados.length > 0 && (
        <Message type="error">
          Número repetido: {s.duplicados.map((n) => formatarNumeroDocumento(n, s.largura)).join(", ")}
        </Message>
      )}

      {s.faltantes.length > 0 && (
        <Message type="warning">
          Quebra de sequência — não localizado(s):{" "}
          {s.faltantes.map((n) => formatarNumeroDocumento(n, s.largura)).join(", ")}
          {s.excedeuLimite && " (lista truncada — confira o intervalo do talão)"}
        </Message>
      )}

      {s.quantidade > 0 && !s.faltantes.length && !s.duplicados.length && (
        s.completa ? (
          <Message type="success">
            Sequência completa de {formatarNumeroDocumento(s.de, s.largura)} a{" "}
            {formatarNumeroDocumento(s.ate, s.largura)}.
          </Message>
        ) : (
          // A distinção que sustenta a confiança na tela: sem o intervalo do
          // talão, ninguém sabe se faltam os últimos números.
          <Message type="warning">
            Sem buracos entre {formatarNumeroDocumento(s.de, s.largura)} e{" "}
            {formatarNumeroDocumento(s.ate, s.largura)} — mas o intervalo do talão não foi
            informado, então não dá para saber se faltam os do fim. Preencha “de/até” para
            conferir de verdade.
          </Message>
        )
      )}
    </div>
  );
}
