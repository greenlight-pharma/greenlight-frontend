// Condutas em doenças comuns na atenção primária e no ambulatório (adultos). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica antes da liberação ampla. Modelos de prescrição são exemplos de estudo, não receitas.
import type {Guide} from './types';

const AREA='Condutas clínicas';
export const CONDUTAS:Guide[]=[
{id:'conduta-hipertensao',title:'Hipertensão arterial sistêmica',area:AREA,summary:'Diagnóstico com MAPA e MRPA, classificação, metas, classes de primeira linha, associações preferenciais e crise hipertensiva.',
 sources:[['SBC · Diretrizes Brasileiras de Hipertensão Arterial 2020','https://abccardiol.org/article/diretrizes-brasileiras-de-hipertensao-arterial-2020/'],['ESC · Clinical Practice Guidelines','https://www.escardio.org/Guidelines']],
 body:`## Diagnóstico
- Medida de consultório com técnica correta, em pelo menos **duas consultas**. Hipertensão: **PA ≥ 140/90 mmHg**.
- Confirme fora do consultório sempre que possível, para afastar hipertensão do avental branco e detectar hipertensão mascarada.

| Método | Limiar de hipertensão |
|---|---|
| Consultório | **≥ 140/90** |
| MAPA 24 h | **≥ 130/80** |
| MAPA vigília | **≥ 135/85** |
| MAPA sono | **≥ 120/70** |
| MRPA | **≥ 130/80** |

- Classificação (consultório): normal < 130/85; pré-hipertensão 130–139/85–89; **estágio 1** 140–159/90–99; **estágio 2** 160–179/100–109; **estágio 3** ≥ 180/110.
- Avaliação inicial: creatinina com TFG ([calcular](#scores?id=egfr)), potássio, glicemia, HbA1c, perfil lipídico, ácido úrico, urina 1, relação albumina/creatinina urinária e ECG.

## Metas
- Maioria dos pacientes: **< 140/90**, idealmente próximo de 130/80 se tolerado.
- Alto risco cardiovascular (diabetes, DRC, doença aterosclerótica, lesão de órgão-alvo): **< 130/80**.
- Idosos frágeis: meta individualizada, evitando hipotensão ortostática.

## Tratamento
- Medidas não farmacológicas para todos: redução de sódio (< 2 g/dia), perda de peso ([IMC](#scores?id=bmi)), atividade física aeróbica, moderação do álcool e cessação do tabagismo.
- Classes de **primeira linha**: diuréticos tiazídicos ou similares (clortalidona, hidroclorotiazida, indapamida), **bloqueadores dos canais de cálcio** (anlodipino), **IECA** e **BRA**. Betabloqueador tem indicações específicas (doença coronariana, IC, controle de frequência).
- **Monoterapia** inicial apenas no estágio 1 de baixo risco, na pré-hipertensão de alto risco e em idosos frágeis.
- **Combinação inicial** (preferencialmente em comprimido único) para os demais: **IECA ou BRA + BCC** ou **IECA ou BRA + tiazídico**.
- Se não controlar: combinação tripla (IECA ou BRA + BCC + tiazídico). Hipertensão resistente: acrescente **espironolactona 25–50 mg**.
- Nunca associe IECA com BRA.

## Crise hipertensiva
| | Urgência | Emergência |
|---|---|---|
| Definição | PA ≥ 180/120 **sem** lesão aguda de órgão-alvo | PA elevada **com** lesão aguda (encefalopatia, AVC, SCA, edema agudo, dissecção, eclâmpsia) |
| Tratamento | Anti-hipertensivo **oral**, reduzir em **24–48 h**, retorno breve | Anti-hipertensivo **IV** em sala de emergência ou UTI |
| Meta | Gradual | PAM **≤ 25%** na 1ª hora; 160/100–110 em 2–6 h; normal em 24–48 h |

- Exceções: dissecção de aorta (PAS < 120 em 20 min); AVC isquêmico ([protocolo](#protocolos?guia=avc-isquemico)); SCA ([protocolo](#protocolos?guia=sca-emergencia)).
- **Nifedipino sublingual é contraindicado** (queda abrupta e imprevisível).
- PA elevada por dor ou ansiedade: trate a causa antes de rotular como crise.

## Modelo de prescrição (exemplo de estudo)
Hipertensão estágio 2, sem contraindicações, função renal normal:
- **Losartana** 50 mg, via oral, 1 comprimido 12/12h, uso contínuo.
- **Anlodipino** 5 mg, via oral, 1 comprimido 1x/dia, uso contínuo.
- Reavaliar PA, creatinina e potássio em **2–4 semanas**.

**Atenção.** Antes de intensificar, confira adesão, técnica de medida, uso de AINE, álcool e causas secundárias (apneia do sono, hiperaldosteronismo, doença renal).`},

{id:'conduta-diabetes-2',title:'Diabetes mellitus tipo 2',area:AREA,summary:'Diagnóstico, metformina, escolha de iSGLT2 ou aGLP-1 por comorbidade cardiorrenal, insulinização basal, metas e hipoglicemia.',
 sources:[['SBD · Diretriz da Sociedade Brasileira de Diabetes','https://diretriz.diabetes.org.br/'],['ADA · Standards of Care in Diabetes','https://diabetesjournals.org/care/issue/47/Supplement_1']],
 body:`## Diagnóstico
| Exame | Pré-diabetes | Diabetes |
|---|---|---|
| Glicemia de jejum | 100–125 mg/dL | **≥ 126 mg/dL** |
| TOTG 75 g (2 h) | 140–199 mg/dL | **≥ 200 mg/dL** |
| HbA1c | 5,7–6,4% | **≥ 6,5%** |
| Glicemia ao acaso com sintomas | — | **≥ 200 mg/dL** |

- Sem sintomas, confirme com **segundo exame alterado** (pode ser outro teste na mesma amostra).
- Rastreie a partir dos 35 anos, ou antes com sobrepeso e fator de risco.

## Metas
- **HbA1c < 7%** para a maioria; < 6,5% em jovens sem risco de hipoglicemia; **< 8–8,5%** em idosos frágeis ou com expectativa de vida limitada.
- Glicemia de jejum **80–130 mg/dL**; pós-prandial < 180 mg/dL; tempo no alvo (70–180) **> 70%** quando houver monitorização contínua.
- Controle conjunto de PA, LDL, peso e tabagismo.

## Tratamento farmacológico
- **Metformina** é a base: iniciar 500 mg 1–2x/dia com refeições, aumentar a cada 1–2 semanas até **2.000–2.550 mg/dia**. Formulação XR reduz efeitos gastrointestinais.
- Ajuste renal ([TFG](#scores?id=egfr)): TFG 30–45 máximo **1.000 mg/dia**; **< 30 contraindicada**. Monitore vitamina B12.
- Escolha do segundo agente pela comorbidade, independentemente da HbA1c:

| Situação | Preferência |
|---|---|
| Insuficiência cardíaca | **iSGLT2** (dapagliflozina ou empagliflozina 10 mg) |
| DRC com albuminúria ou TFG reduzida | **iSGLT2** (iniciar se TFG ≥ 20); aGLP-1 se não tolerar |
| Doença aterosclerótica estabelecida | **aGLP-1** com benefício comprovado ou iSGLT2 |
| Obesidade | aGLP-1 (semaglutida, liraglutida) ou tirzepatida |
| Custo como limitação | Sulfonilureia (gliclazida), pioglitazona, NPH |

- iSGLT2: orientar higiene genital, hidratação e suspensão em jejum prolongado ou doença aguda (risco de cetoacidose euglicêmica, ver [CAD](#protocolos?guia=cad)).

## Insulinização
- Indicar se HbA1c **> 9–10%**, glicemia ≥ 300 mg/dL com sintomas catabólicos, ou falha dos orais.
- Insulina basal (NPH ao deitar ou análogo): **10 UI** ou **0,1–0,2 UI/kg**, mantendo metformina.
- Titulação: aumentar **2 UI a cada 3 dias** até glicemia de jejum na meta; se hipoglicemia, reduzir **10–20%**.
- Dose basal > 0,5 UI/kg sem controle sugere necessidade de insulina prandial ou aGLP-1.

## Hipoglicemia
- Glicemia **< 70 mg/dL**. Consciente: **regra dos 15** (15 g de carboidrato simples, repetir glicemia em 15 min).
- Inconsciente: **glicose 50% 30–50 mL IV** ou glucagon 1 mg IM/SC.
- Causadas por sulfonilureia podem recorrer: observar por mais tempo.

## Modelo de prescrição (exemplo de estudo)
DM2 recém-diagnosticado com IC, TFG 60, HbA1c 8%:
- **Metformina XR** 500 mg, via oral, 1 comprimido no jantar por 1 semana, depois 2 comprimidos no jantar, uso contínuo.
- **Dapagliflozina** 10 mg, via oral, 1 comprimido 1x/dia pela manhã, uso contínuo.
- Automonitorização e retorno com HbA1c em **3 meses**.

**Atenção.** Pesquise complicações anualmente (fundo de olho, albuminúria, exame dos pés). Evite sulfonilureia em idosos com risco de hipoglicemia.`},

{id:'conduta-dislipidemia',title:'Dislipidemia e prevenção cardiovascular',area:AREA,summary:'Estratificação de risco, metas de LDL pela SBC 2017 e ESC 2019, estatinas por intensidade, ezetimiba e hipertrigliceridemia.',
 sources:[['SBC · Atualização da Diretriz Brasileira de Dislipidemias e Prevenção da Aterosclerose 2017','https://doi.org/10.5935/abc.20170121'],['ESC · Clinical Practice Guidelines (Dyslipidaemias 2019)','https://www.escardio.org/Guidelines']],
 body:`## Avaliação
- Perfil lipídico (jejum não obrigatório). LDL pode ser calculado por Friedewald ([calcular](#scores?id=ldl)) se triglicerídeos < 400 mg/dL.
- LDL **≥ 190 mg/dL**: pensar em hipercolesterolemia familiar e causas secundárias (hipotireoidismo, síndrome nefrótica, colestase, fármacos).
- Solicitar TSH, glicemia, creatinina e enzimas hepáticas antes de iniciar.

## Estratificação de risco
| Categoria | Exemplos (SBC 2017) |
|---|---|
| **Muito alto** | Doença aterosclerótica clínica (IAM, AVC isquêmico, doença arterial periférica) ou placa significativa em exame de imagem |
| **Alto** | Aterosclerose subclínica, aneurisma de aorta, DRC (TFG < 60), LDL ≥ 190, diabetes com estratificadores de risco, escore de risco global elevado |
| **Intermediário** | Escore de risco global intermediário; diabetes sem estratificadores |
| **Baixo** | Escore de risco global baixo |

## Metas de LDL
| Risco | SBC 2017 | ESC 2019 |
|---|---|---|
| Muito alto | **< 50 mg/dL** | **< 55 mg/dL** e redução ≥ 50% |
| Alto | **< 70 mg/dL** | < 70 mg/dL e redução ≥ 50% |
| Intermediário/moderado | **< 100 mg/dL** | < 100 mg/dL |
| Baixo | **< 130 mg/dL** | < 116 mg/dL |

- Não HDL: meta **30 mg/dL acima** da meta de LDL.

## Estatinas
| Intensidade | Redução de LDL | Doses |
|---|---|---|
| **Alta** | **≥ 50%** | Atorvastatina **40–80 mg**; rosuvastatina **20–40 mg** |
| Moderada | 30–50% | Atorvastatina 10–20 mg; rosuvastatina 5–10 mg; sinvastatina 20–40 mg |
| Baixa | < 30% | Sinvastatina 10 mg; pravastatina 10–20 mg |

- Risco alto e muito alto: comece com **alta intensidade**.
- Reavalie LDL em **4–12 semanas** e ajuste.
- Mialgia: dosar CK se sintomas; suspender se CK > 10x o limite superior. Transaminases > 3x: reavaliar.
- Interações com fibratos (especialmente genfibrozila), macrolídeos, azólicos e amiodarona.

## Terapias adicionais
- **Ezetimiba 10 mg/dia**: reduz mais **20–25%**; associar quando não atingir a meta com estatina máxima tolerada, ou em intolerância.
- **Inibidores de PCSK9**: risco muito alto fora da meta apesar de estatina + ezetimiba.
- Triglicerídeos **≥ 500 mg/dL**: fibrato (fenofibrato) para prevenir pancreatite, além de dieta, controle glicêmico e suspensão de álcool.
- Ômega-3 em dose de suplemento alimentar não reduz eventos.

## Seguimento
- Após atingir a meta: perfil lipídico a cada **6–12 meses** e reforço de adesão (abandono em 1 ano é frequente).
- Não suspenda estatina por elevação leve e assintomática de CK ou transaminases.
- Idosos acima de 75 anos em prevenção primária: decisão compartilhada, considerando fragilidade e expectativa de vida.
- Estilo de vida: dieta com menos gordura saturada e trans, mais fibras, atividade física regular, controle do peso e cessação do tabagismo.

## Modelo de prescrição (exemplo de estudo)
Paciente pós-IAM, LDL 130 mg/dL, sem estatina prévia:
- **Rosuvastatina** 20 mg, via oral, 1 comprimido 1x/dia, uso contínuo.
- Após 6 semanas, se LDL acima de 50 mg/dL: associar **ezetimiba** 10 mg, via oral, 1 comprimido 1x/dia, uso contínuo.

**Atenção.** Estatina está contraindicada na gestação e amamentação. Mudança de estilo de vida acompanha qualquer tratamento farmacológico.`},

{id:'conduta-asma-dpoc',title:'Asma e DPOC ambulatoriais',area:AREA,summary:'Asma pela GINA 2024 com formoterol-budesonida como resgate e SMART, degraus, e DPOC pela GOLD 2024 com grupos A, B e E.',
 sources:[['GINA · Global Strategy for Asthma Management and Prevention','https://ginasthma.org/reports/'],['GOLD · Global Strategy for COPD','https://goldcopd.org/']],
 body:`## Asma: diagnóstico e controle
- Sintomas variáveis (sibilância, dispneia, tosse, aperto no peito) e **limitação variável ao fluxo**: espirometria com resposta ao broncodilatador (aumento de VEF1 **> 12% e > 200 mL**).
- Controle nas últimas 4 semanas: sintomas diurnos > 2x/semana, despertar noturno, resgate > 2x/semana, limitação de atividade. Nenhum: controlada; 1–2: parcialmente; 3–4: não controlada.
- SABA isolado **não é mais recomendado** (aumenta risco de crise grave e morte).

## Asma: tratamento em degraus (GINA 2024)
| Degrau | Via 1 (preferida): resgate com ICS-formoterol | Via 2: resgate com SABA |
|---|---|---|
| 1–2 | **Budesonida-formoterol em dose baixa sob demanda** | ICS em dose baixa sempre que usar SABA, ou ICS diário |
| 3 | **SMART**: budesonida-formoterol dose baixa de manutenção + resgate | ICS-LABA dose baixa |
| 4 | SMART com dose média de manutenção | ICS-LABA dose média/alta |
| 5 | Associar LAMA; encaminhar para fenotipagem e imunobiológico | Idem |

- No SMART com budesonida-formoterol 200/6 mcg: máximo de **12 inalações/dia** (somando manutenção e resgate).
- Antes de subir degrau: técnica inalatória, adesão, exposições, comorbidades (rinite, refluxo, obesidade).
- Considere descer degrau após **3 meses** de controle.
- Crise em pronto atendimento: ver [protocolo de crise de asma](#protocolos?guia=crise-asma).

## DPOC: diagnóstico
- Exposição (tabagismo, [carga tabágica](#scores?id=maco), fumaça de lenha) + sintomas + **VEF1/CVF < 0,70 pós-broncodilatador**.
- Gravidade espirométrica (GOLD 1–4) por VEF1: ≥ 80%, 50–79%, 30–49%, < 30%.

## DPOC: grupos e tratamento inicial (GOLD 2024)
| Grupo | Critério | Tratamento inicial |
|---|---|---|
| **A** | 0–1 exacerbação moderada/ano sem internação; mMRC 0–1 e CAT < 10 | Um broncodilatador (preferir longa ação) |
| **B** | 0–1 exacerbação sem internação; mMRC ≥ 2 ou CAT ≥ 10 | **LABA + LAMA** |
| **E** | **≥ 2 exacerbações moderadas** ou **≥ 1 internação** no ano | **LABA + LAMA**; somar ICS se eosinófilos **≥ 300/µL** |

- ICS isolado **não** é tratamento de DPOC. Aumenta risco de pneumonia.
- Persistência de exacerbações com eosinófilos ≥ 100: considerar LABA + LAMA + ICS; roflumilaste ou azitromicina em casos selecionados.
- Para todos: **cessação do tabagismo**, vacinas (influenza, pneumococo, covid-19, VSR em idosos), reabilitação pulmonar e plano de ação.
- Oxigenoterapia domiciliar: PaO₂ **≤ 55 mmHg** ou SatO₂ **≤ 88%** em repouso (ou PaO₂ 56–59 com cor pulmonale ou policitemia).

## Modelo de prescrição (exemplo de estudo)
Asma não controlada em uso de SABA isolado (degrau 3, via 1):
- **Budesonida-formoterol** 200/6 mcg, via inalatória (pó), 1 inalação 12/12h, uso contínuo.
- A mesma medicação, 1 inalação se sintomas, até **12 inalações/dia** no total.
- Revisar técnica e controle em **4–6 semanas**.

**Atenção.** Em asma e DPOC, reavalie a técnica inalatória a cada consulta. Paciente com DPOC e sintomas sugestivos de asma deve receber ICS.`},

{id:'conduta-icfer',title:'Insuficiência cardíaca com fração de ejeção reduzida',area:AREA,summary:'Os quatro pilares da ICFEr, doses iniciais e alvo, ordem de introdução, monitorização de potássio e função renal, e diuréticos.',
 sources:[['AHA/ACC/HFSA 2022 · Guideline for the Management of Heart Failure','https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063'],['ESC · Clinical Practice Guidelines (Heart Failure)','https://www.escardio.org/Guidelines']],
 body:`## Definição e avaliação
- IC com **FE ≤ 40%** ao ecocardiograma. FE 41–49%: levemente reduzida; FE ≥ 50%: preservada.
- Classe funcional pela [NYHA](#scores?id=nyha); BNP ou NT-proBNP ajudam no diagnóstico.
- Investigar causa: isquêmica, hipertensiva, valvar, alcoólica, Chagas (frequente no Brasil), taquicardiomiopatia.
- Exames: ECG, eletrólitos, creatinina com TFG, hemograma, ferritina e saturação de transferrina, TSH.

## Os quatro pilares
Todos reduzem mortalidade. A tendência atual é introduzir os quatro **em poucas semanas**, em doses baixas, e titular depois.
1. **IECA, BRA ou INRA** (sacubitril-valsartana, preferido quando possível).
2. **Betabloqueador** com evidência (carvedilol, bisoprolol, succinato de metoprolol).
3. **Antagonista mineralocorticoide** (espironolactona).
4. **iSGLT2** (dapagliflozina ou empagliflozina).

## Doses
| Fármaco | Dose inicial | Dose-alvo |
|---|---|---|
| Sacubitril-valsartana | 24/26–49/51 mg 12/12h | **97/103 mg 12/12h** |
| Enalapril | 2,5 mg 12/12h | **10–20 mg 12/12h** |
| Captopril | 6,25 mg 8/8h | **50 mg 8/8h** |
| Losartana | 25–50 mg 1x/dia | **150 mg 1x/dia** |
| Valsartana | 40 mg 12/12h | **160 mg 12/12h** |
| Carvedilol | 3,125 mg 12/12h | **25 mg 12/12h** (50 mg 12/12h se > 85 kg) |
| Bisoprolol | 1,25 mg 1x/dia | **10 mg 1x/dia** |
| Succinato de metoprolol | 12,5–25 mg 1x/dia | **200 mg 1x/dia** |
| Espironolactona | 12,5–25 mg 1x/dia | **25–50 mg 1x/dia** |
| Dapagliflozina / empagliflozina | 10 mg 1x/dia | **10 mg 1x/dia** |

## Cuidados
- Ao trocar IECA por sacubitril-valsartana: intervalo de **36 horas**. Não associar IECA com INRA (angioedema).
- Betabloqueador: iniciar com paciente euvolêmico; dobrar a dose a cada **2–4 semanas** se FC e PA permitirem.
- Espironolactona: iniciar se **K < 5,0 mEq/L** e TFG > 30. Dosar potássio e creatinina em 1 semana, 4 semanas e periodicamente. Hipercalemia: ver [protocolo](#protocolos?guia=hipercalemia).
- Aumento de creatinina até **30%** após IECA/BRA/INRA é aceitável.
- iSGLT2 pode ser iniciado com TFG ≥ 20 e não exige ajuste por glicemia.

## Outras medidas
- **Diurético de alça** (furosemida) apenas para congestão, na menor dose que mantenha euvolemia.
- Ivabradina: ritmo sinusal com FC ≥ 70 bpm apesar de betabloqueador na dose máxima tolerada.
- Hidralazina + nitrato: pacientes autodeclarados negros sintomáticos ou intolerantes a IECA/BRA/INRA.
- Ferro IV se ferritina < 100 ou 100–299 com saturação de transferrina < 20%.
- CDI e ressincronização conforme FE, QRS e classe funcional após 3 meses de terapia otimizada.
- Evite AINEs, glitazonas, verapamil e diltiazem.
- Fibrilação atrial associada: estratificar com [CHA₂DS₂-VASc](#scores?id=cha2ds2vasc).

## Modelo de prescrição (exemplo de estudo)
ICFEr NYHA II, PA 120/70, FC 80, K 4,3, TFG 65:
- **Sacubitril-valsartana** 49/51 mg, via oral, 1 comprimido 12/12h, uso contínuo.
- **Carvedilol** 3,125 mg, via oral, 1 comprimido 12/12h, uso contínuo.
- **Espironolactona** 25 mg, via oral, 1 comprimido 1x/dia, uso contínuo.
- **Dapagliflozina** 10 mg, via oral, 1 comprimido 1x/dia, uso contínuo.
- Potássio e creatinina em **1 semana**.

**Atenção.** Titule até a dose-alvo ou a máxima tolerada; dose baixa mantida por inércia é a falha mais comum. Oriente pesagem diária e restrição hídrica apenas se houver hiponatremia ou congestão.`},

{id:'conduta-tireoide',title:'Hipotireoidismo e hipertireoidismo',area:AREA,summary:'Levotiroxina por peso, ajuste pelo TSH, idosos e coronariopatas, doença de Graves com metimazol e betabloqueador, e formas subclínicas.',
 sources:[['ATA · Professional Guidelines','https://www.thyroid.org/professionals/ata-professional-guidelines/']],
 body:`## Hipotireoidismo primário
- **TSH elevado com T4 livre baixo**. Principal causa: tireoidite de Hashimoto (anti-TPO positivo).
- TSH isolado não serve em doença aguda, uso de glicocorticoide ou hipotireoidismo central (neste, guie-se pelo T4 livre).

## Levotiroxina
- Dose plena: **1,6 mcg/kg/dia** do peso ideal ([calcular](#scores?id=peso-ideal)), em jejum, **30–60 min antes do café**.
- **Idosos e coronariopatas**: iniciar com **12,5–25 mcg/dia** e aumentar 12,5–25 mcg a cada 4–6 semanas.
- Dosar TSH **6–8 semanas** após início ou ajuste; depois, a cada 6–12 meses.
- Metas de TSH: **0,5–2,5 mUI/L** em adultos jovens; faixa mais alta (até 4–6) aceitável em idosos acima de 70 anos.
- Interferem na absorção: cálcio, ferro, IBP, sucralfato, colestiramina, café. Separe por **4 horas**.
- **Gestação**: aumente cerca de **25–30%** logo ao confirmar (por exemplo, 2 comprimidos extras por semana) e monitore TSH a cada 4 semanas.

## Hipotireoidismo subclínico
| TSH | Conduta |
|---|---|
| **≥ 10 mUI/L** | Tratar |
| 4,5–10 mUI/L | Individualizar: considerar se < 65–70 anos com sintomas, anti-TPO positivo, gestação ou desejo de gestar |
| Idosos com TSH até 7 | Geralmente apenas observar |

- Repita TSH e T4 livre em **6–12 semanas** antes de decidir: elevação transitória é comum.

## Hipertireoidismo
- **TSH suprimido com T4 livre e/ou T3 elevados**.
- Causas: **doença de Graves** (TRAb positivo, bócio difuso, oftalmopatia), bócio multinodular tóxico, adenoma tóxico, tireoidite (captação baixa, tratamento sintomático).
- Cintilografia com captação distingue quando TRAb for negativo.

## Doença de Graves
- **Betabloqueador** para sintomas adrenérgicos: propranolol **20–40 mg 8/8h** ou atenolol 25–50 mg/dia.
- **Metimazol** (tapazol): dose inicial pela gravidade, **10–30 mg 1x/dia** (5–10 mg em leves; até 30–40 mg em graves). Reduzir conforme T4 livre a cada 4–6 semanas até manutenção de 5–10 mg.
- Duração: **12–18 meses**; depois, suspender e observar. Recidiva: iodo radioativo ou tireoidectomia.
- **Propiltiouracil**: apenas no **1º trimestre da gestação**, tempestade tireoidiana ou intolerância ao metimazol (hepatotoxicidade).
- Efeitos graves: **agranulocitose** (febre ou dor de garganta: suspender e colher hemograma) e hepatite. Colher hemograma e transaminases basais.
- Iodo radioativo contraindicado na gestação e evitado na oftalmopatia ativa moderada a grave.

## Hipertireoidismo subclínico
- TSH **< 0,1 mUI/L**: tratar se ≥ 65 anos, cardiopatia, osteoporose ou sintomas.
- TSH 0,1–0,4: considerar nos mesmos grupos; nos demais, observar.

## Modelo de prescrição (exemplo de estudo)
Hipotireoidismo primário, mulher de 40 anos, 60 kg, sem cardiopatia:
- **Levotiroxina** 100 mcg, via oral, 1 comprimido em jejum 30 min antes do café, uso contínuo; TSH em **6–8 semanas**.

Doença de Graves moderada:
- **Metimazol** 10 mg, via oral, 2 comprimidos 1x/dia; T4 livre em **4–6 semanas**.
- **Propranolol** 40 mg, via oral, 1 comprimido 8/8h até controle dos sintomas.

**Atenção.** Troca de marca de levotiroxina altera a absorção; mantenha a mesma apresentação e repita TSH após a troca.`},

{id:'conduta-dor-analgesia',title:'Dor e analgesia no ambulatório',area:AREA,summary:'Escada analgésica, doses máximas de dipirona e paracetamol, riscos dos AINEs, opioides fracos e fortes, conversão e dor lombar aguda.',
 sources:[['WHO · Guidelines for the pharmacological and radiotherapeutic management of cancer pain (2018)','https://www.who.int/publications/i/item/9789241550390'],['NICE NG59 · Low back pain and sciatica in over 16s','https://www.nice.org.uk/guidance/ng59']],
 body:`## Escada analgésica
| Degrau | Intensidade | Opção |
|---|---|---|
| 1 | Leve (EVA 1–3) | Dipirona, paracetamol ou AINE ± adjuvante |
| 2 | Moderada (EVA 4–6) | **Opioide fraco** (codeína, tramadol) + degrau 1 |
| 3 | Intensa (EVA 7–10) | **Opioide forte** (morfina, oxicodona) + degrau 1 |

- Adjuvantes: antidepressivos (amitriptilina, duloxetina) e gabapentinoides na dor neuropática.
- Dor aguda intensa pode começar direto no degrau necessário.

## Analgésicos simples
| Fármaco | Dose usual | Máximo diário |
|---|---|---|
| Dipirona | 500 mg–1 g 6/6h | **4 g** |
| Paracetamol | 500 mg–1 g 6/6h | **4 g** (**2–3 g** em hepatopatia, etilismo, desnutrição) |
| Ibuprofeno | 400–600 mg 8/8h | 2,4 g |
| Naproxeno | 250–500 mg 12/12h | 1 g |

- Dipirona: risco raro de agranulocitose; evite em discrasias sanguíneas.

## AINEs: riscos
- **Gastrointestinal**: úlcera e sangramento. Associe IBP se > 65 anos, úlcera prévia, uso de AAS, anticoagulante ou corticoide.
- **Renal**: lesão renal aguda, hipercalemia; evite com TFG < 30, desidratação ou IECA/BRA + diurético (tripla combinação).
- **Cardiovascular**: elevação da PA, retenção hídrica, piora da IC e eventos trombóticos.
- Use a menor dose pelo menor tempo (idealmente **≤ 5–7 dias**).

## Opioides
- **Codeína** 30–60 mg 4/4–6/6h (máximo **360 mg/dia**).
- **Tramadol** 50–100 mg 6/6h (máximo **400 mg/dia**; 300 mg em > 75 anos). Risco de convulsão e síndrome serotoninérgica com ISRS.
- **Morfina** oral 5–10 mg 4/4h em virgens de opioide.
- Sempre prescreva **laxante** (constipação não gera tolerância) e oriente sobre sedação.

## Conversão básica para morfina oral
| Opioide | Equivalência aproximada |
|---|---|
| Morfina IV → oral | 1 : **3** |
| Codeína oral | 10 mg ≈ 1 mg de morfina oral |
| Tramadol oral | 10 mg ≈ 1–2 mg de morfina oral |
| Oxicodona oral | 1 mg ≈ **1,5 mg** de morfina oral |

- Ao trocar de opioide, reduza **25–50%** da dose calculada (tolerância cruzada incompleta). Metadona: conversão especializada.

## Dor lombar aguda
**Sinais de alarme (red flags)**
- Idade > 50 anos no início, história de câncer, perda de peso inexplicada, febre.
- Imunossupressão, uso de drogas injetáveis, corticoide crônico, osteoporose ou trauma significativo.
- Dor noturna ou em repouso, que não melhora com posição.
- Déficit neurológico progressivo; **síndrome da cauda equina** (retenção urinária, incontinência, anestesia em sela): emergência.

Sem sinais de alarme:
- **Não solicite imagem** nas primeiras 4–6 semanas.
- Manter-se ativo; evite repouso no leito. Calor local.
- AINE por curto período; relaxante muscular (ciclobenzaprina 5–10 mg à noite) por poucos dias.
- Opioides não são primeira escolha. A maioria melhora em **4–6 semanas**.

## Modelo de prescrição (exemplo de estudo)
Lombalgia mecânica aguda sem sinais de alarme, sem contraindicação a AINE:
- **Ibuprofeno** 600 mg, via oral, 1 comprimido 8/8h após refeições, por **5 dias**.
- **Dipirona** 1 g, via oral, 1 comprimido 6/6h se dor, por até 7 dias.
- **Ciclobenzaprina** 5 mg, via oral, 1 comprimido à noite, por **5 dias**.

**Atenção.** Reavalie opioides a cada consulta quanto a benefício, efeitos adversos e sinais de uso indevido. Dor lombar com febre, déficit neurológico ou retenção urinária exige avaliação imediata.`},

{id:'conduta-depressao-ansiedade',title:'Depressão e ansiedade na atenção primária',area:AREA,summary:'Rastreio com PHQ-9 e GAD-7, ISRS iniciais, titulação, tempo de resposta, manutenção, avaliação de risco de suicídio e quando encaminhar.',
 sources:[['NICE NG222 · Depression in adults: treatment and management','https://www.nice.org.uk/guidance/ng222'],['NICE CG113 · Generalised anxiety disorder and panic disorder in adults','https://www.nice.org.uk/guidance/cg113']],
 body:`## Rastreio e gravidade
- **Depressão**: [PHQ-9](#scores?id=phq9). Pontos de corte: **5** leve, **10** moderada, **15** moderadamente grave, **20** grave. O item 9 pergunta sobre ideação suicida.
- **Ansiedade generalizada**: [GAD-7](#scores?id=gad7). Pontos de corte: **5** leve, **10** moderada, **15** grave.
- Escalas apoiam, mas o diagnóstico é clínico (humor deprimido ou anedonia por ≥ 2 semanas, com prejuízo funcional).
- Afaste causas orgânicas: TSH, hemograma, B12, uso de álcool e substâncias ([AUDIT-C](#scores?id=audit-c)).
- **Pesquise mania ou hipomania prévia** antes de iniciar antidepressivo (risco de virada no transtorno bipolar).

## Quando tratar com medicação
- Depressão leve: psicoeducação, atividade física, higiene do sono, psicoterapia; reavaliar em 2–4 semanas.
- Depressão **moderada a grave** ou ansiedade com prejuízo funcional: **ISRS** e/ou psicoterapia (TCC). A combinação é superior nos quadros graves.

## ISRS iniciais
| Fármaco | Dose inicial | Faixa | Observação |
|---|---|---|---|
| **Sertralina** | **50 mg** 1x/dia (25 mg na ansiedade) | 50–200 mg | Segura em cardiopatas |
| **Escitalopram** | **10 mg** 1x/dia (5 mg na ansiedade) | 10–20 mg | Máximo 10 mg em > 65 anos; prolonga QT |
| Fluoxetina | 20 mg pela manhã | 20–60 mg | Meia-vida longa, menos sintomas de retirada |

- Efeitos iniciais: náusea, cefaleia, insônia, **ansiedade transitória** nas primeiras semanas; disfunção sexual.
- Idosos: risco de **hiponatremia** e quedas. Sangramento aumenta com AINE, AAS ou anticoagulante.
- Benzodiazepínico apenas por curto período (2–4 semanas) se necessário; evite em idosos.

## Titulação e resposta
- Reavaliar em **2–4 semanas** (adesão, efeitos, risco).
- Resposta plena leva **4–6 semanas**. Sem melhora mínima (**< 20–25%** no escore) após 4 semanas em dose adequada: aumentar dose.
- Sem resposta após 6–8 semanas em dose otimizada: trocar de antidepressivo ou associar psicoterapia.
- Resposta: redução **≥ 50%** no PHQ-9. Remissão: PHQ-9 **< 5**.

## Manutenção e retirada
- Após remissão, manter a mesma dose por **6–12 meses**.
- **≥ 2–3 episódios** ou episódio grave: manutenção por **2 anos** ou mais.
- Retirar de forma **gradual** em semanas a meses para evitar síndrome de descontinuação.

## Risco de suicídio
- Pergunte diretamente sobre ideação, plano, meios e tentativas prévias. Perguntar **não** aumenta o risco.
- Em **< 25 anos**, o início de antidepressivo pode aumentar ideação: consultas mais próximas.
- Risco alto (plano estruturado, tentativa recente, acesso a meios): **não deixe o paciente sozinho**, acione emergência psiquiátrica.
- Restrinja acesso a meios (armas, medicamentos em grande quantidade). CVV: **188**.

## Quando encaminhar
- Risco de suicídio alto, sintomas psicóticos, suspeita de transtorno bipolar.
- Falha de **dois antidepressivos** em dose e tempo adequados.
- Gestação ou puerpério com quadro moderado a grave, uso grave de substâncias, transtorno alimentar.

## Modelo de prescrição (exemplo de estudo)
Episódio depressivo moderado, PHQ-9 = 14, sem risco de suicídio, sem história de mania:
- **Sertralina** 50 mg, via oral, 1 comprimido 1x/dia pela manhã, uso contínuo; reavaliar em **2–4 semanas**.
- Encaminhar para psicoterapia; manter por **6–12 meses** após remissão.

**Atenção.** Reavalie risco de suicídio a cada consulta, sobretudo nas primeiras semanas de tratamento. Não prescreva grandes quantidades de medicação a pacientes com risco.`},
];
