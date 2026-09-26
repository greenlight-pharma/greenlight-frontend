// Cena M4b: angioplastia com stent na mesma coronária em corte. Fio-guia cruza o trombo → cateter-balão com stent
// crimpado chega à lesão → balão insufla e expande o stent → balão desinfla e sai → stent fica, luz reaberta,
// hemácias voltam a correr rápido. ~12 s.
import * as THREE from 'three';
import { buildCoronary } from './heart-vessel.js';
import { ease, seg } from './stage.js';

const Q = new URLSearchParams(globalThis.location?.search || '');
export const stageOptions = Q.get('fx') === 'lite' ? { look: 'doc' } : { look: 'doc', dof: { focus: 8, aperture: 0.004, maxblur: 0.007 }, ao: true, bloom: 0.2 };

// velocidade do sangue: quase parado no início, dispara após a reabertura
const speedAt = (t) => 0.1 + 1.25 * ease(seg(t, 6.2, 9.0));
function travelAt(t) { const n = 240, h = t / n; let d = 0; for (let i = 0; i < n; i++) d += speedAt((i + 0.5) * h) * h; return d; }

export function cathParams(t) {
  const inflate = ease(seg(t, 4.4, 6.0)), deflate = ease(seg(t, 6.6, 7.6));
  const open = ease(seg(t, 4.6, 6.2));
  return {
    plaque: 1, rupture: 1, platelets: 1, fibrin: 1, thrombus: 1,
    jam: 1 - ease(seg(t, 6.0, 8.5)),
    wire: ease(seg(t, 0.3, 2.6)),
    cath: ease(seg(t, 2.2, 4.3)),
    balloon: inflate * (1 - deflate),
    stent: inflate,                                  // o stent expande com o balão e fica
    open,
    retract: ease(seg(t, 7.8, 10.2)),
  };
}

export default async function (stage, q) {
  const C = buildCoronary(stage);
  const dur = 12;
  const cam = stage.camera;
  cam.fov = 30; cam.near = 0.05; cam.far = 40; cam.updateProjectionMatrix();
  C.root.rotation.x = -1.05; C.root.rotation.y = 0.15;
  C.root.updateMatrixWorld(true);
  const axis = new THREE.Vector3(1, 0, 0).transformDirection(C.inner.matrixWorld);
  const look = new THREE.Vector3(), off = new THREE.Vector3();
  return {
    dur,
    update(t) {
      C.update({ ...cathParams(t), travel: travelAt(t) }, t);
      // enquadramento na lesão; leve órbita e aproximação lenta, recuo no fim para ver o fluxo restabelecido
      const u = ease(t / dur), back = ease(seg(t, 8.5, 12));
      look.set(0, 0, 0).addScaledVector(axis, 0.1 - 0.5 * back);
      cam.position.copy(look).add(off.set(-0.9 + 0.5 * u, 2.5 + 0.3 * back, 6.8 - 0.4 * u + 0.8 * back));
      cam.lookAt(look);
      stage.setFocus(cam.position.distanceTo(look));
    },
  };
}
