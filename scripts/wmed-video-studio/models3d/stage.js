// Palco 3D comum dos modelos 2Doctor: renderizador, luz de estúdio, fundo da marca e material com borda luminosa.
// Todo quadro é função pura de t (renderAt), para renderização quadro a quadro no puppeteer.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export const BRAND = { ink: 0x1a2c3e, teal: 0x265b5a, tealLight: 0x6fb3ae, mint: 0x9fd8cf, bg: 0x0e1a26, bone: 0xe8efee, pink: 0xd98c8c, amber: 0xe3b065, red: 0xe07a74 };

export function createStage(canvas, { width = 1080, height = 1920, bloom = 0.22 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.background = gradientBg();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 5000);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-300, 500, 600); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fd8cf, 1.2); rim.position.set(400, 200, -500); scene.add(rim);
  scene.add(new THREE.AmbientLight(0x6f8a99, 0.25));
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (bloom > 0) composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), bloom, 0.45, 0.9));
  composer.addPass(new OutputPass());
  return { renderer, scene, camera, composer, render: () => composer.render() };
}

function gradientBg() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 90, 4, 32, 110, 200);
  gr.addColorStop(0, '#1b3342'); gr.addColorStop(0.55, '#0f1e2b'); gr.addColorStop(1, '#0a141d');
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
