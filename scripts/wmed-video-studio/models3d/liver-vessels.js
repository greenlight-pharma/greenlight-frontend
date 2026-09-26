// Tubos de raio variável (veias que dilatam, varizes tortuosas) com atualização no lugar, e partículas de fluxo.
import * as THREE from 'three';

// tubo ao longo de uma curva com raio r(s), s em [0,1]; update(rFn) reescreve as posições sem realocar
export function varTube(curve, { seg = 64, rad = 10, r = () => 0.02, closed = false } = {}) {
  const frames = curve.computeFrenetFrames(seg, closed);
  const pts = Array.from({ length: seg + 1 }, (_, i) => curve.getPointAt(i / seg));
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array((seg + 1) * (rad + 1) * 3), uv = new Float32Array((seg + 1) * (rad + 1) * 2), idx = [];
  for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) {
    const a = i * (rad + 1) + j, b = a + rad + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  for (let i = 0; i <= seg; i++) for (let j = 0; j <= rad; j++) { const k = i * (rad + 1) + j; uv[k * 2] = i / seg; uv[k * 2 + 1] = j / rad; }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  const update = (rFn = r) => {
    for (let i = 0; i <= seg; i++) {
      const s = i / seg, R = rFn(s), P = pts[i], N = frames.normals[i], B = frames.binormals[i];
      // pontas arredondadas (tampas implícitas: o raio vai a zero nas extremidades)
      for (let j = 0; j <= rad; j++) {
        const a = (j / rad) * Math.PI * 2, c = -Math.cos(a), sn = Math.sin(a), k = (i * (rad + 1) + j) * 3;
        pos[k] = P.x + R * (c * N.x + sn * B.x); pos[k + 1] = P.y + R * (c * N.y + sn * B.y); pos[k + 2] = P.z + R * (c * N.z + sn * B.z);
      }
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  };
  update();
  return { geo, update, curve };
}

// fecha as pontas: raio suaviza a zero nos últimos e% do comprimento
export const capped = (fn, e0 = 0.02, e1 = 0.02) => (s) => fn(s) * Math.sqrt(Math.min(1, s / e0, (1 - s) / e1) || 0);
