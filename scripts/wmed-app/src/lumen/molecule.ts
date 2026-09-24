// Moléculas no padrão Lumen: leitura de SDF (V2000) e PDB, esferas e ligações instanciadas com material físico.
// As fitas (cartoon) de proteínas continuam no 3Dmol.
import * as THREE from "three";
import { LumenMaterial, type LumenTheme } from "./lumen";

export type Atom = { elem: string; x: number; y: number; z: number; name: string; resn: string; resi: number; chain: string; het?: boolean };
export type Molecule = { atoms: Atom[]; bonds: [number, number][]; ss?: Map<string, "helix" | "sheet"> };

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
  const atoms: Atom[] = [], ss = new Map<string, "helix" | "sheet">();
  for (const l of text.split(/\r?\n/)) {
    // Estrutura secundária declarada no arquivo (HELIX e SHEET)
    if (/^HELIX /.test(l) || /^SHEET /.test(l)) {
      const helix = l.startsWith("HELIX"), chain = helix ? l[19] : l[21];
      const a = parseInt(helix ? l.slice(21, 25) : l.slice(22, 26)), b = parseInt(helix ? l.slice(33, 37) : l.slice(33, 37));
      for (let i = a; i <= b; i++) ss.set(`${chain}:${i}`, helix ? "helix" : "sheet");
      continue;
    }
    if (!/^(ATOM|HETATM)/.test(l)) continue;
    const resn = l.slice(17, 20).trim();
    if (resn === "HOH" || resn === "WAT") continue;
    if (l[16] !== " " && l[16] !== "A" && l[16] !== undefined) continue; // só a primeira conformação alternativa
    const name = l.slice(12, 16).trim();
    atoms.push({ name, resn, chain: l[21]?.trim() || "", resi: parseInt(l.slice(22, 26)), x: +l.slice(30, 38), y: +l.slice(38, 46), z: +l.slice(46, 54), elem: norm(l.slice(76, 78).trim() || name.replace(/[^A-Za-z]/g, "")[0]), het: l.startsWith("HETATM") });
  }
  return { atoms, bonds: bondsByDistance(atoms), ss };
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

export function buildMolecule(mol: Molecule, opts: { style: "stick" | "sphere"; hydrogens: boolean; theme: LumenTheme; keepFrame?: boolean }) {
  const keep = mol.atoms.map((a) => opts.hydrogens || a.elem !== "H"), group = new THREE.Group(), colors = ELEMENT_COLORS[opts.theme];
  const index: number[] = []; mol.atoms.forEach((_, i) => keep[i] && index.push(i));
  const color = (e: string) => new THREE.Color(colors[e] || "#9aa3ad");
  const material = () => new LumenMaterial({ roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0 });
  const radius = (e: string) => opts.style === "sphere" ? (VDW[e] || 1.5) * 0.85 : e === "H" ? 0.18 : ["Fe", "Zn"].includes(e) ? 0.55 : 0.3;
  const spheres = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 3), material(), index.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), center = new THREE.Vector3();
  index.forEach((i) => center.add(new THREE.Vector3(mol.atoms[i].x, mol.atoms[i].y, mol.atoms[i].z)));
  center.divideScalar(Math.max(1, index.length));
  if (opts.keepFrame) center.set(0, 0, 0);
  const basis = opts.keepFrame ? new THREE.Matrix4() : principalAxes(index.map((i) => new THREE.Vector3(mol.atoms[i].x, mol.atoms[i].y, mol.atoms[i].z).sub(center)));
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

// ---------- Fitas (cartoon) de proteína ----------
// Gradiente do N- ao C-terminal em cada cadeia (azul → ciano → verde → âmbar → coral).
const SPECTRUM = ["#3b6cff", "#22b8e0", "#4fd39a", "#f2c14e", "#ff7a59"].map((c) => new THREE.Color(c));
const spectrum = (t: number) => { const x = Math.min(0.9999, Math.max(0, t)) * (SPECTRUM.length - 1), i = Math.floor(x); return SPECTRUM[i].clone().lerp(SPECTRUM[i + 1], x - i); };

export function buildCartoon(mol: Molecule, opts: { theme: LumenTheme; hydrogens?: boolean }) {
  const group = new THREE.Group(), ss = mol.ss || new Map();
  // Resíduos por cadeia: CA e O do esqueleto
  const chains = new Map<string, { resi: number; resn: string; ca: THREE.Vector3; o?: THREE.Vector3 }[]>();
  for (const a of mol.atoms) {
    if (a.het) continue;
    const list = chains.get(a.chain) || chains.set(a.chain, []).get(a.chain)!;
    let res = list[list.length - 1];
    if (!res || res.resi !== a.resi) { if (a.name !== "CA" && a.name !== "O") continue; res = { resi: a.resi, resn: a.resn, ca: null as any }; list.push(res); }
    if (a.name === "CA") res.ca = new THREE.Vector3(a.x, a.y, a.z);
    if (a.name === "O") res.o = new THREE.Vector3(a.x, a.y, a.z);
  }
  const all: THREE.Vector3[] = [];
  chains.forEach((list, k) => { const ok = list.filter((r) => r.ca); chains.set(k, ok); ok.forEach((r) => all.push(r.ca)); });
  const center = all.reduce((c, p) => c.add(p), new THREE.Vector3()).divideScalar(Math.max(1, all.length));
  const basis = principalAxes(all.map((p) => p.clone().sub(center)));
  const tf = (p: THREE.Vector3) => p.clone().sub(center).applyMatrix4(basis);
  const residues: { chain: string; resi: number; resn: string; p: THREE.Vector3 }[] = [];
  const material = new LumenMaterial({ vertexColors: true, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25, sheen: 0.3, side: THREE.DoubleSide });
  const SUB = 8, RING = 14;
  chains.forEach((list, chain) => {
    if (list.length < 4) return;
    // quebra a cadeia onde faltam resíduos (distância CA-CA > 4.3 Å)
    const segments: typeof list[] = [[]];
    list.forEach((r, i) => { if (i && r.ca.distanceTo(list[i - 1].ca) > 4.3) segments.push([]); segments[segments.length - 1].push(r); });
    segments.forEach((seg) => {
      if (seg.length < 3) return;
      const pts = seg.map((r) => tf(r.ca)), curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
      // lado da fita: direção CA→O, ortogonalizada e sem inversões entre resíduos vizinhos
      let prev: THREE.Vector3 | null = null;
      const sides = seg.map((r, i) => {
        let v = r.o ? tf(r.o).sub(pts[i]) : new THREE.Vector3(0, 1, 0);
        if (prev && v.dot(prev) < 0) v.negate(); prev = v; return v.normalize();
      });
      const n = (seg.length - 1) * SUB + 1, pos: number[] = [], col: number[] = [], idx: number[] = [];
      const kind = (i: number) => ss.get(`${chain}:${seg[Math.min(seg.length - 1, Math.max(0, i))].resi}`) || "coil";
      const dims = (k: string) => (k === "helix" ? [1.25, 0.22] : k === "sheet" ? [1.35, 0.22] : [0.3, 0.3]);
      for (let j = 0; j < n; j++) {
        const t = j / (n - 1), fi = t * (seg.length - 1), i0 = Math.floor(fi), f = fi - i0, i1 = Math.min(seg.length - 1, i0 + 1);
        const p = curve.getPoint(t), T = curve.getTangent(t).normalize();
        const side = sides[i0].clone().lerp(sides[i1], f); side.addScaledVector(T, -side.dot(T)).normalize();
        const up = new THREE.Vector3().crossVectors(T, side).normalize();
        const [wa, ha] = dims(kind(i0)), [wb, hb] = dims(kind(i1)), s = f * f * (3 - 2 * f), w = wa + (wb - wa) * s, h = ha + (hb - ha) * s;
        const c = spectrum((seg[i0].resi - seg[0].resi + f) / Math.max(1, seg[seg.length - 1].resi - seg[0].resi));
        for (let k = 0; k < RING; k++) {
          const a = (k / RING) * Math.PI * 2, x = Math.cos(a), y = Math.sin(a);
          // seção elíptica "achatada" (superelipse) para as fitas
          const sx = Math.sign(x) * Math.pow(Math.abs(x), 0.6) * w, sy = Math.sign(y) * Math.pow(Math.abs(y), 0.6) * h;
          const v = p.clone().addScaledVector(side, sx).addScaledVector(up, sy);
          pos.push(v.x, v.y, v.z); col.push(c.r, c.g, c.b);
        }
        if (j % SUB === 0) residues.push({ chain, resi: seg[j / SUB].resi, resn: seg[j / SUB].resn, p });
      }
      for (let j = 0; j < n - 1; j++) for (let k = 0; k < RING; k++) {
        const a = j * RING + k, b = j * RING + ((k + 1) % RING), c2 = a + RING, d = b + RING;
        idx.push(a, c2, b, b, c2, d);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      geo.setIndex(idx); geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, material); mesh.userData.ribbon = true; group.add(mesh);
    });
  });
  // Ligantes (HETATM que não são água) em esferas e ligações
  const lig = mol.atoms.map((a, i) => (a.het && (opts.hydrogens || a.elem !== "H") ? i : -1)).filter((i) => i >= 0);
  let ligand: ReturnType<typeof buildMolecule> | null = null;
  if (lig.length) {
    const sub: Molecule = { atoms: lig.map((i) => { const p = tf(new THREE.Vector3(mol.atoms[i].x, mol.atoms[i].y, mol.atoms[i].z)); return { ...mol.atoms[i], x: p.x, y: p.y, z: p.z }; }), bonds: [] };
    sub.bonds = bondsByDistance(sub.atoms);
    ligand = buildMolecule(sub, { style: "stick", hydrogens: !!opts.hydrogens, theme: opts.theme, keepFrame: true });
    group.add(ligand.group);
  }
  const halo = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 3), new THREE.MeshBasicMaterial({ color: opts.theme === "holo" ? "#79dcff" : "#2f7cff", transparent: true, opacity: 0.3, depthWrite: false }));
  halo.visible = false; group.add(halo);
  return {
    group,
    pick(ray: THREE.Raycaster): Atom | null {
      const atom = ligand?.pick(ray);
      if (atom) { halo.visible = false; return atom; }
      const hit = ray.intersectObjects(group.children.filter((c) => c.userData.ribbon), false)[0];
      if (!hit) { halo.visible = false; return null; }
      let best = residues[0], d = Infinity;
      for (const r of residues) { const k = r.p.distanceToSquared(hit.point); if (k < d) { d = k; best = r; } }
      halo.position.copy(best.p); halo.scale.setScalar(1.6); halo.visible = true;
      return { elem: best.resn, name: "CA", resn: best.resn, resi: best.resi, chain: best.chain, x: 0, y: 0, z: 0 };
    },
    clear() { halo.visible = false; ligand?.clear(); },
    dispose() { group.traverse((o: any) => { o.geometry?.dispose(); o.material?.dispose?.(); }); },
  };
}
