// Runway · "Por Dentro" · plano do café filmado "de longe" (GASTA crédito)
//
//   node teste-longe.mjs imagens              → 2 versões × 2 imagens iniciais (gpt_image_2 com @Iris)
//   node teste-longe.mjs video <v1|v2> <png>  → Veo 3.1 Fast, 8 s vertical, a partir da imagem escolhida
//   node teste-longe.mjs voz <mp4>            → troca a voz do vídeo pela Lara (eleven_multilingual_sts_v2)
//
// Pedido do Dilson (25/09): o close olhando para a lente tinha "cara de IA".
// Aqui: câmera mais longe, olhar fora da lente, elementos em primeiro plano,
// luz menos perfeita. Saídas em ../out/longe/ (ignorado pelo Git).

import RunwayML from '@runwayml/sdk';
import { execFileSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'longe');
const APROVADA = path.join(AQUI, '..', 'out', 'ref', 'iris-aprovada.png');
const FALA = "And in real life? Chest pain that won't go away... call your emergency number. Right now.";

const MESMA = 'The woman is @Iris: identical face, age (early to mid 40s, fine lines, a few grey strands), shoulder-length wavy dark brown hair, no makeup, simple stainless steel watch, deep teal (#265B5A) knit sweater over a white collared shirt.';
const VERSOES = {
  v1: { nome: 'pela janela',
    imagem: `${MESMA} Wide observational shot from OUTSIDE a corner café at night, looking in through a rain-streaked window: she sits at a small marble table in the middle distance, occupying about a third of the frame, talking to someone seated opposite her who is out of focus in the foreground. Warm brass lamps, green tiles, a few other customers softly blurred, wet street reflections on the glass. Long lens, natural uneven light with part of her face in shadow, 35mm film look, candid, not posed, not looking at the camera. Photorealistic. No text, no signs, no logos.`,
    video: 'Locked-off long-lens shot through a rain-streaked café window at night. The woman at the table talks to the person opposite her (not to the camera), with natural small gestures, a pause, a glance down at her cup, then back up. Raindrops run down the glass in the foreground, a passer-by crosses the frame blurred. Observational documentary, very subtle handheld drift, no push-in.' },
  v2: { nome: 'entrevista',
    imagem: `${MESMA} Documentary interview framing inside a corner café at night: medium-wide shot, she sits at a table, body turned three-quarters, looking just off camera to the left at an unseen interviewer. Out-of-focus shoulders of other customers and the edge of a table in the foreground, warm brass lamps, green tiles, rain on the window behind her. Natural uneven light, part of her face in shadow, 50mm, 35mm film look, candid. Photorealistic. No text, no signs, no logos.`,
    video: 'Documentary interview shot in a café at night. The woman looks just off camera to the left at an unseen interviewer and answers naturally, with small hand gestures, a brief pause and a thoughtful half-smile. Out-of-focus customers move in the foreground. Camera almost static on a tripod with a very slight drift; no push-in.' },
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
  await appendFile(path.join(SAIDA, 'longe-log.jsonl'), JSON.stringify(linha) + '\n');
  return tarefa;
}

await mkdir(SAIDA, { recursive: true });
const [modo, a1, a2] = process.argv.slice(2);

if (modo === 'imagens') {
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(APROVADA) });
  for (const [id, V] of Object.entries(VERSOES)) {
    const t = await medir(`imagem ${id} (${V.nome})`, () => client.textToImage
      .create({ model: 'gpt_image_2', promptText: V.imagem, ratio: '1088:1920', quality: 'medium', outputCount: 2,
        referenceImages: [{ uri, tag: 'Iris' }] })
      .waitForTaskOutput());
    for (const [i, url] of t.output.entries()) await baixar(url, `${id}-${'ab'[i]}.png`);
  }
} else if (modo === 'video') {
  const V = VERSOES[a1];
  if (!V || !a2) throw new Error('uso: video <v1|v2> <imagem.png>');
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(path.resolve(SAIDA, a2)) });
  const t = await medir(`veo3.1_fast ${a1} (${V.nome})`, () => client.imageToVideo
    .create({ model: 'veo3.1_fast', promptImage: uri, ratio: '1080:1920', duration: 8, audio: true,
      promptText: `${V.video} She says, in a warm, low, unhurried American English voice of a woman in her early forties: "${FALA}" Quiet café ambience, rain.` })
    .waitForTaskOutput());
  await baixar(t.output[0], `${a1}-veo.mp4`);
} else if (modo === 'voz') {
  // Extrai o áudio, troca a voz pela Lara e remonta sobre o mesmo vídeo.
  const mp4 = path.resolve(SAIDA, a1);
  const base = mp4.replace(/\.mp4$/, '');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vn', '-ac', '1', '-b:a', '128k', `${base}-audio.mp3`]);
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(`${base}-audio.mp3`) });
  const t = await medir(`sts Lara ${path.basename(mp4)}`, () => client.speechToSpeech
    .create({ model: 'eleven_multilingual_sts_v2', media: { type: 'audio', uri }, removeBackgroundNoise: true,
      voice: { type: 'runway-preset', presetId: 'Lara' } })
    .waitForTaskOutput());
  await baixar(t.output[0], `${path.basename(base)}-lara-voz.mp3`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-i', `${base}-lara-voz.mp3`, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-shortest', `${base}-lara.mp4`]);
  console.log('ok', `${path.basename(base)}-lara.mp4`);
} else {
  console.error('uso: node teste-longe.mjs imagens | video <v1|v2> <png> | voz <mp4>'); process.exit(1);
}
