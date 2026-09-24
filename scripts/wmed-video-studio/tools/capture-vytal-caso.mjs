// capture-vytal-caso.mjs — captura o fluxo real "Novo caso → feedback" e o Assistente do Vytal Acadêmico web, quadro a quadro.
// Pré-requisitos (somente local, nada disso vai para produção):
//   1. vytal-web rodando (npx vite --port 3000) com rotas temporárias /academico-preview/novo-caso e /academico-preview/tutor;
//   2. uma API falsa em http://127.0.0.1:3001 que devolve o caso-exemplo fictício do próprio app (CASO_EXEMPLO) e uma resposta pronta do assistente.
//   node tools/capture-vytal-caso.mjs [--only=caso,ia]
// Saída: out/vytal-captures/caso/fNNN.jpg, out/vytal-captures/ia/fNNN.jpg e fases.json (índice do primeiro quadro de cada fase).
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || true]; }));
const URL = args.url || 'http://127.0.0.1:3000/academico-preview', OUT = 'out/vytal-captures';
const only = args.only ? String(args.only).split(',') : null, want = k => !only || only.includes(k);
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', headless: true, args: ['--no-sandbox'] });
async function page() {
  const p = await b.newPage(); await p.setViewport({ width: 820, height: +(args.h || 960), deviceScaleFactor: 1.32 });
  p.on('pageerror', e => console.log('[erro]', e.message));
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => { localStorage.setItem('VYTAL_ESTUDANTE_TOKEN', 'demo'); localStorage.clear(); localStorage.setItem('VYTAL_ESTUDANTE_TOKEN', 'demo'); });
  return p;
}
function recorder(p, dir) {
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  let n = 0; const fases = {};
  return {
    fase(nome) { fases[nome] = n; },
    async snap() { await p.screenshot({ path: `${dir}/f${String(n++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 90 }); },
    async type(el, txt, step = 3) { await el.focus(); for (let i = 0; i < txt.length; i += step) { await el.type(txt.slice(i, i + step)); await this.snap(); } },
    async hold(k, ms = 120) { for (let i = 0; i < k; i++) { await wait(ms); await this.snap(); } },
    done() { writeFileSync(`${dir}/fases.json`, JSON.stringify({ ...fases, total: n }, null, 1)); console.log(dir, n, 'quadros', fases); }
  };
}
const click = (p, re) => p.evaluate(s => { const r = new RegExp(s); [...document.querySelectorAll('button')].find(b => r.test(b.textContent)).click(); }, re.source);

if (want('caso')) {
  const p = await page(); await p.goto(`${URL}/novo-caso`, { waitUntil: 'networkidle0' }); await wait(1500);
  const R = recorder(p, `${OUT}/caso`);
  R.fase('contexto'); await R.hold(3);
  const [s1, s2] = await p.$$('select');
  await s1.select(await p.evaluate(s => [...s.options].find(o => /Clínica/.test(o.text)).value, s1)); await R.hold(2);
  await s2.select(await p.evaluate(s => [...s.options].find(o => /Pronto-Socorro/.test(o.text)).value, s2)); await R.hold(3);
  await click(p, /Avançar/); await wait(600);
  R.fase('descricao'); await R.hold(2);
  await click(p, /40–59/); await R.hold(2);
  const ta = await p.$$('textarea');
  await R.type(ta[0], 'Dor torácica em aperto há 1 hora');
  await R.type(ta[1], 'Dor retroesternal em aperto iniciada em repouso, irradiando para o braço esquerdo, com sudorese e náuseas.', 4);
  await R.type(ta[2], 'Hipertensão e diabetes tipo 2. Tabagista.', 4);
  await R.type(ta[5], 'PA 150/90, FC 98, FR 20, SatO2 95%.', 3);
  await R.hold(2);
  await click(p, /Avançar para sua avaliação/); await wait(600);
  R.fase('avaliacao'); await R.hold(2);
  const tb = await p.$$('textarea');
  await R.type(tb[0], '1. Síndrome coronariana aguda\n2. Dor musculoesquelética', 3);
  await R.type(tb[1], 'ECG, troponina e monitorização; analgesia e estratificação de risco.', 4);
  await R.hold(3);
  await click(p, /Receber feedback/);
  R.fase('gerando'); await R.hold(30, 200);
  await p.waitForFunction(() => /fez bem|PARA LEVAR|Pontos fortes/i.test(document.body.innerText), { timeout: 30000 }).catch(() => console.log('feedback não apareceu'));
  await wait(800);
  R.fase('feedback'); await R.hold(6);
  // rola até as hipóteses para discussão e abre a seção (ela vem recolhida)
  const hipY = await p.evaluate(() => { const s = [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)); return s.getBoundingClientRect().top + scrollY - 220; });
  for (let i = 1; i <= 20; i++) { await p.evaluate(y => scrollTo(0, y), Math.round(hipY * i / 20)); await R.hold(1, 60); }
  R.fase('hipoteses'); await p.evaluate(() => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).click()); await R.hold(14);
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  R.fase('discussao');
  for (let i = 1; i <= 30; i++) { await p.evaluate((a, b, k) => scrollTo(0, a + (b - a) * k), hipY, H, i / 30); await R.hold(1, 60); }
  await R.hold(4);
  // recortes em alta: a seção de hipóteses aberta e a comparação do raciocínio do aluno
  const el = await p.evaluateHandle(() => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).parentElement);
  await el.scrollIntoView(); await wait(300); await el.screenshot({ path: `${OUT}/caso/hipoteses.png` });
  const disc = await p.evaluateHandle(() => { const t = [...document.querySelectorAll('*')].find(x => x.children.length < 3 && /^Seu raciocínio em discussão/.test(x.textContent.trim())); let n = t; while (n && n.getBoundingClientRect().height < 200) n = n.parentElement; return n; });
  await disc.scrollIntoView(); await wait(300); await disc.screenshot({ path: `${OUT}/caso/discussao.png` });
  // tela do feedback com o cartão "Para levar deste caso" a 505 px do topo (base dos recortes ampliados do vídeo)
  await p.evaluate(() => { const c = [...document.querySelectorAll('*')].find(x => x.children.length === 0 && /PARA LEVAR DESTE CASO/i.test(x.textContent)); let n = c; while (n && getComputedStyle(n).borderRadius === '0px') n = n.parentElement; scrollTo(0, n.getBoundingClientRect().top + scrollY - 505); });
  await wait(300); await p.screenshot({ path: `${OUT}/caso/zoom.jpg`, type: 'jpeg', quality: 95 });
  R.done(); await p.close();
}
if (want('ia')) {
  const p = await page(); await p.goto(`${URL}/tutor`, { waitUntil: 'networkidle0' }); await wait(1500);
  const R = recorder(p, `${OUT}/ia`);
  R.fase('inicio'); await R.hold(4);
  const ta = await p.$('textarea');
  R.fase('pergunta'); await R.type(ta, 'Como estratificar o risco de um paciente com dor torácica no pronto-socorro?', 4);
  await R.hold(2); await click(p, /^Enviar$/);
  R.fase('resposta'); await R.hold(55, 110);
  R.fase('fim'); await R.hold(6);
  R.done(); await p.close();
}
await b.close();
