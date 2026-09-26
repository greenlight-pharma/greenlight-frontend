// Runway · 2Doctor para estudantes · hipertensão arterial: diagnóstico e tratamento (GASTA crédito)
// Pedido do Dilson (26/09): mesmo modelo do vídeo de SCA, mas a Iris aparece DE LADO no
// consultório médico (parece menos IA). Roteiro e conferência clínica: ../hipertensao/roteiro.md.
// Base: ep-sca.mjs (mesmas funções); diferenças: cenários, falas, apoios e pasta de saída.
//
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
const SAIDA = path.join(AQUI, '..', 'out', 'has');
const APROVADA = path.join(AQUI, '..', 'out', 'ref', 'iris-aprovada.png');

const IRIS = '@Iris, a physician in her early 40s: identical face, fine lines, a few grey strands, shoulder-length wavy dark brown hair, no makeup, simple stainless steel watch, deep teal (#265B5A) knit sweater over a white collared shirt, a white doctor\'s coat';
const FILME = 'Shot on 35mm film, muted colours, soft contrast, natural uneven light, fine grain, Netflix documentary look, widescreen 16:9. She is alone. No text, no readable signs, no logos.';
const LONGE = 'Wide shot: she occupies no more than a quarter of the frame height; the whole room around her is visible.';

// Enquadramento de entrevista de documentário (pedido do Dilson, 26/09): a câmera fica de
// lado, em três-quartos; ela fala com um entrevistador sentado logo ao lado da lente, então o
// olhar passa perto da câmera sem cravar nela. "Câmera B" = plano mais lateral para variar.
const ENTREVISTA = 'Documentary interview framing: the camera is placed to her side at a three-quarter angle; she is talking to an interviewer who sits just beside the camera, out of frame, so her eyes look slightly off-lens, engaged, mid-conversation, as in a Netflix documentary interview.';
const CENARIOS = {
  entrevista: `${IRIS}. ${ENTREVISTA} She sits in her own chair beside the desk of an ordinary outpatient consulting room, turned toward the interviewer, one hand gesturing gently: an automated blood pressure monitor and cuff on the desk, a stethoscope, a small anatomical heart model, a computer monitor with a blurred unreadable screen, an examination couch with a paper roll, a window with soft late-afternoon daylight through half-closed blinds. ${LONGE} ${FILME}`,
  cameraB: `${IRIS}. Second camera of the same documentary interview: a more lateral angle from across the room, she is seen from the side as she explains something to the interviewer off-screen, mid-sentence, hands slightly raised; she does not look at the camera. Ordinary outpatient consulting room: desk with automated blood pressure monitor and cuff, examination couch with paper roll, soft late-afternoon daylight through half-closed blinds. ${LONGE} ${FILME}`,
};

// Falas da Iris para a câmera (cabem em 8 s). Afirmações clínicas: ver a página.
// Falas da Iris (roteiro e conferência: ../hipertensao/roteiro.md). Todas na câmera A (entrevista-a.png):
// ela fala com o entrevistador ao lado da lente, nunca direto para a câmera.
const FALAS = {
  h1: { acao: 'She turns her head slightly toward the interviewer just beside the camera and speaks with a dry half-smile, hands resting on her lap.',
    fala: "They call hypertension the silent killer. Unfair, really. It isn't silent. We just don't listen until an organ complains." },
  h2: { acao: 'She leans back in her chair and speaks to the interviewer just beside the camera, slightly amused, one small open-hand gesture.',
    fala: "The definition sounds simple: pressure in your arteries that stays too high. The catch? A single reading proves almost nothing." },
  h3: { acao: 'She glances briefly at the blood pressure monitor on the desk, then back to the interviewer just beside the camera, deadpan.',
    fala: "Even measured properly, one clinic visit won't settle it. White-coat hypertension is real. So is its sneaky twin, masked hypertension." },
  h4: { acao: 'She sits upright and speaks to the interviewer just beside the camera, firm now, then a small warm smile at the end.',
    fala: "The unglamorous truth: most patients need more than one drug. And the best drug is the one they actually take." },
};
const VOZ_VEO = 'in a crisp, warm, low British English (Received Pronunciation) voice of a woman in her early forties, dry and unhurried';
const CAMERA = 'Locked-off static tripod shot: the framing never changes from the first frame; no push-in, no zoom, no dolly, no pan.';

// Narrações por cima do grafismo (sem imagem gerada).
const NARRACAO = {
  n1: 'Every heartbeat pushes against the artery wall. Keep the pressure high for years, and the wall thickens and stiffens to cope.',
  n2: 'So measure it properly: seated, after five minutes of rest, back supported, arm resting at heart level, and a cuff that actually fits.',
  n3: "Then look for the damage. The heart muscle thickens against the load. The kidney's tiny filters start to leak albumin.",
  n4: 'And the retina is the one place you can see small arteries directly. Years of high pressure narrow them.',
};

// Versão para estudantes (26/09): narração da Iris sobre a animação do 2Doctor.
// Cada número bate com app-motion/conteudo.js e com a conferência no NOTAS.md.
const NARRACAO_EST = {
  e0: "Right. The part you'll be examined on. I asked 2Doctor how to diagnose and treat it, with targets, doses and sources.",
  e1: "Measure properly: seated, five minutes' rest, arm supported at heart level, the right cuff. Three readings, one to two minutes apart; average the last two. Then confirm at home or with a twenty-four-hour monitor: at home, hypertension starts at one-thirty-five over eighty-five. At one-eighty over one-ten, look for an emergency first.",
  e2: "Now, the transatlantic split. Europe: hypertension from one-forty over ninety, 'elevated' from one-twenty systolic, and a target systolic of one-twenty to one-twenty-nine. America: stage one from one-thirty over eighty, drugs there if risk is high, and a goal below one-thirty over eighty, ideally a systolic under one-twenty.",
  e3: 'The first-line drugs: an ACE inhibitor or an ARB, a dihydropyridine calcium channel blocker, and a thiazide or thiazide-like diuretic. Ramipril: two and a half milligrams, up to twenty. Losartan: fifty, up to a hundred. Amlodipine: five, up to ten. Chlorthalidone: twelve and a half to twenty-five. Indapamide: one-point-two-five to two and a half.',
  e4: 'The algorithm. Most patients start on two drugs at low dose, in one pill: an ACE inhibitor or ARB, plus a calcium channel blocker or a diuretic. Not controlled? All three. Still not? Check adherence, confirm at home, and add spironolactone. Start with one drug only in the frail, the very old, symptomatic postural hypotension, or elevated blood pressure below one-forty over ninety.',
  e5: "Follow-up every one to three months until controlled, ideally within three months, then at least yearly. Resistant means uncontrolled on three drugs, including a diuretic, at maximum tolerated doses, confirmed out of office. Very high pressure without organ damage: oral drugs. With acute organ damage, it's an emergency: intensive care, intravenous treatment.",
  e6: 'Sources on screen. Check doses, kidney function, potassium and your local protocol before you prescribe anything.',
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
const ANIM = {  // prompts de ../hipertensao/roteiro.md (5 s, wan3 720p)
  a1: { dur: 5, txt: 'Medical animation, photorealistic: a long cross-section of a human artery in darkness, the camera gliding slowly alongside it; with each rhythmic pulse the artery wall stretches outward; over the shot the muscular middle layer of the wall gradually becomes thicker and denser and the vessel looks stiffer, stretching less with each pulse, while red blood cells keep flowing through the narrower channel.' },
  a2: { dur: 5, txt: 'Photorealistic close-up in a quiet clinic room: a relaxed adult forearm and bare upper arm resting on a table at chest height, a grey blood pressure cuff wrapped snugly around the upper arm, the tube running to an automatic monitor with a dark blank screen; the cuff slowly inflates and then deflates; only the arm, shoulder of a plain shirt and the table are visible, no face, no hands of other people, soft window light, shallow depth of field.' },
  a3: { dur: 5, txt: 'Medical animation, photorealistic: a human heart in darkness, cut in a horizontal cross-section through both ventricles; the wall of the left ventricle slowly and evenly grows thicker, the chamber inside becoming smaller, while the heart keeps beating calmly; muted red muscle, soft side light.' },
  a4: { dur: 5, txt: 'Medical animation, photorealistic: inside a human kidney, a single glomerulus, a tiny ball of looping capillaries, glowing softly in darkness; the camera drifts closer; a few tiny bright particles slowly pass through the filter wall into the surrounding capsule, like fine sand through a sieve.' },
  a5: { dur: 5, txt: 'Photorealistic medical visualization of the back of a human eye as seen through an ophthalmoscope: an orange-red retina with the pale optic disc, fine arteries and veins branching across it; slowly, the thin arteries become narrower and paler with a brighter reflective stripe along them, while the veins stay the same; gentle vignette, no instruments visible.' },
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
  await appendFile(path.join(SAIDA, 'has-log.jsonl'), JSON.stringify(linha) + '\n');
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
      promptText: `Documentary interview, she is not looking into the lens. ${CAMERA} ${F.acao} She says, ${VOZ_VEO}: "${F.fala}" Quiet consulting room tone, no music.` })
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
  const TODAS = { ...NARRACAO, ...NARRACAO_EST };
  const so = a2 === 'estudantes' ? NARRACAO_EST : a2 ? { [a2]: TODAS[a2] } : NARRACAO;   // narracao <Preset> [id|estudantes]
  for (const [id, texto] of Object.entries(so)) {
    const t = await medir(`narração ${id} ${a1}`, () => tts(texto, a1));
    await baixar(t.output[0], `${id}.mp3`);
  }
} else {
  console.error('uso: vozes | imagens <cenario> | host <id> <png> | apoio <id> | voz <id> <Preset> | narracao <Preset>');
  process.exit(1);
}
