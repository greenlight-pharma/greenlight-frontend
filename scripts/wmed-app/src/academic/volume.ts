export type Volume = {
  meta: {
    dims: number[];
    spacing: number[];
    fonte: string;
    estruturas: { id: number; nome: string; cor: string }[];
  };
  hu: Int16Array;
  labels: Uint8Array;
};
export async function loadVolume(
  region: string,
  signal: AbortSignal,
): Promise<Volume> {
  const response = await fetch(`/wmed/acervo/${region}.vytalvol`, {
    signal,
  });
  if (!response.ok || !response.body)
    throw new Error("Não foi possível abrir o exame.");
  const buffer = await new Response(
    response.body.pipeThrough(new DecompressionStream("gzip")),
  ).arrayBuffer();
  return parseVolume(buffer);
}
export function parseVolume(buffer: ArrayBuffer): Volume {
  if (buffer.byteLength < 12) throw new Error("Volume incompleto.");
  const bytes = new Uint8Array(buffer);
  if (new TextDecoder().decode(bytes.subarray(0, 8)) !== "VYTALVOL")
    throw new Error("Volume inválido.");
  const length = new DataView(buffer).getUint32(8, true);
  if (12 + length > buffer.byteLength) throw new Error("Volume incompleto.");
  const meta = JSON.parse(
    new TextDecoder().decode(bytes.subarray(12, 12 + length)),
  );
  if (
    !Array.isArray(meta.dims) ||
    meta.dims.length !== 3 ||
    !meta.dims.every((x: number) => Number.isSafeInteger(x) && x > 0) ||
    !Array.isArray(meta.spacing) ||
    meta.spacing.length !== 3 ||
    !meta.spacing.every((x: number) => Number.isFinite(x) && x > 0) ||
    !Array.isArray(meta.estruturas)
  )
    throw new Error("Metadados inválidos.");
  const n = meta.dims.reduce((a: number, b: number) => a * b, 1);
  if (buffer.byteLength !== 12 + length + n * 3)
    throw new Error("Volume incompleto.");
  return {
    meta,
    hu: new Int16Array(buffer.slice(12 + length, 12 + length + n * 2)),
    labels: bytes.slice(12 + length + n * 2),
  };
}
export function drawSlice(
  canvas: HTMLCanvasElement,
  v: Volume,
  fraction: number,
  window: string,
  selected = 0,
  showAll = false,
) {
  const [nx, ny] = v.meta.dims;
  const k = sliceIndex(v, fraction);
  const colors = showAll ? colorTable(v) : undefined;
  canvas.width = nx;
  canvas.height = ny;
  const ctx = canvas.getContext("2d")!;
  const pixels = ctx.createImageData(nx, ny);
  const [width, center] =
    window === "pulmonar"
      ? [1500, -600]
      : window === "ossea"
        ? [1800, 400]
        : [400, 50];
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) {
      const index = x + nx * (y + ny * k);
      const p = (x + nx * y) * 4;
      const gray = Math.max(
        0,
        Math.min(255, (255 * (v.hu[index] - center + width / 2)) / width),
      );
      const label = v.labels[index];
      const hit = selected > 0 && label === selected;
      const tint = !hit && colors && label > 0 ? colors[label] : undefined;
      pixels.data[p] = hit ? 60 : tint ? gray * 0.55 + tint[0] * 0.45 : gray;
      pixels.data[p + 1] = hit ? 210 : tint ? gray * 0.55 + tint[1] * 0.45 : gray;
      pixels.data[p + 2] = hit ? 232 : tint ? gray * 0.55 + tint[2] * 0.45 : gray;
      pixels.data[p + 3] = 255;
    }
  ctx.putImageData(pixels, 0, 0);
}

function sliceIndex(v: Volume, fraction: number) {
  const nz = v.meta.dims[2];
  return Math.round(
    Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0)) *
      (nz - 1),
  );
}
function parseColor(cor: string): [number, number, number] | undefined {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(cor).trim());
  if (!m) return undefined;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/**
 * Cores só do modo "todas as estruturas": no arquivo de dados vários órgãos
 * vizinhos do abdome têm tons de bege quase iguais. Esta sobreposição
 * separa os vizinhos sem mexer nos dados.
 */
const ALL_MODE_COLORS: Record<number, string> = {
  2: "#3fae6b", // vesícula biliar: verde
  4: "#ecc94b", // estômago: amarelo-ouro
  5: "#f2b48a", // pâncreas: pêssego
  6: "#d9822b", // duodeno: âmbar
  7: "#e98aa3", // intestino delgado: rosa-salmão
  8: "#8a7d3b", // cólon: marrom-oliva
  24: "#3f6fd0", // veia cava inferior: azul-royal
  25: "#58a0e8", // veia porta e esplênica: azul-claro
  27: "#7a86e6", // veias ilíacas: azul-violeta
};
export function structureColor(s: { id: number; cor: string }) {
  return ALL_MODE_COLORS[s.id] || s.cor;
}
const tables = new WeakMap<Volume, ([number, number, number] | undefined)[]>();
function colorTable(v: Volume) {
  let table = tables.get(v);
  if (!table) {
    table = [];
    for (const s of v.meta.estruturas) table[s.id] = parseColor(structureColor(s));
    tables.set(v, table);
  }
  return table;
}
/** Estruturas presentes no corte, da maior para a menor área. */
export function sliceStructures(v: Volume, fraction: number, max = 8) {
  const [nx, ny] = v.meta.dims;
  const start = nx * ny * sliceIndex(v, fraction);
  const counts = new Map<number, number>();
  for (let i = 0; i < nx * ny; i++) {
    const id = v.labels[start + i];
    if (id > 0) counts.set(id, (counts.get(id) || 0) + 1);
  }
  const colors = colorTable(v);
  return v.meta.estruturas
    .filter((s) => counts.has(s.id) && colors[s.id])
    .sort((a, b) => counts.get(b.id)! - counts.get(a.id)!)
    .slice(0, max)
    .map((s) => ({ ...s, cor: structureColor(s) }));
}
