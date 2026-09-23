import { useEffect, useRef, useState, lazy, Suspense, Fragment } from "react";

import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Box,
  Layers3,
  Microscope,
  ScanLine,
  FolderOpen,
  Plus,
  MessageCircle,
  Sparkles,
  Search,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ChevronLeft,
  GraduationCap,
  Home,
  TrendingUp,
  Menu,
  X,
  LogOut,
  UserRound,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { drawSlice, loadVolume, type Volume } from "./volume";
import {useWorkspaceHeight} from "./useWorkspaceHeight";
import "./experience.css";
const Scene=lazy(()=>import("./Scene"));
const assets = "/wmed/acervo";
type Part = { id: string; title: string; appearance: string; function: string };
type Cell = {
  id: string;
  title: string;
  summary: string;
  systemID: string;
  baseUrl: string;
  parts: Part[];
  status: string;
};
type System = {
  id: string;
  rotulo: string;
  malhas: string[];
  estruturas: {
    no: string;
    nome: string;
    descricao: string;
    latim: string;
    temas?: string[];
  }[];
};
const systemNames: Record<string, string> = {
  digestorio: "Digestório",
  endocrino: "Endócrino",
  nervoso: "Nervoso",
  cardiovascular: "Cardiovascular",
  respiratorio: "Respiratório",
  urinario: "Urinário",
  muscular: "Muscular",
  "osseo-cartilaginoso": "Ósseo e cartilaginoso",
  tegumentar: "Tegumentar",
  "linfatico-hematopoetico": "Sangue e imunidade",
  "reprodutor-feminino": "Reprodutor feminino",
  "reprodutor-masculino": "Reprodutor masculino",
};
function useCatalog<T>(file: string) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const abort = new AbortController();
    fetch(`${assets}/${file}`, { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw Error("Não foi possível abrir o catálogo.");
        return r.json();
      })
      .then(rows => setData(rows.map(row => row.baseUrl ? {...row,baseUrl:row.baseUrl.replace("/academico-assets",assets)} : row)))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => abort.abort();
  }, [file]);
  return { data, error };
}
function Header({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="va-heading">
      <div>
        {eyebrow && <p className="va-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
export function Histology() {
  const workspace = useWorkspaceHeight();
  const [panel, setPanel] = useState<"library" | "detail" | null>(null);
  useEffect(() => {
    if(panel && window.innerWidth <= 900) requestAnimationFrame(() => workspace.current?.querySelector(`#studio-${panel}`)?.scrollIntoView({block:"nearest",behavior:"smooth"}));
  }, [panel]);
  const { data: cells, error } = useCatalog<Cell>("histology.json");
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("todos");
  const [id, setId] = useState("neuronio-multipolar");
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  const [isolate, setIsolate] = useState(false);
  const [rotate, setRotate] = useState(false);
  useEffect(() => { if(panel === "detail") workspace.current?.querySelector(".va-inspector")?.scrollTo({top:0}); }, [selected,panel]);
  const cell = cells.find((c) => c.id === id) || cells[0];
  const part = cell?.parts.find(
    (p) => `${p.id.replace(/-/g, "_")}_mesh` === selected,
  );
  const visible = cells.filter(
    (c) =>
      (system === "todos" || system === c.systemID) &&
      `${c.title} ${c.parts.map((p) => p.title).join(" ")}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  return (
    <div ref={workspace} className="va-page va-workbench va-focus-studio va-histology">
      <Header
        eyebrow="ATLAS DE HISTOLOGIA"
        title="Histologia 3D"
        subtitle="Explore a célula inteira, abra o corte e selecione uma estrutura."
      >
        <div className="va-studio-tools"><button className="va-button" aria-expanded={panel === "library"} aria-controls="studio-library" onClick={() => setPanel(panel === "library" ? null : "library")}><Microscope size={17}/>Trocar célula</button><button className="va-button" aria-expanded={panel === "detail"} aria-controls="studio-detail" onClick={() => setPanel(panel === "detail" ? null : "detail")}><BookOpen size={17}/>Função e estruturas</button></div>
      </Header>
      <div className={"va-studio-grid " + (panel ? "has-panel" : "")} onKeyDown={e => {if(e.key === "Escape") setPanel(null);}}>
        <aside id="studio-library" className="va-library" hidden={panel !== "library"}>
          <button className="va-panel-close" onClick={() => setPanel(null)} aria-label="Fechar biblioteca"><X size={18}/></button>
          <div className="va-library-head">
            <Microscope size={18} />
            <b>Biblioteca celular</b>
            <small>{cells.length}</small>
          </div>
          <label className="va-search">
            <Search size={16} />
            <input
              aria-label="Buscar célula ou organela"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Célula ou organela…"
            />
          </label>
          <select
            aria-label="Sistema histológico"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
          >
            <option value="todos">Todos os sistemas</option>
            {Object.entries(systemNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
          <div className="va-library-list">
            {visible.map((c) => (
              <button
                className={c.id === cell?.id ? "active" : ""}
                key={c.id}
                onClick={() => {
                  setId(c.id);
                  setPanel(null);
                  setSelected("");
                  setIsolate(false);
                }}
              >
                <span className="va-cell-dot" />
                <span>
                  {c.title}
                  <small>{systemNames[c.systemID]}</small>
                </span>
              </button>
            ))}
            {!visible.length && (
              <p className="va-empty">
                {error || "Nenhuma célula encontrada."}
              </p>
            )}
          </div>
        </aside>
        <section className="va-viewer">
          <div className="va-viewer-top">
            <span>
              <i /> MODELO INTERATIVO
            </span>
            <div className="va-segments">
              <button
                className={!open ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                Célula completa
              </button>
              <button
                className={open ? "active" : ""}
                onClick={() => setOpen(true)}
              >
                Abrir corte
              </button>
            </div>
          </div>
          <div className="va-viewer-title">
            <span>{systemNames[cell?.systemID]}</span>
            <h2>{cell?.title || "Histologia"}</h2>
          </div>
          <div className="va-3d-area">
            <Suspense fallback={<p>Carregando visualizador…</p>}>
              {cell && (
                <Scene
                  urls={[
                    `${cell.baseUrl}/${open ? "cutaway" : "complete"}.glb`,
                  ]}
                  selected={selected}
                  isolate={isolate}
                  rotate={rotate}
                  onSelect={value => {setSelected(value); if(value) setPanel("detail");}}
                />
              )}
            </Suspense>
          </div>
          <div className="va-viewer-bottom">
            <span>Ilustração didática · cores e escala ilustrativas</span>
            <button onClick={() => setRotate(!rotate)}>
              {rotate ? <Pause size={14} /> : <Play size={14} />}Giro automático
            </button>
          </div>
        </section>
        <aside id="studio-detail" className="va-inspector" hidden={panel !== "detail"}>
          <button className="va-panel-close" onClick={() => setPanel(null)} aria-label="Fechar detalhes"><X size={18}/></button>
          <p className="va-eyebrow">FUNÇÃO DA CÉLULA</p>
          <h3>{cell?.title}</h3>
          <p>{cell?.summary.split("Ilustração 3D")[0]}</p>
          {part && (
            <div className="va-part-detail">
              <h3>{part.title}</h3>
              <p>{part.function}</p>
              <p className="va-part-appearance">{part.appearance}</p>
              <button
                className="va-button"
                onClick={() => setIsolate(!isolate)}
              >
                {isolate ? "Mostrar a célula" : "Isolar estrutura"}
              </button>
            </div>
          )}
          <div className="va-divider" />
          <p className="va-eyebrow">ESTRUTURAS · {cell?.parts.length}</p>
          <div className="va-structure-list">
            {cell?.parts.map((p) => (
              <button
                className={part?.id === p.id ? "active" : ""}
                key={p.id}
                onClick={() => setSelected(`${p.id.replace(/-/g, "_")}_mesh`)}
              >
                <span />
                {p.title}
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
          <details className="va-provenance">
            <summary>Sobre este modelo</summary>
            <p>
              {cell?.status}. A revisão histológica e os testes no iPhone são
              etapas distintas desta prévia web.
            </p>
          </details>
        </aside>
      </div>
    </div>
  );
}
export function Anatomy() {
  const workspace = useWorkspaceHeight();
  const [panel, setPanel] = useState<"library" | "detail" | null>(null);
  useEffect(() => {
    if(panel && window.innerWidth <= 900) requestAnimationFrame(() => workspace.current?.querySelector(`#studio-${panel}`)?.scrollIntoView({block:"nearest",behavior:"smooth"}));
  }, [panel]);
  const { data: systems, error } = useCatalog<System>("atlas-catalog.json");
  const [id, setId] = useState("respiratorio");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [isolate, setIsolate] = useState(false);
  const [rotate, setRotate] = useState(false);
  useEffect(() => { if(panel === "detail") workspace.current?.querySelector(".va-inspector")?.scrollTo({top:0}); }, [selected,panel]);
  const system = systems.find((s) => s.id === id) || systems[0];
  const structure = system?.estruturas.find(
    (s) => s.no === selected || s.no.replace(/ /g, "_") === selected,
  );
  const list =
    system?.estruturas.filter((s) =>
      `${s.nome} ${s.latim}`.toLowerCase().includes(query.toLowerCase()),
    ) || [];
  return (
    <div ref={workspace} className="va-page va-workbench va-anatomy va-focus-studio">
      <Header
        eyebrow="ATLAS ANATÔMICO"
        title="Anatomia 3D"
        subtitle="Uma estrutura de cada vez. Uma visão do todo."
      >
        <div className="va-studio-tools"><button className="va-button" aria-expanded={panel === "library"} aria-controls="studio-library" onClick={() => setPanel(panel === "library" ? null : "library")}><Layers3 size={17}/>Sistemas do corpo</button><button className="va-button" aria-expanded={panel === "detail"} aria-controls="studio-detail" onClick={() => setPanel(panel === "detail" ? null : "detail")}><Search size={17}/>Estruturas e função</button></div>
      </Header>
      <div className={"va-studio-grid " + (panel ? "has-panel" : "")} onKeyDown={e => {if(e.key === "Escape") setPanel(null);}}>
        <aside id="studio-library" className="va-library" hidden={panel !== "library"}>
          <button className="va-panel-close" onClick={() => setPanel(null)} aria-label="Fechar biblioteca"><X size={18}/></button>
          <div className="va-library-head">
            <Box size={18} />
            <b>Sistemas do corpo</b>
          </div>
          <div className="va-library-list">
            {systems.map((s) => (
              <button
                key={s.id}
                className={system?.id === s.id ? "active" : ""}
                onClick={() => {
                  setId(s.id);
                  setPanel(null);
                  setSelected("");
                  setIsolate(false);
                }}
              >
                <Layers3 size={17} />
                <span>
                  {s.rotulo}
                  <small>{s.estruturas.length} estruturas</small>
                </span>
              </button>
            ))}
          </div>
          {error && <p role="alert">{error}</p>}
        </aside>
        <section className="va-viewer">
          <div className="va-viewer-top">
            <span>
              <i /> ATLAS ANATÔMICO
            </span>
            <button onClick={() => setRotate(!rotate)}>
              {rotate ? <Pause size={15} /> : <Play size={15} />}Giro
            </button>
          </div>
          <div className="va-viewer-title">
            <span>EXPLORAÇÃO POR SISTEMAS</span>
            <h2>{system?.rotulo}</h2>
          </div>
          <div className="va-3d-area">
            <Suspense fallback={<p>Abrindo atlas…</p>}>
              {system && (
                <Scene
                  urls={system.malhas.map((m) => `${assets}/${m}`)}
                  selected={selected}
                  isolate={isolate}
                  rotate={rotate}
                  onSelect={value => {setSelected(value); if(value) setPanel("detail");}}
                />
              )}
            </Suspense>
          </div>
          <div className="va-viewer-bottom">
            <a
              href={`${assets}/ATTRIBUTION.txt`}
              target="_blank"
              rel="noreferrer"
            >
              Z-Anatomy · CC BY-SA 4.0 ↗
            </a>
            <span>Acervo anatômico · versão web otimizada</span>
          </div>
        </section>
        <aside id="studio-detail" className="va-inspector" hidden={panel !== "detail"}>
          <button className="va-panel-close" onClick={() => setPanel(null)} aria-label="Fechar detalhes"><X size={18}/></button>
          <p className="va-eyebrow">RECONHECER E COMPREENDER</p>
          <h3>{structure?.nome || "Selecione uma estrutura"}</h3>
          {structure && <span className="va-selection-key"><i/>Selecionada em dourado</span>}
          <p>
            {structure?.descricao ||
              "Clique no modelo ou use a lista para explorar as estruturas do sistema."}
          </p>
          {structure?.latim && (
            <p>
              <em>{structure.latim}</em>
            </p>
          )}
          {!!structure?.temas?.length && (
            <div className="va-study-links">
              <p className="va-eyebrow">CONECTAR AO ESTUDO</p>
              {structure.temas.map((tema) => (
                <a
                  key={tema}
                  href={`#chat?tema=${encodeURIComponent(tema)}`}
                >
                  {tema}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          )}
          {selected && (
            <button className="va-button" onClick={() => setIsolate(!isolate)}>
              {isolate ? "Mostrar sistema" : "Isolar estrutura"}
            </button>
          )}
          <div className="va-divider" />
          <label className="va-search">
            <Search size={16} />
            <input
              placeholder="Nome ou termo em latim"
              aria-label="Buscar estrutura anatômica"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="va-structure-list">
            {list.map((s) => (
              <button
                key={s.no}
                className={structure?.no === s.no ? "active" : ""}
                onClick={() => setSelected(s.no)}
              >
                <span />
                {s.nome}
              </button>
            ))}
            {!list.length && <p>Nenhuma estrutura encontrada.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
export function Radiology() {
  const [region, setRegion] = useState("torax");
  const [volume, setVolume] = useState<Volume>();
  const [error, setError] = useState("");
  const [fraction, setFraction] = useState(0.52);
  const [window, setWindow] = useState("moles");
  const [opacity, setOpacity] = useState(0.26);
  const [selected, setSelected] = useState(0);
  const [rotate, setRotate] = useState(false);
  const [play, setPlay] = useState(false);
  const [cinema, setCinema] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const workspace = useWorkspaceHeight(cinema);
  // Keep the actual canvas box fitted to the physical image ratio. This also
  // keeps pointer-to-voxel coordinates correct (no letterboxing inside canvas).
  useEffect(() => {
    const el = canvas.current;
    if (!el || !volume || !el.parentElement) return;
    const ratio = volume.meta.dims[0] * volume.meta.spacing[0] /
      (volume.meta.dims[1] * volume.meta.spacing[1]);
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.min(entry.contentRect.width, entry.contentRect.height * ratio);
      el.style.width = `${Math.max(0, width)}px`;
      el.style.height = `${Math.max(0, width / ratio)}px`;
    });
    observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [volume]);
  useEffect(() => {
    const abort = new AbortController();
    setVolume(undefined);
    setError("");
    setSelected(0);
    setPlay(false);
    loadVolume(region, abort.signal)
      .then((v) => {
        if (!abort.signal.aborted) setVolume(v);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => abort.abort();
  }, [region]);
  useEffect(() => {
    if (volume && canvas.current)
      drawSlice(canvas.current, volume, fraction, window, selected);
  }, [volume, fraction, window, selected]);
  useEffect(() => {
    if (!play) return;
    const timer = globalThis.setInterval(
      () => setFraction((n) => (n > 0.87 ? 0.15 : n + 0.003)),
      70,
    );
    return () => clearInterval(timer);
  }, [play]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCinema(false);
    };
    globalThis.addEventListener("keydown", escape);
    return () => globalThis.removeEventListener("keydown", escape);
  }, []);
  const label = volume?.meta.estruturas.find((s) => s.id === selected);
  const total = volume?.meta.dims[2] || 1;
  return (
    <div ref={workspace} className={"va-page va-radiology " + (cinema ? "va-cinema" : "")}>
      <Header
        title="Radiologia imersiva"
      >
        <button className="va-button" onClick={() => setCinema(!cinema)}>
          {cinema ? <Minimize2 size={17} /> : <Maximize2 size={17} />}{" "}
          {cinema ? "Sair da apresentação" : "Modo apresentação"}
        </button>
      </Header>
      <div className="va-radiology-toolbar">
        <div className="va-segments">
          {[
            ["torax", "Tórax"],
            ["abdome", "Abdome e pelve"],
            ["cabeca", "Cabeça e pescoço"],
          ].map(([key, text]) => (
            <button
              key={key}
              className={region === key ? "active" : ""}
              onClick={() => setRegion(key)}
            >
              {text}
            </button>
          ))}
        </div>
        <span>
          <i /> TC REAL DO ACERVO
        </span>
      </div>
      <div className="va-radiology-grid">
        <section className="va-volume-panel">
          <div className="va-viewer-top">
            <span>01 / CONTEXTO TRIDIMENSIONAL</span>
            <button onClick={() => setRotate(!rotate)}>
              {rotate ? <Pause size={14} /> : <Play size={14} />}Girar
            </button>
          </div>
          <div className="va-volume-canvas">
            {volume ? (
              <Suspense fallback={<p>Preparando a reconstrução…</p>}>
                <Scene
                  volume={volume}
                  slice={fraction}
                  window={window}
                  opacity={opacity}
                  rotate={rotate}
                />
              </Suspense>
            ) : (
              <div className="va-loading" role="status">
                {error || "Abrindo o exame real…"}
              </div>
            )}
          </div>
          <div className="va-volume-legend">
            <span />
            <p>
              Reconstrução das segmentações do próprio exame.
              <br />
              Superfícies amostradas · protótipo de visualização.
            </p>
          </div>
        </section>
        <section className="va-slice-panel">
          <div className="va-viewer-top">
            <span>02 / TOMOGRAFIA AXIAL</span>
            <b>
              {Math.round(fraction * (total - 1)) + 1}
              <small> / {total}</small>
            </b>
          </div>
          <div className="va-slice-image">
            <span className="va-direction anterior">A</span>
            <span className="va-direction right">D</span>
            <span className="va-direction left">E</span>
            <span className="va-direction posterior">P</span>
            <canvas
              ref={canvas}
              aria-label="Corte axial da tomografia; clique para identificar uma estrutura"
              style={
                volume
                  ? {
                      aspectRatio: `${volume.meta.dims[0] * volume.meta.spacing[0]} / ${volume.meta.dims[1] * volume.meta.spacing[1]}`,
                    }
                  : {}
              }
              onClick={(e) => {
                if (!volume) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const [nx, ny, nz] = volume.meta.dims;
                const x = Math.min(
                  nx - 1,
                  Math.floor(((e.clientX - rect.left) / rect.width) * nx),
                );
                const y = Math.min(
                  ny - 1,
                  Math.floor(((e.clientY - rect.top) / rect.height) * ny),
                );
                setSelected(
                  volume.labels[
                    x + nx * (y + ny * Math.round(fraction * (nz - 1)))
                  ],
                );
              }}
            />
          </div>
          <div className="va-slice-caption">
            <span>{label ? "ESTRUTURA IDENTIFICADA" : "ESTUDO DO CORTE"}</span>
            <h3>{label?.nome || "Toque na TC para identificar"}</h3>
            <p>
              {label
                ? "Identificação pelos rótulos do conjunto original."
                : "Navegue pelos cortes e reconheça as estruturas."}
            </p>
          </div>
        </section>
      </div>
      <div className="va-timeline">
        <button
          aria-label={play ? "Pausar cortes" : "Reproduzir cortes"}
          disabled={!volume}
          onClick={() => setPlay(!play)}
        >
          {play ? <Pause /> : <Play />}
        </button>
        <div>
          <label htmlFor="slice">
            Nível do corte <span>{Math.round(fraction * 100)}% do volume</span>
          </label>
          <input
            id="slice"
            type="range"
            min="0"
            max="1"
            step=".001"
            value={fraction}
            onChange={(e) => {
              setPlay(false);
              setFraction(+e.target.value);
            }}
          />
        </div>
        <label className="va-window">
          Janela
          <select value={window} onChange={(e) => setWindow(e.target.value)}>
            <option value="moles">Tecidos moles</option>
            <option value="pulmonar">Pulmonar</option>
            <option value="ossea">Óssea</option>
          </select>
        </label>
        <label className="va-opacity">
          Contexto 3D
          <input
            type="range"
            min=".04"
            max=".85"
            step=".01"
            aria-label="Opacidade da reconstrução"
            value={opacity}
            onChange={(e) => setOpacity(+e.target.value)}
          />
        </label>
      </div>
      <div className="va-science-note">
        <ShieldCheck size={16} />
        <span>
          Exame público de ensino · TotalSegmentator, CC BY 4.0. Os três
          recortes pertencem ao mesmo exame.{" "}
          <a
            href={`${assets}/radiology-sources.txt`}
            target="_blank"
            rel="noreferrer"
          >
            Fontes e preparação ↗
          </a>
        </span>
      </div>
    </div>
  );
}
