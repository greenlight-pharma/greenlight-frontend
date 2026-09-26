// capture-2doctor-tc.mjs — percorre os cortes da tomografia no módulo Radiologia do 2Doctor
// (contexto 3D à esquerda + TC axial à direita) e grava os dois painéis quadro a quadro.
//   CHROME=… node tools/capture-2doctor-tc.mjs [--url=https://www.2doctor.ai/2doctor/] [--frames=90] [--de=0.12] [--ate=0.88]
// Saída (ignorada no git): out/app-captures/tc3d/fNNN.jpg e out/app-captures/tc/fNNN.jpg
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || true]; }));
const URL = args.url || 'https://www.2doctor.ai/2doctor/', N = +(args.frames || 90), DE = +(args.de ?? .12), ATE = +(args.ate ?? .88);
const OUT = 'out/app-captures';
mkdirSync(`${OUT}/tc3d`, { recursive: true }); mkdirSync(`${OUT}/tc`, { recursive: true });

const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', headless: true,
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); await p.setViewport({ width: 1600, height: 1000 });
await p.goto(URL + '#radiologia', { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise(r => setTimeout(r, 12000));

// caixas dos dois painéis (os dois <canvas> da página)
const caixas = await p.evaluate(() => [...document.querySelectorAll('canvas')].map(c => { const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
if (caixas.length < 2) throw new Error('canvas do 3D ou da TC não encontrado');
const [c3d, ctc] = caixas;

for (let i = 0; i < N; i++) {
  const v = DE + (ATE - DE) * i / (N - 1);
  await p.evaluate(val => {
    const r = document.querySelector('input[type=range]');           // "Nível do corte"
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(r, String(val));
    r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true }));
  }, v);
  await new Promise(r => setTimeout(r, 350));
  const n = String(i).padStart(3, '0');
  await p.screenshot({ path: `${OUT}/tc3d/f${n}.jpg`, clip: c3d, type: 'jpeg', quality: 92 });
  await p.screenshot({ path: `${OUT}/tc/f${n}.jpg`, clip: ctc, type: 'jpeg', quality: 92 });
}
console.log('tc', N, 'quadros', JSON.stringify({ c3d, ctc }));
await b.close();
