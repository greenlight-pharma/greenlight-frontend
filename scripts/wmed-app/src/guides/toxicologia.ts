// Guia de toxicologia clínica (adultos, salvo indicação). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica antes da liberação ampla. Em intoxicações, contatar o CIATox (0800 722 6001).
import type {Guide} from './types';

const AREA='Toxicologia';
export const TOXICOLOGIA:Guide[]=[
{id:'tox-abordagem',title:'Abordagem geral do paciente intoxicado',area:AREA,summary:'Estabilização (ABC), toxíndromes clássicas, exames iniciais, descontaminação com carvão ativado e contato com o CIATox.',
 sources:[['ABRACIT · Associação Brasileira de Centros de Informação e Assistência Toxicológica','https://abracit.org.br'],['AACT/EAPCCT · Position paper: single-dose activated charcoal (Clin Toxicol 2005)','https://doi.org/10.1081/CLT-200051867'],['Boyer & Shannon · The serotonin syndrome (NEJM 2005)','https://doi.org/10.1056/NEJMra041867']],
 body:`## Estabilização primeiro
- **A/B:** via aérea e ventilação antes de qualquer antídoto (exceto naloxona na suspeita de opioide com bradipneia). Intubar se rebaixamento sem proteção de via aérea, hipoventilação refratária ou convulsões persistentes ([sequência rápida](#protocolos?guia=iot)).
- **C:** monitor, acesso venoso, ECG de 12 derivações precoce (**QRS**, **QTc** — [calcular QTc](#scores?id=qtc)). Hipotensão: cristaloide e, se refratária, vasopressor ([drogas vasoativas](#protocolos?guia=drogas-vasoativas)).
- **D:** glicemia capilar em todo rebaixamento; [ECG de Glasgow](#scores?id=glasgow); pupilas; temperatura (hipertermia > 40 °C é emergência — resfriamento ativo).
- Convulsões tóxicas: **benzodiazepínico** é primeira linha; fenitoína geralmente ineficaz.
- Contate o **CIATox — 0800 722 6001** (Disque-Intoxicação, 24 h) cedo, inclusive em exposições de gravidade incerta.

## História dirigida
Agente, dose, horário, via, intenção (tentativa de suicídio?), coingestões, embalagens, medicamentos em casa. Considere sempre **paracetamol** e **etanol** na ingestão com intenção suicida.

## Toxíndromes
| Toxíndrome | Mental | Pupila | FC/PA | Pele | Outros | Exemplos |
|---|---|---|---|---|---|---|
| Anticolinérgica | Agitação, delirium | Midríase | ↑ | **Seca**, quente, rubor | Retenção urinária, íleo | Anti-histamínicos, tricíclicos, atropina |
| Colinérgica | Confusão, coma | **Miose** | ↓ (ou ↑) | Sudorese | Broncorreia, sialorreia, diarreia, fasciculações | Organofosforados, carbamatos |
| Simpatomimética | Agitação | Midríase | ↑↑ | **Sudorese** | Hipertermia, convulsões | Cocaína, anfetaminas |
| Opioide | Sedação, coma | **Miose puntiforme** | ↓ | Normal | **Bradipneia** | Morfina, fentanil, tramadol |
| Sedativo-hipnótica | Sedação | Normal ou miose | Normal ou ↓ | Normal | Ventilação em geral preservada | Benzodiazepínicos, barbitúricos |
| Serotoninérgica | Agitação | Midríase | ↑ | Sudorese | **Clônus** (induzível, ocular), hiper-reflexia | ISRS, tramadol, linezolida, MDMA |

Dica: sudorese separa simpatomimética (úmida) de anticolinérgica (seca).

## Exames iniciais
- Glicemia, eletrólitos, função renal, gasometria com lactato, [ânion gap](#scores?id=gap), [osmolalidade calculada](#scores?id=osm) quando houver suspeita de álcool tóxico.
- **Paracetamol sérico** e salicilato quando disponíveis; beta-hCG em mulheres em idade fértil; CPK se imobilização prolongada.
- Triagem urinária de drogas raramente muda a conduta.

## Descontaminação
- **Carvão ativado: 1 g/kg (máximo 50 g) VO ou por sonda**, idealmente em **até 1 h** da ingestão de dose potencialmente tóxica de substância adsorvível.
- **Contraindicações:** via aérea não protegida (rebaixamento sem IOT), corrosivos (ácidos/álcalis), hidrocarbonetos, obstrução ou perfuração intestinal.
- **Não adsorve bem:** ferro, lítio, álcoois, metais pesados, corrosivos.
- Doses múltiplas (0,5 g/kg a cada 4 h) em casos selecionados: carbamazepina, fenobarbital, dapsona, quinina, teofilina.
- Lavagem gástrica e xarope de ipeca não são rotina. Irrigação intestinal total (polietilenoglicol) para ferro, lítio, liberação prolongada e "mulas".

**Atenção.** Nenhum antídoto substitui o suporte de via aérea, ventilação e circulação. Em dúvida sobre dose tóxica ou conduta, ligue para o CIATox antes de liberar o paciente.`},
{id:'tox-paracetamol',title:'Intoxicação por paracetamol',area:AREA,summary:'Dose tóxica, nomograma de Rumack-Matthew, N-acetilcisteína (esquema IV de 21 h e alternativas) e quando tratar sem nível sérico.',
 sources:[['Dart et al. · Management of Acetaminophen Poisoning in the US and Canada: A Consensus Statement (JAMA Netw Open 2023)','https://doi.org/10.1001/jamanetworkopen.2023.27739'],['ABRACIT · Centros de Informação e Assistência Toxicológica','https://abracit.org.br']],
 body:`## Toxicidade
- Metabólito tóxico **NAPQI** esgota a glutationa hepática → necrose centrolobular.
- Dose potencialmente tóxica em ingestão aguda: **≥ 150 mg/kg** ou **≥ 7,5–10 g** no adulto. Fatores de risco (etilismo crônico, desnutrição, indutores enzimáticos) reduzem a margem.
- Fases: 0–24 h assintomático ou náuseas; **24–72 h** elevação de transaminases; **72–96 h** pico de lesão (insuficiência hepática, coagulopatia, encefalopatia, lesão renal); depois recuperação ou óbito.

## Nomograma de Rumack-Matthew
- Válido só para **ingestão aguda única com horário conhecido**, entre **4 e 24 h**.
- Linha de tratamento: **150 mcg/mL em 4 h** (linha adotada nos EUA; declina com meia-vida de 4 h — cerca de 75 mcg/mL em 8 h e 37,5 mcg/mL em 12 h).
- Nível colhido antes de 4 h não é interpretável (exceto se indetectável). Colha em **4 h** ou assim que possível depois disso.
- Nível acima da linha → **N-acetilcisteína (NAC)**.

## Quando tratar sem esperar o nível
- Ingestão ≥ 150 mg/kg (ou ≥ 10 g) e resultado não disponível até **8 h** da ingestão.
- Horário desconhecido ou apresentação **> 24 h** com paracetamol detectável ou **ALT elevada**.
- Ingestão **escalonada/repetida** (supraterapêutica) com ALT elevada ou paracetamol detectável.
- Sinais de lesão hepática em contexto compatível.
- A NAC é mais eficaz quando iniciada em **até 8 h**, mas sempre traz benefício, mesmo tardia.

## N-acetilcisteína
| Esquema | Doses | Observações |
|---|---|---|
| **IV clássico de 21 h** | **150 mg/kg em 1 h** (em 200 mL SG 5%) → **50 mg/kg em 4 h** (500 mL) → **100 mg/kg em 16 h** (1.000 mL) | Total 300 mg/kg; peso máximo considerado 100 kg; reduzir volumes em pacientes pequenos |
| IV em duas bolsas / SNAP | 200 mg/kg em 4 h → 100 mg/kg em 16 h; ou 100 mg/kg em 2 h → 200 mg/kg em 10 h | Menos reações anafilactoides; adoção institucional |
| **VO de 72 h** | **140 mg/kg** de ataque → **70 mg/kg a cada 4 h** (17 doses) | Alternativa se IV indisponível; vômitos limitam — use antiemético |

- **Reação anafilactoide** (rubor, urticária, broncoespasmo) é comum na dose de ataque: pausar, anti-histamínico, e reiniciar em velocidade menor. Não é contraindicação absoluta ([anafilaxia](#protocolos?guia=anafilaxia) se grave).
- Ao fim do esquema, repetir **paracetamol e ALT**: manter NAC (na taxa da última bolsa) se paracetamol detectável, ALT subindo ou INR alterado.
- Ingestões maciças (nível > 2x a linha) podem exigir dose maior de NAC; discuta com o CIATox. Carvão ativado se chegada em até 1–2 h.

## Encaminhamento
Discuta com centro de transplante hepático se: **pH < 7,30** após ressuscitação, ou **INR > 6,5 + creatinina > 3,4 mg/dL + encefalopatia grau III–IV** (critérios do King's College), lactato persistentemente elevado.

**Atenção.** O nomograma não se aplica a ingestões repetidas, de liberação prolongada ou com horário incerto. Na dúvida, inicie a NAC e reavalie com os exames.`},
{id:'tox-organofosforados',title:'Organofosforados, carbamatos e chumbinho',area:AREA,summary:'Síndrome colinérgica por inibidores da acetilcolinesterase: atropinização com doses dobradas, pralidoxima e particularidades do chumbinho no Brasil.',
 sources:[['Eddleston et al. · Management of acute organophosphorus pesticide poisoning (Lancet 2008)','https://doi.org/10.1016/S0140-6736(07)61202-1'],['ABRACIT · Centros de Informação e Assistência Toxicológica','https://abracit.org.br']],
 body:`## Mecanismo e contexto
- Inibem a **acetilcolinesterase** → excesso de acetilcolina em receptores muscarínicos, nicotínicos e no SNC.
- **Organofosforados:** ligação que tende a se tornar irreversível ("envelhecimento"). **Carbamatos:** ligação reversível, quadro geralmente mais curto.
- **Chumbinho:** raticida ilegal vendido no Brasil, historicamente à base de **aldicarbe** (carbamato), mas frequentemente com organofosforados ou misturas de composição desconhecida. Trate como síndrome colinérgica grave.

## Quadro clínico
| Receptor | Achados |
|---|---|
| Muscarínico | **Miose**, sialorreia, lacrimejamento, **broncorreia e broncoespasmo**, bradicardia, vômitos, diarreia, incontinência, sudorese |
| Nicotínico | **Fasciculações**, fraqueza, paralisia (inclusive respiratória), taquicardia, hipertensão |
| SNC | Agitação, confusão, coma, convulsões |

- Morte precoce por **insuficiência respiratória** (secreção + broncoespasmo + fraqueza + depressão central).
- **Síndrome intermediária** (24–96 h): fraqueza proximal, de pares cranianos e respiratória, após melhora colinérgica — vigiar a ventilação.
- Dosagem de colinesterase (eritrocitária ou plasmática) confirma, mas **não atrase o tratamento**.

## Tratamento
- **Descontaminação:** equipe com EPI; retirar roupas, lavar pele com água e sabão. Carvão ativado apenas com via aérea protegida.
- Via aérea: IOT precoce se necessário. **Evite succinilcolina** (bloqueio prolongado); prefira rocurônio ([IOT](#protocolos?guia=iot)).

### Atropina
- Dose inicial **1–3 mg IV**; **dobrar a dose a cada 5 min** (1 → 2 → 4 → 8 mg...) até **atropinização**.
- Alvos: **pulmões limpos à ausculta (secreção brônquica controlada)**, FC > 80 bpm, PAS > 80 mmHg, pele seca, pupilas não puntiformes.
- **O alvo é a secreção, não a pupila nem a taquicardia** — taquicardia não contraindica atropina se há broncorreia.
- Manutenção: infusão de **10–20% da dose total de ataque por hora**, ajustada.
- Sinais de excesso (delirium, hipertermia, íleo, retenção urinária): suspender por 30–60 min e reiniciar em dose menor.
- Doses totais de centenas de miligramas podem ser necessárias; garanta estoque.

### Pralidoxima (oxima)
- Reativa a enzima antes do envelhecimento; atua nos efeitos **nicotínicos** (fraqueza).
- Esquema OMS: **30 mg/kg IV em 20–30 min**, seguido de **8 mg/kg/h** em infusão, até melhora clínica sustentada e retirada da atropina.
- Benefício clínico debatido; mais útil em organofosforados, iniciada cedo. Em carbamato puro geralmente dispensável.
- Convulsões: **diazepam** ou midazolam.

## Observação
- Sintomáticos: internação, frequentemente UTI. Assintomáticos após exposição significativa: observar ao menos **12–24 h** (lipofílicos podem ter efeito tardio).
- Notificação compulsória (intoxicação exógena) no SINAN.

**Atenção.** Titule a atropina pela ausculta pulmonar, não pela frequência cardíaca. Subdosar atropina por medo de taquicardia é causa evitável de morte.`},
{id:'tox-opioides-bzd',title:'Opioides e benzodiazepínicos',area:AREA,summary:'Reconhecimento da depressão respiratória, naloxona titulada de 0,04 a 0,4 mg, infusão contínua e por que evitar o flumazenil.',
 sources:[['Boyer · Management of Opioid Analgesic Overdose (NEJM 2012)','https://doi.org/10.1056/NEJMra1202561'],['ABRACIT · Centros de Informação e Assistência Toxicológica','https://abracit.org.br']],
 body:`## Intoxicação por opioides
- Tríade: **rebaixamento de consciência, miose puntiforme e bradipneia** (FR < 12). A hipoventilação é o que mata.
- Tramadol pode causar convulsões e síndrome serotoninérgica; metadona prolonga QTc e tem ação longa; fentanil e análogos exigem doses maiores de naloxona.
- Complicações: edema pulmonar não cardiogênico, rabdomiólise, síndrome compartimental, pneumonia aspirativa.

## Naloxona
- Prioridade é **ventilar com bolsa-válvula-máscara** e oxigênio; a naloxona restaura a respiração, não necessariamente a consciência.
- **Dose inicial 0,04–0,4 mg IV, titulada** a cada 2–3 min até **FR ≥ 12** e via aérea protegida.
  - Usuário crônico/dependente: começar com **0,04 mg** para evitar abstinência abrupta (agitação, vômitos, aspiração, catecolaminas).
  - Apneia ou parada iminente: **0,4 mg a 2 mg**; repetir até **10 mg**. Sem resposta, reconsiderar o diagnóstico.
- Vias alternativas: IM, SC, intranasal (2–4 mg), intraóssea.
- **Meia-vida da naloxona (30–90 min) é menor que a de muitos opioides:** risco de renarcotização.
- **Infusão contínua:** cerca de **2/3 da dose que reverteu o quadro, por hora**, titulada (útil em metadona, liberação prolongada, fentanil de longa ação).
- Observar ao menos **4–6 h** após a última dose de naloxona; mais em metadona e formulações de liberação prolongada.
- Parada cardiorrespiratória: seguir o [protocolo de PCR](#protocolos?guia=pcr-adulto); a naloxona não substitui RCP e ventilação.

## Intoxicação por benzodiazepínicos
- Sedação, disartria, ataxia, com **sinais vitais geralmente preservados**. Depressão respiratória grave é incomum isoladamente — suspeite de **coingestão** (etanol, opioides, outros sedativos).
- Tratamento é **suporte**: posição, via aérea, observação até melhora do nível de consciência. Carvão ativado raramente indicado.

## Flumazenil — por que evitar
| Problema | Consequência |
|---|---|
| Usuário crônico de benzodiazepínico | **Abstinência aguda com convulsões** refratárias |
| Coingestão pró-convulsivante (tricíclicos, bupropiona, tramadol, carbamazepina) | Desmascara **convulsões e arritmias** |
| Meia-vida curta | Ressedação |
| Benzodiazepínico isolado | Prognóstico já excelente só com suporte |

- Uso aceitável: **reversão de sedação iatrogênica** em procedimento, em paciente sem uso crônico, ou intoxicação pediátrica acidental isolada. Dose **0,2 mg IV** a cada minuto, até 1 mg.
- Nunca use em overdose indiferenciada ou com QRS alargado.

## Alta
Após intoxicação intencional: avaliação psiquiátrica. Para usuários de opioides, orientar acesso à naloxona e encaminhar para tratamento de dependência.

**Atenção.** Titule a naloxona para restaurar a ventilação, não o despertar completo. O flumazenil de rotina no rebaixamento indiferenciado pode precipitar convulsões de difícil controle.`},
{id:'tox-triciclicos',title:'Intoxicação por antidepressivos tricíclicos',area:AREA,summary:'Bloqueio de canais de sódio, sinais de gravidade no ECG (QRS > 100 ms, R em aVR), bicarbonato de sódio em bolus e manejo de convulsões e hipotensão.',
 sources:[['Bruccoleri & Burns · A Literature Review of the Use of Sodium Bicarbonate for the Treatment of QRS Widening (J Med Toxicol 2016)','https://doi.org/10.1007/s13181-015-0520-7'],['ABRACIT · Centros de Informação e Assistência Toxicológica','https://abracit.org.br']],
 body:`## Por que é grave
Amitriptilina, nortriptilina, imipramina e clomipramina têm margem terapêutica estreita. Mecanismos tóxicos:
- **Bloqueio de canais de sódio** (efeito quinidina-like) → QRS largo, arritmias ventriculares, hipotensão.
- Bloqueio **alfa-1** → vasodilatação e hipotensão.
- Efeito **anticolinérgico** → taquicardia, midríase, pele seca, delirium, íleo.
- Antagonismo GABA → **convulsões**.
A deterioração pode ser rápida nas primeiras **6 h**, a partir de paciente aparentemente estável.

## ECG — preditor de gravidade
| Achado | Significado |
|---|---|
| **QRS > 100 ms** | Risco de **convulsões** — indica bicarbonato |
| **QRS > 160 ms** | Risco de **arritmias ventriculares** |
| **R terminal em aVR > 3 mm** ou razão R/S em aVR > 0,7 | Bloqueio de sódio significativo |
| Taquicardia sinusal | Achado mais comum, precoce |
| QTc prolongado | Frequente ([calcular QTc](#scores?id=qtc)) |

Repetir ECG seriado (a cada 1–2 h nas primeiras 6 h).

## Tratamento
- Monitorização contínua, acesso venoso, [ECG de Glasgow](#scores?id=glasgow). IOT precoce se rebaixamento; após IOT, **hiperventilar** para evitar acidose (a acidose piora o bloqueio de sódio).
- **Carvão ativado 1 g/kg (máx. 50 g)** se até 1–2 h e via aérea protegida (anticolinérgicos retardam o esvaziamento gástrico).

### Bicarbonato de sódio
- Indicação: **QRS > 100 ms**, arritmia ventricular ou hipotensão refratária.
- **1–2 mEq/kg IV em bolus** (bicarbonato 8,4% = 1 mEq/mL), repetido a cada 3–5 min até estreitamento do QRS.
- Alvo: **pH arterial 7,45–7,55**; evitar pH > 7,55.
- Após resposta, infusão (por exemplo, 150 mEq em 1 L de SG 5% a 150–250 mL/h) conforme QRS e gasometria.
- Monitorar **potássio** (hipocalemia) e sódio.

### Demais medidas
- **Hipotensão:** cristaloide 10–20 mL/kg, bicarbonato; se refratária, **noradrenalina** ([drogas vasoativas](#protocolos?guia=drogas-vasoativas)).
- **Convulsões:** **benzodiazepínico**; evitar fenitoína. Tratar a acidose resultante.
- **Arritmia ventricular refratária ao bicarbonato:** **lidocaína** 1–1,5 mg/kg IV.
- Emulsão lipídica 20% (1,5 mL/kg em bolus) em instabilidade refratária ou PCR, discutida com o CIATox; em PCR, seguir o [protocolo de PCR](#protocolos?guia=pcr-adulto) com RCP prolongada.
- **Contraindicados:** antiarrítmicos classe IA e IC, amiodarona (relativo), betabloqueadores, **fisostigmina** e **flumazenil**.

## Disposição
Assintomático com ECG normal após **6 h** de observação (sem liberação prolongada ou coingestão) pode receber alta médica, com avaliação psiquiátrica. Qualquer alteração de ECG ou sensório: UTI.

**Atenção.** O QRS acima de 100 ms indica bicarbonato imediatamente, mesmo com paciente acordado. Não use flumazenil ou fisostigmina em suspeita de tricíclico.`},
{id:'tox-peconhentos',title:'Acidentes por animais peçonhentos no Brasil',area:AREA,summary:'Classificação de gravidade e número de ampolas de soro nos acidentes botrópico, crotálico, elapídico, escorpiônico, loxoscélico e fonêutrico, segundo o Ministério da Saúde.',
 sources:[['Ministério da Saúde · Animais peçonhentos','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/animais-peconhentos'],['ABRACIT · Centros de Informação e Assistência Toxicológica','https://abracit.org.br']],
 body:`## Conduta geral
- Lavar o local com água e sabão, manter o membro **elevado e em repouso**. **Não** usar torniquete, não cortar, não sugar, não aplicar substâncias.
- Colher **tempo de coagulação (TC)**, hemograma, função renal, CPK, EAS; hidratação para diurese de 1–2 mL/kg/h (adulto).
- Soro antiveneno **IV, sem diluição ou diluído**, em 20–60 min, em unidade de referência. Pré-medicação **não é recomendada** de rotina; tenha adrenalina pronta ([anafilaxia](#protocolos?guia=anafilaxia)).
- A dose de soro é a mesma para **adultos e crianças** (neutraliza quantidade de veneno, não depende do peso).
- Notificação compulsória no SINAN; dúvidas: **CIATox 0800 722 6001**.

## Serpentes
| Acidente | Quadro | Leve | Moderado | Grave |
|---|---|---|---|---|
| **Botrópico** (jararaca) | Dor e edema locais, equimose, bolhas, sangramentos, TC alterado | **3 ampolas** SAB | **6 ampolas** | **12 ampolas** |
| **Crotálico** (cascavel) | Pouca reação local; **fácies miastênica** (ptose), visão turva, **mialgia, urina escura** (rabdomiólise), IRA | **5 ampolas** SAC | **10 ampolas** | **20 ampolas** |
| **Elapídico** (coral verdadeira) | Neurotoxicidade: ptose, diplopia, disfagia, **insuficiência respiratória** | Todo caso é potencialmente **grave**: **10 ampolas** SAEl | | |
| Laquético (surucucu) | Semelhante ao botrópico + síndrome vagal | — | **10 ampolas** SABL | **20 ampolas** |

- Botrópico: leve = edema restrito ao segmento, sangramento discreto; moderado = edema de dois ou três segmentos e/ou sangramento sem risco; grave = edema de todo o membro, necrose, choque, sangramento grave ou IRA. TC alterado sem outros sinais: tratar como leve. Edições anteriores do manual usavam faixas (2–4 e 4–8 ampolas).
- Crotálico: prevenir IRA com hidratação vigorosa; manitol e alcalinização urinária são discutidos. Elapídico: suporte ventilatório; neostigmina pode ser tentada (teste com atropina prévia).
- Controle do TC **24 h** após o soro; se persistir incoagulável, dose adicional conforme o manual.

## Escorpiões (Tityus)
| Gravidade | Quadro | Conduta |
|---|---|---|
| Leve | Dor e parestesia locais | **Analgesia** (lidocaína 2% sem vasoconstritor local, dipirona); sem soro |
| Moderado | Dor intensa + sudorese, náuseas, vômitos ocasionais, taquicardia, agitação leve | **2–3 ampolas** SAEsc (ou SAAr) |
| Grave | Vômitos profusos, sudorese profusa, bradicardia, **edema pulmonar**, choque, coma | **4–6 ampolas** + UTI |

Crianças < 10 anos têm maior risco de forma grave: observar ao menos **4–6 h** (manifestações sistêmicas surgem nas primeiras horas).

## Aranhas
| Acidente | Quadro | Soro |
|---|---|---|
| **Loxoscélico** (aranha-marrom) | Dor tardia (horas), placa marmórea, necrose; forma cutâneo-hemolítica com hemólise e IRA | Cutâneo leve: sem soro. Cutâneo moderado: **5 ampolas** SALox ou SAAr. Grave/hemolítico: **10 ampolas**. Prednisona 40 mg/dia por 5 dias na forma cutânea |
| **Fonêutrico** (armadeira) | Dor local intensa e imediata; sistêmico raro (sudorese, priapismo, choque) | Leve: anestesia local. Moderado: **2–4 ampolas** SAAr. Grave: **5–10 ampolas** |

**Atenção.** Número de ampolas conforme o manual vigente do Ministério da Saúde; confirme a edição local e a disponibilidade no polo de soroterapia. O soro é indicado pela gravidade clínica, nunca pela identificação isolada do animal.`},
{id:'tox-alcoois-abstinencia',title:'Álcoois tóxicos e síndrome de abstinência alcoólica',area:AREA,summary:'Metanol e etilenoglicol (gap osmolar, fomepizol ou etanol, hemodiálise) e manejo da abstinência alcoólica com CIWA-Ar, benzodiazepínico e tiamina antes da glicose.',
 sources:[['Kraut & Mullins · Toxic Alcohols (NEJM 2018)','https://doi.org/10.1056/NEJMra1615295'],['Schuckit · Recognition and Management of Withdrawal Delirium (Delirium Tremens) (NEJM 2014)','https://doi.org/10.1056/NEJMra1407298']],
 body:`## Metanol e etilenoglicol
- Fontes: metanol em álcool adulterado, combustíveis, solventes; etilenoglicol em anticongelantes e fluidos de radiador.
- Os compostos originais causam embriaguez; os **metabólitos** (via álcool desidrogenase) são tóxicos: **ácido fórmico** (metanol → lesão do nervo óptico, cegueira, lesão de núcleos da base) e **ácido glicólico/oxálico** (etilenoglicol → IRA, cristais de oxalato de cálcio, hipocalcemia).
- Latência de horas (maior se etanol concomitante).

### Pistas laboratoriais
- **Gap osmolar** = osmolalidade medida − calculada; calculada = 2 x Na + glicose/18 + ureia/6 ([calcular](#scores?id=osm)). Gap **> 10 mOsm/kg** sugere álcool tóxico (normal não exclui; o gap cai à medida que o álcool é metabolizado).
- **Acidose metabólica com ânion gap elevado** ([calcular](#scores?id=gap)) surge com os metabólitos — o gap osmolar e o ânion gap evoluem em sentido inverso.
- Etanol concomitante eleva a osmolalidade: descontar etanol (mg/dL)/3,7.

### Tratamento
- **Bloquear a álcool desidrogenase** na suspeita (não aguardar dosagem):
  - **Fomepizol:** **15 mg/kg IV** de ataque, depois **10 mg/kg a cada 12 h** (4 doses) e 15 mg/kg a cada 12 h após; a cada 4 h durante hemodiálise.
  - **Etanol** (alternativa disponível no Brasil): alvo sérico **100–150 mg/dL**; ataque cerca de 0,8 g/kg; manutenção ajustada ao etilismo e à diálise. Monitorar glicemia e consciência.
- **Hemodiálise** se: acidose grave (**pH < 7,25–7,30**), **alteração visual**, lesão renal aguda, instabilidade, ou concentração elevada (metanol ou etilenoglicol **> 50 mg/dL** sem fomepizol).
- Bicarbonato para pH < 7,30. Cofatores: **ácido folínico/fólico 50 mg IV a cada 6 h** (metanol); **tiamina 100 mg e piridoxina 50 mg** (etilenoglicol).
- Carvão ativado não é útil.

## Síndrome de abstinência alcoólica
| Tempo após última dose | Manifestação |
|---|---|
| 6–24 h | Tremor, ansiedade, taquicardia, sudorese, náuseas |
| 12–48 h | **Convulsões** (tônico-clônicas generalizadas) |
| 12–48 h | Alucinose alcoólica (sensório preservado) |
| **48–96 h** | **Delirium tremens**: confusão, hiperatividade autonômica, febre; mortalidade relevante |

### Avaliação
- **[CIWA-Ar](#scores?id=ciwa)**: < 10 leve; **10–18** moderada; **≥ 19** grave. Só vale para paciente capaz de responder.
- Excluir diagnósticos diferenciais: hipoglicemia, TCE, infecção ([meningite](#protocolos?guia=meningite)), encefalopatia hepática, outras intoxicações.

### Tratamento
- **Tiamina 100–300 mg IV antes da glicose** (a glicose sem tiamina pode precipitar **encefalopatia de Wernicke**). Suspeita de Wernicke (confusão, ataxia, oftalmoplegia): **200–500 mg IV a cada 8 h** por 3–5 dias.
- **Benzodiazepínico** é a base: **diazepam 10–20 mg** VO/IV (ou lorazepam 1–4 mg em hepatopatia grave e idosos), guiado por sintomas (CIWA-Ar ≥ 8–10) a cada 1 h, até controle.
- Delirium tremens: diazepam 10–20 mg IV a cada 5–10 min até sedação leve; refratário: fenobarbital ou propofol com IOT, em UTI.
- Corrigir **magnésio, potássio, fosfato**; hidratação; ambiente calmo.
- Haloperidol não substitui benzodiazepínico (reduz limiar convulsivo).

**Atenção.** Na suspeita de metanol ou etilenoglicol, inicie fomepizol ou etanol antes da confirmação laboratorial. Em todo etilista, administre tiamina antes da glicose.`},
];
