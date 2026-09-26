// Cena M3 (abertura): coração inteiro batendo (~60 bpm) e girando devagar, com a árvore coronária na superfície.
import * as THREE from 'three';
import { buildHeart } from './heart.js';
import { ease, seg } from './stage.js';

export const stageOptions = { look: 'doc', dof: { focus: 13, aperture: 0.0012, maxblur: 0.006 }, ao: true, bloom: 0.15 };

export default async function (stage, q) {
  const H = buildHeart(stage);
  // depuração: ?hide=atria,statics,vent esconde partes
  for (const k of (q.get('hide') || '').split(',').filter(Boolean)) if (H[k]) H[k].visible = false;
  const dur = 8;
  const cam = stage.camera;
  cam.fov = 30; cam.near = 0.5; cam.far = 60; cam.updateProjectionMatrix();
  const target = new THREE.Vector3(0, 0.15, 0);
  return {
    dur,
    update(t) {
      H.update(t, { bpm: 60 });
      // giro lento: de −14° a +10° em torno do eixo vertical
      const u = ease(t / dur);
      H.root.rotation.y = -0.22 + 0.34 * u;
      H.root.position.set(0.22, -0.1, 0);
      // câmera: leve aproximação (dolly-in) e subida mínima
      const d = 14.6 - 0.9 * u;
      cam.position.set(0.25, 0.6 + 0.3 * u, d);
      cam.lookAt(target);
      stage.setFocus(cam.position.distanceTo(target) - 0.6);
    },
  };
}
