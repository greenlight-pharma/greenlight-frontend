# Hypertension: diagnosis and treatment · 2Doctor para estudantes (roteiro, 26/09/2026)

Série 2Doctor, apresentadora Dra. Iris Maren (britânica, voz Maggie, humor seco de documentário).
Formato do vídeo de SCA para estudantes: parte 1 com a Iris no consultório e animações médicas realistas; parte 2 só com a voz dela sobre a animação do app (`conteudo.js` desta pasta, mesmo formato de `app-motion/conteudo.js`).
Nada foi gerado: sem imagens, vídeos ou vozes. Revisão médica obrigatória antes de publicar.

Duração estimada (2,6 palavras/s): parte 1 ≈ 66 s, parte 2 ≈ 124 s, total ≈ 3:10.

## Linha do tempo · parte 1 (≈ 66 s)

| Início | Plano | Duração | Áudio |
|---|---|---|---|
| 0:00 | Iris, consultório (h1) | 8 s | fala h1 |
| 0:08 | a1 artéria sob pressão | 8 s (5 s gerados, câmera lenta ~0,65x) | narração n1 |
| 0:16 | Iris (h2) | 8 s | fala h2 |
| 0:24 | a2 aferição correta | 9 s (5 s, câmera lenta) | narração n2 |
| 0:33 | Iris (h3) | 8 s | fala h3 |
| 0:41 | a3 coração (HVE) + a4 rim | 8 s (4 + 4 s) | narração n3 |
| 0:49 | a5 retina | 7,5 s (câmera lenta) | narração n4 |
| 0:57 | Iris (h4) | 8 s | fala h4 |
| 1:05 | corte para o app (parte 2) | | e0 começa |

## Imagens iniciais da Iris (prompts; NÃO gerar sem aprovação)

Bloco fixo da série (igual ao `ep-sca.mjs`):
`@Iris, a physician in her early 40s: identical face, fine lines, a few grey strands, shoulder-length wavy dark brown hair, no makeup, simple stainless steel watch, deep teal (#265B5A) knit sweater over a white collared shirt, a white doctor's coat`
+ `Shot on 35mm film, muted colours, soft contrast, natural uneven light, fine grain, Netflix documentary look, widescreen 16:9. She is alone. No text, no readable signs, no logos.`

**consultorio-a (h1, h2, h4)**
`{IRIS}. Seen in left profile, turned three-quarters away from the camera, she sits at a plain wooden desk in an ordinary outpatient consulting room in late afternoon, talking to someone off-frame to the right: an examination couch with paper roll, a wall-mounted aneroid blood pressure gauge with an illegible dial and a coiled grey cuff hanging below it, a small sink, a window with half-closed blinds throwing soft stripes of daylight, a closed laptop, a paper cup of tea. Wide shot: she occupies no more than a quarter of the frame height; the whole room around her is visible. {FILME}`

**consultorio-b (h3, alternativa)**
`{IRIS}. She stands by the window of the same outpatient consulting room, seen in three-quarter profile from the left, holding a folded blood pressure cuff loosely in one hand, speaking to someone off-frame; the examination couch and the wall-mounted blood pressure gauge with an illegible dial are behind her, soft late-afternoon light. Wide shot: she occupies no more than a quarter of the frame height; the whole room around her is visible. {FILME}`

Câmera (Veo, igual ao SCA): `Locked-off static tripod shot: the framing never changes from the first frame; no push-in, no zoom, no dolly, no pan.` Voz no prompt: `in a crisp, warm, low British English (Received Pronunciation) voice of a woman in her early forties, dry and unhurried` (depois trocada pela Maggie).

## Falas da Iris (texto exato; cada uma cabe em 8 s)

| id | cenário | ação (prompt) | fala | palavras / s |
|---|---|---|---|---|
| h1 | consultorio-a | She turns her head slightly toward the person off-frame and speaks with a dry half-smile, hands resting on the desk. | "They call hypertension the silent killer. Unfair, really. It isn't silent. We just don't listen until an organ complains." | 19 / 7,3 |
| h2 | consultorio-a | She leans back in her chair and speaks to the person off-frame, slightly amused, one small open-hand gesture. | "The definition sounds simple: pressure in your arteries that stays too high. The catch? A single reading proves almost nothing." | 20 / 7,7 |
| h3 | consultorio-b | She glances down at the cuff in her hand, then back to the person off-frame, deadpan. | "Even measured properly, one clinic visit won't settle it. White-coat hypertension is real. So is its sneaky twin, masked hypertension." | 20 / 7,7 |
| h4 | consultorio-a | She sits upright and speaks to the person off-frame, firm now, then a small warm smile at the end. | "The unglamorous truth: most patients need more than one drug. And the best drug is the one they actually take." | 20 / 7,7 |

## Animações médicas (wan3, texto para vídeo, 1280:720, 5 s, sem áudio)

Sufixo em todos (estilo do `ep-sca.mjs`): `Photorealistic medical 3D animation, cinematic like a high-end Netflix science documentary, dark background, soft volumetric light, shallow depth of field, anatomically accurate, slow and calm camera. No text, no labels, no numbers, no logos, no faces, no blood, no gore.`
Cuidado de moderação (lição do SCA: m3a/m3b barrados): descrever mudanças como cor, espessura e luz, sem "dying", "damage", "bleeding".

| id | prompt | rótulo na tela |
|---|---|---|
| a1 | `Medical animation, photorealistic: a long cross-section of a human artery in darkness, the camera gliding slowly alongside it; with each rhythmic pulse the artery wall stretches outward; over the shot the muscular middle layer of the wall gradually becomes thicker and denser and the vessel looks stiffer, stretching less with each pulse, while red blood cells keep flowing through the narrower channel.` | Chronic high pressure · the artery wall thickens and stiffens |
| a2 | `Photorealistic close-up in a quiet clinic room: a relaxed adult forearm and bare upper arm resting on a table at chest height, a grey blood pressure cuff wrapped snugly around the upper arm, the tube running to an automatic monitor with a dark blank screen; the cuff slowly inflates and then deflates; only the arm, shoulder of a plain shirt and the table are visible, no face, no hands of other people, soft window light, shallow depth of field.` | Seated · 5 min rest · arm supported at heart level · a cuff that fits |
| a3 | `Medical animation, photorealistic: a human heart in darkness, cut in a horizontal cross-section through both ventricles; the wall of the left ventricle slowly and evenly grows thicker, the chamber inside becoming smaller, while the heart keeps beating calmly; muted red muscle, soft side light.` | Heart · left ventricular hypertrophy |
| a4 | `Medical animation, photorealistic: inside a human kidney, a single glomerulus, a tiny ball of looping capillaries, glowing softly in darkness; the camera drifts closer; a few tiny bright particles slowly pass through the filter wall into the surrounding capsule, like fine sand through a sieve.` | Kidney · albumin leaks through the filters |
| a5 | `Photorealistic medical visualization of the back of a human eye as seen through an ophthalmoscope: an orange-red retina with the pale optic disc, fine arteries and veins branching across it; slowly, the thin arteries become narrower and paler with a brighter reflective stripe along them, while the veins stay the same; gentle vignette, no instruments visible.` | Retina · narrowed arterioles |

## Narrações da parte 1 (TTS Maggie)

| id | sobre | texto | palavras / s |
|---|---|---|---|
| n1 | a1 | "Every heartbeat pushes against the artery wall. Keep the pressure high for years, and the wall thickens and stiffens to cope." | 21 / 8,1 |
| n2 | a2 | "So measure it properly: seated, after five minutes of rest, back supported, arm resting at heart level, and a cuff that actually fits." | 23 / 8,8 |
| n3 | a3 + a4 | "Then look for the damage. The heart muscle thickens against the load. The kidney's tiny filters start to leak albumin." | 20 / 7,7 |
| n4 | a5 | "And the retina is the one place you can see small arteries directly. Years of high pressure narrow them." | 19 / 7,3 |

## Parte 2 · app 2Doctor (≈ 124 s)

Pergunta digitada: "How do I diagnose and treat hypertension in adults? Include targets and doses."
Fontes buscadas: ESC 2024 · Hypertension guidelines / AHA/ACC 2025 · High BP guideline / FDA labels · DailyMed.
Cartões e tempos: ver `conteudo.js` (digitar 5,5 s; buscar 3,2 s; cartões 20,6 / 19,1 / 21,8 / 25,2 / 21,0 s; fontes 7,2 s).

| id | sobre | texto | palavras / s |
|---|---|---|---|
| e0 | digitação + busca | "Right. The part you'll be examined on. I asked 2Doctor how to diagnose and treat it, with targets, doses and sources." | 21 / 8,1 |
| e1 | cartão 1 · Diagnosis | "Measure properly: seated, five minutes' rest, arm supported at heart level, the right cuff. Three readings, one to two minutes apart; average the last two. Then confirm at home or with a twenty-four-hour monitor: at home, hypertension starts at one-thirty-five over eighty-five. At one-eighty over one-ten, look for an emergency first." | 51 / 19,6 |
| e2 | cartão 2 · ESC x ACC/AHA | "Now, the transatlantic split. Europe: hypertension from one-forty over ninety, 'elevated' from one-twenty systolic, and a target systolic of one-twenty to one-twenty-nine. America: stage one from one-thirty over eighty, drugs there if risk is high, and a goal below one-thirty over eighty, ideally a systolic under one-twenty." | 47 / 18,1 |
| e3 | cartão 3 · doses | "The first-line drugs: an ACE inhibitor or an ARB, a dihydropyridine calcium channel blocker, and a thiazide or thiazide-like diuretic. Ramipril: two and a half milligrams, up to twenty. Losartan: fifty, up to a hundred. Amlodipine: five, up to ten. Chlorthalidone: twelve and a half to twenty-five. Indapamide: one-point-two-five to two and a half." | 54 / 20,8 |
| e4 | cartão 4 · algoritmo | "The algorithm. Most patients start on two drugs at low dose, in one pill: an ACE inhibitor or ARB, plus a calcium channel blocker or a diuretic. Not controlled? All three. Still not? Check adherence, confirm at home, and add spironolactone. Start with one drug only in the frail, the very old, symptomatic postural hypotension, or elevated blood pressure below one-forty over ninety." | 63 / 24,2 |
| e5 | cartão 5 · seguimento | "Follow-up every one to three months until controlled, ideally within three months, then at least yearly. Resistant means uncontrolled on three drugs, including a diuretic, at maximum tolerated doses, confirmed out of office. Very high pressure without organ damage: oral drugs. With acute organ damage, it's an emergency: intensive care, intravenous treatment." | 52 / 20,0 |
| e6 | fontes | "Sources on screen. Check doses, kidney function, potassium and your local protocol before you prescribe anything." | 16 / 6,2 |

Números falados por extenso contam poucas palavras e demoram mais: medir a duração real depois do TTS e ajustar `tempos.cartoes`.

## Conferência

Como foi lido (26/09/2026): texto integral online das duas diretrizes aberto no Chrome (o curl e o WebFetch recebem 403/Cloudflare). As tabelas de recomendação das duas estão em imagem e foram lidas na própria imagem. Não usei o PDF, então cito seção e tabela, não página.
- ESC 2024: https://academic.oup.com/eurheartj/article/45/38/3912/7741010 (doi 10.1093/eurheartj/ehae178)
- AHA/ACC 2025: https://www.ahajournals.org/doi/10.1161/HYP.0000000000000249 (a mesma diretriz saiu no JACC 2025;86:1567–1678, doi 10.1016/j.jacc.2025.05.007). Confirmado: existe, publicada em 14/08/2025, primeiro autor Daniel W. Jones.
- Bulas FDA: API openFDA (label.json), set_id anotado abaixo; mesmo texto no DailyMed (https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=SETID).

| # | Afirmação (onde aparece) | Fonte e localização | Status |
|---|---|---|---|
| D1 | Sentado, 5 min de repouso, costas e braço apoiados, manguito na altura do coração, tamanho certo (bexiga 75–100% × 35–50% da circunferência) (n2, a2, cartão 1, e1) | ESC 2024 §5.2.2 "Office blood pressure measurement" e Figura 3 | conferido |
| D2 | 3 medidas com 1–2 min de intervalo, média das 2 últimas (cartão 1, e1) | ESC 2024 §5.2.2 (medida auscultatória; "additional measurements only if the readings differ by >10 mmHg") | conferido |
| D3 | ACC/AHA recomenda método padronizado (1, C-LD) e oscilométrico automático é razoável (2a, C-EO) | AHA/ACC 2025 §3.1.1, tabela de recomendações | conferido (não entrou no cartão) |
| D4 | ESC: não elevada <120/70; elevada 120/70–<140/90; hipertensão ≥140/90 (consultório) (cartões 1 e 2, e2) | ESC 2024 Table 5 (§5.1) | conferido |
| D5 | ESC fora do consultório (hipertensão): domicílio ≥135/85; MAPA diurna ≥135/85; 24 h ≥130/80; noturna ≥120/70 (cartão 1, e1) | ESC 2024 Table 5 | conferido |
| D6 | ACC/AHA: normal <120/<80; elevada 120–129/<80; estágio 1 130–139 ou 80–89; estágio 2 ≥140 ou ≥90 (média de ≥2 leituras em ≥2 ocasiões) (cartões 1 e 2, e2) | AHA/ACC 2025 Table 4 e mensagem principal 4 | conferido |
| D7 | ACC/AHA equivalências fora do consultório: 130/80 no consultório = domicílio 130/80, MAPA diurna 130/80, noturna 110/65, 24 h 125/75; 140/90 = 135/85, 135/85, 120/70, 130/80 | AHA/ACC 2025 Table 7 | conferido (não entrou no cartão, para não lotar) |
| D8 | Confirmar fora do consultório (MAPA ou MRPA): ESC I B; ACC/AHA 1 A (h3, cartão 1, e1) | ESC 2024 Rec. Table 1; AHA/ACC 2025 §3.1.4 | conferido |
| D9 | ≥180/110: avaliar emergência hipertensiva (cartão 1, e1) | ESC 2024 §5.3.2 ("For BP of ≥180/110 mmHg, assessment for hypertensive emergency is recommended") | conferido |
| D10 | Exames iniciais (não entrou no cartão; útil se trocar o cartão 2 por "Initial assessment"): glicemia de jejum (HbA1c se alterada), lipídios, Na, K, Hb/Ht, cálcio, TSH, creatinina e TFGe, urina tipo 1 e albumina/creatinina urinária, ECG de 12 derivações | ESC 2024 Table 8 (§7.4.3); AHA/ACC 2025 Table 6 (hemograma, Na, K, Ca, creatinina com TFGe CKD-EPI 2021, lipídios, glicemia ou HbA1c, TSH, urina tipo 1, albumina/creatinina ou proteína/creatinina, ECG) | conferido |
| D11 | ESC: iniciar remédio já se ≥140/90 (I A); se PA elevada e risco alto (≥10% em 10 anos ou condição de alto risco), 3 meses de estilo de vida e depois remédio se ≥130/80 (I A) (cartão 2) | ESC 2024 Rec. Table 17 e nota de rodapé c | conferido |
| D12 | ESC: meta sistólica 120–129 se bem tolerada (I A); se não, ALARA (I A); <140 a considerar se ≥85 anos ou hipotensão ortostática sintomática (IIa C); diastólica 70–79 pode ser considerada (IIb C) (cartão 2, e2) | ESC 2024 Rec. Table 18 | conferido |
| D13 | ACC/AHA: remédio se ≥140 sistólica ou ≥90 diastólica (1 A); se ≥130/80 com DCV (1 A/C-LD), diabetes, DRC ou PREVENT ≥7,5% (1 A/C-LD); demais após 3–6 meses de estilo de vida se continuar ≥130/80 (1 B-R) (cartão 2, e2) | AHA/ACC 2025 §5.2.2, tabela de recomendações | conferido |
| D14 | ACC/AHA: meta sistólica <130 com incentivo a <120 (1 A em risco aumentado; 2b B-NR nos demais); diastólica <80 (1 B-R) (cartão 2, e2) | AHA/ACC 2025 §5.2.7, tabela de recomendações | conferido |
| D15 | 1ª linha: IECA, BRA, BCC di-hidropiridínico, tiazídico ou tiazídico-símile (clortalidona, indapamida) (cartão 3, e3) | ESC 2024 Rec. Table 16 (I A); AHA/ACC 2025 Table 13 ("Agents recommended for initial therapy") | conferido |
| D16 | Faixas usuais (mg/dia): ramipril 2,5–20; enalapril 5–40; losartana 50–100; valsartana 80–320; candesartana 8–32; anlodipino 2,5–10; clortalidona 12,5–25; indapamida 1,25–2,5; HCTZ 25–50; espironolactona 25–100 (cartões 3 e 4, e3) | AHA/ACC 2025 Table 13 (FDA-Approved Drugs for Treatment of Hypertension). A ESC põe doses nas Tabelas Suplementares S7/S8, que não li | conferido na ACC/AHA |
| D17 | Dose inicial de bula: ramipril 2,5 mg 1x/dia sem diurético (manutenção 2,5–20) | FDA label ramipril, §2.1, set_id 01da05d8-e72e-4208-bf92-a5cd929f15ab | conferido |
| D18 | Enalapril 5 mg 1x/dia sem diurético; faixa usual 10–40 mg | FDA label enalapril, Dosage and Administration, set_id 074fe718-88d8-365c-e063-6394a90a299d | conferido |
| D19 | Losartana 50 mg 1x/dia (até 100) | FDA label losartan, §2.1, set_id 021cd76a-b093-4704-8410-5e7d01e20a54 | conferido |
| D20 | Valsartana 80–160 mg 1x/dia (faixa 80–320) | FDA label Diovan, §2.2, set_id 5ddba454-f3e6-43c2-a7a6-58365d297213 | conferido |
| D21 | Candesartana 16 mg 1x/dia (8–32 mg) | FDA label candesartan, §2.1, set_id 0f2b2fa3-249b-4756-a3f1-3223a004d9cb | conferido |
| D22 | Anlodipino 5 mg, máximo 10; 2,5 mg em pacientes pequenos, frágeis, idosos ou com insuficiência hepática | FDA label amlodipine, §2.1, set_id 003dd1ec-16f8-4f96-b6a8-c4689d35892a | conferido |
| D23 | Clortalidona: bula inicia com 25 mg (até 100); diretriz usa 12,5–25 | FDA label chlorthalidone, set_id 01065eda-7515-46bc-b858-a062c3aa35bd; AHA/ACC Table 13 | conferido (ver divergência) |
| D24 | Indapamida 1,25 mg; pode subir para 2,5 (e 5) | FDA label indapamide, set_id 0687ed93-4761-4f9c-887d-95309c03f60e | conferido |
| D25 | HCTZ 25 mg; até 50 | FDA label hydrochlorothiazide, set_id 01ad3531-5ed9-434c-b7d5-02d72aa82e46 | conferido |
| D26 | Espironolactona na hipertensão: iniciar 25–100 mg/dia | FDA label spironolactone, §2.3, set_id 08738ad4-1607-4d55-af71-6790477353bd | conferido |
| D27 | Combinação dupla como terapia inicial na maioria com ≥140/90: IECA/BRA + BCC ou diurético (ESC I B); em comprimido único (I B); "initially at low dose" (cartão 4, e4, h4) | ESC 2024 Rec. Table 16 e §8.3.4 (texto) | conferido |
| D28 | ACC/AHA: estágio 2 começa com 2 fármacos de classes diferentes, idealmente em comprimido único (1 B-R); estágio 1, um fármaco é razoável (2a C-EO) (cartão 4) | AHA/ACC 2025 §5.2.4, tabela de recomendações | conferido |
| D29 | Exceções à dupla (ESC): ≥85 anos, hipotensão ortostática sintomática, fragilidade moderada a grave, PA elevada (120–139/70–89) com indicação (cartão 4, e4) | ESC 2024 Rec. Table 16 | conferido. Observação: o pedido citava 130–139/85–89 (faixa "normal-alta" da ESC 2018); na ESC 2024 é 120–139/70–89 |
| D30 | Passo 2: tripla (IECA/BRA + BCC + tiazídico/tiazídico-símile), de preferência em comprimido único (I B) (cartão 4, e4) | ESC 2024 Rec. Table 16 | conferido |
| D31 | Passo 3: espironolactona se não controla com a tripla (ESC IIa B); ACC/AHA: ARM recomendado (1 B-R) na resistente com IECA/BRA + BCC + tiazídico-símile e TFGe ≥45 (cartão 4, e4) | ESC 2024 Rec. Table 16 e §8.3.4; AHA/ACC 2025 §5.6 | conferido |
| D32 | Nunca IECA + BRA (ESC III A; ACC/AHA 3: Harm A) (nota do cartão 3) | ESC 2024 Rec. Table 16; AHA/ACC 2025 §5.2.4 | conferido |
| D33 | Rever a cada 1–3 meses até controlar; controle de preferência em 3 meses (cartão 5, e5) | ESC 2024 §8.4 e §8.3.5 (texto) | conferido |
| D34 | Depois de controlada, seguimento ao menos anual (IIa C) (cartão 5, e5) | ESC 2024 Rec. Table 19 | conferido |
| D35 | Resistente (ESC): estilo de vida + doses máximas toleradas de diurético, bloqueador do SRA e BCC sem chegar a <140/90, confirmada por MRPA ou MAPA (cartão 5, e5) | ESC 2024 Table 10 (§7.5) | conferido |
| D36 | Resistente (ACC/AHA): acima da meta com 3 fármacos de mecanismos complementares incluindo diurético em dose máxima tolerada, ou na meta com ≥4 fármacos; avaliar causas secundárias (1 B-NR) (cartão 5) | AHA/ACC 2025 §5.6 (sinopse e recomendações) | conferido |
| D37 | Hipertensão grave >180/120 sem lesão aguda de órgão: tratar em ambulatório com via oral (cartão 5, e5) | AHA/ACC 2025, mensagem principal 10; §6.2 recomendação 4 (3: Harm para IV/oral intermitente só para baixar a PA em internados) | conferido |
| D38 | Emergência: ACC/AHA >180 e/ou >120 com lesão aguda de órgão → UTI e parenteral (1 B-NR); sem condição especial, baixar a sistólica no máximo 25% na 1ª hora, depois <160/100 em 2–6 h, depois 130–140 em 24–48 h (1 C-LD). ESC: ≥180/110 com lesão aguda de órgão, em geral tratamento IV (cartão 5, e5) | AHA/ACC 2025 §6.2; ESC 2024 §10.1.1 | conferido |
| D39 | Parede arterial engrossa e enrijece com a pressão alta (n1, a1) | Fisiologia geral. A ESC 2024 tem recomendações de lesão vascular (rigidez arterial) em §7.4.3, título visto, texto não lido | [NÃO CONFERIDO] no texto. Alternativa: "Keep the pressure high for years, and the arteries pay for it." |
| D40 | HVE e albuminúria como lesão de órgão-alvo (n3, a3, a4) | ESC 2024 §7.4.3.2 (ECG para HVE na rotina) e Table 8 / Rec. Table 8 (albumina/creatinina urinária) | conferido |
| D41 | Retina: arteríolas estreitadas na hipertensão (n4, a5) | Não localizei a seção da ESC 2024 sobre retinopatia | [NÃO CONFERIDO]. Alternativa genérica: "And the eyes and the brain have small vessels too. They suffer the same way." ou trocar a5 por cérebro (pequenos vasos) depois de conferir |
| D42 | "A single reading proves almost nothing" / hipertensão do avental branco e mascarada (h2, h3) | ESC 2024 Rec. Table 1 ("can detect both white-coat hypertension and masked hypertension"); AHA/ACC 2025 Table 9 e Table 4 (≥2 leituras em ≥2 ocasiões) | conferido (h2 é frase de efeito, não número) |
| D43 | "Most patients need more than one drug" (h4) | ESC 2024 Rec. Table 16 ("combination … recommended for most patients with confirmed hypertension") | conferido como indicação; não é estatística de quantos precisam |

### Onde ESC 2024 e ACC/AHA 2025 divergem
1. **Definição**: ESC chama hipertensão a partir de 140/90 (120–139/70–89 = "elevated"); ACC/AHA chama 130–139/80–89 de hipertensão estágio 1 e reserva "elevated" para 120–129/<80.
2. **Meta**: ESC 120–129 de sistólica (e ALARA se não tolera); ACC/AHA <130/80 com incentivo a <120.
3. **Início do remédio com risco alto**: ESC usa SCORE2 ≥10% em 10 anos (ou condição de alto risco) e exige 3 meses de estilo de vida antes, quando a PA é "elevada"; ACC/AHA usa PREVENT ≥7,5% e trata já a partir de 130/80 nesses casos.
4. **Primeiro remédio**: ESC recomenda combinação para a maioria com ≥140/90 (inclusive "estágio 1" europeu 140–159); ACC/AHA obriga dupla só no estágio 2 e acha razoável começar com um no estágio 1.
5. **Resistente**: ESC mede contra 140/90 e exige confirmação fora do consultório; ACC/AHA mede contra a meta (<130/80) e inclui quem precisa de ≥4 fármacos. Espironolactona: ESC IIa B; ACC/AHA ARM 1 B-R (com TFGe ≥45).
6. **Emergência**: ESC ≥180/110; ACC/AHA >180/120 e troca "urgência" por "hipertensão grave" sem lesão aguda.
7. **Clortalidona**: a bula FDA começa em 25 mg; a tabela da ACC/AHA usa 12,5–25 mg/dia. O cartão mostra os dois (bula na coluna do início, diretriz na faixa).

### Não usado
- Diretriz Brasileira de Hipertensão Arterial 2025 (SBC/SBH/SBN): não consultada, porque ESC e ACC/AHA cobriram tudo. Vale conferir antes de uma versão para o Brasil.
- Tabelas Suplementares S7/S8 da ESC (doses): não lidas.

### Nota de navegação
Para ler as diretrizes usei o Chrome do Dilson. A primeira navegação reaproveitou a aba que estava no grupo do Claude (x.com/2doctorAI) e a levou para a AHA; depois abri e fechei uma aba própria. Nenhum formulário, login ou compra.
