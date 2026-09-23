import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RotateCcw, Download, Move3D } from "lucide-react";
import { drawSlice, type Volume } from "./volume";
import { prepareSelection } from "./selection";
import {applyAtlasMaterial,findAtlasPart} from "./atlasMaterials";

type Props = {
  urls?: string[];
  volume?: Volume;
  slice?: number;
  window?: string;
  opacity?: number;
  selected?: string;
  isolate?: boolean;
  rotate?: boolean;
  onSelect?: (name: string) => void;
  onReady?: () => void;
  minimal?: boolean;
  anatomyMaterials?: boolean;
};
function release(object: THREE.Object3D) {
  object.traverse((o) => {
    const mesh = o as THREE.Mesh;
    mesh.geometry?.dispose();
    if (mesh.material) {
      for (const material of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        for (const value of Object.values(material))
          if (value instanceof THREE.Texture) value.dispose();
        material.dispose();
      }
    }
  });
}
export default function Scene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{
    reset: () => void;
    snapshot: () => void;
    focus: (selected: string) => void;
    root: THREE.Group;
    plane?: THREE.Mesh;
    texture?: THREE.CanvasTexture;
  }>();
  const isolatedBefore = useRef(false);
  const latest = useRef(props);
  latest.current = props;
  const [status, setStatus] = useState("Abrindo cena 3D…");
  const [failed, setFailed] = useState(false);
  const sourceKey = props.urls?.join("|") || "";
  useEffect(() => {
    const el = host.current!;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    setFailed(false);
    setStatus("Abrindo cena 3D…");
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      setStatus(
        "Seu navegador não disponibilizou o 3D. Abra em um navegador com WebGL.",
      );
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "Modelo 3D: arraste para girar e use a roda para aproximar",
    );
    const scene = new THREE.Scene();
    const root = new THREE.Group();
    scene.add(root);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 2000);
    camera.position.set(0, 0, 5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.autoRotateSpeed = 0.7;
    scene.add(new THREE.HemisphereLight(0xe9f6ff, 0x677a98, 1.7));
    for (const [x, y, z, power] of [
      [3, 5, 4, 2],
      [-4, 1, 2, 1],
      [0, 3, -4, 1.8],
    ]) {
      const light = new THREE.DirectionalLight(0xffffff, power);
      light.position.set(x, y, z);
      scene.add(light);
    }
    const resize = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const nextAspect = width / height;
      const scale = Math.max(1, 1 / nextAspect) / Math.max(1, 1 / camera.aspect);
      if (root.children.length && Math.abs(scale - 1) > 0.001) {
        camera.position.sub(controls.target).multiplyScalar(scale).add(controls.target);
        initial.multiplyScalar(scale);
        controls.minDistance *= scale;
        controls.maxDistance *= scale;
        camera.far = Math.max(camera.far, camera.position.distanceTo(controls.target) * 10);
        controls.update();
      }
      renderer.setSize(width, height, false);
      camera.aspect = nextAspect;
      camera.updateProjectionMatrix();
    });
    resize.observe(el);
    let initial = new THREE.Vector3(0, 0, 5);
    const fit = () => {
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      root.position.sub(center);
      const d =
        Math.max(size.y, size.x / Math.max(camera.aspect, 0.1), size.z) * 2.05;
      initial.set(
        d * (props.volume ? 0.6 : 0.12),
        d * (props.volume ? 0.4 : 0.07),
        d,
      );
      camera.position.copy(initial);
      camera.near = d / 1000;
      camera.far = d * 15;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.minDistance = d * 0.22;
      controls.maxDistance = d * 3;
      controls.update();
    };
    const highlights = new Map<THREE.Mesh, (selected: boolean) => void>();
    let plane: THREE.Mesh | undefined;
    let texture: THREE.CanvasTexture | undefined;
    const load = async () => {
      if (props.volume) {
        const v = props.volume;
        const [nx, ny, nz] = v.meta.dims;
        const [sx, sy, sz] = v.meta.spacing;
        const positions: number[] = [];
        const colors: number[] = [];
        const palette = new Map(
          v.meta.estruturas.map((e) => [e.id, new THREE.Color(e.cor)]),
        );
        for (let z = 1; z < nz - 1; z++)
          for (let y = 1; y < ny - 1; y++)
            for (let x = 1; x < nx - 1; x++) {
              const i = x + nx * (y + ny * z);
              const id = v.labels[i];
              if (!id) continue;
              if (
                v.labels[i - 1] === id &&
                v.labels[i + 1] === id &&
                v.labels[i - nx] === id &&
                v.labels[i + nx] === id &&
                v.labels[i - nx * ny] === id &&
                v.labels[i + nx * ny] === id
              )
                continue;
              const c = palette.get(id) || new THREE.Color("#a5cbe5");
              positions.push(
                (x - (nx - 1) / 2) * sx,
                (z - (nz - 1) / 2) * sz,
                -(y - (ny - 1) / 2) * sy,
              );
              colors.push(c.r, c.g, c.b);
            }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
          size: 2.6,
          vertexColors: true,
          transparent: true,
          opacity: 0.34,
          depthWrite: false,
        });
        root.add(new THREE.Points(geo, mat));
        const canvas = document.createElement("canvas");
        drawSlice(
          canvas,
          v,
          latest.current.slice ?? 0.5,
          latest.current.window ?? "moles",
        );
        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        plane = new THREE.Mesh(
          new THREE.PlaneGeometry((nx - 1) * sx, (ny - 1) * sy),
          new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
        );
        // Canvas top is anterior; -PI/2 maps its top to -Z (anterior).
        plane.rotation.x = -Math.PI / 2;
        root.add(plane);
      } else {
        const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
        const atlas = props.anatomyMaterials === false ? [] : await fetch("/wmed/acervo/atlas-catalog.json").then(
          (r) => r.json(),
        );
        const names = new Map<string, { name: string; color: string }>(
          atlas.flatMap((s: any) =>
            s.estruturas.flatMap((p: any) => [
              [p.no, { name: p.no, color: p.cor }],
              [THREE.PropertyBinding.sanitizeNodeName(p.no), { name: p.no, color: p.cor }],
            ]),
          ),
        );

        const files = await Promise.allSettled(
          (props.urls || []).map((url) => loader.loadAsync(url)),
        );
        if (disposed) {
          for (const f of files)
            if (f.status === "fulfilled") release(f.value.scene);
          return;
        }
        if (files.some((f) => f.status === "rejected")) {
          for (const f of files)
            if (f.status === "fulfilled") release(f.value.scene);
          throw new Error(
            "Não foi possível abrir o modelo completo. Recarregue a página para tentar novamente.",
          );
        }
        for (const file of files)
          if (file.status === "fulfilled") {
            file.value.scene.traverse((o) => {
              if (!(o instanceof THREE.Mesh)) return;
              let node: THREE.Object3D | null = o;
              while (node && !node.userData.teaching_part) node = node.parent;
              if (node?.userData.teaching_part)
                o.name =
                  node.userData.teaching_part.replace(/-/g, "_") + "_mesh";
              const part = findAtlasPart(o, names);
              if (part) {
                o.name = part.name;
                o.material = Array.isArray(o.material)
                  ? o.material.map((m) => m.clone())
                  : o.material.clone();
                for (const m of Array.isArray(o.material)
                  ? o.material
                  : [o.material])
                  if (m instanceof THREE.MeshStandardMaterial) {
                    applyAtlasMaterial(m, part.color);
                    if (part.name === "Pleura") {
                      m.transparent = true;
                      m.opacity = 0.16;
                      m.depthWrite = false;
                    }
                  }
              }
            });
            file.value.scene.traverse(o => { if (o instanceof THREE.Mesh) highlights.set(o, prepareSelection(o)); });
            root.add(file.value.scene);
          }
      }
      if (disposed) return;
      fit();
      api.current = {
        root,
        plane,
        texture,
        focus: (name) => {
          root.updateWorldMatrix(true,true);
          const box = new THREE.Box3();
          root.traverse(o=>{if(o instanceof THREE.Mesh && o.name===name)box.union(new THREE.Box3().setFromObject(o));});
          if(box.isEmpty())return;
          const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
          const distance=Math.max(size.y,size.x/Math.max(camera.aspect,.1),size.z)*2.2;
          const direction=camera.position.clone().sub(controls.target).normalize();
          controls.target.copy(center);camera.position.copy(center).addScaledVector(direction,distance);
          controls.minDistance=distance*.15;controls.maxDistance=Math.max(distance*3,initial.length()*3);controls.update();
        },
        reset: () => {
          controls.minDistance=initial.length()*.15;controls.maxDistance=initial.length()*3;
          camera.position.copy(initial);
          controls.target.set(0, 0, 0);
          controls.update();
        },
        snapshot: () => {
          renderer.render(scene, camera);
          const a = document.createElement("a");
          a.href = renderer.domElement.toDataURL("image/png");
          a.download = "vytal-academico-cena.png";
          a.click();
        },
      };
      setStatus("");
      latest.current.onReady?.();
    };
    load().catch((e) => {
      if (!disposed) {
        setStatus(e.message);
        setFailed(true);
      }
    });
    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let down = [0, 0];
    const pointerDown = (e: PointerEvent) => {
      down = [e.clientX, e.clientY];
    };
    const click = (e: PointerEvent) => {
      if (
        Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5 ||
        !latest.current.onSelect
      )
        return;
      const box = el.getBoundingClientRect();
      pointer.set(
        ((e.clientX - box.left) / box.width) * 2 - 1,
        1 - ((e.clientY - box.top) / box.height) * 2,
      );
      ray.setFromCamera(pointer, camera);
      const hit = ray
        .intersectObjects(root.children, true)
        .find((h) => h.object.visible && (h.object as THREE.Mesh).isMesh);
      if (hit) latest.current.onSelect?.(hit.object.name);
    };
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointerup", click);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      const p = latest.current;
      controls.autoRotate = !!p.rotate && !motion.matches;
      controls.update();
      root.traverse((o) => {
        if (o instanceof THREE.Points) {
          (o.material as THREE.PointsMaterial).opacity = p.opacity ?? 0.34;
          return;
        }
        if (!(o instanceof THREE.Mesh) || o === plane) return;
        o.visible = !p.isolate || !p.selected || o.name === p.selected;
        highlights.get(o)?.(!!p.selected && o.name === p.selected);
      });
      if (plane && props.volume) {
        const [, , nz] = props.volume.meta.dims;
        plane.position.y =
          (Math.round((p.slice ?? 0.5) * (nz - 1)) - (nz - 1) / 2) *
          props.volume.meta.spacing[2];
      }
      renderer.render(scene, camera);
    };
    render();
    return () => {
      disposed = true;
      api.current = undefined;
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      release(root);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [sourceKey, props.volume]);
  useEffect(()=>{
    if(status || !api.current)return;
    if(props.isolate && props.selected)api.current.focus(props.selected);
    else if(isolatedBefore.current)api.current.reset();
    isolatedBefore.current=!!props.isolate;
  },[props.isolate,props.selected,status]);
  useEffect(() => {
    const current = api.current;
    if (current?.texture && props.volume) {
      drawSlice(
        current.texture.image as HTMLCanvasElement,
        props.volume,
        props.slice ?? 0.5,
        props.window ?? "moles",
      );
      current.texture.needsUpdate = true;
    }
  }, [props.slice, props.window, props.volume, status]);
  return (
    <div className={"va-scene " + (props.minimal ? "minimal" : "")}>
      <div ref={host} className="va-canvas" />
      {status && (
        <div className={"va-loading " + (failed ? "error" : "")} role="status">
          {!failed && <span />}
          {status}
        </div>
      )}
      {!props.minimal && (
        <>
          <div className="va-scene-hint">
            <Move3D size={14} /> Arraste para girar · role para aproximar
          </div>
          <div className="va-scene-tools">
            <button
              aria-label="Restaurar câmera"
              title="Restaurar câmera"
              onClick={() => api.current?.reset()}
            >
              <RotateCcw size={17} />
            </button>
            <button
              aria-label="Salvar imagem da cena"
              title="Salvar imagem"
              onClick={() => api.current?.snapshot()}
            >
              <Download size={17} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
