// Trilha e efeitos do vídeo "Meet 2Doctor" (60 s). eleven_text_to_sound_v2 (GASTA crédito, ~1 crédito/s).
// Saídas em ../out/app60/ (fora do Git).
import RunwayML from '@runwayml/sdk';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out', 'app60');
const client = new RunwayML();
const SONS = {
  trilha: { duration: 30, loop: true, promptText: 'Modern, premium technology promo background music for a healthcare app: clean electronic pulse, warm synth pads, soft plucked arpeggios, light crisp percussion, confident and optimistic, 112 bpm, no vocals, seamless loop' },
  abertura: { duration: 4, promptText: 'Cinematic tech logo reveal: soft rising shimmer that resolves into a deep, clean digital impact with a subtle sparkle tail, modern and elegant' },
  whoosh: { duration: 1.2, promptText: 'Short soft airy UI whoosh transition, modern, clean, subtle' },
  clique: { duration: 0.5, promptText: 'Single soft modern user interface tap click, crisp and subtle, no reverb' },
  sinal: { duration: 1.5, promptText: 'Gentle positive digital notification chime, two soft notes, clean and modern, healthcare app' },
};
const saldo = async () => (await client.organization.retrieve()).creditBalance;
for (const [nome, o] of Object.entries(SONS)) {
  const antes = await saldo();
  const t = await client.soundEffect.create({ model: 'eleven_text_to_sound_v2', ...o }).waitForTaskOutput();
  const r = await fetch(t.output[0]); await writeFile(path.join(OUT, `${nome}.mp3`), Buffer.from(await r.arrayBuffer()));
  console.log(JSON.stringify({ nome, creditos: antes - (await saldo()) }));
}
