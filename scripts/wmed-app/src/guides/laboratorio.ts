// Interpretação de exames laboratoriais (adultos, salvo indicação). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica antes da liberação ampla. Valores de referência variam entre laboratórios e métodos: use sempre os do laudo.
import type {Guide} from './types';

const AREA='Exames laboratoriais';
export const LABORATORIO:Guide[]=[
{id:'lab-hemograma',title:'Hemograma: anemias, leucócitos e plaquetas',area:AREA,summary:'Classificação das anemias pelo VCM e reticulócitos, causas de leucocitose e leucopenia, e abordagem de plaquetopenia e trombocitose.',
 sources:[['British Society for Haematology · Guidelines','https://b-s-h.org.uk/guidelines'],['OMS · Hemoglobin concentrations for the diagnosis of anaemia','https://www.who.int/publications/i/item/9789240088542']],
 body:`## Anemia: definição e primeiro passo
- Anemia (OMS): Hb **< 13 g/dL** no homem e **< 12 g/dL** na mulher não gestante (< 11 g/dL na gestante).
- Queda aguda com instabilidade é sangramento até prova em contrário: não espere índices para agir.
- Classifique pelo **VCM** e depois pelos **reticulócitos** (produção baixa versus perda ou destruição). Reticulócitos corrigidos > 2% (ou contagem absoluta > 100.000/µL) sugerem resposta medular adequada: hemorragia ou hemólise.

## Classificação pelo VCM
| VCM | Causas principais | Exames que ajudam |
|---|---|---|
| **< 80 fL** (microcítica) | Ferropenia, talassemia, anemia de doença crônica, sideroblástica | Ferritina, saturação de transferrina, eletroforese de Hb |
| **80–100 fL** (normocítica) | Sangramento agudo, hemólise, DRC, doença crônica, infiltração medular, anemia mista | Reticulócitos, LDH, bilirrubina indireta, haptoglobina, Coombs direto, creatinina |
| **> 100 fL** (macrocítica) | Deficiência de B12 ou folato, álcool, hepatopatia, hipotireoidismo, mielodisplasia, fármacos (metotrexato, hidroxiureia, zidovudina), reticulocitose | B12, folato, TSH, função hepática, esfregaço (neutrófilos hipersegmentados) |

- **Ferropenia:** ferritina **< 30 ng/mL** confirma; com inflamação, ferritina até **100 ng/mL** com saturação **< 20%** ainda é compatível. RDW elevado é típico.
- **Traço talassêmico:** hemácias numerosas para o grau de anemia, RDW normal e índice de Mentzer (VCM/hemácias em milhões) **< 13**.
- **Hemólise:** LDH e bilirrubina indireta altas, haptoglobina baixa, reticulocitose. Esquizócitos no esfregaço com plaquetopenia exigem pensar em **microangiopatia trombótica** (PTT, SHU, CIVD).
- Em homem ou mulher pós-menopausa com ferropenia, investigue perda digestiva (endoscopia e colonoscopia).

## Leucócitos
| Achado | Limiar | Pense em |
|---|---|---|
| Leucocitose | **> 11.000/µL** | Infecção, estresse, corticoide, tabagismo, asplenia, neoplasia mieloide |
| Reação leucemoide | **> 50.000/µL** | Infecção grave, *C. difficile*, neoplasia; diferenciar de LMC |
| Neutropenia | **< 1.500/µL**; grave **< 500/µL** | Quimioterapia, fármacos (dipirona, antitireoidianos, clozapina), viroses, B12, aplasia |
| Linfocitose | **> 4.000/µL** | Viroses (mononucleose), coqueluche, LLC no idoso |
| Eosinofilia | **> 500/µL** | Alergia, fármacos (DRESS), parasitoses, insuficiência adrenal, neoplasias |

- **Blastos** no sangue periférico, leucocitose extrema (> 100.000/µL) ou pancitopenia inexplicada: avaliação hematológica no mesmo dia.
- Desvio à esquerda (bastões > 10%) reforça infecção bacteriana, mas não a confirma.
- Neutropenia com febre (≥ 38,3 °C ou ≥ 38 °C por 1 h) é emergência: antibiótico de amplo espectro em até 1 h e risco pelo [MASCC](#scores?id=mascc).

## Plaquetas
- **Plaquetopenia < 150.000/µL.** Primeiro exclua **pseudoplaquetopenia** por EDTA (agregados no esfregaço; repita em tubo com citrato).
- Causas: sepse e CIVD, hepatopatia com hiperesplenismo, fármacos, PTI, gestação (HELLP), infecções virais, dengue, **trombocitopenia induzida por heparina** (queda > 50% entre 5 e 10 dias de heparina: calcule o [4Ts](#scores?id=4ts)).
- Risco de sangramento espontâneo relevante abaixo de **10.000–20.000/µL**. Transfusão profilática habitual: **< 10.000/µL**; para procedimentos invasivos, em geral **≥ 50.000/µL** (neurocirurgia: ≥ 100.000/µL).
- Plaquetopenia + anemia hemolítica + esquizócitos: suspeite de **PTT** e não transfunda plaquetas sem discutir com hematologia.
- **Trombocitose > 450.000/µL:** quase sempre reativa (ferropenia, inflamação, pós-esplenectomia, neoplasia). Persistente e sem causa, investigue neoplasia mieloproliferativa (JAK2).

**Atenção.** Interprete o hemograma sempre com o esfregaço e o contexto clínico; alterações em duas ou três séries sem causa óbvia merecem avaliação hematológica.`},

{id:'lab-gasometria',title:'Gasometria arterial passo a passo',area:AREA,summary:'Roteiro sistemático de leitura: distúrbio primário, compensações esperadas (Winter), ânion gap corrigido e delta-delta.',
 sources:[['Berend K et al. · Physiological approach to assessment of acid–base disturbances (NEJM 2014)','https://www.nejm.org/doi/full/10.1056/NEJMra1003327']],
 body:`## Valores de referência
| Parâmetro | Normal |
|---|---|
| pH | **7,35–7,45** |
| PaCO₂ | **35–45 mmHg** (use 40) |
| HCO₃⁻ | **22–26 mEq/L** (use 24) |
| PaO₂ | 80–100 mmHg em ar ambiente |
| Ânion gap | **8–12 mEq/L** (varia com o método) |
| Lactato | < 2 mmol/L |

## Passo a passo
1. **Coerência e oxigenação.** Veja se pH, PaCO₂ e HCO₃⁻ são compatíveis e avalie a oxigenação: [P/F](#scores?id=pf) e [gradiente A-a](#scores?id=aa).
2. **Acidemia ou alcalemia?** pH < 7,35 ou > 7,45. pH normal não exclui distúrbio misto.
3. **Distúrbio primário.** Se pH e PaCO₂ andam em direções opostas, é respiratório; se o HCO₃⁻ acompanha o pH, é metabólico.
4. **Compensação esperada** (tabela abaixo). Fora da faixa, há um segundo distúrbio.
5. **Ânion gap** sempre, mesmo sem acidose aparente: [ânion gap](#scores?id=gap) = Na − (Cl + HCO₃⁻). Corrija pela albumina: soma de **2,5 mEq/L para cada 1 g/dL** de albumina abaixo de 4 ([AG corrigido](#scores?id=gap-alb)).
6. **Delta-delta** na acidose com AG elevado.
7. **Causa clínica** de cada distúrbio encontrado.

## Compensações esperadas
| Distúrbio primário | Resposta esperada |
|---|---|
| Acidose metabólica | **PaCO₂ = 1,5 × HCO₃⁻ + 8 (± 2)** — fórmula de [Winter](#scores?id=winter) |
| Alcalose metabólica | PaCO₂ sobe **0,7 mmHg** por mEq/L de HCO₃⁻ acima de 24 |
| Acidose respiratória aguda | HCO₃⁻ sobe **1 mEq/L** a cada 10 mmHg de PaCO₂ |
| Acidose respiratória crônica | HCO₃⁻ sobe **3,5–4 mEq/L** a cada 10 mmHg |
| Alcalose respiratória aguda | HCO₃⁻ cai **2 mEq/L** a cada 10 mmHg |
| Alcalose respiratória crônica | HCO₃⁻ cai **4–5 mEq/L** a cada 10 mmHg |

Na acidose metabólica, PaCO₂ acima do previsto indica acidose respiratória associada (fadiga, sedação); abaixo, alcalose respiratória associada (sepse, salicilato).

## Delta-delta
- **Δ/Δ = (AG − 12) / (24 − HCO₃⁻)**.
- **< 1:** acidose com AG elevado + acidose hiperclorêmica (AG normal) associada.
- **1–2:** acidose com AG elevado pura (na cetoacidose pode ser ~1; no lático, ~1,6).
- **> 2:** acidose com AG elevado + **alcalose metabólica** associada (vômitos, diurético).

## Causas principais
- **AG elevado:** lactato, cetoacidose ([guia de CAD](#protocolos?guia=cad)), uremia, intoxicações (metanol, etilenoglicol, salicilato). Gap osmolar (medido − [calculado](#scores?id=osm)) **> 10 mOsm/kg** sugere álcool tóxico.
- **AG normal (hiperclorêmica):** diarreia, fístulas, acidose tubular renal, expansão com soro fisiológico. AG urinário (Na + K − Cl) negativo sugere perda digestiva; positivo, ATR.
- **Alcalose metabólica:** vômitos e sonda nasogástrica, diuréticos (cloro urinário **< 20 mEq/L** responde a salina), hiperaldosteronismo, hipocalemia.
- **Acidose respiratória:** hipoventilação (DPOC, sedação, doença neuromuscular). **Alcalose respiratória:** ansiedade, dor, hipoxemia, TEP, sepse precoce, gestação, hepatopatia.

**Atenção.** A gasometria venosa estima bem pH e HCO₃⁻, mas não substitui a arterial para oxigenação; sempre confira o resultado contra a clínica e os eletrólitos colhidos no mesmo momento.`},

{id:'lab-eletrolitos',title:'Eletrólitos: sódio, potássio, cálcio e magnésio',area:AREA,summary:'Abordagem de hipo e hipernatremia com limites seguros de correção, reposição de potássio e manejo de cálcio e magnésio.',
 sources:[['European Society of Endocrinology · Clinical practice guideline on hyponatraemia','https://www.ese-hormones.org/publications/guidelines/'],['KDIGO · Guidelines','https://kdigo.org/guidelines/']],
 body:`## Hiponatremia (Na < 135 mEq/L)
1. **Osmolalidade sérica.** Normal ou alta: pseudo-hiponatremia (hiperlipidemia, paraproteína) ou hiperglicemia — [Na corrigido pela glicemia](#scores?id=na-glic) (soma **1,6 mEq/L a cada 100 mg/dL** acima de 100; alguns usam 2,4). Baixa (< 275 mOsm/kg): hiponatremia hipotônica verdadeira.
2. **Osmolalidade urinária.** **< 100 mOsm/kg**: polidipsia primária ou baixa ingestão de solutos (cerveja, "chá com torradas"). > 100: ADH atuando.
3. **Sódio urinário.** **< 30 mEq/L**: volume circulante efetivo baixo (desidratação, IC, cirrose). **> 30 mEq/L**: SIADH, diurético, insuficiência adrenal, hipotireoidismo, perda renal de sal.

| Gravidade | Conduta |
|---|---|
| Sintomas graves (convulsão, coma, vômitos, rebaixamento) | **NaCl 3% 150 mL IV em 20 min**, repetir até 2–3 vezes; meta de subir **4–6 mEq/L** nas primeiras horas |
| Moderados ou leves, crônica | Tratar a causa: restrição hídrica no SIADH, salina isotônica na hipovolemia, suspender tiazídico |

- **Velocidade máxima:** **8–10 mEq/L em 24 h** (**8 mEq/L** em alto risco de desmielinização osmótica: alcoolismo, desnutrição, hipocalemia, cirrose, Na < 120).
- Monitore Na a cada 2–4 h no início. Diurese aquosa súbita (hipovolemia corrigida, desmopressina suspensa) acelera a correção: considere **desmopressina + soro glicosado** para frear.

## Hipernatremia (Na > 145 mEq/L)
- Quase sempre **déficit de água livre** com acesso limitado à água (idoso, intubado, rebaixado). Calcule o [déficit de água livre](#scores?id=agua-livre).
- Hipovolemia com instabilidade: primeiro salina isotônica. Depois, água livre (VO/sonda) ou **SG 5%**.
- **Crônica (> 48 h):** reduzir no máximo **10–12 mEq/L em 24 h** (≈ 0,5 mEq/L/h). Aguda (horas): pode corrigir mais rápido.
- Poliúria com urina diluída (osmolalidade < 300 mOsm/kg) sugere diabetes insípido.

## Hipocalemia (K < 3,5 mEq/L)
- Cada **10 mEq** de KCl eleva o K sérico em cerca de **0,1 mEq/L** (déficit corporal grande: K 3,0 ≈ 200–400 mEq).
- **Leve (3,0–3,4), assintomática:** KCl VO 40–80 mEq/dia fracionado.
- **Grave (< 2,5–3,0), arritmia, fraqueza, ECG alterado:** KCl IV **10 mEq/h em veia periférica** (até 20 mEq/h em veia central com monitor); concentração periférica até ~40 mEq/L. Evite diluir em soro glicosado.
- **Corrija o magnésio**: hipomagnesemia torna a hipocalemia refratária.
- Na CAD, K < 3,3 mEq/L impede iniciar insulina ([guia de CAD](#protocolos?guia=cad)). Hipercalemia: veja o [guia específico](#protocolos?guia=hipercalemia).

## Cálcio
- Corrija pela albumina: **Ca corrigido = Ca total + 0,8 × (4 − albumina)** ([calculadora](#scores?id=ca-corr)). Em doente crítico, prefira o **cálcio iônico** (normal ≈ 1,12–1,32 mmol/L).
- **Hipocalcemia sintomática** (tetania, laringoespasmo, QT longo, convulsão): **gluconato de cálcio 10% 10–20 mL IV em 10 min**, depois infusão; dose PTH, vitamina D e magnésio.
- **Hipercalcemia:** leve < 12 mg/dL; moderada 12–14; **grave > 14 mg/dL**. PTH alto: hiperparatireoidismo; PTH suprimido: neoplasia (PTHrP, metástases), vitamina D, granulomatoses. Tratamento da grave: **SF 0,9% vigoroso** (200–300 mL/h conforme volemia), **zoledronato 4 mg IV** e calcitonina para efeito rápido; furosemida só após hidratação e se hipervolemia.

## Magnésio
- Normal ≈ **1,7–2,4 mg/dL**. Causas de hipomagnesemia: diarreia, álcool, diuréticos, **inibidores de bomba de prótons**, desnutrição.
- Grave ou sintomática (arritmia, torsades, convulsão): **sulfato de magnésio 2 g IV em 10–15 min** (torsades), depois reposição lenta. Cuidado na insuficiência renal.

**Atenção.** Distúrbios crônicos de sódio corrigidos rápido demais causam lesão neurológica irreversível; documente metas horárias e dose o sódio seriadamente durante toda a correção.`},

{id:'lab-renal-urina',title:'Função renal e urina tipo 1',area:AREA,summary:'Critérios KDIGO de LRA, diferenciação pré-renal, renal e pós-renal com FENa e FEUreia, e leitura do sedimento urinário.',
 sources:[['KDIGO · Acute Kidney Injury guideline','https://kdigo.org/guidelines/acute-kidney-injury/'],['KDIGO · CKD Evaluation and Management','https://kdigo.org/guidelines/ckd-evaluation-and-management/']],
 body:`## Estimando a função renal
- A creatinina só sobe depois de perda importante de filtração e depende de massa muscular. Use a [TFG por CKD-EPI 2021](#scores?id=egfr) para classificar DRC e o [Cockcroft-Gault](#scores?id=cockcroft) para ajuste de dose quando a bula assim exigir.
- Nenhuma fórmula vale em LRA (creatinina fora de equilíbrio): ajuste doses pela tendência e pela diurese.
- Ureia no Brasil é relatada como ureia (não BUN): **ureia ≈ BUN × 2,14**. Relação ureia/creatinina **> 40** (BUN/Cr > 20) sugere pré-renal, sangramento digestivo ou catabolismo.

## Lesão renal aguda (KDIGO)
Definição: aumento de creatinina **≥ 0,3 mg/dL em 48 h**, ou **≥ 1,5 × a basal em 7 dias**, ou diurese **< 0,5 mL/kg/h por 6 h**.

| Estágio | Creatinina | Diurese |
|---|---|---|
| 1 | 1,5–1,9 × basal ou ↑ ≥ 0,3 mg/dL | < 0,5 mL/kg/h por 6–12 h |
| 2 | 2,0–2,9 × basal | < 0,5 mL/kg/h por ≥ 12 h |
| 3 | ≥ 3 × basal, ≥ 4,0 mg/dL ou diálise | < 0,3 mL/kg/h por ≥ 24 h ou anúria ≥ 12 h |

## Pré-renal, renal ou pós-renal
| Índice | Pré-renal | Necrose tubular aguda |
|---|---|---|
| [FENa](#scores?id=fena) | **< 1%** | **> 2%** |
| FEUreia (útil com diurético) | **< 35%** | > 50% |
| Na urinário | < 20 mEq/L | > 40 mEq/L |
| Osmolalidade urinária | > 500 mOsm/kg | < 350 mOsm/kg |
| Sedimento | Cilindros hialinos | Cilindros granulosos "castanho-barrosos", células tubulares |

- FENa baixa também ocorre em contraste, rabdomiólise, glomerulonefrite e síndrome hepatorrenal; e é falsamente alta com diurético ou DRC.
- **Pós-renal:** ultrassonografia em toda LRA sem causa clara, sobretudo homem idoso, neoplasia pélvica ou rim único. Resíduo pós-miccional alto: sonda vesical.
- Revise fármacos nefrotóxicos (AINE, aminoglicosídeo, vancomicina, contraste, IECA/BRA na hipovolemia) e ajuste doses.
- **Indicações de diálise de urgência:** acidose grave refratária, hipercalemia refratária ([guia de hipercalemia](#protocolos?guia=hipercalemia)), congestão refratária, uremia sintomática (pericardite, encefalopatia), intoxicação dialisável.

## Urina tipo 1 (EAS)
- **Densidade:** 1,005–1,030; isostenúria (~1,010) sugere perda da capacidade de concentrar.
- **Nitrito positivo:** enterobactérias (específico, pouco sensível). **Esterase leucocitária:** piúria. Bacteriúria assintomática não se trata, exceto gestante e antes de procedimento urológico ([guia de ITU](#protocolos?guia=itu)).
- **Proteinúria** na fita detecta albumina; quantifique com **relação proteína/creatinina** em amostra isolada (> 0,15 g/g alterada; **> 3,5 g/g** faixa nefrótica) ou albumina/creatinina (> 30 mg/g).
- **Hemoglobina na fita sem hemácias no sedimento:** mioglobinúria (rabdomiólise) ou hemoglobinúria.

## Sedimento urinário
| Achado | Sugere |
|---|---|
| Hemácias dismórficas, acantócitos, **cilindros hemáticos** | Glomerulonefrite |
| **Cilindros leucocitários** | Pielonefrite ou nefrite intersticial |
| Cilindros granulosos e células epiteliais tubulares | Necrose tubular aguda |
| Cilindros graxos, corpos ovalados | Síndrome nefrótica |
| Cristais (oxalato, ácido úrico) | Intoxicação por etilenoglicol, lise tumoral |

**Atenção.** LRA com sedimento nefrítico, proteinúria importante ou queda rápida e sem causa óbvia exige avaliação nefrológica precoce; glomerulonefrite rapidamente progressiva é urgência.`},

{id:'lab-hepatico',title:'Provas de função hepática',area:AREA,summary:'Padrão hepatocelular, colestático ou misto pelo fator R, causas de elevação extrema de transaminases e marcadores de função (albumina, INR, bilirrubina).',
 sources:[['AASLD · Practice Guidelines','https://www.aasld.org/practice-guidelines'],['ACG · Clinical Guideline: Evaluation of Abnormal Liver Chemistries','https://gi.org/guidelines/']],
 body:`## Lesão versus função
- **Marcadores de lesão:** ALT (TGP), AST (TGO), fosfatase alcalina (FA), GGT. Não medem função.
- **Marcadores de função:** **albumina**, **INR/TP** e **bilirrubina**. INR alargado com albumina baixa indica disfunção de síntese; na lesão aguda, o INR é o marcador mais precoce e prognóstico.
- A ALT é mais específica do fígado; AST também sobe em músculo (rabdomiólise, IAM), hemólise e tireoide.

## Fator R e padrão de lesão
**R = (ALT / LSN da ALT) ÷ (FA / LSN da FA)**, usando os limites superiores do próprio laboratório.

| R | Padrão | Causas principais |
|---|---|---|
| **> 5** | Hepatocelular | Hepatites virais, fármacos, isquemia, álcool, esteatose metabólica, autoimune, Wilson |
| **2–5** | Misto | Fármacos, hepatites infiltrativas, obstrução em evolução |
| **< 2** | Colestático | Obstrução biliar (cálculo, neoplasia), colangite biliar primária, colangite esclerosante, fármacos, infiltração |

- Confirme a origem hepática de uma FA elevada com **GGT** (FA óssea, gestação e adolescência não elevam a GGT).
- Colestase: faça **ultrassonografia** — dilatação de vias biliares indica obstrução extra-hepática; sem dilatação, pense em causas intra-hepáticas (anticorpo antimitocôndria, fármacos, infiltração).

## Transaminases muito elevadas
- **> 1.000 U/L:** hepatite viral aguda, **lesão por fármacos (paracetamol)**, **hepatite isquêmica** (choque, IC; pico rápido e queda em dias, com LDH muito alta), hepatite autoimune, obstrução biliar aguda por cálculo (queda rápida).
- **AST/ALT > 2** com AST raramente > 300–400 U/L e GGT alta: sugere **doença hepática alcoólica**. Na hepatite alcoólica, calcule a [função discriminante de Maddrey](#scores?id=maddrey) (≥ 32: grave).
- Elevação leve e persistente (< 5 × LSN): esteatose metabólica, álcool, hepatites B e C, fármacos, hemocromatose (saturação de transferrina > 45%), autoimune, celíaca, tireoide.
- **Lei de Hy:** ALT > 3 × LSN + bilirrubina > 2 × LSN por fármaco, sem colestase, prediz mortalidade de ~10%: suspenda o fármaco.

## Bilirrubinas
| Predomínio | Causas |
|---|---|
| **Indireta** (não conjugada) | Hemólise, **síndrome de Gilbert** (bilirrubina < 4–5 mg/dL, sobe em jejum e doença, enzimas normais), reabsorção de hematoma |
| **Direta** (conjugada) | Hepatocelular, colestase intra ou extra-hepática, sepse, nutrição parenteral |

Bilirrubina direta na urina (colúria) só aparece com hiperbilirrubinemia conjugada.

## Albumina, INR e gravidade
- **Albumina** baixa também ocorre em desnutrição, síndrome nefrótica, enteropatia e inflamação (meia-vida ~3 semanas: reflete cronicidade).
- **INR** alargado que corrige com vitamina K sugere colestase ou deficiência; sem correção, insuficiência hepática.
- **Insuficiência hepática aguda:** INR ≥ 1,5 + encefalopatia em paciente sem hepatopatia prévia, em < 26 semanas: contato precoce com centro de transplante.
- Hepatopatia crônica: estratifique com [Child-Pugh](#scores?id=child-pugh) e [MELD](#scores?id=meld).

**Atenção.** Enzimas hepáticas normais não excluem cirrose avançada, e um padrão isolado pode mudar com o tempo; repita os exames e interprete sempre com imagem e história de fármacos e álcool.`},

{id:'lab-tireoide',title:'Função tireoidiana: TSH e T4 livre',area:AREA,summary:'Padrões de TSH e T4 livre, hipo e hipertireoidismo clínico e subclínico, causas centrais e interferências (doença aguda, biotina, fármacos).',
 sources:[['American Thyroid Association · Professional Guidelines','https://www.thyroid.org/professionals/ata-professional-guidelines/'],['European Thyroid Association · Guidelines','https://www.eurothyroid.com/guidelines/eta_guidelines.html']],
 body:`## Princípio
- O **TSH** é o melhor exame de rastreio quando o eixo hipotálamo-hipófise está íntegro: pequenas variações do T4 livre geram grandes variações (log-linear) do TSH.
- Referência habitual: TSH **~0,4–4,5 mUI/L**; T4 livre **~0,8–1,8 ng/dL** (varia com o método). Idosos têm TSH normal um pouco mais alto (até ~6–7 mUI/L após 70–80 anos).
- Peça T4 livre junto com TSH quando houver suspeita de doença hipofisária, doença grave, gestação ou TSH alterado.

## Padrões
| TSH | T4 livre | Interpretação |
|---|---|---|
| **Alto** | **Baixo** | Hipotireoidismo primário (Hashimoto na maioria; anti-TPO positivo) |
| **Alto** | Normal | Hipotireoidismo **subclínico** — repetir em 6–12 semanas |
| **Baixo** (< 0,1) | **Alto** | Hipertireoidismo (Graves, bócio nodular tóxico, tireoidite, excesso de levotiroxina) |
| Baixo | Normal | Hipertireoidismo subclínico ou **T3-toxicose** (dosar T3) |
| Baixo ou normal | Baixo | **Hipotireoidismo central** (hipófise/hipotálamo) ou doença não tireoidiana grave |
| Normal ou alto | Alto | Adenoma produtor de TSH, resistência ao hormônio tireoidiano, interferência analítica, uso irregular de levotiroxina |

## Hipotireoidismo
- Trate o clínico com **levotiroxina ~1,6 µg/kg/dia**; idoso ou coronariopata: começar com **12,5–25 µg/dia**. Tome em jejum, 30–60 min antes do café.
- Subclínico: tratar em geral se **TSH ≥ 10 mUI/L**; entre 4,5 e 10, individualizar (sintomas, anti-TPO, gestação, desejo de gestar).
- Reavalie o TSH **6–8 semanas** após cada ajuste de dose.
- No hipotireoidismo central, o TSH não serve para monitorar: ajuste pelo T4 livre. Investigue insuficiência adrenal antes de repor tiroxina.

## Hipertireoidismo
- Etiologia: **TRAb** (Graves), cintilografia com captação (alta em Graves e nódulos; baixa em tireoidite e ingestão exógena), ultrassonografia com Doppler.
- Tireoidite subaguda: dor cervical, VHS alta, captação baixa; tratar com betabloqueador e anti-inflamatório, sem antitireoidiano.
- Antitireoidiano: **metimazol** como primeira escolha (propiltiouracil no 1º trimestre e na tempestade). Hemograma se febre ou dor de garganta (agranulocitose).
- Subclínico com **TSH < 0,1 mUI/L** em idoso ou cardiopata: tratar (risco de fibrilação atrial e osteoporose).

## Armadilhas
- **Doença não tireoidiana (eutireóideo doente):** T3 baixo, TSH baixo ou normal na fase aguda e elevação transitória na recuperação. Evite dosar em UTI sem suspeita forte.
- **Fármacos:** corticoide e dopamina suprimem TSH; amiodarona causa hipo ou hipertireoidismo; lítio, hipotireoidismo; heparina eleva falsamente T4 livre em alguns ensaios.
- **Biotina** em altas doses interfere em imunoensaios (TSH falsamente baixo, T4 livre alto): suspenda **48–72 h** antes da coleta.
- **Gestação:** usar referências por trimestre; o hCG reduz o TSH no 1º trimestre.

**Atenção.** Suspeita de coma mixedematoso ou tempestade tireotóxica é emergência clínica: trate com base no quadro sem aguardar resultados, e avalie cortisol antes de repor levotiroxina.`},

{id:'lab-cardiacos',title:'Troponina, BNP/NT-proBNP e D-dímero',area:AREA,summary:'Troponina de alta sensibilidade e algoritmos 0/1h, cortes de NT-proBNP por idade na IC aguda e D-dímero ajustado por idade no TEP.',
 sources:[['ESC 2023 · Guidelines for the management of acute coronary syndromes','https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Coronary-Syndromes-ACS-Guidelines'],['ESC 2021 · Guidelines for acute and chronic heart failure','https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-and-Chronic-Heart-Failure'],['ESC 2019 · Guidelines on acute pulmonary embolism','https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Pulmonary-Embolism-Diagnosis-and-Management']],
 body:`## Troponina de alta sensibilidade (hs-cTn)
- **Lesão miocárdica:** troponina acima do **percentil 99** do ensaio. **Infarto:** lesão **com subida e/ou queda** + evidência de isquemia (sintoma, ECG, imagem).
- Valores e deltas são **específicos de cada ensaio** (T ou I, fabricante) e expressos em **ng/L**: nunca misture ensaios na mesma curva.
- Algoritmo preferido ESC: **0 h/1 h** (alternativa 0 h/2 h). Exemplo com hs-cTnT (Elecsys):

| Resultado | Critério (hs-cTnT) | Conduta |
|---|---|---|
| **Descarta** | 0 h **< 5 ng/L** (dor há > 3 h) ou 0 h < 12 ng/L e Δ1h < 3 ng/L | Considerar alta com seguimento, se clínica e ECG permitirem |
| **Observação** | Nem descarta nem confirma | Nova troponina em 3 h, considerar imagem |
| **Confirma** | 0 h **≥ 52 ng/L** ou Δ1h **≥ 5 ng/L** | Tratar como IAMSSST ([guia de SCA](#protocolos?guia=sca-emergencia)) |

- Dor iniciada há menos de 3 h: não descarte com amostra única. Combine com escores como o [HEART](#scores?id=heart).
- Elevação **sem dinâmica** ou por causa não isquêmica: DRC, IC, TEP, sepse ([guia de sepse](#protocolos?guia=sepse)), miocardite, taquiarritmia, AVC, rabdomiólise (para troponina T). Tem valor prognóstico, mas não indica cateterismo.

## BNP e NT-proBNP
- Úteis sobretudo para **excluir** insuficiência cardíaca na dispneia aguda (alto valor preditivo negativo).

| Cenário | BNP | NT-proBNP |
|---|---|---|
| **Aguda — IC improvável** | **< 100 pg/mL** | **< 300 pg/mL** |
| Aguda — IC provável, **< 50 anos** | > 400 pg/mL | **> 450 pg/mL** |
| Aguda — IC provável, **50–75 anos** | > 400 pg/mL | **> 900 pg/mL** |
| Aguda — IC provável, **> 75 anos** | > 400 pg/mL | **> 1.800 pg/mL** |
| **Crônica/ambulatorial — IC improvável** | **< 35 pg/mL** | **< 125 pg/mL** |

- **Elevam:** idade, DRC (sobretudo NT-proBNP), fibrilação atrial, TEP, sepse, hipertensão pulmonar. **Reduzem:** **obesidade** (valores até ~50% menores), edema pulmonar muito agudo (flash) e pericardite constritiva.
- Sacubitril-valsartana eleva o BNP (inibição da neprilisina): nesses pacientes, monitore com **NT-proBNP**.

## D-dímero
- Alta sensibilidade e baixa especificidade: serve para **excluir** TEV em probabilidade **não alta**. Não peça em probabilidade alta (vá direto à imagem).
- Estratifique antes: [Wells para TEP](#scores?id=wells-tep), [Genebra](#scores?id=genebra) e, em baixa probabilidade, [PERC](#scores?id=perc) (todos negativos: dispensa o D-dímero).
- **Corte ajustado por idade** (≥ 50 anos): **idade × 10 µg/L FEU** (ex.: 78 anos → 780 µg/L). Abaixo do corte convencional **500 µg/L FEU** em < 50 anos.
- **YEARS:** sem critérios (sinais de TVP, hemoptise, TEP como diagnóstico mais provável), corte **1.000 ng/mL**; com ≥ 1 critério, **500 ng/mL**.
- Confira a unidade do laudo: **FEU ≈ 2 × DDU**, e ng/mL = µg/L.
- Elevam: idade, gestação, câncer, cirurgia ou trauma recente, infecção, CIVD, internação — nesses grupos o valor preditivo cai.

**Atenção.** Cortes de troponina, peptídeos natriuréticos e D-dímero dependem do ensaio e da unidade do laboratório local; nenhum exame isolado substitui a probabilidade clínica pré-teste.`},
];
