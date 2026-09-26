// 2Doctor · apresentação de 60 s em INGLÊS (pedido do Dilson, 26/09/2026): caso clínico e chat de IA em foco, novidades semanais,
// passada rápida pela TC 3D. Motor tech + marca 2Doctor (--studio=2doctor). Abertura com o "2".
// Conteúdo clínico do chat conferido na ESC 2024 (Rec. Table 16; meta de PAS 120–129) e na AHA/ACC 2025
// (< 130/80) — ver 2doctor/hipertensao/roteiro.md.
(() => {
  const S = { intro: 0, dois: 4, caso: 11, chat: 29, semana: 42, tc: 51, outro: 56 };
  const CAP = 'out/app-captures/', seq = m => Array.from({ length: 90 }, (_, i) => `${CAP}${m}/f${String(i).padStart(3, '0')}.jpg`);

  // ---------------- utilidades de cena ----------------
  const typed = (s, p) => s.slice(0, Math.floor(clamp(p) * s.length));
  const blink = t => (Math.floor(t * 2.4) % 2 ? '' : '▍');
  function cam(z, fx, fy, fn) { X.save(); X.translate(fx, fy); X.scale(z, z); X.translate(-fx, -fy); fn(); X.restore(); }
  // rede de pontos da marca, derivando devagar (fundo "tecnológico")
  function net(t, a = 1, o = {}) {
    if (a <= .005) return;
    const n = o.n || 46, pts = [];
    for (let i = 0; i < n; i++) pts.push([hash(i) * W + wob(t, .02 + hash(i + 9) * .03, hash(i + 3)) * 60, hash(i + 50) * H + wob(t, .018 + hash(i + 7) * .03, hash(i + 11)) * 50]);
    X.save(); X.globalAlpha = a;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d > 230) continue;
      X.strokeStyle = rgba(C.blue, .10 * (1 - d / 230)); X.lineWidth = 1; X.beginPath(); X.moveTo(...pts[i]); X.lineTo(...pts[j]); X.stroke();
    }
    pts.forEach(([x, y], i) => { X.beginPath(); X.arc(x, y, 2 + hash(i + 21) * 2, 0, TAU); X.fillStyle = rgba(i % 5 ? C.blue : C.cyan, .28); X.fill(); });
    X.restore();
  }
  // janela de navegador com o app (barra, endereço 2doctor.ai); devolve a área de conteúdo
  function browser(x, y, w, h, a, url = '2doctor.ai') {
    panel(x, y, w, h, { alpha: a, r: 26, blur: 90, dy: 34, shadowCol: 'rgba(8,52,50,.20)' });
    if (a <= .005) return null;
    X.save(); X.globalAlpha *= a;
    X.save(); rr(x, y, w, 62, 26); X.clip(); X.fillStyle = '#F4F8F7'; X.fillRect(x, y, w, 62); X.restore();
    X.strokeStyle = C.line; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x, y + 62); X.lineTo(x + w, y + 62); X.stroke();
    ['#FF6159', '#FFBD2E', '#28C941'].forEach((c, i) => { X.beginPath(); X.arc(x + 32 + i * 24, y + 31, 7, 0, TAU); X.fillStyle = c; X.fill(); });
    const uw = 360; rr(x + w / 2 - uw / 2, y + 15, uw, 32, 16); X.fillStyle = '#FFFFFF'; X.fill(); X.strokeStyle = C.line; X.stroke();
    lock(x + w / 2 - uw / 2 + 22, y + 31, C.cyan);
    text(url, x + w / 2 + 6, y + 32, { size: 17, weight: 600, color: C.ink2, align: 'center' });
    // cabeçalho do app
    logo(x + 28, y + 80, 34);
    text('*2*Doctor', x + 70, y + 98, { size: 22, weight: 800, accent: C.blue, color: C.ink });
    X.restore();
    return { x: x + 28, y: y + 140, w: w - 56, h: h - 160 };
  }
  function lock(x, y, col) {
    X.save(); X.strokeStyle = col; X.fillStyle = col; X.lineWidth = 2;
    rr(x - 6, y - 2, 12, 9, 2); X.fill(); X.beginPath(); X.arc(x, y - 3, 4, Math.PI, 0); X.stroke(); X.restore();
  }
  // cursor de sistema com ondinha de clique
  function cursor(x, y, a = 1, press = 0) {
    if (a <= .005) return;
    X.save(); X.globalAlpha *= a;
    if (press > 0 && press < 1) { X.beginPath(); X.arc(x + 2, y + 2, 10 + press * 34, 0, TAU); X.strokeStyle = rgba(C.cyan, .7 * (1 - press)); X.lineWidth = 3; X.stroke(); }
    X.translate(x, y); X.scale(1.25, 1.25);
    const p = new Path2D('M0 0L0 23L6 17L10 27L14 25L10 16L18 16Z');
    X.shadowColor = 'rgba(0,0,0,.25)'; X.shadowBlur = 8; X.shadowOffsetY = 3;
    X.fillStyle = '#FFFFFF'; X.fill(p); X.shadowColor = 'transparent'; X.lineWidth = 1.6; X.strokeStyle = '#142D40'; X.stroke(p);
    X.restore();
  }
  // posição do cursor por quadros-chave [[t, x, y], ...]
  function path(lt, keys) { return [kf(lt, keys.map(k => [k[0], k[1]]), ease), kf(lt, keys.map(k => [k[0], k[2]]), ease)]; }
  // luz de varredura sobre um retângulo
  function scan(x, y, w, h, p, a = 1) {
    if (p <= 0 || p >= 1 || a <= .005) return;
    const yy = y + h * p, g = X.createLinearGradient(0, yy - 60, 0, yy + 4);
    g.addColorStop(0, rgba(C.cyan, 0)); g.addColorStop(1, rgba(C.cyan, .22 * a));
    X.save(); rr(x, y, w, h, 14); X.clip(); X.fillStyle = g; X.fillRect(x, yy - 60, w, 64);
    X.fillStyle = rgba(C.cyan, .8 * a); X.fillRect(x, yy, w, 2); X.restore();
  }
  // "esqueleto" de carregamento com brilho que passa
  function skeleton(x, y, w, h, t, a = 1) {
    if (a <= .005) return;
    X.save(); X.globalAlpha *= a; rr(x, y, w, h, h / 2); X.fillStyle = '#EAF1EF'; X.fill(); X.clip();
    const sx = x + ((t * .9) % 1) * (w + 300) - 300, g = X.createLinearGradient(sx, 0, sx + 300, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    X.fillStyle = g; X.fillRect(sx, y, 300, h); X.restore();
  }
  function spinner(x, y, r, t, col = C.cyan, a = 1) {
    if (a <= .005) return;
    X.save(); X.globalAlpha *= a; X.lineWidth = 3; X.lineCap = 'round'; X.strokeStyle = rgba(col, .2);
    X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.strokeStyle = col;
    X.beginPath(); X.arc(x, y, r, t * 7, t * 7 + 1.7); X.stroke(); X.restore();
  }
  function mic(x, y, s, col) {
    X.save(); X.strokeStyle = col; X.lineWidth = s * .09; X.lineCap = 'round';
    rr(x - s * .16, y - s * .42, s * .32, s * .52, s * .16); X.stroke();
    X.beginPath(); X.arc(x, y - s * .06, s * .3, 0.15, Math.PI - .15); X.stroke();
    X.beginPath(); X.moveTo(x, y + s * .24); X.lineTo(x, y + s * .4); X.stroke(); X.restore();
  }
  function checkDot(x, y, r, p, col = C.cyan) {
    if (p <= 0) return; const e = backOut(p);
    X.save(); X.beginPath(); X.arc(x, y, r * e, 0, TAU); X.fillStyle = col; X.fill(); X.restore();
    icon('check', x, y, r * 1.3, '#FFFFFF', clamp(p * 1.5), 5);
  }
  // mostrador circular da pontuação
  function gauge(cx, cy, r, v, a) {
    if (a <= .005) return;
    const a0 = Math.PI * .75, span = Math.PI * 1.5;
    X.save(); X.globalAlpha *= a; X.lineCap = 'round';
    X.lineWidth = 18; X.strokeStyle = rgba(C.ink, .07); X.beginPath(); X.arc(cx, cy, r, a0, a0 + span); X.stroke();
    const g = X.createLinearGradient(cx - r, cy, cx + r, cy); g.addColorStop(0, C.cyan); g.addColorStop(1, C.blue);
    X.strokeStyle = g; X.shadowColor = rgba(C.cyan, .5); X.shadowBlur = 18;
    X.beginPath(); X.arc(cx, cy, r, a0, a0 + span * clamp(v / 100)); X.stroke(); X.restore();
    text(String(Math.round(v)), cx, cy - 6, { size: 84, weight: 800, align: 'center', alpha: a, ls: -3 });
    text('/100', cx, cy + 52, { size: 22, weight: 600, align: 'center', color: C.muted, alpha: a });
  }
  // coluna de passos à esquerda (o passo ativo acende)
  function steps(lt, list, x, y, active, gap = 112) {
    list.forEach(([n, title, sub], i) => {
      const e = expoOut(seg(lt, .5 + i * .15, 1.1 + i * .15)), on = i === active, done = i < active;
      const yy = y + i * gap;
      X.save(); X.globalAlpha = e; X.translate((1 - e) * -30, 0);
      if (on) { rr(x - 22, yy - 44, 560, 94, 20); X.fillStyle = '#FFFFFF'; X.shadowColor = 'rgba(8,52,50,.12)'; X.shadowBlur = 30; X.shadowOffsetY = 10; X.fill(); X.shadowColor = 'transparent'; X.strokeStyle = rgba(C.cyan, .5); X.lineWidth = 1.5; X.stroke(); }
      X.beginPath(); X.arc(x + 20, yy, 20, 0, TAU); X.fillStyle = on ? C.blue : done ? C.cyan : rgba(C.ink, .07); X.fill();
      if (done) icon('check', x + 20, yy, 22, '#FFFFFF', 1, 5);
      else text(n, x + 20, yy + 1, { size: 20, weight: 800, align: 'center', color: on ? '#FFFFFF' : C.muted });
      text(title, x + 60, yy - 10, { size: 28, weight: 700, color: on || done ? C.ink : C.muted });
      text(sub, x + 60, yy + 24, { size: 19, color: C.muted, alpha: on ? 1 : .7 });
      X.restore();
    });
  }

  // ---------------- 00 · abertura ----------------
  function intro(t, lt) {
    net(t, expoOut(seg(lt, 0, 1.5)) * .9);
    const k = expoOut(seg(lt, .1, 1.1)), s = 240 * lerp(.6, 1, k);
    for (let i = 0; i < 4; i++) {
      const p = ((lt * .5 + i / 4) % 1), r = 150 + p * 620;
      X.beginPath(); X.arc(W / 2, 410, r, 0, TAU); X.strokeStyle = rgba(i % 2 ? C.cyan : C.blue, .15 * (1 - p) * k); X.lineWidth = 2; X.stroke();
    }
    // brilho atrás do logo
    const gl = X.createRadialGradient(W / 2, 410, 0, W / 2, 410, 360); gl.addColorStop(0, rgba(C.cyan, .22 * k)); gl.addColorStop(1, rgba(C.cyan, 0));
    X.fillStyle = gl; X.fillRect(W / 2 - 360, 50, 720, 720);
    logo(W / 2 - s / 2, 410 - s / 2 + (1 - k) * 40, s, { alpha: k });
    text('*2*Doctor', W / 2, 650, { size: 128, weight: 800, align: 'center', reveal: seg(lt, .55, 1.5), accent: C.blue });
    text('Medicine connected to *knowledge*.', W / 2, 760, { size: 38, color: C.muted, align: 'center', alpha: expoOut(seg(lt, 1.3, 2.1)), accent: C.blue });
    const labs = ['AI clinical cases', 'Chat with sources', 'New every week'];
    X.font = `600 24px ${F.sans}`; const tot = labs.reduce((a, l) => a + X.measureText(l).width + 24 * 1.8 + 22 + 16, -16);
    let px = W / 2 - tot / 2;
    labs.forEach((l, i) => { const e = expoOut(seg(lt, 2 + i * .15, 2.6 + i * .15)); px += pill(px, 860 + (1 - e) * 16, l, { size: 24, alpha: e, dot: [C.blue, C.cyan, C.violet][i], color: C.ink2 }) + 16; });
  }

  // ---------------- 01 · o 2 ----------------
  const DOIS = [['*2* heads', 'You and AI, reasoning together'], ['*2*nd opinion', 'In seconds, any time'], ['*2* fronts', 'From the shift to your studies'], ['*2* worlds', 'Local and international guidelines']];
  function dois(t, lt) {
    eyebrow(120, 250, 'The 2 in 2Doctor', { alpha: expoOut(seg(lt, .1, .6)) });
    const step = 1.55, cur = clamp(Math.floor((lt - .4) / step), 0, DOIS.length - 1);
    DOIS.forEach(([big, sub], i) => {
      const a = .4 + i * step, kin = expoOut(seg(lt, a, a + .5)), kout = i < DOIS.length - 1 ? ease(seg(lt, a + step - .22, a + step + .08)) : 0;
      if (kin <= .005 || kout >= .995) return;
      const al = kin * (1 - kout), dy = (1 - kin) * 50 - kout * 50;
      text(big, 114, 450 + dy, { size: 140, weight: 800, alpha: al, accent: C.blue });
      text(sub, 120, 590 + dy, { size: 42, color: C.muted, alpha: al * expoOut(seg(lt, a + .15, a + .6)) });
    });
    DOIS.forEach((_, i) => { const on = i === cur, e = expoOut(seg(lt, .3 + i * .05, .8 + i * .05)); rr(120 + i * 58, 700, on ? 44 : 30, 6, 3); X.globalAlpha = e; X.fillStyle = on ? C.ink : rgba(C.ink, .15); X.fill(); X.globalAlpha = 1; });
    text('It all starts with *2*.', 120, 790, { size: 32, color: C.ink2, alpha: expoOut(seg(lt, 6.1, 6.7)), accent: C.blue });
    // o "2" gigante: contorno que se desenha, preenchimento que sobe e dois pontos em órbita (você e a IA)
    const cx = 1400, cy = 560, size = 740;
    const kd = expoOut(seg(lt, .2, 1.4)), fill = ease(seg(lt, 1, 2.8));
    X.save(); X.font = `800 ${size}px ${F.sans}`; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.globalAlpha = kd; X.lineWidth = 4; X.strokeStyle = rgba(C.blue, .55);
    X.setLineDash([2400]); X.lineDashOffset = 2400 * (1 - kd); X.strokeText('2', cx, cy + (1 - kd) * 30); X.setLineDash([]);
    if (fill > 0) {
      const g = X.createLinearGradient(0, cy + size / 2, 0, cy - size / 2);
      g.addColorStop(0, C.blue); g.addColorStop(clamp(fill), C.cyan); g.addColorStop(clamp(fill + .001), rgba(C.cyan, 0));
      X.fillStyle = g; X.shadowColor = rgba(C.cyan, .35 * fill); X.shadowBlur = 60; X.fillText('2', cx, cy);
    }
    X.restore();
    const orb = expoOut(seg(lt, 2.2, 3));
    [[C.ink, 0, 'You'], [C.cyan, .5, 'AI']].forEach(([col, ph, lab]) => {
      const ang = (lt * .38 + ph) * TAU, ox = cx + Math.cos(ang) * 400, oy = cy + 20 + Math.sin(ang) * 330;
      X.save(); X.globalAlpha = orb; X.beginPath(); X.arc(ox, oy, 16, 0, TAU); X.fillStyle = col; X.shadowColor = rgba(col, .5); X.shadowBlur = 24; X.fill(); X.restore();
      text(lab, ox, oy - 40, { size: 22, weight: 700, align: 'center', color: C.ink2, alpha: orb });
    });
  }

  // ---------------- 02 · caso clínico ----------------
  const RELATO = 'Man, 58, crushing chest pain for 2 hours, radiating to the left arm, with sweating. Hypertensive and a smoker. BP 150/90, HR 98.';
  const CAMPOS = [['Chief complaint', 'Crushing chest pain for 2 h'], ['History', 'Radiates to the left arm, with sweating'], ['Past history', 'Hypertension · smoker'], ['Vital signs', 'BP 150/90 mmHg · HR 98 bpm'], ['Physical exam', 'Diaphoretic, no murmurs']];
  const HIPS = [['Acute coronary syndrome', 'high', C.red], ['Aortic dissection', 'moderate', C.amber], ['Acute pericarditis', 'low', C.green]];
  const PASSOS = [['1', 'Report by voice or text', 'Record or type, no patient identifiers'], ['2', 'AI organizes the case', 'Complaint, history, background and exam'], ['3', 'Feedback in seconds', 'Reasoning arrives first, the rest follows'], ['4', 'Case report score', 'Five criteria and your next step']];
  function caso(t, lt) {
    header(lt, 'Clinical case', 'From case report\nto *feedback*.', null, { size: 62, y: 170 });
    const active = lt < 5.5 ? 0 : lt < 8.6 ? 1 : lt < 14.4 ? 2 : 3;
    steps(lt, PASSOS, 142, 470, active, 118);
    const e = expoOut(seg(lt, .3, 1.2)), bx = 780, by = 150 + (1 - e) * 60, bw = 1020, bh = 820;
    const z = kf(lt, [[0, 1], [4, 1.03], [5.6, 1], [8.6, 1], [12, 1.04], [14.4, 1.02], [18, 1.05]]);
    cam(z, bx + bw * .6, by + bh * .55, () => {
      const c = browser(bx, by, bw, bh, e);
      if (!c) return;
      X.save(); X.globalAlpha *= e;
      // abas de etapa do app
      ['Your report', 'Review', 'Feedback'].forEach((l, i) => {
        const on = i === Math.min(2, active), x = c.x + i * 190;
        rr(x, c.y, 176, 40, 20); X.fillStyle = on ? C.ink : '#F2F7F5'; X.fill();
        text(`${i + 1}  ${l}`, x + 88, c.y + 21, { size: 18, weight: 700, align: 'center', color: on ? '#FFFFFF' : C.muted });
      });
      const top = c.y + 70;
      if (lt < 5.8) {             // A · relato livre, voz e transcrição
        const al = 1 - ease(seg(lt, 5.4, 5.8));
        X.save(); X.globalAlpha *= al;
        text('Free-text case report', c.x, top + 10, { size: 22, weight: 800 });
        rr(c.x, top + 36, c.w, 330, 18); X.fillStyle = '#FBFDFC'; X.fill(); X.strokeStyle = lt > .8 && lt < 2.6 ? C.cyan : C.line; X.lineWidth = 2; X.stroke();
        if (lt > .8 && lt < 2.7) {  // gravando: ondas
          const ka = expoOut(seg(lt, .8, 1.1)) * (1 - ease(seg(lt, 2.4, 2.7)));
          for (let i = 0; i < 64; i++) {
            const hh = 12 + Math.abs(wob(lt, 1.3 + hash(i) * 2.5, hash(i + 4))) * 90 * (0.4 + hash(i + 8) * .6);
            rr(c.x + 40 + i * 14.2, top + 200 - hh / 2, 7, hh, 3.5); X.fillStyle = rgba(i % 3 ? C.blue : C.cyan, .75 * ka); X.fill();
          }
          text(`● REC  00:0${Math.min(9, Math.floor((lt - .8) * 4))}`, c.x + c.w - 30, top + 64, { size: 18, weight: 700, mono: true, align: 'right', color: C.red, alpha: ka });
        }
        if (lt >= 2.6) text(typed(RELATO, seg(lt, 2.6, 4.9)) + (lt < 5 ? blink(t) : ''), c.x + 30, top + 80, { size: 26, lh: 1.5, maxW: c.w - 60, color: C.ink2 });
        // botões
        const rec = lt > .8 && lt < 2.6;
        rr(c.x, top + 390, 230, 56, 28); X.fillStyle = rec ? rgba(C.red, .1) : '#FFFFFF'; X.fill(); X.strokeStyle = rec ? C.red : C.line; X.stroke();
        mic(c.x + 38, top + 418, 30, rec ? C.red : C.ink); text(rec ? 'Recording…' : 'Record case report', c.x + 66, top + 419, { size: 20, weight: 700, color: rec ? C.red : C.ink });
        if (rec) for (let i = 0; i < 2; i++) { const p = ((lt * 1.2 + i * .5) % 1); X.beginPath(); X.arc(c.x + 38, top + 418, 20 + p * 30, 0, TAU); X.strokeStyle = rgba(C.red, .35 * (1 - p)); X.lineWidth = 2; X.stroke(); }
        const org = lt > 4.9;
        rr(c.x + c.w - 300, top + 390, 300, 56, 28); X.fillStyle = org ? C.blue : rgba(C.blue, .35); X.fill();
        text('Organize my report  →', c.x + c.w - 150, top + 419, { size: 20, weight: 800, align: 'center', color: '#FFFFFF' });
        X.restore();
        const [mx, my] = path(lt, [[0, c.x + 300, top + 520], [.6, c.x + 120, top + 425], [4.6, c.x + 120, top + 425], [5.25, c.x + c.w - 160, top + 425]]);
        cursor(mx, my, expoOut(seg(lt, .2, .6)) * al, lt > .55 && lt < .95 ? seg(lt, .55, .95) : seg(lt, 5.25, 5.65));
      } else if (lt < 8.8) {      // B · a IA organiza os campos
        const al = expoOut(seg(lt, 5.6, 6)) * (1 - ease(seg(lt, 8.5, 8.8)));
        X.save(); X.globalAlpha *= al;
        text('AI organized your report. Check the fields.', c.x, top + 10, { size: 22, weight: 800 });
        CAMPOS.forEach(([lab, val], i) => {
          const a0 = 6 + i * .38, ea = expoOut(seg(lt, a0, a0 + .35)), yy = top + 50 + i * 88;
          X.save(); X.globalAlpha *= ea; X.translate((1 - ea) * 30, 0);
          rr(c.x, yy, c.w, 74, 14); X.fillStyle = '#FFFFFF'; X.fill(); X.strokeStyle = C.line; X.lineWidth = 1.5; X.stroke();
          text(lab.toUpperCase(), c.x + 24, yy + 24, { size: 14, weight: 800, mono: true, color: C.cyan });
          text(typed(val, seg(lt, a0 + .1, a0 + .6)), c.x + 24, yy + 52, { size: 22, color: C.ink });
          checkDot(c.x + c.w - 36, yy + 37, 14, seg(lt, a0 + .55, a0 + .9));
          X.restore();
        });
        scan(c.x, top + 40, c.w, 460, seg(lt, 5.9, 8.2), .9);
        const ok = lt > 7.9;
        rr(c.x, top + 520, 26, 26, 7); X.fillStyle = ok ? C.blue : '#FFFFFF'; X.fill(); X.strokeStyle = ok ? C.blue : C.faint; X.lineWidth = 2; X.stroke();
        if (ok) icon('check', c.x + 13, top + 533, 20, '#FFFFFF', 1, 5);
        text('I reviewed the data and there are no patient identifiers', c.x + 40, top + 534, { size: 19, color: C.ink2 });
        rr(c.x + c.w - 260, top + 510, 260, 50, 25); X.fillStyle = C.blue; X.fill();
        text('Get feedback  →', c.x + c.w - 130, top + 536, { size: 19, weight: 800, align: 'center', color: '#FFFFFF' });
        X.restore();
        const [mx, my] = path(lt, [[5.8, c.x + 500, top + 600], [7.7, c.x + 14, top + 533], [7.95, c.x + 14, top + 533], [8.35, c.x + c.w - 130, top + 536]]);
        cursor(mx, my, al, lt < 8.1 ? seg(lt, 7.7, 8.05) : seg(lt, 8.35, 8.7));
      } else {                    // C/D · feedback em partes + pontuação
        const al = expoOut(seg(lt, 8.7, 9.1));
        X.save(); X.globalAlpha *= al;
        text('CASE FEEDBACK', c.x, top + 4, { size: 15, weight: 700, mono: true, color: C.muted, ls: 2 });
        text('Chest pain', c.x, top + 44, { size: 38, weight: 800 });
        const tabs = [['Reasoning', 9.9], ['Clinical exam', 13.2], ['Study', 13.6], ['Your learning', 10.4]];
        let tx = c.x;
        tabs.forEach(([l, done], i) => {
          X.font = `700 18px ${F.sans}`; const tw = X.measureText(l).width + 60, on = i === 0;
          rr(tx, top + 84, tw, 40, 20); X.fillStyle = on ? C.ink : '#FFFFFF'; X.fill(); X.strokeStyle = on ? C.ink : C.line; X.stroke();
          text(l, tx + 20, top + 105, { size: 18, weight: 700, color: on ? '#FFFFFF' : C.ink2 });
          if (lt < done) spinner(tx + tw - 20, top + 104, 7, t, on ? '#FFFFFF' : C.cyan); else checkDot(tx + tw - 20, top + 104, 8, seg(lt, done, done + .3));
          tx += tw + 10;
        });
        // conteúdo do raciocínio (chega primeiro)
        const y0 = top + 150, colW = c.w * .62;
        if (lt < 9.9) { for (let i = 0; i < 5; i++) skeleton(c.x, y0 + i * 44, colW - i * 60, 22, t + i * .1, 1 - ease(seg(lt, 9.7, 9.9))); }
        const r1 = expoOut(seg(lt, 9.9, 10.4));
        if (r1 > 0) {
          X.save(); X.globalAlpha *= r1;
          text('CASE SUMMARY', c.x, y0, { size: 14, weight: 800, mono: true, color: C.cyan });
          text('Typical chest pain for 2 h with sweating in a hypertensive man who smokes.', c.x, y0 + 32, { size: 22, lh: 1.4, maxW: colW, color: C.ink2 });
          const ra = expoOut(seg(lt, 10.4, 10.9));
          X.globalAlpha *= 1;
          text('RED FLAGS', c.x, y0 + 118, { size: 14, weight: 800, mono: true, color: C.red, alpha: ra });
          let ax = c.x; ['Pain at rest > 20 min', 'Sweating', 'Radiation to the arm'].forEach((l, i) => { const ei = expoOut(seg(lt, 10.5 + i * .12, 10.9 + i * .12)); ax += pill(ax, y0 + 158, l, { size: 17, alpha: ei * r1, fill: rgba(C.red, .08), stroke: rgba(C.red, .3), color: C.red, dot: C.red }) + 10; });
          text('DIAGNOSTIC HYPOTHESES', c.x, y0 + 214, { size: 14, weight: 800, mono: true, color: C.cyan, alpha: expoOut(seg(lt, 11, 11.4)) });
          HIPS.forEach(([h, pr, col], i) => {
            const ei = expoOut(seg(lt, 11.1 + i * .25, 11.6 + i * .25)), yy = y0 + 240 + i * 62;
            X.save(); X.globalAlpha *= ei; X.translate((1 - ei) * 20, 0);
            rr(c.x, yy, colW, 52, 12); X.fillStyle = '#FFFFFF'; X.fill(); X.strokeStyle = C.line; X.lineWidth = 1.5; X.stroke();
            text(String(i + 1).padStart(2, '0'), c.x + 20, yy + 27, { size: 16, weight: 800, mono: true, color: C.faint });
            text(h, c.x + 60, yy + 27, { size: 21, weight: 700 });
            pill(c.x + colW - 16, yy + 26, pr, { size: 15, align: 'right', fill: rgba(col, .12), stroke: false, color: col, weight: 800 });
            X.restore();
          });
          X.restore();
        }
        // aviso "gerando mais seções"
        const gen = expoOut(seg(lt, 10, 10.4)) * (1 - ease(seg(lt, 13.4, 13.8)));
        if (gen > .005) { const gx = c.x + colW + 40; rr(gx, y0, c.w - colW - 40, 50, 25); X.fillStyle = rgba(C.cyan, .08 * gen); X.fill(); spinner(gx + 28, y0 + 25, 9, t, C.cyan, gen); text('Generating more sections…', gx + 50, y0 + 26, { size: 18, weight: 700, color: C.blue, alpha: gen }); }
        X.restore();
        // pontuação do relato (cartão flutuante)
        const sc = expoOut(seg(lt, 14.3, 15));
        if (sc > .005) {
          const px = c.x + colW + 30, pw = c.w - colW - 20, py = y0 + 70 + (1 - sc) * 60, ph = 440;
          panel(px, py, pw, ph, { alpha: sc, r: 22, blur: 60, dy: 20, shadowCol: 'rgba(8,52,50,.22)', stroke: rgba(C.cyan, .45) });
          X.save(); X.globalAlpha *= sc;
          text('CASE REPORT QUALITY', px + pw / 2, py + 34, { size: 14, weight: 800, mono: true, align: 'center', color: C.muted });
          const v = 86 * easeOut(seg(lt, 14.6, 16.2));
          gauge(px + pw / 2, py + 150, 88, v, 1);
          [['Clarity', .75], ['History', 1], ['Relevance', .75], ['Findings', .75], ['Synthesis', .75]].forEach(([l, f], i) => {
            const yy = py + 270 + i * 32, fp = f * easeOut(seg(lt, 15 + i * .15, 15.8 + i * .15));
            text(l, px + 24, yy, { size: 16, weight: 700, color: C.ink2 });
            rr(px + 130, yy - 5, pw - 160, 10, 5); X.fillStyle = rgba(C.ink, .07); X.fill();
            rr(px + 130, yy - 5, Math.max(10, (pw - 160) * fp), 10, 5); X.fillStyle = C.cyan; X.fill();
          });
          X.restore();
        }
      }
      X.restore();
    });
  }

  // ---------------- 03 · chat de IA ----------------
  const Q = 'How should I start treating hypertension in adults?';
  const RESP = [
    ['h', 'Initial treatment'],
    ['p', 'For most patients: *two drugs at low dose, in a single pill* [1].'],
    ['b', 'ACE inhibitor or ARB + calcium channel blocker or thiazide-like diuretic'],
    ['b', 'Systolic target *120–129 mmHg*, if tolerated [1]'],
    ['b', 'US guideline: *< 130/80 mmHg* [2]'],
  ];
  const TIT = [['EN', 'Initial treatment'], ['ES', 'Tratamiento inicial'], ['PT', 'Tratamento inicial']];
  const FEAT = [['∞', 'Unlimited AI', 'Ask as much as you like'], ['[1]', 'Official sources', 'Every claim with its source'], ['PDF', 'One-click PDF', 'Save and share the answer'], ['3', 'English, Español, Português', 'The app and answers in your language']];
  function chat(t, lt) {
    header(lt, 'AI chat', 'Ask.\n*Check the sources.*', null, { size: 62, y: 170 });
    FEAT.forEach(([ic, tl, sub], i) => {
      const a = [.9, 6.8, 9.2, 11][i], on = lt >= a && (i === 3 || lt < [6.8, 9.2, 11, 99][i]), e = expoOut(seg(lt, .6 + i * .15, 1.2 + i * .15)), yy = 470 + i * 118;
      X.save(); X.globalAlpha = e; X.translate((1 - e) * -30, 0);
      if (on) { rr(120, yy - 46, 580, 96, 20); X.fillStyle = '#FFFFFF'; X.shadowColor = 'rgba(8,52,50,.12)'; X.shadowBlur = 30; X.shadowOffsetY = 10; X.fill(); X.shadowColor = 'transparent'; X.strokeStyle = rgba(C.cyan, .5); X.lineWidth = 1.5; X.stroke(); }
      rr(140, yy - 30, 60, 60, 16); X.fillStyle = on ? C.blue : rgba(C.blue, .08); X.fill();
      text(ic, 170, yy + 1, { size: ic.length > 2 ? 17 : ic === '∞' ? 38 : 22, weight: 800, align: 'center', color: on ? '#FFFFFF' : C.blue, mono: ic !== '∞' });
      text(tl, 222, yy - 10, { size: 27, weight: 700 });
      text(sub, 222, yy + 22, { size: 18, color: C.muted });
      X.restore();
    });
    const e = expoOut(seg(lt, .3, 1.2)), bx = 780, by = 150 + (1 - e) * 60, bw = 1020, bh = 820;
    const z = kf(lt, [[0, 1], [3, 1.02], [7, 1.05], [9, 1.02], [13, 1.04]]);
    cam(z, bx + bw * .55, by + bh * .5, () => {
      const c = browser(bx, by, bw, bh, e);
      if (!c) return;
      X.save(); X.globalAlpha *= e;
      // estilo de resposta + idioma
      let sx = c.x; ['Automatic', 'Quick reference', 'Learn'].forEach((l, i) => { sx += pill(sx, c.y + 18, l, { size: 16, fill: i ? '#FFFFFF' : C.ink, color: i ? C.ink2 : '#FFFFFF', stroke: i ? C.line : false }) + 8; });
      const li = lt < 11.2 ? 0 : lt < 12.1 ? 1 : 2;
      let lx = c.x + c.w; [...TIT].reverse().forEach(([code], j) => { const i = 2 - j, on = i === li; lx -= pill(lx, c.y + 18, code, { size: 16, align: 'right', mono: true, fill: on ? C.blue : '#FFFFFF', color: on ? '#FFFFFF' : C.muted, stroke: on ? false : C.line }) + 8; });
      // pergunta
      const qn = typed(Q, seg(lt, .8, 2.3));
      if (qn) { X.font = `500 23px ${F.sans}`; const qw = Math.min(X.measureText(Q).width + 50, c.w - 120); rr(c.x + c.w - qw, c.y + 60, qw, 60, 18); X.fillStyle = '#E8F3F0'; X.fill(); text(qn + (lt < 2.4 ? blink(t) : ''), c.x + c.w - qw + 25, c.y + 91, { size: 23, weight: 500 }); }
      // assistente pesquisando
      const ya = c.y + 150;
      if (lt > 2.4) {
        logo(c.x, ya, 40); text('*2*Doctor', c.x + 52, ya + 21, { size: 21, weight: 800, accent: C.blue });
        const searching = lt < 3.9;
        text(searching ? 'searching sources' + '...'.slice(0, 1 + Math.floor(t * 4) % 3) : 'search · synthesis', c.x + 160, ya + 22, { size: 16, mono: true, color: C.muted });
        let cx2 = c.x; ['ESC 2024', 'AHA/ACC 2025', 'Europe PMC'].forEach((s, i) => { const ei = expoOut(seg(lt, 2.6 + i * .25, 3 + i * .25)) * (1 - ease(seg(lt, 3.8, 4.1))); cx2 += pill(cx2, ya + 74, s, { size: 16, alpha: ei, dot: C.cyan, color: C.ink2 }) + 8; });
        // resposta em streaming
        let yy = ya + 70; const total = RESP.reduce((a, r) => a + r[1].length, 0);
        let budget = Math.floor(clamp(seg(lt, 4, 7.4)) * total);
        const tl = TIT[li][1];
        RESP.forEach(([k, s], i) => {
          if (budget <= 0) return; const part = k === 'h' ? (lt > 11.2 ? tl : s.slice(0, budget)) : s.slice(0, budget); budget -= s.length;
          const show = part.replace(/\[(\d)\]/g, '*[$1]*');
          if (k === 'h') { text(show, c.x, yy + 18, { size: 30, weight: 800 }); yy += 58; }
          else if (k === 'p') { const r = text(show, c.x, yy, { size: 23, lh: 1.45, maxW: c.w - 20, accent: C.blue, color: C.ink2 }); yy += r.h + 16; }
          else { X.beginPath(); X.arc(c.x + 8, yy, 4, 0, TAU); X.fillStyle = C.cyan; X.fill(); const r = text(show, c.x + 28, yy, { size: 22, lh: 1.4, maxW: c.w - 60, accent: C.blue, color: C.ink2 }); yy += r.h + 10; }
        });
        // fontes
        [['1', 'ESC 2024 · Elevated blood pressure and hypertension', 'Eur Heart J'], ['2', 'AHA/ACC 2025 · High blood pressure in adults', 'Hypertension']].forEach(([n, ti, src], i) => {
          const ei = expoOut(seg(lt, 7.4 + i * .3, 7.9 + i * .3)), sy = c.y + 470 + i * 66; if (ei <= .005) return;
          X.save(); X.globalAlpha *= ei; X.translate(0, (1 - ei) * 20);
          rr(c.x, sy, c.w, 54, 12); X.fillStyle = '#F6FAF9'; X.fill(); X.strokeStyle = C.line; X.lineWidth = 1.5; X.stroke();
          text(`[${n}]`, c.x + 20, sy + 28, { size: 18, mono: true, weight: 700, color: C.blue });
          text(ti, c.x + 72, sy + 28, { size: 20, weight: 700 });
          text(src + ' ↗', c.x + c.w - 20, sy + 28, { size: 18, color: C.muted, align: 'right' });
          X.restore();
        });
        // ações: copiar · gerar PDF
        const ax = expoOut(seg(lt, 8.2, 8.7));
        const pdfDone = lt > 9.8;
        pill(c.x, c.y + 624, 'Copy answer', { size: 17, alpha: ax, color: C.ink2 });
        pill(c.x + 200, c.y + 624, pdfDone ? 'Download PDF' : lt > 9.3 ? 'Generating PDF…' : 'Generate PDF', { size: 17, alpha: ax, fill: pdfDone ? C.blue : '#FFFFFF', color: pdfDone ? '#FFFFFF' : C.ink2, stroke: pdfDone ? false : C.line });
        // aviso do arquivo salvo
        const toast = expoOut(seg(lt, 9.9, 10.3)) * (1 - ease(seg(lt, 11.8, 12.2)));
        if (toast > .005) {
          const tx = c.x + c.w - 440, ty = c.y + 590 + (1 - toast) * 20;
          panel(tx, ty, 440, 74, { alpha: toast, r: 16, blur: 30, dy: 10, fill: C.ink, stroke: false });
          X.save(); X.globalAlpha *= toast;
          rr(tx + 18, ty + 17, 30, 40, 5); X.fillStyle = '#FFFFFF'; X.fill(); text('PDF', tx + 33, ty + 44, { size: 10, weight: 800, align: 'center', color: C.red });
          text('2doctor-how-should-i-start-treating-hypertension.pdf', tx + 62, ty + 30, { size: 14, weight: 700, color: '#FFFFFF', maxW: 360 });
          text('Saved with the question as its name', tx + 62, ty + 54, { size: 14, color: '#92D5C5' });
          X.restore();
        }
        const [mx, my] = path(lt, [[8.4, c.x + 600, c.y + 720], [9.1, c.x + 250, c.y + 626], [10.6, c.x + 250, c.y + 626], [11.1, c.x + c.w - 150, c.y + 18], [11.9, c.x + c.w - 90, c.y + 18]]);
        cursor(mx, my, expoOut(seg(lt, 8.4, 8.8)) * (1 - ease(seg(lt, 12.6, 13))), lt < 10 ? seg(lt, 9.1, 9.5) : lt < 11.8 ? seg(lt, 11.1, 11.5) : seg(lt, 11.9, 12.3));
      }
      X.restore();
    });
  }

  // ---------------- 04 · novidades toda semana ----------------
  const NOVOS = [['Innovation radar', 'Technologies under evaluation', 'shield'], ['ECG in 10 steps', 'Course, tracings and exercises', 'pulse'], ['3D CT', 'Real slices linked to anatomy', 'echo'], ['Clinical scores', 'Calculators with sources', 'heart'], ['Ideas lab', 'AI prototypes', 'flask'], ['AI clinical case', 'Feedback and scoring', 'steth'], ['Question bank', 'Practice with explanations', 'check']];
  function semana(t, lt) {
    net(t, expoOut(seg(lt, 0, 1)) * .8);
    eyebrow(W / 2, 200, '2Doctor Lab', { align: 'center', dot: false, alpha: expoOut(seg(lt, .05, .6)) });
    text('New AI tools for medicine,', W / 2, 272, { size: 66, weight: 800, align: 'center', reveal: seg(lt, .1, 1.1) });
    text('*every week.*', W / 2, 352, { size: 66, weight: 800, align: 'center', reveal: seg(lt, .3, 1.3), accent: C.blue });
    // esteira de cartões: o do centro cresce e brilha
    const cw = 460, gap = 40, yc = 650, speed = 170, off = lt * speed;
    const n = NOVOS.length, span = n * (cw + gap);
    const ek = expoOut(seg(lt, .5, 1.4));
    X.save(); X.globalAlpha = ek;
    X.strokeStyle = rgba(C.blue, .15); X.lineWidth = 2; X.setLineDash([6, 10]); X.beginPath(); X.moveTo(0, yc + 190); X.lineTo(W, yc + 190); X.stroke(); X.setLineDash([]);
    for (let k = 0; k < n * 2; k++) {
      const i = k % n, x = ((k * (cw + gap) - off) % (span * 2) + span * 2) % (span * 2) - span * .5;
      const mid = x + cw / 2, d = Math.abs(mid - W / 2), f = clamp(1 - d / 760), s = .9 + .16 * ease(f);
      if (x > W + 50 || x + cw < -50) continue;
      const [nome, desc, ic] = NOVOS[i];
      X.save(); X.translate(mid, yc); X.scale(s, s); X.translate(-cw / 2, -150);
      panel(0, 0, cw, 320, { r: 26, alpha: .7 + .3 * f, blur: 30 + 40 * f, dy: 10 + 16 * f, stroke: f > .6 ? rgba(C.cyan, .6) : C.line, shadowCol: `rgba(8,52,50,${.08 + .14 * f})` });
      X.globalAlpha *= .7 + .3 * f;
      badge(ic, 70, 72, 42, C.blue, 1, 1);
      pill(cw - 24, 44, 'NEW', { size: 14, mono: true, align: 'right', fill: C.blue, stroke: false, color: '#FFFFFF' });
      text(`WEEK ${String(i + 1).padStart(2, '0')}`, cw - 24, 88, { size: 14, mono: true, weight: 700, align: 'right', color: C.cyan });
      text(nome, 32, 180, { size: 36, weight: 800, maxW: cw - 60, lh: 1.1 });
      text(desc, 32, 250, { size: 23, color: C.muted, maxW: cw - 60, lh: 1.3 });
      X.restore();
    }
    // pulso que corre na linha
    const px = ((lt * 520) % (W + 200)) - 100, gp = X.createRadialGradient(px, yc + 190, 0, px, yc + 190, 60);
    gp.addColorStop(0, rgba(C.cyan, .7)); gp.addColorStop(1, rgba(C.cyan, 0)); X.fillStyle = gp; X.fillRect(px - 60, yc + 130, 120, 120);
    X.restore();
    text('Built with AI, right in your app. Nothing to install.', W / 2, 935, { size: 30, color: C.ink2, align: 'center', alpha: expoOut(seg(lt, 2.2, 2.9)) });
  }

  // ---------------- 05 · TC conectada ao 3D (passada rápida) ----------------
  function tc(t, lt) {
    header(lt, 'Radiology', 'CT connected to *3D* anatomy.', null, { size: 64, y: 170 });
    const p = seg(lt, .3, 4.8), y = 330, h = 600, z = kf(lt, [[0, 1], [5, 1.05]]);
    cam(z, W / 2, 630, () => {
      const e1 = expoOut(seg(lt, .1, .8)), x1 = 120, w1 = 980, y1 = y + (1 - e1) * 60;
      panel(x1, y1, w1, h, { alpha: e1, r: 24 });
      if (e1 > .005) { X.save(); X.globalAlpha = e1; turntable(IMG.tc3d, p, x1 + 14, y1 + 14, w1 - 28, h - 28, { r: 14, src: [0, .09, 1, .88] }); pill(x1 + 34, y1 + 50, '3D', { size: 17, mono: true, color: C.ink }); X.restore(); }
      const e2 = expoOut(seg(lt, .3, 1)), x2 = 1130, w2 = 670, y2 = y + (1 - e2) * 60;
      panel(x2, y2, w2, h, { alpha: e2, r: 24, fill: '#0B0F12', stroke: '#1C2A2C' });
      if (e2 > .005) {
        X.save(); X.globalAlpha = e2; turntable(IMG.tc, p, x2 + 14, y2 + 70, w2 - 28, h - 120, { r: 12 });
        text('Axial CT', x2 + 30, y2 + 40, { size: 22, weight: 700, color: '#E6F2EE' });
        text(`Slice ${Math.round(lerp(14, 106, p))} / 120`, x2 + w2 - 30, y2 + 40, { size: 18, mono: true, color: '#92D5C5', align: 'right' });
        scan(x2 + 14, y2 + 70, w2 - 28, h - 120, (lt * .7) % 1, .7);
        X.restore();
      }
    });
    text('Public reference CT · TotalSegmentator, CC BY 4.0', W - 120, 966, { size: 16, mono: true, color: C.faint, align: 'right', alpha: expoOut(seg(lt, 1, 1.6)) });
  }

  // ---------------- 06 · encerramento ----------------
  function outro(t, lt) {
    net(t, .7);
    const k = expoOut(seg(lt, .1, 1)), s = 200 * lerp(.8, 1, k);
    const gl = X.createRadialGradient(W / 2, 390, 0, W / 2, 390, 320); gl.addColorStop(0, rgba(C.cyan, .2 * k)); gl.addColorStop(1, rgba(C.cyan, 0));
    X.fillStyle = gl; X.fillRect(W / 2 - 320, 70, 640, 640);
    logo(W / 2 - s / 2, 290 + (1 - k) * 30, s, { alpha: k });
    text('*2*Doctor', W / 2, 560, { size: 116, weight: 800, align: 'center', reveal: seg(lt, .3, 1.1), accent: C.blue });
    text('*Unlimited* AI. New *every week*.', W / 2, 660, { size: 40, color: C.muted, align: 'center', alpha: expoOut(seg(lt, .7, 1.4)), accent: C.blue });
    const cta = expoOut(seg(lt, 1.1, 1.8));
    pill(W / 2, 790, 'Start free at 2doctor.ai', { size: 32, weight: 800, align: 'center', fill: C.blue, stroke: false, color: '#FFFFFF', dot: '#9FE3D3', alpha: cta });
    text('English · Español · Português', W / 2, 880, { size: 22, mono: true, color: C.faint, align: 'center', alpha: expoOut(seg(lt, 1.6, 2.2)) });
  }

  video({
    slug: '2doctor-app60', title: 'Meet 2Doctor', dur: 60, chrome: [3.9, 55.8], code: '2DOCTOR', kicker: 'Meet 2Doctor',
    images: { tc3d: seq('tc3d'), tc: seq('tc') },
    sections: [[S.intro, '2Doctor'], [S.dois, 'The 2'], [S.caso, 'Clinical case'], [S.chat, 'AI chat'], [S.semana, 'Every week'], [S.tc, '3D CT'], [S.outro, 'Start']],
    scenes: [[S.intro, intro], [S.dois, dois], [S.caso, caso], [S.chat, chat], [S.semana, semana], [S.tc, tc], [S.outro, outro]]
  });
})();
