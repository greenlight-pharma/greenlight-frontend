// Reels · Vytal Acadêmico × Diretório Acadêmico da UniFAA (Valença/RJ) · ~26 s, 1080×1920 · motor vertical (studio-vytal.html).
// ?fmt=feed gera o pôster estático 1080×1350 para o feed.
// Áreas seguras do Instagram: o topo (~220 px) e a base (~330 px) ficam livres de conteúdo essencial.
(() => {
  const IMGS = { mark: '../../vytal-mark-navy-transparent.png', app: '../../app-screen.png' };
  const PARTNER = { title: 'Diretório Acadêmico', name: 'UniFAA', place: 'Valença · RJ' };

  // selo "×" pulsando entre as duas marcas
  function cross(cx, cy, s, a, t) {
    if (a <= .005) return;
    X.save(); X.globalAlpha = a;
    for (let i = 0; i < 2; i++) { const p = (t * .6 + i / 2) % 1; X.beginPath(); X.arc(cx, cy, s * (.6 + p * 1.4), 0, TAU); X.strokeStyle = rgba(C.sky, .35 * (1 - p)); X.lineWidth = 2; X.stroke(); }
    X.beginPath(); X.arc(cx, cy, s * .6, 0, TAU); X.fillStyle = C.navy; X.fill(); X.lineWidth = 2.5; X.strokeStyle = rgba(C.sky, .8); X.stroke();
    X.strokeStyle = C.white; X.lineWidth = 4; X.lineCap = 'round'; const d = s * .2;
    X.beginPath(); X.moveTo(cx - d, cy - d); X.lineTo(cx + d, cy + d); X.moveTo(cx + d, cy - d); X.lineTo(cx - d, cy + d); X.stroke();
    X.restore();
  }
  // cartão do parceiro: só tipografia (sem reproduzir o logotipo da instituição)
  function partnerCard(cx, cy, w, a, o = {}) {
    const h = o.h || 250; glass(cx - w / 2, cy - h / 2, w, h, { alpha: a, r: 40 });
    eyebrow(cx, cy - h * .26, PARTNER.title, { align: 'center', alpha: a, size: 22, dotCol: C.gold });
    text(PARTNER.name, cx, cy + h * .02, { size: o.size || 92, weight: 700, align: 'center', alpha: a, ls: -3 });
    text(PARTNER.place, cx, cy + h * .3, { size: 28, color: C.muted, align: 'center', alpha: a, weight: 500, ls: 1 });
  }
  function vytalCard(cx, cy, w, a, o = {}) {
    const h = o.h || 250; glass(cx - w / 2, cy - h / 2, w, h, { alpha: a, r: 40 });
    mark(cx - w * .28, cy, h * .62, { alpha: a, glow: 30 });
    text('Vytal', cx - w * .08, cy - h * .12, { size: 70, weight: 700, alpha: a, ls: -2 });
    text('*Acadêmico*', cx - w * .08, cy + h * .16, { size: 60, alpha: a, accent: C.sky });
  }

  // ---------------- 00 · abertura ----------------
  function intro(t, lt) {
    const k = expoOut(seg(lt, .1, 1.2)), cy = 760;
    for (let i = 0; i < 3; i++) { const p = (lt * .4 + i / 3) % 1, r = 150 + p * 520; X.beginPath(); X.arc(W / 2, cy, r, 0, TAU); X.strokeStyle = rgba(C.sky, .2 * (1 - p) * k); X.lineWidth = 2; X.stroke(); }
    mark(W / 2, cy, lerp(220, 340, k), { alpha: k, glow: 50 });
    eyebrow(W / 2, 330, 'Nova parceria', { align: 'center', alpha: expoOut(seg(lt, .3, .9)), dotCol: C.gold, color: C.white, size: 26 });
    text('Vytal *Acadêmico*', W / 2, 1080, { size: 96, weight: 700, align: 'center', reveal: seg(lt, .7, 1.7), accent: C.sky });
    text('A prática clínica do aluno *vira estudo.*', W / 2, 1200, { size: 44, color: C.pale, align: 'center', maxW: 860, alpha: expoOut(seg(lt, 1.5, 2.3)), accent: C.white });
  }

  // ---------------- 01 · a parceria ----------------
  function partnership(t, lt) {
    eyebrow(W / 2, 300, 'Parceria', { align: 'center', alpha: expoOut(seg(lt, .05, .6)), dotCol: C.gold, color: C.white });
    const a1 = expoOut(seg(lt, .2, .9)), a2 = expoOut(seg(lt, .9, 1.6));
    vytalCard(W / 2, 520 + (1 - a1) * 60, 820, a1);
    // linha de conexão que desce de uma marca à outra
    const p = ease(seg(lt, .7, 1.5));
    strokePath([[W / 2, 645], [W / 2, 915]], p, { col: C.sky, lw: 4, glow: 20, alpha: .9 });
    cross(W / 2, 780, 44, expoOut(seg(lt, 1.1, 1.6)), t);
    partnerCard(W / 2, 1040 + (1 - a2) * 60, 820, a2);
    text('Juntos pela *formação médica.*', W / 2, 1300, { size: 64, weight: 700, align: 'center', maxW: 900, reveal: seg(lt, 1.8, 2.8), accent: C.sky });
    text('Mais prática, mais raciocínio clínico e mais preparo para o ENAMED para os estudantes da UniFAA.', W / 2, 1440, { size: 34, color: C.pale, align: 'center', maxW: 860, alpha: expoOut(seg(lt, 2.6, 3.4)), weight: 500 });
  }

  // ---------------- 02 · o app ----------------
  const FEATS = [
    ['case', 'Casos da prática viram estudo', C.teal],
    ['spark', 'Assistente de estudos com IA', C.sky],
    ['target', 'Foco no ENAMED', C.gold],
    ['cube', 'Anatomia e histologia em 3D', C.sky]
  ];
  function app(t, lt, dur) {
    eyebrow(W / 2, 270, 'Já nas lojas · iOS e Android', { align: 'center', alpha: expoOut(seg(lt, .05, .6)), color: C.white });
    const e = expoOut(seg(lt, .1, 1.1));
    phone(IMG.app, W / 2, 920 + (1 - e) * 220, 1160, { alpha: e, rot: lerp(.06, -.03, ease(seg(lt, 0, dur))), scroll: ease(seg(lt, 2.2, dur - .4)) * .28 });
    // selos de recursos, alternando lados
    FEATS.forEach(([ic, label, col], i) => {
      const a = .9 + i * .75, k = backOut(seg(lt, a, a + .5)), left = i % 2 === 0, y = 560 + i * 230;
      if (k <= .005) return;
      X.save(); X.globalAlpha = clamp(k); const cx = left ? 70 : W - 70;
      X.font = `600 32px ${F.sans}`; const w = X.measureText(label).width + 130, x0 = left ? cx : cx - w;
      X.translate(x0 + w / 2, y); X.scale(lerp(.8, 1, k), lerp(.8, 1, k)); X.translate(-(x0 + w / 2), -y);
      rr(x0, y - 50, w, 100, 50); X.fillStyle = 'rgba(8,30,61,.95)'; X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = 40; X.fill(); X.shadowBlur = 0;
      X.lineWidth = 2; X.strokeStyle = rgba(col, .6); X.stroke();
      X.beginPath(); X.arc(x0 + 52, y, 30, 0, TAU); X.fillStyle = rgba(col, .18); X.fill();
      icon(ic, x0 + 52, y, 36, col, seg(lt, a, a + .8));
      X.fillStyle = C.white; X.textBaseline = 'middle'; X.fillText(label, x0 + 100, y + 1);
      X.restore();
    });
  }

  // ---------------- 03 · como funciona ----------------
  const STEPS = [['case', '01', 'Registre o caso', 'Organize o relato da sua prática.'], ['brain', '02', 'Reveja o raciocínio', 'Da hipótese à conduta, com retorno.'], ['spark', '03', 'Aprofunde o estudo', 'Assistente, atlas 3D e biblioteca.']];
  function steps(t, lt) {
    eyebrow(90, 300, 'Como funciona', { alpha: expoOut(seg(lt, .05, .6)) });
    text('Aprender com\n*cada caso.*', 86, 420, { size: 104, weight: 700, reveal: seg(lt, .15, 1.2), accent: C.sky, lh: 1.02 });
    const x = 90, w = W - 180, h = 230;
    strokePath([[150, 790], [150, 790 + 2 * 290]], ease(seg(lt, .8, 2.8)), { col: rgba(C.sky, .5), lw: 3, glow: 12 });
    STEPS.forEach(([ic, n, title, sub], i) => {
      const a = .9 + i * .6, k = expoOut(seg(lt, a, a + .6)), y = 680 + i * 290;
      glass(x, y + (1 - k) * 40, w, h, { alpha: k, r: 36 });
      X.save(); X.globalAlpha = k;
      X.beginPath(); X.arc(150, y + h / 2 + (1 - k) * 40, 46, 0, TAU); X.fillStyle = C.deep; X.fill(); X.lineWidth = 2.5; X.strokeStyle = rgba(C.sky, .8); X.stroke(); X.restore();
      icon(ic, 150, y + h / 2 + (1 - k) * 40, 46, C.sky, seg(lt, a, a + .9));
      text(n, 240, y + 70 + (1 - k) * 40, { size: 26, color: C.teal, weight: 700, alpha: k, ls: 3 });
      text(title, 240, y + 122 + (1 - k) * 40, { size: 50, weight: 700, alpha: k });
      text(sub, 240, y + 178 + (1 - k) * 40, { size: 32, color: C.pale, alpha: k, weight: 500 });
    });
  }

  // ---------------- 04 · chamada final ----------------
  function outro(t, lt) {
    const k = expoOut(seg(lt, .1, 1));
    for (let i = 0; i < 2; i++) { const p = (lt * .35 + i / 2) % 1, r = 130 + p * 420; X.beginPath(); X.arc(W / 2, 560, r, 0, TAU); X.strokeStyle = rgba(C.sky, .18 * (1 - p) * k); X.lineWidth = 2; X.stroke(); }
    mark(W / 2, 560, lerp(200, 260, k), { alpha: k, glow: 50 });
    text('Vytal *Acadêmico*', W / 2, 820, { size: 88, weight: 700, align: 'center', reveal: seg(lt, .3, 1.2), accent: C.sky });
    // ×  UniFAA
    const a = expoOut(seg(lt, .9, 1.6));
    text('×  Diretório Acadêmico UniFAA', W / 2, 920, { size: 40, weight: 600, align: 'center', alpha: a, color: C.pale });
    text('Baixe agora e transforme cada\nplantão em *aprendizado.*', W / 2, 1090, { size: 54, weight: 700, align: 'center', reveal: seg(lt, 1.4, 2.4), accent: C.sky, lh: 1.15 });
    const b = expoOut(seg(lt, 2.2, 2.9));
    let px = W / 2 - 330;
    ['App Store', 'Google Play'].forEach((l, i) => { const e = expoOut(seg(lt, 2.2 + i * .15, 2.9 + i * .15)); px += pill(px, 1330 + (1 - e) * 20, l, { size: 34, alpha: e, dot: i ? C.teal : C.sky, fill: rgba('#FFFFFF', .1) }) + 30; });
    text('vytalsaude.com.br/academico', W / 2, 1460, { size: 32, color: C.muted, align: 'center', alpha: b, weight: 500, ls: 1 });
  }

  // ---------------- pôster do feed (1080×1350) ----------------
  function poster(t) {
    eyebrow(W / 2, 110, 'Nova parceria', { align: 'center', dotCol: C.gold, color: C.white, size: 26 });
    text('Juntos pela *formação médica.*', W / 2, 215, { size: 72, weight: 700, align: 'center', maxW: 940, accent: C.sky });
    vytalCard(W / 2, 520, 860, 1, { h: 240 });
    strokePath([[W / 2, 640], [W / 2, 790]], 1, { col: C.sky, lw: 4, glow: 20 });
    cross(W / 2, 715, 40, 1, 0);
    partnerCard(W / 2, 910, 860, 1, { h: 240, size: 86 });
    text('O Vytal Acadêmico chega aos estudantes da UniFAA: casos da prática que viram estudo, assistente com IA e foco no ENAMED.', W / 2, 1115, { size: 32, color: C.pale, align: 'center', maxW: 900, weight: 500 });
    let px = W / 2 - 300;
    ['App Store', 'Google Play'].forEach((l, i) => { px += pill(px, 1250, l, { size: 30, dot: i ? C.teal : C.sky, fill: rgba('#FFFFFF', .1) }) + 26; });
  }

  if (FMT === 'feed') video({ dur: 1, images: IMGS, scenes: [[0, poster]] });
  else video({
    dur: 26, images: IMGS, tr: .8,
    scenes: [[0, intro], [4.2, partnership], [10.2, app], [16.4, steps], [21.2, outro]],
    // marca discreta no topo durante o meio do vídeo
    chrome(t) {
      const a = expoOut(seg(t, 4.6, 5.4)) * (1 - ease(seg(t, 20.8, 21.4)));
      if (a <= .005) return;
      mark(118, 150, 70, { alpha: a });
      text('Vytal *Acadêmico*', 170, 152, { size: 34, weight: 700, alpha: a, accent: C.sky });
    }
  });
})();
