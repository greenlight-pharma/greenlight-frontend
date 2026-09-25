// Modelo M2: segmento de brônquio em corte ("fatia de bolo"), 100% procedural.
// Camadas da luz para fora: epitélio ciliado com células caliciformes, membrana basal, submucosa com glândulas,
// músculo liso em feixes, adventícia e placas de cartilagem. Parâmetros animáveis (0..1):
//   contract (broncoconstrição: luz fecha, mucosa dobra), edema (submucosa espessa e pálida), mucus (muco na luz),
//   eos (eosinófilos migrando), neut (neutrófilos/macrófagos), goblet (hiperplasia de caliciformes), fibrosis (parede fibrosa),
//   flow (fluxo de ar visível). Tudo é função de (params, t): determinístico.
import * as THREE from 'three';
import { BRAND, rimMaterial, clamp } from './stage.js';

const LEN = 2.4, SEG_T = 72, SEG_L = 36;
const CUT0 = Math.PI * 0.2, CUT1 = Math.PI * 1.75;          // arco visível (o resto é o corte)
const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// casca parcial de cilindro ao longo de x, com raio interno e externo por ângulo, e tampas nas bordas do corte e nas pontas
function shellGeometry(rin, rout, { th0 = CUT0, th1 = CUT1, len = LEN, segT = SEG_T, segL = SEG_L } = {}) {
  const pos = [], idx = [];
  const P = (x, r, th) => [x, Math.cos(th) * r, Math.sin(th) * r];
  const grid = (fn, nu, nv, flip) => {
    const base = pos.length / 3;
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) pos.push(...fn(i / nu, j / nv));
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const a = base + i * (nv + 1) + j, b = a + nv + 1;
      flip ? idx.push(a, a + 1, b, b, a + 1, b + 1) : idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  };
  const X = (u) => -len / 2 + u * len, TH = (v) => th0 + v * (th1 - th0);
  grid((u, v) => P(X(u), rout(TH(v), X(u)), TH(v)), segL, segT, false);          // superfície externa
  grid((u, v) => P(X(u), rin(TH(v), X(u)), TH(v)), segL, segT, true);            // superfície interna
  for (const th of [th0, th1]) grid((u, w) => P(X(u), rin(th, X(u)) + (rout(th, X(u)) - rin(th, X(u))) * w, th), segL, 4, th === th1); // bordas do corte
  for (const [u, fl] of [[0, true], [1, false]]) grid((w, v) => P(X(u), rin(TH(v), X(u)) + (rout(TH(v), X(u)) - rin(TH(v), X(u))) * w, TH(v)), 4, segT, fl); // pontas
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

export function buildBronchus(stage) {
  const root = new THREE.Group(); stage.scene.add(root);
  const inner = new THREE.Group(); inner.rotation.z = Math.PI / 2; root.add(inner);   // eixo do brônquio na vertical
  root.rotation.y = Math.PI / 2;                                                     // corte voltado para a câmera
  const mats = {
    epi: rimMaterial({ color: 0xe9a7a0, rimColor: 0xffd9d2, roughness: 0.55, rimStrength: 0.12, side: THREE.DoubleSide }),
    sub: rimMaterial({ color: 0xc46a6e, rimColor: 0xffc0b8, roughness: 0.62, rimStrength: 0.1, side: THREE.DoubleSide }),
    muscle: rimMaterial({ color: 0x8e2a36, rimColor: 0xff8a8a, roughness: 0.45, rimStrength: 0.15 }),
    adv: rimMaterial({ color: 0xd8b1a6, rimColor: 0xffffff, roughness: 0.7, rimStrength: 0.08, side: THREE.DoubleSide }),
    cart: new THREE.MeshPhysicalMaterial({ color: 0xb9d6e2, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    mucus: new THREE.MeshPhysicalMaterial({ color: 0xe9e2a6, roughness: 0.15, transmission: 0, transparent: true, opacity: 0.72, clearcoat: 1, side: THREE.DoubleSide }),
    cilia: new THREE.MeshStandardMaterial({ color: 0xfff2ee, roughness: 0.4 }),
    goblet: rimMaterial({ color: 0xf6eecf, rimColor: 0xffffff, roughness: 0.3, rimStrength: 0.5 }),
    gland: rimMaterial({ color: 0xf2d9b8, rimColor: 0xffffff, roughness: 0.45, rimStrength: 0.35 }),
    eos: rimMaterial({ color: 0xf08a3c, rimColor: 0xffd3a0, roughness: 0.35, rimStrength: 0.8, emissive: 0x3a1500 }),
    neut: rimMaterial({ color: 0xa9b7e8, rimColor: 0xe4ebff, roughness: 0.35, rimStrength: 0.7, emissive: 0x0b1030 }),
    air: new THREE.MeshBasicMaterial({ color: 0xcff3ee, transparent: true, opacity: 0.85 }),
  };
  const layers = {};
  for (const k of ['epi', 'sub', 'adv']) { layers[k] = new THREE.Mesh(new THREE.BufferGeometry(), mats[k]); inner.add(layers[k]); }

  // feixes de músculo liso: faixas helicoidais curtas (instâncias de cápsulas achatadas)
  const NM = 14 * 9;
  const muscle = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.035, 0.22, 4, 8), mats.muscle, NM); inner.add(muscle);
  // cartilagem: placas irregulares (arcos parciais) na parte externa
  const NC = 7;
  const cart = [];
  for (let i = 0; i < NC; i++) { const m = new THREE.Mesh(new THREE.BufferGeometry(), mats.cart); inner.add(m); cart.push(m); }
  // epitélio: cílios e caliciformes como instâncias sobre a superfície interna
  const NCIL = 64 * 26, NGOB = 160;
  const cilia = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.004, 0.006, 1, 4, 1, true).translate(0, 0.5, 0), mats.cilia, NCIL); inner.add(cilia);
  const goblets = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 10), mats.goblet, NGOB); inner.add(goblets);
  const glands = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), mats.gland, 60); inner.add(glands);
  const NEOS = 90, eos = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mats.eos, NEOS); inner.add(eos);
  const neut = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mats.neut, NEOS); inner.add(neut);
  const NAIR = 260, air = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 5), mats.air, NAIR); inner.add(air);
  const mucus = new THREE.Mesh(new THREE.BufferGeometry(), mats.mucus); inner.add(mucus);

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const hide = (im, from) => { for (let i = from; i < im.count; i++) { m4.makeScale(0, 0, 0); im.setMatrixAt(i, m4); } };

  function update(p, t) {
    const k = clamp(p.contract || 0), ed = clamp(p.edema || 0), mu = clamp(p.mucus || 0), fib = clamp(p.fibrosis || 0);
    const R_OUT = 1.0;
    const rMuscle0 = 0.70 - 0.16 * k - 0.04 * fib, rMuscle1 = rMuscle0 + 0.06 + 0.03 * k + 0.02 * fib;
    const rSub0 = 0.52 - 0.22 * k - 0.06 * ed - 0.08 * fib;          // interface epitélio/submucosa
    const fold = (th) => 1 + (0.02 + 0.14 * k) * Math.cos(th * 9) * (0.6 + 0.4 * Math.cos(th * 4 + 1));
    const rLum = (th) => Math.max(0.07, (rSub0 - 0.07) * fold(th));
    const rEpi1 = (th) => rLum(th) + 0.07;
    layers.epi.geometry.dispose(); layers.epi.geometry = shellGeometry(rLum, rEpi1);
    layers.sub.geometry.dispose(); layers.sub.geometry = shellGeometry(rEpi1, () => rMuscle0);
    layers.adv.geometry.dispose(); layers.adv.geometry = shellGeometry(() => rMuscle1, () => 0.84);
    mats.sub.color.setHex(0xc46a6e).lerp(new THREE.Color(0xf0d0c8), ed * 0.55).lerp(new THREE.Color(0xc9b8b2), fib * 0.6);
    mats.epi.color.setHex(0xe9a7a0).lerp(new THREE.Color(0xff9d8f), (p.eos || 0) * 0.25);

    // músculo: faixas oblíquas em anéis
    let i = 0;
    for (let ring = 0; ring < 9; ring++) for (let j = 0; j < 14; j++) {
      const th = CUT0 + (j + 0.5 + (ring % 2) * 0.5) / 14 * (CUT1 - CUT0), x = -LEN / 2 + (ring + 0.5) / 9 * LEN;
      if (th > CUT1) { m4.makeScale(0, 0, 0); muscle.setMatrixAt(i++, m4); continue; }
      const r = (rMuscle0 + rMuscle1) / 2;
      v.set(x, Math.cos(th) * r, Math.sin(th) * r);
      const tang = new THREE.Vector3(0.35, -Math.sin(th), Math.cos(th)).normalize();
      q.setFromUnitVectors(up, tang);
      const thick = 1 + 0.9 * k;
      m4.compose(v, q, sc.set(thick, 1 + 0.25 * k, thick)); muscle.setMatrixAt(i++, m4);
    }
    muscle.instanceMatrix.needsUpdate = true;
    // cartilagem: placas em x fixo, arco parcial, afastadas da face do corte
    cart.forEach((m, c) => {
      const a0 = CUT0 + 0.15 + c * 0.72, a1 = Math.min(CUT1 - 0.05, a0 + 0.5 + hash(c) * 0.25);
      m.geometry.dispose(); m.geometry = shellGeometry(() => 0.86, (th) => 0.95 + 0.02 * Math.sin(th * 5 + c), { th0: a0, th1: a1, len: LEN * 0.92, segT: 18, segL: 12 });
    });
    // cílios: batimento metacrônico (onda ao longo do eixo); somem onde o muco cobre
    i = 0;
    const nTh = 64, nX = 26;
    for (let a = 0; a < nX; a++) for (let b = 0; b < nTh; b++) {
      const th = CUT0 + (b + 0.5) / nTh * (CUT1 - CUT0), x = -LEN / 2 + (a + 0.5) / nX * LEN;
      const r = rLum(th);
      const bend = 0.5 * Math.sin(t * 9 - x * 7 + th * 0.5);
      const n = new THREE.Vector3(0, -Math.cos(th), -Math.sin(th));
      const dir = n.clone().add(new THREE.Vector3(bend * 0.5, 0, 0)).normalize();
      q.setFromUnitVectors(up, dir);
      v.set(x, Math.cos(th) * r, Math.sin(th) * r);
      const L = 0.05 * (1 - 0.6 * fib);
      m4.compose(v, q, sc.set(1, L, 1)); cilia.setMatrixAt(i++, m4);
    }
    cilia.instanceMatrix.needsUpdate = true;
    // caliciformes: número cresce com goblet
    const nG = Math.round(NGOB * (0.25 + 0.75 * clamp(p.goblet || 0)));
    for (let g = 0; g < NGOB; g++) {
      if (g >= nG) { m4.makeScale(0, 0, 0); goblets.setMatrixAt(g, m4); continue; }
      const th = CUT0 + hash(g * 3.1) * (CUT1 - CUT0), x = -LEN / 2 + hash(g * 7.7) * LEN;
      const r = rLum(th) + 0.03;
      v.set(x, Math.cos(th) * r, Math.sin(th) * r);
      m4.compose(v, q.identity(), sc.setScalar(0.028 + 0.012 * hash(g))); goblets.setMatrixAt(g, m4);
    }
    goblets.instanceMatrix.needsUpdate = true;
    // glândulas submucosas: aumentam com goblet/fibrose (hipertrofia)
    for (let g = 0; g < 60; g++) {
      const th = CUT0 + hash(g * 5.3 + 1) * (CUT1 - CUT0), x = -LEN / 2 + hash(g * 2.9 + 4) * LEN;
      const r = (rEpi1(th) + rMuscle0) / 2;
      v.set(x, Math.cos(th) * r, Math.sin(th) * r);
      m4.compose(v, q.identity(), sc.setScalar((0.03 + 0.012 * hash(g)) * (1 + 0.5 * clamp(p.goblet || 0)))); glands.setMatrixAt(g, m4);
    }
    glands.instanceMatrix.needsUpdate = true;
    // células inflamatórias: entram pela submucosa (de fora para dentro) conforme eos/neut
    const cells = (im, amount, seed, size) => {
      const n = Math.round(NEOS * clamp(amount));
      for (let c = 0; c < NEOS; c++) {
        if (c >= n) { m4.makeScale(0, 0, 0); im.setMatrixAt(c, m4); continue; }
        const th = CUT0 + hash(c * 1.7 + seed) * (CUT1 - CUT0), x = -LEN / 2 + hash(c * 4.3 + seed) * LEN;
        const depth = hash(c * 9.1 + seed);
        const r = rEpi1(th) + (rMuscle0 - rEpi1(th)) * (0.1 + 0.8 * depth) + 0.01 * Math.sin(t * 2 + c);
        v.set(x + 0.02 * Math.sin(t * 1.5 + c), Math.cos(th) * r, Math.sin(th) * r);
        q.setFromEuler(new THREE.Euler(c, c * 2, 0));
        m4.compose(v, q, sc.set(size, size * 0.85, size)); im.setMatrixAt(c, m4);
      }
      im.instanceMatrix.needsUpdate = true;
    };
    cells(eos, p.eos || 0, 11, 0.042);
    cells(neut, p.neut || 0, 29, 0.04);
    // muco: película sobre o epitélio que engrossa e forma tampão
    mucus.visible = mu > 0.02;
    if (mucus.visible) {
      mucus.geometry.dispose();
      mucus.geometry = shellGeometry((th, x) => Math.max(0.0, rLum(th) * (1 - mu * (0.55 + 0.45 * Math.exp(-((x - 0.3) ** 2) / 0.08)))) , (th) => rLum(th) - 0.004);
    }
    // fluxo de ar: partículas ao longo da luz; velocidade cai com a área da luz
    const rMean = rSub0 - 0.07, flow = clamp(p.flow ?? 1);
    const speed = 0.35 * Math.pow(rMean / 0.45, 2) * flow;
    for (let a = 0; a < NAIR; a++) {
      const u = (hash(a * 1.3) + t * speed * (0.8 + 0.4 * hash(a * 2.1))) % 1;
      const th = hash(a * 3.7) * Math.PI * 2, rr = Math.sqrt(hash(a * 5.9)) * Math.max(0.02, rMean * (1 - mu * 0.6)) * 0.8;
      v.set(-LEN / 2 + u * LEN, Math.cos(th) * rr, Math.sin(th) * rr);
      const vis = flow > 0.01 ? 0.009 : 0;
      m4.compose(v, q.identity(), sc.setScalar(vis)); air.setMatrixAt(a, m4);
    }
    air.instanceMatrix.needsUpdate = true;
  }
  update({ flow: 1 }, 0);
  return { root, update, mats };
}
