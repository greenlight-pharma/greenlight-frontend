// Banco de Questões - Residência Médica USP/FUVEST 2026 - Prova AD1
// Áreas Básicas e Acesso Direto

const QUESTOES = [
  // ==================== CLÍNICA MÉDICA (1-24) ====================
  {
    n: 1,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Pneumologia/POCUS",
    subtemas: ["DPOC", "Ultrassom point-of-care", "Asma"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 52 anos, mecânico, com HAS, DM2 e asma. Dispneia progressiva há 2 semanas. Edema perimaleolar frequente, ronco noturno, sonolência diurna. Nega ortopneia, DPN, viagem ou imobilização. IMC 32,3 kg/m². MV reduzidos universalmente, sibilos expiratórios ocasionais. Bulhas hipofonéticas. POCUS: cardíaco sem alterações relevantes, pulmonar com padrão A (deslizamento pleural normal), VCI colabável >50%, sistema venoso femoral e poplíteo compressíveis bilateralmente. Qual a conduta medicamentosa mais adequada?",
    alternativas: {
      A: "Furosemida.",
      B: "Azitromicina.",
      C: "Rivaroxabana.",
      D: "Formoterol/budesonida."
    },
    gabarito: "D",
    explicacao: "O POCUS afasta IC (cardio normal, VCI colabável, pulmão sem linhas B), TVP (veias compressíveis) e pneumonia. Paciente asmático, obeso, com sibilos e dispneia ao esforço - exacerbação de asma. Tratamento de manutenção com LABA+CI (formoterol/budesonida) é a conduta. Edema perimaleolar bilateral em obeso pode ser por estase venosa/insuficiência venosa crônica, não necessariamente IC."
  },
  {
    n: 2,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Nefrologia",
    subtemas: ["Hiponatremia", "Distúrbios hidroeletrolíticos", "GECA"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 28 anos, diarreia aquosa há 4 dias com febre baixa, 6 episódios/dia, cólicas, náuseas. Filho de 4 anos com mesmos sintomas. Mucosas secas. Na+: 128 mEq/L, K+: 3,7, HCO3-: 29. Qual o mecanismo fisiopatológico da hiponatremia?",
    alternativas: {
      A: "Secreção inapropriada de ADH.",
      B: "Liberação de peptídeo natriurético.",
      C: "Elevação de aldosterona.",
      D: "Perda fecal de potássio."
    },
    gabarito: "A",
    explicacao: "Hiponatremia hipovolêmica por gastroenterite. A depleção volêmica é um estímulo NÃO-OSMÓTICO potente para liberação de ADH, levando a retenção de água livre e hiponatremia. Aldosterona elevada na hipovolemia retém Na+ (não causa hipoNa). Peptídeo natriurético está suprimido na hipovolemia. Perda fecal de K+ não explica hipoNa."
  },
  {
    n: 3,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Gastroenterologia",
    subtemas: ["Cirrose", "Varizes esofágicas", "Profilaxia HDA"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 53 anos, esquistossomose hepatoesplênica. Edema perimaleolar novo. Episódios prévios de encefalopatia. PA 154x86, plaquetas 98 mil, albumina 3,1, INR 1,8, Cr 1,37, Na 130. EDA: 2 varizes esofágicas de grosso calibre sem sangramento recente. USG: pequena ascite, esplenomegalia. Melhor conduta?",
    alternativas: {
      A: "Infundir albumina.",
      B: "Introduzir carvedilol.",
      C: "Indicar paracentese.",
      D: "Restringir água diária."
    },
    gabarito: "B",
    explicacao: "Varizes esofágicas de grosso calibre = indicação de profilaxia primária de sangramento. O carvedilol (betabloqueador não-seletivo) é a primeira escolha atual, reduzindo pressão portal. Ascite pequena não requer paracentese. Albumina sem indicação (sem PBE, sem síndrome hepatorrenal). Restrição hídrica só se Na<125 ou sintomático."
  },
  {
    n: 4,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Cardiologia",
    subtemas: ["Insuficiência cardíaca", "Cardiomiopatias", "Hemocromatose"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 47 anos, síndrome do túnel do carpo unilateral. Dispneia aos médios esforços, ortopneia. Etilismo 8 latas/dia. Refluxo hepatojugular, edema MMII. Hb 10,8, FA 187, GGT 318, saturação transferrina 32%, ferritina 997. ECO: FE 43%, VE dilatado, sem espessamento septal. Diagnóstico?",
    alternativas: {
      A: "Amiloidose subtipo ATTR.",
      B: "Cardiomiopatia alcoólica.",
      C: "Cardiomiopatia cirrótica.",
      D: "Hemocromatose."
    },
    gabarito: "B",
    explicacao: "Cardiomiopatia dilatada (FE 43%, VE aumentado SEM espessamento septal) em etilista pesado = cardiomiopatia alcoólica. Amiloidose ATTR cursa com espessamento septal e túnel do carpo, mas aqui não há hipertrofia. Hemocromatose teria saturação de transferrina >45% e ferritina muito elevada. FA/GGT elevadas refletem hepatopatia alcoólica."
  },
  {
    n: 5,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Dermatologia/Geriatria",
    subtemas: ["Prurido", "Xerose senil"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 58 anos, prurido cutâneo intenso há 7 meses, sem lesões primárias, com piora progressiva. HAS, DM2, dislipidemia. Usa HCTZ, metformina, dapagliflozina, sinvastatina, tramadol. Pele com xerose leve e escoriações. Exames laboratoriais normais. Conduta?",
    alternativas: {
      A: "Hidratar a pele e usar corticoide tópico nas lesões.",
      B: "Substituir o tramadol por analgésicos simples orais.",
      C: "Prescrever gabapentina ou pregabalina orais.",
      D: "Prescrever anti-histamínico oral por quinze dias."
    },
    gabarito: "A",
    explicacao: "Prurido em idosa com xerose cutânea sem causa sistêmica = prurido por xerose senil (a causa mais comum). Tratamento inicial: hidratação intensiva da pele + corticoide tópico nas áreas escoriadas. Anti-histamínicos têm baixa eficácia em prurido não-histaminérgico. Gabapentina é 2ª linha. Tramadol pode causar prurido, mas não é o mais provável."
  },
  {
    n: 6,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Cardiologia",
    subtemas: ["IAM", "Infarto de VD", "ECG"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 53 anos, HAS e DM2 (uso de HCTZ, metformina, gliclazida). Dor torácica há 1 hora. PA 90x60, FC 60, FR 25, sudoreico. ECG com supradesnivelamento de ST em parede inferior (DII, DIII, aVF). Terapia IV imediata pertinente?",
    alternativas: {
      A: "Dobutamina.",
      B: "Nitroglicerina.",
      C: "Noradrenalina.",
      D: "Cloreto de sódio 0,9%."
    },
    gabarito: "D",
    explicacao: "IAM de parede inferior com hipotensão e bradicardia sugere envolvimento do VD/comprometimento do nó sinoatrial. O VD é pré-carga dependente. Conduta: volume (SF 0,9%) para otimizar pré-carga ANTES de qualquer outra intervenção. Nitrato é CONTRAINDICADO em IAM de VD (piora hipotensão). Sempre solicitar V3R/V4R nesses casos."
  },
  {
    n: 7,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Hematologia",
    subtemas: ["Gamopatia monoclonal", "MGUS", "Mieloma múltiplo"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 68 anos, fadiga crônica, exame clínico normal. Eletroforese de proteínas com componente monoclonal de 1,2 g/dL (16,8%). Hemograma, creatinina, cálcio e radiografias normais. Conduta?",
    alternativas: {
      A: "Imunofixação e pesquisa de cadeias leves livres no sangue.",
      B: "Biópsia de medula óssea e pesquisa por citogenética/FISH.",
      C: "Eletroforese de proteínas séricas a cada 6 meses.",
      D: "Cintilografia óssea ou tomografia de corpo inteiro."
    },
    gabarito: "A",
    explicacao: "Componente M < 3 g/dL e ausência de CRAB (hiperCalcemia, insuf. Renal, Anemia, lesões ósseas/Bone) = provável MGUS, mas a investigação ainda não está completa. Para CARACTERIZAR a gamopatia (tipo de cadeia, presença de cadeias leves livres) é necessária imunofixação + cadeias leves livres séricas. Só após caracterização decide-se sobre MO. Ressonância de corpo inteiro substituiu radiografias mas só após caracterização."
  },
  {
    n: 8,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Psiquiatria",
    subtemas: ["Transtorno de pânico", "Agorafobia"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Homem, 45 anos, 3 crises de pânico em 4 meses. Devido às crises, passou a evitar elevador por medo de ter uma crise e não poder sair ou receber ajuda. Sem queixas entre as crises. Além do transtorno de pânico, qual diagnóstico?",
    alternativas: {
      A: "Agorafobia.",
      B: "Claustrofobia.",
      C: "Ansiedade generalizada.",
      D: "Fobia específica."
    },
    gabarito: "A",
    explicacao: "Agorafobia (DSM-5) = medo de situações onde escapar seria difícil ou ajuda indisponível em caso de sintomas tipo pânico. Inclui transporte público, espaços fechados/abertos, multidões, ficar fora de casa sozinho. NÃO é simples 'medo de lugares fechados' (claustrofobia, que é fobia específica). A coexistência pânico+agorafobia é clássica."
  },
  {
    n: 9,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Gastroenterologia",
    subtemas: ["Doença celíaca", "Anemia ferropriva"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 57 anos, hipotireoidismo em uso de 225 µg/dia de levotiroxina (dose alta para o peso). Dor abdominal em cólica há 8 meses, evacuações amolecidas. Enterotomografia normal. Hb 10,1, VCM 67 fL (microcitose), plaquetas 490 mil. Biópsia do TGI provavelmente identificaria:",
    alternativas: {
      A: "granuloma.",
      B: "H. pylori.",
      C: "infiltrado linfocítico.",
      D: "infiltrado eosinofílico."
    },
    gabarito: "C",
    explicacao: "Suspeita altíssima de DOENÇA CELÍACA: necessidade de dose ALTA de levotiroxina (má absorção), anemia microcítica (ferropriva por má absorção de ferro), sintomas gastrointestinais crônicos. Histologia clássica: atrofia vilositária + HIPERPLASIA de criptas + INFILTRADO LINFOCÍTICO INTRAEPITELIAL (>40/100 enterócitos). Granuloma = Crohn. Eosinofílico = gastroenterite eosinofílica."
  },
  {
    n: 10,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Psiquiatria/Farmacologia",
    subtemas: ["ISRS", "Insônia", "Efeitos adversos"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 35 anos, AR e depressão. Usa MTX semanal, ácido fólico e fluoxetina 20 mg à noite. Insônia há 2 meses. Conduta?",
    alternativas: {
      A: "Trocar fluoxetina por clonazepam.",
      B: "Associar fluoxetina com clonazepam.",
      C: "Aumentar dose da fluoxetina.",
      D: "Orientar uso da fluoxetina pela manhã."
    },
    gabarito: "D",
    explicacao: "Fluoxetina é um ISRS ATIVADOR (mais que sertralina, citalopram). Tomada à noite pode causar/piorar insônia. A conduta mais simples e efetiva é mudar o horário para manhã antes de qualquer outra mudança. Benzodiazepínicos não devem ser primeira linha. Aumentar dose pioraria o problema."
  },
  {
    n: 11,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Neurologia",
    subtemas: ["AVC", "Heminegligência", "Síndromes hemisféricas"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 74 anos, tabagista, HAS, DM. Encontrada confusa. PA 170x110. Vigil, irritada ('quero ir para casa' - anosognosia). Desvio do olhar para direita quando distraída (mas consegue olhar para esquerda quando instruída). Campos visuais íntegros. Lê apenas o lado direito das frases (negligência esquerda). Sem fraqueza. Imagem de RM compatível?",
    alternativas: {
      A: "Lesão à esquerda.",
      B: "Lesão temporal posterior.",
      C: "Lesão parietal direita.",
      D: "Lesão occipital."
    },
    gabarito: "C",
    explicacao: "Síndrome clássica de heminegligência por lesão do lobo parietal DIREITO (não-dominante): negligência do hemiespaço esquerdo, anosognosia, desvio do olhar conjugado ipsilateral à lesão (para direita). Sem hemianopsia (campos íntegros) e sem hemiparesia. A imagem correta mostraria lesão parietal direita."
  },
  {
    n: 12,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Endocrinologia",
    subtemas: ["Cetoacidose diabética", "Hipocalemia", "Distúrbios eletrolíticos"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 22 anos, polifagia/poliúria/polidipsia há 1 mês. Glicemia 482, pH 7,27, HCO3 12, pCO2 26, cetonas+. ECG com ondas T achatadas e ondas U (sinais de hipocalemia). Força grau IV nos MMII. Prescrição imediata?",
    alternativas: {
      A: "Bicarbonato de sódio.",
      B: "Insulina em bomba de infusão.",
      C: "Adenosina em bólus.",
      D: "Cloreto de potássio."
    },
    gabarito: "D",
    explicacao: "CAD com sinais de HIPOCALEMIA no ECG (ondas U, T achatadas) e fraqueza muscular. REGRA DE OURO: K+ <3,3 mEq/L na CAD = ADIAR insulina e repor K+ primeiro, pois insulina jogará mais K+ para dentro da célula e pode causar arritmia fatal. Bicarbonato só se pH<6,9. Adenosina não tem indicação."
  },
  {
    n: 13,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Bioestatística/Cardiologia",
    subtemas: ["Razão de verossimilhança", "Insuficiência cardíaca", "Semiologia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Achado clínico que mais favorece (significativamente) o diagnóstico de IC com base em razão de verossimilhança positiva?",
    alternativas: {
      A: "Hepatomegalia (RV+ 1,07)",
      B: "Terceira bulha (RV+ 0,67)",
      C: "Estertores (RV+ 1,26)",
      D: "Refluxo abdominojugular (RV+ 5,50)"
    },
    gabarito: "D",
    explicacao: "Quanto MAIOR a razão de verossimilhança positiva (RV+), maior o impacto no aumento da probabilidade pós-teste. RV+ >10 = forte; 5-10 = moderada; 2-5 = pequena; 1-2 = mínima. RV+ de 5,50 (refluxo abdominojugular) é a mais alta entre as opções e produz impacto significativo na probabilidade pós-teste. Curiosidade: a terceira bulha aqui aparece com dados ruins, mas em literatura clássica tem RV+ alta."
  },
  {
    n: 14,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Pneumologia",
    subtemas: ["Intubação", "Radiografia de tórax", "Intubação seletiva"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 53 anos, tosse produtiva e febre. Evoluiu com desconforto respiratório e foi intubada. Pós-intubação: MV reduzidos GLOBALMENTE à ESQUERDA, presentes à direita. Imagem de radiografia compatível?",
    alternativas: {
      A: "Radiografia normal.",
      B: "Intubação seletiva à direita (atelectasia esquerda).",
      C: "Pneumotórax esquerdo.",
      D: "Derrame pleural bilateral."
    },
    gabarito: "B",
    explicacao: "Após intubação, MV reduzido unilateralmente = INTUBAÇÃO SELETIVA até prova contrário. O brônquio fonte direito é mais retilíneo, então o tubo geralmente vai para a direita, levando à atelectasia (colapso) do pulmão esquerdo. RX mostraria opacificação à esquerda com desvio mediastinal para o lado colapsado e tubo posicionado abaixo da carina."
  },
  {
    n: 15,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Alergia/Imunologia",
    subtemas: ["Anafilaxia", "Angioedema", "Urticária"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 23 anos, rinite alérgica, dismenorreia, cefaleia tensional com uso recorrente de AINEs e analgésicos. 4 atendimentos em 8 meses por edema de pálpebras e lábios. Um episódio com edema de língua. Outro com lesões eritematosas/edematosas/pruriginosas. Um após amendoim. 2x recebeu adrenalina IM com melhora. Nega hipotensão, dispneia, GI. Causa mais provável?",
    alternativas: {
      A: "Urticária aguda.",
      B: "Alergia alimentar.",
      C: "Anafilaxia recorrente.",
      D: "Angioedema hereditário."
    },
    gabarito: "C",
    explicacao: "ANAFILAXIA: envolvimento de 2+ sistemas (pele/mucosa + respiratório/cardiovascular/GI) OU envolvimento isolado da via aérea com edema de língua. Episódio com edema de língua = comprometimento de via aérea. Episódio com urticária + edema = pele + mucosa. Múltiplos gatilhos (AINEs, amendoim) compatível com anafilaxia recorrente. Angioedema hereditário = sem urticária, sem resposta à adrenalina."
  },
  {
    n: 16,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Hematologia/Oncologia",
    subtemas: ["Linfadenomegalia", "Linfoma", "Biópsia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 35 anos, calafrios 3x/sem, prurido generalizado refratário, edema facial matinal, gânglio cervical direito aumentado (firme, indolor, não aderido, 2,5 cm). FC 112, T 37,1. Turgência jugular discreta. Conduta?",
    alternativas: {
      A: "Sorologia para mononucleose.",
      B: "Amoxicilina/clavulanato por 7 dias.",
      C: "Biópsia do linfonodo.",
      D: "Prednisona oral por 5 dias."
    },
    gabarito: "C",
    explicacao: "Sinais clássicos de LINFOMA: linfonodo >2 cm, firme, indolor, não aderido + sintomas B (prurido refratário, sudorese/calafrios) + turgência jugular sugere massa mediastinal (síndrome da veia cava superior incipiente). Indicação clara de BIÓPSIA EXCISIONAL do linfonodo (não PAAF). Antibiótico/corticoide podem mascarar diagnóstico. Sorologias não substituem a biópsia neste contexto."
  },
  {
    n: 17,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Cardiologia",
    subtemas: ["Hipertensão", "Aferição da PA"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Homem, 43 anos, DM2, sobrepeso. PA na triagem: 148x92 mmHg. Próximo passo na avaliação da PA em consultório?",
    alternativas: {
      A: "Solicitar polissonografia tipo 1.",
      B: "Indicar MAPA.",
      C: "Reavaliar PA em consulta de retorno.",
      D: "Checar comprimento e largura do manguito utilizado."
    },
    gabarito: "D",
    explicacao: "Antes de qualquer interpretação da PA, é OBRIGATÓRIO garantir técnica adequada: manguito apropriado para circunferência do braço (largura ~40% e comprimento ~80-100% da circunferência). Em obesos/sobrepeso, manguito pequeno SUPERESTIMA a PA em até 10-30 mmHg. Esse é o próximo passo IMEDIATO na própria consulta, antes de pensar em MAPA ou retorno."
  },
  {
    n: 18,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Bioestatística/Ginecologia",
    subtemas: ["Trombofilias", "Anticoncepcional", "Triagem"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 28 anos, hígida, sem antecedentes pessoal/familiar de TEV, deseja iniciar contraceptivo hormonal combinado. Solicita triagem para trombofilias hereditárias. Melhor aconselhamento?",
    alternativas: {
      A: "Solicitar pesquisa das trombofilias mais prevalentes.",
      B: "Solicitar pesquisa das trombofilias com maior risco relativo.",
      C: "Realizar triagem laboratorial para todas as trombofilias.",
      D: "Não há necessidade de investigar trombofilias hereditárias."
    },
    gabarito: "D",
    explicacao: "Em paciente SEM história pessoal ou familiar de TEV, NÃO há indicação de triagem para trombofilias hereditárias antes de ACO. A baixa prevalência populacional + baixo valor preditivo positivo + custo + ansiedade gerada + não impedir uso de ACO em mulheres assintomáticas com mutação heterozigótica isolada. Triagem só se houver história pessoal ou familiar forte de TEV."
  },
  {
    n: 19,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Infectologia",
    subtemas: ["Hemocultura", "Contaminação", "Staphylococcus epidermidis"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 73 anos, internado por descompensação de ICFER. D8 de internação evolui com febre, tosse, taquicardia. Hemocultura: S. epidermidis em frasco aeróbio após 22h, outros frascos negativos. Antibioticoterapia mais pertinente?",
    alternativas: {
      A: "Ceftriaxone e azitromicina.",
      B: "Piperacilina com tazobactam.",
      C: "Vancomicina.",
      D: "Oxacilina."
    },
    gabarito: "A",
    explicacao: "S. epidermidis em UMA hemocultura (1 frasco de 4) com crescimento tardio (>20h) sugere CONTAMINAÇÃO de pele/coleta, não infecção real. Quadro clínico (febre, tosse) = PNEUMONIA. Como é D8 (>48h após admissão), seria PNEUMONIA NOSOCOMIAL, mas o quadro foi precipitado por descompensação e em paciente sem outros fatores de risco; ceftriaxone+azitromicina cobre PAC clássica. Vancomicina seria se hemocultura fosse confirmatória de bacteremia."
  },
  {
    n: 20,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Neurologia/Farmacologia",
    subtemas: ["Parkinsonismo medicamentoso", "Reações adversas"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Homem, 62 anos, IAM tratado com ICP, internado 14 dias. Tremor de repouso 4-6 Hz, rigidez em roda denteada, bradicinesia, marcha em passos curtos. Medicação mais provavelmente associada?",
    alternativas: {
      A: "Clonazepam.",
      B: "Carvedilol.",
      C: "Bromoprida.",
      D: "Losartana."
    },
    gabarito: "C",
    explicacao: "PARKINSONISMO MEDICAMENTOSO: bloqueadores D2 são as principais causas. BROMOPRIDA (e metoclopramida) são antagonistas dopaminérgicos centrais usados frequentemente como antieméticos em internação, causando síndrome parkinsoniana em idosos. Reversível com suspensão. Antipsicóticos típicos também causam. Carvedilol/losartana/clonazepam não causam parkinsonismo."
  },
  {
    n: 21,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Nefrologia",
    subtemas: ["Hipercalemia", "ECG", "LES"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 23 anos, LES com perda de seguimento por 2 anos. Cansaço. PA 152x88, SpO2 94%. Cr 3,7, K+ 5,8, Na 135, Hb 8,9. ECG com ondas T apiculadas. Conduta imediata?",
    alternativas: {
      A: "Gluconato de cálcio.",
      B: "Furosemida.",
      C: "Desmopressina.",
      D: "Poliestireno sulfonato de sódio."
    },
    gabarito: "A",
    explicacao: "HIPERCALEMIA COM ALTERAÇÕES ELETROCARDIOGRÁFICAS (T apiculadas) = EMERGÊNCIA. Primeira conduta SEMPRE: GLUCONATO DE CÁLCIO IV (estabilização da membrana miocárdica), mesmo antes de medidas para reduzir K+. Após cálcio: insulina+glicose, beta-2 agonistas, e somente depois eliminação (furosemida, resina, diálise). Desmopressina não tem papel."
  },
  {
    n: 22,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Cardiologia",
    subtemas: ["Emergência hipertensiva", "DRC dialítica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 67 anos, DRC dialítica, internado por pneumonia. PA persistentemente ~180x120 nas últimas 48h. Cefaleia habitual. Etapa fundamental do exame físico para conduta imediata?",
    alternativas: {
      A: "Exame do fundo de olho.",
      B: "Medida do peso corpóreo.",
      C: "Aferição da circunferência cervical.",
      D: "Pesquisa de sopro abdominal."
    },
    gabarito: "B",
    explicacao: "DRC DIALÍTICA com HAS de difícil controle: a principal causa é SOBRECARGA VOLÊMICA (peso seco mal ajustado). A medida do peso corpóreo e comparação com o peso seco é fundamental para definir a conduta (diálise extra/ultrafiltração vs. ajuste medicamentoso). Fundo de olho seria para emergência hipertensiva com lesão de órgão-alvo, mas em dialítico o foco é volume."
  },
  {
    n: 23,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Oncologia/Paliativos",
    subtemas: ["Hipercalcemia", "Síndromes paraneoplásicas"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 41 anos, CA de mama com metástases óssea e pulmonar, em uso de morfina, dipirona, lactulose. Sonolência progressiva, náuseas, vômitos, piora da constipação, queda funcional. Desidratada, abdome distendido. Principal hipótese?",
    alternativas: {
      A: "Metástase hepática.",
      B: "Metástase cerebral.",
      C: "Hipercalcemia.",
      D: "Hiponatremia."
    },
    gabarito: "C",
    explicacao: "HIPERCALCEMIA da malignidade (PTHrP ou metástases ósseas): tríade clássica 'stones, bones, abdominal groans, psychic moans' = sonolência/confusão + náuseas/vômitos + constipação + desidratação (poliúria por DI nefrogênico). Câncer de mama com metástase óssea é causa CLÁSSICA. Apresentação subaguda. Metástase cerebral cursaria com focalidade neurológica. Hiponatremia teria Na baixo (não mencionado)."
  },
  {
    n: 24,
    banca: "USP/FUVEST 2026",
    especialidade: "Clínica Médica",
    tema: "Endocrinologia",
    subtemas: ["Insuficiência adrenal", "Crise adrenal", "Stress dose"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 49 anos, insuficiência adrenal em uso de hidrocortisona+fludrocortisona. IVAS há 3 dias, T 38,3°C, BEG, congestão nasal, hiperemia oral. Conduta?",
    alternativas: {
      A: "Manter doses e observar em domicílio.",
      B: "Manter doses e indicar hospitalização.",
      C: "Aumentar dose de hidrocortisona e observar em domicílio.",
      D: "Aumentar dose de hidrocortisona e indicar hospitalização."
    },
    gabarito: "C",
    explicacao: "REGRA DOS DIAS DE STRESS (sick day rules) na insuficiência adrenal: em doença febril leve a moderada (T>38°C), o paciente DEVE DOBRAR OU TRIPLICAR a dose oral de hidrocortisona por 2-3 dias até melhora. Como o paciente está em BEG, tolerando VO, sem sinais de crise adrenal, observação em domicílio com ajuste de dose é adequado. Hospitalização e hidrocortisona IV reservada para vômitos/diarreia/sepse/cirurgia ou crise adrenal."
  }
];

// ==================== CIRURGIA (25-48) ====================
QUESTOES.push(
  {
    n: 25,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Coloproctologia/Oncologia",
    subtemas: ["Câncer anal", "HSH", "Lesão anal"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 30 anos, HSH, abaulamento anal com dor intensa e sangramento. Lesão na borda anal posterior 'tipo verruga' que aumentou com o tempo. Imagem mostra lesão ulcerada/vegetante extensa na borda anal. Diagnóstico mais provável?",
    alternativas: {
      A: "Adenocarcinoma.",
      B: "Carcinoma espinocelular.",
      C: "Condiloma acuminado.",
      D: "Hemorroida interna grau IV."
    },
    gabarito: "B",
    explicacao: "CARCINOMA ESPINOCELULAR DE CANAL ANAL: HSH é fator de risco (HPV oncogênicos 16/18), lesão crescente, dolorosa, ulcerada, sangrante. Adenocarcinoma anal é raro (origem geralmente retal). Condiloma seria lesão verrucosa não-ulcerada. Hemorroida grau IV é prolapso vascular irredutível, não ulcerada. Diagnóstico: biópsia. Tratamento: protocolo de Nigro (quimiorradioterapia)."
  },
  {
    n: 26,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Pseudo-obstrução", "Síndrome de Ogilvie", "Pós-operatório"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 72 anos, D6 pós-troca de valva mitral. Sem evacuação desde cirurgia, sem flatos há 2 dias, distensão e dor. DM, apendicectomia prévia. Abdome distendido, timpânico, pouco doloroso. K+ 3,1, Cr 2,5. TC: dilatação difusa do cólon sem ponto de transição. Diagnóstico?",
    alternativas: {
      A: "Gastroparesia.",
      B: "Pseudo-obstrução cólica.",
      C: "Obstrução por bridas.",
      D: "Isquemia mesentérica."
    },
    gabarito: "B",
    explicacao: "SÍNDROME DE OGILVIE (pseudo-obstrução cólica aguda): dilatação maciça do cólon SEM ponto de transição mecânica em paciente crítico/pós-operatório, idoso, com distúrbios eletrolíticos (hipoK!), opioides, cirurgia cardíaca. Conduta: corrigir eletrólitos, suspender opioides, neostigmina. Bridas teriam ponto de transição em DELGADO. Isquemia teria peritonite/acidose/lactato alto."
  },
  {
    n: 27,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["Trauma abdominal fechado", "FAST", "Lesão hepática"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 23 anos, queda de moto. Intubado, estável. FAST+ hepatorrenal/esplenorrenal. TC: lesão hepática (laceração). Estável hemodinamicamente. Lesão e conduta?",
    alternativas: {
      A: "Mesentério e laparotomia.",
      B: "Mesentério e tratamento não operatório.",
      C: "Fígado e laparotomia.",
      D: "Fígado e tratamento não operatório."
    },
    gabarito: "D",
    explicacao: "Trauma hepático em paciente ESTÁVEL HEMODINAMICAMENTE = TRATAMENTO NÃO OPERATÓRIO (TNO) é o padrão atual, independente do grau, desde que: estabilidade hemodinâmica, ausência de sinais de peritonite, possibilidade de monitorização rigorosa. TNO tem sucesso em >85% dos casos. Embolização pode ser adjuvante. Laparotomia reservada para instabilidade ou peritonite."
  },
  {
    n: 28,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Bypass gástrico", "Sangramento pós-op", "Anastomose"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 49 anos, D1 pós-bypass gástrico. Descorada, FC 130, PA 100x80, FR 23, SpO2 94%. Abdome flácido, indolor exceto nas punções. Principal hipótese?",
    alternativas: {
      A: "Hérnia interna.",
      B: "Atelectasia pulmonar.",
      C: "Deiscência da anastomose.",
      D: "Sangramento da anastomose."
    },
    gabarito: "D",
    explicacao: "Sinais de hipovolemia (taquicardia, anemia clínica) em D1 pós-bypass com abdome SEM SINAIS de irritação peritoneal sugere SANGRAMENTO INTRALUMINAL (mais comum nas anastomoses, gastrojejunal ou jejunojejunal). Deiscência precoce cursaria com peritonite/sepse e ar livre. Hérnia interna é complicação tardia. Atelectasia explicaria dessaturação mas não taquicardia importante."
  },
  {
    n: 29,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica",
    subtemas: ["Esofagocoloplastia", "Necrose de cólon"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Lactente 1 ano, pós-esofagocoloplastia há 24h. Gemente, má perfusão, oligúria, débito vinhoso fétido pela gastrostomia, FC 190, PA 70x40. Complicação mais provável?",
    alternativas: {
      A: "Deiscência da anastomose.",
      B: "Pneumotórax hipertensivo.",
      C: "Perfuração de cólon.",
      D: "Necrose de cólon."
    },
    gabarito: "D",
    explicacao: "Esofagocoloplastia: substituição do esôfago por segmento de cólon (com pedículo vascular). NECROSE DO CÓLON TRANSPLANTADO é a complicação mais temida nas primeiras 24-48h por sofrimento isquêmico do pedículo. Sinais clássicos: choque séptico + DÉBITO VINHOSO/FÉTIDO pela gastrostomia (saída do cólon necrótico). Deiscência pura sem necrose tem clínica menos catastrófica."
  },
  {
    n: 30,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Câncer de cólon", "Obstrução", "Metástase hepática"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 73 anos, alteração de hábito intestinal há 4 meses. Colonoscopia: lesão ulcerada no sigmoide intransponível. Procura PS por dor abdominal, distensão e parada de evacuação há 5 dias. Fígado palpável (metástases). TC com obstrução e metástases hepáticas. Hb 10,8, albumina 3,3. Melhor conduta?",
    alternativas: {
      A: "Retossigmoidectomia com linfadenectomia com anastomose.",
      B: "Retossigmoidectomia com linfadenectomia sem anastomose.",
      C: "Laparotomia exploradora com colostomia em alça.",
      D: "Laparotomia exploradora com ileostomia em alça."
    },
    gabarito: "C",
    explicacao: "Câncer de sigmoide OBSTRUTIVO com metástases hepáticas = doença METASTÁTICA com complicação aguda. A cirurgia deve ser PALIATIVA, simples, focada em resolver a obstrução sem ressecção do tumor primário neste momento de urgência: COLOSTOMIA EM ALÇA proximal à obstrução. Ressecção definitiva seria após quimioterapia. Ileostomia não desviaria o trânsito eficientemente para obstrução em sigmoide."
  },
  {
    n: 31,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica/Oncologia",
    subtemas: ["Melanoma", "Linfonodo sentinela", "Margens"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 67 anos, melanoma na perna com Breslow 4,5 mm e ulceração. Próximo passo?",
    alternativas: {
      A: "Ampliação de margens de 1 cm e pesquisa de linfonodo sentinela.",
      B: "Ampliação de margens de 2 cm e pesquisa de linfonodo sentinela.",
      C: "USG inguinal e RM de abdome.",
      D: "TC de tórax, abdome e pelve com contraste."
    },
    gabarito: "B",
    explicacao: "MARGENS no melanoma conforme Breslow: in situ = 0,5cm; ≤1mm = 1cm; 1-2mm = 1-2cm; >2mm = 2cm. Breslow 4,5mm = MARGEM DE 2 cm. PESQUISA DE LINFONODO SENTINELA indicada para Breslow ≥0,8mm ou ulceração (este caso tem ambos). Estadiamento sistêmico com TC só se LNS+ ou clínico positivo."
  },
  {
    n: 32,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Urologia",
    subtemas: ["Tumor de testículo", "Marcadores tumorais"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 27 anos, dor testicular à direita há 15 dias com aumento de volume. Sem febre. USG: testículo direito aumentado, hipoecoico, heterogêneo com aumento difuso da vascularização. Conduta?",
    alternativas: {
      A: "Ciprofloxacino e azitromicina por 5 dias.",
      B: "Ceftriaxona dose única e doxiciclina por 10 dias.",
      C: "PET-CT com FDG18, βHCG e alfa fetoproteína.",
      D: "Tomografia de tórax e abdome, βHCG e alfa fetoproteína."
    },
    gabarito: "D",
    explicacao: "Achado ultrassonográfico clássico de TUMOR DE TESTÍCULO (massa hipoecoica/heterogênea com vascularização aumentada). Conduta: ESTADIAMENTO com TC de tórax/abdome/pelve + MARCADORES (β-hCG, AFP, DHL) ANTES da orquiectomia inguinal (que confirma diagnóstico). Não há indicação de PET-CT inicial. NÃO é orquiepididimite (sem febre, sem corrimento, evolução de 15 dias)."
  },
  {
    n: 33,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Obstrução intestinal", "Bridas", "Suboclusão"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 64 anos, distensão, dor abdominal em cólica e vômitos há 24h. Antecedente de retossigmoidectomia. RHA aumentados, abdome distendido. Tomografia esperada?",
    alternativas: {
      A: "Imagem com alças delgadas dilatadas com nível hidroaéreo (obstrução de delgado).",
      B: "Imagem com pneumoperitônio.",
      C: "Imagem com pancreatite.",
      D: "Imagem com aneurisma de aorta."
    },
    gabarito: "A",
    explicacao: "Quadro clássico de OBSTRUÇÃO DE INTESTINO DELGADO POR BRIDAS: cirurgia abdominal prévia (retossigmoidectomia) + cólica + vômitos + distensão + RHA AUMENTADOS (luta peristáltica). Imagem mostraria alças de DELGADO DILATADAS com NÍVEIS HIDROAÉREOS, ponto de transição, sem ar no cólon distal. Bridas são a CAUSA MAIS COMUM de obstrução de delgado em adultos com cirurgia prévia."
  },
  {
    n: 34,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Profilaxia antibiótica", "Cirurgia colorretal"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Profilaxia antibiótica para retossigmoidectomia eletiva em paciente com DM controlado. Melhor opção?",
    alternativas: {
      A: "Cefoxitina.",
      B: "Cefuroxima.",
      C: "Cefazolina.",
      D: "Ceftriaxona."
    },
    gabarito: "A",
    explicacao: "Profilaxia em CIRURGIA COLORRETAL exige cobertura para gram-negativos E ANAERÓBIOS (B. fragilis). A CEFOXITINA (cefamicina) tem cobertura para anaeróbios. Alternativas: cefazolina + metronidazol. Cefazolina sozinha NÃO cobre anaeróbios bem. Cefuroxima é 2ª geração mas com cobertura anaeróbica limitada. Ceftriaxone não é primeira escolha para profilaxia."
  },
  {
    n: 35,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Nutrição",
    subtemas: ["Suporte nutricional", "Câncer", "Caquexia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 59 anos, adenocarcinoma pancreático com indicação de QT neoadjuvante. Perda de 10% do peso. Peso ideal 70 kg. Metas calórica e proteica?",
    alternativas: {
      A: "2.000 calorias; 100 g de proteína.",
      B: "2.000 calorias; 200 g de proteína.",
      C: "3.000 calorias; 200 g de proteína.",
      D: "3.000 calorias; 100 g de proteína."
    },
    gabarito: "B",
    explicacao: "Paciente oncológico com perda ponderal grave: ESPEN recomenda 25-30 kcal/kg/dia E 1,2-2,0 g/kg/dia de proteína (alto aporte para evitar/reverter sarcopenia e suportar QT/cirurgia). Peso ideal 70 kg: 70×30 ≈ 2.100 kcal (~2.000); 70×2 = 140-200 g proteína (200g atende a meta alta). Opção B é a mais adequada para suporte oncológico pré-tratamento."
  },
  {
    n: 36,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Coledocolitíase", "Pós-bariátrica", "CPRE"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 45 anos, pós-bypass em Y de Roux há 2 anos. Diagnóstico de colelitíase + coledocolitíase. Melhor sequência?",
    alternativas: {
      A: "Colecistectomia e colangiografia transparieto-hepática.",
      B: "Colecistectomia e exploração cirúrgica do colédoco.",
      C: "Colangiografia endoscópica e colecistectomia laparoscópica.",
      D: "Litotripsia extracorpórea e colecistectomia."
    },
    gabarito: "B",
    explicacao: "Em pós-BYPASS EM Y DE ROUX, a CPRE convencional é DIFÍCIL/IMPOSSÍVEL porque o endoscópio teria que percorrer a alça biliopancreática longa para alcançar a papila. Opções: 1) CPRE assistida por enteroscopia/laparoscopia; 2) EXPLORAÇÃO CIRÚRGICA DO COLÉDOCO (mais comum no Brasil); 3) PTH (drenagem percutânea). A colecistectomia + exploração cirúrgica de colédoco em um tempo é a melhor opção."
  },
  {
    n: 37,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Diverticulite", "Abscesso", "Classificação de Hinchey"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 65 anos, dor em FIE há 6 dias, constipação, hiporexia. BEG, FC 80, sem irritação peritoneal. Leuco 15.000, PCR 180. TC: divertículos, abscesso pericólico de 2 cm com gás. Melhor conduta?",
    alternativas: {
      A: "Antibioticoterapia.",
      B: "Colostomia em alça.",
      C: "Retossigmoidectomia.",
      D: "Drenagem percutânea."
    },
    gabarito: "A",
    explicacao: "DIVERTICULITE AGUDA HINCHEY IB (abscesso pericólico pequeno, <3-4 cm). Para abscessos <3-4 cm: ANTIBIOTICOTERAPIA isoladamente, sem necessidade de drenagem. Abscessos >3-4 cm = drenagem percutânea + ATB. Peritonite difusa (Hinchey III/IV) = cirurgia. Cirurgia eletiva pode ser considerada após resolução em casos selecionados."
  },
  {
    n: 38,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica/Trauma",
    subtemas: ["Lesão de Morel-Lavallée", "Ferimento descolante"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 28 anos, atropelamento. D7 com escara cutânea descolada da profundidade, hematoma subcutâneo, sem perfusão cutânea adequada. Diagnóstico e conduta?",
    alternativas: {
      A: "Fasceíte necrotizante; punção e curativo oclusivo.",
      B: "Fasceíte necrotizante; incisão, drenagem e curativo VAC.",
      C: "Ferimento descolante oculto; ressecção de pele desvitalizada, limpeza e VAC.",
      D: "Ferimento descolante oculto; ressecção e enxertia da pele descolada."
    },
    gabarito: "C",
    explicacao: "LESÃO DE MOREL-LAVALLÉE (ferimento descolante oculto/closed degloving): cisalhamento entre pele/subcutâneo e fáscia muscular, com hematoma/seroma e perda de perfusão cutânea. Conduta: RESSECÇÃO da pele DESVITALIZADA (sem perfusão), limpeza cirúrgica, curativo a vácuo (VAC) para preparar leito e posterior enxertia. NÃO é fasceíte necrotizante (sem sinais infecciosos, sem instabilidade). Não preservar pele necrótica."
  },
  {
    n: 39,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Ortopedia/MFC",
    subtemas: ["Lombalgia", "Fatores de risco", "Cronificação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 40 anos, lombalgia aguda com irradiação para MID. Obesidade IMC 41, insônia em uso de benzodiazepínico, tabagismo 20 anos-maço. Qual característica é fator de risco para CRONIFICAÇÃO da dor lombar?",
    alternativas: {
      A: "Dor intensa gerando incapacidade funcional.",
      B: "Índice de massa corpórea maior que 35 kg/m².",
      C: "Tabagismo com elevada carga tabágica.",
      D: "Insônia com uso de benzodiazepínico."
    },
    gabarito: "A",
    explicacao: "Os YELLOW FLAGS (fatores psicossociais e comportamentais) são os principais preditores de cronificação da lombalgia: medo-evitação, catastrofização, INCAPACIDADE FUNCIONAL precoce/elevada, baixa expectativa de recuperação, depressão. Os fatores físicos (obesidade, tabagismo, insônia) são fatores de RISCO para LOMBALGIA, mas a incapacidade funcional é o melhor preditor de CRONICIDADE."
  },
  {
    n: 40,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Isquemia mesentérica", "Trombose"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 66 anos, DM, tabagista. Dor abdominal súbita intensa há 4h. Abdome tenso, doloroso difusamente. Hb 14,9, leuco 16.126, amilase 281. TC: alças com pneumatose intestinal/sinais de isquemia mesentérica. Achado operatório esperado?",
    alternativas: {
      A: "Vesícula gangrenada (colecistite).",
      B: "Pâncreas com necrose.",
      C: "Apêndice perfurado.",
      D: "Alças intestinais isquêmicas/necróticas."
    },
    gabarito: "D",
    explicacao: "ISQUEMIA MESENTÉRICA AGUDA: dor abdominal súbita desproporcional ao exame físico, fatores de risco vasculares (DM, tabagismo), amilase elevada (inespecífica), leucocitose, peritonite tardia. TC mostra alças não captantes, pneumatose, gas portal. Achado operatório: SEGMENTO INTESTINAL ISQUÊMICO/NECRÓTICO (clássico aspecto azulado/preto). Imagem D mostraria as alças coloração escurecida."
  },
  {
    n: 41,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Anatomia biliar", "Colangiografia"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Durante colecistectomia, qual estrutura deve receber o cateter da colangiografia intraoperatória? (Estruturas numeradas 1-4 no campo cirúrgico, sendo o ducto cístico geralmente a estrutura tubular entre a vesícula e o colédoco)",
    alternativas: {
      A: "1 (artéria cística)",
      B: "2 (colédoco)",
      C: "3 (ducto cístico)",
      D: "4 (artéria hepática)"
    },
    gabarito: "C",
    explicacao: "A colangiografia intraoperatória é realizada introduzindo o cateter no DUCTO CÍSTICO (estrutura que conecta a vesícula biliar ao colédoco). NUNCA introduzir no colédoco diretamente (risco de lesão). A estrutura correta é o ducto cístico após a sua identificação clara dentro do triângulo de Calot. Estrutura 3 na imagem original corresponde ao ducto cístico."
  },
  {
    n: 42,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Lesão de via biliar", "Pós-colecistectomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 59 anos, D1 pós-colecistectomia laparoscópica. Vômitos, dor abdominal, leuco 13.412, PCR 90, BT 1,1, FA/GGT normais. Conduta?",
    alternativas: {
      A: "Suspender tramadol e passar SNG.",
      B: "Suspender tramadol e administrar ondansetrona.",
      C: "Realizar tomografia de abdome.",
      D: "Realizar colangiorressonância."
    },
    gabarito: "C",
    explicacao: "Pós-operatório de colecistectomia com sinais inflamatórios (PCR 90, leucocitose), vômitos e dor desproporcional ao esperado = suspeita de COMPLICAÇÃO PÓS-OPERATÓRIA (bilioma, coleção, lesão de víscera, sangramento). A TC DE ABDOME é o primeiro exame para avaliar coleções/líquido livre/sangramento. ColangioRNM seria mais específica para lesão de via biliar (que aqui tem BT/FA normais, menos provável)."
  },
  {
    n: 43,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Coledocolitíase", "Síndromes ictéricas"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 39 anos, cólica em epigástrio/HD há 2 dias com melhora com analgesia. Ictérica. BT 4,5 (predominantemente direta), TGO 230, TGP 310, FA 430, GGT 352, amilase 110, lipase 72. PCR 8. Hipótese diagnóstica?",
    alternativas: {
      A: "Cólica biliar.",
      B: "Colangite.",
      C: "Coledocolitíase.",
      D: "Colecistite aguda."
    },
    gabarito: "C",
    explicacao: "COLEDOCOLITÍASE: dor biliar + icterícia + ↑bilirrubina direta + ↑↑FA/GGT (padrão colestático) + leve ↑transaminases (efeito obstrutivo). Sem febre/leucocitose (PCR 8 normal) = NÃO é colangite (Tríade de Charcot: dor + icterícia + febre). Sem sinal de Murphy/leucocitose marcada = não é colecistite. Cólica biliar não cursa com icterícia franca. Lipase normal afasta pancreatite."
  },
  {
    n: 44,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Torácica",
    subtemas: ["Drenagem torácica", "Pós-trauma"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 25 anos, drenada por hemopneumotórax há 5 dias. Débito seroso 40 mL/dia, sem borbulhar. RX: pulmão expandido, sem pneumotórax residual. Conduta?",
    alternativas: {
      A: "Manter dreno em aspiração contínua.",
      B: "Manter dreno e fisioterapia respiratória.",
      C: "Retirar o dreno com manobra de Valsalva.",
      D: "Retirar o dreno durante a inspiração."
    },
    gabarito: "C",
    explicacao: "Critérios para RETIRADA do dreno torácico: pulmão expandido + débito <100-200 mL/24h + ausência de borbulhamento (fístula aérea). A retirada deve ser feita durante MANOBRA DE VALSALVA (expiração forçada com glote fechada) ou ao FINAL DA INSPIRAÇÃO MÁXIMA: ambos AUMENTAM a pressão intratorácica, impedindo entrada de ar pelo trajeto durante a retirada. Inspiração comum geraria pressão NEGATIVA e risco de pneumotórax."
  },
  {
    n: 45,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["Síndrome do cinto de segurança", "Trauma abdominal"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 65 anos, colisão de carro com cinto de segurança. Marca do cinto na parede abdominal. FAST com líquido livre. Lesão MAIS FREQUENTE associada a esse mecanismo?",
    alternativas: {
      A: "Lesão intestinal.",
      B: "Lesão pancreática.",
      C: "Fratura de bacia.",
      D: "Rotura da parede abdominal."
    },
    gabarito: "A",
    explicacao: "SÍNDROME DO CINTO DE SEGURANÇA (Seat Belt Syndrome): equimose linear no abdome do cinto + alta associação com LESÕES INTESTINAIS (perfuração de delgado, mesentério), fraturas de coluna (Chance fracture) e contusões abdominais. As lesões intestinais são as MAIS COMUNS desse mecanismo e frequentemente subestimadas inicialmente (perfuração pode ter apresentação tardia)."
  },
  {
    n: 46,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Hérnia hiatal", "Refluxo gastroesofágico"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 65 anos, empachamento eventual. Nega disfagia, pirose, regurgitação. IMC 32. EDA: hérnia hiatal volumosa, mucosa normal, pangastrite leve. Radiografia contrastada: hérnia hiatal tipo III. Iniciado omeprazol+domperidona com resolução. Conduta?",
    alternativas: {
      A: "Manometria e pHmetria.",
      B: "Cirurgia com hiatoplastia + fundoplicatura.",
      C: "Cirurgia com hiatoplastia + bypass gástrico.",
      D: "Seguimento ambulatorial sem cirurgia no momento."
    },
    gabarito: "B",
    explicacao: "HÉRNIA HIATAL TIPO III (mista: porção cárdia desliza + fundo gástrico paraesofágico) é considerada HÉRNIA PARAESOFÁGICA e tem indicação cirúrgica MESMO EM PACIENTES SINTOMÁTICOS LEVES devido ao risco de volvo gástrico, estrangulamento, hemorragia. Tratamento: hiatoplastia (fechamento dos pilares) + FUNDOPLICATURA (Nissen) para prevenir refluxo. Bypass gástrico é uma opção em obesos mórbidos selecionados."
  },
  {
    n: 47,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Bioética/Psiquiatria",
    subtemas: ["Suicídio", "Autonomia", "Capacidade"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 58 anos, ingestão de soda cáustica 'por engano'. Postura reservada, solícito, fala pouco. Pede para não chamar psiquiatra. Conduta?",
    alternativas: {
      A: "Dar alta se assinar termo de responsabilidade.",
      B: "Dar alta considerando que a esposa é enfermeira.",
      C: "Não dar alta e avaliar com familiares as circunstâncias.",
      D: "Não dar alta e pedir avaliação psiquiátrica, omitindo a especialidade."
    },
    gabarito: "C",
    explicacao: "Suspeita ALTÍSSIMA de TENTATIVA DE AUTOEXTERMÍNIO mascarada como acidente (ingestão de soda cáustica não-acidental, postura reservada, recusa a psiquiatra). NÃO dar alta. Avaliar com familiares as circunstâncias do evento, eventos prévios, fatores de risco. Omitir a especialidade do médico avaliador fere a autonomia e ética. Devemos abordar abertamente, mas com cuidado e respeito. A opção C respeita autonomia E protege o paciente."
  },
  {
    n: 48,
    banca: "USP/FUVEST 2026",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular/Ortopedia",
    subtemas: ["Trauma vascular", "Fratura com lesão vascular"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 28 anos, queda de moto. Deformidade da coxa esquerda, ausência de pulso distal, palidez, dor intensa. RX: fratura de fêmur. Melhor sequência de tratamento?",
    alternativas: {
      A: "Revascularização seguida de fixação cirúrgica.",
      B: "Redução com tala seguida de revascularização.",
      C: "Embolectomia com Fogarty seguida de fixação.",
      D: "Fixação cirúrgica seguida de revascularização."
    },
    gabarito: "B",
    explicacao: "FRATURA DE FÊMUR COM ISQUEMIA: a primeira medida é a REDUÇÃO/ALINHAMENTO DA FRATURA com tala/tração que frequentemente RESTAURA a perfusão (lesão pode ser apenas por compressão/estiramento). Após redução, reavaliar pulsos. Se persistir isquemia: ARTERIOGRAFIA + REVASCULARIZAÇÃO (com fixação externa antes ou shunt temporário). A revascularização precede fixação interna definitiva nos casos com isquemia persistente."
  }
);

// ==================== PEDIATRIA (49-72) ====================
QUESTOES.push(
  {
    n: 49,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Emergência Pediátrica",
    subtemas: ["TCE", "Maus-tratos", "Via aérea"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Lactente 1 mês 'caiu do trocador'. Inconsciente, FR 8, SpO2 89%, Glasgow 7, hematoma temporal direito. Suporte respiratório a ser instituído?",
    alternativas: {
      A: "Cateter nasal de O2.",
      B: "Cânula orofaríngea isolada.",
      C: "Máscara facial não-reinalante.",
      D: "Ventilação com pressão positiva (bolsa-máscara) e preparo para IOT."
    },
    gabarito: "D",
    explicacao: "Lactente com Glasgow 7 + bradipneia (FR 8) + hipoxemia (SpO2 89%) = falência respiratória/neurológica. Indicação ABSOLUTA de ventilação com PRESSÃO POSITIVA (bolsa-máscara) imediata seguida de INTUBAÇÃO OROTRAQUEAL. Cateter/máscara não-reinalante seriam insuficientes para um paciente em hipoventilação. A imagem correta mostra ventilação manual com balão autoinflável e máscara facial."
  },
  {
    n: 50,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Emergência Pediátrica",
    subtemas: ["Maus-tratos", "Hematoma subdural", "ECA"],
    dificuldade: "Fácil",
    temImagem: true,
    enunciado: "Lactente 1 mês, TC: hematoma subdural extenso. Caso notificado ao serviço social. Justificativa correta?",
    alternativas: {
      A: "A tomografia não é compatível com o trauma reportado.",
      B: "Hematoma em localização incomum nos traumas pediátricos.",
      C: "O mecanismo de trauma é incompatível com a faixa etária.",
      D: "Não havia indicação."
    },
    gabarito: "C",
    explicacao: "Um lactente de 1 MÊS NÃO ROLA SOZINHO (rolar é marco do 4°-6° mês). Portanto, a história 'caiu do trocador rolando' é INCOMPATÍVEL COM A FAIXA ETÁRIA = sinal de alerta para maus-tratos. Hematoma subdural em lactente é altamente suspeito para 'shaken baby syndrome'. Notificação ao Conselho Tutelar/serviço social é OBRIGATÓRIA (ECA Art. 13)."
  },
  {
    n: 51,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Emergência Pediátrica",
    subtemas: ["Maus-tratos", "Síndrome do bebê sacudido", "Anemia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Lactente 1 mês com hematoma subdural por suspeita de maus-tratos. Alteração laboratorial esperada nos exames coletados na admissão?",
    alternativas: {
      A: "pH 7,28, paO2 58, pCO2 55 (acidose respiratória).",
      B: "Hb 5,0 g/dL, Ht 18% (anemia grave).",
      C: "TTPA 2,5, TP 1,1 (coagulopatia).",
      D: "Lactato 55, Ur 60, Cr 0,7 (hipoperfusão renal)."
    },
    gabarito: "B",
    explicacao: "Na SÍNDROME DO BEBÊ SACUDIDO/maus-tratos com TCE grave, é comum encontrar ANEMIA GRAVE por: hemorragia intracraniana (subdural extenso pode acumular grande volume relativo a um lactente), hemorragias retinianas, sangramentos ocultos por outros traumas. Hb 5,0 g/dL é compatível. A acidose respiratória vista na opção A poderia ocorrer, mas o achado mais específico/clássico do trauma com sangramento é a anemia."
  },
  {
    n: 52,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Prematuridade", "Crescimento", "Aleitamento"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Prematura 32 sem, peso ao nascer 1.300 g, AIG, Z-score -1. Em retorno com 56 dias de vida cronológica (40 sem corrigida), peso 2.800 g, aleitamento materno exclusivo. Conduta?",
    alternativas: {
      A: "Insuficiente; iniciar fórmula e coletar perfil de ferro.",
      B: "Insuficiente; iniciar fórmula após o seio e reavaliar em 1 semana.",
      C: "Adequado; manter aleitamento exclusivo e seguimento mensal.",
      D: "Adequado mas abaixo do esperado para idade; complementar."
    },
    gabarito: "C",
    explicacao: "Ganho ponderal: 2.800-1.300 = 1.500 g em 56 dias = ~26,8 g/dia (EXCELENTE, ideal para prematuro é 15-30 g/dia). Idade gestacional corrigida = 32 + 8 sem = 40 sem (a termo corrigida). Z-score mantido. NÃO há indicação de complementação se aleitamento exclusivo está funcionando. Recomendação: manter AME até 6 meses corrigidos, seguimento pediátrico de prematuro."
  },
  {
    n: 53,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Infectologia Pediátrica",
    subtemas: ["Sepse", "ITU", "Choque"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Criança 7 anos, RVU bilateral, ITU recente por E. coli internada em UTI. Alta há 2 dias. Hoje: febre 38,8°C, letárgico, FC 140, FR 26, PA 90x40, perfusão rápida, pulsos amplos. Conduta?",
    alternativas: {
      A: "Expansão volêmica com cristaloide e antibiótico de espectro estendido para infecção nosocomial.",
      B: "Fluidoterapia em manutenção e cefalosporina de 3ª geração.",
      C: "Aguardar lactato, coagulograma, D-dímero.",
      D: "Aguardar coleta de urocultura."
    },
    gabarito: "A",
    explicacao: "CHOQUE SÉPTICO PEDIÁTRICO QUENTE: hipotensão (PA <5° percentil para idade), perfusão rápida, pulsos amplos, taquicardia, letargia. Conduta IMEDIATA (1ª hora): EXPANSÃO VOLÊMICA agressiva (20 mL/kg cristaloide bolus repetível) + ATB EMPÍRICO de amplo espectro para INFECÇÃO NOSOCOMIAL (paciente teve UTI, cateter venoso, sonda vesical = fatores de risco para germes resistentes). NÃO aguardar exames."
  },
  {
    n: 54,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Distúrbios Eletrolíticos",
    subtemas: ["Hipocalcemia", "ECG", "Desidratação"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Criança 4 anos, diarreia e vômitos há 3 dias com instabilidade hemodinâmica. Gasometria venosa: pH 7,29, HCO3 15, Na 128, K 3,9, Ca²⁺ 4,92 mg/dL (HIPOCALCEMIA). Traçado eletrocardiográfico esperado?",
    alternativas: {
      A: "QT NORMAL.",
      B: "QT PROLONGADO (intervalo QT alargado).",
      C: "Ondas T apiculadas.",
      D: "Ondas U proeminentes."
    },
    gabarito: "B",
    explicacao: "HIPOCALCEMIA (Ca iônico baixo) prolonga o INTERVALO QT no ECG (especificamente o segmento ST). Onda T apiculada = hiperK. Ondas U = hipoK. QT prolongado é a alteração clássica da hipocalcemia. Pode evoluir com torsades de pointes."
  },
  {
    n: 55,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Infectologia Pediátrica",
    subtemas: ["Bacteremia por cateter", "S. aureus"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Criança 4 anos, IRC dialítica com cateter de longa permanência, febre durante diálise. Hemocultura central +: S. aureus OXACILINA RESISTENTE (MRSA), sensível à vancomicina. Sem vegetação no ECO. Cateter retirado. Conduta?",
    alternativas: {
      A: "Manter vancomicina parenteral.",
      B: "Alta hospitalar com sulfametoxazol-trimetoprim.",
      C: "Suspender antibioticoterapia e considerar contaminação.",
      D: "Descalonar para clindamicina oral, mantendo internação."
    },
    gabarito: "A",
    explicacao: "BACTEREMIA POR MRSA (oxa R, vanco S) em paciente com CATETER VENOSO CENTRAL: tratamento é VANCOMICINA INTRAVENOSA por 14 dias para bacteremia não complicada (cateter retirado, sem foco metastático, ECO sem vegetação). Tempo conta a partir da PRIMEIRA hemocultura negativa. Manter monitorização. NÃO se descalona MRSA para via oral nem se trata por VO em bacteremia. Não é contaminação (cresceu rápido, paciente febril, com fatores de risco)."
  },
  {
    n: 56,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Infectologia/Imunizações",
    subtemas: ["Coqueluche", "Vacinas", "Gestante"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Lactente 5 meses e 2 sem, tosse há 1 semana com paroxismos e cianose, sem coriza, sem alterações pulmonares. Cartão vacinal: faltam vacinas. Agente etiológico provável e prevenção?",
    alternativas: {
      A: "DTPa para a mãe, às 20 semanas de gestação.",
      B: "VSR para a mãe, às 20 semanas de gestação.",
      C: "VPC10 aos 4 meses para a paciente (2ª dose).",
      D: "INF3 aos 5 meses para a paciente (1ª dose)."
    },
    gabarito: "A",
    explicacao: "QUADRO CLÁSSICO DE COQUELUCHE (Bordetella pertussis): tosse paroxística com cianose em lactente <6 meses, sem coriza importante, ausculta normal. Prevenção: VACINA DTPa para GESTANTES a partir de 20 semanas (protocolo MS). A imunidade materna passa via placenta e protege o lactente nos primeiros meses até completar esquema vacinal. As outras vacinas listadas (Pneumocócica, Influenza) não previnem coqueluche. VSR previne bronquiolite, não coqueluche."
  },
  {
    n: 57,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Alergia/Emergência",
    subtemas: ["Anafilaxia", "Adrenalina", "Alergia alimentar"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Criança 4 anos, alérgica a amendoim, ingestão acidental há 40 min. Placas urticariformes generalizadas. BEG, sem dispneia, sem hipotensão, sem sintomas gastrointestinais. Conduta?",
    alternativas: {
      A: "Administrar adrenalina 1:1.000 IM.",
      B: "Alta com anti-histamínico e corticosteroide.",
      C: "Monitorização hospitalar e administrar anti-histamínico.",
      D: "Lavagem gástrica."
    },
    gabarito: "A",
    explicacao: "EXPOSIÇÃO CONHECIDA A ALÉRGENO + sintomas (mesmo que apenas cutâneos extensos) = ANAFILAXIA segundo critérios mais recentes (WAO 2020). Em paciente com história de alergia ao alimento ingerido, urticária generalizada após exposição já configura anafilaxia. ADRENALINA IM 0,01 mg/kg (1:1000) é o tratamento de PRIMEIRA LINHA, sem atrasos. Anti-histamínico/corticoide são adjuvantes. Lavagem gástrica não tem indicação."
  },
  {
    n: 58,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Neurologia Pediátrica",
    subtemas: ["Crise febril", "CFS simples", "Avaliação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Criança 1 ano 2 meses, febre 39,5°C há 1 dia, crise tônico-clônica generalizada de 4 min. Já fora da crise, alerta, sem alterações. História familiar de crises febris. Vacinação em dia. Conduta?",
    alternativas: {
      A: "Coletar eletrólitos, glicemia e hemograma.",
      B: "Urina tipo 1 e urocultura por sondagem.",
      C: "USG transfontanela e EEG.",
      D: "Manter observação por 24h sem exames."
    },
    gabarito: "D",
    explicacao: "CRISE FEBRIL SIMPLES: idade 6 meses-5 anos + crise generalizada + duração <15 min + única em 24h + sem alterações neurológicas + criança alerta após. HISTÓRIA FAMILIAR POSITIVA = fator clássico. Conduta: identificar foco febril por exame clínico e OBSERVAÇÃO. NÃO são necessários exames laboratoriais rotineiros, neuroimagem ou EEG na crise febril SIMPLES. Investigar conforme suspeita clínica de foco."
  },
  {
    n: 59,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Pediatria/MFC",
    subtemas: ["Obesidade infantil", "Z-score", "Avaliação nutricional"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Buscar paciente do sexo masculino, 0-15 anos, com OBESIDADE pela OMS. Qual paciente é o mais adequado para o estudo?",
    alternativas: {
      A: "1 ano 10 meses, IMC 20 kg/m²",
      B: "3 anos 2 meses, IMC 17,5 kg/m²",
      C: "8 anos 3 meses, IMC 21 kg/m²",
      D: "12 anos 6 meses, IMC 22,5 kg/m²"
    },
    gabarito: "C",
    explicacao: "Definição de OBESIDADE pela OMS (referência 5-19 anos): IMC Z-score >+2DP (ou IMC >+3DP em <5 anos). Para 8 anos, IMC 21 está acima do Z+2 (~19) sendo compatível com obesidade. Para o de 12 anos e 6 meses, IMC 22,5 está entre Z+1 (~21) e Z+2 (~24) = SOBREPESO, não obesidade. Pacientes A e B precisam ser avaliados na primeira tabela (0-5 anos): IMC 20 com 1a10m é obesidade (>Z+3); IMC 17,5 com 3a2m é sobrepeso/normal."
  },
  {
    n: 60,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Saúde da Criança",
    subtemas: ["Acuidade visual", "Teste de Snellen", "Triagem"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Criança 7 anos, miopia, submetida ao teste de Snellen em mutirão usando óculos. Resultado: OD 0,7; OE 0,8. Justificativa para encaminhamento ao oftalmologista?",
    alternativas: {
      A: "O resultado no olho direito está alterado.",
      B: "O resultado foi diferente nos dois olhos.",
      C: "O teste foi realizado com uso das lentes corretivas.",
      D: "O teste foi realizado por profissional não habilitado."
    },
    gabarito: "B",
    explicacao: "Critérios para encaminhamento ao oftalmologista após teste de Snellen escolar: 1) Acuidade visual <0,7 em qualquer olho; 2) DIFERENÇA ≥2 LINHAS entre os olhos (anisometropia); 3) sinais ou sintomas oculares. Neste caso OD 0,7 e OE 0,8 (diferença de 1 linha - dentro do limite, então a justificativa formal seria DIFERENÇA entre olhos, especialmente em paciente que já usa correção). Resultado isolado de 0,7 não está alterado. Realizar com óculos é correto. Agentes treinados podem realizar."
  },
  {
    n: 61,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Neonatologia/Endocrinologia",
    subtemas: ["Hiperplasia adrenal congênita", "Teste do pezinho"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN a termo, neurossífilis em tratamento. Hipoglicemia neonatal. 11 dias de vida: perda de 12% do peso. Na+ 126, K+ 6,8. Deficiência esperada no Teste do Pezinho?",
    alternativas: {
      A: "Deficiência de TREC e KREC.",
      B: "Deficiência de 21-hidroxilase.",
      C: "Deficiência de carnitina.",
      D: "Deficiência na síntese da proteína CFTR."
    },
    gabarito: "B",
    explicacao: "HIPERPLASIA ADRENAL CONGÊNITA (HAC) por DEFICIÊNCIA DE 21-HIDROXILASE forma perdedora de sal: hiponatremia + hipercalemia + acidose + desidratação + perda ponderal acentuada na 2ª semana de vida + hipoglicemia (deficiência cortisol). Apresentação clássica! Triagem neonatal pela 17-OH-progesterona. TREC/KREC = imunodeficiências. Carnitina = erros do metabolismo. CFTR = fibrose cística."
  },
  {
    n: 62,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Pediatria/Dermatologia",
    subtemas: ["Candidíase", "Aleitamento materno"],
    dificuldade: "Fácil",
    temImagem: true,
    enunciado: "Lactente 4 meses com dermatite perineal há 5 dias e dor materna ao amamentar há 1 semana. Imagem do períneo mostra eritema com pápulas satélites e da mama mostra eritema/dor mamilar. Conduta?",
    alternativas: {
      A: "Retirar leite e derivados da dieta materna.",
      B: "Antifúngico tópico no períneo e na mama da mãe.",
      C: "Retornar à marca anterior de fralda e orientar pega adequada.",
      D: "Pomada de barreira no períneo e lanolina na mama."
    },
    gabarito: "B",
    explicacao: "CANDIDÍASE MÃE-LACTENTE: dermatite perineal com pápulas SATÉLITES (clássico de candidíase) + dor mamilar materna durante amamentação com eritema = ciclo de transmissão Cândida albicans. Conduta: NISTATINA tópica ou MICONAZOL tópico tanto no PERÍNEO da criança quanto no MAMILO da mãe. Tratar AMBOS simultaneamente para quebrar o ciclo de reinfecção. Manter aleitamento."
  },
  {
    n: 63,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Pneumologia Pediátrica",
    subtemas: ["Asma", "GINA", "Técnica inalatória"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Criança 8 anos, asma. Últimas 4 sem: tosse/cansaço ≥1x/semana, despertar noturno 1x, B2 antes de educação física 3x/sem. Faz beclometasona HFA 50µg 2j 12/12h. Técnica de aplicação repetida 2x sem espaçador (incorreta). Conduta GINA 2025?",
    alternativas: {
      A: "Associar salbutamol 100µg 4j 12/12h.",
      B: "Ajustar beclometasona para 200µg 1j 12/12h.",
      C: "Corrigir técnica de administração, sem alterar medicações.",
      D: "Referenciar à pneumologia pediátrica."
    },
    gabarito: "C",
    explicacao: "Antes de qualquer step-up no GINA, é OBRIGATÓRIO verificar TÉCNICA INALATÓRIA, adesão, fatores ambientais e diagnóstico. Repetir o jato sem agitação adequada e sem espaçador é técnica INCORRETA - a paciente pode ter asma parcialmente controlada simplesmente por má técnica. CORRIGIR a TÉCNICA primeiro e reavaliar. O uso de espaçador é fundamental em crianças. Encaminhar ao especialista só após confirmar dificuldade do controle apesar de tudo correto."
  },
  {
    n: 64,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Neonatologia/Cirurgia Pediátrica",
    subtemas: ["Hérnia umbilical", "Coto umbilical"],
    dificuldade: "Fácil",
    temImagem: true,
    enunciado: "RN 3 dias com 'aparência umbilical' que preocupa a mãe. Imagem mostra coto umbilical em mumificação. Conduta?",
    alternativas: {
      A: "Encaminhar para cirurgião pediátrico ambulatorialmente.",
      B: "Correção cirúrgica antes da alta.",
      C: "Manter internação e iniciar antibiótico.",
      D: "Conduta expectante, orientar limpeza, não aplicar técnicas compressivas."
    },
    gabarito: "D",
    explicacao: "Hérnia umbilical (ou simplesmente coto umbilical em mumificação): condição FISIOLÓGICA e benigna no RN. Conduta: EXPECTANTE com orientações sobre HIGIENE (limpeza com álcool 70% ou água e sabão), e EVITAR técnicas compressivas/faixas/moedas (não evitam herniação e podem causar lesão). Hérnia umbilical tende a fechar espontaneamente até 4-5 anos. Cirurgia só após 4-5 anos se persistir ou se complicação (rara)."
  },
  {
    n: 65,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Hematologia Pediátrica",
    subtemas: ["Anemia falciforme", "Aplasia transitória", "Parvovírus B19"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Criança 2 anos, anemia falciforme (Hb basal 8,5). Febre + palidez há 3-4 dias. Hb 4,5 (queda significativa), reticulócitos 0,1% (extremamente baixos!), leuco 17.350. Sopro holosistólico. Baço palpável (normal nessa idade). Mecanismo?",
    alternativas: {
      A: "Choque hipovolêmico por retenção esplênica.",
      B: "Sepse e anemia de consumo.",
      C: "Hemólise intravascular disseminada.",
      D: "Anemia sintomática por supressão transitória da eritropoiese medular."
    },
    gabarito: "D",
    explicacao: "CRISE APLÁSICA TRANSITÓRIA na anemia falciforme: queda da Hb basal + RETICULÓCITOS BAIXÍSSIMOS (<1%) = supressão da eritropoiese, classicamente por PARVOVÍRUS B19 (infecta precursores eritroides). Em paciente com hemólise crônica, qualquer pausa eritropoiética causa queda dramática. Sequestro esplênico: baço aumentaria abruptamente E reticulócitos seriam altos. Hiperhemólise: reticulócitos altos. Sepse: leuco mais discrepante."
  },
  {
    n: 66,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Nefrologia Pediátrica",
    subtemas: ["RVU", "Uretrocistografia miccional"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Criança 3a 7m, 1ª ITU febril com tratamento ambulatorial. USG: dilatação pielocalicial sugestiva. Próximo exame?",
    alternativas: {
      A: "Diário miccional (calendário de hábito urinário).",
      B: "Estudo urodinâmico.",
      C: "URETROCISTOGRAFIA MICCIONAL (UCM).",
      D: "Tomografia de abdome."
    },
    gabarito: "C",
    explicacao: "Após ITU FEBRIL em criança <2 anos (ou <3 anos com USG alterada como neste caso): solicitar URETROCISTOGRAFIA MICCIONAL para investigar REFLUXO VESICOURETERAL (RVU). UCM é padrão-ouro para RVU. USG normal não exclui RVU. Diário miccional/urodinâmica em crianças com disfunção vesico-intestinal. TC tem radiação excessiva e não é indicada de rotina."
  },
  {
    n: 67,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Psiquiatria Pediátrica",
    subtemas: ["Depressão", "Câncer pediátrico", "Saúde mental"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Criança 10 anos, neuroblastoma em QT, internado por neutropenia febril. Afebril nas últimas 36h. Família relata que há 3 semanas está abatido, dormindo dia todo, irritado, sem interagir, recusando alimento e atividades. Conduta?",
    alternativas: {
      A: "Privação sensorial por internações; dar alta hospitalar.",
      B: "Ajustamento à doença sem investigações.",
      C: "Solicitar avaliação psiquiátrica e suporte psicológico por suspeita de depressão.",
      D: "Transfusão de hemácias e observar."
    },
    gabarito: "C",
    explicacao: "Sintomas DEPRESSIVOS clássicos em criança com câncer: anedonia, hipersonia, irritabilidade, isolamento social, perda de apetite por >2 semanas. Pacientes oncológicos pediátricos têm RISCO ELEVADO de depressão. Conduta: AVALIAÇÃO PSIQUIÁTRICA + SUPORTE PSICOLÓGICO. Sintomas não devem ser banalizados como 'ajustamento'. Hb 8,6 (baixa mas estável) não justifica os sintomas - paciente em QT com Hb estável."
  },
  {
    n: 68,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Infectologia Pediátrica",
    subtemas: ["Pneumonia complicada", "Pneumonia necrotizante"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Criança 9 anos, D6 de pneumonia em uso de ceftriaxone. Derrame drenado. TC com pneumonia necrotizante. Mantém febre diária mas BEG, reduzindo O2. Cultura: pneumococo sensível à penicilina. Conduta?",
    alternativas: {
      A: "Prescrever cefepime e vancomicina.",
      B: "Solicitar nova avaliação da cirurgia.",
      C: "Repetir tomografia de tórax.",
      D: "Manter antibioticoterapia e suporte."
    },
    gabarito: "D",
    explicacao: "PNEUMONIA NECROTIZANTE PEDIÁTRICA: febre PROLONGADA (até 10-14 dias) é a regra mesmo com tratamento adequado. Critérios para resposta favorável: melhora clínica progressiva (BEG, redução O2), agente identificado e sensível ao antibiótico em uso, ausência de complicações novas. MANTER conduta. Não escalar antibiótico, não repetir TC desnecessária, não indicar cirurgia se evolução clínica favorável. A febre é esperada por dias adicionais."
  },
  {
    n: 69,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Pneumologia Pediátrica",
    subtemas: ["Laringotraqueíte", "Crupe viral"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Criança 2 anos, coriza e febre há 3 dias, evolui com tosse seca, intensa e ESTRIDENTE (estridor) há 1 dia. Tiragem subdiafragmática e de fúrcula, estridor INSPIRATÓRIO audível em repouso. Posição anatômica da complicação e representação fisiológica?",
    alternativas: {
      A: "Acometimento brônquico inferior (asma).",
      B: "Acometimento subglótico (laringotraqueíte/crupe).",
      C: "Acometimento brônquico (bronquiolite).",
      D: "Acometimento alveolar (pneumonia)."
    },
    gabarito: "B",
    explicacao: "CRUPE VIRAL (laringotraqueíte aguda): tosse 'de cachorro' (barking cough) + estridor INSPIRATÓRIO + sinais de desconforto + pródromo de IVAS. Acometimento SUBGLÓTICO (logo abaixo das cordas vocais) - área mais estreita da via aérea pediátrica. RX típica mostra sinal do 'campanário' (steeple sign). Tratamento: corticoide (dexametasona) + adrenalina nebulizada se moderado/grave."
  },
  {
    n: 70,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Emergência Pediátrica",
    subtemas: ["Pneumotórax", "Asma grave", "Toracocentese"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Criança 6 anos, asma. Em uso de β2 IV após falha de medidas iniciais. Monitor: FC 144→198, SpO2 94→? (não captando), PA 88/49→77/38 (hipotensão), ritmo de complexos rápidos. Procedimento?",
    alternativas: {
      A: "Punção venosa central.",
      B: "Intubação orotraqueal.",
      C: "Punção pericárdica.",
      D: "Toracocentese de alívio (descompressão de pneumotórax hipertensivo)."
    },
    gabarito: "D",
    explicacao: "Asmático grave em β2 IV evoluindo com taquicardia extrema + queda da PA + dessaturação + SpO2 não captando = PNEUMOTÓRAX HIPERTENSIVO (complicação clássica da asma grave/ventilação positiva). Conduta: TORACOCENTESE DE ALÍVIO IMEDIATA (no 2º EIC, linha hemiclavicular) sem aguardar exame de imagem. É emergência. O β2 IV inalado/excessiva positiva pode levar a barotrauma."
  },
  {
    n: 71,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Icterícia neonatal", "Aleitamento materno"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "RN a termo, 48h de vida. Perda de peso (gráfico mostra ~-10 a -12%), bilirrubina transcutânea elevada (zona alta). Conduta?",
    alternativas: {
      A: "Manter internado, iniciar fototerapia e coletar bilirrubinas.",
      B: "Manter internado, reavaliar icterícia/peso/diurese em 6h.",
      C: "Alta - icterícia fisiológica.",
      D: "Alta com banho de sol e complemento após o seio."
    },
    gabarito: "A",
    explicacao: "RN com 48h apresentando: 1) PERDA DE PESO EXCESSIVA (>10%); 2) ICTERÍCIA com bilirrubina transcutânea em zona alta (suspeita de necessidade de fototerapia). Conduta: NÃO ALTA. Manter internado, coletar bilirrubinas totais e frações para definir necessidade de fototerapia conforme normograma de Bhutani. Banho de sol é PROIBIDO no manejo da hiperbilirrubinemia neonatal. Otimizar aleitamento materno."
  },
  {
    n: 72,
    banca: "USP/FUVEST 2026",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Reanimação neonatal", "Intubação"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "RN hipotônico, sem choro. Passos iniciais + VPP com máscara sem melhora após correção de técnica. FC ainda 30 bpm. Próximo passo da reanimação - dispositivos para ventilação?",
    alternativas: {
      A: "Máscara laríngea, laringoscópio com lâmina curva, tubo orotraqueal com balonete.",
      B: "Máscara laríngea, laringoscópio com lâmina RETA (Miller), tubo orotraqueal SEM balonete.",
      C: "Cânula orofaríngea, laringoscópio curva, tubo orotraqueal sem balonete.",
      D: "Cânula orofaríngea, laringoscópio curva, tubo orotraqueal com balonete."
    },
    gabarito: "B",
    explicacao: "Falha de VPP com máscara apesar de técnica correta = próximo passo é VPP COM CÂNULA TRAQUEAL ou MÁSCARA LARÍNGEA (SBP 2022). Material para intubação neonatal: LARINGOSCÓPIO COM LÂMINA RETA (Miller 0 para prematuros, Miller 1 para a termo) - a lâmina reta levanta diretamente a epiglote, sendo melhor para anatomia neonatal. TUBO SEM BALONETE em neonatos. A máscara laríngea é alternativa válida quando IOT falha."
  }
);

// ==================== MEDICINA PREVENTIVA / MFC (73-95) ====================
QUESTOES.push(
  {
    n: 73,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Mortalidade proporcional", "Taxa de mortalidade", "Indicadores"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Pop 1: 10.000 óbitos, mortalidade proporcional 48,5%, taxa ajustada 3,2/mil. Pop 2: 2.000 óbitos, 9,7%, 5,1/mil. Pop 3: 8.000 óbitos, 38,8%, 4,5/mil. Qual tem maior risco de morte?",
    alternativas: {
      A: "Pop 1, pela maior mortalidade proporcional.",
      B: "Pop 1, pelo maior número de óbitos.",
      C: "Pop 2, pela maior taxa de mortalidade ajustada.",
      D: "Não é possível comparar."
    },
    gabarito: "C",
    explicacao: "TAXA DE MORTALIDADE (óbitos/população) ajustada por idade é o indicador de RISCO DE MORTE. Mortalidade proporcional (% de mortes em relação ao total) NÃO mede risco - mede distribuição. Maior taxa = maior risco. Pop 2: 5,1/mil é a maior taxa, indicando MAIOR RISCO mesmo tendo menos óbitos absolutos. Número de óbitos depende do tamanho populacional, sem refletir risco individual."
  },
  {
    n: 74,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Medicina de Família",
    subtemas: ["Pré-natal", "SOAP", "Risco psicossocial"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Gestante 22 anos, 12 sem, primigesta, gestação não planejada, náuseas, faltando ao trabalho, pressionada pelo supervisor. Faz academia mas parou por receio. Em uso de ácido fólico, ferro, cálcio. PA 102x60, IMC 24,2. Vacinação prévia OK (3 doses Hep B, 3 dT, COVID, influenza). Melhor PLANO?",
    alternativas: {
      A: "Orientar a não fazer atividade física pelo risco de lesão e parto prematuro.",
      B: "Prescrever ondansetrona e trocar por multivitamínico.",
      C: "Completar vacinação com dTpa e encaminhar à psicologia.",
      D: "Suspender medicamentos e orientar direitos trabalhistas."
    },
    gabarito: "C",
    explicacao: "Plano de pré-natal de boa qualidade: 1) ATUALIZAR VACINAÇÃO: dTpa entre 20-36 sem, hepB se incompleta; 2) ATENDER ASPECTOS PSICOSSOCIAIS: encaminhar para psicologia (gravidez não-planejada, não aceita, risco psicossocial identificado). Manter medicamentos. Atividade física é RECOMENDADA na gestação (orientar adequação, não suspender). Direitos trabalhistas são orientação importante MAS a vacinação dTpa é a única medida ainda ausente no calendário."
  },
  {
    n: 75,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Viés de seleção", "Perda de seguimento"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Coorte de 828 gestantes, 107 perdas. Mulheres perdidas eram MAIS deprimidas, menos escolarizadas, mais solteiras. RR depressão pós-parto = 2,5. Se as perdas retornassem e fossem analisadas, a medida de associação:",
    alternativas: {
      A: "Ficaria estável.",
      B: "Aumentaria.",
      C: "Diminuiria.",
      D: "Não é possível prever."
    },
    gabarito: "B",
    explicacao: "VIÉS DE SELEÇÃO por perda diferencial: as mulheres perdidas eram MAIS DEPRIMIDAS no início (expostas) E provavelmente teriam mais depressão pós-parto (desfecho). Excluí-las SUBESTIMOU a associação real. Se retornassem, mais expostas → mais desfecho positivo no grupo exposto → o RR AUMENTARIA. A perda de seguimento diferencial enviesa a estimativa em direção que pode ser prevista pelo padrão da perda."
  },
  {
    n: 76,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Padronização", "Mortalidade", "Confundimento por idade"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Estudo da mortalidade por COVID-19 ajustada por idade em SP, comparando raça e sexo. Principal motivo para padronizar as taxas por idade?",
    alternativas: {
      A: "Homens têm menor expectativa de vida.",
      B: "Mulheres têm menor taxa de mortalidade.",
      C: "População branca tem maior proporção de idosos, e a padronização permite comparação de populações com diferentes distribuições etárias.",
      D: "População negra tem piores condições de vida."
    },
    gabarito: "C",
    explicacao: "PADRONIZAÇÃO POR IDADE: ajusta taxas para uma estrutura etária comum, controlando o CONFUNDIMENTO por IDADE. Em COVID-19, a idade é o maior fator de risco para óbito. Sem padronização, populações com mais idosos teriam taxas brutas maiores, mascarando outras diferenças. População branca no Brasil tem proporção maior de idosos - a padronização permite comparar adequadamente o efeito de raça INDEPENDENTE da composição etária."
  },
  {
    n: 77,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Tipos de estudo", "Causalidade", "Prevalência"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Tipos de estudos apropriados para: 1) Frequência de TEPT em serviços públicos vs privados; 2) Relação CAUSAL entre abuso na infância e TEPT; 3) Risco de ideação suicida ANOS após o parto em pacientes com TEPT.",
    alternativas: {
      A: "Coorte, caso-controle, ensaio de comunidade.",
      B: "Descritivo, coorte, caso-controle.",
      C: "Transversal, descritivo, coorte.",
      D: "Transversal, caso-controle, coorte."
    },
    gabarito: "D",
    explicacao: "1) FREQUÊNCIA/PREVALÊNCIA = TRANSVERSAL (corte transversal mede prevalência); 2) CAUSALIDADE com exposição PASSADA RARA (abuso) e desfecho = CASO-CONTROLE (parte do desfecho e busca exposição prévia); 3) RISCO FUTURO de evento em expostos ao TEPT = COORTE (acompanha de uma exposição para um desfecho futuro). Coorte é o melhor design para risco/incidência."
  },
  {
    n: 78,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Viés de informação", "Memória", "Odds ratio"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Estudo caso-controle tabagismo x câncer pulmão. Se CONTROLES subestimam o tabagismo (viés de desejabilidade social), efeito sobre o OR?",
    alternativas: {
      A: "O OR será superestimado.",
      B: "O OR será subestimado.",
      C: "O OR permanecerá inalterado.",
      D: "A direção não pode ser determinada."
    },
    gabarito: "A",
    explicacao: "OR = (casos expostos × controles não-expostos) / (casos não-expostos × controles expostos). Se os CONTROLES subestimam (declaram menos exposição que a real), aumenta o nº de 'controles não-expostos' no numerador → OR AUMENTA = SUPERESTIMA a associação. Viés de informação diferencial entre grupos sempre altera a estimativa de risco."
  },
  {
    n: 79,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Ensaios clínicos", "Hipótese nula", "Intervalo de confiança"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "ECR metformina x COVID. Eventos graves: 7 vs 3 (RR 2,50 IC 0,65-9,66). Recuperação: 9 vs 10 dias (RR 0,96 IC 0,89-1,03). Hospitalização: 54 vs 49 (RR 1,25 IC 0,82-1,78). Conclusão?",
    alternativas: {
      A: "Os dados favorecem o uso da metformina.",
      B: "A metformina agravou o quadro.",
      C: "Metformina gerou significativamente mais eventos adversos.",
      D: "Os dados indicam que a hipótese nula não pode ser rejeitada."
    },
    gabarito: "D",
    explicacao: "Para REJEITAR a hipótese nula (efeito = 1 para RR/OR), o INTERVALO DE CONFIANÇA 95% NÃO pode incluir o 1. Em TODOS os desfechos do estudo, o IC95% inclui 1 (eventos graves: 0,65-9,66 inclui 1; recuperação: 0,89-1,03 inclui 1; hospitalização: 0,82-1,78 inclui 1). Portanto, NÃO há diferença estatisticamente significativa em nenhum desfecho. A hipótese nula NÃO pode ser rejeitada."
  },
  {
    n: 80,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "SUS/Políticas de Saúde",
    subtemas: ["Setor privado", "Complementaridade", "Lei 8080"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Programa 'Agora Tem Especialistas': contratação de hospitais privados via venda de capacidade ociosa para ampliar acesso. Qual o caráter da participação privada?",
    alternativas: {
      A: "Suplementar.",
      B: "Complementar.",
      C: "Prestador subsidiário.",
      D: "Organização social."
    },
    gabarito: "B",
    explicacao: "CARÁTER COMPLEMENTAR (Constituição Federal Art. 199 §1 e Lei 8.080/90): quando o SUS contrata serviços do setor privado para SUPRIR DEFICIÊNCIAS de oferta da rede pública, mediante contrato/convênio, com PREFERÊNCIA para entidades filantrópicas. SUPLEMENTAR é o termo para planos de saúde privados (saúde suplementar). Organização social é modelo de gestão indireta. Complementar refere-se à AÇÃO do privado no SUS."
  },
  {
    n: 81,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Caso-controle", "Análise estratificada", "OR"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Caso-controle CA mama x exposição solar em Porto Rico, pele escura. Baixa: 53 casos/54 controles. Moderada: 26/56. Alta: 24/54. Conclusão usando 'baixa' como referência?",
    alternativas: {
      A: "Moderada não tem efeito.",
      B: "Alta é FATOR PROTETOR contra câncer de mama.",
      C: "Alta é fator de risco.",
      D: "Alta não tem efeito."
    },
    gabarito: "B",
    explicacao: "Cálculo OR alta vs baixa: (24×54)/(53×54) = (1296)/(2862) ≈ 0,45. OR < 1 = EFEITO PROTETOR. Pessoas com pele escura têm pouca síntese de vitamina D, e em locais com exposição UV alta, podem produzir mais vitamina D que tem efeito protetor contra CA mama (hipótese atual). Interessante estudo sobre o papel da vitamina D na carcinogênese mamária."
  },
  {
    n: 82,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["NNT", "Redução absoluta de risco"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "ECR sotatercept x placebo (HAP). Sotatercept: 7/84 mortes (8,3%). Placebo: 13/86 mortes (15,1%). NNT?",
    alternativas: {
      A: "15 pacientes para evitar 1 morte.",
      B: "53 pacientes para evitar 1 morte.",
      C: "84 pacientes para evitar mortes em 15%.",
      D: "84 pacientes para evitar mortes em 53%."
    },
    gabarito: "A",
    explicacao: "NNT (Number Needed to Treat) = 1/RRA (Redução Risco Absoluto). Risco placebo: 13/86 = 15,1%. Risco sotatercept: 7/84 = 8,3%. RRA = 15,1% - 8,3% = 6,8% = 0,068. NNT = 1/0,068 ≈ 15. Ou seja, é necessário tratar 15 pacientes com sotatercept para evitar 1 óbito a mais comparado ao placebo."
  },
  {
    n: 83,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Medicina de Família",
    subtemas: ["Climatério", "Manejo inicial"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher 52a, fogachos, sudorese noturna, alterações do sono, ciclos menstruais regulares. Conduta inicial conforme MS?",
    alternativas: {
      A: "Solicitar hormonais de rotina para confirmar diagnóstico.",
      B: "Iniciar TRH para alívio dos sintomas.",
      C: "Prescrever ISRS.",
      D: "Investigar intensidade dos sintomas e orientar estilo de vida."
    },
    gabarito: "D",
    explicacao: "MANEJO INICIAL DO CLIMATÉRIO (MS): O DIAGNÓSTICO É CLÍNICO, não há necessidade de dosagens hormonais de rotina. A primeira abordagem é AVALIAR INTENSIDADE/IMPACTO dos sintomas e ORIENTAR MEDIDAS NÃO-FARMACOLÓGICAS: hábitos de vida (sono, atividade física, redução de gatilhos como cafeína/álcool, técnicas de relaxamento). TRH/ISRS reservados para casos sintomáticos com impacto significativo, após avaliação individual."
  },
  {
    n: 84,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "MFC/SUS",
    subtemas: ["APS", "Sífilis congênita", "Coordenação do cuidado"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Caso de sífilis congênita: VDRL do 1º trimestre não chegou ao prontuário por falha do laboratório. Diagnóstico só na 28ª sem com VDRL 1:64. Parceiro não tratado. RN com sífilis congênita. Atributo APS/princípio SUS não cumprido adequadamente?",
    alternativas: {
      A: "Acesso.",
      B: "Equidade.",
      C: "Universalidade.",
      D: "Coordenação do cuidado."
    },
    gabarito: "D",
    explicacao: "COORDENAÇÃO DO CUIDADO: atributo da APS que envolve integração entre os diversos pontos de atenção, controle de exames, acompanhamento, fluxo de informações entre serviços. Falha do laboratório em enviar resultado + ausência de retomada do exame ausente + parceiro não tratado = FALHA NA COORDENAÇÃO. Acesso/universalidade/equidade referem-se à entrada e oferta dos serviços, que ocorreram aqui."
  },
  {
    n: 85,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Saúde da Mulher",
    subtemas: ["Rastreamento", "CA mama", "CA colo"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 67a, vida sexual ativa. CCO aos 61 e 64a (normais). Mamografia aos 65a (normal). Sem história familiar. Conduta conforme MS?",
    alternativas: {
      A: "Solicitar apenas mamografia.",
      B: "Solicitar apenas CCO.",
      C: "Solicitar mamografia e CCO.",
      D: "Orientar que não há indicação."
    },
    gabarito: "D",
    explicacao: "RASTREAMENTO MS: 1) CCO: 25-64 anos, INTERROMPER aos 64 anos se 2 exames CONSECUTIVOS NEGATIVOS nos últimos 5 anos (esta paciente já cumpriu); 2) MAMOGRAFIA: 50-69 anos bienal. Aos 67 anos, ainda dentro da faixa, mas se já realizou recentemente (aos 65) não há necessidade urgente, podendo aguardar o intervalo. Como ambos os exames mais recentes foram normais e os critérios para encerrar CCO foram cumpridos, opção D é a mais correta. NOTA: alguns serviços ainda recomendam mamografia bienal."
  },
  {
    n: 86,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Medicina de Família",
    subtemas: ["HIV", "PrEP", "Diarreia crônica", "HSH"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem 35a, HSH, em PrEP. Diarreia há 20 dias, sem sangue ou muco. Perda de 1 kg. Sorologias HIV/sífilis/hepatites negativas, pesquisa clamídia/gono retal negativas há 4m. Exame indicado?",
    alternativas: {
      A: "Calprotectina fecal.",
      B: "Sangue oculto.",
      C: "Giardia lamblia nas fezes.",
      D: "Microsporidium spp."
    },
    gabarito: "C",
    explicacao: "DIARREIA CRÔNICA em HSH (após exclusão de IST entérica recente): GIARDÍASE é uma causa altamente prevalente em HSH (transmissão oro-fecal por práticas sexuais). Diarreia >2-3 semanas, sem febre, sem sangue/muco, perda ponderal modesta = padrão clássico de giardíase. Microsporidium = imunossuprimidos graves (CD4 baixíssimo), não em pacientes com PrEP. Calprotectina/SOC para suspeita de DII/CA. Pesquisa de protozoários (Giardia, Entamoeba) em fezes é o primeiro passo."
  },
  {
    n: 87,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Risco relativo", "Leptospirose", "Análise estratificada"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Incidência de leptospirose por % de residências atingidas por inundações: 0-0,1%→0,5; 0,2-0,6%→1,6; 0,7-1,2%→3,3; 1,3-11%→7,3; 11,1-27,9%→21,7 por 100.000 hab. Tomando 0-0,1% como referência, o risco:",
    alternativas: {
      A: "Nos locais 0,2-0,6%, é 3,2 vezes menor.",
      B: "Nos locais 0,7-1,2%, é 6,6 vezes MAIOR.",
      C: "Nos locais 1,3-11%, é 14,6% menor.",
      D: "Nos locais 11,1-27,9%, é 24% maior."
    },
    gabarito: "B",
    explicacao: "RISCO RELATIVO (RR) = incidência exposto / incidência referência. Categoria 0,7-1,2%: RR = 3,3/0,5 = 6,6 vezes MAIOR risco. Categoria 0,2-0,6%: RR = 1,6/0,5 = 3,2x MAIOR (não menor). Categoria 1,3-11%: 7,3/0,5 = 14,6x maior. Categoria 11,1-27,9%: 21,7/0,5 = 43,4x maior. A opção B é a única numericamente CORRETA."
  },
  {
    n: 88,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Infectologia/Saúde Coletiva",
    subtemas: ["Tuberculose", "ILTB", "Contactantes"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Casal com TB pulmonar (7 dias de tratamento). Filha 26 dias de vida, assintomática, em AME, vacinação OK (BCG ao nascer). Conduta?",
    alternativas: {
      A: "Realizar prova tuberculínica.",
      B: "Tratar para ILTB (isoniazida ou rifampicina).",
      C: "Realizar IGRA.",
      D: "Solicitar radiografia de tórax."
    },
    gabarito: "B",
    explicacao: "RN/lactente <5 anos CONTACTANTE de caso bacilífero de TB: TRATAR para ILTB SEM necessidade de PT/IGRA, pois esses exames têm baixa sensibilidade nessa idade. O MS Brasil recomenda: ISONIAZIDA por 6 meses OU RIFAMPICINA por 4 meses para crianças contactantes, mesmo assintomáticas com RX normal. Se assintomáticos e PT/IGRA forem realizados, mantêm-se a profilaxia mesmo se negativos pelo alto risco. RX deve ser feito para descartar doença ativa."
  },
  {
    n: 89,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Vigilância em Saúde",
    subtemas: ["Doenças de notificação", "Esporotricose"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Esporotricose foi incluída na lista de notificação compulsória em 2025. Motivos?",
    alternativas: {
      A: "Crescimento dos casos, alto risco de disseminação, populações vulneráveis e possibilidade de intervenção.",
      B: "Acometimento de áreas urbanas com gatos e profissionais da saúde animal.",
      C: "Apesar de gravidade autolimitada e baixo potencial de disseminação, magnitude e transcendência são elevadas.",
      D: "Determinação da OMS prévia à Comissão Intergestores Tripartite."
    },
    gabarito: "A",
    explicacao: "Critérios para inclusão de doenças na NOTIFICAÇÃO COMPULSÓRIA: 1) MAGNITUDE (crescimento dos casos); 2) RISCO/TRANSCENDÊNCIA (disseminação rápida); 3) VULNERABILIDADE da população afetada; 4) POSSIBILIDADE DE INTERVENÇÃO (controle de fonte/vetor/agente). A esporotricose preenche todos: epidemia crescente no Brasil, transmissão felina urbana, populações vulneráveis, intervenções possíveis (tratamento, controle felino)."
  },
  {
    n: 90,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Saúde Mental",
    subtemas: ["Depressão", "Atividade física", "Manejo inicial"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem 45a, indisposição, redução do ânimo/energia há 4 meses, polifagia por carboidratos, irritabilidade, anedonia. Não acredita em psicoterapia e não gosta de antidepressivos. Pede orientação. Conduta IMEDIATA (consulta de retorno em 4-6 sem):",
    alternativas: {
      A: "Encaminhar para TCC.",
      B: "Prescrever ISRS.",
      C: "Orientar e reforçar necessidade de atividade física.",
      D: "Indicar Hipericum perforatum."
    },
    gabarito: "C",
    explicacao: "Paciente com sintomas depressivos LEVES a MODERADOS que REJEITA psicoterapia e medicamentos. ATIVIDADE FÍSICA tem EVIDÊNCIA ROBUSTA para o tratamento de depressão (comparável a antidepressivos em casos leves-moderados) e o paciente JÁ ESTAVA PRATICANDO (corrida com amigos). Aproveitar a ABERTURA do paciente (autopercepção) é a melhor estratégia inicial. Hipericum tem evidência limitada e múltiplas interações. ISRS/TCC podem ser usados se não houver resposta."
  },
  {
    n: 91,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Medicina de Família/Farmacologia",
    subtemas: ["ECA inibidor x BRA", "Efeitos adversos", "Substituição"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem 58a, HAS, tinha captopril (uso irregular, pressão não baixava). Médico anterior trocou para enalapril e prescreveu nortriptilina para 'ansiedade'. Agora: boca seca, constipação, tontura postural, ansiedade persistente, PA 150x95. Substituir:",
    alternativas: {
      A: "Nortriptilina por fluoxetina.",
      B: "Nortriptilina por diazepam.",
      C: "Enalapril por anlodipino.",
      D: "Enalapril por losartana."
    },
    gabarito: "A",
    explicacao: "NORTRIPTILINA (antidepressivo TRICÍCLICO) causa efeitos ANTICOLINÉRGICOS importantes: BOCA SECA, constipação, retenção urinária, hipotensão postural, taquicardia, sedação - todos os sintomas do paciente. Em idoso/adulto, deve-se EVITAR (Beers Criteria). SUBSTITUIR por ISRS (fluoxetina) que tem perfil melhor. A pressão de 150x95 deve-se a baixa adesão (preguiça/esquecimento), não a falha do enalapril. Diazepam é desaconselhado (dependência, queda)."
  },
  {
    n: 92,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Indicadores", "Tuberculose", "Qualidade da assistência"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Indicador POPULACIONAL para AVALIAÇÃO DA QUALIDADE da assistência aos casos de TB?",
    alternativas: {
      A: "Taxa de incidência da forma pulmonar.",
      B: "Taxa de prevalência da forma pulmonar.",
      C: "Proporção de ABANDONO do tratamento.",
      D: "Proporção de tuberculose miliar."
    },
    gabarito: "C",
    explicacao: "PROPORÇÃO DE ABANDONO DO TRATAMENTO é o indicador POPULACIONAL de QUALIDADE DA ASSISTÊNCIA por excelência. Mostra falha do sistema em manter o paciente em tratamento. Meta MS: <5% de abandono (Caraiporã está em 20% = muito ruim). Incidência/prevalência refletem a transmissão na comunidade (epidemiologia da doença), não qualidade da assistência. Miliar reflete diagnóstico tardio e gravidade dos casos."
  },
  {
    n: 93,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "Saúde da Mulher/Psiquiatria",
    subtemas: ["Compulsão alimentar", "Lisdexanfetamina", "Avaliação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 23a, IMC 26,7 (sobrepeso), 1-2 episódios/mês de compulsão por doces/chocolate. Quer tomar lisdexanfetamina como amiga. Conduta?",
    alternativas: {
      A: "Prescrever fluoxetina e discutir riscos da lisdexanfetamina.",
      B: "Indicar semaglutida.",
      C: "Encaminhar para avaliação psiquiátrica de TCAP/transtorno alimentar.",
      D: "Orientar sobre hábitos alimentares sem exames ou medicações."
    },
    gabarito: "C",
    explicacao: "Episódios compulsivos com perda de controle alimentar + preocupação com peso/imagem corporal = possível TRANSTORNO ALIMENTAR (TCAP - Transtorno de Compulsão Alimentar Periódica). A FREQUÊNCIA de 1-2x/mês não preenche critério estrito de TCAP (≥1x/semana por 3 meses) mas há sinais de alerta. ENCAMINHAR para psiquiatria/equipe especializada para avaliação completa antes de qualquer prescrição. Lisdexanfetamina é uso off-label para perda de peso e tem indicação SOMENTE para TCAP grave após avaliação adequada."
  },
  {
    n: 94,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "SUS/Saúde Pública",
    subtemas: ["Gastos out of pocket", "Financiamento"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre gastos OUT OF POCKET com saúde no Brasil, assinale a correta:",
    alternativas: {
      A: "Planos privados constituem o maior percentual.",
      B: "Comprometimento da renda CRESCE conforme aumenta a renda familiar.",
      C: "Mais da metade do gasto total com saúde é out of pocket.",
      D: "A maior parcela é com MEDICAMENTOS, com proporção mais elevada nas classes mais pobres."
    },
    gabarito: "D",
    explicacao: "GASTOS OUT OF POCKET no Brasil (POF/IBGE): MEDICAMENTOS são a MAIOR parcela e atingem PROPORCIONALMENTE MAIS as classes pobres (têm gastos menores absolutos mas comprometem maior % da renda). Planos privados são significativos mas não a maior parcela do out of pocket geral. Comprometimento da renda é INVERSO à renda (regressividade). Gasto privado é cerca de 47% do total no Brasil (público é minoria, característica peculiar)."
  },
  {
    n: 95,
    banca: "USP/FUVEST 2026",
    especialidade: "Preventiva",
    tema: "SUS/APS",
    subtemas: ["eMulti", "Equipes multiprofissionais"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre as equipes Multiprofissionais na APS (eMulti):",
    alternativas: {
      A: "Teleconsulta não está incorporada no processo de trabalho.",
      B: "Estão vinculadas à APS e também a UPAs e ambulatórios de especialidades.",
      C: "Médicos especialistas (cardiologia, dermatologia, endocrinologia, infectologia, psiquiatria) podem compor as eMulti.",
      D: "Financiamento exclusivo dos municípios."
    },
    gabarito: "C",
    explicacao: "eMULTI (Portaria GM/MS 635/2023): substitui as NASF-AB. PODEM SER COMPOSTAS POR MÉDICOS ESPECIALISTAS de várias áreas (cardio, derma, endócrino, infecto, psiquiatria, ginecologia, pediatria, geriatria, etc) + outros profissionais (psicólogo, nutricionista, fisioterapeuta, fonoaudiólogo, assistente social, etc). Estão VINCULADAS À APS exclusivamente (não a UPA/ambulatório). Teleconsulta É incorporada. Financiamento é tripartite (União, estado, município)."
  }
);

// ==================== GINECOLOGIA E OBSTETRÍCIA (96-120) ====================
QUESTOES.push(
  {
    n: 96,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Psiquiatria/Puerpério",
    subtemas: ["Depressão pós-parto", "Tristeza materna"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 32a, 4 sem pós-parto. Sobrecarregada, cansada, dificuldade para dormir, chora ao bebê dormir, sente que não é boa mãe, irritada, sem prazer em cuidar do filho. Secreção vaginal amarelada abundante. Conduta?",
    alternativas: {
      A: "Passiflora incarnata e USG pélvico.",
      B: "Miconazol tópico e orientar sobre baby blues.",
      C: "Quetiapina à noite e convocar marido.",
      D: "Sertralina e orientar sobre depressão."
    },
    gabarito: "D",
    explicacao: "DEPRESSÃO PÓS-PARTO (não baby blues): 'Baby blues' dura <2 semanas e é leve. AQUI temos: 4 semanas pós-parto, sintomas significativos com prejuízo funcional, anedonia, culpa, irritabilidade = depressão pós-parto. Conduta: SERTRALINA (ISRS, seguro para amamentação) + psicoterapia + orientações + suporte familiar. Secreção vaginal amarelada nesse contexto provavelmente é lóquia normal/lóquia serosa, não necessita tratamento."
  },
  {
    n: 97,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Cardiologia/Obstetrícia",
    subtemas: ["Anemia gestacional", "Cardiopatia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Gestante 30a, 30 sem, prolapso mitral. Cansaço a pequenos esforços, taquicardia. Descorada 1+, PA 108x70, FC 108, IMC 38,2, sopro sistólico aórtico 2+/6+, BCF 146. Hipótese mais provável?",
    alternativas: {
      A: "Estenose aórtica.",
      B: "Anemia sintomática.",
      C: "Arritmia supraventricular.",
      D: "Transtorno de ansiedade."
    },
    gabarito: "B",
    explicacao: "ANEMIA NA GESTAÇÃO é EXTREMAMENTE COMUM (até 40% no 3º trimestre) e principal causa de cansaço/taquicardia em gestantes. Sinais: PALIDEZ (descorada 1+), taquicardia compensatória (108), sopro sistólico EJETIVO funcional (por hiperdinâmica). Prolapso mitral seria sopro de regurgitação mitral, não aórtico. Arritmia teria ritmo irregular. Investigar com hemograma."
  },
  {
    n: 98,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Uroginecologia",
    subtemas: ["Prolapso genital", "POP-Q"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 58a, menopausada, peso vaginal, manobras digitais para evacuar. Parede vaginal posterior ultrapassa hímen em 2cm + colo exterioriza 1cm além do hímen (POP-Q estágio III). Sexualmente ativa. Conduta?",
    alternativas: {
      A: "Pessário vaginal e fisioterapia pélvica.",
      B: "Laser de CO2.",
      C: "Histerectomia vaginal + perineocolporrafia.",
      D: "Colpocleise + estrogênio tópico."
    },
    gabarito: "C",
    explicacao: "POP estágio III sintomático (retocele com pontos POP-Q +2 e prolapso uterino +1, ambos além do hímen) em paciente sexualmente ATIVA = INDICAÇÃO de tratamento CIRÚRGICO RECONSTRUTIVO: HISTERECTOMIA VAGINAL + PERINEOCOLPORRAFIA (correção do compartimento posterior). Colpocleise = obliteração vaginal (apenas para pacientes SEM atividade sexual). Pessário é alternativa não-cirúrgica. Laser não trata prolapso."
  },
  {
    n: 99,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia/Endocrinologia",
    subtemas: ["DMG", "Insulina", "Indução do parto"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Gestante 39a, 40 sem, HAS crônica + DMG. Esquema atual: NPH 12-6-0-6 e Regular 4-4-2-0. INDUÇÃO de parto, com dieta pré-parto ofertada. Prescrição de insulina?",
    alternativas: {
      A: "NPH 4-0-0-0 e regular conforme glicemia.",
      B: "NPH 6-3-0-3 e regular 4-2-2-0.",
      C: "NPH 12-6-0-6 e SG 5% manutenção.",
      D: "Regular conforme glicemia capilar."
    },
    gabarito: "A",
    explicacao: "MANEJO DA INSULINA NO TRABALHO DE PARTO/INDUÇÃO: REDUZIR significativamente as doses pois há jejum/dieta restrita + alto gasto energético. Recomenda-se REDUZIR a dose basal de NPH em 1/3 a 2/3 (geralmente 1/3 da dose da manhã) e usar INSULINA REGULAR CONFORME GLICEMIA CAPILAR (sliding scale). Manter glicemia entre 70-110 mg/dL. NPH 4-0-0-0 (~1/3 da matinal) + regular SOS é adequado."
  },
  {
    n: 100,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Distocia", "Bandl-Frommel", "Iminência de rotura"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Após 6h de TP, dilatação total, cefálico em plano 0 De Lee. Imagem abdominal mostrando ANEL DE BANDL (estrangulamento abdominal em ampulheta entre o segmento inferior distendido e o corpo uterino). Diagnóstico e conduta?",
    alternativas: {
      A: "Distocia funcional – ocitocina.",
      B: "Retenção urinária – sondagem.",
      C: "IMINÊNCIA DE ROTURA UTERINA – CESÁREA imediata.",
      D: "Hipertonia uterina – terbutalina."
    },
    gabarito: "C",
    explicacao: "SINAL DE BANDL: anel patológico visível abdominalmente (entre corpo e segmento inferior, dando aspecto de ampulheta) = IMINÊNCIA DE ROTURA UTERINA. SEMPRE indicar CESÁREA IMEDIATA. Sinal de Frommel: ligamentos redondos tensos e palpáveis. NÃO usar ocitocina (pioraria) NEM terbutalina (não previne rotura). É emergência obstétrica."
  },
  {
    n: 101,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Mastologia",
    subtemas: ["Nódulo mamário na gestação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Gestante 39a, 26 sem. Nodulação de 2,5 cm, profundo, pouco móvel, sem calor local em mama esquerda há 1 mês. Conduta?",
    alternativas: {
      A: "Punção aspirativa guiada por USG (na verdade: CORE biopsy/biópsia por agulha grossa).",
      B: "Mamografia.",
      C: "Clindamicina.",
      D: "Reavaliação em 2 semanas."
    },
    gabarito: "A",
    explicacao: "NODULAÇÃO PALPÁVEL SUSPEITA na GESTAÇÃO (>2cm, profundo, pouco móvel, em paciente >35 anos): NÃO retardar investigação. USG mamária + BIÓPSIA POR AGULHA GROSSA (core biopsy) é o padrão na gestação (a punção aspirativa por agulha fina/PAAF tem menor acurácia, mas a alternativa A no enunciado provavelmente refere-se a investigação invasiva guiada). Mamografia tem baixo rendimento na gestação (mama densa). NÃO aguardar 2 semanas em lesão suspeita."
  },
  {
    n: 102,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Hiperêmese gravídica", "Hipertireoidismo transitório"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Gestante 28a, 10 sem, vômitos há 10 dias, perda 5 kg, TGO/TGP 58/65, BT 0,9, β-hCG 215.000, cetonúria ++, TSH 0,05, T4L 1,1. Interpretação e conduta?",
    alternativas: {
      A: "Cetoacidose diabética – iniciar hidratação.",
      B: "Hiperêmese gravídica com HIPERTIREOIDISMO TRANSITÓRIO – hidratação e antieméticos.",
      C: "Hepatite medicamentosa – suspender e corticoide.",
      D: "Hipertireoidismo autoimune – propiltiouracil."
    },
    gabarito: "B",
    explicacao: "HIPERÊMESE GRAVÍDICA com HIPERTIREOIDISMO TRANSITÓRIO induzido por hCG: vômitos persistentes, perda ponderal, cetonúria, leve alteração hepática (frequente), β-hCG MUITO ELEVADO (mimetiza TSH → suprime TSH e eleva T4L ligeiramente). Tipicamente AUTOLIMITADO até 18-20 sem. Conduta: HIDRATAÇÃO + ANTIEMÉTICOS (passo escalonado: piridoxina, ondansetrona, metoclopramida). NÃO usar antitireoidianos (é transitório, sem doença tireoidiana real). Sem cetoacidose (glicemia normal)."
  },
  {
    n: 103,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia/Ética",
    subtemas: ["Violência sexual", "Aborto legal"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 25a, gestação após violência sexual há 4 semanas (idade gestacional ~6 sem por DUM). Manifesta desejo de interromper. Conduta?",
    alternativas: {
      A: "Interrupção pode ser realizada diante de RELATO CIRCUNSTANCIADO.",
      B: "Indicar pré-natal de alto risco.",
      C: "Orientar boletim de ocorrência ANTES de prosseguir.",
      D: "Sem correlação direta - garantir pré-natal."
    },
    gabarito: "A",
    explicacao: "ABORTO LEGAL POR VIOLÊNCIA SEXUAL (Código Penal Art. 128, II): NÃO exige boletim de ocorrência, laudo do IML, nem autorização judicial. Basta o RELATO CIRCUNSTANCIADO da mulher (presunção de veracidade). Idade gestacional compatível com data da violência. Limite legal não estritamente definido por norma, mas usualmente até 22 sem ou 500g (norma técnica MS). Aos ~6-8 sem, é totalmente viável. Profissional NÃO pode recusar atendimento (objeção de consciência tem regras)."
  },
  {
    n: 104,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Pré-eclâmpsia", "CTG", "Doppler"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Gestante 34 sem 3 dias, secundigesta. PA 148x90, edema importante, AU 29 (PIG?). CTG: DESACELERAÇÃO TARDIA / variabilidade reduzida. Doppler com ALTERAÇÕES (provável fluxo zero/reverso em a. umbilical). Conduta?",
    alternativas: {
      A: "Parto cesárea (sofrimento fetal + provável PE).",
      B: "Indução de parto.",
      C: "Iniciar metildopa e reavaliar.",
      D: "Sulfato de magnésio EV."
    },
    gabarito: "A",
    explicacao: "Sofrimento fetal agudo (DIP TARDIO na CTG = sofrimento fetal hipóxico-isquêmico) + restrição de crescimento (AU 29 com 34 sem) + Doppler alterado + provável pré-eclâmpsia (PA 148x90 + edema) = INTERRUPÇÃO IMEDIATA da gestação. Via: CESÁREA é a mais adequada por sofrimento fetal agudo e via desfavorável (sem trabalho de parto). Sulfato de Mg está indicado peri-parto para neuroproteção fetal + prevenção eclâmpsia, mas não substitui o parto."
  },
  {
    n: 105,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Hemorragia pós-parto", "Choque hemorrágico"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Quintigesta, atonia uterina pós-parto + PA 76x54 + FC 120. Medidas iniciais e correção de atonia em andamento. Conduta hemodinâmica?",
    alternativas: {
      A: "Manter reanimação volêmica com Ringer lactato.",
      B: "Avaliar necessidade de transfusão com Hb/Ht.",
      C: "Iniciar PROTOCOLO DE TRANSFUSÃO MACIÇA.",
      D: "Iniciar noradrenalina em BIC."
    },
    gabarito: "C",
    explicacao: "HEMORRAGIA PÓS-PARTO COM CHOQUE HEMORRÁGICO (PA 76x54, taquicardia, sangramento ativo significativo) = INDICAÇÃO IMEDIATA de PROTOCOLO DE TRANSFUSÃO MACIÇA (ratio 1:1:1 - plasma, plaquetas, hemácias). NÃO esperar Hb/Ht (que pode ser falsamente normal por hemoconcentração inicial). Cristaloide >2L piora coagulopatia dilucional. Noradrenalina sem reposição é prejudicial em choque hemorrágico."
  },
  {
    n: 106,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Ginecologia/Infectologia",
    subtemas: ["ITU", "Cistite simples"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher 26a, disúria + urgência há 3 dias, sem febre, sem corrimento. DIU há 2 anos. Episódio similar há 1,5 anos. Conduta?",
    alternativas: {
      A: "Ciprofloxacino após urina 1 e urocultura.",
      B: "Ceftriaxone sem coleta.",
      C: "Sulfa+trimetropim após urina 1 e urocultura.",
      D: "NITROFURANTOÍNA sem necessidade de coleta."
    },
    gabarito: "D",
    explicacao: "CISTITE NÃO COMPLICADA em mulher jovem: tratamento EMPÍRICO sem necessidade de exames. PRIMEIRA ESCOLHA: NITROFURANTOÍNA 100 mg 6/6h por 5-7 dias (sem resistência cruzada, baixa resistência). Ciprofloxacino: 2ª linha (resistência crescente, efeitos colaterais). Sulfa: resistência E. coli >20% (não recomendado empírico). Ceftriaxone: apenas pielonefrite. ITU recorrente seria ≥2 episódios em 6m ou 3+ em 1 ano (caso não preenche)."
  },
  {
    n: 107,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Endocrinologia/Adolescência",
    subtemas: ["Atraso puberal", "Hipogonadismo"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Adolescente 15a, sem desenvolvimento mamário ou menarca. Baixa estatura (z-score -2). LH 0,2, FSH 1,1 (BAIXOS - hipogonadismo HIPOgonadotrófico), estradiol indetectável. Hipótese?",
    alternativas: {
      A: "Hiperprolactinemia.",
      B: "Disgenesia gonadal.",
      C: "Hiperplasia adrenal congênita.",
      D: "Síndrome de insensibilidade androgênica."
    },
    gabarito: "A",
    explicacao: "ATRASO PUBERAL com FSH/LH BAIXOS = HIPOGONADISMO HIPOGONADOTRÓFICO (problema central). Principais causas: HIPERPROLACTINEMIA (suprime GnRH), tumor hipofisário (craniofaringioma), síndrome de Kallmann, doenças sistêmicas. Disgenesia gonadal (Turner) cursaria com FSH/LH ELEVADOS (hipergonadotrófico). HAC: hiperandrogenismo. Insensibilidade androgênica: fenótipo feminino com cariótipo 46XY, mamas presentes, ausência uterina."
  },
  {
    n: 108,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Endocrinologia Pediátrica",
    subtemas: ["Puberdade precoce", "Avaliação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Menina 6a, telarca progressiva, estágio M2, aceleração de crescimento (z-score +3), exame neurológico normal. Conduta?",
    alternativas: {
      A: "Análise do cariótipo.",
      B: "Dosagem de GH.",
      C: "RESSONÂNCIA MAGNÉTICA DE SNC.",
      D: "USG pélvico."
    },
    gabarito: "C",
    explicacao: "PUBERDADE PRECOCE CENTRAL em MENINA com início <8 ANOS (especialmente <6a): obrigatório descartar CAUSAS ORGÂNICAS DO SNC com RM DE CRÂNIO (hamartomas hipotalâmicos, gliomas, etc) - mais importante quando <6 anos onde a chance de causa orgânica é maior (~20%). Também solicitar: USG pélvico, idade óssea, LH basal e estimulado, estradiol. Em meninos, RM é sempre indicada. Em meninas >6-8 anos, é controversa (rotina vs seletiva)."
  },
  {
    n: 109,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Infectologia",
    subtemas: ["PEP", "HIV", "Violência sexual"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Adolescente 17a, violência sexual há 80 horas, HIV teste rápido negativo. Conduta em relação à PEP?",
    alternativas: {
      A: "Iniciar PEP com esquema de 28 dias.",
      B: "Não iniciar PEP, pois prazo máximo é 72h.",
      C: "Não há indicação pois teste rápido negativo.",
      D: "Aguardar soroconversão em 7 dias."
    },
    gabarito: "B",
    explicacao: "PROFILAXIA PÓS-EXPOSIÇÃO (PEP) ao HIV: tempo MÁXIMO recomendado para início é 72 HORAS após a exposição (PCDT-PEP/MS). Após esse prazo, a eficácia da profilaxia é muito reduzida, NÃO devendo ser iniciada. 80 horas excede o limite. Deve ser oferecido acompanhamento sorológico (3 e 6 meses). Outras medidas: profilaxia hepatite B, IST bacterianas, contracepção de emergência, suporte psicológico/social, notificação."
  },
  {
    n: 110,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Infectologia/IST",
    subtemas: ["Cervicite", "Gonococo", "Clamídia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 24a, cervicite mucopurulenta, NAAT positivo para N. gonorrhoeae e C. trachomatis. Tratamento atual?",
    alternativas: {
      A: "Doxiciclina 100mg VO 7 dias monoterapia.",
      B: "CEFTRIAXONA 500mg IM dose única + DOXICICLINA 100mg VO 7 dias.",
      C: "Ceftriaxona 500mg IM dose única + azitromicina 1g VO dose única.",
      D: "Azitromicina 1g VO 2 doses com 7 dias intervalo."
    },
    gabarito: "B",
    explicacao: "TRATAMENTO ATUALIZADO de CERVICITE/GONORREIA: CEFTRIAXONA 500mg IM dose única + DOXICICLINA 100mg VO 12/12h por 7 dias. A DOXICICLINA substituiu a azitromicina por melhor eficácia em clamídia e baixa resistência. CDC 2021 e PCDT-MS atualizado. Azitromicina só se contraindicação à doxiciclina (gestante)."
  },
  {
    n: 111,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Insuficiência cervical", "Pessário", "Cerclagem"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Gestante 20 sem, secundigesta com parto vaginal anterior (RN 1.800g - prematuro). USG transvaginal: COLO 10mm (curto), abertura com pressão. Conduta?",
    alternativas: {
      A: "Medida do colo seriada.",
      B: "Repouso absoluto.",
      C: "Inserção de PESSÁRIO (ou progesterona).",
      D: "Cerclagem de emergência."
    },
    gabarito: "C",
    explicacao: "COLO CURTO (<25mm no USG TV) em paciente com FATOR DE RISCO (parto prematuro anterior) = TRATAMENTO indicado. Opções: PROGESTERONA VAGINAL (200 mg/dia até 36 sem) - 1ª linha; PESSÁRIO cervical (alternativa, especialmente colo muito curto); CERCLAGEM (se história típica de IIC clássica). Cerclagem de EMERGÊNCIA seria se já houvesse dilatação com membranas em ampulheta - aqui apenas afunilamento. A inserção de pessário é uma alternativa válida quando contraindicado ou indisponível progesterona."
  },
  {
    n: 112,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Trabalho de parto pré-termo", "Tocólise", "Corticoide"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Primigesta 34 sem 3 dias, dor em baixo ventre há 2h. PA 122x84, FC 92. AU 28, dinâmica 2 contrações moderadas/10min, BCF 156. TV: colo médio, 3cm dilatação, bolsa íntegra. Conduta?",
    alternativas: {
      A: "Escopolamina EV e reavaliar em 2h.",
      B: "BETAMETASONA IM + INIBIÇÃO do trabalho de parto.",
      C: "Ampicilina EV e conduzir trabalho de parto.",
      D: "Sulfato de Mg e cesárea imediata."
    },
    gabarito: "B",
    explicacao: "TRABALHO DE PARTO PRÉ-TERMO (34 sem 3 dias com 3cm dilatação e contrações regulares): 1) CORTICOIDE ANTENATAL (betametasona) para maturação pulmonar até 34 sem 6 dias (alguns protocolos até 36 sem 6 dias); 2) TOCÓLISE para ganhar tempo (24-48h) para ação do corticoide (nifedipina/indometacina); 3) Pesquisa Strep B + ATB se desconhecido. Como ainda está dentro da janela de corticoide e tocólise, a opção B é a mais adequada."
  },
  {
    n: 113,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Climatério",
    subtemas: ["TRH", "Sintomas vasomotores", "Apetite"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher 52a, ciclos a cada 45 dias há 5 meses, perda de libido, cansaço, esquecimento, mais apetite, ganho de peso. NEGA TROMBOSE/CV. Mucosa vaginal sem atrofia. Quer medicação para sono e apetite. Tratamento mais indicado?",
    alternativas: {
      A: "Testosterona.",
      B: "ESTROGÊNIO + PROGESTERONA.",
      C: "Topiramato.",
      D: "Sertralina."
    },
    gabarito: "B",
    explicacao: "Mulher na PERIMENOPAUSA (irregularidade menstrual + sintomas climatéricos múltiplos: insônia/cansaço, hiperfagia, déficit cognitivo leve, perda libido). Sem contraindicações para TRH (sem TEV, sem CV). TRH COMBINADA (estrogênio + progesterona) é o tratamento mais eficaz para SINTOMAS CLIMATÉRICOS amplos e pode melhorar sono, humor, cognição. Sertralina trata só sintomas vasomotores isolados. Testosterona só para queixas de libido isoladas. Topiramato não tem indicação."
  },
  {
    n: 114,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Oncologia/HIV",
    subtemas: ["Rastreamento CA colo", "HIV"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 36a, HIV+ carga indetectável, CD4 830, 2 citologias prévias normais. Estratégia de rastreamento de CA de colo?",
    alternativas: {
      A: "CITOLOGIA ONCÓTICA ANUAL.",
      B: "Citologia + teste HPV cada 3 anos.",
      C: "Colposcopia + citologia anual.",
      D: "Teste HPV cada 5 anos."
    },
    gabarito: "A",
    explicacao: "MULHER COM HIV: RASTREAMENTO de CA DE COLO É DIFERENCIADO mesmo com boa imunidade: CITOLOGIA ANUAL (após 2 negativas consecutivas no início do diagnóstico). Em pacientes com CD4 <200 ou HIV mal controlado: 6/6 meses no 1º ano. Iniciar rastreio ao diagnóstico do HIV independente de idade. Rastreio por HPV-DNA isolado/co-teste não substitui em HIV+. Colposcopia só com citologia alterada."
  },
  {
    n: 115,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Planejamento Familiar",
    subtemas: ["Método de Billings", "Muco cervical"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher 25a, deseja método natural. Método de Billings - como reconhecer PERÍODO FÉRTIL?",
    alternativas: {
      A: "Muco TRANSPARENTE, VISCOSO e ESCORREGADIO.",
      B: "Muco espesso, opaco e não-aderente.",
      C: "Muco opaco com filância até 2cm.",
      D: "Muco esbranquiçado, grumoso e aderente."
    },
    gabarito: "A",
    explicacao: "MÉTODO DE BILLINGS (ovulação): muco do PERÍODO FÉRTIL = MUCO 'EM CLARA DE OVO' = transparente, fluido, viscoso, ESCORREGADIO, com FILÂNCIA aumentada (estiramento >6cm). Este aspecto é devido aos estrógenos ovulatórios. Períodos não-férteis: muco escasso, espesso, opaco, esbranquiçado, grumoso, sem filância. A mulher abstém-se nas relações nos dias de muco fértil + 3 dias após."
  },
  {
    n: 116,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Planejamento Familiar",
    subtemas: ["SAAF", "Contracepção", "LES"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 30a, LES + SAAF, 2 TVPs prévias, em uso de varfarina + prednisona + HCQ + AZA. Em remissão. Deseja contracepção. Opção mais segura?",
    alternativas: {
      A: "DIU DE COBRE.",
      B: "DIU com levonorgestrel.",
      C: "Pílula com etinilestradiol + LNG.",
      D: "Contraceptivo transdérmico combinado."
    },
    gabarito: "A",
    explicacao: "SAAF (síndrome anti-fosfolípide) + LES com TEV prévias: CONTRACEPTIVOS HORMONAIS COMBINADOS são CATEGORIA 4 (contraindicação absoluta) por risco trombótico. Métodos seguros (categoria 1-2): DIU de COBRE (não-hormonal, totalmente seguro), DIU LNG (geralmente categoria 1-2 mas em SAAF/LES ativo com antifosfolípides positivos é categoria 3, pois mesmo progesterona isolada tem algum risco - pelo MEC OMS). MAIS SEGURA = DIU DE COBRE (sem hormônios, sem risco trombótico). Mantém ciclos normais sem interferência."
  },
  {
    n: 117,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Uroginecologia",
    subtemas: ["Incontinência urinária mista"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 64a, multípara, obesa, perda urinária AO ELEVAR PESO (esforço) E quando há URGÊNCIA (incontinência mista). Urodinâmica compatível. Conduta imediata?",
    alternativas: {
      A: "Uretrotomia interna.",
      B: "Colpouretropexia.",
      C: "Estrogênio tópico.",
      D: "Anticolinérgicos."
    },
    gabarito: "D",
    explicacao: "INCONTINÊNCIA URINÁRIA MISTA (esforço + urgência): tratamento INICIAL é direcionado ao COMPONENTE PREDOMINANTE/MAIS INCÔMODO. Geralmente inicia-se com o tratamento da URGEINCONTINÊNCIA primeiro (a paciente refere urgência primeiramente). Tratamento: 1ª linha - mudanças de hábitos + fisioterapia + ANTICOLINÉRGICOS (oxibutinina, solifenacina) ou β3-agonista (mirabegrona). Cirurgia (sling) só após otimização do tratamento conservador. Estrogênio tópico ajuda como adjuvante mas não é monoterapia."
  },
  {
    n: 118,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Endometriose",
    subtemas: ["Manejo pós-operatório"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 29a, cólica menstrual + menorragia. ENDOMETRIOSE PERITONEAL confirmada por laparoscopia com excisão das lesões. Conduta terapêutica?",
    alternativas: {
      A: "AINH.",
      B: "Contraceptivo oral combinado.",
      C: "DIU DE PROGESTAGÊNIO.",
      D: "Análogo do GnRH."
    },
    gabarito: "C",
    explicacao: "ENDOMETRIOSE pós-cirurgia: MANUTENÇÃO HORMONAL para prevenir recorrência (que é muito alta sem tratamento). Opções de 1ª linha: PROGESTAGÊNIOS (DIU-LNG, dienogeste, desogestrel) OU contraceptivos combinados em uso contínuo. DIU-LNG tem VANTAGEM ADICIONAL: trata MENORRAGIA (queixa principal!) + atrofia endometrial + prevenção da recorrência. Análogos de GnRH só para casos refratários (efeitos colaterais hipoestrogênicos). AINH é apenas sintomático."
  },
  {
    n: 119,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Sangramento Uterino Anormal",
    subtemas: ["Mioma", "DIU LNG"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher 42a, menorragia (fluxo intenso, 10 dias) há 6 meses. Útero aumentado com miomas (maior 5cm subseroso/intramural). Indicado DIU de progesterona. OBJETIVO?",
    alternativas: {
      A: "Reduzir fluxo sanguíneo ao útero.",
      B: "Bloquear ciclo ovulatório.",
      C: "Promover involução dos leiomiomas.",
      D: "Promover ATROFIA ENDOMETRIAL."
    },
    gabarito: "D",
    explicacao: "DIU-LNG (Mirena®) na menorragia/mioma: o mecanismo principal é a ATROFIA ENDOMETRIAL pela liberação local de levonorgestrel - reduz o volume menstrual em até 90%. O DIU-LNG NÃO REDUZ os miomas (não tem efeito significativo no volume dos miomas, apenas tratamento sintomático). NÃO bloqueia ovulação em ~85% das mulheres. NÃO age sobre fluxo arterial uterino. Apenas atrofia endometrial sintomática."
  },
  {
    n: 120,
    banca: "USP/FUVEST 2026",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia/Infectologia",
    subtemas: ["Estreptococo B", "Profilaxia", "Endocardite"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Tercigesta secundípara, estenose mitral reumática, 37 sem 6 dias, trabalho de parto espontâneo, bolsa rota há 8h. Strep B desconhecido. Parto vaginal não-complicado. Profilaxia antibiótica?",
    alternativas: {
      A: "Ampicilina.",
      B: "Cefazolina.",
      C: "Ampicilina + clindamicina.",
      D: "Não há indicação."
    },
    gabarito: "A",
    explicacao: "Duas indicações de profilaxia ATB neste cenário: 1) PROFILAXIA DE STREPTOCOCCUS GRUPO B (Strep B desconhecido + RPMO ≥18h em ≥37 sem) = AMPICILINA EV; 2) PROFILAXIA DE ENDOCARDITE INFECCIOSA em cardiopatia valvar reumática para parto vaginal NÃO complicado = NÃO indicada de rotina pela AHA atual (apenas para cardiopatias de alto risco como prótese, EI prévia, cardiopatias cianóticas). AMPICILINA cobre ambos os cenários: Strep B + serve para EBI se necessário. Cefazolina é alternativa para Strep B se alergia leve. Clinda para alergia grave."
  }
);

console.log("Total de questões:", QUESTOES.length);

// ==================== EC6 COLOPROCTOLOGIA - Bloco 1 (121-150) ====================
// Cirurgia Geral / Trauma / Hemorragia Digestiva / Hérnias
QUESTOES.push(
  {
    n: 121,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Gastroenterologia/HDA",
    subtemas: ["Úlcera péptica", "Classificação de Forrest", "AINEs"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 45 anos, epigastralgia, hematêmese e melena há 24h. Uso de diclofenaco há 3 dias por lombalgia. PA 90x70, FC 120, Hb 5,0, INR 1,1. Após reposição volêmica, EDA visualiza no bulbo duodenal lesão (vaso visível não sangrante na úlcera). Classificação e tratamento?",
    alternativas: {
      A: "Forrest 1B - tratamento endoscópico com esclerose e bloqueador H2 + profilaxia de PBE.",
      B: "Forrest 2B - remoção endoscópica do coágulo e esclerose se necessário + bloqueador H2.",
      C: "Forrest 2A - tratamento endoscópico com duas técnicas + bloqueador H2 em dose plena.",
      D: "Forrest 2A - tratamento endoscópico e embolização endovascular + bloqueador H2."
    },
    gabarito: "C",
    explicacao: "CLASSIFICAÇÃO DE FORREST para HDA por úlcera péptica: 1A = sangramento ativo em jato; 1B = babação ativa; 2A = VASO VISÍVEL NÃO SANGRANTE (alto risco de ressangramento ~50%); 2B = coágulo aderido; 2C = hematina; 3 = base limpa. Tratamento de Forrest 2A: TERAPIA ENDOSCÓPICA DUPLA (adrenalina + termo/clipe ou esclerose) + IBP (não H2!) em altas doses. Erro do enunciado: deveria ser IBP em dose plena, mas a opção C é a única coerente com 2A + terapia dupla. Embolização (D) é resgate se falha endoscópica."
  },
  {
    n: 122,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma Torácico",
    subtemas: ["Hemotórax tardio", "Fratura de costela"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Hemotórax tardio (entre 2 e 40 dias após o trauma). Qual a origem mais provável?",
    alternativas: {
      A: "Fratura de costela.",
      B: "Fratura de esterno.",
      C: "Lesão pulmonar.",
      D: "Lesão da artéria intercostal."
    },
    gabarito: "D",
    explicacao: "HEMOTÓRAX TARDIO: complicação rara mas conhecida, geralmente por LESÃO DA ARTÉRIA INTERCOSTAL associada a fratura de costela, onde fragmentos podem erodir o vaso ao longo dos dias/semanas. A pressão arterial sistêmica do vaso explica o sangramento progressivo. Fratura de costela isolada (A) sangra do osso (autolimitado). Lesão pulmonar dá sangramento precoce e autolimita pela baixa pressão do circuito pulmonar. Esterno raramente associa com hemotórax."
  },
  {
    n: 123,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Hérnias",
    subtemas: ["Hérnia de Littre", "Divertículo de Meckel", "Hérnia inguinal"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 51 anos, abaulamento inguinal direito agudo doloroso, irredutível, com dor abdominal. Operado por incisão inguinal: 50 mL líquido sanguinolento no saco herniário + DIVERTÍCULO DE INTESTINO DELGADO de 6 cm com base isquêmica. Tipo de hérnia?",
    alternativas: {
      A: "de Littre.",
      B: "Amyand.",
      C: "de Richter.",
      D: "de Spiegel."
    },
    gabarito: "A",
    explicacao: "HÉRNIA DE LITTRE: hérnia contendo DIVERTÍCULO DE MECKEL (divertículo de intestino delgado) dentro do saco herniário. Pode encarcerar/estrangular. Hérnia de AMYAND = apêndice cecal no saco herniário inguinal. Hérnia de RICHTER = apenas parte da circunferência da alça (pinçamento), risco de necrose sem obstrução. Hérnia de SPIEGEL = hérnia ventral pela linha semilunar (lateral ao reto abdominal)."
  },
  {
    n: 124,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma Torácico",
    subtemas: ["Pneumotórax hipertensivo", "Choque", "Drenagem"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 20 anos, FAF transfixante em hemitórax direito (entrada 3º EIC + saída 4º EIC linha axilar média). PA 70x50, FC 120, SpO2 86%, MV ausente à direita, percussão timpânica. Tratamento imediato?",
    alternativas: {
      A: "Intubação orotraqueal e ventilação mecânica.",
      B: "Máscara não-reinalante e drenagem torácica.",
      C: "Máscara não-reinalante e iniciar protocolo de transfusão maciça.",
      D: "Drenagem torácica e iniciar protocolo de transfusão maciça."
    },
    gabarito: "D",
    explicacao: "PNEUMOTÓRAX HIPERTENSIVO (MV ausente + timpanismo + choque) + ferimento transfixante = drenagem torácica IMEDIATA + protocolo de transfusão maciça (PA 70x50 = choque hemorrágico). A drenagem alivia o pneumotórax E permite avaliar/tratar o hemotórax associado. IOT em paciente com pneumotórax hipertensivo NÃO DRENADO pode causar parada (VPP piora). Não basta máscara - é necessário descomprimir + tratar o choque."
  },
  {
    n: 125,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Síndrome de Ogilvie", "Necrose cecal", "Colectomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 65 anos, D5 pós-revascularização miocárdica. Pseudo-obstrução de Ogilvie tratada por colonoscopia descompressiva. 24h após: dor abdominal + pneumoperitônio à radiografia. Laparotomia: NECROSE NO CECO COM PERFURAÇÃO e distensão do cólon. Conduta cirúrgica?",
    alternativas: {
      A: "Cecostomia.",
      B: "Colectomia total.",
      C: "Colectomia parcial direita com ileostomia e colostomia.",
      D: "Colectomia parcial com anastomose ileocólica manual."
    },
    gabarito: "C",
    explicacao: "PERFURAÇÃO CECAL com peritonite em paciente crítico (pós-CRVM, instável) + cólon distendido = COLECTOMIA DIREITA com ILEOSTOMIA + COLOSTOMIA (cirurgia em dois tempos, sem anastomose primária em contexto séptico/contaminado). Anastomose primária (D) é contraindicada em peritonite/instabilidade. Colectomia total seria excessiva. Cecostomia (A) deixa o cólon necrótico in situ."
  },
  {
    n: 126,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Hérnias",
    subtemas: ["Hérnia femoral estrangulada", "Necrose intestinal"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 45 anos, abaulamento inguinal direito 15 cm, irredutível, hiperemiado, doloroso há 2 dias. Cirurgia por incisão inguinal: alça intestinal NECRÓTICA (azulada) saindo abaixo do ligamento inguinal. Diagnóstico e tratamento?",
    alternativas: {
      A: "Hérnia femoral estrangulada - laparotomia infraumbilical + ressecção da alça + reparo com tela.",
      B: "Hérnia femoral estrangulada - ressecção da alça e reparo com tela pela incisão inguinal.",
      C: "Hérnia inguinal estrangulada - ressecção da alça + correção com tela + videolaparoscopia.",
      D: "Hérnia inguinal encarcerada - aumentar anel, aquecer a alça, reduzir conteúdo + reparo com tela."
    },
    gabarito: "A",
    explicacao: "HÉRNIA FEMORAL ESTRANGULADA: mulher, abaulamento abaixo do ligamento inguinal, mais comum em mulheres, alto risco de estrangulamento. Com NECROSE INTESTINAL = LAPAROTOMIA INFRAUMBILICAL para ressecção segura da alça necrótica (acesso à cavidade) + reparo herniário. Reparo com TELA está CONTRAINDICADO em campo CONTAMINADO/séptico (necrose/perfuração) - reparo deve ser PRIMÁRIO. Erro da banca em manter 'reparo com tela' em alça necrótica - mas é a opção menos errada pela via correta."
  },
  {
    n: 127,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Hematologia/Trauma",
    subtemas: ["Tromboelastograma", "Coagulopatia"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "No tromboelastograma (TEG/ROTEM), qual segmento, quando DIMINUÍDO, representa FALTA DE PLAQUETAS?",
    alternativas: {
      A: "ML (lise máxima).",
      B: "CT (tempo de coagulação).",
      C: "CFT (tempo de formação do coágulo).",
      D: "MCF (firmeza máxima do coágulo)."
    },
    gabarito: "D",
    explicacao: "TROMBOELASTOGRAMA - parâmetros: CT (tempo de coagulação) = início da formação do coágulo → reflete FATORES de coagulação; CFT (tempo de formação) = velocidade da polimerização → reflete fibrinogênio + plaquetas; MCF (FIRMEZA MÁXIMA DO COÁGULO) = força final do coágulo → reflete PLAQUETAS + FIBRINOGÊNIO (principalmente plaquetas em FIBTEM normal); ML = fibrinólise. MCF diminuído = TROMBOCITOPENIA ou disfunção plaquetária."
  },
  {
    n: 128,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma Abdominal",
    subtemas: ["Hematoma retroperitoneal", "Zonas retroperitoneais", "Damage control"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "FAF no flanco esquerdo. Laparotomia: 3 lesões transfixantes de delgado (20, 30 e 35 cm do Treitz) + HEMATOMA NA ZONA 2 ESQUERDA, NÃO PULSÁTIL e SEM EXPANSÃO durante cirurgia. Conduta?",
    alternativas: {
      A: "Apenas ressecção e anastomose primária do delgado.",
      B: "Apenas desbridamento e sutura dos ferimentos + drenagem.",
      C: "Ressecção e anastomose primária + EXPLORAÇÃO do hematoma de zona II.",
      D: "Grampeamento das lesões + compressas em zona II + peritoneostomia."
    },
    gabarito: "C",
    explicacao: "ZONAS DO RETROPERITÔNIO: Zona I (central - aorta/cava) - SEMPRE explorar; Zona II (flancos - rim, ureter, cólon ascendente/descendente) - explorar SE PENETRANTE (FAF), pulsátil, em expansão; Zona III (pélvica) - NÃO explorar em trauma fechado, explorar se penetrante. Como este é trauma PENETRANTE (FAF), mesmo hematoma sem expansão = EXPLORAR para descartar lesão renal/ureteral/cólon. Anastomose primária OK por estabilidade hemodinâmica."
  },
  {
    n: 129,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Diverticulite complicada", "Abscesso", "Hinchey"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 78 anos, constipada, dor abdominal em baixo ventre há 2 sem, parada de evacuação, calafrios. Plastrão palpável em hipogástrio. TC: coleção com paredes espessadas + gás 8x7x5 cm (~150 mL) no mesogástrio/hipogástrio, em contato com sigmoide, aderências entre alças ileais. Diagnóstico e tratamento?",
    alternativas: {
      A: "Perfuração por corpo estranho - ATB e colonoscopia.",
      B: "Tumor de cólon - colonoscopia para diagnóstico e tratamento.",
      C: "Videolaparoscopia diagnóstica e drenagem.",
      D: "Diverticulite complicada - ATB e drenagem percutânea por radiologia intervencionista."
    },
    gabarito: "D",
    explicacao: "DIVERTICULITE AGUDA COMPLICADA - HINCHEY II: abscesso pélvico/intra-abdominal a distância (não pericólico). Tratamento: ATB + DRENAGEM PERCUTÂNEA guiada por imagem para abscessos >3-4 cm. Apresentação clássica: idosa, dor em FIE/hipogástrio, plastrão. A localização em sigmoide com diverticulose é a etiologia mais provável. Colonoscopia ESTÁ CONTRAINDICADA na fase aguda (risco de perfuração). Cirurgia reservada para falha do tratamento conservador."
  },
  {
    n: 130,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Parede Abdominal",
    subtemas: ["Lesão de artéria epigástrica", "Paracentese", "Complicações"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 34 anos, ascite. Paracentese diagnóstica realizada. 1h após: dor abdominal intensa. TC mostra hematoma de parede abdominal. Diagnóstico e tratamento?",
    alternativas: {
      A: "Lesão da artéria EPIGÁSTRICA - angio-embolização.",
      B: "Lesão de veia umbilical - laparotomia e ligadura.",
      C: "Hematoma muscular - drenagem cirúrgica.",
      D: "Tumor de parede com necrose - biópsia."
    },
    gabarito: "A",
    explicacao: "LESÃO DE ARTÉRIA EPIGÁSTRICA INFERIOR: complicação clássica da paracentese (e procedimentos abdominais inferiores). A artéria corre na parede posterior do músculo reto abdominal. Para EVITAR a lesão, o local correto da paracentese é em REGIÃO LATERAL (~3 cm medial e cefálico à espinha ilíaca anterossuperior) ou linha alba. Tratamento: ANGIO-EMBOLIZAÇÃO por radiologia intervencionista (minimamente invasivo, eficaz). Laparotomia raramente necessária."
  },
  {
    n: 131,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma Abdominal",
    subtemas: ["Choque hemorrágico", "Damage control", "FAST"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 53 anos, trauma abdominal contuso. Inicialmente FC 128, PA 88 sist, Glasgow 14. Recebeu 1.750 mL Ringer + 1g transamin. Na admissão terciária: FC 133, PA 53x34, Glasgow 13, enchimento >5s, descorado, FAST+ HEPATORRENAL. Conduta?",
    alternativas: {
      A: "IOT sequência rápida + protocolo transfusão maciça + noradrenalina + tomografia.",
      B: "IOT sequência retardada + transfusão de hemácias + angio-TC.",
      C: "IOT sequência retardada + droga vasoativa + ECG + curva enzimática.",
      D: "Protocolo de transfusão maciça + noradrenalina + LAPAROTOMIA EXPLORADORA."
    },
    gabarito: "D",
    explicacao: "CHOQUE HEMORRÁGICO CLASSE IV (PA 53x34, FC 133, perfusão crítica) + FAST POSITIVO + responder mal à reposição cristalóide = INSTABILIDADE HEMODINÂMICA com FONTE INTRA-ABDOMINAL = LAPAROTOMIA EXPLORADORA IMEDIATA + protocolo de transfusão maciça. NÃO PERDER TEMPO COM TC em paciente instável (regra de ouro do ATLS: instável + FAST+ vai para sala). Noradrenalina em choque hemorrágico só após restauração de volume."
  },
  {
    n: 132,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Colecistite aguda", "Tokyo Guidelines"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 75 anos, dor HD há 3 dias, T 37,5°C, Murphy+, FC 112, leuco 23.000. USG: vesícula com cálculos + parede espessada/delaminada, sem dilatação biliar. Tratamento mais adequado?",
    alternativas: {
      A: "ATB e colecistectomia eletiva.",
      B: "ATB e colecistectomia em até 72 horas.",
      C: "Drenagem percutânea biliar + cirurgia em 24-48h.",
      D: "Estabilização clínica + ATB + colecistectomia em 3 meses."
    },
    gabarito: "B",
    explicacao: "COLECISTITE AGUDA (Murphy+, leucocitose, parede espessada/delaminada à USG): TOKYO GUIDELINES recomendam COLECISTECTOMIA PRECOCE (até 72h dos sintomas, ou no mesmo internamento) para colecistite Grau I/II. Reduz complicações, internação e morbidade comparado à cirurgia tardia. ATB perioperatório. Colecistectomia eletiva (A) só se >72h e BEG. Drenagem percutânea (C) reservada para casos GRAVES (III) com falha clínica ou risco cirúrgico proibitivo."
  },
  {
    n: 133,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Apendicite aguda", "Videolaparoscopia"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 24 anos, dor abdominal em FID, vômitos, diarreia há 4 dias. Dor à palpação e descompressão (DB+). Leuco 26.500, PCR 38. Imagens compatíveis com apendicite. Sequência de tratamento?",
    alternativas: {
      A: "Videolaparoscopia diagnóstica/terapêutica + ATB profilática.",
      B: "Laparotomia exploradora.",
      C: "ATB - tratamento para moléstia inflamatória pélvica.",
      D: "Reposição volêmica + ATB + videolaparoscopia."
    },
    gabarito: "D",
    explicacao: "APENDICITE AGUDA COMPLICADA (4 dias de evolução, peritonite com DB+, leucocitose alta, PCR elevada). Conduta: 1) REPOSIÇÃO VOLÊMICA (paciente possivelmente desidratada/séptica); 2) ANTIBIÓTICO TERAPÊUTICO (não profilático - é peritonite); 3) VIDEOLAPAROSCOPIA para apendicectomia + lavagem da cavidade. Em apendicite NÃO complicada (<48h), profilaxia ATB é suficiente. Em complicada, ATB é terapêutico por 5-7 dias."
  },
  {
    n: 134,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma Torácico",
    subtemas: ["Hemotórax retido"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Hemotórax retido é:",
    alternativas: {
      A: "100 mL de coágulos diagnosticados por TC após drenagem.",
      B: "300 mL de sangue na pleura após 24h diagnosticado por TC.",
      C: "Sangue ocupando 1/3 do espaço pleural, não removido por dreno, <24h.",
      D: "Sangue ocupando 1/3 do espaço pleural, não removido por dreno, >72h."
    },
    gabarito: "D",
    explicacao: "HEMOTÓRAX RETIDO (EAST/AAST): sangue que persiste na cavidade pleural APÓS 72 HORAS de drenagem torácica adequada, ocupando >300 mL ou >1/3 do espaço pleural. Risco: empiema, fibrotórax, encarceramento pulmonar. Tratamento: VATS (videotoracoscopia) para evacuação. NÃO se define hemotórax retido nas primeiras 24h (ainda pode drenar). Volumes menores que 300 mL podem ser observados."
  },
  {
    n: 135,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Divertículo de Meckel", "Tecido ectópico"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Achado intraoperatório de DIVERTÍCULO DE MECKEL com nódulo de 1 cm no ápice. Lesão mais frequente?",
    alternativas: {
      A: "Leiomioma.",
      B: "Carcinoide.",
      C: "Adenocarcinoma.",
      D: "Tecido gástrico ectópico."
    },
    gabarito: "B",
    explicacao: "DIVERTÍCULO DE MECKEL: divertículo verdadeiro do íleo (regra dos 2s: 2% da população, 2 pés do íleo, 2 polegadas, 2% sintomáticos, 2 tipos de mucosa ectópica). TECIDO ECTÓPICO mais comum = GÁSTRICO (causa sangramento - cintilografia com pertecnetato). Mas em NÓDULO/TUMORAÇÃO no ápice, a neoplasia mais comum é o TUMOR CARCINOIDE (neuroendócrino) - 33-50% dos tumores do Meckel. Por isso ressecção é recomendada se incidentalmente achado."
  },
  {
    n: 136,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Íleo biliar", "Obstrução intestinal"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 70 anos, dor epigástrica/HD há 5 dias + anorexia. Leuco 23.000, BT 1,6 (D 0,8), PCR 61. TC mostra (clássico): aerobilia + obstrução intestinal + cálculo ectópico no delgado. Suspeita clínica?",
    alternativas: {
      A: "Colangite aguda supurativa.",
      B: "Colecistite aguda enfisematosa.",
      C: "Obstrução intestinal por íleo biliar.",
      D: "Trombose mesentérica."
    },
    gabarito: "C",
    explicacao: "ÍLEO BILIAR: tríade de Rigler na TC = 1) AEROBILIA (gás na via biliar); 2) OBSTRUÇÃO INTESTINAL; 3) CÁLCULO ECTÓPICO (geralmente no íleo terminal). Fisiopatologia: fístula bilio-entérica (colecistoduodenal) por colecistite crônica permite passagem do cálculo, que impacta no íleo. Idosos, mulheres. Tratamento: ENTEROLITOTOMIA (retirada do cálculo) - colecistectomia em 2º tempo. Colangite teria febre/tríade de Charcot."
  },
  {
    n: 137,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma/Anatomia Cirúrgica",
    subtemas: ["Manobras de exposição", "Kocher", "Cattell-Braasch"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Imagem cirúrgica mostra mobilização do bloco duodeno-pancreático + cólon direito + raiz do mesentério (exposição completa do retroperitônio direito). Nome da manobra?",
    alternativas: {
      A: "Kocher (apenas duodeno).",
      B: "Mattox (retroperitônio esquerdo).",
      C: "Cattell (apenas cólon direito).",
      D: "Cattell-Braasch."
    },
    gabarito: "D",
    explicacao: "MANOBRA DE CATTELL-BRAASCH: mobilização completa do CÓLON DIREITO + DUODENO + CABEÇA DO PÂNCREAS + RAIZ DO MESENTÉRIO, expondo TODO O RETROPERITÔNIO DIREITO (cava, aorta direita, vasos renais direitos, ureter). Combina Cattell (cólon direito) + Kocher (duodeno-pâncreas) + secção da raiz do mesentério. KOCHER isolada = só duodeno/cabeça do pâncreas. MATTOX = rotação medial visceral ESQUERDA (cólon E, baço, pâncreas, rim E) para expor retroperitônio esquerdo (aorta)."
  },
  {
    n: 138,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Apendicite", "Cirurgia laparoscópica"],
    dificuldade: "Fácil",
    temImagem: true,
    enunciado: "Paciente, 26 anos, dor em hipogástrio/FID há 1 dia, T 38,5°C, anorexia, dor à palpação em FID SEM sinais de irritação peritoneal. TC com apendicite NÃO complicada. Tratamento?",
    alternativas: {
      A: "Colonoscopia.",
      B: "Colectomia parcial com anastomose primária.",
      C: "Apendicectomia por VIDEOLAPAROSCOPIA.",
      D: "Apendicectomia por laparotomia."
    },
    gabarito: "C",
    explicacao: "APENDICITE AGUDA NÃO COMPLICADA: tratamento padrão atual = APENDICECTOMIA VIDEOLAPAROSCÓPICA. Vantagens sobre laparotomia: menor dor pós-op, menor tempo de internação, retorno mais rápido às atividades, menor taxa de infecção de ferida, melhor visualização da cavidade (especialmente em mulheres). Laparotomia (D) reservada para casos com peritonite grave, instabilidade, ou inexperiência laparoscópica. Tratamento ATB isolado é alternativa em casos selecionados, mas não foi opção aqui."
  },
  {
    n: 139,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["Trauma duodenal", "Lesão posterior gástrica"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 19 anos, ferimento por arma branca em epigástrio. Laparotomia: ferimento GÁSTRICO ANTERIOR visível. Tratamento cirúrgico recomendado?",
    alternativas: {
      A: "Gastroduodenopancreatectomia cefálica.",
      B: "Sutura ferimento gástrico anterior + procura/sutura ferimento gástrico POSTERIOR + colecistectomia com colangio.",
      C: "Sutura ferimento gástrico anterior + procura/sutura ferimento gástrico POSTERIOR + drenagem pancreática.",
      D: "Gastrectomia (diverticulação duodenal) + colecistectomia + dreno de Kehr + drenagem pancreática."
    },
    gabarito: "C",
    explicacao: "FERIMENTO PENETRANTE EM EPIGÁSTRICO: princípio cirúrgico = SEMPRE INSPECIONAR a PAREDE POSTERIOR do estômago (pelo ligamento gastrocólico/transcavidade dos epíplons), pois lesão transfixante é frequente. Após sutura das lesões gástricas (anterior + posterior), DRENAGEM da loja pancreática (proximidade anatômica, risco de lesão pancreática inadvertida e fístula). Não há indicação de colecistectomia neste contexto. Pancreatoduodenectomia (Whipple) só para lesões catastróficas."
  },
  {
    n: 140,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["RCU fulminante", "Colite refratária", "Colectomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 30 anos, RCU em uso de mesalazina há 5 anos. Diarreia com sangue há 3 dias (8x/dia). Internado, ATB + hidratação. Evolui com enterorragia maciça, PA 90x70, FC 120, Hb 10→7 g/dL. Após reanimação, mantém enterorragia. Cirurgia indicada. Conduta?",
    alternativas: {
      A: "COLECTOMIA SUBTOTAL e ILEOSTOMIA.",
      B: "Colectomia subtotal + ileorretoanastomose.",
      C: "Proctocolectomia total com ileostomia.",
      D: "Proctocolectomia total com pouch-anal anastomose."
    },
    gabarito: "A",
    explicacao: "RCU FULMINANTE / EMERGÊNCIA com HEMORRAGIA MACIÇA refratária: cirurgia de escolha = COLECTOMIA SUBTOTAL + ILEOSTOMIA TERMINAL + preservação do COTO RETAL (reto fechado em bolsa de Hartmann ou colostomia mucosa). Vantagens: cirurgia mais simples e segura em paciente crítico/desnutrido/corticodependente, evita proctectomia em condições adversas, preserva opções futuras (pouch ileal pode ser feito em 2º tempo após estabilização). Proctocolectomia em 1 tempo é morbidade excessiva em emergência."
  },
  {
    n: 141,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia/Trauma",
    subtemas: ["Trauma vesical", "Ruptura extraperitoneal"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 49 anos, agredido há 3 dias, sem urinar há 2 dias, dor abdominal, equimose hipogástrica. PA 177x86, próstata aumentada ao toque. Cr 4,9, ureia 96. TC com ruptura vesical EXTRAPERITONEAL e hematoma pélvico. Conduta?",
    alternativas: {
      A: "Tratamento não operatório.",
      B: "SONDAGEM VESICAL POR 2 SEMANAS.",
      C: "Laparoscopia diagnóstica/terapêutica.",
      D: "Paracentese diagnóstica + ATB."
    },
    gabarito: "B",
    explicacao: "RUPTURA VESICAL EXTRAPERITONEAL (mais comum, geralmente associada à fratura pélvica): tratamento CONSERVADOR com SONDA VESICAL DE DEMORA por 10-14 dias + ATB. Cistografia de controle. Ruptura INTRAPERITONEAL é sempre CIRÚRGICA (extravasamento para cavidade peritoneal = peritonite). A elevação da Cr e ureia pode ser por reabsorção da urina extravasada pelo peritônio. Próstata elevada + equimose pode ser por hematoma pélvico ou trauma uretral associado."
  },
  {
    n: 142,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer de pâncreas", "Laparoscopia diagnóstica", "Estadiamento"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Adenocarcinoma de pâncreas: massa 2,8 cm em processo uncinado, contato de 120° com VMS, sem metástase em TC. CA 19-9 = 120 U/mL. Característica MAIS PREDITIVA para metástase oculta na laparoscopia diagnóstica?",
    alternativas: {
      A: "Nível de CA-19-9.",
      B: "Tamanho do tumor.",
      C: "Localização do tumor.",
      D: "Envolvimento da veia mesentérica superior."
    },
    gabarito: "A",
    explicacao: "Em adenocarcinoma de pâncreas borderline-resectable, a LAPAROSCOPIA DIAGNÓSTICA é usada para detectar METÁSTASES OCULTAS (carcinomatose, hepáticas pequenas) não vistas em TC. Fatores preditivos de metástase oculta: 1) CA 19-9 ELEVADO (>200-500 U/mL = alto risco; este 120 é intermediário); 2) Tumor de CORPO/CAUDA (mais que cabeça); 3) Tamanho >3 cm. O CA 19-9 é o MELHOR preditor isolado segundo guidelines NCCN."
  },
  {
    n: 143,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Anatomia Cirúrgica",
    subtemas: ["Nervos da região inguinal", "Complicações pós-apendicectomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 30 anos, pós-apendicectomia McBurney, dor em região inferior do abdome e FACE INTERNA DA COXA + desconforto local. Cicatriz normal. Lesão de qual nervo?",
    alternativas: {
      A: "Ilioinguinal.",
      B: "Ílio-hipogástrico.",
      C: "Lateral da coxa (cutâneo femoral lateral).",
      D: "Genitofemoral."
    },
    gabarito: "A",
    explicacao: "NERVO ILIOINGUINAL (L1): inerva pele do ABDOMEN INFERIOR + REGIÃO INGUINAL + RAIZ DA COXA INTERNA + escroto/grande lábio. Curso lateral ao ânulo inguinal interno, vulnerável em incisão de McBurney. Ílio-hipogástrico: pele suprapúbica. Genitofemoral: ramo genital (cremaster, escroto/lábio) + femoral (face anterior da coxa superior, não interna). Cutâneo femoral lateral: face LATERAL da coxa (meralgia parestésica). Lesão do ilioinguinal causa dor crônica na inguinotomia."
  },
  {
    n: 144,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Anatomia Cirúrgica",
    subtemas: ["Cervicotomia", "Nervo vago", "Laríngeo recorrente"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Em cervicotomia exploradora, secção acidental de estrutura nervosa (linha vermelha A na imagem) - identificada como nervo vago ANTES da emergência do laríngeo recorrente. Estrutura e alteração esperada?",
    alternativas: {
      A: "Nervo vago - arritmia cardíaca.",
      B: "Nervo vago antes da liberação do nervo laríngeo recorrente - ROUQUIDÃO.",
      C: "Nervo frênico - diminuição do MV em base direita.",
      D: "Ramo do plexo braquial - alteração de movimentação do braço."
    },
    gabarito: "B",
    explicacao: "NERVO LARÍNGEO RECORRENTE emerge do VAGO no tórax (à direita ao redor da a. subclávia; à esquerda ao redor do arco aórtico) e ASCENDE até inervar a musculatura intrínseca da LARINGE. Se o vago for seccionado ABAIXO da emergência do recorrente → preserva fonação (o recorrente já saiu). Se for seccionado ACIMA (no pescoço, antes da emergência intratorácica não se aplica, mas no contexto da questão, antes da liberação significa proximal ao nível onde o ramo se origina) → ROUQUIDÃO por paralisia de prega vocal."
  },
  {
    n: 145,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Tricobezoar", "Síndrome de Rapunzel"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Menina, 12 anos, dor epigástrica, anorexia, sem evacuar há 3 dias. Massa epigástrica palpável. Mãe relata queda de cabelo há 1 ano (usa dreads para disfarçar). TC: imagem em 'redemoinho' compatível com TRICOBEZOAR gástrico. Tratamento?",
    alternativas: {
      A: "Esvaziamento manual (endoscópico).",
      B: "Laparotomia e GASTROTOMIA.",
      C: "Colectomia parcial e colostomia.",
      D: "Lavagem intestinal com solução glicerinada."
    },
    gabarito: "B",
    explicacao: "TRICOBEZOAR (síndrome de RAPUNZEL quando extensão para delgado) em criança com TRICOTILOMANIA + TRICOFAGIA: a remoção endoscópica é GERALMENTE IMPOSSÍVEL pela CONSISTÊNCIA FIRME e GRANDE TAMANHO da massa. Tratamento: LAPAROTOMIA + GASTROTOMIA para extração em bloco. Acompanhamento psiquiátrico essencial (transtorno compulsivo). Bezoares de matéria vegetal (fitobezoar) podem ser dissolvidos com coca-cola ou removidos por endoscopia. Tricobezoar: sempre cirúrgico."
  },
  {
    n: 146,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Pós-operatório", "Fístula", "Coleção"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "D5 pós-colectomia subtotal por enterorragia. Apesar de ileostomia funcionante: anorexia, febre, leucocitose 18.500, PCR 40, albumina 2,0. RX/TC mostram SNE BEM POSICIONADA + coleção abdominal. Tratamento?",
    alternativas: {
      A: "Laparotomia exploradora.",
      B: "DRENAGEM PERCUTÂNEA.",
      C: "Iniciar dieta pela SNE - está bem posicionada.",
      D: "Não iniciar dieta + acesso central + nutrição parenteral."
    },
    gabarito: "B",
    explicacao: "COLEÇÃO ABDOMINAL pós-operatória + sinais infecciosos sistêmicos (febre, leucocitose, PCR elevada, hipoalbuminemia) + paciente sem peritonite difusa = DRENAGEM PERCUTÂNEA guiada por imagem é o tratamento de escolha. Permite controle do foco séptico sem reoperação. Após drenagem, ATB direcionada + nutrição enteral (a SNE bem posicionada permite). Reoperação (A) reservada para falha da drenagem ou peritonite. Nutrição parenteral é última opção (atrofia intestinal, infecção de cateter)."
  },
  {
    n: 147,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma/Coloproctologia",
    subtemas: ["Trauma de cólon", "Reparo primário"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 26 anos, FAF em flanco esquerdo. Laparotomia mostra lesão de cólon (perfuração única, paciente estável, contaminação mínima). Tratamento?",
    alternativas: {
      A: "Exteriorização do ferimento.",
      B: "Sutura + colostomia de proteção.",
      C: "Ressecção e ANASTOMOSE PRIMÁRIA.",
      D: "Colectomia parcial e colostomia (Hartmann)."
    },
    gabarito: "C",
    explicacao: "TRAUMA DE CÓLON em paciente ESTÁVEL com perfuração simples (lesão pequena, sem desvitalização, contaminação mínima, sem choque, sem múltiplas transfusões): REPARO PRIMÁRIO (sutura ou ressecção + anastomose) é o padrão atual conforme estudos randomizados. Colostomia/Hartmann só em: instabilidade, contaminação maciça, múltiplas lesões, desvitalização extensa, transfusão maciça, lesões associadas graves. Política antiga de 'todo trauma de cólon = colostomia' está superada."
  },
  {
    n: 148,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Hérnias",
    subtemas: ["Hérnia umbilical estrangulada", "Tela em contaminação"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 80 anos, hérnia umbilical estrangulada há 6h com necrose intestinal. Conduta cirúrgica?",
    alternativas: {
      A: "Enterectomia segmentar + hernioplastia COM TELA.",
      B: "Enterectomia segmentar + fechamento da parede SEM TELA.",
      C: "Enterectomia + fechamento aponeurose + curativo vácuo (peritoneostomia).",
      D: "Ampliar para laparotomia mediana + revisão + fechamento com poligalactina 1."
    },
    gabarito: "B",
    explicacao: "HÉRNIA UMBILICAL ESTRANGULADA com NECROSE INTESTINAL: campo CONTAMINADO. ENTERECTOMIA + fechamento SEM TELA. TELA SINTÉTICA está CONTRAINDICADA em campo contaminado (alto risco de infecção, fistulização, necessidade de retirada). Em casos selecionados, telas biológicas podem ser consideradas, mas não são padrão de cuidado. Reparo PRIMÁRIO da aponeurose (sutura simples) com fio inabsorvível ou de absorção lenta é a melhor opção. Vácuo só se síndrome compartimental ou laparotomia ampliada."
  },
  {
    n: 149,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma/Vascular",
    subtemas: ["Hematoma de zona I", "Manobra de Mattox"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Trauma abdominal contuso, instabilidade + FAST+. Laparotomia: HEMATOMA RETROPERITONEAL CENTRAL (zona I esquerda - supramesocólica). Manobra de exposição cirúrgica?",
    alternativas: {
      A: "Manobra de MATTOX.",
      B: "Manobra de Cattell-Braasch.",
      C: "Abordagem direta do hematoma.",
      D: "Toracotomia esquerda + clampeamento aorta descendente."
    },
    gabarito: "A",
    explicacao: "MANOBRA DE MATTOX (rotação medial visceral esquerda): mobilização medial do cólon E + baço + cauda do pâncreas + rim E + estômago, expondo o retroperitônio ESQUERDO completo - AORTA SUPRA E INFRARRENAL, tronco celíaco, artéria mesentérica superior, vasos renais esquerdos. Ideal para hematoma ZONA I (central/grandes vasos). Catell-Braasch expõe retroperitônio DIREITO (cava). Toracotomia D para clampeamento aórtico é manobra de SALVAMENTO em parada iminente. Nunca abordagem direta em hematoma central!"
  },
  {
    n: 150,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["Trauma perineal", "Colostomia derivativa"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 30 anos, motociclista, FERIMENTO PERINEAL extenso com sangramento contido. Anel pélvico estável, FAST negativo. Estabilizado, levado ao centro cirúrgico. Conduta?",
    alternativas: {
      A: "Tamponamento + laparotomia + COLOSTOMIA + ATB.",
      B: "Limpeza + avaliação canal anal/reto + hemostasia + tamponamento + ATB.",
      C: "Limpeza após avaliação retal + sutura/aproximação + COLOSTOMIA + ATB.",
      D: "Reconstrução do períneo + drenagem + ATB."
    },
    gabarito: "C",
    explicacao: "TRAUMA PERINEAL COMPLEXO: avaliar lesões associadas (reto, canal anal, esfíncteres, uretra). Princípios: 1) Limpeza/desbridamento; 2) Avaliação da extensão (retossigmoidoscopia); 3) Reparo primário das lesões viáveis; 4) COLOSTOMIA DERIVATIVA para proteção (essencial em lesões retais e perineais extensas, evita contaminação fecal da ferida); 5) ATB amplo espectro. Lesões pequenas extra-peritoneais podem dispensar colostomia, mas em ferimentos extensos, é mandatória. Reconstrução definitiva em 2º tempo após cicatrização."
  }
);

console.log("Bloco 1 EC6 (121-150) adicionado");

// ==================== EC6 COLOPROCTOLOGIA - Bloco 2 (151-180) ====================
// Cirurgia do Aparelho Digestivo: esôfago, estômago, pâncreas, fígado, vias biliares
QUESTOES.push(
  {
    n: 151,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Esofágica",
    subtemas: ["Hérnia hiatal paraesofágica", "Cirurgia anti-refluxo"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 78 anos, asmática, com grande hérnia hiatal e migração intratorácica do estômago. IMC 30,5. Nega disfagia/vômitos, refere apenas leve empachamento. Conduta?",
    alternativas: {
      A: "Cirurgia + tela INABSORVÍVEL no hiato para evitar recidiva.",
      B: "Cirurgia + tela ABSORVÍVEL no hiato.",
      C: "Afastar complicações (anemia, doenças esofágicas/gástricas) e conduta EXPECTANTE (paciente oligossintomática).",
      D: "Manometria esofágica para programar cirurgia."
    },
    gabarito: "C",
    explicacao: "GRANDE HÉRNIA HIATAL PARAESOFÁGICA EM IDOSA OLIGOSSINTOMÁTICA: paradigma mudou - antigamente todas eram operadas pelo risco de complicações catastróficas. Estudos atuais (Stylopoulos) mostram que o risco de morte/complicação aguda é baixo (~1% ao ano) em pacientes assintomáticas/oligossintomáticas, e a morbimortalidade da cirurgia em idosos pode superar esse risco. Conduta atual: afastar complicações silenciosas (anemia ferropriva, esofagite, úlcera) e SEGUIMENTO. Cirurgia indicada se SINTOMÁTICA."
  },
  {
    n: 152,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer esofágico avançado", "Neoadjuvância"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 53 anos, tabagista/etilista, CEC de língua tratado com QT/RT. EDA: lesão infiltrativa em esôfago médio (23 cm) - CEC moderadamente diferenciado. TC com linfonodos adjacentes. PET-CT capta no esôfago e em pequeno linfonodo. Tratamento?",
    alternativas: {
      A: "Esofagectomia Ivor Lewis para evitar anastomose cervical em área irradiada.",
      B: "QT/RT definitivas (paciente já foi irradiado).",
      C: "Ecoendoscopia para avaliar tratamento endoscópico.",
      D: "Discussão multidisciplinar + provavelmente neoadjuvância com QT/RT."
    },
    gabarito: "D",
    explicacao: "CEC DE ESÔFAGO MÉDIO LOCALMENTE AVANÇADO (cT3N1 provável pelo PET): manejo PADRÃO atual = TRATAMENTO MULTIDISCIPLINAR com QT/RT NEOADJUVANTE (protocolo CROSS) seguida de esofagectomia. Apesar da QT/RT prévia em outra topografia (CEC de língua), o tratamento neoadjuvante para CEC esofágico continua indicado, com planejamento radioterápico adequado evitando sobreposição. RT 'definitiva' (B) apenas se não-cirúrgico. Ivor Lewis (anastomose torácica) é uma opção para CEC distal, não médio."
  },
  {
    n: 153,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Tumor neuroendócrino", "Tumor de cauda do pâncreas"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 65 anos, achado incidental em RM: nódulo sólido 4,0 cm na cauda do pâncreas, hipervascularizado na fase arterial, com restrição à difusão. Exame mais adequado para estadiamento?",
    alternativas: {
      A: "Laparoscopia diagnóstica.",
      B: "PET-CT Ga68-DOTATATE.",
      C: "PET-CT com 18F-FDG.",
      D: "TC de tórax, abdome e pelve."
    },
    gabarito: "B",
    explicacao: "LESÃO HIPERVASCULARIZADA na fase ARTERIAL + restrição à difusão em pâncreas = sugere TUMOR NEUROENDÓCRINO PANCREÁTICO (NET). Adenocarcinoma seria HIPOVASCULAR. Para estadiamento de NET, o exame de eleição é o PET-CT com Ga68-DOTATATE (ligando para receptores de somatostatina, altamente expresso em NETs bem diferenciados). PET-FDG (C) só capta NETs pouco diferenciados/G3 ou carcinomas neuroendócrinos. TC já foi feita (RM). Laparoscopia não tem papel no estadiamento inicial de NET."
  },
  {
    n: 154,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer gástrico precoce", "ESD vs gastrectomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 68 anos, ECOG 1, lesão ulcerada 8 mm em grande curvatura (transição corpo-antro). Biópsia: adenocarcinoma DIFUSO de Lauren. Ecoendoscopia: cT1b (SUBMUCOSA) cN0. Conduta?",
    alternativas: {
      A: "Ressecção endoscópica submucosa (ESD).",
      B: "Gastrectomia em cunha sem linfadenectomia.",
      C: "Gastrectomia subtotal com linfadenectomia D1+.",
      D: "Gastrectomia total com linfadenectomia D2."
    },
    gabarito: "C",
    explicacao: "CÂNCER GÁSTRICO PRECOCE (T1b - invasão de submucosa) tipo DIFUSO de Lauren: INDICAÇÃO CIRÚRGICA. ESD (A) é critério para T1a (mucosa), tipo INTESTINAL, <2 cm, sem ulceração, bem diferenciado - este caso não preenche por ser DIFUSO + submucosa. T1b tem risco de metástase linfonodal ~15-20%, exigindo linfadenectomia. Para câncer DISTAL (antro/transição), GASTRECTOMIA SUBTOTAL com LINFADENECTOMIA D1+ (T1) ou D2 (T2+) é adequada. Gastrectomia TOTAL (D) só para tumores de corpo proximal/cárdia ou difusos extensos."
  },
  {
    n: 155,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "DRGE/Cirurgia Esofágica",
    subtemas: ["DRGE refratária", "Disfagia pós-fundoplicatura"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 52 anos, regurgitação noturna importante há 6 meses, EDA: esofagite grau A. IBP por 3 meses sem resposta clínica. Foi indicada fundoplicatura total + hiatoplastia para 'DRGE refratária'. Evoluiu com DISFAGIA importante pós-op. Análise?",
    alternativas: {
      A: "Pseudoacalasia causada por hiato apertado.",
      B: "INDICAÇÃO CIRÚRGICA FOI PRECIPITADA - não foram afastados diagnósticos diferenciais.",
      C: "Indicação correta - DRGE refratária = tratamento cirúrgico.",
      D: "Esofagite grau A afasta o diagnóstico de DRGE (Lyon 2.0)."
    },
    gabarito: "B",
    explicacao: "CASO CLÁSSICO DE INDICAÇÃO CIRÚRGICA PRECIPITADA: paciente com REGURGITAÇÃO + esofagite GRAU A (achado INESPECÍFICO pelo Consenso de Lyon 2.0) + falha de IBP. Antes de operar DRGE 'refratária' é OBRIGATÓRIO: 1) pHmetria/impedanciometria para CONFIRMAR refluxo patológico; 2) MANOMETRIA para descartar TRANSTORNOS MOTORES (acalasia, motilidade ineficaz); 3) Avaliar diagnósticos diferenciais (acalasia, esofagite eosinofílica, gastroparesia). 'Pseudoacalasia' por hiato apertado existe (A), mas a verdadeira falha foi não investigar antes."
  },
  {
    n: 156,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "DRGE",
    subtemas: ["Esôfago de Barrett", "Seguimento endoscópico"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre o esôfago de BARRETT como complicação da DRGE:",
    alternativas: {
      A: "Fundoplicatura ideal é PARCIAL (dismotilidade esofágica frequente).",
      B: "Tratamento cirúrgico pode estabilizar epitélio colunar e reduzir risco de adenocarcinoma, mas o SEGUIMENTO ENDOSCÓPICO deve ser MANTIDO.",
      C: "Cirurgia libera o paciente do seguimento endoscópico.",
      D: "pHmetria 24h deve ser realizada em todos para programar tratamento."
    },
    gabarito: "B",
    explicacao: "ESÔFAGO DE BARRETT: metaplasia intestinal do epitélio escamoso → risco de DISPLASIA → ADENOCARCINOMA. O tratamento da DRGE (clínico OU cirúrgico) pode estabilizar/regredir parte do Barrett, mas NÃO ELIMINA O RISCO de progressão para câncer. Por isso o SEGUIMENTO ENDOSCÓPICO com biópsias deve ser MANTIDO conforme protocolo (Seattle), mesmo após fundoplicatura bem-sucedida. Pacientes com Barrett geralmente têm dismotilidade leve, mas fundoplicatura TOTAL é o padrão se motilidade adequada."
  },
  {
    n: 157,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Pâncreas",
    subtemas: ["Pancreatite crônica", "Cirurgia derivativa"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 52 anos, etilista crônico, dor epigástrica com piora pós-prandial, perda de 7 kg/6m. TC: pâncreas atrófico, ducto pancreático dilatado (9 mm), calcificações intraductais. Sem lesão focal. Tratamento?",
    alternativas: {
      A: "Pancreatoscopia e litotripsia.",
      B: "Derivação PANCREATOJEJUNAL (Puestow/Partington-Rochelle).",
      C: "Alcoolização do plexo celíaco.",
      D: "Reposição de enzimas pancreáticas."
    },
    gabarito: "B",
    explicacao: "PANCREATITE CRÔNICA com DUCTO DILATADO (>7 mm) + DOR INTRATÁVEL + CALCIFICAÇÕES: indicação clássica de CIRURGIA DE DRENAGEM - PROCEDIMENTO DE PUESTOW/PARTINGTON-ROCHELLE (pancreatojejunostomia látero-lateral em Y de Roux). Ducto dilatado permite anastomose efetiva, alivia hipertensão ductal e dor em ~80% dos casos. Litotripsia (A) é opção menos invasiva mas com resultado inferior. Alcoolização do plexo (C) é paliativo temporário. Enzimas (D) tratam insuficiência exócrina, NÃO a dor."
  },
  {
    n: 158,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Esôfago",
    subtemas: ["Acalasia", "Investigação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 45 anos, disfagia progressiva para sólidos há 2 anos, agora pastosos. EDA normal há 10 meses. Nega zona endêmica para Chagas, perdeu 5 kg. Conduta?",
    alternativas: {
      A: "Prosseguir investigação com RX contrastado de esôfago e MANOMETRIA.",
      B: "Repetir endoscopia (câncer de esôfago).",
      C: "Cardiomiotomia endoscópica (POEM) se confirmar acalasia.",
      D: "EDA normal + epidemiologia negativa para Chagas afasta acalasia."
    },
    gabarito: "A",
    explicacao: "DISFAGIA PROGRESSIVA + perda ponderal + EDA NORMAL = sugere TRANSTORNO MOTOR (ACALASIA, espasmo difuso, motilidade ineficaz). EDA normal NÃO AFASTA acalasia (especialmente em fases iniciais sem dilatação). Investigação adequada: 1) RX CONTRASTADO de esôfago (sinal do bico de pássaro, megaesôfago); 2) MANOMETRIA ESOFÁGICA (padrão-ouro - confirma acalasia, classifica em tipos I/II/III pela Chicago). Chagas é apenas UMA causa de acalasia - acalasia idiopática existe globalmente."
  },
  {
    n: 159,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["GIST", "Tumor estromal", "Imunohistoquímica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 63 anos, abaulamento subepitelial gástrico 1,7 cm na 4ª camada (muscular própria). Punção: neoplasia fusocelular, <5 mitoses/50CGA. IHQ: DOG-1+, CD117+, actina ML+. Diagnóstico e conduta?",
    alternativas: {
      A: "Leiomioma, seguimento endoscópico.",
      B: "Leiomioma, ressecção cirúrgica.",
      C: "GIST, RESSECÇÃO CIRÚRGICA.",
      D: "GIST, seguimento endoscópico."
    },
    gabarito: "C",
    explicacao: "GIST (Tumor Estromal Gastrointestinal): marcadores ESPECÍFICOS = CD117 (c-KIT) POSITIVO + DOG-1 POSITIVO (alta especificidade). Origem na 4ª camada (muscular própria), origem nas células intersticiais de Cajal. Para GIST gástrico ≥2 cm = INDICAÇÃO DE RESSECÇÃO (estudos mostram que mesmo pequenos podem ter potencial maligno; >2 cm sempre operar). <2 cm pode ser seguido. Cirurgia: ressecção em cunha com margens livres, SEM linfadenectomia (GIST não metastatiza por linfa). Imatinib adjuvante se risco intermediário/alto."
  },
  {
    n: 160,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Indicações", "Bypass gástrico"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 66 anos, DM2 controlado (1 droga), dislipidêmico, IMC 43, sem HAS, sem sarcopenia, ECOG bom, com ESOFAGITE GRAU C de LA. Melhor opção terapêutica?",
    alternativas: {
      A: "Gastrectomia vertical (sleeve) - é idoso.",
      B: "Balão intragástrico - sem indicação cirúrgica.",
      C: "BYPASS GÁSTRICO se apto - benefícios em múltiplos aspectos.",
      D: "Encaminhar para endocrinologia - não preenche critérios ANS."
    },
    gabarito: "C",
    explicacao: "BYPASS GÁSTRICO em Y de Roux é PREFERÍVEL em: DRGE/ESOFAGITE GRAVE (GRAU C de LA), DM2 (melhores resultados metabólicos), HÉRNIA HIATAL. SLEEVE (A) é CONTRAINDICADO em esofagite grave/DRGE significativa (pode piorar). Idade 66 anos NÃO é contraindicação se boa funcionalidade/ECOG. IMC 43 + comorbidades preenche critérios ANS (IMC ≥35 + comorbidade ou IMC ≥40). Balão (B) é temporário, não trata definitivamente. Endocrinologia (D) já tentou."
  },
  {
    n: 161,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepática",
    subtemas: ["CHC", "Segmentação hepática", "Couinaud"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 61 anos, hepatite C tratada (RVS). Nódulo hepático 4,5 cm à RM com contraste, padrão típico de CHC (wash-in arterial e wash-out portal). Localização (pela imagem) em segmento HEPÁTICO POSTERIOR DIREITO. Child A6, MELD 7. Diagnóstico e segmento?",
    alternativas: {
      A: "Carcinoma hepatocelular, segmento 4a.",
      B: "Colangiocarcinoma intra-hepático, segmento 5.",
      C: "CHC, SEGMENTO 7.",
      D: "CHC, segmento 8."
    },
    gabarito: "C",
    explicacao: "Padrão clássico de CHC à RM: realce arterial intenso (wash-in) + lavagem na fase portal/equilíbrio (wash-out) + cápsula. Em paciente com hepatopatia crônica (hep C tratada, mas com risco residual), a imagem típica DISPENSA biópsia (LI-RADS 5). SEGMENTAÇÃO de COUINAUD: lobo direito = segmentos 5, 6, 7, 8. Segmento 7 = POSTERIOR SUPERIOR direito (acima da veia porta direita posterior). Segmento 8 = ANTERIOR superior direito. Segmento 4 = lobo médio. Pela descrição posterior, segmento 7."
  },
  {
    n: 162,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepática",
    subtemas: ["Setorectomia", "Veias hepáticas"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Após CHC em segmento 7, cirurgia realizada. Imagem final mostra ressecção do setor posterior direito + estruturas vasculares preservadas (setas 1 e 2). Cirurgia e estruturas apontadas?",
    alternativas: {
      A: "Ressecção regrada do seg 4 - VH média - VH esquerda.",
      B: "Mesohepatectomia - VH média - VH esquerda.",
      C: "Setorectomia anterior direita - VH direita - VH média.",
      D: "SETORECTOMIA POSTERIOR DIREITA - VH MÉDIA - VH ESQUERDA."
    },
    gabarito: "D",
    explicacao: "SETORECTOMIA POSTERIOR DIREITA: ressecção dos segmentos 6 e 7 (setor posterior do fígado direito). Preserva o setor anterior direito (5, 8) com a VEIA HEPÁTICA MÉDIA + lobo esquerdo com a VEIA HEPÁTICA ESQUERDA. Por isso as setas 1 e 2 são VH MÉDIA e VH ESQUERDA (que permanecem expostas após a ressecção). Mesohepatectomia = ressecção dos segs 4, 5, 8. Setorectomia anterior direita = segs 5, 8 (preserva VH D para os segs 6, 7). Ressecção do seg 4 isolado não expõe essas estruturas."
  },
  {
    n: 163,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer gástrico", "Neoadjuvância"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 67 anos, adenocarcinoma BEM diferenciado de ANTRO gástrico cT2cN+ (muscular + 1 linfonodo suspeito). Conduta?",
    alternativas: {
      A: "QUIMIOTERAPIA PERIOPERATÓRIA.",
      B: "Gastrectomia subtotal + D1+.",
      C: "Gastrectomia subtotal + D2.",
      D: "Gastrectomia total + D2."
    },
    gabarito: "A",
    explicacao: "CÂNCER GÁSTRICO LOCALMENTE AVANÇADO (cT2N+): tratamento padrão atual = QUIMIOTERAPIA PERIOPERATÓRIA (esquema FLOT - docetaxel/oxaliplatina/leucovorina/5-FU): 4 ciclos PRÉ-OP + cirurgia + 4 ciclos PÓS-OP. Estudo FLOT4 mostrou superioridade sobre ECF/ECX. Para tumor de ANTRO: gastrectomia subtotal + D2 é a cirurgia (não D1+, que é para precoce). Após neoadjuvância. Gastrectomia total (D) só se proximal/corpo. Cirurgia direta sem neoadjuvância está em desuso para cT2+/N+ na Europa/Brasil."
  },
  {
    n: 164,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Colangite esclerosante primária", "RCU"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 45 anos, RCU idiopática. Episódios recorrentes de febre, calafrios, icterícia, hipocolia fecal. Colangio-RM: estenoses MULTIFOCAIS e irregularidades alternando com dilatações em vias biliares intra E extra-hepáticas. Hipótese?",
    alternativas: {
      A: "Coledocolitíase.",
      B: "Colangiocarcinoma.",
      C: "Cirrose biliar primária.",
      D: "COLANGITE ESCLEROSANTE PRIMÁRIA (CEP)."
    },
    gabarito: "D",
    explicacao: "COLANGITE ESCLEROSANTE PRIMÁRIA (CEP): doença autoimune com fortíssima associação com RCU (80% dos pacientes com CEP têm DII, geralmente RCU). Achado patognomônico à colangio-RM: ESTENOSES MULTIFOCAIS + dilatações alternantes ('em rosário/contas') em vias biliares INTRA E EXTRA-HEPÁTICAS. Apresentação: episódios de colangite, icterícia flutuante. Aumenta risco de COLANGIOCARCINOMA (B) e câncer colorretal. Tratamento: ácido ursodesoxicólico, transplante hepático nos avançados. CBP (C) acomete mulheres meia-idade mas é doença intra-hepática microscópica."
  },
  {
    n: 165,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Colecistite em paciente crítico", "Colecistostomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 85 anos, UTI pós-IAM com angioplastia (5 dias), dor HD. FC 130, PAM 58, alteração TGO/TGP/Cr, plaquetas 45.000. USG: colecistite litiásica com cálculo impactado em infundíbulo. Conduta?",
    alternativas: {
      A: "COLECISTOSTOMIA PERCUTÂNEA.",
      B: "Colecistectomia laparoscópica.",
      C: "Suporte intensivo e observação.",
      D: "CPRE."
    },
    gabarito: "A",
    explicacao: "COLECISTITE AGUDA em paciente CRÍTICO/INSTÁVEL (idoso, pós-IAM recente, dupla antiagregação, plaquetopenia, choque) = RISCO CIRÚRGICO PROIBITIVO. Conduta: COLECISTOSTOMIA PERCUTÂNEA guiada por imagem (drenagem da vesícula sob anestesia local). Tratamento DE PONTE: alivia o quadro agudo, controla sepse; colecistectomia eletiva em 6-12 semanas quando paciente estabilizado. Tokyo Guidelines: Grau III (colecistite grave) em pacientes não-elegíveis para cirurgia = drenagem. CPRE não trata colecistite (trata via biliar)."
  },
  {
    n: 166,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepática",
    subtemas: ["Adenoma hepático", "Classificação molecular"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Sobre a classificação MOLECULAR do adenoma hepático:",
    alternativas: {
      A: "Baseada em HE de cortes histológicos.",
      B: "Subtipo HNF1α inativado ('adenoma esteatótico') tem BAIXO risco de complicações.",
      C: "Subtipo BETA-CATENINA mutado tem MAIOR risco de TRANSFORMAÇÃO MALIGNA.",
      D: "Subtipo inflamatório não tem associação com ACO."
    },
    gabarito: "C",
    explicacao: "CLASSIFICAÇÃO MOLECULAR DOS ADENOMAS HEPÁTICOS (Zucman-Rossi): baseada em IMUNOHISTOQUÍMICA + biologia molecular. Subtipos: 1) HNF1α inativado - 'esteatótico', baixo risco, frequente em ACO; 2) INFLAMATÓRIO (mais comum) - associado a obesidade, ACO, álcool, risco de SANGRAMENTO; 3) BETA-CATENINA mutado - MAIOR RISCO DE TRANSFORMAÇÃO MALIGNA (em CHC) - INDICAÇÃO CIRÚRGICA mesmo se pequeno; 4) Não classificável. O sangramento está mais associado ao tamanho >5cm e subtipo inflamatório."
  },
  {
    n: 167,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Doença de Crohn", "Cirurgia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre o tratamento cirúrgico da DOENÇA DE CROHN:",
    alternativas: {
      A: "Otimização pré-op geralmente não melhora condições para cirurgia.",
      B: "Diferentes técnicas de ANASTOMOSE devem ser consideradas com base na gravidade e localização.",
      C: "Radicalidade com ressecção de todas as áreas acometidas é fundamental.",
      D: "Momento ideal é quando começa aumento de evacuações."
    },
    gabarito: "B",
    explicacao: "CIRURGIA NA DOENÇA DE CROHN: princípios fundamentais: 1) NÃO É CURATIVA (doença recidiva) - cirurgia PARCIMONIOSA, evitar ressecções extensas (síndrome do intestino curto); 2) OTIMIZAR pré-op (nutrição, suspender biológicos quando possível, controle de sepse); 3) Diferentes ANASTOMOSES (látero-lateral isoperistáltica de Kono-S reduz recidiva; ressecção mínima das margens macroscópicas). Tratamento cirúrgico só para COMPLICAÇÕES (estenose, fístula, abscesso, perfuração, refratariedade, displasia) - não pelo aumento de evacuações isolado."
  },
  {
    n: 168,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia/Oncologia",
    subtemas: ["Câncer de cólon", "CME", "Linfadenectomia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre NEOPLASIA DE CÓLON:",
    alternativas: {
      A: "Objetivos da ressecção: margens CIRCUNFERENCIAIS NEGATIVAS + remoção do mesentério com maior risco de disseminação linfática.",
      B: "QT/RT neoadjuvante seguida de cirurgia em CA cólon esquerdo III oferece menor recidiva.",
      C: "Região do mesentério a ressecar é pouco relacionada à embriologia.",
      D: "Extensão da colectomia é determinada pela profundidade do tumor."
    },
    gabarito: "A",
    explicacao: "EXCISÃO MESOCÓLICA COMPLETA (CME - Complete Mesocolic Excision): princípio cirúrgico atual para CA de cólon. Análogo da TME (excisão total do mesorreto) no reto. Princípios: 1) MARGENS CIRCUNFERENCIAIS LIVRES (ressecção do envelope mesocólico íntegro); 2) LIGADURA VASCULAR ALTA na origem (para retirar todos os linfonodos do território); 3) Embriologia: o mesocólon segue planos avasculares embrionários (importante guiar a dissecção). Reduz recidiva local. NEOADJUVÂNCIA QT/RT é padrão para RETO, não cólon. Extensão da colectomia segue território LINFOVASCULAR, não profundidade."
  },
  {
    n: 169,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Doença anorretal benigna", "Abscessos e fístulas"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre ABSCESSOS e FÍSTULAS PERIANAIS:",
    alternativas: {
      A: "Raramente (<1/10) os abscessos criptoglandulares evoluem para fístulas.",
      B: "Para tratamento de fístula interesfincteriana, exame sob anestesia é menos importante que TC.",
      C: "ABSCESSO ANORRETAL deve ser tratado prioritariamente com DRENAGEM CIRÚRGICA, não ATB.",
      D: "Prioridade: cura sem recorrência > continência > sepse."
    },
    gabarito: "C",
    explicacao: "ABSCESSO ANORRETAL: tratamento padrão = DRENAGEM CIRÚRGICA imediata (sob anestesia, com incisão adequada). ATB sozinho não funciona em coleção purulenta loculada e pode mascarar/piorar o quadro. ATB associado apenas em: imunossuprimidos, celulite extensa, diabetes, valvopatia. Frequência de fístula pós-abscesso: 30-50% (não <10%). PRIORIDADES: 1º) CONTROLE DA SEPSE (drenagem); 2º) PRESERVAÇÃO DA CONTINÊNCIA; 3º) Cura sem recorrência. Exame sob anestesia (EUA) é MELHOR que imagem para fístula simples."
  },
  {
    n: 170,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Encefalopatia de Wernicke", "Deficiência de B1"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 27 anos, 30 dias pós-bypass gástrico. Vômitos frequentes, depois DIPLOPIA + CONFUSÃO MENTAL. Causa?",
    alternativas: {
      A: "Fístula gástrica.",
      B: "Deficiência de zinco.",
      C: "Deficiência de vitamina A.",
      D: "DEFICIÊNCIA DE VITAMINA B1 (TIAMINA)."
    },
    gabarito: "D",
    explicacao: "TRÍADE DE WERNICKE (oftalmoplegia/diplopia + confusão mental + ataxia) por DEFICIÊNCIA DE TIAMINA (B1): complicação SÉRIA pós-bariátrica com VÔMITOS PERSISTENTES (impede absorção da escassa B1 disponível). Estoques de B1 duram apenas 2-3 semanas. Tratamento URGENTE: TIAMINA IV em altas doses ANTES de qualquer reposição glicada (glicose sem B1 pode precipitar Wernicke). Se não tratado: síndrome de Korsakoff (déficits cognitivos permanentes). Outros déficits comuns pós-bypass: ferro, B12, cálcio, vit D, mas não causam esta apresentação."
  },
  {
    n: 171,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Hidatidose hepática", "Echinococcus"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 37 anos, boliviana há 5 anos no Brasil. Dor HD há 3 anos. USG/RM: LESÃO CÍSTICA COMPLEXA no LD hepático 15 cm, paredes espessas, septos grosseiros e 'CISTOS FILHOS'. Diagnóstico e tratamento?",
    alternativas: {
      A: "CISTO HIDÁTICO + PERICISTECTOMIA.",
      B: "Cisto hepático simples + 'destelhamento' laparoscópico.",
      C: "Abscesso hepático + drenagem percutânea.",
      D: "Neoplasia cística mucinosa + hepatectomia D."
    },
    gabarito: "A",
    explicacao: "HIDATIDOSE HEPÁTICA por ECHINOCOCCUS GRANULOSUS: paciente de área endêmica (Bolívia/Andes) + cisto complexo COM CISTOS FILHOS (sinal patognomônico - cistos dentro de cisto) + paredes espessadas + septos = diagnóstico clássico. Tratamento: 1) ALBENDAZOL pré e pós-op; 2) CIRURGIA - PERICISTECTOMIA (ressecção completa do cisto + pericisto, evita derrame de líquido hidático que pode causar choque anafilático e disseminação). Punção (PAIR) em casos selecionados. Destelhamento é técnica antiga, alta recidiva."
  },
  {
    n: 172,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["IPMN", "Cisto pancreático"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 65 anos, achado incidental: cisto em cauda do pâncreas 2,7 cm, comunicação com ducto pancreático principal (calibre 0,5 cm - normal), sem nódulos. Ecoendoscopia + punção: MUCINA + CEA 350 ng/mL. CA 19-9 normal. Diagnóstico e conduta?",
    alternativas: {
      A: "IPMN de ductos secundários, pancreatectomia caudal com preservação esplênica.",
      B: "IPMN tipo misto, pancreatectomia corpocaudal com preservação esplênica.",
      C: "IPMN DE DUCTOS SECUNDÁRIOS, SEGUIMENTO POR IMAGEM.",
      D: "Neoplasia cística mucinosa, pancreatectomia caudal + esplenectomia."
    },
    gabarito: "C",
    explicacao: "IPMN (Neoplasia Mucinosa Papilar Intraductal) de DUCTOS SECUNDÁRIOS (BD-IPMN): cisto pancreático com comunicação com ducto principal, ducto pancreático principal NORMAL (<5 mm), MUCINA + CEA ELEVADO (>192) confirma origem mucinosa. INDICAÇÕES CIRÚRGICAS (worrisome features/high-risk stigmata): cisto >3 cm, ducto >10 mm, nódulo mural, CA 19-9 elevado, citologia suspeita. ESTE CASO: 2,7 cm + ducto 5 mm + SEM nódulos + CA 19-9 normal = SEGUIMENTO com RM/ecoendoscopia (intervalo conforme tamanho). IPMN misto teria ducto principal dilatado. Neoplasia mucinosa cística não comunica com ducto."
  },
  {
    n: 173,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer gástrico", "Cirurgia radical"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Etapa FUNDAMENTAL da cirurgia RADICAL no tratamento do adenocarcinoma gástrico:",
    alternativas: {
      A: "Bursectomia.",
      B: "OMENTECTOMIA.",
      C: "Coleta de citologia oncótica.",
      D: "Margem de 2 cm em lesões T1."
    },
    gabarito: "B",
    explicacao: "OMENTECTOMIA: parte INTEGRAL e mandatória da gastrectomia oncológica radical para adenocarcinoma gástrico. O omento maior é removido em bloco com o estômago pois pode conter linfonodos e implantes microscópicos. BURSECTOMIA (A) (retirada do omento menor + folheto anterior da retrocavidade) era padrão antigamente mas estudo japonês JCOG1001 mostrou QUE NÃO melhora sobrevida = NÃO é mais rotina. CITOLOGIA ONCÓTICA da cavidade (lavado peritoneal) é importante para estadiamento mas não é cirurgia. MARGEM em T1 = 2 cm é apenas critério oncológico, não etapa cirúrgica."
  },
  {
    n: 174,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia",
    subtemas: ["Tumor neuroendócrino gástrico", "Gastrina"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "TNE GÁSTRICO TIPO 1, bem diferenciado (G1 OMS): achados endoscópicos e laboratoriais esperados?",
    alternativas: {
      A: "GASTRITE ATRÓFICA + múltiplas lesões pequenas (<1cm) + ANTI-CÉLULAS PARIETAIS POSITIVO.",
      B: "Hiperplasia de pregas + múltiplas lesões pequenas + GASTRINA ELEVADA.",
      C: "Múltiplas lesões pequenas + úlceras pépticas + gastrina elevada.",
      D: "Lesão vegetante única >1 cm + gastrina normal."
    },
    gabarito: "A",
    explicacao: "TIPOS DE TNE GÁSTRICOS: TIPO 1 (75%) - associado à GASTRITE ATRÓFICA AUTOIMUNE (anticorpos anti-células parietais), hipocloridria, hipergastrinemia REATIVA (secundária à falta de feedback ácido), múltiplas lesões pequenas no fundo/corpo, comportamento INDOLENTE. TIPO 2 (5%) - associado à síndrome de Zollinger-Ellison/NEM1, hipergastrinemia PRIMÁRIA (gastrinoma), múltiplas lesões + úlceras pépticas. TIPO 3 (15-25%) - esporádico, lesão ÚNICA maior, agressivo, gastrina NORMAL, prognóstico ruim. Anti-parietal+ é específico do tipo 1."
  },
  {
    n: 175,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Estenose pós-bypass", "Disfagia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 38 anos, D43 pós-bypass. Disfagia progressiva (iniciada com dieta sólida há 1 semana), piora para sólidos. Sem dor abdominal. Causa e tratamento?",
    alternativas: {
      A: "Hérnia interna, tratamento cirúrgico.",
      B: "Esofagite de refluxo, tratamento clínico.",
      C: "Distensão aguda do estômago excluso, tratamento cirúrgico.",
      D: "ESTENOSE DA GASTROENTEROANASTOMOSE, TRATAMENTO ENDOSCÓPICO."
    },
    gabarito: "D",
    explicacao: "ESTENOSE DA GASTROJEJUNOANASTOMOSE: complicação comum (3-10%) do bypass gástrico, manifesta-se entre 4-12 semanas pós-op com DISFAGIA PROGRESSIVA, intolerância alimentar, vômitos sem dor (diferente de hérnia interna). Tratamento: DILATAÇÃO ENDOSCÓPICA com balão (eficaz em ~95% dos casos), pode necessitar 2-3 sessões. Cirurgia reservada para falha endoscópica. HÉRNIA INTERNA (A) seria DOR PÓS-PRANDIAL, sem disfagia mecânica. Refluxo (B) raro pós-bypass. Distensão do remanescente é precoce."
  },
  {
    n: 176,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepatobiliar",
    subtemas: ["Colangiocarcinoma hilar", "Bismuth", "Embolização portal"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 62 anos, icterícia + colúria. RM: colangiocarcinoma hilar BISMUTH IIIa (estenose hilar com extensão para confluências secundárias direitas), 3,1 cm, com acometimento da a. hepática direita. BT 14, CA 19-9 5330. Volume hepático remanescente futuro = 30%. Conduta?",
    alternativas: {
      A: "QT/RT de consolidação.",
      B: "Trissetorectomia esquerda + linfadenectomia + biliodigestiva.",
      C: "Drenagem do lobo esquerdo + embolização do ramo portal DIREITO.",
      D: "DRENAGEM TRANSPARIETO-HEPÁTICA DO LOBO DIREITO seguida de TRISSETORECTOMIA DIREITA + ressecção segmento 1 + linfadenectomia + biliodigestiva."
    },
    gabarito: "D",
    explicacao: "COLANGIOCARCINOMA HILAR BISMUTH IIIa (extensão para confluências secundárias DIREITAS): ressecabilidade requer TRISSETORECTOMIA DIREITA (segs 4, 5, 6, 7, 8) + caudado (segmento 1 - SEMPRE ressecado em colangio hilar pois drenagem biliar do caudado é hilar) + linfadenectomia + reconstrução biliodigestiva (hepaticojejunostomia). REMANESCENTE 30% É INSUFICIENTE (necessário >30% em fígado normal, >40% em pós-quimio): exige EMBOLIZAÇÃO PORTAL DIREITA (hipertrofia compensatória do remanescente em 4-6 sem). DRENAGEM BILIAR PRÉ-OP DO LOBO REMANESCENTE (que vai ficar = ESQUERDO) reduz colestase. Erro na D: drenar o REMANESCENTE (esquerdo) e não o lado a ser ressecado."
  },
  {
    n: 177,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Bariátrica em adolescente", "Super-obesidade"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Adolescente 16 anos, obesidade desde infância, IMC 63, HAS, resistência à insulina. Melhor terapia?",
    alternativas: {
      A: "Derivação biliopancreática (super-obesos).",
      B: "Bypass gástrico (procedimento seguro com remissão de comorbidades).",
      C: "Gastrectomia vertical (é adolescente).",
      D: "Tratamento PRÉ-OP com balão intragástrico + medidas clínicas + integração com equipe multidisciplinar + discussão familiar."
    },
    gabarito: "D",
    explicacao: "BARIÁTRICA EM ADOLESCENTE com SUPER-OBESIDADE (IMC ≥50): abordagem deve ser CAUTELOSA E MULTIDISCIPLINAR. Princípios: 1) Avaliação por EQUIPE MULTIDISCIPLINAR (pediatra, endócrino, psicólogo, nutricionista, cirurgião); 2) Suporte FAMILIAR e maturidade psicológica; 3) BALÃO INTRAGÁSTRICO ou medidas clínicas como PONTE para perda de peso pré-operatória (reduz risco anestésico/cirúrgico); 4) Escolha técnica DISCUTIDA com família. Em adolescentes, sleeve (gastrectomia vertical) é geralmente preferida (menos restrições nutricionais futuras), mas IMC 63 pode requerer bypass. NUNCA decisão isolada."
  },
  {
    n: 178,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Fístula pós-sleeve", "Tratamento de fístula"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 59 anos, D5 pós-gastrectomia vertical com SEPTICEMIA. TC: extravasamento de grande quantidade de contraste para a cavidade. Conduta?",
    alternativas: {
      A: "Endoscopia para prótese.",
      B: "LAPAROSCOPIA com limpeza + drenagem para direcionar fístula + posterior PRÓTESE endoscópica se necessário.",
      C: "Sutura primária do orifício + limpeza (fístula precoce).",
      D: "Aplicar alça de delgado sobre o orifício para ocluir."
    },
    gabarito: "B",
    explicacao: "FÍSTULA PÓS-SLEEVE COM SEPSE: complicação grave. PRINCÍPIOS DE TRATAMENTO: 1) CONTROLE DA INFECÇÃO PRIMEIRO - LAPAROSCOPIA (ou laparotomia) para LAVAGEM + DRENAGEM da cavidade + drenos para EXTERIORIZAR a fístula; 2) APÓS CONTROLE da sepse, FECHAMENTO INTERNO com PRÓTESE ENDOSCÓPICA (stent metálico autoexpansível) que cobre o defeito, permitindo cicatrização; 3) Suporte nutricional (frequentemente jejunostomia). SUTURA PRIMÁRIA do orifício (C) NÃO funciona (tecido friável, isquemia da linha de grampeamento, tensão), recidiva é a regra. ATB de amplo espectro."
  },
  {
    n: 179,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Anatomia anorretal", "Espaços perirretais"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Sobre anatomia COLORRETAL e anal:",
    alternativas: {
      A: "Reflexão peritoneal anterior do reto é CONSTANTE (12 cm).",
      B: "Espaços isquioanais dividem-se em proximal e distal - justificam fístula em ferradura.",
      C: "FLEXURA ESPLÊNICA é ZONA DE RISCO DE ISQUEMIA (artéria cólica média).",
      D: "Linha pectínea é divisão entre endoderma/ectoderma (adenoCA/CEC)."
    },
    gabarito: "B",
    explicacao: "ESPAÇOS ISQUIOANAIS: divididos por uma fáscia (transversa anal/Courtney) em ESPAÇO ISQUIOANAL PROFUNDO (proximal, comunicação posterior atrás do esfíncter via espaço pós-anal profundo) e SUPERFICIAL (distal). Esta anatomia EXPLICA a FÍSTULA EM FERRADURA: o trajeto da fístula passa pelo espaço pós-anal profundo e contorna o reto pelos dois espaços isquioanais profundos formando 'ferradura'. Tratamento: drenagem do espaço pós-anal profundo. Alternativas erradas: reflexão peritoneal é VARIÁVEL (5-9 cm anterior); zona crítica de isquemia é GRIFFITHS (na flexura esplênica, mas pela junção SMA/IMA, NÃO pela cólica média que é da SMA); linha pectínea separa terço médio do canal anal - origem embrionária é proctoderma/cloaca."
  },
  {
    n: 180,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Hemorroidas", "Tratamento conservador"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre doença hemorroidária COM sangramento esporádico e plicoma externo assintomático:",
    alternativas: {
      A: "Procedimentos ambulatoriais (ligadura elástica) são eficazes para HEMORROIDAS GRAU III e IV.",
      B: "COMPLICAÇÕES da cirurgia hemorroidária: retenção urinária, sangramento, infecção, estenose, INCONTINÊNCIA e recorrência.",
      C: "Têm indicação de PRINCÍPIO cirúrgico: grávidas, Crohn, imunodeprimidos, hipertensão portal.",
      D: "Minimizar esforço, hidratar e fibras são POUCO eficazes."
    },
    gabarito: "B",
    explicacao: "COMPLICAÇÕES DA HEMORROIDECTOMIA: RETENÇÃO URINÁRIA (mais comum, ~15%), SANGRAMENTO precoce/tardio, INFECÇÃO/abscesso, ESTENOSE anal (excesso de ressecção mucosa), INCONTINÊNCIA (lesão esfincteriana), RECORRÊNCIA. Conhecimento dessas complicações é essencial para consentimento. Procedimentos AMBULATORIAIS (ligadura elástica, escleroterapia, infravermelho) são para GRAU I-II/III INICIAIS, NÃO III avançado/IV. CONTRAINDICAÇÕES cirúrgicas: gestantes (não fazer eletivamente), Crohn (alta morbidade), HIV não-controlado, HIPERTENSÃO PORTAL (risco de sangramento). Tratamento conservador (fibras, hidratação) é MUITO EFICAZ."
  }
);

console.log("Bloco 2 EC6 (151-180) adicionado");

// ==================== EC6 COLOPROCTOLOGIA - Bloco 3 (181-210) ====================
// Trauma torácico, cirurgia torácica, plástica/queimados, vascular, cabeça/pescoço, urologia
QUESTOES.push(
  {
    n: 181,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Trauma Torácico",
    subtemas: ["Hemotórax", "Hérnia diafragmática traumática"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 26 anos, politrauma auto x auto, drenagem torácica bilateral por hemopneumotórax. Múltiplas fraturas de arcos costais. RX: VELAMENTO DE SEIO COSTOFRÊNICO ESQUERDO pós-drenagem. Conduta?",
    alternativas: {
      A: "Toracotomia de emergência E (hérnia diafragmática).",
      B: "Toracotomia de emergência D (hérnia diafragmática).",
      C: "SOLICITAR TC DE TÓRAX para diferenciar hemotórax retido vs hérnia diafragmática à esquerda.",
      D: "Solicitar RNM (único exame para diferenciar paralisia frênica de hérnia diafragmática)."
    },
    gabarito: "C",
    explicacao: "VELAMENTO DE SEIO COSTOFRÊNICO PÓS-DRENAGEM em politrauma com múltiplas fraturas: diagnóstico DIFERENCIAL inclui HEMOTÓRAX RETIDO (mais comum, requer VATS após 72h se >300mL) ou HÉRNIA DIAFRAGMÁTICA TRAUMÁTICA (mais comum à esquerda - lado direito é protegido pelo fígado). TC DE TÓRAX é o exame DEFINITIVO para distinguir: vê presença de vísceras abdominais no tórax (hérnia) vs apenas líquido (hemotórax). Toracotomia 'às cegas' sem diagnóstico definido é ERRO. RNM não tem papel no agudo."
  },
  {
    n: 182,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Torácica/Endócrina",
    subtemas: ["Paraganglioma", "Catecolaminas"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 29 anos, picos de HAS há 2 anos. CATECOLAMINAS urinárias elevadas confirmadas. TC abdome SEM tumores em adrenais. RM tórax: massa sólida 10x5x5 cm em MEDIASTINO POSTERIOR PARAVERTEBRAL, contato com aorta torácica. Diagnóstico?",
    alternativas: {
      A: "Schwannoma.",
      B: "PARAGANGLIOMA.",
      C: "Linfoma de Hodgkin.",
      D: "Linfoma não-Hodgkin."
    },
    gabarito: "B",
    explicacao: "PARAGANGLIOMA: tumor neuroendócrino derivado de células das CRISTAS NEURAIS (mesma origem do feocromocitoma adrenal). Quando localização extra-adrenal e PRODUTOR DE CATECOLAMINAS = paraganglioma simpático. Localizações: paragânglios ao longo da cadeia simpática paraVERTEBRAL (MEDIASTINO POSTERIOR é localização clássica de Zuckerkandl-like), órgão de Zuckerkandl (paraaórtico), bexiga. Apresentação: HAS PAROXÍSTICA, cefaleia, sudorese, palpitações. Schwannoma é a neoplasia mais comum do mediastino posterior MAS NÃO É HORMONALMENTE ATIVO (sem catecolaminas). Linfomas raramente no mediastino posterior."
  },
  {
    n: 183,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Torácica",
    subtemas: ["TB pulmonar", "Cirurgia eletiva"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 25 anos, cavidade em LSE pulmonar pós-TB. Hemoptise leve. Sobre avaliação cirúrgica:",
    alternativas: {
      A: "Vias minimamente invasivas (VATS) são contraindicadas (impossibilidade técnica).",
      B: "Mortalidade da cirurgia >10%.",
      C: "Embolização substituiu cirurgia (sem indicação cirúrgica aqui).",
      D: "CONDIÇÃO NUTRICIONAL deve ser avaliada no pré-op + recuperação nutricional se necessária."
    },
    gabarito: "D",
    explicacao: "CIRURGIA POR SEQUELA DE TB: pacientes geralmente DESNUTRIDOS (doença consuntiva, déficits crônicos). RECUPERAÇÃO NUTRICIONAL pré-op é ESSENCIAL para reduzir complicações (fístula brônquica, deiscência, infecção). Albumina <3,0, IMC baixo, anemia = otimizar antes da cirurgia eletiva. VATS é DIFÍCIL mas POSSÍVEL em mãos experientes (aderências fibrosas). Mortalidade variável (3-7% em centros experientes), não >10%. Embolização brônquica trata hemoptise AGUDA, mas cirurgia pode ser indicada para cavidade residual sintomática, hemoptise refratária, suspeita de neoplasia."
  },
  {
    n: 184,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer de pulmão", "Terapias-alvo"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 59 anos, NÃO TABAGISTA, opacidade subsólida 5,5 cm em LSD. Biópsia: ADENOCARCINOMA PRIMÁRIO de pulmão. PET-FDG sem metástases. RM crânio normal. Em adenoCA pulmonar INICIAL/LOCALMENTE AVANÇADO, quais genes devem ser testados (alvos terapêuticos)?",
    alternativas: {
      A: "EGFR e PD-L1.",
      B: "EGFR e ALK.",
      C: "PD-L1 e ALK.",
      D: "KRAS e EGFR."
    },
    gabarito: "B",
    explicacao: "ADENOCARCINOMA PULMONAR em NÃO-FUMANTE: maior chance de MUTAÇÕES DRIVERS com TERAPIA-ALVO disponível. PAINEL MOLECULAR obrigatório atual: EGFR (osimertinib - inibidor), ALK (alectinib - inibidor), ROS1, BRAF, MET, RET, NTRK, KRAS-G12C (sotorasib). EGFR e ALK são os DOIS MAIS IMPORTANTES e PRIMEIROS DESCOBERTOS, com benefício claro em doença INICIAL E AVANÇADA (adjuvância com osimertinib em EGFR+ por estudo ADAURA). PD-L1 (A,C) é IMUNOTERÁPICO (imunoexpressão), não terapia-alvo molecular. KRAS-G12C tem terapia mas é menos comum em não-fumantes."
  },
  {
    n: 185,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Torácica",
    subtemas: ["Abscesso pulmonar", "Diagnóstico diferencial"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 45 anos, DM, epilepsia (crises recentes), queda do estado geral + febre. Leucocitose, PCR elevada. RX: OPACIDADE CAVITADA em lobo INFERIOR ESQUERDO. Hipótese para tratamento IMEDIATO?",
    alternativas: {
      A: "Histoplasmose.",
      B: "ABSCESSO PULMONAR.",
      C: "Sequestro pulmonar.",
      D: "Câncer de pulmão NSCLC."
    },
    gabarito: "B",
    explicacao: "ABSCESSO PULMONAR: cavidade pulmonar com nível líquido, infectada. Fatores de risco no caso: DIABETES + EPILEPSIA COM CRISES (broncoaspiração durante crises convulsivas é mecanismo clássico). Localização típica: SEGMENTOS POSTERIORES dos lobos superiores OU SUPERIORES DOS LOBOS INFERIORES (gravitacional, decúbito dorsal durante crise). Agente: anaeróbios, Strep, S. aureus. Tratamento: ATB amplo espectro + clindamicina ou amox-clav, por 4-6 sem. Drenagem se >6cm ou falha clínica. Histoplasmose (A) é fungo, evolução crônica. Sequestro (C) é congênito. CA pulmonar (D) ocorre, mas não em adulto jovem sem TBG."
  },
  {
    n: 186,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica/Queimados",
    subtemas: ["Lesão inalatória", "Queimadura de face"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 40 anos, EXPLOSÃO DE LAREIRA ECOLÓGICA com chamas. Queimaduras em face, pescoço, MMSS. Em face/pescoço: bolhas e áreas NACARADAS sem perfusão (3º grau). TAQUIPNEICO + VOZ ROUCA. Conduta?",
    alternativas: {
      A: "Indicação de IOT pela saturação na oximetria.",
      B: "Evitar oxigênio a 100%.",
      C: "CONSIDERAR INTUBAÇÃO OROTRAQUEAL PREVENTIVA.",
      D: "Escarotomia imediata das áreas não-perfundidas em face."
    },
    gabarito: "C",
    explicacao: "LESÃO INALATÓRIA com sinais de COMPROMETIMENTO PRECOCE DE VIA AÉREA: voz rouca (edema laríngeo iminente), queimadura facial extensa, mecanismo (explosão em ambiente fechado), taquipneia. INDICAÇÃO DE IOT PREVENTIVA PRECOCE antes que o edema feche a via aérea (após algumas horas pode ser impossível). Saturação (A) pode estar normal nas primeiras horas e cair tardiamente - não esperar. OXIGÊNIO 100% É RECOMENDADO se suspeita de inalação de CO/cianeto (acelera dissociação). Escarotomia (D) em face é raramente necessária; em tórax/membros sim, se compromete ventilação/perfusão."
  },
  {
    n: 187,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica",
    subtemas: ["Cicatriz queloide", "Diagnóstico"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Característica DETERMINANTE para diagnóstico de cicatriz QUELOIDE:",
    alternativas: {
      A: "Presença de prurido na região.",
      B: "MAIOR DIMENSÃO DA TUMORAÇÃO em relação à LESÃO TECIDUAL PRIMÁRIA.",
      C: "Aumento da cor avermelhada nos primeiros meses.",
      D: "Coexistência com processos infecciosos agudos locais."
    },
    gabarito: "B",
    explicacao: "DIAGNÓSTICO DIFERENCIAL: QUELOIDE vs CICATRIZ HIPERTRÓFICA. QUELOIDE: cresce ALÉM dos LIMITES da lesão original (invade pele adjacente saudável), pode crescer indefinidamente, raramente regride, predisposição genética/racial (afrodescendentes), sítios típicos (deltóide, esterno, lóbulo orelha). CICATRIZ HIPERTRÓFICA: respeita os LIMITES da lesão, pode regredir espontaneamente. Prurido (A) e eritema (C) ocorrem em AMBAS. A característica DEFINIDORA do queloide é a EXTRAVASIO/extensão além da ferida original."
  },
  {
    n: 188,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica/Trauma",
    subtemas: ["Lesão de partes moles", "Atropelamento"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Atropelamento, roda passou sobre coxa. Equimose anterolateral extensa, pele íntegra, pulsos distais presentes. Sobre o ferimento de partes moles:",
    alternativas: {
      A: "PERFUSÃO CUTÂNEA deve ser AVALIADA INICIALMENTE e REAVALIADA em 24/48h (risco de LESÃO VASCULAR pelo mecanismo).",
      B: "ATB sistêmico precoce evita celulite em trauma fechado.",
      C: "Causa principal de redução pulsos = rotura proximal de vasos femorais.",
      D: "Para fraturas ocultas, RX IMEDIATO obrigatório."
    },
    gabarito: "A",
    explicacao: "LESÃO POR ESMAGAMENTO/AVULSÃO OCULTA (Morel-Lavallée e similares) por mecanismo de cisalhamento (roda passando): pele aparentemente íntegra MAS pode evoluir com NECROSE TARDIA por descolamento do plano subcutâneo e ruptura dos vasos perfurantes da pele. AVALIAÇÃO SERIADA da perfusão cutânea (preenchimento capilar, temperatura, sensibilidade, coloração) é ESSENCIAL nas primeiras 24-72h. Pulsos distais presentes NÃO descartam isquemia cutânea localizada. ATB profilático em trauma fechado: SEM evidência. Pulsos diminuem por edema, compressão, lesão de pequenos vasos - rotura de femoral seria choque/ausência total. RX só se suspeita."
  },
  {
    n: 189,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica/Oncologia",
    subtemas: ["Tumores de pele não-melanoma", "CBC vs CEC"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre TUMORES DE PELE NÃO-MELANOMA:",
    alternativas: {
      A: "Idade >40, tabagismo, albinismo, xeroderma pigmentoso = relacionados a CBC.",
      B: "Margens cirúrgicas em CBC são MAIORES (invasão local).",
      C: "FATORES ETIOLÓGICOS COMUNS A CBC E CEC: PREDISPOSIÇÃO GENÉTICA + RADIAÇÃO UV CUMULATIVA.",
      D: "Terapias não-cirúrgicas (5-FU, imiquimod, RT) dispensam avaliação de margens."
    },
    gabarito: "C",
    explicacao: "CBC (CARCINOMA BASOCELULAR) e CEC (CARCINOMA ESPINOCELULAR) compartilham fatores de risco principais: EXPOSIÇÃO CUMULATIVA À RADIAÇÃO ULTRAVIOLETA (sol, fototipo claro), PREDISPOSIÇÃO GENÉTICA (xeroderma pigmentoso, albinismo, síndrome de Gorlin), idade avançada, imunossupressão. CEC tem associações ADICIONAIS: TABAGISMO (CEC de lábio/oral), HPV, queimaduras antigas, úlceras crônicas (úlcera de Marjolin), produtos químicos. CBC: margens MENORES (invasão local, raramente metastatiza). CEC: margens MAIORES (potencial metastático). Terapias não-cirúrgicas ainda precisam de avaliação de eficácia/resposta (biópsia confirma cura)."
  },
  {
    n: 190,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica",
    subtemas: ["Acidente por aracnídeo", "Necrose cutânea"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher acordou em casa de campo com lesão cutânea posterior na perna. Em 2 dias: NECROSE CENTRAL + halo eritematoso + dor intensa. Hipótese: acidente por ARACNÍDEO (LOXOSCELES). Procura avaliação após 6 dias da lesão. Conduta?",
    alternativas: {
      A: "Pomada antibiótica + aguardar a necrose seca.",
      B: "DESBRIDAMENTO da área de necrose + ANTIMICROBIANO TÓPICO + CURATIVOS para prevenir infecção secundária.",
      C: "Remover só a necrose e fechamento primário.",
      D: "Curativo a vácuo (NPWT) imediato sobre a ferida."
    },
    gabarito: "B",
    explicacao: "LOXOSCELISMO CUTÂNEO (aranha-marrom): necrose isquêmica progressiva, halo de hiperemia, dor. APÓS 6 DIAS, lesão já definida com necrose seca. Tratamento: DESBRIDAMENTO da área necrótica + curativos seriados com ANTIMICROBIANOS TÓPICOS (sulfadiazina de prata) + prevenção de infecção secundária. SORO ANTIARACNÍDICO só é eficaz nas primeiras 24-48h. FECHAMENTO PRIMÁRIO (C) é INADEQUADO em ferida potencialmente contaminada/com necrose subjacente - alta taxa de deiscência. VAC pode ser usado APÓS desbridamento, NÃO sobre ferida ainda com necrose."
  },
  {
    n: 191,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Plástica/Pediátrica",
    subtemas: ["Fenda labiopalatal", "Etiologia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre FENDA LABIOPALATAL:",
    alternativas: {
      A: "Doenças infecciosas perinatais associam-se. Cirurgia do palato mole visa fechamento do FORRO NASAL.",
      B: "Anti-hipertensivos gestacionais são contraindicados. Cirurgia do lábio: ideal no 1º mês de vida.",
      C: "Fendas isoladas do palato MENOS associadas a síndromes. Fechamento do palato duro REDUZ otites médias.",
      D: "DEFICIÊNCIAS NUTRICIONAIS MATERNAS associam-se à etiologia. Cirurgia do LÁBIO recomendada AOS 4 MESES."
    },
    gabarito: "D",
    explicacao: "FENDA LABIOPALATAL: ETIOLOGIA multifatorial - genética (síndromes - Pierre Robin, Stickler, 22q11) + ambiental (DEFICIÊNCIAS NUTRICIONAIS maternas, especialmente ÁCIDO FÓLICO e B-COMPLEX; tabagismo, álcool, anticonvulsivantes na gestação). FENDAS ISOLADAS DO PALATO são MAIS associadas a SÍNDROMES (não menos - alternativa C errada). CRONOLOGIA CIRÚRGICA padrão (Regra dos 10): Cirurgia do LÁBIO aos 3-6 MESES (10 semanas, 10 lb peso, Hb 10) - corrige musculatura e estética; Cirurgia do PALATO (9-18 meses) - importante para fala e reduzir otites médias por disfunção tubária."
  },
  {
    n: 192,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Maxilofacial",
    subtemas: ["Fraturas mandibulares", "Via aérea"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Fratura mandibular que mais frequentemente evolui com INSUFICIÊNCIA RESPIRATÓRIA:",
    alternativas: {
      A: "Fratura unilateral cominutiva de corpo.",
      B: "FRATURA BILATERAL DA CABEÇA DO CÔNDILO mandibular (na verdade fratura bilateral de parassínfise).",
      C: "Fraturas dento-alveolares múltiplas.",
      D: "FRATURAS MANDIBULAR BILATERAL DAS REGIÕES DE PARASSÍNFISE MANDIBULAR."
    },
    gabarito: "D",
    explicacao: "FRATURA MANDIBULAR BILATERAL DE PARASSÍNFISE (regiões anteriores entre as fossas caninas): a fratura em DOIS pontos no arco anterior da mandíbula PERDE A INSERÇÃO ANTERIOR DOS MÚSCULOS DA LÍNGUA (genioglosso, geniohióideo, milohióideo). A LÍNGUA PODE CAIR POSTERIORMENTE OCLUINDO A VIA AÉREA (glossoptose) - clássica obstrução respiratória aguda. Conduta IMEDIATA: posicionamento, tração da língua, IOT/traqueostomia. Fraturas isoladas de côndilo ou corpo não causam essa instabilidade da musculatura lingual."
  },
  {
    n: 193,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica/Neonatologia",
    subtemas: ["Hérnia diafragmática congênita", "Bochdalek"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "RN a termo com desconforto respiratório grave imediato. RX tórax/abdome: ALÇAS INTESTINAIS no hemitórax esquerdo + desvio do mediastino para a direita. Hipótese é HÉRNIA DIAFRAGMÁTICA CONGÊNITA. Conduta?",
    alternativas: {
      A: "Toracotomia de emergência.",
      B: "Laparotomia de emergência.",
      C: "Drenagem torácica esquerda.",
      D: "INTUBAÇÃO E ESTABILIZAÇÃO CLÍNICA."
    },
    gabarito: "D",
    explicacao: "HÉRNIA DIAFRAGMÁTICA CONGÊNITA DE BOCHDALEK (mais comum, póstero-lateral, esquerda em 80%): vísceras abdominais no tórax → HIPOPLASIA PULMONAR + HIPERTENSÃO PULMONAR persistente. ABORDAGEM MUDOU radicalmente nas últimas décadas: ESTABILIZAÇÃO CLÍNICA PRIMEIRO (IOT, ventilação GENTLE, evitar VPP de máscara que distende vísceras herniadas, surfactante, óxido nítrico, ECMO se necessário) por 24-72h. CIRURGIA é ELETIVA após estabilização hemodinâmica/respiratória, NÃO emergência. Drenagem torácica é CONTRAINDICADA (vísceras no tórax, lesão visceral). Laparotomia é a via cirúrgica eletiva."
  },
  {
    n: 194,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica/Hepatobiliar",
    subtemas: ["Atresia de vias biliares", "Icterícia neonatal"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Neonato 28 dias, icterícia desde D5, MELHOROU 2ª sem, depois PIORA PROGRESSIVA + ACOLIA + COLÚRIA. Diagnóstico?",
    alternativas: {
      A: "Cisto de colédoco.",
      B: "ATRESIA DAS VIAS BILIARES.",
      C: "Icterícia fisiológica.",
      D: "Cálculo biliar impactado."
    },
    gabarito: "B",
    explicacao: "ATRESIA DE VIAS BILIARES (AVB): icterícia COLESTÁTICA (bilirrubina DIRETA) com FEZES ACÓLICAS (massa de putty) + COLÚRIA + hepatomegalia, geralmente após período de aparente icterícia 'fisiológica' (3-8 sem). EMERGÊNCIA PEDIÁTRICA - quanto mais precoce a cirurgia de Kasai (portoenterostomia), melhor o prognóstico (ideal <8 sem, antes de 60 dias de vida). Após 90 dias, melhor opção é TRANSPLANTE. Cisto de colédoco (A) tem massa abdominal palpável + sintomas mais brandos. Icterícia fisiológica (C) é por bilirrubina INDIRETA. Cálculo (D) é raríssimo em neonato."
  },
  {
    n: 195,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica/Neonatologia",
    subtemas: ["Enterocolite necrosante", "Prematuro"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Prematuro 31 sem, baixo peso, 9 dias na UTIN. Hipoatividade, hipotermia, distensão abdominal, débito bilioso pela SOG há 2 dias. RX abdome: PNEUMATOSE INTESTINAL. Diagnóstico?",
    alternativas: {
      A: "Apendicite aguda.",
      B: "Obstrução duodenal.",
      C: "ENTEROCOLITE NECROSANTE (NEC).",
      D: "Volvo de intestino médio."
    },
    gabarito: "C",
    explicacao: "ENTEROCOLITE NECROSANTE (NEC): grave doença intestinal isquêmica/inflamatória do PREMATURO (especialmente <32 sem e/ou baixo peso), no início do uso da dieta enteral. Sinais: hipoatividade, hipotermia, intolerância alimentar, distensão, sangue nas fezes. RX característico: PNEUMATOSE INTESTINAL (gás intramural) - patognomônico; ar portal; pneumoperitônio (perfuração). Tratamento: jejum, SOG aberta, antibióticos amplos, suporte. Cirurgia: se PERFURAÇÃO ou peritonite. Mortalidade alta. Estágios de Bell."
  },
  {
    n: 196,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica",
    subtemas: ["Hérnia inguinal", "Criptorquidia", "Hidrocele"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre AFECÇÕES INGUINOESCROTAIS, momento adequado para cirurgia:",
    alternativas: {
      A: "HÉRNIA INGUINAL NO RN: TRATAMENTO CIRÚRGICO ELETIVO O MAIS RAPIDAMENTE POSSÍVEL (alto risco de encarceramento).",
      B: "Hidrocele comunicante bilateral em RN: cirurgia no 1º mês.",
      C: "Criptorquidia bilateral em RN: cirurgia após 2 anos.",
      D: "Prematuro com testículo não-palpável unilateral: cirurgia antes de 3 meses."
    },
    gabarito: "A",
    explicacao: "HÉRNIA INGUINAL EM RN/LACTENTE: alto risco de ENCARCERAMENTO (até 30% em <1 ano) e estrangulamento. RECOMENDAÇÃO ATUAL: cirurgia ELETIVA PROGRAMADA logo após o diagnóstico (semanas, não meses). HIDROCELE COMUNICANTE NO RN (B): geralmente FECHA ESPONTANEAMENTE - aguardar até 1-2 ANOS antes de operar. CRIPTORQUIDIA (C): tratamento entre 6 e 18 meses (NÃO após 2 anos - perde-se função germinativa, aumenta risco tumoral). PREMATURO com testículo não-palpável (D): aguardar descida espontânea antes da cirurgia (semanas/meses), avaliar após 6 meses corrigidos."
  },
  {
    n: 197,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica",
    subtemas: ["Atresia intestinal", "Sinal da dupla bolha"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN com vômitos biliosos e distensão abdominal desde 1º dia de vida. Diagnóstico provável + achado radiológico TÍPICO:",
    alternativas: {
      A: "Anomalia anorretal com fístula perineal / sinal da DUPLA BOLHA.",
      B: "Estenose hipertrófica do piloro / níveis hidroaéreos.",
      C: "ATRESIA JEJUNAL / DISTENSÃO DE ALÇAS PROXIMAIS + AUSÊNCIA DE AERAÇÃO NO CÓLON.",
      D: "Atresia esofágica sem fístula / distensão de alças com níveis."
    },
    gabarito: "C",
    explicacao: "ATRESIA INTESTINAL JEJUNAL/ILEAL: RN com vômitos BILIOSOS desde primeiro dia (sinal de obstrução abaixo da papila de Vater) + distensão. RX: distensão de alças PROXIMAIS à atresia + AUSÊNCIA DE GÁS DISTAL/CÓLON. SINAL DA DUPLA BOLHA é da ATRESIA DUODENAL (2 níveis hidroaéreos: estômago + duodeno proximal à atresia). ANOMALIA ANORRETAL: ausência de mecônio ao nascimento, RX mostra ar até o nível da atresia anal. ATRESIA ESOFÁGICA SEM FÍSTULA: SEM ar no estômago (não distende). Estenose pilórica: aparece após 3-6 semanas, vômito NÃO bilioso."
  },
  {
    n: 198,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica",
    subtemas: ["Volvo de intestino médio", "Má rotação"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Neonato 27 dias, deterioração súbita + vômitos biliosos + evacuação sanguinolenta há 5h. Prostrado, descorado, abdome doloroso/tenso. Hipótese e conduta?",
    alternativas: {
      A: "VOLVO DE INTESTINO MÉDIO / CIRURGIA DE URGÊNCIA.",
      B: "Volvo de intestino médio / trânsito intestinal contrastado.",
      C: "Intussuscepção / cirurgia de urgência.",
      D: "Intussuscepção / enema opaco."
    },
    gabarito: "A",
    explicacao: "VOLVO DE INTESTINO MÉDIO secundário à MÁ ROTAÇÃO INTESTINAL: EMERGÊNCIA cirúrgica do lactente/neonato. Apresentação: vômitos biliosos súbitos + deterioração rápida + sangue nas fezes (isquemia/necrose) + abdome doloroso. NECROSE EM HORAS. NÃO PERDER TEMPO COM EXAMES - laparotomia URGENTE para destorção (cirurgia de LADD): desfazer o volvo, ampliar a base do mesentério, apendicectomia, posicionar delgado à direita e cólon à esquerda. INTUSSUSCEPÇÃO (C/D) é mais comum em 6m-2a, com cólica + sangue 'em geleia de morango', massa palpável em formato de salsicha. Vólvulo: deterioração mais rápida e grave."
  },
  {
    n: 199,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pediátrica",
    subtemas: ["Estenose hipertrófica do piloro", "Alcalose"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN masculino, 25 dias, AME, vômitos em LEITE COALHADO progressivos pós-mamada há 1 semana. Peso ABAIXO do nascimento, desidratado, distensão epigástrica. Hipótese e conduta INICIAL?",
    alternativas: {
      A: "Atresia intestinal / exame contrastado.",
      B: "Atresia de esôfago / pesquisa de fístula traqueoesofágica.",
      C: "ESTENOSE HIPERTRÓFICA DO PILORO / HIDRATAÇÃO + CORREÇÃO DE DISTÚRBIOS METABÓLICOS.",
      D: "DRGE / fórmula engrossada + procinético."
    },
    gabarito: "C",
    explicacao: "ESTENOSE HIPERTRÓFICA DO PILORO (EHP): clássico - lactente MASCULINO (4:1) primogênito, 3-6 SEMANAS de vida, VÔMITOS EM JATO NÃO BILIOSOS pós-mamadas progressivos, FOME após vômito, perda de peso, desidratação. Distúrbio metabólico: ALCALOSE METABÓLICA HIPOCLORÊMICA HIPOCALÊMICA (perda de HCl pelos vômitos). PRINCÍPIO FUNDAMENTAL: CORRIGIR HIDRATAÇÃO E DISTÚRBIOS METABÓLICOS ANTES DA CIRURGIA (pilorotomia de Fredet-Ramstedt). Operar paciente alcalótico = risco anestésico alto (depressão respiratória pós-op). Diagnóstico por USG (oliva pilórica, espessura >4mm)."
  },
  {
    n: 200,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Varizes", "Forame oval patente", "Escleroterapia"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 49 anos, IMC 29, varizes MMII CEAP C5. Safena magna E insuficiente 8 mm de diâmetro. Pré-op: ECO mostra FORAME OVAL PATENTE. Qual tratamento CONTRAINDICADO?",
    alternativas: {
      A: "Safenectomia com fleboextrator.",
      B: "Ablação por radiofrequência.",
      C: "Ablação com laser endovenoso.",
      D: "ESCLEROSE COM ESPUMA DENSA DE POLIDOCANOL."
    },
    gabarito: "D",
    explicacao: "ESCLEROTERAPIA COM ESPUMA densa (polidocanol em espuma) em paciente com FORAME OVAL PATENTE (FOP): risco de EMBOLIA PARADOXAL da espuma para circulação arterial (cérebro) → AVC embólico, eventos neurológicos isquêmicos (cegueira, AIT). FOP é CONTRAINDICAÇÃO formal para escleroterapia com espuma densa em grandes troncos. As demais técnicas (safenectomia mecânica, radiofrequência, laser endovenoso) são SEGURAS - não geram microêmbolos que possam atravessar o FOP. Atualmente é obrigatório investigar FOP antes de espuma em pacientes com risco/sintomas neurológicos."
  },
  {
    n: 201,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Oclusão arterial embólica", "Fibrilação atrial"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 58 anos, dor súbita em MID, frialdade, ausência de pulsos poplíteo/distais há 2h. ECG: FIBRILAÇÃO ATRIAL. Hipótese e tratamento?",
    alternativas: {
      A: "Oclusão arterial TROMBÓTICA - angioplastia.",
      B: "Oclusão arterial EMBÓLICA - angioplastia.",
      C: "Oclusão arterial trombótica - tromboembolectomia.",
      D: "OCLUSÃO ARTERIAL EMBÓLICA - TROMBOEMBOLECTOMIA (Fogarty)."
    },
    gabarito: "D",
    explicacao: "ISQUEMIA AGUDA DO MEMBRO + FIBRILAÇÃO ATRIAL = ALTA SUSPEITA DE OCLUSÃO EMBÓLICA (trombo no apêndice atrial esquerdo embolizando). Características clínicas que apoiam: início SÚBITO, MEMBRO CONTRALATERAL com PULSOS NORMAIS (sem doença aterosclerótica), AUSÊNCIA DE CIRCULAÇÃO COLATERAL (isquemia mais grave). Tratamento: TROMBOEMBOLECTOMIA com cateter de FOGARTY por via cirúrgica (anestesia local, arteriotomia femoral) - permite remover o êmbolo rapidamente. ANGIOPLASTIA seria para doença ATEROSCLERÓTICA com estenose subjacente. Anticoagulação plena imediata + tratar FA. 6Ps: pain, pallor, paresthesia, paralysis, pulselessness, poikilothermia."
  },
  {
    n: 202,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Acesso para hemodiálise", "Trombose"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 60 anos, DRC dialítica com PRÓTESE PTFE braquioaxilar trombosada (após hipotensão na diálise). Sem sinais infecciosos. Conduta?",
    alternativas: {
      A: "Instalar cateter de longa permanência.",
      B: "Trocar prótese no mesmo membro.",
      C: "TROMBECTOMIA + ANGIOGRAFIA.",
      D: "Colocar prótese nova no outro membro."
    },
    gabarito: "C",
    explicacao: "OCLUSÃO AGUDA DE ACESSO PROTÉTICO PTFE para hemodiálise: tratamento PADRÃO = TROMBECTOMIA CIRÚRGICA ou ENDOVASCULAR (com cateter de Fogarty ou farmacomecânica) + ANGIOGRAFIA INTRAOPERATÓRIA para identificar a CAUSA da trombose (estenose anastomótica venosa, estenose central, hiperplasia mio-intimal) e tratar com angioplastia/stent se necessário. Preserva o acesso, evita confecção de novo acesso, mantém anatomia para futuros acessos. Cateter de longa permanência é PONTE (não preserva acesso definitivo). Trocar prótese sem investigar causa = recidiva. Outro membro só se não houver opção do atual."
  },
  {
    n: 203,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Dissecção aórtica", "Emergência aórtica"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 62 anos, HAS, DOR TORÁCICA INTENSA SÚBITA + síncope. Hipertenso no PS. RX tórax: ALARGAMENTO DE MEDIASTINO. Conduta?",
    alternativas: {
      A: "MONA (morfina, O2, nitrato, AAS) + betabloqueador.",
      B: "CONTROLE PRESSÓRICO + ANALGESIA + ANGIO-TC.",
      C: "Trombólise química com alteplase.",
      D: "Cateterismo de urgência."
    },
    gabarito: "B",
    explicacao: "DISSECÇÃO AÓRTICA aguda: tríade clássica = DOR torácica/dorsal LANCINANTE súbita 'em rasgo' + DIFERENÇA DE PULSO/PA entre membros + MEDIASTINO ALARGADO no RX. Fatores: HAS, idade. Conduta IMEDIATA: 1) CONTROLE PRESSÓRICO rigoroso (alvo PAS 100-120 com BB - esmolol - e nitroprussiato se necessário); 2) ANALGESIA (controle adrenérgico); 3) ANGIO-TC TORÁCICA = exame DEFINITIVO (Stanford A = ascendente, cirurgia urgente; Stanford B = descendente, tratamento clínico). NUNCA TROMBOLÍTICO (catastrófico). MONA seria para SCA, mas se mascara dissecção pode ser fatal."
  },
  {
    n: 204,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Doença carotídea", "AVC"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 88 anos, AVC com paresia braço esquerdo. Achados: VPS 320 cm/s na CIE (estenose ~80% E), VPS 145 cm/s na CID, placa subc. carótida externa direita, fenômeno de roubo subclávia E, placa calcificada na origem da carótida comum direita. Doppler transcraniano: sem atividade embólica, doença aterosclerótica intracraniana, teste de apneia POSITIVO para BAIXA RESERVA. Intervenção indicada em:",
    alternativas: {
      A: "Subclávia esquerda.",
      B: "CARÓTIDA INTERNA ESQUERDA.",
      C: "Carótida externa direita.",
      D: "Origem da carótida comum direita."
    },
    gabarito: "B",
    explicacao: "AVC + ESTENOSE CRÍTICA NA CARÓTIDA INTERNA ESQUERDA (VPS 320 cm/s = >70% estenose) + paresia BRAÇO ESQUERDO (= território hemisfério DIREITO?) - aqui há aparente paradoxo, mas pelo padrão da questão a lesão sintomática a tratar é a CIE pelo grau de estenose. ENDARTERECTOMIA CAROTÍDEA INDICADA para estenose ≥70% SINTOMÁTICA (benefício mais robusto - ECST/NASCET). Reserva cerebrovascular reduzida (apneia+) confirma má hemodinâmica. Subclávia (fenômeno de roubo): só se sintomático, geralmente angioplastia. Carótida EXTERNA: irrelevante para AVC. Origem carótida comum: lesão difícil, alto risco. Em octogenário, ANGIOPLASTIA/STENT carotídeo pode ser preferida à endarterectomia."
  },
  {
    n: 205,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Síndrome compartimental", "Nervo fibular"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Jovem, trauma + revascularização + FASCIOTOMIA do MI. Acorda com IMPOSSIBILIDADE DE DORSIFLEXÃO do pé (pé caído). Nervo afetado?",
    alternativas: {
      A: "Safeno.",
      B: "FIBULAR (FÍBULAR COMUM/PERONEAL).",
      C: "Tibial anterior.",
      D: "Tibial posterior."
    },
    gabarito: "B",
    explicacao: "NERVO FIBULAR COMUM (peroneal/peroneal) inerva os compartimentos ANTERIOR e LATERAL da perna - responsáveis pela DORSIFLEXÃO DO PÉ e EVERSÃO. Lesão = PÉ CAÍDO ('foot drop'). Vulnerável: 1) na CABEÇA DA FÍBULA (sítio mais comum de lesão por compressão); 2) Durante FASCIOTOMIA mal executada do compartimento lateral. NERVO TIBIAL POSTERIOR inerva compartimento posterior (flexão plantar). NERVO SAFENO é apenas sensitivo (face medial da perna). 'Tibial anterior' (C) é músculo, não nervo. FASCIOTOMIA da perna: 4 compartimentos, incisões antero-lateral E pósteromedial - cuidado com nervo fibular na cabeça da fíbula."
  },
  {
    n: 206,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Vascular",
    subtemas: ["Flegmasia cerulea dolens", "Trombose iliacofemoral"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 58 anos, pós-artroscopia, profilaxia 30 dias. D42: após fisioterapia, dor súbita MID, aumento volume, dor constante. Reintroduzida anticoagulação. 24h: PIORA importante de dor e volume. Diagnóstico e conduta?",
    alternativas: {
      A: "Trombose progressiva; ANTICOAGULAÇÃO plena.",
      B: "TROMBOSE REFRATÁRIA / flegmasia cerulea / TROMBECTOMIA VENOSA.",
      C: "Síndrome da pedrada; fasciotomia e drenagem.",
      D: "Oclusão arterial; trombectomia arterial."
    },
    gabarito: "B",
    explicacao: "TVP ILEOFEMORAL EXTENSA COM PIORA APESAR DE ANTICOAGULAÇÃO PLENA: configura quadro de FLEGMASIA CERULEA DOLENS (forma grave de TVP com cianose, edema maciço, dor intensa) ou TROMBOSE REFRATÁRIA. Risco de gangrena venosa (necrose tecidual por estase) e síndrome compartimental venosa. Tratamento: TROMBECTOMIA VENOSA cirúrgica OU TROMBOLÍTICO DIRIGIDO POR CATETER (CDT) + angioplastia se síndrome de May-Thurner. Anticoagulação plena isolada (A) já falhou. 'Síndrome da pedrada' (C) é rotura muscular - quadro diferente. Oclusão arterial (D) teria frialdade/ausência de pulsos."
  },
  {
    n: 207,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cabeça e Pescoço",
    subtemas: ["Tumor de parótida", "Punção aspirativa"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 47 anos, não-tabagista, encaminhado para 'biópsia de linfonodo cervical'. Exame: nódulo PRÉ-AURICULAR 1 cm direito, liso, indolor, CARTILAGÍNEO, móvel. Conduta MAIS adequada?",
    alternativas: {
      A: "Biópsia incisional.",
      B: "Biópsia excisional.",
      C: "Biópsia com agulha grossa (core).",
      D: "PUNÇÃO ASPIRATIVA POR AGULHA FINA (PAAF)."
    },
    gabarito: "D",
    explicacao: "NÓDULO PARÓTIDA (pré-auricular): NÃO É LINFONODO! Características clássicas de TUMOR DE PARÓTIDA - localização anatômica, móvel, consistência cartilaginosa (sugestivo de adenoma pleomórfico, mais comum). NUNCA fazer BIÓPSIA INCISIONAL/EXCISIONAL ou CORE em tumor de parótida: 1) Risco de LESÃO DO NERVO FACIAL (atravessa a glândula); 2) IMPLANTE TUMORAL no trajeto (adenoma pleomórfico tem alta recidiva se rotura capsular); 3) NÃO É CIRURGIA ELETIVA com técnica adequada. PAAF é o método correto (segura, acurada). Tratamento definitivo após PAAF: parotidectomia."
  },
  {
    n: 208,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Endocrinologia Cirúrgica",
    subtemas: ["NEM 1", "Hiperparatireoidismo", "Gastrinoma"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 52 anos, úlceras pépticas de REPETIÇÃO, FAMILIARES com câncer 'da barriga'. Cólica nefrética + TC: cálculos renais + NÓDULOS PANCREÁTICOS. Cálcio total 14,5 (HIPERCALCEMIA) + PTH 312 (elevado). NEM tipo?",
    alternativas: {
      A: "NEM TIPO 1.",
      B: "NEM 2A.",
      C: "NEM 2B.",
      D: "NEM 3."
    },
    gabarito: "A",
    explicacao: "NEM 1 (síndrome de Wermer): mutação MEN1 - tríade '3 Ps': PARATIREOIDE (hiperparatireoidismo primário hipercalcêmico, mais comum, primeira manifestação geralmente), PÂNCREAS (tumores neuroendócrinos - GASTRINOMA é o mais frequente, ZES = úlceras pépticas recorrentes), PITUITÁRIA (adenomas hipofisários, prolactinoma mais comum). Caso CLÁSSICO de NEM1: úlceras pépticas (ZES) + nódulos pancreáticos (gastrinoma) + hipercalcemia/HPP. NEM 2A = carcinoma medular tireoide + feocromocitoma + HPP. NEM 2B = CMT + feo + neuromas mucosos + hábito marfanóide. 'NEM 3' não existe na classificação atual."
  },
  {
    n: 209,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cabeça e Pescoço",
    subtemas: ["Nódulo cervical", "Tabagismo", "CEC"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 62 anos, TABAGISTA 20 anos-maço, NÃO etilista. Nódulo cervical 3 cm no TRIÂNGULO CAROTÍDEO direito há 3 meses, móvel, indolor, ENDURECIDO. Sem sinais flogísticos. Principal suspeita?",
    alternativas: {
      A: "Paraganglioma.",
      B: "NEOPLASIA MALIGNA (linfonodo metastático).",
      C: "Anomalia congênita.",
      D: "Linfonodomegalia reacional."
    },
    gabarito: "B",
    explicacao: "Nódulo cervical >2 cm + ENDURECIDO + EVOLUÇÃO >3 meses + ADULTO TABAGISTA = ALTÍSSIMA SUSPEITA DE LINFONODO METASTÁTICO de carcinoma escamoso (CEC) DE CABEÇA E PESCOÇO (orofaringe, laringe, base de língua, hipofaringe). Investigar: exame de via aérea superior (laringoscopia, nasofaringoscopia) + PAAF do nódulo + TC/RM. 80% dos nódulos cervicais em ADULTOS são neoplásicos (regra dos 80 de Skandalakis). PARAGANGLIOMA é pulsátil, em local específico (corpo carotídeo). Linfonodomegalia REACIONAL: pequena, móvel, fugaz. Anomalia congênita (cisto branquial) em jovens."
  },
  {
    n: 210,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cabeça e Pescoço",
    subtemas: ["Angina de Ludwig", "Infecção odontogênica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 32 anos, 4 dias pós-extração 2º molar inferior E. Febre + queda EG + AUMENTO DE VOLUME CERVICAL bilateral, drenagem purulenta pela mucosa. Edema/hiperemia em REGIÃO SUBMANDIBULAR. Diagnóstico e complicação?",
    alternativas: {
      A: "Actinomicose / sepse.",
      B: "Cisto dentígero / necrose mandibular.",
      C: "Abscesso cervical / necrose mandibular.",
      D: "ANGINA DE LUDWIG / OBSTRUÇÃO RESPIRATÓRIA."
    },
    gabarito: "D",
    explicacao: "ANGINA DE LUDWIG: CELULITE BILATERAL dos espaços submandibular + sublingual + submentoniano de origem ODONTOGÊNICA (frequentemente 2º/3º molares inferiores). Edema brawny rapidamente progressivo, ELEVAÇÃO DO ASSOALHO BUCAL e DESLOCAMENTO POSTERIOR DA LÍNGUA → OBSTRUÇÃO RESPIRATÓRIA AGUDA (principal causa de morte). EMERGÊNCIA: 1) MANEJO DE VIA AÉREA precoce (IOT difícil, considerar traqueostomia/cricotireoidostomia); 2) ATB amplo espectro (anaeróbios + Gram+); 3) DRENAGEM CIRÚRGICA dos espaços. Mortalidade ainda significativa se não tratada. Actinomicose (A) é crônica, indolente."
  }
);

console.log("Bloco 3 EC6 (181-210) adicionado");

// ==================== EC6 COLOPROCTOLOGIA - Bloco 4 (211-240) ====================
// Tireoide, paratireoide, urologia, sífilis, CA esôfago/gástrico/reto, hepatobiliar/pâncreas, bariátrica
QUESTOES.push(
  {
    n: 211,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Endocrinologia Cirúrgica",
    subtemas: ["Tireotoxicose", "Doença de Graves", "Cintilografia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 43 anos, tremores, vasodilatação, agitação, palpitação. Aumento DIFUSO da tireoide, SEM exoftalmo ou mixedema. TSH <0,01, T4L 2,2. Hipótese e achados esperados na cintilografia?",
    alternativas: {
      A: "Hipertireoidismo - tireoidite - HIPOCAPTAÇÃO difusa.",
      B: "Hipertireoidismo - tireoidite - HIPERCAPTAÇÃO difusa.",
      C: "Tireotoxicose - tireoidite - HIPOCAPTAÇÃO difusa.",
      D: "Tireotoxicose - tireoidite - HIPERCAPTAÇÃO difusa."
    },
    gabarito: "D",
    explicacao: "DIFERENCIAÇÃO ENTRE TIREOTOXICOSE E HIPERTIREOIDISMO: TIREOTOXICOSE = síndrome clínica de excesso de hormônio tireoidiano (independente da causa). HIPERTIREOIDISMO = hiperprodução pela tireoide (subconjunto da tireotoxicose). CINTILOGRAFIA: HIPERCAPTAÇÃO difusa = doença de GRAVES (hiperprodução autoimune, mais comum); HIPOCAPTAÇÃO = tireoidite subaguda/silenciosa, tireotoxicose factícia, struma ovarii. A imagem clínica de bócio difuso + tireotoxicose sem oftalmopatia é compatível com GRAVES inicial = HIPERCAPTAÇÃO. ATENÇÃO: o gabarito oficial considera o termo 'tireoidite' como genérico - apenas a opção D combina tireotoxicose + hipercaptação. Tecnicamente o quadro é GRAVES, não tireoidite."
  },
  {
    n: 212,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Endocrinologia Cirúrgica",
    subtemas: ["Carcinoma anaplásico de tireoide", "Insuficiência respiratória"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 72 anos, INSUFICIÊNCIA RESPIRATÓRIA. Há muitos anos teve nódulos cervicais. Há 3 SEMANAS: CRESCIMENTO RÁPIDO + piora de voz e respiração. Hipótese?",
    alternativas: {
      A: "CARCINOMA ANAPLÁSICO DA TIREOIDE.",
      B: "Carcinoma papilífero da tireoide.",
      C: "Carcinoma folicular da tireoide.",
      D: "Carcinoma medular da tireoide."
    },
    gabarito: "A",
    explicacao: "CARCINOMA ANAPLÁSICO DA TIREOIDE: neoplasia indiferenciada, AGRESSIVA, das mais letais conhecidas (sobrevida média 6 meses). Apresentação clássica: IDOSO (>60 anos) com BÓCIO de longa data + CRESCIMENTO RÁPIDO (semanas) + sintomas COMPRESSIVOS (rouquidão, disfagia, dispneia, INSUFICIÊNCIA RESPIRATÓRIA por invasão traqueal). Frequentemente surge sobre carcinoma diferenciado pré-existente (desdiferenciação). Tratamento: paliativo na maioria (traqueostomia para via aérea, QT/RT). Carcinoma papilífero/folicular crescem em ANOS, não semanas. Medular tem síntese de calcitonina."
  },
  {
    n: 213,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Endocrinologia Cirúrgica",
    subtemas: ["Feocromocitoma", "Crise hipertensiva", "Risco anestésico"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 35 anos, admitido para TIREOIDECTOMIA por nódulo Bethesda IV. SEM avaliação pré-anestésica. Em anamnese revela episódios PAROXÍSTICOS de mal-estar com palidez + sudorese (PA 190x120). Massa abdominal 5 cm no QSE. Atitude e diagnóstico?",
    alternativas: {
      A: "SUSPENDER A OPERAÇÃO; FEOCROMOCITOMA.",
      B: "Suspender a operação; tumor pancreático produtor de VIP.",
      C: "Manter a operação; carcinoma medular da tireoide.",
      D: "Manter a operação; paraganglioma intratireoideo."
    },
    gabarito: "A",
    explicacao: "FEOCROMOCITOMA NÃO DIAGNOSTICADO + cirurgia eletiva = RISCO PROIBITIVO DE MORTE POR CRISE HIPERTENSIVA INTRAOPERATÓRIA. Tríade clássica: CEFALEIA + SUDORESE + PALPITAÇÕES paroxísticas + HAS PAROXÍSTICA. A massa em QSE sugere TUMOR ADRENAL. SUSPENDER a cirurgia IMEDIATAMENTE. Investigar: catecolaminas/metanefrinas urinárias + TC/RM. SE confirmado: BLOQUEIO ALFA-ADRENÉRGICO (fenoxibenzamina) por 7-14 dias ANTES de qualquer cirurgia, depois beta-bloqueio. Pode ser parte de NEM 2 (carcinoma medular + feocromocitoma + HPP) - ainda mais perigoso!"
  },
  {
    n: 214,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia",
    subtemas: ["Pielonefrite obstrutiva", "Nefrostomia/duplo J"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 42 anos, cólica renal E + febre 38,3°C, dor refratária, hematúria + piúria, TC: cálculo 7 mm em ureter distal E com hidronefrose. Mantém febre + reduz diurese. Conduta correta?",
    alternativas: {
      A: "RM (melhor sensibilidade que TC).",
      B: "Terapia expulsiva para cálculos <10 mm INDEPENDENTE de infecção.",
      C: "PIELONEFRITE OBSTRUTIVA = DERIVAÇÃO URGENTE via NEFROSTOMIA percutânea ou CATETER DUPLO J.",
      D: "Tratar ambulatorialmente com ATB oral + AINE."
    },
    gabarito: "C",
    explicacao: "PIELONEFRITE OBSTRUTIVA / UROSSEPSE OBSTRUTIVA: emergência urológica. Cálculo + infecção urinária + sinais sistêmicos (febre, oligúria) = RISCO DE SEPSE GRAVE/CHOQUE SÉPTICO. Conduta IMEDIATA: 1) ATB EV amplo espectro (cobertura para gram-negativos); 2) DRENAGEM URGENTE da via excretora obstruída - NEFROSTOMIA PERCUTÂNEA (preferida se sepse grave) ou CATETER DUPLO J. NÃO TENTAR tratar o cálculo na fase aguda. Após resolução da infecção, tratar o cálculo eletivamente (LECO, ureteroscopia). Terapia expulsiva está CONTRAINDICADA em quadro infeccioso. TC sem contraste é padrão-ouro para cálculos."
  },
  {
    n: 215,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia/Oncologia",
    subtemas: ["Carcinoma de células renais", "Trombo tumoral em cava"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 55 anos, dor lombar D + perda 10 kg em 6m. TC: extensa lesão renal D + TROMBO TUMORAL em veia renal e cava infradiafragmática. Sem linfonodos. Microsondulos pulmonares 0,5 cm inespecíficos. Diagnóstico e conduta?",
    alternativas: {
      A: "Localmente avançado; QT com cisplatina pré-op.",
      B: "Metastático em cava; sistêmico + RT.",
      C: "TUMOR RENAL LOCALMENTE AVANÇADO; NEFRECTOMIA RADICAL DIREITA + TROMBECTOMIA DE CAVA.",
      D: "Doença avançada; tratamento paliativo."
    },
    gabarito: "C",
    explicacao: "CARCINOMA DE CÉLULAS RENAIS (CCR) com TROMBO TUMORAL NA VEIA CAVA INFERIOR: classificação de Mayo Clinic (níveis I-IV). Trombo infradiafragmático = nível II-III. Não é metástase (é extensão tumoral por contigüidade vascular) - LOCALMENTE AVANÇADO. Tratamento: NEFRECTOMIA RADICAL + TROMBECTOMIA DE CAVA (cirurgia complexa, abordagem vascular). CCR é QUIMIORRESISTENTE - cisplatina não tem papel; tratamento sistêmico moderno em CCR avançado/metastático: TKI (sunitinibe, axitinibe) e/ou IMUNOTERAPIA (nivolumabe+ipilimumabe). Microsondulos pulmonares 0,5 cm são INESPECÍFICOS. Mesmo com doença metastática, NEFRECTOMIA CITORREDUTORA pode ser indicada em casos selecionados."
  },
  {
    n: 216,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Infectologia",
    subtemas: ["Sífilis tratada", "VDRL vs FTA-ABS"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 32 anos, sífilis primária diagnosticada há 14m (cancro indolor regredido, VDRL 1:64, FTA+, HIV/HBV/HCV negativos), tratada com penicilina benzatina dose única. Atual: VDRL 1:4 + FTA reagente. Interpretação?",
    alternativas: {
      A: "Falha terapêutica - posologia adequada seria 3 doses.",
      B: "Reinfecção - novo tratamento indicado.",
      C: "Diagnóstico duvidoso - FTA-ABS falso-positivo.",
      D: "RESPOSTA IMUNOLÓGICA ESPERADA - VDRL caiu adequadamente e FTA pode permanecer reagente."
    },
    gabarito: "D",
    explicacao: "SEGUIMENTO SOROLÓGICO DA SÍFILIS: TRATAMENTO ADEQUADO de sífilis primária = PENICILINA BENZATINA 2,4 milhões UI DOSE ÚNICA (sífilis primária, secundária ou latente RECENTE <1 ano). Resposta sorológica satisfatória: QUEDA do VDRL ≥4 DILUIÇÕES (2 títulos) em até 6-12 meses. Caso: VDRL 1:64 → 1:4 = queda de 4 diluições = RESPOSTA ADEQUADA. FTA-ABS (TREPONÊMICO) - permanece REAGENTE para SEMPRE em quem teve sífilis (cicatriz sorológica). NÃO é falso-positivo. A persistência do FTA reagente NÃO indica falha terapêutica nem reinfecção. Tratamento foi correto."
  },
  {
    n: 217,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia",
    subtemas: ["Litíase renal", "Prevenção", "Cálcio"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre PREVENÇÃO DE LITÍASE RENAL recorrente, qual orientação dietética está CORRETA?",
    alternativas: {
      A: "INGESTÃO ADEQUADA DE CÁLCIO ALIMENTAR é recomendada - reduz absorção intestinal de OXALATO.",
      B: "Citrato de potássio empiricamente em todos.",
      C: "Restrição de frutas cítricas (acidez urinária).",
      D: "Minimizar cálcio (aumenta excreção urinária)."
    },
    gabarito: "A",
    explicacao: "PARADIGMA MODERNO DA LITÍASE CÁLCICA: a restrição de cálcio dietético AUMENTA O RISCO de cálculos (contraintuitivo!). MECANISMO: cálcio no intestino LIGA-SE AO OXALATO, formando complexo NÃO-ABSORVÍVEL eliminado nas fezes. Sem cálcio dietético, OXALATO LIVRE é absorvido, AUMENTA OXALÚRIA, gerando cálculos de oxalato de cálcio. Recomendação: INGESTÃO NORMAL de cálcio alimentar (1000-1200 mg/dia, dietético, NÃO suplementação). Outras medidas: hidratação (urina >2,5L/dia), restrição de sódio, oxalato e proteína animal. Citrato de potássio: só após avaliação metabólica (hipocitratúria, RTA). Citrato (frutas cítricas) é PROTETOR contra cálculos."
  },
  {
    n: 218,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia",
    subtemas: ["Cólica nefrética", "Diagnóstico por imagem"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 34 anos, dor lombar E em cólica + escurecimento da urina + Giordano+ E. Após analgésicos parenterais, próxima conduta?",
    alternativas: {
      A: "Exames + ATB empírica.",
      B: "RNM de abdome e pelve.",
      C: "RX simples + USG (mesma sensibilidade da TC).",
      D: "EXAMES SÉRICOS/URINÁRIOS + TC ABDOME E PELVE SEM CONTRASTE."
    },
    gabarito: "D",
    explicacao: "CÓLICA NEFRÉTICA: investigação padrão = TC DE ABDOME E PELVE SEM CONTRASTE (uro-TC sem contraste). Vantagens: sensibilidade ~95-98% para cálculos urinários, identifica localização/tamanho/densidade do cálculo, detecta hidronefrose, diagnósticos diferenciais (apendicite, diverticulite). RNM (B) não é exame de primeira linha para cálculos (cálculo é pobre em sinal, não capta contraste). USG (C) é boa para hidronefrose mas sensibilidade BAIXA para cálculos ureterais. Sem sinais infecciosos, ATB (A) não está indicado. Exames laboratoriais (Cr, urina I, hemograma) sempre complementares."
  },
  {
    n: 219,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia/Trauma",
    subtemas: ["Lesão pedículo renal", "Trauma renal"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 39 anos, queda de andaime (~3m) há 4 dias, hematúria, dor lombar E. TC contrastada: RIM D normal + EXCLUSÃO RENAL COMPLETA À ESQUERDA. Diagnóstico e conduta?",
    alternativas: {
      A: "Trombose veia renal E; nefrectomia E.",
      B: "Trombose artéria renal E; observação clínica.",
      C: "Trombose artéria renal E; trombólise.",
      D: "LESÃO DO PEDÍCULO RENAL ESQUERDO; REVASCULARIZAÇÃO OU ANGIOPLASTIA COM STENT."
    },
    gabarito: "D",
    explicacao: "EXCLUSÃO RENAL COMPLETA PÓS-TRAUMA = lesão da ARTÉRIA RENAL ou avulsão do pedículo. Mecanismo: desaceleração brusca causa CISALHAMENTO da artéria renal (sem perfusão = rim não capta contraste). Trauma renal grau V (AAST). LIMITE DE TEMPO PARA SALVAR O RIM: 4-6 HORAS de isquemia quente (depois fibrose irreversível). NESTE CASO: 4 DIAS de exclusão = rim provavelmente não viável. Mesmo assim, indicação atual: ANGIOTOMOGRAFIA + tentativa de RESTAURAR FLUXO via STENT ENDOVASCULAR (menos invasivo, possibilidade de retorno parcial de função). Observação (B) inadequada (já se passou tempo). Nefrectomia (A) precoce em paciente estável é evitada quando há chance de recuperação."
  },
  {
    n: 220,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Urologia/Oncologia",
    subtemas: ["Câncer de bexiga", "VI-RADS", "RTUB"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 66 anos, tabagista pesado, hematúria macroscópica terminal indolor. RM: lesão vegetante 7 cm em parede lateral E da bexiga, VI-RADS 4, sem linfonodos/hidronefrose. Conduta INICIAL?",
    alternativas: {
      A: "QT neoadjuvante baseada em cisplatina + cistoprostatectomia.",
      B: "Cistoprostatectomia robô-assistida upfront + QT adjuvante.",
      C: "QT + RT (preservação vesical).",
      D: "RESSECÇÃO TRANSURETRAL DE BEXIGA (RTUB) - anatomopatológico definirá próximas condutas."
    },
    gabarito: "D",
    explicacao: "INVESTIGAÇÃO DE TUMOR VESICAL: o passo OBRIGATÓRIO INICIAL é SEMPRE a RESSECÇÃO TRANSURETRAL DE BEXIGA (RTUB). Objetivos: 1) DIAGNÓSTICO HISTOPATOLÓGICO (urotelial vs outros tipos); 2) ESTADIAMENTO patológico (T1, T2, T3 - se invade músculo detrusor); 3) Em tumores NÃO-INVASIVOS (Ta, T1), a RTUB COMPLETA pode ser CURATIVA + BCG intravesical. VI-RADS 4 sugere doença INVASIVA MUSCULAR (alta probabilidade), mas o diagnóstico DEFINITIVO é PATOLÓGICO. Após RTUB confirmar T2+: discutir QT NEOADJUVANTE (cisplatina) + CISTECTOMIA RADICAL. NUNCA fazer cistectomia ou QT sem histopatológico definitivo."
  },
  {
    n: 221,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Adenocarcinoma de esôfago", "Epidemiologia"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Sobre ADENOCARCINOMA DE ESÔFAGO:",
    alternativas: {
      A: "Maioria diagnosticada em estágio inicial pela vigilância do Barrett.",
      B: "Incidência tem DIMINUÍDO drasticamente nos países ocidentais.",
      C: "Mundialmente é o tipo MAIS COMUM de CA esofágico.",
      D: "Tem prognóstico FAVORÁVEL se PRECOCE, mas MAIORIA é DETECTADA AVANÇADO - uma das neoplasias COM MAIOR LETALIDADE em ambos os sexos."
    },
    gabarito: "D",
    explicacao: "ADENOCARCINOMA DE ESÔFAGO: tipo histológico EM ASCENSÃO no Ocidente (associado a DRGE, OBESIDADE, ESÔFAGO DE BARRETT, tabagismo). CEC ainda é o mais comum GLOBALMENTE (predomina no Oriente, África - associado álcool/tabaco/agentes irritativos). DETECÇÃO TARDIA é a regra (sintomas tardios: disfagia já indica doença avançada). PROGNÓSTICO RUIM: sobrevida em 5 anos ~20% global, <5% em doença avançada. Uma das neoplasias DIGESTIVAS MAIS LETAIS junto com pâncreas. Vigilância de Barrett detecta apenas FRAÇÃO dos casos (a maioria não tem Barrett conhecido). A alternativa D resume corretamente o cenário."
  },
  {
    n: 222,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Esofagectomia", "Neoadjuvância (CROSS)"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 51 anos, tabagista, adenoCA de esôfago distal (36 cm da ADS), lesão circunferencial estenosante. TC: linfonodos regionais suspeitos. PET: hipercaptação no esôfago + linfonodos. Tratamento?",
    alternativas: {
      A: "TRATAMENTO NEOADJUVANTE seguido de ESOFAGECTOMIA EM 2 CAMPOS.",
      B: "Esofagectomia com linfadenectomia em 3 campos de princípio.",
      C: "Prótese endoscópica + QT definitiva.",
      D: "Gastrectomia total com esofagectomia distal + D2."
    },
    gabarito: "A",
    explicacao: "ADENOCARCINOMA DE ESÔFAGO DISTAL LOCALMENTE AVANÇADO (cT3/T4 cN+ pelo PET): tratamento PADRÃO atual = NEOADJUVÂNCIA (QT+RT - protocolo CROSS, ou FLOT em adenoCA da JEG/Siewert I-II) seguida de ESOFAGECTOMIA EM DOIS CAMPOS (linfadenectomia abdominal + torácica). Estudo CROSS: QT/RT neoadjuvante AUMENTA sobrevida em vs cirurgia isolada. ESOFAGECTOMIA EM 3 CAMPOS (linfadenectomia cervical) está reservada para CEC do esôfago MÉDIO/SUPERIOR ou casos selecionados de adeno de JEG com linfonodos cervicais positivos - NÃO é rotina em adenoCA distal. Prótese (C) é PALIATIVA (doença irressecável). Gastrectomia total + esofagectomia (D) seria para câncer GÁSTRICO PROXIMAL invadindo esôfago, não o contrário."
  },
  {
    n: 223,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["GIST", "Imunohistoquímica"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 67 anos, massa subepitelial 7 cm em grande curvatura gástrica, extra-gástrica à ecoendoscopia. Punção: neoplasia fusocelular, 10 mitoses/50CGA. IHQ: actina ML+, DOG-1+, CD117+. Diagnóstico?",
    alternativas: {
      A: "Linfoma.",
      B: "Schwannoma.",
      C: "Leiomiossarcoma.",
      D: "TUMOR DO ESTROMA GASTROINTESTINAL (GIST)."
    },
    gabarito: "D",
    explicacao: "GIST: marcadores PATOGNOMÔNICOS = CD117 (c-KIT) + DOG-1 POSITIVOS. Origem nas células intersticiais de Cajal (marcapasso intestinal). Aspectos morfológicos: tumor fusocelular ou epitelioide. ESTRATIFICAÇÃO DE RISCO de Miettinen-Lasota: baseado em LOCALIZAÇÃO (gástrico é menos agressivo que delgado/reto), TAMANHO e ÍNDICE MITÓTICO. Este caso: 7 cm + 10 mitoses/50CGA = RISCO INTERMEDIÁRIO-ALTO (gástrico). LEIOMIOMA/LEIOMIOSSARCOMA verdadeiros são RAROS no TGI (CD117 NEGATIVO, desmina+, actina+). SCHWANNOMA: S100+, CD117-. LINFOMA: CD20/CD3+, CD117-."
  },
  {
    n: 224,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Cirurgia do GIST", "Margens livres"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "GIST gástrico 7 cm na GRANDE CURVATURA, abaulando pâncreas/baço/cólon transverso SEM invasão direta, sem metástases. Conduta cirúrgica?",
    alternativas: {
      A: "GASTRECTOMIA SUBTOTAL COM LINFADENECTOMIA D2.",
      B: "Gastrectomia total com D2.",
      C: "Gastrectomia vertical (sleeve) com margens livres.",
      D: "Gastrectomia total + esplenectomia + D2."
    },
    gabarito: "A",
    explicacao: "CIRURGIA DO GIST: princípios = 1) RESSECÇÃO COM MARGENS LIVRES (R0), SEM necessidade de margens amplas (1 cm é suficiente); 2) SEM LINFADENECTOMIA SISTEMÁTICA (GIST raramente metastatiza por via linfática - <2-5%, exceto subtipos pediátricos); 3) EVITAR RUPTURA TUMORAL (sangramento, implante peritoneal); 4) Ressecção em cunha ou segmentar quando possível, gastrectomia formal quando necessário pelo tamanho/localização. Para tumor de 7 cm em grande curvatura: GASTRECTOMIA SUBTOTAL com margens livres geralmente suficiente. Erro do gabarito 'A': mencionar D2 - tecnicamente o GIST não requer linfadenectomia formal, mas a banca trata como cirurgia padrão. Imatinib (Gleevec) adjuvante por 3 anos se alto risco."
  },
  {
    n: 225,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer de pâncreas", "Ressecabilidade"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 65 anos, lesão sólida infiltrativa no processo uncinado pancreático com envolvimento da artéria e veia mesentérica superiores em MENOS DE 180°, sem trombose. Tronco celíaco livre. CA 19-9 1250. Classificação de ressecabilidade?",
    alternativas: {
      A: "BORDERLINE.",
      B: "Ressecável.",
      C: "Metastático.",
      D: "Localmente avançado."
    },
    gabarito: "A",
    explicacao: "CLASSIFICAÇÃO DE RESSECABILIDADE DO CÂNCER DE PÂNCREAS (NCCN/MD Anderson): RESSECÁVEL: sem contato vascular ou contato <180° com veias (VMS/VP) sem distorção. BORDERLINE-RESSECÁVEL: contato com VMS/VP >180° OU com distorção/trombose curta; contato ARTERIAL <180° (AMS, tronco celíaco, hepática); ou características anatômicas que dificultam R0. LOCALMENTE AVANÇADO/IRRESSECÁVEL: contato arterial >180°; envolvimento da aorta. METASTÁTICO: doença a distância. Este caso: contato com AMS <180° + VMS <180° SEM trombose = BORDERLINE. Tratamento: NEOADJUVÂNCIA com FOLFIRINOX (ou gencitabina+nabPaclitaxel) seguida de reavaliação de ressecabilidade."
  },
  {
    n: 226,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["CA 19-9", "Avaliação de resposta"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Adenocarcinoma de pâncreas borderline, CA 19-9 1250, tratado com QT neoadjuvante. Melhor forma de AVALIAR RESPOSTA ao tratamento?",
    alternativas: {
      A: "Melhora da dor.",
      B: "Ganho de peso.",
      C: "Diminuição do tamanho do tumor.",
      D: "QUEDA DO MARCADOR TUMORAL (CA 19-9)."
    },
    gabarito: "D",
    explicacao: "AVALIAÇÃO DE RESPOSTA À NEOADJUVÂNCIA EM CA DE PÂNCREAS: o CA 19-9 É O MELHOR INDICADOR. POR QUÊ? 1) Tumor pancreático tem RESPOSTA RADIOLÓGICA POBRE (estroma desmoplásico fibroso não regride significativamente mesmo com boa resposta tumoral); 2) Tamanho na TC PODE NÃO REFLETIR atividade tumoral residual; 3) CA 19-9 reflete VIABILIDADE TUMORAL e correlaciona com sobrevida. Queda de CA 19-9 >50% pós-neoadjuvância = bom prognóstico, candidatos a cirurgia. Dor (A) e peso (B) são SINTOMÁTICOS, não-objetivos. Tamanho na TC (C) - útil mas limitado, RECIST modificado é usado mas inferior ao CA 19-9. Pacientes com CA 19-9 NORMAL ao diagnóstico (10% não produzem) = uso de imagem isolada."
  },
  {
    n: 227,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Esofágica",
    subtemas: ["Acalasia tipo III", "Classificação de Chicago"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 50 anos, baiano, disfagia + regurgitação 4 anos, perda 9 kg, Eckardt 8. Manometria: ACALASIA TIPO III (Chicago 4.0). Sobre os achados:",
    alternativas: {
      A: "Acalasia com grau III RADIOLÓGICO.",
      B: "Ausência de relaxamento configura o diagnóstico isolado.",
      C: "ACALASIA TIPO III: CONTRAÇÃO ESPÁSTICA do corpo do esôfago, INDEPENDENTE do relaxamento do EIE.",
      D: "RX sugere dismotilidade LEVE (corpo não dilatado)."
    },
    gabarito: "C",
    explicacao: "CLASSIFICAÇÃO DE CHICAGO 4.0 DA ACALASIA (manometria de alta resolução): TIPO I (clássica): aperistalse SEM pressurização do corpo; TIPO II (com compressão): pressurização pan-esofágica em >20% das deglutições - MELHOR resposta a tratamento; TIPO III (ESPÁSTICA): contrações ESPÁSTICAS PREMATURAS no corpo do esôfago em ≥20% das deglutições - PIOR resposta a tratamentos convencionais (Heller/dilatação). Característica: ESPASMO independente do estado do esfíncter. CLASSIFICAÇÃO RADIOLÓGICA (Rezende para mega de Chagas: grau I a IV pela dilatação) não se aplica aqui. POEM (cardiomiotomia endoscópica) é EXCELENTE para tipo III (permite miotomia mais longa cobrindo segmento espástico)."
  },
  {
    n: 228,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Esofágica",
    subtemas: ["Tratamento de acalasia tipo III", "POEM vs Heller"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Acalasia tipo III, paciente jovem, falha de dilatações. Melhor tratamento?",
    alternativas: {
      A: "Esofagectomia por ser jovem.",
      B: "CARDIOMIOTOMIA LONGA + FUNDOPLICATURA PARCIAL pode tratar disfagia SEM grande risco de refluxo grave.",
      C: "POEM porque na acalasia tipo III não há refluxo após tratamento.",
      D: "Cardiomiotomia longa SEM fundoplicatura."
    },
    gabarito: "B",
    explicacao: "ACALASIA TIPO III - MIOTOMIA LONGA: necessária para cobrir TODO o segmento de espasmo esofágico (pode estender >10 cm), maior que a miotomia de Heller convencional (5-7 cm). POEM (cardiomiotomia endoscópica per-oral) é EXCELENTE OPÇÃO pois permite controlar a EXTENSÃO da miotomia conforme manometria - melhor para tipo III. PORÉM, POEM tem ALTA TAXA DE REFLUXO PÓS-OP (até 40-50%) pois NÃO ASSOCIA fundoplicatura. CARDIOMIOTOMIA DE HELLER LAPAROSCÓPICA + FUNDOPLICATURA PARCIAL (Dor anterior ou Toupet posterior, 180-270°) oferece controle de refluxo. A alternativa B reconhece a vantagem da fundoplicatura parcial em PREVENIR refluxo grave - completa não usada por causar disfagia em motilidade aperistáltica. POEM SEM fundoplicatura = refluxo significativo (C errada)."
  },
  {
    n: 229,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Câncer gástrico avançado", "Estadiamento"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 59 anos, adenocarcinoma gástrico DIFUSO em ANEL DE SINETE, lesão úlcero-infiltrativa começando 4 cm abaixo da TEG até antro proximal. TC abdome (mostra invasão local mas sem ascite/lesões a distância clara). Conduta?",
    alternativas: {
      A: "RM de fígado.",
      B: "PET-CT.",
      C: "QT perioperatória (esquema FLOT).",
      D: "CIRURGIA."
    },
    gabarito: "D",
    explicacao: "PERSPECTIVA DO GABARITO OFICIAL: a banca considera que diante de doença extensa em paciente sintomático, com TC já caracterizada, a CIRURGIA é a próxima etapa. ATENÇÃO: Esta é uma resposta debatível. NA PRÁTICA MODERNA, câncer gástrico AVANÇADO (cT3/T4 ou N+) tem indicação de QT PERIOPERATÓRIA (FLOT) ANTES da cirurgia (estudo FLOT4). PET/CT pode ser solicitado para descartar metástases ocultas em casos de alta suspeita. RM hepática para caracterizar lesões hepáticas inespecíficas. CONTEXTO CT difuso anel-de-sinete = LINITE PLÁSTICA, prognóstico ruim, indicação clássica de QT NEOADJUVANTE. Possível anulação ou gabarito C (perioperatória). Seguindo gabarito oficial: D."
  },
  {
    n: 230,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Cirurgia paliativa", "Gastrectomia higiênica"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Durante a cirurgia, tumor gástrico INVADIA segmentos 2 e 3 do fígado e CORPO PANCREÁTICO. Fundo gástrico livre. Conduta intraoperatória?",
    alternativas: {
      A: "Jejunostomia.",
      B: "GASTRECTOMIA HIGIÊNICA (paliativa).",
      C: "Gastrectomia subtotal + pancreatoesplenectomia + hepatectomia 2/3 + D2.",
      D: "Gastrectomia total + pancreatoesplenectomia + hepatectomia 2/3 + D2."
    },
    gabarito: "B",
    explicacao: "GASTRECTOMIA HIGIÊNICA (paliativa) - indicada quando há doença AVANÇADA NÃO-CURATIVA mas com SINTOMAS (sangramento, obstrução) ou EXTENSA INVASÃO MULTIESTRUTURAS impossibilitando R0 com morbimortalidade aceitável. Caso: invasão simultânea de FÍGADO (segs 2-3) + PÂNCREAS = doença T4b extensa. Ressecção multiorgânica (C/D) tem MORBIMORTALIDADE EXTREMAMENTE ALTA com sobrevida questionável - NÃO É padrão. Filosofia atual: NÃO oferecer ressecção heroica em CA gástrico T4 multiorgânico. GASTRECTOMIA PALIATIVA (subtotal/parcial) trata sintomas, evita progressão obstrutiva, mas SEM intuito curativo. Jejunostomia (A) só nutricional, sem tratar a doença. Posteriormente QT paliativa."
  },
  {
    n: 231,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Fissura anal crônica", "Tratamento conservador"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 55 anos, sangramento doloroso + dor à evacuação há 2 meses. Exame: fissura anal CRÔNICA 1 cm em linha média POSTERIOR + mínimo sangramento. Conduta?",
    alternativas: {
      A: "Esfincterotomia BILATERAL com secção COMPLETA do esfíncter interno.",
      B: "Cirurgia + ressecção de tecido hemorroidário e plicomas.",
      C: "ESFINCTEROTOMIA deve ser PRECEDIDA da correção de HÁBITOS alimentares/intestinais + VASODILATADOR TÓPICO por pelo menos 30 dias.",
      D: "Dilatação anal ambulatorial + banhos de assento."
    },
    gabarito: "C",
    explicacao: "FISSURA ANAL CRÔNICA (>4-6 semanas, com plicoma sentinela, papila hipertrófica, fibras esfincterianas visíveis): ALGORITMO de tratamento começa SEMPRE com TRATAMENTO CLÍNICO antes de cirurgia: 1) DIETÉTICO: fibras, hidratação (amolecer fezes); 2) HÁBITOS intestinais (não forçar evacuação); 3) Vasodilatadores TÓPICOS: NITROGLICERINA 0,2% ou DILTIAZEM 2% pomada por 6-8 SEMANAS - relaxam o esfíncter interno hipertônico, melhoram cicatrização (~70% sucesso). 4) Toxina botulínica em casos refratários. ESFINCTEROTOMIA LATERAL INTERNA (SOMENTE UNILATERAL, parcial, até a linha pectínea) é o tratamento cirúrgico padrão - só após falha clínica. BILATERAL ou TOTAL (A) causa INCONTINÊNCIA. Dilatação anal (D) está ABANDONADA (alta incontinência)."
  },
  {
    n: 232,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Deiscência pós-bypass", "Pneumoperitônio"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 36 anos, D7 pós-bypass em Y de Roux, dor abdominal súbita, FC 120, PA 70x50, DB+. TC: pneumoperitônio + líquido livre + extravasamento de contraste. Hipótese?",
    alternativas: {
      A: "Hemorragia digestiva.",
      B: "Trombose esplenomesentérica.",
      C: "Estenose da gastroenteroanastomose.",
      D: "DEISCÊNCIA DE ANASTOMOSE ou LINHA DE GRAMPEAMENTO."
    },
    gabarito: "D",
    explicacao: "DEISCÊNCIA / FÍSTULA pós-BYPASS gástrico em Y de Roux: complicação grave (1-5% dos casos), MORTALIDADE até 15% se não reconhecida rapidamente. PONTOS DE FÍSTULA: 1) Gastrojejunoanastomose (mais comum); 2) Linha de grampeamento do remanescente gástrico (estômago excluso); 3) Enteroanastomose pé do Y. Apresentação típica entre D3-D10: dor abdominal, taquicardia (>120 bpm é SINAL DE ALARME), febre, sinais peritoneais, sepse. TC: PNEUMOPERITÔNIO + LÍQUIDO LIVRE + EXTRAVASAMENTO DE CONTRASTE ORAL. Hemorragia digestiva (A): sangue/anemia. Trombose mesentérica (B): isquemia, sangue venoso. Estenose (C): vômitos, sem peritonite."
  },
  {
    n: 233,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Tratamento de deiscência grave", "Sepse"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Deiscência de bypass gástrico com PA 70x50, FC 120, DB+, pneumoperitônio + líquido livre. Tratamento?",
    alternativas: {
      A: "LAPAROTOMIA EXPLORADORA.",
      B: "Dilatação endoscópica.",
      C: "Observação + ATB amplo espectro.",
      D: "Endoscopia + SNG."
    },
    gabarito: "A",
    explicacao: "DEISCÊNCIA com INSTABILIDADE HEMODINÂMICA + PERITONITE DIFUSA (DB+, pneumoperitônio, líquido livre, taquicardia, hipotensão) = INDICAÇÃO ABSOLUTA DE CIRURGIA URGENTE - LAPAROTOMIA ou LAPAROSCOPIA. Princípios: 1) Lavagem da cavidade; 2) Identificação e tentativa de reparo do orifício se possível (frequentemente impossível por friabilidade dos tecidos); 3) DRENAGEM exteriorizando a fístula; 4) JEJUNOSTOMIA NUTRICIONAL; 5) ATB amplo espectro. Após estabilização, ENDOSCOPIA pode complementar com colocação de PRÓTESE ENDOSCÓPICA para cobrir o orifício. Observação (C) em paciente instável = morte. Dilatação (B) é para estenose, NÃO fístula. Endoscopia isolada (D) inadequada no paciente instável."
  },
  {
    n: 234,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia/Oncologia",
    subtemas: ["Câncer de reto", "Neoadjuvância", "Fáscia mesorretal"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 45 anos, adenoCA pouco diferenciado de RETO MÉDIO (7 cm da borda anal), linfonodos mesorretais positivos, invasão parede >10 mm, FÁSCIA MESORRETAL COMPROMETIDA. Sem metástases.",
    alternativas: {
      A: "ALTA chance de recidiva pélvica - NEOADJUVÂNCIA COM QT/RT JUSTIFICADA.",
      B: "Retossigmoidectomia com excisão PARCIAL do mesorreto.",
      C: "Neoadjuvância com imunoterapia EXCLUSIVA.",
      D: "Amputação abdominoperineal para controle de margem distal."
    },
    gabarito: "A",
    explicacao: "CÂNCER DE RETO MÉDIO LOCALMENTE AVANÇADO (cT3 invasão >5 mm, cN+, FÁSCIA MESORRETAL COMPROMETIDA = MARGEM CIRCUNFERENCIAL AMEAÇADA): ALTO RISCO DE RECIDIVA LOCAL. Tratamento PADRÃO: NEOADJUVÂNCIA com QT/RT longa (FLOT/CAPOX + RT 50,4 Gy) → REAVALIAÇÃO → CIRURGIA com EXCISÃO TOTAL DO MESORRETO (TME) + reconstrução (retossigmoidectomia baixa com anastomose colorretal/coloanal + ileostomia derivativa). Atualmente TNT (TOTAL NEOADJUVANT THERAPY) é padrão emergente. TME PARCIAL (B) - INADEQUADA, princípio é TME COMPLETA (Heald). Imunoterapia (C) só se DEFICIENTE DE MMR (este é PROFICIENTE). Amputação (D) só se tumor de reto BAIXO invadindo esfíncter (margem distal <1-2 cm)."
  },
  {
    n: 235,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Coloproctologia/Oncologia",
    subtemas: ["Seguimento pós-CA retal", "Recidiva"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Um ano APÓS cirurgia radical para CA de reto: SANGRAMENTO INTERMITENTE nas fezes. Conduta correta?",
    alternativas: {
      A: "TOMOGRAFIA DE ABDOME COM CONTRASTE EV INDICADA.",
      B: "Risco de SEGUNDA neoplasia colorretal é elevado.",
      C: "Profilaxia pós-op antitrombótica = causa mais provável.",
      D: "Colonoscopia menos importante se TC for normal."
    },
    gabarito: "A",
    explicacao: "SEGUIMENTO PÓS-CA COLORRETAL (NCCN/ESMO): 1) Consulta + CEA + exame físico a cada 3-6 meses por 2 anos, depois cada 6 meses até 5 anos; 2) TC TÓRAX/ABDOME/PELVE COM CONTRASTE anualmente por 5 anos; 3) COLONOSCOPIA aos 1 ano (se incompleta no pré-op) ou aos 3 anos. SANGRAMENTO NAS FEZES PÓS-CIRURGIA = ALARME para: A) RECIDIVA LOCAL (mais comum em 1º-2º ano); B) METÁSTASE; C) SEGUNDA NEOPLASIA (risco aumentado mas em fases TARDIAS, não em 1 ano); D) Lesões benignas (hemorroidas, fissura). INVESTIGAÇÃO: TC com contraste (avaliar recidiva local + metástases) + COLONOSCOPIA (lesão anastomótica, segunda neoplasia). NÃO atribuir a anticoagulante (C) sem investigar. Colonoscopia (D) é ESSENCIAL mesmo com TC normal (recidiva pode ser mucosa)."
  },
  {
    n: 236,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Oncologia Cirúrgica",
    subtemas: ["Tumor sólido pseudopapilar", "Mulher jovem"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 24 anos, achado incidental de massa em CAUDA pancreática 9 cm, contornos bem definidos, CÁPSULA aparente, ÁREAS SÓLIDAS E CÍSTICAS + CALCIFICAÇÕES periféricas, realce discreto-moderado. Diagnóstico?",
    alternativas: {
      A: "Neoplasia cística serosa.",
      B: "TUMOR SÓLIDO PSEUDOPAPILAR (Frantz).",
      C: "Neoplasia cística mucinosa.",
      D: "Walled-off necrosis."
    },
    gabarito: "B",
    explicacao: "TUMOR SÓLIDO PSEUDOPAPILAR DO PÂNCREAS (TSPN, tumor de FRANTZ): neoplasia RARA do pâncreas, PRINCIPALMENTE em MULHERES JOVENS (20-30 anos), localização mais comum CAUDA pancreática. Características: TUMOR ENCAPSULADO + MISTO sólido-cístico + degeneração hemorrágica/cística + calcificações periféricas. Biologia: BAIXO grau de malignidade (raras metástases), PROGNÓSTICO BOM após ressecção R0. NEOPLASIA SEROSA (A): mulheres MAIS VELHAS, microcística 'favo de mel'. MUCINOSA (C): mulheres meia-idade, corpo/cauda, septações, sem comunicação com ducto. WALLED-OFF NECROSIS (D): coleção necrótica pós-pancreatite aguda, contexto clínico diferente. Tratamento: ressecção cirúrgica."
  },
  {
    n: 237,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Pancreática",
    subtemas: ["Pancreatectomia distal", "Indicação cirúrgica"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Tumor sólido pseudopapilar de 9 cm em cauda pancreática (mulher jovem, 24 anos). Conduta?",
    alternativas: {
      A: "Necrosectomia.",
      B: "Seguimento clínico.",
      C: "PANCREATECTOMIA DISTAL.",
      D: "Cistojejuno anastomose."
    },
    gabarito: "C",
    explicacao: "TUMOR SÓLIDO PSEUDOPAPILAR é uma NEOPLASIA com POTENCIAL DE MALIGNIDADE (baixo grau) - INDICAÇÃO CIRÚRGICA EM TODOS OS CASOS, mesmo assintomáticos. Localização em CAUDA pancreática (9 cm) = PANCREATECTOMIA DISTAL (CORPOCAUDAL): ressecção do corpo e cauda do pâncreas, geralmente COM ESPLENECTOMIA (proximidade do hilo esplênico, dificuldade de preservar vasos esplênicos em tumor grande - 9 cm), embora seja desejável tentar preservar baço quando possível (técnica de Warshaw ou Kimura). Sobrevida em 5 anos >95% após cirurgia R0. NÃO é cisto puro (necrosectomia/cistojejunoanastomose erradas). NÃO é benigno absoluto (seguimento clínico inadequado)."
  },
  {
    n: 238,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Bariátrica",
    subtemas: ["Hérnia interna pós-bypass", "Espaços de Petersen"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 59 anos, 2 anos pós-bypass em Y de Roux, perda 55 kg, dor abdominal recorrente (1 sem, episódios prévios). TC: ROTAÇÃO DE VASOS MESENTÉRICOS no mesogástrio + alças de delgado AGRUPADAS no HCD. Diagnóstico?",
    alternativas: {
      A: "HÉRNIA INTERNA.",
      B: "Pancreatite aguda.",
      C: "Volvo de sigmoide.",
      D: "Trombose mesentérica com isquemia."
    },
    gabarito: "A",
    explicacao: "HÉRNIA INTERNA PÓS-BYPASS GÁSTRICO EM Y DE ROUX: complicação tardia (meses a anos), frequência ~3-5%. ESPAÇOS DEFEITUOSOS: 1) Mesentério da ENTEROANASTOMOSE (Petersen mesenterial); 2) Espaço de PETERSEN (entre alça alimentar e mesocólon transverso); 3) Defeito mesocólico (se transmesocólico). FATORES PREDISPONENTES: perda ponderal intensa (gordura mesentérica reduz = espaços alargam). SINAIS NA TC: SINAL DO REDEMOINHO ('swirl sign') = ROTAÇÃO DOS VASOS MESENTÉRICOS, agrupamento anômalo de alças, sinal de mushroom. EMERGÊNCIA: pode evoluir para isquemia/necrose. Cirurgia urgente: reduzir alças + fechar defeitos. Pancreatite (B): amilase/lipase alteradas. Volvo (C): obstrução colônica."
  },
  {
    n: 239,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepática",
    subtemas: ["Adenoma hepático", "Subtipo HNF1-α", "Esteatose"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Mulher, 35 anos, ASSINTOMÁTICA, nódulo hepático 7 cm em setor posterior D, ACO há 7 anos. RM: hipervascular + QUEDA DE SINAL no T1 OUT-OF-PHASE (esteatose intralesional). Diagnóstico provável?",
    alternativas: {
      A: "Hiperplasia nodular focal.",
      B: "Hemangioma hepático.",
      C: "Adenoma hepático subtipo INFLAMATÓRIO.",
      D: "ADENOMA HEPÁTICO SUBTIPO HNF1-α."
    },
    gabarito: "D",
    explicacao: "ADENOMA HEPÁTICO - SUBTIPO HNF1α INATIVADO ('ADENOMA ESTEATÓTICO'): 35-50% dos adenomas, ACO frequente, GENE HNF1α inativado leva à ESTEATOSE INTRALESIONAL DIFUSA. ACHADO PATOGNOMÔNICO NA RM: PERDA DE SINAL NO T1 OUT-OF-PHASE (queda) comparado ao IN-PHASE = confirma gordura intracelular. Hipervascular na fase arterial. Comportamento BENIGNO, BAIXO RISCO de transformação maligna ou sangramento. SUBTIPO INFLAMATÓRIO (C): mais comum (50%), associado obesidade/álcool/ACO, RM com hipersinal T2 + 'sinal do atol' + realce sustentado, RISCO INTERMEDIÁRIO. HNF (A): cicatriz central, capta nas fases tardias (hepatobiliar). HEMANGIOMA (B): realce nodular periférico centrípeto, sem esteatose."
  },
  {
    n: 240,
    banca: "USP/FUVEST 2026 — EC6 Coloproctologia",
    especialidade: "Cirurgia",
    tema: "Cirurgia Hepática",
    subtemas: ["Manejo de adenoma esteatótico", "ACO"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Adenoma hepático SUBTIPO HNF1-α (esteatótico), 7 cm, mulher 35 anos com ACO há 7 anos. Conduta?",
    alternativas: {
      A: "Ablação por micro-ondas.",
      B: "SUSPENSÃO DO ANTICONCEPCIONAL + PERDA DE PESO.",
      C: "Ressecção cirúrgica laparoscópica/robótica.",
      D: "Embolização arterial."
    },
    gabarito: "B",
    explicacao: "MANEJO DO ADENOMA HEPÁTICO - INDIVIDUALIZADO POR SUBTIPO E TAMANHO: 1) SUSPENDER ACO (estímulo hormonal, pode levar à REGRESSÃO do adenoma) + perda de peso (especialmente em inflamatório); 2) Reavaliar com imagem em 6 meses. INDICAÇÃO CIRÚRGICA: a) HOMENS (qualquer tamanho - risco maligno alto); b) Subtipo BETA-CATENINA mutado; c) ADENOMA >5 cm que NÃO REGRIDE após 6-12 meses de medidas conservadoras; d) Sangramento ou suspeita de malignização. GABARITO B: HNF1α inativado tem BAIXO RISCO de complicações - tentativa de manejo conservador com suspensão do ACO é razoável ANTES da cirurgia. Em adenomas >5 cm de outros subtipos, cirurgia mais precoce. Embolização: emergência se sangramento ativo. Ablação: reservada para casos selecionados."
  }
);

console.log("Bloco 4 EC6 (211-240) adicionado. Total: 240 questões");

// ==================== UNICAMP 2021 - PROVA 1 ACESSO DIRETO (W) - Bloco 1 (241-260) ====================
// Clínica Médica + Cirurgia (Q1-Q20 da prova)
QUESTOES.push(
  {
    n: 241,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Hepatologia",
    subtemas: ["Cirrose", "Síndrome hepatorrenal", "Critérios"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 63a, cirrose alcoólica, internada por descompensação há 3d com piora da ascite, oligúria e encefalopatia. Em uso de espironolactona 200mg + furosemida 40mg. Cr 1,7 (era 0,8 na entrada). Líquido ascítico: leuco 420/mm³ (62% linfócitos, 31% neutrófilos), proteína 1,4 g/dL, albumina 0,7 g/dL. Diagnóstico e conduta?",
    alternativas: {
      A: "Peritonite bacteriana espontânea com disfunção renal; ceftriaxona e albumina.",
      B: "Lesão renal aguda estágio 1; reduzir diuréticos e ceftriaxona empírico.",
      C: "Lesão renal aguda estágio 2; suspender diuréticos e albumina humana.",
      D: "Síndrome hepatorrenal; albumina humana e terlipressina."
    },
    gabarito: "D",
    explicacao: "SÍNDROME HEPATORRENAL: cirrose descompensada + ascite + AKI (Cr de 0,8 → 1,7 mais que dobra = AKI estágio 2 pelo ICA-AKI) refratária à expansão volêmica. PBE EXCLUÍDA pelo líquido ascítico (PMN <250/mm³ - aqui são 31% de 420 = ~130 PMN, abaixo do corte). Tratamento: ALBUMINA HUMANA (1 g/kg D1, depois 20-40g/dia) + TERLIPRESSINA (vasoconstritor esplâncnico) - tratamento padrão. Suspender diuréticos. Não há indicação de ATB sem PBE. Critérios de SHR: AKI sem outras causas + ausência de resposta à expansão com albumina por 48h."
  },
  {
    n: 242,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Hepatologia",
    subtemas: ["DHGNA", "Síndrome metabólica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 42a, encaminhada por alteração laboratorial. Etilismo social leve (4 latas fim de semana). IMC 31. AST 51, ALT 42, FA 369, GGT 561, glicemia jejum 110. Diagnóstico e conduta?",
    alternativas: {
      A: "Doença hepática gordurosa não alcoólica com síndrome metabólica; orientar hábitos alimentares.",
      B: "Toxicidade por álcool e/ou loratadina; suspender e repetir após 4 semanas.",
      C: "Investigação adicional com biópsia hepática.",
      D: "Hepatopatia colestática; pesquisar anticorpo antimitocôndria."
    },
    gabarito: "A",
    explicacao: "DOENÇA HEPÁTICA GORDUROSA NÃO ALCOÓLICA (DHGNA) - hoje rebatizada MASLD (Metabolic dysfunction-Associated Steatotic Liver Disease): IMC >30 (obesidade) + glicemia limítrofe (110 - pré-DM) + transaminases discretamente elevadas + GGT/FA mais elevadas = padrão metabólico clássico. Etilismo de 4 latas no fim de semana é LEVE (~40g/sem < limiar para DAA mulheres). Tratamento de PRIMEIRA LINHA: mudança de estilo de vida (perda 5-10% do peso, dieta mediterrânea, atividade física). Biópsia (C) só se dúvida diagnóstica ou fibrose avançada. Anti-mitocôndria (D) seria para CBP."
  },
  {
    n: 243,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Alergia/Imunologia",
    subtemas: ["DREASA", "Hipersensibilidade a AINEs"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 54a, urticária e angioedema há 8 anos. Episódios recorrentes em minutos após uso de dipirona, diclofenaco, ibuprofeno para lombalgia. Conduta?",
    alternativas: {
      A: "Dosar IgE para AINEs e liberar negativos.",
      B: "Prescrever paracetamol - estrutura diferente, reação cruzada baixa.",
      C: "Tranquilizar - risco grave inexistente, liberar uso esporádico.",
      D: "Liberar inibidores seletivos da COX-2 após teste de provocação oral."
    },
    gabarito: "D",
    explicacao: "DREASA (Doença Respiratória Exacerbada por AINEs) / urticária crônica induzida por AINEs: mecanismo NÃO É IgE-mediado, mas sim INIBIÇÃO DA COX-1 (com desvio para via lipoxigenase e produção de leucotrienos). Por isso, IgE específica (A) NÃO funciona - mecanismo é farmacológico. Há reação cruzada entre TODOS os AINEs INIBIDORES NÃO-SELETIVOS de COX-1 (dipirona, diclofenaco, ibuprofeno). INIBIDORES SELETIVOS DE COX-2 (celecoxibe, etoricoxibe) são geralmente bem tolerados, mas DEVE FAZER TESTE DE PROVOCAÇÃO ORAL para confirmar tolerância individual antes de liberar. Paracetamol em altas doses também inibe COX e pode reagir. Risco de anafilaxia existe."
  },
  {
    n: 244,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Nefrologia",
    subtemas: ["Síndrome nefrótica", "Proteinúria glomerular"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 52a. Albumina 4,0; Cr 1,0; urina I: pH 7,2, densidade 1020, proteína +/4+, sem hematúria/leucocitúria; proteinúria 12g/24h. Classificação quanto à origem e proteína predominante?",
    alternativas: {
      A: "Glomerular seletiva, predomínio de albumina.",
      B: "Glomerular não seletiva, com albumina e imunoglobulinas.",
      C: "Tubular, proteínas de baixo peso molecular.",
      D: "Sobrecarga, proteínas de cadeia leve."
    },
    gabarito: "B",
    explicacao: "PROTEINÚRIA NA FAIXA NEFRÓTICA (>3,5g/24h) - aqui 12g/24h é maciça. CLASSIFICAÇÃO POR ORIGEM/SELETIVIDADE: GLOMERULAR (lesão da membrana basal): >3g/dia, predomínio de albumina, divide-se em: SELETIVA (perde só albumina - típico Doença de Lesões Mínimas, prognóstico bom em corticoide) e NÃO-SELETIVA (perde albumina + imunoglobulinas/proteínas maiores - GESF, nefropatia membranosa, etc, prognóstico pior). TUBULAR: proteínas pequenas (β2-microglobulina), proteinúria <2g. SOBRECARGA: cadeias leves (mieloma), Bence-Jones. Proteinúria de 12g/24h com fita +/4+ apenas (a fita detecta principalmente albumina; presença discreta com 12g sugere predomínio de NÃO-albumina ou mistura) é compatível com não-seletiva. A albumina sérica normal (4,0) sugere ainda compensação."
  },
  {
    n: 245,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Infectologia/Urologia",
    subtemas: ["ITU recorrente", "Profilaxia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 35a, cistite atual + 2 episódios em 6 meses. Urocultura: E. coli sensível. Conduta para prevenir recorrência APÓS o tratamento atual?",
    alternativas: {
      A: "Investigar nefrolitíase.",
      B: "Investigar malformação do trato urinário.",
      C: "Prescrever profilaxia com nitrofurantoína por 6 meses.",
      D: "Prescrever profilaxia pós-coito com ciprofloxacino."
    },
    gabarito: "C",
    explicacao: "ITU RECORRENTE em mulher: definida por ≥3 episódios em 12 meses ou ≥2 em 6 meses (este caso). Investigação por imagem (USG vias urinárias) só em casos específicos (homens, crianças, sem resposta, ITU complicada com pielonefrite). MEDIDAS DE PROFILAXIA: 1) NÃO-ANTIMICROBIANAS: hidratação, micção pós-coito, cranberry (evidência fraca), estriol vaginal (pós-menopausa); 2) ANTIMICROBIANAS: profilaxia contínua (nitrofurantoína 100mg/dia OU SMX-TMP) por 6-12 MESES, ou pós-coito se associado ao ato sexual. CIPROFLOXACINO em profilaxia está em desuso (resistência crescente, efeitos colaterais - tendinopatia, neuropatia). Nitrofurantoína 6 meses (C) é o padrão."
  },
  {
    n: 246,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Dermatologia/Farmacologia",
    subtemas: ["Farmacodermia", "Síndrome de DRESS"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 41a, lesões em tronco/abdome/mãos/pés há 3 semanas, com febre, mialgia, linfonodomegalia. Em uso de fenitoína 200mg/dia (epilepsia). Foto: exantema generalizado. Diagnóstico e conduta?",
    alternativas: {
      A: "Psoríase gutata; biópsia de pele.",
      B: "Sífilis secundária; testes treponêmicos e não treponêmicos.",
      C: "Tinha do corpo; antifúngicos sistêmicos.",
      D: "Farmacodermia; substituir droga anticonvulsivante."
    },
    gabarito: "D",
    explicacao: "FARMACODERMIA - provável SÍNDROME DREASS (Drug Reaction with Eosinophilia and Systemic Symptoms) ou síndrome de hipersensibilidade aos anticonvulsivantes: clássico com FENITOÍNA, CARBAMAZEPINA, FENOBARBITAL, lamotrigina. Início 2-8 SEMANAS após introdução. Tríade: EXANTEMA generalizado + FEBRE + LINFONODOMEGALIA, frequentemente acompanhada de eosinofilia, hepatite, nefrite. Tratamento: SUSPENDER A DROGA imediatamente + substituir por anticonvulsivante de classe diferente (valproato, levetiracetam, gabapentina - SEM reação cruzada com aromáticos), corticoide sistêmico se grave. Sífilis 2ª teria adenopatia generalizada + sífilis palmar/plantar mas tipicamente sem febre alta tardia."
  },
  {
    n: 247,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Distúrbios hidroeletrolíticos",
    subtemas: ["Hipocalemia", "ECG (onda U)"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Mulher, 44a, fraqueza muscular intensa. Uso crônico de furosemida 120 mg/dia. PA e FC normais. ECG mostra ONDAS U PROEMINENTES. Diagnóstico?",
    alternativas: {
      A: "Hipomagnesemia.",
      B: "Hipocalcemia.",
      C: "Hipofosfatemia.",
      D: "Hipocalemia."
    },
    gabarito: "D",
    explicacao: "HIPOCALEMIA: principal causa de FRAQUEZA MUSCULAR + diurético de alça em uso crônico (furosemida espolia K+ no túbulo distal). ECG: achatamento de onda T, depressão de ST, e SINAL CLÁSSICO: aparecimento/proeminência de ONDAS U (após onda T). Em casos graves: prolongamento do QT (na verdade QU), arritmias ventriculares. Hipocalcemia: prolongamento de QT (sem onda U). Hipomagnesemia: pode coexistir com hipocalemia e tem manifestações semelhantes, mas o achado mais clássico é tetania, tremores. Hipofosfatemia: fraqueza muscular sem alterações ECG marcantes."
  },
  {
    n: 248,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Distúrbios ácido-base",
    subtemas: ["Alcalose metabólica", "Vômitos persistentes"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 70a, vômitos persistentes há 2 dias. Desidratação grave, hipotensão postural, oligúria. Ureia 140, Cr 2, K 3, Cl 85. pH 7,58, pCO2 51, HCO3 36. Sobre o distúrbio metabólico, é correto:",
    alternativas: {
      A: "Com os vômitos, há perda de Na, Cl, K e H, levando a um excesso de bases.",
      B: "Hipocalemia desencadeadora corrigida por reabsorção no TCP.",
      C: "A hipovolemia leva à retenção renal de Na, H e Cl, compensando o equilíbrio metabólico.",
      D: "A hiperventilação compensatória é interrompida quando paCO2 atinge 50 mmHg."
    },
    gabarito: "A",
    explicacao: "ALCALOSE METABÓLICA POR VÔMITOS: fisiopatologia clássica. PERDAS GÁSTRICAS = perda de H+ (HCl), Cl-, K+, Na+, e água. Resultado: 1) PERDA DE H+ → HCO3- relativamente aumentado (alcalose); 2) DEPLEÇÃO DE VOLUME → aldosterona ↑ → retenção de Na+ no túbulo distal em troca de H+ e K+ (HIPOCALEMIA e perpetuação da alcalose - 'alcalose CLORO-RESPONSIVA'); 3) HIPOCLOREMIA: dificulta a excreção de HCO3- pelo rim; 4) COMPENSAÇÃO RESPIRATÓRIA: hipoventilação, ↑pCO2 (até ~55-60 mmHg, depois limitada pela hipoxemia que estimula respiração) - aqui pCO2 51 é compensação. Tratamento: REPOR VOLUME (SF 0,9%) + CLORO + K+. Alternativa A descreve corretamente a perda de eletrólitos + 'excesso de bases'."
  },
  {
    n: 249,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Hematologia",
    subtemas: ["Anemia falciforme", "Sequestro hepático"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 24a, falciforme com hidroxiureia. Dor súbita em flanco D + dispneia. Ictérico, fígado a 9 cm RCD, doloroso. Hb 5, retic 25%, leuco 15.100, plaq 350 mil. BD 6,9, BI 1,2; AST 48, ALT 61, FA 229, GGT 160. Diagnóstico?",
    alternativas: {
      A: "Colestase intra-hepática.",
      B: "Trombose de veia porta.",
      C: "Sequestro hepático.",
      D: "Colecistite aguda."
    },
    gabarito: "C",
    explicacao: "SEQUESTRO HEPÁTICO em anemia falciforme: complicação grave caracterizada por SEQUESTRO de sangue dentro do fígado (sinusoides), causando: HEPATOMEGALIA SÚBITA E DOLOROSA + ANEMIA AGUDA SEVERA (queda de Hb de >2 g/dL) + RETICULOCITOSE elevada (resposta medular) + hiperbilirrubinemia conjugada (lesão do hepatócito por isquemia/congestão). Tratamento: TRANSFUSÃO SIMPLES ou exsanguineotransfusão. Diferencial: COLESTASE INTRA-HEPÁTICA FALCÊMICA (forma fulminante - INR↑, BT muito elevada) é mais grave. TROMBOSE PORTAL: ascite, hipertensão portal. COLECISTITE: parede vesicular espessa à USG, Murphy+, leuco mais elevado, mas em falciforme há litíase pigmentar (vir antes pensar nesse mas reticulocitose alta + queda súbita de Hb favorece sequestro). A reticulocitose 25% indica resposta intensa a queda aguda."
  },
  {
    n: 250,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Farmacologia",
    subtemas: ["IBP", "Interações medicamentosas"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre interações medicamentosas do OMEPRAZOL, é correto:",
    alternativas: {
      A: "Clopidogrel; redução de atividade antiplaquetária.",
      B: "Warfarina; redução de atividade anticoagulante.",
      C: "Fenobarbital; redução de ação anticonvulsivante.",
      D: "Fluconazol; aumento de toxicidade hepática."
    },
    gabarito: "A",
    explicacao: "INTERAÇÃO OMEPRAZOL + CLOPIDOGREL: clinicamente RELEVANTE. Clopidogrel é PRÓ-DROGA ativada pelo CYP2C19. Omeprazol (e esomeprazol) são INIBIDORES POTENTES do CYP2C19, REDUZINDO a conversão de clopidogrel em seu metabólito ativo → MENOR efeito antiplaquetário → potencial aumento de eventos cardiovasculares (estudos PLATO, COGENT). FDA emitiu alerta em 2009. Alternativas para gastroprotetor em uso conjunto: PANTOPRAZOL ou RABEPRAZOL (menor inibição do CYP2C19), ou ranitidina/famotidina (H2). Warfarina: omeprazol AUMENTA INR (inibe CYP2C9). Fenobarbital: INDUTOR enzimático, reduz omeprazol (não o contrário). Fluconazol: aumenta níveis de omeprazol, sem hepatotoxicidade."
  },
  {
    n: 251,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Cardiologia",
    subtemas: ["Valvopatias", "Estenose mitral", "Insuficiência pulmonar"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 36a, dispneia, ortopneia, tosse seca. Ausculta: sopro DIASTÓLICO em 2º EICE (aspirativo) + sopro DIASTÓLICO em ruflar + HIPERFONESE de B1 e final de B2. Pulsos periféricos normais. Hipótese diagnóstica?",
    alternativas: {
      A: "Insuficiência pulmonar e estenose mitral.",
      B: "Insuficiência aórtica e insuficiência mitral.",
      C: "Estenose aórtica e insuficiência tricúspide.",
      D: "Dupla lesão mitral e estenose aórtica."
    },
    gabarito: "A",
    explicacao: "AUSCULTA CARDÍACA: 1) SOPRO DIASTÓLICO EM 2º EICE com ASPECTO ASPIRATIVO = INSUFICIÊNCIA PULMONAR (sopro de Graham Steell quando associada a hipertensão pulmonar); 2) SOPRO DIASTÓLICO EM RUFLAR + HIPERFONESE DE B1 (mitral) = ESTENOSE MITRAL clássica. HIPERFONESE DE 2ª BULHA (P2 - componente pulmonar) reflete HIPERTENSÃO PULMONAR secundária à estenose mitral. PULSOS PERIFÉRICOS NORMAIS afastam insuficiência aórtica (B - teria pulsos hipercinéticos/em martelo d'água). Conjunto: ESTENOSE MITRAL com hipertensão pulmonar secundária causando INSUFICIÊNCIA PULMONAR funcional - quadro clássico de DOENÇA REUMÁTICA CRÔNICA."
  },
  {
    n: 252,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Pneumologia",
    subtemas: ["Síndrome de hipoventilação da obesidade", "SAOS"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 62a, NYHA II, fadiga, sonolência diurna. HAS + DM. Peso 106 kg, altura 1,60m (IMC 41). SpO2 88%, pH 7,38, paO2 52, paCO2 56, HCO3 30. Espirometria: distúrbio misto leve. Hipótese?",
    alternativas: {
      A: "Hipertensão pulmonar.",
      B: "DPOC.",
      C: "Síndrome de hipoventilação associada à obesidade.",
      D: "Tromboembolismo pulmonar crônico."
    },
    gabarito: "C",
    explicacao: "SÍNDROME DE HIPOVENTILAÇÃO DA OBESIDADE (Pickwick): IMC ≥30 (aqui 41 - obesidade III) + HIPERCAPNIA CRÔNICA na vigília (paCO2 >45 mmHg, aqui 56) + AUSÊNCIA DE OUTRA CAUSA. Apresentação: SONOLÊNCIA DIURNA, fadiga, cefaleia matinal, policitemia, cor pulmonale. Gasometria: ACIDOSE RESPIRATÓRIA COMPENSADA (pH normal-baixo, pCO2↑, HCO3↑ - como aqui). DPOC (B): geralmente fumante, espirometria com OBSTRUÇÃO marcada (aqui é distúrbio MISTO LEVE - compatível com obesidade). HP isolada (A): não causa hipercapnia. TEP crônico (D): hipoxemia com paCO2 normal/baixa. Tratamento: PERDA DE PESO + VNI noturna (CPAP/BiPAP)."
  },
  {
    n: 253,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Coloproctologia",
    subtemas: ["Sangue vivo nas fezes", "CA colorretal"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 61a, sangue vivo nas fezes em pequena quantidade há 4 meses, indolor. Descorada +/4+. Para investigação etiológica deve realizar:",
    alternativas: {
      A: "Toque retal e pesquisa de sangue oculto nas fezes.",
      B: "Toque retal e colonoscopia.",
      C: "TC de abdome e sangue oculto nas fezes.",
      D: "TC de abdome e enema opaco."
    },
    gabarito: "B",
    explicacao: "SANGRAMENTO RETAL EM IDOSA com ANEMIA: alta suspeita de CÂNCER COLORRETAL. Investigação padrão: 1) TOQUE RETAL (palpação de tumor distal, especialmente reto inferior - 1ª medida obrigatória); 2) COLONOSCOPIA (padrão-ouro): visualiza todo o cólon, biópsia, polipectomia se possível. ENEMA OPACO está em desuso (sensibilidade inferior à colono, não permite biópsia). SANGUE OCULTO NAS FEZES é teste de RASTREAMENTO em assintomáticos - paciente com sangramento visível e anemia tem indicação direta de colonoscopia. TC tem papel no estadiamento APÓS diagnóstico (não como exame inicial)."
  },
  {
    n: 254,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Toxicologia",
    subtemas: ["Intoxicação por antidepressivo tricíclico", "QRS alargado"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Homem, 27a, confuso após relatar palpitações. RNC, taquicardia, taquipneia, midríase, RHA ausentes, Glasgow 11. Glicemia capilar 106. ECG (provável QRS alargado por intoxicação anticolinérgica). Conduta inicial?",
    alternativas: {
      A: "Bicarbonato de sódio.",
      B: "Cardioversão elétrica sincronizada.",
      C: "Amiodarona.",
      D: "AAS, clopidogrel, sinvastatina."
    },
    gabarito: "A",
    explicacao: "INTOXICAÇÃO POR ANTIDEPRESSIVOS TRICÍCLICOS (ADT) - quadro clínico clássico: SÍNDROME ANTICOLINÉRGICA (midríase, taquicardia, RHA ausentes/íleo, hipertermia, RNC, confusão) + CARDIOTOXICIDADE (alargamento do QRS por bloqueio de canais de Na+, prolongamento do QT, arritmias ventriculares, taquicardia sinusal). Tratamento de PRIMEIRA LINHA para cardiotoxicidade: BICARBONATO DE SÓDIO IV (alcaliniza, reduz fração não-ionizada do tricíclico, deslocaliza dos canais de Na+, reduz arritmias). Indicação: QRS >100ms ou arritmias ventriculares. NUNCA AMIODARONA (prolonga QT, piora) ou cardioversão em arritmias estáveis. AAS/clopidogrel/sinva seria para IAM (não cabe aqui)."
  },
  {
    n: 255,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Imunização",
    subtemas: ["Hepatite B", "Vacinação adulto"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Adolescente, 16a, saudável, vai para intercâmbio na Bélgica. Recebeu 3 doses da vacina hepatite B na infância. Orientação?",
    alternativas: {
      A: "Verificar título de anti-HBs para conduta.",
      B: "Não há necessidade de doses adicionais.",
      C: "Refazer três doses da vacina.",
      D: "Administrar uma dose de reforço."
    },
    gabarito: "B",
    explicacao: "HEPATITE B - VACINA: imunogenicidade após 3 doses completas (esquema 0-1-6 meses) é >90% em adolescentes saudáveis, com PROTEÇÃO DURADOURA. NÃO HÁ INDICAÇÃO DE REFORÇO ou dosagem rotineira de anti-HBs para adultos saudáveis previamente vacinados, mesmo para viagens (CDC/SBIm). DOSAGEM DE ANTI-HBS (A) só indicada em: 1) imunossuprimidos; 2) profissionais de saúde após exposição; 3) recém-nascidos de mãe HBsAg+ (12 meses após vacinação); 4) hemodialisados. REFORÇO (D) ou revacinação (C) NÃO indicados em adolescente saudável bem vacinado."
  },
  {
    n: 256,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Terapia Intensiva",
    subtemas: ["Sepse", "Choque séptico"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 62a, DM, disúria + febre + PA 72x50 + sonolenta. Suspeita de urosepse, iniciou ceftriaxona + ringer (já 800mL/2.100). PA evolui para 80x52, FC 94, MOC melhorada. Manejo hemodinâmico?",
    alternativas: {
      A: "Dobutamina e suspender expansão.",
      B: "Noradrenalina e manter expansão.",
      C: "Hidrocortisona.",
      D: "Manter apenas soro fisiológico."
    },
    gabarito: "D",
    explicacao: "PROTOCOLO DE SEPSE (Surviving Sepsis Campaign 2021): expansão volêmica inicial de 30 mL/kg de cristaloide nas primeiras 3 horas. Após cada bolus, REAVALIAR resposta hemodinâmica. PAM alvo ≥65 mmHg. ESTA PACIENTE: ainda está RESPONDENDO bem à expansão (PA subiu, FC caiu, melhora da sonolência), recebeu apenas 800 mL dos 2100 prescritos. CONDUTA: COMPLETAR A EXPANSÃO VOLÊMICA antes de iniciar vasopressor. NORADRENALINA (B) só se PAM <65 mmHg APÓS expansão completa. Dobutamina (A): inotrópico, indicado se disfunção miocárdica. Hidrocortisona (C): no choque séptico REFRATÁRIO a vasopressores. A alternativa D ('apenas soro') é a mais correta no momento descrito (continuar a infusão prescrita)."
  },
  {
    n: 257,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Cirurgia Geral",
    subtemas: ["Pneumoperitônio", "Úlcera perfurada"],
    dificuldade: "Fácil",
    temImagem: true,
    enunciado: "Homem, 41a, dor súbita epigástrica em pontada irradiando para todo abdome. Abdome em tábua, DB+. RX de abdome ortostático: PNEUMOPERITÔNIO (ar subdiafragmático). Conduta?",
    alternativas: {
      A: "Endoscopia digestiva alta terapêutica.",
      B: "Laparotomia exploradora.",
      C: "Ultrassonografia de abdome total.",
      D: "Reavaliar após hidratação."
    },
    gabarito: "B",
    explicacao: "ABDOME AGUDO PERFURATIVO: dor súbita em pontada + abdome em tábua (peritonite difusa) + pneumoperitônio à radiografia (ar subdiafragmático livre) = perfuração de víscera oca, mais provável úlcera péptica perfurada. CONDUTA: LAPAROTOMIA EXPLORADORA DE URGÊNCIA (rafia simples + epiplonplastia de Graham se úlcera ou outra abordagem conforme achado). Antibiótico amplo espectro. Não há papel para EDA (a perfuração já está estabelecida, EDA pode piorar com insuflação). USG não acrescenta (diagnóstico já feito). Aguardar (D) = morte."
  },
  {
    n: 258,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Trauma na gestação",
    subtemas: ["Compressão aorto-cava", "Reanimação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 27a, 38 sem, vítima de acidente, em prancha rígida. PA 88x56, FC 124. Além da reanimação volêmica, conduta é desviar manualmente o útero para:",
    alternativas: {
      A: "Esquerda ou elevar o lado direito do dorso.",
      B: "Direita ou elevar o lado esquerdo do dorso.",
      C: "Esquerda ou elevar o lado esquerdo do dorso.",
      D: "Direita ou elevar o lado direito do dorso."
    },
    gabarito: "A",
    explicacao: "TRAUMA EM GESTANTE >20 SEMANAS: o útero gravídico comprime a VEIA CAVA INFERIOR e a AORTA quando em decúbito dorsal (síndrome de hipotensão supina) → reduz retorno venoso → CHOQUE. CONDUTA: DESLOCAMENTO MANUAL DO ÚTERO PARA A ESQUERDA ou inclinação da prancha 15-30° (elevando o LADO DIREITO do dorso) - isso retira o peso uterino da veia cava (que está à direita da coluna). RCP em gestante: também com deslocamento manual do útero para esquerda durante compressões torácicas. NÃO retirar a prancha rígida (suspeita de trauma raquimedular). Manobra é simples e essencial."
  },
  {
    n: 259,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Cardiologia/Reumatologia",
    subtemas: ["Pericardite aguda", "Atrito pericárdico"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 42a, dor precordial ventilatório-dependente que piora ao deitar e melhora em pé. Febre + mal-estar há 4 dias. Ausculta: atrito pericárdico ('rangido de alta frequência'). Tropo 123. ECG (supradesnivelamento difuso côncavo). Diagnóstico?",
    alternativas: {
      A: "Pericardite aguda.",
      B: "Infarto agudo do miocárdio.",
      C: "Tromboembolismo pulmonar.",
      D: "Endocardite bacteriana aguda."
    },
    gabarito: "A",
    explicacao: "PERICARDITE AGUDA: tétrade clássica = 1) DOR TORÁCICA pleurítica/posicional (PIORA DEITADO, MELHORA INCLINANDO PARA FRENTE), ventilatório-dependente; 2) ATRITO PERICÁRDICO (Lerman-Hatchin - patognomônico, áspero, 'rangido', em final de expiração); 3) ECG: SUPRADESNIVELAMENTO DIFUSO côncavo + INFRADESNÍVEL DE PR; 4) Derrame pericárdico ao ECO. Etiologia mais comum: VIRAL (este caso com febre + 'mal-estar'). TROPONINA pode estar elevada (miopericardite - até 30% dos casos), por isso valor 123 não exclui pericardite. IAM (B): dor opressiva, supra LOCALIZADO/contínuo. TEP: dispneia súbita, ECG S1Q3T3, sem atrito. EI aguda: febre + sopro novo, não atrito."
  },
  {
    n: 260,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["FAST", "Janelas de avaliação"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Homem, 21a, acidente moto, estável. FAST 3 janelas: 1=hepatorrenal (Morrison), 2=esplenorrenal, 3=fundo de saco. As imagens mostram líquido no espaço hepatorrenal e fundo de saco. Interpretações respectivas:",
    alternativas: {
      A: "Positivo, negativo, negativo.",
      B: "Positivo, positivo, negativo.",
      C: "Negativo, positivo, positivo.",
      D: "Negativo, negativo, positivo."
    },
    gabarito: "A",
    explicacao: "FAST (Focused Assessment with Sonography for Trauma): exame point-of-care para detectar LÍQUIDO LIVRE intra-abdominal e pericárdico em trauma. As 4 janelas: 1) ESPAÇO DE MORRISON (hepatorrenal) - local mais sensível em decúbito dorsal por gravidade no quadrante superior direito; 2) ESPAÇO ESPLENORRENAL (perirrenal esquerdo); 3) FUNDO DE SACO de Douglas (pélvica) - menos sensível mas detecta sangue pélvico; 4) PERICÁRDIO. POSITIVO = anecoico (escuro) entre estruturas. Sensibilidade ~80%, especificidade ~95%. NEGATIVO não exclui lesão. Esta resposta depende da DESCRIÇÃO da imagem original do caso (impossível confirmar sem ver, mas opção A é frequente em respostas: Morrison positivo é o mais frequente). NOTA: gabarito presumido pelo padrão de prova."
  }
);

console.log("UNICAMP Bloco 1 (241-260) adicionado");

// ==================== UNICAMP 2021 - Bloco 2 (261-287) ====================
// Cirurgia/Trauma + Pediatria (Q21-Q47 da prova)
QUESTOES.push(
  {
    n: 261,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["Fratura exposta", "Manejo emergência"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 22a, queda de moto, fratura exposta de tíbia e fíbula esquerdas, SEM sangramento ativo, AUSÊNCIA de pulso pedioso. Conduta em sala de emergência?",
    alternativas: {
      A: "Curativo compressivo e tala gessada.",
      B: "Limpar com SF, curativo compressivo e tala gessada.",
      C: "Alinhamento para reposicionamento e imobilização.",
      D: "Profilaxia para trombose venosa e imobilização."
    },
    gabarito: "C",
    explicacao: "FRATURA EXPOSTA COM AUSÊNCIA DE PULSO DISTAL: emergência ortopédica/vascular. A ausência do pulso pedioso sugere COMPROMETIMENTO VASCULAR pela angulação/desvio dos fragmentos ósseos. CONDUTA IMEDIATA: ALINHAMENTO/REDUÇÃO da fratura para REPOSICIONAMENTO + IMOBILIZAÇÃO. Após o realinhamento, REAVALIAR pulso distal — se retornar, indica que era compressão mecânica; se persistir ausente, suspeita-se lesão vascular (arteriografia, exploração). Limpeza local (B) e profilaxia ATB são importantes, MAS o passo VITAL é restaurar perfusão. Curativos sem reduzir (A) perpetua a isquemia. Profilaxia de TVP (D) é cuidado tardio."
  },
  {
    n: 262,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Trauma",
    subtemas: ["TCE grave", "Estabilização", "ATLS"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 25a, colisão frontal 100 km/h, sem cinto. PA 130x80, FC 110, FR 30, SpO2 90% com máscara 10L. Glasgow 5, ANISOCORIA D>E. IOT + 1L Ringer no SAMU. Já transferido com RX tórax/bacia + FAST: SEM ALTERAÇÕES, NEGATIVO. Conduta?",
    alternativas: {
      A: "TC de crânio.",
      B: "TC de corpo inteiro.",
      C: "Lavado peritoneal diagnóstico.",
      D: "TC de coluna cervical."
    },
    gabarito: "B",
    explicacao: "POLITRAUMA GRAVE (mecanismo de alta energia) com TCE GRAVE (Glasgow 5 + anisocoria = sinal de herniação iminente, provável hematoma subdural/extradural à D). Paciente já estabilizado (vias aéreas, expansão volêmica, RX/FAST negativos para sangramento maior). PRÓXIMO PASSO: TC DE CORPO INTEIRO (panscan/whole-body CT) - tornou-se padrão em politraumatizados estabilizados pois detecta lesões ocultas múltiplas (crânio, cervical, tórax, abdome, pelve, coluna). Reduz mortalidade comparada à TC seletiva. TC isolada de crânio (A) ou cervical (D) deixa de avaliar outras regiões em mecanismo de alta energia. LPD (C) está abandonado - substituído pelo FAST/TC."
  },
  {
    n: 263,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Enterocolite necrosante", "Prematuro"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN 32 sem, cateter umbilical na sala de parto, evoluiu com SDR e VM. D3: vômitos biliosos + distensão abdominal + secreção mucossanguinolenta retal. RX: níveis hidroaéreos + PNEUMATOSE INTESTINAL. Diagnóstico?",
    alternativas: {
      A: "Doença de Hirschsprung.",
      B: "Invaginação intestinal.",
      C: "Íleo meconial.",
      D: "Enterocolite necrotizante."
    },
    gabarito: "D",
    explicacao: "ENTEROCOLITE NECROSANTE (NEC): emergência neonatal do PREMATURO (especialmente <34 sem, peso <1500g). Fatores de risco: prematuridade, cateter umbilical, asfixia, dieta enteral precoce. TRÍADE clássica: distensão abdominal + intolerância alimentar + sangue nas fezes. SINAL RADIOLÓGICO PATOGNOMÔNICO: PNEUMATOSE INTESTINAL (gás intramural). Outros: ar no sistema portal, pneumoperitônio (estágio avançado = perfuração). Estadiamento de Bell I-III. Tratamento: jejum, SOG aberta, ATB amplo espectro, suporte. Cirurgia se perfuração ou peritonite. HIRSCHSPRUNG (A): aganglionose, retenção meconial, RX com cólon distendido (sem pneumatose). INVAGINAÇÃO (B): lactente >2-6m, fezes em geleia de morango. ÍLEO MECONIAL (C): fibrose cística, alça dilatada com microcólon."
  },
  {
    n: 264,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Gastroenterologia",
    subtemas: ["Úlcera duodenal H. pylori negativa"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 28a, queimação epigástrica. Uso REGULAR de IBP há 2 anos + tabagismo 10 anos-maço. EDA: úlcera duodenal ATIVA + pesquisa de H. pylori NEGATIVA. Conduta?",
    alternativas: {
      A: "Indicar pHmetria e ajustar dose de IBP.",
      B: "Manter IBP até cicatrização.",
      C: "Indicar pesquisa de sangue oculto.",
      D: "Substituir por sucralfato por 2 semanas e repetir EDA."
    },
    gabarito: "B",
    explicacao: "ÚLCERA DUODENAL H. PYLORI-NEGATIVA: causa menos comum (H. pylori responde por 70-90% das úlceras duodenais). Outras causas: AINEs, tabagismo (FATOR de RISCO importante - prejudica cicatrização e estimula ácido), Zollinger-Ellison, doença de Crohn duodenal, estresse, idiopática. CONDUTA: MANTER IBP em DOSE PLENA até CICATRIZAÇÃO (4-8 SEMANAS, dependendo do tamanho). Verificar cicatrização por nova EDA em 6-8 semanas. Pesquisar H. pylori novamente se a primeira foi sob IBP (falso-negativo). Orientar cessação do tabagismo. AINEs ocultos? Investigar. pHmetria (A) não tem papel aqui. Sucralfato isolado (D) é menos eficaz que IBP."
  },
  {
    n: 265,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Trauma Pediátrico",
    subtemas: ["Trauma esplênico", "Tratamento conservador"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Menino, 8a, atropelado. ESTÁVEL: PA 93x65, FC 100, SpO2 97%, Glasgow 15. Hb 9,4, Ht 28%. USG: traumatismo esplênico grau III + moderada quantidade de líquido. Conduta inicial?",
    alternativas: {
      A: "Reposição com coloides, TC e paracentese.",
      B: "Reposição hidroeletrolítica, internação em UTI e controle de Hb.",
      C: "Concentrado de hemácias e laparotomia exploradora.",
      D: "Cateter venoso central, hemácias e esplenectomia de urgência."
    },
    gabarito: "B",
    explicacao: "TRAUMA ESPLÊNICO EM CRIANÇA: tendência mundial é o TRATAMENTO NÃO-OPERATÓRIO (TNO) — preservar o baço (importante para imunidade contra encapsulados, especialmente em crianças). INDICAÇÕES DE TNO: 1) Estabilidade HEMODINÂMICA (este caso ESTÁVEL); 2) Sem peritonite/outros traumas abdominais cirúrgicos; 3) Suporte transfusional disponível. CONDUTA: INTERNAÇÃO EM UTI/UNIDADE MONITORADA + REPOSIÇÃO hidroeletrolítica + MONITORIZAÇÃO seriada (Hb/Ht, sinais vitais, reavaliação abdome). Hb 9,4 não exige transfusão imediata em paciente estável - pode acompanhar. Falha do TNO (<10% em crianças): cirurgia. ESPLENECTOMIA (D) era padrão antigo, hoje reservada para INSTABILIDADE refratária."
  },
  {
    n: 266,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Cabeça e Pescoço",
    subtemas: ["Sialolitíase", "Glândula submandibular"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Mulher, 23a, dor submandibular ESQUERDA durante MASTIGAÇÃO, sem febre. Tumefação fibroelástica 2cm no assoalho da boca + nódulo endurecido 3mm na DESEMBOCADURA DO DUCTO DE WHARTON. Hipótese?",
    alternativas: {
      A: "Linfoma.",
      B: "Lipoma.",
      C: "Sialolitíase.",
      D: "Pilomatrixoma."
    },
    gabarito: "C",
    explicacao: "SIALOLITÍASE (cálculo salivar): a glândula SUBMANDIBULAR é a mais acometida (80% dos casos) — pelo trajeto LONGO e ASCENDENTE do ducto de Wharton + saliva mais viscosa, rica em mucina e cálcio. APRESENTAÇÃO CLÁSSICA: dor + tumefação da glândula que PIORA AO MASTIGAR (estímulo salivar com obstrução). NÓDULO PALPÁVEL no trajeto do ducto = patognomônico. Diagnóstico clínico, RX/USG/TC confirmam. Tratamento: hidratação + estímulo salivar (limão, mastigar) + ordenha; se cálculo distal (junto ao óstio): extração endoral simples; se hilar/intraglandular: sialendoscopia ou sialoadenectomia. Linfoma (A): não doloroso, não modula com alimento. Lipoma (B): consistência mole, indolor. Pilomatrixoma (D): tumor pediátrico de pele."
  },
  {
    n: 267,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Oncologia",
    subtemas: ["Carcinomatose peritoneal", "Tumor de Krukenberg"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 58a, dor abdominal + emagrecimento 10kg/3m. USG: massa em OVÁRIO ESQUERDO + ASCITE. Exame: linfonodos endurecidos supraclavicular E e axilar E + nódulos em ampola retal. Hipótese diagnóstica - neoplasia primária do:",
    alternativas: {
      A: "Ovário.",
      B: "Sistema retículo-endotelial.",
      C: "Reto.",
      D: "Estômago."
    },
    gabarito: "D",
    explicacao: "TUMOR DE KRUKENBERG: metástase OVARIANA BILATERAL/UNILATERAL de adenocarcinoma com células em anel de sinete - tumor primário mais comum é GÁSTRICO (>70%), seguido de cólon, mama. Caso clínico clássico: 1) MASSA OVARIANA secundária; 2) ASCITE (carcinomatose peritoneal); 3) LINFONODO SUPRACLAVICULAR ESQUERDO = sinal de Virchow (nódulo de Troisier) - patognomônico de neoplasia gástrica avançada; 4) LINFONODO AXILAR ESQUERDO = sinal de Irish; 5) NÓDULOS NA AMPOLA RETAL = sinal de Blumer (prateleira de Blumer - implantes peritoneais no fundo de saco). Tudo aponta para CÂNCER GÁSTRICO AVANÇADO com disseminação peritoneal+linfática extensa. Investigar com EDA + biópsia."
  },
  {
    n: 268,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Urologia",
    subtemas: ["Retenção urinária aguda", "HPB"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Homem, 62a, sem urinar há 14h. Globo vesical 1cm abaixo da cicatriz umbilical. Próstata aumentada (3x), fibroelástica, sem nódulos. Primeira conduta?",
    alternativas: {
      A: "Realizar punção suprapúbica.",
      B: "Solicitar USG vias urinárias.",
      C: "Prescrever bloqueador alfa e solicitar urina I.",
      D: "Realizar cateterismo vesical de demora."
    },
    gabarito: "D",
    explicacao: "RETENÇÃO URINÁRIA AGUDA por HPB: o ALÍVIO IMEDIATO é a PRIORIDADE. CATETERISMO VESICAL DE DEMORA (Foley): técnica padrão, simples, rápido. Drenar lentamente em volumes incrementais (não esvaziar tudo de uma vez - risco de HEMATÚRIA EX-VACUO por descompressão súbita). Após drenagem: investigação (urina, função renal, USG, PSA) + iniciar BLOQUEADOR ALFA (tansulosina, alfuzosina) para facilitar a retirada da sonda em 3-7 dias (estudo TRUST). PUNÇÃO SUPRAPÚBICA (A): só se cateterismo IMPOSSÍVEL (estenose, falha). Bloqueador alfa isolado (C) não alivia retenção aguda."
  },
  {
    n: 269,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Cirurgia",
    tema: "Anestesia",
    subtemas: ["Sequência rápida de intubação", "Bloqueadores neuromusculares"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Bloqueador neuromuscular indicado para intubação em SEQUÊNCIA RÁPIDA em paciente com ESTÔMAGO CHEIO:",
    alternativas: {
      A: "Pancurônio.",
      B: "Atracúrio.",
      C: "Succinilcolina.",
      D: "Vecurônio."
    },
    gabarito: "C",
    explicacao: "SEQUÊNCIA RÁPIDA DE INTUBAÇÃO (RSI): protocolo para evitar BRONCOASPIRAÇÃO em paciente com estômago cheio (emergência, trauma, gestante, refluxo grave). Requer: pré-oxigenação SEM ventilação manual + sedativo de ação rápida + BLOQUEADOR NEUROMUSCULAR DE AÇÃO ULTRARRÁPIDA. SUCCINILCOLINA (despolarizante): início em 45-60s, duração 5-10 min - PERFIL IDEAL para RSI (rápida intubação + retorno rápido da ventilação espontânea se falha). Alternativa moderna: ROCURÔNIO em dose alta (1,2 mg/kg) - similar tempo de início. Pancurônio (A), atracúrio (B), vecurônio (D): tempo de início 2-5 min, INADEQUADOS para RSI. Contraindicações da succinilcolina: hipercalemia, queimadura >24h, doença neuromuscular, hipertermia maligna."
  },
  {
    n: 270,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Endocrinologia/Hepatologia",
    subtemas: ["DHGNA / MASLD", "Síndrome metabólica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 43a, não tabagista/etilista. IMC 23, circunferência abdominal 115, PA 135x92. USG: fígado hiperecogênico. TG 210, HDL 31, gli 113, HOMA 3,5, PCR-us 4. Hipótese?",
    alternativas: {
      A: "Doença do fígado gorduroso associada à disfunção metabólica.",
      B: "Dislipidemia por triglicérides com DM tipo 2 secundário.",
      C: "Resistência periférica à insulina e dislipidemia mista.",
      D: "Síndrome da resposta inflamatória associada a esteatose hepática."
    },
    gabarito: "A",
    explicacao: "MASLD (Metabolic dysfunction-Associated Steatotic Liver Disease) - nova nomenclatura (2023) que SUBSTITUIU 'DHGNA' (NAFLD): doença gordurosa do fígado associada a DISFUNÇÃO METABÓLICA. Critérios: ESTEATOSE HEPÁTICA (imagem ou histologia) + ≥1 fator de risco cardiometabólico (sobrepeso/circunferência abdominal aumentada, pré-DM, dislipidemia aterogênica, HAS). Este caso: USG com esteatose + circunferência abdominal aumentada (>102cm para homens) + PA elevada + dislipidemia aterogênica (TG↑/HDL↓) + pré-DM (HOMA↑, gli 113) + PCR-us elevada (estado inflamatório metabólico). A alternativa A engloba todo o quadro. As outras descrevem apenas componentes isolados, sem unir o diagnóstico integrado."
  },
  {
    n: 271,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Bioética/Medicina Legal",
    subtemas: ["Morte encefálica", "Declaração de óbito"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Homem, 34a, TCE grave, em UTI. D5: midríase fixa. Protocolo de ME positivo (1º teste clínico → exame complementar → 2º teste clínico). Família NÃO doa órgãos, suporte suspenso, evolução com bradicardia e linha isoelétrica. Hora do óbito na declaração:",
    alternativas: {
      A: "Primeiro teste clínico.",
      B: "Segundo teste clínico.",
      C: "Exame complementar.",
      D: "Momento da linha isoelétrica no monitor."
    },
    gabarito: "B",
    explicacao: "DECLARAÇÃO DE ÓBITO EM MORTE ENCEFÁLICA (Resolução CFM 2.173/2017): a hora do óbito a constar é a do MOMENTO EM QUE SE CONFIRMOU A MORTE ENCEFÁLICA, que é após a CONCLUSÃO DO PROTOCOLO - ou seja, ao SEGUNDO TESTE CLÍNICO confirmatório (que é o último componente do protocolo). O paciente está LEGALMENTE MORTO no momento da confirmação clínica, independentemente da função cardíaca/ventilatória mantida artificialmente. A parada cardíaca posterior (D) é IRRELEVANTE legalmente - paciente já estava morto. O 1º teste (A) inicia a investigação mas não conclui. Exame complementar (C) é parte do protocolo mas não o seu fim. Esta diferenciação é importante para fins legais (sucessão, seguros, transplantes)."
  },
  {
    n: 272,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Clínica Médica",
    tema: "Hematologia",
    subtemas: ["Anemia macrocítica", "Deficiência de B12", "Pós-bariátrica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 54a, deprimido, diarreia, queda de cabelo, parestesias, fraqueza há 2 meses. Bariátrica Y de Roux há 12 anos. Ht 25, Hb 6,9, VCM 114 (MACROCITOSE), leuco 3.100, plaq 158 mil; série branca: neutrófilos hipersegmentados, anisopoiquilocitose, sem reticulocitose. Conduta?",
    alternativas: {
      A: "Sacarato de hidróxido férrico.",
      B: "Filgrastim.",
      C: "Vitamina B12.",
      D: "Eritropoetina."
    },
    gabarito: "C",
    explicacao: "DEFICIÊNCIA DE VITAMINA B12 PÓS-BARIÁTRICA: clássica em pacientes operados há anos sem reposição adequada. FISIOPATOLOGIA: bypass exclui o estômago (onde a célula parietal produz FATOR INTRÍNSECO necessário para absorção da B12 no íleo terminal). LABORATÓRIO: ANEMIA MACROCÍTICA MEGALOBLÁSTICA (VCM >100), NEUTRÓFILOS HIPERSEGMENTADOS (achado clássico), pancitopenia em casos graves, reticulocitopenia. CLÍNICA: sintomas neurológicos (parestesias, fraqueza, alteração de propriocepção - degeneração combinada da medula), neuropsiquiátricos (depressão, demência), gastrointestinais (glossite). Tratamento: REPOSIÇÃO DE B12 - inicialmente PARENTERAL (IM, 1.000 mcg/dia por 7 dias, depois semanal, mensal). Ferro (A): para anemia ferropriva (microcítica). Filgrastim/eritro: tratamento sintomático sem corrigir a causa."
  },
  {
    n: 273,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["COVID-19 na gestação", "Aleitamento"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Gestante saudável, 39 sem, no parto está bem mas COM INFECÇÃO POR SARS-CoV-2. Conduta com RN após parto?",
    alternativas: {
      A: "Quarto privativo e CONTRAINDICAR aleitamento materno.",
      B: "Quarto privativo e PROMOVER aleitamento materno.",
      C: "Separar por 14 dias e contraindicar aleitamento.",
      D: "Separar por 14 dias e oferecer leite ordenhado."
    },
    gabarito: "B",
    explicacao: "COVID-19 E ALEITAMENTO MATERNO (MS, OMS, SBP): NÃO HÁ EVIDÊNCIA DE TRANSMISSÃO VERTICAL pelo leite materno (vírus não isolado em amostras de leite). O ALEITAMENTO É RECOMENDADO mesmo em mães com COVID, com PRECAUÇÕES PARA EVITAR TRANSMISSÃO RESPIRATÓRIA: 1) MÁSCARA cirúrgica durante a amamentação; 2) HIGIENE rigorosa das mãos antes do contato com o RN; 3) Higiene das superfícies/mamas; 4) ALOJAMENTO CONJUNTO em quarto privativo (não separar mãe-RN exceto se mãe gravemente enferma). Os benefícios do aleitamento (imunológico, vínculo, anticorpos passivos contra SARS-CoV-2) SUPERAM os riscos teóricos. SEPARAÇÃO por 14 dias (C, D) já não é recomendada — foi protocolo inicial mas abandonado."
  },
  {
    n: 274,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Reanimação neonatal", "Líquido amniótico meconial"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "RN 41 sem com líquido amniótico MECONIAL, nasce CHORANDO, tônus em flexão, BOA VITALIDADE. Procedimentos na recepção?",
    alternativas: {
      A: "Clampeamento entre 1-3 min, contato pele a pele com a mãe, NÃO aspirar VAS.",
      B: "Clampeamento <1 min, contato pele a pele, não aspirar.",
      C: "Clampeamento 1-3 min, adiar contato para aspirar VAS.",
      D: "Clampeamento <1 min, adiar contato para aspirar VAS."
    },
    gabarito: "A",
    explicacao: "REANIMAÇÃO NEONATAL EM LÍQUIDO AMNIÓTICO MECONIAL (PRN/SBP 2022): mudança IMPORTANTE no protocolo. Se RN com BOA VITALIDADE ao nascer (TÔNUS adequado E CHORO/RESPIRAÇÃO efetivos): MANEJO IGUAL AO RN SEM MECÔNIO. 1) CLAMPEAMENTO TARDIO do cordão entre 1-3 MIN (benefícios hematológicos, redução de anemia ferropriva); 2) CONTATO PELE A PELE imediato com a mãe + secar/aquecer; 3) NÃO ASPIRAR VIAS AÉREAS de rotina (a aspiração rotineira foi ABANDONADA pois não previne SAM e pode causar bradicardia). ASPIRAÇÃO TRAQUEAL sob laringoscopia direta SÓ se RN com mecônio E SEM vitalidade (apneia, hipotonia, FC <100). Recomendação atual do PRN."
  },
  {
    n: 275,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Dermatologia",
    subtemas: ["Candidíase de fralda", "Antibioticoterapia"],
    dificuldade: "Fácil",
    temImagem: true,
    enunciado: "Menina, 8 meses, retorna após tratamento de OMA com AMOXICILINA (boa evolução). Há 5 dias surgiram LESÕES HIPEREMIADAS NA REGIÃO PERINEAL. Conduta?",
    alternativas: {
      A: "Corticoide tópico e banho de sol.",
      B: "Creme antifúngico e limpeza local.",
      C: "Banho com cloridrato de benzidamina.",
      D: "Neomicina e banho de sol."
    },
    gabarito: "B",
    explicacao: "CANDIDÍASE DE FRALDA (dermatite por Cândida sp.): clássica APÓS USO DE ANTIBIÓTICO (antibioticoterapia altera microbiota cutânea, favorecendo crescimento fúngico). Características diagnósticas: eritema INTENSO em região PERINEAL/inguinal + bordas BEM DELIMITADAS + LESÕES SATÉLITES (papulopústulas isoladas ao redor da placa principal) + acometimento das DOBRAS (diferente da dermatite irritativa primária que poupa as dobras). Tratamento: ANTIFÚNGICO TÓPICO (nistatina creme ou imidazólicos como cetoconazol, miconazol) 2-4x/dia + LIMPEZA local + secar adequadamente. Corticoide (A) pode até piorar. Neomicina (D): antibiótico tópico - inadequado para fungo."
  },
  {
    n: 276,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Imunização",
    subtemas: ["HPV", "Meningocócica ACWY", "Adolescente"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Menina, 12a, vacinação adequada até 5 anos. Recebeu hoje HPV + meningocócica ACWY. Conduta?",
    alternativas: {
      A: "Repetir HPV e ACWY em 6 meses.",
      B: "Considerar imunizada para HPV e ACWY.",
      C: "Repetir HPV em 6 meses.",
      D: "Repetir ACWY em 6 meses."
    },
    gabarito: "C",
    explicacao: "CALENDÁRIO VACINAL DO ADOLESCENTE (PNI/MS): HPV QUADRIVALENTE (Gardasil 6/11/16/18): esquema PNI para meninas e meninos de 9-14 anos = 2 DOSES (intervalo 6 meses). Esquema 3 doses se imunossupressão ou >15 anos. Esta menina (12a) recebeu 1ª dose hoje - precisa REPETIR HPV em 6 MESES. MENINGOCÓCICA ACWY: PNI para adolescentes 11-14 anos = DOSE ÚNICA (a partir de 2020). Não precisa repetir. Por isso a conduta é repetir SÓ HPV (C). Outras opções estão erradas: A repetiria a ACWY desnecessariamente; B considera ambas completas; D repetiria a ACWY (que é dose única)."
  },
  {
    n: 277,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Gastroenterologia",
    subtemas: ["Doença celíaca", "Dieta sem glúten"],
    dificuldade: "Fácil",
    temImagem: false,
    enunciado: "Menina, 2a e 6m, desde 8m com dor + distensão abdominal + diarreia + inapetência + perda de peso. Após investigação confirmatória, devem ser EXCLUÍDOS da dieta:",
    alternativas: {
      A: "Arroz, polvilho e amaranto.",
      B: "Amendoim, chia e tapioca.",
      C: "Trigo, centeio e cevada.",
      D: "Cará, batata e grão de bico."
    },
    gabarito: "C",
    explicacao: "DOENÇA CELÍACA: enteropatia autoimune mediada por linfócitos T contra peptídeos do GLÚTEN (gliadina + glutenina) em indivíduos geneticamente predispostos (HLA-DQ2/DQ8). Início típico após introdução de cereais com glúten (~6m). Manifestações: diarreia crônica, distensão, déficit de crescimento/peso (síndrome disabsortiva). Diagnóstico: anticorpos (anti-transglutaminase IgA, EMA) + biópsia duodenal (atrofia vilositária). TRATAMENTO: DIETA SEM GLÚTEN PARA SEMPRE - EXCLUIR: TRIGO, CENTEIO, CEVADA e seus derivados (TACC: também 'aveia' por contaminação cruzada, embora aveia pura seja segura em ~95%). PERMITIDOS: ARROZ, MILHO, POLVILHO, TAPIOCA, AMARANTO, QUINOA, sorgo, mandioca, batata. Alimentos das opções A, B, D são NATURALMENTE SEM glúten."
  },
  {
    n: 278,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Hematologia",
    subtemas: ["Anemia ferropriva", "Lactente"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Menina, 11m, picacismo há 1 mês. AM + leite de vaca + baixa ingesta sólida. Sem anemia familiar. Mucosas descoradas ++. Hb 8,5, Ht 29, retic 1,7%, VCM 62 (MICROCÍTICA), HCM 22, RDW 19, ferritina 8 (BAIXA). Conduta?",
    alternativas: {
      A: "Ferro elementar 5 mg/kg/dia VO.",
      B: "Sulfato ferroso 5 mg/kg/dia VO.",
      C: "Ferro elementar 1 mg/kg/dia VO.",
      D: "Sacarato de hidróxido férrico EV 3 mg/kg."
    },
    gabarito: "A",
    explicacao: "ANEMIA FERROPRIVA DO LACTENTE: clássica em <2 anos, especialmente com baixo consumo de carne + ingesta excessiva de leite de vaca (inibe absorção). DIAGNÓSTICO: anemia MICROCÍTICA HIPOCRÔMICA + RDW alto + FERRITINA BAIXA (<12 padrão SBP). PICAMALACIA é um sintoma clássico. TRATAMENTO (SBP 2018/MS): FERRO ELEMENTAR 3-5 mg/kg/dia (na dose terapêutica) VO, em jejum, longe de leite/cálcio. Vit C ajuda absorção. Duração: até normalizar Hb + 3-6 MESES para repor estoques. Esta criança precisa de DOSE TERAPÊUTICA (5 mg/kg/dia de FERRO ELEMENTAR). Sulfato ferroso (B): a dose deve ser calculada em ferro elementar (sulfato ferroso tem 20% de ferro). 1 mg/kg/dia (C): dose PROFILÁTICA, não terapêutica. EV (D): só se intolerância ou má resposta a 4-6 sem de VO."
  },
  {
    n: 279,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Infectologia",
    subtemas: ["Sífilis congênita", "Tratamento"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN feminino, 39 sem, mãe com VDRL 1:1024 SEM tratamento. RN: treponêmico+, não-treponêmico 1:512, hepatoesplenomegalia. LIQUOR: leucócitos 234/mm³ (78% PMN), proteína 540, glicose 12 (glicemia 75). Tratamento do RN:",
    alternativas: {
      A: "Penicilina cristalina 50.000 UI/kg EV dose única.",
      B: "Penicilina procaína 50.000 UI/kg/dose IM 1x/dia por 10 dias.",
      C: "Penicilina benzatina 50.000 UI/kg/dose IM semanal por 3 sem.",
      D: "Penicilina cristalina 50.000 UI/kg/dose EV por 10 dias."
    },
    gabarito: "D",
    explicacao: "SÍFILIS CONGÊNITA com NEUROSÍFILIS (alteração liquórica): mãe não tratada + RN com VDRL >1:32 (1:512) + ALTERAÇÃO DO LIQUOR (qualquer alteração: VDRL+, celularidade >25 ou prot >150 em RN >28 dias - aqui PROT 540 + leucócitos 234, MUITO alterado, com pleocitose). TRATAMENTO COM NEUROSÍFILIS: PENICILINA CRISTALINA AQUOSA 50.000 UI/kg/dose EV de 12/12h (primeiros 7 dias) e depois 8/8h até completar 10 DIAS - única que atravessa BHE em concentrações suficientes. Penicilina procaína (B): para sífilis CONGÊNITA SEM neurosífilis. Penicilina benzatina (C): só para tratamento materno e sífilis tardia confirmada SEM alteração liquórica. Dose única (A): inadequada para neurosífilis."
  },
  {
    n: 280,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Icterícia neonatal", "Diagnóstico diferencial"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN 40 sem, 3450g, 15h de vida, AM em livre demanda. ICTERÍCIA MODERADA ATÉ REGIÃO UMBILICAL. Causa a ser investigada inicialmente:",
    alternativas: {
      A: "Icterícia fisiológica.",
      B: "Icterícia de causa hemolítica.",
      C: "Infecções congênitas.",
      D: "Icterícia pelo leite materno."
    },
    gabarito: "B",
    explicacao: "ICTERÍCIA PRECOCE (<24-36h DE VIDA) = SEMPRE PATOLÓGICA até prova em contrário. Causa mais frequente: HEMÓLISE (incompatibilidade ABO ou Rh, esferocitose, deficiência de G6PD, sepse). ICTERÍCIA FISIOLÓGICA (A): inicia APÓS 24-36h, pico em 3-4 dias, máximo em zona 3 de Kramer, BT geralmente <12, NUNCA antes de 24h. ICTERÍCIA PELO LEITE MATERNO (D): após o 7º dia, dura semanas-meses. INFECÇÕES CONGÊNITAS (C): geralmente com outros achados (hepatoesplenomegalia, exantema, microcefalia) - não primeiro diagnóstico isolado em RN com 15h. Investigação: TIPO SANGUÍNEO mãe/RN + COOMBS DIRETO + Hb/Ht + reticulócitos + BT/BD/BI + esfregaço."
  },
  {
    n: 281,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Emergências/Toxicologia",
    subtemas: ["Intoxicação por barbitúrico", "Suporte respiratório"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Menino, 4a, ingestão acidental de 1 frasco de FENOBARBITAL. FC 67, FR 9, SpO2 78%. Abordagem inicial?",
    alternativas: {
      A: "Máscara de alto fluxo não-reinalante.",
      B: "Cateter nasal 2 L/min.",
      C: "Iniciar ventilação positiva com BVM.",
      D: "Máscara de Venturi 15 L/min."
    },
    gabarito: "C",
    explicacao: "INTOXICAÇÃO POR BARBITÚRICO (FENOBARBITAL): depressão grave do SNC com DEPRESSÃO RESPIRATÓRIA (FR 9, SpO2 78%, bradicardia). PRIORIDADE pela ordem do ABC: A (via aérea) - paciente provavelmente sem proteção; B (ventilação) - INSUFICIÊNCIA RESPIRATÓRIA estabelecida (FR <10, SpO2 78%). CONDUTA: VENTILAÇÃO COM PRESSÃO POSITIVA com BOLSA-VÁLVULA-MÁSCARA (BVM) - assistir a respiração que está insuficiente. Após estabilização: IOT (provável necessidade), suporte ventilatório, lavagem gástrica precoce + carvão ativado, manejo de hipotensão, alcalinização urinária para excretar barbitúrico. Cateter nasal/máscara apenas (A, B, D) NÃO RESOLVEM a hipoventilação (paciente não está respirando suficiente)."
  },
  {
    n: 282,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Emergências",
    subtemas: ["Corpo estranho via aérea/digestiva", "Broncoscopia"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Menino, 2a, engasgo brincando, vômito, agora assintomático. Última mamadeira há 2h. Falta peça de brinquedo. RX de tórax (suposta imagem mostrando corpo estranho radiopaco em VIA AÉREA). Conduta?",
    alternativas: {
      A: "Aguardar migração por até 24h.",
      B: "Broncoscopia após 8h de jejum.",
      C: "EDA após 8h de jejum.",
      D: "EDA de emergência."
    },
    gabarito: "B",
    explicacao: "ASPIRAÇÃO DE CORPO ESTRANHO EM VIA AÉREA: emergência potencial em criança 1-3 anos (engasgo, episódio súbito). Tratamento: BRONCOSCOPIA RÍGIDA (técnica de escolha em pediatria - permite ventilação simultânea e retirada do corpo estranho) SOB JEJUM ADEQUADO (6-8h - reduz risco de broncoaspiração durante anestesia geral). EDA (C/D) seria para corpo estranho no TGI (esôfago, estômago). Aguardar (A): risco de complicações - pneumonia obstrutiva, atelectasia, perfuração, hemoptise. RX pode mostrar corpo radiopaco, hiperinsuflação localizada, atelectasia, mediastino deslocado. NOTA: o caso depende do achado radiológico - se for VIA DIGESTIVA, EDA seria adequada. A questão se baseia em achado clássico de via aérea."
  },
  {
    n: 283,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Emergências",
    subtemas: ["PCR pediátrica", "Hipóxia"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Menino, 2a, em PCR com ASSISTOLIA. Principal benefício de INTUBAR para retorno de circulação espontânea:",
    alternativas: {
      A: "Oferecer oxigenação e ventilação mais eficiente, pois HIPÓXIA é a causa mais frequente de PCR pediátrica.",
      B: "Via para administração de medicações endotraqueal rápida e segura.",
      C: "Permitir compressões contínuas sem sincronização com a ventilação.",
      D: "Reduzir riscos de broncoaspiração durante a reanimação."
    },
    gabarito: "A",
    explicacao: "PCR PEDIÁTRICA: ETIOLOGIA fundamental diferente do adulto. Em CRIANÇAS, a PCR é PREDOMINANTEMENTE de causa HIPÓXICA/RESPIRATÓRIA (~80% dos casos) - quase nunca primariamente cardíaca como no adulto. CAUSAS comuns: insuficiência respiratória progressiva, sepse, afogamento, trauma, SIDS. Por isso, IOT em PCR pediátrica é prioritária para garantir OXIGENAÇÃO E VENTILAÇÃO ADEQUADAS - tratamento da causa fundamental. Esta diferenciação é central no PALS. Outros benefícios mencionados (B-via medicações, C-compressões contínuas, D-redução de broncoaspiração) são válidos mas SECUNDÁRIOS à correção da hipóxia subjacente. Note: medicações endotraqueais hoje têm uso restrito - prioridade é acesso IO."
  },
  {
    n: 284,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Cardiologia",
    subtemas: ["Cardiopatia congênita cianótica", "Tetralogia de Fallot"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Lactente 6m, cianose perioral progressiva ao chorar/mamar, episódios de cianose intensa com perda de consciência (crise hipoxêmica), sopro sistólico em borda esternal esquerda. Diagnóstico:",
    alternativas: {
      A: "Comunicação interventricular.",
      B: "Persistência do canal arterial.",
      C: "Tetralogia de Fallot.",
      D: "Coarctação da aorta."
    },
    gabarito: "C",
    explicacao: "TETRALOGIA DE FALLOT: cardiopatia congênita CIANÓTICA mais comum após o primeiro ano. Quatro componentes: 1) ESTENOSE INFUNDIBULAR/VALVAR PULMONAR; 2) HIPERTROFIA DO VENTRÍCULO DIREITO; 3) DEFEITO SEPTAL VENTRICULAR; 4) DEXTROPOSIÇÃO DA AORTA (cavalgante). CLÍNICA: cianose progressiva (inicialmente ao esforço/choro, depois em repouso) + CRISES HIPOXÊMICAS (cianose intensa súbita por espasmo infundibular - precipitada por choro, defecação, susto). MANEJO DA CRISE: posição genupeitoral, oxigênio, sedação (morfina), correção de acidose. CIV isolada (A) é ACIANÓTICA. PCA (B): pode ser cianótica tardiamente (Eisenmenger). Coarctação (D): HAS em MS, hipotensão em MI, pulso femoral fraco."
  },
  {
    n: 285,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Pneumologia",
    subtemas: ["Pneumonia em asmática", "Insuficiência respiratória"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Menina, 8a, asma. Febre + tosse + dispneia há 2 dias. FR 43, FC 120, T 39, retração intercostal, SpO2 90%. MV diminuído em base E + estertores subcrepitantes E. RX tórax (provável consolidação em base E). Trata-se de insuficiência respiratória:",
    alternativas: {
      A: "Baixa e restritiva.",
      B: "Baixa e obstrutiva.",
      C: "Alta e mista.",
      D: "Alta e obstrutiva."
    },
    gabarito: "A",
    explicacao: "INSUFICIÊNCIA RESPIRATÓRIA PEDIÁTRICA - classificação por TOPOGRAFIA e MECANISMO: TOPOGRAFIA: ALTA (acima da carina - laringe, traqueia, subglote) vs BAIXA (abaixo - brônquios, bronquíolos, parênquima). MECANISMO: OBSTRUTIVA (limitação ao fluxo - asma, bronquiolite) vs RESTRITIVA (redução do volume pulmonar - pneumonia, derrame, atelectasia). ESTE CASO: febre + tosse + estertores SUBCREPITANTES + consolidação ao RX = PNEUMONIA (acometimento parenquimatoso/baixa) + redução de complacência pulmonar (RESTRITIVO). Apesar da asma de base, o quadro AGUDO predominante é a pneumonia com padrão restritivo + baixa. Sibilos seriam achado de componente obstrutivo (não mencionados aqui - 'estertores'). RESPOSTA: BAIXA E RESTRITIVA."
  },
  {
    n: 286,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Infectologia",
    subtemas: ["Sarampo", "Exantema viral"],
    dificuldade: "Médio",
    temImagem: true,
    enunciado: "Menina, 7m, tosse + coriza + EXANTEMA MACULAR em face e tronco há 2 dias. Conjuntivite, coriza, linfonodos cervicais. Tem carteira de vacinação SEM tríplice viral (ainda) - precoce para idade. Conduta?",
    alternativas: {
      A: "Internação para imunoglobulina.",
      B: "Coleta de SOROLOGIA e RT-PCR para vírus do sarampo.",
      C: "Hidratação, soro nasal e reavaliação em 48h.",
      D: "Notificar evento adverso vacinal e contraindicar doses futuras."
    },
    gabarito: "B",
    explicacao: "SUSPEITA DE SARAMPO: lactente <12 meses (sem vacinação tríplice viral ainda - 1ª dose aos 12 meses), com FEBRE + EXANTEMA MACULAR generalizado + sintomas catarrais (TOSSE, CORIZA, CONJUNTIVITE = 'os 3 Cs'). Cenário pós-2018 com surtos no Brasil. CONDUTA: NOTIFICAÇÃO COMPULSÓRIA IMEDIATA + COLETA DE EXAMES para confirmação laboratorial: SOROLOGIA (IgM e IgG) + RT-PCR (urina, swab nasofaringe) - sorologia preferível em D4-D28 do exantema, PCR melhor em D1-D5. ISOLAMENTO RESPIRATÓRIO por aerossol até D6 do exantema. BLOQUEIO VACINAL dos contactantes suscetíveis em 72h. Imunoglobulina (A): em contactantes suscetíveis nos primeiros 6 dias da exposição, em casos selecionados (gestantes, imunossuprimidos, <6 meses). Tranquilizar (C) é INADEQUADO em sarampo - doença grave com mortalidade."
  },
  {
    n: 287,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Neonatologia",
    subtemas: ["Icterícia neonatal tardia", "Aleitamento exclusivo"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN 35d, AME, sem queixas. RNT AIG, alta com 48h. Diurese 8x/dia, evacuação em dias alternados. Ganho 35g/dia (BOM). Icterícia ZONA 2 de Kramer. Conduta?",
    alternativas: {
      A: "Orientar banho de sol e tranquilizar a família.",
      B: "Suspender LM por 48h.",
      C: "Hemograma e reticulócitos.",
      D: "BT e frações."
    },
    gabarito: "D",
    explicacao: "ICTERÍCIA PROLONGADA (>14 dias em RN a termo, >21 dias em pré-termo): SEMPRE INVESTIGAR. Mesmo com clínica boa, é OBRIGATÓRIO descartar causas patológicas, especialmente: COLESTASE NEONATAL (atresia de vias biliares, cisto de colédoco, infecções congênitas) - emergência DIAGNÓSTICA pois cirurgia de Kasai antes dos 60 dias melhora prognóstico. Investigação MÍNIMA: BT E FRAÇÕES (DIRETA e INDIRETA) - se BD elevada (>1 mg/dL ou >20% da BT) = COLESTASE = sinal de alarme. BANHO DE SOL (A) é INSUFICIENTE e NÃO recomendado na prática moderna (risco de queimaduras, eficácia limitada). Suspender LM (B): em casos selecionados após investigação. Hemograma (C) sozinho é insuficiente."
  }
);

console.log("UNICAMP Bloco 2 (261-287) adicionado");

// ==================== UNICAMP 2021 - Bloco 3 (288-307) ====================
// G.O. (Q48-Q64 da prova) + algumas pediatria final
QUESTOES.push(
  {
    n: 288,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Diabetes Gestacional",
    subtemas: ["DMG", "Manejo"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Pré-natal, 32a, G2P1, 28 sem. USG: feto p90 (1380g). TOTG: jejum 95 (alterado), 1h 195 (alterado), 2h 165 (alterado). HbA1c 6,2. Antecedente: DMG prévio. Conduta?",
    alternativas: {
      A: "Solicitar curva insulínica.",
      B: "Iniciar insulina basal.",
      C: "Orientar dieta + atividade física + controle glicêmico.",
      D: "Iniciar metformina + dieta."
    },
    gabarito: "C",
    explicacao: "DIABETES GESTACIONAL: diagnóstico confirmado (TOTG com 3 valores alterados pelos critérios IADPSG: jejum ≥92, 1h ≥180, 2h ≥153). PRIMEIRA LINHA DE TRATAMENTO: SEMPRE DIETA + ATIVIDADE FÍSICA + AUTOMONITORAMENTO da glicemia capilar (jejum + pós-prandial) por 1-2 SEMANAS. Esta abordagem controla ~70% dos casos. ALVOS: jejum <95, 1h pós <140, 2h pós <120. Se não atingir alvos: introduzir INSULINA (mais segura na gestação - não atravessa placenta). METFORMINA: opção em casos selecionados (atravessa placenta, falta de dados de longo prazo - SBD usa, ADA preferia insulina). Iniciar medicação UPFRONT (B, D) sem antes tentar dieta NÃO é padrão. Curva insulínica (A) não tem papel."
  },
  {
    n: 289,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Pré-eclâmpsia", "Prevenção"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 28a, G2P1C1A0, 1ª consulta. Antecedente: HAS crônica + eclâmpsia às 28 sem da 1ª gestação há 3 anos. Conduta?",
    alternativas: {
      A: "Prescrever heparina BPM em dose profilática durante a gestação.",
      B: "Prescrever AAS e CARBONATO DE CÁLCIO durante a gestação.",
      C: "Programar cesárea eletiva às 36 sem.",
      D: "Prescrever corticoide a partir de 26 semanas."
    },
    gabarito: "B",
    explicacao: "PREVENÇÃO DE PRÉ-ECLÂMPSIA EM GESTANTES DE ALTO RISCO: História de pré-eclâmpsia/eclâmpsia + HAS crônica = MUITO ALTO RISCO de recidiva. CONDUTA RECOMENDADA (FEBRASGO/ACOG/SBC): 1) AAS 100-150 mg/dia (PROFILAXIA PRÉ-ECLÂMPSIA) - iniciar entre 12-16 semanas, manter até 36 sem (ou parto); 2) CARBONATO DE CÁLCIO (1,5-2 g/dia) em populações com baixa ingesta de cálcio (Brasil). Estudos meta-analíticos: AAS reduz pré-eclâmpsia precoce em até 60% em alto risco. Cálcio reduz pré-eclâmpsia em populações deficientes. Anticoagulação (A) só se SAF/trombofilia. Cesárea profilática 36 sem (C): não previne pré-eclâmpsia. Corticoide (D): para maturação pulmonar EM CASO DE parto prematuro iminente, não para profilaxia."
  },
  {
    n: 290,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Parto pré-termo", "COVID-19 grave"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Gestante 34 sem, transferida após PCR revertida. Em VM (FIO2 70%, PEEP 12), noradrenalina, sintomas gripais há 3 dias. BCF 162 SEM variabilidade. Suspeita COVID grave. Além de isolamento e UTI:",
    alternativas: {
      A: "Cesárea imediata.",
      B: "Corticoide para maturação fetal e parto após 48h.",
      C: "Aguardar RT-PCR para definir conduta.",
      D: "Induzir parto vaginal após estabilização."
    },
    gabarito: "A",
    explicacao: "PARADA CARDIORRESPIRATÓRIA EM GESTANTE >24 SEMANAS: a INTERRUPÇÃO DA GESTAÇÃO (cesárea perimortem ou pós-PCR) é parte integrante da REANIMAÇÃO MATERNA. Indicações: 1) RESOLVER A COMPRESSÃO AORTO-CAVA - melhora retorno venoso e eficácia das compressões; 2) MELHORAR HEMODINÂMICA MATERNA; 3) Permitir suporte adequado em UTI sem comprometimento fetal; 4) FETO COM SINAIS DE SOFRIMENTO (BCF 162 SEM variabilidade = bradicardia/taquicardia sem reatividade = sofrimento fetal agudo). Em 34 sem, viabilidade fetal é boa. Aguardar 48h para corticoide (B): TEMPO PERDIDO em paciente crítica + feto em sofrimento. Aguardar PCR (C): retardo inaceitável. Parto vaginal (D): inviável em paciente sedada/VM em pós-PCR."
  },
  {
    n: 291,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Mastologia",
    subtemas: ["Subtipos do CA de mama", "Imunohistoquímica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 66a, CA de mama há 3 anos. Em uso de INIBIDOR DE AROMATASE. Tratamento prévio: QT com TAXANOS + IMUNOTERAPIA com TRASTUZUMABE. O subtipo intrínseco do CA é:",
    alternativas: {
      A: "Luminal A.",
      B: "Luminal HER-2 positivo.",
      C: "Triplo negativo.",
      D: "Luminal B HER-negativo."
    },
    gabarito: "B",
    explicacao: "SUBTIPOS INTRÍNSECOS DO CA DE MAMA (Perou/Sorlie): LUMINAL A: RH+ (ER+/PR+), HER2-, Ki67 baixo (bom prognóstico, hormonioterapia). LUMINAL B HER2-: RH+, HER2-, Ki67 ALTO (QT + hormônio). LUMINAL HER2+: RH+ E HER2+ - HORMONIOTERAPIA + ANTI-HER2 + QT (este caso: usa INIBIDOR DE AROMATASE → indica que é HORMONIOSSENSÍVEL/RH+; usa TRASTUZUMABE → indica HER2+). HER2 puro: RH-, HER2+ (QT + anti-HER2). TRIPLO NEGATIVO: tudo negativo - QT (mais agressivo). Trastuzumabe é o anti-HER2 'imunoterapia' do enunciado. Combinação 'IA + trastuzumabe' = LUMINAL HER+ classicamente."
  },
  {
    n: 292,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia/HIV",
    subtemas: ["Profilaxia transmissão vertical", "AZT intraparto"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 22a, G1P0, 38 sem, RPMO há 1h. Pré-natal abandonado. Sorologias prévias negativas para HIV. Na internação: teste rápido HIV+. Sem dinâmica uterina. Conduta?",
    alternativas: {
      A: "Cesárea imediata, técnica hemostática.",
      B: "Indução do parto após início de AZT EV.",
      C: "Cesárea após 18h de AZT EV.",
      D: "Cesárea após 3h de AZT EV."
    },
    gabarito: "D",
    explicacao: "HIV NA GESTAÇÃO - VIA DE PARTO depende da CARGA VIRAL: 1) CV indetectável (<1000 cópias) próximo ao parto: parto VAGINAL pode ser seguro com TARV; 2) CV desconhecida ou >1000 ou sem TARV efetiva (como este caso - diagnóstico na admissão, sem tratamento prévio): CESÁREA ELETIVA antes do início do TP/RPMO + AZT EV (zidovudina) iniciado PELO MENOS 3 HORAS ANTES do clampeamento. ESTE CASO: diagnóstico recente, sem TARV, RPMO há 1h (precoce) - INDICAÇÃO CESÁREA com AZT EV mínimo de 3h pré-parto. AZT EV (4-6 mg/kg/h iniciais), depois 1-2 mg/kg/h até clampeamento. 18h (C) excessivo (regra é mínimo 3h). RN: AZT + nevirapina + fórmula (não amamenta)."
  },
  {
    n: 293,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Pediatria",
    tema: "Neonatologia/HIV",
    subtemas: ["Profilaxia transmissão vertical RN", "AZT e nevirapina"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "RN do caso anterior. Mãe com diagnóstico de HIV na admissão (sem TARV prévia). Além da fórmula láctea, conduta para o RN?",
    alternativas: {
      A: "Imunoglobulina anti-hepatite B IM + AZT VO.",
      B: "Vacina hepatite B IM + AZT VO.",
      C: "Imunoglobulina anti-hepatite B IM + AZT + nevirapina.",
      D: "Vacina hepatite B IM + AZT VO + nevirapina VO."
    },
    gabarito: "D",
    explicacao: "PROFILAXIA HIV NO RN exposto - estratificação por RISCO de transmissão vertical (MS 2018): ALTO RISCO (mãe sem TARV ou CV detectável próximo ao parto - este caso, diagnóstico na admissão): ESQUEMA TRIPLO = AZT + 3TC + RALTEGRAVIR ou AZT + NEVIRAPINA por 28 DIAS, iniciado nas primeiras 4 horas de vida. BAIXO RISCO (mãe com TARV efetiva, CV indetectável): AZT por 28 dias (4 semanas). HEPATITE B: dado da mãe HBsAg- e anti-HBs+ (já imune) - RN recebe apenas a VACINA DE ROTINA ao nascimento (sem imunoglobulina, pois mãe não é portadora ativa). Imunoglobulina (A,C) só se mãe HBsAg+ (não é o caso). Não amamenta - fórmula láctea. Notificar."
  },
  {
    n: 294,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Infectologia",
    subtemas: ["Sífilis na gestação", "Tratamento adequado"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Primigesta 18a, 10 sem. SOROLOGIA SÍFILIS: TR+, CMIA+, TPHA+, VDRL 1/4. Sem antecedente de tratamento. Recebeu PENICILINA BENZATINA 4.800.000 UI DOSE ÚNICA. É correto:",
    alternativas: {
      A: "Titulação VDRL indica cicatriz sorológica - sem conduta.",
      B: "Sífilis terciária - avaliação liquórica.",
      C: "Sífilis RECENTE e tratamento ADEQUADO.",
      D: "Ajustar para 3 doses semanais de 2.400.000 UI."
    },
    gabarito: "C",
    explicacao: "SÍFILIS NA GESTAÇÃO - INTERPRETAÇÃO: VDRL 1:4 = baixa titulação que pode indicar 1) sífilis recente em queda; 2) cicatriz sorológica; 3) início de sífilis. Como não há antecedente de tratamento + treponêmicos positivos = SÍFILIS ATIVA. PRESUNÇÃO de SÍFILIS RECENTE (LATENTE RECENTE - menos de 1 ano de evolução desconhecida). TRATAMENTO ADEQUADO PARA SÍFILIS RECENTE NA GESTAÇÃO (MS 2020): PENICILINA BENZATINA 2.400.000 UI IM em DOSE ÚNICA (Brasil). Caso recebido 4.800.000 = adequado/excedente. Para SÍFILIS TARDIA/LATENTE TARDIA/DESCONHECIDA: 3 DOSES SEMANAIS de 2.400.000 UI. Na DÚVIDA da classificação, MS RECOMENDA TRATAR COMO TARDIA (3 doses). Mas o gabarito da banca presumiu RECENTE - opção C. Avaliação liquórica só para sífilis terciária ou neurossífilis (não indicada aqui)."
  },
  {
    n: 295,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Contracepção",
    subtemas: ["CA mama tratado", "Métodos não-hormonais"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 34a, MASTECTOMIZADA há 40 dias por CDI com RECEPTORES NEGATIVOS para ER/PR e HER2-. Método contraceptivo indicado?",
    alternativas: {
      A: "Implante liberador de levonorgestrel.",
      B: "Acetato de medroxiprogesterona depósito.",
      C: "DIU de cobre.",
      D: "ACO combinado de baixa dose."
    },
    gabarito: "C",
    explicacao: "CONTRACEPÇÃO EM MULHER COM HISTÓRIA DE CÂNCER DE MAMA: critérios CDC/OMS de elegibilidade. CA de mama atual ou recente = CATEGORIA 4 (CONTRAINDICAÇÃO ABSOLUTA) para QUALQUER MÉTODO HORMONAL, mesmo em receptores negativos (princípio da precaução). MÉTODOS PERMITIDOS: NÃO-HORMONAIS = preservativo, DIU DE COBRE (categoria 1), tabela de calendário, vasectomia/laqueadura. DIU LIBERADOR DE LEVONORGESTREL (Mirena) - apesar de liberação local de hormônio, é CATEGORIA 4 em CA mama atual (princípio da precaução). Implante (Implanon - etonogestrel), AMD, ACO = CATEGORIA 3-4. Portanto, neste cenário, a única opção SEGURA é DIU DE COBRE."
  },
  {
    n: 296,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Mastologia",
    subtemas: ["Lesões precursoras de CA de mama", "Hiperplasia atípica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 42a, biópsia: fibroadenoma simples + hiperplasia estromal pseudo-angiomatosa + metaplasia apócrina + HIPERPLASIA LOBULAR ATÍPICA. É lesão precursora para CA de mama com RISCO MODERADO:",
    alternativas: {
      A: "Fibroadenoma simples.",
      B: "Hiperplasia estromal pseudoangiomatosa.",
      C: "Metaplasia apócrina.",
      D: "Hiperplasia lobular atípica."
    },
    gabarito: "D",
    explicacao: "ESTRATIFICAÇÃO DE RISCO DE LESÕES MAMÁRIAS NÃO-MALIGNAS: 1) LESÕES NÃO PROLIFERATIVAS: SEM aumento ou aumento mínimo (RR ~1) - cistos, fibroadenoma simples, hiperplasia ductal usual, metaplasia apócrina, ectasia ductal, PASH (hiperplasia estromal pseudo-angiomatosa); 2) LESÕES PROLIFERATIVAS SEM ATIPIA: AUMENTO LEVE (RR 1,5-2) - hiperplasia ductal usual florida, papilomas, cicatriz radial, adenose esclerosante; 3) LESÕES PROLIFERATIVAS COM ATIPIA: AUMENTO MODERADO (RR 4-5) = HIPERPLASIA DUCTAL ATÍPICA e HIPERPLASIA LOBULAR ATÍPICA (ALH); 4) LESÕES DE ALTO RISCO: LCIS clássico (RR 7-10). HIPERPLASIA LOBULAR ATÍPICA = RISCO MODERADO. Indicação: seguimento rigoroso, possível quimioprevenção (tamoxifen)."
  },
  {
    n: 297,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Prevenção Oncológica",
    subtemas: ["Rastreamento CA colo", "Teste HPV"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre o uso de TESTE MOLECULAR para HPV no rastreamento de CA de colo no Brasil, o principal motivo da NÃO utilização é:",
    alternativas: {
      A: "Alto custo dos testes moleculares.",
      B: "Necessidade de migração para rastreamento ORGANIZADO.",
      C: "Alta incidência de câncer em <40 anos.",
      D: "Vacinação para HPV em meninos e meninas."
    },
    gabarito: "B",
    explicacao: "TESTE DE HPV NO RASTREAMENTO DE CÂNCER DE COLO: as evidências científicas mostram que o teste de DNA-HPV de alto risco é SUPERIOR à citologia (sensibilidade ~95% vs 60%) e permite intervalos maiores entre rastreios (5 anos vs 3 anos). Adotado por muitos países desenvolvidos. NO BRASIL: ainda baseado em CITOLOGIA. Principal LIMITAÇÃO para implementação: NECESSITA DE RASTREAMENTO ORGANIZADO (com chamada ativa, controle de qualidade, seguimento adequado dos casos positivos) - diferente do modelo OPORTUNÍSTICO atual brasileiro. CUSTO (A) também é importante mas há programas estaduais como o de São Paulo iniciando. Migração para rastreamento organizado é o desafio MAIOR. Vacinação (D) é COMPLEMENTAR, não substitui rastreamento."
  },
  {
    n: 298,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["DMG", "Macrossomia", "Interrupção da gestação"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Primigesta 37+2 sem, DMG, redução de movimentos fetais. Mobilograma 4 mov/h. Glicemias controladas. CTG ATIVA + USG: peso fetal estimado 3600g (>p90), ILA 180, Doppler normal. Conduta?",
    alternativas: {
      A: "Induzir parto com vigilância de vitalidade fetal.",
      B: "Cesárea de urgência.",
      C: "CTG semanal e indução às 40 sem.",
      D: "CTG a cada 3 dias e cesárea 39 sem."
    },
    gabarito: "A",
    explicacao: "DMG COM MACROSSOMIA FETAL (peso >p90) + REDUÇÃO DE MOV. FETAIS + IG 37+2: TRÊS indicadores que justificam INTERRUPÇÃO. RECOMENDAÇÃO ATUAL (FEBRASGO/ACOG): DMG em uso de insulina ou com complicações = interromper a partir de 37-38+6 semanas (não esperar 40 sem). Macrossomia (>4000g) aumenta risco de distocia/lesão. CTG ativa + Doppler normal + vitalidade preservada = CTG presente. Conduta: INDUZIR PARTO com VIGILÂNCIA RIGOROSA (CTG intra-parto). CESÁREA DE URGÊNCIA (B) não está indicada (sem sofrimento agudo). ESPERAR ATÉ 40 SEM (C) é INADEQUADO (risco fetal aumenta). 3 dias CTG e cesárea 39 sem (D): conduta intermediária mas não responde ao quadro atual."
  },
  {
    n: 299,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Aloimunização Rh", "Imunoglobulina anti-D"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Mulher, 33a, G3P2A1, 24h puerpério, A NEG, COOMBS INDIRETO POSITIVO anti-D. RN: O POS. Antecedente: imunoglobulina anti-Rh em todos os eventos prévios. Conduta?",
    alternativas: {
      A: "Imunoglobulina anti-Rh NÃO indicada por Coombs indireto positivo.",
      B: "Prescrever Imunoglobulina anti-Rh por RN Rh+.",
      C: "Contraindicar nova gestação - isoimunizada.",
      D: "Coombs direto para orientar imunoglobulina."
    },
    gabarito: "B",
    explicacao: "IMUNOGLOBULINA ANTI-RH (RHOGAM) NO PUERPÉRIO: indicação universal em gestante Rh NEGATIVO com RN Rh POSITIVO + Coombs indireto NEGATIVO (não-sensibilizada). Aplicar até 72h pós-parto. NESTE CASO: a paciente recebeu imunoglobulina às 28 sem (PRÉ-NATAL) - o Coombs indireto positivo coletado NA ADMISSÃO pode ser DEVIDO À PRÓPRIA IMUNOGLOBULINA INJETADA (a anti-D circula por semanas, e o Coombs indireto detecta anti-D). A paciente NÃO está realmente sensibilizada (foi profilaxia recente). Como o RN É Rh+, INDICAÇÃO MANTIDA de aplicar imunoglobulina anti-Rh no pós-parto (reforço/proteção). Diferente de paciente verdadeiramente isoimunizada (que não se beneficiaria). Coombs DIRETO no RN ajuda a distinguir."
  },
  {
    n: 300,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Endometriose",
    subtemas: ["Endometriose profunda", "Endometrioma"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 30a, nuligesta, DISMENORREIA incapacitante + DISPAREUNIA profunda há 5 anos. Ciclos regulares. RM pelve: lesão retrátil em região RETROCERVICAL (1,4x1cm) envolvendo serosa/muscular do reto alto e parede posterior útero/colo + LESÕES CÍSTICAS hemorrágicas multiloculadas ovarianas. Hipótese?",
    alternativas: {
      A: "Endometriose profunda.",
      B: "Cisto hemorrágico ovariano.",
      C: "Carcinomatose peritoneal.",
      D: "Doença inflamatória pélvica."
    },
    gabarito: "A",
    explicacao: "ENDOMETRIOSE PROFUNDA INFILTRATIVA: definida como infiltração endometriótica >5mm no peritônio ou em órgãos pélvicos (intestino, bexiga, ureter, vagina, septo retovaginal). Apresentação clássica: 1) DISMENORREIA CICLO-DEPENDENTE incapacitante; 2) DISPAREUNIA PROFUNDA (ao tocar lesões cervicais/retrocervicais); 3) Sintomas intestinais cíclicos; 4) Infertilidade. ACHADOS RM: lesão RETRÁTIL (típica) em região retrocervical + envolvimento de septo retovaginal + ENDOMETRIOMAS bilaterais (lesões císticas com conteúdo hemorrágico/'chocolate' multiloculadas com grumos - achado clássico de endometrioma ovariano). Tratamento: hormonioterapia supressora + cirurgia em casos selecionados (multidisciplinar)."
  },
  {
    n: 301,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Endocrinologia Ginecológica",
    subtemas: ["Hiperprolactinemia", "Antidepressivos"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 29a, irregularidade menstrual há 2 anos, AMENORREIA há 5m com beta-hCG-. Menarca 12 anos. Antecedente: FIBROMIALGIA tratada com AMITRIPTILINA há 3 anos. Etiologia mais provável?",
    alternativas: {
      A: "Síndrome dos ovários policísticos.",
      B: "Hiperplasia adrenal congênita de manifestação tardia.",
      C: "Hiperprolactinemia.",
      D: "Adenomiose."
    },
    gabarito: "C",
    explicacao: "HIPERPROLACTINEMIA INDUZIDA POR MEDICAMENTOS: causa importante de amenorreia secundária. ANTIDEPRESSIVOS TRICÍCLICOS (AMITRIPTILINA), antipsicóticos (haloperidol, risperidona, metoclopramida), opióides aumentam prolactina por BLOQUEIO da inibição dopaminérgica hipotalâmica (dopamina é o inibidor fisiológico da prolactina). MECANISMO: prolactina elevada → inibe pulsatilidade de GnRH → reduz FSH/LH → ANOVULAÇÃO/AMENORREIA. Em mulher previamente regular que iniciou amitriptilina há 3 anos e agora apresenta irregularidade/amenorreia, é o diagnóstico mais provável. SOP (A): geralmente desde a adolescência. HAC tardia (B): hirsutismo + irregularidade desde puberdade. Adenomiose (D): cursa com HEMORRAGIA, não amenorreia."
  },
  {
    n: 302,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Corioamnionite", "Sepse materna"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 29a, G3P2C0, 33+4 sem, contrações + redução BCF há 4h. T 39, FC 117, taquicardia fetal 166. Toque: 4 cm, bolsa íntegra, cefálico, dinâmica 3/30''. Urina I normal. Leuco 22.570 (20% bastões). Coletadas culturas. Além de ATB amplo espectro + suporte:",
    alternativas: {
      A: "Assistir trabalho de parto vaginal.",
      B: "Inibir TP por 48h até maturação fetal.",
      C: "Aguardar cultura para definir via.",
      D: "Realizar neuroproteção fetal."
    },
    gabarito: "A",
    explicacao: "CORIOAMNIONITE (Tríade de Gibbs - febre materna ≥38°C + ≥2 dos seguintes: taquicardia materna >100, taquicardia fetal >160, hipersensibilidade uterina, líquido fétido, leucocitose >15.000): este caso preenche. CONDUTA: NÃO INIBIR TP/PARTO - a interrupção da gestação é PARTE DO TRATAMENTO (a infecção é intra-amniótica). INDUZIR/CONDUZIR PARTO + ATB amplo espectro EV. Via preferida: VAGINAL (cesárea só por indicação obstétrica). CONTRAINDICA: 1) Tocólise (B) - manter feto em ambiente infectado = piora; 2) Aguardar (C) - retarda tratamento; 3) Neuroproteção com sulfato de Mg (D) - útil em parto pré-termo IMINENTE (<32 sem) sem infecção - aqui é 33+4 sem com infecção (sulfato não é prioridade)."
  },
  {
    n: 303,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Obstetrícia",
    subtemas: ["Gestação gemelar", "Síndrome transfusor-transfundido"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Primigesta 34 sem, SEM pré-natal, SANGRAMENTO VAGINAL intenso. AU 39cm (acima do esperado), colo fechado. Cesárea de urgência. FOTO INTRAPARTO mostra gestação gemelar com diferentes tamanhos. A condição está associada à gestação:",
    alternativas: {
      A: "Gemelar monocoriônica diamniótica.",
      B: "Pré-termo com polidrâmnio e prolapso de cordão.",
      C: "Gemelar monocoriônica monoamniótica.",
      D: "Pré-termo complicada por rotura de vasa prévia."
    },
    gabarito: "A",
    explicacao: "GESTAÇÃO GEMELAR com DESPROPORÇÃO ENTRE GÊMEOS + AU AUMENTADA (39 cm em 34 sem - sugere polidrâmnio) + sangramento + cesárea: cenário sugestivo de SÍNDROME DA TRANSFUSÃO FETO-FETAL (STFF). A STFF ocorre EXCLUSIVAMENTE em gestações MONOCORIÔNICAS (placenta única) - presença de anastomoses vasculares interfetais permite transfusão desbalanceada entre gêmeos. Pode ser MONOCORIÔNICA DIAMNIÓTICA (MCDA, mais comum) ou MONOCORIÔNICA MONOAMNIÓTICA (MCMA, mais rara, ~1%). Classicamente: 1 GÊMEO DOADOR (pequeno, anêmico, oligoidrâmnio) + 1 GÊMEO RECEPTOR (grande, polidrâmnio, sobrecarga). Diagnóstico antenatal ideal. Sem pré-natal: complicações podem se manifestar como esta cesárea de urgência. Sem mais informação sobre amnionicidade na foto, MCDA é o mais provável (mais comum)."
  },
  {
    n: 304,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "Ginecologia e Obstetrícia",
    tema: "Climatério",
    subtemas: ["Terapia de reposição hormonal", "Via transdérmica"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 52a, ondas de calor, insônia, queda libido há 1 ano. DUM há 14 meses. Antecedente: pais hipertensos/diabéticos. TSH 3,5, CT 158, HDL 45, TG 310 (ELEVADO), gli 85. Conduta?",
    alternativas: {
      A: "Estradiol 1mg/dia + progestágeno orais.",
      B: "Estradiol 2mg/dia oral.",
      C: "Estradiol 0,05mg/dia TRANSDÉRMICO + progestágeno oral.",
      D: "Estradiol 1mg/dia transdérmico."
    },
    gabarito: "C",
    explicacao: "TRH NA MENOPAUSA: PRIMEIRA REGRA = mulher com ÚTERO INTACTO requer ESTROGÊNIO + PROGESTÁGENO (progesterona protege endométrio de hiperplasia/CA). PRINCÍPIO 2: paciente com FATOR DE RISCO METABÓLICO (TG 310 elevado, hipertrigliceridemia) deve evitar estrogênio ORAL (passa pelo fígado, primeira passagem aumenta TG, fatores de coagulação, RCP). VIA TRANSDÉRMICA é PREFERÍVEL em: hipertrigliceridemia, risco trombótico, hepatopatia, HAS, tabagismo. ESQUEMA: Estradiol transdérmico (0,025-0,05 mg/dia gel/adesivo) + progestágeno oral (geralmente progesterona micronizada 100mg ou medroxiprogesterona). Estradiol 1mg/dia transdérmico (D): dose elevada para via transdérmica (geralmente em mcg). Resposta C: combinação correta + via segura."
  },
  {
    n: 305,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Metanálise", "Forest plot"],
    dificuldade: "Difícil",
    temImagem: true,
    enunciado: "Metanálise com 6 estudos sobre exposição X e doença Y. Forest plot mostra OR de cada estudo e combinação. A alternativa CORRETA:",
    alternativas: {
      A: "Resultado descarta associação devido ao OR pequeno.",
      B: "Estudo 1 é o de maior peso nos resultados.",
      C: "MAIORIA dos estudos NÃO apresenta associação significativa individualmente.",
      D: "Estimador global tem MAIOR variabilidade que os estudos isolados."
    },
    gabarito: "C",
    explicacao: "INTERPRETAÇÃO DE FOREST PLOT em METANÁLISE: 1) Cada linha = 1 estudo; 2) PONTO/QUADRADO = estimativa pontual (OR/RR), TAMANHO PROPORCIONAL ao PESO no resultado (quanto maior, maior peso); 3) LINHAS HORIZONTAIS = IC 95%; 4) Linha vertical = valor nulo (OR=1); 5) Se o IC CRUZA a linha do 1 = NÃO significativo (estatisticamente). DIAMANTE/LOSANGO no final = estimativa COMBINADA. A força da metanálise é COMBINAR estudos individualmente não-significativos para detectar associações reais com maior poder estatístico. Característica comum: muitos ESTUDOS INDIVIDUAIS NÃO SIGNIFICATIVOS (ICs cruzam 1) mas a COMBINAÇÃO atinge significância (ganho de poder). Por isso C é tipicamente CORRETA neste tipo de questão. A combinação tem MENOR variabilidade que cada estudo (IC mais estreito) - alternativa D INVERTIDA."
  },
  {
    n: 306,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Epidemiologia",
    subtemas: ["Ensaios clínicos", "Fases I-IV"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Sobre ensaios clínicos para uma NOVA VACINA, é correto:",
    alternativas: {
      A: "Fase III avalia segurança e doses mais eficazes.",
      B: "Segurança de curto prazo é avaliada na fase II.",
      C: "Fase I necessita aleatorização para eficácia inicial.",
      D: "A fase IV permite liberação para comercialização."
    },
    gabarito: "B",
    explicacao: "FASES DOS ENSAIOS CLÍNICOS DE VACINAS: FASE I: poucos voluntários SAUDÁVEIS (10-100), avalia SEGURANÇA + farmacocinética + dosagem inicial (escalonamento). NÃO necessita aleatorização. FASE II: dezenas a centenas (~100-500) de voluntários, avalia SEGURANÇA DE CURTO PRAZO (efeitos adversos) + IMUNOGENICIDADE + DETERMINAÇÃO DA DOSE ÓTIMA. FASE III: milhares (1000-50000+), avalia EFICÁCIA em larga escala + segurança expandida, RANDOMIZADO/DUPLO-CEGO/PLACEBO-CONTROLADO. Resultado positivo permite REGISTRO/COMERCIALIZAÇÃO (não a fase IV!). FASE IV: PÓS-COMERCIALIZAÇÃO, vigilância de segurança de longo prazo, eventos raros, populações especiais. Alternativa A confunde fases; C: fase I não tem foco em eficácia; D: comercialização ocorre APÓS fase III, não fase IV."
  },
  {
    n: 307,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Indicadores de saúde",
    subtemas: ["Mortalidade", "Letalidade", "Cálculos"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Cidade 1.000.000 hab. Doença X: 1.000 casos, 50 mortes/ano. Total mortes = 150. Calcule: COEFICIENTE DE MORTALIDADE POR DOENÇA X /100 mil, MORTALIDADE PROPORCIONAL e LETALIDADE (%), respectivamente:",
    alternativas: {
      A: "5; 33; 5.",
      B: "5; 15; 33,3.",
      C: "150; 15; 0,05.",
      D: "150; 33; 0,5."
    },
    gabarito: "A",
    explicacao: "CÁLCULOS EPIDEMIOLÓGICOS: 1) COEFICIENTE DE MORTALIDADE pela doença X (por 100 mil hab): (50 mortes / 1.000.000 hab) × 100.000 = 5 por 100.000 hab/ano. 2) MORTALIDADE PROPORCIONAL pela doença X: (mortes pela doença X / total de mortes) × 100 = (50/150) × 100 = 33,3% (proporção das mortes que se devem à doença). 3) LETALIDADE da doença X: (mortes pela doença / total de casos da doença) × 100 = (50/1000) × 100 = 5%. Resposta: 5 / 33 / 5. Diferenciar bem: MORTALIDADE = risco de morrer na POPULAÇÃO; LETALIDADE = risco de morrer entre os DOENTES; MORT. PROPORCIONAL = proporção das mortes."
  }
);

console.log("UNICAMP Bloco 3 (288-307) adicionado");

// ==================== UNICAMP 2021 - Bloco 4 (308-320) ====================
// MFC/Preventiva + Saúde do Trabalhador + Bioética (Q68-Q80 da prova)
QUESTOES.push(
  {
    n: 308,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Indicadores de saúde",
    subtemas: ["APVP", "Mortalidade precoce"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Município: mortalidade proporcional - DCV 30%, causas externas 11%. ANOS POTENCIAIS DE VIDA PERDIDOS (APVP): 11% por DCV, 30% por causas externas. Análise correta:",
    alternativas: {
      A: "Grande percentual de idosos expostos a causas externas.",
      B: "Há grande contingente de ÓBITOS PRECOCES.",
      C: "Causas externas e DCV são as principais causas de morte.",
      D: "Indicadores mostram risco de morrer."
    },
    gabarito: "B",
    explicacao: "ANOS POTENCIAIS DE VIDA PERDIDOS (APVP): mede o IMPACTO de mortes PREMATURAS (geralmente <70 anos). Calcula-se subtraindo a idade ao óbito de uma idade-limite (70-80 anos). Mortes em idade jovem 'gastam' MUITO mais APVP que mortes em idosos. INTERPRETAÇÃO DESTE MUNICÍPIO: DCV (cardiopatias/AVC) responde por 30% das mortes mas apenas 11% dos APVP = típico de morte em IDOSOS. Causas externas (violência, acidentes) respondem por apenas 11% das mortes MAS por 30% dos APVP = típico de morte em JOVENS (perdem mais anos). A discrepância entre mortalidade proporcional e APVP nas causas externas mostra que há GRANDE CONTINGENTE DE ÓBITOS PRECOCES (B é correta). Indicadores complementares: mortalidade proporcional reflete IMPORTÂNCIA RELATIVA; APVP reflete MORTALIDADE PRECOCE."
  },
  {
    n: 309,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Saúde Ambiental",
    subtemas: ["Exposição a petróleo", "Toxicidade"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Vazamento de óleo no Nordeste (2019). Pessoas expostas ao petróleo cru SEM proteção. Em LONGO prazo, pode provocar:",
    alternativas: {
      A: "Danos hepáticos e/ou renais.",
      B: "Dermatites de contato.",
      C: "Desmielinização do SNC.",
      D: "Pneumonite por hipersensibilidade."
    },
    gabarito: "A",
    explicacao: "EXPOSIÇÃO CRÔNICA A PETRÓLEO CRU: contém hidrocarbonetos policíclicos aromáticos (HPAs), benzeno, tolueno, xileno, metais pesados (Pb, Cd, V, Ni), compostos orgânicos voláteis. EFEITOS A LONGO PRAZO: 1) HEPATOTOXICIDADE (HPAs e solventes metabolizados pelo fígado); 2) NEFROTOXICIDADE (metais pesados); 3) CARCINOGÊNESE (benzeno = leucemias, mama, pele, pulmão - hepatotoxicidade); 4) Alterações hematológicas; 5) Distúrbios reprodutivos. DERMATITES (B): EFEITO AGUDO/SUBAGUDO, não a longo prazo. Desmielinização (C): mais associada a solventes específicos (tolueno crônico). Pneumonite por hipersensibilidade (D): mecanismo imunológico, não é o efeito principal. RESPOSTA: efeitos sistêmicos hepatorrenais são a complicação crônica MAIS PREOCUPANTE."
  },
  {
    n: 310,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Saúde do Trabalhador",
    subtemas: ["Leucemias ocupacionais", "Benzeno"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Lista de Doenças Relacionadas ao Trabalho (LDRT). As LEUCEMIAS (C91-C95) estão associadas a quais agentes?",
    alternativas: {
      A: "Radiações ionizantes, agrotóxicos clorados e óxido de etileno.",
      B: "Benzeno, radiação ultravioleta e agrotóxicos fosforados.",
      C: "Isocianatos orgânicos, aminas aromáticas e campos eletromagnéticos.",
      D: "Agentes antineoplásicos, acrilatos e aldeído fórmico."
    },
    gabarito: "A",
    explicacao: "LEUCEMIAS OCUPACIONAIS (LDRT, Portaria de Consolidação 5/2017, Anexo LXXX): agentes etiológicos reconhecidos: 1) RADIAÇÕES IONIZANTES (raios X, gama - aumentam LMA, LMC); 2) BENZENO (clássico - leucemia mieloide aguda, especialmente petroquímica, calçados); 3) AGROTÓXICOS CLORADOS (DDT, lindane); 4) ÓXIDO DE ETILENO (esterilização hospitalar); 5) Antineoplásicos (oncoprofissional); 6) Buchanan (formaldeído). RADIAÇÃO UV (B): câncer de pele, NÃO leucemia. ISOCIANATOS (C): asma ocupacional (não leucemia). ANTINEOPLÁSICOS (D): podem causar leucemia secundária mas geralmente em pacientes tratados, NÃO PROFISSIONAIS - exceto exposição ocupacional. RESPOSTA A: radiações + clorados + óxido de etileno - corretos. NOTA: o benzeno é o MAIS CLÁSSICO, sua ausência na A é estranha - típico ponto polêmico (alguns autores apontariam B), mas considerando que LDRT lista também os outros, A é a alternativa que abrange os agentes corretos da lista oficial."
  },
  {
    n: 311,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Saúde do Trabalhador",
    subtemas: ["Intoxicação ocupacional", "SINAN"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 26a, tonturas, cefaleia, cansaço, náuseas há 2 sem - piora ao final do dia. Pesquisada ocupação. Notificou no SINAN. Provável ocupação + notificação:",
    alternativas: {
      A: "Manicure; intoxicação por solventes.",
      B: "Montadora de celulares; intoxicação por fumos metálicos.",
      C: "Fábrica de colchões; intoxicação por isocianatos.",
      D: "Trabalhadora rural; intoxicação por agrotóxicos."
    },
    gabarito: "A",
    explicacao: "QUADRO INESPECÍFICO de TONTURAS + CEFALEIA + FADIGA + NÁUSEAS que PIORA AO FINAL DO DIA = padrão típico de exposição a SOLVENTES ORGÂNICOS VOLÁTEIS (acetatos, tolueno, acetona, formaldeído, etc) em AMBIENTE PEQUENO MAL VENTILADO. MANICURES: ambiente fechado, uso constante de acetona, removedor, esmalte, alongamento (acrilatos), produtos químicos - EXPOSIÇÃO CRÔNICA conhecida. Os sintomas pioram com a jornada cumulativa. Outras ocupações citadas: fumos metálicos (solda) - tem espectro diferente (febre dos fumos); isocianatos (colchões/poliuretano) - causam asma ocupacional; agrotóxicos rurais - quadro mais grave (síndrome colinérgica aguda)/crônico. Notificação compulsória no SINAN para intoxicação exógena ocupacional."
  },
  {
    n: 312,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Gestão em Saúde",
    subtemas: ["Equipe de Referência", "Apoio Matricial"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Ambulatório DCNT com 3 médicas, 3 enfermeiras, 1 nutricionista, 1 psicóloga, 2.700 cadastrados. Fila enorme com nutri (5m) e psico (6m). Pacientes não lembram nomes dos profissionais. Para fortalecer VÍNCULO + diminuir FILA + facilitar monitoramento:",
    alternativas: {
      A: "Projeto Terapêutico Singular.",
      B: "Reuniões periódicas com trabalhadores.",
      C: "Equipe de Referência e Apoio Matricial.",
      D: "Grupos de apoio com pacientes e familiares."
    },
    gabarito: "C",
    explicacao: "EQUIPE DE REFERÊNCIA E APOIO MATRICIAL (Campos, 2007 - Política Nacional de Humanização): estratégia organizacional para reordenar o trabalho em saúde. EQUIPE DE REFERÊNCIA = grupo de profissionais (ex: 1 médica + 1 enfermeira) responsável por uma população adscrita - cria VÍNCULO LONGITUDINAL e RESPONSABILIZAÇÃO (resolve problema dos pacientes não conhecerem profissionais). APOIO MATRICIAL = profissionais especializados (nutricionista, psicólogo) que ATENDEM em conjunto e DISCUTEM CASOS com a equipe de referência (em vez de criar filas paralelas) = COMPARTILHAMENTO DE CASO + EDUCAÇÃO PERMANENTE. Resolve o problema das filas (nutricionista atende em conjunto, discute casos), monitora resultados clínicos com discussão. PTS (A): construído NA equipe de referência, não a substitui. Reuniões (B) e grupos (D): partes da estratégia mas não a estrutura."
  },
  {
    n: 313,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Bioética/Telemedicina",
    subtemas: ["Portaria 467/2020", "Princípios éticos"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Portaria 467/2020 dispõe sobre TELEMEDICINA durante pandemia. É correto:",
    alternativas: {
      A: "Ações incluem atendimento pré-clínico, suporte, consulta, monitoramento e diagnóstico no SUS.",
      B: "Receitas e atestados à distância válidos em meio eletrônico com assinatura eletrônica COMUM.",
      C: "Médicos devem atender aos preceitos éticos de BENEFICÊNCIA, NÃO-MALEFICÊNCIA, SIGILO E AUTONOMIA.",
      D: "Devido à gravação por TI, dispensa-se registro em prontuário."
    },
    gabarito: "C",
    explicacao: "PORTARIA 467/2020 - TELEMEDICINA na pandemia COVID-19: regulamentação emergencial. C É CORRETA: 'os profissionais devem observar os princípios éticos da prática médica (BENEFICÊNCIA, NÃO-MALEFICÊNCIA, SIGILO, AUTONOMIA)'. Princípios bioéticos de Beauchamp & Childress = autonomia + beneficência + não-maleficência + JUSTIÇA. A (errada): a portaria abrange SAÚDE SUPLEMENTAR também, não só SUS. B (errada): exige ASSINATURA ELETRÔNICA QUALIFICADA/AVANÇADA (certificado digital), não 'comum'. D (errada): REGISTRO EM PRONTUÁRIO É OBRIGATÓRIO INDEPENDENTEMENTE da modalidade (tele ou presencial) - princípio elementar."
  },
  {
    n: 314,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Bioética",
    subtemas: ["Diretivas antecipadas de vontade", "Resolução CFM 1995/2012"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Resolução CFM 1995/2012 - DIRETIVAS ANTECIPADAS DE VONTADE (DAV). É correto:",
    alternativas: {
      A: "DAV serão consideradas em paciente CAPAZ de expressar vontade.",
      B: "Caso paciente designe um REPRESENTANTE, suas informações serão consideradas pelo médico.",
      C: "Como na doação de órgãos, DAV requerem anuência dos familiares.",
      D: "DAV têm efeito legal apenas se registradas em cartório."
    },
    gabarito: "B",
    explicacao: "RESOLUÇÃO CFM 1995/2012 - DIRETIVAS ANTECIPADAS DE VONTADE: são manifestações prévias do paciente sobre cuidados/tratamentos que QUER OU NÃO RECEBER quando estiver INCAPACITADO de expressar livre e autonomamente sua vontade. PRINCÍPIOS: 1) Aplicam-se quando o paciente está INCAPAZ (não capaz como diz A); 2) Podem ser feitas via TESTAMENTO VITAL ou designação de PROCURADOR/REPRESENTANTE legal - a opinião do REPRESENTANTE será considerada (B CORRETA); 3) NÃO precisam de cartório (D errada) - basta registro no prontuário; 4) PREVALECEM sobre opinião familiar - NÃO requerem anuência dos familiares (C errada). DAV têm força ética/normativa importante na medicina contemporânea, autonomia do paciente. Conflitos: médico não é obrigado a cumprir DAV se contrariar Código de Ética (ex: eutanásia)."
  },
  {
    n: 315,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "SUS/Financiamento",
    subtemas: ["Emenda Constitucional 95", "Teto de gastos"],
    dificuldade: "Difícil",
    temImagem: false,
    enunciado: "Fev/2020 CNS: 'Saúde perdeu R$ 20 bilhões em 2019'. As perdas no orçamento do SUS devem-se a:",
    alternativas: {
      A: "Subsídio do estado aos serviços privados de saúde.",
      B: "Não-ressarcimento ao SUS pelo atendimento de pessoas com planos.",
      C: "Compra de planos privados para funcionários públicos.",
      D: "Efeitos da EMENDA CONSTITUCIONAL 95."
    },
    gabarito: "D",
    explicacao: "EMENDA CONSTITUCIONAL 95/2016 (\"Teto de Gastos\"/\"Novo Regime Fiscal\"): instituiu CONGELAMENTO DOS GASTOS PRIMÁRIOS da União por 20 ANOS (até 2036), corrigidos apenas pela INFLAÇÃO (IPCA do ano anterior). EFEITO NO SUS: para a saúde, mudou a regra constitucional anterior (Mín. 15% da Receita Corrente Líquida) - agora é o piso fixo de 2016 corrigido só por inflação. Como a economia/receita CRESCE acima da inflação em momentos de crescimento, e a demanda em saúde também cresce (envelhecimento, tecnologias), houve DESCASAMENTO entre orçamento real e necessidade. EFEITO ESTIMADO: redução de cerca de R$ 20 bi/ano em recursos potenciais para o SUS. Esta foi a CAUSA DA PERDA conforme análises do CNS, CONASS, IPEA. Outras opções existem como problemas mas NÃO explicam as 'perdas' apontadas em 2019."
  },
  {
    n: 316,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Determinantes Sociais",
    subtemas: ["Iniquidade em saúde", "Políticas públicas"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Estudo britânico 2012: campanhas massivas de saúde reduziram comportamentos de risco principalmente entre os de MAIOR nível socioeconômico/educacional. Conclusão correta:",
    alternativas: {
      A: "Grupo pobre não adere por falta de informação.",
      B: "SUS não recomenda divulgar determinantes sociais.",
      C: "Enfrentamento da iniquidade depende de POLÍTICAS PÚBLICAS SOCIAIS amplas.",
      D: "Quanto menor a desigualdade, piores as condições de saúde."
    },
    gabarito: "C",
    explicacao: "DETERMINANTES SOCIAIS DA SAÚDE (DSS - modelo Dahlgren-Whitehead, CSDH/OMS 2008): a SAÚDE é determinada por fatores SOCIAIS, ECONÔMICOS, AMBIENTAIS e POLÍTICOS, além do biológico/comportamental. CAMPANHAS DE INFORMAÇÃO sozinhas: BENEFICIAM MAIS quem JÁ TEM melhores condições socioeconômicas (acesso a alimentos saudáveis, tempo, lazer, educação) - AMPLIAM iniquidade. POBRES NÃO ADEREM porque NÃO TÊM CONDIÇÕES DE ADERIR (não por falta de informação como erro do A): falta acesso a comida boa, tempo para atividade física, ambientes seguros, etc. ENFRENTAMENTO DA INIQUIDADE em SAÚDE requer POLÍTICAS PÚBLICAS INTERSETORIAIS (renda, educação, saneamento, moradia, alimentação, segurança) - resposta C. Quanto MAIOR a desigualdade, PIORES as condições (D inverte)."
  },
  {
    n: 317,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Saúde Mental/APS",
    subtemas: ["Sofrimento Mental Específico", "Diabetes"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Pacientes com DM têm procurado UBS por ansiedade, tristeza, medo - SOFRIMENTO MENTAL ESPECÍFICO DA DIABETES (SMED). Cabe à eSF:",
    alternativas: {
      A: "RASTREAR SMED na população com DM da equipe.",
      B: "Realizar abordagem individualizada sobre angústias da doença/tratamento.",
      C: "SMED principalmente em idosos do sexo masculino com DM.",
      D: "Iniciar antidepressivos para jovens com DM."
    },
    gabarito: "B",
    explicacao: "SOFRIMENTO MENTAL ESPECÍFICO DA DIABETES (SMED, ou Diabetes Distress): condição reconhecida desde os anos 1990 (Diabetes Distress Scale - DDS). É DISTINTO de depressão maior - é o sofrimento ESPECÍFICO de conviver com DM (autocuidado, medicações, dieta, complicações, custos). Afeta 20-40% dos pacientes. ABORDAGEM NA APS: na PRÁTICA da MFC, a abordagem deve ser INDIVIDUALIZADA, com ACOLHIMENTO e ESCUTA QUALIFICADA das angústias específicas relacionadas à DOENÇA E TRATAMENTO (B CORRETA). Rastreamento POPULACIONAL universal (A) tem evidência limitada. Não há preponderância em homens/idosos (C ERRADA). Antidepressivo NÃO É 1ª LINHA (D ERRADA) - SMED não é depressão. Tratar com: educação em diabetes, suporte psicológico, abordagem motivacional, eventualmente psicoterapia."
  },
  {
    n: 318,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "ESF/Projeto Terapêutico",
    subtemas: ["PTS", "Vulnerabilidade social"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Reunião eSF: ACS relata mulher 25a, 4 filhos, desempregada, uso de drogas, filho 6m que não vai à UBS desde 1m. Conduta?",
    alternativas: {
      A: "Agendar consulta com NASF.",
      B: "Agendar consulta com Psicóloga.",
      C: "Transferir para CAPS.",
      D: "Elaborar PROJETO TERAPÊUTICO SINGULAR."
    },
    gabarito: "D",
    explicacao: "PROJETO TERAPÊUTICO SINGULAR (PTS) - PNH 2003: estratégia para abordagem de CASOS COMPLEXOS, com múltiplas vulnerabilidades, em que o cuidado padronizado é insuficiente. ESTE CASO: família vulnerável com determinantes sociais múltiplos - mãe desempregada + uso de drogas + criança em risco (vínculo perdido com UBS, suspeita de negligência) + 4 filhos. ETAPAS DO PTS: 1) Diagnóstico ampliado (clínico, psicossocial, riscos, potencialidades); 2) Definição de OBJETIVOS NEGOCIADOS com a família; 3) Definição de RESPONSABILIDADES; 4) Reavaliação periódica. Envolve EQUIPE MULTIDISCIPLINAR (médico, enfermeiro, ACS, NASF, CAPS, CRAS, conselho tutelar se necessário). Encaminhamento isolado (A,B,C) NÃO resolve - fragmenta o cuidado. PTS PERMITE integração das ações."
  },
  {
    n: 319,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Bioética",
    subtemas: ["Sigilo médico", "Comunicação parceiros"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Homem, 45a, com sífilis pede que médico solicite exame da PARCEIRA (mesma eSF) SEM QUE ELA SAIBA do exame dele. Conduta sobre solicitação de exame para parceira:",
    alternativas: {
      A: "Pactuar com paciente que ELE conte o resultado e depois solicitar exame.",
      B: "Atender ao pedido e solicitar exame.",
      C: "Solicitar exame e contar sobre o exame do marido se positivo.",
      D: "Não investigar a parceira e tratar o marido."
    },
    gabarito: "A",
    explicacao: "DILEMA ÉTICO - SIGILO MÉDICO vs PROTEÇÃO DE TERCEIROS: o sigilo médico é dever inviolável (CFM, Cód Ética Médica), exceto em situações que envolvem RISCO GRAVE A TERCEIROS (justa causa). Em ISTs: a parceira tem RISCO REAL de infecção e MERECE proteção. A ABORDAGEM ÉTICA PADRÃO é o ACONSELHAMENTO POR ETAPAS: 1) PACTUAR com o paciente diagnosticado para que ELE PRÓPRIO comunique a parceira (preserva autonomia, vínculo, sigilo) - PRIMEIRA TENTATIVA SEMPRE; 2) Se recusar e há risco mantido, oferecer SUPORTE para comunicação conjunta; 3) Como ÚLTIMA INSTÂNCIA: o médico pode quebrar o sigilo para proteger a parceira em risco iminente (justa causa). Atender ao pedido sem isso (B) preserva sigilo mas mantém risco. Solicitar e contar (C) é antiético. Não investigar (D) é negligência. RESPOSTA: A - pactuar primeiro."
  },
  {
    n: 320,
    banca: "UNICAMP 2021 — Acesso Direto",
    especialidade: "MFC/Preventiva",
    tema: "Clínica Ampliada",
    subtemas: ["Experiência da doença", "Singularidade"],
    dificuldade: "Médio",
    temImagem: false,
    enunciado: "Mulher, 29a, quer mamografia (mãe com CA mama há 8 anos, recidiva recente). eSF busca conhecer HISTÓRIA DE VIDA e EXPERIÊNCIA com CA mama na família. Razão? A clínica ampliada/compartilhada:",
    alternativas: {
      A: "Se ocupa da EXPERIÊNCIA com a doença, não da doença em si.",
      B: "Experiência prévia é determinante para o CA na paciente.",
      C: "Não é suficiente para cuidar de CA mama.",
      D: "Baseia-se na CLÍNICA DO SUJEITO."
    },
    gabarito: "D",
    explicacao: "CLÍNICA AMPLIADA (Gastão Wagner, PNH): superação da clínica DEGRADADA (foco só na doença) ou da clínica TRADICIONAL biomédica. A CLÍNICA AMPLIADA / DO SUJEITO considera: 1) PESSOA INTEGRAL (não só doença); 2) SUJEITO ÚNICO com história, contexto, valores, projetos; 3) FAMÍLIA e território; 4) EQUIPE multiprofissional; 5) CORRESPONSABILIZAÇÃO. Conhecer a HISTÓRIA da paciente e a EXPERIÊNCIA com CA familiar permite COMPREENDER MEDOS, ANSIEDADES, expectativas, fatores de risco, e PLANEJAR O CUIDADO INDIVIDUALIZADO. A alternativa A está parcialmente correta (a clínica ampliada se ocupa SIM da experiência, mas TAMBÉM da doença - não substitui). A alternativa D é a MAIS PRECISA - clínica do SUJEITO (não só da doença). B confunde experiência subjetiva com determinante etiológico do câncer."
  }
);

console.log("UNICAMP Bloco 4 (308-320) adicionado. Total: 320 questões");
