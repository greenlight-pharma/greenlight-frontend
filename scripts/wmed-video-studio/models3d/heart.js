// Modelo M3: coração inteiro, 100% procedural (sem malhas anatômicas de terceiros).
// Ventrículos = superfície de revolução deformada (s = base→ápice, φ = ângulo em torno do eixo longo), com os sulcos
// atrioventricular e interventriculares escavados; artérias coronárias e gordura epicárdica são tubos desenhados em
// coordenadas (s, φ) da própria superfície, então "grudam" nos sulcos. Átrios e aurículas = elipsoides deformados;
// aorta, tronco pulmonar e veias cavas = tubos com a luz escura na ponta seccionada.
// Referencial local: +y = base, −y = ápice, +z = face anterior (esternocostal), +x = esquerda do paciente.
// O grupo é inclinado para o ápice apontar para baixo, à esquerda do paciente (direita da tela) e para a frente.
// Batimento: beat(t) é função pura de t (sístole atrial → sístole ventricular), ~60 bpm.
import * as THREE from 'three';
import { tissueMaterial, clamp } from './stage.js';
import { taperTube, gauss, dAng, hash } from './heart-geo.js';

// perfil (raio, altura) do eixo longo, do centro da base ao ápice
const PROFILE = new THREE.SplineCurve([
  [0.0, 1.0], [0.45, 0.98], [0.8, 0.88], [1.02, 0.64], [1.12, 0.3], [1.1, -0.05], [1.0, -0.42],
  [0.83, -0.8], [0.6, -1.14], [0.36, -1.4], [0.14, -1.56], [0.0, -1.6],
].map(([r, y]) => new THREE.Vector2(r, y)));
export const S_AV = 0.16;                        // posição (s) do sulco atrioventricular (coronário)
const PHI_LAD = (s) => 0.42 - 0.12 * s;          // sulco interventricular anterior (ligeiramente à esquerda)
const PHI_PIV = (s) => -2.55 + 0.1 * s;          // sulco interventricular posterior (face diafragmática)

const _p = new THREE.Vector2();
// ponto da superfície ventricular em (s, φ); out = Vector3
export function ventPoint(s, phi, out = new THREE.Vector3()) {
  PROFILE.getPointAt(clamp(s, 0, 1), _p);
  let r = _p.x; const y = _p.y;
  // ventrículo direito: abaulamento anterior e à direita, some antes do ápice (o ápice é do VE)
  const rvW = clamp(s / 0.2) * (1 - clamp((s - 0.55) / 0.35));
  r *= 1 + 0.2 * gauss(dAng(phi, -1.0), 1.05) * rvW;
  // face diafragmática (posterior-inferior) achatada
  r *= 1 - 0.1 * gauss(dAng(phi, Math.PI), 0.9) * clamp(s / 0.3);
  // sulcos: interventricular anterior e posterior (distância em unidades de arco), atrioventricular (em s)
  const w = 0.1;
  r -= 0.055 * (1 - 0.6 * s) * gauss(dAng(phi, PHI_LAD(s)) * r / w, 1) * clamp((s - 0.1) / 0.1);
  r -= 0.045 * (1 - 0.6 * s) * gauss(dAng(phi, PHI_PIV(s)) * r / w, 1) * clamp((s - 0.1) / 0.1);
  r -= 0.07 * gauss(s - S_AV, 0.035);
  // leve irregularidade orgânica
  r *= 1 + 0.012 * Math.sin(phi * 3 + s * 7) + 0.008 * Math.sin(phi * 7 - s * 13);
  const cx = 0.16 * s * s;                       // ápice desviado para a esquerda (formado pelo VE)
  return out.set(cx + Math.sin(phi) * r, y, Math.cos(phi) * r);
}
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3();
export function ventNormal(s, phi, out = new THREE.Vector3()) {
  const e = 0.004;
  ventPoint(s + e, phi, _a); ventPoint(s - e, phi, _b); _a.sub(_b);
  ventPoint(s, phi + e, _b); ventPoint(s, phi - e, _c); _b.sub(_c);
  return out.crossVectors(_b, _a).normalize();
}
// ponto acima da superfície (lift em unidades do mundo) — usado para assentar vasos no sulco
export function onSurface(s, phi, lift) {
  const p = ventPoint(s, phi); return p.addScaledVector(ventNormal(s, phi), lift);
}

function ventGeometry(ns = 140, nf = 180) {
  const pos = [], uv = [], idx = [], P = new THREE.Vector3();
  for (let i = 0; i <= ns; i++) for (let j = 0; j <= nf; j++) {
    const s = i / ns, phi = Math.PI - (j / nf) * Math.PI * 2;   // costura na face posterior
    ventPoint(s, phi, P); pos.push(P.x, P.y, P.z); uv.push(j / nf, s);
  }
  for (let i = 0; i < ns; i++) for (let j = 0; j < nf; j++) {
    const a = i * (nf + 1) + j, b = a + nf + 1; idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  // solda a normal da costura (φ = ±π)
  const n = g.attributes.normal;
  for (let i = 0; i <= ns; i++) {
    const a = i * (nf + 1), b = a + nf;
    const x = (n.getX(a) + n.getX(b)) / 2, y = (n.getY(a) + n.getY(b)) / 2, z = (n.getZ(a) + n.getZ(b)) / 2, l = Math.hypot(x, y, z) || 1;
    n.setXYZ(a, x / l, y / l, z / l); n.setXYZ(b, x / l, y / l, z / l);
  }
  return g;
}

// elipsoide deformado (átrios/aurículas): centro, semieixos, ruído, "achatamento" para um lado
function blobGeometry(c, rad, { seed = 1, lumpy = 0.05, squash = null, seg = [48, 32] } = {}) {
  const g = new THREE.SphereGeometry(1, seg[0], seg[1]); const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 1 + lumpy * (Math.sin(v.x * 5 + seed) * Math.sin(v.y * 4 + seed * 2) + 0.5 * Math.sin(v.z * 9 + v.x * 3 + seed));
    v.multiplyScalar(n);
    if (squash) { const d = v.dot(squash.dir); if (d > 0) v.addScaledVector(squash.dir, -d * squash.k); }
    v.multiply(rad).add(c); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
}
// aurícula: lobo achatado com bordas crenadas
function auricleGeometry(c, rad, dir, seed) {
  const g = new THREE.SphereGeometry(1, 40, 24); const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const a = Math.atan2(v.z, v.x);
    const crena = 1 + 0.12 * Math.sin(a * 6 + seed) * (1 - Math.abs(v.y));
    v.x *= crena; v.z *= crena; v.multiply(rad).add(c); p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals(); return g;
}

// batimento: fase no ciclo (0..1). Retorna {atr, sys} em 0..1
export function beat(t, bpm = 60) {
  const ph = ((t * bpm) / 60) % 1;
  const bump = (x, a, b) => { const u = clamp((x - a) / (b - a)); return Math.sin(u * Math.PI) ** 2; };
  return { atr: bump(ph, 0.0, 0.16), sys: bump(ph, 0.14, 0.52), ph };
}

export function buildHeart(stage, { coronaryColor = 0xb0282a } = {}) {
  const root = new THREE.Group(); stage.scene.add(root);
  const tilt = new THREE.Group(); root.add(tilt);
  const core = new THREE.Group(); tilt.add(core);
  // orientação: eixo longo a ~45° na tela, ápice para a frente
  tilt.rotation.z = 0.78; core.rotation.x = -0.42; core.rotation.y = 0.18;
  root.updateMatrixWorld(true);
  const qInv = new THREE.Quaternion(); core.getWorldQuaternion(qInv); qInv.invert();
  const W = (x, y, z) => new THREE.Vector3(x, y, z).applyQuaternion(qInv);      // direção do mundo → local

  const mats = {
    myo: tissueMaterial({ color: 0x5e141c, sheen: 0xc8504a, kind: 'wet', seed: 3, cell: 20, repeat: [4, 3], normal: 0.35, wet: 0.75, roughness: 0.42, rim: 0.12, rimColor: 0xff9a8a }),
    atrium: tissueMaterial({ color: 0x55182a, sheen: 0xc0606a, kind: 'fibers', seed: 5, cell: 10, repeat: [2, 2], normal: 0.3, wet: 0.75, roughness: 0.42, rim: 0.12, rimColor: 0xff9a8a }),
    ra: tissueMaterial({ color: 0x4a1e36, sheen: 0xb0708c, kind: 'fibers', seed: 7, cell: 10, repeat: [2, 2], normal: 0.3, wet: 0.75, roughness: 0.42, rim: 0.12, rimColor: 0xd9a8ff }),
    artery: tissueMaterial({ color: coronaryColor, sheen: 0xff8f80, kind: 'wet', seed: 9, repeat: [1, 8], normal: 0.35, wet: 0.95, roughness: 0.3, rim: 0.2, rimColor: 0xffb0a0 }),
    vein: tissueMaterial({ color: 0x3e2440, sheen: 0xa07ab8, kind: 'wet', seed: 11, repeat: [1, 8], normal: 0.35, wet: 0.9, roughness: 0.32, rim: 0.12, rimColor: 0xc0a0ff }),
    fat: tissueMaterial({ color: 0xcfa75c, sheen: 0xfff0b0, kind: 'cells', seed: 13, cell: 12, repeat: [2, 10], normal: 0.9, wet: 0.6, roughness: 0.45, rim: 0.1, rimColor: 0xfff0c0 }),
    great: tissueMaterial({ color: 0xb07f76, sheen: 0xffd0c0, kind: 'fibers', seed: 15, cell: 10, repeat: [2, 3], normal: 0.25, wet: 0.7, roughness: 0.4, rim: 0.12, rimColor: 0xffd8d0 }),
    pulm: tissueMaterial({ color: 0x9a6a70, sheen: 0xffc8c0, kind: 'fibers', seed: 17, cell: 10, repeat: [2, 3], normal: 0.25, wet: 0.7, roughness: 0.4, rim: 0.12, rimColor: 0xffd8d0 }),
    lumen: new THREE.MeshStandardMaterial({ color: 0x2a0508, roughness: 0.6 }),
  };

  // ---------- ventrículos (grupo que bate; pivô no plano AV) ----------
  const PIV_Y = 0.78;
  const vent = new THREE.Group(); vent.position.y = PIV_Y; core.add(vent);
  const ventIn = new THREE.Group(); ventIn.position.y = -PIV_Y; vent.add(ventIn);
  const ventMesh = new THREE.Mesh(ventGeometry(), mats.myo); ventIn.add(ventMesh);

  // vaso sobre a superfície: lista de [s, φ] → curva; r0→r1 afunila; lift = fração do raio acima da superfície
  const vessels = [];
  const onPath = (pts, lift, head = []) => new THREE.CatmullRomCurve3([...head, ...pts.map(([s, f, l]) => onSurface(s, f, l ?? lift))], false, 'centripetal');
  const addVessel = (curve, r0, r1, mat, { seg = 90, parent = ventIn } = {}) => {
    const rf = (u) => r0 + (r1 - r0) * u;
    const m = new THREE.Mesh(taperTube(curve, (u, a) => rf(u) * (1 + 0.04 * Math.sin(u * 40 + a))), [mat, mats.lumen]); parent.add(m); vessels.push(m);
    return m;
  };
  // gordura epicárdica: cordão lobulado afundado no sulco (o vaso fica por cima), afina em direção ao ápice
  const addFat = (pts, r0, r1, seed, seg = 120) => {
    const c = onPath(pts.map(([s, f]) => [s, f, -0.35 * r0]));
    const fm = new THREE.Mesh(taperTube(c, (u, a) => {
      const lump = 1 + 0.22 * Math.sin(u * 70 + seed + 2 * Math.sin(a * 3)) * Math.sin(a * 5 + u * 23 + seed) + 0.12 * Math.sin(a * 2 + u * 9 + seed);
      return (r0 + (r1 - r0) * u) * lump;
    }, { seg, rad: 20 }), mats.fat); ventIn.add(fm);
  };
  const range = (a, b, n, fn) => Array.from({ length: n }, (_, i) => fn(a + (b - a) * (i / (n - 1))));

  // raiz da aorta (local): as coronárias saem dos seios aórticos
  const aoRoot = new THREE.Vector3(-0.12, 1.0, 0.18);
  const lmOrigin = aoRoot.clone().add(new THREE.Vector3(0.24, 0.02, -0.06));
  const rcaOrigin = aoRoot.clone().add(new THREE.Vector3(-0.08, -0.02, 0.24));

  // tronco da coronária esquerda: da raiz da aorta, passa atrás do tronco pulmonar e chega ao sulco AV à esquerda
  const lmEnd = onSurface(S_AV, 0.62, 0.035);
  // DA (descendente anterior): pelo sulco interventricular anterior até contornar o ápice
  const ladPts = range(S_AV + 0.02, 1.0, 16, (s) => [s, PHI_LAD(s) + (s > 0.9 ? -(s - 0.9) * 3 : 0), 0.025]);
  addVessel(new THREE.CatmullRomCurve3([lmOrigin, lmOrigin.clone().lerp(lmEnd, 0.5).add(new THREE.Vector3(0.05, 0.02, -0.02)), lmEnd, ...ladPts.map(([s, f, l]) => onSurface(s, f, l))], false, 'centripetal'), 0.058, 0.016, mats.artery, { seg: 140 });
  addFat(range(S_AV + 0.02, 0.8, 14, (s) => [s, PHI_LAD(s)]), 0.075, 0.02, 2);
  // diagonais: da DA para a parede anterolateral do VE
  for (const [s0, s1, f1, r, w] of [[0.32, 0.66, 1.2, 0.024, 0.3], [0.52, 0.8, 1.02, 0.017, -0.2]]) {
    addVessel(onPath(range(s0, s1, 7, (s) => { const u = (s - s0) / (s1 - s0); return [s, PHI_LAD(s0) + (f1 - PHI_LAD(s0)) * Math.sin(u * Math.PI / 2) + 0.06 * w * Math.sin(u * 7), 0.012]; }), 0.012), r, r * 0.4, mats.artery, { seg: 50 });
  }
  // circunflexa: sulco AV esquerdo até a margem posterior
  const cxPts = range(0.62, 2.35, 12, (f) => [S_AV + 0.01, f, 0.035]);
  addVessel(onPath([[S_AV + 0.005, 0.64, 0.035], ...cxPts]), 0.045, 0.022, mats.artery, { seg: 90 });
  addFat(range(0.5, 2.4, 14, (f) => [S_AV, f]), 0.085, 0.05, 5);
  // marginais obtusas
  for (const [f0, df, s1, r] of [[1.45, 0.3, 0.6, 0.022], [2.0, 0.15, 0.66, 0.019]]) {
    addVessel(onPath(range(S_AV + 0.02, s1, 7, (s) => { const u = (s - S_AV) / (s1 - S_AV); return [s, f0 + df * u + 0.05 * Math.sin(u * 6 + f0), 0.012]; })), r, r * 0.4, mats.artery, { seg: 50 });
  }
  // coronária direita: sulco AV direito, contorna a margem aguda e desce como descendente posterior
  const rcaEnt = onSurface(S_AV, -0.35, 0.04);
  const rcaPts = range(-0.4, -2.5, 16, (f) => [S_AV + 0.005, f, 0.04]);
  addVessel(new THREE.CatmullRomCurve3([rcaOrigin, rcaOrigin.clone().lerp(rcaEnt, 0.5).add(new THREE.Vector3(-0.02, 0.0, 0.05)), rcaEnt, ...rcaPts.map(([s, f, l]) => onSurface(s, f, l))], false, 'centripetal'), 0.055, 0.035, mats.artery, { seg: 120 });
  addFat(range(-0.2, -2.6, 16, (f) => [S_AV, f]), 0.09, 0.07, 7);
  addVessel(onPath(range(S_AV + 0.02, 0.8, 10, (s) => [s, PHI_PIV(s), 0.02])), 0.034, 0.014, mats.artery, { seg: 70 });  // DP
  addFat(range(S_AV + 0.02, 0.7, 10, (s) => [s, PHI_PIV(s)]), 0.07, 0.02, 9);
  addVessel(onPath(range(S_AV + 0.02, 0.62, 8, (s) => [s, -1.62 - 0.1 * s, 0.012])), 0.024, 0.01, mats.artery, { seg: 50 });              // marginal aguda
  addVessel(onPath(range(S_AV + 0.03, 0.4, 5, (s) => [s, -0.9 + 0.3 * (s - S_AV), 0.012])), 0.017, 0.008, mats.artery, { seg: 30 });      // ramo do cone / VD anterior
  // veia cardíaca magna, paralela à DA (mais escura), e veia interventricular posterior
  addVessel(onPath(range(S_AV + 0.03, 0.82, 12, (s) => [s, PHI_LAD(s) + 0.13, 0.012])), 0.03, 0.012, mats.vein, { seg: 70 });
  addVessel(onPath(range(S_AV + 0.03, 0.8, 10, (s) => [s, PHI_PIV(s) - 0.12, 0.012])), 0.028, 0.012, mats.vein, { seg: 60 });

  // ---------- átrios e aurículas (grupo com a sístole atrial) ----------
  const atria = new THREE.Group(); core.add(atria);
  const addBlob = (geo, mat) => { const m = new THREE.Mesh(geo, mat); atria.add(m); return m; };
  addBlob(blobGeometry(new THREE.Vector3(-0.72, 1.06, -0.32), new THREE.Vector3(0.58, 0.6, 0.6), { seed: 2, lumpy: 0.035 }), mats.ra);          // AD
  addBlob(auricleGeometry(new THREE.Vector3(-0.44, 1.14, 0.52), new THREE.Vector3(0.3, 0.13, 0.3), null, 1), mats.ra);                              // aurícula direita
  addBlob(blobGeometry(new THREE.Vector3(0.25, 1.18, -0.62), new THREE.Vector3(0.66, 0.42, 0.44), { seed: 4, lumpy: 0.03 }), mats.atrium);        // AE
  addBlob(auricleGeometry(new THREE.Vector3(0.66, 1.12, 0.3), new THREE.Vector3(0.24, 0.11, 0.3), null, 3), mats.atrium);                          // aurícula esquerda

  // ---------- grandes vasos (fixos) ----------
  const statics = new THREE.Group(); core.add(statics);
  const up = (k) => W(0, k, 0), back = (k) => W(0, 0, -k), right = (k) => W(k, 0, 0);
  // tronco pulmonar: sai do infundíbulo do VD (anterior), sobe para trás e à esquerda
  const ptBase = ventPoint(0.1, 0.05).multiplyScalar(0.8).add(new THREE.Vector3(0, 0.02, 0));
  const pt = new THREE.CatmullRomCurve3([ptBase, ptBase.clone().add(up(0.55)).add(right(0.08)), ptBase.clone().add(up(1.0)).add(right(0.2)).add(back(0.35)), ptBase.clone().add(up(1.25)).add(right(0.32)).add(back(0.75))]);
  statics.add(new THREE.Mesh(taperTube(pt, (u) => 0.27 * (1 + 0.12 * gauss(u, 0.2)), { seg: 40, rad: 28, caps: [false, true] }), [mats.pulm, mats.lumen]));
  // aorta: ascendente (à direita do tronco pulmonar), arco para trás e à esquerda, descendente cortada
  const a0 = aoRoot.clone();
  const ao = new THREE.CatmullRomCurve3([a0, a0.clone().add(up(0.6)).add(right(-0.12)), a0.clone().add(up(1.2)).add(right(-0.05)).add(back(0.1)), a0.clone().add(up(1.55)).add(right(0.35)).add(back(0.55)), a0.clone().add(up(1.35)).add(right(0.7)).add(back(1.0)), a0.clone().add(up(0.8)).add(right(0.78)).add(back(1.15))], false, 'centripetal');
  statics.add(new THREE.Mesh(taperTube(ao, (u) => 0.3 * (1 + 0.15 * gauss(u, 0.12)) * (1 - 0.12 * u), { seg: 90, rad: 28, caps: [false, true] }), [mats.great, mats.lumen]));
  // ramos do arco (tronco braquiocefálico, carótida e subclávia esquerdas), cortados
  for (const [u, dx, r] of [[0.45, -0.08, 0.1], [0.55, 0.05, 0.075], [0.63, 0.12, 0.08]]) {
    const p0 = ao.getPointAt(u); const c = new THREE.CatmullRomCurve3([p0.clone().add(up(-0.05)), p0.clone().add(up(0.35)).add(right(dx)), p0.clone().add(up(0.6)).add(right(dx * 1.5))]);
    statics.add(new THREE.Mesh(taperTube(c, () => r, { seg: 12, rad: 16, caps: [false, true] }), [mats.great, mats.lumen]));
  }
  // veia cava superior: desce à direita da aorta até o AD
  const svcTop = new THREE.Vector3(-0.72, 1.3, -0.1).add(up(1.35));
  const svc = new THREE.CatmullRomCurve3([svcTop, svcTop.clone().add(up(-0.8)), new THREE.Vector3(-0.68, 1.35, -0.12)]);
  statics.add(new THREE.Mesh(taperTube(svc, () => 0.19, { seg: 24, rad: 20, caps: [true, false] }), [mats.ra, mats.lumen]));
  // veias pulmonares (cotos atrás do AE)
  for (const [x, y] of [[-0.1, 1.35], [-0.08, 1.02], [0.72, 1.36], [0.74, 1.02]]) {
    const b0 = new THREE.Vector3(x, y, -0.78); const c = new THREE.CatmullRomCurve3([b0, b0.clone().add(back(0.2)).add(right(x > 0.3 ? 0.18 : -0.18)), b0.clone().add(back(0.38)).add(right(x > 0.3 ? 0.35 : -0.35))]);
    statics.add(new THREE.Mesh(taperTube(c, () => 0.085, { seg: 10, rad: 14, caps: [false, true] }), [mats.atrium, mats.lumen]));
  }

  // centraliza: o coração (sem os vasos da base) ocupa ~y −1.75..1.3 local
  core.position.set(0, 0.12, 0);

  function update(t, { bpm = 60, amp = 1 } = {}) {
    const b = beat(t, bpm);
    const sq = 0.035 * b.sys * amp;
    vent.scale.set(1 - sq, 1 - sq * 1.1, 1 - sq);
    vent.rotation.y = 0.03 * b.sys * amp;                 // torção sistólica sutil
    const ak = 0.03 * b.atr * amp;
    atria.scale.set(1 - ak, 1 - ak * 0.6, 1 - ak);
    return b;
  }
  update(0);
  return { root, tilt, core, vent, atria, statics, mats, update, ventPoint, W };
}
