// Cena 5: ultrassonografia. Fígado cirrótico; o transdutor bascula e o feixe em leque varre o lobo direito
// (faixa luminosa onde o plano de imagem corta a superfície). Um nódulo acende e recebe um anel fino. ~7 s.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildLiver } from './liver.js';
import { rimMaterial, seg, ease, clamp } from './stage.js';

export const stageOptions = { look: 'doc', dof: { focus: 5, aperture: 0.004, maxblur: 0.008 }, ao: true };

const FAN_HALF = 0.5, FAN_DEPTH = 1.45;

export default async function (stage, q) {
  const dur = 7, cam = stage.camera;
  const L = buildLiver(stage, { vessels: false });
  L.root.rotation.set(0.12, -0.28, 0.0); L.root.updateMatrixWorld(true);
  const LP = { fibrosis: 1, nodules: 1, shrink: 1 };
  // nódulo-alvo: centro de nódulo bem marcado na face anterior do lobo direito
  let best = 0, bs = -1;
  for (let i = 0; i < L.M.count; i++) {
    const s = L.surf(i, 1); if (s.n.z < 0.7 || s.p.x > -0.3 || s.p.x < -0.75 || s.p.y < -0.15 || s.p.y > 0.25) continue;
    const sc = L.M.nod[i] - 0.4 * Math.hypot(s.p.x + 0.5, s.p.y - 0.05); if (sc > bs) { bs = sc; best = i; }
  }
  const nod = L.surf(best, 1), nLoc = nod.p.clone().addScaledVector(nod.n, 0.04 * 0.6);
  const N = nLoc.clone().applyMatrix4(L.root.matrixWorld), nW = nod.n.clone().transformDirection(L.root.matrixWorld);

  // transdutor: ápice A acima/à frente do nódulo; eixo lateral l (dobradiça do leque); a0 aponta para o nódulo
  // plano de imagem quase sagital (contém o eixo do feixe e a vertical); a báscula o faz varrer da direita para a esquerda
  const A = N.clone().add(new THREE.Vector3(-0.08, 0.3, 0.62));
  const toN = N.clone().sub(A).normalize();
  const l = new THREE.Vector3(0, 1, 0).addScaledVector(toN, -toN.y).normalize();
  const a0 = toN.clone();
  const probe = new THREE.Group(); stage.scene.add(probe);
  const pm = rimMaterial({ color: 0xdfe6e8, rimColor: 0x9fd8cf, roughness: 0.28, rimStrength: 0.35 });
  const head = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.16, 0.11, 4, 0.04), pm); head.position.y = 0.08;
  const neck = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.2, 0.09, 4, 0.035), pm); neck.position.y = 0.24;
  const handle = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.42, 0.08, 4, 0.035), pm); handle.position.y = 0.52;
  const face = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.02, 0.08, 2, 0.008), new THREE.MeshStandardMaterial({ color: 0x2a3a40, roughness: 0.6 })); face.position.y = 0.0;
  const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.72, 0), new THREE.Vector3(0.05, 1.0, 0.05), new THREE.Vector3(0.25, 1.4, 0.2)]), 20, 0.018, 8), new THREE.MeshStandardMaterial({ color: 0x3a4650, roughness: 0.5 }));
  probe.add(head, neck, handle, face, cable);

  // leque: setor com ecos (arcos, granulado) em mistura aditiva; x = lateral, -y = profundidade
  const fanGeo = new THREE.CircleGeometry(FAN_DEPTH, 64, -Math.PI / 2 - FAN_HALF, FAN_HALF * 2);
  const fanMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uA: { value: 1 } },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec2 vP; uniform float uT, uA;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      void main(){
        float r = length(vP) / ${FAN_DEPTH.toFixed(3)}, a = atan(vP.x, -vP.y) / ${FAN_HALF.toFixed(3)};
        float body = (1.0 - smoothstep(0.75, 1.0, r)) * smoothstep(0.0, 0.08, r);
        float edge = smoothstep(0.93, 1.0, abs(a)) * (1.0 - r * 0.6);
        float arcs = smoothstep(0.035, 0.0, abs(fract(r * 9.0) - 0.5) - 0.46) * 0.35;
        float speck = h(floor(vec2(r * 90.0, a * 40.0)) + floor(uT * 12.0)) * 0.5 + 0.5;
        float sweep = exp(-pow((r - fract(uT * 0.9)) * 7.0, 2.0)) * 0.6;
        float al = uA * body * (0.07 * speck + arcs * 0.12 + sweep * 0.12) + uA * edge * 0.45 * body;
        gl_FragColor = vec4(vec3(0.45, 0.95, 1.0) * al, 1.0);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
  });
  const fan = new THREE.Mesh(fanGeo, fanMat); fan.renderOrder = 10; stage.scene.add(fan);
  // segunda passada sem teste de profundidade, fraca: o feixe "entra" no órgão
  const fanMatX = fanMat.clone(); fanMatX.uniforms = { uT: fanMat.uniforms.uT, uA: { value: 0 } };
  fanMat.depthTest = true;
  const fanX = new THREE.Mesh(fanGeo, fanMatX); fanX.renderOrder = 11; stage.scene.add(fanX);

  // anel de marcação do nódulo (fino, mentolado) e pulso de "achado"
  const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 1.25, 1.1), transparent: true, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 8, 72), ringMat); stage.scene.add(ring);
  const pulseMat = ringMat.clone(); const pulse = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 6, 72), pulseMat); stage.scene.add(pulse);
  const ringQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), nW);
  ring.quaternion.copy(ringQ); pulse.quaternion.copy(ringQ);
  ring.position.copy(N).addScaledVector(nW, 0.012); pulse.position.copy(ring.position);

  const basis = new THREE.Matrix4(), aT = new THREE.Vector3(), nT = new THREE.Vector3(), qR = new THREE.Quaternion();
  return {
    dur,
    update(t) {
      // báscula do transdutor: varre de -0,55 rad até o nódulo (0) e para; pequeno tremor da mão
      const phi = -0.5 + 0.5 * ease(seg(t, 0.5, 3.7)) + 0.012 * Math.sin(t * 5.3) * seg(t, 3.9, 5);
      qR.setFromAxisAngle(l, phi); aT.copy(a0).applyQuaternion(qR);
      nT.crossVectors(aT, l).normalize();
      basis.makeBasis(l, aT.clone().negate(), nT);
      probe.quaternion.setFromRotationMatrix(basis); probe.position.copy(A);
      fan.quaternion.copy(probe.quaternion); fan.position.copy(A); fanX.quaternion.copy(probe.quaternion); fanX.position.copy(A);
      const on = ease(seg(t, 0.2, 0.9));
      fanMat.uniforms.uT.value = t; fanMat.uniforms.uA.value = on * (1 - 0.35 * seg(t, 5.2, 7)); fanMatX.uniforms.uA.value = fanMat.uniforms.uA.value * 0.3;
      // nódulo acende quando o plano passa por ele e fica marcado
      const hit = ease(seg(t, 3.3, 4.0)), glow = hit * (0.9 + 0.5 * Math.exp(-Math.max(0, t - 4) * 2.5));
      L.update({ ...LP, scan: { apex: A, dir: aT, normal: nT, half: FAN_HALF, depth: FAN_DEPTH, on: on * 0.9 }, spots: glow > 0 ? [{ p: nLoc.toArray(), r: 0.05, a: glow * 1.4, c: [1.2, 0.6, 0.18] }] : [] });
      const rk = ease(seg(t, 4.0, 4.9));
      ring.visible = rk > 0; ringMat.opacity = rk; ring.scale.setScalar(0.1 * (1 + 0.7 * (1 - rk)));
      const pk = seg(t, 4.0, 5.2); pulse.visible = pk > 0 && pk < 1; pulseMat.opacity = 0.8 * (1 - pk); pulse.scale.setScalar(0.1 * (1 + 1.8 * pk));
      // câmera: plano do órgão com o transdutor → aproxima no nódulo
      const u = ease(seg(t, 0, dur));
      const tg = new THREE.Vector3(-0.2, 0.05, 0.1).lerp(N, 0.35 + 0.65 * ease(seg(t, 2.5, 7)));
      const dist = 7.0 - 3.2 * u, az = -0.62 + 0.1 * u, el = 0.16 + 0.04 * u;
      cam.fov = 28; cam.near = 0.05; cam.far = 100; cam.updateProjectionMatrix();
      cam.position.set(tg.x + Math.sin(az) * Math.cos(el) * dist, tg.y + Math.sin(el) * dist, tg.z + Math.cos(az) * Math.cos(el) * dist);
      cam.lookAt(tg);
      stage.setFocus(cam.position.distanceTo(N));
    },
  };
}
