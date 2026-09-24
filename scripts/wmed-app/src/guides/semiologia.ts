// Semiologia (adultos). RASCUNHO WMed de 24/09/2026 escrito com apoio de IA:
// exige revisão médica antes da liberação ampla.
import type {Guide} from './types';

const AREA='Semiologia';
export const SEMIOLOGIA:Guide[]=[
{id:'semio-anamnese-geral',title:'Anamnese e exame físico geral',area:AREA,summary:'Estrutura da anamnese, sinais vitais e valores de referência, ectoscopia, estado geral, hidratação e graduação do edema.',
 sources:[['NCBI Bookshelf · Clinical Methods: The History, Physical, and Laboratory Examinations','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['Stanford Medicine 25 · Bedside exam','https://stanfordmedicine25.stanford.edu/']],
 body:`## Estrutura da anamnese
1. **Identificação:** nome, idade, sexo, cor, estado civil, profissão, naturalidade, procedência, religião.
2. **Queixa principal (QP):** nas palavras do paciente, com duração ("dor no peito há 2 dias").
3. **História da doença atual (HDA):** início, localização, irradiação, caráter, intensidade, duração, frequência, fatores de melhora e piora, sintomas associados e evolução.
4. **Interrogatório sintomatológico (revisão de sistemas):** sistema por sistema, para captar o que a HDA não trouxe.
5. **Antecedentes pessoais:** fisiológicos (gestação, parto, desenvolvimento) e patológicos (doenças, cirurgias, internações, alergias, medicações em uso, vacinas).
6. **Antecedentes familiares:** doenças com carga hereditária (DAC precoce, neoplasias, diabetes).
7. **Hábitos de vida:** tabagismo (carga tabágica em maços-ano, [calcular](#scores?id=maco)), etilismo ([CAGE](#scores?id=cage), [AUDIT-C](#scores?id=audit-c)), drogas, atividade física, alimentação, sexualidade.
8. **Condições socioeconômicas e ambientais:** moradia, saneamento, animais, viagens.

## Sinais vitais em adultos
| Parâmetro | Referência em repouso | Observações |
|---|---|---|
| **PA** | < 120/80 mmHg ótima; ≥ 140/90 hipertensão (consultório) | Manguito adequado ao braço; medir nos dois braços na 1ª consulta. [PAM](#scores?id=pam) |
| **FC** | 60–100 bpm | < 60 bradicardia; > 100 taquicardia; avaliar ritmo e amplitude |
| **FR** | 12–20 irpm | Contar 30–60 s sem o paciente perceber |
| **Temperatura axilar** | 35,5–37,0 °C | ≥ 37,8 °C febre (axilar); retal ~0,5 °C maior |
| **SatO₂** | ≥ 95% em ar ambiente | Alvo 88–92% no retentor de CO₂; falha com má perfusão e esmalte |
| **Dor** | Escala numérica 0–10 | Considerada o "5º sinal vital" |

Para somar os sinais em risco de deterioração, veja [NEWS 2](#scores?id=news2) e [qSOFA](#scores?id=qsofa).

## Ectoscopia (exame físico geral)
- **Estado geral:** bom, regular ou mau (BEG, REG, MEG); impressão global, ainda que subjetiva.
- **Nível de consciência e orientação** (tempo, espaço, pessoa); ver [ECG](#scores?id=glasgow).
- **Fácies:** hipocrática, cushingoide, mixedematosa, basedowiana, mitral, leonina, parkinsoniana.
- **Biotipo e estado nutricional:** peso, altura, [IMC](#scores?id=bmi).
- **Mucosas:** coradas ou hipocoradas (+ a 4+/4+), úmidas ou secas.
- **Icterícia** (melhor vista na esclera, geralmente com bilirrubina > 2,5–3 mg/dL), **cianose** (central ou periférica), **anictérico, acianótico, afebril**.
- **Postura, marcha, atitude** (ortopneica, genupeitoral, antálgica).
- **Linfonodos:** tamanho, consistência, mobilidade, dor; supraclavicular esquerdo (**Virchow**) sugere neoplasia abdominal.

## Hidratação
- Sinais de desidratação: mucosas secas, **turgor e elasticidade** reduzidos, olhos encovados, oligúria, taquicardia, **hipotensão postural** (queda de PAS ≥ 20 ou aumento de FC ≥ 30 ao ficar de pé).
- **Tempo de enchimento capilar** > 3 s sugere má perfusão, mas depende da temperatura ambiente e da luz.
- Turgor é pouco confiável no idoso (perda de elasticidade da pele). Mucosa oral seca e axila seca têm acurácia apenas moderada para hipovolemia.

## Edema e cacifo
- Pesquisar em áreas de declive: dorso do pé, região pré-tibial, sacral no acamado.
- **Sinal do cacifo (Godet):** pressão digital por ~5 s deixa depressão.

| Grau | Profundidade aproximada |
|---|---|
| 1+ | até 2 mm, some rápido |
| 2+ | 2–4 mm |
| 3+ | 4–6 mm |
| 4+ | > 6 mm, persiste por minutos |

- Descrever: localização, simetria, consistência (mole ou duro), temperatura, sensibilidade e cor. Edema **sem cacifo** sugere linfedema ou mixedema. Assimetria de membro inferior levanta TVP ([Wells TVP](#scores?id=wells-tvp)).

**Atenção.** Referências de sinais vitais variam com idade, condicionamento e contexto; interprete sempre a tendência e o quadro clínico, não o número isolado.`},

{id:'semio-cardiovascular',title:'Exame cardiovascular',area:AREA,summary:'Ictus, bulhas B1 a B4, sopros clássicos com foco, fase, irradiação e manobras, pulso paradoxal e turgência jugular.',
 sources:[['NCBI Bookshelf · Clinical Methods: Heart Sounds and Murmurs','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['Stanford Medicine 25','https://stanfordmedicine25.stanford.edu/'],['JAMA · The Rational Clinical Examination','https://jamanetwork.com/collections/6257/the-rational-clinical-examination']],
 body:`## Inspeção e palpação
- **Ictus cordis:** normalmente no **5º espaço intercostal esquerdo, na linha hemiclavicular**, ocupando 1–2 polpas digitais.
- Desviado para baixo e para a esquerda e **difuso** (≥ 3 polpas): dilatação do VE (cardiomiopatia dilatada, insuficiência aórtica ou mitral).
- **Propulsivo e sustentado**, pouco desviado: hipertrofia concêntrica (estenose aórtica, hipertensão).
- **Frêmito** (sopro palpável) significa sopro de grau ≥ 4/6. Pulsação paraesternal esquerda sugere sobrecarga do VD.

## Bulhas cardíacas
| Bulha | Origem | Significado |
|---|---|---|
| **B1** | Fechamento de mitral e tricúspide | Hiperfonética na estenose mitral; hipofonética na IM grave e no BAV 1º grau |
| **B2** | Fechamento de aórtica e pulmonar | Desdobramento **fisiológico** na inspiração; **fixo** na CIA; **paradoxal** no BRE e na EAo grave; P2 hiperfonética na hipertensão pulmonar |
| **B3** | Enchimento ventricular rápido (protodiástole) | Normal em jovens e gestantes; em adultos sugere **disfunção sistólica ou sobrecarga de volume** (IC) |
| **B4** | Contração atrial contra ventrículo rígido (pré-sístole) | Hipertrofia, isquemia, HAS; **ausente na fibrilação atrial** |

Ritmo de galope = B3 ou B4 com taquicardia. B3 tem boa especificidade para disfunção do VE, mas baixa sensibilidade e grande variação entre examinadores.

## Sopros clássicos
| Lesão | Foco | Fase | Característica | Irradiação | Manobras |
|---|---|---|---|---|---|
| **Estenose aórtica** | Aórtico (2º EICD) | Sistólico, ejetivo (em diamante) | Rude; pulso **parvus et tardus**; B2 hipofonética | **Carótidas** e ápice (fenômeno de Gallavardin) | Diminui com Valsalva e ao ficar de pé |
| **Insuficiência mitral** | Mitral (ápice) | **Holossistólico** | Em platô, "em jato de vapor" | **Axila** | Aumenta com handgrip; diminui com Valsalva |
| **Estenose mitral** | Mitral (ápice) | **Diastólico** (ruflar) | B1 hiperfonética, **estalido de abertura**, reforço pré-sistólico se ritmo sinusal | Pouca ou nenhuma | Melhor em **decúbito lateral esquerdo**, com a campânula |
| **Insuficiência aórtica** | Aórtico acessório (3º EIC esq.) | **Diastólico**, aspirativo, decrescente | Pulso em martelo d'água; PA divergente | Borda esternal esquerda até o ápice | Melhor com paciente **sentado, inclinado para frente**, em expiração; aumenta com handgrip |

- Graduação de **Levine** (1 a 6/6): 4/6 já tem frêmito; 6/6 é audível sem encostar o estetoscópio.
- **Manobras gerais:** a inspiração aumenta sopros de câmaras direitas (**Rivero-Carvallo**); o Valsalva e ficar de pé diminuem quase todos os sopros, **exceto** cardiomiopatia hipertrófica e prolapso mitral, que aumentam.

## Pulso paradoxal
- Queda da **PAS > 10 mmHg na inspiração**. Medir com esfigmomanômetro: note a PAS em que os sons aparecem só na expiração e a PAS em que aparecem em todo o ciclo.
- Causas: **tamponamento cardíaco**, asma grave, DPOC exacerbada, TEP maciço, pericardite constritiva (menos comum).
- Tríade de **Beck** no tamponamento: hipotensão, turgência jugular e abafamento de bulhas.

## Turgência jugular
- Paciente a **45°**, cabeça levemente virada para a esquerda; avaliar a **jugular interna direita**.
- Pressão venosa jugular > 3–4 cm acima do ângulo esternal (≈ PVC > 8 cm H₂O) é elevada.
- **Refluxo hepatojugular** positivo: elevação sustentada ≥ 3 cm durante 10 s de compressão abdominal (IC direita ou sobrecarga de volume).
- **Sinal de Kussmaul:** aumento paradoxal da PVJ na inspiração (pericardite constritiva, infarto de VD).

**Atenção.** O exame cardíaco tem sensibilidade limitada e variação entre examinadores; sopro novo, sintomas ou suspeita de valvopatia significativa pedem ecocardiograma.`},

{id:'semio-respiratorio',title:'Exame respiratório',area:AREA,summary:'Inspeção, expansibilidade, frêmito toracovocal, percussão e ausculta, com tabela comparativa das síndromes pleuropulmonares.',
 sources:[['NCBI Bookshelf · Clinical Methods: The History, Physical, and Laboratory Examinations','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['JAMA · The Rational Clinical Examination','https://jamanetwork.com/collections/6257/the-rational-clinical-examination']],
 body:`## Inspeção
- **Estática:** forma do tórax (em tonel no enfisema, pectus excavatum ou carinatum, cifoescoliose), cicatrizes, abaulamentos, circulação colateral.
- **Dinâmica:** frequência, ritmo, amplitude, uso de musculatura acessória, **tiragem** intercostal, batimento de asa de nariz, respiração paradoxal abdominal (fadiga diafragmática).
- **Baqueteamento digital:** neoplasia pulmonar, bronquiectasia, fibrose, cardiopatia cianótica; não é típico de DPOC isolada.

## Palpação
- **Expansibilidade:** mãos nos ápices e nas bases; assimetria indica lesão do lado que expande menos.
- **Frêmito toracovocal (FTV):** paciente fala "trinta e três"; a vibração é **aumentada na consolidação** (meio sólido conduz melhor) e **diminuída** quando há ar ou líquido entre pulmão e parede (derrame, pneumotórax) ou brônquio obstruído.

## Percussão
- **Som claro pulmonar:** normal.
- **Macicez/submacicez:** consolidação, derrame, atelectasia, massa.
- **Hipersonoridade/timpanismo:** pneumotórax, enfisema.
- Na hiperinsuflação, a macicez hepática desce e a cardíaca desaparece.

## Ausculta
- **Murmúrio vesicular (MV):** som normal. Diminuído em derrame, pneumotórax, enfisema, obesidade.
- **Ruídos adventícios:**
  - **Estertores finos (crepitantes):** tele-inspiratórios, não mudam com tosse; edema pulmonar, fibrose, pneumonia.
  - **Estertores grossos (bolhosos):** início da inspiração e expiração, mudam com tosse; secreção em vias maiores.
  - **Sibilos:** contínuos, agudos, obstrução de via aérea (asma, DPOC, IC).
  - **Roncos:** contínuos, graves, secreção em grandes brônquios.
  - **Estridor:** inspiratório, obstrução alta (laringe, traqueia); é emergência.
  - **Atrito pleural:** em "couro novo", nas duas fases, não muda com tosse.
- **Ressonância vocal:** **broncofonia, pectorilóquia** (fônica ou áfona) e **egofonia** (voz "de cabra", comum no limite superior de derrame e na consolidação).
- **Sopro tubário:** som brônquico na periferia, típico de consolidação com brônquio pérvio.

## Síndromes pleuropulmonares
| Síndrome | Expansibilidade | FTV | Percussão | MV | Outros |
|---|---|---|---|---|---|
| **Consolidação** | Diminuída localmente | **Aumentado** | Maciço/submaciço | Diminuído, com **sopro tubário** | Estertores finos, broncofonia, pectorilóquia |
| **Derrame pleural** | Diminuída | **Diminuído ou abolido** | **Maciço**, com sinal de Signorelli | Abolido | Egofonia no limite superior; desvio do mediastino **contralateral** se volumoso |
| **Pneumotórax** | Diminuída | **Diminuído ou abolido** | **Hipersonoro/timpânico** | Abolido | Hipertensivo: desvio de traqueia contralateral, hipotensão e turgência jugular |
| **Atelectasia** | Diminuída | Diminuído ou abolido (brônquio obstruído) | Maciço | Abolido | Desvio do mediastino **para o mesmo lado** (retração) |
| **Hiperinsuflação (enfisema)** | Diminuída, **bilateral** | Diminuído bilateralmente | **Hipersonoro** | Diminuído difusamente | Tórax em tonel, expiração prolongada, bulhas hipofonéticas |

## Acurácia
- Nenhum achado isolado confirma ou exclui pneumonia; a combinação de sinais vitais normais e ausculta normal reduz bastante a probabilidade.
- A percussão maciça é o achado mais útil para derrame pleural; ausculta normal não exclui pneumotórax pequeno.
- Para gravidade da pneumonia, veja [CURB-65](#scores?id=curb65) e o guia [PAC](#protocolos?guia=pac).

**Atenção.** O exame respiratório é pouco sensível para lesões pequenas; confirme com radiografia, ultrassom pleural ou TC conforme a suspeita clínica.`},

{id:'semio-abdome',title:'Exame abdominal',area:AREA,summary:'Sequência inspeção, ausculta, percussão e palpação, e os sinais clássicos de Murphy, Blumberg, Rovsing, Giordano, ascite e Courvoisier.',
 sources:[['NCBI Bookshelf · Clinical Methods: The History, Physical, and Laboratory Examinations','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['JAMA · The Rational Clinical Examination','https://jamanetwork.com/collections/6257/the-rational-clinical-examination']],
 body:`## Sequência do exame
No abdome, a ordem muda: **inspeção → ausculta → percussão → palpação**. A ausculta vem antes porque percussão e palpação podem alterar os ruídos hidroaéreos. Paciente em decúbito dorsal, joelhos levemente fletidos, bexiga vazia; comece a palpação **longe da área dolorosa**.

## Inspeção
- Forma: plano, globoso, escavado, em avental, **em batráquio** (ascite).
- Cicatrizes, hérnias (pedir para tossir ou elevar a cabeça), diástase de retos.
- **Circulação colateral:** tipo porta (cabeça de medusa, fluxo centrífugo a partir do umbigo) ou tipo cava inferior (fluxo ascendente em flancos).
- Equimoses: **Cullen** (periumbilical) e **Grey Turner** (flancos), em hemorragia retroperitoneal, como pancreatite necro-hemorrágica.
- Peristaltismo visível: obstrução intestinal.

## Ausculta
- **Ruídos hidroaéreos (RHA):** presentes e normais, aumentados (diarreia, início de obstrução, com timbre metálico na obstrução mecânica) ou diminuídos/ausentes (íleo paralítico, peritonite). Ouvir ao menos 1–2 min antes de declarar ausência.
- **Sopros:** aórtico (aneurisma), renal (estenose de artéria renal, paraumbilical).

## Percussão
- Timpanismo predominante é normal.
- **Hepatimetria:** 6–12 cm na linha hemiclavicular direita.
- **Espaço de Traube** (semilunar): timpânico normalmente; maciço na esplenomegalia ou derrame pleural esquerdo.
- **Sinal de Jobert:** timpanismo sobre a área hepática sugere pneumoperitônio.

## Palpação
- **Superficial:** tensão, dor, defesa, massas superficiais.
- **Profunda:** órgãos e massas. Fígado palpado na inspiração profunda (borda, consistência, superfície). Baço palpável em geral significa esplenomegalia.

## Sinais clássicos
| Sinal | Como pesquisar | Significado |
|---|---|---|
| **Murphy** | Palpar o ponto cístico e pedir inspiração profunda; o paciente interrompe a inspiração por dor | **Colecistite aguda**; sensibilidade ~60–65%, menor no idoso |
| **Blumberg** | Compressão lenta e descompressão brusca no ponto de McBurney com dor à descompressão | Irritação peritoneal (apendicite) |
| **Rovsing** | Compressão da fossa ilíaca esquerda provoca dor na direita | Apendicite |
| **Psoas / obturador** | Extensão do quadril direito / rotação interna da coxa fletida | Apendicite retrocecal / pélvica |
| **Giordano** | Punho-percussão da região lombar com dor | Pielonefrite, litíase renal |
| **Piparote** | Peteleco em um flanco, com a mão de um auxiliar na linha média, transmite onda ao outro | **Ascite volumosa** |
| **Macicez móvel** | Macicez em flanco que muda para timpanismo ao lateralizar o paciente | Ascite; mais sensível que o piparote |
| **Courvoisier-Terrier** | **Vesícula palpável e indolor** em paciente ictérico | Obstrução biliar maligna (tumor periampular, cabeça de pâncreas) |

## Acurácia
- A macicez em flancos é sensível para ascite (ausência reduz bastante a probabilidade); o piparote é mais específico, porém só aparece em grandes volumes.
- Nenhum sinal isolado confirma apendicite; combine com o [escore de Alvarado](#scores?id=alvarado) e imagem.
- Dor abdominal com febre e sinais de peritonite: veja o guia [infecção intra-abdominal](#protocolos?guia=intra-abdominal).

**Atenção.** Idosos, imunossuprimidos e usuários de corticoide podem ter abdome agudo com poucos sinais peritoneais; a ausência de sinais não exclui gravidade.`},

{id:'semio-neurologico',title:'Exame neurológico',area:AREA,summary:'Consciência, pares cranianos, força MRC 0 a 5, reflexos, sensibilidade, coordenação, sinais meníngeos e padrões piramidal, extrapiramidal e de neurônio motor inferior.',
 sources:[['NCBI Bookshelf · Clinical Methods: The History, Physical, and Laboratory Examinations','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['Stanford Medicine 25','https://stanfordmedicine25.stanford.edu/']],
 body:`## Consciência e funções corticais
- **Nível:** alerta, sonolento, torporoso, comatoso; quantificar com a [Escala de Coma de Glasgow](#scores?id=glasgow).
- **Conteúdo:** orientação, atenção, memória, linguagem (afasia de expressão ou compreensão), praxias, gnosias.

## Pares cranianos
| Par | Função | Como testar |
|---|---|---|
| I Olfatório | Olfato | Odores conhecidos, cada narina |
| II Óptico | Visão | Acuidade, campos visuais, fundo de olho, reflexo fotomotor (aferência) |
| III Oculomotor | Maioria dos movimentos oculares, pálpebra, pupila | Lesão: ptose, olho "para baixo e para fora", **midríase** |
| IV Troclear | Oblíquo superior | Dificuldade de olhar para baixo e para dentro (descer escadas) |
| V Trigêmeo | Sensibilidade da face, mastigação | Sensibilidade nos 3 ramos, reflexo corneano (aferência), masseteres |
| VI Abducente | Reto lateral | Não abduz o olho, diplopia horizontal |
| VII Facial | Mímica facial, gustação 2/3 anteriores | **Periférica:** toda a hemiface; **central:** poupa a testa |
| VIII Vestibulococlear | Audição e equilíbrio | Weber, Rinne, nistagmo, head impulse |
| IX e X Glossofaríngeo e vago | Palato, deglutição, voz | Úvula desvia para o lado **são**; reflexo nauseoso |
| XI Acessório | Esternocleidomastóideo e trapézio | Rotação da cabeça, elevação dos ombros |
| XII Hipoglosso | Língua | Língua desvia para o lado **lesado** |

## Força muscular (escala MRC)
| Grau | Achado |
|---|---|
| 0 | Sem contração |
| 1 | Contração visível ou palpável, sem movimento |
| 2 | Movimento sem vencer a gravidade |
| 3 | Vence a gravidade, não vence resistência |
| 4 | Vence alguma resistência |
| 5 | Força normal |

Manobras deficitárias: **Mingazzini** e **braços estendidos** (queda ou pronação sugerem paresia sutil).

## Reflexos
- Profundos (bicipital, tricipital, estilorradial, patelar, aquileu), graduados de **0 a 4+**: 0 ausente; 1+ diminuído; **2+ normal**; 3+ vivo, com difusão; 4+ com **clônus**.
- **Babinski:** extensão do hálux ao estímulo plantar lateral; indica lesão do trato piramidal (normal até ~1–2 anos).

## Sensibilidade e coordenação
- Superficial (tátil, dolorosa, térmica) e profunda (vibratória com diapasão de 128 Hz, posição segmentar).
- **Romberg:** queda com olhos fechados indica ataxia **sensitiva** (proprioceptiva); na ataxia cerebelar o paciente já é instável com olhos abertos.
- Coordenação: índex-nariz, calcanhar-joelho, diadococinesia, marcha em tandem.

## Sinais meníngeos
- **Rigidez de nuca:** resistência à flexão passiva do pescoço.
- **Kernig:** com quadril fletido a 90°, dor ou resistência à extensão do joelho.
- **Brudzinski:** flexão passiva do pescoço provoca flexão de quadris e joelhos.
- Os três têm **baixa sensibilidade** (Kernig e Brudzinski em torno de 5–10% em algumas séries); ausência não exclui meningite. Ver [meningite](#protocolos?guia=meningite).

## Padrões de lesão motora
| Característica | Piramidal (neurônio motor superior) | Neurônio motor inferior | Extrapiramidal |
|---|---|---|---|
| Tônus | **Espasticidade** (canivete) | **Flacidez** | **Rigidez** (plástica, em roda denteada) |
| Reflexos | **Aumentados**, clônus | **Diminuídos ou abolidos** | Normais |
| Babinski | Presente | Ausente | Ausente |
| Trofismo | Preservado (atrofia tardia por desuso) | **Atrofia** precoce, **fasciculações** | Preservado |
| Outros | Fraqueza em padrão (predomínio extensor no MS, flexor no MI) | Fraqueza segmentar ou focal | **Bradicinesia**, tremor de repouso, instabilidade postural |

Na fase aguda de AVC ou trauma medular, a lesão piramidal pode cursar com flacidez e arreflexia (choque). Para AVC, use o [NIHSS](#scores?id=nihss-completo) e o guia [AVC isquêmico](#protocolos?guia=avc-isquemico).

**Atenção.** Déficit neurológico focal de início súbito é emergência: registre o horário do último momento visto bem e acione o protocolo de AVC sem esperar o exame completo.`},

{id:'semio-osteoarticular',title:'Exame osteoarticular',area:AREA,summary:'Manobras especiais de joelho, ombro, coluna e punho, com o que cada uma sugere e seus limites de acurácia.',
 sources:[['NCBI Bookshelf · Clinical Methods: The History, Physical, and Laboratory Examinations','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['JAMA · The Rational Clinical Examination','https://jamanetwork.com/collections/6257/the-rational-clinical-examination']],
 body:`## Roteiro geral
- **Inspeção:** deformidades, edema, eritema, atrofia, postura, marcha.
- **Palpação:** calor, dor em pontos específicos, derrame articular, crepitação.
- **Mobilidade:** ativa e passiva; limitação ativa com passiva preservada sugere lesão muscular ou tendínea, e ambas limitadas sugerem lesão articular.
- **Força, reflexos e sensibilidade** do segmento; depois, **manobras especiais**.
- Monoartrite aguda quente: pensar em artrite séptica ou gota, com artrocentese.

## Joelho
| Manobra | Técnica | Sugere |
|---|---|---|
| **Gaveta anterior** | Joelho a 90°, tração anterior da tíbia | Lesão do **LCA** |
| **Lachman** | Joelho a 20–30°, tração anterior da tíbia estabilizando o fêmur | Lesão do **LCA**; é o teste mais sensível (~85%) |
| **Gaveta posterior** | Joelho a 90°, empurrar a tíbia para trás | Lesão do **LCP** |
| **McMurray** | Flexão máxima, rotação da tíbia e extensão; estalido ou dor na interlinha | Lesão **meniscal**; sensibilidade modesta, especificidade maior |
| **Estresse em valgo/varo** | A 0° e 30° de flexão | Ligamento colateral medial / lateral |
| **Tecla patelar (rechaço)** | Compressão da patela com esvaziamento da bolsa suprapatelar | Derrame articular |

## Ombro
| Manobra | Técnica | Sugere |
|---|---|---|
| **Neer** | Elevação passiva do braço em rotação interna com escápula estabilizada | **Impacto subacromial** |
| **Hawkins-Kennedy** | Ombro e cotovelo a 90°, rotação interna forçada | Impacto subacromial (sensível, pouco específico) |
| **Jobe** | Braços a 90° de abdução, 30° anteriores, polegares para baixo, contra resistência | **Supraespinal** |
| **Patte / Gerber** | Rotação externa contra resistência / afastar o dorso da mão das costas | Infraespinal / subescapular |
| **Braço caído (drop arm)** | Paciente não sustenta a descida lenta do braço abduzido | Ruptura extensa do manguito |

## Coluna
- **Lasègue** (elevação da perna estendida): dor irradiada abaixo do joelho entre **30° e 70°** sugere radiculopatia L5 ou S1 por hérnia discal. Sensível (~90%), pouco específico.
- **Lasègue cruzado:** dor no lado afetado ao elevar a perna sadia; pouco sensível, mas **muito específico**.
- **Sinais de alarme** (red flags) na lombalgia: idade > 50 anos, câncer prévio, febre, perda de peso, trauma importante, déficit neurológico progressivo, **retenção urinária ou anestesia em sela** (síndrome da cauda equina).
- Schober: avalia mobilidade lombar (espondiloartrites).

## Punho e mão
- **Phalen:** flexão máxima dos punhos por 60 s reproduz parestesia no território do mediano.
- **Tinel:** percussão sobre o túnel do carpo reproduz choque ou parestesia.
- Ambos sugerem **síndrome do túnel do carpo**, mas têm sensibilidade e especificidade apenas moderadas; hipoestesia no território do mediano e fraqueza de abdução do polegar ajudam mais. A eletroneuromiografia confirma.
- **Finkelstein:** desvio ulnar com o polegar fechado na mão provoca dor na tenossinovite de **De Quervain**.

## Acurácia
- A maioria das manobras tem valor maior quando combinada à história (mecanismo do trauma, estalido, falseio).
- Dor e espasmo na fase aguda reduzem a acurácia; reavaliar em alguns dias é aceitável fora de emergência.
- Trauma de tornozelo: use as [regras de Ottawa](#scores?id=ottawa-tornozelo) para decidir radiografia.

**Atenção.** Manobras especiais orientam, mas não substituem imagem; déficit neurológico progressivo ou suspeita de cauda equina exigem avaliação urgente.`},

{id:'semio-sinais-eponimos',title:'Sinais e epônimos clássicos',area:AREA,summary:'Tabela de sinais cobrados em prova com o achado e o significado clínico, incluindo sinais de insuficiência aórtica e padrões respiratórios.',
 sources:[['NCBI Bookshelf · Clinical Methods: The History, Physical, and Laboratory Examinations','https://www.ncbi.nlm.nih.gov/books/NBK201/'],['Stanford Medicine 25','https://stanfordmedicine25.stanford.edu/'],['JAMA · The Rational Clinical Examination','https://jamanetwork.com/collections/6257/the-rational-clinical-examination']],
 body:`## Metabólicos e respiratórios
| Sinal | Achado | Significado |
|---|---|---|
| **Trousseau** | Espasmo carpal (mão de parteiro) após insuflar o manguito acima da PAS por 3 min | **Hipocalcemia**; mais específico que Chvostek |
| **Chvostek** | Contração da musculatura facial ao percutir o nervo facial à frente do trago | Hipocalcemia; presente em até ~10–25% de pessoas normais |
| **Respiração de Kussmaul** | Respiração profunda e rápida, regular | **Acidose metabólica** (cetoacidose, uremia); ver [CAD](#protocolos?guia=cad) |
| **Cheyne-Stokes** | Ciclos de aumento e redução da amplitude intercalados com apneia | IC grave, lesão neurológica, altitude |
| **Biot** | Respiração irregular com apneias sem padrão | Lesão de tronco (bulbo), hipertensão intracraniana |
| **Kussmaul venoso** | Turgência jugular que aumenta na inspiração | Pericardite constritiva, infarto de VD |

## Abdominais e de dor referida
| Sinal | Achado | Significado |
|---|---|---|
| **Cullen** | Equimose periumbilical | Hemorragia retroperitoneal ou intraperitoneal (pancreatite necro-hemorrágica, gestação ectópica rota) |
| **Grey Turner** | Equimose em flancos | Hemorragia retroperitoneal (pancreatite grave) |
| **Kehr** | Dor referida no ombro esquerdo | Irritação diafragmática por sangue (**ruptura esplênica**) |
| **Courvoisier-Terrier** | Vesícula palpável e indolor com icterícia | Obstrução biliar maligna |
| **Murphy** | Parada da inspiração à palpação do ponto cístico | Colecistite aguda |

## Neurológicos
| Sinal | Achado | Significado |
|---|---|---|
| **Babinski** | Extensão do hálux ao estímulo plantar | Lesão do trato piramidal |
| **Lhermitte** | Choque elétrico descendo pela coluna à flexão do pescoço | Lesão da coluna posterior cervical (**esclerose múltipla**, mielopatia, deficiência de B12) |
| **Hoover** | Ausência de pressão do calcanhar sadio no leito quando se pede para elevar a perna "fraca"; a força retorna na perna "fraca" quando se pede extensão do quadril contralateral | Sugere **fraqueza funcional** (não orgânica) |
| **Romberg** | Queda com olhos fechados | Ataxia sensitiva (proprioceptiva) |

## Cardiovasculares
| Sinal | Achado | Significado |
|---|---|---|
| **Levine** | Punho cerrado sobre o esterno ao descrever a dor | Dor anginosa; baixo valor preditivo isolado |
| **Homans** | Dor na panturrilha à dorsiflexão do pé | Historicamente associado a TVP; **baixa acurácia**, não use isolado; prefira [Wells TVP](#scores?id=wells-tvp) e duplex |
| **De Musset** | Oscilação da cabeça a cada batimento | **Insuficiência aórtica** |
| **Quincke** | Pulsação capilar no leito ungueal à leve compressão | Insuficiência aórtica |
| **Traube** | Som em "tiro de pistola" sobre a artéria femoral | Insuficiência aórtica |
| **Duroziez** | Sopro sistólico e diastólico na femoral ao comprimi-la com o estetoscópio | Insuficiência aórtica |
| **Corrigan** | Pulso em martelo d'água, amplo e de colapso rápido | Insuficiência aórtica |
| **Müller** | Pulsação da úvula | Insuficiência aórtica |
| **Beck (tríade)** | Hipotensão, turgência jugular, bulhas abafadas | Tamponamento cardíaco |

## Como usar em prova e na prática
- Os sinais periféricos de insuficiência aórtica refletem **PA divergente** (pressão de pulso alargada) e aparecem na IAo **crônica e grave**; na IAo aguda costumam estar ausentes.
- Muitos epônimos têm acurácia modesta ou pouco estudada; valem como pistas que orientam o exame complementar.

**Atenção.** Epônimos ajudam a lembrar associações, mas o diagnóstico depende do conjunto clínico; sinais com baixa acurácia, como Homans, nunca devem decidir conduta sozinhos.`},
];
