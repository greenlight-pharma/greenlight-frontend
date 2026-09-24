// Vídeo institucional · Conheça a WMed · 40 s · motor tech (--studio=tech).
// Usa capturas reais do app (tools/capture-app.mjs → out/app-captures/): giros 3D de Genética e Microbiologia,
// tela da Biblioteca molecular e tela do Caso clínico.
(() => {
  const S = { intro: 0, w: 4.5, ai: 13, caso: 21.5, d3: 30, outro: 36.5 };
  const CAP = 'out/app-captures/', seq = m => Array.from({ length: 90 }, (_, i) => `${CAP}${m}/f${String(i).padStart(3, '0')}.jpg`);

  // ---------------- 00 · abertura ----------------
  function intro(t, lt) {
    const k = expoOut(seg(lt, .1, 1.1)), s = 190 * lerp(.7, 1, k);
    // anéis que pulsam a partir do logo
    for (let i = 0; i < 3; i++) {
      const p = ((lt * .45 + i / 3) % 1), r = 130 + p * 520;
      X.beginPath(); X.arc(W / 2, 430, r, 0, TAU); X.strokeStyle = rgba(C.blue, .16 * (1 - p) * k); X.lineWidth = 2; X.stroke();
    }
    logo(W / 2 - s / 2, 430 - s / 2, s, { alpha: k });
    text('WMed', W / 2, 640, { size: 110, weight: 600, align: 'center', reveal: seg(lt, .6, 1.5) });
    text('Medicina baseada em *evidências*, com inteligência artificial.', W / 2, 740, { size: 36, color: C.muted, align: 'center', alpha: expoOut(seg(lt, 1.3, 2.1)), accent: C.blue });
    let px = W / 2 - 440;
    ['IA ilimitada', 'Feedback de casos', 'Conteúdo 3D'].forEach((l, i) => {
      const e = expoOut(seg(lt, 2 + i * .15, 2.6 + i * .15));
      px += pill(px, 840 + (1 - e) * 16, l, { size: 24, weight: 400, alpha: e, dot: [C.blue, C.violet, C.cyan][i], color: C.ink2 }) + 16;
    });
  }

  // ---------------- 01 · o W da WMed ----------------
  const WORDS = [
    ['Why', 'Por que essa conduta?'],
    ['What works', 'O que realmente funciona'],
    ['Weight of evidence', 'O peso de cada evidência'],
    ['Worldwide guidelines', 'Diretrizes do mundo todo'],
    ['Wisdom', 'Decisão clínica bem fundamentada']
  ];
  const LEVELS = ['Opinião de especialistas', 'Séries de casos', 'Coortes e caso-controle', 'Ensaios randomizados', 'Metanálises'];
  function wwords(t, lt) {
    eyebrow(120, 250, 'O W da WMed', { alpha: expoOut(seg(lt, .1, .6)) });
    const step = 1.6, cur = clamp(Math.floor((lt - .4) / step), 0, 4);
    WORDS.forEach(([en, pt], i) => {
      const a = .4 + i * step, kin = expoOut(seg(lt, a, a + .55)), kout = i < 4 ? ease(seg(lt, a + step - .25, a + step + .1)) : 0;
      if (kin <= .005 || kout >= .995) return;
      const al = kin * (1 - kout), dy = (1 - kin) * 50 - kout * 50;
      // o W em azul, o resto em tinta
      text('*W*' + en.slice(1), 114, 450 + dy, { size: en.length > 12 ? 104 : 140, weight: 600, alpha: al, accent: C.blue });
      text(pt, 120, 590 + dy, { size: 40, color: C.muted, alpha: al * expoOut(seg(lt, a + .2, a + .7)) });
    });
    // contador 01–05
    WORDS.forEach((_, i) => {
      const on = i === cur, e = expoOut(seg(lt, .3 + i * .05, .8 + i * .05));
      rr(120 + i * 58, 700, on ? 44 : 30, 6, 3); X.globalAlpha = e; X.fillStyle = on ? C.ink : rgba(C.ink, .15); X.fill(); X.globalAlpha = 1;
    });
    text('Evidência em primeiro lugar, em cada resposta.', 120, 790, { size: 30, color: C.ink2, alpha: expoOut(seg(lt, 7.2, 7.9)) });
    // pirâmide da evidência: cresce um nível por palavra
    const cx = 1390, base = 900, lh = 118, wBase = 820;
    LEVELS.forEach((lab, i) => {
      const a = .5 + i * step, e = expoOut(seg(lt, a, a + .6)); if (e <= .005) return;
      const y1 = base - i * lh, y0 = y1 - lh + 10, w1 = wBase * (1 - i / 6), w0 = wBase * (1 - (i + 1) / 6), on = i === cur;
      X.save(); X.globalAlpha = e; X.translate(0, (1 - e) * 30);
      X.beginPath(); X.moveTo(cx - w1 / 2, y1); X.lineTo(cx + w1 / 2, y1); X.lineTo(cx + w0 / 2, y0); X.lineTo(cx - w0 / 2, y0); X.closePath();
      X.fillStyle = on ? C.blue : rgba(C.blue, .07 + i * .04); X.shadowColor = on ? rgba(C.blue, .35) : 'transparent'; X.shadowBlur = on ? 40 : 0; X.fill(); X.shadowBlur = 0;
      X.lineWidth = 1.5; X.strokeStyle = on ? C.blue : rgba(C.blue, .25); X.stroke();
      text(lab, cx, (y0 + y1) / 2 + 2, { size: i === 4 ? 22 : 24, weight: 600, align: 'center', color: on ? '#FFFFFF' : C.ink2, maxW: w0 - 30 });
      X.restore();
    });
    eyebrow(cx, base + 50, 'Pirâmide da evidência', { size: 16, align: 'center', dot: false, alpha: expoOut(seg(lt, .8, 1.4)) });
  }

  // ---------------- 02 · IA ilimitada ----------------
  const Q = 'Quais terapias reduzem mortalidade na ICFEr?';
  const A = 'Na IC com fração de ejeção reduzida, quatro classes reduzem mortalidade: IECA/BRA ou ARNI, betabloqueador, antagonista mineralocorticoide e iSGLT2 [1][2]. Diuréticos aliviam a congestão, sem benefício em mortalidade [1].';
  function ai(t, lt) {
    header(lt, 'Inteligência artificial', 'IA *ilimitada*', 'Pergunte quanto quiser. Respostas com fontes que você confere.', { subW: 640 });
    // destaques à esquerda
    [['∞', 'Perguntas sem limite'], ['[1]', 'Referências clicáveis'], ['PT', 'Em português, com a literatura mundial']].forEach(([ic, lab], i) => {
      const e = expoOut(seg(lt, 1.2 + i * .25, 1.9 + i * .25)), y = 520 + i * 110;
      X.save(); X.globalAlpha = e; X.translate((1 - e) * -30, 0);
      rr(120, y - 36, 72, 72, 18); X.fillStyle = rgba(C.blue, .08); X.fill();
      text(ic, 156, y + 2, { size: ic === '∞' ? 46 : 26, weight: 600, align: 'center', color: C.blue, mono: ic !== '∞' });
      text(lab, 220, y, { size: 30, weight: 600, maxW: 460 });
      X.restore();
    });
    // janela de conversa (como no app)
    const k = expoOut(seg(lt, .4, 1.2)), x = 820, y = 250, w = 980, h = 720;
    panel(x, y + (1 - k) * 40, w, h, { alpha: k, r: 24 });
    if (k < .01) return;
    X.save(); X.globalAlpha = k; X.translate(0, (1 - k) * 40);
    eyebrow(x + 40, y + 46, 'Conversa', { size: 15, dotCol: C.green });
    text('Sem limite de perguntas', x + w - 40, y + 46, { size: 18, mono: true, color: C.muted, align: 'right' });
    X.strokeStyle = C.line; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 40, y + 82); X.lineTo(x + w - 40, y + 82); X.stroke();
    // pergunta digitada
    const qn = Math.floor(clamp(seg(lt, 1.2, 2.6)) * Q.length);
    if (qn > 0) {
      X.font = `400 26px ${F.sans}`; const qw = Math.min(X.measureText(Q).width + 50, w - 200);
      rr(x + w - 40 - qw, y + 110, qw, 64, 16); X.fillStyle = C.bg; X.fill(); X.strokeStyle = C.line; X.stroke();
      text(Q.slice(0, qn), x + w - 40 - qw + 25, y + 143, { size: 26 });
    }
    // resposta em streaming
    const an = Math.floor(clamp(seg(lt, 3, 6)) * A.length);
    if (lt > 2.7) {
      logo(x + 40, y + 210, 36);
      text('WMed', x + 90, y + 229, { size: 24, weight: 600 });
      text('pesquisa · síntese', x + 170, y + 230, { size: 18, mono: true, color: C.muted });
      const dots = lt < 3 ? '•••'.slice(0, 1 + Math.floor(lt * 6) % 3) : '';
      text(A.slice(0, an).replace(/\[(\d)\]/g, '*[$1]*') + (an < A.length && an > 0 ? ' ▍' : dots), x + 40, y + 290, { size: 28, lh: 1.45, maxW: w - 80, accent: C.blue, color: C.ink2 });
    }
    // fontes
    [['1', 'ESC 2021 · diretriz de insuficiência cardíaca', 'Eur Heart J'], ['2', 'Revisão sistemática e metanálise em rede', 'Europe PMC']].forEach(([n, ti, src], i) => {
      const e = expoOut(seg(lt, 6.2 + i * .3, 6.9 + i * .3)), yy = y + 560 + i * 72; if (e <= .005) return;
      X.save(); X.globalAlpha = e; X.translate(0, (1 - e) * 20);
      rr(x + 40, yy, w - 80, 58, 12); X.fillStyle = C.bg; X.fill(); X.strokeStyle = C.line; X.lineWidth = 1.5; X.stroke();
      text(`[${n}]`, x + 62, yy + 30, { size: 20, mono: true, color: C.blue });
      text(ti, x + 120, yy + 30, { size: 22, weight: 600 });
      text(src + ' ↗', x + w - 62, yy + 30, { size: 20, color: C.muted, align: 'right' });
      X.restore();
    });
    X.restore();
  }

  // ---------------- 03 · feedback de casos clínicos ----------------
  const HYP = [['Insuficiência cardíaca descompensada', .82, C.blue], ['Pneumonia comunitária', .46, C.violet], ['Tromboembolismo pulmonar', .22, C.cyan]];
  function caso(t, lt) {
    header(lt, 'Prática clínica', 'Feedback de *casos clínicos*', 'Conte o caso por texto ou voz. Discuta hipóteses, exames e condutas.', { subW: 700 });
    // etapas do app: Seu relato → Revisão → Feedback
    const stage = lt < 3.2 ? 0 : lt < 4.4 ? 1 : 2;
    let px = 120;
    ['1  Seu relato', '2  Revisão', '3  Feedback'].forEach((l, i) => {
      const e = expoOut(seg(lt, .8 + i * .15, 1.4 + i * .15)), on = i === stage;
      px += pill(px, 500, l, { size: 22, alpha: e, fill: on ? C.ink : C.page, color: on ? '#FFFFFF' : C.muted, stroke: on ? false : C.line }) + 12;
    });
    // relato por voz: forma de onda
    const kr = expoOut(seg(lt, 1, 1.7)) * (1 - ease(seg(lt, 4.2, 4.8)));
    if (kr > .005) {
      panel(120, 570, 640, 280, { alpha: kr });
      X.save(); X.globalAlpha = kr;
      X.beginPath(); X.arc(170, 625, 9, 0, TAU); X.fillStyle = lt < 3.2 ? rgba(C.red, .5 + .5 * Math.abs(wob(t, 1.2))) : C.faint; X.fill();
      text(lt < 3.2 ? 'Gravando relato' : 'Transcrito e organizado', 196, 626, { size: 24, weight: 600 });
      text(mm((lt - 1) * 14), 720, 626, { size: 20, mono: true, color: C.muted, align: 'right' });
      for (let i = 0; i < 46; i++) {
        const live = lt < 3.2, amp = live ? (.25 + .75 * Math.abs(Math.sin(i * .7 + t * 9) * Math.sin(i * .23 + t * 3.1))) : .12 + .5 * hash(i);
        const hh = 110 * amp, bx = 160 + i * 12.6;
        rr(bx, 740 - hh / 2, 6, hh, 3); X.fillStyle = i / 46 < seg(lt, 1, 3.2) ? C.blue : rgba(C.ink, .15); X.fill();
      }
      text('“Paciente de 68 anos, dispneia progressiva e edema…”', 160, 820, { size: 22, color: C.muted, alpha: expoOut(seg(lt, 2, 2.6)) });
      X.restore();
    }
    // feedback com abas
    const kf2 = expoOut(seg(lt, 3.6, 4.4)), x = 820, y = 330, w = 980, h = 640;
    panel(x, y + (1 - kf2) * 40, w, h, { alpha: kf2, r: 24 });
    if (kf2 > .005) {
      X.save(); X.globalAlpha = kf2; X.translate(0, (1 - kf2) * 40);
      eyebrow(x + 40, y + 50, 'Feedback do caso', { size: 15, dotCol: C.violet });
      let tx = x + 40;
      ['Resumo', 'Hipóteses', 'Exames', 'Condutas'].forEach((l, i) => { tx += pill(tx, y + 110, l, { size: 20, weight: i === 1 ? 600 : 400, fill: i === 1 ? C.bg : C.page, color: i === 1 ? C.ink : C.muted, stroke: i === 1 ? C.ink : C.line }) + 10; });
      text('Hipóteses diagnósticas', x + 40, y + 180, { size: 30, weight: 600 });
      HYP.forEach(([lab, v, col], i) => {
        const e = expoOut(seg(lt, 4.6 + i * .35, 5.3 + i * .35)), yy = y + 240 + i * 80;
        X.save(); X.globalAlpha = e;
        text(lab, x + 40, yy, { size: 26, color: C.ink2 });
        text(['alta', 'intermediária', 'baixa'][i], x + w - 40, yy, { size: 20, mono: true, color: C.muted, align: 'right' });
        rr(x + 40, yy + 26, w - 80, 10, 5); X.fillStyle = rgba(C.ink, .07); X.fill();
        rr(x + 40, yy + 26, Math.max(10, (w - 80) * v * expoOut(seg(lt, 4.8 + i * .35, 5.8 + i * .35))), 10, 5); X.fillStyle = col; X.fill();
        X.restore();
      });
      [['check', 'Pontos fortes', 'Anamnese bem explorada', C.green], ['alert', 'Pontos de atenção', 'Sinais de alerta a investigar', C.amber]].forEach(([ic, a, b, col], i) => {
        const e = expoOut(seg(lt, 6.1 + i * .3, 6.8 + i * .3)), xx = x + 40 + i * ((w - 100) / 2 + 20), yy = y + 480;
        X.save(); X.globalAlpha = e; X.translate(0, (1 - e) * 16);
        rr(xx, yy, (w - 100) / 2, 128, 16); X.fillStyle = rgba(col, .07); X.fill(); X.strokeStyle = rgba(col, .3); X.lineWidth = 1.5; X.stroke();
        badge(ic, xx + 50, yy + 64, 26, col, 1, e);
        text(a, xx + 94, yy + 46, { size: 24, weight: 600 });
        text(b, xx + 94, yy + 86, { size: 21, color: C.muted, maxW: (w - 100) / 2 - 110 });
        X.restore();
      });
      X.restore();
    }
    text('Caso ilustrativo.', 120, 960, { size: 18, mono: true, color: C.faint, alpha: kf2 });
  }

  // ---------------- 04 · conteúdo 3D ----------------
  function d3(t, lt) {
    header(lt, 'Acervo visual', 'Conteúdo *3D* para explorar', null);
    const cards = [
      { k: 'cell', lab: 'Genética', sub: 'Célula em corte · núcleo e mitocôndrias', at: .5 },
      { k: 'ecoli', lab: 'Microbiologia', sub: 'Escherichia coli · parede e flagelos', at: .8 },
      { k: 'atp', lab: 'Biblioteca molecular', sub: 'ATP · transferência de energia', at: 1.1 }
    ];
    const cw = 540, gap = 30, x0 = (W - 3 * cw - 2 * gap) / 2, y = 330, ih = 405;
    cards.forEach((c, i) => {
      const e = expoOut(seg(lt, c.at, c.at + .8)), x = x0 + i * (cw + gap), yy = y + (1 - e) * 60;
      panel(x, yy, cw, ih + 130, { alpha: e, r: 24 });
      if (e < .005) return;
      X.save(); X.globalAlpha = e;
      const ix = x + 14, iy = yy + 14, iw = cw - 28, p = seg(lt, 0, 6.5);
      if (c.k === 'cell') turntable(IMG.cell, p, ix, iy, iw, ih - 14, { r: 14 });
      else if (c.k === 'ecoli') turntable(IMG.ecoli, p, ix, iy, iw, ih - 14, { r: 14, src: [0, .08, 1, .92] });
      else cover(IMG.atp, ix, iy, iw, ih - 14, { r: 14, src: [.28, .36, .52, .5], zoom: 1 + lt * .02 });
      pill(ix + 18, iy + 36, '3D', { size: 17, mono: true, weight: 500, color: C.ink });
      text(c.lab, x + 34, yy + ih + 44, { size: 32, weight: 600 });
      text(c.sub, x + 34, yy + ih + 88, { size: 22, color: C.muted });
      X.restore();
    });
    let px = 120; const mods = ['Anatomia', 'Histologia', 'Genética', 'Moléculas', 'Microbiologia', 'Radiologia'];
    const total = mods.reduce((s, m) => { X.font = `400 22px ${F.sans}`; return s + X.measureText(m).width + 40 + 12; }, 0);
    px = W / 2 - total / 2;
    mods.forEach((m, i) => { const e = expoOut(seg(lt, 2 + i * .12, 2.6 + i * .12)); px += pill(px, 945 + (1 - e) * 14, m, { size: 22, weight: 400, alpha: e, color: C.ink2 }) + 12; });
  }

  // ---------------- 05 · encerramento ----------------
  function outro(t, lt) {
    const k = expoOut(seg(lt, .1, 1)), s = 160 * lerp(.8, 1, k);
    logo(W / 2 - s / 2, 300 + (1 - k) * 30, s, { alpha: k });
    text('WMed', W / 2, 555, { size: 104, weight: 600, align: 'center', reveal: seg(lt, .3, 1.1) });
    text('Estude com *evidência*. Pratique com feedback.', W / 2, 650, { size: 38, color: C.muted, align: 'center', alpha: expoOut(seg(lt, .7, 1.4)), accent: C.blue });
    pill(W / 2, 770, 'vytalsaude.com.br/wmed', { size: 26, align: 'center', fill: C.ink, stroke: false, color: '#FFFFFF', dot: C.cyan, alpha: expoOut(seg(lt, 1, 1.7)) });
  }

  video({
    slug: 'wmed-apresentacao', title: 'Conheça a WMed', dur: 40, chrome: [3.9, 36.6], code: 'WMED', kicker: 'Conheça a WMed',
    images: { cell: seq('genetica'), ecoli: seq('microbiologia'), atp: `${CAP}screens/molecular.png` },
    sections: [[S.intro, 'WMed'], [S.w, 'Evidência'], [S.ai, 'IA'], [S.caso, 'Casos'], [S.d3, '3D'], [S.outro, 'Comece']],
    scenes: [[S.intro, intro], [S.w, wwords], [S.ai, ai], [S.caso, caso], [S.d3, d3], [S.outro, outro]]
  });
})();
