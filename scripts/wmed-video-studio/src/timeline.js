// timeline.js — registro do vídeo, transições em pincelada, selo WMed e barra de progresso.
//
// Um arquivo de tema chama video({ slug, title, dur, sections, scenes }):
//   scenes   = [[t0, fn], ...] em ordem; fn(t, lt, dur) pinta o quadro inteiro (fundo incluso). lt = t - t0.
//   sections = [[t0, 'Nome'], ...] rótulos da barra de progresso; cada início de seção (exceto o primeiro) ganha uma pincelada.
let VIDEO = null;
const WIPE_TR = .32;
function video(v) { VIDEO = { wipes: v.sections.slice(1).map(s => s[0]), ...v }; }

function drawWorld(t) {
  if (!VIDEO) return;
  const sc = VIDEO.scenes; let i = 0; while (i + 1 < sc.length && t >= sc[i + 1][0]) i++;
  const t0 = sc[i][0], end = i + 1 < sc.length ? sc[i + 1][0] : VIDEO.dur;
  sc[i][1](t, t - t0, end - t0);
  CAM = null;
  if (!VIDEO.noChrome) chrome(t);
  // o texto normalmente vai direto ao quadro final (barato); só é fundido na pintura quando uma pincelada precisa cobri-lo
  VIDEO.wipes.forEach((b, j) => { if (Math.abs(t - b) < WIPE_TR) { flushText(); wipe((t - (b - WIPE_TR)) / (2 * WIPE_TR), j); } });
}

// selo WMed (canto superior esquerdo) e barra de progresso por seções (rodapé)
function chrome(t) {
  const k = easeOut(seg(t, 1.2, 2)) * (1 - ease(seg(t, VIDEO.dur - 1.2, VIDEO.dur - .4)));
  if (k < .02) return;
  paint(rrPts(44, 34, 228, 66, 33, 1.5), { wash: PAL.navy, washOp: 235 * k, ink: null });
  paint(ellPts(84, 67, 17, 17, 16, 1), { wash: PAL.mint, washOp: 255 * k, ink: null });
  txt('WMed', 164, 66, { size: 34, font: 'title', color: PAL.cream, alpha: k, screen: true });
  txt('.ai', 232, 70, { size: 26, color: PAL.mint, alpha: k, screen: true });
  const secs = VIDEO.sections, x0 = 120, x1 = W - 120, y = 1040;
  const total = VIDEO.dur;
  secs.forEach(([a, name], i) => {
    const b = i + 1 < secs.length ? secs[i + 1][0] : total, xa = lerp(x0, x1, a / total) + 5, xb = lerp(x0, x1, b / total) - 5;
    const on = t >= a && t < b, p = seg(t, a, b);
    paint(rrPts(xa, y - 5, xb - xa, 10, 5), { wash: PAL.ink, washOp: 38 * k, ink: null });
    if (p > 0) paint(rrPts(xa, y - 5, Math.max(10, (xb - xa) * p), 10, 5), { wash: on ? PAL.teal : PAL.mint, washOp: 230 * k, ink: null });
    if (on && i > 0) txt(name.toUpperCase(), (xa + xb) / 2, y - 26, { size: 19, color: PAL.teal, alpha: k * .95, screen: true, weight: 800 });
  });
}

// pincelada que cobre a cena antiga, troca sob cobertura total (p = .5) e sai arrastando
const WIPE_COLS = [[PAL.teal, PAL.mint], [PAL.navy, PAL.indigo], [PAL.rose, PAL.coral], [PAL.ochre, PAL.coral], [PAL.sap, PAL.teal], [PAL.indigo, PAL.violet]];
function wipe(p, idx) {
  const [c1, c2] = WIPE_COLS[idx % WIPE_COLS.length], n = 5, bh = (H + 420) / n + 40;
  push(); translate(W / 2, H / 2); rotate(-.09); translate(-W / 2, -H / 2);
  for (let i = 0; i < n; i++) {
    const y0 = -230 + i * (H + 420) / n, d = [0, .14, .06, .18, .1][i];
    const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    const x0 = p < .5 ? -300 : lerp(-300, W + 400, q), x1 = p < .5 ? lerp(-300, W + 400, q) : W + 400;
    if (x1 - x0 < 30) continue;
    const pts = [], rag = k => 40 + 50 * hash(i * 31 + k) + jit(10);
    for (let k = 0; k <= 8; k++) pts.push([lerp(x0, x1, k / 8), y0 + Math.sin(k * .9 + i) * 14 + jit(5)]);
    for (let k = 1; k < 9; k++) pts.push([x1 + rag(k) - 40, y0 + bh * k / 9]);
    for (let k = 8; k >= 0; k--) pts.push([lerp(x0, x1, k / 8), y0 + bh + Math.sin(k * .8 + i * 2) * 14 + jit(5)]);
    if (p >= .5) for (let k = 8; k > 0; k--) pts.push([x0 - rag(k + 20) + 40, y0 + bh * k / 9]);
    paint(pts, { wash: i % 2 ? c1 : c2, washOp: 255, fill: i % 2 ? c2 : c1, fillOp: 70, bleed: .05, tex: .8, border: .6, ink: null,
      hatch: { d: 44, a: 0, o: { rand: .6, gradient: .5 }, b: 'charcoal', c: i % 2 ? c2 : PAL.cream, w: .8 } });
  }
  pop();
}
