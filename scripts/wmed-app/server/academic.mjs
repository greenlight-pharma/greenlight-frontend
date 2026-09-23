import { detectAcademicPII } from "../shared/pii.mjs";
import { sessionToken, allowWrite } from "./vytal-assistant.mjs";
import {
  reviewedFields,
  feedbackPayload,
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
      const page = Number(p?.page || 1);
      if (!Number.isInteger(page) || page < 1 || page > 10000) throw Error();
      const q = new URLSearchParams({ page: String(page), pageSize: "12" });
      if (p?.tema) {
        if (typeof p.tema !== "string" || p.tema.length > 120) throw Error();
        q.set("tema", p.tema);
      }
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
        path = "/estudante/tutor/chat";
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
    const data = await r.json();
    if (action === "quality") {
      try {
        return send(res, 200, validateQuality(data.resposta, report));
      } catch {
        return send(res, 422, {
          error:
            "Não foi possível validar a pontuação. Seu feedback está disponível; tente avaliar a qualidade novamente.",
        });
      }
    }
    return send(res, 200, data);
  } catch {
    return send(res, 503, {
      error: "O serviço não concluiu a tempo. Tente novamente.",
    });
  }
}
