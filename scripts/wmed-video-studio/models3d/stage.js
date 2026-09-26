// Palco 3D comum dos modelos 2Doctor: renderizador, luz de estúdio, fundo da marca e material com borda luminosa.
// Todo quadro é função pura de t (renderAt), para renderização quadro a quadro no puppeteer.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

export const BRAND = { ink: 0x1a2c3e, teal: 0x265b5a, tealLight: 0x6fb3ae, mint: 0x9fd8cf, bg: 0x0e1a26, bone: 0xe8efee, pink: 0xd98c8c, amber: 0xe3b065, red: 0xe07a74 };

// look: 'studio' (original) ou 'doc' (documentário: luz quente de lado, contraluz azul, vinheta, grão e foco raso).
// dof: {focus, aperture, maxblur} liga a profundidade de campo; stage.setFocus(dist) move o foco por quadro.
// ao: oclusão de ambiente (GTAO), dá volume às dobras e cavidades.
export function createStage(canvas, { width = 1080, height = 1920, bloom = 0.22, look = 'studio', dof = null, ao = false } = {}) {
  const doc = look === 'doc';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = doc ? THREE.ACESFilmicToneMapping : THREE.NeutralToneMapping;
  renderer.toneMappingExposure = doc ? 1.0 : 1.05;
  const scene = new THREE.Scene();
  scene.background = gradientBg(doc);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = doc ? 0.35 : 1;
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 5000);
  const lights = {};
  if (doc) {
    lights.key = new THREE.DirectionalLight(0xffc98f, 2.6); lights.key.position.set(-500, 300, 400);
    lights.rim = new THREE.DirectionalLight(0x6fa8ff, 2.2); lights.rim.position.set(450, 250, -500);
    lights.fill = new THREE.DirectionalLight(0x9fd8cf, 0.35); lights.fill.position.set(300, -200, 500);
    lights.amb = new THREE.AmbientLight(0x2a3b4a, 0.35);
  } else {
    lights.key = new THREE.DirectionalLight(0xffffff, 1.6); lights.key.position.set(-300, 500, 600);
    lights.rim = new THREE.DirectionalLight(0x9fd8cf, 1.2); lights.rim.position.set(400, 200, -500);
    lights.amb = new THREE.AmbientLight(0x6f8a99, 0.25);
  }
  Object.values(lights).forEach((l) => scene.add(l));
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  let gtao = null, bokeh = null;
  if (ao) { gtao = new GTAOPass(scene, camera, width, height); gtao.blendIntensity = 0.9; composer.addPass(gtao); }
  if (dof) { bokeh = new BokehPass(scene, camera, { focus: dof.focus ?? 5, aperture: dof.aperture ?? 0.004, maxblur: dof.maxblur ?? 0.008 }); composer.addPass(bokeh); }
  if (bloom > 0) composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), bloom, 0.45, 0.9));
  composer.addPass(new OutputPass());
  let grade = null;
  if (doc) { grade = new ShaderPass(GRADE); grade.uniforms.aspect.value = width / height; composer.addPass(grade); }
  const stage = {
    renderer, scene, camera, composer, lights, width, height,
    setFocus(d, aperture) { if (!bokeh) return; bokeh.uniforms.focus.value = d; if (aperture != null) bokeh.uniforms.aperture.value = aperture; },
    setTime(t) { if (grade) grade.uniforms.seed.value = (Math.floor(t * 24) % 997) * 0.618; },
    render: () => composer.render(),
  };
  return stage;
}

// Vinheta, grão de filme determinístico (semente = número do quadro) e leve separação quente/fria nas sombras.
const GRADE = {
  uniforms: { tDiffuse: { value: null }, seed: { value: 0 }, aspect: { value: 9 / 16 }, grain: { value: 0.045 }, vig: { value: 0.55 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float seed, aspect, grain, vig; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 q = (vUv - 0.5) * vec2(aspect, 1.0) / max(aspect, 1.0);
      float v = smoothstep(0.85, 0.2, length(q) * 1.25);
      c.rgb *= mix(1.0 - vig, 1.0, v);
      float l = dot(c.rgb, vec3(0.299,0.587,0.114));
      c.rgb += mix(vec3(-0.012,0.0,0.03), vec3(0.02,0.008,-0.012), smoothstep(0.1,0.6,l));
      c.rgb += (h(vUv * 1000.0) - 0.5) * grain;
      gl_FragColor = c;
    }`,
};

function gradientBg(doc) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 90, 4, 32, 110, 200);
  if (doc) { gr.addColorStop(0, '#1a2a36'); gr.addColorStop(0.5, '#0c1620'); gr.addColorStop(1, '#05090d'); }
  else { gr.addColorStop(0, '#1b3342'); gr.addColorStop(0.55, '#0f1e2b'); gr.addColorStop(1, '#0a141d'); }
  g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Material com borda luminosa (fresnel) — dá a leitura "vidro clínico" sem transmissão cara.
export function rimMaterial({ color = BRAND.tealLight, rimColor = BRAND.mint, opacity = 1, rimPower = 2.2, rimStrength = 0.9, roughness = 0.45, metalness = 0.0, transparent = false, side = THREE.FrontSide, emissive = 0x000000 } = {}) {
  const m = new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent: transparent || opacity < 1, opacity, side, emissive, depthWrite: opacity >= 1 });
  m.userData.rim = { value: rimStrength };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.rimColor = { value: new THREE.Color(rimColor) };
    sh.uniforms.rimPower = { value: rimPower };
    sh.uniforms.rimStrength = m.userData.rim;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 rimColor; uniform float rimPower; uniform float rimStrength;')
      .replace('#include <opaque_fragment>', `
        float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), rimPower);
        outgoingLight += rimColor * fres * rimStrength;
        diffuseColor.a = clamp(diffuseColor.a + fres * rimStrength * 0.55, 0.0, 1.0);
        #include <opaque_fragment>`);
  };
  return m;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (u) => (u = clamp(u), u * u * (3 - 2 * u));
export const seg = (t, a, b) => clamp((t - a) / (b - a));

// ---------- Texturas procedurais de tecido (determinísticas) ----------
// Ruído de valor tileável com oitavas; kind: 'cells' (mosaico celular), 'fibers' (fibras numa direção), 'wet' (mucosa lisa).
function vnoise(n, seed) { const a = new Float32Array(n * n); let s = seed * 9301 + 49297; for (let i = 0; i < a.length; i++) { s = (s * 9301 + 49297) % 233280; a[i] = s / 233280; } return a; }
function sampleTile(a, n, x, y) { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi; const g = (i, j) => a[((j % n + n) % n) * n + ((i % n + n) % n)]; const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy); return (g(xi, yi) * (1 - sx) + g(xi + 1, yi) * sx) * (1 - sy) + (g(xi, yi + 1) * (1 - sx) + g(xi + 1, yi + 1) * sx) * sy; }
export function tissueHeight(size = 256, { kind = 'cells', seed = 1, cell = 18, stretch = 6 } = {}) {
  const H = new Float32Array(size * size);
  const oct = [8, 16, 32, 64].map((n, k) => ({ n, a: vnoise(n, seed + k * 17), w: 0.5 ** k }));
  // pontos de Worley numa grade tileável
  const gc = Math.max(2, Math.round(size / cell)), pts = vnoise(gc * gc * 2, seed + 99);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let fbm = 0; for (const o of oct) fbm += o.w * sampleTile(o.a, o.n, (x / size) * o.n * (kind === 'fibers' ? 1 / stretch : 1), (y / size) * o.n);
    let h = fbm / 1.875;
    if (kind === 'cells') {
      const cx = (x / size) * gc, cy = (y / size) * gc; let d1 = 9, d2 = 9;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
        const gx = Math.floor(cx) + i, gy = Math.floor(cy) + j, k = (((gy % gc) + gc) % gc) * gc + (((gx % gc) + gc) % gc);
        const px = gx + pts[k * 2], py = gy + pts[k * 2 + 1], d = Math.hypot(px - cx, py - cy);
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      h = 0.65 * Math.min(1, (d2 - d1) * 2.2) + 0.35 * h;      // bordas das células afundam
    } else if (kind === 'fibers') {
      h = 0.5 + 0.5 * Math.sin((y / size) * Math.PI * 2 * cell + h * 6);
      h = 0.6 * h + 0.4 * fbm / 1.875;
    }
    H[y * size + x] = h;
  }
  return H;
}
const texCache = new Map();
export function tissueMaps(opts = {}) {
  const size = opts.size || 256, key = JSON.stringify(opts);
  if (texCache.has(key)) return texCache.get(key);
  const H = tissueHeight(size, opts), str = opts.strength ?? 2.5;
  const nc = document.createElement('canvas'); nc.width = nc.height = size; const nx = nc.getContext('2d'), nd = nx.createImageData(size, size);
  const rc = document.createElement('canvas'); rc.width = rc.height = size; const rx = rc.getContext('2d'), rd = rx.createImageData(size, size);
  const at = (x, y) => H[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * str, dy = (at(x, y + 1) - at(x, y - 1)) * str, l = Math.hypot(dx, dy, 1), i = (y * size + x) * 4;
    nd.data[i] = (-dx / l * 0.5 + 0.5) * 255; nd.data[i + 1] = (-dy / l * 0.5 + 0.5) * 255; nd.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; nd.data[i + 3] = 255;
    const r = 255 * (0.35 + 0.5 * (1 - at(x, y))); rd.data[i] = rd.data[i + 1] = rd.data[i + 2] = r; rd.data[i + 3] = 255;
  }
  nx.putImageData(nd, 0, 0); rx.putImageData(rd, 0, 0);
  const mk = (c) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
  const out = { normalMap: mk(nc), roughnessMap: mk(rc), height: H, size };
  texCache.set(key, out);
  return out;
}
// Material de tecido vivo: physical com sheen (aparência de subsuperfície barata), mapa de normais procedural,
// camada úmida (clearcoat) e borda luminosa leve. repeat = quantas vezes a textura se repete.
export function tissueMaterial({ color = 0xc46a6e, sheen = 0xffb3a8, kind = 'cells', seed = 1, cell = 18, repeat = [4, 4], normal = 0.8, wet = 0.5, roughness = 0.55, rim = 0.12, rimColor = 0xffd0c8, side = THREE.FrontSide, transparent = false, opacity = 1, emissive = 0x000000 } = {}) {
  const maps = tissueMaps({ kind, seed, cell });
  const nm = maps.normalMap.clone(); nm.repeat.set(...repeat); nm.needsUpdate = true;
  const rm = maps.roughnessMap.clone(); rm.repeat.set(...repeat); rm.needsUpdate = true;
  const m = new THREE.MeshPhysicalMaterial({ color, roughness, normalMap: nm, normalScale: new THREE.Vector2(normal, normal), roughnessMap: rm, sheen: 0.6, sheenColor: new THREE.Color(sheen), sheenRoughness: 0.5, clearcoat: wet, clearcoatRoughness: 0.25, side, transparent: transparent || opacity < 1, opacity, emissive });
  addRim(m, rimColor, rim);
  return m;
}
export function addRim(m, rimColor = BRAND.mint, strength = 0.5, power = 2.2) {
  m.userData.rim = { value: strength };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.rimColor = { value: new THREE.Color(rimColor) }; sh.uniforms.rimPower = { value: power }; sh.uniforms.rimStrength = m.userData.rim;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 rimColor; uniform float rimPower; uniform float rimStrength;')
      .replace('#include <opaque_fragment>', `
        float fres = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), rimPower);
        outgoingLight += rimColor * fres * rimStrength;
        #include <opaque_fragment>`);
  };
  return m;
}
// UV cilíndrica para geometrias de casca geradas à mão (u = ângulo, v = comprimento).
export function cylUV(geo, axis = 'x', len = 1) {
  const p = geo.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const [a, b, c] = axis === 'x' ? [x, y, z] : axis === 'y' ? [y, z, x] : [z, x, y];
    uv[i * 2] = (Math.atan2(c, b) / (Math.PI * 2) + 1) % 1; uv[i * 2 + 1] = a / len + 0.5;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo;
}
