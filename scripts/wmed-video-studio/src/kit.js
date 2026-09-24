// kit.js — peças reutilizáveis para montar qualquer resumo: fundos, títulos, selos, ícones clínicos e traçado de ECG.
// Tudo recebe o tempo explicitamente e é função pura dele.

// manchas de aquarela pré-pintadas: blob:<cor> em 3 formatos (0..2). Cores disponíveis = BLOB_COLS.
const BLOB_COLS = ['mint', 'mintLt', 'sky', 'roseLt', 'ochreLt', 'sapLt'];
for (const c of BLOB_COLS) for (let v = 0; v < 3; v++)
  defSprite(`blob:${c}:${v}`, 960, 700, (cx, cy) => paint(ellPts(cx, cy, 330 + 60 * v, 230 + 30 * ((v + 1) % 3), 14, 16, v * 1.3), { fill: PAL[c], fillOp: 80, bleed: .26, tex: .55, border: .5, ink: null }));
// fundo aquarelado: 3 manchas grandes que derivam devagar (a, b = nomes de cor em BLOB_COLS)
function bg(t, a = 'mint', b = 'sky', seed = 1, alpha = 1) {
  for (let i = 0; i < 3; i++) {
    const h1 = hash(seed * 13 + i), h2 = hash(seed * 7 + i * 3), cx = lerp(250, W - 250, h1) + wob(t, .05, h2) * 40, cy = lerp(220, H - 220, h2) + wob(t, .04, h1) * 30;
    stain(`blob:${i % 2 ? b : a}:${(seed + i) % 3}`, cx, cy, { s: .9 + .5 * hash(seed + i * 5), rot: h1 * 3 + wob(t, .03, i) * .05, alpha });
  }
}

// título de seção no topo com pincelada por baixo. k = entrada 0..1
function header(t, t0, label, o = {}) {
  const k = seg(t, t0, t0 + .5), x = o.x ?? 120, y = o.y ?? 150, col = o.col || PAL.teal, w = o.w || 900;
  if (k <= 0) return;
  const reach = easeOut(k);
  const pts = []; for (let i = 0; i <= 10; i++) pts.push([x - 30 + i / 10 * w * reach, y + 26 + Math.sin(i * 1.3) * 4 + jit(3)]);
  for (let i = 10; i >= 0; i--) pts.push([x - 30 + i / 10 * w * reach, y + 52 + Math.sin(i * 1.1 + 1) * 5 + jit(3)]);
  paint(pts, { wash: col, washOp: 150, fill: col, fillOp: 60, tex: .7, border: .5, ink: null });
  txt(label, x, y, { size: o.size || 76, font: 'title', color: PAL.ink, align: 'left', pop: k * 1.4, hl: o.hl || PAL.rose });
  if (o.sub) txt(o.sub, x, y + 96, { size: o.subSize || 34, align: 'left', color: PAL.navy, alpha: easeOut(seg(t, t0 + .4, t0 + .9)), hl: o.hl || PAL.rose, maxW: o.subW });
}

// pílula de rótulo
function chip(x, y, label, o = {}) {
  const size = o.size || 30, w = o.w || label.length * size * .58 + 50, h = size * 1.7, k = o.k ?? 1;
  if (k < .02) return;
  push(); translate(x, y); scale(backOut(k)); translate(-x, -y);
  paint(rrPts(x - w / 2, y - h / 2, w, h, h / 2, 1.5), { wash: o.col || PAL.navy, washOp: 240, ink: o.ink === undefined ? null : o.ink, sw: .9 });
  pop();
  txt(label, x, y + 2, { size: size * backOut(k), color: o.color || PAL.cream, weight: 800 });
}

// carimbo de borracha (ex.: "NÃO ↓ MORTALIDADE")
function stamp(x, y, label, o = {}) {
  const k = o.k ?? 1; if (k < .02) return;
  const size = o.size || 44, w = o.w || label.length * size * .78 + 80, h = size * 1.9, col = o.col || PAL.rose, rot = o.rot ?? -.12;
  const s = lerp(2.2, 1, easeOut(k * 1.6)), a = clamp(k * 3);
  push(); translate(x, y); rotate(rot); scale(s);
  paint(rrPts(-w / 2, -h / 2, w, h, 16, 3), { ink: col, sw: 2.2 * a, fill: col, fillOp: 30 * a, tex: .9, border: .9 });
  paint(rrPts(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10, 3), { ink: col, sw: 1 * a });
  pop();
  txt(label, x, y + 3, { size: size * s, font: 'title', color: col, rot, alpha: a });
}

function checkmark(x, y, s, k = 1, col = PAL.sap) {
  if (k < .02) return;
  const p = [[x - s * .5, y], [x - s * .12, y + s * .38], [x + s * .55, y - s * .45]], q = easeOut(k);
  const pts = q < .4 ? [p[0], [lerp(p[0][0], p[1][0], q / .4), lerp(p[0][1], p[1][1], q / .4)]] : [p[0], p[1], [lerp(p[1][0], p[2][0], (q - .4) / .6), lerp(p[1][1], p[2][1], (q - .4) / .6)]];
  inkLine(pts, s * .06, col, 'ink', 0);
}
function crossmark(x, y, s, k = 1, col = PAL.rose) {
  if (k < .02) return;
  const a = easeOut(seg(k, 0, .5)), b = easeOut(seg(k, .5, 1));
  inkLine([[x - s * .45, y - s * .45], [lerp(x - s * .45, x + s * .45, a), lerp(y - s * .45, y + s * .45, a)]], s * .06, col, 'ink', 0);
  if (b > 0) inkLine([[x + s * .45, y - s * .45], [lerp(x + s * .45, x - s * .45, b), lerp(y - s * .45, y + s * .45, b)]], s * .06, col, 'ink', 0);
}

// traçado de ECG estilizado entre x0 e x1; p = 0..1 quanto já foi desenhado
function ecgPts(x0, x1, y, amp, beats = 4) {
  const pts = [], per = (x1 - x0) / beats;
  for (let b = 0; b < beats; b++) {
    const s = x0 + b * per, u = per / 20;
    pts.push([s, y], [s + u * 4, y], [s + u * 5, y - amp * .12], [s + u * 6, y], [s + u * 7.5, y], [s + u * 8.2, y + amp * .18],
      [s + u * 9, y - amp], [s + u * 9.8, y + amp * .35], [s + u * 10.6, y], [s + u * 13, y], [s + u * 14.5, y - amp * .25], [s + u * 16, y]);
  }
  pts.push([x1, y]);
  return pts;
}
function ecg(x0, x1, y, amp, p, o = {}) {
  const all = ecgPts(x0, x1, y, amp, o.beats || 4), xe = lerp(x0, x1, clamp(p)), pts = all.filter(q => q[0] <= xe);
  if (pts.length < 2) return;
  inkLine(pts, o.sw || 1.3, o.col || PAL.rose, 'ink', .05);
  const last = pts[pts.length - 1];
  if (p < 1) paint(ellPts(last[0], last[1], 9, 9, 10), { wash: o.col || PAL.rose, ink: null });
}

// ---------- ícones clínicos (centro x, y; tamanho s ≈ 100) ----------
function iconSteth(x, y, s) {
  const sw = s * .018;
  inkLine([[x - s * .35, y - s * .5], [x - s * .42, y - s * .1], [x - s * .12, y + s * .25], [x + s * .1, y + s * .1], [x + s * .12, y - s * .15]], sw * 2.2, PAL.navy, 'ink', .7);
  inkLine([[x + s * .12, y - s * .5], [x + s * .2, y - s * .15], [x + s * .12, y - s * .15]], sw * 2.2, PAL.navy, 'ink', .7);
  for (const dx of [-.35, .12]) paint(ellPts(x + dx * s, y - s * .52, s * .05, s * .05, 10), { wash: PAL.ink, ink: null });
  inkLine([[x - s * .12, y + s * .25], [x + s * .2, y + s * .4]], sw * 2.2, PAL.navy, 'ink', .5);
  paint(ellPts(x + s * .3, y + s * .42, s * .15, s * .15, 16), { wash: PAL.ochre, fill: PAL.coral, fillOp: 60, ink: PAL.ink, sw });
  paint(ellPts(x + s * .3, y + s * .42, s * .07, s * .07, 12), { wash: PAL.cream, ink: PAL.ink, sw: sw * .7 });
}
function iconEcho(x, y, s, t = 0) {
  const sw = s * .016, bt = beat(t, 72);
  paint(rrPts(x - s * .55, y - s * .42, s * 1.1, s * .78, s * .08, 1.5), { wash: PAL.navy, ink: PAL.ink, sw });
  // setor do ultrassom
  const sec = [[x, y - s * .34]]; for (let i = 0; i <= 8; i++) { const a = -.62 + i / 8 * 1.24; sec.push([x + Math.sin(a) * s * .6, y - s * .34 + Math.cos(a) * s * .6]); }
  paint(sec, { wash: '#1C3F4A', fill: PAL.mint, fillOp: 50, tex: .6, ink: null });
  paint(heartPts(x, y + s * .02, s * .16 * (1 - bt * .12), 24), { wash: '#6FA7A0', fill: PAL.cream, fillOp: 40, ink: PAL.mintLt, sw: sw * .7 });
  paint(rrPts(x - s * .18, y + s * .38, s * .36, s * .12, s * .03, 1), { wash: PAL.ink, ink: PAL.ink, sw: sw * .7 });
}
function iconTube(x, y, s, level = .6, col = PAL.blood) {
  const sw = s * .016, w = s * .28, h = s * .95, top = y - h / 2;
  push(); translate(x, y); rotate(.18); translate(-x, -y);
  const liq = top + h * (1 - level * .85);
  paint([[x - w / 2 + 2, liq], [x + w / 2 - 2, liq], [x + w / 2 - 2, top + h - w / 2], [x, top + h], [x - w / 2 + 2, top + h - w / 2]], { wash: col, fill: PAL.rose, fillOp: 60, ink: null, curv: .2 });
  paint([[x - w / 2, top], [x + w / 2, top], [x + w / 2, top + h - w / 2], [x, top + h], [x - w / 2, top + h - w / 2]], { wash: PAL.cream, washOp: 60, ink: PAL.ink, sw, curv: .15 });
  paint(rrPts(x - w * .65, top - s * .1, w * 1.3, s * .14, s * .04, 1), { wash: PAL.teal, ink: PAL.ink, sw });
  pop();
}
function iconDrop(x, y, s, o = {}) {
  const pts = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = s * .42 * (1 - .55 * Math.max(0, -Math.sin(a)) ** 3); pts.push([x + Math.cos(a) * r * (1 - .6 * Math.max(0, -Math.sin(a))), y + Math.sin(a) * s * .5 + s * .06]); }
  paint(pts, { wash: o.col || PAL.sky, fill: PAL.indigo, fillOp: 50, tex: .5, ink: PAL.ink, sw: s * .014, curv: .3 });
  paint(ellPts(x - s * .15, y + s * .02, s * .07, s * .12, 10, 0, .4), { wash: PAL.cream, washOp: 170, ink: null });
}
// coronária em corte longitudinal: parede, luz com sangue e placa de ateroma que estreita a luz (plaque 0..1)
function iconArtery(x, y, s, t = 0, plaque = 1) {
  const sw = s * .012, L = s * .62, R = s * .2, r = s * .13;
  paint(rrPts(x - L, y - R, 2 * L, 2 * R, R, 1), { wash: PAL.roseLt, ink: PAL.ink, sw });
  paint(rrPts(x - L, y - r, 2 * L, 2 * r, r * .4, 1), { wash: PAL.blood, ink: null });
  for (let i = 0; i < 5; i++) { const px = x - L + ((i * .45 + t * .5) % 2.2) / 2.2 * 2 * L, py = y + (hash(i) - .5) * r; if (Math.abs(px - x) > s * .12 * plaque + 10) paint(ellPts(px, py, s * .03, s * .022, 8), { wash: PAL.rose, ink: null }); }
  if (plaque > .02) {
    const pw = s * .2, ph = r * 1.5 * plaque;
    paint([[x - pw, y - r - 2], [x - pw * .4, y - r + ph * .7], [x, y - r + ph], [x + pw * .4, y - r + ph * .7], [x + pw, y - r - 2]], { wash: PAL.ochre, ink: PAL.ink, sw: sw * .8, curv: .5 });
    paint([[x - pw * .8, y + r + 2], [x - pw * .2, y + r - ph * .5], [x + pw * .6, y + r + 2]], { wash: PAL.ochreLt, ink: PAL.ink, sw: sw * .8, curv: .5 });
  }
}
// placa de atenção (triângulo com !)
function warnSign(x, y, s, k = 1) {
  if (k < .02) return;
  const q = backOut(k);
  push(); translate(x, y); rotate(.12 + wob(k, .5) * .02); scale(q);
  paint([[0, -s * .55], [s * .6, s * .45], [-s * .6, s * .45]], { wash: PAL.ochre, ink: PAL.ink, sw: 1.3, curv: .08 });
  pop();
  txt('!', x + s * .03, y + s * .1, { size: s * .7 * q, font: 'title', color: PAL.ink, rot: .12 });
}
