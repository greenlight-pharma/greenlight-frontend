// Runway · "Por Dentro" · planos gerados do Ep. 2 em 16:9 (GASTA crédito)
//
//   node planos-ep2.mjs imagens <plano>        → 2 imagens iniciais (gpt_image_2, 1920:1088)
//   node planos-ep2.mjs video <plano> <png>    → Veo 3.1 Fast, 8 s, 1920:1080, com som
//   node planos-ep2.mjs voz <plano>            → troca a voz da Iris pela Lara e remonta
//
// Formato decidido em 25/09: 16:9 (como a referência). Estilo aprovado: câmera
// mais longe, algo em primeiro plano, luz irregular; o tratamento de cor e a
// granulação entram na montagem (filtro no NOTAS.md). Saídas em ../out/ep2/.

import RunwayML from '@runwayml/sdk';
import { execFileSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'ep2');
const APROVADA = path.join(AQUI, '..', 'out', 'ref', 'iris-aprovada.png');

const IRIS = 'The woman is @Iris: identical face, age (early to mid 40s, fine lines, a few grey strands), shoulder-length wavy dark brown hair, no makeup, simple stainless steel watch.';
const VOZ_IRIS = 'in a warm, low, unhurried American English voice of a woman in her early forties';
const FILME = 'Photorealistic, shot on 35mm film, muted colours, soft contrast, natural uneven light, fine grain, widescreen 16:9. No text, no signs, no logos.';

const PLANOS = {
  ubs: { iris: false,
    imagem: `Wide observational shot from outside the glass entrance door of a small public primary-care clinic in late afternoon: through the glass, a pale, sweating man in his mid-50s holding his chest is helped in by his adult son; a nurse walks toward them with a blood-pressure cuff. Plastic chairs, a waiting room with a few people, flat fluorescent light mixed with warm window light, reflections on the glass in the foreground. ${FILME}`,
    video: 'Locked-off observational shot through the clinic glass door. The son helps his father to a chair, the man winces and presses his chest, the nurse kneels and wraps the blood-pressure cuff on his arm. People in the waiting room turn to look. Very subtle handheld drift, no push-in.',
    som: 'No dialogue. Muffled waiting-room ambience, a door closing, the velcro of the blood-pressure cuff.' },
  rua: { iris: true, fala: "This one's based on a real medical licensing exam. Read it, pick an answer. I'll wait.",
    imagem: `${IRIS} She wears a deep teal (#265B5A) knit sweater over a white collared shirt and a dark wool coat. Medium-wide shot at night on a wet harbour-front promenade with tram rails, she walks slowly toward the camera, harbour lights and masts softly out of focus behind her, a tram passing blurred in the foreground edge of the frame. ${FILME}`,
    video: 'Walk-and-talk documentary shot at night on the wet harbour promenade: she walks slowly toward the camera, then stops and addresses the camera with a dry half-smile and a slightly raised eyebrow, natural small gestures. A tram passes blurred in the foreground. Camera backs away slowly, slight handheld.' },
  corredor: { iris: true, fala: "Answer: D. This isn't just high blood pressure. Very high pressure with chest pain, breathlessness and confusion is a hypertensive emergency: an organ is already in trouble.",
    imagem: `${IRIS} She wears a clean white doctor's coat over a deep teal (#265B5A) sweater, no stethoscope, no badge text. Medium-wide shot from the end of a quiet hospital corridor at 3 a.m., framed through a half-open door in the foreground, pale green walls, a few flickering fluorescent tubes, an empty wheelchair against the wall. ${FILME}`,
    video: 'Documentary shot through a half-open door at the end of a quiet hospital corridor at night: she walks toward the camera, stops at mid-distance and speaks to the camera, serious but warm, with a small hand gesture. Fluorescent light flickers once. Camera almost static, very slight drift.' },
};

if (!process.env.RUNWAYML_API_SECRET) {
  console.error('RUNWAYML_API_SECRET não definida. Rode: source ~/.config/2doctor/runway.env');
  process.exit(1);
}
const client = new RunwayML();
const saldo = async () => (await client.organization.retrieve()).creditBalance;
const baixar = async (url, nome) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${nome}: HTTP ${r.status}`);
  await writeFile(path.join(SAIDA, nome), Buffer.from(await r.arrayBuffer()));
};
async function medir(etapa, fn) {
  const antes = await saldo(); const t0 = Date.now();
  const tarefa = await fn();
  const linha = { etapa, tarefa: tarefa.id, creditosAntes: antes, creditosDepois: await saldo(),
    segundos: Math.round((Date.now() - t0) / 1000) };
  linha.custoCreditos = linha.creditosAntes - linha.creditosDepois;
  console.log(JSON.stringify(linha));
  await appendFile(path.join(SAIDA, 'ep2-log.jsonl'), JSON.stringify(linha) + '\n');
  return tarefa;
}

await mkdir(SAIDA, { recursive: true });
const [modo, id, arq] = process.argv.slice(2);
const P = PLANOS[id];
if (!P) { console.error(`plano desconhecido: ${id} (${Object.keys(PLANOS).join(', ')})`); process.exit(1); }

if (modo === 'imagens') {
  const extra = {};
  if (P.iris) {
    const { uri } = await client.uploads.createEphemeral({ file: createReadStream(APROVADA) });
    extra.referenceImages = [{ uri, tag: 'Iris' }];
  }
  const t = await medir(`imagem ${id}`, () => client.textToImage
    .create({ model: 'gpt_image_2', promptText: P.imagem, ratio: '1920:1088', quality: 'medium', outputCount: 2, ...extra })
    .waitForTaskOutput());
  for (const [i, url] of t.output.entries()) await baixar(url, `${id}-${'ab'[i]}.png`);
} else if (modo === 'video') {
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(path.resolve(SAIDA, arq)) });
  const fala = P.iris ? ` She says, ${VOZ_IRIS}: "${P.fala}"` : '';
  const t = await medir(`veo3.1_fast ${id}`, () => client.imageToVideo
    .create({ model: 'veo3.1_fast', promptImage: uri, ratio: '1920:1080', duration: 8, audio: true,
      promptText: `${P.video}${fala} ${P.som ?? 'Quiet ambience.'} Muted film look, no music.` })
    .waitForTaskOutput());
  await baixar(t.output[0], `${id}-veo.mp4`);
} else if (modo === 'voz') {
  const base = path.join(SAIDA, `${id}-veo`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.mp4`, '-vn', '-ac', '1', '-b:a', '128k', `${base}-audio.mp3`]);
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(`${base}-audio.mp3`) });
  const t = await medir(`sts Lara ${id}`, () => client.speechToSpeech
    .create({ model: 'eleven_multilingual_sts_v2', media: { type: 'audio', uri }, removeBackgroundNoise: true,
      voice: { type: 'runway-preset', presetId: 'Lara' } })
    .waitForTaskOutput());
  await baixar(t.output[0], `${id}-lara-voz.mp3`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.mp4`, '-i', path.join(SAIDA, `${id}-lara-voz.mp3`),
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-shortest', path.join(SAIDA, `${id}-lara.mp4`)]);
  console.log('ok', `${id}-lara.mp4`);
} else {
  console.error('uso: node planos-ep2.mjs imagens <plano> | video <plano> <png> | voz <plano>'); process.exit(1);
}
