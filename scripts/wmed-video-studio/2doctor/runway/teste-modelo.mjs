// Runway · "Por Dentro" · teste Veo 3.1 × Seedance 2.5 no formato "só a Iris" (GASTA crédito)
//
//   node teste-modelo.mjs imagens          → 2 imagens iniciais (gpt_image_2 com @Iris, biblioteca)
//   node teste-modelo.mjs veo <png>        → Veo 3.1 completo, 8 s, 1920:1080, com áudio
//   node teste-modelo.mjs seedance <png>   → Seedance 2.5, 8 s, 480p 16:9, imagem como primeiro quadro, com áudio
//   node teste-modelo.mjs voz <mp4>        → troca a voz pela Lara e remonta
//
// Formato novo (26/09, pedido do Dilson): uma pessoa só, a Iris, falando para a
// câmera em plano médio, como na referência; a explicação vai em grafismo feito
// por nós. Saídas em ../out/modelo/ (ignorado pelo Git).

import RunwayML from '@runwayml/sdk';
import { execFileSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'modelo');
const APROVADA = path.join(AQUI, '..', 'out', 'ref', 'iris-aprovada.png');

const FALA = "D. It's not just high blood pressure. Chest pain, breathless, confused... that's a hypertensive emergency.";
const IMAGEM = '@Iris, a physician in her early 40s: identical face, fine lines, a few grey strands, shoulder-length wavy dark brown hair, no makeup, simple stainless steel watch, deep teal (#265B5A) knit sweater over a white collared shirt. She is seated at a wooden desk in a dimly lit medical-school library at night, medium shot from the waist up, facing the camera, a warm green-shaded desk lamp beside her, shelves of old medical books softly out of focus behind, shallow depth of field. Shot on 35mm film, muted colours, soft contrast, fine grain, Netflix documentary interview lighting, widescreen 16:9. She is alone. No text.';
const CENA = 'Documentary interview, she is alone in the frame. She speaks directly to the camera, calm and dry-witted, with natural small head movements, blinks, a brief pause and a slight lean forward; hands resting on the desk. Camera static on a tripod, no zoom, no cuts. Quiet library room tone, no music.';
const VOZ = 'in a warm, low, unhurried American English voice of a woman in her early forties';

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
  let tarefa, erro;
  try { tarefa = await fn(); } catch (e) { erro = e?.error?.error || e?.taskDetails?.failure || e.message; }
  const linha = { etapa, tarefa: tarefa?.id, erro, creditosAntes: antes, creditosDepois: await saldo(),
    segundos: Math.round((Date.now() - t0) / 1000) };
  linha.custoCreditos = linha.creditosAntes - linha.creditosDepois;
  console.log(JSON.stringify(linha));
  await appendFile(path.join(SAIDA, 'modelo-log.jsonl'), JSON.stringify(linha) + '\n');
  if (erro) process.exit(2);
  return tarefa;
}

await mkdir(SAIDA, { recursive: true });
const [modo, arq] = process.argv.slice(2);
const subir = async f => (await client.uploads.createEphemeral({ file: createReadStream(f) })).uri;

if (modo === 'imagens') {
  const uri = await subir(APROVADA);
  const t = await medir('imagem biblioteca', () => client.textToImage
    .create({ model: 'gpt_image_2', promptText: IMAGEM, ratio: '1920:1088', quality: 'medium', outputCount: 2,
      referenceImages: [{ uri, tag: 'Iris' }] })
    .waitForTaskOutput());
  for (const [i, url] of t.output.entries()) await baixar(url, `biblioteca-${'ab'[i]}.png`);
} else if (modo === 'veo') {
  const uri = await subir(path.resolve(SAIDA, arq));
  // 26/09: em 1920:1080 o Veo 3.1 completo falhou duas vezes ("try again later"), sem custo.
  const ratio = process.argv[4] || '1280:720';
  const modelo = process.argv[5] || 'veo3.1';          // veo3.1_fast como alternativa
  const t = await medir(`${modelo} 8s ${ratio}`, () => client.imageToVideo
    .create({ model: modelo, promptImage: uri, ratio, duration: 8, audio: true,
      promptText: `${CENA} She says, ${VOZ}: "${FALA}"` })
    .waitForTaskOutput());
  await baixar(t.output[0], `A-${modelo.replace('.', '')}.mp4`);
} else if (modo === 'seedance') {
  const uri = await subir(path.resolve(SAIDA, arq));
  const t = await medir('seedance2_5 8s 480p', () => client.imageToVideo
    .create({ model: 'seedance2_5', promptImage: [{ uri, position: 'first' }], ratio: '854:480', duration: 8, audio: true,
      promptText: `${CENA} She says, ${VOZ}: "${FALA}"` })
    .waitForTaskOutput());
  await baixar(t.output[0], 'B-seedance.mp4');
} else if (modo === 'voz') {
  const mp4 = path.resolve(SAIDA, arq); const base = mp4.replace(/\.mp4$/, '');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-vn', '-ac', '1', '-b:a', '128k', `${base}-audio.mp3`]);
  const uri = await subir(`${base}-audio.mp3`);
  const t = await medir(`sts Lara ${path.basename(mp4)}`, () => client.speechToSpeech
    .create({ model: 'eleven_multilingual_sts_v2', media: { type: 'audio', uri }, removeBackgroundNoise: true,
      voice: { type: 'runway-preset', presetId: 'Lara' } })
    .waitForTaskOutput());
  await baixar(t.output[0], `${path.basename(base)}-lara-voz.mp3`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-i', `${base}-lara-voz.mp3`, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-shortest', `${base}-lara.mp4`]);
  console.log('ok', `${path.basename(base)}-lara.mp4`);
} else {
  console.error('uso: node teste-modelo.mjs imagens | veo <png> | seedance <png> | voz <mp4>'); process.exit(1);
}
