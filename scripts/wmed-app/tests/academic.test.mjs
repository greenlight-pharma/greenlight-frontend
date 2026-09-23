import test from "node:test";
import assert from "node:assert/strict";
import { academic } from "../server/academic.mjs";
import {
  fields,
  rubric,
  validateQuality,
  feedbackPayload,
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
test("fabricated evidence, missing criteria, duplicate ids and ungrounded score are rejected", () => {
  for (const mutate of [
    (r) => (r.criterios[0].evidencia = "Not in source"),
    (r) => r.criterios.pop(),
    (r) => (r.criterios[0].id = "historia"),
    (r) => (r.criterios[0].evidencia = ""),
  ]) {
    const r = result();
    mutate(r);
    assert.throws(() => validateQuality(JSON.stringify(r), story));
  }
});
test("quality scores the original account, never the AI reorganization; upstream errors not hidden", async () => {
  const o = res();
  await academic(req("quality", { fields: f, relato: story }), o, {
    fetchImpl: async (url, opts) => {
      assert.ok(url.endsWith("/tutor/chat"));
      const prompt = JSON.parse(opts.body).historico[0].content;
      assert.ok(prompt.includes("<relato>\n" + story + "\n</relato>"));
      return Response.json({ resposta: JSON.stringify(result()) });
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
