import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, errorText } from "../api";
import { MedicationNames, draftBody, draftFromOCR, validateDraft, type Draft, type ExistingMedication, type OCRResponse, type Patient } from "../models";
import { Button, Confirm, Icon, Notice, Surface } from "../ui";
import { MedicationFields, loadExisting } from "./MedicationEditor";
import { PatientMissing, usePatient } from "./Patient";
import { useApp } from "../App";

type Upload = { base64: string; mediaType: string; url: string; pdf: boolean };
/** Foto: reduz para no máximo 2400 px e JPEG, como o app. PDF vai inteiro. */
async function prepare(file: File): Promise<Upload> {
  const pdf = file.type === "application/pdf";
  if (!pdf && !file.type.startsWith("image/")) throw new Error("Envie uma foto (JPG, PNG, HEIC) ou um PDF da receita.");
  if (pdf) {
    const bytes = new Uint8Array(await file.arrayBuffer()); let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    const base64 = btoa(bin); if (base64.length > 12_000_000) throw new Error("Este PDF é grande demais. Envie só a página da receita.");
    return { base64, mediaType: "application/pdf", url: URL.createObjectURL(file), pdf };
  }
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { throw new Error("Não foi possível preparar a imagem. Escolha outra foto ou envie em JPG."); }
  const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas"); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL("image/jpeg", 0.9);
  return { base64: data.slice(data.indexOf(",") + 1), mediaType: "image/jpeg", url: data, pdf };
}
const StepDots = ({ step }: { step: number }) => <div className="row wrap" style={{ gap: 22 }}>{["Enviar", "Conferir", "Salvar"].map((t, i) => <div key={t} className="row" style={{ gap: 8, fontSize: 14, fontWeight: 600, color: i <= step ? "var(--blue)" : "var(--muted)" }}>
  <div style={{ width: 26, height: 26, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", background: i <= step ? "var(--blue)" : "var(--fill)", color: i <= step ? "#fff" : "var(--muted)", fontSize: 13 }}>{i < step ? <Icon name="check" size={15} stroke={2.4} /> : i + 1}</div>{t}</div>)}</div>;

export default function Recipe() { const p = usePatient(); return p ? <Flow key={p.phone} patient={p} /> : <PatientMissing />; }
function Flow({ patient }: { patient: Patient }) {
  const navigate = useNavigate();
  const { reload } = useApp();
  const [upload, setUpload] = useState<Upload | null>(null);
  const [reading, setReading] = useState<OCRResponse | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [existing, setExisting] = useState<ExistingMedication[]>([]);
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const [over, setOver] = useState(false), [zoom, setZoom] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { let on = true; void loadExisting(patient).then((e) => on && setExisting(e)); return () => { on = false; }; }, [patient]);
  const back = `/p/${patient.phone}?aba=medicacoes`;
  const pending = drafts.filter((d) => d.included && !d.saved).length;
  async function pick(file?: File | null) { if (!file) return; setError(null); try { setUpload(await prepare(file)); } catch (e) { setError(errorText(e)); } }
  async function read() {
    if (busy || !upload) return; setBusy(true); setError(null);
    try {
      const r = await api<OCRResponse>("/prescricoes/ler", { method: "POST", body: { imagemBase64: upload.base64, mediaType: upload.mediaType } });
      if (!r.itens?.length) throw new Error("Nenhuma medicação identificada. Tente outra imagem ou cadastre manualmente.");
      setDrafts(r.itens.map(draftFromOCR)); setReading(r);
    } catch (e) { setError(errorText(e)); } finally { setBusy(false); }
  }
  async function save(force = false) {
    if (busy) return;
    if (!force) {
      // Duplicidade contra o que já existe para o telefone E dentro da própria receita.
      const seen: string[] = [], warnings: string[] = [];
      for (const d of drafts) if (d.included && !d.saved) {
        for (const dup of MedicationNames.duplicates(d.name, existing)) warnings.push(MedicationNames.describe(dup));
        const k = MedicationNames.key(d.name); if (k) { if (seen.includes(k)) warnings.push(`${d.name} aparece mais de uma vez nesta receita.`); else seen.push(k); }
      }
      if (warnings.length) return setDuplicate(warnings.join("\n") + "\nO paciente receberia lembretes repetidos.");
    }
    setBusy(true); setError(null); setDuplicate(null);
    const next = [...drafts];
    for (let i = 0; i < next.length; i++) {
      if (!next[i].included || next[i].saved) continue;
      const invalid = validateDraft(next[i]); if (invalid) { next[i] = { ...next[i], error: invalid }; continue; }
      try { await api("/medications", { method: "POST", body: draftBody(next[i], patient) }); next[i] = { ...next[i], saved: true, error: undefined }; }
      catch (e) { next[i] = { ...next[i], error: errorText(e) }; }
      setDrafts([...next]);
    }
    setDrafts(next); setBusy(false); void reload();
    if (!next.some((d) => d.included && !d.saved) && next.some((d) => d.saved)) navigate(back);
  }
  const preview = upload && (upload.pdf ? <object data={upload.url} type="application/pdf" aria-label="Receita em PDF" style={{ width: "100%", height: 520, borderRadius: 18, background: "var(--bg)" }}><p className="muted">PDF enviado. A pré-visualização não está disponível neste navegador.</p></object>
    : <button type="button" onClick={() => setZoom(true)} aria-label="Ampliar receita" style={{ border: 0, padding: 0, background: "none", cursor: "zoom-in" }}><img src={upload.url} alt="Receita enviada" style={{ width: "100%", maxHeight: 560, objectFit: "contain", borderRadius: 18, display: "block" }} /></button>);

  return <div className="page">
    <Link to={back} className="row small" style={{ gap: 4, fontWeight: 600 }}><Icon name="back" size={16} />{patient.name}</Link>
    <div className="row between wrap"><h1>{reading ? "Confira com calma." : upload ? "A receita está legível?" : "A receita vira ponto de partida."}</h1><StepDots step={reading ? 1 : 0} /></div>
    <Notice>{error}</Notice>
    {!upload && <>
      <p className="muted">Envie a foto de uma página impressa ou o PDF. Você confere todos os dados antes de salvar.</p>
      <input ref={input} type="file" accept="image/*,application/pdf" hidden onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
      <div className={`drop ${over ? "over" : ""}`} role="button" tabIndex={0} onClick={() => input.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); void pick(e.dataTransfer.files?.[0]); }}>
        <Icon name="upload" size={40} stroke={1.5} /><b style={{ fontSize: 17 }}>Arraste a foto ou o PDF da receita</b><span className="muted">ou clique para escolher o arquivo. No celular, abre a câmera.</span></div>
      <p className="muted small">Boa luz, página inteira e sem sombra ajudam a leitura. Uma página por vez.</p>
    </>}
    {upload && !reading && <div className="split"><Surface className="grow">{preview}</Surface><div className="side stack">
      <p className="muted">Confira se todas as linhas aparecem antes de enviar para leitura.</p>
      <Button className="big" icon="search" busy={busy} onClick={read}>Ler receita</Button>
      {busy && <p className="muted small">A receita é lida duas vezes. Costuma levar menos de um minuto.</p>}
      <button className="link" disabled={busy} onClick={() => { setUpload(null); setError(null); }}>Escolher outro arquivo</button></div></div>}
    {upload && reading && <>
      <p className="muted">Confira cada item com a receita em mãos. O Vytal Care transporta a orientação da receita; ele não decide nada.</p>
      {reading.legibilidadeBaixa && <Notice tone="warn">A foto tem trechos pouco legíveis. Confira cada campo com atenção redobrada ou envie outra foto.</Notice>}
      {reading.leituraDupla ? <div className="row muted small"><Icon name="shield" size={16} />A receita foi lida duas vezes de forma independente. Onde as leituras divergiram, o item aparece marcado em laranja.</div>
        : <Notice tone="warn">A segunda leitura de conferência não aconteceu desta vez. Confira cada campo com a receita.</Notice>}
      {/* Depois da leitura, só as medicações: a foto ao lado cobria os itens no celular (pedido do Dilson, 18/09). */}
      <div className="stack">
        <div className="stack">
          {drafts.map((d, i) => <Surface key={d.key} style={d.divergent || d.motivos.length ? { borderColor: "var(--warn)" } : undefined}>
            {d.saved ? <div className="row" style={{ color: "var(--teal)", fontWeight: 600 }}><Icon name="check" />{d.name} · Salvo</div> : <>
              <label className="row" style={{ cursor: "pointer" }}><input type="checkbox" checked={d.included} disabled={busy} onChange={(e) => setDrafts(drafts.map((x, j) => (j === i ? { ...x, included: e.target.checked } : x)))} style={{ width: 22, height: 22, accentColor: "var(--blue)", flexShrink: 0 }} />
                {(d.divergent || d.motivos.length > 0) && <span style={{ color: "var(--warn)" }}><Icon name="alert" size={18} /></span>}<b style={{ fontSize: 17 }}>{d.name || "Medicação da receita"}</b>{!d.included && <span className="muted small">não será salva</span>}</label>
              {!d.included && d.motivos.length > 0 && <span className="small" style={{ color: "var(--warn)" }}>{d.motivos.join(" ")}</span>}
              {d.included && <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}><MedicationFields draft={d} onChange={(n) => setDrafts(drafts.map((x, j) => (j === i ? { ...n, error: undefined } : x)))} /></fieldset>}</>}
          </Surface>)}
          {pending > 0 ? <Button className="big" icon="check" busy={busy} onClick={() => save()}>Salvar {pending} {pending === 1 ? "medicação" : "medicações"}</Button>
            : drafts.some((d) => d.saved) ? <Button className="big" icon="check" onClick={() => navigate(back)}>Concluir</Button> : <p className="muted">Selecione ao menos uma medicação para salvar.</p>}
        </div>
      </div></>}
    {zoom && upload && !upload.pdf && <div className="backdrop" onClick={() => setZoom(false)} onKeyDown={(e) => { if (e.key === "Escape") setZoom(false); }} style={{ cursor: "zoom-out", overflow: "auto", alignItems: "flex-start" }}><button type="button" autoFocus onClick={() => setZoom(false)} className="btn plain" style={{ position: "fixed", top: 16, right: 16 }}>Fechar</button><img src={upload.url} alt="Receita ampliada" style={{ maxWidth: "none", width: "min(1600px, 160vw)", borderRadius: 12 }} /></div>}
    {duplicate && <Confirm title="Medicação já cadastrada" message={duplicate} action="Salvar mesmo assim" busy={busy} onCancel={() => setDuplicate(null)} onConfirm={() => save(true)} />}
  </div>;
}
