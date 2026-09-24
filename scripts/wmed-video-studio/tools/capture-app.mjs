// capture-app.mjs — captura telas reais do app WMed para os vídeos institucionais.
// Pré-requisito: app rodando localmente (cd scripts/wmed-app && npx vite --port 5199).
//   node tools/capture-app.mjs [--url=http://localhost:5199/] [--frames=90]
// Saída em out/app-captures/ (ignorado no git):
//   <modulo>/fNNN.jpg  giro de 360° do modelo 3D (arrastando o mouse em passos iguais)
//   screens/<modulo>.png  tela inteira do módulo
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=') || true]; }));
const URL = args.url || 'http://localhost:5199/', N = +(args.frames || 90), OUT = 'out/app-captures';
// módulo e passo de arraste em px por quadro (~150° de giro em 90 quadros)
const TURN = [['genetica', 2], ['molecular', 3.6], ['microbiologia', 3]];
const SCREENS = ['caso', 'genetica', 'molecular', 'microbiologia'];

const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium', headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const open = async id => {
  const p = await b.newPage(); await p.setViewport({ width: 1600, height: 1000 });
  await p.goto(URL + '#' + id, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise(r => setTimeout(r, 9000));
  return p;
};
mkdirSync(`${OUT}/screens`, { recursive: true });
for (const id of SCREENS) { const p = await open(id); await p.screenshot({ path: `${OUT}/screens/${id}.png` }); await p.close(); console.log('tela', id); }
for (const [id, step] of TURN) {
  const p = await open(id); mkdirSync(`${OUT}/${id}`, { recursive: true });
  // maior canvas WebGL da página = palco 3D
  const box = await p.evaluate(() => { const c = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0]; const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  // recorte 4:3 centrado no palco
  const cw = Math.min(box.w, box.h * 4 / 3) * .96, ch = cw * 3 / 4, clip = { x: box.x + box.w / 2 - cw / 2, y: box.y + box.h / 2 - ch / 2, width: cw, height: ch };
  let mx = box.x + box.w * .3; const my = box.y + box.h / 2;
  await p.mouse.move(mx, my); await p.mouse.down();
  for (let i = 0; i < N; i++) {
    mx += step; await p.mouse.move(mx, my, { steps: 2 });
    if (mx > box.x + box.w * .8) { await p.mouse.up(); mx = box.x + box.w * .3; await p.mouse.move(mx, my); await p.mouse.down(); }
    await new Promise(r => setTimeout(r, 350));
    await p.screenshot({ path: `${OUT}/${id}/f${String(i).padStart(3, '0')}.jpg`, clip, type: 'jpeg', quality: 90 });
  }
  await p.mouse.up(); await p.close(); console.log('giro', id, N);
}
await b.close();
