// Demonstração M2: brônquio normal → crise de asma (eosinófilos, contração, edema, muco) → reabre com tratamento.
import * as THREE from 'three';
import { buildBronchus } from './bronchus.js';
import { seg, ease } from './stage.js';

export default async function (stage, q) {
  const B = buildBronchus(stage);
  B.root.rotation.x = 0.32; B.root.rotation.z = -0.12;
  const dur = 12;
  const mode = q.get('mode') || 'asma';
  return {
    dur,
    update(t) {
      let p;
      if (mode === 'dpoc') {
        const d = ease(seg(t, 2, 8));
        p = { neut: d, goblet: d, fibrosis: d * 0.9, mucus: d * 0.35, contract: d * 0.35, flow: 1 };
      } else {
        const on = ease(seg(t, 2.5, 6)), off = ease(seg(t, 8, 10.5));
        const a = on * (1 - off);
        p = { eos: ease(seg(t, 1.5, 4)) * (1 - off * 0.6), contract: a, edema: a * 0.8, mucus: a * 0.7, goblet: 0.3 + 0.4 * a, flow: 1 };
      }
      B.update(p, t);
      const cam = stage.camera;
      cam.position.set(0.9 + 0.25 * Math.sin(t * 0.25), 0.5, 5.4);
      cam.lookAt(0, 0, 0);
      cam.fov = 34; cam.near = 0.05; cam.far = 50; cam.updateProjectionMatrix();
    },
  };
}
