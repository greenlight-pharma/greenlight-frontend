// Cena 1 (título): fígado saudável, liso e brilhante, girando devagar. ~8 s.
// Parâmetros de conferência na URL: fib, nod, sh, tone (0..1), az/el (graus) congelam a vista.
import * as THREE from 'three';
import { buildLiver } from './liver.js';
import { seg, ease } from './stage.js';

export const stageOptions = { look: 'doc', dof: { focus: 10, aperture: 0.0035, maxblur: 0.008 }, ao: true };

export default async function (stage, q) {
  const L = buildLiver(stage);
  const num = (k, d) => (q.has(k) ? +q.get(k) : d);
  const P = { fibrosis: num('fib', 0), nodules: num('nod', 0), shrink: num('sh', 0) };
  if (q.has('tone')) P.tone = +q.get('tone');
  L.update(P);
  const dur = 8, cam = stage.camera, target = new THREE.Vector3(0, -0.02, 0);
  cam.fov = 26; cam.near = 0.1; cam.far = 100; cam.updateProjectionMatrix();
  return {
    dur,
    update(t) {
      const u = t / dur;
      // giro lento do órgão (vista anterior → ântero-lateral direita) e leve aproximação
      const az = q.has('az') ? THREE.MathUtils.degToRad(+q.get('az')) : -0.55 + 0.75 * u;
      const el = q.has('el') ? THREE.MathUtils.degToRad(+q.get('el')) : 0.2 + 0.05 * Math.sin(u * Math.PI);
      const r = (q.has('r') ? +q.get('r') : 11.2 - 0.9 * ease(u));
      L.root.rotation.set(0, az, 0);
      cam.position.set(0, Math.sin(el) * r - 0.35, Math.cos(el) * r);
      cam.lookAt(target.x, target.y - 0.25 * (1 - ease(seg(t, 0, dur))), target.z);
      stage.setFocus(r - 0.35);
    },
  };
}
