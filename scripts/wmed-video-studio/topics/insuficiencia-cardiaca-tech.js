// Resumo ENAMED · Insuficiência cardíaca · versão "tech" (motor Canvas 2D, visual do app WMed) · 90 s · 30 fps.
// Mesmo conteúdo e mesma marcação de tempo da versão em aquarela; renderize com --studio=tech.
(() => {
  const S = { intro: 0, feve: 6, dx: 21, tx: 35, nyha: 57, trap: 67, recap: 82 };

  // ECG de monitor: varredura com apagamento à frente do cursor
  function ecgY(u) { // u em batimentos; forma de um ciclo PQRST
    const f = u - Math.floor(u);
    const g = (c, w, h) => h * Math.exp(-Math.pow((f - c) / w, 2));
    return -g(.18, .035, 10) + g(.3, .012, 14) - g(.335, .012, 95) + g(.37, .012, 30) - g(.6, .06, 22);
  }
  function monitor(t, x, y, w, h, bpm, col) {
    const speed = w / 3.2, head = (t * speed) % w, beats = bpm / 60 / speed; // batimentos por pixel
    X.save(); X.beginPath(); X.rect(x, y - h, w, 2 * h); X.clip();
    for (const [a, b] of [[0, head], [head + 70, w]]) {
      if (b - a < 2) continue;
      X.beginPath();
      for (let px = a; px <= b; px += 2) { const tt = px <= head ? t - (head - px) / speed : t - (head + w - px) / speed; const v = y + ecgY(tt * bpm / 60); px === a ? X.moveTo(x + px, v) : X.lineTo(x + px, v); }
      X.lineWidth = 3.5; X.strokeStyle = col; X.lineJoin = 'round'; X.shadowColor = col; X.shadowBlur = 16; X.stroke();
    }
    const hy = y + ecgY(t * bpm / 60);
    X.beginPath(); X.arc(x + head, hy, 6, 0, TAU); X.fillStyle = col; X.shadowColor = col; X.shadowBlur = 24; X.fill();
    X.restore();
  }

  // ---------------- 00 · abertura ----------------
  function intro(t, lt) {
    eyebrow(120, 330, 'Resumo ENAMED · Cardiologia', { alpha: expoOut(seg(lt, .3, .9)) });
    text('Insuficiência\n*cardíaca*', 114, 440, { size: 132, weight: 600, lh: 1.02, reveal: seg(lt, .45, 1.6), accent: C.blue });
    text('O essencial que cai na prova, em 90 segundos.', 120, 700, { size: 34, color: C.muted, alpha: expoOut(seg(lt, 1.2, 1.9)) });
    let px = 120;
    ['Classificação', 'Diagnóstico', 'Tratamento', 'NYHA', 'Pegadinhas'].forEach((l, i) => {
      const k = expoOut(seg(lt, 1.7 + i * .12, 2.3 + i * .12));
      px += pill(px, 800 + (1 - k) * 16, l, { size: 22, weight: 400, alpha: k, color: C.ink2 }) + 12;
    });
    // monitor
    const k = expoOut(seg(lt, .6, 1.5)), mx = 1080, my = 250, mw = 720, mh = 560;
    panel(mx, my + (1 - k) * 40, mw, mh, { alpha: k, r: 28 });
    if (k > .01) {
      X.save(); X.globalAlpha = k; X.translate(0, (1 - k) * 40);
      eyebrow(mx + 40, my + 50, 'Sinal · DII', { size: 16, dotCol: C.green });
      eyebrow(mx + mw - 40, my + 50, 'Ao vivo', { size: 16, align: 'right', dot: false });
      // grade do monitor
      X.strokeStyle = rgba(C.ink, .06); X.lineWidth = 1;
      for (let gx = mx + 40; gx <= mx + mw - 40; gx += 40) { X.beginPath(); X.moveTo(gx, my + 90); X.lineTo(gx, my + 360); X.stroke(); }
      for (let gy = my + 90; gy <= my + 360; gy += 45) { X.beginPath(); X.moveTo(mx + 40, gy); X.lineTo(mx + mw - 40, gy); X.stroke(); }
      monitor(t, mx + 40, my + 250, mw - 80, 140, 88, C.blue);
      // métricas
      X.strokeStyle = C.line; X.beginPath(); X.moveTo(mx + 40, my + 400); X.lineTo(mx + mw - 40, my + 400); X.stroke();
      const beatK = Math.exp(-((t * 88 / 60) % 1) * 6);
      icon('heart', mx + 70, my + 470, 40 * (1 + beatK * .12), C.red);
      text('FC', mx + 110, my + 450, { size: 18, mono: true, color: C.muted });
      text('88 bpm', mx + 110, my + 488, { size: 38, weight: 600 });
      text('FEVE', mx + 380, my + 450, { size: 18, mono: true, color: C.muted });
      text(lt > 3.5 ? '?' : '—', mx + 380, my + 488, { size: 38, weight: 600, color: lt > 3.5 ? C.blue : C.faint });
      text('classifique →', mx + 430, my + 490, { size: 22, color: C.muted, alpha: seg(lt, 3.6, 4.2) });
      X.restore();
    }
  }

  // ---------------- 01 · FEVE ----------------
  const ZONES = [
    { sig: 'ICFEr', name: 'FE reduzida', range: '≤ 40%', col: C.red, at: 1.8, lo: 0, hi: 40 },
    { sig: 'ICFElr', name: 'FE levemente reduzida', range: '41–49%', col: C.amber, at: 5.2, lo: 40, hi: 50 },
    { sig: 'ICFEp', name: 'FE preservada', range: '≥ 50%', col: C.green, at: 8.6, lo: 50, hi: 80 }
  ];
  function feve(t, lt) {
    header(lt, '01 · Classificação', 'Classificação por *FEVE*', 'Fração de ejeção do ventrículo esquerdo.');
    const v = kf(lt, [[0, 0], [1, 0], [2.4, 30], [4.8, 30], [5.9, 45], [8.2, 45], [9.3, 62], [15, 62]], ease);
    const zi = v <= 40 ? 0 : v < 50 ? 1 : 2, z = ZONES[zi], cx = 520, cy = 690, R = 205, a0 = Math.PI * .75, span = Math.PI * 1.5, ang = p => a0 + span * clamp(p / 80);
    const k = expoOut(seg(lt, .4, 1.2));
    X.save(); X.globalAlpha = k;
    // trilho segmentado pelas três faixas
    ZONES.forEach(q => { X.beginPath(); X.arc(cx, cy, R, ang(q.lo) + .015, ang(q.hi) - .015); X.lineWidth = 30; X.lineCap = 'butt'; X.strokeStyle = rgba(q.col, .14); X.stroke(); });
    if (v > .3) { X.beginPath(); X.arc(cx, cy, R, a0, ang(v)); X.lineWidth = 30; X.lineCap = 'round'; X.strokeStyle = z.col; X.shadowColor = rgba(z.col, .5); X.shadowBlur = 24; X.stroke(); X.shadowBlur = 0; }
    // marcas 40 e 50
    for (const m of [0, 40, 50, 80]) { const a = ang(m), r1 = R + 26, r2 = R + 44; X.beginPath(); X.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); X.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); X.lineWidth = 2; X.strokeStyle = C.faint; X.stroke(); text(m + '%', cx + Math.cos(a) * (R + 76), cy + Math.sin(a) * (R + 72), { size: 20, mono: true, color: C.muted, align: 'center' }); }
    text(Math.round(v) + '%', cx, cy - 20, { size: 120, weight: 600, align: 'center' });
    text(v > .5 ? z.sig : 'FEVE', cx, cy + 70, { size: 34, weight: 600, align: 'center', color: v > .5 ? z.col : C.muted });
    X.restore();
    // linhas de classificação
    ZONES.forEach((q, i) => {
      const e = expoOut(seg(lt, q.at, q.at + .7)), active = zi === i && lt > q.at - .2 && lt < 11.5, done = lt >= q.at;
      const x = 980, y = 400 + i * 190, w = 820, h = 160;
      if (e <= .005) { panel(x, y, w, h, { alpha: expoOut(seg(lt, .8 + i * .1, 1.4 + i * .1)) * .5, fill: 'rgba(255,255,255,.5)', blur: 0, dy: 0 }); return; }
      panel(x + (1 - e) * 60, y, w, h, { alpha: e, stroke: active ? rgba(q.col, .6) : C.line, lw: active ? 2.5 : 1.5, shadowCol: active ? rgba(q.col, .18) : undefined, blur: active ? 50 : 40 });
      X.save(); X.globalAlpha = e * (done && !active && lt < 11.5 ? .55 : 1); X.translate((1 - e) * 60, 0);
      rr(x + 28, y + 36, 8, h - 72, 4); X.fillStyle = q.col; X.fill();
      text(q.sig, x + 64, y + 60, { size: 48, weight: 600, color: q.col });
      text(q.name, x + 64, y + 112, { size: 26, color: C.muted });
      text(q.range, x + w - 40, y + h / 2, { size: 52, weight: 600, align: 'right' });
      X.restore();
    });
  }

  // ---------------- 02 · diagnóstico ----------------
  function dx(t, lt) {
    header(lt, '02 · Diagnóstico', 'Clínica + eco + *BNP*', 'Os três pilares do diagnóstico de insuficiência cardíaca.');
    const items = [
      { at: 1.0, ic: 'steth', t: 'Clínica', s: 'Sinais e sintomas de congestão e baixo débito' },
      { at: 2.4, ic: 'echo', t: 'Ecocardiograma', s: 'Mede a FEVE e avalia estrutura e função' },
      { at: 3.8, ic: 'tube', t: 'BNP / NT-proBNP', s: 'Peptídeos natriuréticos elevados' }
    ];
    const cw = 520, gap = 40, x0 = (W - 3 * cw - 2 * gap) / 2, y = 400, h = 300;
    items.forEach((it, i) => {
      const e = expoOut(seg(lt, it.at, it.at + .8)), x = x0 + i * (cw + gap);
      panel(x, y + (1 - e) * 50, cw, h, { alpha: e });
      if (e < .01) return;
      X.save(); X.globalAlpha = e; X.translate(0, (1 - e) * 50);
      badge(it.ic, x + 80, y + 85, 44, C.blue, 1, seg(lt, it.at + .2, it.at + 1.2));
      text('0' + (i + 1), x + cw - 40, y + 70, { size: 22, mono: true, color: C.faint, align: 'right' });
      text(it.t, x + 40, y + 180, { size: 40, weight: 600 });
      text(it.s, x + 40, y + 235, { size: 24, color: C.muted, maxW: cw - 80, lh: 1.35 });
      X.restore();
      // conector até o nó
      const p = seg(lt, 4.6 + i * .15, 5.6 + i * .15);
      if (p > 0) {
        const sx = x + cw / 2, sy = y + h + 4, nx = W / 2, ny = 790;
        const pts = []; for (let k = 0; k <= 24; k++) { const u = k / 24; pts.push([lerp(sx, nx, ease(u)), lerp(sy, ny - 30, u)]); }
        const end = strokePath(pts, p, { col: rgba(C.blue, .55), lw: 2.5 });
        if (p < 1 && end) { X.beginPath(); X.arc(end[0], end[1], 6, 0, TAU); X.fillStyle = C.blue; X.fill(); }
      }
    });
    const kn = expoOut(seg(lt, 5.8, 6.5));
    if (kn > 0) {
      const w = pill(W / 2, 790, 'Diagnóstico de IC', { size: 26, align: 'center', fill: C.ink, stroke: false, color: '#FFFFFF', alpha: kn, dot: C.cyan });
    }
    // principal causa
    const kc = expoOut(seg(lt, 7.6, 8.4));
    if (kc > 0) {
      const x = 560, y = 870, w = 800, h = 120;
      panel(x, y + (1 - kc) * 40, w, h, { alpha: kc, r: 20 });
      X.save(); X.globalAlpha = kc; X.translate(0, (1 - kc) * 40);
      badge('vessel', x + 64, y + h / 2, 38, C.amber, 1, seg(lt, 7.8, 8.8));
      text('PRINCIPAL CAUSA', x + 124, y + 38, { size: 17, mono: true, color: C.muted, ls: 3 });
      text('*Isquêmica* · doença arterial coronariana', x + 124, y + 80, { size: 34, weight: 600, accent: C.amber });
      X.restore();
    }
  }

  // ---------------- 03 · tratamento ----------------
  const PILLARS = [
    { n: 'IECA / BRA\nou ARNI', tag: 'SRAA', ic: 'shield', col: C.blue },
    { n: 'Beta-\nbloqueador', tag: 'β-bloqueio', ic: 'beat', col: C.violet },
    { n: 'Espirono-\nlactona', tag: 'Antag. mineralo.', ic: 'flask', col: C.cyan },
    { n: 'iSGLT2', tag: 'Glifozinas', ic: 'pill', col: C.green }
  ];
  function tx(t, lt) {
    header(lt, '03 · Tratamento · FE reduzida', 'Os 4 pilares que *reduzem mortalidade*', null);
    const cw = 250, gap = 22, x0 = 120, y = 330, h = 560;
    PILLARS.forEach((p, i) => {
      const at = 1.2 + i * 1.6, e = expoOut(seg(lt, at, at + .8)), x = x0 + i * (cw + gap);
      const hh = h * e;
      if (e <= .005) { rr(x, y, cw, h, 22); X.setLineDash([8, 8]); X.strokeStyle = rgba(C.ink, .12 * expoOut(seg(lt, .5, 1))); X.lineWidth = 2; X.stroke(); X.setLineDash([]); return; }
      panel(x, y + h - hh, cw, hh, { r: 22 });
      X.save(); X.beginPath(); X.rect(x, y + h - hh, cw, hh); X.clip();
      rr(x, y + h - hh, cw, 8, 4); X.fillStyle = p.col; X.fill();
      const ty = y + h - hh;
      text('0' + (i + 1), x + 28, ty + 56, { size: 22, mono: true, color: C.faint });
      badge(p.ic, x + cw / 2, ty + 180, 52, p.col, 1, seg(lt, at + .3, at + 1.3));
      text(p.n, x + cw / 2, ty + 318, { size: 34, weight: 600, align: 'center', lh: 1.1 });
      pill(x + cw / 2, ty + h - 60, p.tag, { size: 18, weight: 400, align: 'center', color: C.muted, mono: true });
      X.restore();
    });
    // painel direito: risco (esquemático) → depois diurético
    const rx = 1250, ry = 330, rw = 550, rh = 560, swap = seg(lt, 11.8, 12.6);
    const kr = expoOut(seg(lt, .8, 1.6)) * (1 - ease(swap));
    if (kr > .005) {
      panel(rx, ry, rw, rh, { alpha: kr });
      X.save(); X.globalAlpha = kr;
      eyebrow(rx + 40, ry + 50, 'Mortalidade · esquemático', { size: 16, dotCol: C.red });
      const gx = rx + 60, gy = ry + 120, gw = rw - 120, gh = 300, steps = PILLARS.map((_, i) => seg(lt, 1.6 + i * 1.6, 2.4 + i * 1.6));
      X.strokeStyle = rgba(C.ink, .08); X.lineWidth = 1;
      for (let k = 0; k <= 4; k++) { X.beginPath(); X.moveTo(gx, gy + gh * k / 4); X.lineTo(gx + gw, gy + gh * k / 4); X.stroke(); }
      // degraus descendo a cada pilar
      const lvl = [0, .22, .4, .53, .63], cur = i => lvl[i] + (lvl[i + 1] - lvl[i]) * ease(steps[i] || 0);
      const pts = []; let L = 0;
      for (let i = 0; i <= 4; i++) {
        const xa = gx + gw * i / 5, xb = gx + gw * (i + 1) / 5;
        const val = i === 0 ? 0 : cur(i - 1);
        pts.push([xa, gy + gh * .1 + gh * .8 * val], [xb, gy + gh * .1 + gh * .8 * val]);
      }
      X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]));
      X.lineWidth = 5; X.strokeStyle = C.ink; X.lineJoin = 'round'; X.stroke();
      const g = X.createLinearGradient(0, gy, 0, gy + gh); g.addColorStop(0, rgba(C.blue, .16)); g.addColorStop(1, rgba(C.blue, 0));
      X.lineTo(gx + gw, gy + gh); X.lineTo(gx, gy + gh); X.closePath(); X.fillStyle = g; X.fill();
      for (let i = 1; i <= 4; i++) { const e2 = steps[i - 1]; if (e2 > 0) { const p = pts[i * 2]; X.beginPath(); X.arc(p[0], p[1], 9 * backOut(e2), 0, TAU); X.fillStyle = PILLARS[i - 1].col; X.fill(); text(String(i), p[0] + 22, p[1] - 30, { size: 20, mono: true, color: C.muted, align: 'center', alpha: e2 }); } }
      icon('down', rx + 70, ry + 480, 44, C.red, seg(lt, 8.4, 9.2));
      text('Cada pilar soma benefício.', rx + 110, ry + 470, { size: 28, weight: 600, alpha: expoOut(seg(lt, 8.4, 9.2)) });
      text('Curva ilustrativa, não são dados de estudo.', rx + 110, ry + 508, { size: 20, color: C.muted, alpha: expoOut(seg(lt, 8.6, 9.4)) });
      X.restore();
    }
    const kd = expoOut(seg(lt, 12.4, 13.2));
    if (kd > .005) {
      panel(rx, ry + (1 - kd) * 40, rw, rh, { alpha: kd });
      X.save(); X.globalAlpha = kd; X.translate(0, (1 - kd) * 40);
      eyebrow(rx + 40, ry + 50, 'Fora dos pilares', { size: 16, dotCol: C.amber });
      badge('drop', rx + 90, ry + 150, 50, C.blue, 1, seg(lt, 12.6, 13.6));
      text('Diurético de alça', rx + 40, ry + 250, { size: 44, weight: 600 });
      text('ex.: furosemida', rx + 40, ry + 300, { size: 26, color: C.muted });
      const rows = [['Congestão', 'Alivia sintomas', C.green, 'check'], ['Mortalidade', 'Não reduz', C.red, 'x']];
      rows.forEach(([a, b, c, ic], i) => {
        const e3 = expoOut(seg(lt, 14 + i * .8, 14.8 + i * .8)), yy = ry + 380 + i * 80;
        X.save(); X.globalAlpha = kd * e3;
        X.strokeStyle = C.line; X.lineWidth = 1.5; X.beginPath(); X.moveTo(rx + 40, yy - 38); X.lineTo(rx + rw - 40, yy - 38); X.stroke();
        text(a, rx + 40, yy, { size: 28, color: C.ink2 });
        badge(ic, rx + rw - 64, yy, 22, c, 1, e3);
        text(b, rx + rw - 100, yy, { size: 28, weight: 600, color: c, align: 'right' });
        X.restore();
      });
      X.restore();
    }
  }

  // ---------------- 04 · NYHA ----------------
  const NY = [
    { n: 'I', d: 'Sem limitação', s: 'Atividade habitual não causa sintomas', v: 1, col: C.green },
    { n: 'II', d: 'Esforços habituais', s: 'Limitação leve; confortável em repouso', v: .68, col: C.amber },
    { n: 'III', d: 'Esforços menores que os habituais', s: 'Limitação acentuada; confortável em repouso', v: .36, col: C.orange },
    { n: 'IV', d: 'Em repouso', s: 'Sintomas mesmo sem esforço', v: .06, col: C.red }
  ];
  function nyha(t, lt) {
    header(lt, '04 · Classe funcional', 'NYHA *I – IV*', 'Quanto esforço desencadeia os sintomas.');
    const x = 120, w = W - 240, h = 128;
    text('TOLERÂNCIA AO ESFORÇO', x + w - 40, 336, { size: 16, mono: true, color: C.muted, align: 'right', ls: 3, alpha: expoOut(seg(lt, .8, 1.4)) });
    NY.forEach((r, i) => {
      const at = .9 + i * 1.9, e = expoOut(seg(lt, at, at + .8)), y = 370 + i * (h + 20);
      panel(x + (1 - e) * 60, y, w, h, { alpha: e, r: 20 });
      if (e < .01) return;
      X.save(); X.globalAlpha = e; X.translate((1 - e) * 60, 0);
      X.beginPath(); X.arc(x + 70, y + h / 2, 38, 0, TAU); X.fillStyle = rgba(r.col, .12); X.fill();
      text(r.n, x + 70, y + h / 2 + 2, { size: 34, weight: 600, align: 'center', color: r.col });
      text(r.d, x + 136, y + 48, { size: 34, weight: 600 });
      text(r.s, x + 136, y + 90, { size: 22, color: C.muted });
      const bx = x + 1000, bw = w - 1040, by = y + h / 2 - 8, fill = r.v * expoOut(seg(lt, at + .3, at + 1.4));
      rr(bx, by, bw, 16, 8); X.fillStyle = rgba(C.ink, .07); X.fill();
      rr(bx, by, Math.max(16, bw * fill), 16, 8); X.fillStyle = r.col; X.fill();
      X.restore();
    });
  }

  // ---------------- 05 · pegadinhas ----------------
  const TRAPS = [
    { at: .8, big: 'Diurético *não* reduz mortalidade.', det: 'Trata a congestão e alivia sintomas. Não é um dos 4 pilares.', ic: 'drop' },
    { at: 5.6, big: 'ARNI + IECA: *nunca juntos*.', det: 'Risco de angioedema. Ao trocar IECA por ARNI, faça washout de 36 horas.', ic: 'x' },
    { at: 10.4, big: 'Betabloqueador: inicie com o paciente *compensado*.', det: 'Euvolêmico e estável. A descompensação aguda não é hora de começar.', ic: 'beat' }
  ];
  function trap(t, lt) {
    header(lt, '05 · Pegadinhas', 'Onde a prova *derruba*', null, { accent: C.red });
    const cur = lt < TRAPS[1].at ? 0 : lt < TRAPS[2].at ? 1 : 2;
    // indicador lateral
    TRAPS.forEach((p, i) => {
      const e = expoOut(seg(lt, .6 + i * .1, 1.2 + i * .1)), y = 420 + i * 150, on = i === cur, done = i < cur;
      X.save(); X.globalAlpha = e;
      X.beginPath(); X.arc(160, y, 30, 0, TAU); X.fillStyle = on ? C.red : done ? rgba(C.ink, .8) : C.page; X.fill();
      X.lineWidth = 1.5; X.strokeStyle = on ? C.red : C.line; X.stroke();
      text('0' + (i + 1), 160, y + 1, { size: 20, mono: true, align: 'center', color: on || done ? '#FFFFFF' : C.muted });
      if (i < 2) { X.beginPath(); X.moveTo(160, y + 38); X.lineTo(160, y + 112); X.strokeStyle = C.line; X.lineWidth = 2; X.stroke(); }
      X.restore();
    });
    TRAPS.forEach((p, i) => {
      const end = i < 2 ? TRAPS[i + 1].at : 15.2, kin = expoOut(seg(lt, p.at, p.at + .7)), kout = ease(seg(lt, end - .45, end));
      if (kin <= .005 || kout >= .995) return;
      const a = kin * (1 - kout), dx = (1 - kin) * 80 - kout * 80, x = 300, y = 330, w = 1500, h = 600;
      panel(x + dx, y, w, h, { alpha: a, r: 28 });
      X.save(); X.globalAlpha = a; X.translate(dx, 0);
      rr(x, y, 10, h, 5); X.fillStyle = C.red; X.fill();
      badge('alert', x + 110, y + 110, 50, C.red, 1, seg(lt, p.at + .2, p.at + 1));
      eyebrow(x + 190, y + 110, `Alerta ${i + 1} de 3`, { size: 18, dotCol: C.red });
      text(p.big, x + 80, y + 250, { size: 68, weight: 600, maxW: w - 200, lh: 1.1, reveal: seg(lt, p.at + .2, p.at + 1.2), accent: C.red });
      text(p.det, x + 80, y + 470, { size: 32, color: C.muted, maxW: w - 220, lh: 1.4, alpha: expoOut(seg(lt, p.at + .9, p.at + 1.6)) });
      badge(p.ic, x + w - 110, y + 110, 40, C.ink2, .6, 1);
      X.restore();
    });
  }

  // ---------------- 06 · revisão + encerramento ----------------
  const RECAP = [
    ['FEVE', '≤40 reduzida · 41–49 levemente reduzida · ≥50 preservada'],
    ['Diagnóstico', 'clínica + eco + BNP/NT-proBNP · causa principal isquêmica'],
    ['ICFEr', 'IECA/BRA ou ARNI + betabloqueador + espironolactona + iSGLT2'],
    ['NYHA', 'I–IV = limitação funcional pelos sintomas'],
    ['Atenção', 'diurético alivia sintoma, não reduz mortalidade']
  ];
  function recap(t, lt) {
    const out = ease(seg(lt, 5.2, 5.9));
    if (out < 1) {
      X.save(); X.globalAlpha = 1 - out; X.translate(0, -out * 40);
      header(lt, '06 · Revisão', 'Revisão *relâmpago*', null);
      const x = 120, w = W - 240, y0 = 330;
      panel(x, y0, w, 600, { alpha: expoOut(seg(lt, .3, 1)), r: 28 });
      RECAP.forEach(([k, v], i) => {
        const e = expoOut(seg(lt, .6 + i * .6, 1.3 + i * .6)), y = y0 + 70 + i * 115;
        X.save(); X.globalAlpha = e;
        badge('check', x + 70, y, 26, C.green, 1, seg(lt, .7 + i * .6, 1.4 + i * .6));
        text(k, x + 120, y, { size: 30, weight: 600 });
        text(v, x + 420, y, { size: 30, color: C.ink2 });
        if (i < 4) { X.strokeStyle = C.line; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 40, y + 57); X.lineTo(x + w - 40, y + 57); X.stroke(); }
        X.restore();
      });
      X.restore();
    }
    const ko = expoOut(seg(lt, 5.6, 6.6));
    if (ko > .005) {
      const s = 150 * lerp(.85, 1, ko);
      logo(W / 2 - s / 2, 330 + (1 - ko) * 30, s, { alpha: ko });
      text('WMed', W / 2, 585, { size: 96, weight: 600, align: 'center', alpha: expoOut(seg(lt, 6, 6.8)) });
      text('Bons estudos.', W / 2, 680, { size: 40, color: C.muted, align: 'center', alpha: expoOut(seg(lt, 6.3, 7)) });
      pill(W / 2, 790, 'WMed.ai', { size: 24, align: 'center', dot: C.cyan, alpha: expoOut(seg(lt, 6.6, 7.3)) });
    }
  }

  video({
    slug: 'insuficiencia-cardiaca-tech', title: 'Insuficiência cardíaca', dur: 90, code: 'IC',
    sections: [[S.intro, 'Abertura'], [S.feve, 'FEVE'], [S.dx, 'Diagnóstico'], [S.tx, 'Tratamento'], [S.nyha, 'NYHA'], [S.trap, 'Pegadinhas'], [S.recap, 'Revisão']],
    scenes: [[S.intro, intro], [S.feve, feve], [S.dx, dx], [S.tx, tx], [S.nyha, nyha], [S.trap, trap], [S.recap, recap]]
  });
})();
