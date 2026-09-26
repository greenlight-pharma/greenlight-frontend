// Runway · série "Por Dentro" (2Doctor)
//
//   node gerar-ref.mjs saldo    → organization.retrieve(): saldo, tier e modelos (sem custo)
//   node gerar-ref.mjs gerar r1 → 4 rostos de referência da Dra. Iris Maren (gen4_image, GASTA crédito)
//   node gerar-ref.mjs gerar r2 → 2ª rodada, prompt ajustado (idade, sem maquiagem, noite)
//   node gerar-ref.mjs modelo gpt_image_2 | gemini_image3_pro
//                               → prompt r2 em outro modelo, 4 imagens numa chamada (sem seed)
//   node gerar-ref.mjs pacote   → pacote de referências a partir do rosto aprovado
//                                 (gpt_image_2 médio, 6 planos × 2 variações, GASTA crédito)
//
// A chave vem só de RUNWAYML_API_SECRET (~/.config/2doctor/runway.env, fora do Git).
// Este script nunca imprime nem grava a chave. Saídas em ../out/ref/ (ignorado pelo Git).

import RunwayML from '@runwayml/sdk';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'ref');

// r1: prompt da seção "A apresentadora" de por-dentro.src.html, sem alteração.
// r2: a 1ª rodada saiu jovem (25-30), maquiada, de fim de tarde, com relógio
// dourado, letras na fachada e bindi; o r2 corrige cada ponto explicitamente.
const PROMPT_R1 = 'Cinematic portrait of an original fictional physician in her early 40s, shoulder-length softly wavy dark brown hair, light olive skin, warm brown eyes, natural minimal makeup, deep teal knit sweater over a white collared shirt, simple steel watch, calm confident half-smile. Night, wet street of an unnamed harbour city, tram rails, out-of-focus warm shop lights and cool blue shadows, no readable signs, no landmarks, shallow depth of field, 50mm, documentary color grade, fine film grain. Not resembling any real person or celebrity.';

const PROMPT_R2 = 'Cinematic portrait of an original fictional physician, 42 years old, visible fine lines around the eyes and on the forehead, a few grey strands at the temples, shoulder-length softly wavy dark brown hair, light olive skin, warm brown eyes, no-makeup look, no lipstick, no earrings, no nail polish, no forehead markings. Deep teal knit sweater over a white collared shirt, simple stainless steel watch with a steel band. Calm, confident, slightly tired half-smile of a doctor after a long shift. Full night with a dark sky, wet street of an unnamed harbour city after rain, tram rails reflecting light, out-of-focus warm shop windows and cool blue shadows, no text anywhere, no signs, no landmarks. Medium close-up at eye level, shallow depth of field, 50mm, documentary color grade, fine film grain. Not resembling any real person or celebrity.';
const RODADAS = { r1: { prompt: PROMPT_R1, pasta: SAIDA }, r2: { prompt: PROMPT_R2, pasta: path.join(SAIDA, 'r2') } };

// Seeds fixas: repetir a mesma seed com o mesmo prompt refaz a mesma imagem.
// Mesmas seeds em todas as rodadas, para comparar o efeito só do prompt.
const SEEDS = [250925001, 250925002, 250925003, 250925004];
const MODELO = 'gen4_image';
const RATIO = '1080:1920';          // vertical 9:16 aceito pelo gen4_image

if (!process.env.RUNWAYML_API_SECRET) {
  console.error('RUNWAYML_API_SECRET não definida. Rode: source ~/.config/2doctor/runway.env');
  process.exit(1);
}
const client = new RunwayML();      // o SDK lê RUNWAYML_API_SECRET sozinho

async function saldo() {
  const org = await client.organization.retrieve();
  return org;
}

async function mostrarSaldo() {
  const org = await saldo();
  const modelos = Object.keys(org.tier.models).sort();
  console.log(JSON.stringify({
    creditBalance: org.creditBalance,
    usd: org.creditBalance / 100,
    maxMonthlyCreditSpend: org.tier.maxMonthlyCreditSpend,
    modelos,
    limites: Object.fromEntries(['gen4_image', 'gen4_image_turbo', 'gen4_turbo', 'gen4.5', 'act_two', 'gwm1_avatars', 'eleven_multilingual_v2']
      .map(m => [m, org.tier.models[m] ?? 'indisponível'])),
  }, null, 2));
}

async function gerar(rodada) {
  const R = RODADAS[rodada];
  if (!R) throw new Error(`rodada desconhecida: ${rodada} (use r1 ou r2)`);
  await mkdir(R.pasta, { recursive: true });
  const log = [];
  for (const [i, seed] of SEEDS.entries()) {
    const nome = `iris-${String(i + 1).padStart(2, '0')}.png`;
    const antes = (await saldo()).creditBalance;
    const t0 = Date.now();
    const tarefa = await client.textToImage
      .create({ model: MODELO, promptText: R.prompt, ratio: RATIO, seed })
      .waitForTaskOutput();
    const url = tarefa.output[0];
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`download ${nome}: HTTP ${resp.status}`);
    await writeFile(path.join(R.pasta, nome), Buffer.from(await resp.arrayBuffer()));
    const depois = (await saldo()).creditBalance;
    const linha = { rodada, arquivo: nome, seed, modelo: MODELO, ratio: RATIO, tarefa: tarefa.id,
      creditosAntes: antes, creditosDepois: depois, custoCreditos: antes - depois,
      segundos: Math.round((Date.now() - t0) / 1000) };
    log.push(linha);
    console.log(JSON.stringify(linha));
  }
  await writeFile(path.join(R.pasta, 'iris-log.json'), JSON.stringify({ rodada, prompt: R.prompt, geracoes: log }, null, 2));
}

// Outros modelos para o rosto. Nenhum aceita seed: para refazer, guardar a
// imagem e o id da tarefa. Preço (25/09): gpt_image_2 médio 5 créditos por
// imagem 1K/2K; gemini_image3_pro 20 por imagem 1K/2K.
const OUTROS = {
  gpt_image_2:       { ratio: '1088:1920', extra: { quality: 'medium', outputCount: 4 } },
  gemini_image3_pro: { ratio: '1536:2752', extra: { outputCount: 4 } },
};

async function gerarOutroModelo(modelo) {
  const M = OUTROS[modelo];
  if (!M) throw new Error(`modelo não previsto: ${modelo}`);
  const pasta = path.join(SAIDA, modelo);
  await mkdir(pasta, { recursive: true });
  const antes = (await saldo()).creditBalance;
  const t0 = Date.now();
  const tarefa = await client.textToImage
    .create({ model: modelo, promptText: PROMPT_R2, ratio: M.ratio, ...M.extra })
    .waitForTaskOutput();
  const arquivos = [];
  for (const [i, url] of tarefa.output.entries()) {
    const nome = `iris-${String(i + 1).padStart(2, '0')}.png`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`download ${nome}: HTTP ${resp.status}`);
    await writeFile(path.join(pasta, nome), Buffer.from(await resp.arrayBuffer()));
    arquivos.push(nome);
  }
  const depois = (await saldo()).creditBalance;
  const linha = { modelo, ratio: M.ratio, ...M.extra, tarefa: tarefa.id, arquivos,
    creditosAntes: antes, creditosDepois: depois, custoCreditos: antes - depois,
    segundos: Math.round((Date.now() - t0) / 1000) };
  console.log(JSON.stringify(linha));
  await writeFile(path.join(pasta, 'iris-log.json'), JSON.stringify({ prompt: PROMPT_R2, ...linha }, null, 2));
}

// Pacote de referências. Rosto aprovado em 25/09: gpt_image_2/iris-03
// (cópia em out/ref/iris-aprovada.png). O suéter da aprovada saiu azul-marinho;
// aqui ele passa para o verde-petróleo da marca (#265B5A).
const APROVADA = path.join(SAIDA, 'iris-aprovada.png');
const MESMA = 'The same woman as in @Iris: identical face, identical age (early to mid 40s, fine lines, a few grey strands), identical shoulder-length wavy dark brown hair, warm brown eyes, no makeup, no jewellery except a simple stainless steel watch.';
const SUETER = 'She wears a deep teal (#265B5A) knit sweater over a white collared shirt.';
const ACABAMENTO = 'Photorealistic, 50mm, shallow depth of field, documentary color grade, fine film grain. No text, no signs, no logos, no landmarks.';
const PLANOS = [
  { id: 'p1-frente',    txt: `${MESMA} ${SUETER} Medium shot from the waist up, facing the camera, calm half-smile, arms relaxed. Night, wet street of an unnamed harbour city, tram rails, warm shop lights and cool blue shadows out of focus.` },
  { id: 'p2-tres-quartos', txt: `${MESMA} ${SUETER} Three-quarter view, body turned 45 degrees to the left, looking at the camera, as if about to speak. Same night harbour street with tram rails, warm and blue bokeh.` },
  { id: 'p3-close',     txt: `${MESMA} ${SUETER} Close-up of the face and shoulders, eye level, warm light on one side of the face and cool blue light on the other, gentle attentive expression. Night street bokeh behind.` },
  { id: 'p4-jaleco',    txt: `${MESMA} She wears a clean white doctor's coat over the deep teal (#265B5A) sweater, no stethoscope, no badge text. Medium shot in a quiet hospital corridor at 3 a.m., soft fluorescent light, pale green walls, empty, slightly tired but warm expression.` },
  { id: 'p5-cafe',      txt: `${MESMA} ${SUETER} Sitting at a small table in a corner café late at night, hands around a cup, brass lamps, green ceramic wall tiles, rain on the window behind, talking to the camera.` },
  { id: 'p6-corpo',     txt: `${MESMA} ${SUETER} Dark trousers, simple dark shoes. Full-body wide shot standing on a wet cobbled street with tram rails at night, harbour masts far in the background, puddle reflections, she is small in the frame.` },
];

async function gerarPacote() {
  const pasta = path.join(SAIDA, 'pacote');
  await mkdir(pasta, { recursive: true });
  // Upload temporário da aprovada (URI runway://, vale só para as tarefas).
  const { uri } = await client.uploads.createEphemeral({ file: createReadStream(APROVADA) });
  const log = [];
  for (const p of PLANOS) {
    const antes = (await saldo()).creditBalance;
    const t0 = Date.now();
    const tarefa = await client.textToImage
      .create({ model: 'gpt_image_2', promptText: p.txt, ratio: '1088:1920', quality: 'medium', outputCount: 2,
        referenceImages: [{ uri, tag: 'Iris' }] })
      .waitForTaskOutput();
    const arquivos = [];
    for (const [i, url] of tarefa.output.entries()) {
      const nome = `${p.id}-${'ab'[i] ?? i}.png`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`download ${nome}: HTTP ${resp.status}`);
      await writeFile(path.join(pasta, nome), Buffer.from(await resp.arrayBuffer()));
      arquivos.push(nome);
    }
    const depois = (await saldo()).creditBalance;
    const linha = { plano: p.id, tarefa: tarefa.id, arquivos, creditosAntes: antes, creditosDepois: depois,
      custoCreditos: antes - depois, segundos: Math.round((Date.now() - t0) / 1000) };
    log.push({ ...linha, prompt: p.txt });
    console.log(JSON.stringify(linha));
  }
  await writeFile(path.join(pasta, 'pacote-log.json'), JSON.stringify({ referencia: 'iris-aprovada.png', geracoes: log }, null, 2));
}

const modo = process.argv[2];
if (modo === 'saldo') await mostrarSaldo();
else if (modo === 'gerar') await gerar(process.argv[3] || 'r1');
else if (modo === 'modelo') await gerarOutroModelo(process.argv[3]);
else if (modo === 'pacote') await gerarPacote();
else { console.error('uso: node gerar-ref.mjs saldo | gerar r1|r2 | modelo gpt_image_2|gemini_image3_pro'); process.exit(1); }
