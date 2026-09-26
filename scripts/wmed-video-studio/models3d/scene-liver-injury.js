// Cena 2: três agressões chegando ao fígado, em ondas (sem texto; tipografia entra na edição). ~10 s.
//   0,5–4,2 s  álcool: gotículas âmbar sobem pela circulação portal e acendem a superfície;
//   3,4–7,0 s  vírus das hepatites: partículas icosaédricas com espículas pousam e deixam focos inflamatórios;
//   6,4–10 s   gordura: gotas amarelo-pálidas brotam no parênquima e o órgão amarela/incha (esteatose).
// Abstrato de propósito: nada de sangue, só luz e cor.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildLiver } from './liver.js';
import { seg, ease, clamp } from './stage.js';
import { hash3 } from './liver-geom.js';

export const stageOptions = { look: 'doc', dof: { focus: 6, aperture: 0.006, maxblur: 0.009 }, ao: true };

const h1 = (i, k = 0) => hash3(i * 1.37 + k * 7.1, i * 0.61 + 3.3, k * 1.9 + 11.7);

export default async function (stage, q) {
  const L = buildLiver(stage);
  L.root.rotation.set(0.05, -0.32, 0);
  L.root.updateMatrixWorld(true);
  const dur = 10, cam = stage.camera;
  cam.fov = 26; cam.near = 0.05; cam.far = 100; cam.updateProjectionMatrix();

  // âncoras na face anterior visível (coordenadas locais do fígado), escolhidas de forma determinística
  const view = new THREE.Vector3(0.1, 0.25, 1).normalize();
  const inv = L.root.quaternion.clone().invert(), vLoc = view.clone().applyQuaternion(inv);
  const cand = [];
  for (let i = 0; i < L.M.count; i += 7) {
    const s = L.surf(i);
    if (s.n.dot(vLoc) < 0.55) continue;
    if (s.p.x < -0.95 || s.p.x > 0.55 || s.p.y < -0.28 || s.p.y > 0.55) continue;
    cand.push(i);
  }
  const pick = (k, salt) => cand[Math.floor(h1(k, salt) * cand.length) % cand.length];

  // --- álcool: gotículas âmbar brilhantes ---
  const NA = 70;
  const glowMat = (c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const alc = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), glowMat(new THREE.Color(1.6, 0.8, 0.25)), NA); L.root.add(alc);
  const A = Array.from({ length: NA }, (_, k) => {
    const a = L.surf(pick(k, 1));
    const start = new THREE.Vector3(-0.1 + 0.5 * (h1(k, 2) - 0.5), -1.25 - 0.3 * h1(k, 3), 0.2 + 0.4 * h1(k, 4));
    const ctrl = a.p.clone().lerp(start, 0.5).add(new THREE.Vector3(0.5 * (h1(k, 5) - 0.5), 0.1, 0.35 + 0.2 * h1(k, 6)));
    return { a, start, ctrl, t0: 0.5 + 2.7 * h1(k, 7), tr: 0.9 + 0.5 * h1(k, 8), size: 0.009 + 0.008 * h1(k, 9) };
  });
  // --- vírus: capsídeo icosaédrico com espículas ---
  const cap = new THREE.IcosahedronGeometry(1, 1);
  const spikes = [];
  const vp = cap.attributes.position; const seen = new Set();
  for (let i = 0; i < vp.count; i++) {
    const v = new THREE.Vector3(vp.getX(i), vp.getY(i), vp.getZ(i)).normalize(), key = v.toArray().map((x) => x.toFixed(2)).join();
    if (seen.has(key)) continue; seen.add(key);
    const sp = new THREE.CylinderGeometry(0.06, 0.16, 0.42, 5).translate(0, 1.12, 0);
    sp.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v)); spikes.push(sp);
    const tip = new THREE.SphereGeometry(0.13, 6, 4).translate(0, 1.36, 0).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v)); spikes.push(tip);
  }
  const virGeo = mergeGeometries([cap, ...spikes.map((g) => g.toNonIndexed())]);
  virGeo.computeVertexNormals();
  const NV = 26;
  const vir = new THREE.InstancedMesh(virGeo, new THREE.MeshPhysicalMaterial({ color: 0xb58cff, emissive: 0x4a1f8a, emissiveIntensity: 1.2, roughness: 0.35, clearcoat: 0.6, sheen: 0.8, sheenColor: new THREE.Color(0xe6d4ff) }), NV);
  L.root.add(vir);
  const V = Array.from({ length: NV }, (_, k) => {
    const a = L.surf(pick(k, 21));
    const side = k % 2 ? 1 : -1;
    const start = a.p.clone().add(new THREE.Vector3(side * (0.9 + 0.5 * h1(k, 22)), 0.5 * (h1(k, 23) - 0.3), 0.7 + 0.5 * h1(k, 24)));
    return { a, start, t0: 3.3 + 2.4 * h1(k, 25), tr: 1.4 + 0.6 * h1(k, 26), size: 0.022 + 0.01 * h1(k, 27), rot: h1(k, 28) * 6.28 };
  });
  // --- gordura: gotas amarelo-pálidas brotando ---
  const NF = 110;
  const fat = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshPhysicalMaterial({ color: 0xf4e3a2, emissive: 0x3a2a08, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.5, sheenColor: new THREE.Color(0xfff6d0) }), NF);
  L.root.add(fat);
  const F = Array.from({ length: NF }, (_, k) => ({ a: L.surf(pick(k, 41)), t0: 6.2 + 2.8 * h1(k, 42), r: 0.012 + 0.026 * h1(k, 43) ** 1.5 }));

  const m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), v3 = new THREE.Vector3(), sc = new THREE.Vector3(), eu = new THREE.Euler();
  const bez = (a, c, b, u, out) => out.copy(a).multiplyScalar((1 - u) ** 2).addScaledVector(c, 2 * u * (1 - u)).addScaledVector(b, u * u);
  const target = new THREE.Vector3(-0.2, 0.08, 0.3);
  const AMBER = [1.1, 0.5, 0.12], VIOLET = [0.8, 0.2, 0.45];

  return {
    dur,
    update(t) {
      const spots = [];
      // álcool
      A.forEach((d, k) => {
        const u = seg(t, d.t0, d.t0 + d.tr);
        if (u <= 0 || u >= 1) { m4.makeScale(0, 0, 0); alc.setMatrixAt(k, m4); }
        else {
          const e = ease(u) * 0.85 + u * 0.15;
          bez(d.start, d.ctrl, d.a.p, e, v3);
          m4.compose(v3, qq.identity(), sc.setScalar(d.size * (1 - 0.3 * u))); alc.setMatrixAt(k, m4);
        }
        if (u >= 1) {
          const since = t - d.t0 - d.tr, a = 1.3 * Math.exp(-since * 1.4) + 0.12 * (1 - seg(t, 7, 9.5));
          if (a > 0.02) spots.push({ p: [d.a.p.x, d.a.p.y, d.a.p.z], r: 0.035 + 0.02 * Math.min(1, since), a, c: AMBER });
        }
      });
      alc.instanceMatrix.needsUpdate = true;
      // vírus: aproximação em deriva lenta com giro, pouso e foco inflamatório
      let docked = 0;
      V.forEach((d, k) => {
        const u = seg(t, d.t0, d.t0 + d.tr);
        if (u <= 0) { m4.makeScale(0, 0, 0); vir.setMatrixAt(k, m4); return; }
        const e = ease(u);
        v3.copy(d.start).lerp(d.a.p.clone().addScaledVector(d.a.n, d.size * 0.8), e);
        v3.y += 0.05 * Math.sin(t * 2 + k) * (1 - e);
        const fade = 1 - seg(t, 8.2, 9.6);
        eu.set(d.rot + t * 0.9 * (1 - e * 0.7), d.rot * 2 + t * 0.6, 0); qq.setFromEuler(eu);
        m4.compose(v3, qq, sc.setScalar(d.size * Math.min(1, u * 4) * (0.35 + 0.65 * fade))); vir.setMatrixAt(k, m4);
        if (u >= 1) {
          docked++;
          const since = t - d.t0 - d.tr, a = (0.9 * Math.exp(-since * 0.9) + 0.25) * (1 - 0.7 * seg(t, 8, 10));
          spots.push({ p: [d.a.p.x, d.a.p.y, d.a.p.z], r: 0.05 + 0.04 * Math.min(1, since * 0.7), a, c: VIOLET });
        }
      });
      vir.instanceMatrix.needsUpdate = true;
      // gordura
      F.forEach((d, k) => {
        const u = ease(seg(t, d.t0, d.t0 + 1.3));
        if (u <= 0) { m4.makeScale(0, 0, 0); fat.setMatrixAt(k, m4); return; }
        const r = d.r * u;
        v3.copy(d.a.p).addScaledVector(d.a.n, r * 0.35);
        m4.compose(v3, qq.identity(), sc.setScalar(r)); fat.setMatrixAt(k, m4);
      });
      fat.instanceMatrix.needsUpdate = true;
      L.update({
        spots,
        inflam: 0.55 * ease(seg(t, 4, 7.5)) * (1 - 0.4 * seg(t, 8, 10)),
        steatosis: 0.85 * ease(seg(t, 6.6, 9.8)),
      });
      // câmera: começa mostrando o órgão e se aproxima devagar da face anterior do lobo direito
      const u = ease(seg(t, 0, dur));
      const dist = 7.8 - 1.9 * u, az = -0.12 + 0.16 * u, el = 0.2 - 0.05 * u;
      const tg = new THREE.Vector3(0.05, -0.08, 0).lerp(target, u * 0.7);
      cam.position.set(tg.x + Math.sin(az) * Math.cos(el) * dist, tg.y + Math.sin(el) * dist, tg.z + Math.cos(az) * Math.cos(el) * dist);
      cam.lookAt(tg);
      stage.setFocus(dist - 0.25);
    },
  };
}
