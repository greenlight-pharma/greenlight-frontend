// Resumo ENAMED · Insuficiência cardíaca · 90 s · 16:9 · sem áudio (roteiro de narração em wmed-videos/resumos-enamed/).
(() => {
  const DUR = 90;
  const S = { intro: 0, feve: 6, dx: 21, tx: 35, nyha: 57, trap: 67, recap: 82 };

  // ---------------- 00 · abertura ----------------
  function intro(t, lt) {
    bg(t, 'mint', 'roseLt', 3);
    camBegin(960 + lt * 6, 540, 1 + lt * .012);
    ecg(-40, 1960, 860, 120, seg(lt, 0, 4.5), { beats: 5, col: PAL.rose, sw: 1.5 });
    const bt = beat(t, 84);
    heart(1380, 520, 190, { sq: bt, eyes: lt < 3.2 ? 'tired' : 'worried', mouth: lt < 3.2 ? 'wobble' : 'o', pale: .25, emote: 'sweat', emoteK: seg(lt, 1.6, 2.2), aL: -.4 + wob(t, .5) * .1, aR: -.9 });
    doc(430, 900, 30, { aR: .9 + wob(t, 1.4) * .35, aL: -1.1, mouth: 'grin', eyes: 'happy', dy: -Math.abs(Math.sin(t * 5)) * .25 });
    chip(420, 250, 'RESUMO ENAMED · 90 s', { k: seg(lt, .2, .6), col: PAL.navy, size: 28 });
    txt('Insuficiência\n*cardíaca*', 540, 420, { size: 118, font: 'title', color: PAL.ink, hl: PAL.rose, pop: seg(lt, .5, 1.1) * 1.3, lh: 1.02, rot: -.03 });
    txt('o essencial que cai na prova', 540, 600, { size: 40, color: PAL.navy, alpha: easeOut(seg(lt, 1.3, 1.9)) });
    camEnd();
  }

  // ---------------- 01 · classificação por FEVE ----------------
  // régua não linear: zonas com larguras legíveis, marcações em 40 e 50
  const RX = [300, 1620], ZW = [0, 560, 920, 1320];
  const xOf = v => v <= 40 ? RX[0] + v / 40 * ZW[1] : v < 50 ? RX[0] + ZW[1] + (v - 40) / 10 * (ZW[2] - ZW[1]) : RX[0] + ZW[2] + Math.min(1, (v - 50) / 25) * (ZW[3] - ZW[2]);
  const ZONES = [
    { a: 0, b: 40, col: PAL.rose, lt: PAL.roseLt, sig: 'ICFEr', name: 'reduzida', range: '≤ 40%', at: 1.8 },
    { a: 40, b: 50, col: PAL.ochre, lt: PAL.ochreLt, sig: 'ICFElr', name: 'levemente reduzida', range: '41–49%', at: 5.2 },
    { a: 50, b: 75, col: PAL.sap, lt: PAL.sapLt, sig: 'ICFEp', name: 'preservada', range: '≥ 50%', at: 8.6 }
  ];
  function feve(t, lt) {
    bg(t, 'roseLt', 'mintLt', 5);
    header(t, S.feve + .2, 'Classificação por *FEVE*', { sub: 'FEVE = fração do sangue que o VE ejeta a cada batimento', w: 980 });
    const y = 580, v = kf(lt, [[0, 8], [1.4, 8], [2.4, 30], [4.8, 30], [5.8, 45], [8.2, 45], [9.2, 62], [15, 62]], backOut);
    // régua
    ZONES.forEach((z, i) => {
      const k = easeOut(seg(lt, .4 + i * .15, .9 + i * .15)); if (k <= 0) return;
      const xa = xOf(z.a) + (i ? 4 : 0), xb = lerp(xa, xOf(z.b) - (i < 2 ? 4 : 0), k), act = v > z.a && v <= z.b + (i === 2 ? 99 : 0) && lt > z.at - .4;
      paint(rrPts(xa, y - 38, xb - xa, 76, 20, 1.5), { wash: act ? z.col : z.lt, washOp: 245, fill: z.col, fillOp: 50, tex: .6, ink: PAL.ink, sw: 1.1 });
    });
    for (const m of [40, 50]) txt(m + '%', xOf(m), y + 70, { size: 32, color: PAL.ink, alpha: easeOut(seg(lt, 1, 1.5)) });
    txt('0%', RX[0], y + 70, { size: 26, color: PAL.navy, alpha: easeOut(seg(lt, 1, 1.5)) * .8 });
    // cursor: coração pequeno que desliza sobre a régua
    const cx = xOf(v), ck = easeOut(seg(lt, .8, 1.3));
    if (ck > 0) {
      inkLine([[cx, y - 60], [cx, y + 40]], 1.6, PAL.ink, 'ink', 0);
      heart(cx, y - 120, 48 * ck, { sq: beat(t, 90), eyes: v < 41 ? 'tired' : v < 50 ? 'normal' : 'happy', mouth: v < 41 ? 'wobble' : 'smile', pale: v < 41 ? .35 : 0, arms: false, noShadow: true });
      txt(Math.round(v) + '%', cx, y - 215, { size: 40, font: 'title', color: PAL.ink, alpha: ck });
    }
    // cartões de cada tipo
    ZONES.forEach((z, i) => {
      const k = seg(lt, z.at, z.at + .5); if (k <= 0) return;
      const cx = [520, 960, 1400][i], cy = 850, w = 400, h = 190;
      push(); translate(cx, cy); scale(backOut(k)); translate(-cx, -cy);
      card(cx - w / 2, cy - h / 2, w, h, { col: PAL.cream, tint: z.col, tintOp: 35 });
      paint(rrPts(cx - w / 2, cy - h / 2, 18, h, 9, 1), { wash: z.col, ink: null });
      pop();
      const a = backOut(k);
      txt(z.sig, cx, cy - 48 * a, { size: 54 * a, font: 'title', color: z.col, shadow: 'rgba(29,42,49,.25)' });
      txt(z.name, cx, cy + 10 * a, { size: 32 * a, color: PAL.ink });
      txt(z.range, cx, cy + 56 * a, { size: 38 * a, color: PAL.navy, weight: 800 });
    });
  }

  // ---------------- 02 · diagnóstico ----------------
  function dx(t, lt) {
    bg(t, 'mintLt', 'sky', 8);
    header(t, S.dx + .2, 'Diagnóstico', { w: 640 });
    const items = [
      { at: 1.2, label: 'Clínica', sub: 'sinais e sintomas', icon: (x, y) => iconSteth(x, y, 150) },
      { at: 3.0, label: 'Eco', sub: 'FEVE e estrutura', icon: (x, y) => iconEcho(x, y, 190, t) },
      { at: 4.8, label: 'BNP / NT-proBNP', sub: 'peptídeos natriuréticos', icon: (x, y) => iconTube(x, y, 160, .55 + wob(t, .4) * .03) }
    ];
    items.forEach((it, i) => {
      const k = seg(lt, it.at, it.at + .5); if (k <= 0) return;
      const cx = 400 + i * 560, cy = 470, w = 440, h = 400, a = backOut(k), bob = wob(t, .35, i * .3) * 6;
      push(); translate(cx, cy + bob); scale(a); translate(-cx, -cy - bob);
      card(cx - w / 2, cy - h / 2 + bob, w, h, { tint: PAL.mint, tintOp: 30 });
      it.icon(cx, cy - 50 + bob);
      pop();
      txt(it.label, cx, cy + 105 * a + bob, { size: (i === 2 ? 44 : 54) * a, font: 'title', color: PAL.teal });
      txt(it.sub, cx, cy + 158 * a + bob, { size: 28 * a, color: PAL.navy, weight: 700 });
      if (i) txt('+', cx - 280, cy, { size: 90, font: 'title', color: PAL.rose, pop: k * 1.2 });
    });
    // principal causa
    const kc = seg(lt, 7.2, 7.8);
    if (kc > 0) {
      const cy = 830;
      push(); translate(960, cy); scale(backOut(kc)); translate(-960, -cy);
      card(360, cy - 85, 1200, 170, { col: PAL.cream, tint: PAL.ochre, tintOp: 40 });
      iconArtery(520, cy, 220, t, easeOut(seg(lt, 8, 9)));
      pop();
      txt('Principal causa: *isquêmica*', 1080, cy - 16, { size: 54, font: 'title', color: PAL.ink, hl: PAL.rose, pop: kc * 1.2 });
      txt('doença arterial coronariana', 1080, cy + 44, { size: 30, color: PAL.navy, alpha: easeOut(seg(lt, 8, 8.6)) });
    }
  }

  // ---------------- 03 · tratamento da ICFEr ----------------
  const PILLARS = [
    { l: 'IECA / BRA\nou *ARNI*', c: PAL.teal },
    { l: 'Beta-\nbloqueador', c: PAL.indigo },
    { l: 'Espirono-\nlactona', c: PAL.violet },
    { l: '*iSGLT2*', c: PAL.coral }
  ];
  function temple(t, lt, x0) {
    const base = 880, colH = 400, cw = 250, gap = 50, total = 4 * cw + 3 * gap, left = x0 - total / 2;
    paint(rrPts(left - 70, base, total + 140, 50, 10, 2), { wash: PAL.cream, fill: PAL.ochreLt, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    paint(rrPts(left - 110, base + 46, total + 220, 40, 10, 2), { wash: PAL.cream, fill: PAL.ochreLt, fillOp: 60, ink: PAL.ink, sw: 1.2 });
    PILLARS.forEach((p, i) => {
      const k = seg(lt, 1.6 + i * 1.7, 2.3 + i * 1.7); if (k <= 0) return;
      const h = colH * backOut(k), x = left + i * (cw + gap), top = base - h;
      paint(rrPts(x, top, cw, h, 12, 2), { wash: mixCol(PAL.cream, p.c, .28), ink: PAL.ink, sw: 1.2 });
      for (let f = 1; f < 4; f++) inkLine([[x + f * cw / 4, top + 30], [x + f * cw / 4, base - 30]], .5, mixCol(p.c, PAL.ink, .3), 'inkfine', 0);
      paint(rrPts(x - 16, top - 26, cw + 32, 32, 8, 1.5), { wash: p.c, ink: PAL.ink, sw: 1.1 });
      if (k > .6) {
        paint(rrPts(x + 14, top + h * .5 - 66, cw - 28, 132, 18, 1.5), { wash: PAL.cream, washOp: 240, ink: mixCol(p.c, PAL.ink, .2), sw: .8 });
        txt(p.l, x + cw / 2, top + h * .5, { size: 36, color: PAL.ink, hl: p.c, pop: seg(lt, 2.1 + i * 1.7, 2.6 + i * 1.7) * 1.3, lh: 1.08 });
        txt(String(i + 1), x + cw / 2, top - 10, { size: 26, color: PAL.cream, weight: 800 });
      }
    });
    // frontão com a mensagem-chave
    const kr = seg(lt, 8.6, 9.3);
    if (kr > 0) {
      const dy = lerp(-500, 0, easeOut(kr)) + (kr >= 1 ? 0 : 0), top = base - colH - 30 + dy;
      paint([[left - 90, top], [x0, top - 170], [left + total + 90, top]], { wash: PAL.cream, fill: PAL.ochre, fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.3 });
      paint(rrPts(left - 90, top - 6, total + 180, 36, 8, 1.5), { wash: PAL.ochre, ink: PAL.ink, sw: 1.1 });
      txt('↓ MORTALIDADE', x0, top - 62, { size: 50, font: 'title', color: PAL.rose, shadow: 'rgba(29,42,49,.25)' });
      if (kr >= 1) { const q = seg(lt, 9.3, 9.8); if (q > 0 && q < 1) { paint(ellPts(x0, base - colH / 2, 700 * q, 400 * q, 20), { ink: PAL.ochre, sw: 2 * (1 - q) }); } }
    }
  }
  function tx(t, lt) {
    bg(t, 'ochreLt', 'mintLt', 11);
    const pan = ease(seg(lt, 11.5, 13));
    camBegin(lerp(960, 1240, pan), lerp(540, 560, pan), lerp(1, .82, pan));
    header(t, S.tx + .2, 'ICFEr: os *4 pilares*', { sub: 'terapia que *reduz mortalidade*', w: 900 });
    temple(t, lt, 960);
    // diurético de alça: alívio de sintomas
    const kd = seg(lt, 13, 13.6);
    if (kd > 0) {
      const x = 2020, y = 560;
      push(); translate(x, y); scale(backOut(kd)); translate(-x, -y);
      card(x - 300, y - 300, 600, 640, { tint: PAL.sky, tintOp: 40 });
      iconDrop(x, y - 130, 220 * (1 + beat(t, 50) * .04));
      face(x, y - 110, 26, { eyes: 'happy', mouth: 'smile' });
      pop();
      const a = backOut(kd);
      txt('Diurético de alça', x, y + 55 * a, { size: 58 * a, font: 'title', color: PAL.indigo });
      txt('ex.: furosemida', x, y + 115 * a, { size: 36 * a, color: PAL.navy, weight: 700 });
      txt('para *congestão*', x, y + 190 * a, { size: 46 * a, color: PAL.ink, hl: PAL.indigo });
      txt('alívio de *sintomas*', x, y + 250 * a, { size: 46 * a, color: PAL.ink, hl: PAL.teal });
    }
    camEnd();
    const kd2 = seg(lt, 15.5, 16);
    if (kd2 > 0) stamp(1500, 930, 'SINTOMÁTICO · NÃO É PILAR', { k: kd2, col: PAL.indigo, size: 34, rot: -.05 });
  }

  // ---------------- 04 · NYHA ----------------
  const STEPS = [
    { n: 'I', d: 'sem limitação', c: PAL.sap },
    { n: 'II', d: 'sintomas nos esforços *habituais*', c: PAL.ochre },
    { n: 'III', d: 'sintomas em esforços *menores* que os habituais', c: PAL.coral },
    { n: 'IV', d: 'sintomas *em repouso*', c: PAL.rose }
  ];
  function nyha(t, lt) {
    bg(t, 'sapLt', 'roseLt', 14);
    header(t, S.nyha + .2, 'NYHA *I – IV*', { sub: 'classe *funcional*: quanto esforço gera sintomas', w: 620 });
    const x0 = 200, sw = 385, sh = 150, base = 1000;
    STEPS.forEach((s, i) => {
      const k = seg(lt, .8 + i * 2, 1.3 + i * 2); if (k <= 0) return;
      const x = x0 + i * sw, top = base - (i + 1) * sh, hh = (i + 1) * sh * easeOut(k);
      paint(rrPts(x, base - hh, sw - 10, hh, 10, 2), { wash: mixCol(PAL.cream, s.c, .38), ink: PAL.ink, sw: 1.2 });
      paint(rrPts(x, base - hh, sw - 10, 16, 8, 1), { wash: s.c, ink: null });
      txt(s.n, x + sw / 2 - 5, top + 48, { size: 56, font: 'title', color: PAL.ink, pop: seg(lt, 1.1 + i * 2, 1.6 + i * 2) * 1.3 });
      txt(s.d, x + sw / 2 - 5, top + (i ? 130 : 108), { size: 31, color: PAL.ink, hl: mixCol(s.c, PAL.ink, .35), maxW: 330, alpha: easeOut(seg(lt, 1.2 + i * 2, 1.7 + i * 2)) });
    });
    // o guia sobe a escada e cansa
    const stepF = kf(lt, [[1.3, 0], [2.6, 0], [3.3, 1], [4.6, 1], [5.3, 2], [6.6, 2], [7.3, 3], [10, 3]], ease);
    const si = Math.round(stepF), hop = Math.sin(frac(stepF) * Math.PI) * 60;
    const gx = x0 + stepF * sw + sw / 2 - 5, gy = base - (Math.floor(stepF + .5) + 1) * sh - hop;
    const faces = [['happy', 'grin', null], ['normal', 'smile', null], ['worried', 'o', 'sweat'], ['tired', 'wobble', 'sweat']][si];
    if (lt > 1.3) doc(gx + 90, gy, 15, { eyes: faces[0], mouth: faces[1], emote: faces[2], emoteK: 1, aL: si >= 3 ? -1.3 : -.8, aR: si >= 3 ? -1.3 : .3 + wob(t, 1.2) * .2, sq: si >= 3 ? .18 : 0 });
  }

  // ---------------- 05 · pegadinhas ----------------
  const TRAPS = [
    { at: .6, big: 'Diurético *não* reduz mortalidade', small: 'só alivia sintomas (congestão)', icon: (x, y, t) => iconDrop(x, y, 150) },
    { at: 5.6, big: 'ARNI + IECA: *nunca juntos*', small: 'risco de angioedema → washout de 36 h ao trocar IECA por ARNI', icon: (x, y, t) => { iconTube(x - 40, y, 120, .5, PAL.teal); iconTube(x + 40, y, 120, .5, PAL.violet); } },
    { at: 10.6, big: 'Betabloqueador: inicie com o paciente *compensado*', small: 'euvolêmico — não é hora de começar na descompensação aguda', icon: (x, y, t) => heart(x, y + 10, 70, { sq: beat(t, 60), eyes: 'happy', mouth: 'smile', arms: false, noShadow: true }) }
  ];
  function trap(t, lt) {
    bg(t, 'roseLt', 'ochreLt', 17);
    header(t, S.trap + .2, '*Pegadinhas*', { col: PAL.rose, w: 640, hl: PAL.rose });
    TRAPS.forEach((p, i) => {
      const end = i < 2 ? TRAPS[i + 1].at : 15.2, kin = seg(lt, p.at, p.at + .45), kout = seg(lt, end - .4, end);
      if (kin <= 0 || kout >= 1) return;
      const sx = backOut(kin) * (1 - easeIn(kout)), cx = 820, cy = 560, w = 1180, h = 470;
      push(); translate(cx, cy); scale(Math.max(.01, sx), 1); translate(-cx, -cy);
      card(cx - w / 2, cy - h / 2, w, h, { tint: PAL.rose, tintOp: 25 });
      paint(ellPts(cx - w / 2 + 150, cy - 40, 105, 105, 22, 2), { wash: PAL.cream, fill: PAL.roseLt, fillOp: 80, ink: PAL.ink, sw: 1 });
      p.icon(cx - w / 2 + 150, cy - 40, t);
      pop();
      const a = Math.max(0, sx);
      txt(String(i + 1), cx - w / 2 + 150, cy + 120, { size: 60 * a, font: 'title', color: PAL.rose, alpha: a });
      txt(p.big, cx + 110, cy - 80, { size: 54, font: 'title', color: PAL.ink, hl: PAL.rose, maxW: 800, alpha: a, lh: 1.15 });
      txt(p.small, cx + 110, cy + 110, { size: 34, color: PAL.navy, maxW: 800, alpha: a * easeOut(seg(lt, p.at + .8, p.at + 1.3)), weight: 700 });
      warnSign(cx + w / 2 - 30, cy - h / 2 + 10, 70, seg(lt, p.at + .4, p.at + .9));
    });
    const which = lt < 5.6 ? 0 : lt < 10.6 ? 1 : 2, since = lt - TRAPS[which].at;
    doc(1640, 930, 26, { aL: -1, aR: 1.1 + wob(t, 1.5) * .15, eyes: since < 1.2 ? 'wide' : 'normal', mouth: since < 1.2 ? 'o' : 'smile', emote: '!', emoteK: seg(since, .3, .7) * (1 - seg(since, 2.6, 3)), flip: true });
  }

  // ---------------- 06 · revisão + encerramento ----------------
  const RECAP = [
    'FEVE: *≤40* reduzida · *41–49* levemente reduzida · *≥50* preservada',
    'Diagnóstico: clínica + eco + BNP/NT-proBNP',
    '4 pilares: IECA/BRA ou ARNI + BB + espironolactona + iSGLT2',
    'NYHA I–IV = limitação *funcional*',
    'Diurético de alça: sintoma, *não* mortalidade'
  ];
  function recap(t, lt) {
    bg(t, 'mint', 'sky', 21);
    const out = ease(seg(lt, 5.4, 6.2));
    if (out < 1) {
      const cy = lerp(560, 480, 0) - out * 900;
      card(160, cy - 360, 1600, 700, { tint: PAL.mint, tintOp: 25 });
      txt('Revisão relâmpago', 960, cy - 285, { size: 60, font: 'title', color: PAL.teal, pop: seg(lt, .1, .5) * 1.3 });
      RECAP.forEach((r, i) => {
        const k = seg(lt, .5 + i * .8, .9 + i * .8), y = cy - 170 + i * 115;
        if (k <= 0) return;
        checkmark(260, y, 64, k);
        txt(r, 320, y, { size: 38, color: PAL.ink, align: 'left', alpha: easeOut(k), hl: PAL.teal, maxW: 1380 });
      });
    }
    const ko = seg(lt, 5.8, 6.4);
    if (ko > 0) {
      heart(1180, 560, 150 * backOut(ko), { sq: beat(t, 72), eyes: 'happy', mouth: 'grin', aR: .9 + wob(t, 1.4) * .3, aL: -.5 });
      doc(720, 800, 24 * backOut(ko), { aR: 1 + wob(t, 1.4, .5) * .35, eyes: 'happy', mouth: 'grin', dy: -Math.abs(Math.sin(t * 5)) * .3 });
      txt('Bons estudos!', 960, 220, { size: 90, font: 'title', color: PAL.ink, pop: ko * 1.3 });
      txt('WMed*.ai*', 960, 930, { size: 60, font: 'title', color: PAL.navy, hl: PAL.teal, pop: seg(lt, 6.2, 6.7) * 1.3 });
    }
  }

  video({
    slug: 'insuficiencia-cardiaca', title: 'Insuficiência cardíaca', dur: DUR,
    sections: [[S.intro, 'Abertura'], [S.feve, 'Classificação'], [S.dx, 'Diagnóstico'], [S.tx, 'Tratamento'], [S.nyha, 'NYHA'], [S.trap, 'Pegadinhas'], [S.recap, 'Revisão']],
    scenes: [[S.intro, intro], [S.feve, feve], [S.dx, dx], [S.tx, tx], [S.nyha, nyha], [S.trap, trap], [S.recap, recap]]
  });
})();
