// Cena 3: da lesão ao nódulo. Close de lóbulos hepáticos → ativação das células estreladas → septos porta-porta
// → pontes porta-centro → nódulos de regeneração cercados de cicatriz → afastamento até o fígado inteiro nodular. ~12 s.
import * as THREE from 'three';
import { buildLobules } from './liver-lobule.js';
import { buildLiver } from './liver.js';
import { seg, ease, clamp } from './stage.js';

export const stageOptions = { look: 'doc', dof: { focus: 6, aperture: 0.012, maxblur: 0.01 }, ao: true };

export default async function (stage, q) {
  const dur = 12, cam = stage.camera;
  const Lb = buildLobules(stage);
  // fígado inteiro em escala K, encostado no disco: o ponto de ancoragem (centro de um nódulo na face anterior do
  // lobo direito) fica na origem com a normal para +Y; "cima" do fígado aponta para -Z (topo da tela no close)
  const K = 12, G = new THREE.Group(); stage.scene.add(G);
  const L = buildLiver(stage, { parent: G, vessels: false });
  const LP = { fibrosis: 1, nodules: 1, shrink: 1 };
  L.update(LP);
  let best = 0, bs = -1;
  for (let i = 0; i < L.M.count; i++) {
    const s = L.surf(i, 1); if (s.n.z < 0.75 || s.p.x > -0.15 || s.p.x < -0.6 || s.p.y < -0.05 || s.p.y > 0.35) continue;
    const sc = L.M.nod[i] - Math.abs(s.p.x + 0.4) * 0.3; if (sc > bs) { bs = sc; best = i; }
  }
  const an = L.surf(best, 1), nP = an.n.clone();
  const pA = an.p.clone().addScaledVector(nP, 0.04 * (L.M.nod[best] - 0.4));
  const u = new THREE.Vector3(0, 1, 0).addScaledVector(nP, -nP.y).normalize(), w = new THREE.Vector3().crossVectors(nP, u);
  const Ml = new THREE.Matrix4().makeBasis(w, nP, u), Mw = new THREE.Matrix4().makeBasis(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1));
  const R = new THREE.Matrix4().multiplyMatrices(Mw, Ml.clone().transpose());
  G.quaternion.setFromRotationMatrix(R); G.scale.setScalar(K);
  G.position.copy(pA.clone().applyQuaternion(G.quaternion).multiplyScalar(-K)).add(new THREE.Vector3(0, -0.06, 0));
  const liverMats = []; G.traverse((o) => o.material && liverMats.push(o.material));
  const centerW = G.position.clone().add(new THREE.Vector3(-0.05, 0.02, 0).applyQuaternion(G.quaternion).multiplyScalar(K));
  const d1 = new THREE.Vector3(-0.1, 0.12, 1).normalize().applyQuaternion(G.quaternion), up1 = new THREE.Vector3(0, 1, 0).applyQuaternion(G.quaternion);

  const dirFrom = (az, el) => new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  const tq = new THREE.Quaternion(), q0 = new THREE.Quaternion(), q1 = new THREE.Quaternion(), mm = new THREE.Matrix4();
  return {
    dur,
    update(t) {
      const p = {
        stellate: ease(seg(t, 1.3, 4.3)),
        septaPP: ease(seg(t, 3.2, 6.8)),
        septaPC: ease(seg(t, 5.4, 8.2)),
        nodules: ease(seg(t, 7.0, 9.6)),
      };
      const back = ease(seg(t, 9.4, 12));
      p.opacity = 1 - ease(seg(t, 9.9, 10.9));
      Lb.update(p);
      // fígado: aparece durante o afastamento
      const lo = ease(seg(t, 9.5, 10.6));
      G.visible = lo > 0.005;
      liverMats.forEach((m) => { m.transparent = lo < 0.999; m.opacity = lo; m.depthWrite = lo >= 0.999; });
      // câmera: órbita lenta e oblíqua sobre o disco; no fim, recua em escala exponencial até ver o órgão
      const az = -0.25 + 0.35 * ease(seg(t, 0, 9.6)), el = 0.98 - 0.12 * ease(seg(t, 0, 9.6));
      const dMicro = 8.6 - 1.6 * ease(seg(t, 0, 9.4));
      const dist = dMicro * Math.pow(96 / dMicro, back);
      const d0 = dirFrom(az, el);
      const up0 = new THREE.Vector3(0, 1, 0).addScaledVector(d0, -d0.y).normalize();
      // interpola a orientação da câmera (direção + "cima") por quaternion
      mm.lookAt(d0, new THREE.Vector3(), up0); q0.setFromRotationMatrix(mm);
      mm.lookAt(d1, new THREE.Vector3(), up1); q1.setFromRotationMatrix(mm);
      const bo = ease(seg(t, 9.6, 12));
      tq.slerpQuaternions(q0, q1, bo);
      const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(tq);
      const target = new THREE.Vector3().lerp(centerW, ease(seg(t, 9.8, 12)));
      cam.position.copy(target).addScaledVector(dir, dist);
      cam.quaternion.copy(tq);
      cam.near = dist * 0.02; cam.far = dist * 20; cam.fov = 28; cam.updateProjectionMatrix();
      stage.setFocus(dist, 0.009 * 8 / dist);
    },
  };
}
