// core.js — motor de pintura dos resumos WMed.
// Cada quadro é uma função pura do tempo t (s): os quadros são renderizados em paralelo e fora de ordem.
// Nada de Math.random() nem estado entre quadros; use hash(i) para aleatoriedade estável e jit(a) para o "tremor" do traço.
const W = 1920, H = 1080, FPS = 24, BOIL = 10, TAU = Math.PI * 2;

// Paleta WMed: papel quente + verde-água da marca + cores clínicas suaves.
const PAL = {
  paper: '#F5EFE2', ink: '#1D2A31', navy: '#12303A', teal: '#2A8580', mint: '#8AD6C6', mintLt: '#CDEFE6',
  rose: '#D6536B', roseLt: '#F2A7B3', coral: '#E47B5B', ochre: '#E2A33B', ochreLt: '#F4D38F',
  sap: '#6BA05A', sapLt: '#B9DAA6', indigo: '#34508A', sky: '#8EC3E6', violet: '#7B62A8', cream: '#FFF9EC', blood: '#B83248'
};

// ---------- matemática e tempo ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const backOut = x => { x = clamp(x); const s = 1.7; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
const seg = (t, a, b) => clamp((t - a) / (b - a));
const frac = x => x - Math.floor(x);
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const jit = a => (random() * 2 - 1) * a;
// batimento: 1 no início de cada ciclo e decai (bpm padrão 72)
const beat = (t, bpm = 72, k = 7) => Math.exp(-frac(t * bpm / 60) * k);
// entrada/saída de um elemento que aparece em a e some em b
const inOut = (t, a, b, fi = .45, fo = .35) => Math.min(easeOut(seg(t, a, a + fi)), 1 - ease(seg(t, b - fo, b)));
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
    return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
  }
  return keys[keys.length - 1][1];
}
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}

// ---------- câmera (um nível; sempre feche com camEnd) ----------
let CAM = null;
function camBegin(cx = W / 2, cy = H / 2, zoom = 1, rot = 0) { push(); translate(W / 2, H / 2); rotate(rot); scale(zoom); translate(-cx, -cy); CAM = { cx, cy, zoom, rot }; }
function camEnd() { pop(); CAM = null; }
function toScreen(x, y) {
  if (!CAM) return [x, y];
  const c = Math.cos(CAM.rot), s = Math.sin(CAM.rot), dx = (x - CAM.cx) * CAM.zoom, dy = (y - CAM.cy) * CAM.zoom;
  return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c];
}

// ---------- geometria ----------
function rectPts(x, y, w, h, j = 0) {
  return [[x + jit(j), y + jit(j)], [x + w / 2 + jit(j), y + jit(j) * .5], [x + w + jit(j), y + jit(j)], [x + w + jit(j) * .5, y + h / 2],
    [x + w + jit(j), y + h + jit(j)], [x + w / 2 + jit(j), y + h + jit(j) * .5], [x + jit(j), y + h + jit(j)], [x + jit(j) * .5, y + h / 2]];
}
function ellPts(cx, cy, rx, ry, n = 28, j = 0, rot = 0) {
  const p = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; p.push([cx + Math.cos(a) * rx + jit(j), cy + Math.sin(a) * ry + jit(j)]); } return p;
}
function rrPts(x, y, w, h, r, j = 0) {
  r = Math.min(r, w / 2, h / 2);
  const p = [], corner = (cx, cy, a0) => { for (let i = 0; i <= 5; i++) { const a = a0 + i / 5 * Math.PI / 2; p.push([cx + Math.cos(a) * r + jit(j), cy + Math.sin(a) * r + jit(j)]); } };
  corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
  return p;
}
function starPts(cx, cy, r, inner = .42, n = 5, rot = -Math.PI / 2) {
  const p = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r * inner : r; p.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); } return p;
}
function heartPts(cx, cy, r, n = 40) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, x = 16 * Math.pow(Math.sin(a), 3), y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a); p.push([cx + x * r / 16, cy - y * r / 16]); } return p;
}
const movePts = (pts, dx, dy) => pts.map(p => [p[0] + dx, p[1] + dy]);

// ---------- pintura ----------
// paint(pts, o): uma forma. wash = cor chapada; fill = aquarela com borda que sangra; hatch = hachura; ink = contorno (null = sem).
// Sem GPU, a aquarela (fill) custa ~2 s por forma: fora do cozimento de sprites ela vira lavagem chapada.
// Manchas de aquarela de verdade vêm de sprites pré-pintados (defSprite/stain).
let BAKING = false;
function paint(pts, o = {}) {
  if (o.fill && !BAKING) o = { ...o, wash: o.wash || o.fill, washOp: o.wash ? o.washOp : (o.fillOp ?? 160) * .7, fill: null };
  if (o.wash || o.fill || o.hatch) {
    if (o.wash) brush.wash(o.wash, o.washOp ?? 255); else brush.noWash();
    if (o.fill) { brush.fill(o.fill, o.fillOp ?? 160); brush.fillBleed(o.bleed ?? .1); brush.fillTexture(o.tex ?? .4, o.border ?? .35); } else brush.noFill();
    if (o.hatch) { brush.hatch(o.hatch.d, o.hatch.a, o.hatch.o || { rand: .15 }); brush.hatchStyle(o.hatch.b || 'HB', o.hatch.c || PAL.ink, o.hatch.w || 1); } else brush.noHatch();
    brush.noStroke();
    if (o.curv) { brush.beginShape(o.curv); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true); }
    else brush.polygon(pts);
  }
  if (o.ink !== null) {
    brush.noWash(); brush.noFill(); brush.noHatch(); brush.set(o.br || 'ink', o.ink || PAL.ink, o.sw ?? 1);
    brush.beginShape(o.curv || 0); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true);
  }
}
function inkLine(pts, sw = 1, col = PAL.ink, br = 'ink', curv = .5) { brush.noFill(); brush.noWash(); brush.noHatch(); brush.set(br, col, sw); brush.spline(pts, curv); }
function arrow(x0, y0, x1, y1, sw = 1.4, col = PAL.ink, head = 26) {
  inkLine([[x0, y0], [(x0 + x1) / 2 + jit(3), (y0 + y1) / 2 + jit(3)], [x1, y1]], sw, col, 'ink', .4);
  const a = Math.atan2(y1 - y0, x1 - x0);
  inkLine([[x1 - Math.cos(a - .5) * head, y1 - Math.sin(a - .5) * head], [x1, y1], [x1 - Math.cos(a + .5) * head, y1 - Math.sin(a + .5) * head]], sw, col, 'ink', 0);
}
// "cartão" de papel com sombra aquarelada — base de quase todo texto
function card(x, y, w, h, o = {}) {
  const r = o.r ?? 28;
  if (o.shadow !== false) paint(rrPts(x + 12, y + 16, w, h, r, 2), { wash: PAL.ink, washOp: 34, ink: null });
  paint(rrPts(x, y, w, h, r, 2.5), { wash: o.tint ? mixCol(o.col || PAL.cream, o.tint, (o.tintOp ?? 40) / 400) : o.col || PAL.cream, washOp: o.op ?? 255, ink: o.ink ?? PAL.ink, sw: o.sw ?? 1.1 });
}

// ---------- sprites de aquarela ----------
// defSprite(key, w, h, fn): fn(cx, cy) pinta com aquarela de verdade numa área w×h sobre branco, uma vez no setup.
// stain(key, x, y, o) aplica o sprite em multiply (branco = transparente), como uma veladura sobre o papel.
// Desenhe as manchas antes de outras pinceladas do quadro (o p5.brush adia traços; imagens entram na hora).
// Sprites são pintados em meia resolução (res) e ampliados ao aplicar; a aquarela é macia, a perda não aparece.
// O render.mjs guarda os sprites em out/<tema>/sprites e os reaproveita entre abas e execuções.
const SPRITE_DEFS = [], SPRITES = {};
function defSprite(key, w, h, fn, res = .5) { SPRITE_DEFS.push({ key, w, h, fn, res }); }
function strSeed(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 1000003; return h; }
const spriteSig = d => String(strSeed(d.key + d.w + 'x' + d.h + d.res + d.fn.toString()));
function bakeSprite(d) {
  BAKING = true;
  background(255); push(); translate(-W / 2, -H / 2); scale(d.res);
  randomSeed(strSeed(d.key)); brush.seed(strSeed(d.key));
  d.fn(d.w / 2, d.h / 2);
  flushBrush(); pop();
  const img = get(0, 0, Math.ceil(d.w * d.res), Math.ceil(d.h * d.res));
  img.res = d.res; BAKING = false;
  return img;
}
// sprites prontos (window.SPRITE_URLS = { key: url }) são carregados; os que faltam são pintados agora
async function loadSprites() {
  const urls = window.SPRITE_URLS || {};
  for (const d of SPRITE_DEFS) {
    if (urls[d.key]) { SPRITES[d.key] = await loadImage(urls[d.key]); SPRITES[d.key].res = d.res; }
    else if (!location.search.includes('nobake')) SPRITES[d.key] = bakeSprite(d);
  }
}
window.spriteList = () => SPRITE_DEFS.map(d => ({ key: d.key, sig: spriteSig(d) }));
window.bakeOne = key => { const d = SPRITE_DEFS.find(q => q.key === key), img = bakeSprite(d); img.loadPixels(); return img.canvas.toDataURL('image/png'); };
function stain(key, x, y, o = {}) {
  const img = SPRITES[key]; if (!img) return;
  push(); blendMode(MULTIPLY); imageMode(CENTER); translate(x, y); if (o.rot) rotate(o.rot); scale((o.s ?? 1) / (img.res || 1), (o.sy ?? o.s ?? 1) / (img.res || 1));
  if (o.alpha != null && o.alpha < 1) tint(255, 255 * clamp(o.alpha));
  image(img, 0, 0); pop(); blendMode(BLEND); imageMode(CORNER);
}
// força o p5.brush a compor agora o que está pendente (um preenchimento minúsculo fora da tela)
function flushBrush() {
  push(); resetMatrix(); translate(-W / 2, -H / 2);
  brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0);
  brush.polygon([[-50, -50], [-40, -50], [-40, -40]]); brush.noFill(); pop();
}

// ---------- texto ----------
// Texto é composto em canvas 2D (nítido) e fundido na pintura em flushText(). Marcação: *trecho* = cor de destaque.
// o: size, font ('title' | 'body' | 'hand'), color, hl (cor do destaque), align, maxW, lh, pop (0..1 com overshoot),
//    alpha, rot, type (0..1: revela como máquina de escrever), weight.
let TEXTS = [];
const FONTS = { title: '"Permanent Marker"', body: '"Shantell Sans"', hand: '"Shantell Sans"' };
function txt(s, x, y, o = {}) {
  let size = o.size || 48, rot = o.rot || 0;
  if (CAM && !o.screen) { [x, y] = toScreen(x, y); size *= CAM.zoom; rot += CAM.rot; }
  TEXTS.push({ s: String(s), x, y, ...o, size, rot, maxW: o.maxW && CAM && !o.screen ? o.maxW * CAM.zoom : o.maxW });
}
function fontOf(T) { const f = T.font || 'body'; return f === 'title' ? `${T.size}px ${FONTS.title}, cursive` : `${T.weight || 800} ${T.size}px ${FONTS.body}, sans-serif`; }
// quebra em linhas preservando a marcação *…*
function layoutLines(c, T) {
  c.font = fontOf(T);
  const paras = T.s.split('\n'), lines = [];
  for (const para of paras) {
    const words = para.split(' '); let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (T.maxW && c.measureText(test.replace(/\*/g, '')).width > T.maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    }
    lines.push(cur);
  }
  // o destaque atravessa quebras de linha: fecha e reabre a marcação
  let open = false;
  return lines.map(l => { const pre = open ? '*' : ''; const n = (l.match(/\*/g) || []).length; if (n % 2) open = !open; return pre + l + (open ? '*' : ''); });
}
function drawTexts(c, list) {
  for (const T of list) {
    const k = T.pop != null ? backOut(T.pop) : 1; if (k <= .01 || (T.alpha ?? 1) <= .01) continue;
    const lines = layoutLines(c, T), lh = (T.lh || 1.22) * T.size, align = T.align || 'center';
    const total = lines.reduce((n, l) => n + l.replace(/\*/g, '').length, 0);
    let budget = T.type != null ? Math.floor(clamp(T.type) * total) : Infinity;
    c.save(); c.translate(T.x, T.y); c.rotate(T.rot); c.scale(k, k); c.globalAlpha = clamp(T.alpha ?? 1);
    c.font = fontOf(T); c.textBaseline = 'middle'; c.textAlign = 'left';
    lines.forEach((l, i) => {
      const parts = l.split('*'), plain = l.replace(/\*/g, ''), wTot = c.measureText(plain).width;
      let x = align === 'center' ? -wTot / 2 : align === 'right' ? -wTot : 0; const y = (i - (lines.length - 1) / 2) * lh;
      parts.forEach((p, j) => {
        if (budget <= 0 || !p) return;
        const show = p.slice(0, Math.max(0, budget)); budget -= p.length;
        const hl = j % 2 === 1, col = hl ? (T.hl || PAL.rose) : (T.color || PAL.ink);
        if (T.shadow) { c.fillStyle = T.shadow; c.fillText(show, x + T.size * .04, y + T.size * .05); }
        if (hl && T.marker) { const mw = c.measureText(show).width; c.fillStyle = T.marker; c.globalAlpha *= .55; c.fillRect(x - 4, y - T.size * .08, mw + 8, T.size * .52); c.globalAlpha = clamp(T.alpha ?? 1); }
        c.fillStyle = col; c.fillText(show, x, y);
        x += c.measureText(p).width;
      });
    });
    c.restore();
  }
}
// funde o texto na tela WebGL agora, para que pinturas posteriores (transições) o cubram
let txtG = null;
function flushText() {
  if (!TEXTS.length) return;
  txtG.clear(); drawTexts(txtG.drawingContext, TEXTS); TEXTS = [];
  flushBrush();
  push(); resetMatrix(); translate(-W / 2, -H / 2); image(txtG, 0, 0); pop();
}

// ---------- papel ----------
function lcg(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
let paperG = null, grainC = null, outC = null, outX = null;
function makePaper() {
  const g = createGraphics(W, H); g.pixelDensity(1); const c = g.drawingContext, rnd = lcg(19);
  c.fillStyle = PAL.paper; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { const x = rnd() * W, y = rnd() * H, r = 140 + rnd() * 380, gr = c.createRadialGradient(x, y, 0, x, y, r), a = .04 * rnd(); gr.addColorStop(0, `rgba(120,150,140,${a})`); gr.addColorStop(1, 'rgba(120,150,140,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  c.lineWidth = 1;
  for (let i = 0; i < 1200; i++) { const x = rnd() * W, y = rnd() * H, l = 6 + rnd() * 24, a = rnd() * TAU; c.strokeStyle = `rgba(90,90,70,${.03 + rnd() * .05})`; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + .6) * l * .5, y + Math.sin(a + .6) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  return g;
}
function makeGrain() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), rnd = lcg(7);
  const id = c.createImageData(W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = 255 - (rnd() < .5 ? rnd() * rnd() * 30 : 0); d[i] = v - 1; d[i + 1] = v; d[i + 2] = v - 2; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  const g = c.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, H * 1.08); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(70,95,90,.28)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return cv;
}
function defineBrushes() {
  brush.add('ink', { type: 'default', weight: 5, scatter: .25, sharpness: .8, grain: 40, opacity: 235, spacing: .2, pressure: [1.15, .75], rotate: 'natural', noise: .15 });
  brush.add('inkfine', { type: 'default', weight: 2.6, scatter: .15, sharpness: .85, grain: 40, opacity: 230, spacing: .2, pressure: [1.1, .8], rotate: 'natural', noise: .1 });
  brush.add('dry', { type: 'default', weight: 14, scatter: 3, sharpness: .3, grain: 6, opacity: 90, spacing: .6, pressure: [1, .6], rotate: 'natural', noise: .4 });
}

// ---------- quadro ----------
let T = 0;
async function setup() {
  createCanvas(W, H, WEBGL); pixelDensity(1); noLoop();
  brush.scaleBrushes(5); defineBrushes();
  paperG = makePaper(); grainC = makeGrain(); txtG = createGraphics(W, H); txtG.pixelDensity(1);
  await loadSprites();
  outC = document.getElementById('out'); outX = outC.getContext('2d');
  await Promise.all([document.fonts.load('100px "Permanent Marker"'), document.fonts.load('800 50px "Shantell Sans"'), document.fonts.load('700 50px "Shantell Sans"')]);
  window.ready = true;
  if (!location.search.includes('render')) devUI();
}
function draw() {
  if (!window.ready) return;
  TEXTS = []; CAM = null;
  push(); translate(-W / 2, -H / 2);
  randomSeed(1000 + Math.floor(T * BOIL)); brush.seed(1000 + Math.floor(T * BOIL)); noiseSeed(77);
  image(paperG, 0, 0);
  drawWorld(T);
  pop();
}
function composite() {
  const c = outX;
  c.globalCompositeOperation = 'source-over'; c.drawImage(drawingContext.canvas, 0, 0, W, H);
  drawTexts(c, TEXTS);
  c.globalCompositeOperation = 'multiply'; c.drawImage(grainC, 0, 0);
  c.globalCompositeOperation = 'source-over';
}
window.renderAt = async (t, type = 'image/png', q = .92) => { T = t; await redraw(); composite(); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640) => {
  const h = Math.round(w * 9 / 16), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); T = times[i]; await redraw(); composite(); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    c.drawImage(outC, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 90, 26); c.fillStyle = '#fff'; c.font = '16px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 18);
  }
  return { url: sc.toDataURL('image/jpeg', .88), ms };
};
function devUI() {
  const s = document.getElementById('scrub'), lab = document.getElementById('tt');
  s.max = VIDEO.dur;
  let busy = false, want = null;
  const go = async () => { if (busy) return; busy = true; while (want != null) { const t = want; want = null; const t0 = performance.now(); await window.renderAt(t); lab.textContent = `${t.toFixed(2)} s · ${Math.round(performance.now() - t0)} ms/quadro`; } busy = false; };
  s.addEventListener('input', () => { want = +s.value; go(); });
  want = +(new URLSearchParams(location.search).get('t') || 0); s.value = want; go();
}
