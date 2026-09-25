// Cena M1: pulmões (lobos translúcidos) com a árvore brônquica procedural por dentro.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { BRAND, rimMaterial, ease, seg } from './stage.js';

const LOBE_TINT = {
  'Lobo superior direito': 0x7cc0b9, 'Lobo médio': 0x8fcbc2, 'Lobo inferior direito': 0x6aa9a4,
  'Lobo superior esquerdo': 0x7cc0b9, 'Lobo inferior esquerdo': 0x6aa9a4,
};

export async function buildLungs(stage, base = './out/') {
  const root = new THREE.Group(); stage.scene.add(root);
  const gltf = await new GLTFLoader().loadAsync(base + 'lungs.glb');
  const lobes = {};
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    const name = o.name.replace(/_/g, ' ');
    o.geometry.computeVertexNormals();
    // duas passadas: faces de trás (profundidade) e faces da frente com borda luminosa
    const back = rimMaterial({ color: LOBE_TINT[name] || BRAND.tealLight, opacity: 0.1, rimStrength: 0.25, side: THREE.BackSide });
    const front = rimMaterial({ color: LOBE_TINT[name] || BRAND.tealLight, opacity: 0.16, rimStrength: 0.85, rimPower: 2.6 });
    const mb = new THREE.Mesh(o.geometry, back); mb.renderOrder = 1;
    const mf = new THREE.Mesh(o.geometry, front); mf.renderOrder = 3;
    const g = new THREE.Group(); g.add(mb, mf); g.name = name;
    lobes[name] = { group: g, front, back };
    root.add(g);
  });

  const data = await (await fetch(base + 'airways.json')).json();
  const nodes = data.nodes;
  const airMat = rimMaterial({ color: 0xeef4f2, rimColor: BRAND.mint, roughness: 0.32, rimStrength: 0.55, rimPower: 2.0 });
  const cyl = new THREE.CylinderGeometry(1, 1, 1, 12, 1, true); cyl.translate(0, 0.5, 0);
  const sph = new THREE.SphereGeometry(1, 12, 8);
  const tubes = new THREE.InstancedMesh(cyl, airMat, nodes.length);
  const joints = new THREE.InstancedMesh(sph, airMat, nodes.length);
  tubes.renderOrder = joints.renderOrder = 2;
  const up = new THREE.Vector3(0, 1, 0), m = new THREE.Matrix4(), q = new THREE.Quaternion(), a = new THREE.Vector3(), b = new THREE.Vector3(), s = new THREE.Vector3();
  const color = new THREE.Color();
  nodes.forEach((n, i) => {
    a.fromArray(n.a); b.fromArray(n.b);
    const dir = b.clone().sub(a); const len = dir.length(); dir.normalize();
    const r = Math.max(0.55, n.d / 2);
    q.setFromUnitVectors(up, dir);
    m.compose(a, q, s.set(r, len, r)); tubes.setMatrixAt(i, m);
    m.compose(b, new THREE.Quaternion(), s.set(r, r, r)); joints.setMatrixAt(i, m);
    // tom: mais claro nas vias de grande calibre, puxando para o verde nas finas
    color.setHex(n.gen < 2 ? 0xc9d8d6 : 0xe6efed).lerp(new THREE.Color(0x8fcfc5), Math.min(1, n.gen / 11));
    tubes.setColorAt(i, color); joints.setColorAt(i, color);
  });
  root.add(tubes, joints);
  // anéis de cartilagem em C (abertos atrás) na traqueia e nos brônquios principais
  const ringGeo = new THREE.TorusGeometry(1, 0.13, 6, 24, Math.PI * 1.62); ringGeo.rotateZ(Math.PI * 0.69); ringGeo.rotateX(Math.PI / 2);
  const ringMat = rimMaterial({ color: 0xf6faf8, rimColor: BRAND.mint, roughness: 0.3, rimStrength: 0.35 });
  const big = nodes.filter((n) => n.kind === 'trachea' || n.kind === 'main');
  const count = big.reduce((k, n) => k + Math.floor(new THREE.Vector3().fromArray(n.a).distanceTo(new THREE.Vector3().fromArray(n.b)) / 5.5), 0);
  const rings = new THREE.InstancedMesh(ringGeo, ringMat, count); let ri = 0;
  big.forEach((n) => {
    a.fromArray(n.a); b.fromArray(n.b); const dir = b.clone().sub(a); const len = dir.length(); dir.normalize();
    q.setFromUnitVectors(up, dir); const r = n.d / 2 * 1.06;
    for (let k = 0; k < Math.floor(len / 5.5); k++) { m.compose(a.clone().addScaledVector(dir, 3 + k * 5.5), q, s.set(r, r, r)); rings.setMatrixAt(ri++, m); }
  });
  rings.renderOrder = 2; root.add(rings);
  // centraliza (carina ~ y 172); o conjunto vai de y≈0 a 282
  root.position.set(0, -140, 0);
  return { root, lobes, tubes, joints, nodes };
}

// câmera orbitando: p em [0,1] = uma volta; tilt suave
export function orbit(stage, p, { radius = 900, height = 30, target = new THREE.Vector3(0, -10, 0) } = {}) {
  const ang = p * Math.PI * 2;
  stage.camera.position.set(Math.sin(ang) * radius, height, Math.cos(ang) * radius);
  stage.camera.lookAt(target);
}
