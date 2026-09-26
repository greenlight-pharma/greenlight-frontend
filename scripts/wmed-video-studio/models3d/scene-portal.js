// Cena 4: hipertensão portal. Fígado cirrótico; a veia porta nasce da confluência da veia esplênica com a
// mesentérica superior. O fluxo desacelera no fígado, a pressão sobe: a porta dilata, colaterais pela veia gástrica
// esquerda enchem as varizes do esôfago distal, o baço aumenta e a ascite enche o abdome inferior. ~11 s.
// Esquemático, com posições anatômicas plausíveis (unidade ≈ 10 cm; +x = esquerda do paciente).
import * as THREE from 'three';
import { buildLiver } from './liver.js';
import { varTube, capped } from './liver-vessels.js';
import { tissueMaterial, rimMaterial, seg, ease, clamp } from './stage.js';
import { hash3 } from './liver-geom.js';

export const stageOptions = { look: 'doc', dof: { focus: 8, aperture: 0.0025, maxblur: 0.007 }, ao: true };

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const curve = (pts) => new THREE.CatmullRomCurve3(pts.map((p) => V(...p)), false, 'centripetal');
const veinMat = (c = 0x5a3f78, rim = 0xb8a8ff, opacity = 1) => { const m = tissueMaterial({ color: c, sheen: 0xd8c8ff, kind: 'wet', seed: 5, repeat: [2, 8], normal: 0.25, wet: 0.9, roughness: 0.3, rim: opacity < 1 ? 0.5 : 0.22, rimColor: rim, opacity }); if (opacity < 1) m.depthWrite = false; return m; };

export default async function (stage, q) {
  stage.renderer.localClippingEnabled = true;
  const dur = 11, cam = stage.camera;
  const L = buildLiver(stage, { vessels: false });
  L.update({ fibrosis: 1, nodules: 0.95, shrink: 1 });
  const root = new THREE.Group(); stage.scene.add(root);

  // ---- sistema porta ----
  const Q = [0.32, -0.95, -0.2];                                   // confluência esplenomesentérica (atrás do colo do pâncreas)
  const portalC = curve([Q, [0.2, -0.72, -0.16], [0.04, -0.46, -0.11], [-0.08, -0.31, -0.1], [-0.26, -0.24, -0.1]]);
  const smvC = curve([[0.2, -2.55, 0.1], [0.3, -2.0, 0.06], [0.38, -1.45, -0.06], Q]);
  const splC = curve([[1.5, -0.5, -0.56], [1.34, -0.6, -0.5], [1.1, -0.78, -0.46], [0.72, -0.92, -0.36], Q]);
  const J = [1.02, -0.22, -0.32];                                  // junção esofagogástrica
  const lgvC = curve([[0.42, -0.9, -0.24], [0.62, -0.72, -0.34], [0.88, -0.42, -0.36], J]);
  const esoC = curve([[1.0, 1.45, -0.42], [1.0, 0.7, -0.38], [1.02, 0.15, -0.34], J, [1.06, -0.34, -0.3]]);
  const P = { portal: varTube(portalC, { seg: 48, rad: 16 }), smv: varTube(smvC, { seg: 64, rad: 14 }), spl: varTube(splC, { seg: 64, rad: 14 }), lgv: varTube(lgvC, { seg: 48, rad: 10 }) };
  // parede translúcida: deixa ver o fluxo por dentro
  const pvMat = veinMat(0x6a4a90, 0xc8b8ff, 0.5);
  for (const k in P) { const m = new THREE.Mesh(P[k].geo, pvMat); m.renderOrder = 2; root.add(m); }
  // tributárias jejunais/ileais da mesentérica (curtas)
  const tribs = [];
  for (let i = 0; i < 5; i++) {
    const s = 0.12 + i * 0.16, p0 = smvC.getPointAt(s), side = i % 2 ? 1 : -1;
    const c = curve([[p0.x + side * 0.45, p0.y - 0.28, p0.z + 0.1], [p0.x + side * 0.22, p0.y - 0.1, p0.z + 0.06], p0.toArray()]);
    const tb = varTube(c, { seg: 20, rad: 8, r: capped(() => 0.016, 0.1, 0.01) }); root.add(new THREE.Mesh(tb.geo, pvMat)); tribs.push(tb);
  }
  // esôfago (tubo muscular rosado) e estômago proximal translúcido
  const eso = varTube(esoC, { seg: 60, rad: 20, r: capped((s) => 0.07 + 0.03 * seg(s, 0.8, 1), 0.001, 0.05) });
  root.add(new THREE.Mesh(eso.geo, tissueMaterial({ color: 0xc9807a, sheen: 0xffc8c0, kind: 'fibers', seed: 9, cell: 22, repeat: [3, 10], normal: 0.5, wet: 0.7, roughness: 0.45, rim: 0.12 })));
  // varizes: 6 veias submucosas tortuosas no esôfago distal
  const NVX = 5, varices = [];
  for (let i = 0; i < NVX; i++) {
    const pts = [];
    for (let k = 0; k <= 30; k++) {
      const s = k / 30, p = esoC.getPointAt(0.52 + 0.36 * s), th = (i / NVX) * Math.PI * 2 + 0.5 * Math.sin(s * 13 + i * 1.7) + 0.2 * Math.sin(s * 29 + i);
      const rr = 0.07 + 0.008;
      pts.push([p.x + Math.cos(th) * rr, p.y, p.z + Math.sin(th) * rr]);
    }
    const vt = varTube(curve(pts), { seg: 120, rad: 10 }); const m = new THREE.Mesh(vt.geo, veinMat(0x4a3a8a, 0xc0b0ff)); root.add(m);
    varices.push({ vt, i });
  }
  // baço (feijão com hilo côncavo voltado para dentro), ancorado no hilo
  const spGeo = new THREE.SphereGeometry(1, 48, 32), sp = spGeo.attributes.position;
  for (let i = 0; i < sp.count; i++) {
    let x = sp.getX(i), y = sp.getY(i), z = sp.getZ(i);
    const notch = Math.exp(-(y * y) / 0.08) * Math.max(0, -x) * 0.45;     // hilo (face medial)
    x = x * 0.2 + notch * 0.2; y *= 0.42; z *= 0.13 * (1 + 0.25 * Math.max(0, x));
    const w = 1 + 0.06 * Math.sin(y * 18) * (x > 0.1 ? 1 : 0);          // incisuras da borda superior
    sp.setXYZ(i, x * w, y, z);
  }
  spGeo.computeVertexNormals();
  const spleen = new THREE.Mesh(spGeo, tissueMaterial({ color: 0x5e2a3e, sheen: 0xc890b0, kind: 'cells', seed: 13, cell: 14, repeat: [4, 4], normal: 0.35, wet: 0.8, roughness: 0.35, rim: 0.15, rimColor: 0xe0b0d0 }));
  const spPiv = new THREE.Group(); spPiv.position.set(1.36, -0.6, -0.5); spPiv.rotation.set(0.25, -0.5, -0.45); root.add(spPiv);
  spleen.position.set(0.19, 0.05, 0); spPiv.add(spleen);
  // ascite: líquido citrino translúcido enchendo a cavidade abdominal inferior (plano de corte = nível)
  const lvl = new THREE.Plane(new THREE.Vector3(0, -1, 0), -3);
  const cavC = V(0.35, -2.15, 0.02), cavR = V(1.6, 0.85, 0.72);
  const fluidMat = new THREE.MeshPhysicalMaterial({ color: 0xf2ead0, roughness: 0.08, clearcoat: 0.6, transparent: true, opacity: 0.06, depthWrite: false, clippingPlanes: [lvl], side: THREE.DoubleSide, emissive: 0x1a1808 });
  const fluid = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), fluidMat); fluid.position.copy(cavC); fluid.scale.copy(cavR); fluid.renderOrder = 5; root.add(fluid);
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0xf6eccc, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.12, depthWrite: false, emissive: 0x2a2410, side: THREE.DoubleSide });
  const cap = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), capMat); cap.renderOrder = 6; root.add(cap);
  const cavMat = rimMaterial({ color: 0x6fb3ae, rimColor: 0x9fd8cf, opacity: 0.035, rimStrength: 0.35, rimPower: 3, side: THREE.BackSide });
  const cav = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), cavMat); cav.position.copy(cavC); cav.scale.copy(cavR).multiplyScalar(1.01); cav.renderOrder = 4; root.add(cav);

  // ---- partículas de fluxo ----
  const flowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const paths = [
    { c: curve([...smvC.points.map((p) => p.toArray()), ...portalC.points.slice(1).map((p) => p.toArray())]), n: 70, s: 1 },
    { c: curve([...splC.points.map((p) => p.toArray()), ...portalC.points.slice(1).map((p) => p.toArray())]), n: 55, s: 2 },
  ];
  const colPaths = varices.map((v, i) => curve([...lgvC.points.map((p) => p.toArray()), ...v.vt.curve.points.filter((_, k) => k % 3 === 0).map((p) => p.toArray())]));
  const NP = paths.reduce((a, p) => a + p.n, 0), NC = 48;
  const parts = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), flowMat, NP + NC); root.add(parts);
  parts.renderOrder = 1;
  // pressão portal (0..1) e deslocamento acumulado (integral da velocidade, calculada de 0 a t → pura)
  const press = (t) => ease(seg(t, 1.4, 5.5));
  const travel = (t) => { let d = 0; const N = Math.ceil(t * 40); for (let i = 0; i < N; i++) { const tt = (i + 0.5) * t / N; d += (0.32 * (1 - 0.78 * press(tt))) * (t / N); } return d; };
  const cCool = new THREE.Color(0.75, 0.85, 1.2), cHot = new THREE.Color(1.3, 0.45, 0.18), tmp = new THREE.Color();
  const m4 = new THREE.Matrix4(), v3 = V(0, 0, 0), qq = new THREE.Quaternion(), sc = V(0, 0, 0);

  const cam0 = { tg: V(0.12, -0.62, -0.1), az: 0.32, el: -0.12, d: 4.4 };
  const cam1 = { tg: V(0.85, -0.25, -0.3), az: 0.52, el: 0.02, d: 4.2 };
  const cam2 = { tg: V(0.5, -0.8, -0.1), az: 0.26, el: 0.08, d: 12.6 };
  const lerpCam = (a, b, u) => ({ tg: a.tg.clone().lerp(b.tg, u), az: a.az + (b.az - a.az) * u, el: a.el + (b.el - a.el) * u, d: a.d + (b.d - a.d) * u });

  return {
    dur,
    update(t) {
      const Pp = press(t), Pc = ease(seg(t, 3.4, 6.6)), Sp = ease(seg(t, 5.6, 8.8)), As = ease(seg(t, 7.2, 10.8));
      // calibres: porta e esplênica dilatam; gástrica esquerda e varizes enchem
      P.portal.update(capped(() => 0.056 * (1 + 0.35 * Pp), 0.001, 0.08));
      P.smv.update(capped(() => 0.046 * (1 + 0.2 * Pp), 0.03, 0.001));
      P.spl.update(capped((s) => (0.034 + 0.006 * s) * (1 + 0.45 * Pp), 0.03, 0.001));
      P.lgv.update(capped(() => 0.011 * (1 + 1.3 * Pc), 0.05, 0.05));
      varices.forEach(({ vt, i }) => vt.update(capped((s) => {
        const bulge = 0.35 + 0.65 * Math.sin(s * 17 + i * 2.1) ** 4 + 0.4 * Math.sin(s * 7 + i) ** 2;
        return (0.006 + 0.03 * Pc * bulge) * (0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, s * 1.3)));
      }, 0.06, 0.06)));
      // baço cresce (esplenomegalia congestiva)
      spPiv.scale.setScalar(1 + 0.5 * Sp);
      // ascite: nível sobe
      const level = -3.05 + 1.35 * As;
      lvl.constant = level;
      fluid.visible = cap.visible = As > 0.01;
      const yy = (level - cavC.y) / cavR.y, k = Math.sqrt(Math.max(0, 1 - yy * yy));
      cap.position.set(cavC.x, level, cavC.z); cap.scale.set(cavR.x * k * 0.995, 1, cavR.z * k * 0.995);
      cavMat.userData.rim.value = 0.35 * ease(seg(t, 6.5, 8.5)) + 0.2 * As; cav.visible = t > 6.5;
      // fluxo: pouca pressão = rápido e frio; congestão = lento, denso perto do fígado e avermelhado
      const D = travel(t), kb = 1 + 1.8 * Pp;
      let n = 0;
      paths.forEach((pt) => {
        for (let i = 0; i < pt.n; i++, n++) {
          const u = (hash3(i, pt.s, 3) + D * (0.9 + 0.2 * hash3(i, pt.s, 4))) % 1;
          const s = 1 - Math.pow(1 - u, kb);
          pt.c.getPointAt(Math.min(0.999, s), v3);
          const j = 0.018 * (1 + 0.3 * Pp);
          v3.x += j * (hash3(i, pt.s, 5) - 0.5); v3.y += j * (hash3(i, pt.s, 6) - 0.5); v3.z += j * (hash3(i, pt.s, 7) - 0.5);
          const fade = 1 - seg(s, 0.93, 1);
          m4.compose(v3, qq, sc.setScalar(0.014 * fade)); parts.setMatrixAt(n, m4);
          parts.setColorAt(n, tmp.copy(cCool).lerp(cHot, clamp(Pp * 1.3 * (0.45 + 0.55 * s))));
        }
      });
      // colaterais: parte do sangue desvia pela gástrica esquerda até as varizes
      for (let i = 0; i < NC; i++, n++) {
        const u = (hash3(i, 9, 3) + D * 1.6) % 1, c = colPaths[i % colPaths.length];
        c.getPointAt(Math.min(0.999, u), v3);
        const on = clamp(Pc * 2 - hash3(i, 9, 4)) * (1 - seg(u, 0.9, 1));
        m4.compose(v3, qq, sc.setScalar(0.009 * on)); parts.setMatrixAt(n, m4);
        parts.setColorAt(n, cHot);
      }
      parts.instanceMatrix.needsUpdate = true; parts.instanceColor.needsUpdate = true;
      // câmera: porta → esôfago → plano aberto
      const c = t < 5 ? lerpCam(cam0, cam1, ease(seg(t, 2.6, 5.2))) : lerpCam(cam1, cam2, ease(seg(t, 5.4, 10.4)));
      cam.fov = 28; cam.near = 0.05; cam.far = 200; cam.updateProjectionMatrix();
      cam.position.set(c.tg.x + Math.sin(c.az) * Math.cos(c.el) * c.d, c.tg.y + Math.sin(c.el) * c.d, c.tg.z + Math.cos(c.az) * Math.cos(c.el) * c.d);
      cam.lookAt(c.tg);
      stage.setFocus(c.d, 0.0025 * 8 / c.d);
    },
  };
}
