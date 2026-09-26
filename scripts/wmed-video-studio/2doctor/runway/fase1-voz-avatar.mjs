// Runway · "Por Dentro" · Fase 1 do Ep. 2 (GASTA crédito)
//
//   node fase1-voz-avatar.mjs vozes    → 4 amostras de voz em inglês (eleven_v3), mesma fala
//   node fase1-voz-avatar.mjs avatar   → cria o avatar da Iris (café) e gera 1 plano falado de teste
//
// Mede o saldo antes e depois de cada chamada. A chave vem só de RUNWAYML_API_SECRET.
// Saídas em ../out/fase1/ (ignorado pelo Git).

import RunwayML from '@runwayml/sdk';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'fase1');
const CAFE = path.join(AQUI, '..', 'out', 'ref', 'pacote', 'p5-cafe-a.png');

// Uma fala com gancho, pausa e frase séria, para ouvir o alcance de cada voz.
const FALA_TESTE = "This one's from a real medical licensing exam. Take your time, pick an answer... I'll wait. Answer: D. And no, it's not just high blood pressure.";
const FALA_CAFE = "And in real life? Chest pain that won't go away... call your emergency number. Right now.";
// Vozes femininas do catálogo eleven_v3 do Runway (o catálogo não traz descrição).
const VOZES = ['Rachel', 'Eleanor', 'Lara', 'Claudia'];

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

async function falar(voz, texto, nome) {
  const antes = await saldo(); const t0 = Date.now();
  const tarefa = await client.textToSpeech
    .create({ model: 'eleven_v3', promptText: texto, languageCode: 'en', voice: { type: 'runway-preset', presetId: voz } })
    .waitForTaskOutput();
  await baixar(tarefa.output[0], nome);
  const linha = { etapa: 'voz', voz, arquivo: nome, caracteres: texto.length, tarefa: tarefa.id, url: tarefa.output[0],
    creditosAntes: antes, creditosDepois: await saldo(), segundos: Math.round((Date.now() - t0) / 1000) };
  linha.custoCreditos = linha.creditosAntes - linha.creditosDepois;
  console.log(JSON.stringify({ ...linha, url: undefined }));
  return linha;
}

async function vozes() {
  await mkdir(SAIDA, { recursive: true });
  const log = [];
  for (const v of VOZES) log.push(await falar(v, FALA_TESTE, `voz-${v.toLowerCase()}.mp3`));
  await writeFile(path.join(SAIDA, 'vozes-log.json'), JSON.stringify({ fala: FALA_TESTE, log }, null, 2));
}

async function avatar() {
  await mkdir(SAIDA, { recursive: true });
  const voz = process.argv[3] || VOZES[0];
  const fala = await falar(voz, FALA_CAFE, `cafe-${voz.toLowerCase()}.mp3`);

  const antes = await saldo(); const t0 = Date.now();
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(CAFE) });
  const av = await client.avatars.create({
    name: 'Dra. Iris Maren', referenceImage: uri,
    personality: 'Dr. Iris Maren, a calm physician in her early forties who explains medicine with dry humour.',
    voice: { type: 'runway-live-preset', presetId: 'georgia' },   // obrigatório; a fala vem do áudio
  });
  let estado = await client.avatars.retrieve(av.id);
  while (estado.status === 'PROCESSING') { await new Promise(r => setTimeout(r, 5000)); estado = await client.avatars.retrieve(av.id); }
  if (estado.status !== 'READY') throw new Error(`avatar ${estado.status}: ${estado.failureReason ?? ''}`);
  const aposAvatar = await saldo();

  const video = await client.avatarVideos
    .create({ model: 'gwm1_avatars', avatar: { type: 'custom', avatarId: av.id }, speech: { type: 'audio', audio: fala.url } })
    .waitForTaskOutput();
  await baixar(video.output[0], `cafe-${voz.toLowerCase()}.mp4`);
  const depois = await saldo();
  const linha = { etapa: 'avatar', avatarId: av.id, tarefaVideo: video.id, voz,
    custoCriarAvatar: antes - aposAvatar, custoVideo: aposAvatar - depois,
    creditosAntes: antes, creditosDepois: depois, segundos: Math.round((Date.now() - t0) / 1000) };
  console.log(JSON.stringify(linha));
  await writeFile(path.join(SAIDA, 'avatar-log.json'), JSON.stringify({ fala: FALA_CAFE, audio: fala, video: linha }, null, 2));
}

const modo = process.argv[2];
if (modo === 'vozes') await vozes();
else if (modo === 'avatar') await avatar();
else { console.error('uso: node fase1-voz-avatar.mjs vozes | avatar [Voz]'); process.exit(1); }
