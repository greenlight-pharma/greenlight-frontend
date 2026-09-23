import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  TrendingUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { academicRequest } from "./Libraries";
import PrivacyReview from "./PrivacyReview";
import { detectAcademicPII } from "../shared/pii.mjs";
import { fields, rubric, feedbackPayload } from "../shared/case-contract.mjs";
const empty = () => Object.fromEntries(fields.map(([k]) => [k, ""]));
const labels = {
  resumo_caso: "Resumo do caso",
  red_flags_educacionais: "Sinais de alerta",
  pontos_de_atencao: "Pontos de atenção",
  hipoteses_para_discussao: "Hipóteses para discussão",
  comparacao_hipoteses_aluno: "Suas hipóteses em discussão",
  alinhamento_hipoteses_didatico: "Alinhamento das hipóteses",
  elementos_de_manejo_academico: "Manejo para discussão",
  comparacao_conduta_aluno: "Sua conduta em discussão",
  alinhamento_conduta_didatico: "Alinhamento da conduta",
  pontos_fortes: "Pontos fortes",
  pontos_a_aprofundar: "Seu aprendizado",
  analise_anamnese: "Anamnese",
  analise_exame_fisico: "Exame físico",
  conexao_enamed: "Conexão ENAMED",
  exames_para_discussao_academica: "Exames para discussão",
  temas_de_estudo: "Temas para estudar",
  perguntas_ao_preceptor: "Perguntas ao preceptor",
  referencias: "Referências",
  hipotese: "Hipótese",
  justificativa: "Justificativa",
  probabilidade_didatica: "Probabilidade",
  sinal: "Sinal",
  justificativa_didatica: "Por que observar",
  exame: "Exame",
  aspectos_bem_explorados: "Bem explorado",
  temas_a_aprofundar: "Para aprofundar",
  eixos_tematicos: "Eixos temáticos",
  como_e_cobrado: "Como é cobrado",
  foco_para_prova: "Foco para a prova",
};
const groups = [
  [
    "Raciocínio",
    [
      "resumo_caso",
      "red_flags_educacionais",
      "pontos_de_atencao",
      "hipoteses_para_discussao",
      "exames_para_discussao_academica",
      "elementos_de_manejo_academico",
    ],
  ],
  ["Semiologia", ["analise_anamnese", "analise_exame_fisico"]],
  ["Estudo", ["conexao_enamed", "temas_de_estudo", "referencias"]],
  [
    "Seu aprendizado",
    [
      "pontos_fortes",
      "pontos_a_aprofundar",
      "comparacao_hipoteses_aluno",
      "alinhamento_hipoteses_didatico",
      "comparacao_conduta_aluno",
      "alinhamento_conduta_didatico",
      "perguntas_ao_preceptor",
    ],
  ],
];
function Value({ value }) {
  if (value == null || value === "") return <p>Não informado.</p>;
  if (Array.isArray(value))
    return (
      <div className="feedback-items">
        {value.map((v, i) => (
          <div key={i}>
            <Value value={v} />
          </div>
        ))}
      </div>
    );
  if (typeof value === "object")
    return (
      <dl>
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <dt>{labels[k] || k.replaceAll("_", " ")}</dt>
            <dd>
              {k === "probabilidade_didatica" ? (
                <span className={"probability " + String(v).toLowerCase()}>
                  {String(v)}
                </span>
              ) : (
                <Value value={v} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: () => null,
        a: ({ href, children }) =>
          /^https:\/\//.test(href || "") ? (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ) : (
            <span>{children}</span>
          ),
      }}
    >
      {String(value)}
    </ReactMarkdown>
  );
}
export default function ClinicalCase({ session, onLogin, onProgress, active, initialStory = "" }) {
  const [stage, setStage] = useState("relato"),
    [relato, setRelato] = useState(initialStory),
    [form, setForm] = useState(empty),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [feedback, setFeedback] = useState(null),
    [quality, setQuality] = useState(null),
    [qualityError, setQualityError] = useState(""),
    [tab, setTab] = useState(0),
    [recording, setRecording] = useState(false),
    [seconds, setSeconds] = useState(0);
  const [privacyOpen,setPrivacyOpen]=useState(false);
  const recorder = useRef(null),
    stream = useRef(null),
    cancel = useRef(null),
    alive = useRef(true),
    chunks = useRef([]),
    recordTimer = useRef(null),
    reported = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      cancel.current?.abort();
      clearInterval(recordTimer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  useEffect(() => {
    if (!active && recorder.current?.state === "recording")
      recorder.current.stop();
  }, [active]);
  const requireLogin = () => {
    if (session?.authenticated) return true;
    onLogin();
    return false;
  };
  async function request(action, payload) {
    const c = new AbortController();
    cancel.current = c;
    return academicRequest(action, payload, c.signal);
  }
  async function structure() {
    if (detectAcademicPII(relato)) {
      setError(
        "Remova os dados que identificam o paciente antes de continuar.",
      );
      return;
    }
    if (!requireLogin()) return;
    setBusy("Organizando o relato…");
    setError("");
    try {
      const d = await request("structure", { relato });
      if (d.erro_pii) throw Error(d.erro_pii);
      if (!d.campos || typeof d.campos !== "object")
        throw Error("Não foi possível organizar o relato.");
      const values = empty();
      for (const [k] of fields)
        values[k] = typeof d.campos[k] === "string" ? d.campos[k] : "";
      setForm(values);
      setStage("revisao");
      setConfirmed(false);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setBusy("");
    }
  }
  async function transcribe(blob) {
    if (!alive.current) return;
    if (blob.size > 2900000) {
      setError("O áudio deve ter até 2,9 MB. Grave um trecho menor.");
      return;
    }
    setBusy("Transcrevendo áudio…");
    setError("");
    try {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
      const rawType = (blob.type || "audio/mp4").split(";")[0];
      const type = ({"audio/x-m4a":"audio/m4a","audio/x-wav":"audio/wav"})[rawType] || rawType;
      if(!["audio/mp4","audio/m4a","audio/webm","audio/mpeg","audio/wav","audio/ogg"].includes(type))throw Error("Use áudio M4A, MP4, MP3, WAV, OGG ou WebM.");
      const d = await request("transcribe", {
        audioBase64: base64,
        mimeType: type,
      });
      if (!d.texto)
        throw Error("Não encontramos fala no áudio. Tente novamente.");
      if (alive.current) setRelato((old) => (old ? old + "\n" : "") + d.texto);
    } catch (e) {
      if (alive.current && e.name !== "AbortError") setError(e.message);
    } finally {
      if (alive.current) setBusy("");
    }
  }
  async function record() {
    if (!requireLogin()) return;
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia || !globalThis.MediaRecorder)
        throw Error(
          "Gravação indisponível neste navegador. Envie um arquivo de áudio.",
        );
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (!alive.current) {
        stream.current.getTracks().forEach((t) => t.stop());
        return;
      }
      const mime = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find(
        (t) => MediaRecorder.isTypeSupported(t),
      );
      const r = new MediaRecorder(stream.current, {
        ...(mime ? { mimeType: mime } : {}),
        audioBitsPerSecond: 64000,
      });
      recorder.current = r;
      chunks.current = [];
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      r.onstop = () => {
        clearInterval(recordTimer.current);
        stream.current?.getTracks().forEach((t) => t.stop());
        if (alive.current) {
          setRecording(false);
          transcribe(new Blob(chunks.current, { type: r.mimeType }));
        }
      };
      r.start(1000);
      setSeconds(0);
      setRecording(true);
      const start = Date.now();
      recordTimer.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setSeconds(elapsed);
        if (elapsed >= 180 && r.state === "recording") r.stop();
      }, 1000);
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop());
      setError(
        e.name === "NotAllowedError"
          ? "Microfone não autorizado. Você pode escrever ou enviar um áudio."
          : e.message,
      );
    }
  }
  async function grade() {
    setQualityError("");
    try {
      const d = await academicRequest("quality", { fields: form, relato });
      if (alive.current) {
        setQuality(d);
        if (!reported.current) {
          reported.current = true;
          onProgress(d.score);
        }
      }
    } catch (e) {
      if (alive.current) setQualityError(e.message);
    }
  }
  async function evaluate() {
    if (!requireLogin()) return;
    setBusy("Preparando seu feedback completo…");
    setError("");
    setQuality(null);
    setQualityError("");
    reported.current = false;
    try {
      const d = await request("feedback", { fields: form, relato });
      if (
        !d.feedback ||
        typeof d.feedback !== "object" ||
        !Object.keys(d.feedback).length
      )
        throw Error("O serviço não retornou um feedback completo.");
      if (d.feedback.erro_pii) throw Error(d.feedback.erro_pii);
      setFeedback(d.feedback);
      setStage("feedback");
      setTab(0);
      setBusy("Avaliando a qualidade do relato…");
      await grade();
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setBusy("");
    }
  }
  const feedbackLength =
    feedbackPayload(form).clinicalHistory.length +
    "\nRelato original para contexto: ".length +
    relato.length;
  const known = new Set(groups.flatMap((g) => g[1]));
  const extras = feedback
    ? Object.keys(feedback).filter((k) => !known.has(k) && k !== "erro_pii")
    : [];
  return (
    <section className="module-page case-page">
      {privacyOpen&&<PrivacyReview text={relato} onCancel={()=>setPrivacyOpen(false)} onApply={text=>{setRelato(text);setConfirmed(false);setPrivacyOpen(false)}}/>}
      <header className="module-heading">
        <span className="eyebrow blue">PRÁTICA CLÍNICA</span>
        <h1>Caso clínico</h1>
        <p>
          Conte com suas palavras. Entenda seu raciocínio. Aprenda com o
          feedback.
        </p>
      </header>
      <nav className="case-steps" aria-label="Etapas do caso">
        {["Seu relato", "Revisão", "Feedback"].map((s, i) => (
          <span
            className={
              ["relato", "revisao", "feedback"][i] === stage ? "active" : ""
            }
            key={s}
          >
            <b>{i + 1}</b>
            {s}
          </span>
        ))}
      </nav>
      {stage === "relato" && (
        <div className="case-entry">
          <div className="resource-card">
            <label className="field-label" htmlFor="case-story">
              Relato livre
            </label>
            <textarea
              id="case-story"
              rows={12}
              maxLength={5000}
              value={relato}
              disabled={!!busy || recording}
              onChange={(e) => {setRelato(e.target.value);setConfirmed(false)}}
              placeholder="Descreva o contexto, a história, o exame, suas hipóteses e o que faria. Não inclua nome, CPF, telefone ou endereço do paciente."
            />
            <div className="voice-actions">
              <button
                disabled={!!busy}
                onClick={recording ? () => recorder.current.stop() : record}
              >
                {recording ? <Square size={17} /> : <Mic size={17} />}{" "}
                {recording ? `Parar · ${seconds}s` : "Gravar relato"}
              </button>
              <label className="audio-upload">
                <Upload size={17} />
                Enviar áudio
                <input
                  type="file"
                  accept="audio/*,.m4a"
                  disabled={!!busy || recording}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f && requireLogin()) transcribe(f);
                  }}
                />
              </label>
              <small>{relato.length}/5.000</small>
            </div>
            <p className="module-note">
              Áudio de até 3 minutos ou 2,9 MB. Revise a transcrição antes de
              continuar. Não grave a voz do paciente.
            </p>
            <button disabled={!!busy||recording||!relato.trim()} onClick={()=>setPrivacyOpen(true)}>Revisar dados pessoais</button>
            <label className="confirm-row">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              Revisei o texto e removi os dados que identificam o paciente.
            </label>
            <button
              className="module-primary"
              disabled={
                !!busy ||
                recording ||
                relato.trim().length < 20 ||
                relato.length > 5000 ||
                !confirmed
              }
              onClick={structure}
            >
              Organizar meu relato <ArrowRight size={17} />
            </button>
          </div>
          <aside className="case-guide">
            <FileText size={27} />
            <h2>Do relato ao aprendizado</h2>
            <p>
              Você não precisa preencher tudo de início. A IA organiza o que foi
              informado.
            </p>
            <ol>
              <li>Conte o caso por texto ou voz.</li>
              <li>Confira os campos e corrija o que precisar.</li>
              <li>Veja o feedback e a qualidade do relato.</li>
            </ol>
            <p className="module-note">
              A nota é experimental e avalia o relato, não sua competência
              médica. Sem ranking público nesta etapa.
            </p>
          </aside>
        </div>
      )}
      {stage === "revisao" && (
        <>
          <button
            className="back-button"
            disabled={!!busy}
            onClick={() => setStage("relato")}
          >
            <ArrowLeft size={17} />
            Voltar ao relato
          </button>
          <details className="resource-card">
            <summary>Conferir relato original</summary>
            <p>{relato}</p>
          </details>
          <p className="module-note">
            Abra apenas os campos que quiser corrigir. Confira especialmente os
            nomes de medicamentos e os valores transcritos. Campos vazios serão
            tratados como não informados.
          </p>
          <div className="review-fields">
            {fields.map(([k, l]) => (
              <details key={k} className="resource-card review-field">
                <summary>
                  <b>{l}</b>
                  <span>{form[k] || "Não informado"}</span>
                </summary>
                <label className="field-label" htmlFor={"review-" + k}>
                  Revisar {l.toLowerCase()}
                </label>
                <textarea
                  id={"review-" + k}
                  rows={k === "hma" ? 5 : 3}
                  value={form[k]}
                  maxLength={5000}
                  disabled={!!busy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [k]: e.target.value }))
                  }
                  placeholder="Não informado"
                />
              </details>
            ))}
          </div>
          <label className="confirm-row">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Conferi os campos. Eles representam meu relato e meu próprio
            raciocínio.
          </label>
          <p className="module-note">
            História e contexto para análise: {feedbackLength}/5.000 caracteres.
            {feedbackLength > 5000
              ? " Resuma os campos repetidos antes de continuar."
              : ""}
          </p>
          <button
            className="module-primary"
            disabled={
              !!busy ||
              feedbackLength > 5000 ||
              !confirmed ||
              form.hma.trim().length < 20 ||
              form.queixaPrincipal.trim().length < 3
            }
            onClick={evaluate}
          >
            Receber feedback <ArrowRight size={17} />
          </button>
        </>
      )}
      {stage === "feedback" && feedback && (
        <>
          <div className="feedback-top">
            <div className="quality-card">
              <div>
                <span className="eyebrow">
                  QUALIDADE DO RELATO · EXPERIMENTAL
                </span>
                <strong>
                  {quality ? quality.score : "—"}
                  <small>/100</small>
                </strong>
                <p>
                  {quality
                    ? "Uma orientação para melhorar o registro. Não é uma avaliação acadêmica."
                    : qualityError || "Avaliando a qualidade do relato…"}
                </p>
              </div>
              <TrendingUp size={35} />
              {qualityError && (
                <button
                  disabled={!!busy}
                  onClick={async () => {
                    setBusy("Avaliando a qualidade…");
                    await grade();
                    setBusy("");
                  }}
                >
                  Tentar pontuação novamente
                </button>
              )}
            </div>
            <div>
              <button
                disabled={!!busy}
                className="back-button"
                onClick={() => {
                  setStage("relato");
                  setConfirmed(false);
                }}
              >
                Complementar relato
              </button>{" "}
              <button
                disabled={!!busy}
                className="back-button"
                onClick={() => {
                  setRelato("");
                  setForm(empty());
                  setFeedback(null);
                  setQuality(null);
                  setConfirmed(false);
                  setError("");
                  reported.current = false;
                  setStage("relato");
                }}
              >
                Novo caso
              </button>
            </div>
          </div>
          {quality && (
            <details className="resource-card">
              <summary>Entender minha pontuação</summary>
              <p className="module-note">
                Avalia o relato original revisado. Os campos reorganizados
                apoiam o feedback clínico. Critérios não aplicáveis não reduzem
                a nota.
              </p>
              {quality.criteria.map((c) => (
                <article className="rubric-row" key={c.id}>
                  <h3>
                    {c.label}{" "}
                    <small>
                      {c.aplicavel ? `${c.points}/${c.max}` : "Não aplicável"}
                    </small>
                  </h3>
                  <p>{c.justificativa}</p>
                  {c.evidencia && <blockquote>{c.evidencia}</blockquote>}
                  <p>
                    <b>Próximo passo:</b> {c.melhoria}
                  </p>
                </article>
              ))}
            </details>
          )}
          <div
            className="feedback-tabs"
            role="tablist"
            aria-label="Seções do feedback"
          >
            {groups.map(([name], i) => (
              <button
                role="tab"
                aria-selected={tab === i}
                key={name}
                onClick={() => setTab(i)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="feedback-sections" role="tabpanel">
            {groups[tab][1]
              .filter((k) => feedback[k] != null)
              .map((k) => (
                <article className="resource-card markdown" key={k}>
                  <h2>{labels[k]}</h2>
                  <Value value={feedback[k]} />
                </article>
              ))}
            {tab === 3 &&
              extras.map((k) => (
                <article className="resource-card" key={k}>
                  <h2>{labels[k] || k.replaceAll("_", " ")}</h2>
                  <Value value={feedback[k]} />
                </article>
              ))}
          </div>
          <p className="module-note">
            Feedback formativo do Vytal Acadêmico. Discuta dúvidas com seu
            preceptor. O caso fica somente nesta aba; não é publicado nem
            enviado ao ranking.
          </p>
        </>
      )}
      {busy && (
        <p role="status" className="progress">
          <span className="spinner" />
          {busy}
        </p>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
