// Close de tecido hepático: disco de lóbulos hexagonais (veia centrolobular no meio, tríades portais nos cantos,
// cordões de hepatócitos radiais com sinusoides entre eles) e a progressão da fibrose até os nódulos.
// Unidade: raio do lóbulo (centro→canto) = 1. Superfície no plano XZ, normal +Y. Tudo procedural e determinístico.
// Parâmetros (0..1) em update(p):
//   stellate  ativação das células estreladas (pequenas/claras com gotas de vitamina A → alongadas e brilhantes)
//   septaPP   septos fibrosos crescendo a partir dos espaços porta ao longo das bordas (ponte porta-porta)
//   septaPC   pontes porta-centro (septos dos cantos até a veia centrolobular), só em parte dos raios
//   nodules   regeneração: compartimentos cercados de cicatriz viram nódulos arredondados, cordões se desorganizam
//   opacity   para a transição de escala no fim da cena
import * as THREE from 'three';
import { tissueMaterial, clamp } from './stage.js';
import { hash3 } from './liver-geom.js';

const S3 = Math.sqrt(3), AP = S3 / 2;             // apótema do hexágono de raio 1
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const h2 = (x, z, s = 0) => hash3(Math.round(x * 100) * 0.013 + s, Math.round(z * 100) * 0.017, s * 3.1 + 1.7);
const C = (hex) => new THREE.Color(hex);
const COL = {
  hep: C(0xb86050), hep2: C(0xc47a5e), sin: C(0x4a1012), cv: C(0x2a0608), portal: C(0xd4a49a),
  scar: C(0xe4dccf), scar2: C(0xcfc7c0), nod: C(0xc28c4e), nod2: C(0xa66a3a), dark: C(0x0a0e12),
};

function worley2(x, z, cell, seed) {
  const gx = x / cell, gz = z / cell, ix = Math.floor(gx), iz = Math.floor(gz); let f1 = 9, f2 = 9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const a = ix + i, b = iz + j, px = a + hash3(a, b, seed), pz = b + hash3(a + 7, b + 3, seed);
    const d = Math.hypot(px - gx, pz - gz); if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
  }
  return { f1, f2 };
}
// valor suave (fbm simples) para desalinhar levemente a malha dos lóbulos
function vn(x, z, s) {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const g = (a, b) => hash3(a, b, s) * 2 - 1;
  return (g(ix, iz) * (1 - u) + g(ix + 1, iz) * u) * (1 - v) + (g(ix, iz + 1) * (1 - u) + g(ix + 1, iz + 1) * u) * v;
}

// campos estáticos de um ponto do disco, gravados em arr[off..off+NF): gerais + 6 cantos/raios/bordas do lóbulo
export const NF = 5 + 6 * 8;
export function lobuleField(X, Z, arr = new Float32Array(NF), off = 0) {
  const x = X + 0.09 * vn(X * 0.9, Z * 0.9, 3), z = Z + 0.09 * vn(X * 0.9 + 5, Z * 0.9, 4);
  // arredondamento axial do hexágono (topo plano: cantos a 0°, 60°, ...)
  const qf = (2 / 3) * x, rf = (-1 / 3) * x + (S3 / 3) * z;
  const cx_ = qf, cz_ = -qf - rf, cy_ = rf;
  let rx = Math.round(cx_), ry = Math.round(cy_), rz = Math.round(cz_);
  const dx = Math.abs(rx - cx_), dy = Math.abs(ry - cy_), dz = Math.abs(rz - cz_);
  if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz;
  const q = rx, r = ry;
  const Cx = 1.5 * q, Cz = S3 * (r + q / 2), lx = x - Cx, lz = z - Cz;
  const rc = Math.hypot(lx, lz), th = Math.atan2(lz, lx);
  // cordões radiais (placas de hepatócitos) e mosaico celular
  const cord = Math.cos(th * 17 + 0.8 * Math.sin(rc * 6 + th * 3 + q * 1.7 + r * 2.3) + 0.5 * vn(x * 4, z * 4, 13) + h2(Cx, Cz, 1) * 6.28);
  const w = worley2(x, z, 0.075, 11), cell = clamp((w.f2 - w.f1) * 9);
  const w3 = worley2(x, z, 0.16, 12), mic = clamp((w3.f2 - w3.f1) * 5.5);
  arr[off] = rc; arr[off + 1] = sstep(-0.6, 0.3, cord); arr[off + 2] = cell; arr[off + 3] = mic; arr[off + 4] = vn(X * 0.6, Z * 0.6, 9);
  for (let k = 0; k < 6; k++) {
    const ca = k * Math.PI / 3, cxk = Math.cos(ca), czk = Math.sin(ca), kx = Cx + cxk, kz = Cz + czk, o = off + 5 + k * 8;
    const along = clamp((x - kx) * -cxk + (z - kz) * -czk);
    const na = (k + 0.5) * Math.PI / 3, nx = Math.cos(na), nz = Math.sin(na);
    const ex = Math.cos(ca + Math.PI / 3) - cxk, ez = Math.sin(ca + Math.PI / 3) - czk;   // canto k → canto k+1 (comprimento 1)
    arr[o] = Math.hypot(x - kx, z - kz);                                                   // distância ao canto (espaço porta)
    arr[o + 1] = along;                                                                    // posição no raio canto→centro
    arr[o + 2] = Math.hypot(x - (kx - cxk * along), z - (kz - czk * along));               // distância ao raio
    arr[o + 3] = h2(Cx + cxk * 0.5, Cz + czk * 0.5, 5);                                    // sorteio do raio (ponte porta-centro)
    arr[o + 4] = h2(kx, kz, 6);                                                            // sorteio do canto
    arr[o + 5] = AP - (lx * nx + lz * nz);                                                 // distância à borda k
    arr[o + 6] = (x - kx) * ex + (z - kz) * ez;                                            // posição ao longo da borda
    arr[o + 7] = h2(Cx + nx * AP, Cz + nz * AP, 2);                                        // sorteio da borda (igual dos dois lados)
  }
  return arr;
}

// combinação dos campos com os parâmetros → altura e cor
function shade(f, o, p, rad, Rd, out) {
  const pp = p.septaPP || 0, pc = p.septaPC || 0, nd = p.nodules || 0;
  const wS = 0.045 + 0.035 * nd, K = 0.06;
  let ppM = 0, pcM = 0, ptM = 0, sum = 0, pt2 = 0;
  for (let k = 0; k < 6; k++) {
    const b = o + 5 + k * 8, dc = f[b], along = f[b + 1], dSp = f[b + 2], sh = f[b + 3], ch = f[b + 4], de = f[b + 5], sE = f[b + 6], eh = f[b + 7];
    const rP = 0.15 + 0.1 * pp + 0.03 * ch;
    const pm = sstep(rP + 0.03, rP - 0.03, dc); if (pm > ptM) ptM = pm;
    sum += Math.exp(-(dc - rP) / K);
    // septo porta-porta: cresce das duas pontas da borda
    const eLen = clamp(pp * 1.7 - eh * 0.7) * 0.56;
    if (eLen > 0.01 && sE > -0.1 && sE < 1.1) {
      const on = Math.max(sstep(eLen + 0.03, eLen - 0.03, sE), sstep(eLen + 0.03, eLen - 0.03, 1 - sE));
      ppM = Math.max(ppM, sstep(wS, wS * 0.3, de) * on);
      if (on > 0.5) sum += Math.exp(-de / K);
    }
    // ponte porta-centro: só parte dos raios, do canto para dentro
    const sLen = sh < 0.42 ? clamp(pc * 1.6 - sh * 1.2) : 0;
    if (sLen > 0.01 && along < sLen) { pcM = Math.max(pcM, sstep(wS, wS * 0.3, dSp)); sum += Math.exp(-dSp / K); }
  }
  const rc = f[o], cord = f[o + 1], cell = f[o + 2], mic = f[o + 3], big = f[o + 4];
  const scar = Math.max(ppM, pcM, ptM * sstep(0.1, 0.6, pp));
  // distância suave (soft-min) à cicatriz formada → cúpulas arredondadas dos nódulos
  const dS = -K * Math.log(Math.max(sum, 1e-9));
  const dd = clamp((dS - wS * 0.2) / 0.28), dome = nd * 0.2 * Math.sqrt(Math.max(0, 1 - (1 - dd) * (1 - dd))) * (0.85 + 0.3 * big);
  const org = 1 - nd;
  let hgt = org * (0.024 * cord + 0.008 * cell) + nd * 0.014 * mic;
  hgt -= 0.085 * sstep(0.15, 0.07, rc) * (1 - 0.8 * nd);
  hgt += 0.012 * ptM + 0.03 * scar * (1 - 0.3 * nd) + dome;
  const fall = sstep(Rd - 0.7, Rd + 0.35, rad);
  hgt -= 0.9 * fall * fall;
  // cor
  out.copy(COL.sin).lerp(COL.hep, 0.25 + 0.75 * cord).lerp(COL.hep2, 0.25 * cell * cord).multiplyScalar(0.85 + 0.2 * cell + 0.08 * big);
  const nc = _n.copy(COL.nod2).lerp(COL.nod, mic).multiplyScalar(0.8 + 0.25 * sstep(0, 0.3, dS));
  out.lerp(nc, nd);
  out.lerp(COL.cv, sstep(0.15, 0.1, rc) * (1 - 0.8 * nd));
  out.lerp(COL.portal, ptM * (1 - sstep(0.3, 0.9, pp)));
  out.lerp(_n.copy(COL.scar2).lerp(COL.scar, cell), scar * 0.95);
  out.lerp(COL.dark, sstep(Rd - 0.9, Rd + 0.25, rad) * 0.97);
  return hgt;
}
const _n = new THREE.Color();

export function buildLobules(stage, { parent = null, Rd = 3.3, seg = 250 } = {}) {
  const root = new THREE.Group(); (parent || stage.scene).add(root);
  const half = Rd + 0.5;
  const geo = new THREE.PlaneGeometry(half * 2, half * 2, seg, seg); geo.rotateX(-Math.PI / 2);
  const P = geo.attributes.position, n = P.count;
  const F = new Float32Array(n * NF), rads = new Float32Array(n);
  for (let i = 0; i < n; i++) { lobuleField(P.getX(i), P.getZ(i), F, i * NF); rads[i] = Math.hypot(P.getX(i), P.getZ(i)); }
  const col = new THREE.BufferAttribute(new Float32Array(n * 3), 3); geo.setAttribute('color', col);
  const mat = tissueMaterial({ color: 0xffffff, sheen: 0xffc0a8, kind: 'cells', seed: 21, cell: 20, repeat: [9, 9], normal: 0.35, wet: 0.75, roughness: 0.42, rim: 0.06 });
  mat.vertexColors = true;
  const mesh = new THREE.Mesh(geo, mat); root.add(mesh);

  // tríades portais (vênula porta, arteríola, ductulo biliar) nos cantos e anel da veia centrolobular
  const corners = new Map(), centers = new Map();
  for (let q = -4; q <= 4; q++) for (let r = -4; r <= 4; r++) {
    const Cx = 1.5 * q, Cz = S3 * (r + q / 2);
    if (Math.hypot(Cx, Cz) < Rd - 0.35) centers.set(`${q},${r}`, [Cx, Cz]);
    for (let k = 0; k < 6; k++) { const x = Cx + Math.cos(k * Math.PI / 3), z = Cz + Math.sin(k * Math.PI / 3); if (Math.hypot(x, z) < Rd - 0.3) corners.set(`${Math.round(x * 100)},${Math.round(z * 100)}`, [x, z]); }
  }
  // posição real (com o mesmo desalinhamento dos campos): procura o ponto cuja imagem deformada cai no canto/centro
  const unwarp = ([x, z]) => { let X = x, Z = z; for (let i = 0; i < 6; i++) { X = x - 0.09 * vn(X * 0.9, Z * 0.9, 3); Z = z - 0.09 * vn(X * 0.9 + 5, Z * 0.9, 4); } return [X, Z]; };
  const triads = [...corners.values()].map(unwarp), cvs = [...centers.values()].map(unwarp);
  const flatTorus = (R, r) => new THREE.TorusGeometry(R, r, 8, 28).rotateX(Math.PI / 2);
  const wetMat = (c, e = 0x000000) => new THREE.MeshPhysicalMaterial({ color: c, emissive: e, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const T = [
    { geo: flatTorus(0.062, 0.016), mat: wetMat(0x7a5a86), off: [0.0, -0.035], lum: 0.058 },
    { geo: flatTorus(0.022, 0.013), mat: wetMat(0xc03038), off: [0.075, 0.035], lum: 0.014 },
    { geo: flatTorus(0.024, 0.01), mat: wetMat(0xdcd690), off: [-0.07, 0.04], lum: 0.017 },
  ];
  const lumenMat = new THREE.MeshBasicMaterial({ color: 0x2a0c12 });
  const lumGeo = new THREE.CircleGeometry(1, 20).rotateX(-Math.PI / 2);
  const rings = T.map((t) => { const m = new THREE.InstancedMesh(t.geo, t.mat, triads.length); root.add(m); return m; });
  const lumens = new THREE.InstancedMesh(lumGeo, lumenMat, triads.length * 3); root.add(lumens);
  const cvRing = new THREE.InstancedMesh(flatTorus(0.11, 0.014), wetMat(0x9a3a3c), cvs.length); root.add(cvRing);

  // células estreladas: ~13 por lóbulo, no espaço de Disse ao longo dos cordões
  const stel = [];
  [...centers.values()].forEach(([Cx, Cz], li) => {
    for (let k = 0; k < 13; k++) {
      const a = hash3(li, k, 31) * Math.PI * 2, rr = 0.28 + 0.5 * hash3(li, k, 32);
      const x = Cx + Math.cos(a) * rr, z = Cz + Math.sin(a) * rr;
      const kk = Math.round(a / (Math.PI / 3)), ca = kk * Math.PI / 3, tx = Cx + Math.cos(ca) * 0.86, tz = Cz + Math.sin(ca) * 0.86;
      stel.push({ x, z, d: hash3(li, k, 33), ang: Math.atan2(tz - z, tx - x), tx, tz, s: 0.8 + 0.4 * hash3(li, k, 34) });
    }
  });
  const stBody = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 0.6 }), stel.length);
  const stGlow = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), stel.length);
  root.add(stBody, stGlow);

  const tmp = new THREE.Color(), m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), v3 = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const cq = new THREE.Color(0xf2dc8c), ca_ = new THREE.Color(1.15, 0.42, 0.08), ga = new THREE.Color(1.5, 0.66, 0.16);
  const fTmp = new Float32Array(NF), heightAt = (x, z, p) => shade(lobuleField(x, z, fTmp, 0), 0, p, Math.hypot(x, z), Rd, tmp);

  function update(p = {}) {
    const PA = P.array, CA = col.array;
    for (let i = 0; i < n; i++) { PA[i * 3 + 1] = shade(F, i * NF, p, rads[i], Rd, tmp); CA[i * 3] = tmp.r; CA[i * 3 + 1] = tmp.g; CA[i * 3 + 2] = tmp.b; }
    P.needsUpdate = true; col.needsUpdate = true; geo.computeVertexNormals();
    mat.clearcoat = 0.75 - 0.45 * (p.nodules || 0); mat.roughness = 0.42 + 0.15 * (p.nodules || 0);
    const pp = p.septaPP || 0, nd = p.nodules || 0, st = p.stellate || 0, op = p.opacity ?? 1;
    // tríades: acompanham a altura local; ficam engastadas na cicatriz
    triads.forEach(([x, z], i) => {
      const y = heightAt(x, z, p), rot = hash3(Math.round(x * 100), Math.round(z * 100), 41) * 6.28, c = Math.cos(rot), s = Math.sin(rot);
      T.forEach((t, j) => {
        const ox = t.off[0] * c - t.off[1] * s, oz = t.off[0] * s + t.off[1] * c;
        m4.makeTranslation(x + ox, y + 0.012, z + oz); rings[j].setMatrixAt(i, m4);
        m4.compose(v3.set(x + ox, y + 0.014, z + oz), qq.identity(), sc.set(t.lum, 1, t.lum)); lumens.setMatrixAt(i * 3 + j, m4);
      });
    });
    rings.forEach((r) => (r.instanceMatrix.needsUpdate = true)); lumens.instanceMatrix.needsUpdate = true;
    cvs.forEach(([x, z], i) => { const y = heightAt(x + 0.11, z, p); m4.compose(v3.set(x, y + 0.004, z), qq.identity(), sc.setScalar(1 - 0.5 * nd)); cvRing.setMatrixAt(i, m4); });
    cvRing.instanceMatrix.needsUpdate = true;
    // estreladas: quiescentes (pequenas, amarelo-pálidas) → ativadas (miofibroblastos alongados e brilhantes)
    // → migram para os septos e somem dentro da cicatriz
    stel.forEach((c, i) => {
      const a = clamp(st * 1.7 - c.d * 0.7), mig = clamp(pp * 1.3 - 0.2 - c.d * 0.2) * 0.75, gone = clamp(nd * 1.6 - c.d * 0.5);
      const x = c.x + (c.tx - c.x) * mig, z = c.z + (c.tz - c.z) * mig, y = heightAt(x, z, p) + 0.025;
      qq.setFromAxisAngle(up, -c.ang);
      const q0 = 0.024 * c.s * (1 - sstep(0.2, 0.7, a));
      m4.compose(v3.set(x, y - 0.006, z), qq, sc.set(q0, q0 * 0.6, q0)); stBody.setMatrixAt(i, m4);
      stBody.setColorAt(i, cq);
      const L = (0.03 + 0.085 * a) * c.s * (1 - gone) * sstep(0.05, 0.3, a), W = (0.011 + 0.004 * a) * c.s * (1 - gone) * sstep(0.05, 0.3, a);
      m4.compose(v3, qq, sc.set(L, W * 0.9, W)); stGlow.setMatrixAt(i, m4);
      stGlow.setColorAt(i, tmp.copy(ca_).lerp(ga, 0.6 + 0.4 * Math.sin(i * 1.7)));
    });
    stBody.instanceMatrix.needsUpdate = stGlow.instanceMatrix.needsUpdate = true;
    stBody.instanceColor.needsUpdate = stGlow.instanceColor.needsUpdate = true;
    // opacidade (transição de escala)
    const tr = op < 0.999;
    [mat, lumenMat, stBody.material, cvRing.material, ...T.map((t) => t.mat)].forEach((m) => { m.transparent = tr; m.opacity = op; m.depthWrite = !tr; });
    stGlow.material.transparent = tr; stGlow.material.opacity = op;
    root.visible = op > 0.005;
  }
  update({});
  return { root, update, heightAt, mesh };
}
