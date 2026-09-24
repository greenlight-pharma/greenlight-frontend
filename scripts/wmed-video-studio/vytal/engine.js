// engine.js (Vytal) — motor vertical 9:16 para Reels e Stories do Vytal Acadêmico. Canvas 2D, 30 fps.
// Mesmo princípio do motor tech da WMed: cada quadro é função pura do tempo t (use hash(), nunca Math.random()).
// Formato por ?fmt=: reel (1080×1920, padrão) ou feed (1080×1350, pôster estático).
const FMT = new URLSearchParams(location.search).get('fmt') || 'reel';
const W = 1080, H = FMT === 'feed' ? 1350 : 1920, FPS = 30, TAU = Math.PI * 2;

// Tokens do site do Vytal Acadêmico (academico/design.css) + as cores do símbolo da marca.
const C = {
  navy: '#0F1F3A', deep: '#081E3D', night: '#050F22', blue: '#1E6091', sky: '#7ACCED', pale: '#C7D8EA', mist: '#E7F0FA',
  teal: '#2BB3A3', gold: '#C9A227', white: '#FFFFFF', ink: '#0F1F3A', muted: '#9FB3CC'
};
const F = { sans: '"Instrument Sans", system-ui, sans-serif', serif: '"Instrument Serif", Georgia, serif' };

// ---------- tempo ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const expoOut = x => { x = clamp(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
const backOut = x => { x = clamp(x); const s = 1.5; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// ---------- primitivas ----------
let X = null;
function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); X.beginPath(); X.roundRect(x, y, w, h, r); }
// texto com *destaque* em serifa itálica (como o "vira estudo." do site), quebra por largura e revelação por linha
function text(s, x, y, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return { h: 0, w: 0 };
  const size = o.size || 40, weight = o.weight || 500, lh = (o.lh || 1.12) * size;
  const fontOf = acc => acc && o.serifAccent !== false ? `italic 400 ${size * 1.08}px ${F.serif}` : `${weight} ${size}px ${F.sans}`;
  X.save(); X.textBaseline = 'middle';
  const measure = str => { let w = 0; str.split('*').forEach((p, j) => { X.font = fontOf(j % 2); X.letterSpacing = (j % 2 ? 0 : (o.ls ?? -size * .03)) + 'px'; w += X.measureText(p).width; }); return w; };
  const lines = [];
  for (const para of String(s).split('\n')) {
    let cur = '';
    for (const w of para.split(' ')) { const test = cur ? cur + ' ' + w : w; if (o.maxW && measure(test) > o.maxW && cur) { lines.push(cur); cur = w; } else cur = test; }
    lines.push(cur);
  }
  let open = false, maxw = 0;
  const fixed = lines.map(l => { const pre = open ? '*' : ''; if (((l.match(/\*/g) || []).length) % 2) open = !open; return pre + l + (open ? '*' : ''); });
  fixed.forEach((l, i) => {
    const r = o.reveal == null ? 1 : expoOut(clamp(o.reveal * (1 + fixed.length * .3) - i * .3));
    if (r <= .005) return;
    const wt = measure(l); maxw = Math.max(maxw, wt);
    let cx = o.align === 'center' ? x - wt / 2 : o.align === 'right' ? x - wt : x;
    const cy = y + i * lh + (1 - r) * size * .5;
    X.globalAlpha = a * r;
    l.split('*').forEach((part, j) => {
      if (!part) return;
      X.font = fontOf(j % 2); X.letterSpacing = (j % 2 ? 0 : (o.ls ?? -size * .03)) + 'px';
      X.fillStyle = j % 2 ? (o.accent || C.sky) : (o.color || C.white);
      if (o.glow) { X.shadowColor = rgba(C.sky, .45); X.shadowBlur = o.glow; }
      X.fillText(part, cx, cy); cx += X.measureText(part).width;
    });
  });
  X.restore();
  return { h: fixed.length * lh, w: maxw };
}
// rótulo em caixa-alta espaçado, com ponto
function eyebrow(x, y, label, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  X.save(); X.globalAlpha = a; X.font = `600 ${o.size || 24}px ${F.sans}`; X.letterSpacing = (o.ls ?? 5) + 'px'; X.textBaseline = 'middle';
  const w = X.measureText(label.toUpperCase()).width + (o.dot === false ? 0 : 26);
  let x0 = o.align === 'center' ? x - w / 2 : x;
  if (o.dot !== false) { X.beginPath(); X.arc(x0 + 7, y, 7, 0, TAU); X.fillStyle = o.dotCol || C.teal; X.shadowColor = o.dotCol || C.teal; X.shadowBlur = 16; X.fill(); X.shadowBlur = 0; x0 += 26; }
  X.fillStyle = o.color || C.pale; X.fillText(label.toUpperCase(), x0, y); X.restore();
}
// cartão de vidro sobre o fundo escuro
function glass(x, y, w, h, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  X.save(); X.globalAlpha *= a;
  rr(x, y, w, h, o.r ?? 36);
  X.shadowColor = 'rgba(0,0,0,.35)'; X.shadowBlur = 60; X.shadowOffsetY = 24;
  const g = X.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, rgba('#FFFFFF', o.fillA ?? .09)); g.addColorStop(1, rgba('#FFFFFF', (o.fillA ?? .09) * .35));
  X.fillStyle = g; X.fill(); X.shadowColor = 'transparent';
  X.lineWidth = 2; const s = X.createLinearGradient(x, y, x + w, y + h); s.addColorStop(0, rgba(C.sky, .55)); s.addColorStop(.5, rgba('#FFFFFF', .12)); s.addColorStop(1, rgba(C.teal, .35));
  X.strokeStyle = o.stroke || s; X.stroke();
  X.restore();
}
function pill(x, y, label, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return 0;
  const size = o.size || 30, padX = size * .95, hgt = size * 2.2;
  X.save(); X.font = `${o.weight || 600} ${size}px ${F.sans}`; X.letterSpacing = '0px';
  const w = X.measureText(label).width + padX * 2 + (o.dot ? size * .95 : 0), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  X.globalAlpha = a;
  rr(x0, y - hgt / 2, w, hgt, hgt / 2); X.fillStyle = o.fill || rgba('#FFFFFF', .08); X.fill();
  X.lineWidth = 2; X.strokeStyle = o.stroke || rgba(C.pale, .3); X.stroke();
  if (o.dot) { X.beginPath(); X.arc(x0 + padX + size * .22, y, size * .22, 0, TAU); X.fillStyle = o.dot; X.shadowColor = o.dot; X.shadowBlur = 14; X.fill(); X.shadowBlur = 0; }
  X.fillStyle = o.color || C.white; X.textBaseline = 'middle'; X.fillText(label, x0 + padX + (o.dot ? size * .95 : 0), y + 1);
  X.restore();
  return w;
}
// traço desenhado progressivamente
function strokePath(pts, prog = 1, o = {}) {
  if (prog <= 0 || pts.length < 2) return pts[0];
  let L = 0; const d = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(L); }
  const target = L * clamp(prog); let end = pts[0];
  X.save(); X.beginPath(); X.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    if (d[i] <= target) { X.lineTo(pts[i][0], pts[i][1]); end = pts[i]; }
    else { const f = (target - d[i - 1]) / (d[i] - d[i - 1]); end = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; X.lineTo(end[0], end[1]); break; }
  }
  X.lineWidth = o.lw || 4; X.strokeStyle = o.col || C.sky; X.lineCap = 'round'; X.lineJoin = 'round';
  if (o.glow) { X.shadowColor = o.glowCol || o.col || C.sky; X.shadowBlur = o.glow; }
  X.globalAlpha *= o.alpha ?? 1; X.stroke(); X.restore();
  return end;
}
// ícones de linha simples, centro (x, y), tamanho s
function icon(name, x, y, s, col = C.white, p = 1) {
  if (p <= 0) return;
  X.save(); X.translate(x, y); X.scale(s / 48, s / 48); X.translate(-24, -24);
  X.lineWidth = 3; X.strokeStyle = col; X.fillStyle = col; X.lineCap = 'round'; X.lineJoin = 'round'; X.setLineDash([220 * p, 440]);
  const P = d => X.stroke(new Path2D(d));
  switch (name) {
    case 'case': P('M14 6h14l8 8v26a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'); P('M28 6v8h8'); P('M18 28l5 5 9-10'); break;
    case 'brain': P('M24 10a7 7 0 0 0-13 3 7 7 0 0 0-2 12 7 7 0 0 0 7 11 6 6 0 0 0 8 2V10z'); P('M24 10a7 7 0 0 1 13 3 7 7 0 0 1 2 12 7 7 0 0 1-7 11 6 6 0 0 1-8 2'); break;
    case 'spark': P('M24 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4z'); break;
    case 'cube': P('M24 5l17 9v20l-17 9-17-9V14z'); P('M7 14l17 9 17-9M24 23v20'); break;
    case 'target': P('M24 6a18 18 0 1 0 0.01 0'); P('M24 14a10 10 0 1 0 0.01 0'); X.setLineDash([]); if (p > .8) { X.beginPath(); X.arc(24, 24, 3, 0, TAU); X.fill(); } break;
    case 'chart': P('M8 40h32M12 34V22M20 34V14M28 34V26M36 34V10'); break;
    case 'check': P('M10 25l9 9 19-20'); break;
    case 'phone': P('M16 5h16a3 3 0 0 1 3 3v32a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z'); P('M21 38h6'); break;
    case 'hands': P('M6 26l8-8 6 3 6-5 8 4 8 8'); P('M14 18l10 12a3 3 0 0 0 4-4M20 24l6 7a3 3 0 0 0 4-4M26 27l4 4a3 3 0 0 0 4-4l-8-8'); break;
  }
  X.restore();
}

// ---------- marca ----------
// Símbolo da Vytal (PNG com fundo branco): o branco vira transparente e, no fundo escuro, o traço ganha claridade.
let MARK = null;
function prepareMark(img) {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d');
  g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i], gg = p[i + 1], b = p[i + 2], white = Math.min(r, gg, b), sat = Math.max(r, gg, b) - white;
    const alpha = clamp((255 - white) / 90 + sat / 120); // quase branco → transparente
    p[i + 3] = Math.round(p[i + 3] * alpha);
    // clareia o azul-marinho para ler bem no fundo escuro, mantendo o degradê da marca
    p[i] = Math.min(255, r * 1.35 + 30); p[i + 1] = Math.min(255, gg * 1.35 + 45); p[i + 2] = Math.min(255, b * 1.25 + 60);
  }
  g.putImageData(d, 0, 0); return c;
}
function mark(cx, cy, s, o = {}) {
  if (!MARK || (o.alpha ?? 1) <= .005) return;
  X.save(); X.globalAlpha *= o.alpha ?? 1;
  if (o.glow) { X.shadowColor = rgba(C.sky, .55); X.shadowBlur = o.glow; }
  const h = s * MARK.height / MARK.width; X.drawImage(MARK, cx - s / 2, cy - h / 2, s, h); X.restore();
}

// ---------- palco: azul-marinho profundo com luzes da marca, grade de pontos e partículas ----------
const DOTS = (() => {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  for (let y = 30; y < H; y += 44) for (let x = 30; x < W; x += 44) { c.fillStyle = 'rgba(199,216,234,.07)'; c.fillRect(x, y, 2, 2); }
  return cv;
})();
function stage(t) {
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.deep); g.addColorStop(.55, C.navy); g.addColorStop(1, C.night);
  X.fillStyle = g; X.fillRect(0, 0, W, H);
  const lights = [[.85, .12, C.blue, .55, 900], [.1, .55, C.teal, .18, 700], [.6, .95, C.blue, .35, 800]];
  lights.forEach(([fx, fy, col, a, r], i) => {
    const cx = W * fx + wob(t, .03, i * .3) * 70, cy = H * fy + wob(t, .025, i * .7) * 60;
    const gl = X.createRadialGradient(cx, cy, 0, cx, cy, r); gl.addColorStop(0, rgba(col, a)); gl.addColorStop(1, rgba(col, 0));
    X.fillStyle = gl; X.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  });
  X.drawImage(DOTS, 0, 0);
  // partículas flutuando
  for (let i = 0; i < 60; i++) {
    const sp = .01 + hash(i) * .02, y = ((hash(i + 7) - t * sp) % 1 + 1) % 1 * H, x = hash(i + 3) * W + wob(t, .05, hash(i)) * 20, r = 1.2 + hash(i + 9) * 2.4;
    X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = rgba(i % 3 ? C.sky : C.teal, .18 + hash(i + 2) * .35); X.fill();
  }
}

// ---------- celular com a tela real do app ----------
function phone(img, cx, cy, h, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  const w = h * 1080 / 2400 + h * .04, r = h * .085, x = cx - w / 2, y = cy - h / 2, bez = h * .018;
  X.save(); X.globalAlpha *= a; X.translate(cx, cy); X.rotate(o.rot || 0); X.translate(-cx, -cy);
  // brilho atrás
  const gl = X.createRadialGradient(cx, cy, h * .1, cx, cy, h * .75); gl.addColorStop(0, rgba(C.sky, .28)); gl.addColorStop(1, rgba(C.sky, 0));
  X.fillStyle = gl; X.fillRect(cx - h, cy - h, 2 * h, 2 * h);
  rr(x, y, w, h, r); X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 90; X.shadowOffsetY = 40; X.fillStyle = '#0B1426'; X.fill(); X.shadowColor = 'transparent';
  X.lineWidth = 3; const s = X.createLinearGradient(x, y, x + w, y + h); s.addColorStop(0, '#6f8fb8'); s.addColorStop(.5, '#1b2c48'); s.addColorStop(1, '#4f7aa8'); X.strokeStyle = s; X.stroke();
  // tela (com rolagem opcional: o.scroll 0..1 do conteúdo)
  const sx = x + bez, sy = y + bez, sw = w - 2 * bez, sh = h - 2 * bez;
  X.save(); rr(sx, sy, sw, sh, r - bez); X.clip();
  const k = sw / img.width, ih = img.height * k, off = (ih - sh) * clamp(o.scroll || 0);
  X.drawImage(img, sx, sy - off, sw, ih);
  // reflexo diagonal
  const rf = X.createLinearGradient(sx, sy, sx + sw, sy + sh); rf.addColorStop(0, 'rgba(255,255,255,.10)'); rf.addColorStop(.35, 'rgba(255,255,255,0)'); X.fillStyle = rf; X.fillRect(sx, sy, sw, sh);
  X.restore();
  X.restore();
}

// ---------- vídeo: cenas e transições ----------
let VIDEO = null;
function video(v) { VIDEO = { tr: .7, ...v }; }
const BUF = document.createElement('canvas'); BUF.width = W; BUF.height = H;
function sceneAt(t) { const sc = VIDEO.scenes; let i = 0; while (i + 1 < sc.length && t >= sc[i + 1][0]) i++; return i; }
function drawScene(i, t, alpha, dy) {
  const sc = VIDEO.scenes, t0 = sc[i][0], end = i + 1 < sc.length ? sc[i + 1][0] : VIDEO.dur;
  if (alpha >= .999 && !dy) { sc[i][1](t, t - t0, end - t0); return; }
  const main = X, b = BUF.getContext('2d'); b.clearRect(0, 0, W, H);
  X = b; sc[i][1](t, t - t0, end - t0); X = main;
  X.save(); X.globalAlpha = alpha; X.drawImage(BUF, 0, dy); X.restore();
}
function frame(ctx, t) {
  X = ctx; X.save(); stage(t);
  const i = sceneAt(t), t0 = VIDEO.scenes[i][0], k = seg(t, t0, t0 + VIDEO.tr);
  if (i > 0 && k < 1) { if (k < .5) drawScene(i - 1, t, 1 - ease(k * 2), -ease(k * 2) * 40); else drawScene(i, t, ease(k * 2 - 1), (1 - expoOut(k * 2 - 1)) * 50); }
  else drawScene(i, t, 1, 0);
  if (VIDEO.chrome) VIDEO.chrome(t);
  X.restore();
}

// ---------- página e captura ----------
const outC = document.getElementById('out'); outC.width = W; outC.height = H; outC.style.aspectRatio = `${W} / ${H}`;
const outX = outC.getContext('2d');
window.spriteList = () => [];
window.renderAt = async (t, type = 'image/png', q = .92) => { frame(outX, t); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 4, w = 360) => {
  const h = Math.round(w * H / W), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); frame(outX, times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    c.drawImage(outC, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 90, 26); c.fillStyle = '#fff'; c.font = '16px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 18);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
const IMG = {};
const loadImg = src => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => bad(new Error('imagem não encontrada: ' + src)); i.src = src; });
(async () => {
  if (document.readyState === 'loading') await new Promise(r => addEventListener('DOMContentLoaded', r));
  await Promise.all(['500 40px "Instrument Sans"', '600 40px "Instrument Sans"', '700 40px "Instrument Sans"', 'italic 400 40px "Instrument Serif"'].map(f => document.fonts.load(f)));
  for (const [k, v] of Object.entries(VIDEO.images || {})) IMG[k] = await loadImg(v);
  if (IMG.mark) MARK = prepareMark(IMG.mark);
  window.ready = true;
  if (!location.search.includes('render')) {
    const s = document.getElementById('scrub'), lab = document.getElementById('tt'); s.max = VIDEO.dur;
    const go = () => { const t0 = performance.now(); frame(outX, +s.value); lab.textContent = `${(+s.value).toFixed(2)} s · ${Math.round(performance.now() - t0)} ms`; };
    s.addEventListener('input', go); s.value = +(new URLSearchParams(location.search).get('t') || 0); go();
  }
})();
