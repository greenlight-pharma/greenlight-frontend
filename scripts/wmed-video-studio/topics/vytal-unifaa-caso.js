// Reels · Vytal Acadêmico × DA UniFAA — foco no feedback do caso clínico · ~54 s, 1080×1920 · motor vertical.
// Capturas reais da versão web (tools/capture-vytal-caso.mjs e tools/capture-vytal-web.mjs → out/vytal-captures/):
// o aluno preenchendo um caso, a geração e o feedback (caso fictício do próprio app), o Assistente respondendo,
// e os giros 3D como bônus. Áreas seguras do Instagram: topo (~220 px) e base (~330 px) livres.
(() => {
  const CAP = 'out/vytal-captures/', seq = (m, n) => Array.from({ length: n }, (_, i) => `${CAP}${m}/f${String(i).padStart(3, '0')}.jpg`);
  const CASO = { contexto: 0, descricao: 8, avaliacao: 75, gerando: 116, feedback: 146, hipoteses: 172, cards: 189, entender: 237, resposta: 271, total: 303 }, IA = { inicio: 0, resposta: 25, total: 86 };
  const S = { intro: 0, partner: 3.2, caso: 7.2, fb: 15.4, zoom: 21.4, hip: 25.8, ia: 36.3, quest: 42.1, bonus: 45.7, outro: 50.3, end: 54.3 };
  const PARTNER = { title: 'Diretório Acadêmico', name: 'UniFAA', place: 'Valença · RJ' };
  const BW = 900, BH = 58 + Math.round(900 * 1267 / 1082), BX = (W - BW) / 2, BY = 470; // janela do navegador no tamanho da captura

  // quadro da sequência entre os índices a e b conforme o progresso p (sem fusão: texto de interface fica nítido)
  const at = (list, a, b, p) => list[Math.min(list.length - 1, Math.round(a + (b - a) * clamp(p)))];
  function title(lt, eb, t, o = {}) {
    eyebrow(90, o.y ?? 262, eb, { alpha: expoOut(seg(lt, .05, .6)), dotCol: o.dot || C.teal });
    text(t, 86, (o.y ?? 262) + 92, { size: o.size || 70, weight: 700, reveal: seg(lt, .12, 1.1), accent: C.sky, lh: 1.04 });
  }
  function win(img, lt, o = {}) {
    const e = expoOut(seg(lt, .15, 1)), y = BY + (1 - e) * 120;
    browser(img, [0, 0, img.width, img.height], BX, y, BW, BH, { alpha: e, url: 'app.vytalsaude.com.br' });
    return e;
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
    const fl = Math.max(0, 1 - lt * 1.4); if (fl > 0) { const g = X.createRadialGradient(W / 2, cy, 0, W / 2, cy, 700); g.addColorStop(0, rgba(C.sky, .35 * fl)); g.addColorStop(1, rgba(C.sky, 0)); X.fillStyle = g; X.fillRect(0, 0, W, H); }
    for (let i = 0; i < 3; i++) { const p = (lt * .45 + i / 3) % 1, r = 150 + p * 560; X.beginPath(); X.arc(W / 2, cy, r, 0, TAU); X.strokeStyle = rgba(C.sky, .22 * (1 - p) * clamp(k)); X.lineWidth = 2; X.stroke(); }
    mark(W / 2, cy, 300 * lerp(.6, 1, clamp(k)), { alpha: clamp(k * 1.4), glow: 60 });
    eyebrow(W / 2, 330, 'Nova parceria', { align: 'center', alpha: expoOut(seg(lt, .3, .9)), dotCol: C.gold, color: C.white, size: 26 });
    text('Vytal *Acadêmico*', W / 2, 1070, { size: 104, weight: 700, align: 'center', reveal: seg(lt, .6, 1.5), accent: C.sky });
    text('Cada caso vira *aprendizado.*', W / 2, 1190, { size: 48, color: C.pale, align: 'center', alpha: expoOut(seg(lt, 1.3, 2.1)), accent: C.white, weight: 500 });
  }

  // ---------- 01 · a parceria ----------
  function partner(t, lt) {
    eyebrow(W / 2, 290, 'Parceria', { align: 'center', alpha: expoOut(seg(lt, .05, .6)), dotCol: C.gold, color: C.white });
    const a1 = expoOut(seg(lt, .15, .85)), a2 = expoOut(seg(lt, .7, 1.4)), x1 = W / 2 - (1 - a1) * 260, x2 = W / 2 + (1 - a2) * 260;
    glass(x1 - 420, 400, 840, 250, { alpha: a1, r: 40 });
    mark(x1 - 250, 525, 150, { alpha: a1, glow: 30 });
    text('Vytal', x1 - 90, 495, { size: 74, weight: 700, alpha: a1, ls: -2 });
    text('*Acadêmico*', x1 - 90, 568, { size: 62, alpha: a1, accent: C.sky });
    const p = ease(seg(lt, .6, 1.3));
    strokePath([[W / 2, 650], [W / 2, 900]], p, { col: C.sky, lw: 4, glow: 20, alpha: .9 });
    const q = (lt * .7) % 1; if (p >= 1) { X.save(); X.beginPath(); X.arc(W / 2, lerp(650, 900, q), 7, 0, TAU); X.fillStyle = C.white; X.shadowColor = C.sky; X.shadowBlur = 24; X.fill(); X.restore(); }
    cross(W / 2, 775, 44, expoOut(seg(lt, .9, 1.4)), t);
    glass(x2 - 420, 900, 840, 250, { alpha: a2, r: 40 });
    eyebrow(x2, 960, PARTNER.title, { align: 'center', alpha: a2, size: 22, dotCol: C.gold });
    text(PARTNER.name, x2, 1030, { size: 96, weight: 700, align: 'center', alpha: a2, ls: -3 });
    text(PARTNER.place, x2, 1100, { size: 28, color: C.muted, align: 'center', alpha: a2, weight: 500, ls: 1 });
    text('Juntos pela\n*formação médica.*', W / 2, 1290, { size: 76, weight: 700, align: 'center', reveal: seg(lt, 1.6, 2.6), accent: C.sky, lh: 1.05 });
  }

  // ---------- 02 · o aluno registra o caso ----------
  function caso(t, lt, dur) {
    title(lt, 'Passo 1 · Registre o caso', 'Conte o caso que\nvocê *atendeu.*');
    const img = at(IMG.caso, CASO.contexto, CASO.gerando - 1, seg(lt, .6, dur - .3));
    win(img, lt);
  }
  // ---------- 03 · o feedback ----------
  function fb(t, lt, dur) {
    title(lt, 'Passo 2 · Feedback do caso', 'E receba o feedback\n*na hora.*', { dot: C.gold });
    const g = seg(lt, .3, 2.2), f = seg(lt, 2.2, dur - .3);
    const img = lt < 2.2 ? at(IMG.caso, CASO.gerando, CASO.feedback - 1, g) : at(IMG.caso, CASO.feedback, CASO.hipoteses - 1, f);
    win(img, lt);
  }
  // ---------- 04 · o que o feedback entrega (recortes ampliados da tela real) ----------
  function zoom(t, lt) {
    title(lt, 'O seu raciocínio, comentado', 'Aprenda com o\n*seu próprio caso.*');
    const pieces = [
      [IMG.key, 60, 560, 960, 'Para levar deste caso', C.sky],
      [IMG.bem, 60, 870, 470, 'Pontos fortes', C.teal],
      [IMG.mais, 550, 870, 470, 'O que aprofundar', C.sky],
      [IMG.alerta, 60, 1140, 960, 'Sinais de alerta', '#FF6B6B']
    ].map(([img, x, y, w, label, col]) => [img, x, y, w, img.height * w / img.width, label, col]);
    pieces.forEach(([img, x, y, w, h, label, col], i) => {
      const a = .4 + i * .45, k = backOut(seg(lt, a, a + .55)); if (k <= .005) return;
      X.save(); X.globalAlpha = clamp(k); const sc = lerp(.92, 1, clamp(k)); X.translate(x + w / 2, y + h / 2); X.scale(sc, sc); X.translate(-(x + w / 2), -(y + h / 2));
      rr(x, y, w, h, 22); X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = 50; X.shadowOffsetY = 20; X.fillStyle = '#F2F6FB'; X.fill(); X.shadowColor = 'transparent';
      X.restore();
      shot(img, null, x, y, w, h, { r: 22, alpha: clamp(k) });
      X.save(); X.globalAlpha = clamp(k); rr(x, y, w, h, 22); X.lineWidth = 3; X.strokeStyle = rgba(col, .9); X.shadowColor = col; X.shadowBlur = 24; X.stroke(); X.restore();
      pill(x + 16, y - 26, label, { size: 24, alpha: clamp(k), dot: col, fill: 'rgba(8,30,61,.95)', stroke: rgba(col, .7) });
    });
    text('Com hipóteses e conduta comparadas\nao gabarito comentado.', W / 2, 1340, { size: 36, color: C.pale, align: 'center', alpha: expoOut(seg(lt, 2.4, 3)), weight: 500, lh: 1.3 });
  }

  // ---------- 04b · hipóteses para discussão (ênfase): o aluno abre, percorre alta → moderada → baixa e pergunta ao Assistente ----------
  function hip(t, lt, dur) {
    title(lt, 'Raciocínio diagnóstico', 'Hipóteses\n*para discussão.*', { dot: C.gold });
    // ritmo: abrir e percorrer os cartões ocupa a maior parte; a resposta do Assistente fecha a cena
    const k = seg(lt, .5, dur - .5), mid = .62;
    const img = k < mid ? at(IMG.caso, CASO.hipoteses, CASO.entender - 1, k / mid) : at(IMG.caso, CASO.entender, CASO.total - 1, (k - mid) / (1 - mid));
    win(img, lt);
    const e = backOut(seg(lt, .5 + mid * (dur - 1) + .3, .5 + mid * (dur - 1) + .8));
    pill(W - 90, BY + 150, 'Tire a dúvida com o Assistente', { size: 28, alpha: clamp(e), dot: C.gold, align: 'right', fill: 'rgba(8,30,61,.95)', stroke: rgba(C.gold, .7) });
  }

  // ---------- 05 · IA ilimitada ----------
  function ia(t, lt, dur) {
    title(lt, 'Assistente de estudos', 'Dúvidas? Pergunte.\n*IA ilimitada.*', { dot: C.gold });
    const img = at(IMG.ia, IA.inicio, IA.total - 1, seg(lt, .5, dur - .4));
    win(img, lt);
    const k = backOut(seg(lt, 1.4, 1.9));
    pill(W - 90, BY + 150, 'Perguntas ilimitadas', { size: 30, alpha: clamp(k), dot: C.gold, align: 'right', fill: 'rgba(8,30,61,.95)', stroke: rgba(C.gold, .7) });
  }

  // ---------- 06 · banco de questões ----------
  function quest(t, lt) {
    eyebrow(90, 270, 'Banco de questões', { alpha: expoOut(seg(lt, .05, .6)) });
    const n = Math.round(5000 * (1 - Math.pow(1 - seg(lt, .2, 1.6), 4)));
    text(n.toLocaleString('pt-BR') + (lt > 1.6 ? '+' : ''), 82, 420, { size: 200, weight: 700, color: C.white, ls: -8 });
    text('questões *comentadas.*', 90, 570, { size: 60, weight: 700, accent: C.sky, alpha: expoOut(seg(lt, .5, 1.1)) });
    text('ENAMED, residência e as principais provas do país.', 90, 650, { size: 32, color: C.pale, alpha: expoOut(seg(lt, .8, 1.4)), weight: 500 });
    const e = expoOut(seg(lt, .4, 1.3));
    browser(IMG.quest, [150, 280, 2720, 1180], 60, 760 + (1 - e) * 140, 960, 540, { alpha: e });
  }

  // ---------- 07 · bônus 3D ----------
  function bonus(t, lt, dur) {
    title(lt, 'E mais · 3D interativo', 'Anatomia, histologia\ne *radiologia em 3D.*');
    const p = seg(lt, 0, dur), panel = (list, src, x, y, w, h, i, label, col) => {
      const k = expoOut(seg(lt, .3 + i * .2, 1 + i * .2)); if (k <= .005) return;
      X.save(); X.globalAlpha = k; rr(x, y + (1 - k) * 50, w, h, 30); X.fillStyle = '#12284A'; X.fill(); X.restore();
      turntable(list, p, x, y + (1 - k) * 50, w, h, { r: 30, alpha: k, src });
      X.save(); X.globalAlpha = k; rr(x, y + (1 - k) * 50, w, h, 30); X.lineWidth = 2; X.strokeStyle = rgba(col, .6); X.stroke(); X.restore();
      pill(x + 18, y + h - 40 + (1 - k) * 50, label, { size: 24, alpha: k, dot: col, fill: 'rgba(8,30,61,.9)', stroke: rgba(col, .6) });
    };
    panel(IMG.atlas, [100, 160, 796, 950], 60, 520, 470, 560, 0, 'Anatomia', C.sky);
    panel(IMG.histo, [60, 160, 876, 1040], 550, 520, 470, 560, 1, 'Histologia', '#B79CFF');
    panel(IMG.radio, [72, 690, 539, 330], 60, 1100, 470, 420, 2, 'Radiologia', C.teal);
    panel(IMG.radio, [638, 680, 410, 330], 550, 1100, 470, 420, 3, 'Tomografia real', C.teal);
  }

  // ---------- 08 · chamada final ----------
  function outro(t, lt) {
    const k = expoOut(seg(lt, .1, 1));
    for (let i = 0; i < 2; i++) { const p = (lt * .35 + i / 2) % 1, r = 130 + p * 420; X.beginPath(); X.arc(W / 2, 540, r, 0, TAU); X.strokeStyle = rgba(C.sky, .18 * (1 - p) * k); X.lineWidth = 2; X.stroke(); }
    mark(W / 2, 540, lerp(200, 250, k), { alpha: k, glow: 50 });
    text('Vytal *Acadêmico*', W / 2, 790, { size: 92, weight: 700, align: 'center', reveal: seg(lt, .3, 1.2), accent: C.sky });
    text('×  Diretório Acadêmico UniFAA', W / 2, 890, { size: 40, weight: 600, align: 'center', alpha: expoOut(seg(lt, .9, 1.6)), color: C.pale });
    text('Do caso ao\n*raciocínio clínico.*', W / 2, 1040, { size: 84, weight: 700, align: 'center', reveal: seg(lt, 1.3, 2.3), accent: C.sky, lh: 1.05 });
    let px = W / 2 - 440;
    ['Web', 'App Store', 'Google Play'].forEach((l, i) => { const e = expoOut(seg(lt, 2 + i * .15, 2.7 + i * .15)); px += pill(px, 1310 + (1 - e) * 20, l, { size: 32, alpha: e, dot: [C.gold, C.sky, C.teal][i], fill: rgba('#FFFFFF', .1) }) + 26; });
    text('vytalsaude.com.br/academico', W / 2, 1430, { size: 32, color: C.muted, align: 'center', alpha: expoOut(seg(lt, 2.4, 3)), weight: 500, ls: 1 });
  }

  video({
    dur: S.end, tr: .7,
    images: {
      mark: '../../vytal-mark-navy-transparent.png', caso: seq('caso', CASO.total), ia: seq('ia', IA.total),
      atlas: seq('atlas', 90), histo: seq('histologia', 90), radio: seq('radiologia', 90), quest: `${CAP}telas/questoes.png`,
      key: `${CAP}caso/key.png`, bem: `${CAP}caso/bem.png`, mais: `${CAP}caso/mais.png`, alerta: `${CAP}caso/alerta.png`
    },
    scenes: [[S.intro, intro], [S.partner, partner], [S.caso, caso], [S.fb, fb], [S.zoom, zoom], [S.hip, hip], [S.ia, ia], [S.quest, quest], [S.bonus, bonus], [S.outro, outro]],
    chrome(t) {
      const a = expoOut(seg(t, S.partner + .4, S.partner + 1.2)) * (1 - ease(seg(t, S.outro - .4, S.outro + .2)));
      if (a <= .005) return;
      mark(118, 150, 70, { alpha: a });
      text('Vytal *Acadêmico*', 170, 152, { size: 34, weight: 700, alpha: a, accent: C.sky });
      X.save(); X.globalAlpha = a * .8; rr(90, 1605, W - 180, 5, 3); X.fillStyle = rgba(C.pale, .15); X.fill();
      rr(90, 1605, (W - 180) * seg(t, S.partner, S.outro), 5, 3); X.fillStyle = C.sky; X.fill(); X.restore();
    }
  });
})();
