// Renderiza a animação do app 2Doctor (../app-motion/index.html) quadro a quadro em Chrome headless
// e codifica em ../out/sca/app-motion.mp4 (1280x720, 30 fps). Sem custo de crédito.
//   node render-app.mjs              → vídeo inteiro
//   node render-app.mjs --stills=3,12,40   → só quadros de conferência em ../out/sca/app-stills/
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')));
// --pagina=has.html --saida=has → outro episódio (ex.: hipertensão → ../out/has/app-motion.mp4)
const PAGINA = pathToFileURL(path.join(AQUI, '..', 'app-motion', args.pagina || 'index.html')).href;
const SAIDA = path.join(AQUI, '..', 'out', args.saida || 'sca');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 30;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto(PAGINA, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const dur = await page.evaluate(() => window.duracao);

if (args.stills) {
  const dir = path.join(SAIDA, 'app-stills'); mkdirSync(dir, { recursive: true });
  for (const t of args.stills.split(',').map(Number)) {
    await page.evaluate(x => window.render(x), t);
    await page.screenshot({ path: path.join(dir, `t${String(t).replace('.', '_')}.png`) });
  }
  console.log('stills ok', args.stills, 'duração', dur);
} else {
  const n = Math.ceil(dur * FPS);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-vf', 'noise=alls=4:allf=t+u', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(SAIDA, 'app-motion.mp4')],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(x => window.render(x), i / FPS);
    ff.stdin.write(await page.screenshot({ type: 'jpeg', quality: 92 }));
    if (i % 300 === 0) console.log(`quadro ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('ok app-motion.mp4', dur.toFixed(1), 's');
}
await browser.close();
