// Modelo do fígado, 100% procedural (campo implícito em liver-geom.js → surface nets), sem malhas de terceiros.
// Anatomia: lobo direito volumoso, lobo esquerdo afilando para a esquerda, incisura/ligamento falciforme,
// lobo caudado posterior, porta hepatis na face visceral, vesícula biliar sob o lobo direito,
// veia porta / artéria hepática / colédoco no hilo e veia cava inferior atrás.
// Parâmetros animáveis (0..1), aplicados em update(p) — função pura dos parâmetros:
//   fibrosis (septos fibrosos claros na superfície), nodules (nódulos de regeneração em relevo, Worley),
//   shrink (fígado cirrótico menor, lobo direito atrófico, borda romba), tone (cor saudável → castanho-amarelado fosco;
//   padrão = max(nodules, 0.7·fibrosis)), steatosis (amarelado, aumentado, liso), inflam (placas avermelhadas),
//   spots [{p:[x,y,z], r, a, c:[r,g,b]}] (brilhos locais em coordenadas do fígado, ex. onde a agressão chega), scan {apex, dir, normal, half, depth, on}
//   (faixa luminosa onde o feixe de ultrassom corta o órgão).
import * as THREE from 'three';
import { tissueMaterial, rimMaterial, clamp } from './stage.js';
import { buildLiverMesh, liverSDF, SHAPES } from './liver-geom.js';

const C = (hex) => new THREE.Color(hex);          // hex sRGB → linear
const DEF_GLOW = [1.0, 0.45, 0.15];
const PAL = {
  healthy: C(0x6e2620), healthy2: C(0x86362a), fatty: C(0xc49a62),
  nod: [C(0xb07a42), C(0x9c6a3c), C(0xba8a50), C(0x8e6038), C(0xa8743e)], septa: C(0xd6ccbc), red: C(0xa8261e),
};

export function liverMaterial() {
  const m = tissueMaterial({ color: 0xffffff, sheen: 0x9a4436, kind: 'cells', seed: 7, cell: 12, repeat: [14, 10], normal: 0.32, wet: 0.7, roughness: 0.4, rim: 0.1, rimColor: 0xffc4b0 });
  m.vertexColors = true;
  m.sheen = 0.25;
  const U = {
    uGlowCol: { value: C(0xffb070) }, uScan: { value: new THREE.Vector4(1, 0, 0, 99) }, uScanOn: { value: 0 }, uScanCol: { value: C(0x9fe8ff) },
    uFanApex: { value: new THREE.Vector3() }, uFanDir: { value: new THREE.Vector3(0, -1, 0) }, uFanCos: { value: 0.8 }, uFanDepth: { value: 2 },
  };
  m.userData.U = U;
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    prev(sh, r);
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 aGlow; varying vec3 vGlow; varying vec3 vLW;')
      .replace('#include <fog_vertex>', '#include <fog_vertex>\nvGlow = aGlow; vLW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vGlow; varying vec3 vLW; uniform vec3 uGlowCol, uScanCol, uFanApex, uFanDir; uniform vec4 uScan; uniform float uScanOn, uFanCos, uFanDepth;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += vGlow;
        if (uScanOn > 0.001) {
          float dp = dot(vLW, uScan.xyz) - uScan.w;
          vec3 rel = vLW - uFanApex; float L = length(rel);
          float inFan = smoothstep(uFanCos - 0.02, uFanCos + 0.02, dot(rel / max(L, 1e-4), uFanDir)) * (1.0 - smoothstep(uFanDepth * 0.9, uFanDepth, L));
          totalEmissiveRadiance += uScanCol * uScanOn * inFan * (exp(-dp * dp / 0.00012) * 1.6 + exp(-dp * dp / 0.004) * 0.25);
        }`);
  };
  m.customProgramCacheKey = () => 'liver-v1';
  return m;
}

// ponto da superfície ao longo de um raio de dentro (o) para fora (dir): bissecção no SDF
function rayHit(f, o, dir, maxT = 2) {
  let a = 0, b = maxT;
  for (let i = 0; i < 40; i++) { const m = (a + b) / 2; f(o[0] + dir[0] * m, o[1] + dir[1] * m, o[2] + dir[2] * m) < 0 ? (a = m) : (b = m); }
  return [o[0] + dir[0] * a, o[1] + dir[1] * a, o[2] + dir[2] * a];
}
function sdfNormal(f, [x, y, z], e = 1e-3) {
  const v = new THREE.Vector3(f(x + e, y, z) - f(x - e, y, z), f(x, y + e, z) - f(x, y - e, z), f(x, y, z + e) - f(x, y, z - e));
  return v.normalize();
}

export function buildLiver(stage, { vessels = true, gallbladder = true, ligament = true, parent = null } = {}) {
  const root = new THREE.Group(); (parent || stage.scene).add(root);
  const M = buildLiverMesh();
  const n = M.count;
  const geo = new THREE.BufferGeometry();
  const pos = new THREE.BufferAttribute(new Float32Array(M.A), 3);
  geo.setAttribute('position', pos);
  geo.setIndex(new THREE.BufferAttribute(M.index, 1));
  geo.computeVertexNormals();
  const nRef = new Float32Array(geo.attributes.normal.array);
  // UV cilíndrica em torno do eixo x (o fígado é alongado em x); costura na face posterior, pouco vista
  const uv = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { uv[i * 2] = (Math.atan2(M.A[i * 3 + 1] - 0.05, M.A[i * 3 + 2]) / (Math.PI * 2) + 0.5); uv[i * 2 + 1] = M.A[i * 3] * 0.45 + 0.5; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const col = new THREE.BufferAttribute(new Float32Array(n * 3), 3); geo.setAttribute('color', col);
  const glow = new THREE.BufferAttribute(new Float32Array(n * 3), 3); geo.setAttribute('aGlow', glow);
  const mat = liverMaterial();
  const mesh = new THREE.Mesh(geo, mat); root.add(mesh);

  const fA = (x, y, z) => liverSDF(x, y, z, SHAPES.healthy), fB = (x, y, z) => liverSDF(x, y, z, SHAPES.cirrhotic);
  const extras = { shrinkables: [] };

  // ligamento falciforme: lâmina fina da incisura anterior subindo sobre a face diafragmática
  if (ligament) {
    const N = 40, mk = (f) => {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const a = -0.28 + (i / N) * 1.95, o = [0.1, 0.05, -0.05];
        const dir = [0.0, Math.sin(a), Math.cos(a)];
        const p = rayHit(f, o, dir); const nn = sdfNormal(f, p);
        const hgt = 0.055 * (1 - i / N) ** 1.2 + 0.004;
        pts.push([p, nn, hgt]);
      }
      return pts;
    };
    const PA = mk(fA), PB = mk(fB);
    const lg = new THREE.BufferGeometry(), lp = new Float32Array((N + 1) * 2 * 3), li = [];
    for (let i = 0; i < N; i++) { const a = i * 2; li.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    lg.setAttribute('position', new THREE.BufferAttribute(lp, 3)); lg.setIndex(li);
    const lmat = rimMaterial({ color: 0xd8a898, rimColor: 0xffe0d4, opacity: 0.4, rimStrength: 0.3, roughness: 0.3, side: THREE.DoubleSide });
    const lig = new THREE.Mesh(lg, lmat); root.add(lig);
    extras.ligament = (s) => {
      for (let i = 0; i <= N; i++) {
        const [pa, na, h] = PA[i], [pb, nb] = PB[i];
        for (let k = 0; k < 3; k++) {
          const p = pa[k] + (pb[k] - pa[k]) * s, nk = [na.x, na.y, na.z][k] * (1 - s) + [nb.x, nb.y, nb.z][k] * s;
          lp[(i * 2) * 3 + k] = p - nk * 0.01; lp[(i * 2 + 1) * 3 + k] = p + nk * h;
        }
      }
      lg.attributes.position.needsUpdate = true; lg.computeVertexNormals();
    };
    // ligamento redondo: cordão saindo da incisura para baixo e para a frente
    const teres = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.09, -0.06, 0.36), new THREE.Vector3(0.1, -0.16, 0.48), new THREE.Vector3(0.11, -0.26, 0.58)]), 16, 0.012, 8), rimMaterial({ color: 0xc89484, rimColor: 0xfff0e6, rimStrength: 0.3, roughness: 0.35 }));
    root.add(teres); extras.teres = teres;
  }

  // vesícula biliar: pera (lathe) no leito sob o lobo direito, fundo aparecendo na borda inferior
  if (gallbladder) {
    const prof = [];
    for (let i = 0; i <= 28; i++) { const s = i / 28; const cap = s > 0.78 ? Math.sqrt(Math.max(0, 1 - ((s - 0.78) / 0.22) ** 2)) : 1; prof.push(new THREE.Vector2(Math.max(0.0005, 0.088 * Math.min(1, s / 0.7) ** 0.75 * cap), s * 0.62)); }
    const gg = new THREE.LatheGeometry(prof, 28);
    const gmat = tissueMaterial({ color: 0x5c7a38, sheen: 0xb8d890, kind: 'wet', seed: 3, repeat: [3, 2], normal: 0.15, wet: 1, roughness: 0.25, rim: 0.25, rimColor: 0xdaf0b0 });
    const gb = new THREE.Mesh(gg, gmat);
    const a = new THREE.Vector3(-0.13, -0.25, -0.14), b = new THREE.Vector3(-0.25, -0.37, 0.46);
    gb.position.copy(a); gb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    gb.scale.set(1, a.distanceTo(b) / 0.62, 1);
    root.add(gb); extras.gb = gb;
  }

  // vasos do hilo: veia porta (roxo-azulado), artéria hepática (vermelha), colédoco (verde) e VCI
  if (vessels) {
    const tube = (pts, r, color, rim = 0x9fd8cf) => {
      const cv = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
      const m = new THREE.Mesh(new THREE.TubeGeometry(cv, 48, r, 14), tissueMaterial({ color, sheen: 0xffffff, kind: 'wet', seed: 5, repeat: [2, 6], normal: 0.2, wet: 0.9, roughness: 0.3, rim: 0.2, rimColor: rim }));
      root.add(m); return { mesh: m, curve: cv };
    };
    extras.portal = tube([[0.2, -0.8, -0.01], [0.13, -0.66, -0.03], [0.02, -0.46, -0.06], [-0.08, -0.33, -0.08], [-0.22, -0.26, -0.1]], 0.058, 0x5a3f78, 0xb8a8ff);
    extras.portalL = tube([[-0.04, -0.34, -0.08], [0.08, -0.26, -0.1], [0.2, -0.2, -0.12]], 0.035, 0x5a3f78, 0xb8a8ff);
    extras.artery = tube([[0.28, -0.8, 0.09], [0.2, -0.62, 0.07], [0.06, -0.42, 0.02], [-0.06, -0.3, -0.02], [-0.18, -0.24, -0.04]], 0.02, 0xb02a2c, 0xffb0a0);
    extras.duct = tube([[-0.08, -0.8, 0.08], [-0.08, -0.66, 0.05], [-0.1, -0.44, 0.0], [-0.16, -0.32, -0.02]], 0.024, 0x6f8a36, 0xe0f0a0);
    extras.cystic = tube([[-0.09, -0.52, 0.03], [-0.13, -0.42, -0.02], [-0.13, -0.33, -0.06]], 0.012, 0x6f8a36, 0xe0f0a0);
    extras.ivc = tube([[-0.06, -0.72, -0.52], [-0.06, -0.3, -0.52], [-0.05, 0.2, -0.5], [-0.04, 0.72, -0.46]], 0.1, 0x3c3258, 0x9fa8ff);
  }

  const cA = new THREE.Color(), cT = new THREE.Color();
  function update(p = {}) {
    const fib = clamp(p.fibrosis || 0), nd = clamp(p.nodules || 0), sh = clamp(p.shrink || 0), st = clamp(p.steatosis || 0), inf = clamp(p.inflam || 0);
    const tone = clamp(p.tone ?? Math.max(nd, fib * 0.35));
    const P = pos.array, CO = col.array, GL = glow.array, spots = p.spots || [];
    for (let i = 0; i < n; i++) {
      const i3 = i * 3, nx = nRef[i3], ny = nRef[i3 + 1], nz = nRef[i3 + 2];
      const disp = 0.04 * nd * (M.nod[i] - 0.4) + 0.008 * nd * (M.mic[i] - 0.5) - 0.006 * fib * M.sept[i] + 0.022 * st;
      for (let k = 0; k < 3; k++) P[i3 + k] = M.A[i3 + k] + (M.B[i3 + k] - M.A[i3 + k]) * sh + nRef[i3 + k] * disp;
      // cor: saudável (mosqueado lobular sutil) → esteatose → castanho-amarelado nodular → septos claros
      cA.copy(PAL.healthy).lerp(PAL.healthy2, M.mic[i] * 0.35);
      cA.lerp(PAL.fatty, st * 0.75);
      cT.copy(PAL.nod[Math.floor(M.cid[i] * 5) % 5]).multiplyScalar(0.8 + 0.3 * M.nod[i]);
      cA.lerp(cT, tone);
      if (inf > 0) cA.lerp(PAL.red, inf * 0.55 * clamp((M.cid[i] - 0.45) * 3) * (0.6 + 0.4 * M.mic[i]));
      cA.lerp(PAL.septa, fib * 0.85 * M.sept[i] ** 2);
      CO[i3] = cA.r; CO[i3 + 1] = cA.g; CO[i3 + 2] = cA.b;
      let gr = 0, gg = 0, gb = 0;
      for (const s of spots) {
        const dx = P[i3] - s.p[0], dy = P[i3 + 1] - s.p[1], dz = P[i3 + 2] - s.p[2], d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > s.r * s.r * 9) continue;
        const g = s.a * Math.exp(-d2 / (s.r * s.r)), c = s.c || DEF_GLOW; gr += g * c[0]; gg += g * c[1]; gb += g * c[2];
      }
      GL[i3] = gr; GL[i3 + 1] = gg; GL[i3 + 2] = gb;
    }
    pos.needsUpdate = true; col.needsUpdate = true; glow.needsUpdate = true;
    geo.computeVertexNormals();
    // brilho úmido some com a cirrose (superfície fosca), a esteatose deixa mais pálido/brilhante
    mat.roughness = 0.4 + 0.3 * tone; mat.clearcoat = 0.7 - 0.55 * tone; mat.clearcoatRoughness = 0.22 + 0.3 * tone;
    mat.normalScale.setScalar(0.32 + 0.25 * nd);
    const U = mat.userData.U, sc = p.scan;
    U.uScanOn.value = sc ? sc.on ?? 1 : 0;
    if (sc) {
      U.uScan.value.set(sc.normal.x, sc.normal.y, sc.normal.z, sc.normal.dot(sc.apex));
      U.uFanApex.value.copy(sc.apex); U.uFanDir.value.copy(sc.dir); U.uFanCos.value = Math.cos(sc.half); U.uFanDepth.value = sc.depth;
    }
    if (extras.ligament) extras.ligament(sh);
  }
  update({});
  // ponto e normal da superfície (forma interpolada) para ancorar partículas, anéis etc.
  const surf = (i, s = 0) => {
    const i3 = i * 3;
    return { p: new THREE.Vector3(M.A[i3] + (M.B[i3] - M.A[i3]) * s, M.A[i3 + 1] + (M.B[i3 + 1] - M.A[i3 + 1]) * s, M.A[i3 + 2] + (M.B[i3 + 2] - M.A[i3 + 2]) * s), n: new THREE.Vector3(nRef[i3], nRef[i3 + 1], nRef[i3 + 2]) };
  };
  // vértice mais próximo de uma direção vista do centro (para escolher pontos de ancoragem estáveis)
  const nearest = (x, y, z) => { let b = 0, bd = 1e9; for (let i = 0; i < n; i++) { const d = (M.A[i * 3] - x) ** 2 + (M.A[i * 3 + 1] - y) ** 2 + (M.A[i * 3 + 2] - z) ** 2; if (d < bd) { bd = d; b = i; } } return b; };
  return { root, mesh, mat, geo, update, surf, nearest, M, extras, sdf: { fA, fB } };
}
