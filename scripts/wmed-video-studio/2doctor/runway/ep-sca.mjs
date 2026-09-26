// Runway · "Por Dentro" · explicador de ~2 min sobre síndrome coronariana aguda (GASTA crédito)
//
// Briefing do Dilson (26/09): o prompt do vídeo de referência do Gavin Purcell,
// "exatamente igual", trocando o tema por uma aula para leigos sobre síndrome
// coronariana aguda. Documentário estilo Netflix, apresentadora britânica
// carismática, levemente ácida e muito inteligente, sempre a mesma personagem
// (a Iris aprovada), 16:9. Versão de ~2 min por causa do saldo (2.109 créditos).
//
//   node ep-sca.mjs vozes                 → amostras de voz britânica (eleven_v3)
//   node ep-sca.mjs imagens <cenario>     → 2 imagens iniciais (gpt_image_2 com @Iris)
//   node ep-sca.mjs host <id> <png>       → fala da Iris: Veo 3.1 Fast 8 s 1280:720 com áudio
//   node ep-sca.mjs apoio <id>            → plano de apoio sem pessoas: wan3 832:480, 5 s
//   node ep-sca.mjs voz <id> <Preset>     → troca a voz de uma fala pela voz escolhida
//   node ep-sca.mjs narracao <Preset>     → narrações por cima do grafismo (eleven_v3)
//
// Saídas em ../out/sca/ (ignorado pelo Git). Custo de cada chamada em sca-log.jsonl.

import RunwayML from '@runwayml/sdk';
import { execFileSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.join(AQUI, '..', 'out', 'sca');
const APROVADA = path.join(AQUI, '..', 'out', 'ref', 'iris-aprovada.png');

const IRIS = '@Iris, a physician in her early 40s: identical face, fine lines, a few grey strands, shoulder-length wavy dark brown hair, no makeup, simple stainless steel watch, deep teal (#265B5A) knit sweater over a white collared shirt, a white doctor\'s coat';
const FILME = 'Shot on 35mm film, muted colours, soft contrast, natural uneven light, fine grain, Netflix documentary look, widescreen 16:9. She is alone. No text, no readable signs, no logos.';
const LONGE = 'Wide shot: she occupies no more than a quarter of the frame height; the whole room around her is visible.';

const CENARIOS = {
  sala: `${IRIS}. She sits at a plain desk in an ordinary hospital doctors' office at night, facing the camera: a computer monitor with a blurred unreadable screen, an X-ray lightbox on the wall, white coats on hooks, a window onto a dim corridor, a paper cup of coffee. ${LONGE} ${FILME}`,
  corredor: `${IRIS}. She stands in the middle distance of a long, quiet hospital corridor at 3 a.m., facing the camera, about to walk toward it: pale green walls, handrails, a parked empty wheelchair, a few flickering fluorescent tubes. ${LONGE} ${FILME}`,
  escada: `${IRIS}. She leans on the metal handrail of a hospital stairwell landing at dawn, facing the camera, a tall window behind her with blue early light over the city, concrete steps going up and down. ${LONGE} ${FILME}`,
};

// Falas da Iris para a câmera (cabem em 8 s). Afirmações clínicas: ver a página.
const FALAS = {
  h1: { cenario: 'sala', acao: 'She leans back slightly in her chair, then speaks to the camera with a dry half-smile.',
    fala: "Heart attacks in films: a man clutches his chest and drops. In real life? Mostly a pressure people decide to ignore." },
  h2: { cenario: 'sala', acao: 'She leans forward, elbows on the desk, and speaks to the camera, slightly amused.',
    fala: "Doctors call it acute coronary syndrome. Which is medical for: part of your heart has stopped getting blood." },
  h3: { cenario: 'corredor', acao: 'She walks slowly toward the camera down the corridor and speaks to it; the camera stays locked off and does not move.',
    fala: "Your heart feeds itself through a few small arteries. Over the years, fatty plaque builds up inside them. Quietly." },
  h4: { cenario: 'sala', acao: 'She sits upright and speaks to the camera, serious now, with one small hand gesture toward her own chest.',
    fala: "What does it feel like? Pressure or tightness in the chest for more than a few minutes. Or it comes and goes." },
  h5: { cenario: 'escada', acao: 'She pushes off the handrail, takes one step and speaks to the camera, firm and deadpan.',
    fala: "Don't drive yourself in. Don't wait it out with a cup of tea. Call an ambulance. Now." },
  h6: { cenario: 'escada', acao: 'She looks out of the window for a beat, then back to the camera with a small, warm smile.',
    fala: "The best heart attack is the one you never have. Blood pressure, cholesterol, blood sugar. And yes, the cigarettes." },
};
const VOZ_VEO = 'in a crisp, warm, low British English (Received Pronunciation) voice of a woman in her early forties, dry and unhurried';
const CAMERA = 'Locked-off static tripod shot: the framing never changes from the first frame; no push-in, no zoom, no dolly, no pan.';

// Narrações por cima do grafismo (sem imagem gerada).
const NARRACAO = {
  n1: "Then one day, a plaque cracks. The body treats it like a wound and builds a clot on top. The artery narrows, or shuts completely.",
  n2: "Downstream, heart muscle starts to starve. Within minutes, cells begin to die, and the damage spreads by the hour. Doctors have a phrase for it: time is muscle.",
  n3: "It can spread to the arm, jaw, neck or back, with sweating, nausea or breathlessness. In women, older people and people with diabetes, it may be just breathlessness, nausea or exhaustion.",
  n4: "In hospital: an ECG within ten minutes. If an artery is blocked, a thin tube goes in through the wrist, a balloon opens it, and a tiny mesh tube, a stent, holds it open. The sooner, the better.",
  n5: "Por Dentro. A 2Doctor series.",
};

// Planos de apoio sem pessoas em destaque (wan3, barato).
const APOIO = {
  a1: 'Night, heavy rain on a city street, an ambulance with flashing blue lights speeds past through the frame, wet asphalt reflections, wide shot from the pavement, cinematic, muted colours, film grain. No readable text or logos.',
  a2: 'Night, the ambulance bay of a hospital emergency entrance in the rain, sliding glass doors glowing, an empty stretcher waiting under the canopy, wide static shot, cinematic, muted colours, film grain. No readable text or logos.',
};

// Animação médica realista no lugar do grafismo esquemático (pedido do Dilson, 26/09:
// "tem que ter realismo"). Muda a regra da série: mecanismo gerado por IA, revisado
// quadro a quadro aqui e por médico antes de publicar. Textos continuam por cima na montagem.
const ESTILO = 'Photorealistic medical 3D animation, cinematic like a high-end Netflix science documentary, dark background, soft volumetric light, shallow depth of field, anatomically accurate, slow and calm camera.';
const NEGATIVO = 'text, labels, letters, numbers, watermark, logo, cartoon, drawing, diagram, people, faces, hands, surgery gore';
const ANIM = {
  m1: { dur: 4, txt: 'A living human heart beating slowly, seen from the front in darkness; the right and left coronary arteries and their branches run over the surface of the heart muscle, glistening; the camera glides slowly toward the left anterior descending artery.' },
  m2a: { dur: 6, txt: 'Inside a human coronary artery, the camera moves slowly along the lumen with red blood cells flowing past; a yellowish fatty atherosclerotic plaque bulges from the artery wall under a thin fibrous cap; the cap tears open, exposing the soft fatty core.' },
  m2b: { dur: 6, txt: 'Inside a human coronary artery at the site of a torn atherosclerotic plaque: platelets stick to the tear and clump together, strands of fibrin trap red blood cells, and a dark red blood clot grows until it almost completely blocks the artery; the flow of blood cells slows to a stop.' },
  m3a: { dur: 6, txt: 'Close view of the surface of a beating human heart; beyond a blocked branch of a coronary artery, a region of heart muscle slowly loses its healthy red colour and turns pale and dusky while the rest stays red.' },
  m3b: { dur: 6, txt: 'Cross-section through the thick muscular wall of the left ventricle of the human heart: a dark area of damaged muscle begins in the innermost layer and slowly spreads outward through the thickness of the wall.' },
  // m3a/m3b foram barrados pela moderação do wan3 (26/09); versão com descrição neutra:
  m3: { dur: 8, txt: 'A beating human heart in darkness, seen from the front, medical visualization; on the lower front wall, one patch of the heart muscle gradually changes from a healthy bright red to a darker, duller, greyish colour, as if the light in that area is slowly fading, while the rest of the heart stays bright red and keeps beating.' },
  m4: { dur: 8, txt: 'A translucent glass-like 3D human figure standing in darkness, seen from the front, slowly turning a few degrees; soft red glowing areas light up one after another in the centre of the chest, the left arm, and the jaw and neck.' },
  m4b: { dur: 6, txt: 'The same translucent glass-like 3D human figure seen from behind in darkness; a soft red glow lights up between the shoulder blades, then a faint glow spreads through the chest.' },
  m6a: { dur: 4, txt: 'Close-up of a hospital heart monitor at night in a dim emergency room, a green electrocardiogram trace scrolling across the dark screen, no numbers, no text, shallow depth of field.' },
  m6b: { dur: 6, txt: 'Inside a blocked human coronary artery: a thin guide wire passes through the clot, a small balloon inflates and presses the plaque against the wall, then a fine metal mesh stent expands and stays in place, holding the artery open as red blood cells rush through again.' },
};

const PRESETS_BRITANICOS = ['Eleanor', 'Serene', 'Mabel', 'Maggie', 'Paula'];

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
const subir = async f => (await client.uploads.createEphemeral({ file: createReadStream(f) })).uri;
async function medir(etapa, fn) {
  const antes = await saldo(); const t0 = Date.now();
  let tarefa, erro;
  try { tarefa = await fn(); } catch (e) { erro = e?.error?.error || e?.taskDetails?.failure || e.message; }
  const linha = { etapa, tarefa: tarefa?.id, erro, creditosAntes: antes, creditosDepois: await saldo(),
    segundos: Math.round((Date.now() - t0) / 1000) };
  linha.custoCreditos = linha.creditosAntes - linha.creditosDepois;
  console.log(JSON.stringify(linha));
  await appendFile(path.join(SAIDA, 'sca-log.jsonl'), JSON.stringify(linha) + '\n');
  if (erro) process.exit(2);
  return tarefa;
}
const tts = (texto, preset) => client.textToSpeech
  .create({ model: 'eleven_v3', promptText: texto, languageCode: 'en', voice: { type: 'runway-preset', presetId: preset } })
  .waitForTaskOutput();

await mkdir(SAIDA, { recursive: true });
const [modo, a1, a2] = process.argv.slice(2);

if (modo === 'vozes') {
  const amostra = `${FALAS.h2.fala} ${FALAS.h5.fala}`;
  for (const p of PRESETS_BRITANICOS) {
    const t = await medir(`voz ${p}`, () => tts(amostra, p));
    await baixar(t.output[0], `voz-${p.toLowerCase()}.mp3`);
  }
} else if (modo === 'imagens') {
  if (!CENARIOS[a1]) throw new Error(`cenário: ${Object.keys(CENARIOS).join(' | ')}`);
  const uri = await subir(APROVADA);
  const t = await medir(`imagem ${a1}`, () => client.textToImage
    .create({ model: 'gpt_image_2', promptText: CENARIOS[a1], ratio: '1920:1088', quality: 'medium', outputCount: 2,
      referenceImages: [{ uri, tag: 'Iris' }] })
    .waitForTaskOutput());
  for (const [i, url] of t.output.entries()) await baixar(url, `${a1}-${'ab'[i]}.png`);
} else if (modo === 'host') {
  const F = FALAS[a1]; if (!F || !a2) throw new Error('uso: host <h1..h6> <imagem.png>');
  const uri = await subir(path.resolve(SAIDA, a2));
  const t = await medir(`veo3.1_fast ${a1}`, () => client.imageToVideo
    .create({ model: 'veo3.1_fast', promptImage: uri, ratio: '1280:720', duration: 8, audio: true,
      promptText: `Documentary piece to camera. ${CAMERA} ${F.acao} She says, ${VOZ_VEO}: "${F.fala}" Quiet hospital room tone, no music.` })
    .waitForTaskOutput());
  await baixar(t.output[0], `${a1}-veo.mp4`);
} else if (modo === 'apoio') {
  if (!APOIO[a1]) throw new Error(`apoio: ${Object.keys(APOIO).join(' | ')}`);
  const t = await medir(`wan3 ${a1}`, () => client.textToVideo
    .create({ model: 'wan3', promptText: APOIO[a1], ratio: '832:480', duration: 5, audio: true })
    .waitForTaskOutput());
  await baixar(t.output[0], `${a1}.mp4`);
} else if (modo === 'voz') {
  const base = path.join(SAIDA, `${a1}-veo`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.mp4`, '-vn', '-ac', '1', '-b:a', '128k', `${base}-audio.mp3`]);
  const uri = await subir(`${base}-audio.mp3`);
  const t = await medir(`sts ${a2} ${a1}`, () => client.speechToSpeech
    .create({ model: 'eleven_multilingual_sts_v2', media: { type: 'audio', uri }, removeBackgroundNoise: true,
      voice: { type: 'runway-preset', presetId: a2 } })
    .waitForTaskOutput());
  await baixar(t.output[0], `${a1}-voz.mp3`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${base}.mp4`, '-i', path.join(SAIDA, `${a1}-voz.mp3`),
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-shortest', path.join(SAIDA, `${a1}-final.mp4`)]);
} else if (modo === 'anim') {                 // anim <id> [veo|wan]
  const A = ANIM[a1]; if (!A) throw new Error(`anim: ${Object.keys(ANIM).join(' | ')}`);
  const wan = a2 === 'wan';
  const t = await medir(`${wan ? 'wan3' : 'veo3.1_fast'} ${a1}`, () => client.textToVideo
    .create(wan
      ? { model: 'wan3', promptText: `${A.txt} ${ESTILO}`, ratio: '1280:720', duration: A.dur, audio: false }
      : { model: 'veo3.1_fast', promptText: `${A.txt} ${ESTILO}`, negativePrompt: NEGATIVO, ratio: '1280:720',
          duration: A.dur, audio: false, seed: 26090 + Object.keys(ANIM).indexOf(a1) })
    .waitForTaskOutput());
  await baixar(t.output[0], `${a1}${wan ? '-wan' : ''}.mp4`);
} else if (modo === 'narracao') {
  const so = a2 ? { [a2]: NARRACAO[a2] } : NARRACAO;      // narracao <Preset> [id]
  for (const [id, texto] of Object.entries(so)) {
    const t = await medir(`narração ${id} ${a1}`, () => tts(texto, a1));
    await baixar(t.output[0], `${id}.mp3`);
  }
} else {
  console.error('uso: vozes | imagens <cenario> | host <id> <png> | apoio <id> | voz <id> <Preset> | narracao <Preset>');
  process.exit(1);
}
