// brand-2doctor.js — veste o motor tech com a marca 2Doctor (carregar DEPOIS de engine.js).
// Tokens de scripts/wmed-app/src/doctor/doctor.css (produto 2doctor), fonte Manrope (OFL) e o
// monograma "2D" de src/doctor/Navigation.jsx. Não altera nada do vídeo da WMed.
Object.assign(C, {
  bg: '#F2F7F5', page: '#FFFFFF', ink: '#142D40', ink2: '#2C4556', muted: '#61747C', faint: '#A9B8B4', line: '#E2EBE8',
  blue: '#005D5B',   // acento principal (verde-petróleo do app)
  cyan: '#2FA290',   // segunda luz da marca
  violet: '#3D7F9E', navy: '#0B2A2A'
});
F.sans = 'Manrope, system-ui, sans-serif';
const MARK2D = new Path2D('M5 34C13 12 32 0 58 0H112C151 0 175 25 175 61C175 99 150 124 112 124H0V113C0 92 11 78 32 64L51 52C63 44 66 37 63 32C59 23 42 25 36 34ZM84 26C94 52 82 67 56 82L34 99H109C134 99 147 84 147 62C147 40 134 26 112 26Z');
// logo: o monograma 2D em verde, centrado numa caixa de lado s (o.bg desenha um fundo arredondado)
function logo(x, y, s, o = {}) {
  const a = o.alpha ?? 1; if (a <= .005) return;
  X.save(); X.globalAlpha *= a;
  if (o.bg) { rr(x, y, s, s, s * .22); X.fillStyle = o.bg; X.fill(); }
  const k = s * .84 / 175; X.translate(x + s * .08, y + (s - 124 * k) / 2); X.scale(k, k);
  X.fillStyle = o.color && o.color !== 'brand' ? o.color : C.blue; X.fill(MARK2D, 'evenodd');
  X.restore();
}
function wordmark(x, y, size, o = {}) {
  text('*2*Doctor', x, y, { size, weight: 700, ls: -size * .04, color: o.color || C.ink, accent: C.blue, alpha: o.alpha });
}
// barra superior: a palavra "2Doctor" é mais larga que "WMed"; a pílula passa a vir depois dela
function chrome(t) {
  const [c0, c1] = VIDEO.chrome || [0, VIDEO.dur - 2];
  const a = expoOut(seg(t, c0 + .2, c0 + 1)) * (1 - ease(seg(t, c1 - .6, c1)));
  if (a <= .005) return;
  logo(64, 44, 60, { alpha: a });
  const wm = text('*2*Doctor', 134, 73, { size: 34, weight: 700, ls: -1.3, color: C.ink, accent: C.blue, alpha: a });
  pill(134 + wm.w + 22, 72, VIDEO.kicker || '2Doctor', { size: 19, alpha: a, dot: C.blue });
  X.save(); X.globalAlpha = a; X.font = `500 20px ${F.mono}`; X.textAlign = 'right'; X.textBaseline = 'middle'; X.fillStyle = C.muted;
  X.fillText(`${VIDEO.code || ''}  ${mm(t)} / ${mm(VIDEO.dur)}`, W - 72, 73); X.restore();
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
