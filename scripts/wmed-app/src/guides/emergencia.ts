// Protocolos de emergência (adultos, salvo indicação). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica antes da liberação ampla e deve ser conferido com as diretrizes citadas e o protocolo local.
import type {Guide} from './types';

export const EMERGENCIA:Guide[]=[
{id:'pcr-adulto',title:'Parada cardiorrespiratória no adulto',area:'Emergência',summary:'RCP de alta qualidade, ritmos chocáveis e não chocáveis, causas reversíveis e cuidados pós-PCR.',
 sources:[['AHA · Diretrizes de RCP e cuidados cardiovasculares de emergência','https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines'],['ERC Guidelines 2021 · Suporte avançado de vida','https://www.cprguidelines.eu/']],
 body:`## RCP de alta qualidade
- Compressões de **100–120/min**, profundidade de **5–6 cm**, retorno total do tórax, interrupções < 10 s.
- Sem via aérea avançada: **30:2**. Com via aérea avançada: compressões contínuas e **1 ventilação a cada 6 s**.
- Troque o compressor a cada **2 minutos** (a cada checagem de ritmo).
- Capnografia: ETCO₂ < 10 mmHg sugere RCP ineficaz; aumento súbito (> 35–40 mmHg) sugere retorno da circulação.

## Ritmos chocáveis: FV e TV sem pulso
1. **Choque** (bifásico 120–200 J, conforme o fabricante; ou dose máxima) e RCP imediata por 2 min.
2. Após o **2º choque**: **adrenalina 1 mg IV/IO** a cada 3–5 min.
3. Após o **3º choque**: **amiodarona 300 mg** IV/IO (2ª dose: **150 mg**) ou lidocaína 1–1,5 mg/kg (depois 0,5–0,75 mg/kg).

## Ritmos não chocáveis: AESP e assistolia
- **Adrenalina 1 mg IV/IO o quanto antes**, repetindo a cada 3–5 min.
- Checar ritmo a cada 2 min; busque ativamente a causa.

## Causas reversíveis (5 H e 5 T)
| H | T |
|---|---|
| Hipovolemia | Tensão no tórax (pneumotórax hipertensivo) |
| Hipóxia | Tamponamento cardíaco |
| H⁺ (acidose) | Toxinas |
| Hipo/hipercalemia | Trombose pulmonar |
| Hipotermia | Trombose coronariana |

## Após o retorno da circulação
- SpO₂ **92–98%**, PaCO₂ **35–45 mmHg**, **PAM ≥ 65 mmHg** ([calcular PAM](#scores?id=pam)).
- ECG de 12 derivações: supra de ST ou suspeita de causa coronariana → **cateterismo de urgência**.
- **Controle de temperatura** e prevenção ativa de febre nos pacientes que não respondem a comandos.
- Glicemia, eletrólitos, investigar e tratar a causa.

**Atenção.** Adrenalina no ritmo chocável só depois do 2º choque; no não chocável, imediatamente.`},

{id:'sepse',title:'Sepse e choque séptico',area:'Emergência',summary:'Reconhecimento, pacote da primeira hora, reposição volêmica, vasopressores e corticoide.',
 sources:[['Surviving Sepsis Campaign 2021 (Crit Care Med 2021;49:e1063)','https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines-2021'],['Sepsis-3 (JAMA 2016;315:801)','https://jamanetwork.com/journals/jama/fullarticle/2492881']],
 body:`## Definições (Sepsis-3)
- **Sepse:** disfunção orgânica ameaçadora à vida por resposta desregulada à infecção (aumento de **SOFA ≥ 2**).
- **Choque séptico:** vasopressor para **PAM ≥ 65 mmHg** e **lactato > 2 mmol/L** apesar de volume adequado.
- qSOFA e NEWS2 ajudam a reconhecer, mas **não** devem ser usados sozinhos como rastreio ([qSOFA](#scores?id=qsofa), [NEWS2](#scores?id=news2)).

## Primeira hora
1. **Lactato** (repetir se > 2 mmol/L).
2. **Hemoculturas** (2 pares) antes do antibiótico, sem atrasá-lo.
3. **Antibiótico de amplo espectro:** em até **1 hora** se choque ou sepse provável; se sepse possível sem choque, investigar em até 3 h e tratar se a suspeita persistir. Ver o [guia de antimicrobianos](#protocolos?guia=sepse-foco).
4. **Cristaloide 30 mL/kg** nas primeiras 3 h se hipoperfusão ou choque (prefira soluções balanceadas); reavalie a responsividade a volume.
5. **Vasopressor** se hipotensão durante ou após o volume: meta **PAM ≥ 65 mmHg**.

## Vasopressores
- **Noradrenalina** é a primeira escolha; pode ser iniciada em acesso periférico calibroso enquanto se obtém o central ([calcular infusão](#scores?id=infusao)).
- Adicionar **vasopressina 0,03 U/min** quando a noradrenalina está entre 0,25–0,5 mcg/kg/min.
- Disfunção cardíaca com hipoperfusão persistente: adicionar **dobutamina** ou trocar por adrenalina.

## Corticoide
- **Hidrocortisona 200 mg/dia** (50 mg a cada 6 h) se choque com noradrenalina ou adrenalina **≥ 0,25 mcg/kg/min por ≥ 4 h**.

## Controle do foco
Drenagem de abscessos, remoção de cateter infectado, desbridamento ou cirurgia assim que possível.

**Atenção.** Não espere exames para iniciar antibiótico no choque séptico. Lactato normal não exclui hipoperfusão.`},

{id:'anafilaxia',title:'Anafilaxia',area:'Emergência',summary:'Diagnóstico clínico e adrenalina intramuscular imediata; tratamento adjuvante e observação.',
 sources:[['World Allergy Organization · Anaphylaxis guidance 2020','https://www.worldallergyorganizationjournal.org/article/S1939-4551(20)30375-6/fulltext'],['Resuscitation Council UK 2021 · Emergency treatment of anaphylaxis','https://www.resus.org.uk/library/additional-guidance/guidance-anaphylaxis/emergency-treatment']],
 body:`## Quando pensar
Início agudo (minutos a horas) com **pele/mucosa** (urticária, angioedema) **e** comprometimento **respiratório**, **circulatório** ou **gastrointestinal** grave — ou hipotensão/broncoespasmo/acometimento laríngeo logo após exposição a alérgeno conhecido, mesmo sem pele.

## Tratamento imediato
1. **Adrenalina IM 0,01 mg/kg** da solução 1 mg/mL na **face anterolateral da coxa**.
   - Máximo: **0,5 mg** em adultos e adolescentes; **0,3 mg** em crianças em idade escolar.
   - **Repita a cada 5 min** se não houver melhora.
2. Retire o gatilho, chame ajuda e posicione: deitado com pernas elevadas; sentado se dispneia; decúbito lateral se gestante.
3. **Oxigênio** em alto fluxo e **cristaloide IV** 500–1.000 mL em adultos (20 mL/kg em crianças) se hipotensão.
4. Broncoespasmo persistente: salbutamol inalatório.

## Anafilaxia refratária
Após **duas doses de IM** sem resposta: **adrenalina em infusão IV** com monitorização (equipe experiente); considerar glucagon se uso de betabloqueador.

## Depois da crise
- **Anti-histamínicos e corticoides não tratam a anafilaxia**: são adjuvantes (pele, prevenção incerta de reação bifásica).
- Observar por **6–12 h** conforme gravidade; alta com **caneta de adrenalina**, plano escrito e encaminhamento ao alergista.
- Triptase sérica em até 2 h ajuda a confirmar.

**Atenção.** Nunca troque a adrenalina IM por anti-histamínico ou corticoide. Adrenalina IV em bolus fora da PCR causa arritmias.`},

{id:'avc-isquemico',title:'AVC isquêmico agudo',area:'Emergência',summary:'Janelas de trombólise e trombectomia, metas de pressão e cuidados iniciais.',
 sources:[['AHA/ASA 2019 · Early management of acute ischemic stroke (Stroke 2019;50:e344)','https://www.ahajournals.org/doi/10.1161/STR.0000000000000211'],['ESO 2023 · Guidelines on thrombolysis and thrombectomy','https://eso-stroke.org/guidelines/eso-guideline-directory/']],
 body:`## Primeiros minutos
- Hora do **último momento visto bem**, glicemia capilar (hipoglicemia imita AVC), NIHSS ([NIHSS](#scores?id=nihss-completo)).
- **TC de crânio** sem contraste (exclui hemorragia) e **angio-TC** para oclusão de grande vaso.

## Trombólise IV (até 4,5 h do último momento visto bem)
- **Alteplase 0,9 mg/kg** (máx. 90 mg): 10% em bolus em 1 min e o restante em 60 min; **ou**
- **Tenecteplase 0,25 mg/kg** (máx. 25 mg) em bolus único.
- PA antes da trombólise **< 185/110 mmHg**; após, **< 180/105 mmHg** por 24 h.
- Sem antitrombóticos nas 24 h seguintes; neurocheck frequente.
- Contraindicações clássicas: hemorragia intracraniana, AVC ou TCE grave < 3 meses, cirurgia intracraniana/espinhal recente, sangramento ativo, plaquetas < 100.000, anticoagulação com INR > 1,7 ou DOAC recente, glicemia < 50 mg/dL.

## Trombectomia mecânica
- **Oclusão de grande vaso** da circulação anterior: até **6 h**; entre **6 e 24 h** com critérios de imagem (DAWN/DEFUSE-3).
- Não atrase a trombectomia para ver a resposta à trombólise.

## Sem trombólise
- Permitir hipertensão até **220/120 mmHg** nas primeiras 48–72 h, salvo outra indicação.
- **AAS** 160–325 mg em 24–48 h; dupla antiagregação por 21 dias em AVC menor ou AIT de alto risco ([ABCD²](#scores?id=abcd2)).
- Normoglicemia (140–180 mg/dL), cabeceira e deglutição avaliada antes de dieta oral.

**Atenção.** Tempo é cérebro: meta porta-agulha **≤ 60 min** (ideal ≤ 45).`},

{id:'crise-asma',title:'Crise de asma grave no adulto',area:'Emergência',summary:'Avaliação de gravidade, broncodilatadores, corticoide, sulfato de magnésio e sinais de UTI.',
 sources:[['GINA 2026 · Global Strategy for Asthma Management','https://ginasthma.org/reports/']],
 body:`## Gravidade
- **Grave:** fala só palavras, senta inclinado para frente, agitado, FR > 30, uso de musculatura acessória, FC > 120, SpO₂ < 90%, PFE ≤ 50%.
- **Risco de vida:** sonolência, confusão, tórax silencioso, bradicardia, hipercapnia (PaCO₂ normal ou alta é mau sinal).

## Tratamento
1. **Oxigênio** para SpO₂ **93–95%** (adultos).
2. **SABA** (salbutamol) inalatório repetido: espaçador 4–10 jatos a cada 20 min na 1ª hora, ou nebulização.
3. **Ipratrópio** associado ao SABA nas crises graves.
4. **Corticoide sistêmico** na 1ª hora: prednisolona 40–50 mg VO (ou equivalente IV).
5. **Sulfato de magnésio 2 g IV em 20 min** se não houver resposta ao tratamento inicial.
6. Reavaliar em 1 h com clínica, SpO₂ e PFE.

## Encaminhar à UTI
Piora apesar do tratamento, rebaixamento de consciência, exaustão, PaCO₂ em elevação ou necessidade de intubação (ver [intubação](#protocolos?guia=iot)).

## Alta
PFE > 60–80% do previsto, estável; corticoide oral por 5–7 dias, **iniciar ou otimizar corticoide inalatório** e revisão em 2–7 dias.

**Atenção.** Não prescreva só SABA na alta: todo paciente com crise precisa de controlador com corticoide inalatório.`},

{id:'cad',title:'Cetoacidose diabética',area:'Emergência',summary:'Diagnóstico, hidratação, potássio antes da insulina, insulina IV e resolução.',
 sources:[['ADA/EASD/JBDS/AACE/DTS · Hyperglycemic crises in adults 2024 (Diabetes Care 2024;47:1257)','https://diabetesjournals.org/care/article/47/8/1257/156808']],
 body:`## Diagnóstico (consenso 2024)
- Glicemia **≥ 200 mg/dL** (ou diabetes prévio), **cetonemia ≥ 3 mmol/L** (ou cetonúria ≥ 2+), **pH < 7,3 e/ou HCO₃ < 18 mEq/L**.
- Calcule o [ânion gap](#scores?id=gap) e o [sódio corrigido](#scores?id=na-glic).

## Tratamento
1. **Hidratação:** cristaloide isotônico 1–1,5 L na 1ª hora; depois conforme volemia e sódio corrigido.
2. **Potássio antes da insulina:**
   - K **< 3,5 mEq/L**: repor e **adiar a insulina** até K ≥ 3,5.
   - K **3,5–5,0**: 20–30 mEq em cada litro de soro.
   - K **> 5,0**: não repor; dosar a cada 2 h.
3. **Insulina regular IV 0,1 U/kg/h** (bolus opcional de 0,1 U/kg).
4. Glicemia **< 250 mg/dL**: adicionar **soro glicosado 5–10%** e reduzir a insulina (0,05 U/kg/h), mantendo até resolver a cetose.
5. **Bicarbonato** só se **pH < 7,0**.

## Resolução e transição
- Cetonemia < 0,6 mmol/L e pH venoso ≥ 7,3 (ou HCO₃ ≥ 18).
- Insulina subcutânea (basal) **1–2 h antes** de desligar a bomba.
- Investigue o gatilho: infecção, omissão de insulina, IAM, iSGLT2 (cetoacidose euglicêmica), gestação.

**Atenção.** Potássio sérico normal não significa estoque normal: a insulina derruba o K.`},

{id:'hipercalemia',title:'Hipercalemia',area:'Emergência',summary:'Estabilização da membrana, deslocamento para dentro das células e remoção do potássio.',
 sources:[['KDIGO Controversies Conference on potassium (Kidney Int 2020;97:42)','https://www.kidney-international.org/article/S0085-2538(19)30943-3/fulltext'],['UK Kidney Association 2023 · Treatment of acute hyperkalaemia in adults','https://ukkidney.org/health-professionals/guidelines/treatment-acute-hyperkalaemia-adults']],
 body:`## Avaliação
- Descartar **pseudo-hipercalemia** (hemólise, leucocitose/trombocitose extremas).
- **ECG:** onda T apiculada, alargamento de QRS, perda de onda P, padrão sinusoidal, bradicardia — **emergência** com K ≥ 6,5 ou alteração no ECG.

## 1. Estabilizar a membrana (minutos)
- **Gluconato de cálcio 10%, 30 mL IV** em 5–10 min (ou cloreto de cálcio 10% 10 mL em acesso central). Repetir se o ECG não melhorar em 5–10 min.

## 2. Deslocar o K para dentro das células
- **Insulina regular 10 U IV + glicose 25 g** (ex.: 50 mL de glicose 50%); monitorar glicemia por 4–6 h (risco de hipoglicemia).
- **Salbutamol nebulizado 10–20 mg** (efeito aditivo).
- **Bicarbonato** apenas se acidose metabólica associada.

## 3. Remover o potássio
- Diurético de alça (se volemia e função renal permitirem).
- Quelantes: **ciclossilicato de zircônio sódico** ou **patiromer**.
- **Hemodiálise** na hipercalemia refratária, com insuficiência renal grave ou alterações de ECG persistentes.

## Depois
Suspender ou ajustar fármacos que elevam K (IECA/BRA, espironolactona, AINE, suplementos) e investigar a causa.

**Atenção.** Cálcio protege o coração mas não baixa o potássio; sempre associe medidas de deslocamento e remoção.`},

{id:'iot',title:'Intubação orotraqueal em sequência rápida',area:'Emergência',summary:'Preparação, pré-oxigenação, indução e bloqueio neuromuscular, confirmação e ventilação inicial.',
 sources:[['Difficult Airway Society · Guidelines for tracheal intubation in critically ill adults (Br J Anaesth 2018;120:323)','https://das.uk.com/guidelines/icu_guidelines2017'],['ARDSNet · protocolo de ventilação protetora','https://www.ardsnet.org/files/ventilator_protocol_2008-07.pdf']],
 body:`## Preparação (checklist)
- Equipe, funções definidas e **plano B/C** (dispositivo supraglótico, cricotireoidostomia).
- Material: aspirador, laringoscópio/videolaringoscópio, bougie, tubos (7,0–8,0 em adultos), fio-guia, **capnógrafo**.
- Avaliar via aérea difícil (LEMON; [Mallampati](#scores?id=mallampati)); 2 acessos venosos; **otimizar hemodinâmica** antes (volume, vasopressor pronto).

## Pré-oxigenação
- **O₂ a 100% por 3 min** (ou 8 respirações de capacidade vital), cabeceira elevada 20–30°.
- VNI ou cateter nasal de alto fluxo se hipoxemia; manter O₂ nasal durante a laringoscopia (oxigenação apneica).

## Indução (doses por peso)
| Fármaco | Dose | Observações |
|---|---|---|
| Etomidato | 0,3 mg/kg | Estabilidade hemodinâmica |
| Cetamina | 1–2 mg/kg | Útil no choque e broncoespasmo |
| Propofol | 1–2 mg/kg | Hipotensão; reduzir no instável |
| Midazolam | 0,1–0,3 mg/kg | Início mais lento |

## Bloqueio neuromuscular
- **Rocurônio 1,2 mg/kg** (reversível com sugamadex 16 mg/kg).
- **Succinilcolina 1,5 mg/kg** — **contraindicada** em hipercalemia, queimadura ou esmagamento após 24 h, doença neuromuscular, imobilização prolongada, história de hipertermia maligna.
- Calcule o volume com a [dose por peso](#scores?id=dose-kg).

## Confirmação e pós-intubação
- **Capnografia com curva sustentada** é obrigatória; ausculta e expansão torácica; RX para posição.
- Sedoanalgesia contínua logo após (bloqueador sem sedação = paciente acordado paralisado).
- Ventilação inicial: **VC 6 mL/kg de peso predito** ([peso ideal](#scores?id=peso-ideal)), PEEP 5 cmH₂O, FiO₂ para SpO₂ 92–96%, FR 16–20; pressão de platô **< 30 cmH₂O**.
- Hipotensão pós-intubação é comum: vasopressor à mão ([infusão](#scores?id=infusao)).

**Atenção.** No choque, reduza a dose do indutor e tenha vasopressor pronto. Sem capnografia, trate o tubo como esofágico.`},

{id:'drogas-vasoativas',title:'Drogas vasoativas e infusões contínuas',area:'Emergência',summary:'Faixas de dose, diluições de exemplo e cuidados das principais infusões em UTI e emergência.',
 sources:[['Surviving Sepsis Campaign 2021','https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines-2021'],['StatPearls · Vasopressors (NCBI Bookshelf)','https://www.ncbi.nlm.nih.gov/books/NBK551684/'],['SCCM PADIS 2018 · Pain, agitation/sedation, delirium','https://www.sccm.org/clinical-resources/guidelines/guidelines/guidelines-for-the-prevention-and-management-of-pa']],
 body:`Converta dose em mL/h com a [calculadora de infusão](#scores?id=infusao). **As diluições abaixo são exemplos: siga o padrão da sua instituição.**

## Vasopressores e inotrópicos
| Fármaco | Faixa usual | Diluição de exemplo | Notas |
|---|---|---|---|
| Noradrenalina | 0,05–0,5 mcg/kg/min (pode exceder) | 4 mg em 250 mL = 16 mcg/mL | 1ª escolha no choque séptico |
| Vasopressina | 0,03 U/min (fixa) | 20 U em 100 mL = 0,2 U/mL | Poupadora de noradrenalina |
| Adrenalina | 0,05–0,5 mcg/kg/min | 4 mg em 250 mL = 16 mcg/mL | Choque refratário, anafilaxia refratária |
| Dopamina | 5–20 mcg/kg/min | 200 mg em 250 mL = 800 mcg/mL | Mais arritmia; não é 1ª escolha |
| Dobutamina | 2–20 mcg/kg/min | 250 mg em 250 mL = 1.000 mcg/mL | Inotrópico; pode hipotensionar |
| Milrinona | 0,125–0,75 mcg/kg/min | 20 mg em 100 mL = 200 mcg/mL | Ajustar à função renal |

## Vasodilatadores
| Fármaco | Faixa usual | Diluição de exemplo | Notas |
|---|---|---|---|
| Nitroglicerina | 5–200 mcg/min | 50 mg em 250 mL = 200 mcg/mL | Evitar com PDE-5 e IAM de VD |
| Nitroprussiato | 0,3–3 mcg/kg/min (máx. 10) | 50 mg em 250 mL = 200 mcg/mL | Proteger da luz; toxicidade por cianeto |

## Sedação e analgesia contínuas
| Fármaco | Faixa usual | Notas |
|---|---|---|
| Fentanil | 0,7–10 mcg/kg/h | Analgesia primeiro (analgossedação) |
| Midazolam | 0,02–0,1 mg/kg/h | Acúmulo; mais delirium |
| Propofol | 5–50 mcg/kg/min | Hipotensão; síndrome de infusão em doses altas |
| Dexmedetomidina | 0,2–1,4 mcg/kg/h | Bradicardia; não deprime a respiração |

Meta de sedação com [RASS](#scores?id=rass): em geral 0 a −2.

**Atenção.** Use acesso central para vasopressores em dose alta ou prolongada; em periférico, veia calibrosa proximal e vigilância de extravasamento. Dupla checagem de diluição e bomba.`},

{id:'sca-emergencia',title:'Dor torácica e síndrome coronariana aguda',area:'Emergência',summary:'ECG em 10 minutos, estratificação, antitrombóticos e reperfusão.',
 sources:[['ESC 2023 · Acute coronary syndromes (Eur Heart J 2023;44:3720)','https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Coronary-Syndromes-ACS-Guidelines'],['ACC/AHA 2025 · Acute coronary syndromes','https://www.ahajournals.org/doi/10.1161/CIR.0000000000001309']],
 body:`## Primeiros 10 minutos
- **ECG de 12 derivações em até 10 min**; repetir se dor persistir. Inclua V7–V9 e V3R–V4R quando indicado.
- Troponina de alta sensibilidade com algoritmo 0/1 h ou 0/2 h.
- Estratificação: [HEART](#scores?id=heart), [TIMI](#scores?id=timi-nstemi).

## IAM com supra de ST
- **AAS 150–300 mg** VO (mastigar) + inibidor de P2Y12 conforme a estratégia.
- **ICP primária** idealmente em **≤ 90 min** (≤ 120 min com transferência).
- Sem ICP no prazo: **trombólise em até 30 min** (sem contraindicação) e transferência para ICP em 2–24 h.
- Anticoagulação (heparina) conforme a estratégia; [TIMI STEMI](#scores?id=timi-stemi), [Killip](#scores?id=killip).

## Sem supra de ST
- AAS, anticoagulação e estratificação invasiva: **imediata (< 2 h)** se instabilidade, arritmia ou dor refratária; **precoce (< 24 h)** se alto risco.

## Cuidados
- Nitrato para dor (não em IAM de VD, hipotensão ou PDE-5 recente).
- O₂ só se SpO₂ < 90%. Morfina com parcimônia.
- Estatina de alta intensidade precoce.

**Atenção.** BRE novo com clínica de isquemia deve ser manejado como IAM com supra ([Sgarbossa](#scores?id=sgarbossa)).`},
];
