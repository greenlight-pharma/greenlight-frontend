// render.mjs — pinta studio.html em Chrome headless e codifica o MP4.
//   node render.mjs --topic=insuficiencia-cardiaca --sheet=1,5,9 [--cols=3] [--w=640] [--out=out/check.jpg]   folha de contato
//   node render.mjs --topic=… --stills=3.5,20 [--out=out/stills]                                              quadros PNG
//   node render.mjs --topic=… --frames [--range=0:90] [--workers=4]                                           JPEGs em out/<tema>/frames (retomável)
//   node render.mjs --topic=… --encode [--audio=trilha.mp3] [--out=…/tema.mp4] [--poster=4.2]                 junta os quadros no MP4 + pôster
// Chrome: CHROME=/caminho ou --chrome=/caminho (padrão: Chromium do Playwright).
import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, renameSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
process.chdir(HERE);
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const TOPIC = args.topic || 'insuficiencia-cardiaca';
if (!/^[a-z0-9-]+$/.test(TOPIC)) throw new Error('--topic inválido');
const CHROME = args.chrome || process.env.CHROME || '/opt/pw-browsers/chromium';
const FPS = 24, FRAMES = `out/${TOPIC}/frames`, PUBLISH = resolve(HERE, '../../wmed-videos/resumos-enamed');
const run = (cmd, a) => new Promise((ok, bad) => { const p = spawn(cmd, a, { stdio: 'inherit' }); p.on('close', c => c ? bad(new Error(cmd + ' saiu com ' + c)) : ok()); });
const times = s => String(s).split(',').map(Number);

if (args.encode) {
  const out = resolve(args.out || `${PUBLISH}/${TOPIC}.mp4`), n = readdirSync(FRAMES).filter(f => f.endsWith('.jpg')).length;
  mkdirSync(dirname(out), { recursive: true });
  console.log(`codificando ${n} quadros → ${out}`);
  const a = ['-y', '-loglevel', 'error', '-stats', '-framerate', String(FPS), '-i', `${FRAMES}/f%05d.jpg`];
  if (args.audio) a.push('-i', args.audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '160k', '-shortest');
  a.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  await run(ffmpegPath, a);
  const pf = String(Math.round(+(args.poster || 4) * FPS)).padStart(5, '0'), poster = out.replace(/\.mp4$/, '-poster.jpg');
  await run(ffmpegPath, ['-y', '-loglevel', 'error', '-i', `${FRAMES}/f${pf}.jpg`, '-vf', 'scale=1280:-2', '-q:v', '4', poster]);
  console.log('gravado ' + out + ' e ' + poster);
  process.exit(0);
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 0,
  args: ['--allow-file-access-from-files', '--no-sandbox', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader',
    '--window-size=1920,1080', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
});
// sprites de aquarela: pintados uma vez e guardados em out/<tema>/sprites (refeitos só quando a definição muda)
const SPR = `out/${TOPIC}/sprites`;
let spriteUrls = {};
async function ensureSprites() {
  mkdirSync(SPR, { recursive: true });
  const man = existsSync(`${SPR}/manifest.json`) ? JSON.parse(readFileSync(`${SPR}/manifest.json`, 'utf8')) : {};
  const page = await openPage('#sprites', 'nobake'), list = await page.evaluate(() => window.spriteList());
  for (const { key, sig } of list) {
    const f = `${SPR}/${key.replace(/[^a-z0-9-]/gi, '_')}.png`;
    if (man[key] !== sig || !existsSync(f)) {
      const t0 = Date.now(), url = await page.evaluate(k => window.bakeOne(k), key);
      writeFileSync(f, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); man[key] = sig;
      writeFileSync(`${SPR}/manifest.json`, JSON.stringify(man, null, 1));
      console.log(`sprite ${key}  ${Date.now() - t0} ms`);
    }
    spriteUrls[key] = pathToFileURL(resolve(f)).href;
  }
  await page.close();
}
async function openPage(tag = '', extra = '') {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(u => { window.SPRITE_URLS = u; }, spriteUrls);
  page.on('console', m => { if (['error', 'warn'].includes(m.type())) console.log(`[página${tag}]`, m.text()); });
  page.on('pageerror', e => console.log(`[erro na página${tag}]`, e.message));
  await page.goto(pathToFileURL(resolve('studio.html')).href + `?render&topic=${TOPIC}${extra ? '&' + extra : ''}`, { waitUntil: 'load' });
  await page.waitForFunction('window.ready === true', { timeout: 0 });
  return page;
}
await ensureSprites();
const frameOf = async (page, t, type, q) => {
  const url = await page.evaluate((t, type, q) => window.renderAt(t, type, q), t, type, q);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

if (args.sheet) {
  const page = await openPage(), out = args.out || `out/${TOPIC}/sheet.jpg`; mkdirSync(dirname(out), { recursive: true });
  const { url, ms } = await page.evaluate((ts, c, w) => window.renderSheet(ts, c, w), times(args.sheet), +(args.cols || 3), +(args.w || 640));
  writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
  console.log(`${out}  ms/quadro: ${ms.join(' ')}`);
} else if (args.stills) {
  const page = await openPage(), out = args.out || `out/${TOPIC}/stills`; mkdirSync(out, { recursive: true });
  for (const s of times(args.stills)) {
    const t0 = Date.now(), buf = await frameOf(page, s, 'image/png'), f = `${out}/t${s.toFixed(2).replace('.', '_')}.png`;
    writeFileSync(f, buf); console.log(`${f}  ${Date.now() - t0} ms`);
  }
} else if (args.frames) {
  // paralelo e retomável: cada aba pega o próximo quadro que falta; arquivos gravados de forma atômica
  const probe = await openPage(), dur = await probe.evaluate(() => VIDEO.dur); await probe.close();
  const [a, b] = args.range ? String(args.range).split(':').map(Number) : [0, dur], workers = +(args.workers || 4);
  if (args.clean) rmSync(FRAMES, { recursive: true, force: true });
  mkdirSync(FRAMES, { recursive: true });
  const first = Math.round(a * FPS), last = Math.min(Math.round(dur * FPS) - 1, Math.round(b * FPS) - 1), todo = [];
  for (let i = first; i <= last; i++) { const f = `${FRAMES}/f${String(i).padStart(5, '0')}.jpg`; if (!existsSync(f) || statSync(f).size < 1000) todo.push(i); }
  console.log(`${todo.length} quadros a pintar (${last - first + 1 - todo.length} prontos), ${workers} abas`);
  let next = 0, done = 0; const start = Date.now();
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const page = await openPage('#' + w);
    while (next < todo.length) {
      const i = todo[next++], f = `${FRAMES}/f${String(i).padStart(5, '0')}.jpg`;
      const buf = await frameOf(page, i / FPS, 'image/jpeg', .93);
      writeFileSync(f + '.tmp', buf); renameSync(f + '.tmp', f);
      if (++done % 60 === 0 || done === todo.length) {
        const el = (Date.now() - start) / 1000;
        console.log(`quadro ${done}/${todo.length}  ${(el / done * 1000).toFixed(0)} ms/quadro efetivo  faltam ${((todo.length - done) * el / done / 60).toFixed(1)} min`);
      }
    }
  }));
} else {
  console.log('use --sheet, --stills, --frames ou --encode (veja o topo do arquivo)');
}
await browser.close();
