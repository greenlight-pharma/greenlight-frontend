// Quadros de conferência: node models3d/stills.mjs <cena> <t1,t2,...> [saída] [w] [h]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const puppeteer = createRequire(import.meta.url)('puppeteer-core');
const [scene = 'lungs', ts = '0', out = 'out/stills', w = '540', h = '960'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ headless: true, executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--no-proxy-server', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); p.on('pageerror', e => console.log('[erro]', e.message)); p.on('console', m => /error|warn/i.test(m.type()) && console.log('[console]', m.text().slice(0, 200)));
await p.setViewport({ width: +w, height: +h });
await p.goto(`http://127.0.0.1:3070/wmed-video-studio/models3d/view.html?scene=${scene}&w=${w}&h=${h}`);
await p.waitForFunction('window.READY === true', { timeout: 120000 });
for (const t of ts.split(',').map(Number)) {
  const t0 = Date.now(); await p.evaluate(t => window.renderAt(t), t);
  const el = await p.$('canvas'); await el.screenshot({ path: `${out}/${scene}-${String(t).replace('.', '_')}.png` });
  console.log(scene, t, (Date.now() - t0) + ' ms');
}
await b.close();
