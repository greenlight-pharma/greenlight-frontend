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
