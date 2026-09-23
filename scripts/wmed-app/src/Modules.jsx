import React, { lazy, Suspense, Component, useState } from "react";
import {
  MessageCircle,
  FileText,
  Box,
  Microscope,
  Bug,
  ScanLine,
  Calculator,
  Image,
  Pill,
  BookOpen,
  TrendingUp,
} from "lucide-react";
const Anatomy = lazy(() =>
  import("./academic/Experience").then((m) => ({ default: m.Anatomy })),
);
const Histology = lazy(() =>
  import("./academic/Experience").then((m) => ({ default: m.Histology })),
);
const Radiology = lazy(() =>
  import("./academic/Experience").then((m) => ({ default: m.Radiology })),
);
const Microbiology = lazy(() => import("./Microbiology"));
const ClinicalCase = lazy(() => import("./ClinicalCase"));
const Scores = lazy(() =>
  import("./Libraries").then((m) => ({ default: m.Scores })),
);
const ReferenceLibrary = lazy(() =>
  import("./Libraries").then((m) => ({ default: m.ReferenceLibrary })),
);
const Images = lazy(() =>
  import("./Libraries").then((m) => ({ default: m.Images })),
);
export const moduleItems = [
  {
    id: "chat",
    label: "Chat com IA",
    description: "Converse e pesquise",
    icon: MessageCircle,
  },
  {
    id: "caso",
    label: "Caso clínico",
    description: "Relato, feedback e aprendizado",
    icon: FileText,
  },
  {
    id: "anatomia",
    label: "Anatomia",
    description: "Sistemas e estruturas em 3D",
    icon: Box,
  },
  {
    id: "histologia",
    label: "Histologia",
    description: "Células, cortes e organelas",
    icon: Microscope,
  },
  {id:"microbiologia",label:"Microbiologia",description:"Bactérias, vírus, fungos e protozoários",icon:Bug},
  {
    id: "radiologia",
    label: "Radiologia",
    description: "Tomografia conectada ao 3D",
    icon: ScanLine,
  },
  {
    id: "scores",
    label: "Scores e calculadoras",
    description: "Critérios e resultados",
    icon: Calculator,
  },
  {
    id: "imagens",
    label: "Banco de imagens",
    description: "Acervo com curadoria",
    icon: Image,
  },
  {
    id: "medicacoes",
    label: "Medicações",
    description: "Classes e mecanismos",
    icon: Pill,
  },
  {
    id: "condicoes",
    label: "Condições",
    description: "Biblioteca clínica e CID-10",
    icon: BookOpen,
  },
  {
    id: "evolucao",
    label: "Minha evolução",
    description: "Qualidade dos seus relatos",
    icon: TrendingUp,
  },
];
class Boundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="module-page">
        <h2>Não foi possível abrir este módulo.</h2>
        <button onClick={() => location.reload()}>Recarregar</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function Modules({
  active,
  session,
  onLogin,
  progress,
  caseKey,
  onProgress,
}) {
  const [openedCase, setOpenedCase] = useState(false);
  if (active === "caso" && !openedCase) setOpenedCase(true);
  return (
    <>
      <div hidden={active !== "caso"} className="module-container">
        {openedCase && (
          <Boundary key={caseKey}>
            <Suspense fallback={<p>Preparando caso clínico…</p>}>
              <ClinicalCase
                active={active === "caso"}
                session={session}
                onLogin={onLogin}
                onProgress={onProgress}
              />
            </Suspense>
          </Boundary>
        )}
      </div>
      {active !== "chat" && active !== "caso" && (
        <div className="module-container va-connected">
          <Boundary key={active}>
            <Suspense
              fallback={<p className="module-loading">Abrindo biblioteca…</p>}
            >
              {active === "anatomia" ? (
                <Anatomy />
              ) : active === "histologia" ? (
                <Histology />
              ) : active === "microbiologia" ? (
                <Microbiology />
              ) : active === "radiologia" ? (
                <Radiology />
              ) : active === "scores" ? (
                <Scores />
              ) : active === "medicacoes" || active === "condicoes" ? (
                <ReferenceLibrary kind={active} />
              ) : active === "imagens" ? (
                <Images session={session} onLogin={onLogin} />
              ) : active === "evolucao" ? (
                <section className="module-page">
                  <header className="module-heading">
                    <span className="eyebrow blue">APRENDER COM CADA CASO</span>
                    <h1>Minha evolução</h1>
                    <p>
                      Qualidade dos seus relatos. Acompanhe seu aprendizado, sem
                      comparação pública.
                    </p>
                  </header>
                  {progress.length ? (
                    <>
                      <div className="quality-card">
                        <div>
                          <span>Último relato</span>
                          <strong>
                            {progress.at(-1).score}
                            <small>/100</small>
                          </strong>
                          <p>{progress.length} avaliações neste navegador</p>
                        </div>
                      </div>
                      <div className="progress-achievement">
                        <TrendingUp size={20} />
                        {progress.length >= 5
                          ? "Conquista: cinco relatos avaliados"
                          : "Conquista: primeiro relato avaliado"}
                      </div>
                      <div className="resource-grid">
                        {progress.map((p, i) => (
                          <article className="resource-card" key={i}>
                            <small>Avaliação {i + 1}</small>
                            <h2>{p.score}/100</h2>
                            <p>{new Date(p.date).toLocaleString("pt-BR")}</p>
                          </article>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="resource-card">
                      <TrendingUp />
                      <h2>Sua evolução começa com um caso.</h2>
                      <p>
                        Envie seu primeiro relato e confira a avaliação da sua
                        apresentação.
                      </p>
                      <a href="#caso" className="module-primary">
                        Relatar um caso
                      </a>
                    </div>
                  )}
                  <p className="module-note">
                    Somente notas e datas são salvas neste navegador, separadas
                    por conta. Não há sincronização entre aparelhos. Pontuação
                    experimental; não representa nota acadêmica ou competência
                    profissional.
                  </p>
                </section>
              ) : null}
            </Suspense>
          </Boundary>
        </div>
      )}
    </>
  );
}
