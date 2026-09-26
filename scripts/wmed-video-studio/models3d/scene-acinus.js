// Cena: ácino pulmonar normal respirando → enfisema (septos se rompem, bolhas, aprisionamento de ar).
// ?mode=normal → só o ácino saudável respirando em laço (8 s).
import * as THREE from 'three';
import { buildAcinus } from './acinus.js';
import { seg, ease } from './stage.js';

export const stageOptions = { look: 'doc', bloom: 0.18, dof: { focus: 9, aperture: 0.0012, maxblur: 0.006 }, ao: false };

const BREATH_T = 4;                                               // 15 incursões por minuto
const breathAt = (t) => 0.5 - 0.5 * Math.cos((t / BREATH_T) * Math.PI * 2);

export default async function (stage, q) {
  const A = buildAcinus(stage);
  const mode = q.get('mode') || 'enfisema';
  const dur = mode === 'normal' ? 8 : 12;
  const c = A.box.getCenter(new THREE.Vector3());
  A.root.position.set(-c.x, -c.y, -c.z);
  const cam = stage.camera;
  cam.fov = 30; cam.near = 0.1; cam.far = 60; cam.updateProjectionMatrix();
  return {
    dur,
    update(t) {
      let E = 0, dist, az, el;
      if (mode === 'normal') {
        az = 0.35 * Math.sin((t / dur) * Math.PI * 2); el = 0.12; dist = 9.4;   // laço: começa e termina igual
      } else {
        E = ease(seg(t, 4, 10));
        const pull = ease(seg(t, 2.5, 9));
        dist = 8.9 + 2.5 * pull;
        az = -0.25 + 0.08 * t + 0.35 * ease(seg(t, 9.5, 12));
        el = 0.18 - 0.08 * pull;
      }
      const tgtY = mode === 'normal' ? 0 : 0.35 * (1 - ease(seg(t, 2.5, 9)));
      cam.position.set(Math.sin(az) * dist * Math.cos(el), tgtY + Math.sin(el) * dist, Math.cos(az) * dist * Math.cos(el));
      cam.lookAt(0, tgtY, 0);
      cam.updateMatrixWorld();
      // secção: o plano de corte entra pela frente e para um pouco à frente do centro
      A.setCut(mode === 'normal' ? 0.15 : 1.8 - 1.65 * ease(seg(t, 0.6, 3.2)));
      A.update({ emph: E, breath: breathAt(t) }, t, cam);
      stage.setFocus(dist);
    },
  };
}
