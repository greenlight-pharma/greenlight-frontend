// Cena M4a: dentro da coronária em corte. Fluxo normal → placa aterosclerótica → ruptura da capa fibrosa →
// plaquetas e fibrina → trombo estreita a luz → hemácias desaceleram e se acumulam. ~12 s.
import * as THREE from 'three';
import { buildCoronary } from './heart-vessel.js';
import { ease, seg } from './stage.js';

const Q = new URLSearchParams(globalThis.location?.search || '');
// ?fx=lite desliga AO e foco raso (prévia rápida)
export const stageOptions = Q.get('fx') === 'lite' ? { look: 'doc' } : { look: 'doc', dof: { focus: 4, aperture: 0.004, maxblur: 0.007 }, ao: true, bloom: 0.18 };

// velocidade do sangue ao longo do tempo e sua integral (distância) — função pura de t
export const speedAt = (t) => 0.9 * (1 - 0.88 * ease(seg(t, 8.2, 11.2)));
export function travelAt(t, speed = speedAt) { const n = 240, h = t / n; let d = 0; for (let i = 0; i < n; i++) d += speed((i + 0.5) * h) * h; return d; }

export function lesionParams(t) {
  return {
    plaque: ease(seg(t, 1.2, 4.0)),
    rupture: ease(seg(t, 4.2, 5.6)),
    platelets: ease(seg(t, 5.2, 8.0)),
    fibrin: ease(seg(t, 6.2, 9.0)),
    thrombus: ease(seg(t, 6.0, 10.0)),
    jam: ease(seg(t, 8.4, 11.5)),
  };
}

export default async function (stage, q) {
  const C = buildCoronary(stage);
  const dur = 12;
  // depuração: ?hide=rbc,thromb,... esconde partes
  for (const k of (q.get('hide') || '').split(',').filter(Boolean)) if (C.parts[k]) C.parts[k].visible = false;
  const cam = stage.camera;
  cam.fov = 30; cam.near = 0.05; cam.far = 40; cam.updateProjectionMatrix();
  C.root.rotation.x = -1.05; C.root.rotation.y = 0.15;
  const look = new THREE.Vector3(), off = new THREE.Vector3(), axis = new THREE.Vector3();
  return {
    dur,
    update(t) {
      // direção do fluxo no mundo (x interno)
      C.root.updateMatrixWorld(true); axis.set(1, 0, 0).transformDirection(C.inner.matrixWorld);
      C.update({ ...lesionParams(t), travel: travelAt(t) }, t);
      // vaso inclinado para o fundo (montante lá atrás, o sangue desce em direção à câmera); a câmera
      // desliza ao longo do vaso, de montante até a lesão, sempre olhando de cima para dentro da luz
      const u = ease(t / dur);
      const k = 1.5 - 1.6 * ease(seg(t, 0, 6.5));      // posição ao longo do eixo: chega à lesão antes da ruptura
      look.set(0, 0, 0).addScaledVector(axis, -k);
      cam.position.copy(look).add(off.set(-0.9 + 0.3 * u, 3.1 - 0.6 * u, 8.6 - 1.6 * u));
      cam.lookAt(look);
      stage.setFocus(cam.position.distanceTo(look));
    },
  };
}
