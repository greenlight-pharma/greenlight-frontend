// Modelo M4: segmento de artéria coronária em corte ("fatia de bolo"), 100% procedural. Usado nas cenas
// scene-coronary (placa → ruptura → trombo) e scene-cath (fio-guia, balão, stent, reabertura).
// Camadas da luz para fora: endotélio/íntima, placa (capa fibrosa sobre núcleo lipídico), média (músculo liso),
// adventícia. Eixo do vaso = x no grupo interno; a abertura do corte fica para +y.
// Parâmetros (0..1, todos opcionais):
//   plaque (placa cresce na parede), rupture (fissura na capa fibrosa), platelets (plaquetas aderem), fibrin (redes de
//   fibrina), thrombus (trombo estreita a luz), jam (hemácias param e se acumulam antes do trombo), travel (distância
//   percorrida pelo sangue, em unidades — a cena integra a velocidade), wire (ponta do fio-guia avançando),
//   cath (cateter-balão chegando à lesão), balloon (insuflação), stent (expansão do stent), open (placa e trombo
//   comprimidos contra a parede: luz reaberta), retract (cateter e fio saindo).
// update(p, t) é função pura de (p, t).
import * as THREE from 'three';
import { tissueMaterial, clamp, ease } from './stage.js';
import { cutShell, hash, gauss, dAng, rbcGeometry } from './heart-geo.js';

export const V = {
  LEN: 8, X0: -4, X1: 4,
  CUT0: Math.PI * 0.3, CUT1: Math.PI * 1.7,                 // arco visível; o setor removido fica em volta de θ = 0 (+y)
  R_LUM: 0.5, R_IEL: 0.53, R_MED: 0.64, R_ADV: 0.8,          // luz normal, lâmina elástica interna, média, adventícia
  XP: 0.4, THP: Math.PI + 0.75,                             // centro da placa (x, ângulo): parede inferior-direita
  XF: 0.25, THF: Math.PI + 0.35,                            // fissura no "ombro" da placa, voltada para a câmera
};
// amostragem em x mais densa perto da lesão
const xMap = (u) => { const w = 2 * u - 1; return V.XP + 3.6 * (0.35 * w + 0.65 * w * w * w); };
const X_LO = xMap(0), X_HI = xMap(1);

// espessura da placa (0..~0.3) e perfis da lesão
function plaqueT(th, x, pl, open) {
  const ax = gauss((x - V.XP) / 0.95, 1) * (1 + 0.08 * Math.sin(x * 7));
  const an = 0.25 + 0.75 * gauss(dAng(th, V.THP) / 1.35, 1);
  return 0.27 * pl * ax * an * (1 - 0.78 * open);
}
// fissura: linha serrilhada ao longo de x no ombro da placa; retorna 0..1 (1 = centro da fenda)
function crack(th, x, r, rup) {
  if (rup <= 0.001) return 0;
  const L = 0.7 * (0.35 + 0.65 * rup), dx = (x - V.XF) / L;
  if (Math.abs(dx) >= 1) return 0;
  const thc = V.THF + 0.07 * Math.sin(x * 23) + 0.035 * Math.sin(x * 61 + 1) + 0.12 * dx;
  const hw = (0.025 + 0.09 * rup) * Math.sqrt(1 - dx * dx);
  const d = Math.abs(dAng(th, thc)) * r;
  return clamp(1 - d / hw);
}
// espessura do trombo (cresce a partir da fissura; com thrombus alto envolve quase toda a circunferência)
function thrombT(th, x, tr, open) {
  if (tr <= 0.001) return 0;
  const k = 1 - 0.88 * open;
  const local = 0.2 * tr * gauss((x - V.XF) / (0.35 + 0.35 * tr), 1) * gauss(dAng(th, V.THF) / (0.7 + 1.2 * tr), 1);
  const occl = 0.26 * tr * tr * gauss((x - V.XF - 0.05) / (0.3 + 0.2 * tr), 1);
  const lump = 1 + 0.18 * Math.sin(th * 7 + x * 11) * Math.sin(x * 17 - th * 3) + 0.09 * Math.sin(th * 19 + x * 23) * Math.sin(x * 29 - th * 11);
  return (local + occl) * lump * k;
}

export function buildCoronary(stage) {
  // root (inclinação livre na cena) → mid (eixo x interno vira −y do mundo: o sangue desce) → inner (abertura para a câmera, +z)
  const root = new THREE.Group(); stage.scene.add(root);
  const mid = new THREE.Group(); mid.rotation.z = -Math.PI / 2; root.add(mid);
  const inner = new THREE.Group(); inner.rotation.x = Math.PI / 2; mid.add(inner);

  const T = (o) => { const m = tissueMaterial(o); return m; };
  const mats = {
    endo: T({ color: 0xffffff, sheen: 0xffc0b8, kind: 'cells', seed: 21, cell: 22, repeat: [10, 6], normal: 0.35, wet: 0.95, roughness: 0.35, rim: 0.1, side: THREE.DoubleSide }),
    core: T({ color: 0xffffff, sheen: 0xfff0a0, kind: 'cells', seed: 23, cell: 9, repeat: [8, 8], normal: 0.9, wet: 0.7, roughness: 0.4, rim: 0.1, rimColor: 0xfff0c0, side: THREE.DoubleSide }),
    deep: T({ color: 0xd99a92, sheen: 0xffd0c8, kind: 'fibers', seed: 25, cell: 20, repeat: [6, 4], normal: 0.4, wet: 0.5, roughness: 0.5, rim: 0.08, side: THREE.DoubleSide }),
    media: T({ color: 0x8e2c34, sheen: 0xff8a80, kind: 'fibers', seed: 27, cell: 26, repeat: [6, 3], normal: 0.6, wet: 0.5, roughness: 0.45, rim: 0.1, side: THREE.DoubleSide }),
    adv: T({ color: 0xa4645c, sheen: 0xffd0c0, kind: 'cells', seed: 29, cell: 16, repeat: [6, 5], normal: 0.6, wet: 0.4, roughness: 0.55, rim: 0.1, side: THREE.DoubleSide }),
    thromb: T({ color: 0xffffff, sheen: 0xff9090, kind: 'wet', seed: 31, cell: 14, repeat: [5, 5], normal: 0.9, wet: 0.5, roughness: 0.4, rim: 0.12, side: THREE.DoubleSide }),
    rbc: T({ color: 0xb3161f, sheen: 0xff6a5a, kind: 'wet', seed: 33, repeat: [1, 1], normal: 0.2, wet: 0.8, roughness: 0.35, rim: 0.25, rimColor: 0xff9a8a, side: THREE.DoubleSide }),
    plt: T({ color: 0xcdb8e6, sheen: 0xffffff, kind: 'wet', seed: 35, repeat: [1, 1], normal: 0.2, wet: 0.6, roughness: 0.4, rim: 0.35, rimColor: 0xf0e8ff }),
    fibrin: new THREE.MeshStandardMaterial({ color: 0xf2ead8, roughness: 0.5, emissive: 0x2a2418 }),
    metal: new THREE.MeshPhysicalMaterial({ color: 0xe6eaee, metalness: 1, roughness: 0.22, clearcoat: 0.5, envMapIntensity: 3 }),
    wire: new THREE.MeshPhysicalMaterial({ color: 0xb8c0c8, metalness: 1, roughness: 0.3, envMapIntensity: 2.5 }),
    cath: new THREE.MeshPhysicalMaterial({ color: 0x9fc6e0, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 }),
    balloon: new THREE.MeshPhysicalMaterial({ color: 0x8fc0e6, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }),
    marker: new THREE.MeshPhysicalMaterial({ color: 0x404850, metalness: 1, roughness: 0.3 }),
  };
  for (const k of ['endo', 'core', 'thromb']) mats[k].vertexColors = true;
  // sem sheen aqui: no swiftshader ele dobra o custo por pixel, e o clearcoat já dá a leitura de tecido úmido
  for (const m of Object.values(mats)) if (m.sheen !== undefined) m.sheen = 0;
  mats.thromb.polygonOffset = true; mats.thromb.polygonOffsetFactor = 2; mats.thromb.polygonOffsetUnits = 4;
  addBoost(mats.metal, 0.35);

  const opt = { th0: V.CUT0, th1: V.CUT1, xMap, segT: 120, segL: 140 };
  // camadas fixas: média e adventícia (com leve ondulação orgânica)
  const media = new THREE.Mesh(cutShell(() => V.R_IEL, (th, x) => V.R_MED + 0.006 * Math.sin(th * 9 + x * 3), { ...opt, segT: 90, segL: 90 }), mats.media); inner.add(media);
  const adv = new THREE.Mesh(cutShell((th, x) => V.R_MED + 0.006 * Math.sin(th * 9 + x * 3), (th, x) => V.R_ADV + 0.03 * Math.sin(th * 5 + x * 2.3) * Math.sin(x * 1.7 + th), { ...opt, segT: 90, segL: 90 }), mats.adv); inner.add(adv);
  // camadas que mudam: capa/íntima (face da luz), núcleo lipídico, íntima profunda, trombo
  const cap = new THREE.Mesh(new THREE.BufferGeometry(), mats.endo); inner.add(cap);
  const core = new THREE.Mesh(new THREE.BufferGeometry(), mats.core); inner.add(core);
  const deep = new THREE.Mesh(new THREE.BufferGeometry(), mats.deep); inner.add(deep);
  const thromb = new THREE.Mesh(new THREE.BufferGeometry(), mats.thromb); inner.add(thromb);

  // células e fibras (instâncias)
  const NRBC = 200, NPLT = 220, NFIB = 110;
  const rbc = new THREE.InstancedMesh(rbcGeometry(14), mats.rbc, NRBC); inner.add(rbc);
  const NTRAP = 70, trapped = new THREE.InstancedMesh(rbc.geometry, mats.rbc, NTRAP); inner.add(trapped);   // hemácias presas no trombo
  const pltGeo = new THREE.IcosahedronGeometry(1, 0); pltGeo.scale(1, 0.45, 1);
  const plt = new THREE.InstancedMesh(pltGeo, mats.plt, NPLT); inner.add(plt);
  const fib = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 5, 1, true), mats.fibrin, NFIB); inner.add(fib);
  // dispositivos: fio-guia, cateter, balão, marcadores e stent
  const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1, 8, 1).rotateZ(Math.PI / 2), mats.wire); inner.add(wire);
  const wireTip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), mats.wire); inner.add(wireTip);
  const cath = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 16, 1).rotateZ(Math.PI / 2), mats.cath); inner.add(cath);
  const balloon = new THREE.Mesh(balloonGeometry(), mats.balloon); balloon.renderOrder = 5; inner.add(balloon);
  const markers = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 0.035, 16, 1).rotateZ(Math.PI / 2), mats.marker, 2); inner.add(markers);
  const NRING = 9, NCROWN = 10, NSTRUT = NRING * NCROWN * 2 + (NRING - 1) * NCROWN / 2;
  const struts = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 6, 1), mats.metal, NSTRUT); inner.add(struts);
  const joints = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), mats.metal, NRING * NCROWN * 2); inner.add(joints);

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), e = new THREE.Euler();
  const A = new THREE.Vector3(), B = new THREE.Vector3(), D = new THREE.Vector3();
  const zero = new THREE.Matrix4().makeScale(0, 0, 0);
  const P = (x, th, r, out = v) => out.set(x, Math.cos(th) * r, Math.sin(th) * r);
  const inCut = (th) => { const a = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); return a < V.CUT0 || a > V.CUT1; };
  const seg3 = (im, i, a, b, rad) => {
    D.subVectors(b, a); const L = D.length(); D.normalize(); q.setFromUnitVectors(up, D);
    m4.compose(A.addVectors(a, b).multiplyScalar(0.5), q, sc.set(rad, L, rad)); im.setMatrixAt(i, m4);
  };

  const cI = new THREE.Color(0xb46260), cCap = new THREE.Color(0xdcbc98), cHem = new THREE.Color(0x6a0d12), cLip = new THREE.Color(0xe8b43c), cLipD = new THREE.Color(0xc98a2a);
  const cPlt = new THREE.Color(0xe2d6ea), cRed = new THREE.Color(0x7c1117), cTmp = new THREE.Color(), cW = new THREE.Color();

  function update(p, t) {
    const pl = clamp(p.plaque ?? 0), rup = clamp(p.rupture ?? 0), tr = clamp(p.thrombus ?? 0), open = clamp(p.open ?? 0);
    const rLum = (th, x) => V.R_LUM - plaqueT(th, x, pl, open);
    const capTh = (th, x) => { const T0 = plaqueT(th, x, pl, open); return 0.012 + T0 * (0.3 - 0.12 * rup * gauss(dAng(th, V.THF) / 0.5, 1)); };
    const coreT = (th, x) => plaqueT(th, x, pl, open) * 0.62 * gauss((x - V.XP) / 0.8, 1);
    const cr = (th, x) => crack(th, x, rLum(th, x), rup * (1 - 0.7 * open));
    // superfície da luz: onde há fenda ela afunda até o núcleo
    const rIn = (th, x) => { const c = cr(th, x); return rLum(th, x) + c * (capTh(th, x) - 0.004); };
    const rC0 = (th, x) => rLum(th, x) + capTh(th, x);
    const rC1 = (th, x) => rC0(th, x) + coreT(th, x);
    cap.geometry.dispose();
    const wallCol = (th, x, out) => {
      const T0 = plaqueT(th, x, pl, open), c = cr(th, x);
      out.copy(cI).lerp(cCap, clamp((T0 - 0.02) / 0.12)).lerp(cHem, c * 0.95);
      // hemorragia/manchas avermelhadas na borda da fissura
      const halo = rup * gauss(dAng(th, V.THF) / 0.25, 1) * gauss((x - V.XF) / 0.5, 1) * (1 - open);
      return out.lerp(cHem, halo * 0.5);
    };
    cap.geometry = cutShell(rIn, rC0, { ...opt, col: (th, x) => { wallCol(th, x, cTmp); return [cTmp.r, cTmp.g, cTmp.b]; } });
    core.geometry.dispose();
    core.geometry = cutShell(rC0, rC1, { ...opt, segT: 110, segL: 120, col: (th, x, face, r) => { cTmp.copy(cLip).lerp(cLipD, 0.5 + 0.5 * Math.sin(th * 13 + x * 29)); return [cTmp.r, cTmp.g, cTmp.b]; } });
    deep.geometry.dispose();
    deep.geometry = cutShell(rC1, () => V.R_IEL, { ...opt, segT: 110, segL: 120 });

    // trombo: casca da superfície da luz para dentro (polygonOffset evita briga de profundidade onde é fino)
    // luz residual nunca some por completo (canal de ~0.09): máximo suave
    const TT = (th, x) => { const L = rLum(th, x), f = L - thrombT(th, x, tr, open); return L - 0.5 * (f + 0.09 + Math.sqrt((f - 0.09) ** 2 + 0.0015)); };
    thromb.visible = tr > 0.001;
    if (thromb.visible) {
      thromb.geometry.dispose();
      thromb.geometry = cutShell((th, x) => rLum(th, x) - TT(th, x), (th, x) => rLum(th, x) + 0.001, { ...opt, segT: 96, segL: 120, vRep: 4, col: (th, x) => {
        // cabeça branca (plaquetas) junto à fissura, cauda vermelha (hemácias presas na fibrina)
        const w = gauss(dAng(th, V.THF) / 0.6, 1) * gauss((x - V.XF) / 0.3, 1);
        cTmp.copy(cRed).lerp(cPlt, clamp(w * 1.2)).multiplyScalar(0.85 + 0.15 * Math.sin(th * 17 + x * 31));
        cTmp.lerp(wallCol(th, x, cW), 1 - clamp(TT(th, x) / 0.04));   // borda fina se funde com a parede
        return [cTmp.r, cTmp.g, cTmp.b];
      } });
    }

    // plaquetas: aderem primeiro na fenda, depois cobrem a superfície do trombo
    const nP = Math.round(NPLT * clamp(p.platelets ?? 0) * (1 - 0.8 * open));
    for (let i = 0; i < NPLT; i++) {
      if (i >= nP) { plt.setMatrixAt(i, zero); continue; }
      const spread = 0.15 + 0.85 * (i / NPLT);
      const th = V.THF + (hash(i * 1.3) - 0.5) * 1.6 * spread, x = V.XF + (hash(i * 2.7) - 0.5) * 0.9 * spread;
      const r = rLum(th, x) - TT(th, x) * (0.35 + 0.6 * hash(i * 3.9)) - 0.008 + 0.004 * Math.sin(t * 3 + i);
      P(x, th, r); e.set(hash(i * 5.1) * 6, hash(i * 7.3) * 6, 0); q.setFromEuler(e);
      m4.compose(v, q, sc.setScalar(0.022 + 0.01 * hash(i * 9.1))); plt.setMatrixAt(i, m4);
    }
    plt.instanceMatrix.needsUpdate = true;
    // fibrina: fios finos esticados sobre o trombo e atravessando a luz estreitada
    const nF = Math.round(NFIB * clamp(p.fibrin ?? 0) * (1 - 0.9 * open));
    for (let i = 0; i < NFIB; i++) {
      if (i >= nF) { fib.setMatrixAt(i, zero); continue; }
      const th = V.THF + (hash(i * 3.3) - 0.5) * 2.6, x = V.XF + (hash(i * 4.1) - 0.5) * 0.9;
      const th2 = th + (hash(i * 6.2) - 0.5) * 1.4, x2 = x + (hash(i * 8.8) - 0.5) * 0.35;
      const r1 = rLum(th, x) - TT(th, x) * (0.3 + 0.6 * hash(i)) - 0.005, r2 = rLum(th2, x2) - TT(th2, x2) * (0.3 + 0.6 * hash(i * 2)) - 0.005;
      P(x, th, r1, A.clone()); const a = A.clone(); P(x2, th2, r2, B); const b = B.clone();
      seg3(fib, i, a, b, 0.0035);
    }
    fib.instanceMatrix.needsUpdate = true;

    // hemácias: fluxo ao longo de x; antes do trombo se acumulam (jam), depois dele rareiam
    const jam = clamp(p.jam ?? 0), travel = p.travel ?? t * 0.8;
    const xs0 = X_LO + 0.1, span = X_HI - X_LO - 0.2, xb = V.XF - 0.35;
    for (let i = 0; i < NRBC; i++) {
      let x = xs0 + ((hash(i * 1.7) * span + travel * (0.85 + 0.3 * hash(i * 3.1))) % span);
      if (jam > 0 && x < xb + 0.2) {
        // compressão para perto do trombo: fila densa
        const d = xb - x; x = xb - (d * (1 - 0.78 * jam) + 0.02 * jam * hash(i * 9.9));
      }
      let s = 1;
      if (x > xb + 0.2) s = 1 - jam * (hash(i * 4.4) < 0.85 ? 1 : 0.3) * clamp((x - xb) / 0.6);   // distal: quase vazio
      const th = V.CUT0 + 0.25 + hash(i * 2.3) * (V.CUT1 - V.CUT0 - 0.5);
      const rf = rLum(th, x) - TT(th, x) - 0.07;
      const rr = Math.max(0, rf) * Math.sqrt(hash(i * 5.7)) * 0.95;
      if (rf < 0.03) s *= clamp(rf / 0.03 + 0.4);
      P(x, th, rr);
      e.set(hash(i * 6.1) * 6 + travel * 1.5 * (1 - jam), hash(i * 7.7) * 6, hash(i * 8.3) * 6 + travel * (1 - jam)); q.setFromEuler(e);
      m4.compose(v, q, sc.setScalar(0.06 * s)); rbc.setMatrixAt(i, m4);
    }
    rbc.instanceMatrix.needsUpdate = true;
    // hemácias presas na rede de fibrina (trombo vermelho), meio afundadas na superfície
    for (let i = 0; i < NTRAP; i++) {
      const th = V.THF + (hash(i * 2.9 + 7) - 0.5) * 3.4, x = V.XF + 0.05 + (hash(i * 3.7 + 7) - 0.5) * 1.1;
      const tt = TT(th, x), k = clamp((tt - 0.03) / 0.05) * clamp(tr * 1.6 - 0.4) * (1 - open);
      if (k <= 0.01) { trapped.setMatrixAt(i, zero); continue; }
      P(x, th, rLum(th, x) - tt + 0.012); e.set(hash(i * 5.3) * 6, hash(i * 6.9) * 6, hash(i * 8.1) * 6); q.setFromEuler(e);
      m4.compose(v, q, sc.setScalar(0.058 * k)); trapped.setMatrixAt(i, m4);
    }
    trapped.instanceMatrix.needsUpdate = true;

    // ---- dispositivos ----
    const back = clamp(p.retract ?? 0) * 6;          // quanto tudo recuou
    const tipX = X_LO - 0.5 + (V.XF + 1.9 - X_LO + 0.5) * clamp(p.wire ?? 0) - back;
    const showWire = (p.wire ?? 0) > 0.001 && tipX > X_LO;
    wire.visible = wireTip.visible = showWire;
    // o fio passa pelo centro da luz residual; leve ondulação
    if (showWire) {
      const x0 = X_LO - 0.5; wire.position.set((x0 + tipX) / 2, -0.03, 0.02); wire.scale.set(tipX - x0, 1, 1); wireTip.position.set(tipX, -0.03, 0.02);
    }
    const bCenter = X_LO - 1.2 + (V.XF - (X_LO - 1.2)) * ease(clamp(p.cath ?? 0)) - back, bLen = 1.25;
    const infl = clamp(p.balloon ?? 0);
    const showCath = (p.cath ?? 0) > 0.001 && bCenter + bLen / 2 > X_LO;
    cath.visible = balloon.visible = markers.visible = showCath;
    const rBal = 0.075 + (V.R_LUM - 0.07 - 0.075) * infl;
    if (showCath) {
      const cx0 = X_LO - 0.5, cx1 = bCenter - bLen / 2;
      cath.position.set((cx0 + cx1) / 2, -0.03, 0.02); cath.scale.set(Math.max(0.001, cx1 - cx0), 1, 1);
      balloon.position.set(bCenter, -0.03 * (1 - infl), 0.02 * (1 - infl)); balloon.scale.set(bLen, rBal, rBal);
      for (let k = 0; k < 2; k++) { m4.compose(A.set(bCenter + (k ? 1 : -1) * bLen * 0.36, -0.03 * (1 - infl), 0.02 * (1 - infl)), q.identity(), sc.set(1, 0.03, 0.03)); markers.setMatrixAt(k, m4); }
      markers.instanceMatrix.needsUpdate = true;
    }
    // stent: anéis em zigue-zague unidos por conectores; crimpado sobre o balão, depois expandido e implantado na parede
    const ex = clamp(p.stent ?? 0), deployed = ex > 0.999;
    const sCenter = deployed ? V.XF : bCenter, showStent = showCath || ex > 0.001;
    struts.visible = joints.visible = showStent;
    if (showStent) {
      const rS = ex > 0 ? Math.max(rBal + 0.012, 0.09 + (V.R_LUM - 0.055 - 0.09) * ex) : rBal + 0.012;
      const len = 1.15 * (1 - 0.06 * ex), ringL = len / NRING, amp = ringL * 0.42 * (1 - 0.35 * ex);
      const cy = showCath && !deployed ? -0.03 * (1 - infl) : 0, cz = showCath && !deployed ? 0.02 * (1 - infl) : 0;
      // o stent não entra no tecido: encosta na superfície da luz (placa/trombo comprimidos)
      const pt = (k, j, out) => { const th = (j / (NCROWN * 2)) * Math.PI * 2 + (k % 2) * Math.PI / NCROWN / 2; const x = sCenter - len / 2 + (k + 0.5) * ringL + (j % 2 ? amp : -amp) / 2; const r = Math.min(rS, rLum(th, x) - TT(th, x) - 0.002); return out.set(x, cy + Math.cos(th) * r, cz + Math.sin(th) * r); };
      const thOf = (j, k) => (j / (NCROWN * 2)) * Math.PI * 2 + (k % 2) * Math.PI / NCROWN / 2;
      const rad = 0.013;
      // hastes no setor do corte somem aos poucos enquanto o stent abre (crimpado ele aparece inteiro)
      const fc = (th) => inCut(th) ? 1 - clamp((ex - 0.2) / 0.3) : 1;
      let i = 0, jn = 0;
      for (let k = 0; k < NRING; k++) for (let j = 0; j < NCROWN * 2; j++) {
        const f = Math.min(fc(thOf(j, k)), fc(thOf(j + 1, k)));
        if (f <= 0.01) { struts.setMatrixAt(i++, zero); joints.setMatrixAt(jn++, zero); continue; }
        pt(k, j, A); const a = A.clone(); pt(k, j + 1, B); seg3(struts, i++, a, B.clone(), rad * f);
        m4.compose(a, q.identity(), sc.setScalar(rad * 1.3 * f)); joints.setMatrixAt(jn++, m4);
      }
      for (let k = 0; k < NRING - 1; k++) for (let j = 0; j < NCROWN * 2; j += 4) {
        const f = fc(thOf(j, k));
        if (f <= 0.01) { struts.setMatrixAt(i++, zero); continue; }
        pt(k, j + 1, A); const a = A.clone(); pt(k + 1, j + 1, B); const b = B.clone(); b.x = a.x + ringL; seg3(struts, i++, a, b, rad * 0.8 * f);
      }
      while (i < NSTRUT) struts.setMatrixAt(i++, zero);
      struts.instanceMatrix.needsUpdate = true; joints.instanceMatrix.needsUpdate = true;
    }
  }
  update({}, 0);
  return { root, inner, update, mats, xRange: [X_LO, X_HI], parts: { cap, core, deep, thromb, media, adv, rbc, plt, fib } };
}

// balão: cilindro unitário (raio 1, comprimento 1 em x) com ombros cônicos
function balloonGeometry() {
  const prof = [];
  const pts = [[0, -0.5], [0.08, -0.5], [0.25, -0.44], [1, -0.34], [1, 0.34], [0.25, 0.44], [0.08, 0.5], [0, 0.5]];
  for (const [r, y] of pts) prof.push(new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(prof, 32); g.rotateZ(-Math.PI / 2); g.computeVertexNormals(); return g;
}
// metal: realce especular extra (o ambiente do look 'doc' é fraco)
function addBoost(m, k) { m.emissive = new THREE.Color(0x1c2228); m.emissiveIntensity = k * 3; }
