// Vídeo institucional · Conheça a 2Doctor · 38 s · motor tech com a marca 2Doctor (--studio=2doctor).
// Mesmo estilo do "Conheça a WMed" (topics/wmed-apresentacao.js). Ênfase no "2", IA ilimitada e novidades
// semanais desenvolvidas com IA. Módulos e descrições tirados de scripts/wmed-app/src/Modules.jsx (2Doctor).
// Doses da conversa conferidas na ESC 2023 e na ACC/AHA 2025 (ver 2doctor/NOTAS.md, "SCA · estudantes").
(() => {
  const S = { intro: 0, dois: 4.5, ai: 14, semana: 23, outro: 32 };

  // ---------------- 00 · abertura ----------------
  function intro(t, lt) {
    const k = expoOut(seg(lt, .1, 1.1)), s = 230 * lerp(.7, 1, k);
    for (let i = 0; i < 3; i++) {
      const p = ((lt * .45 + i / 3) % 1), r = 140 + p * 540;
      X.beginPath(); X.arc(W / 2, 420, r, 0, TAU); X.strokeStyle = rgba(C.blue, .16 * (1 - p) * k); X.lineWidth = 2; X.stroke();
    }
    logo(W / 2 - s / 2, 420 - s / 2, s, { alpha: k });
    text('*2*Doctor', W / 2, 640, { size: 116, weight: 700, align: 'center', reveal: seg(lt, .6, 1.5), accent: C.blue });
    text('Medicina conectada ao *conhecimento*.', W / 2, 740, { size: 36, color: C.muted, align: 'center', alpha: expoOut(seg(lt, 1.3, 2.1)), accent: C.blue });
    const labs = ['IA ilimitada', 'Novidades toda semana', 'Plantão e estudo'];
    X.font = `400 24px ${F.sans}`; const tot = labs.reduce((a, l) => a + X.measureText(l).width + 24 * 1.8 + 22 + 16, -16);
    let px = W / 2 - tot / 2;
    labs.forEach((l, i) => {
      const e = expoOut(seg(lt, 2 + i * .15, 2.6 + i * .15));
      px += pill(px, 840 + (1 - e) * 16, l, { size: 24, weight: 400, alpha: e, dot: [C.blue, C.cyan, C.violet][i], color: C.ink2 }) + 16;
    });
  }

  // ---------------- 01 · o 2 da 2Doctor ----------------
  const DOIS = [
    ['*2* cabeças', 'Você e a IA, raciocinando juntas'],
    ['*2ª* opinião', 'Em segundos, a qualquer hora'],
    ['*2* frentes', 'Do plantão aos estudos'],
    ['*2* mundos', 'Diretrizes do Brasil e do mundo'],
  ];
  function dois(t, lt, dur) {
    eyebrow(120, 250, 'O 2 da 2Doctor', { alpha: expoOut(seg(lt, .1, .6)) });
    const step = 2.1, cur = clamp(Math.floor((lt - .4) / step), 0, DOIS.length - 1);
    DOIS.forEach(([big, sub], i) => {
      const a = .4 + i * step, kin = expoOut(seg(lt, a, a + .55)), kout = i < DOIS.length - 1 ? ease(seg(lt, a + step - .25, a + step + .1)) : 0;
      if (kin <= .005 || kout >= .995) return;
      const al = kin * (1 - kout), dy = (1 - kin) * 50 - kout * 50;
      text(big, 114, 450 + dy, { size: big.length > 16 ? 104 : 136, weight: 700, alpha: al, accent: C.blue });
      text(sub, 120, 590 + dy, { size: 40, color: C.muted, alpha: al * expoOut(seg(lt, a + .2, a + .7)) });
    });
    DOIS.forEach((_, i) => {
      const on = i === cur, e = expoOut(seg(lt, .3 + i * .05, .8 + i * .05));
      rr(120 + i * 58, 700, on ? 44 : 30, 6, 3); X.globalAlpha = e; X.fillStyle = on ? C.ink : rgba(C.ink, .15); X.fill(); X.globalAlpha = 1;
    });
    text('Tudo começa pelo *2*.', 120, 790, { size: 30, color: C.ink2, alpha: expoOut(seg(lt, 8.2, 8.9)), accent: C.blue });

    // o "2" gigante à direita: contorno que se desenha, preenchimento que sobe e dois pontos em órbita (você e a IA)
    const cx = 1400, cy = 560, size = 720;
    const kd = expoOut(seg(lt, .3, 1.6)), fill = ease(seg(lt, 1.2, 3.2));
    X.save();
    X.font = `800 ${size}px ${F.sans}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.globalAlpha = kd; X.lineWidth = 4; X.strokeStyle = rgba(C.blue, .55);
    X.setLineDash([2400]); X.lineDashOffset = 2400 * (1 - kd); X.strokeText('2', cx, cy + (1 - kd) * 30); X.setLineDash([]);
    if (fill > 0) {
      const g = X.createLinearGradient(0, cy + size / 2, 0, cy - size / 2);
      g.addColorStop(0, C.blue); g.addColorStop(clamp(fill), C.cyan); g.addColorStop(clamp(fill + .001), rgba(C.cyan, 0));
      X.fillStyle = g; X.fillText('2', cx, cy);
    }
    X.restore();
    const orb = expoOut(seg(lt, 2.4, 3.2));
    [[C.ink, 0], [C.cyan, .5]].forEach(([col, ph], i) => {
      const ang = (lt * .35 + ph) * TAU, ox = cx + Math.cos(ang) * 400, oy = cy + 20 + Math.sin(ang) * 330;
      X.save(); X.globalAlpha = orb;
      X.beginPath(); X.arc(ox, oy, 16, 0, TAU); X.fillStyle = col; X.shadowColor = rgba(col, .5); X.shadowBlur = 24; X.fill();
      X.restore();
      text(['Você', 'IA'][i], ox, oy - 40, { size: 22, weight: 600, align: 'center', color: C.ink2, alpha: orb });
    });
  }

  // ---------------- 02 · IA ilimitada ----------------
  const Q = 'Qual a dose de ataque do AAS na suspeita de SCA?';
  const A = 'Sem contraindicação: AAS 150–300 mg VO (ou 75–250 mg IV) e manutenção de 75–100 mg/dia [1]. A diretriz americana usa 162–325 mg mastigado [2].';
  function ai(t, lt) {
    header(lt, 'Inteligência artificial', 'IA *ilimitada*', 'Pergunte quanto quiser. Respostas com fontes que você confere.', { subW: 640 });
    [['∞', 'Perguntas sem limite'], ['[1]', 'Fontes oficiais que você confere'], ['3', 'Automático · Consulta rápida · Estudar']].forEach(([ic, lab], i) => {
      const e = expoOut(seg(lt, 1.2 + i * .25, 1.9 + i * .25)), y = 520 + i * 110;
      X.save(); X.globalAlpha = e; X.translate((1 - e) * -30, 0);
      rr(120, y - 36, 72, 72, 18); X.fillStyle = rgba(C.blue, .08); X.fill();
      text(ic, 156, y + 2, { size: ic === '∞' ? 46 : 26, weight: 700, align: 'center', color: C.blue, mono: ic === '[1]' });
      text(lab, 220, y, { size: 30, weight: 600, maxW: 460 });
      X.restore();
    });
    const k = expoOut(seg(lt, .4, 1.2)), x = 820, y = 250, w = 980, h = 720;
    panel(x, y + (1 - k) * 40, w, h, { alpha: k, r: 24 });
    if (k < .01) return;
    X.save(); X.globalAlpha = k; X.translate(0, (1 - k) * 40);
    eyebrow(x + 40, y + 46, 'Chat', { size: 15, dotCol: C.blue });
    text('Sem limite de perguntas', x + w - 40, y + 46, { size: 18, mono: true, color: C.muted, align: 'right' });
    X.strokeStyle = C.line; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 40, y + 82); X.lineTo(x + w - 40, y + 82); X.stroke();
    const qn = Math.floor(clamp(seg(lt, 1.2, 2.6)) * Q.length);
    if (qn > 0) {
      X.font = `400 26px ${F.sans}`; const qw = Math.min(X.measureText(Q).width + 50, w - 200);
      rr(x + w - 40 - qw, y + 110, qw, 64, 16); X.fillStyle = '#EDF4F2'; X.fill();
      text(Q.slice(0, qn), x + w - 40 - qw + 25, y + 143, { size: 26 });
    }
    const an = Math.floor(clamp(seg(lt, 3, 6)) * A.length);
    if (lt > 2.7) {
      logo(x + 36, y + 196, 44);
      text('*2*Doctor', x + 90, y + 219, { size: 24, weight: 700, accent: C.blue });
      text('pesquisa · síntese', x + 200, y + 220, { size: 18, mono: true, color: C.muted });
      const dots = lt < 3 ? '•••'.slice(0, 1 + Math.floor(lt * 6) % 3) : '';
      text(A.slice(0, an).replace(/\[(\d)\]/g, '*[$1]*') + (an < A.length && an > 0 ? ' ▍' : dots), x + 40, y + 290, { size: 28, lh: 1.45, maxW: w - 80, accent: C.blue, color: C.ink2 });
    }
    [['1', 'ESC 2023 · síndromes coronarianas agudas', 'Eur Heart J'], ['2', 'ACC/AHA 2025 · síndromes coronarianas agudas', 'Circulation']].forEach(([n, ti, src], i) => {
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

  // ---------------- 03 · novidades toda semana ----------------
  const NOVOS = [
    ['Scribe', 'Do relato à nota organizada', 'echo'],
    ['Radar de inovação', 'Tecnologias em avaliação', 'shield'],
    ['Interpretar um estudo', 'Risco absoluto, relativo e NNT', 'check'],
    ['ECG em 10 passos', 'Curso, traçados e exercícios', 'pulse'],
    ['Dividir plantão', 'Horários distribuídos por pessoa', 'steth'],
    ['Laboratório de ideias', 'Radiografia em 3D · protótipo', 'flask'],
  ];
  function semana(t, lt) {
    header(lt, 'Laboratório 2Doctor', 'Novidades *toda semana*', 'Ferramentas novas para a medicina, desenvolvidas com IA.', { subW: 760 });
    // linha do tempo semanal
    const x0 = 120, x1 = W - 120, yl = 470, n = NOVOS.length, step = 1.05;
    const kline = expoOut(seg(lt, .6, 1.6));
    X.save(); X.globalAlpha = kline; X.lineWidth = 3; X.strokeStyle = rgba(C.ink, .1);
    X.beginPath(); X.moveTo(x0, yl); X.lineTo(x1, yl); X.stroke();
    const prog = clamp((lt - 1.2) / (n * step)); X.strokeStyle = C.blue;
    X.beginPath(); X.moveTo(x0, yl); X.lineTo(lerp(x0, x1, prog), yl); X.stroke(); X.restore();
    const cw = (x1 - x0 - (n - 1) * 24) / n;
    NOVOS.forEach(([nome, desc, ic], i) => {
      const a = 1.2 + i * step, e = backOut(seg(lt, a, a + .5)), ea = expoOut(seg(lt, a, a + .4));
      const cx = x0 + i * (cw + 24), dotx = cx + cw / 2;
      X.save(); X.globalAlpha = kline;
      X.beginPath(); X.arc(dotx, yl, 10, 0, TAU); X.fillStyle = lt > a ? C.blue : C.page; X.fill(); X.lineWidth = 3; X.strokeStyle = lt > a ? C.blue : rgba(C.ink, .2); X.stroke();
      X.restore();
      text(`SEM ${String(i + 1).padStart(2, '0')}`, dotx, yl - 40, { size: 16, mono: true, align: 'center', color: lt > a ? C.blue : C.faint, alpha: kline });
      if (ea <= .005) return;
      const yy = 540 + (1 - e) * 60;
      panel(cx, yy, cw, 330, { alpha: ea, r: 22 });
      X.save(); X.globalAlpha = ea;
      badge(ic, cx + 58, yy + 70, 34, C.blue, 1, ea);
      pill(cx + cw - 24, yy + 42, 'NOVO', { size: 15, mono: true, align: 'right', fill: C.blue, stroke: false, color: '#FFFFFF', alpha: ea * (.75 + .25 * Math.abs(wob(t, .8, i * .2))) });
      text(nome, cx + 28, yy + 160, { size: 28, weight: 700, maxW: cw - 50, lh: 1.15 });
      text(desc, cx + 28, yy + 250, { size: 20, color: C.muted, maxW: cw - 50, lh: 1.3 });
      X.restore();
    });
    text('Um laboratório de IA para a medicina, *toda semana*.', W / 2, 950, { size: 30, color: C.ink2, align: 'center', accent: C.blue, alpha: expoOut(seg(lt, 7.6, 8.3)) });
  }

  // ---------------- 04 · encerramento ----------------
  function outro(t, lt) {
    const k = expoOut(seg(lt, .1, 1)), s = 190 * lerp(.8, 1, k);
    logo(W / 2 - s / 2, 300 + (1 - k) * 30, s, { alpha: k });
    text('*2*Doctor', W / 2, 555, { size: 108, weight: 700, align: 'center', reveal: seg(lt, .3, 1.1), accent: C.blue });
    text('IA *ilimitada*. Novidades *toda semana*.', W / 2, 650, { size: 38, color: C.muted, align: 'center', alpha: expoOut(seg(lt, .7, 1.4)), accent: C.blue });
    pill(W / 2, 770, '2doctor.ai', { size: 28, align: 'center', fill: C.ink, stroke: false, color: '#FFFFFF', dot: C.cyan, alpha: expoOut(seg(lt, 1, 1.7)) });
  }

  video({
    slug: '2doctor-apresentacao', title: 'Conheça a 2Doctor', dur: 38, chrome: [3.9, 32.2], code: '2DOCTOR', kicker: 'Conheça a 2Doctor',
    sections: [[S.intro, '2Doctor'], [S.dois, 'O 2'], [S.ai, 'IA'], [S.semana, 'Toda semana'], [S.outro, 'Comece']],
    scenes: [[S.intro, intro], [S.dois, dois], [S.ai, ai], [S.semana, semana], [S.outro, outro]]
  });
})();
