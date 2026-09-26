// Cena M5: corte do eixo curto dos ventrículos. Com a DA ocluída, a necrose avança do endocárdio para o
// epicárdio (frente de onda) no território anterior/anterosseptal. ~10 s. Parâmetro: progress 0..1
// (?progress=0.5 congela o quadro nesse ponto; sem ele, progress segue o tempo).
import * as THREE from 'three';
import { buildSlice } from './heart-slice.js';
import { ease, seg } from './stage.js';

const Q = new URLSearchParams(globalThis.location?.search || '');
export const stageOptions = Q.get('fx') === 'lite' ? { look: 'doc' } : { look: 'doc', dof: { focus: 10, aperture: 0.0015, maxblur: 0.005 }, ao: true, bloom: 0.15 };

export const progressAt = (t) => ease(seg(t, 1.2, 9.2));

export default async function (stage, q) {
  const S = buildSlice(stage);
  const dur = 10;
  const fixed = q.get('progress');
  const cam = stage.camera;
  cam.fov = 30; cam.near = 0.5; cam.far = 60; cam.updateProjectionMatrix();
  const target = new THREE.Vector3(-0.32, -0.05, 0);
  return {
    dur,
    update(t) {
      S.update(fixed != null ? +fixed : progressAt(t));
      // fatia inclinada (vemos a face de corte e a espessura), girando devagar no próprio plano
      const u = ease(t / dur);
      S.root.rotation.set(-0.42, 0.14, 0.06 * u);          // só gira no próprio plano: a luz sobre a face não muda
      cam.position.set(-0.2, 0.15, 10.2 - 0.6 * u);
      cam.lookAt(target);
      stage.setFocus(cam.position.distanceTo(target));
    },
  };
}
