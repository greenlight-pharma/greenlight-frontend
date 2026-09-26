// Runway · "Por Dentro" · teste de fala cinematográfica no plano do café (GASTA crédito)
//
//   node teste-cinema.mjs [Voz] [A|B|AB] → A) Seedance 2.5 com a nossa voz como referência
//                                          B) Veo 3.1 Fast com a voz gerada pelo modelo
// 25/09: o Seedance recusou a Iris (moderação do fornecedor, rosto realista), sem custo.
//
// O teste do avatar (gwm1_avatars) ficou com cara de IA: cabeça parada, rosto
// instável, saída horizontal. Aqui a Iris sai da mesma imagem (p5-cafe-a),
// com câmera em movimento. Saídas em ../out/cinema/ (ignorado pelo Git).

import RunwayML from '@runwayml/sdk';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'cinema');
const CAFE = path.join(AQUI, '..', 'out', 'ref', 'pacote', 'p5-cafe-a.png');
const FALA = "And in real life? Chest pain that won't go away... call your emergency number. Right now.";
const CENA = 'Vertical documentary shot, late night in a corner café. The woman at the table (keep her exact face, hair and teal sweater) lifts her eyes from the cup, leans slightly toward the camera and speaks calmly and naturally, with small natural head movements, blinks and breathing. Slow handheld push-in, shallow depth of field, rain on the window behind her, warm brass lamps, green tiles, film grain, Netflix documentary look. No text, no subtitles, no music.';

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
  const depois = await saldo();
  const linha = { etapa, tarefa: tarefa.id, creditosAntes: antes, creditosDepois: depois,
    custoCreditos: antes - depois, segundos: Math.round((Date.now() - t0) / 1000) };
  console.log(JSON.stringify(linha));
  return { tarefa, linha };
}

await mkdir(SAIDA, { recursive: true });
const voz = process.argv[2] || 'Lara';
const log = [];
const quais = process.argv[3] || 'AB';

// Voz escolhida lendo a fala do café (reaproveita o arquivo se já existir).
const mp3 = path.join(SAIDA, `cafe-${voz.toLowerCase()}.mp3`);
if (!existsSync(mp3)) {
  const a = await medir(`voz ${voz}`, () => client.textToSpeech
    .create({ model: 'eleven_v3', promptText: FALA, languageCode: 'en', voice: { type: 'runway-preset', presetId: voz } })
    .waitForTaskOutput());
  await baixar(a.tarefa.output[0], path.basename(mp3));
  log.push(a.linha);
}
const { uri: audio } = await client.uploads.createEphemeral({ file: createReadStream(mp3) });
const { uri: img } = await client.uploads.createEphemeral({ file: createReadStream(CAFE) });

// A) Seedance 2.5: a Iris no café como imagem de referência (sem posição: o
// Seedance não aceita áudio de referência junto com quadro-chave) + nossa voz.
if (quais.includes('A')) {
const s = await medir('seedance2_5 720p 7s', () => client.imageToVideo
  .create({ model: 'seedance2_5', promptImage: [{ uri: img }], ratio: '720:1280', duration: 7,
    audio: true, referenceAudio: [{ type: 'audio', uri: audio }],
    promptText: `${CENA} She says exactly the words in the reference audio, in that same voice, with her lips in sync: "${FALA}"` })
  .waitForTaskOutput());
await baixar(s.tarefa.output[0], 'A-seedance.mp4');
log.push(s.linha);
}

// B) Veo 3.1 Fast: o modelo gera a fala; descrevemos a voz.
if (quais.includes('B')) {
const v = await medir('veo3.1_fast 1080x1920 8s', () => client.imageToVideo
  .create({ model: 'veo3.1_fast', promptImage: img, ratio: '1080:1920', duration: 8, audio: true,
    promptText: `${CENA} She says, in a warm, low, unhurried American English voice of a woman in her early forties: "${FALA}" Quiet café ambience, rain, a cup set down on the table.` })
  .waitForTaskOutput());
await baixar(v.tarefa.output[0], 'B-veo31fast.mp4');
log.push(v.linha);
}

await writeFile(path.join(SAIDA, 'cinema-log.json'), JSON.stringify({ fala: FALA, cena: CENA, voz, log }, null, 2));
