// Runway · série "Por Dentro" (2Doctor)
//
//   node gerar-ref.mjs saldo    → organization.retrieve(): saldo, tier e modelos (sem custo)
//   node gerar-ref.mjs gerar r1 → 4 rostos de referência da Dra. Iris Maren (gen4_image, GASTA crédito)
//   node gerar-ref.mjs gerar r2 → 2ª rodada, prompt ajustado (idade, sem maquiagem, noite)
//
// A chave vem só de RUNWAYML_API_SECRET (~/.config/2doctor/runway.env, fora do Git).
// Este script nunca imprime nem grava a chave. Saídas em ../out/ref/ (ignorado pelo Git).

import RunwayML from '@runwayml/sdk';
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

const modo = process.argv[2];
if (modo === 'saldo') await mostrarSaldo();
else if (modo === 'gerar') await gerar(process.argv[3] || 'r1');
else { console.error('uso: node gerar-ref.mjs saldo | gerar r1|r2'); process.exit(1); }
