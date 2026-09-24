// engine.js — motor "tech" dos resumos WMed: Canvas 2D puro (sem p5), vetores nítidos, visual do app WMed.
// Cada quadro é uma função pura do tempo t: nada de Math.random() nem estado entre quadros (use hash()).
const W = 1920, H = 1080, FPS = 30, TAU = Math.PI * 2;

// Tokens do app WMed (scripts/wmed-app/src/*.css) + as duas cores do símbolo da marca.
const C = {
  bg: '#F6F7F8', page: '#FFFFFF', ink: '#202329', ink2: '#414954', muted: '#656B75', faint: '#ACB3BE', line: '#E4E6E9',
  blue: '#246BFD', cyan: '#35C5D4', navy: '#081C35', red: '#E5484D', amber: '#F5A524', orange: '#F76B15', green: '#30A46C', violet: '#6E56CF'
};
const F = { sans: 'Jakarta, system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace' };

// ---------- tempo ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const expoOut = x => { x = clamp(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); };
const backOut = x => { x = clamp(x); const s = 1.4; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
// entrada (a) e saída (b) de um elemento: 0..1
const vis = (t, a, b = 1e9, fi = .6, fo = .4) => Math.min(expoOut(seg(t, a, a + fi)), 1 - ease(seg(t, b - fo, b)));
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return lerp(va, vb, e((t - a) / (b - a))); }
  return keys[keys.length - 1][1];
}
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const mm = s => { s = Math.max(0, s); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };

// ---------- primitivas ----------
let X = null; // contexto 2D ativo
function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); X.beginPath(); X.roundRect(x, y, w, h, r); }
// painel branco com borda fina e sombra suave (o "card" do app)
function panel(x, y, w, h, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  X.save(); X.globalAlpha *= a;
  rr(x, y, w, h, o.r ?? 22);
  X.shadowColor = o.shadowCol || 'rgba(16,24,40,.08)'; X.shadowBlur = o.blur ?? 40; X.shadowOffsetY = o.dy ?? 14;
  X.fillStyle = o.fill || C.page; X.fill();
  X.shadowColor = 'transparent';
  if (o.stroke !== false) { X.lineWidth = o.lw || 1.5; X.strokeStyle = o.stroke || C.line; X.stroke(); }
  X.restore();
}
// texto com *destaque*, quebra por largura e revelação por linha (sobe e aparece)
function text(s, x, y, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return { h: 0, w: 0 };
  const size = o.size || 32, weight = o.weight || 400, font = `${weight} ${size}px ${o.mono ? F.mono : F.sans}`, lh = (o.lh || 1.2) * size;
  X.save(); X.font = font; X.letterSpacing = (o.ls ?? (size > 60 ? -size * .035 : size > 30 ? -size * .015 : 0)) + 'px'; X.textBaseline = 'middle';
  const lines = [];
  for (const para of String(s).split('\n')) {
    let cur = '';
    for (const w of para.split(' ')) { const test = cur ? cur + ' ' + w : w; if (o.maxW && X.measureText(test.replace(/\*/g, '')).width > o.maxW && cur) { lines.push(cur); cur = w; } else cur = test; }
    lines.push(cur);
  }
  let open = false, maxw = 0;
  const fixed = lines.map(l => { const pre = open ? '*' : ''; if (((l.match(/\*/g) || []).length) % 2) open = !open; return pre + l + (open ? '*' : ''); });
  fixed.forEach((l, i) => {
    const r = o.reveal == null ? 1 : expoOut(clamp(o.reveal * (1 + fixed.length * .25) - i * .25));
    if (r <= .005) return;
    const plain = l.replace(/\*/g, ''), wt = X.measureText(plain).width; maxw = Math.max(maxw, wt);
    let cx = o.align === 'center' ? x - wt / 2 : o.align === 'right' ? x - wt : x;
    const cy = y + i * lh + (1 - r) * size * .45;
    X.globalAlpha = a * r;
    l.split('*').forEach((part, j) => {
      if (!part) return;
      X.fillStyle = j % 2 ? (o.accent || C.blue) : (o.color || C.ink);
      X.fillText(part, cx, cy); cx += X.measureText(part).width;
    });
  });
  X.restore();
  return { h: fixed.length * lh, w: maxw };
}
// pílula contornada (botões do app); o.fill para preenchida
function pill(x, y, label, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return 0;
  const size = o.size || 22, padX = size * .9, hgt = size * 2.1;
  X.save(); X.font = `${o.weight || 600} ${size}px ${o.mono ? F.mono : F.sans}`; X.letterSpacing = (o.ls ?? 0) + 'px';
  const w = X.measureText(label).width + padX * 2 + (o.dot ? size * .9 : 0), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  X.globalAlpha = a;
  rr(x0, y - hgt / 2, w, hgt, hgt / 2); X.fillStyle = o.fill || C.page; X.fill();
  X.lineWidth = 1.5; X.strokeStyle = o.stroke || C.line; if (o.stroke !== false) X.stroke();
  if (o.dot) { X.beginPath(); X.arc(x0 + padX + size * .2, y, size * .2, 0, TAU); X.fillStyle = o.dot; X.fill(); }
  X.fillStyle = o.color || C.ink; X.textBaseline = 'middle'; X.fillText(label, x0 + padX + (o.dot ? size * .9 : 0), y + 1);
  X.restore();
  return w;
}
// rótulo pequeno em caixa-alta, monoespaçado
function eyebrow(x, y, label, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  X.save(); X.globalAlpha = a; X.font = `500 ${o.size || 18}px ${F.mono}`; X.letterSpacing = '3px'; X.textBaseline = 'middle';
  X.textAlign = o.align || 'left';
  if (o.dot !== false && (o.align || 'left') === 'left') { X.beginPath(); X.arc(x + 5, y, 5, 0, TAU); X.fillStyle = o.dotCol || C.blue; X.fill(); x += 22; }
  X.fillStyle = o.color || C.muted; X.fillText(label.toUpperCase(), x, y); X.restore();
}
// cabeçalho de seção: eyebrow + título + subtítulo, com revelação escalonada
function header(lt, eb, title, sub, o = {}) {
  const x = o.x ?? 120, y = o.y ?? 190, out = o.out ?? 1e9;
  const k = 1 - ease(seg(lt, out - .4, out));
  eyebrow(x, y, eb, { alpha: expoOut(seg(lt, .05, .6)) * k });
  text(title, x - 3, y + 72, { size: o.size || 76, weight: 600, reveal: seg(lt, .15, 1.2), alpha: k, accent: o.accent });
  if (sub) text(sub, x, y + 140, { size: 30, color: C.muted, alpha: expoOut(seg(lt, .6, 1.3)) * k, maxW: o.subW || 1100, accent: o.accent });
}

// traço desenhado progressivamente (0..1)
function strokePath(pts, prog = 1, o = {}) {
  if (prog <= 0 || pts.length < 2) return;
  let L = 0; const d = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(L); }
  const target = L * clamp(prog);
  X.save(); X.beginPath(); X.moveTo(pts[0][0], pts[0][1]);
  let end = pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (d[i] <= target) { X.lineTo(pts[i][0], pts[i][1]); end = pts[i]; }
    else { const f = (target - d[i - 1]) / (d[i] - d[i - 1]); end = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; X.lineTo(end[0], end[1]); break; }
  }
  X.lineWidth = o.lw || 3; X.strokeStyle = o.col || C.ink; X.lineCap = 'round'; X.lineJoin = 'round';
  if (o.glow) { X.shadowColor = o.glowCol || o.col; X.shadowBlur = o.glow; }
  X.globalAlpha *= o.alpha ?? 1; X.stroke(); X.restore();
  return end;
}

// ---------- ícones de linha (estilo lucide), centro (x, y), tamanho s, progresso p ----------
function icon(name, x, y, s, col = C.ink, p = 1, lw = null) {
  if (p <= 0) return;
  X.save(); X.translate(x, y); X.scale(s / 48, s / 48); X.translate(-24, -24);
  X.lineWidth = lw || 2.6; X.strokeStyle = col; X.fillStyle = col; X.lineCap = 'round'; X.lineJoin = 'round';
  X.setLineDash([200 * p, 400]);
  const P = d => X.stroke(new Path2D(d));
  switch (name) {
    case 'steth': P('M11 6v10a7 7 0 0 0 14 0V6'); P('M11 6h-2M25 6h2'); P('M18 23v4a9 9 0 0 0 18 0v-5'); X.setLineDash([]); if (p > .8) { X.beginPath(); X.arc(36, 19, 3.5, 0, TAU); X.stroke(); } break;
    case 'echo': P('M6 10h36v24H6z'); P('M16 40h16M24 34v6'); P('M12 26l5-8 5 11 4-7 3 4h7'); break;
    case 'tube': P('M18 6h12M20 6v30a4 4 0 0 0 8 0V6'); P('M20 22h8'); break;
    case 'drop': P('M24 6c6 8 12 15 12 22a12 12 0 0 1-24 0c0-7 6-14 12-22z'); P('M19 30a5 5 0 0 0 5 5'); break;
    case 'heart': P('M24 40S7 30 7 18a8.5 8.5 0 0 1 17-3 8.5 8.5 0 0 1 17 3c0 12-17 22-17 22z'); break;
    case 'pulse': P('M4 26h9l4-10 6 20 5-14 3 4h13'); break;
    case 'alert': P('M24 7L43 40H5z'); P('M24 19v10'); X.setLineDash([]); if (p > .8) { X.beginPath(); X.arc(24, 34.5, 1.8, 0, TAU); X.fill(); } break;
    case 'check': P('M10 25l9 9 19-20'); break;
    case 'x': P('M13 13l22 22M35 13L13 35'); break;
    case 'shield': P('M24 5l15 6v11c0 10-7 17-15 20-8-3-15-10-15-20V11z'); P('M17 24l5 5 9-10'); break;
    case 'pill': P('M17 31l14-14a7 7 0 0 0-10-10L7 21a7 7 0 0 0 10 10z'); P('M14 14l10 10'); break;
    case 'beat': P('M24 40S7 30 7 18a8.5 8.5 0 0 1 17-3 8.5 8.5 0 0 1 17 3c0 12-17 22-17 22z'); P('M11 24h7l3-5 4 9 3-4h9'); break;
    case 'flask': P('M19 6h10M21 6v12L10 38a3 3 0 0 0 3 4h22a3 3 0 0 0 3-4L27 18V6'); P('M14 31h20'); break;
    case 'stairs': P('M6 40h10v-9h9v-9h9v-9h8'); break;
    case 'down': P('M24 8v30M12 27l12 12 12-12'); break;
    case 'vessel': P('M4 17c10-2 30-2 40 0M4 31c10 2 30 2 40 0'); X.setLineDash([]); if (p > .6) { X.beginPath(); X.ellipse(24, 19.5, 6, 3.8, 0, 0, TAU); X.fillStyle = rgba(C.amber, .9); X.fill(); } break;
  }
  X.restore();
}
// círculo tingido com ícone dentro
function badge(name, x, y, r, col, a = 1, p = 1) {
  if (a <= .005) return;
  X.save(); X.globalAlpha *= a;
  X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = rgba(col, .1); X.fill();
  X.lineWidth = 1.5; X.strokeStyle = rgba(col, .25); X.stroke();
  icon(name, x, y, r * 1.05, col, p);
  X.restore();
}

// ---------- marca ----------
const MARK = BRAND.mark.map(m => ({ fill: m.fill, p: new Path2D(m.d) }));
// logo do app: quadrado escuro com o W branco (s = lado do quadrado)
function logo(x, y, s, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  X.save(); X.globalAlpha *= a;
  rr(x, y, s, s, s * .14); X.fillStyle = o.bg || C.ink; X.fill();
  X.translate(x + s * .16, y + s * .26); X.scale(s * .68 / 150, s * .68 / 150);
  for (const m of MARK) { X.fillStyle = o.color ? (o.color === 'brand' ? m.fill : o.color) : '#FFFFFF'; X.fill(m.p); }
  X.restore();
}
function wordmark(x, y, size, o = {}) {
  text('WMed', x, y, { size, weight: 600, ls: -size * .04, color: o.color || C.ink, alpha: o.alpha });
}

// ---------- palco: fundo claro com grade de pontos e luzes suaves da marca ----------
function stage(t) {
  X.fillStyle = C.bg; X.fillRect(0, 0, W, H);
  const g = X.createRadialGradient(W * .5, H * .45, 100, W * .5, H * .45, W * .7);
  g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, rgba('#E9ECEF', 1)); X.fillStyle = g; X.fillRect(0, 0, W, H);
  // luzes da marca, derivando devagar
  for (let i = 0; i < 2; i++) {
    const cx = W * (i ? .82 : .12) + wob(t, .03, i) * 80, cy = H * (i ? .2 : .85) + wob(t, .025, i + .3) * 60, r = 620;
    const gl = X.createRadialGradient(cx, cy, 0, cx, cy, r); gl.addColorStop(0, rgba(i ? C.cyan : C.blue, .09)); gl.addColorStop(1, rgba(i ? C.cyan : C.blue, 0));
    X.fillStyle = gl; X.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  }
  X.drawImage(DOTS, 0, 0);
}
const DOTS = (() => {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  for (let y = 24; y < H; y += 40) for (let x = 24; x < W; x += 40) { c.fillStyle = 'rgba(32,35,41,.075)'; c.fillRect(x, y, 2, 2); }
  return cv;
})();

// ---------- vídeo: cenas, transições e interface fixa ----------
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
  X = ctx; X.save();
  stage(t);
  const i = sceneAt(t), t0 = VIDEO.scenes[i][0], k = seg(t, t0, t0 + VIDEO.tr);
  // a cena anterior sai (sobe e some) na primeira metade; a nova entra na segunda metade, sem textos sobrepostos
  if (i > 0 && k < 1) { if (k < .5) drawScene(i - 1, t, 1 - ease(k * 2), -ease(k * 2) * 30); else drawScene(i, t, ease(k * 2 - 1), (1 - expoOut(k * 2 - 1)) * 40); }
  else drawScene(i, t, 1, 0);
  if (!VIDEO.noChrome) chrome(t);
  X.restore();
}
// barra superior (como no app) e progresso por seções
function chrome(t) {
  const a = expoOut(seg(t, .2, 1)) * (1 - ease(seg(t, VIDEO.dur - 2.6, VIDEO.dur - 2)));
  if (a <= .005) return;
  logo(72, 44, 56, { alpha: a });
  wordmark(142, 73, 36, { alpha: a });
  pill(262, 72, VIDEO.kicker || 'Resumo ENAMED', { size: 19, alpha: a, dot: C.blue });
  X.save(); X.globalAlpha = a; X.font = `500 20px ${F.mono}`; X.textAlign = 'right'; X.textBaseline = 'middle'; X.fillStyle = C.muted;
  X.fillText(`${VIDEO.code || ''}  ${mm(t)} / ${mm(VIDEO.dur)}`, W - 72, 73); X.restore();
  // progresso
  const secs = VIDEO.sections, x0 = 72, x1 = W - 72, y = 1030, gap = 10;
  secs.forEach(([s0, name], j) => {
    const s1 = j + 1 < secs.length ? secs[j + 1][0] : VIDEO.dur, xa = lerp(x0, x1, s0 / VIDEO.dur) + (j ? gap / 2 : 0), xb = lerp(x0, x1, s1 / VIDEO.dur) - (j < secs.length - 1 ? gap / 2 : 0);
    const p = seg(t, s0, s1), on = t >= s0 && t < s1;
    X.save(); X.globalAlpha = a;
    rr(xa, y - 3, xb - xa, 6, 3); X.fillStyle = rgba(C.ink, .08); X.fill();
    if (p > 0) { rr(xa, y - 3, Math.max(6, (xb - xa) * p), 6, 3); X.fillStyle = on ? C.ink : rgba(C.ink, .55); X.fill(); }
    X.font = `500 16px ${F.mono}`; X.letterSpacing = '2px'; X.textBaseline = 'alphabetic'; X.fillStyle = on ? C.ink : C.faint;
    X.fillText(name.toUpperCase(), xa, y - 16);
    X.restore();
  });
}

// ---------- página e captura ----------
let T = 0;
const outC = document.getElementById('out'), outX = outC.getContext('2d');
window.spriteList = () => [];
window.renderAt = async (t, type = 'image/png', q = .92) => { T = t; frame(outX, t); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640) => {
  const h = Math.round(w * 9 / 16), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); frame(outX, times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    c.drawImage(outC, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 90, 26); c.fillStyle = '#fff'; c.font = '16px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 18);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
(async () => {
  await Promise.all([document.fonts.load('400 40px Jakarta'), document.fonts.load('600 40px Jakarta'), document.fonts.load(`500 20px ${F.mono}`)]);
  window.ready = true;
  if (!location.search.includes('render')) {
    const s = document.getElementById('scrub'), lab = document.getElementById('tt'); s.max = VIDEO.dur;
    const go = () => { const t0 = performance.now(); frame(outX, +s.value); lab.textContent = `${(+s.value).toFixed(2)} s · ${Math.round(performance.now() - t0)} ms`; };
    s.addEventListener('input', go); s.value = +(new URLSearchParams(location.search).get('t') || 0); go();
  }
})();
