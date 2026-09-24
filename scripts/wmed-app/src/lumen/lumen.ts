// WMed Lumen: camada visual 3D compartilhada (ambiente, sombra de contato, oclusão ambiente, brilho,
// contorno de seleção, câmera suave e materiais com borda luminosa). Protótipo: liga com ?visual=lumen.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { HorizontalBlurShader } from "three/addons/shaders/HorizontalBlurShader.js";
import { VerticalBlurShader } from "three/addons/shaders/VerticalBlurShader.js";

export type LumenTheme = "clinical" | "holo";
export type LumenQuality = "high" | "low";

const params = () => { try { return new URLSearchParams(location.search); } catch { return new URLSearchParams(); } };

/** Padrão desde 24/09/2026. ?visual=classic volta ao visual antigo (e lembra); ?visual=lumen reativa. */
export function lumenEnabled(): boolean {
  const q = params().get("visual");
  try {
    if (q === "classic") localStorage.setItem("wmed-visual", "classic");
    if (q === "lumen") localStorage.removeItem("wmed-visual");
    return q !== "classic" && (q === "lumen" || localStorage.getItem("wmed-visual") !== "classic");
  } catch { return q !== "classic"; }
}

// Palcos ativos por canvas, para o modo apresentação encontrar o palco da cena que está na tela.
const stages = new WeakMap<HTMLCanvasElement, LumenStage>();
export const stageFor = (canvas: HTMLCanvasElement | null | undefined) => (canvas ? stages.get(canvas) : undefined);
/** Escuro do app → holográfico; demais temas → clínico claro. ?lumen=holo|clinical força. */
export function lumenTheme(): LumenTheme {
  const q = params().get("lumen");
  if (q === "holo" || q === "clinical") return q;
  return document.documentElement.dataset.theme === "dark" ? "holo" : "clinical";
}
export function lumenQuality(): LumenQuality {
  const q = params().get("lumenq");
  if (q === "high" || q === "low") return q;
  const touch = matchMedia("(pointer: coarse)").matches, cores = navigator.hardwareConcurrency || 4;
  return touch || cores <= 4 ? "low" : "high";
}

export const THEMES = {
  clinical: { bg: ["#ffffff", "#eef2f7", "#d9e1ea"], rim: "#8fc2ff", rimStrength: 0.28, rimPower: 3.2, env: 0.95, exposure: 1.0,
    shadow: 0.62, outline: "#2f7cff", outlineGlow: 0.2, bloom: 0.2, key: "#ffffff", fill: "#e2edff", back: "#a9ccff", particles: 0, rings: 0 },
  holo: { bg: ["#12294a", "#08121f", "#02050a"], rim: "#46b4ff", rimStrength: 0.95, rimPower: 2.3, env: 0.5, exposure: 1.08,
    shadow: 0.4, outline: "#79dcff", outlineGlow: 1.2, bloom: 0.8, key: "#dcecff", fill: "#2f64a8", back: "#58ccff", particles: 650, rings: 1 },
};

// ---------- Materiais ----------
const rimUniforms = { lumenRimColor: { value: new THREE.Color(THEMES.clinical.rim) }, lumenRimStrength: { value: THEMES.clinical.rimStrength }, lumenRimPower: { value: THEMES.clinical.rimPower } };

/** Material físico com borda luminosa (fresnel). A subclasse mantém o shader ao ser clonado. */
export class LumenMaterial extends THREE.MeshPhysicalMaterial {
  rimBoost = 1;
  constructor(parameters?: THREE.MeshPhysicalMaterialParameters) {
    super(parameters);
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, rimUniforms, { lumenRimBoost: { get value() { return (this as any).__m.rimBoost; } } });
      (shader.uniforms.lumenRimBoost as any).__m = this;
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform vec3 lumenRimColor;uniform float lumenRimStrength,lumenRimPower,lumenRimBoost;")
        .replace("#include <opaque_fragment>", "float lumenF=pow(1.0-saturate(dot(normal,normalize(vViewPosition))),lumenRimPower);\noutgoingLight+=lumenRimColor*lumenF*lumenRimStrength*lumenRimBoost;\n#include <opaque_fragment>");
    };
  }
  customProgramCacheKey() { return "lumen-rim"; }
  copy(source: any) { super.copy(source); this.rimBoost = source.rimBoost ?? 1; return this; }
}

const MEMBRANE = /membran|parede|wall|capsul|envelope|externa|outer|shell|pleura|citoplasma|cytoplasm/i;
/** Troca materiais padrão por LumenMaterial, preservando cor, texturas e transparência. */
export function lumenize(root: THREE.Object3D, opts: { membranes?: boolean } = {}) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || (mesh as any).userData.lumenFx) return;
    const convert = (m: THREE.Material) => {
      if (!(m instanceof THREE.MeshStandardMaterial) || m instanceof LumenMaterial) return m;
      const lm = new LumenMaterial({
        name: m.name, color: m.color, map: m.map, normalMap: m.normalMap, normalScale: m.normalScale, aoMap: m.aoMap,
        emissive: m.emissive, emissiveMap: m.emissiveMap, emissiveIntensity: m.emissiveIntensity, alphaMap: m.alphaMap,
        transparent: m.transparent, opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, alphaTest: m.alphaTest,
        vertexColors: m.vertexColors, flatShading: m.flatShading, clippingPlanes: m.clippingPlanes,
        roughness: THREE.MathUtils.clamp(m.roughness, 0.32, 0.68), metalness: 0,
        clearcoat: 0.3, clearcoatRoughness: 0.35, sheen: 0.45, sheenRoughness: 0.55,
        sheenColor: m.color.clone().lerp(new THREE.Color("#ffffff"), 0.55),
      });
      const label = `${mesh.name} ${m.name} ${mesh.userData.part || ""}`;
      if (opts.membranes !== false && MEMBRANE.test(label)) {
        lm.rimBoost = 1.8; lm.clearcoat = 0.8; lm.clearcoatRoughness = 0.15;
        if (!lm.transparent) { lm.transparent = true; lm.opacity = /citoplasma|cytoplasm/i.test(label) ? 0.55 : 0.82; }
      }
      m.dispose();
      return lm;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(convert) : convert(mesh.material);
  });
}

/** Seleção discreta: brilho interno na cor da marca (o contorno luminoso vem do OutlinePass). */
export function lumenSelection(mesh: THREE.Mesh, theme: LumenTheme) {
  const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((m) => m.clone());
  mesh.material = Array.isArray(mesh.material) ? mats : mats[0];
  const base = mats.map((m: any) => ({ e: m.emissive?.clone(), i: m.emissiveIntensity, o: m.opacity, t: m.transparent, d: m.depthWrite, r: m.rimBoost ?? 1 }));
  const glow = new THREE.Color(THEMES[theme].outline);
  let active = false;
  return (selected: boolean) => {
    if (active === selected) return; active = selected;
    mats.forEach((m: any, i) => {
      if (!m.emissive) return;
      m.emissive.copy(selected ? glow : base[i].e); m.emissiveIntensity = selected ? (theme === "holo" ? 0.35 : 0.18) : base[i].i;
      m.opacity = selected ? 1 : base[i].o; m.transparent = selected ? false : base[i].t; m.depthWrite = selected ? true : base[i].d;
      if (m instanceof LumenMaterial) m.rimBoost = selected ? 2.2 : base[i].r;
      m.needsUpdate = true;
    });
  };
}

// ---------- Fundo ----------
function backdrop(theme: LumenTheme) {
  const c = document.createElement("canvas"); c.width = c.height = 512;
  const g = c.getContext("2d")!, [a, b, e] = THEMES[theme].bg;
  const grad = g.createRadialGradient(256, 210, 10, 256, 260, 380);
  grad.addColorStop(0, a); grad.addColorStop(0.55, b); grad.addColorStop(1, e);
  g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
  const img = g.getImageData(0, 0, 512, 512); // ruído leve evita faixas no degradê
  for (let i = 0; i < img.data.length; i += 4) { const n = (Math.random() - 0.5) * 3; img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------- Sombra de contato (técnica do exemplo webgl_shadow_contact do three.js) ----------
function contactShadow(renderer: THREE.WebGLRenderer) {
  const res = 512, group = new THREE.Group(); group.userData.lumenFx = true;
  const rt = new THREE.WebGLRenderTarget(res, res), rtBlur = new THREE.WebGLRenderTarget(res, res);
  rt.texture.generateMipmaps = rtBlur.texture.generateMipmaps = false;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ map: rt.texture, transparent: true, depthWrite: false, toneMapped: false }));
  plane.renderOrder = 1; plane.scale.y = -1; plane.userData.lumenFx = true; group.add(plane);
  const cam = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1); cam.rotation.x = Math.PI / 2; group.add(cam);
  const depth = new THREE.MeshDepthMaterial(); depth.depthTest = depth.depthWrite = false;
  depth.onBeforeCompile = (s) => { s.fragmentShader = s.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );", "gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * 1.25 );"); };
  const h = new THREE.ShaderMaterial(HorizontalBlurShader), v = new THREE.ShaderMaterial(VerticalBlurShader);
  h.depthTest = v.depthTest = false;
  const quad = new FullScreenQuad();
  return {
    group,
    fit(box: THREE.Box3, opacity: number) {
      const size = box.getSize(new THREE.Vector3()), span = Math.max(size.x, size.z) * 1.9 + size.y * 0.4;
      group.position.set((box.min.x + box.max.x) / 2, box.min.y - size.y * 0.02, (box.min.z + box.max.z) / 2);
      plane.scale.set(span, -span, span);
      Object.assign(cam, { left: -span / 2, right: span / 2, top: span / 2, bottom: -span / 2, far: size.y * 0.9 }); cam.updateProjectionMatrix();
      (plane.material as THREE.MeshBasicMaterial).opacity = opacity;
    },
    update(scene: THREE.Scene) {
      const bg = scene.background, hidden: THREE.Object3D[] = [];
      scene.background = null;
      scene.traverse((o) => { if (o.userData.lumenFx && o.visible) { hidden.push(o); o.visible = false; } });
      scene.overrideMaterial = depth;
      const clear = renderer.getClearAlpha(); renderer.setClearAlpha(0);
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, cam);
      scene.overrideMaterial = null; hidden.forEach((o) => (o.visible = true));
      for (const blur of [2.2, 0.9]) {
        h.uniforms.tDiffuse.value = rt.texture; h.uniforms.h.value = blur / 256; quad.material = h; renderer.setRenderTarget(rtBlur); quad.render(renderer);
        v.uniforms.tDiffuse.value = rtBlur.texture; v.uniforms.v.value = blur / 256; quad.material = v; renderer.setRenderTarget(rt); quad.render(renderer);
      }
      renderer.setRenderTarget(null); renderer.setClearAlpha(clear); scene.background = bg;
    },
    dispose() { rt.dispose(); rtBlur.dispose(); depth.dispose(); h.dispose(); v.dispose(); quad.dispose(); plane.geometry.dispose(); (plane.material as THREE.Material).dispose(); },
  };
}

// ---------- Efeitos holográficos ----------
function holoRings() {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { color: { value: new THREE.Color(THEMES.holo.back) }, time: { value: 0 } },
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: "uniform vec3 color;uniform float time;varying vec2 vUv;void main(){float r=length(vUv-.5)*2.;if(r>1.)discard;float d=abs(fract(r*5.-time*.04)-.5);float ring=smoothstep(.5,.485,d)*0.;ring=1.-smoothstep(0.,.018,abs(d-.49));float core=exp(-r*r*18.)*.16;float fade=pow(1.-smoothstep(.2,1.,r),1.5);gl_FragColor=vec4(color*(ring*.14+core)*fade,1.);}",
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), mat); m.userData.lumenFx = true; m.renderOrder = 2; return m;
}
function particles(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) { const r = 1.4 + Math.random() * 2.6, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1); pos.set([r * Math.sin(p) * Math.cos(t), r * Math.cos(p) * 0.7, r * Math.sin(p) * Math.sin(t)], i * 3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!, grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(0.25, "rgba(160,220,255,.6)"); grad.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.035, map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: THEMES.holo.back, opacity: 0.7, sizeAttenuation: true }));
  pts.userData.lumenFx = true; return pts;
}

class LayerPass extends Pass { constructor(private fn: () => void) { super(); this.needsSwap = false; } render() { this.fn(); } }

// ---------- Palco ----------
export type LumenStage = ReturnType<typeof createStage>;
export function createStage(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, options: { theme?: LumenTheme; quality?: LumenQuality; controls?: any; ao?: boolean } = {}) {
  let theme = options.theme || lumenTheme();
  const quality = options.quality || lumenQuality(), T = () => THEMES[theme];
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer), env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; pmrem.dispose();
  scene.environment = env;
  const lights = new THREE.Group(); lights.userData.lumenFx = true;
  const key = new THREE.DirectionalLight(T().key, 1.6), fill = new THREE.DirectionalLight(T().fill, 0.6), back = new THREE.DirectionalLight(T().back, 1.4);
  key.position.set(3, 5, 4); fill.position.set(-5, 1, 2); back.position.set(-1, 3, -5); lights.add(key, fill, back); scene.add(lights);
  const shadow = contactShadow(renderer); scene.add(shadow.group);
  const rings = holoRings(), dust = particles(THEMES.holo.particles); scene.add(rings, dust);
  let composer: EffectComposer | null = null, gtao: GTAOPass | null = null, outline: OutlinePass | null = null, bloom: UnrealBloomPass | null = null;
  if (quality === "high") {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(scene, camera));
    const fx: THREE.Object3D[] = [rings, dust, shadow.group];
    composer.addPass(new LayerPass(() => fx.forEach((o) => (o.userData.v = o.visible, o.visible = false))));
    // imagens médicas (corte de TC) não recebem oclusão ambiente: o pixel exibido precisa ser o do exame
    if (options.ao !== false) { gtao = new GTAOPass(scene, camera, 1, 1); gtao.blendIntensity = 0.85; composer.addPass(gtao); }
    outline = new OutlinePass(new THREE.Vector2(1, 1), scene, camera); outline.edgeThickness = 1.4; outline.pulsePeriod = 0; composer.addPass(outline);
    composer.addPass(new LayerPass(() => fx.forEach((o) => (o.visible = o.userData.v))));
    // limiar acima de 1: só brilhos HDR (bordas luminosas) florescem; branco de imagem (TC, raio X) não
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.55, 1.02); composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }
  let cinematic = false, lastTick = 0, recording = false;
  let radius = 1, lastSig = "", hover: THREE.Object3D[] = [], selected: THREE.Object3D[] = [], anim: null | { t0: number; from: [THREE.Vector3, THREE.Vector3]; to: [THREE.Vector3, THREE.Vector3] } = null, subject: THREE.Object3D | null = null;
  function applyTheme() {
    const t = T();
    scene.background?.dispose?.(); scene.background = backdrop(theme);
    scene.environmentIntensity = t.env; renderer.toneMappingExposure = t.exposure;
    key.color.set(t.key); fill.color.set(t.fill); back.color.set(t.back);
    rimUniforms.lumenRimColor.value.set(t.rim); rimUniforms.lumenRimStrength.value = t.rimStrength; rimUniforms.lumenRimPower.value = t.rimPower;
    rings.visible = !!t.rings; dust.visible = t.particles > 0;
    if (outline) { outline.visibleEdgeColor.set(t.outline); outline.hiddenEdgeColor.set(t.outline).multiplyScalar(0.25); outline.edgeStrength = theme === "holo" ? 4 : 3; outline.edgeGlow = t.outlineGlow; }
    if (bloom) bloom.strength = t.bloom;
    if (subject) setSubject(subject);
    lastSig = "";
  }
  function setSubject(root: THREE.Object3D) {
    subject = root; root.updateWorldMatrix(true, true);
    const box = new THREE.Box3();
    root.traverse((o) => { if ((o as THREE.Mesh).isMesh && o.visible && !o.userData.lumenFx) box.union(new THREE.Box3().setFromObject(o)); });
    if (box.isEmpty()) return;
    const sphere = box.getBoundingSphere(new THREE.Sphere()); radius = sphere.radius;
    shadow.fit(box, T().shadow); shadow.update(scene);
    rings.position.set(sphere.center.x, box.min.y - radius * 0.03, sphere.center.z); rings.scale.setScalar(radius * 2.8);
    dust.position.copy(sphere.center); dust.scale.setScalar(radius); (dust.material as THREE.PointsMaterial).size = radius * 0.035;
    if (gtao) { gtao.updateGtaoMaterial({ radius: radius * 0.14, distanceExponent: 1.6, thickness: radius * 0.05, scale: 1.2, samples: 16 }); gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 }); gtao.setSceneClipBox(box.clone().expandByScalar(radius * 0.08)); }
    lastSig = "";
  }
  const api = {
    get theme() { return theme; }, quality,
    setTheme(next: LumenTheme) { if (next !== theme) { theme = next; applyTheme(); } },
    setSubject, refreshShadow() { if (subject) { shadow.update(scene); lastSig = ""; } },
    setSize(w: number, h: number) { if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); } lastSig = ""; },
    setHover(objs: THREE.Object3D[]) { if (objs.length !== hover.length || objs.some((o, i) => o !== hover[i])) { hover = objs; lastSig = ""; } },
    setSelected(objs: THREE.Object3D[]) { if (objs.length !== selected.length || objs.some((o, i) => o !== selected[i])) { selected = objs; lastSig = ""; } },
    /** Voo de câmera suave até uma posição e alvo. */
    flyTo(position: THREE.Vector3, target: THREE.Vector3) {
      const c = options.controls; if (!c) { camera.position.copy(position); return; }
      anim = { t0: performance.now(), from: [camera.position.clone(), c.target.clone()], to: [position.clone(), target.clone()] };
    },
    /** Renderiza só quando algo muda (câmera, seleção, animação) ou quando `always` é verdadeiro. */
    render(extraKey = "", always = false) {
      const now = performance.now();
      if (anim && options.controls) {
        const k = Math.min(1, (now - anim.t0) / 850), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        camera.position.lerpVectors(anim.from[0], anim.to[0], e); options.controls.target.lerpVectors(anim.from[1], anim.to[1], e); options.controls.update();
        if (k >= 1) anim = null;
      }
      // Órbita cinematográfica (modo apresentação): giro por tempo, independente da taxa de quadros.
      const dt = Math.min(0.05, (now - (lastTick || now)) / 1000); lastTick = now;
      if (cinematic && options.controls && !anim) {
        const c = options.controls, offset = camera.position.clone().sub(c.target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), dt * (Math.PI * 2) / 14);
        camera.position.copy(c.target).add(offset); camera.lookAt(c.target); c.update();
      }
      const sig = camera.matrixWorld.elements.map((n) => n.toFixed(4)).join() + extraKey;
      if (!always && !anim && !recording && sig === lastSig) return false;
      lastSig = sig;
      if (dust.visible) dust.rotation.y = now * 0.00002;
      (rings.material as THREE.ShaderMaterial).uniforms.time.value = now / 1000;
      if (outline) outline.selectedObjects = [...selected, ...hover];
      if (composer) composer.render(); else renderer.render(scene, camera);
      return true;
    },
    get cinematic() { return cinematic; },
    setCinematic(on: boolean) { cinematic = on; lastSig = ""; },
    /** Imagem com 3840 px de largura (ou a largura pedida), renderizada na hora e baixada como PNG. */
    capture(width = 3840, name = "wmed-3d") {
      const size = renderer.getSize(new THREE.Vector2()), ratio = renderer.getPixelRatio(), scale = Math.min(width / size.x, 4096 / size.y, 6);
      renderer.setPixelRatio(scale); composer?.setPixelRatio(scale); composer?.setSize(size.x, size.y);
      api.render("", true); const url = renderer.domElement.toDataURL("image/png");
      renderer.setPixelRatio(ratio); composer?.setPixelRatio(ratio); composer?.setSize(size.x, size.y); lastSig = ""; api.render("", true);
      const a = document.createElement("a"); a.href = url; a.download = `${name}.png`; a.click();
    },
    /** Grava um giro completo do canvas (MP4 quando o navegador aceita, senão WebM). */
    async record(seconds = 14, name = "wmed-3d", onProgress?: (fraction: number) => void) {
      const canvas = renderer.domElement as HTMLCanvasElement;
      if (!("captureStream" in canvas) || typeof MediaRecorder === "undefined") throw Error("Seu navegador não permite gravar vídeo desta cena.");
      const type = ["video/mp4;codecs=avc1.640028", "video/mp4", "video/webm;codecs=vp9", "video/webm"].find((t) => MediaRecorder.isTypeSupported(t)) || "";
      const stream = (canvas as any).captureStream(60), rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 16_000_000 }), chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<void>((resolve) => (rec.onstop = () => resolve()));
      const was = cinematic; cinematic = true; recording = true; rec.start(250);
      const t0 = performance.now();
      await new Promise<void>((resolve) => { const tick = () => { const f = (performance.now() - t0) / (seconds * 1000); onProgress?.(Math.min(1, f)); if (f >= 1) resolve(); else setTimeout(tick, 100); }; tick(); });
      rec.stop(); await done; recording = false; cinematic = was; stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      const blob = new Blob(chunks, { type: type.split(";")[0] || "video/webm" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `${name}.${blob.type.includes("mp4") ? "mp4" : "webm"}`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    },
    dispose() {
      stages.delete(renderer.domElement);
      composer?.dispose(); gtao?.dispose(); outline?.dispose(); bloom?.dispose(); shadow.dispose(); env.dispose();
      (scene.background as THREE.Texture | null)?.dispose?.();
      rings.geometry.dispose(); (rings.material as THREE.Material).dispose(); dust.geometry.dispose(); (dust.material as THREE.PointsMaterial).map?.dispose(); (dust.material as THREE.Material).dispose();
      scene.remove(lights, shadow.group, rings, dust);
    },
  };
  applyTheme();
  stages.set(renderer.domElement, api as LumenStage);
  return api;
}
