import {imageQuery} from "../shared/image-filters.mjs";
import { detectAcademicPII } from "../shared/pii.mjs";
import { sessionToken, allowWrite } from "./vytal-assistant.mjs";
import { parseSSE } from "./research.mjs";
import {
  reviewedFields,
  feedbackPayload,
  guidanceFeedback,
  qualityMessages,
  validateQuality,
  fields,
} from "../shared/case-contract.mjs";
const API = "https://vytal-api-production.up.railway.app";
const limits = new Map();
function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
export async function academic(
  req,
  res,
  { fetchImpl = fetch, now = Date.now } = {},
) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST")
    return send(res, 405, { error: "Método não permitido." });
  if (!allowWrite(req, res)) return;
  const token = sessionToken(req);
  if (!token)
    return send(res, 401, {
      error: "Entre com sua conta Vytal para continuar.",
    });
  let b;
  try {
    b = req.body;
    if (b == null) {
      b = "";
      for await (const chunk of req) {
        b += chunk;
        if (Buffer.byteLength(b) > 4200000) throw Error();
      }
    }
    if (typeof b === "string" || Buffer.isBuffer(b)) b = JSON.parse(String(b));
    if (Buffer.byteLength(JSON.stringify(b)) > 4200000) throw Error();
  } catch {
    return send(res, 400, { error: "Arquivo ou solicitação muito grande." });
  }
  const action = b?.action,
    p = b?.payload;
  let path, body, report;
  try {
    if (action === "images") {
      const q=imageQuery(p);
      path = "/estudante/imagens?" + q;
    } else if (action === "structure") {
      if (
        typeof p?.relato !== "string" ||
        p.relato.trim().length < 20 ||
        p.relato.length > 12000
      )
        throw Error();
      path = "/estudante/scribe/estruturar";
      body = { relato: p.relato };
    } else if (action === "transcribe") {
      if (
        typeof p?.audioBase64 !== "string" ||
        p.audioBase64.length > 4000000 ||
        !p.audioBase64.length ||
        !/^[A-Za-z0-9+/]+={0,2}$/.test(p.audioBase64) ||
        ![
          "audio/webm",
          "audio/mp4",
          "audio/m4a",
          "audio/mpeg",
          "audio/wav",
          "audio/ogg",
        ].includes(p.mimeType)
      )
        throw Error();
      path = "/estudante/scribe/transcrever";
      body = { audioBase64: p.audioBase64, mimeType: p.mimeType };
    } else if (action === "feedback" || action === "quality") {
      const f = reviewedFields(p?.fields);
      if (
        typeof p?.relato !== "string" ||
        p.relato.trim().length < 20 ||
        p.relato.length > 5000
      )
        throw Error("Revise o relato original.");
      if (action === "feedback") {
        path = "/estudante/case-feedback";
        body = feedbackPayload(f);
        body.clinicalHistory += "\nRelato original para contexto: " + p.relato;
        if (body.clinicalHistory.length > 5000)
          throw Error("A história organizada deve ter até 5.000 caracteres.");
      } else {
        report = p.relato;
        if (report.length > 12000) throw Error();
        // Streaming devolve o texto cru do modelo; o /tutor/chat embrulha em {resposta} e perdia o JSON da rubrica.
        path = "/estudante/tutor/chat-stream";
        body = { historico: qualityMessages(report) };
      }
    } else return send(res, 400, { error: "Operação não permitida." });
  } catch (e) {
    return send(res, 400, { error: e.message || "Confira os dados enviados." });
  }
  if (action !== "images" && action !== "transcribe") {
    const text = [
      p.relato,
      ...Object.values(p.fields || {}).filter((v) => typeof v === "string"),
    ].join("\n");
    if (detectAcademicPII(text))
      return send(res, 400, {
        error:
          "Identificamos possível dado pessoal. Remova os identificadores do paciente antes de continuar.",
      });
  }
  // Authenticated, per-session defense in depth; upstream remains authorization authority.
  const { createHash } = await import("node:crypto");
  const key = createHash("sha256").update(token).digest("hex");
  for (const [k, v] of limits) if (v.until <= now()) limits.delete(k);
  const quota = limits.get(key) || { count: 0, until: now() + 60000 };
  if (quota.count >= 12 || (!limits.has(key) && limits.size >= 5000))
    return send(res, 429, {
      error: "Aguarde um minuto antes de tentar novamente.",
    });
  quota.count++;
  limits.set(key, quota);
  if (action === "feedback" && p?.stream === true)
    return streamFeedback(res, token, body, fetchImpl);
  try {
    const r = await fetchImpl(API + path, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      redirect: "error",
      signal: AbortSignal.timeout(270000),
    });
    if (!r.ok) {
      let message = "Não foi possível concluir. Tente novamente.";
      if (r.status < 500) {
        try {
          const d = await r.json();
          const m = d.error || d.message;
          if (typeof m === "string") message = m.slice(0, 500);
        } catch {}
      }
      return send(
        res,
        [400, 401, 403, 429].includes(r.status) ? r.status : 502,
        { error: message },
      );
    }
    if (action === "quality") {
      try {
        return send(res, 200, validateQuality(await streamedText(r), report));
      } catch {
        return send(res, 422, {
          error:
            "Não foi possível validar a pontuação. Seu feedback está disponível; tente avaliar a qualidade novamente.",
        });
      }
    }
    const data = await r.json();
    if (action === "feedback" && data.feedback && typeof data.feedback === "object")
      return send(res, 200, { ...data, feedback: guidanceFeedback(data.feedback) });
    return send(res, 200, data);
  } catch {
    return send(res, 503, {
      error: "O serviço não concluiu a tempo. Tente novamente.",
    });
  }
}

// Junta os pedaços {t} do SSE do tutor; um {error} vira falha.
export async function streamedText(r) {
  const raw = await r.text();
  if (!/^data:/m.test(raw)) {
    try { const d = JSON.parse(raw); return typeof d.resposta === "string" ? d.resposta : raw; } catch { return raw; }
  }
  let out = "";
  for (const line of raw.split(/\r?\n/)) {
    if (!line.startsWith("data:")) continue;
    let d; try { d = JSON.parse(line.slice(5).trim()); } catch { continue; }
    if (d.error) throw Error(String(d.error));
    if (typeof d.t === "string") out += d.t;
  }
  return out;
}

// Resumo e hipóteses da 1ª parte, para a 2ª parte ficar coerente com ela.
export function feedbackContext(f) {
  const hyp = Array.isArray(f?.hipoteses_para_discussao)
    ? f.hipoteses_para_discussao.map((h) => (typeof h === "string" ? h : h?.hipotese || h?.nome || "")).filter(Boolean).join("; ")
    : typeof f?.hipoteses_para_discussao === "string" ? f.hipoteses_para_discussao : "";
  return { resumo: typeof f?.resumo_caso === "string" ? f.resumo_caso.slice(0, 2000) : "", hipoteses: hyp.slice(0, 2000) };
}
// Feedback em duas partes, como no app Vytal: "essencial" (aba Raciocínio, ~30 s) chega
// primeiro e aparece na tela; "complementar" (Semiologia, Manejo, Estudo, apresentação) vem depois.
async function streamFeedback(res, token, body, fetchImpl) {
  const abort = new AbortController();
  res.on?.("close", () => { if (!res.writableEnded) abort.abort(); });
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  const out = (event, data) => { if (!res.destroyed) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); };
  const ping = setInterval(() => { if (!res.destroyed) res.write(": ping\n\n"); }, 10000);
  async function part(secao, payload) {
    const r = await fetchImpl(`${API}/estudante/case-feedback-${secao}-stream`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "error",
      signal: AbortSignal.any([abort.signal, AbortSignal.timeout(270000)]),
    });
    if (!r.ok) {
      let message = "Não foi possível gerar o feedback. Tente novamente.";
      if (r.status < 500) try { const d = await r.json(); const m = d.error || d.message; if (typeof m === "string") message = m.slice(0, 500); } catch {}
      throw Object.assign(Error(message), { status: r.status });
    }
    for await (const event of parseSSE(r.body)) {
      if (typeof event?.error === "string") throw Error(event.error.slice(0, 500));
      if (event?.feedback && typeof event.feedback === "object") return event.feedback;
    }
    throw Error("O feedback foi interrompido. Tente novamente.");
  }
  let first = null;
  try {
    out("progress", { secao: "essencial" });
    first = await part("essencial", body);
    if (first.erro_pii) throw Error(String(first.erro_pii));
    out("part", { secao: "essencial", feedback: guidanceFeedback(first) });
    out("progress", { secao: "complementar" });
    const rest = { ...body, contexto: feedbackContext(first) };
    // A 2ª parte é a maior e já falhou por truncamento em produção: uma nova tentativa antes de desistir.
    const second = await part("complementar", rest).catch((e) => {
      if (abort.signal.aborted || [401, 403, 429].includes(e.status)) throw e;
      return part("complementar", rest);
    });
    out("part", { secao: "complementar", feedback: guidanceFeedback(second) });
    out("done", {});
  } catch (e) {
    if (!abort.signal.aborted)
      out("error", { secao: first ? "complementar" : "essencial", error: e?.name === "TimeoutError" ? "O serviço não concluiu a tempo. Tente novamente." : e?.message || "Não foi possível gerar o feedback." });
  } finally {
    clearInterval(ping);
  }
  res.end();
}
