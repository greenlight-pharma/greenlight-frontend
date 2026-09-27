import test from "node:test";
import assert from "node:assert/strict";
import { academic } from "../server/academic.mjs";
import {
  fields,
  rubric,
  validateQuality,
  feedbackPayload,
  qualityMessages,
  reviewedFields,
  guidanceFeedback,
  scorePrompt,
} from "../shared/case-contract.mjs";
const story =
  "Paciente adulto com tosse há três dias, sem febre. História descrita para teste sintético.";
const f = Object.fromEntries(fields.map(([k]) => [k, ""]));
Object.assign(f, { queixaPrincipal: "Tosse", hma: story });
function res() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    end(s) {
      this.data = JSON.parse(s);
    },
  };
}
const req = (action, payload) => ({
  method: "POST",
  headers: {
    origin: "https://www.vytalsaude.com.br",
    host: "www.vytalsaude.com.br",
    "x-wmed-request": "1",
    cookie: "__Secure-wmed_vytal=e30.e30.fake",
  },
  body: { action, payload },
});
const result = () => ({
  criterios: rubric.map((r) => ({
    id: r.id,
    nivel: 3,
    aplicavel: true,
    evidencia: "Paciente adulto",
    justificativa: "Informação presente.",
    melhoria: "Detalhar a sequência.",
  })),
});
test("anonymous, foreign origin and non-allowlisted actions never call upstream", async () => {
  for (const setup of [
    (r) => delete r.headers.cookie,
    (r) => (r.headers.origin = "https://foreign.example"),
    (r) => (r.body.action = "admin"),
  ]) {
    const r = req("feedback", { fields: f, relato: story });
    setup(r);
    const o = res();
    await academic(r, o, { fetchImpl: () => assert.fail("must not fetch") });
    assert.ok([400, 401, 403].includes(o.statusCode));
  }
});
test("structure only targets existing student scribe; no account or institutional writes", async () => {
  const o = res();
  await academic(req("structure", { relato: story }), o, {
    fetchImpl: async (url, opts) => {
      assert.equal(
        url,
        "https://vytal-api-production.up.railway.app/estudante/scribe/estruturar",
      );
      assert.equal(JSON.parse(opts.body).relato, story);
      return Response.json({ campos: f });
    },
  });
  assert.equal(o.data.campos.hma, story);
});
test("feedback preserves original narrative and every reviewed field with original API schema", async () => {
  const o = res();
  await academic(req("feedback", { fields: f, relato: story }), o, {
    fetchImpl: async (url, opts) => {
      assert.ok(url.endsWith("/case-feedback"));
      const b = JSON.parse(opts.body);
      assert.ok(b.clinicalHistory.includes(story));
      assert.ok(b.clinicalHistory.includes("Contexto e identificação clínica"));
      assert.equal(b.studentHypotheses, "Não informadas pelo estudante");
      return Response.json({
        feedback: { resumo_caso: "Exemplo", referencias: ["Fonte"] },
      });
    },
  });
  assert.deepEqual(o.data.feedback.referencias, ["Fonte"]);
});
test("oversized fields and identifiable narrative blocked before external call", async () => {
  for (const payload of [
    { fields: { ...f, hma: "x".repeat(5001) }, relato: story },
    {
      fields: f,
      relato: "Paciente com CPF 123.456.789-09 e história detalhada.",
    },
  ]) {
    const o = res();
    await academic(req("feedback", payload), o, {
      fetchImpl: () => assert.fail("must not fetch"),
    });
    assert.equal(o.statusCode, 400);
  }
});
test("audio type and size validated, approved images remain authenticated and paginated", async () => {
  const bad = res();
  await academic(
    req("transcribe", { audioBase64: "abc", mimeType: "text/html" }),
    bad,
    { fetchImpl: () => assert.fail() },
  );
  assert.equal(bad.statusCode, 400);
  const o = res();
  await academic(req("images", { page: 2 }), o, {
    fetchImpl: async (url, opts) => {
      assert.ok(url.endsWith("/estudante/imagens?page=2&pageSize=12"));
      assert.equal(opts.method, "GET");
      return Response.json({ imagens: [], total: 0 });
    },
  });
  assert.deepEqual(o.data.imagens, []);
});
test("quality totals are computed by server, levels bounded and non-applicable criteria normalized", () => {
  const r = result();
  r.score = 999;
  assert.equal(validateQuality(JSON.stringify(r), story).score, 75);
  r.criterios[0].aplicavel = false;
  assert.equal(validateQuality(JSON.stringify(r), story).score, 75);
  r.criterios[1].nivel = 10;
  assert.throws(() => validateQuality(JSON.stringify(r), story));
});
test("missing criteria and duplicate ids are rejected; fabricated evidence is hidden, never shown", () => {
  for (const mutate of [
    (r) => r.criterios.pop(),
    (r) => (r.criterios[0].id = "historia"),
  ]) {
    const r = result();
    mutate(r);
    assert.throws(() => validateQuality(JSON.stringify(r), story));
  }
  const r = result();
  r.criterios[0].evidencia = "Not in source";
  const q = validateQuality(JSON.stringify(r), story);
  assert.equal(q.criteria[0].evidencia, "");
  assert.equal(q.score, 75);
});
test("quality tolerates how the model actually answers", () => {
  const r = result();
  const ev = r.criterios[1].evidencia;
  r.criterios[1].evidencia = "“" + ev.toUpperCase() + "”";
  r.criterios[2].nivel = String(r.criterios[2].nivel);
  delete r.criterios[3].aplicavel;
  for (const raw of [
    "Segue a avaliação:\n```json\n" + JSON.stringify(r) + "\n```\n###TEMAS### [\"Anamnese\"]",
    JSON.stringify({ resposta: JSON.stringify(r), temas: [] }),
  ]) {
    const q = validateQuality(raw, story);
    assert.equal(q.criteria[1].evidencia, r.criterios[1].evidencia);
    assert.ok(q.score >= 0 && q.score <= 100);
  }
  assert.throws(() => validateQuality("## Avaliação\nBom relato.", story));
});
test("quality scores the original account, never the AI reorganization; upstream errors not hidden", async () => {
  const o = res();
  await academic(req("quality", { fields: f, relato: story }), o, {
    fetchImpl: async (url, opts) => {
      assert.ok(url.endsWith("/tutor/chat-stream"));
      const prompt = JSON.parse(opts.body).historico.map(m=>m.content).join("\n");
      assert.ok(prompt.includes("<relato>\n" + story + "\n</relato>"));
      const text = JSON.stringify(result());
      return new Response(`data: ${JSON.stringify({ t: text.slice(0, 40) })}\n\ndata: ${JSON.stringify({ t: text.slice(40) + "\n###TEMAS### []" })}\n\ndata: {"done":true}\n\n`, { headers: { "Content-Type": "text/event-stream" } });
    },
  });
  assert.equal(o.data.score, 75);
  for (const status of [401, 403, 429, 500]) {
    const output = res();
    await academic(req("images", {}), output, {
      fetchImpl: async () => Response.json({ message: "Denied" }, { status }),
    });
    assert.equal(output.statusCode, status === 500 ? 502 : status);
  }
});

test('long quality reports remain complete within existing tutor message limits',()=>{const report='a'.repeat(4999)+'Z';const messages=qualityMessages(report);assert.ok(messages.every(m=>m.content.length<=4000));const recovered=messages.filter(m=>m.content.startsWith('Parte ')).map(m=>m.content.split('<relato>\n')[1].split('\n</relato>')[0]).join('');assert.equal(recovered,report);});

test('audio goes only to the existing transcriber and returns text for review',async()=>{const o=res();await academic(req('transcribe',{audioBase64:'AAAA',mimeType:'audio/m4a'}),o,{fetchImpl:async(url,opts)=>{assert.ok(url.endsWith('/estudante/scribe/transcrever'));assert.deepEqual(JSON.parse(opts.body),{audioBase64:'AAAA',mimeType:'audio/m4a'});return Response.json({texto:'Relato sintético para revisão.'});}});assert.equal(o.data.texto,'Relato sintético para revisão.');});


test('WMed accepts findings without hypotheses or conduct and does not forward forged student answers',()=>{
 assert.ok(!fields.some(([key])=>['hipoteses','conduta'].includes(key)));
 const reviewed=reviewedFields({...f,hipoteses:'Injected hypothesis',conduta:'Injected treatment'});
 assert.equal(reviewed.hipoteses,undefined);
 const body=feedbackPayload(reviewed);
 assert.equal(body.studentHypotheses,'Não informadas pelo estudante');
 assert.equal(body.studentConduct,'Não informada pelo estudante');
 assert.ok(!rubric.some(r=>r.id==='raciocinio'));
 assert.match(scorePrompt(story),/sua ausência NÃO reduz a nota/);
});
test('guidance keeps generated hypotheses and management without student comparison cards',()=>{
 const hypotheses=[{hipotese:'Exemplo sintético'}], management=['Conduta educacional sintética'];
 const feedback=guidanceFeedback({hipoteses_para_discussao:hypotheses,elementos_de_manejo_academico:management,comparacao_hipoteses_aluno:'Não respondeu',comparacao_conduta_aluno:'Não respondeu',alinhamento_conduta_didatico:'divergencia',alinhamento_hipoteses_didatico:'divergencia'});
 assert.deepEqual(feedback,{hipoteses_para_discussao:hypotheses,elementos_de_manejo_academico:management});
});

let clock = Date.now() + 1e10;
const fresh = () => { const t = (clock += 1e8); return () => t; };
const sse = (...events) => new Response(events.map((e) => (e === "ping" ? ": ping\n\n" : `data: ${JSON.stringify(e)}\n\n`)).join(""), { headers: { "Content-Type": "text/event-stream" } });
const streamRes = () => ({ statusCode: 0, headers: {}, out: "", setHeader(k, v) { this.headers[k] = v; }, write(t) { this.out += t; }, end(t = "") { this.out += t; this.ended = true; }, on() {} });
const events = (out) => out.split("\n\n").filter((b) => b.startsWith("event:")).map((b) => ({ event: b.split("\n")[0].slice(7), data: JSON.parse(b.split("\n")[1].slice(6)) }));
test("streamed feedback shows the reasoning part first, then the rest with its context", async () => {
  const calls = [];
  const o = streamRes();
  await academic(req("feedback", { fields: f, relato: story, stream: true }), o, {
    now: fresh(),
    fetchImpl: async (url, opts) => {
      const body = JSON.parse(opts.body);
      calls.push({ url, body });
      if (url.endsWith("/case-feedback-essencial-stream"))
        return sse("ping", { feedback: { resumo_caso: "Resumo sintético", hipoteses_para_discussao: [{ hipotese: "Hipótese A" }], comparacao_hipoteses_aluno: "oculto" } });
      return sse({ feedback: { temas_de_estudo: ["Tema"], conexao_enamed: "oculto" } });
    },
  });
  assert.match(o.headers["Content-Type"], /event-stream/);
  const ev = events(o.out);
  assert.deepEqual(ev.map((e) => e.event), ["progress", "part", "progress", "part", "done"]);
  assert.deepEqual(ev[1].data.feedback, { resumo_caso: "Resumo sintético", hipoteses_para_discussao: [{ hipotese: "Hipótese A" }] });
  assert.deepEqual(ev[3].data.feedback, { temas_de_estudo: ["Tema"] });
  assert.deepEqual(calls[1].body.contexto, { resumo: "Resumo sintético", hipoteses: "Hipótese A" });
  assert.ok(o.ended);
});
test("the second part is retried once before failing", async () => {
  let rest = 0;
  const o = streamRes();
  await academic(req("feedback", { fields: f, relato: story, stream: true }), o, {
    now: fresh(),
    fetchImpl: async (url) => url.includes("essencial") ? sse({ feedback: { resumo_caso: "R" } }) : ++rest === 1 ? sse({ error: "Truncado" }) : sse({ feedback: { referencias: ["Ref"] } }),
  });
  assert.equal(rest, 2);
  assert.equal(events(o.out).at(-1).event, "done");
});
test("streamed feedback reports which part failed", async () => {
  for (const [fail, secao] of [["essencial", "essencial"], ["complementar", "complementar"]]) {
    const o = streamRes();
    await academic(req("feedback", { fields: f, relato: story, stream: true }), o, {
      now: fresh(),
    fetchImpl: async (url) => url.includes(fail) ? sse({ error: "Falha sintética" }) : sse({ feedback: { resumo_caso: "R" } }),
    });
    const last = events(o.out).at(-1);
    assert.equal(last.event, "error");
    assert.equal(last.data.secao, secao);
    assert.equal(last.data.error, "Falha sintética");
  }
});
test("interface language reaches feedback, structure and quality; Portuguese sends nothing new", async () => {
  const seen = [];
  const fetchImpl = async (url, opts) => { seen.push({ url, body: JSON.parse(opts.body) }); return url.includes("chat-stream") ? new Response(`data: ${JSON.stringify({ t: JSON.stringify(result()) })}\n\n`, { headers: { "Content-Type": "text/event-stream" } }) : Response.json({ campos: {}, feedback: { resumo_caso: "x" } }); };
  for (const [action, payload] of [["structure", { relato: story, idioma: "en" }], ["feedback", { fields: f, relato: story, idioma: "es" }], ["quality", { fields: f, relato: story, idioma: "en" }], ["structure", { relato: story }]])
    await academic(req(action, payload), res(), { fetchImpl, now: fresh() });
  assert.equal(seen[0].body.idioma, "en");
  assert.equal(seen[1].body.idioma, "es");
  assert.match(seen[2].body.historico.at(-1).content, /in English/);
  assert.equal(seen[3].body.idioma, undefined);
});
test("feedback keeps running if the phone drops the connection and can be resumed without a new charge", async () => {
  const jobId = "8f14e45f-ceea-4671-8a3b-3c1d2e0f9a11";
  const agora = fresh();
  let charges = 0, closeFirst;
  const first = { ...streamRes(), on(ev, fn) { if (ev === "close") closeFirst = fn; }, get destroyed() { return this.gone; } };
  let release; const gate = new Promise((ok) => { release = ok; });
  const fetchImpl = async (url) => {
    if (url.includes("essencial")) return sse({ feedback: { resumo_caso: "R" } });
    await gate; return sse({ feedback: { referencias: ["Ref"] } });
  };
  const running = academic(req("feedback", { fields: f, relato: story, stream: true, jobId }), first, { now: agora, fetchImpl, identify: async () => ({ id: "u1", headers: {}, path: (x) => x, charge: async () => (++charges, true) }), allow: () => true });
  await new Promise((r) => setTimeout(r, 20));
  first.gone = true; closeFirst?.();               // troca de app: a aba perde a conexão
  release();                                        // o servidor termina a 2ª parte mesmo assim
  await running;
  const again = streamRes();
  await academic(req("feedback-resume", { jobId }), again, { now: agora, identify: async () => ({ id: "u1", headers: {}, path: (x) => x, charge: async () => (++charges, true) }), allow: () => true });
  assert.deepEqual(events(again.out).map((e) => e.event), ["progress", "part", "progress", "part", "done"]);
  assert.equal(charges, 1);
  const other = streamRes(); other.end = function (t) { this.data = JSON.parse(t); this.ended = true; };
  await academic(req("feedback-resume", { jobId }), other, { now: agora, identify: async () => ({ id: "u2", headers: {}, path: (x) => x }), allow: () => true });
  assert.equal(other.statusCode, 404);
});

test("retrying feedback before receiving its first event reuses the active job without another charge", async () => {
  const jobId = "73109592-f35f-48db-b34f-0355f5c1eb69";
  const now = fresh();
  let charges = 0, upstreamCalls = 0, release, began;
  const blocked = new Promise(resolve => { release = resolve; });
  const started = new Promise(resolve => { began = resolve; });
  const options = {
    now, allow: () => true,
    identify: async () => ({ id: "retry-owner", headers: {}, path: x => x, charge: async () => (++charges, true) }),
    fetchImpl: async () => { upstreamCalls++; began(); await blocked; return sse({feedback:{resumo_caso:"Teste sintético"}}); },
  };
  const payload = {fields:f, relato:story, stream:true, jobId};
  const first = streamRes(); first.write = () => {}; // no event reaches the first client
  const running = academic(req("feedback", payload), first, options);
  await started;
  const replay = streamRes();
  const reconnect = academic(req("feedback", payload), replay, options);
  release();
  await Promise.all([running, reconnect]);
  assert.equal(charges, 1);
  assert.equal(upstreamCalls, 2); // essential + complementary, once each
  assert.equal(events(replay.out).at(-1).event, "done");
  await academic(req("feedback", payload), streamRes(), options);
  assert.equal(charges, 1); // completed jobs are replayed too
  const foreign = streamRes();
  await academic(req("feedback", payload), foreign, {...options, identify:async()=>({id:"other-owner",charge:async()=>assert.fail("must not charge")})});
  assert.equal(foreign.statusCode, 404);
  assert.equal(upstreamCalls, 2);
});

test("simultaneous feedback requests share admission while the quota check is pending", async () => {
  const jobId = "ee3b6da3-bf2f-4749-bc10-179702970f91";
  let charges = 0, upstreamCalls = 0, release, began;
  const gate = new Promise(resolve => { release = resolve; });
  const started = new Promise(resolve => { began = resolve; });
  const options = {
    now: fresh(), allow: () => true,
    identify: async () => ({id:"concurrent-owner", headers:{}, path:x=>x, charge:async()=>{charges++; began(); await gate; return true;}}),
    fetchImpl: async () => {upstreamCalls++; return sse({feedback:{resumo_caso:"Teste sintético"}});},
  };
  const payload = {fields:f, relato:story, stream:true, jobId};
  const first = streamRes(), second = streamRes();
  const a = academic(req("feedback", payload), first, options);
  await started;
  const b = academic(req("feedback", payload), second, options);
  await new Promise(resolve => setImmediate(resolve));
  release();
  await Promise.all([a,b]);
  assert.equal(charges, 1);
  assert.equal(upstreamCalls, 2);
  assert.deepEqual(events(first.out), events(second.out));
  assert.equal(events(second.out).at(-1).event, "done");
});

test("pending feedback admission rejects another owner and releases failed reservations", async () => {
  for (const failure of ["denied", "unavailable"]) {
    const jobId = failure === "denied" ? "430f9ccc-7fb4-487b-9e05-90511776d601" : "430f9ccc-7fb4-487b-9e05-90511776d602";
    let charges = 0, release, began, reject = true, upstreamCalls = 0;
    const gate = new Promise(resolve => { release = resolve; });
    const started = new Promise(resolve => { began = resolve; });
    const options = {
      now:fresh(), allow:()=>true,
      identify:async()=>({id:`reservation-${failure}`,headers:{},path:x=>x,charge:async()=>{
        charges++; began(); await gate;
        if (!reject) return true;
        if (failure === "unavailable") throw Error("private database details");
        return false;
      }}),
      fetchImpl:async()=>{upstreamCalls++; return sse({feedback:{resumo_caso:"Teste sintético"}});},
    };
    const payload = {fields:f, relato:story, stream:true, jobId};
    const first = res(), second = res(), foreign = res();
    const a = academic(req("feedback",payload),first,options);
    await started;
    const b = academic(req("feedback",payload),second,options);
    await academic(req("feedback",payload),foreign,{...options,identify:async()=>({id:"foreign",charge:async()=>assert.fail("must not charge")})});
    assert.equal(foreign.statusCode,404);
    release();
    await Promise.all([a,b]);
    assert.equal(charges,1);
    assert.equal(upstreamCalls,0);
    assert.equal(first.statusCode,failure === "denied" ? 429 : 503);
    assert.deepEqual(first.data,second.data);
    assert.doesNotMatch(first.data.error,/private database/);
    reject=false;
    const retry=streamRes();
    await academic(req("feedback",payload),retry,options);
    assert.equal(charges,2);
    assert.equal(upstreamCalls,2);
    assert.equal(events(retry.out).at(-1).event,"done");
  }
});
