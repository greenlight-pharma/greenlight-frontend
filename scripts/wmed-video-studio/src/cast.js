// cast.js — personagens recorrentes.
//   doc(x, y, u, o)   : o guia da WMed — gotinha verde-água de jaleco, óculos redondos e estetoscópio.
//   heart(x, y, r, o) : coração-personagem (fofo, não anatômico) para temas cardiológicos.
// Rostos: eyes = normal | happy | closed | wink | tired | worried | wide | star | x ; mouth = smile | grin | o | flat | wobble | sad.

function face(x, y, s, o = {}) {
  const eyes = o.eyes || 'normal', mouth = o.mouth || 'smile', ex = 1.25 * s, ey = 0, er = .36 * s, lx = (o.lookX || 0) * .12 * s, ly = (o.lookY || 0) * .1 * s;
  const sw = Math.max(.6, s * .045);
  for (const side of [-1, 1]) {
    const cx = x + side * ex, cy = y + ey;
    if (eyes === 'happy') inkLine([[cx - er, cy + er * .25], [cx, cy - er * .6], [cx + er, cy + er * .25]], sw * 1.4, PAL.ink, 'ink', .8);
    else if (eyes === 'closed') inkLine([[cx - er, cy], [cx, cy + er * .45], [cx + er, cy]], sw * 1.3, PAL.ink, 'ink', .8);
    else if (eyes === 'wink' && side === 1) inkLine([[cx - er, cy], [cx, cy - er * .4], [cx + er, cy]], sw * 1.3, PAL.ink, 'ink', .8);
    else if (eyes === 'x') { inkLine([[cx - er, cy - er], [cx + er, cy + er]], sw * 1.2, PAL.ink, 'ink', 0); inkLine([[cx + er, cy - er], [cx - er, cy + er]], sw * 1.2, PAL.ink, 'ink', 0); }
    else if (eyes === 'star') paint(starPts(cx, cy, er * 1.3, .45, 5), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .8 });
    else {
      const big = eyes === 'wide' ? 1.25 : 1;
      paint(ellPts(cx, cy, er * .95 * big, er * 1.15 * big, 16), { wash: PAL.ink, washOp: 255, ink: null });
      paint(ellPts(cx - er * .3 + lx, cy - er * .4 + ly, er * .3, er * .3, 10), { wash: PAL.cream, washOp: 255, ink: null });
      if (eyes === 'tired') paint([[cx - er * 1.3, cy - er * 1.4], [cx + er * 1.3, cy - er * 1.4], [cx + er * 1.3, cy - er * .1], [cx - er * 1.3, cy - er * .1]], { wash: o.skin || PAL.rose, washOp: 255, ink: null }),
        inkLine([[cx - er * 1.1, cy - er * .15], [cx + er * 1.1, cy - er * .15]], sw * 1.2, PAL.ink, 'ink', 0);
      if (eyes === 'worried') inkLine([[cx - side * er * 1.1, cy - er * 1.9], [cx + side * er * .9, cy - er * 1.45]], sw * 1.2, PAL.ink, 'ink', 0);
    }
  }
  const my = y + .75 * s, mw = .55 * s;
  if (mouth === 'smile') inkLine([[x - mw, my - mw * .2], [x, my + mw * .35], [x + mw, my - mw * .2]], sw * 1.3, PAL.ink, 'ink', .8);
  else if (mouth === 'grin') paint([[x - mw * 1.1, my - mw * .25], [x + mw * 1.1, my - mw * .25], [x + mw * .5, my + mw * .6], [x - mw * .5, my + mw * .6]], { wash: PAL.blood, ink: PAL.ink, sw: sw, curv: .5 });
  else if (mouth === 'o') paint(ellPts(x, my + mw * .1, mw * .4, mw * .5, 14), { wash: PAL.blood, ink: PAL.ink, sw });
  else if (mouth === 'flat') inkLine([[x - mw * .7, my], [x + mw * .7, my]], sw * 1.3, PAL.ink, 'ink', 0);
  else if (mouth === 'sad') inkLine([[x - mw * .8, my + mw * .3], [x, my - mw * .15], [x + mw * .8, my + mw * .3]], sw * 1.3, PAL.ink, 'ink', .8);
  else if (mouth === 'wobble') inkLine([[x - mw, my], [x - mw * .5, my - mw * .2], [x, my], [x + mw * .5, my - mw * .2], [x + mw, my]], sw * 1.2, PAL.ink, 'ink', .6);
  if (o.blush !== false) for (const side of [-1, 1]) paint(ellPts(x + side * 1.95 * s, y + .55 * s, .38 * s, .22 * s, 12), { wash: PAL.coral, washOp: 110, ink: null });
}

// marcas de reação ao lado da cabeça
function emote(kind, x, y, s, k = 1) {
  if (k < .02) return;
  const q = backOut(k);
  if (kind === 'sweat') paint([[x, y - s * q], [x + s * .5 * q, y + s * .1 * q], [x, y + s * .5 * q], [x - s * .5 * q, y + s * .1 * q]], { wash: PAL.sky, ink: PAL.ink, sw: .8, curv: .6 });
  else if (kind === 'spark') for (let i = 0; i < 3; i++) paint(starPts(x + (i - 1) * s * .9, y - Math.abs(i - 1) * s * .5, s * .45 * q, .3, 4), { wash: PAL.ochre, ink: PAL.ink, sw: .7 });
  else txt(kind, x, y, { size: s * 1.6 * q, font: 'title', color: kind === '!' ? PAL.rose : PAL.teal, shadow: PAL.ink });
}

function doc(x, y, u, o = {}) {
  const sq = o.sq || 0, dy = (o.dy || 0) * u, bw = 5.2 * u * (1 + sq * .5), bh = 6.4 * u * (1 - sq * .5), sw = Math.max(.7, u * .05);
  push(); translate(x, y + dy); if (o.rot) rotate(o.rot); if (o.flip) scale(-1, 1);
  if (!o.noShadow) paint(ellPts(0, -dy / 1 + 4, bw * .9, u * .7, 18), { fill: PAL.ink, fillOp: 40, bleed: .1, tex: .2, ink: null });
  // pés
  for (const s of [-1, 1]) paint(ellPts(s * 1.7 * u, -.35 * u, 1.1 * u, .55 * u, 14), { wash: PAL.navy, ink: PAL.ink, sw });
  // braços (atrás do corpo); ângulo 0 = para fora, positivo = para cima
  const arm = (s, a) => {
    const sx = s * bw * .82, sy = -bh * .42, L = 3.1 * u, ex = sx + s * Math.cos(a) * L, ey = sy - Math.sin(a) * L;
    inkLine([[sx, sy], [(sx + ex) / 2 + s * u * .2, (sy + ey) / 2 - u * .3], [ex, ey]], sw * 2.6, PAL.teal, 'ink', .5);
    paint(ellPts(ex, ey, .62 * u, .62 * u, 12), { wash: PAL.mint, ink: PAL.ink, sw: sw * .8 });
    if (s === 1 && o.handR) { push(); translate(ex, ey); o.handR(u, sw); pop(); }
    if (s === -1 && o.handL) { push(); translate(ex, ey); o.handL(u, sw); pop(); }
  };
  arm(-1, o.aL ?? -1); arm(1, o.aR ?? -1);
  // corpo em gota
  const body = []; for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, top = Math.sin(a) < 0 ? 1.08 : 1; body.push([Math.cos(a) * bw, -bh * .5 + Math.sin(a) * bh * .5 * top + jit(u * .03)]); }
  paint(body, { wash: PAL.mint, fill: PAL.teal, fillOp: 60, tex: .5, border: .6, ink: PAL.ink, sw: sw * 1.2, curv: .3 });
  // jaleco: metade de baixo em creme com lapelas
  const coat = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; coat.push([Math.cos(a) * bw * .985, -bh * .5 + Math.sin(a) * bh * .495]); }
  coat.push([-bw * .985, -bh * .5], [-bw * .3, -bh * .5], [0, -bh * .12], [bw * .3, -bh * .5], [bw * .985, -bh * .5]);
  paint(coat, { wash: PAL.cream, ink: PAL.ink, sw });
  inkLine([[0, -bh * .12], [0, -u * .3]], sw * .8, PAL.ink, 'inkfine', 0);
  // estetoscópio
  inkLine([[-bw * .3, -bh * .5], [-bw * .38, -bh * .3], [-bw * .1, -bh * .06], [bw * .12, -bh * .2]], sw * 1.6, PAL.navy, 'ink', .7);
  inkLine([[bw * .3, -bh * .5], [bw * .36, -bh * .34], [bw * .12, -bh * .2]], sw * 1.6, PAL.navy, 'ink', .7);
  paint(ellPts(bw * .12, -bh * .2, u * .42, u * .42, 12), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .8 });
  // rosto e óculos
  const fy = -bh * .7;
  face(0, fy, u * .9, { eyes: o.eyes, mouth: o.mouth, lookX: o.lookX, lookY: o.lookY, skin: PAL.mint });
  for (const s of [-1, 1]) paint(ellPts(s * 1.13 * u, fy, .75 * u, .72 * u, 16), { ink: PAL.navy, sw: sw * .9 });
  inkLine([[-.4 * u, fy - .1 * u], [.4 * u, fy - .1 * u]], sw * .8, PAL.navy, 'inkfine', 0);
  if (o.draw) o.draw(u, sw, bw, bh);
  pop();
  if (o.emote) emote(o.emote, x + (o.flip ? -1 : 1) * bw * 1.05, y + dy - bh * 1.05, u * 1.3, o.emoteK ?? 1);
}

// coração-personagem: r = raio; sq = aperto (sístole); pale = 0..1 cansaço; arms/aL/aR como no doc
function heart(x, y, r, o = {}) {
  const sq = o.sq || 0, sw = Math.max(.7, r * .012), base = mixCol(PAL.rose, '#C9A3A8', o.pale || 0);
  push(); translate(x, y); if (o.rot) rotate(o.rot); scale(1 + sq * .08, 1 - sq * .1);
  if (!o.noShadow) paint(ellPts(0, r * 1.12, r * .8, r * .12, 18), { fill: PAL.ink, fillOp: 40, bleed: .1, tex: .2, ink: null });
  // vasos da base (aorta e pulmonar), estilizados
  paint(rrPts(-r * .28, -r * 1.12, r * .3, r * .6, r * .15, 1), { wash: PAL.blood, ink: PAL.ink, sw });
  paint(rrPts(r * .06, -r * 1.02, r * .26, r * .5, r * .13, 1), { wash: PAL.indigo, ink: PAL.ink, sw });
  if (o.arms !== false) for (const s of [-1, 1]) {
    const a = s < 0 ? (o.aL ?? -.6) : (o.aR ?? -.6), sx = s * r * .9, sy = -r * .1, ex = sx + s * Math.cos(a) * r * .55, ey = sy - Math.sin(a) * r * .55;
    inkLine([[sx, sy], [ex, ey]], sw * 3, PAL.blood, 'ink', 0);
    paint(ellPts(ex, ey, r * .1, r * .1, 10), { wash: base, ink: PAL.ink, sw: sw * .8 });
    if (s === 1 && o.handR) { push(); translate(ex, ey); o.handR(r, sw); pop(); }
  }
  const pts = heartPts(0, 0, r).map(p => [p[0] + jit(r * .006), p[1] + jit(r * .006)]);
  paint(pts, { wash: base, fill: PAL.blood, fillOp: 70, tex: .6, border: .7, ink: PAL.ink, sw: sw * 1.3, curv: .2 });
  paint(ellPts(-r * .45, -r * .35, r * .16, r * .09, 12, 0, -.5), { wash: PAL.cream, washOp: 150, ink: null });
  face(0, r * .02, r * .2, { eyes: o.eyes, mouth: o.mouth, skin: base, lookX: o.lookX, lookY: o.lookY });
  if (o.draw) o.draw(r, sw);
  pop();
  if (o.emote) emote(o.emote, x + r * 1.05, y - r * .9, r * .28, o.emoteK ?? 1);
}
