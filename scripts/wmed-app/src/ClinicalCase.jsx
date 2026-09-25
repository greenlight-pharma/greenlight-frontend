import {productConfig} from '../shared/product.mjs';
const brandName=productConfig(import.meta.env.VITE_PRODUCT).name;
import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  History,
  Check,
} from "lucide-react";
import CaseFeedback from "./CaseFeedback";
import CaseHistory, {caseRequest} from "./CaseHistory";
import {restoreCase} from "../shared/case-storage.mjs";
import "./case-feedback.css";
import { academicRequest } from "./Libraries";
import PrivacyReview from "./PrivacyReview";
import { detectAcademicPII } from "../shared/pii.mjs";
import { fields, feedbackPayload, guidanceFeedback } from "../shared/case-contract.mjs";
const empty = () => Object.fromEntries(fields.map(([k]) => [k, ""]));
export default function ClinicalCase(props) {
  const scope=props.session?.user?.progressScope||null;
  const [identity,setIdentity]=useState({scope,generation:0});
  if(scope!==identity.scope)setIdentity({scope,generation:identity.scope?identity.generation+1:identity.generation});
  return <ClinicalCaseBody key={identity.generation} {...props}/>;
}
function ClinicalCaseBody({ session, onLogin, onProgress, onPendingChange, active, initialStory = "" }) {
  const [stage, setStage] = useState("relato"),
    [relato, setRelato] = useState(initialStory),
    [form, setForm] = useState(empty),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [feedback, setFeedback] = useState(null),
    [quality, setQuality] = useState(null),
    [qualityError, setQualityError] = useState(""),
    [recording, setRecording] = useState(false),
    [seconds, setSeconds] = useState(0);
  const [privacyOpen,setPrivacyOpen]=useState(false);
  const [historyOpen,setHistoryOpen]=useState(false),[saveStatus,setSaveStatus]=useState(""),[saveError,setSaveError]=useState("");
  const pendingSave=useRef(null),saving=useRef(null),pageRef=useRef(null);
  useEffect(()=>{if(active)pageRef.current?.scrollIntoView({block:"start",behavior:"instant"});},[stage,active]);
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
  useEffect(()=>{onPendingChange?.(Boolean(busy||recording||saveStatus==='saving'||saveStatus==='error'));},[busy,recording,saveStatus,onPendingChange]);
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
      return d;
    } catch (e) {
      if (alive.current) setQualityError(e.message);
      return null;
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
      if(!alive.current)return;
      setFeedback(guidanceFeedback(d.feedback));
      setStage("feedback");
      setBusy("Avaliando a qualidade do relato…");
      const score = await grade();
      if(!alive.current)return;
      pendingSave.current={requestId:crypto.randomUUID(),relato,fields:form,feedback:guidanceFeedback(d.feedback),quality:score};
      setBusy("Salvando caso…");
      await persist();
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setBusy("");
    }
  }
  async function persist() {
    if(saving.current)return saving.current;
    if(!pendingSave.current)return true;
    setSaveStatus('saving');setSaveError('');
    const snapshot=pendingSave.current;
    const promise=(async()=>{try{
      const result=await caseRequest({action:'save',snapshot});
      if(!result.caso?.id)throw Error('O servidor não confirmou o salvamento.');
      if(alive.current){pendingSave.current=null;setSaveStatus('saved');}
      return true;
    }catch(e){if(alive.current){setSaveStatus('error');setSaveError(e.message);}return false;
    }finally{saving.current=null;}})();saving.current=promise;return promise;
  }
  useEffect(()=>{const warn=e=>{if(pendingSave.current||busy){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[busy]);
  async function openSaved(id){
    if(pendingSave.current&&!await persist())throw Error('Salve o caso atual antes de abrir outro.');
    const data=await caseRequest({action:'open',id});
    const saved=restoreCase(data.caso);
    if(!alive.current)return;
    setRelato(saved.relato);setForm(saved.form);setFeedback(saved.feedback);setQuality(saved.quality);setQualityError('');setStage('feedback');setSaveStatus('saved');setSaveError('');setError('');setHistoryOpen(false);reported.current=true;
  }
  async function fresh(){
    if(pendingSave.current&&!await persist())return;
    setRelato('');setForm(empty());setFeedback(null);setQuality(null);setConfirmed(false);setError('');setQualityError('');setSaveStatus('');setSaveError('');reported.current=false;setStage('relato');
  }
  const feedbackLength =
    feedbackPayload(form).clinicalHistory.length +
    "\nRelato original para contexto: ".length +
    relato.length;
  return (
    <section ref={pageRef} className={"module-page case-page"+(stage==="feedback"?" has-feedback":"")}>
      {historyOpen&&<CaseHistory onClose={()=>setHistoryOpen(false)} onSelect={openSaved}/>}
      {privacyOpen&&<PrivacyReview text={relato} onCancel={()=>setPrivacyOpen(false)} onApply={text=>{setRelato(text);setConfirmed(false);setPrivacyOpen(false)}}/>}
      <header className="module-heading case-heading">
        <button className="case-history-button" disabled={!!busy||saveStatus==="saving"} onClick={()=>{if(requireLogin())setHistoryOpen(true)}}><History size={17}/> Meus casos</button>
        <span className="eyebrow blue">PRÁTICA CLÍNICA</span>
        <h1>Caso clínico</h1>
        <p>
          Conte o caso. Veja hipóteses, exames e condutas a considerar.
        </p>
      </header>
      {stage!=="feedback"&&<nav className="case-steps" aria-label="Etapas do caso">
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
      </nav>}
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
              placeholder="Descreva a queixa, a evolução, os antecedentes, os medicamentos e os achados disponíveis. Não inclua nome, CPF, telefone ou endereço do paciente."
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
            <button
              className="module-primary"
              disabled={
                !!busy ||
                recording ||
                relato.trim().length < 20 ||
                relato.length > 5000
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
              Você traz o relato. {brandName==='WMed'?'O WMed':'A 2Doctor'} organiza os dados e apresenta hipóteses
              e opções de conduta, com justificativas.
            </p>
            <ol>
              <li>Conte o caso por texto ou voz.</li>
              <li>Confira os campos e corrija o que precisar.</li>
              <li>Veja hipóteses, exames e condutas a considerar.</li>
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
            Conferi os campos. Eles representam os dados que relatei.
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
      {stage === "feedback" && feedback && <>
        <div className="case-result-actions"><div role="status" className={'case-save-state '+saveStatus}>{saveStatus==='saved'?<><Check size={15}/> Salvo na sua conta</>:saveStatus==='saving'?'Salvando caso…':saveStatus==='error'?'Caso ainda não salvo':'Preparando para salvar…'}</div><button disabled={!!busy||saveStatus==='saving'} onClick={async()=>{if(pendingSave.current&&!await persist())return;setStage('relato');setConfirmed(false);setSaveStatus('');}}>Complementar relato</button><button disabled={!!busy||saveStatus==='saving'} onClick={fresh}>Novo caso</button></div>
        {saveError&&<div className="error" role="alert">{saveError} Mantenha esta tela aberta.<button disabled={saveStatus==='saving'} onClick={persist}>Tentar salvar novamente</button></div>}
        <CaseFeedback key={feedback?JSON.stringify(form):'empty'} feedback={feedback} quality={quality} qualityError={qualityError} relato={relato} form={form} busy={!!busy}/>
      </>}
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
