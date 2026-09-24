// capture-vytal-web.mjs — captura as prévias reais do Vytal Acadêmico web (repo vytal-web) para os vídeos.
// Pré-requisito: vytal-web rodando (cd vytal-web && npx vite --port 3000). Rotas /academico-preview e /coordenacao-preview não exigem login.
//   node tools/capture-vytal-web.mjs [--url=http://127.0.0.1:3000] [--frames=90] [--only=atlas,histologia,radiologia,telas]
// Saída em out/vytal-captures/ (ignorado no git): <giro>/fNNN.jpg e telas/<nome>.png
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || true]; }));
const URL = args.url || 'http://127.0.0.1:3000', N = +(args.frames || 90), OUT = 'out/vytal-captures';
const only = args.only ? String(args.only).split(',') : null, want = k => !only || only.includes(k);
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
async function open(path, w, h) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: h });
  p.on('pageerror', e => console.log('[erro]', e.message));
  await p.goto(URL + path, { waitUntil: 'networkidle0', timeout: 120000 }); await wait(9000);
  // interface sobre o 3D fica de fora do vídeo
  await p.addStyleTag({ content: '.va-scene-hint,.va-scene-tools,.va-loading{display:none!important}' });
  return p;
}
async function turn(name, path, step, w = 1080, h = 1500) {
  const p = await open(path, w, h), el = await p.$('.va-canvas'), box = await el.boundingBox(), dir = `${OUT}/${name}`;
  mkdirSync(dir, { recursive: true });
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await p.mouse.move(cx - N * step / 2, cy); await p.mouse.down();
  for (let i = 0; i < N; i++) {
    await p.mouse.move(cx - N * step / 2 + (i + 1) * step, cy); await wait(120);
    await p.screenshot({ path: `${dir}/f${String(i).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 92, clip: box });
  }
  await p.mouse.up(); await p.close(); console.log('giro', name, Math.round(box.width), 'x', Math.round(box.height));
}
if (want('atlas')) await turn('atlas', '/academico-preview/atlas', 4.2);
if (want('histologia')) await turn('histologia', '/academico-preview/histologia', 4.2);
if (want('radiologia')) {
  // o corte atravessa o tórax: o controle deslizante vai de 20% a 85% do volume
  const p = await open('/academico-preview/radiologia', 1080, 1700), dir = `${OUT}/radiologia`; mkdirSync(dir, { recursive: true });
  for (let i = 0; i < N; i++) {
    await p.evaluate(v => { const s = document.getElementById('slice'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(s, String(v)); s.dispatchEvent(new Event('input', { bubbles: true })); }, .2 + .65 * i / (N - 1));
    await wait(260); await p.screenshot({ path: `${dir}/f${String(i).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await p.close(); console.log('radiologia', N);
}
if (want('telas')) {
  mkdirSync(`${OUT}/telas`, { recursive: true });
  for (const [name, path] of [['inicio', '/academico-preview'], ['feedback', '/academico-preview/feedback'], ['coordenacao', '/coordenacao-preview/dashboard'], ['questoes', '/academico-preview/questoes']]) {
    const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await p.goto(URL + path, { waitUntil: 'networkidle0', timeout: 120000 }); await wait(8000);
    await p.screenshot({ path: `${OUT}/telas/${name}.png`, fullPage: true }); await p.close(); console.log('tela', name);
  }
}
await b.close();
