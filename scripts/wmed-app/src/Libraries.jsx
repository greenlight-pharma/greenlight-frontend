import { matchesInstrument } from '../shared/instrument-search.mjs';
import {OfficialSourcesLink} from './doctor/OfficialSources';
import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
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
import {localizedCalculators} from "../shared/i18n/calculators.mjs";
import {useI18n, LibraryLanguageNotice} from "./doctor/I18n";
import {translate} from "../shared/i18n/catalog.mjs";
const SCORES=[...ORIGINAL_SCORES,...EXTRA_SCORES];
// Mesma rota, com resposta em SSE (feedback em partes). Erros antes do fluxo chegam como JSON.
export async function academicStream(action, payload, signal, onEvent) {
  const r = await fetch("/api/wmed/academic", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-WMed-Request": "1" },
    body: JSON.stringify({ action, payload: { ...payload, stream: true } }),
    signal,
  });
  if (!r.ok || !r.headers.get("content-type")?.includes("text/event-stream")) {
    let d = {};
    try { d = await r.json(); } catch {}
    const e = Error(d.error || "Não foi possível gerar o feedback.");
    e.status = r.status;
    throw e;
  }
  const reader = r.body.getReader(), decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r/g, "");
    let end;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const block = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      const event = block.split("\n").find((l) => l.startsWith("event:"))?.slice(6).trim();
      const data = block.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5)).join("\n");
      if (event && data) onEvent(event, JSON.parse(data));
    }
  }
}
// Fora do React: usa o idioma que o I18nProvider grava em <html lang>.
const uiLocale = () => (typeof document !== "undefined" && document.documentElement.lang) || "pt-BR";
export async function academicRequest(action, payload, signal) {
  const r = await fetch("/api/wmed/academic", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-WMed-Request": "1" },
    body: JSON.stringify({ action, payload }),
    signal,
  });
  const d = await r.json();
  if (!r.ok) {
    const e = Error(translate(uiLocale(), d.error || "Não foi possível carregar."));
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
  const { t } = useI18n();
  return (
    <header className="module-heading">
      <span className="eyebrow blue">{t("BIBLIOTECA WMED")}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </header>
  );
}
export function Scores() {
  const {locale,t}=useI18n();
  const compact = import.meta.env.VITE_PRODUCT === '2doctor';
  const [q, setQ] = useState(""),
    [area, setArea] = useState(""),
    [score, setScore] = useState(null),
    [answers, setAnswers] = useState({});
  const list = SCORES.filter(
    (s) =>
      (!area || s.especialidade === area) &&
      (compact ? matchesInstrument(q, s.nome, t(s.nome), s.sigla, s.especialidade, t(s.especialidade)) : norm(s.nome + " " + s.sigla).includes(norm(q))),
  );
  const [calculator,setCalculator]=useState(null);
  const position = useRef(null), navigation = useRef(null);
  const cards = useRef(new Map()), backButton = useRef(null);
  function openInstrument(key, choose) {
    if (compact) { position.current = { key, top: window.scrollY }; navigation.current = 'detail'; }
    choose();
  }
  function backToList() {
    if (compact) navigation.current = 'list';
    setScore(null);setCalculator(null);
  }
  useLayoutEffect(() => {
    if (!compact || !navigation.current) return;
    const destination = navigation.current;navigation.current = null;
    if (destination === 'detail') {
      backButton.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (position.current) {
      cards.current.get(position.current.key)?.focus({ preventScroll: true });
      window.scrollTo({ top: position.current.top, behavior: 'instant' });
    }
  }, [score, calculator, compact]);

  const formulaList=localizedCalculators(locale).filter(c=>{const original=calculators.find(o=>o.id===c.id);return (!area||original.area===area)&&(compact ? matchesInstrument(q,c.name,original.name,c.id,c.area,original.area) : norm(c.name+" "+original.name+" "+c.id).includes(norm(q)))});
  const complete = score?.criterios.every((c) => answers[c.id] !== undefined);
  const total =
    score?.criterios.reduce((sum, c) => sum + (answers[c.id] || 0), 0) || 0;
  const band = complete
    ? score.faixas.find((f) => total >= f.min && total <= f.max)
    : null;
  if(calculator)return <Calculators key={calculator} id={calculator} onBack={backToList} backRef={backButton}/>;
  if (score)
    return (
      <section className="module-page">
        <button ref={backButton} className="back-button" onClick={backToList}>
          <ArrowLeft size={17} />
          {t("Scores e calculadoras")}
        </button>
        <LibraryLanguageNotice />
        <LibraryHead title={t(score.nome)} subtitle={t(score.descricao)} />
        <div className="calculator-layout">
          <div className="criteria-list">
            {score.criterios.map((c) => (
              <fieldset className="resource-card" key={c.id}>
                <legend>{t(c.pergunta)}</legend>
                {(c.tipo === "checkbox"
                  ? [
                      { rotulo: t("Não"), valor: 0 },
                      { rotulo: t("Sim"), valor: c.valor || 0 },
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
                    {t(o.rotulo)}
                    <small>{o.valor} pts</small>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
          <aside className="result-card">
            <span className="eyebrow">{t("RESULTADO")}</span>
            <strong>{complete ? total : "—"}</strong>
            <p>
              {complete
                ? (band && t(band.texto)) || t("Consulte a referência do instrumento.")
                : t("Responda a todos os critérios para calcular.")}
            </p>
            <small>{score.observacao && t(score.observacao)}</small>
            <details>
              <summary>{t("Referência")}</summary>
              <p>
                {(score.fonte && t(score.fonte)) ||
                  t("Referência não informada no catálogo de origem.")}
              </p>
            </details>
            <p className="module-note">
              {t("Ferramenta de estudo. A soma não substitui avaliação clínica.")}
            </p>
            <button onClick={() => setAnswers({})}>{t("Limpar respostas")}</button>
          </aside>
        </div>
      </section>
    );
  return (
    <section className={`module-page${compact ? " scores-directory" : ""}`}>
      <header className="module-heading"><h1>{t('Scores e calculadoras')}</h1><p>{t('Busque pelo nome ou pela especialidade.')}</p></header>
      <div className="library-filters">
        <label>
          <Search size={18} />
          <input
            aria-label={t("Buscar score")}
            placeholder="Glasgow, CHA₂DS₂-VASc…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select
          aria-label={t("Especialidade")}
          value={area}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">{t("Todas as especialidades")}</option>
          {[...new Set([...SCORES.map((s) => s.especialidade),...calculators.map(c=>c.area)])].map((a) => (
            <option key={a} value={a}>{t(a)}</option>
          ))}
        </select>
      </div>
      {compact && (q || area) && <button className="back-button scores-reset" onClick={() => {setQ('');setArea('');}}>{t('Limpar filtros')}</button>}
      {formulaList.length>0&&<><h2 className="library-section-title">{t("Calculadoras por fórmula")} <small>{formulaList.length}</small></h2><div className="resource-grid">{formulaList.map(c=><button className="resource-card" key={c.id} ref={node => { if (node) cards.current.set(`formula:${c.id}`,node); else cards.current.delete(`formula:${c.id}`); }} onClick={()=>openInstrument(`formula:${c.id}`,()=>setCalculator(c.id))}><Calculator size={22}/><small>{c.area}</small><h3>{c.name}</h3><p>{c.summary}</p><span>{t("Calcular")} ↗</span></button>)}</div></>}
      <h2 className="library-section-title">{t("Scores por critérios")} <small>{list.length}</small></h2>
      {list.length>0&&<LibraryLanguageNotice />}
      <div className="resource-grid">
        {list.map((s) => (
          <button
            key={s.id}
            ref={node => { if (node) cards.current.set(`score:${s.id}`,node); else cards.current.delete(`score:${s.id}`); }}
            className="resource-card"
            onClick={() => openInstrument(`score:${s.id}`, () => {
              setScore(s);
              setAnswers({});
            })}
          >
            <Calculator size={22} />
            <small>{t(s.especialidade)}</small>
            <h3>{t(s.nome)}</h3>
            <p>{t(s.descricao)}</p>
            <span>
              {t("Calcular")} <ArrowUpRight size={16} />
            </span>
          </button>
        ))}
      </div>
      {!list.length&&!formulaList.length && <p>{t("Nenhum instrumento encontrado.")}</p>}
    </section>
  );
}
export function ReferenceLibrary({ kind }) {
  const { t, locale } = useI18n();
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [q, setQ] = useState(""),
    [selected, setSelected] = useState(null),
    [group, setGroup] = useState(""),
    [limit, setLimit] = useState(30),
    [retry, setRetry] = useState(0);
  const meds = kind === "medicacoes";
  const preserveLibraryPosition = import.meta.env.VITE_PRODUCT === "2doctor";
  const flexibleMedicationSearch = meds && preserveLibraryPosition;
  const listPosition = useRef(null);
  const navigation = useRef(null);
  const libraryCards = useRef(new Map());
  const libraryBack = useRef(null);
  useLayoutEffect(() => {
    if (!preserveLibraryPosition || !navigation.current) return;
    const destination = navigation.current;
    navigation.current = null;
    if (destination === "detail") {
      libraryBack.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (listPosition.current) {
      const { name, top } = listPosition.current;
      libraryCards.current.get(name)?.focus({ preventScroll: true });
      window.scrollTo({ top, behavior: "instant" });
    }
  }, [selected, preserveLibraryPosition]);
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
      .then(async ([conditions, rich, medications]) => {
        // Acervo traduzido (EN/ES): sobrepõe nome, descrição e sinais; os campos de
        // agrupamento (capítulo, áreas) seguem em PT e são traduzidos na exibição com t().
        const l = locale?.startsWith("en") ? "en" : locale?.startsWith("es") ? "es" : null;
        if (l) {
          const get = (n) => fetch(`${import.meta.env.BASE_URL}dados/i18n/${n}-${l}.json`, { signal: c.signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
          const [cidT, medT] = await Promise.all([get("cid10"), get("medicacoes")]);
          if (cidT) {
            conditions = conditions.map((r) => (cidT[r.c]?.n ? { ...r, pt: r.n, n: cidT[r.c].n } : r));
            rich = Object.fromEntries(Object.entries(rich).map(([k, v]) => [k, cidT[k]?.d ? { ...v, d: cidT[k].d, s: cidT[k].s || v.s } : v]));
          }
          if (Array.isArray(medT) && medT.length === medications.length)
            medications = medications.map((r, i) => ({ ...r, pt: r.n, n: medT[i].n || r.n, cl: medT[i].cl || r.cl, m: medT[i].m || r.m }));
        }
        setData({ conditions, rich, medications });
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => c.abort();
  }, [retry, locale]);
  const rows = data ? (meds ? data.medications : data.conditions) : [];
  const list = rows.filter(
    (r) =>
      (flexibleMedicationSearch ? matchesInstrument(q,`${r.n} ${r.pt || ""}`,r.cl,r.m) : norm(meds ? `${r.n} ${r.pt || ""} ${r.cl} ${r.m}` : `${r.n} ${r.pt || ""} ${r.c}`).includes(
        norm(q),
      )) &&
      (!group || (meds ? r.areas.includes(group) : r.capNome === group)),
  );
  const groups = [
    ...new Set(rows.flatMap((r) => (meds ? r.areas : [r.capNome]))),
  ];
  const title = meds ? t("Medicações") : t("Condições");
  return (
    <section className="module-page">
      {import.meta.env.VITE_PRODUCT==='2doctor' && <OfficialSourcesLink/>}
      {selected ? (
        <>
          <button className="back-button" ref={libraryBack} onClick={() => {
            if (preserveLibraryPosition) navigation.current = "list";
            setSelected(null);
          }}>
            <ArrowLeft size={16} />
            {title}
          </button>
          <LibraryHead
            title={selected.n}
            subtitle={meds ? selected.cl : `${t("CID-10")} · ${selected.c}`}
          />
          <article className="resource-card reading-card">
            {meds ? (
              <>
                <h3>{t("Mecanismo de ação")}</h3>
                <p>{selected.m}</p>
                <h3>{t("Condições relacionadas")}</h3>
                <ul>
                  {selected.trata.map((code) => (
                    <li key={code}>
                      {data.conditions.find((c) => c.c === code)?.n || code}
                    </li>
                  ))}
                </ul>
                <p className="module-note">
                  {t("Material de estudo. Não inclui doses ou prescrição.")}
                </p>
              </>
            ) : (
              <>
                <h3>{t("Sobre esta condição")}</h3>
                <p>
                  {data.rich[selected.c]?.d ||
                    t("Descrição ampliada ainda não disponível no acervo.")}
                </p>
                {data.rich[selected.c]?.s?.length > 0 && (
                  <>
                    <h3>{t("Sinais e sintomas")}</h3>
                    <ul>
                      {data.rich[selected.c].s.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
                <h3>{t("Medicações relacionadas no acervo")}</h3>
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
                ? t("Classes, mecanismos e relações clínicas do acervo Vytal.")
                : t("Consulta por nome, código CID-10 e grupo clínico.")
            }
          />
          <div className="library-filters">
            <label>
              <Search size={18} />
              <input
                aria-label={meds ? t("Buscar medicações") : t("Buscar condições")}
                placeholder={meds ? t("Nome ou classe…") : t("Nome ou CID-10…")}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setLimit(30);
                }}
              />
            </label>
            <select
              aria-label={t("Grupo clínico")}
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
                setLimit(30);
              }}
            >
              <option value="">{t("Todos os grupos")}</option>
              {groups.map((g) => (
                <option key={g} value={g}>{t(g)}</option>
              ))}
            </select>
          </div>
          {flexibleMedicationSearch && (q || group) && <button className="back-button scores-reset medication-reset" onClick={()=>{setQ("");setGroup("");setLimit(30);}}>{t("Limpar busca e filtros")}</button>}
          {error ? (
            <p role="alert">
              {t(error)}{" "}
              <button onClick={() => setRetry((x) => x + 1)}>
                {t("Tentar novamente")}
              </button>
            </p>
          ) : !data ? (
            <p>{t("Carregando biblioteca…")}</p>
          ) : (
            <>
              <p className="module-note" role={flexibleMedicationSearch ? "status" : undefined}>{list.length} {flexibleMedicationSearch && list.length===1 ? t("resultado") : t("resultados")}</p>
              <div className="resource-grid">
                {list.slice(0, limit).map((r) => (
                  <button
                    className="resource-card"
                    key={r.n}
                    ref={preserveLibraryPosition ? (node) => {
                      if (node) libraryCards.current.set(r.n, node);
                      else libraryCards.current.delete(r.n);
                    } : undefined}
                    onClick={() => {
                      if (preserveLibraryPosition) {
                        listPosition.current = { name: r.n, top: window.scrollY };
                        navigation.current = "detail";
                      }
                      setSelected(r);
                    }}
                  >
                    {meds ? <Pill size={22} /> : <BookOpen size={22} />}
                    <small>{meds ? r.cl : r.c}</small>
                    <h3>{r.n}</h3>
                    <span>
                      {t("Abrir ficha")} <ArrowUpRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
              {!list.length && <p>{flexibleMedicationSearch ? t("Nenhuma medicação encontrada com esta busca e estes filtros. Tente menos palavras ou limpe os filtros.") : t("Nenhum resultado encontrado.")}</p>}
              {limit < list.length && (
                <button
                  className="module-primary"
                  onClick={() => setLimit((n) => n + 30)}
                >
                  {t("Mostrar mais")}
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
