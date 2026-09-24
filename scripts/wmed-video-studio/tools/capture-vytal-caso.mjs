// capture-vytal-caso.mjs — captura o fluxo real "Novo caso → feedback" e o Assistente do Vytal Acadêmico web, quadro a quadro.
// Pré-requisitos (somente local, nada disso vai para produção):
//   1. vytal-web rodando (npx vite --port 3000) com rotas temporárias /academico-preview/novo-caso e /academico-preview/tutor;
//   2. uma API falsa em http://127.0.0.1:3001 que devolve o caso-exemplo fictício do próprio app (CASO_EXEMPLO) e uma resposta pronta do assistente.
//   node tools/capture-vytal-caso.mjs [--only=caso,ia]
// Saída: out/vytal-captures/caso/fNNN.jpg, out/vytal-captures/ia/fNNN.jpg e fases.json (índice do primeiro quadro de cada fase),
// mais recortes em alta dos blocos do feedback (caso/key.png, bem.png, mais.png, alerta.png, hipoteses.png).
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
// cursor desenhado na página (a captura de tela não mostra o ponteiro do sistema) e destaque do cartão em foco
const cursor = p => p.evaluate(() => {
  const st = document.createElement('style'); st.textContent = `#vc{position:fixed;left:0;top:0;z-index:99999;pointer-events:none;transition:opacity .2s}#vc .r{position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;border:3px solid #1E6091;opacity:0}#vc.k .r{animation:vr .5s ease-out}@keyframes vr{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}#vc.k svg{transform:scale(.86)}.vhl{outline:3px solid #1E6091;outline-offset:2px;box-shadow:0 0 0 7px rgba(30,96,145,.14),0 12px 28px rgba(15,31,58,.16);background:#fff!important;transition:all .2s}`;
  document.head.appendChild(st);
  const c = document.createElement('div'); c.id = 'vc'; c.innerHTML = '<div class="r"></div><svg width="30" height="30" viewBox="0 0 24 24" style="transition:transform .12s;transform-origin:0 0"><path d="M3 2l17 9.5-7.3 1.8L9 20.5z" fill="#0F1F3A" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  c.style.transform = `translate(${innerWidth * .8}px,${innerHeight * .75}px)`; document.body.appendChild(c);
});
const box = (p, fn, fx = .5, arg) => p.evaluate((src, fx, arg) => { const el = eval(src)(arg), r = el.getBoundingClientRect(); return [r.left + Math.min(r.width * fx, 160), r.top + r.height / 2]; }, `(${fn})`, fx, arg);
function pointer(p, R) {
  let cur = null;
  const set = (x, y) => p.evaluate((x, y) => { document.getElementById('vc').style.transform = `translate(${x}px,${y}px)`; }, x, y);
  return {
    async move([x, y], n = 8) {
      if (!cur) cur = await p.evaluate(() => { const m = document.getElementById('vc').style.transform.match(/([\d.]+)px,\s*([\d.]+)px/); return [+m[1], +m[2]]; });
      const [x0, y0] = cur; for (let i = 1; i <= n; i++) { const k = 1 - Math.pow(1 - i / n, 3); await set(x0 + (x - x0) * k, y0 + (y - y0) * k); await R.snap(); } cur = [x, y];
    },
    async click() { await p.evaluate(() => { const c = document.getElementById('vc'); c.classList.remove('k'); void c.offsetWidth; c.classList.add('k'); }); await R.hold(3, 90); },
    hide: () => p.evaluate(() => { document.getElementById('vc').style.opacity = 0; }),
    async show() { await p.evaluate(() => { document.getElementById('vc').style.opacity = 1; }); cur = null; }
  };
}

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
  // rola até as hipóteses para discussão (a seção vem recolhida)
  const hipY = await p.evaluate(() => { const s = [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)); return s.getBoundingClientRect().top + scrollY - 200; });
  for (let i = 1; i <= 20; i++) { await p.evaluate(y => scrollTo(0, y), Math.round(hipY * i / 20)); await R.hold(1, 60); }
  // o aluno clica: cursor visível, abre a seção, passa por cada hipótese (alta, moderada, baixa) e pede a explicação de uma delas
  R.fase('hipoteses'); await cursor(p); const C = pointer(p, R);
  await C.move(await box(p, () => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)), .3), 8);
  await C.click(); await p.evaluate(() => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).click()); await R.hold(6);
  const cards = await p.evaluate(() => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).parentElement.querySelectorAll('.bg-\\[\\#f8fafc\\]').length);
  R.fase('cards');
  for (let i = 0; i < cards; i++) {
    await C.move(await box(p, i => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).parentElement.querySelectorAll('.bg-\\[\\#f8fafc\\]')[i].lastElementChild, .5, i), 7);
    await p.evaluate(i => { document.querySelectorAll('.vhl').forEach(e => e.classList.remove('vhl')); [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).parentElement.querySelectorAll('.bg-\\[\\#f8fafc\\]')[i].classList.add('vhl'); }, i);
    await R.hold(9);
  }
  R.fase('entender');
  const alvo = () => { const c = [...document.querySelectorAll('.feedback-inline-action')]; return c[c.length - 1]; };
  await C.move(await box(p, alvo, .35), 7); await C.click();
  await p.evaluate(() => { document.querySelectorAll('.vhl').forEach(e => e.classList.remove('vhl')); const c = [...document.querySelectorAll('.feedback-inline-action')]; c[c.length - 1].click(); });
  await C.hide(); await R.hold(14);
  R.fase('enviar');
  await C.show(); await C.move(await box(p, () => [...document.querySelectorAll('button')].find(b => /^Enviar$/.test(b.textContent.trim())), .5), 7); await C.click();
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => /^Enviar$/.test(b.textContent.trim())).click()); await C.hide();
  R.fase('resposta'); await R.hold(14, 150);
  await p.waitForFunction(() => /Por que importa/.test(document.body.innerText), { timeout: 10000 }).catch(() => console.log('resposta não apareceu'));
  await R.hold(18, 90);
  // recortes em alta dos blocos do feedback (cena de zoom do vídeo)
  await p.evaluate(() => document.querySelectorAll('.vhl').forEach(e => e.classList.remove('vhl')));
  const pieces = {
    key: () => document.querySelector('.feedback-takeaway'),
    bem: () => [...document.querySelectorAll('p')].find(x => x.textContent.trim() === 'O que você fez bem').parentElement,
    mais: () => [...document.querySelectorAll('p')].find(x => x.textContent.trim() === 'O que pode aprofundar').parentElement,
    alerta: () => document.querySelector('.bg-red-50'),
    hipoteses: () => [...document.querySelectorAll('summary')].find(x => /Hipóteses para discussão/.test(x.textContent)).parentElement
  };
  for (const [k, fn] of Object.entries(pieces)) { const el = await p.evaluateHandle(fn); await el.scrollIntoView(); await wait(250); await el.screenshot({ path: `${OUT}/caso/${k}.png` }); }
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
