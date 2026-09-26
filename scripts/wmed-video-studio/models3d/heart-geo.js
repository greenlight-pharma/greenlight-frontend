// Utilitários de geometria dos modelos do coração (M3/M4): tubo com raio variável e tampas,
// casca de cilindro em corte ("fatia de bolo") com cores por vértice, e hash determinístico.
import * as THREE from 'three';

export const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const gauss = (x, w) => Math.exp(-(x * x) / (w * w));
// diferença angular em (-π, π]
export const dAng = (a, b) => { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI; return d; };

// Tubo ao longo de uma curva com raio r(u, ang) (u = 0..1 ao longo da curva). caps: tampas nas pontas
// (grupo de material 1, para mostrar a luz escura de um vaso seccionado). UV: u = ângulo, v = comprimento.
export function taperTube(curve, rFn, { seg = 64, rad = 16, caps = [false, false], vRepeat = 1 } = {}) {
  const frames = curve.computeFrenetFrames(seg, false);
  const pos = [], nor = [], uv = [], idx = [];
  const P = new THREE.Vector3(), N = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const u = i / seg; curve.getPointAt(u, P);
    for (let j = 0; j <= rad; j++) {
      const a = (j / rad) * Math.PI * 2, r = rFn(u, a);
      N.copy(frames.normals[i]).multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a)).normalize();
      pos.push(P.x + N.x * r, P.y + N.y * r, P.z + N.z * r); nor.push(N.x, N.y, N.z); uv.push(j / rad, u * vRepeat);
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) {
    const a = i * (rad + 1) + j, b = a + rad + 1;
    idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const nWall = idx.length;
  // tampas: leque ligeiramente recuado para dentro (parece a luz do vaso)
  caps.forEach((on, k) => {
    if (!on) return;
    const u = k, i = k * seg; curve.getPointAt(u, P);
    const T = frames.tangents[i].clone().multiplyScalar(k ? -1 : 1);
    const c = pos.length / 3; pos.push(P.x + T.x * 0.02 * rFn(u, 0), P.y + T.y * 0.02 * rFn(u, 0), P.z + T.z * 0.02 * rFn(u, 0)); nor.push(-T.x, -T.y, -T.z); uv.push(0.5, 0.5);
    for (let j = 0; j <= rad; j++) {
      const a = (j / rad) * Math.PI * 2, r = rFn(u, a) * 0.92;
      N.copy(frames.normals[i]).multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a)).normalize();
      pos.push(P.x + N.x * r, P.y + N.y * r, P.z + N.z * r); nor.push(-T.x, -T.y, -T.z); uv.push(0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a));
    }
    for (let j = 0; j < rad; j++) k ? idx.push(c, c + 1 + j, c + 2 + j) : idx.push(c, c + 2 + j, c + 1 + j);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.addGroup(0, nWall, 0); if (idx.length > nWall) g.addGroup(nWall, idx.length - nWall, 1);
  return g;
}

// Casca parcial de cilindro ao longo de x (arco th0..th1), raio interno rin(th,x) e externo rout(th,x).
// Faces: externa, interna, bordas do corte e pontas. col(th, x, face) → [r,g,b] opcional (cores por vértice).
// UV: u = ângulo (×uRep), v = x (×vRep), bordas do corte usam (x, profundidade).
// xMap(u) opcional: distribui as amostras ao longo de x (mais densas perto da lesão).
export function cutShell(rin, rout, { th0, th1, x0, x1, segT = 72, segL = 48, segW = 4, col = null, uRep = 1, vRep = 1, faces = 'all', xMap = null } = {}) {
  const pos = [], idx = [], uv = [], cols = [];
  const grid = (fn, nu, nv, flip, uvfn, face) => {
    const base = pos.length / 3;
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const [th, x, r] = fn(i / nu, j / nv);
      pos.push(x, Math.cos(th) * r, Math.sin(th) * r);
      uv.push(...uvfn(i / nu, j / nv, th, x, r));
      if (col) cols.push(...col(th, x, face, r));
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const a = base + i * (nv + 1) + j, b = a + nv + 1;
      flip ? idx.push(a, a + 1, b, b, a + 1, b + 1) : idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  };
  const X = xMap || ((u) => x0 + u * (x1 - x0)), TH = (v) => th0 + v * (th1 - th0);
  const uvS = (u, v) => [v * uRep, u * vRep];
  const all = faces === 'all';
  if (all || faces.includes('out')) grid((u, v) => [TH(v), X(u), rout(TH(v), X(u))], segL, segT, false, uvS, 'out');
  if (all || faces.includes('in')) grid((u, v) => [TH(v), X(u), rin(TH(v), X(u))], segL, segT, true, uvS, 'in');
  if (all || faces.includes('cut')) for (const th of [th0, th1]) grid((u, w) => { const x = X(u), a = rin(th, x); return [th, x, a + (rout(th, x) - a) * w]; }, segL, segW, th === th1, (u, w, th_, x, r) => [u * vRep, r * uRep * 0.5], 'cut');
  if (all || faces.includes('end')) for (const [u, fl] of [[0, true], [1, false]]) grid((w, v) => { const th = TH(v), x = X(u), a = rin(th, x); return [th, x, a + (rout(th, x) - a) * w]; }, segW, segT, fl, (w, v, th, x, r) => [v * uRep, r * vRep * 0.5], 'end');
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (col) g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// Hemácia: disco bicôncavo (lathe), raio 1, espessura ~0.35.
export function rbcGeometry(seg = 16) {
  // perfil: do centro do topo até a borda e de volta pelo fundo
  const prof = [];
  const rs = [0, 0.2, 0.4, 0.58, 0.72, 0.84, 0.93, 0.98, 1];
  for (const r of rs) prof.push(new THREE.Vector2(r * 0.999 + 0.001, rbcH(r)));
  for (const r of rs.slice().reverse()) prof.push(new THREE.Vector2(r * 0.999 + 0.001, -rbcH(r)));
  const g = new THREE.LatheGeometry(prof, seg); g.computeVertexNormals();
  return g;
}
function rbcH(r) { // perfil de Evans–Fung simplificado (meia espessura)
  const s = Math.sqrt(Math.max(0, 1 - r * r));
  return Math.max(0.015, 0.5 * s * (0.207 + 2.003 * r * r - 1.123 * r ** 4) * 0.9);
}
