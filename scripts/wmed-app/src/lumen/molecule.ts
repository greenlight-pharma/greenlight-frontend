// Moléculas no padrão Lumen: leitura de SDF (V2000) e PDB, esferas e ligações instanciadas com material físico.
// As fitas (cartoon) de proteínas continuam no 3Dmol.
import * as THREE from "three";
import { LumenMaterial, type LumenTheme } from "./lumen";

export type Atom = { elem: string; x: number; y: number; z: number; name: string; resn: string; resi: number; chain: string };
export type Molecule = { atoms: Atom[]; bonds: [number, number][] };

export const ELEMENT_COLORS: Record<LumenTheme, Record<string, string>> = {
  clinical: { C: "#3d4654", N: "#3e6df5", O: "#e8474f", S: "#e2b13c", P: "#f08a24", H: "#eef1f5", Fe: "#c8663a", Zn: "#7b7fc4" },
  holo: { C: "#b7c4d4", N: "#5a8dff", O: "#ff5d6c", S: "#ffd166", P: "#ff9f45", H: "#ffffff", Fe: "#ff8a5b", Zn: "#9b9fff" },
};
const COVALENT: Record<string, number> = { H: 0.31, C: 0.76, N: 0.71, O: 0.66, S: 1.05, P: 1.07, F: 0.57, Cl: 1.02, Br: 1.2, I: 1.39 };
const VDW: Record<string, number> = { H: 1.2, C: 1.7, N: 1.55, O: 1.52, S: 1.8, P: 1.8, Fe: 1.4, Zn: 1.39 };
const norm = (e: string) => (e ? e[0].toUpperCase() + e.slice(1).toLowerCase() : "C");

export function parseSDF(text: string): Molecule {
  const lines = text.split(/\r?\n/), counts = lines[3] || "";
  if (/V3000/.test(counts)) throw Error("SDF V3000 não suportado");
  const n = parseInt(counts.slice(0, 3)), m = parseInt(counts.slice(3, 6)), atoms: Atom[] = [], bonds: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const l = lines[4 + i];
    atoms.push({ x: +l.slice(0, 10), y: +l.slice(10, 20), z: +l.slice(20, 30), elem: norm(l.slice(31, 34).trim()), name: norm(l.slice(31, 34).trim()), resn: "", resi: 0, chain: "" });
  }
  for (let i = 0; i < m; i++) { const l = lines[4 + n + i]; bonds.push([parseInt(l.slice(0, 3)) - 1, parseInt(l.slice(3, 6)) - 1]); }
  return { atoms, bonds };
}

export function parsePDB(text: string): Molecule {
  const atoms: Atom[] = [];
  for (const l of text.split(/\r?\n/)) {
    if (!/^(ATOM|HETATM)/.test(l)) continue;
    const resn = l.slice(17, 20).trim();
    if (resn === "HOH" || resn === "WAT") continue;
    if (l[16] !== " " && l[16] !== "A" && l[16] !== undefined) continue; // só a primeira conformação alternativa
    const name = l.slice(12, 16).trim();
    atoms.push({ name, resn, chain: l[21]?.trim() || "", resi: parseInt(l.slice(22, 26)), x: +l.slice(30, 38), y: +l.slice(38, 46), z: +l.slice(46, 54), elem: norm(l.slice(76, 78).trim() || name.replace(/[^A-Za-z]/g, "")[0]) });
  }
  return { atoms, bonds: bondsByDistance(atoms) };
}

/** Ligações covalentes pela distância (grade espacial de 2 Å). Metais ficam como esferas isoladas. */
export function bondsByDistance(atoms: Atom[]): [number, number][] {
  const cell = 2, grid = new Map<string, number[]>(), bonds: [number, number][] = [];
  const key = (x: number, y: number, z: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
  atoms.forEach((a, i) => { const k = key(a.x, a.y, a.z); (grid.get(k) || grid.set(k, []).get(k)!).push(i); });
  atoms.forEach((a, i) => {
    const ra = COVALENT[a.elem]; if (!ra) return;
    const cx = Math.floor(a.x / cell), cy = Math.floor(a.y / cell), cz = Math.floor(a.z / cell);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++)
      for (const j of grid.get(`${cx + dx},${cy + dy},${cz + dz}`) || []) {
        if (j <= i) continue;
        const b = atoms[j], rb = COVALENT[b.elem]; if (!rb) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d > 0.4 && d < ra + rb + 0.42) bonds.push([i, j]);
      }
  });
  return bonds;
}

/** Eixos principais (PCA por iteração de potência); devolve a rotação que leva o 1º eixo a X e o 2º a Y. */
export function principalAxes(points: THREE.Vector3[]) {
  const c = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of points) { const v = [p.x, p.y, p.z]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) c[i][j] += v[i] * v[j]; }
  const mul = (v: number[]) => [0, 1, 2].map((i) => c[i][0] * v[0] + c[i][1] * v[1] + c[i][2] * v[2]);
  const power = (orth?: THREE.Vector3) => {
    let v = new THREE.Vector3(0.6, 0.5, 0.4);
    for (let k = 0; k < 60; k++) { if (orth) v.addScaledVector(orth, -v.dot(orth)); const m = mul([v.x, v.y, v.z]); v.set(m[0], m[1], m[2]); if (orth) v.addScaledVector(orth, -v.dot(orth)); if (v.lengthSq() < 1e-12) v.set(0, 1, 0); v.normalize(); }
    return v;
  };
  const e1 = points.length > 1 ? power() : new THREE.Vector3(1, 0, 0), e2 = points.length > 2 ? power(e1) : new THREE.Vector3(0, 1, 0).addScaledVector(e1, -e1.y).normalize();
  const e3 = new THREE.Vector3().crossVectors(e1, e2).normalize();
  return new THREE.Matrix4().makeBasis(e1, e2, e3).transpose();
}

export function buildMolecule(mol: Molecule, opts: { style: "stick" | "sphere"; hydrogens: boolean; theme: LumenTheme }) {
  const keep = mol.atoms.map((a) => opts.hydrogens || a.elem !== "H"), group = new THREE.Group(), colors = ELEMENT_COLORS[opts.theme];
  const index: number[] = []; mol.atoms.forEach((_, i) => keep[i] && index.push(i));
  const color = (e: string) => new THREE.Color(colors[e] || "#9aa3ad");
  const material = () => new LumenMaterial({ roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0 });
  const radius = (e: string) => opts.style === "sphere" ? (VDW[e] || 1.5) * 0.85 : e === "H" ? 0.18 : ["Fe", "Zn"].includes(e) ? 0.55 : 0.3;
  const spheres = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 3), material(), index.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), center = new THREE.Vector3();
  index.forEach((i) => center.add(new THREE.Vector3(mol.atoms[i].x, mol.atoms[i].y, mol.atoms[i].z)));
  center.divideScalar(Math.max(1, index.length));
  const basis = principalAxes(index.map((i) => new THREE.Vector3(mol.atoms[i].x, mol.atoms[i].y, mol.atoms[i].z).sub(center)));
  // Eixo mais longo na horizontal e o segundo na vertical: a molécula aparece "deitada" para a câmera.
  const pos = (a: Atom) => new THREE.Vector3(a.x, a.y, a.z).sub(center).applyMatrix4(basis);
  index.forEach((i, k) => { const a = mol.atoms[i], r = radius(a.elem); spheres.setMatrixAt(k, m4.compose(pos(a), q, new THREE.Vector3(r, r, r))); spheres.setColorAt(k, color(a.elem)); });
  spheres.userData.atoms = index; group.add(spheres);
  if (opts.style === "stick") {
    const bonds = mol.bonds.filter(([a, b]) => keep[a] && keep[b]);
    const cyl = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 18, 1, true), material(), bonds.length * 2);
    const up = new THREE.Vector3(0, 1, 0);
    bonds.forEach(([ia, ib], k) => {
      const a = mol.atoms[ia], b = mol.atoms[ib], pa = pos(a), pb = pos(b), mid = pa.clone().lerp(pb, 0.5);
      [[pa, a], [pb, b]].forEach(([p, atom]: any, h) => {
        const dir = mid.clone().sub(p), len = dir.length();
        q.setFromUnitVectors(up, dir.clone().normalize());
        const r = atom.elem === "H" || (opts.hydrogens && (a.elem === "H" || b.elem === "H")) ? 0.08 : 0.13;
        cyl.setMatrixAt(k * 2 + h, m4.compose(p.clone().lerp(mid, 0.5), q, new THREE.Vector3(r, len, r)));
        cyl.setColorAt(k * 2 + h, color(atom.elem));
      });
    });
    group.add(cyl);
  }
  // Halo de seleção
  const halo = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 3), new THREE.MeshBasicMaterial({ color: opts.theme === "holo" ? "#79dcff" : "#2f7cff", transparent: true, opacity: 0.28, depthWrite: false }));
  halo.visible = false; group.add(halo);
  return {
    group,
    pick(ray: THREE.Raycaster): Atom | null {
      const hit = ray.intersectObject(spheres, false)[0];
      if (!hit || hit.instanceId === undefined) { halo.visible = false; return null; }
      const a = mol.atoms[index[hit.instanceId]], r = radius(a.elem);
      halo.position.copy(pos(a)); halo.scale.setScalar(r * 1.45); halo.visible = true;
      return a;
    },
    clear() { halo.visible = false; },
    dispose() { group.traverse((o: any) => { o.geometry?.dispose(); o.material?.dispose(); }); },
  };
}
