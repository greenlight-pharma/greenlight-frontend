// Modelo M5: corte transversal (eixo curto) dos ventrículos, 100% procedural. Anel do VE (espesso), crescente do
// VD (fino), músculos papilares, gordura epicárdica e a DA seccionada no sulco interventricular anterior.
// Orientação da face de corte (vista do ápice, convenção de eco): anterior no topo, septo e VD à esquerda da tela,
// parede lateral à direita, inferior embaixo.
// Parâmetro principal: progress 0..1 — a necrose isquêmica do território da DA avança como FRENTE DE ONDA do
// endocárdio (subendocárdio, mais vulnerável) para o epicárdio (Reimer–Jennings). As bordas laterais da área em
// risco são dadas pelo leito da artéria desde o início; o que cresce com o tempo é a profundidade transmural.
import * as THREE from 'three';
import { tissueMaterial, clamp } from './stage.js';
import { cutShell, gauss, dAng, taperTube } from './heart-geo.js';

const D2R = Math.PI / 180;
// ângulo θ no plano do corte: 0 = anterior (topo), +90° = septo/VD (esquerda da tela), 180° = inferior, −90° = lateral
export const SL = {
  H: 0.42,                                  // espessura da fatia
  LAD_A: -45 * D2R, LAD_B: 78 * D2R,        // território da DA (anterior, anterosseptal, parte da anterolateral)
  RV_A: 32 * D2R, RV_B: 160 * D2R,          // inserções anterior e inferior do VD
};
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
// endocárdio do VE com trabeculações e os dois papilares (anterolateral ~4 h, posteromedial ~8 h)
export const rEndo = (th) => {
  let r = 0.56 * (1 + 0.012 * Math.sin(th * 23) + 0.009 * Math.sin(th * 37 + 1) + 0.006 * Math.sin(th * 61 + 2));
  r -= 0.15 * gauss(dAng(th, -120 * D2R) / 0.3, 1) + 0.13 * gauss(dAng(th, 122 * D2R) / 0.28, 1);
  return r;
};
export const rEpi = (th) => 1.0 * (1 + 0.012 * Math.sin(th * 5 + 0.5) + 0.02 * Math.cos(th - 0.4));
// VD: parede livre fina afastada do septo; a cavidade some nas inserções
const rvGap = (th) => { const u = clamp((th - SL.RV_A) / (SL.RV_B - SL.RV_A)); return 0.26 * Math.pow(Math.sin(u * Math.PI), 0.9); };
const rvIn = (th) => rEpi(th) + rvGap(th), rvOut = (th) => rvIn(th) + 0.17 + 0.02 * Math.sin(th * 9);
// peso do território da DA (bordas laterais suaves)
export const territory = (th) => { const a = dAng(th, SL.LAD_A), b = dAng(th, SL.LAD_B); return smooth(-0.3, 0.16, a) * smooth(-0.3, 0.16, -b); };

// frente de necrose: profundidade transmural atingida (0 = endocárdio, 1 = epicárdio) em função do progresso.
// Centro do território primeiro, bordas depois; nunca ultrapassa o leito da artéria.
export function front(th, progress) {
  const w = territory(th);
  const center = gauss(dAng(th, (SL.LAD_A + SL.LAD_B) / 2) / 1.2, 1);
  return clamp(progress * 1.25 * (0.75 + 0.25 * center) - 0.08) * w * 1.04;
}

export function buildSlice(stage) {
  const root = new THREE.Group(); stage.scene.add(root);
  const inner = new THREE.Group(); inner.rotation.y = -Math.PI / 2; root.add(inner);   // eixo x (espessura) → +z (câmera)
  const mats = {
    cut: tissueMaterial({ color: 0xffffff, sheen: 0xff8070, kind: 'wet', seed: 41, cell: 30, repeat: [8, 3], normal: 0.3, wet: 0.25, roughness: 0.62, rim: 0.08, side: THREE.DoubleSide }),
    epi: tissueMaterial({ color: 0x5a141b, sheen: 0xc8504a, kind: 'wet', seed: 43, repeat: [6, 2], normal: 0.5, wet: 0.7, roughness: 0.45, rim: 0.12, rimColor: 0xff9a8a, side: THREE.DoubleSide }),
    fat: tissueMaterial({ color: 0xcfa75c, sheen: 0xfff0b0, kind: 'cells', seed: 13, cell: 12, repeat: [3, 3], normal: 0.9, wet: 0.6, roughness: 0.45, rim: 0.1, rimColor: 0xfff0c0 }),
    artery: tissueMaterial({ color: 0xb0282a, sheen: 0xff8f80, kind: 'wet', seed: 9, repeat: [2, 2], normal: 0.3, wet: 0.9, roughness: 0.3, rim: 0.2, rimColor: 0xffb0a0 }),
    lumen: new THREE.MeshStandardMaterial({ color: 0x3a070b, roughness: 0.5 }),
    clot: tissueMaterial({ color: 0x5a0c12, sheen: 0xff7070, kind: 'wet', seed: 45, repeat: [1, 1], normal: 0.6, wet: 0.8, roughness: 0.35 }),
  };
  mats.cut.vertexColors = true;
  mats.cut.sheen = 0; mats.cut.clearcoat = 0.08; mats.cut.roughness = 0.8; mats.cut.userData.rim.value = 0.04;       // face de corte fosca: a cor (vivo × isquêmico) é a mensagem
  const X0 = -SL.H / 2, X1 = SL.H / 2;

  // cores do corte
  const cH = new THREE.Color(0x6c141c), cH2 = new THREE.Color(0x4e0e15), cN = new THREE.Color(0x3a2636), cN2 = new THREE.Color(0x2a1c28), cEdge = new THREE.Color(0x8a3a44), cRisk = new THREE.Color(0x5a1a2a), cT = new THREE.Color();
  const noise = (th, r) => 0.5 * Math.sin(th * 13 + r * 17) * Math.sin(th * 7 - r * 23 + 1) + 0.3 * Math.sin(th * 41 + r * 53);
  function lvColor(th, r, p) {
    const e0 = rEndo(th), e1 = rEpi(th), d = clamp((r - e0) / (e1 - e0));
    const n = noise(th, r);
    cT.copy(cH).lerp(cH2, 0.35 + 0.35 * n);
    // área em risco: leve tom arroxeado em toda a espessura do território (isquemia ainda reversível)
    const w = territory(th);
    cT.lerp(cRisk, w * clamp(p * 3) * 0.35);
    // necrose: atrás da frente de onda (do endocárdio para fora), com borda edemaciada mais clara
    const f = front(th, p);
    if (f > 0.001) {
      const soft = 0.06 + 0.03 * n;
      const nec = 1 - smooth(f - soft, f + 0.01, d + 0.03 * n);
      const edge = gauss((d - f) / 0.045, 1) * w * clamp(f * 8);
      cT.lerp(cN, nec * 0.95).lerp(cN2, nec * clamp(0.3 + 0.4 * n) * 0.6);
      cT.lerp(cEdge, edge * 0.35 * (1 - nec));
    }
    return cT;
  }

  const lv = new THREE.Mesh(new THREE.BufferGeometry(), mats.cut); inner.add(lv);
  const lvEpi = new THREE.Mesh(cutShell(rEndo, rEpi, { th0: -Math.PI, th1: Math.PI, x0: X0 - 0.002, x1: X1 + 0.002, segT: 256, segL: 6, faces: ['out', 'in'] }), mats.epi); inner.add(lvEpi);
  const rv = new THREE.Mesh(cutShell(rvIn, rvOut, { th0: SL.RV_A, th1: SL.RV_B, x0: X0, x1: X1, segT: 120, segL: 4, segW: 6, col: (th, x, face, r) => { cT.copy(cH).lerp(cH2, 0.4 + 0.3 * noise(th, r)); return [cT.r, cT.g, cT.b]; } }), mats.cut); inner.add(rv);

  // gordura epicárdica nos sulcos interventriculares e a DA (ocluída) e a DP em corte
  const addVesselCut = (th, rr, rad, occluded) => {
    const c = new THREE.Vector3(0, Math.cos(th) * rr, Math.sin(th) * rr);
    // gordura: coxim lobulado cortado junto com a fatia (faces de corte planas)
    const line = new THREE.LineCurve3(new THREE.Vector3(X0 + 0.004, 0, 0), new THREE.Vector3(X1 - 0.004, 0, 0));
    const fat = new THREE.Mesh(taperTube(line, (u, a) => (1 + 0.08 * Math.sin(a * 5 + th * 9) + 0.04 * Math.sin(a * 11 + 1)), { seg: 2, rad: 40, caps: [true, true] }), [mats.fat, mats.fat]);
    fat.position.copy(c); fat.scale.set(1, rad * 2.4, rad * 3.6); fat.rotation.x = th; inner.add(fat);
    const art = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, SL.H * 1.0, 24, 1).rotateZ(Math.PI / 2), mats.artery);
    const out = c.clone().multiplyScalar(1 + rad * 0.9 / rr);
    art.position.copy(out); inner.add(art);
    const lum = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.55, rad * 0.55, SL.H * 1.004, 20, 1).rotateZ(Math.PI / 2), occluded ? mats.clot : mats.lumen);
    lum.position.copy(out); inner.add(lum);
  };
  addVesselCut(SL.RV_A - 0.02, rEpi(SL.RV_A) + 0.05, 0.075, true);    // DA no sulco interventricular anterior (trombo)
  addVesselCut(SL.RV_B + 0.03, rEpi(SL.RV_B) + 0.05, 0.06, false);    // DP no sulco posterior

  function update(p) {
    lv.geometry.dispose();
    lv.geometry = cutShell(rEndo, rEpi, { th0: -Math.PI, th1: Math.PI, x0: X0, x1: X1, segT: 360, segL: 2, segW: 40, faces: ['end'], uRep: 1, vRep: 1,
      col: (th, x, face, r) => { const c = lvColor(th, r, p); return [c.r, c.g, c.b]; } });
  }
  update(0);
  return { root, inner, update, mats };
}
