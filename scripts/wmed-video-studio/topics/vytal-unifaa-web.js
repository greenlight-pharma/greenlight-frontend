// Reels · Vytal Acadêmico (versão web) × Diretório Acadêmico da UniFAA · ~40 s, 1080×1920 · motor vertical.
// Capturas reais da prévia web (tools/capture-vytal-web.mjs → out/vytal-captures/): giros do atlas e da histologia,
// o corte da tomografia atravessando o tórax e as telas de feedback, questões e coordenação.
// Áreas seguras do Instagram: topo (~220 px) e base (~330 px) sem conteúdo essencial.
(() => {
  const CAP = 'out/vytal-captures/', seq = (m, n = 90) => Array.from({ length: n }, (_, i) => `${CAP}${m}/f${String(i).padStart(3, '0')}.jpg`);
  const S = { intro: 0, partner: 3.8, atlas: 8.5, histo: 14, radio: 18.6, feedback: 23.6, quest: 28.4, coord: 31.8, outro: 35.6, end: 40 };
  const PARTNER = { title: 'Diretório Acadêmico', name: 'UniFAA', place: 'Valença · RJ' };
  const FRAME = { x: 60, y: 560, w: 960, h: 980 }; // palco dos giros 3D

  // ---------- peças reutilizáveis ----------
  function title(lt, eb, t, o = {}) {
    eyebrow(90, o.y ?? 270, eb, { alpha: expoOut(seg(lt, .05, .6)) * (o.out ?? 1), dotCol: o.dot || C.teal });
    text(t, 86, (o.y ?? 270) + 100, { size: o.size || 76, weight: 700, reveal: seg(lt, .12, 1.1), accent: C.sky, lh: 1.04, alpha: o.out ?? 1 });
  }
  // palco escuro com o giro, linha de varredura e rótulos
  function stage3d(list, lt, dur, labels, o = {}) {
    const e = expoOut(seg(lt, .1, .9)), { x, y, w, h } = FRAME, dy = (1 - e) * 80;
    X.save(); X.globalAlpha = e;
    rr(x, y + dy, w, h, 40); X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 80; X.shadowOffsetY = 30; X.fillStyle = '#12284A'; X.fill(); X.shadowColor = 'transparent';
    X.restore();
    turntable(list, o.p ?? seg(lt, 0, dur), x, y + dy, w, h, { r: 40, alpha: e, src: o.src, zoom: o.zoom || 1 });
    X.save(); X.globalAlpha = e; rr(x, y + dy, w, h, 40); X.lineWidth = 2; const g = X.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, rgba(C.sky, .6)); g.addColorStop(1, rgba(C.teal, .25)); X.strokeStyle = g; X.stroke();
    // varredura luminosa que desce uma vez
    const sp = seg(lt, .5, 2.3); if (sp > 0 && sp < 1) { const sy = y + dy + h * sp; const lg = X.createLinearGradient(0, sy - 60, 0, sy); lg.addColorStop(0, rgba(C.sky, 0)); lg.addColorStop(1, rgba(C.sky, .22)); X.save(); rr(x, y + dy, w, h, 40); X.clip(); X.fillStyle = lg; X.fillRect(x, sy - 60, w, 60); X.fillStyle = rgba(C.sky, .7); X.fillRect(x, sy, w, 2); X.restore(); }
    X.restore();
    // cantos de mira
    X.save(); X.globalAlpha = e * .8; X.strokeStyle = C.sky; X.lineWidth = 3; const c = 34, m = 26;
    [[x + m, y + dy + m, 1, 1], [x + w - m, y + dy + m, -1, 1], [x + m, y + dy + h - m, 1, -1], [x + w - m, y + dy + h - m, -1, -1]].forEach(([cx, cy, sx, sy]) => { X.beginPath(); X.moveTo(cx, cy + sy * c); X.lineTo(cx, cy); X.lineTo(cx + sx * c, cy); X.stroke(); });
    X.restore();
    labels.forEach(([label, col], i) => { const a = .9 + i * .45, k = backOut(seg(lt, a, a + .5)); if (k <= .005) return; pill(x + 40, y + h - 60 - i * 86 + (1 - clamp(k)) * 20, label, { size: 28, alpha: clamp(k), dot: col, fill: 'rgba(8,30,61,.88)', stroke: rgba(col, .6) }); });
  }
  function cross(cx, cy, s, a, t) {
    if (a <= .005) return;
    X.save(); X.globalAlpha = a;
    for (let i = 0; i < 2; i++) { const p = (t * .6 + i / 2) % 1; X.beginPath(); X.arc(cx, cy, s * (.6 + p * 1.4), 0, TAU); X.strokeStyle = rgba(C.sky, .35 * (1 - p)); X.lineWidth = 2; X.stroke(); }
    X.beginPath(); X.arc(cx, cy, s * .6, 0, TAU); X.fillStyle = C.navy; X.fill(); X.lineWidth = 2.5; X.strokeStyle = rgba(C.sky, .8); X.stroke();
    X.strokeStyle = C.white; X.lineWidth = 4; X.lineCap = 'round'; const d = s * .2;
    X.beginPath(); X.moveTo(cx - d, cy - d); X.lineTo(cx + d, cy + d); X.moveTo(cx + d, cy - d); X.lineTo(cx - d, cy + d); X.stroke();
    X.restore();
  }

  // ---------- 00 · abertura ----------
  function intro(t, lt) {
    const k = backOut(seg(lt, .1, .9)), cy = 760;
    // clarão inicial
    const fl = Math.max(0, 1 - lt * 1.4); if (fl > 0) { const g = X.createRadialGradient(W / 2, cy, 0, W / 2, cy, 700); g.addColorStop(0, rgba(C.sky, .35 * fl)); g.addColorStop(1, rgba(C.sky, 0)); X.fillStyle = g; X.fillRect(0, 0, W, H); }
    for (let i = 0; i < 3; i++) { const p = (lt * .45 + i / 3) % 1, r = 150 + p * 560; X.beginPath(); X.arc(W / 2, cy, r, 0, TAU); X.strokeStyle = rgba(C.sky, .22 * (1 - p) * clamp(k)); X.lineWidth = 2; X.stroke(); }
    mark(W / 2, cy, 300 * lerp(.6, 1, clamp(k)), { alpha: clamp(k * 1.4), glow: 60 });
    eyebrow(W / 2, 330, 'Nova parceria', { align: 'center', alpha: expoOut(seg(lt, .3, .9)), dotCol: C.gold, color: C.white, size: 26 });
    text('Vytal *Acadêmico*', W / 2, 1070, { size: 104, weight: 700, align: 'center', reveal: seg(lt, .6, 1.5), accent: C.sky });
    text('Um novo olhar para a *medicina.*', W / 2, 1190, { size: 48, color: C.pale, align: 'center', alpha: expoOut(seg(lt, 1.4, 2.2)), accent: C.white, weight: 500 });
  }

  // ---------- 01 · a parceria ----------
  function partner(t, lt) {
    eyebrow(W / 2, 290, 'Parceria', { align: 'center', alpha: expoOut(seg(lt, .05, .6)), dotCol: C.gold, color: C.white });
    const a1 = expoOut(seg(lt, .15, .85)), a2 = expoOut(seg(lt, .75, 1.45));
    // Vytal entra pela esquerda, o DA pela direita
    const x1 = W / 2 - (1 - a1) * 260, x2 = W / 2 + (1 - a2) * 260;
    glass(x1 - 420, 400, 840, 250, { alpha: a1, r: 40 });
    mark(x1 - 250, 525, 150, { alpha: a1, glow: 30 });
    text('Vytal', x1 - 90, 495, { size: 74, weight: 700, alpha: a1, ls: -2 });
    text('*Acadêmico*', x1 - 90, 568, { size: 62, alpha: a1, accent: C.sky });
    const p = ease(seg(lt, .6, 1.4));
    strokePath([[W / 2, 650], [W / 2, 900]], p, { col: C.sky, lw: 4, glow: 20, alpha: .9 });
    // pulso de luz percorrendo a ligação
    const q = (lt * .7) % 1; if (p >= 1) { X.save(); X.beginPath(); X.arc(W / 2, lerp(650, 900, q), 7, 0, TAU); X.fillStyle = C.white; X.shadowColor = C.sky; X.shadowBlur = 24; X.fill(); X.restore(); }
    cross(W / 2, 775, 44, expoOut(seg(lt, 1, 1.5)), t);
    glass(x2 - 420, 900, 840, 250, { alpha: a2, r: 40 });
    eyebrow(x2, 960, PARTNER.title, { align: 'center', alpha: a2, size: 22, dotCol: C.gold });
    text(PARTNER.name, x2, 1030, { size: 96, weight: 700, align: 'center', alpha: a2, ls: -3 });
    text(PARTNER.place, x2, 1100, { size: 28, color: C.muted, align: 'center', alpha: a2, weight: 500, ls: 1 });
    text('Juntos pela\n*formação médica.*', W / 2, 1290, { size: 76, weight: 700, align: 'center', reveal: seg(lt, 1.7, 2.7), accent: C.sky, lh: 1.05 });
  }

  // ---------- 02 · anatomia 3D ----------
  function atlas(t, lt, dur) {
    title(lt, 'Anatomia 3D', 'Mais do que observar.\n*Entender por dentro.*');
    stage3d(IMG.atlas, lt, dur, [['Sistema respiratório', C.sky], ['Atlas por sistemas do corpo', C.teal]], { src: [0, 60, 996, 1170] });
  }
  // ---------- 03 · histologia 3D ----------
  function histo(t, lt, dur) {
    title(lt, 'Histologia 3D', 'Abra a célula.\n*Descubra cada organela.*');
    stage3d(IMG.histo, lt, dur, [['Neurônio multipolar · corte aberto', '#B79CFF'], ['Função de cada estrutura', C.teal]], { src: [0, 80, 996, 1150] });
  }
  // ---------- 04 · radiologia ----------
  function radio(t, lt, dur) {
    title(lt, 'Radiologia imersiva', 'O exame e o corte,\n*na mesma perspectiva.*');
    const e = expoOut(seg(lt, .1, .9)), R = RADIO;
    // 3D com o plano do corte (em cima) e a tomografia axial (embaixo), do mesmo quadro capturado
    const p = seg(lt, .3, dur - .2);
    glass(60, 540 + (1 - e) * 60, 960, 1000, { alpha: e, r: 40, fillA: .05 });
    turntable(IMG.radio, p, 80, 560 + (1 - e) * 60, 920, 470, { r: 28, alpha: e, src: R.d3 });
    turntable(IMG.radio, p, 80, 1050 + (1 - e) * 60, 920, 470, { r: 28, alpha: e, src: R.ct });
    const lab = [['Tomografia real do acervo', C.sky], ['O corte percorre o tórax', C.teal]];
    lab.forEach(([l, c], i) => { const k = backOut(seg(lt, 1 + i * .4, 1.5 + i * .4)); pill(i ? W - 100 : 100, 1010 + i * 80, l, { size: 26, alpha: clamp(k), dot: c, align: i ? 'right' : 'left', fill: 'rgba(8,30,61,.9)', stroke: rgba(c, .6) }); });
  }
  const RADIO = { d3: [16, 150, 1048, 560], ct: [16, 760, 1048, 560] }; // ajustado ao layout capturado (1080×1700)

  // ---------- 05 · feedback do caso ----------
  function feedback(t, lt, dur) {
    title(lt, 'Aprender com cada caso', 'Do caso ao\n*raciocínio clínico.*');
    const e = expoOut(seg(lt, .1, 1));
    browser(IMG.feedback, [400, 120, 2080, 2360], 60, 560 + (1 - e) * 120, 960, 980, { alpha: e, scroll: ease(seg(lt, 1.2, dur - .3)) });
    [['O que você fez bem', C.teal], ['O que pode aprofundar', C.sky], ['Sinais de alerta', '#FF6B6B']].forEach(([l, c], i) => {
      const a = 1.1 + i * .5, k = backOut(seg(lt, a, a + .5)); if (k <= .005) return;
      pill(i % 2 ? W - 70 : 70, 820 + i * 230, l, { size: 30, alpha: clamp(k), dot: c, align: i % 2 ? 'right' : 'left', fill: 'rgba(8,30,61,.95)', stroke: rgba(c, .7) });
    });
  }

  // ---------- 06 · banco de questões ----------
  function quest(t, lt, dur) {
    eyebrow(90, 270, 'Banco de questões', { alpha: expoOut(seg(lt, .05, .6)) });
    counter(770, seg(lt, .2, 1.6), 82, 420, { size: 190, color: C.white, ls: -8 });
    text('questões *comentadas.*', 90, 560, { size: 58, weight: 700, accent: C.sky, alpha: expoOut(seg(lt, .5, 1.1)) });
    text('ENAMED, USP, UNICAMP, UFRJ, ENARE e mais.', 90, 640, { size: 34, color: C.pale, alpha: expoOut(seg(lt, .8, 1.4)), weight: 500 });
    const e = expoOut(seg(lt, .4, 1.3));
    browser(IMG.quest, [150, 140, 2720, 1420], 60, 760 + (1 - e) * 140, 960, 560, { alpha: e });
  }

  // ---------- 07 · coordenação ----------
  function coord(t, lt, dur) {
    title(lt, 'Para a coordenação', 'O aprendizado,\n*em perspectiva.*', { dot: C.gold });
    const e = expoOut(seg(lt, .1, 1));
    browser(IMG.coord, [470, 260, 2390, 4300], 60, 560 + (1 - e) * 120, 960, 960, { alpha: e, scroll: ease(seg(lt, .9, dur - .2)) * .55 });
    text('Painel demonstrativo · dados fictícios', W / 2, 1575, { size: 24, color: C.muted, align: 'center', alpha: e * .9, weight: 500 });
  }

  // ---------- 08 · chamada final ----------
  function outro(t, lt) {
    const k = expoOut(seg(lt, .1, 1));
    for (let i = 0; i < 2; i++) { const p = (lt * .35 + i / 2) % 1, r = 130 + p * 420; X.beginPath(); X.arc(W / 2, 540, r, 0, TAU); X.strokeStyle = rgba(C.sky, .18 * (1 - p) * k); X.lineWidth = 2; X.stroke(); }
    mark(W / 2, 540, lerp(200, 250, k), { alpha: k, glow: 50 });
    text('Vytal *Acadêmico*', W / 2, 790, { size: 92, weight: 700, align: 'center', reveal: seg(lt, .3, 1.2), accent: C.sky });
    text('×  Diretório Acadêmico UniFAA', W / 2, 890, { size: 40, weight: 600, align: 'center', alpha: expoOut(seg(lt, .9, 1.6)), color: C.pale });
    text('Aprender com\n*cada caso.*', W / 2, 1040, { size: 84, weight: 700, align: 'center', reveal: seg(lt, 1.3, 2.3), accent: C.sky, lh: 1.05 });
    let px = W / 2 - 440;
    ['Web', 'App Store', 'Google Play'].forEach((l, i) => { const e = expoOut(seg(lt, 2 + i * .15, 2.7 + i * .15)); px += pill(px, 1310 + (1 - e) * 20, l, { size: 32, alpha: e, dot: [C.gold, C.sky, C.teal][i], fill: rgba('#FFFFFF', .1) }) + 26; });
    text('vytalsaude.com.br/academico', W / 2, 1430, { size: 32, color: C.muted, align: 'center', alpha: expoOut(seg(lt, 2.4, 3)), weight: 500, ls: 1 });
  }

  video({
    dur: S.end, tr: .8,
    images: { mark: '../../vytal-mark-navy-transparent.png', atlas: seq('atlas'), histo: seq('histologia'), radio: seq('radiologia'),
      feedback: `${CAP}telas/feedback.png`, quest: `${CAP}telas/questoes.png`, coord: `${CAP}telas/coordenacao.png` },
    scenes: [[S.intro, intro], [S.partner, partner], [S.atlas, atlas], [S.histo, histo], [S.radio, radio], [S.feedback, feedback], [S.quest, quest], [S.coord, coord], [S.outro, outro]],
    chrome(t) {
      const a = expoOut(seg(t, S.partner + .4, S.partner + 1.2)) * (1 - ease(seg(t, S.outro - .4, S.outro + .2)));
      if (a <= .005) return;
      mark(118, 150, 70, { alpha: a });
      text('Vytal *Acadêmico*', 170, 152, { size: 34, weight: 700, alpha: a, accent: C.sky });
      // progresso fino no rodapé da área segura
      X.save(); X.globalAlpha = a * .8; rr(90, 1600, W - 180, 5, 3); X.fillStyle = rgba(C.pale, .15); X.fill();
      rr(90, 1600, (W - 180) * seg(t, S.partner, S.outro), 5, 3); X.fillStyle = C.sky; X.fill(); X.restore();
    }
  });
})();
