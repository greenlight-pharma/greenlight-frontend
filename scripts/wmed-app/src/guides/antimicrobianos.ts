// Guia de antimicrobianos (adultos, função renal normal). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica antes da liberação ampla. Os esquemas empíricos devem ser adaptados ao perfil de resistência local (CCIH).
import type {Guide} from './types';

const AREA='Antimicrobianos';
export const ANTIMICROBIANOS:Guide[]=[
{id:'pac',title:'Pneumonia adquirida na comunidade',area:AREA,summary:'Gravidade e local de tratamento, esquemas ambulatoriais e hospitalares, quando cobrir MRSA e Pseudomonas, e duração.',
 sources:[['ATS/IDSA 2019 · Diagnosis and Treatment of Adults with Community-acquired Pneumonia','https://www.atsjournals.org/doi/10.1164/rccm.201908-1581ST'],['SBPT · Recomendações para o manejo da pneumonia adquirida na comunidade 2018','https://www.jornaldepneumologia.com.br/details/2873']],
 body:`## Gravidade e local de tratamento
- **CURB-65** ([abrir score](#scores?id=curb65)): 0–1 ambulatorial; 2 considerar internação; ≥ 3 internação, avaliar UTI.
- Critérios maiores de PAC grave (ATS/IDSA): **choque com vasopressor** ou **ventilação mecânica**. Três ou mais critérios menores (FR ≥ 30, PaO₂/FiO₂ ≤ 250, infiltrado multilobar, confusão, ureia elevada, leucócitos < 4.000, plaquetas < 100.000, hipotermia, hipotensão com volume) também indicam UTI.
- Julgamento clínico, oxigenação e condição social pesam tanto quanto o escore.

## Ambulatorial
| Paciente | Esquema (VO) |
|---|---|
| Sem comorbidades | **Amoxicilina 1 g 8/8h** ou **doxiciclina 100 mg 12/12h** |
| Com comorbidades (cardíaca, pulmonar, renal, hepática, diabetes, etilismo, neoplasia, asplenia) ou antibiótico nos últimos 3 meses | **Amoxicilina-clavulanato 875/125 mg 12/12h** (ou cefuroxima 500 mg 12/12h) **+ azitromicina 500 mg no 1º dia e 250 mg do 2º ao 5º** (ou doxiciclina); ou **levofloxacino 750 mg 1x/dia** isolado |

Macrolídeo isolado só onde a resistência do pneumococo a macrolídeos for < 25%.

## Internação
- **Enfermaria:** betalactâmico (**ceftriaxona 1–2 g IV 1x/dia** ou ampicilina-sulbactam 1,5–3 g 6/6h) **+ macrolídeo** (azitromicina 500 mg/dia); ou quinolona respiratória isolada (levofloxacino 750 mg/dia ou moxifloxacino 400 mg/dia).
- **PAC grave:** betalactâmico **+ macrolídeo** (preferido) ou betalactâmico + quinolona respiratória.
- **Cobrir MRSA ou Pseudomonas** só com isolamento prévio desses germes em via aérea, ou internação recente com antibiótico IV e fatores de risco validados localmente. MRSA: vancomicina (dose por peso, guiada por nível) ou linezolida 600 mg 12/12h. Pseudomonas: piperacilina-tazobactam 4,5 g 6/6h, cefepima 2 g 8/8h ou meropenem 1 g 8/8h. Colha cultura e suspenda em 48 h se negativa.
- Anaerobicida de rotina na suspeita de aspiração não é necessário, salvo abscesso pulmonar ou empiema.

## Duração e seguimento
- Mínimo de **5 dias** e até estabilidade clínica por 48 h (afebril, FC ≤ 100, FR ≤ 24, PAS ≥ 90, SatO₂ ≥ 90% em ar ambiente, alimentando-se e com consciência habitual).
- Passe para via oral assim que houver estabilidade e trato digestivo funcionando.
- Na PAC grave internada em UTI, considere **hidrocortisona 200 mg/dia** conforme o protocolo local (ensaio CAPE COD, 2023). Não use corticoide de rotina fora desse cenário.
- Radiografia de controle não é rotina; repita se não houver melhora ou em fumante > 50 anos após 6–8 semanas.

**Atenção.** Falha em 72 h: reveja diagnóstico (TEP, IC, neoplasia, tuberculose), complicação (derrame, empiema, abscesso) e germe resistente.`},

{id:'itu',title:'Infecção do trato urinário',area:AREA,summary:'Cistite não complicada, pielonefrite, ITU no homem e na gestação, e quando não tratar bacteriúria.',
 sources:[['IDSA 2010 · Treatment of acute uncomplicated cystitis and pyelonephritis in women','https://academic.oup.com/cid/article/52/5/e103/388285'],['IDSA 2019 · Management of Asymptomatic Bacteriuria','https://academic.oup.com/cid/article/68/10/e83/5407612'],['EAU Guidelines · Urological Infections','https://uroweb.org/guidelines/urological-infections']],
 body:`## Cistite não complicada (mulher não gestante)
- **Nitrofurantoína 100 mg VO 6/6h por 5 dias** (evite se TFG < 30 ou suspeita de pielonefrite).
- **Fosfomicina trometamol 3 g VO dose única.**
- **Sulfametoxazol-trimetoprima 800/160 mg 12/12h por 3 dias**, se resistência local < 20% e sem uso nos últimos 3 meses.
- Urocultura não é obrigatória no primeiro episódio típico; peça em recorrência, falha ou sintomas atípicos.

## Pielonefrite
- **Sempre colher urocultura** antes do antibiótico.
- **Ambulatorial:** ciprofloxacino 500 mg 12/12h por 7 dias ou levofloxacino 750 mg/dia por 5 dias, se resistência local a quinolonas ≤ 10%. Onde a resistência for maior, faça **ceftriaxona 1 g IV** inicial e ajuste pela cultura.
- **Internação:** **ceftriaxona 1–2 g IV 1x/dia**. Com risco de ESBL (ESBL prévia, antibiótico ou internação recente): **ertapenem 1 g/dia**. Sepse ou choque: siga o [guia de sepse sem foco](#protocolos?guia=sepse-foco).
- Imagem (US ou TC) se sepse, ausência de melhora em 48–72 h, suspeita de obstrução ou cálculo.

## ITU no homem
- Considere sempre complicada: urocultura e **7 dias** de tratamento (quinolona ou SMX-TMP conforme cultura). Febre ou prostatite: 14 dias ou mais.

## Gestação
- **Rastreie e trate a bacteriúria assintomática** (urocultura no pré-natal).
- Opções: **cefalexina 500 mg 6/6h por 5–7 dias**, amoxicilina 500 mg 8/8h (se sensível), fosfomicina 3 g dose única, nitrofurantoína 100 mg 6/6h (evite no termo).
- Evite **quinolonas**; evite SMX-TMP no 1º trimestre e perto do parto.
- Pielonefrite na gestação: **internar** e iniciar ceftriaxona IV. Urocultura de controle após o tratamento.

## Quando não tratar
- **Bacteriúria assintomática** não se trata, exceto na **gestação** e antes de procedimento urológico com sangramento de mucosa. Idosos, diabéticos, sonda vesical e lesão medular: não tratar sem sintomas.
- Urina turva ou com cheiro forte não é indicação de antibiótico.

**Atenção.** Doses para função renal normal: ajuste pelo [clearance de creatinina](#scores?id=cockcroft).`},

{id:'pele-partes-moles',title:'Pele e partes moles',area:AREA,summary:'Celulite, erisipela, abscesso, mordeduras e o reconhecimento precoce da fasciíte necrosante.',
 sources:[['IDSA 2014 · Practice Guidelines for Skin and Soft Tissue Infections','https://academic.oup.com/cid/article/59/2/e10/2895845'],['WSES/SIS-E 2022 · Skin and soft-tissue infections','https://wjes.biomedcentral.com/articles/10.1186/s13017-022-00406-2']],
 body:`## Celulite e erisipela (não purulentas)
- Agente principal: **estreptococo β-hemolítico**.
- VO: **cefalexina 500 mg 6/6h** ou amoxicilina 500 mg 8/8h (erisipela). Alergia grave a betalactâmicos: **clindamicina 300–450 mg 6/6h**.
- IV (sinais sistêmicos, falha oral): **cefazolina 1–2 g 8/8h** ou oxacilina 2 g 4/4h.
- Duração: **5 dias**, estendendo se não houver melhora. Eleve o membro e trate porta de entrada (intertrigo, tinha).
- Delimite a borda com caneta para acompanhar a evolução.

## Abscesso e infecção purulenta
- **Incisão e drenagem** é o tratamento principal; mande o material para cultura.
- Antibiótico se abscesso > 2 cm, múltiplo, celulite extensa, sinais sistêmicos, imunossupressão, extremos de idade ou local de difícil drenagem.
- Cobrir **MRSA comunitário**: SMX-TMP 800/160 mg 1–2 cp 12/12h, doxiciclina 100 mg 12/12h ou clindamicina 300–450 mg 6/6h, por 5–10 dias.
- Grave ou internado: vancomicina IV (dose por peso, guiada por nível) ou linezolida 600 mg 12/12h.

## Mordeduras (cão, gato, humana)
- Lavagem abundante, avaliar tétano e **raiva** (protocolo do Ministério da Saúde).
- **Amoxicilina-clavulanato 875/125 mg 12/12h** por 3–5 dias como profilaxia em feridas de risco (mão, face, gato, perfurantes, imunossuprimido).

## Fasciíte necrosante: não perca
- Sinais de alarme: **dor desproporcional** ao exame, edema além do eritema, **bolhas hemorrágicas**, crepitação, anestesia da pele, necrose, toxicidade sistêmica e progressão em horas.
- É uma **emergência cirúrgica**: a exploração e o desbridamento precoce definem a sobrevida. Imagem não deve atrasar a cirurgia. O escore LRINEC não exclui o diagnóstico.
- Empírico: **vancomicina + piperacilina-tazobactam 4,5 g 6/6h** (ou meropenem) **+ clindamicina 600–900 mg IV 8/8h** (inibe a produção de toxinas).
- Estreptococo do grupo A confirmado: penicilina + clindamicina. Considere imunoglobulina IV na síndrome do choque tóxico, conforme o protocolo local.

**Atenção.** Celulite bilateral de membros inferiores quase sempre é outra coisa: estase, dermatite ou edema.`},

{id:'meningite',title:'Meningite bacteriana',area:AREA,summary:'Antibiótico empírico por faixa etária, dexametasona, quando fazer TC antes da punção, líquor e quimioprofilaxia.',
 sources:[['IDSA 2004 · Practice Guidelines for the Management of Bacterial Meningitis','https://academic.oup.com/cid/article/39/9/1267/402080'],['ESCMID 2016 · Guideline: diagnosis and treatment of acute bacterial meningitis','https://www.clinicalmicrobiologyandinfection.com/article/S1198-743X(16)00020-3/fulltext'],['Ministério da Saúde · Guia de Vigilância em Saúde (meningites)','https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/svsa/vigilancia/guia-de-vigilancia-em-saude-volume-1-6a-edicao']],
 body:`## Primeira hora
1. **Hemoculturas** e, se possível, punção lombar imediata.
2. **TC antes da punção** só se: déficit neurológico focal, papiledema, rebaixamento de consciência, crise convulsiva nova, imunossupressão ou doença do SNC prévia.
3. Se a TC for necessária: **não atrase o tratamento**. Colha hemoculturas, dê dexametasona e antibiótico e depois faça a TC.

## Dexametasona
- **0,15 mg/kg IV (10 mg no adulto) 6/6h por 4 dias**, iniciada **antes ou junto** da 1ª dose do antibiótico.
- Mantenha se pneumococo; suspenda se outro agente ou etiologia não bacteriana.

## Antibiótico empírico
| Situação | Esquema IV |
|---|---|
| 18–50 anos, imunocompetente | **Ceftriaxona 2 g 12/12h** (+ vancomicina onde houver pneumococo resistente a cefalosporina) |
| > 50 anos, gestante, etilista, imunossuprimido | Ceftriaxona **+ ampicilina 2 g 4/4h** (Listeria) ± vancomicina |
| Pós-neurocirurgia, derivação ou TCE penetrante | **Vancomicina + cefepima 2 g 8/8h** (ou ceftazidima, ou meropenem 2 g 8/8h) |
| Suspeita de encefalite herpética | Associar **aciclovir 10 mg/kg 8/8h** |

Duração: meningococo **7 dias**; pneumococo **10–14 dias**; Listeria **≥ 21 dias**.

## Líquor
| | Bacteriana | Viral | Tuberculosa |
|---|---|---|---|
| Células | ↑↑ neutrófilos | ↑ linfócitos | ↑ linfócitos |
| Glicose | **baixa** (< 40 ou razão < 0,4) | normal | baixa |
| Proteína | alta | normal ou pouco alta | muito alta |

## Notificação e quimioprofilaxia
- **Notificação compulsória imediata** (suspeita basta).
- Contatos íntimos de doença meningocócica ou por Haemophilus: **rifampicina 600 mg 12/12h por 2 dias** (meningococo). Alternativas: ciprofloxacino 500 mg VO dose única; **ceftriaxona 250 mg IM dose única** (gestantes).
- Precaução por gotículas nas primeiras **24 h** de antibiótico.

**Atenção.** Petéquias e púrpura com febre sugerem meningococcemia: antibiótico imediato, mesmo antes de qualquer exame.`},

{id:'sepse-foco',title:'Sepse sem foco definido: antibiótico empírico',area:AREA,summary:'Esquema empírico pelo risco de multirresistência, MRSA, neutropenia e fungos, com otimização de dose e descalonamento.',
 sources:[['Surviving Sepsis Campaign 2021 · International Guidelines','https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021'],['IDSA 2023 · Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections','https://www.idsociety.org/practice-guideline/amr-guidance/']],
 body:`Manejo hemodinâmico no [protocolo de sepse e choque séptico](#protocolos?guia=sepse).

## Antes de tudo
- **Choque ou sepse provável: antibiótico em até 1 hora.** Sepse possível sem choque: investigue rapidamente e decida em até 3 horas.
- **2 pares de hemoculturas** e culturas do provável foco **antes**, sem atrasar a dose.
- Procure o foco com exame físico completo (pele, cateteres, abdome, urina, pulmão, articulações).

## Esquema empírico
| Cenário | Esquema IV |
|---|---|
| Comunitária, sem risco de multirresistência | **Ceftriaxona 2 g 1x/dia** (+ metronidazol 500 mg 8/8h se foco abdominal possível) ou **piperacilina-tazobactam 4,5 g 6/6h** |
| Risco de multirresistência: internação ou antibiótico IV nos últimos 90 dias, hemodiálise, institucionalizado | **Piperacilina-tazobactam 4,5 g 6/6h** ou **cefepima 2 g 8/8h + metronidazol** |
| Colonização prévia por ESBL, ou choque em serviço com alta prevalência de ESBL | **Meropenem 1 g 8/8h** (2 g se SNC) |
| Risco de MRSA: colonização, cateter, pele, hemodiálise | **Associar vancomicina**: ataque 25–30 mg/kg no grave; manutenção guiada por nível ou AUC |
| Neutropenia febril | **Cefepima 2 g 8/8h**, piperacilina-tazobactam ou meropenem |
| Risco de candidemia: NPT, cateter central, abdome operado, colonização múltipla | Considerar equinocandina (**micafungina 100 mg/dia**) |

Siga o perfil da CCIH local, que substitui esta tabela quando for diferente.

## Dose certa
- A **1ª dose é sempre cheia**, sem ajuste renal; ajuste só depois de 24–48 h pela função renal ([clearance](#scores?id=cockcroft)).
- Considere **infusão estendida** de betalactâmicos (ex.: piperacilina-tazobactam em 4 h) conforme o protocolo local.

## Depois das 48–72 horas
- **Controle do foco** (drenagem, retirada de cateter, cirurgia) o mais cedo possível, idealmente em 6–12 h.
- **Descalone** pelo resultado das culturas e pela evolução.
- Duração curta costuma bastar (7 dias na maioria). Procalcitonina pode ajudar a suspender.

**Atenção.** Cobertura ampla não substitui controle de foco. Reavalie o diagnóstico de infecção todos os dias.`},

{id:'intra-abdominal',title:'Infecção intra-abdominal',area:AREA,summary:'Controle de foco, esquemas para infecção comunitária e hospitalar, duração curta, PBE, colangite e diverticulite.',
 sources:[['SIS 2017 · Revised Guidelines on the Management of Intra-Abdominal Infection','https://www.liebertpub.com/doi/10.1089/sur.2016.261'],['WSES 2021 · Management of intra-abdominal infections','https://wjes.biomedcentral.com/articles/10.1186/s13017-021-00387-8'],['EASL 2018 · Decompensated cirrhosis','https://easl.eu/publication/easl-guidelines-decompensated-cirrhosis/']],
 body:`## Princípio
O **controle do foco** (cirurgia ou drenagem percutânea) é o tratamento principal. O antibiótico complementa.

## Esquemas
| Cenário | Esquema IV |
|---|---|
| Comunitária leve a moderada | **Ceftriaxona 2 g 1x/dia + metronidazol 500 mg 8/8h**; ou ertapenem 1 g/dia |
| Comunitária grave ou associada a cuidados de saúde | **Piperacilina-tazobactam 4,5 g 6/6h**; ou cefepima 2 g 8/8h + metronidazol; ou meropenem 1 g 8/8h |
| Alergia grave a betalactâmicos | Ciprofloxacino 400 mg 12/12h + metronidazol (conforme resistência local) |

- Enterococo e fungos: cobrir só em infecção hospitalar, pós-operatória ou imunossupressão, conforme cultura e risco.
- Amoxicilina-clavulanato e ampicilina-sulbactam têm alta resistência de *E. coli* em muitos serviços: consulte a CCIH.

## Duração
- **4 dias após controle adequado do foco** (ensaio STOP-IT) na maioria dos casos.
- **Apendicite não complicada** operada: sem antibiótico no pós-operatório (apenas a profilaxia).

## Situações específicas
- **Peritonite bacteriana espontânea** (PMN no líquido ascítico ≥ 250/mm³): **ceftriaxona 2 g/dia** (ou cefotaxima) por **5 dias** + **albumina 1,5 g/kg no 1º dia e 1 g/kg no 3º dia**. Infecção hospitalar: ampliar conforme resistência local.
- **Colangite aguda:** antibiótico como acima e **drenagem biliar** (CPRE) com urgência definida pela gravidade (Tóquio).
- **Diverticulite não complicada** em imunocompetente: antibiótico pode ser dispensado com observação (ensaios DIABOLO e AVOD). Abscesso > 3–4 cm: drenagem percutânea.
- **Colecistite:** colecistectomia precoce; antibiótico pós-operatório só se colecistite complicada.

**Atenção.** Dor abdominal com sinais de sepse e sem foco claro pede TC de abdome e avaliação cirúrgica precoce.`},

{id:'sifilis-ist',title:'Sífilis e outras ISTs',area:AREA,summary:'Esquemas de penicilina por estágio, gestante, neurossífilis, seguimento sorológico e tratamento sindrômico de uretrite, cervicite e DIP.',
 sources:[['Ministério da Saúde · PCDT para Atenção Integral às Pessoas com IST 2022','https://www.gov.br/aids/pt-br/central-de-conteudo/pcdts/2022/ist/pcdt-ist-2022_isbn-1.pdf'],['CDC · Sexually Transmitted Infections Treatment Guidelines 2021','https://www.cdc.gov/std/treatment-guidelines/']],
 body:`## Sífilis: tratamento por estágio
| Estágio | Esquema |
|---|---|
| **Recente** (primária, secundária, latente ≤ 1 ano) | **Penicilina G benzatina 2,4 milhões UI IM dose única** (1,2 milhão em cada glúteo) |
| **Tardia** (latente > 1 ano, duração ignorada, terciária) | **Penicilina G benzatina 2,4 milhões UI IM semanal por 3 semanas** (total 7,2 milhões UI) |
| **Neurossífilis** | **Penicilina G cristalina 18–24 milhões UI/dia IV** (3–4 milhões UI 4/4h) por **14 dias** |

- Alternativa fora da gestação: **doxiciclina 100 mg 12/12h** por 15 dias (recente) ou 30 dias (tardia).
- **Gestante: só a penicilina benzatina** é considerada tratamento adequado para prevenir a sífilis congênita. Se o intervalo entre as doses semanais passar de 7 dias, reinicie o esquema. Alergia: dessensibilização.
- **Reação de Jarisch-Herxheimer:** febre, mialgia e piora das lesões nas primeiras 24 h. Não é alergia e não suspende o tratamento.

## Seguimento e notificação
- Teste não treponêmico (VDRL) **a cada 3 meses** no primeiro ano (**mensal na gestante**).
- Boa resposta: queda de **2 diluições em 3 meses** ou **4 diluições em 6 meses**. Aumento de 2 diluições sugere reinfecção ou falha: retratar e investigar neurossífilis.
- **Tratar as parcerias sexuais** e **notificar** (sífilis adquirida, em gestante e congênita).

## Abordagem sindrômica
| Síndrome | Esquema |
|---|---|
| Uretrite ou cervicite (gonorreia + clamídia) | **Ceftriaxona 500 mg IM dose única + azitromicina 1 g VO dose única** |
| Clamídia isolada | Azitromicina 1 g VO dose única ou doxiciclina 100 mg 12/12h por 7 dias |
| Tricomoníase | **Metronidazol 500 mg 12/12h por 7 dias** |
| DIP ambulatorial | **Ceftriaxona 500 mg IM dose única + doxiciclina 100 mg 12/12h por 14 dias + metronidazol 500 mg 12/12h por 14 dias** |
| Herpes genital, 1º episódio | **Aciclovir 400 mg 8/8h por 7–10 dias** |

- Em toda IST: ofereça **testes para HIV, sífilis e hepatites B e C**, vacina de hepatite B e HPV, e avalie PEP/PrEP.

**Atenção.** Úlcera genital com VDRL negativo não exclui sífilis primária: o teste pode ainda não ter positivado.`},

{id:'profilaxia-cirurgica',title:'Profilaxia antimicrobiana cirúrgica',area:AREA,summary:'Escolha, momento, dose por peso, redose e duração máxima da profilaxia por tipo de cirurgia.',
 sources:[['ASHP/IDSA/SIS/SHEA 2013 · Clinical practice guidelines for antimicrobial prophylaxis in surgery','https://www.ashp.org/-/media/assets/policy-guidelines/docs/therapeutic-guidelines/therapeutic-guidelines-antimicrobial-prophylaxis-in-surgery.ashx'],['ANVISA · Critérios diagnósticos e prevenção de infecção de sítio cirúrgico','https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/servicosdesaude/publicacoes/caderno-4-medidas-de-prevencao-de-infeccao-relacionada-a-assistencia-a-saude.pdf']],
 body:`## Regras de ouro
- **Momento:** até **60 min antes da incisão** (vancomicina e quinolonas: **60–120 min** antes).
- **Dose:** **cefazolina 2 g IV** (**3 g se ≥ 120 kg**).
- **Redose** intraoperatória: cefazolina a cada **4 h** de cirurgia; também se sangramento > **1.500 mL**.
- **Duração:** dose única ou no máximo **24 h**. Drenos e cateteres **não** justificam prolongar.

## Por tipo de cirurgia
| Cirurgia | Primeira escolha | Alergia grave a betalactâmicos |
|---|---|---|
| Limpa com implante, cardíaca, vascular, ortopédica | **Cefazolina** | **Vancomicina 15 mg/kg** ou clindamicina 900 mg |
| Colorretal | **Cefazolina + metronidazol 500 mg**, ou cefoxitina 2 g (redose a cada 2 h), ou ertapenem 1 g | Clindamicina + gentamicina 5 mg/kg (ou aztreonam) |
| Gastroduodenal, via biliar aberta | **Cefazolina** | Clindamicina ou vancomicina + gentamicina |
| Apendicectomia | **Cefazolina + metronidazol** ou cefoxitina | Clindamicina + gentamicina |
| Cesárea | **Cefazolina 2 g antes da incisão** (não esperar o clampeamento) | Clindamicina 900 mg + gentamicina |
| Histerectomia | **Cefazolina** | Clindamicina + gentamicina |

- **Vancomicina** também se colonização conhecida por **MRSA** (associada à cefazolina nas cirurgias com implante).
- Colecistectomia videolaparoscópica eletiva de baixo risco e cirurgias limpas sem implante (ex.: herniorrafia sem tela em baixo risco) geralmente dispensam profilaxia.

## Além do antibiótico
- Tricotomia só se necessária, com **tricotomizador**, perto da cirurgia.
- Antissepsia com **clorexidina alcoólica**; glicemia < 180–200 mg/dL; normotermia.

**Atenção.** Profilaxia prolongada não reduz infecção de sítio cirúrgico e aumenta resistência e *C. difficile*.`},

{id:'espectro-antimicrobianos',title:'Espectro das classes de antimicrobianos',area:AREA,summary:'O que cada classe cobre bem, onde falha e os principais cuidados, em uma tabela para revisão rápida.',
 sources:[['Sanford Guide to Antimicrobial Therapy (referência geral)','https://www.sanfordguide.com/'],['IDSA 2023 · Guidance on Antimicrobial-Resistant Gram-Negative Infections','https://www.idsociety.org/practice-guideline/amr-guidance/']],
 body:`## Betalactâmicos
| Classe | Exemplos | Cobre bem | Não cobre / cuidado |
|---|---|---|---|
| Penicilinas naturais | Penicilina G, benzatina | Estreptococos, *Treponema*, meningococo, clostrídios | *S. aureus* (penicilinase), gram-negativos |
| Aminopenicilinas | Amoxicilina, ampicilina | + *E. faecalis*, *Listeria*, *H. influenzae* sensível | Produtores de betalactamase |
| Antiestafilocócicas | Oxacilina | MSSA | MRSA, gram-negativos |
| Com inibidor | Amoxicilina-clavulanato, ampicilina-sulbactam | + MSSA, anaeróbios, parte dos gram-negativos | MRSA, *Pseudomonas*, ESBL |
| Antipseudomonas com inibidor | Piperacilina-tazobactam | + *Pseudomonas*, anaeróbios | MRSA; não é confiável na bacteremia por ESBL |
| Cefalosporinas 1ª geração | Cefazolina, cefalexina | MSSA, estreptococos | Enterococo, anaeróbios, MRSA |
| Cefalosporinas 3ª geração | Ceftriaxona, cefotaxima | Pneumococo, *Neisseria*, enterobactérias | *Pseudomonas* (exceto ceftazidima), *Listeria*, enterococo, ESBL |
| Cefalosporina 4ª geração | Cefepima | + *Pseudomonas*, AmpC | Anaeróbios, enterococo, MRSA |
| Carbapenêmicos | Meropenem, imipenem, ertapenem | ESBL, anaeróbios, espectro amplo | MRSA, *E. faecium*, *Stenotrophomonas*, KPC/metalo; ertapenem não cobre *Pseudomonas* nem *Acinetobacter* |

**Enterococo nunca é coberto por cefalosporinas. *Listeria* também não.**

## Outras classes
| Classe | Exemplos | Cobre bem | Não cobre / cuidado |
|---|---|---|---|
| Glicopeptídeos | Vancomicina | Gram-positivos, inclusive **MRSA**; VO para *C. difficile* | Gram-negativos, VRE; nefrotoxicidade (nível sérico) |
| Oxazolidinonas | Linezolida | MRSA, VRE | Mielossupressão > 2 semanas, síndrome serotoninérgica |
| Macrolídeos | Azitromicina, claritromicina | Atípicos, *Bordetella*, parte dos pneumococos | Resistência do pneumococo; QT longo |
| Tetraciclinas | Doxiciclina | Atípicos, riquétsias, espiroquetas, MRSA comunitário | Gestação; fotossensibilidade |
| Fluoroquinolonas | Ciprofloxacino, levofloxacino, moxifloxacino | Gram-negativos (cipro: *Pseudomonas*); levo/moxi: pneumococo e atípicos | Tendinopatia, QT longo, aneurisma, *C. difficile*; reserve |
| Sulfonamidas | Sulfametoxazol-trimetoprima | MRSA comunitário, *Pneumocystis*, *Stenotrophomonas*, ITU | Estreptococos (fraco na celulite); hipercalemia, citopenias |
| Nitroimidazóis | Metronidazol | **Anaeróbios** abaixo do diafragma, protozoários | Aeróbios; efeito antabuse |
| Lincosamidas | Clindamicina | Gram-positivos, anaeróbios, **inibe toxinas** | Alto risco de *C. difficile*; *B. fragilis* resistente |
| Aminoglicosídeos | Gentamicina, amicacina | Gram-negativos, inclusive *Pseudomonas*; sinergia | Anaeróbios; nefro e ototoxicidade |
| Polimixinas | Polimixina B | Gram-negativos multirresistentes (KPC, *Acinetobacter*) | *Proteus*, *Serratia*, gram-positivos; nefrotoxicidade |
| Nitrofuranos | Nitrofurantoína | ITU baixa (*E. coli*, *E. faecalis*) | Não atinge nível sérico: não use em pielonefrite |

**Atenção.** A tabela descreve o espectro habitual. O antibiograma e o perfil da CCIH local têm a palavra final.`},
];
