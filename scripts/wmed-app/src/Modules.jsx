import React, { lazy, Suspense, Component, useState } from "react";
import { t, msg, locale } from "./i18n";
import {
  Atom,
  Dna,
  Layers3,
  HeartPulse,
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
  ClipboardList,
  FlaskConical,
  GraduationCap,
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
const Enamed = lazy(() => import("./Enamed"));
const Usmle = lazy(() => import("./Usmle"));
const EcgCourse = lazy(() => import("./EcgCourse"));
const Genetics = lazy(() => import("./Genetics"));
const Molecular = lazy(() => import("./Molecular"));
const Microbiology = lazy(() => import("./Microbiology"));
const XrayLab = lazy(() => import("./XrayLab"));
const Questions = lazy(() => import("./Questions"));
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
    label: msg("Chat"),
    description: msg("Converse e pesquise"),
    icon: MessageCircle,
  },
  {
    id: "caso",
    label: msg("Caso clínico"),
    description: msg("Relato, feedback e aprendizado"),
    icon: FileText,
  },
  {
    id: "anatomia",
    label: msg("Anatomia"),
    description: msg("Sistemas e estruturas em 3D"),
    icon: Box,
  },
  {
    id: "histologia",
    label: msg("Histologia"),
    description: msg("Células, cortes e organelas"),
    icon: Microscope,
  },
  {id:"genetica",label: msg("Genética"),description: msg("Da célula à dupla hélice"),icon:Dna},
  {id:"molecular",label: msg("Biblioteca molecular"),description: msg("Moléculas, proteínas e enzimas em 3D"),icon:Atom},
  {id:"microbiologia",label: msg("Microbiologia"),description: msg("Bactérias, vírus, fungos e protozoários"),icon:Bug},
  {
    id: "radiologia",
    label: msg("Radiologia"),
    description: msg("Tomografia conectada ao 3D"),
    icon: ScanLine,
  },
  {id:"curso-ecg",label: msg("ECG em 10 passos"),description: msg("Curso, traçados e exercícios"),icon:HeartPulse},
  {id:"enamed",label: msg("Resumos ENAMED"),description: msg("Temas organizados por área"),icon:BookOpen},
  {id:"usmle",label: msg("Revisão USMLE"),description: msg("Resumos e flashcards em inglês"),icon:GraduationCap},
  {id:"flashcards",label: msg("Flashcards"),description: msg("Revisão ativa e repetição espaçada"),icon:Layers3},
  {id:"questoes",label: msg("Banco de questões"),description: msg("Provas, comentários e simulados"),icon:ClipboardList},
  {
    id: "scores",
    label: msg("Scores e calculadoras"),
    description: msg("Critérios e resultados"),
    icon: Calculator,
  },
  {
    id: "imagens",
    label: msg("Banco de imagens"),
    description: msg("Acervo com curadoria"),
    icon: Image,
  },
  {
    id: "medicacoes",
    label: msg("Medicações"),
    description: msg("Classes e mecanismos"),
    icon: Pill,
  },
  {
    id: "condicoes",
    label: msg("Condições"),
    description: msg("Biblioteca clínica e CID-10"),
    icon: BookOpen,
  },
  {id:"laboratorio",label: msg("Laboratório de ideias"),description: msg("Radiografia em 3D · protótipo"),icon:FlaskConical},
  {
    id: "evolucao",
    label: msg("Minha evolução"),
    description: msg("Qualidade dos seus relatos"),
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
        <h2>{t("Não foi possível abrir este módulo.")}</h2>
        <button onClick={() => location.reload()}>{t("Recarregar")}</button>
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
  onCasePending,
}) {
  const [openedCase, setOpenedCase] = useState(false);
  if (active === "caso" && !openedCase) setOpenedCase(true);
  return (
    <>
      <div hidden={active !== "caso"} className="module-container">
        {openedCase && (
          <Boundary key={caseKey}>
            <Suspense fallback={<p>{t("Preparando caso clínico…")}</p>}>
              <ClinicalCase
                active={active === "caso"}
                session={session}
                onLogin={onLogin}
                onProgress={onProgress}
                onPendingChange={onCasePending}
              />
            </Suspense>
          </Boundary>
        )}
      </div>
      {active !== "chat" && active !== "caso" && (
        <div className="module-container va-connected">
          <Boundary key={active}>
            <Suspense
              fallback={<p className="module-loading">{t("Abrindo biblioteca…")}</p>}
            >
              {active === "anatomia" ? (
                <Anatomy />
              ) : active === "histologia" ? (
                <Histology />
              ) : active === "genetica" ? (
                <Genetics />
              ) : active === "molecular" ? (
                <Molecular />
              ) : active === "microbiologia" ? (
                <Microbiology />
              ) : active === "radiologia" ? (
                <Radiology />
              ) : active === "questoes" ? (
                <Questions session={session} />
              ) : active === "curso-ecg" ? (
                <EcgCourse key={session?.user?.progressScope||"guest"} scope={session?.authenticated?session.user?.progressScope||"guest":"guest"}/>
              ) : active === "enamed" || active === "flashcards" ? (
                <Enamed key={`${active}:${session?.authenticated?session.user?.progressScope||"guest":"guest"}`} initialMode={active==="flashcards"?"cards":"summaries"} scope={session?.authenticated?session.user?.progressScope||"guest":"guest"}/>
              ) : active === "usmle" ? (
                <Usmle key={`usmle:${session?.authenticated?session.user?.progressScope||"guest":"guest"}`} scope={session?.authenticated?session.user?.progressScope||"guest":"guest"}/>
              ) : active === "scores" ? (
                <Scores />
              ) : active === "medicacoes" || active === "condicoes" ? (
                <ReferenceLibrary kind={active} />
              ) : active === "imagens" ? (
                <Images session={session} onLogin={onLogin} />
              ) : active === "laboratorio" ? (
                <XrayLab />
              ) : active === "evolucao" ? (
                <section className="module-page">
                  <header className="module-heading">
                    <span className="eyebrow blue">{t("APRENDER COM CADA CASO")}</span>
                    <h1>{t("Minha evolução")}</h1>
                    <p>
                      {t("Qualidade dos seus relatos. Acompanhe seu aprendizado, sem comparação pública.")}
                    </p>
                  </header>
                  {progress.length ? (
                    <>
                      <div className="quality-card">
                        <div>
                          <span>{t("Último relato")}</span>
                          <strong>
                            {progress.at(-1).score}
                            <small>/100</small>
                          </strong>
                          <p>{t("{n} avaliações neste navegador", { n: progress.length })}</p>
                        </div>
                      </div>
                      <div className="progress-achievement">
                        <TrendingUp size={20} />
                        {progress.length >= 5
                          ? t("Conquista: cinco relatos avaliados")
                          : t("Conquista: primeiro relato avaliado")}
                      </div>
                      <div className="resource-grid">
                        {progress.map((p, i) => (
                          <article className="resource-card" key={i}>
                            <small>{t("Avaliação {n}", { n: i + 1 })}</small>
                            <h2>{p.score}/100</h2>
                            <p>{new Date(p.date).toLocaleString(locale)}</p>
                          </article>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="resource-card">
                      <TrendingUp />
                      <h2>{t("Sua evolução começa com um caso.")}</h2>
                      <p>
                        {t("Envie seu primeiro relato e confira a avaliação da sua apresentação.")}
                      </p>
                      <a href="#caso" className="module-primary">
                        {t("Relatar um caso")}
                      </a>
                    </div>
                  )}
                  <p className="module-note">
                    {t("Somente notas e datas são salvas neste navegador, separadas por conta. Não há sincronização entre aparelhos. Pontuação experimental; não representa nota acadêmica ou competência profissional.")}
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
