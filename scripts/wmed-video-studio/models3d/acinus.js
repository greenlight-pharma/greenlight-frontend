// Modelo: ácino pulmonar (unidade respiratória terminal), 100% procedural.
// Bronquíolo terminal → bronquíolos respiratórios → ductos alveolares → sacos alveolares.
// Os alvéolos são "bolhas de espuma": esferas recortadas pelos planos radicais dos vizinhos, de modo que
// alvéolos vizinhos compartilham um septo plano e fino (não são bolinhas soltas). A boca de cada alvéolo
// é recortada onde ele encosta na luz do ducto. Rede capilar desenhada no shader (linhas tipo giroide).
// Parâmetros animáveis:
//   breath (0..1: expiração → inspiração), emph (0..1: enfisema).
// Enfisema: septos ganham poros que crescem até sumir (padrão centroacinar: começa perto dos bronquíolos
// respiratórios), alvéolos vizinhos se fundem em espaços maiores (bolhas), a rede capilar rareia, surgem
// neutrófilos/macrófagos e pigmento antracótico, e o ácino fica insuflado na expiração (aprisionamento de ar).
// Tudo é função de (params, t, câmera): determinístico, sem estado entre quadros.
import * as THREE from 'three';
import { tissueMaterial, rimMaterial, clamp, seg } from './stage.js';

const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

// distância de um ponto p ao segmento ab
function segDist(p, a, b) {
  const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
  const u = clamp(((p.x - a.x) * abx + (p.y - a.y) * aby + (p.z - a.z) * abz) / (abx * abx + aby * aby + abz * abz));
  const dx = p.x - a.x - abx * u, dy = p.y - a.y - aby * u, dz = p.z - a.z - abz * u;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ---------- Árvore de vias aéreas (ductos como segmentos) ----------
// gen 0 = bronquíolo terminal, 1 = bronquíolo respiratório, 2-3 = ductos alveolares (3 termina em saco).
const GEN = [
  { len: 1.15, r: 0.2, ang: 0 },
  { len: 0.8, r: 0.15, ang: 0.36 },
  { len: 0.85, r: 0.125, ang: 0.46 },
  { len: 0.75, r: 0.11, ang: 0.5 },
];
function buildTree() {
  const ducts = [];
  const grow = (a, dir, plane, gen, parent, sd) => {
    const g = GEN[gen];
    const len = g.len * (0.9 + 0.2 * hash(sd));
    const b = a.clone().addScaledVector(dir, len);
    const d = { a, b, dir, r: g.r, gen, parent, id: ducts.length, depth: 0 };
    ducts.push(d);
    if (gen === GEN.length - 1) return;
    const G = GEN[gen + 1];
    const nextPlane = plane.clone().applyAxisAngle(dir, Math.PI / 2 + 0.35 * (hash(sd * 3) - 0.5));
    for (const s of [-1, 1]) {
      const ang = G.ang * (0.85 + 0.3 * hash(sd * 7 + s));
      const nd = dir.clone().applyAxisAngle(plane, s * ang);
      // leve tendência a crescer para cima (o ácino "cacho" preenche o quadro vertical)
      nd.lerp(V(0, 1, 0), 0.3).normalize();
      grow(b, nd, nextPlane, gen + 1, d.id, sd * 2 + (s > 0 ? 1 : 0) + 1.37);
    }
  };
  grow(V(0, -1.15, 0), V(0, 1, 0), V(0, 0, 1), 0, -1, 1);
  return ducts;
}

// ---------- Alvéolos: centros ao longo dos ductos e sacos nas pontas ----------
const RA = 0.185;
function placeAlveoli(ducts) {
  const cand = [];
  for (const d of ducts) {
    if (d.gen === 0) continue;
    const len = d.a.distanceTo(d.b);
    const n1 = V().crossVectors(d.dir, Math.abs(d.dir.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0)).normalize();
    const n2 = V().crossVectors(d.dir, n1);
    const steps = Math.max(2, Math.round(len / 0.24));
    for (let s = 0; s < steps; s++) {
      const u = (d.gen === 1 ? 0.25 : 0.1) + (s + 0.5) / steps * (d.gen === 1 ? 0.75 : 0.9);
      const ring = d.gen === 1 ? 6 : 6;
      for (let k = 0; k < ring; k++) {
        const sd = d.id * 131 + s * 17 + k;
        if (d.gen === 1 && hash(sd) < 0.55) continue;               // bronquíolo respiratório: alvéolos esparsos
        const th = (k + 0.5 * (s % 2) + 0.25 * hash(sd * 1.3)) / ring * Math.PI * 2;
        const rad = n1.clone().multiplyScalar(Math.cos(th)).addScaledVector(n2, Math.sin(th));
        const r = RA * (0.88 + 0.24 * hash(sd * 2.1));
        const c = d.a.clone().lerp(d.b, u).addScaledVector(rad, d.r + r * 0.72);
        cand.push({ c, r, duct: d.id, gen: d.gen });
      }
    }
    if (d.gen === GEN.length - 1) {                                   // saco alveolar na ponta
      const N = 9;
      for (let k = 0; k < N; k++) {
        const sd = d.id * 71 + k * 5 + 900;
        const z = 1 - (k + 0.5) / N * 1.15, ph = k * 2.39996 + hash(sd);
        const s = Math.sqrt(Math.max(0, 1 - z * z));
        const n1 = V().crossVectors(d.dir, V(0.3, 0.2, 1)).normalize(), n2 = V().crossVectors(d.dir, n1);
        const dir = d.dir.clone().multiplyScalar(z).addScaledVector(n1, s * Math.cos(ph)).addScaledVector(n2, s * Math.sin(ph)).normalize();
        const r = RA * (0.95 + 0.25 * hash(sd * 1.7));
        cand.push({ c: d.b.clone().addScaledVector(dir, d.r * 0.7 + r * 0.8), r, duct: d.id, gen: 4 });
      }
    }
  }
  const out = [];
  const t0 = ducts[0];
  for (const a of cand) {
    if (segDist(a.c, t0.a, t0.b) < t0.r + a.r * 1.1) continue;
    let ok = true;
    for (const d of ducts) if (d.gen > 0 && d.id !== a.duct && segDist(a.c, d.a, d.b) < d.r + a.r * 0.55) { ok = false; break; }
    if (!ok) continue;
    for (const b of out) if (a.c.distanceTo(b.c) < (a.r + b.r) * 0.62) { ok = false; break; }
    if (ok) out.push(a);
  }
  return out;
}

// ---------- Material das paredes alveolares (película fina, úmida, translúcida) ----------
const NOISE = `
  float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
  float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }
`;
function wallMaterial() {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xe6a09a, roughness: 0.38, sheen: 0.8, sheenColor: new THREE.Color(0xffc4b8), sheenRoughness: 0.45,
    clearcoat: 0.7, clearcoatRoughness: 0.18, transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false,
  });
  const U = { uE: { value: 0 }, uCapF: { value: 58 }, uRim: { value: 0.5 }, uCap: { value: 1 } };
  m.userData.u = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec3 aRest; attribute vec4 aInfo; varying vec3 vRest; varying vec4 vInfo;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vRest = aRest; vInfo = aInfo;`);
    // aInfo: x = distância à luz do ducto (negativo = boca aberta), y = é septo (0/1),
    //        z = destruição do septo (0..1), w = gradiente arterial→venoso do alvéolo
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uE, uCapF, uRim, uCap; varying vec3 vRest; varying vec4 vInfo; float gEdge; float gCap;
        ${NOISE}`)
      .replace('#include <alphamap_fragment>', `#include <alphamap_fragment>
        if (vInfo.x < 0.0) discard;                                  // boca do alvéolo (luz do ducto)
        float sept = smoothstep(0.35, 0.9, vInfo.y);
        float nh = vn3(vRest * 9.0) * 0.6 + vn3(vRest * 23.0) * 0.4;
        float thr = vInfo.z * sept * 1.12 - 0.04;
        if (nh < thr) discard;                                       // poros que crescem até o septo sumir
        gEdge = sept * step(0.02, vInfo.z) * smoothstep(0.07, 0.0, nh - thr);
        float mouthRing = smoothstep(0.035, 0.0, vInfo.x);           // anel de entrada (fibras elásticas)
        // rede capilar: iso-linhas de dois giroides deformados por ruído
        vec3 p = vRest * uCapF + vec3(vn3(vRest * 6.0), vn3(vRest * 6.0 + 7.1), vn3(vRest * 6.0 + 3.3)) * 2.2;
        float g1 = sin(p.x)*cos(p.y) + sin(p.y)*cos(p.z) + sin(p.z)*cos(p.x);
        vec3 p2 = p * 1.7 + 1.3;
        float g2 = sin(p2.x)*cos(p2.y) + sin(p2.y)*cos(p2.z) + sin(p2.z)*cos(p2.x);
        float cap = max(smoothstep(0.3, 0.1, abs(g1)), 0.75 * smoothstep(0.22, 0.07, abs(g2)));
        float keep = smoothstep(uE * 0.95 - 0.15, uE * 0.95 + 0.05, vn3(vRest * 4.0 + 11.0));   // rarefação capilar
        cap *= mix(1.0, keep, clamp(uE * 1.4, 0.0, 1.0)) * uCap;
        float venous = clamp(vInfo.w + (vn3(vRest * 3.0) - 0.5) * 0.9, 0.0, 1.0);
        vec3 capCol = mix(vec3(0.34, 0.2, 0.52), vec3(0.72, 0.08, 0.12), venous);
        vec3 wall = mix(diffuseColor.rgb, vec3(0.9, 0.72, 0.7), uE * 0.3);   // parede mais pálida (menos perfusão)
        // pigmento antracótico (fumante): pontinhos escuros que aumentam com o enfisema
        float dust = step(1.0 - 0.05 * uE, vn3(vRest * 55.0)) * step(0.5, vn3(vRest * 7.0 + 2.0));
        diffuseColor.rgb = mix(wall, capCol, cap);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.12, 0.1, 0.1), dust * 0.8);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.8, 0.76), gEdge * 0.6 + mouthRing * 0.35);
        float thin = 1.0 - 0.45 * uE * sept;
        diffuseColor.a = (diffuseColor.a * thin + cap * 0.45 + gEdge * 0.35 + mouthRing * 0.3 + dust * 0.5);
        gCap = cap;`)
      .replace('#include <opaque_fragment>', `
        float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.4);
        outgoingLight += vec3(1.0, 0.78, 0.74) * fres * uRim * (1.0 - 0.3 * uE);
        diffuseColor.a = clamp(diffuseColor.a + fres * 0.4 * (1.0 - 0.35 * uE), 0.0, 0.92);
        #include <opaque_fragment>`);
  };
  return m;
}

// ---------- Construção ----------
export function buildAcinus(stage) {
  const root = new THREE.Group(); stage.scene.add(root);
  const ducts = buildTree();
  const alv = placeAlveoli(ducts);
  const NA = alv.length;

  // profundidade na árvore (0 = perto do bronquíolo respiratório, 1 = saco terminal)
  alv.forEach((a, i) => { a.grad = clamp((a.gen - 1) / 3 + 0.12 * (hash(i * 3.3) - 0.5)); a.i = i; });

  // vizinhos (esferas que se tocam) e dutos próximos (para recortar as bocas)
  const NB_MAX = 1.25;
  alv.forEach((a) => {
    a.nb = []; a.near = [];
    alv.forEach((b, j) => { if (j !== a.i && a.c.distanceTo(b.c) < (a.r + b.r) * NB_MAX) a.nb.push(j); });
    ducts.forEach((d) => { if (d.gen > 0 && segDist(a.c, d.a, d.b) < d.r * 1.7 + a.r * 1.4) a.near.push(d.id); });
  });

  // grupos de fusão: nível 1 (3-5 alvéolos → uma bolha) e nível 2 (pares de grupos → bolhas maiores)
  const g1 = new Array(NA).fill(-1); let ng1 = 0;
  const order = alv.map((a, i) => i).sort((x, y) => hash(x * 9.7) - hash(y * 9.7));
  for (const i of order) {
    if (g1[i] >= 0) continue;
    g1[i] = ng1;
    const near = alv[i].nb.filter((j) => g1[j] < 0).sort((x, y) => alv[i].c.distanceTo(alv[x].c) - alv[i].c.distanceTo(alv[y].c));
    near.slice(0, 2 + Math.floor(hash(i * 5.1) * 3)).forEach((j) => { g1[j] = ng1; });
    ng1++;
  }
  const gCent = Array.from({ length: ng1 }, () => ({ c: V(), n: 0, grad: 0 }));
  alv.forEach((a, i) => { const G = gCent[g1[i]]; G.c.add(a.c); G.n++; G.grad += a.grad; });
  gCent.forEach((G) => { G.c.divideScalar(G.n); G.grad /= G.n; });
  // nível 2: regiões do ácino (amostragem do ponto mais distante + vizinho mais próximo) → bolhas grandes
  const K = 7, seeds = [alv[0].c];
  while (seeds.length < K) {
    let best = null, bd = -1;
    for (const a of alv) { const d = Math.min(...seeds.map((c) => c.distanceTo(a.c))); if (d > bd) { bd = d; best = a.c; } }
    seeds.push(best);
  }
  const regionOf = (c) => { let k = 0, bd = 1e9; seeds.forEach((sc, i) => { const d = sc.distanceTo(c); if (d < bd) { bd = d; k = i; } }); return k; };
  const g2 = gCent.map((G) => regionOf(G.c)); const ng2 = K;
  // início da destruição por grupo: centroacinar (perto dos bronquíolos respiratórios primeiro)
  const on1 = gCent.map((G, g) => 0.04 + 0.4 * G.grad + 0.18 * hash(g * 4.7));
  const on2 = Array.from({ length: ng2 }, (_, k) => 0.42 + 0.2 * hash(k * 8.3));
  alv.forEach((a, i) => { a.g1 = g1[i]; a.g2 = g2[g1[i]]; a.push = a.c.clone().sub(gCent[g1[i]].c); });

  // gabarito de esfera, repetido para cada alvéolo numa única malha
  const tpl = new THREE.SphereGeometry(1, 30, 22);
  const tp = tpl.attributes.position, tn = tp.count, ti = tpl.index.array;
  const dirs = new Float32Array(tn * 3);
  for (let k = 0; k < tn; k++) { const v = V(tp.getX(k), tp.getY(k), tp.getZ(k)).normalize(); dirs.set([v.x, v.y, v.z], k * 3); }
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(NA * tn * 3), nor = new Float32Array(NA * tn * 3), rest = new Float32Array(NA * tn * 3), info = new Float32Array(NA * tn * 4);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('aRest', new THREE.BufferAttribute(rest, 3));
  geo.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  const idx = new Uint32Array(NA * ti.length);
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  const wallMat = wallMaterial();
  const walls = new THREE.Mesh(geo, wallMat); walls.frustumCulled = false; walls.renderOrder = 5; root.add(walls);

  // paredes de bronquíolo (terminal opaco; respiratórios translúcidos) e ramo da artéria pulmonar
  const bronchMat = tissueMaterial({ color: 0xc9777a, sheen: 0xffb8ae, kind: 'cells', seed: 5, cell: 14, repeat: [3, 6], normal: 0.6, wet: 0.7, roughness: 0.45, rim: 0.18 });
  const respMat = tissueMaterial({ color: 0xd98c88, sheen: 0xffc0b6, kind: 'cells', seed: 6, cell: 16, repeat: [2, 4], normal: 0.5, wet: 0.7, roughness: 0.4, rim: 0.3, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  respMat.depthWrite = false;
  const artMat = tissueMaterial({ color: 0x5e4a8e, sheen: 0xa99ce0, kind: 'fibers', seed: 8, cell: 10, repeat: [2, 8], normal: 0.4, wet: 0.6, roughness: 0.4, rim: 0.25 });
  const tubes = new THREE.Group(); root.add(tubes);
  const tube = (pts, r0, r1, mat, open = true) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const g = new THREE.TubeGeometry(curve, 40, 1, 24, false);
    // afina ao longo do comprimento (raio r0 → r1)
    const p = g.attributes.position, n = g.attributes.normal, P = V(), N = V();
    for (let k = 0; k < p.count; k++) {
      const seg = Math.floor(k / 25) / 40; const c = curve.getPointAt(seg);
      P.set(p.getX(k), p.getY(k), p.getZ(k)).sub(c); N.set(n.getX(k), n.getY(k), n.getZ(k));
      P.copy(c).addScaledVector(N, r0 + (r1 - r0) * seg); p.setXYZ(k, P.x, P.y, P.z);
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat); tubes.add(m); return m;
  };
  const d0 = ducts[0];
  const tb = tube([d0.a.clone().add(V(0, -1.6, 0)), d0.a.clone().add(V(0, -0.5, 0)), d0.a, d0.a.clone().lerp(d0.b, 0.5), d0.b], d0.r * 1.08, d0.r, bronchMat);
  tb.renderOrder = 1;
  for (const d of ducts.filter((x) => x.gen === 1)) {
    const m = tube([d0.b.clone().lerp(d0.a, 0.1), d.a.clone().lerp(d.b, 0.2), d.a.clone().lerp(d.b, 0.6), d.b], d.r * 1.1, d.r * 0.95, respMat);
    m.renderOrder = 3;
  }
  // artéria pulmonar acompanha o bronquíolo (sangue venoso → roxo-azulado) e se divide junto
  const off = V(0.26, 0, 0.1);
  const art = [d0.a.clone().add(V(0, -1.6, 0)).add(off), d0.a.clone().add(off), d0.b.clone().add(off).add(V(0, -0.1, 0))];
  tube(art, 0.075, 0.07, artMat);
  for (const d of ducts.filter((x) => x.gen === 1)) {
    const side = V().crossVectors(d.dir, V(0, 0, 1)).normalize().multiplyScalar(d.r + 0.08);
    tube([art[2], d.a.clone().lerp(d.b, 0.35).add(side), d.b.clone().add(side.clone().multiplyScalar(0.8))], 0.065, 0.045, artMat);
  }

  // células inflamatórias: neutrófilos (menores) e macrófagos (maiores, com pigmento) sobre os septos
  const NC = 44;
  const cellMat = rimMaterial({ color: 0x9fb0e6, rimColor: 0xe6ecff, roughness: 0.35, rimStrength: 0.6, emissive: 0x0b1030 });
  const macMat = rimMaterial({ color: 0x8f96b8, rimColor: 0xdfe4ff, roughness: 0.5, rimStrength: 0.45, emissive: 0x080a1a });
  const neut = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), cellMat, NC); root.add(neut);
  const macs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), macMat, NC / 2); root.add(macs);
  neut.renderOrder = 6; macs.renderOrder = 6;

  // corte (plano de secção, como numa lâmina espessa): revela os septos poligonais e a luz dos ductos
  const cutPlane = new THREE.Plane(V(0, 0, -1), 99);
  for (const m of [wallMat, bronchMat, respMat, artMat, cellMat, macMat]) m.clippingPlanes = [cutPlane];
  bronchMat.side = THREE.DoubleSide; artMat.side = THREE.DoubleSide;
  stage.renderer.localClippingEnabled = true;
  // z em coordenadas do mundo; null = sem corte
  const setCut = (z) => { cutPlane.constant = z == null ? 99 : z; };

  // caixa de enquadramento (em repouso)
  const box = new THREE.Box3(); alv.forEach((a) => box.expandByPoint(a.c.clone().addScalar(a.r)).expandByPoint(a.c.clone().subScalar(a.r)));

  // ---------- Atualização por quadro ----------
  const cen = [], rad = [], camLocal = V(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = V(), vv = V();
  const pivot = d0.b.clone();
  function update(p = {}, t = 0, camera = null) {
    const E = clamp(p.emph || 0), b = clamp(p.breath ?? 0.5);
    // aprisionamento de ar: com enfisema o ácino não esvazia na expiração
    const infl = (1 - E) * b + E * (0.85 + 0.15 * b);
    const S = 1 + 0.075 * infl + 0.05 * E;                        // escala global (hiperinsuflação)
    const rS = 1 + 0.05 * infl;                                   // alvéolos inflam um pouco mais que os ductos
    const dE = alv.map((a) => ({ d1: seg(E, on1[a.g1], on1[a.g1] + 0.3), d2: seg(E, on2[a.g2], on2[a.g2] + 0.25) }));
    alv.forEach((a, i) => {
      const { d1, d2 } = dE[i];
      // alvéolos do mesmo grupo crescem e se afastam do centro do grupo: o espaço fundido fica maior
      const c = a.c.clone().addScaledVector(a.push, 0.15 * d1 + 0.1 * d2);
      cen[i] = c.sub(pivot).multiplyScalar(S).add(pivot);
      rad[i] = a.r * S * rS * (1 + 0.28 * d1 + 0.2 * d2);
    });
    const ductR = (d) => d.r * S * (1 + 0.5 * E);                 // ductos alveolares dilatam
    const dA = ducts.map((d) => d.a.clone().sub(pivot).multiplyScalar(S).add(pivot));
    const dB = ducts.map((d) => d.b.clone().sub(pivot).multiplyScalar(S).add(pivot));
    const P = V(), R = V();
    for (let i = 0; i < NA; i++) {
      const a = alv[i], ci = cen[i], ri = rad[i], base = i * tn;
      for (let k = 0; k < tn; k++) {
        const dx = dirs[k * 3], dy = dirs[k * 3 + 1], dz = dirs[k * 3 + 2];
        let s = ri, fj = -1, fnx = dx, fny = dy, fnz = dz;
        for (const j of a.nb) {
          const cj = cen[j], Dx = cj.x - ci.x, Dy = cj.y - ci.y, Dz = cj.z - ci.z;
          const dd = dx * Dx + dy * Dy + dz * Dz; if (dd <= 1e-5) continue;
          const L2 = Dx * Dx + Dy * Dy + Dz * Dz, sj = (L2 + ri * ri - rad[j] * rad[j]) / (2 * dd);
          if (sj < s) { s = Math.max(sj, ri * 0.08); fj = j; const L = Math.sqrt(L2); fnx = Dx / L; fny = Dy / L; fnz = Dz / L; }
        }
        P.set(ci.x + dx * s, ci.y + dy * s, ci.z + dz * s);
        const o = (base + k) * 3;
        pos[o] = P.x; pos[o + 1] = P.y; pos[o + 2] = P.z;
        nor[o] = fnx; nor[o + 1] = fny; nor[o + 2] = fnz;
        R.copy(P).sub(pivot).divideScalar(S).add(pivot);
        rest[o] = R.x; rest[o + 1] = R.y; rest[o + 2] = R.z;
        // boca: distância (assinada) à luz dos ductos próximos
        let md = 9;
        for (const di of a.near) md = Math.min(md, segDist(P, dA[di], dB[di]) - ductR(ducts[di]));
        // destruição do septo entre i e j
        let dz2 = 0;
        if (fj >= 0) {
          const b2 = alv[fj];
          if (b2.g1 === a.g1) dz2 = dE[i].d1;
          else if (b2.g2 === a.g2) dz2 = 0.93 * Math.min(dE[i].d2, dE[fj].d2);   // restam fiapos de septo
          else dz2 = 0.3 * Math.pow(E, 1.5);                      // poros de Kohn aumentados
        }
        const w = (base + k) * 4;
        info[w] = md; info[w + 1] = fj >= 0 ? 1 : 0; info[w + 2] = dz2; info[w + 3] = a.grad;
      }
    }
    geo.attributes.position.needsUpdate = geo.attributes.normal.needsUpdate = geo.attributes.aRest.needsUpdate = geo.attributes.aInfo.needsUpdate = true;
    // índices ordenados de trás para frente (transparência sem artefatos de ordem)
    const ord = [...Array(NA).keys()];
    if (camera) {
      root.updateMatrixWorld(); camLocal.copy(camera.position); root.worldToLocal(camLocal);
      ord.sort((x, y) => cen[y].distanceToSquared(camLocal) - cen[x].distanceToSquared(camLocal));
    }
    ord.forEach((i, n) => { const o = n * ti.length, base = i * tn; for (let k = 0; k < ti.length; k++) idx[o + k] = ti[k] + base; });
    geo.index.needsUpdate = true;
    wallMat.userData.u.uE.value = E;

    tubes.scale.setScalar(S); tubes.position.copy(pivot).multiplyScalar(1 - S);

    // células inflamatórias: aparecem durante a destruição e rastejam pelas paredes
    const act = clamp(Math.sin(Math.PI * clamp(E * 1.15)) * 1.4);
    const place = (im, n, sdBase, size) => {
      for (let c = 0; c < n; c++) {
        const sd = c * 13.7 + sdBase, i = Math.floor(hash(sd) * NA);
        const vis = act * clamp((act * n - c) / 1.5);
        if (vis <= 0.01) { m4.makeScale(0, 0, 0); im.setMatrixAt(c, m4); continue; }
        const th = hash(sd * 2.3) * 6.283 + t * 0.25 * (hash(sd * 5) - 0.5), ph = Math.acos(2 * hash(sd * 3.1) - 1);
        vv.set(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th));
        // proximidade dos bronquíolos respiratórios (centroacinar): escolhe alvéolos de gradiente baixo
        const a = alv[i].grad < 0.55 || hash(sd * 7) < 0.35 ? i : Math.floor(hash(sd * 11) * NA);
        vv.multiplyScalar(rad[a] * 0.92).add(cen[a]);
        q.setFromEuler(new THREE.Euler(c + t * 0.3, c * 2, 0));
        m4.compose(vv, q, sc.set(size * vis, size * vis * 0.7, size * vis * (1 + 0.15 * Math.sin(t * 2 + c)))); im.setMatrixAt(c, m4);
      }
      im.instanceMatrix.needsUpdate = true;
    };
    place(neut, NC, 3, 0.036);
    place(macs, NC / 2, 51, 0.06);
  }
  update({ breath: 0.5 }, 0, null);
  return { root, update, setCut, box, count: NA, ducts, pivot };
}
