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
) {
  const [nx, ny, nz] = v.meta.dims;
  const k = Math.round(
    Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0)) *
      (nz - 1),
  );
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
      const hit = selected > 0 && v.labels[index] === selected;
      pixels.data[p] = hit ? 60 : gray;
      pixels.data[p + 1] = hit ? 210 : gray;
      pixels.data[p + 2] = hit ? 232 : gray;
      pixels.data[p + 3] = 255;
    }
  ctx.putImageData(pixels, 0, 0);
}
