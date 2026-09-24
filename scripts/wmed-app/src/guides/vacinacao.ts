// Vacinação (PNI/Ministério da Saúde e SBIm). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica e conferência com o calendário vigente do PNI antes da liberação ampla.
import type {Guide} from './types';

const AREA='Vacinação';
export const VACINACAO:Guide[]=[
{id:'vac-crianca',title:'Calendário vacinal da criança (0–9 anos)',area:AREA,summary:'Vacinas do PNI do nascimento aos 9 anos: BCG, hepatite B, penta, VIP, pneumo 10, rotavírus, meningo, febre amarela, virais, influenza e COVID-19.',
 sources:[['Ministério da Saúde · Vacinação (calendário nacional)','https://www.gov.br/saude/pt-br/vacinacao'],['SBIm · Calendários de vacinação','https://sbim.org.br/calendarios-de-vacinacao']],
 body:`## Calendário de rotina (PNI)
| Idade | Vacinas |
|---|---|
| Ao nascer | **BCG** (dose única) e **hepatite B** (idealmente nas primeiras 12–24 h) |
| 2 meses | **Penta** (DTP + Hib + hepatite B), **VIP**, **pneumocócica 10**, **rotavírus** |
| 3 meses | **Meningocócica C** |
| 4 meses | Penta, VIP, pneumo 10, rotavírus |
| 5 meses | Meningocócica C |
| 6 meses | Penta, VIP; início da **influenza** |
| 9 meses | **Febre amarela** |
| 12 meses | **Tríplice viral** (SCR), reforço de **pneumo 10** e reforço **meningocócico** |
| 15 meses | **DTP** (1º reforço), **VIP** (reforço), **tetra viral** (SCR + varicela), **hepatite A** |
| 4 anos | **DTP** (2º reforço), **febre amarela** (reforço), **varicela** (2ª dose) |

## Pontos que mudaram recentemente
- **Poliomielite:** em 2024 o PNI substituiu a VOP (gotinha) pela **VIP exclusiva**, com reforço injetável aos 15 meses. Os reforços e o esquema de transição para quem já recebeu VOP devem ser vistos no calendário vigente.
- **Meningocócica:** o reforço dos 12 meses passou a usar a **ACWY** em parte do país; conferir o calendário vigente para saber qual vacina está disponível.
- **COVID-19:** incorporada ao calendário da criança em 2024 (a partir de 6 meses e menores de 5 anos). Número de doses e produto dependem do imunizante disponível; **conferir o calendário vigente**.
- **Influenza:** faz parte da rotina para **6 meses a menores de 6 anos**. Na primeira vacinação de menores de 9 anos são **2 doses com intervalo de 30 dias**; depois, 1 dose anual.

## Regras práticas
- **Rotavírus:** 1ª dose até **3 meses e 15 dias**; 2ª dose até **7 meses e 29 dias**. Fora dessas idades, não se aplica (risco de invaginação).
- **BCG:** adiar em RN com peso < 2 kg e em filhos de mãe com HIV até exclusão da infecção; contraindicada em imunodeficiência.
- **Febre amarela e SCR/tetra viral em menores de 2 anos:** não aplicar no mesmo dia; respeitar **30 dias** entre elas (interferência na resposta).
- **Esquema atrasado:** não reinicie esquema interrompido; complete as doses que faltam respeitando idades máximas e intervalos mínimos.
- **Crianças com condições especiais** (asplenia, imunodeficiência, cardiopatia, pneumopatia) têm vacinas adicionais nos **CRIE** (ex.: pneumocócica 13, meningo B, varicela).

## Diferenças em relação à SBIm (rede privada)
- SBIm prefere **pneumocócicas de maior valência** (13, 15 ou 20), **meningo ACWY** e **meningo B** desde os 3 meses, e **hepatite A em 2 doses**.
- Vacina **dengue** (Qdenga) no SUS para faixas etárias e municípios definidos anualmente; conferir o calendário vigente.

**Atenção.** O calendário do PNI muda com frequência (polio, meningo, COVID-19, dengue); antes de orientar a família, confira o calendário vigente do Ministério da Saúde.`},

{id:'vac-adolescente',title:'Vacinação do adolescente',area:AREA,summary:'HPV em dose única, meningocócica ACWY, dT, febre amarela, tríplice viral e hepatite B entre 10 e 19 anos, com resgate de esquemas incompletos.',
 sources:[['Ministério da Saúde · Vacinação (calendário nacional)','https://www.gov.br/saude/pt-br/vacinacao'],['SBIm · Calendários de vacinação','https://sbim.org.br/calendarios-de-vacinacao']],
 body:`## Vacinas de rotina (PNI)
| Vacina | Indicação | Esquema |
|---|---|---|
| **HPV quadrivalente** | Meninas e meninos de **9 a 14 anos** | **Dose única** desde 2024 |
| **Meningocócica ACWY** | **11 a 14 anos** | Dose única (reforço), independentemente de meningo C prévia |
| **dT** (dupla adulto) | Todos | Completar 3 doses se esquema incompleto; **reforço a cada 10 anos** |
| **Febre amarela** | Não vacinados | Dose única (quem recebeu só 1 dose antes dos 5 anos recebe reforço) |
| **Tríplice viral** | Não vacinados | **2 doses** (intervalo mínimo 30 dias) |
| **Hepatite B** | Não vacinados | **3 doses** (0, 1 e 6 meses) |
| **Influenza** | Grupos prioritários e campanhas | Anual |

## HPV: pontos-chave
- A dose única vale para **9–14 anos** imunocompetentes. Quem iniciou esquema de 2 doses já está protegido; não é preciso completar.
- **Grupos especiais** (HIV, transplantados, pacientes oncológicos, imunossuprimidos) mantêm **3 doses (0, 2 e 6 meses)** e têm faixa etária ampliada (em geral **9 a 45 anos**). Vítimas de violência sexual também têm indicação ampliada; conferir o calendário vigente.
- Houve **resgate temporário para 15–19 anos** não vacinados em 2025; conferir se a estratégia segue ativa.
- **Síncope pós-vacinal** é comum nessa faixa: aplique sentado e observe por **15 minutos**.

## Resgate do esquema
- Revise a caderneta: polio, SCR, varicela, hepatite A e B, febre amarela e dT.
- **Não reinicie** esquemas; complete as doses faltantes.
- **Varicela:** suscetíveis sem história de doença devem ter **2 doses**; no PNI a oferta fora da infância é restrita a grupos específicos (conferir o calendário vigente).
- Registre tudo na caderneta e no sistema de informação; doses sem registro são consideradas não aplicadas.
- A **COVID-19** para adolescentes fora de grupos de risco segue estratégia própria do PNI; conferir o calendário vigente.

## Complementos da SBIm (rede privada)
- **dTpa** no lugar da dT no reforço da adolescência.
- **Meningo B** (2 doses) e reforço da **ACWY** 5 anos após a dose dos 11–12 anos.
- **HPV nonavalente**; **dengue** para soropositivos ou conforme bula; **hepatite A** se não vacinado.

## Situações especiais
- **Gestante adolescente:** siga o calendário da gestante ([vacinação na gestação](#protocolos?guia=vac-gestante)).
- Adolescente com **IST** ou vida sexual ativa: aproveite a consulta para hepatite B, HPV e rastreio ([IST e sífilis](#protocolos?guia=sifilis-ist)).

**Atenção.** As faixas etárias do HPV e as estratégias de resgate foram alteradas várias vezes desde 2024; confira o calendário vigente antes de recusar uma dose.`},

{id:'vac-adulto-idoso',title:'Vacinação do adulto e do idoso',area:AREA,summary:'dT a cada 10 anos, hepatite B, tríplice viral, febre amarela, influenza, pneumocócicas (PNI x SBIm) e herpes-zóster recombinante.',
 sources:[['Ministério da Saúde · Vacinação (calendário nacional)','https://www.gov.br/saude/pt-br/vacinacao'],['SBIm · Calendários de vacinação','https://sbim.org.br/calendarios-de-vacinacao'],['CDC · Immunization Schedules','https://www.cdc.gov/vaccines/hcp/imz-schedules/index.html']],
 body:`## Adulto 20–59 anos (PNI)
| Vacina | Esquema |
|---|---|
| **dT** | 3 doses (0, 2 e 4 meses) se não vacinado; **reforço a cada 10 anos** (5 anos em ferimento grave: ver [profilaxia pós-exposição](#protocolos?guia=vac-pos-exposicao)) |
| **Hepatite B** | **3 doses (0, 1 e 6 meses)**, universal, sem limite de idade |
| **Tríplice viral** | **20–29 anos: 2 doses**; **30–59 anos: 1 dose** (trabalhadores da saúde: 2 doses em qualquer idade) |
| **Febre amarela** | **Dose única** se nunca vacinado |
| **Influenza** | Anual para grupos prioritários (profissionais de saúde, doenças crônicas, gestantes, entre outros) |
| **COVID-19** | Grupos prioritários, conforme estratégia vigente |

## Idoso (≥ 60 anos)
- **Influenza anual** e **COVID-19** (doses periódicas; conferir o calendário vigente).
- **dT** a cada 10 anos e **hepatite B** se não vacinado.
- **Febre amarela:** em quem nunca foi vacinado, avaliar risco epidemiológico x risco de eventos adversos graves (maior em idosos); decisão individualizada.
- **Pneumocócica 23 (VPP23):** no PNI, para idosos **institucionalizados ou acamados**; demais grupos de risco pelos CRIE.

## Pneumocócicas: PNI x SBIm
| Fonte | Recomendação para ≥ 60 anos |
|---|---|
| **PNI/CRIE** | VPP23 para acamados/institucionalizados; **VPC13** + VPP23 para imunossuprimidos e outras condições de risco nos CRIE |
| **SBIm** | **VPC20 dose única**; ou **VPC13/VPC15** seguida de **VPP23** 6–12 meses depois e 2ª VPP23 5 anos após a primeira |
| **CDC/ACIP** | VPC20 ou VPC21 isolada, ou VPC15 seguida de VPP23 (idade de corte recente: 50 anos) |

## Herpes-zóster
- **Vacina recombinante adjuvada (RZV):** **2 doses IM, intervalo de 2 meses** (até 6 meses).
- SBIm: para **≥ 50 anos** e para **imunossuprimidos ≥ 18 anos**; pode ser aplicada após episódio de zóster (aguardar resolução do quadro agudo).
- Não é vacina viva; pode ser usada em imunossuprimidos. Disponibilidade no SUS limitada a grupos específicos: conferir o calendário vigente.

## Outras recomendações SBIm
- **dTpa** no lugar da dT nos reforços (especialmente contactantes de lactentes).
- **VSR** para **≥ 60 anos** (decisão compartilhada; prioridade para ≥ 75 anos e comorbidades).
- **Hepatite A** para suscetíveis, **meningocócicas** conforme risco, **dengue** conforme bula.
- **Condições de risco** (asplenia, HIV, doença renal ou hepática crônica, transplante, diabetes) têm esquemas ampliados nos **CRIE**.

**Atenção.** Cada consulta de adulto é oportunidade de revisar a caderneta; recomendações de sociedades (SBIm, ACIP) não equivalem à oferta do SUS, então confira o calendário vigente do PNI e dos CRIE.`},

{id:'vac-gestante',title:'Vacinação na gestação',area:AREA,summary:'dTpa a partir de 20 semanas em toda gestação, hepatite B, influenza, COVID-19 e VSR; vacinas vivas contraindicadas e puerpério.',
 sources:[['Ministério da Saúde · Vacinação (calendário nacional)','https://www.gov.br/saude/pt-br/vacinacao'],['SBIm · Calendários de vacinação','https://sbim.org.br/calendarios-de-vacinacao'],['CDC · Immunization Schedules','https://www.cdc.gov/vaccines/hcp/imz-schedules/index.html']],
 body:`## Vacinas recomendadas
| Vacina | Esquema na gestação | Objetivo |
|---|---|---|
| **dTpa** | **1 dose a partir de 20 semanas, em TODA gestação** (mesmo se vacinada antes) | Anticorpos contra coqueluche para o lactente |
| **dT** | Completar esquema de 3 doses (uma delas como dTpa) se incompleto ou desconhecido | Tétano neonatal e materno |
| **Hepatite B** | **3 doses (0, 1 e 6 meses)** se não vacinada; pode iniciar em qualquer trimestre | Transmissão vertical |
| **Influenza** | **Dose anual em qualquer idade gestacional** | Doença grave materna e proteção do RN |
| **COVID-19** | Dose em cada gestação, conforme estratégia vigente | Doença grave materna |
| **VSR (bivalente pré-F)** | **Dose única**; janela de **32–36 semanas** pelo CDC; bula e PNI brasileiros podem adotar janela diferente | Bronquiolite no lactente nos primeiros meses |

## Pontos práticos
- **dTpa:** o ideal é entre **20 e 36 semanas**; quem não recebeu na gestação deve receber **no puerpério** o mais cedo possível.
- Se dT incompleta: complete com dT e faça **uma das doses como dTpa** após 20 semanas.
- **VSR:** a vacina materna e o anticorpo monoclonal no lactente (nirsevimabe) são alternativas; em geral não se usam os dois. A incorporação ao SUS e a idade gestacional adotada são recentes: **conferir o calendário vigente**.
- Aplique vacinas inativadas **no mesmo dia** quando possível para não perder oportunidade.
- **Hepatite B:** em gestante HBsAg positiva, o RN recebe **vacina + imunoglobulina (IGHAHB) nas primeiras 12–24 h**; confirme a sorologia materna no pré-natal.

## Contraindicadas na gestação (vírus ou bactérias vivos)
- **Tríplice viral, varicela, tetra viral, BCG, dengue (Qdenga), zóster atenuado.**
- **Febre amarela:** contraindicada em geral; em **surto ou risco epidemiológico alto** e não vacinada, avaliar risco-benefício. Em lactantes de bebês < 6 meses, suspender a amamentação por **10 dias** após a vacina.
- **HPV:** não é viva, mas **adiar** para depois do parto (dados insuficientes).
- Vacinação inadvertida com vacina viva **não indica interrupção** da gestação; notificar e acompanhar.

## Puerpério e pré-concepção
- Pré-concepção: atualizar **tríplice viral e varicela** e **evitar gestar por 30 dias** após vacinas vivas.
- Puerpério: aplique as vivas pendentes (SCR, varicela); a amamentação não contraindica, exceto a ressalva da febre amarela.

**Atenção.** Recomendações para VSR e COVID-19 na gestação mudaram entre 2024 e 2026; confira o calendário vigente do PNI antes de indicar a dose e a idade gestacional.`},

{id:'vac-pos-exposicao',title:'Profilaxia pós-exposição: tétano, raiva e hepatite B',area:AREA,summary:'Conduta por tipo de ferimento e histórico vacinal no tétano, esquema antirrábico do MS e profilaxia de hepatite B após acidente com material biológico.',
 sources:[['Ministério da Saúde · Raiva (profilaxia)','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/r/raiva'],['Ministério da Saúde · Vacinação','https://www.gov.br/saude/pt-br/vacinacao'],['CDC · Immunization Schedules','https://www.cdc.gov/vaccines/hcp/imz-schedules/index.html']],
 body:`## Tétano
Ferimento de **alto risco**: profundo, puntiforme, com corpo estranho, tecido desvitalizado, contaminado com terra/fezes, queimadura, mordedura, fratura exposta.

| Histórico vacinal | Ferimento limpo e superficial | Outros ferimentos |
|---|---|---|
| **Incerto ou < 3 doses** | Vacinar (iniciar/completar esquema) | Vacinar **+ IGHAT ou SAT** |
| **≥ 3 doses, última < 5 anos** | Nada | Nada |
| **≥ 3 doses, última 5–10 anos** | Nada | **Reforço** (1 dose) |
| **≥ 3 doses, última > 10 anos** | **Reforço** | **Reforço**; soro/imunoglobulina se imunodeprimido, desnutrido grave ou idoso |

- **IGHAT 250 UI IM** (preferida) ou **SAT 5.000 UI IM**, em local diferente da vacina.
- Vacina: **dT** (ou dTpa) em ≥ 7 anos; **penta/DTP** em < 7 anos.
- **Limpeza e desbridamento** são parte essencial; antibiótico só se infecção ou mordedura ([pele e partes moles](#protocolos?guia=pele-partes-moles)).

## Raiva (esquema do MS, 2022)
- **Lave o ferimento** com água e sabão abundantes. Evite sutura; se inevitável, aproxime e infiltre o soro antes.
- **Vacina:** **4 doses IM nos dias 0, 3, 7 e 14**, ou via **intradérmica** (0,1 mL em 2 locais por visita) nos dias definidos pela nota técnica: **conferir o esquema ID vigente**.
- **Soro antirrábico (SAR) 40 UI/kg** ou **imunoglobulina (IGHAR) 20 UI/kg**, infiltrando o máximo nas lesões; pode ser dado **até o 7º dia** após a 1ª dose da vacina.

| Animal | Acidente leve | Acidente grave |
|---|---|---|
| **Cão/gato sadio e observável** | Observar 10 dias; sem vacina | Observar 10 dias **+ iniciar vacina** (doses dos dias 0 e 3); suspender se animal sadio |
| **Cão/gato suspeito, desaparecido ou morto** | **Vacina (4 doses)** | **Vacina + soro** |
| **Morcego e mamíferos silvestres** (inclusive domiciliados) | **Vacina + soro** | **Vacina + soro** |
| **Herbívoros de produção** | Vacina | Vacina + soro |

- **Grave:** cabeça, face, pescoço, mãos, polpas digitais, pés, mucosas; ferimentos profundos, múltiplos ou extensos; lambedura de mucosa.
- **Leve:** superficial em tronco ou membros (exceto mãos e pés); lambedura de pele lesionada.
- Roedores urbanos e coelhos em geral não exigem profilaxia.
- **Pré-exposição completa:** 2 doses (dias 0 e 3), **sem soro**.

## Hepatite B após acidente com material biológico
| Profissional exposto | Fonte HBsAg+ ou desconhecida de alto risco | Fonte HBsAg negativo |
|---|---|---|
| **Não vacinado** | **Vacina + IGHAHB** | Iniciar vacina |
| **Vacinado, anti-HBs ≥ 10** | Nada | Nada |
| **Não respondedor a 2 esquemas** | **IGHAHB 2 doses** (intervalo de 1 mês) | Nada |
| **Anti-HBs desconhecido** | Dosar anti-HBs; se < 10, vacina + IGHAHB | Dosar e revacinar se < 10 |

- **IGHAHB 0,06 mL/kg IM**, idealmente em **até 48 h** (máximo 7 dias; 14 dias na exposição sexual).
- Avalie também HIV (PEP em até 72 h) e hepatite C; notifique como acidente de trabalho.

**Atenção.** Os esquemas antirrábicos intradérmicos e a disponibilidade de soro variam por região; confirme com a vigilância epidemiológica local e com a nota técnica vigente do MS.`},

{id:'vac-contraindicacoes',title:'Contraindicações, precauções e ESAVI',area:AREA,summary:'Vacinas vivas em imunossuprimidos e gestantes, intervalos entre vacinas, febre, alergia a ovo, eventos adversos e notificação de ESAVI.',
 sources:[['Ministério da Saúde · Vacinação','https://www.gov.br/saude/pt-br/vacinacao'],['SBIm · Calendários de vacinação','https://sbim.org.br/calendarios-de-vacinacao'],['CDC · Immunization Schedules','https://www.cdc.gov/vaccines/hcp/imz-schedules/index.html']],
 body:`## Contraindicações verdadeiras
- **Anafilaxia** a dose anterior da mesma vacina ou a um componente (gelatina, neomicina, PEG, polissorbato, levedura).
- **Vacinas vivas** (BCG, tríplice e tetra viral, varicela, febre amarela, rotavírus, dengue Qdenga, zóster atenuado) em:
  - **Imunossupressão** relevante: imunodeficiência primária, HIV com CD4 baixo (< 200 ou < 15% em crianças), quimioterapia, transplante, biológicos imunossupressores.
  - **Gestação** (ver [vacinação na gestação](#protocolos?guia=vac-gestante)).
- **Rotavírus:** história de invaginação intestinal ou malformação intestinal não corrigida.

## Imunossupressão: quando vacinar
| Situação | Conduta com vacinas vivas |
|---|---|
| **Prednisona ≥ 2 mg/kg/dia ou ≥ 20 mg/dia por ≥ 14 dias** | Aguardar **≥ 1 mês** após suspensão |
| **Quimioterapia** | Aguardar **≥ 3 meses** após o término |
| **Biológicos / anti-CD20** | Intervalos longos (até 6–12 meses para anti-CD20); conferir com o especialista |
| **Antes de iniciar imunossupressão** | Aplicar vivas **≥ 4 semanas antes**; inativadas **≥ 2 semanas antes** |

- Vacinas **inativadas** são seguras no imunossuprimido, mas a resposta pode ser menor. Encaminhe aos **CRIE**.
- Contactantes de imunossuprimidos **devem** ser vacinados (inclusive influenza e SCR).

## Intervalos
- **Inativadas** entre si ou com vivas: sem intervalo, podem ser simultâneas.
- **Duas vivas injetáveis não simultâneas:** intervalo mínimo de **30 dias**.
- **Febre amarela + SCR/tetra viral em < 2 anos:** não aplicar no mesmo dia; **30 dias** de intervalo.
- **Hemoderivados e imunoglobulinas** reduzem a resposta à SCR e varicela: aguardar **3 a 11 meses**, conforme o produto e a dose.

## Precauções e falsas contraindicações
- **Doença febril moderada ou grave:** adiar. Resfriado, diarreia leve e febre baixa **não** contraindicam.
- **Alergia a ovo não contraindica influenza** (quantidade residual mínima), nem a tríplice viral. Na **febre amarela**, anafilaxia a ovo pede avaliação e aplicação em ambiente preparado (CRIE).
- Uso de antibiótico, prematuridade (vacinar pela idade cronológica), amamentação, história familiar de eventos adversos e alergias não relacionadas **não** contraindicam.
- **Síndrome de Guillain-Barré** até 6 semanas após dose prévia de influenza: precaução.

## Eventos adversos (ESAVI)
- **Locais** (dor, edema) e **febre** são os mais comuns; tratar com analgésico/antitérmico, sem profilaxia de rotina.
- **Anafilaxia:** rara, em geral nos primeiros 15–30 min. Observe **15 min** após a vacina (30 min se história de alergia grave). Tratamento: **adrenalina IM** ([anafilaxia](#protocolos?guia=anafilaxia)).
- **Síncope** em adolescentes: vacinar sentado ou deitado.
- **Febre amarela:** doença viscerotrópica e neurotrópica (raras, mais em idosos e primovacinados).
- **Notificação:** todo ESAVI **grave** ou inusitado deve ser notificado em **até 24 h** no **e-SUS Notifica** (módulo ESAVI); erros de imunização também são notificados.

**Atenção.** Na dúvida entre contraindicação e precaução, não perca a oportunidade de vacinar sem avaliação: discuta com o CRIE e registre a decisão.`},
];
