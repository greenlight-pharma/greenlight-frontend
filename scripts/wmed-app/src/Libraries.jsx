import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  ArrowLeft,
  ArrowUpRight,
  Calculator,
  Pill,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";
import { SCORES as ORIGINAL_SCORES } from "./academic/scores";
import { EXTRA_SCORES } from "./academic/extra-scores";
import Calculators from "./Calculators";
import { calculators } from "../shared/calculators.mjs";
const SCORES=[...ORIGINAL_SCORES,...EXTRA_SCORES];
export async function academicRequest(action, payload, signal) {
  const r = await fetch("/api/wmed/academic", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-WMed-Request": "1" },
    body: JSON.stringify({ action, payload }),
    signal,
  });
  const d = await r.json();
  if (!r.ok) {
    const e = Error(d.error || "Não foi possível carregar.");
    e.status = r.status;
    throw e;
  }
  return d;
}
const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
function LibraryHead({ title, subtitle, children }) {
  return (
    <header className="module-heading">
      <span className="eyebrow blue">BIBLIOTECA WMED</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </header>
  );
}
export function Scores() {
  const [q, setQ] = useState(""),
    [area, setArea] = useState(""),
    [score, setScore] = useState(null),
    [answers, setAnswers] = useState({});
  const list = SCORES.filter(
    (s) =>
      (!area || s.especialidade === area) &&
      norm(s.nome + " " + s.sigla).includes(norm(q)),
  );
  const [calculator,setCalculator]=useState(null);
  const formulaList=calculators.filter(c=>(!area||c.area===area)&&norm(c.name).includes(norm(q)));
  const complete = score?.criterios.every((c) => answers[c.id] !== undefined);
  const total =
    score?.criterios.reduce((sum, c) => sum + (answers[c.id] || 0), 0) || 0;
  const band = complete
    ? score.faixas.find((f) => total >= f.min && total <= f.max)
    : null;
  if(calculator)return <Calculators key={calculator} id={calculator} onBack={()=>setCalculator(null)}/>;
  if (score)
    return (
      <section className="module-page">
        <button className="back-button" onClick={() => setScore(null)}>
          <ArrowLeft size={17} />
          Scores e calculadoras
        </button>
        <LibraryHead title={score.nome} subtitle={score.descricao} />
        <div className="calculator-layout">
          <div className="criteria-list">
            {score.criterios.map((c) => (
              <fieldset className="resource-card" key={c.id}>
                <legend>{c.pergunta}</legend>
                {(c.tipo === "checkbox"
                  ? [
                      { rotulo: "Não", valor: 0 },
                      { rotulo: "Sim", valor: c.valor || 0 },
                    ]
                  : c.opcoes
                ).map((o, i) => (
                  <label className="answer-option" key={i}>
                    <input
                      type="radio"
                      name={c.id}
                      checked={answers[c.id] === o.valor}
                      onChange={() =>
                        setAnswers((a) => ({ ...a, [c.id]: o.valor }))
                      }
                    />
                    {o.rotulo}
                    <small>{o.valor} pts</small>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
          <aside className="result-card">
            <span className="eyebrow">RESULTADO</span>
            <strong>{complete ? total : "—"}</strong>
            <p>
              {complete
                ? band?.texto || "Consulte a referência do instrumento."
                : "Responda a todos os critérios para calcular."}
            </p>
            <small>{score.observacao}</small>
            <details>
              <summary>Referência</summary>
              <p>
                {score.fonte ||
                  "Referência não informada no catálogo de origem."}
              </p>
            </details>
            <p className="module-note">
              Ferramenta de estudo. A soma não substitui avaliação clínica.
            </p>
            <button onClick={() => setAnswers({})}>Limpar respostas</button>
          </aside>
        </div>
      </section>
    );
  return (
    <section className="module-page">
      <LibraryHead
        title="Scores e calculadoras"
        subtitle={`${SCORES.length} scores e ${calculators.length} calculadoras. Busque pelo nome ou pela especialidade.`}
      />
      <div className="library-filters">
        <label>
          <Search size={18} />
          <input
            aria-label="Buscar score"
            placeholder="Glasgow, CHA₂DS₂-VASc…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select
          aria-label="Especialidade"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">Todas as especialidades</option>
          {[...new Set([...SCORES.map((s) => s.especialidade),...calculators.map(c=>c.area)])].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>
      {formulaList.length>0&&<><h2 className="library-section-title">Calculadoras por fórmula <small>{formulaList.length}</small></h2><div className="resource-grid">{formulaList.map(c=><button className="resource-card" key={c.id} onClick={()=>setCalculator(c.id)}><Calculator size={22}/><small>{c.area}</small><h3>{c.name}</h3><p>{c.summary}</p><span>Calcular ↗</span></button>)}</div></>}
      <h2 className="library-section-title">Scores por critérios <small>{list.length}</small></h2>
      <div className="resource-grid">
        {list.map((s) => (
          <button
            key={s.id}
            className="resource-card"
            onClick={() => {
              setScore(s);
              setAnswers({});
            }}
          >
            <Calculator size={22} />
            <small>{s.especialidade}</small>
            <h3>{s.nome}</h3>
            <p>{s.descricao}</p>
            <span>
              Calcular <ArrowUpRight size={16} />
            </span>
          </button>
        ))}
      </div>
      {!list.length&&!formulaList.length && <p>Nenhum instrumento encontrado.</p>}
    </section>
  );
}
export function ReferenceLibrary({ kind }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [q, setQ] = useState(""),
    [selected, setSelected] = useState(null),
    [group, setGroup] = useState(""),
    [limit, setLimit] = useState(30),
    [retry, setRetry] = useState(0);
  const meds = kind === "medicacoes";
  useEffect(() => {
    setSelected(null);
    setQ("");
    setGroup("");
    setLimit(30);
  }, [kind]);
  useEffect(() => {
    const c = new AbortController();
    setError("");
    Promise.all(
      ["cid10", "cid10-rico", "medicacoes"].map((n) =>
        fetch(`${import.meta.env.BASE_URL}dados/${n}.json`, {
          signal: c.signal,
        }).then((r) => {
          if (!r.ok) throw Error("Não foi possível carregar o acervo.");
          return r.json();
        }),
      ),
    )
      .then(([conditions, rich, medications]) =>
        setData({ conditions, rich, medications }),
      )
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => c.abort();
  }, [retry]);
  const rows = data ? (meds ? data.medications : data.conditions) : [];
  const list = rows.filter(
    (r) =>
      norm(meds ? `${r.n} ${r.cl} ${r.m}` : `${r.n} ${r.c}`).includes(
        norm(q),
      ) &&
      (!group || (meds ? r.areas.includes(group) : r.capNome === group)),
  );
  const groups = [
    ...new Set(rows.flatMap((r) => (meds ? r.areas : [r.capNome]))),
  ];
  const title = meds ? "Medicações" : "Condições";
  return (
    <section className="module-page">
      {selected ? (
        <>
          <button className="back-button" onClick={() => setSelected(null)}>
            <ArrowLeft size={16} />
            {title}
          </button>
          <LibraryHead
            title={selected.n}
            subtitle={meds ? selected.cl : `CID-10 · ${selected.c}`}
          />
          <article className="resource-card reading-card">
            {meds ? (
              <>
                <h3>Mecanismo de ação</h3>
                <p>{selected.m}</p>
                <h3>Condições relacionadas</h3>
                <ul>
                  {selected.trata.map((code) => (
                    <li key={code}>
                      {data.conditions.find((c) => c.c === code)?.n || code}
                    </li>
                  ))}
                </ul>
                <p className="module-note">
                  Material de estudo. Não inclui doses ou prescrição.
                </p>
              </>
            ) : (
              <>
                <h3>Sobre esta condição</h3>
                <p>
                  {data.rich[selected.c]?.d ||
                    "Descrição ampliada ainda não disponível no acervo."}
                </p>
                {data.rich[selected.c]?.s?.length > 0 && (
                  <>
                    <h3>Sinais e sintomas</h3>
                    <ul>
                      {data.rich[selected.c].s.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
                <h3>Medicações relacionadas no acervo</h3>
                <ul>
                  {data.medications
                    .filter((m) => m.trata.includes(selected.c))
                    .map((m) => (
                      <li key={m.n}>
                        {m.n} · {m.cl}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </article>
        </>
      ) : (
        <>
          <LibraryHead
            title={title}
            subtitle={
              meds
                ? "Classes, mecanismos e relações clínicas do acervo Vytal."
                : "Consulta por nome, código CID-10 e grupo clínico."
            }
          />
          <div className="library-filters">
            <label>
              <Search size={18} />
              <input
                aria-label={`Buscar ${title.toLowerCase()}`}
                placeholder={meds ? "Nome ou classe…" : "Nome ou CID-10…"}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setLimit(30);
                }}
              />
            </label>
            <select
              aria-label="Grupo clínico"
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
                setLimit(30);
              }}
            >
              <option value="">Todos os grupos</option>
              {groups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          {error ? (
            <p role="alert">
              {error}{" "}
              <button onClick={() => setRetry((x) => x + 1)}>
                Tentar novamente
              </button>
            </p>
          ) : !data ? (
            <p>Carregando biblioteca…</p>
          ) : (
            <>
              <p className="module-note">{list.length} resultados</p>
              <div className="resource-grid">
                {list.slice(0, limit).map((r) => (
                  <button
                    className="resource-card"
                    key={r.n}
                    onClick={() => setSelected(r)}
                  >
                    {meds ? <Pill size={22} /> : <BookOpen size={22} />}
                    <small>{meds ? r.cl : r.c}</small>
                    <h3>{r.n}</h3>
                    <span>
                      Abrir ficha <ArrowUpRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
              {!list.length && <p>Nenhum resultado encontrado.</p>}
              {limit < list.length && (
                <button
                  className="module-primary"
                  onClick={() => setLimit((n) => n + 30)}
                >
                  Mostrar mais
                </button>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
export {default as Images} from "./ImageLibrary";
