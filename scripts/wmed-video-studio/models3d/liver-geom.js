// Geometria procedural do fígado (sem three.js, JS puro): campo implícito (SDF) anatômico, malha por
// "surface nets" (isosuperfície indexada e suave), projeção de Newton sobre a superfície e ruído celular (Worley)
// para os nódulos de regeneração. Tudo determinístico. Unidades: 1 ≈ 10 cm; +x = esquerda do paciente
// (direita da tela na vista anterior), +y = cranial, +z = anterior.

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const smax = (a, b, k) => -smin(-a, -b, k);
function sdEll(x, y, z, rx, ry, rz) {
  const k0 = Math.hypot(x / rx, y / ry, z / rz), k1 = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz));
  return k1 < 1e-9 ? -Math.min(rx, ry, rz) : k0 * (k0 - 1) / k1;
}
function sdCapsule(x, y, z, ax, ay, az, bx, by, bz, r) {
  const px = x - ax, py = y - ay, pz = z - az, dx = bx - ax, dy = by - ay, dz = bz - az;
  const h = clamp01((px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz));
  return Math.hypot(px - dx * h, py - dy * h, pz - dz * h) - r;
}

// Formas: 'healthy' (normal) e 'cirrhotic' (menor, lobo direito atrofiado, caudado/esquerdo relativamente
// maiores, borda inferior romba). A morfologia intermediária é interpolada vértice a vértice.
export const SHAPES = {
  healthy: { s: 1.0, rR: [0.74, 0.64, 0.62], rL: [0.74, 0.36, 0.45], cau: 1.0, edge: 0.05, round: 0.0, cut: 0.17 },
  cirrhotic: { s: 0.9, rR: [0.66, 0.58, 0.56], rL: [0.74, 0.38, 0.46], cau: 1.35, edge: 0.16, round: 0.02, cut: 0.19 },
};
const VN = (() => { const n = [0.28, -0.94, -0.2], l = Math.hypot(...n); return n.map((v) => v / l); })();

export function liverSDF(X, Y, Z, S = SHAPES.healthy) {
  const x = X / S.s, y = Y / S.s, z = Z / S.s;
  // lobo direito: domo grande (a face visceral é cortada pelo plano abaixo)
  // cisalhamento: a parte de baixo avança para a frente → face diafragmática desce até uma borda anterior fina
  const shz = z - 0.32 * (0.05 - y);
  let d = sdEll(x + 0.42, y - 0.06, shz + 0.1, S.rR[0], S.rR[1], S.rR[2]);
  // lobo esquerdo: cunha achatada que se afila para a esquerda, topo contínuo com o domo
  const tL = clamp01((x - 0.1) / 0.9), ysL = 1 - 0.38 * tL;
  const L = sdEll(x - 0.28, (y - 0.2 + 0.05 * tL) / ysL, z - 0.3 * (0.2 - y) + 0.02 * tL, S.rL[0], S.rL[1], S.rL[2] * (1 - 0.3 * tL));
  d = smin(d, L, 0.3);
  // impressão cardíaca: leve depressão no topo do lobo esquerdo
  d = smax(d, -(Math.hypot((x - 0.25) / 1.6, y - 0.95, (z - 0.05) / 1.2) - 0.5), 0.1);
  // lobo caudado (posterior, junto à veia cava)
  const C = sdEll(x + 0.06, y + 0.0, z + 0.4, 0.17 * S.cau, 0.24 * S.cau, 0.15 * S.cau);
  d = smin(d, C, 0.12);
  // face visceral: plano voltado para baixo, para trás e para a esquerda → borda inferior oblíqua e cortante
  const pl = x * VN[0] + y * VN[1] + z * VN[2] - S.cut;
  d = smax(d, pl, S.edge);
  // incisura do ligamento redondo/falciforme na borda anterior
  d = smax(d, -(Math.hypot((x - 0.08) / 0.8, y + 0.12, z - 0.45) - 0.07), 0.05);
  // porta hepatis: sulco transverso na face visceral
  d = smax(d, -sdCapsule(x, y, z, -0.3, -0.26, -0.1, 0.1, -0.15, -0.1, 0.07), 0.06);
  // leito da vesícula biliar (fossa rasa sob o lobo direito)
  d = smax(d, -sdEll(x + 0.22, y + 0.4, z - 0.2, 0.08, 0.06, 0.26), 0.05);
  return d * S.s - S.round;
}

// Surface nets: vértice médio dos cruzamentos por célula, quads por aresta com troca de sinal.
export function surfaceNets(f, [x0, y0, z0], [x1, y1, z1], h) {
  const nx = Math.ceil((x1 - x0) / h) + 1, ny = Math.ceil((y1 - y0) / h) + 1, nz = Math.ceil((z1 - z0) / h) + 1;
  const F = new Float32Array(nx * ny * nz), I = (i, j, k) => (k * ny + j) * nx + i;
  // banda estreita: grade grossa (passo 4h) decide onde vale avaliar o campo fino; longe da superfície, interpola
  const C = 4, mx = Math.ceil((nx - 1) / C) + 1, my = Math.ceil((ny - 1) / C) + 1, mz = Math.ceil((nz - 1) / C) + 1;
  const Fc = new Float32Array(mx * my * mz), Ic = (i, j, k) => (k * my + j) * mx + i;
  for (let k = 0; k < mz; k++) for (let j = 0; j < my; j++) for (let i = 0; i < mx; i++) Fc[Ic(i, j, k)] = f(x0 + i * C * h, y0 + j * C * h, z0 + k * C * h);
  const band = C * h * 1.9;
  for (let K = 0; K < mz - 1; K++) for (let J = 0; J < my - 1; J++) for (let II = 0; II < mx - 1; II++) {
    let near = false; const c8 = [];
    for (let c = 0; c < 8; c++) { const w = Fc[Ic(II + (c & 1), J + ((c >> 1) & 1), K + (c >> 2))]; c8.push(w); if (Math.abs(w) < band) near = true; }
    if (!near && !(c8.some((w) => w < 0) && c8.some((w) => w >= 0))) {
      for (let k = K * C; k <= Math.min(nz - 1, K * C + C); k++) for (let j = J * C; j <= Math.min(ny - 1, J * C + C); j++) for (let i = II * C; i <= Math.min(nx - 1, II * C + C); i++) {
        const u = (i - II * C) / C, v = (j - J * C) / C, w = (k - K * C) / C;
        const l = (a, b, t) => a + (b - a) * t;
        F[I(i, j, k)] = l(l(l(c8[0], c8[1], u), l(c8[2], c8[3], u), v), l(l(c8[4], c8[5], u), l(c8[6], c8[7], u), v), w);
      }
      continue;
    }
    for (let k = K * C; k <= Math.min(nz - 1, K * C + C); k++) for (let j = J * C; j <= Math.min(ny - 1, J * C + C); j++) for (let i = II * C; i <= Math.min(nx - 1, II * C + C); i++) F[I(i, j, k)] = f(x0 + i * h, y0 + j * h, z0 + k * h);
  }
  const cid = new Int32Array(nx * ny * nz).fill(-1), pos = [];
  const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const cx = [0, 1, 0, 1, 0, 1, 0, 1], cy = [0, 0, 1, 1, 0, 0, 1, 1], cz = [0, 0, 0, 0, 1, 1, 1, 1], v = new Float32Array(8);
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    let neg = 0;
    for (let c = 0; c < 8; c++) { v[c] = F[I(i + cx[c], j + cy[c], k + cz[c])]; if (v[c] < 0) neg++; }
    if (neg === 0 || neg === 8) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of E) {
      if ((v[a] < 0) === (v[b] < 0)) continue;
      const u = v[a] / (v[a] - v[b]);
      sx += cx[a] + (cx[b] - cx[a]) * u; sy += cy[a] + (cy[b] - cy[a]) * u; sz += cz[a] + (cz[b] - cz[a]) * u; n++;
    }
    cid[I(i, j, k)] = pos.length / 3;
    pos.push(x0 + (i + sx / n) * h, y0 + (j + sy / n) * h, z0 + (k + sz / n) * h);
  }
  const idx = [];
  const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; flip ? idx.push(a, c, b, a, d, c) : idx.push(a, b, c, a, c, d); };
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const f0 = F[I(i, j, k)] < 0;
    if (i < nx - 1 && f0 !== (F[I(i + 1, j, k)] < 0)) quad(cid[I(i, j - 1, k - 1)], cid[I(i, j, k - 1)], cid[I(i, j, k)], cid[I(i, j - 1, k)], !f0);
    if (j < ny - 1 && f0 !== (F[I(i, j + 1, k)] < 0)) quad(cid[I(i - 1, j, k - 1)], cid[I(i - 1, j, k)], cid[I(i, j, k)], cid[I(i, j, k - 1)], !f0);
    if (k < nz - 1 && f0 !== (F[I(i, j, k + 1)] < 0)) quad(cid[I(i - 1, j - 1, k)], cid[I(i, j - 1, k)], cid[I(i, j, k)], cid[I(i - 1, j, k)], !f0);
  }
  return { position: new Float32Array(pos), index: new Uint32Array(idx) };
}

// Leva cada vértice até a isosuperfície de f (passos de Newton com gradiente numérico).
export function project(pos, f, iters = 3, e = 1e-3, maxStep = 0.03) {
  const out = new Float32Array(pos);
  for (let i = 0; i < out.length; i += 3) {
    let x = out[i], y = out[i + 1], z = out[i + 2];
    for (let it = 0; it < iters; it++) {
      const d = f(x, y, z);
      const gx = (f(x + e, y, z) - f(x - e, y, z)) / (2 * e), gy = (f(x, y + e, z) - f(x, y - e, z)) / (2 * e), gz = (f(x, y, z + e) - f(x, y, z - e)) / (2 * e);
      const g2 = gx * gx + gy * gy + gz * gz || 1;
      let sx = d * gx / g2, sy = d * gy / g2, sz = d * gz / g2; const L = Math.hypot(sx, sy, sz);
      if (L > maxStep) { sx *= maxStep / L; sy *= maxStep / L; sz *= maxStep / L; }
      x -= sx; y -= sy; z -= sz;
    }
    out[i] = x; out[i + 1] = y; out[i + 2] = z;
  }
  return out;
}

// Suavização de Taubin (sem encolher), para tirar o degrau residual da grade.
export function taubin(pos, index, iters = 2) {
  const n = pos.length / 3, nb = Array.from({ length: n }, () => new Set());
  for (let t = 0; t < index.length; t += 3) { const a = index[t], b = index[t + 1], c = index[t + 2]; nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b); }
  const lists = nb.map((s) => [...s]);
  let P = new Float32Array(pos);
  const step = (lam) => {
    const Q = new Float32Array(P);
    for (let i = 0; i < n; i++) { const L = lists[i]; if (!L.length) continue; let sx = 0, sy = 0, sz = 0; for (const j of L) { sx += P[j * 3]; sy += P[j * 3 + 1]; sz += P[j * 3 + 2]; } const m = L.length; Q[i * 3] += lam * (sx / m - P[i * 3]); Q[i * 3 + 1] += lam * (sy / m - P[i * 3 + 1]); Q[i * 3 + 2] += lam * (sz / m - P[i * 3 + 2]); }
    P = Q;
  };
  for (let k = 0; k < iters; k++) { step(0.5); step(-0.53); }
  return P;
}

function smoothDelta(A, B, index, iters) {
  const n = A.length / 3, D = new Float32Array(B.length);
  for (let i = 0; i < B.length; i++) D[i] = B[i] - A[i];
  const nb = Array.from({ length: n }, () => []);
  for (let t = 0; t < index.length; t += 3) { const a = index[t], b = index[t + 1], c = index[t + 2]; nb[a].push(b, c); nb[b].push(a, c); nb[c].push(a, b); }
  for (let it = 0; it < iters; it++) {
    const E = new Float32Array(D);
    for (let i = 0; i < n; i++) { const L = nb[i]; if (!L.length) continue; for (let k = 0; k < 3; k++) { let s = 0; for (const j of L) s += D[j * 3 + k]; E[i * 3 + k] = 0.5 * D[i * 3 + k] + 0.5 * s / L.length; } }
    D.set(E);
  }
  const out = new Float32Array(B.length); for (let i = 0; i < B.length; i++) out[i] = A[i] + D[i]; return out;
}

// ---------- ruído celular (Worley 3D) e hash ----------
export const hash3 = (i, j, k) => { const x = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return x - Math.floor(x); };
export function worley(x, y, z, cell, seed = 0) {
  const gx = x / cell, gy = y / cell, gz = z / cell, ix = Math.floor(gx), iy = Math.floor(gy), iz = Math.floor(gz);
  let f1 = 9, f2 = 9, id = 0;
  for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const a = ix + i, b = iy + j, c = iz + k;
    const px = a + hash3(a, b, c + seed), py = b + hash3(a + 17, b + seed, c), pz = c + hash3(a + seed, b + 31, c);
    // peso por célula: nódulos de tamanhos variados (diagrama de potência simples)
    const d = Math.hypot(px - gx, py - gy, pz - gz) - 0.22 * hash3(a + 5, b + 9, c + 13 + seed);
    if (d < f1) { f2 = f1; f1 = d; id = hash3(a + 3, b + 7, c + 11 + seed); } else if (d < f2) f2 = d;
  }
  return { f1, f2, id };
}

// Malha base completa do fígado: posições saudável/cirrótica em correspondência, normais de referência e campos por vértice.
export function buildLiverMesh({ h = 0.016, cell = 0.105 } = {}) {
  const fA = (x, y, z) => liverSDF(x, y, z, SHAPES.healthy), fB = (x, y, z) => liverSDF(x, y, z, SHAPES.cirrhotic);
  const net = surfaceNets(fA, [-1.3, -0.72, -0.92], [1.2, 0.82, 0.72], h);
  let A = taubin(net.position, net.index, 2);
  A = project(A, fA, 2);
  // forma cirrótica: projeta a malha saudável na superfície cirrótica e suaviza o campo de deslocamento
  let B = project(A, fB, 7);
  B = smoothDelta(A, B, net.index, 4);
  B = project(B, fB, 2);
  const n = A.length / 3;
  const nod = new Float32Array(n), sept = new Float32Array(n), cid = new Float32Array(n), mic = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = A[i * 3], y = A[i * 3 + 1], z = A[i * 3 + 2];
    const w = worley(x, y, z, cell, 3);
    const r = w.f1 / Math.max(1e-4, w.f2);          // 0 no centro do nódulo, ~1 no septo
    nod[i] = 1 - r * r;                              // cúpula
    sept[i] = 1 - clamp01((w.f2 - w.f1) / 0.16);     // faixa de cicatriz entre nódulos
    cid[i] = w.id;
    const m = worley(x, y, z, cell * 0.45, 8);       // micronódulos (textura secundária)
    mic[i] = 1 - (m.f1 / Math.max(1e-4, m.f2)) ** 2;
  }
  return { A, B, index: net.index, nod, sept, cid, mic, count: n };
}
