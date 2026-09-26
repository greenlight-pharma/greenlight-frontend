// Demonstração M2: brônquio normal → crise de asma (eosinófilos, contração, edema, muco) → reabre com tratamento.
import * as THREE from 'three';
import { buildBronchus } from './bronchus.js';
import { seg, ease } from './stage.js';

// Visual de documentário: luz quente de lado, contraluz azul, oclusão de ambiente e foco raso na face do corte.
export const stageOptions = { look: 'doc', ao: true, dof: { focus: 9, aperture: 0.0035, maxblur: 0.006 }, bloom: 0.15 };

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
      // enquadramento inteiro em 9:16; na crise a câmera se aproxima da luz do brônquio e volta ao abrir
      const push = ease(seg(t, 2.5, 6.5)) * (1 - ease(seg(t, 8.5, 11)));
      const dist = 9.4 - 4.2 * push;
      cam.position.set(2.0 + 0.5 * Math.sin(t * 0.22) - 0.9 * push, 1.6 - 0.9 * push, dist);
      cam.lookAt(0.12 * push, -0.05 + 0.25 * push, 0);
      stage.lights.key.intensity = 2.6 + 0.8 * push;   // luz mais dura no clímax
      cam.fov = 30; cam.near = 0.05; cam.far = 50; cam.updateProjectionMatrix();
      stage.setFocus(cam.position.length() - 0.6, 0.0035 + 0.004 * push);
    },
  };
}
