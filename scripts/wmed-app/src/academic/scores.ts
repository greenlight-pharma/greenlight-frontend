// -----------------------------------------------------------------------------
// Biblioteca de Scores Clínicos — DADOS (não lógica).
// Cada score é um objeto: critérios + como somar. Um único componente
// (CalculadoraScore) renderiza e calcula QUALQUER score daqui.
// Para adicionar um novo score: acrescente um objeto neste array. Nada mais.
//
// Regra pedagógica: a plataforma NÃO decide nada pelo aluno. Ela só apresenta
// os critérios e soma o que o aluno marcar/selecionar. Não é cola.
// -----------------------------------------------------------------------------

// Um item pode ser:
//  - "opcoes": o aluno escolhe UMA alternativa (ex.: abertura ocular do Glasgow)
//  - "checkbox": o aluno marca se o critério está presente (soma o valor)
//  - "numero": entrada numérica que entra numa fórmula (casos especiais)
export interface CriterioOpcao {
  rotulo: string;
  valor: number;
}
export interface Criterio {
  id: string;
  pergunta: string;
  tipo: "opcoes" | "checkbox";
  // para "opcoes": lista de alternativas; para "checkbox": valor quando marcado
  opcoes?: CriterioOpcao[];
  valor?: number; // usado quando tipo = checkbox
}

export interface FaixaResultado {
  min: number; // pontuação mínima (inclusive)
  max: number; // pontuação máxima (inclusive)
  texto: string; // interpretação da faixa
  cor: "verde" | "amarelo" | "vermelho";
}

export interface Score {
  id: string;
  nome: string;
  sigla?: string;
  especialidade: string;
  descricao: string;
  criterios: Criterio[];
  faixas: FaixaResultado[];
  fonte?: string; // referência da diretriz/publicação original
  observacao?: string; // nota de uso, quando útil
}

export const ESPECIALIDADES_SCORE = [
  "Emergência",
  "Cardiologia",
  "Pneumologia",
  "Clínica Médica",
  "Neurologia",
  "Gastroenterologia",
  "Cirurgia",
  "Infectologia",
  "Oncologia",
] as const;

export const SCORES: Score[] = [
  // ---------------------------------------------------------------- Glasgow
  {
    id: "glasgow",
    nome: "Escala de Coma de Glasgow",
    sigla: "ECG",
    especialidade: "Neurologia",
    descricao:
      "Avaliação do nível de consciência a partir da melhor resposta ocular, verbal e motora.",
    fonte: "Teasdale & Jennett, 1974",
    criterios: [
      {
        id: "ocular",
        pergunta: "Abertura ocular",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Espontânea", valor: 4 },
          { rotulo: "Ao estímulo verbal", valor: 3 },
          { rotulo: "À dor", valor: 2 },
          { rotulo: "Ausente", valor: 1 },
        ],
      },
      {
        id: "verbal",
        pergunta: "Melhor resposta verbal",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Orientado", valor: 5 },
          { rotulo: "Confuso", valor: 4 },
          { rotulo: "Palavras inapropriadas", valor: 3 },
          { rotulo: "Sons incompreensíveis", valor: 2 },
          { rotulo: "Ausente", valor: 1 },
        ],
      },
      {
        id: "motora",
        pergunta: "Melhor resposta motora",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Obedece a comandos", valor: 6 },
          { rotulo: "Localiza a dor", valor: 5 },
          { rotulo: "Retirada à dor", valor: 4 },
          { rotulo: "Flexão anormal (decorticação)", valor: 3 },
          { rotulo: "Extensão anormal (descerebração)", valor: 2 },
          { rotulo: "Ausente", valor: 1 },
        ],
      },
    ],
    faixas: [
      { min: 13, max: 15, texto: "Traumatismo leve", cor: "verde" },
      { min: 9, max: 12, texto: "Traumatismo moderado", cor: "amarelo" },
      { min: 3, max: 8, texto: "Traumatismo grave — considerar via aérea", cor: "vermelho" },
    ],
    observacao:
      "Pontuação de 3 (mínima) a 15 (máxima). Registre também a reatividade pupilar quando aplicável.",
  },

  // ------------------------------------------------------------------ Wells TEP
  {
    id: "wells-tep",
    nome: "Escore de Wells para TEP",
    sigla: "Wells",
    especialidade: "Pneumologia",
    descricao:
      "Probabilidade clínica pré-teste de tromboembolismo pulmonar. Marque os critérios presentes.",
    fonte: "Wells et al., 2000",
    criterios: [
      { id: "tvp", pergunta: "Sinais clínicos de TVP", tipo: "checkbox", valor: 3 },
      { id: "dx", pergunta: "TEP é o diagnóstico mais provável", tipo: "checkbox", valor: 3 },
      { id: "fc", pergunta: "Frequência cardíaca > 100 bpm", tipo: "checkbox", valor: 1.5 },
      { id: "imob", pergunta: "Imobilização ou cirurgia nas últimas 4 semanas", tipo: "checkbox", valor: 1.5 },
      { id: "previo", pergunta: "TVP/TEP prévio", tipo: "checkbox", valor: 1.5 },
      { id: "hemop", pergunta: "Hemoptise", tipo: "checkbox", valor: 1 },
      { id: "malig", pergunta: "Malignidade (tratamento em 6 meses ou paliativo)", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 1, texto: "Baixa probabilidade", cor: "verde" },
      { min: 2, max: 6, texto: "Probabilidade moderada", cor: "amarelo" },
      { min: 7, max: 99, texto: "Alta probabilidade", cor: "vermelho" },
    ],
    observacao:
      "Modelo de três níveis. Há também a versão dicotômica (≤4 improvável / >4 provável).",
  },

  // ------------------------------------------------------------------- OESIL
  {
    id: "oesil",
    nome: "Escore de risco OESIL",
    sigla: "OESIL",
    especialidade: "Emergência",
    descricao:
      "Estratificação de risco na síncope: quatro critérios, um ponto cada, para orientar quem precisa de investigação hospitalar.",
    fonte: "Colivicchi et al., European Heart Journal, 2003",
    criterios: [
      { id: "idade", pergunta: "Idade > 65 anos", tipo: "checkbox", valor: 1 },
      { id: "cardio", pergunta: "História de doença cardiovascular", tipo: "checkbox", valor: 1 },
      { id: "prodromo", pergunta: "Síncope sem pródromo", tipo: "checkbox", valor: 1 },
      { id: "ecg", pergunta: "Eletrocardiograma alterado", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 1, texto: "Risco baixo", cor: "verde" },
      { min: 2, max: 2, texto: "Risco intermediário", cor: "amarelo" },
      { min: 3, max: 4, texto: "Risco alto", cor: "vermelho" },
    ],
    observacao:
      "A mortalidade em 1 ano sobe de forma acentuada a partir de 2 pontos. O escore avalia RISCO, não causa: ele não diz por que a pessoa desmaiou, e síncope de baixo risco ainda pede investigação ambulatorial. Não se aplica a perda de consciência de causa não sincopal.",
  },

  // ------------------------------------------------------------ CHA2DS2-VASc
  {
    id: "cha2ds2vasc",
    nome: "CHA₂DS₂-VASc",
    especialidade: "Cardiologia",
    descricao:
      "Risco de fenômenos tromboembólicos na fibrilação atrial não valvar.",
    fonte: "Lip et al., 2010",
    criterios: [
      { id: "icc", pergunta: "Insuficiência cardíaca / disfunção de VE", tipo: "checkbox", valor: 1 },
      { id: "has", pergunta: "Hipertensão arterial", tipo: "checkbox", valor: 1 },
      {
        id: "idade",
        pergunta: "Idade",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 65 anos", valor: 0 },
          { rotulo: "65–74 anos", valor: 1 },
          { rotulo: "≥ 75 anos", valor: 2 },
        ],
      },
      { id: "dm", pergunta: "Diabetes mellitus", tipo: "checkbox", valor: 1 },
      { id: "avc", pergunta: "AVC / AIT / tromboembolismo prévio", tipo: "checkbox", valor: 2 },
      { id: "vasc", pergunta: "Doença vascular (IAM, DAP, placa aórtica)", tipo: "checkbox", valor: 1 },
      { id: "sexo", pergunta: "Sexo feminino", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 0, texto: "Risco baixo — anticoagulação geralmente não indicada", cor: "verde" },
      { min: 1, max: 1, texto: "Risco intermediário — considerar anticoagulação", cor: "amarelo" },
      { min: 2, max: 99, texto: "Risco elevado — anticoagulação geralmente indicada", cor: "vermelho" },
    ],
    observacao: "A interpretação de sexo feminino como fator considera o contexto dos demais critérios.",
  },

  // -------------------------------------------------------------------- CURB-65
  {
    id: "curb65",
    nome: "CURB-65",
    especialidade: "Pneumologia",
    descricao:
      "Gravidade da pneumonia adquirida na comunidade e apoio à decisão de internação.",
    fonte: "Lim et al., 2003",
    criterios: [
      { id: "confusao", pergunta: "Confusão mental (novo desorientação)", tipo: "checkbox", valor: 1 },
      { id: "ureia", pergunta: "Ureia > 50 mg/dL (ou > 7 mmol/L)", tipo: "checkbox", valor: 1 },
      { id: "fr", pergunta: "Frequência respiratória ≥ 30 irpm", tipo: "checkbox", valor: 1 },
      { id: "pa", pergunta: "PA sistólica < 90 ou diastólica ≤ 60 mmHg", tipo: "checkbox", valor: 1 },
      { id: "idade", pergunta: "Idade ≥ 65 anos", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 1, texto: "Baixo risco — considerar tratamento ambulatorial", cor: "verde" },
      { min: 2, max: 2, texto: "Risco intermediário — considerar internação", cor: "amarelo" },
      { min: 3, max: 5, texto: "Alto risco — internação; avaliar UTI se ≥ 4", cor: "vermelho" },
    ],
  },

  // --------------------------------------------------------------------- qSOFA
  {
    id: "qsofa",
    nome: "quick SOFA",
    sigla: "qSOFA",
    especialidade: "Emergência",
    descricao:
      "Identificação rápida de risco em pacientes com suspeita de infecção fora da UTI.",
    fonte: "Sepsis-3, 2016",
    criterios: [
      { id: "fr", pergunta: "Frequência respiratória ≥ 22 irpm", tipo: "checkbox", valor: 1 },
      { id: "consc", pergunta: "Alteração do nível de consciência (Glasgow < 15)", tipo: "checkbox", valor: 1 },
      { id: "pas", pergunta: "PA sistólica ≤ 100 mmHg", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 1, texto: "Baixo risco pelo qSOFA", cor: "verde" },
      { min: 2, max: 3, texto: "Risco aumentado — investigar disfunção orgânica / sepse", cor: "vermelho" },
    ],
    observacao: "qSOFA ≥ 2 sugere pior prognóstico; não substitui a avaliação completa de sepse.",
  },

  // ---------------------------------------------------------------- HEART Score
  {
    id: "heart",
    nome: "HEART Score",
    especialidade: "Cardiologia",
    descricao:
      "Risco de eventos cardíacos maiores em dor torácica no pronto-socorro.",
    fonte: "Six et al., 2008",
    criterios: [
      {
        id: "historia",
        pergunta: "História (anamnese)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Pouco suspeita", valor: 0 },
          { rotulo: "Moderadamente suspeita", valor: 1 },
          { rotulo: "Altamente suspeita", valor: 2 },
        ],
      },
      {
        id: "ecg",
        pergunta: "ECG",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal", valor: 0 },
          { rotulo: "Alteração inespecífica de repolarização", valor: 1 },
          { rotulo: "Infra de ST significativo", valor: 2 },
        ],
      },
      {
        id: "idade",
        pergunta: "Idade",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 45 anos", valor: 0 },
          { rotulo: "45–64 anos", valor: 1 },
          { rotulo: "≥ 65 anos", valor: 2 },
        ],
      },
      {
        id: "fatores",
        pergunta: "Fatores de risco (HAS, DM, tabagismo, dislipidemia, história familiar, obesidade)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Nenhum", valor: 0 },
          { rotulo: "1 a 2 fatores", valor: 1 },
          { rotulo: "≥ 3 fatores ou doença ateroesclerótica", valor: 2 },
        ],
      },
      {
        id: "troponina",
        pergunta: "Troponina",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "≤ limite normal", valor: 0 },
          { rotulo: "1 a 3× o limite", valor: 1 },
          { rotulo: "> 3× o limite", valor: 2 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 3, texto: "Baixo risco (0–3) — considerar alta com seguimento", cor: "verde" },
      { min: 4, max: 6, texto: "Risco moderado (4–6) — observação e investigação", cor: "amarelo" },
      { min: 7, max: 10, texto: "Alto risco (7–10) — conduta invasiva precoce", cor: "vermelho" },
    ],
  },

  // ------------------------------------------------------------------ Child-Pugh
  {
    id: "child-pugh",
    nome: "Classificação de Child-Pugh",
    especialidade: "Gastroenterologia",
    descricao:
      "Gravidade da doença hepática crônica / cirrose e estimativa prognóstica.",
    fonte: "Pugh et al., 1973",
    criterios: [
      {
        id: "bilirrubina",
        pergunta: "Bilirrubina total",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 2 mg/dL", valor: 1 },
          { rotulo: "2–3 mg/dL", valor: 2 },
          { rotulo: "> 3 mg/dL", valor: 3 },
        ],
      },
      {
        id: "albumina",
        pergunta: "Albumina",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "> 3,5 g/dL", valor: 1 },
          { rotulo: "2,8–3,5 g/dL", valor: 2 },
          { rotulo: "< 2,8 g/dL", valor: 3 },
        ],
      },
      {
        id: "inr",
        pergunta: "INR",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 1,7", valor: 1 },
          { rotulo: "1,7–2,3", valor: 2 },
          { rotulo: "> 2,3", valor: 3 },
        ],
      },
      {
        id: "ascite",
        pergunta: "Ascite",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Ausente", valor: 1 },
          { rotulo: "Leve (controlada com diurético)", valor: 2 },
          { rotulo: "Moderada a grave", valor: 3 },
        ],
      },
      {
        id: "encefalopatia",
        pergunta: "Encefalopatia hepática",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Ausente", valor: 1 },
          { rotulo: "Grau I–II", valor: 2 },
          { rotulo: "Grau III–IV", valor: 3 },
        ],
      },
    ],
    faixas: [
      { min: 5, max: 6, texto: "Child A — doença bem compensada", cor: "verde" },
      { min: 7, max: 9, texto: "Child B — comprometimento funcional significativo", cor: "amarelo" },
      { min: 10, max: 15, texto: "Child C — doença descompensada", cor: "vermelho" },
    ],
  },

  // ----------------------------------------------------------------- TIMI (IAMSSST)
  {
    id: "timi-nstemi",
    nome: "TIMI Risk Score (SCA sem supra)",
    sigla: "TIMI",
    especialidade: "Cardiologia",
    descricao:
      "Risco de eventos em 14 dias na angina instável / IAM sem supra de ST.",
    fonte: "Antman et al., 2000",
    criterios: [
      { id: "idade", pergunta: "Idade ≥ 65 anos", tipo: "checkbox", valor: 1 },
      { id: "fatores", pergunta: "≥ 3 fatores de risco para DAC", tipo: "checkbox", valor: 1 },
      { id: "dac", pergunta: "DAC conhecida (estenose ≥ 50%)", tipo: "checkbox", valor: 1 },
      { id: "aas", pergunta: "Uso de AAS nos últimos 7 dias", tipo: "checkbox", valor: 1 },
      { id: "angina", pergunta: "≥ 2 episódios de angina em 24h", tipo: "checkbox", valor: 1 },
      { id: "st", pergunta: "Desvio de segmento ST ≥ 0,5 mm", tipo: "checkbox", valor: 1 },
      { id: "marcador", pergunta: "Marcador de necrose miocárdica elevado", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 2, texto: "Baixo risco", cor: "verde" },
      { min: 3, max: 4, texto: "Risco intermediário", cor: "amarelo" },
      { min: 5, max: 7, texto: "Alto risco", cor: "vermelho" },
    ],
  },

  // -------------------------------------------------------------------- Apgar
  {
    id: "apgar",
    nome: "Índice de Apgar",
    especialidade: "Pediatria",
    descricao:
      "Avaliação da vitalidade do recém-nascido no 1º e no 5º minuto de vida.",
    fonte: "Apgar, 1953",
    criterios: [
      {
        id: "fc",
        pergunta: "Frequência cardíaca",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Ausente", valor: 0 },
          { rotulo: "< 100 bpm", valor: 1 },
          { rotulo: "≥ 100 bpm", valor: 2 },
        ],
      },
      {
        id: "resp",
        pergunta: "Esforço respiratório",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Ausente", valor: 0 },
          { rotulo: "Fraco / irregular", valor: 1 },
          { rotulo: "Choro forte", valor: 2 },
        ],
      },
      {
        id: "tonus",
        pergunta: "Tônus muscular",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Flácido", valor: 0 },
          { rotulo: "Alguma flexão", valor: 1 },
          { rotulo: "Movimento ativo", valor: 2 },
        ],
      },
      {
        id: "irrit",
        pergunta: "Irritabilidade reflexa",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem resposta", valor: 0 },
          { rotulo: "Careta", valor: 1 },
          { rotulo: "Choro / tosse / espirro", valor: 2 },
        ],
      },
      {
        id: "cor",
        pergunta: "Cor",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Cianótico / pálido", valor: 0 },
          { rotulo: "Cianose de extremidades", valor: 1 },
          { rotulo: "Rosado", valor: 2 },
        ],
      },
    ],
    faixas: [
      { min: 7, max: 10, texto: "Boa vitalidade", cor: "verde" },
      { min: 4, max: 6, texto: "Dificuldade moderada — atenção", cor: "amarelo" },
      { min: 0, max: 3, texto: "Grave — reanimação", cor: "vermelho" },
    ],
    observacao: "Aplicar no 1º e 5º minuto; se < 7 no 5º min, repetir a cada 5 min.",
  },

  // ------------------------------------------------------------------- Alvarado
  {
    id: "alvarado",
    nome: "Escore de Alvarado",
    especialidade: "Cirurgia",
    descricao: "Probabilidade de apendicite aguda. Marque os achados presentes.",
    fonte: "Alvarado, 1986",
    criterios: [
      { id: "migracao", pergunta: "Dor migratória para FID", tipo: "checkbox", valor: 1 },
      { id: "anorexia", pergunta: "Anorexia", tipo: "checkbox", valor: 1 },
      { id: "nausea", pergunta: "Náusea / vômitos", tipo: "checkbox", valor: 1 },
      { id: "dorfid", pergunta: "Dor à palpação em FID", tipo: "checkbox", valor: 2 },
      { id: "descompressao", pergunta: "Dor à descompressão (Blumberg)", tipo: "checkbox", valor: 1 },
      { id: "febre", pergunta: "Temperatura ≥ 37,3 °C", tipo: "checkbox", valor: 1 },
      { id: "leucocitose", pergunta: "Leucocitose (> 10.000)", tipo: "checkbox", valor: 2 },
      { id: "desvio", pergunta: "Desvio à esquerda (neutrofilia)", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 4, texto: "Apendicite improvável", cor: "verde" },
      { min: 5, max: 6, texto: "Compatível — observar / imagem", cor: "amarelo" },
      { min: 7, max: 10, texto: "Provável — avaliação cirúrgica", cor: "vermelho" },
    ],
  },

  // ---------------------------------------------------------------------- MELD
  {
    id: "meld",
    nome: "MELD (conceito)",
    especialidade: "Gastroenterologia",
    descricao:
      "Gravidade da doença hepática terminal. Faixas dos componentes — o valor oficial usa fórmula laboratorial.",
    fonte: "Kamath et al., 2001",
    criterios: [
      {
        id: "bilirrubina",
        pergunta: "Bilirrubina total",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 2 mg/dL", valor: 0 },
          { rotulo: "2–4 mg/dL", valor: 2 },
          { rotulo: "> 4 mg/dL", valor: 4 },
        ],
      },
      {
        id: "inr",
        pergunta: "INR",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 1,7", valor: 0 },
          { rotulo: "1,7–2,3", valor: 2 },
          { rotulo: "> 2,3", valor: 4 },
        ],
      },
      {
        id: "creatinina",
        pergunta: "Creatinina",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 1,5 mg/dL", valor: 0 },
          { rotulo: "1,5–3 mg/dL", valor: 2 },
          { rotulo: "> 3 mg/dL ou diálise", valor: 4 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 2, texto: "Componentes pouco alterados", cor: "verde" },
      { min: 3, max: 7, texto: "Alteração moderada", cor: "amarelo" },
      { min: 8, max: 12, texto: "Alteração importante — calcular MELD oficial", cor: "vermelho" },
    ],
    observacao:
      "Versão simplificada para triagem didática. O MELD oficial usa fórmula logarítmica (bilirrubina, INR, creatinina, Na) — confirme no cálculo laboratorial.",
  },

  // ----------------------------------------------------------------------- PSI
  {
    id: "psi-conceito",
    nome: "PSI / PORT (conceito)",
    especialidade: "Pneumologia",
    descricao:
      "Estratificação de gravidade da pneumonia. Versão didática por blocos de risco.",
    fonte: "Fine et al., 1997",
    criterios: [
      {
        id: "idade",
        pergunta: "Faixa etária",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 50 anos", valor: 0 },
          { rotulo: "50–70 anos", valor: 2 },
          { rotulo: "> 70 anos", valor: 3 },
        ],
      },
      { id: "comorb", pergunta: "Comorbidade relevante (neoplasia, hepatopatia, ICC, DRC, AVC)", tipo: "checkbox", valor: 2 },
      { id: "exame", pergunta: "Alteração no exame físico (consciência, FR ≥ 30, PAS < 90, T° < 35 ou ≥ 40, FC ≥ 125)", tipo: "checkbox", valor: 2 },
      { id: "lab", pergunta: "Alteração laboratorial/radiológica (pH < 7,35, ureia alta, Na < 130, hipoxemia, derrame)", tipo: "checkbox", valor: 2 },
    ],
    faixas: [
      { min: 0, max: 1, texto: "Baixo risco — ambulatorial (classes I–II)", cor: "verde" },
      { min: 2, max: 4, texto: "Risco intermediário — considerar internação", cor: "amarelo" },
      { min: 5, max: 9, texto: "Alto risco — internação / UTI (classes IV–V)", cor: "vermelho" },
    ],
    observacao:
      "Versão conceitual para ensino. O PSI completo pontua ~20 variáveis; use calculadora validada para a classe exata.",
  },

  // --------------------------------------------------------------------- Bishop
  {
    id: "bishop",
    nome: "Índice de Bishop",
    especialidade: "Ginecologia e Obstetrícia",
    descricao:
      "Maturidade cervical e favorabilidade para indução do parto.",
    fonte: "Bishop, 1964",
    criterios: [
      {
        id: "dilatacao",
        pergunta: "Dilatação cervical",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Fechado", valor: 0 },
          { rotulo: "1–2 cm", valor: 1 },
          { rotulo: "3–4 cm", valor: 2 },
          { rotulo: "≥ 5 cm", valor: 3 },
        ],
      },
      {
        id: "esvaecimento",
        pergunta: "Esvaecimento",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "0–30%", valor: 0 },
          { rotulo: "40–50%", valor: 1 },
          { rotulo: "60–70%", valor: 2 },
          { rotulo: "≥ 80%", valor: 3 },
        ],
      },
      {
        id: "altura",
        pergunta: "Altura da apresentação (De Lee)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "-3", valor: 0 },
          { rotulo: "-2", valor: 1 },
          { rotulo: "-1 / 0", valor: 2 },
          { rotulo: "+1 / +2", valor: 3 },
        ],
      },
      {
        id: "consistencia",
        pergunta: "Consistência do colo",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Firme", valor: 0 },
          { rotulo: "Média", valor: 1 },
          { rotulo: "Amolecida", valor: 2 },
        ],
      },
      {
        id: "posicao",
        pergunta: "Posição do colo",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Posterior", valor: 0 },
          { rotulo: "Média", valor: 1 },
          { rotulo: "Anterior", valor: 2 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 5, texto: "Colo desfavorável — considerar preparo cervical", cor: "vermelho" },
      { min: 6, max: 7, texto: "Intermediário", cor: "amarelo" },
      { min: 8, max: 13, texto: "Colo favorável à indução", cor: "verde" },
    ],
  },

  // ---------------------------------------------------------------------- NIHSS
  {
    id: "nihss",
    nome: "NIHSS (itens principais)",
    sigla: "NIHSS",
    especialidade: "Neurologia",
    descricao:
      "Gravidade do AVC. Seleção dos itens de maior peso para estimativa didática.",
    fonte: "NIH Stroke Scale",
    criterios: [
      {
        id: "consciencia",
        pergunta: "Nível de consciência",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Alerta", valor: 0 },
          { rotulo: "Sonolento", valor: 1 },
          { rotulo: "Torporoso", valor: 2 },
          { rotulo: "Coma", valor: 3 },
        ],
      },
      {
        id: "motorbraco",
        pergunta: "Motricidade do braço (pior lado)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem queda", valor: 0 },
          { rotulo: "Queda parcial", valor: 1 },
          { rotulo: "Vence a gravidade por pouco", valor: 2 },
          { rotulo: "Sem movimento contra gravidade", valor: 3 },
          { rotulo: "Nenhum movimento", valor: 4 },
        ],
      },
      {
        id: "motorperna",
        pergunta: "Motricidade da perna (pior lado)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem queda", valor: 0 },
          { rotulo: "Queda parcial", valor: 1 },
          { rotulo: "Vence a gravidade por pouco", valor: 2 },
          { rotulo: "Sem movimento contra gravidade", valor: 3 },
          { rotulo: "Nenhum movimento", valor: 4 },
        ],
      },
      {
        id: "linguagem",
        pergunta: "Linguagem (afasia)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal", valor: 0 },
          { rotulo: "Afasia leve a moderada", valor: 1 },
          { rotulo: "Afasia grave", valor: 2 },
          { rotulo: "Mudo / afasia global", valor: 3 },
        ],
      },
      {
        id: "facial",
        pergunta: "Paralisia facial",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal", valor: 0 },
          { rotulo: "Menor (assimetria leve)", valor: 1 },
          { rotulo: "Parcial", valor: 2 },
          { rotulo: "Completa", valor: 3 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 4, texto: "AVC leve", cor: "verde" },
      { min: 5, max: 15, texto: "AVC moderado", cor: "amarelo" },
      { min: 16, max: 42, texto: "AVC moderado a grave / grave", cor: "vermelho" },
    ],
    observacao:
      "Subconjunto dos itens de maior peso para ensino. Para todos os itens, use a versão completa (NIHSS completo).",
  },

  // ------------------------------------------------------------- NIHSS completo
  {
    id: "nihss-completo",
    nome: "NIHSS completo",
    sigla: "NIHSS",
    especialidade: "Neurologia",
    descricao:
      "Escala completa de gravidade do AVC — 15 itens avaliados, 0 a 42 pontos. Selecione a graduação de cada item.",
    fonte: "NIH Stroke Scale (Brott et al., 1989)",
    criterios: [
      {
        id: "1a-consciencia",
        pergunta: "1a. Nível de consciência",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Alerta / responsivo", valor: 0 },
          { rotulo: "Sonolento — desperta a estímulo mínimo", valor: 1 },
          { rotulo: "Torporoso — requer estímulo repetido ou doloroso", valor: 2 },
          { rotulo: "Coma — respostas apenas reflexas ou ausentes", valor: 3 },
        ],
      },
      {
        id: "1b-perguntas",
        pergunta: "1b. Perguntas do NC (mês e idade)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Responde ambas corretamente", valor: 0 },
          { rotulo: "Responde uma corretamente", valor: 1 },
          { rotulo: "Nenhuma correta", valor: 2 },
        ],
      },
      {
        id: "1c-comandos",
        pergunta: "1c. Comandos do NC (abrir/fechar olhos e mão)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Executa ambos corretamente", valor: 0 },
          { rotulo: "Executa um corretamente", valor: 1 },
          { rotulo: "Nenhum executado", valor: 2 },
        ],
      },
      {
        id: "2-olhar",
        pergunta: "2. Melhor olhar (motricidade ocular horizontal)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal", valor: 0 },
          { rotulo: "Paralisia parcial do olhar", valor: 1 },
          { rotulo: "Desvio forçado / paralisia total do olhar", valor: 2 },
        ],
      },
      {
        id: "3-campos",
        pergunta: "3. Campos visuais",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem perda visual", valor: 0 },
          { rotulo: "Hemianopsia parcial", valor: 1 },
          { rotulo: "Hemianopsia completa", valor: 2 },
          { rotulo: "Hemianopsia bilateral / cegueira", valor: 3 },
        ],
      },
      {
        id: "4-facial",
        pergunta: "4. Paralisia facial",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal / simétrica", valor: 0 },
          { rotulo: "Menor — apagamento do sulco nasolabial", valor: 1 },
          { rotulo: "Parcial — paralisia da face inferior", valor: 2 },
          { rotulo: "Completa — uni ou bilateral", valor: 3 },
        ],
      },
      {
        id: "5a-braco-esq",
        pergunta: "5a. Motricidade do braço esquerdo",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem queda (mantém 10s)", valor: 0 },
          { rotulo: "Queda parcial antes de 10s", valor: 1 },
          { rotulo: "Algum esforço contra a gravidade, mas não sustenta", valor: 2 },
          { rotulo: "Sem esforço contra a gravidade (cai)", valor: 3 },
          { rotulo: "Nenhum movimento", valor: 4 },
        ],
      },
      {
        id: "5b-braco-dir",
        pergunta: "5b. Motricidade do braço direito",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem queda (mantém 10s)", valor: 0 },
          { rotulo: "Queda parcial antes de 10s", valor: 1 },
          { rotulo: "Algum esforço contra a gravidade, mas não sustenta", valor: 2 },
          { rotulo: "Sem esforço contra a gravidade (cai)", valor: 3 },
          { rotulo: "Nenhum movimento", valor: 4 },
        ],
      },
      {
        id: "6a-perna-esq",
        pergunta: "6a. Motricidade da perna esquerda",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem queda (mantém 5s)", valor: 0 },
          { rotulo: "Queda parcial antes de 5s", valor: 1 },
          { rotulo: "Algum esforço contra a gravidade, mas não sustenta", valor: 2 },
          { rotulo: "Sem esforço contra a gravidade (cai)", valor: 3 },
          { rotulo: "Nenhum movimento", valor: 4 },
        ],
      },
      {
        id: "6b-perna-dir",
        pergunta: "6b. Motricidade da perna direita",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem queda (mantém 5s)", valor: 0 },
          { rotulo: "Queda parcial antes de 5s", valor: 1 },
          { rotulo: "Algum esforço contra a gravidade, mas não sustenta", valor: 2 },
          { rotulo: "Sem esforço contra a gravidade (cai)", valor: 3 },
          { rotulo: "Nenhum movimento", valor: 4 },
        ],
      },
      {
        id: "7-ataxia",
        pergunta: "7. Ataxia de membros",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Ausente", valor: 0 },
          { rotulo: "Presente em um membro", valor: 1 },
          { rotulo: "Presente em dois membros", valor: 2 },
        ],
      },
      {
        id: "8-sensibilidade",
        pergunta: "8. Sensibilidade",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal", valor: 0 },
          { rotulo: "Perda leve a moderada", valor: 1 },
          { rotulo: "Perda grave a total", valor: 2 },
        ],
      },
      {
        id: "9-linguagem",
        pergunta: "9. Melhor linguagem (afasia)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Sem afasia — normal", valor: 0 },
          { rotulo: "Afasia leve a moderada", valor: 1 },
          { rotulo: "Afasia grave", valor: 2 },
          { rotulo: "Mudo / afasia global", valor: 3 },
        ],
      },
      {
        id: "10-disartria",
        pergunta: "10. Disartria",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Normal", valor: 0 },
          { rotulo: "Leve a moderada — fala arrastada mas compreensível", valor: 1 },
          { rotulo: "Grave / anártrico — fala ininteligível", valor: 2 },
        ],
      },
      {
        id: "11-extincao",
        pergunta: "11. Extinção / desatenção (negligência)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Ausente", valor: 0 },
          { rotulo: "Desatenção em uma modalidade sensorial", valor: 1 },
          { rotulo: "Negligência grave ou em mais de uma modalidade", valor: 2 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 4, texto: "Sem sinais / AVC leve", cor: "verde" },
      { min: 5, max: 15, texto: "AVC moderado", cor: "amarelo" },
      { min: 16, max: 20, texto: "AVC moderado a grave", cor: "vermelho" },
      { min: 21, max: 42, texto: "AVC grave", cor: "vermelho" },
    ],
    observacao:
      "15 itens avaliados (1a–1c, 2–11), 0 a 42 pontos. Itens não testáveis (ex.: amputação, intubação) são registrados como 'não avaliável' na escala oficial e não somam.",
  },

  // --------------------------------------------------------------------- Ranson
  {
    id: "ranson",
    nome: "Critérios de Ranson (admissão)",
    especialidade: "Cirurgia",
    descricao:
      "Gravidade da pancreatite aguda na admissão. Marque os critérios presentes.",
    fonte: "Ranson, 1974",
    criterios: [
      { id: "idade", pergunta: "Idade > 55 anos", tipo: "checkbox", valor: 1 },
      { id: "leuco", pergunta: "Leucócitos > 16.000/mm³", tipo: "checkbox", valor: 1 },
      { id: "glicemia", pergunta: "Glicemia > 200 mg/dL", tipo: "checkbox", valor: 1 },
      { id: "ldh", pergunta: "LDH > 350 UI/L", tipo: "checkbox", valor: 1 },
      { id: "ast", pergunta: "AST (TGO) > 250 UI/L", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 2, texto: "Mortalidade baixa", cor: "verde" },
      { min: 3, max: 3, texto: "Risco aumentado — atenção", cor: "amarelo" },
      { min: 4, max: 5, texto: "Pancreatite grave — mortalidade elevada", cor: "vermelho" },
    ],
    observacao:
      "Critérios de admissão (5). Há 6 critérios adicionais avaliados em 48h para o escore completo.",
  },

  // --------------------------------------------------------------------- NEWS 2
  {
    id: "news2",
    nome: "NEWS 2 (National Early Warning Score 2)",
    sigla: "NEWS 2",
    especialidade: "Emergência",
    descricao:
      "Detecção precoce de deterioração clínica a partir de parâmetros fisiológicos. Marque a faixa de cada parâmetro.",
    fonte: "Royal College of Physicians, 2017",
    criterios: [
      {
        id: "fr",
        pergunta: "Frequência respiratória (irpm)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "12–20 (normal)", valor: 0 },
          { rotulo: "9–11", valor: 1 },
          { rotulo: "21–24", valor: 2 },
          { rotulo: "≤ 8 ou ≥ 25", valor: 3 },
        ],
      },
      {
        id: "sato2",
        pergunta: "Saturação de O₂ (%)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "≥ 96", valor: 0 },
          { rotulo: "94–95", valor: 1 },
          { rotulo: "92–93", valor: 2 },
          { rotulo: "≤ 91", valor: 3 },
        ],
      },
      {
        id: "o2supl",
        pergunta: "Uso de oxigênio suplementar",
        tipo: "checkbox",
        valor: 2,
      },
      {
        id: "pas",
        pergunta: "PA sistólica (mmHg)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "111–219 (normal)", valor: 0 },
          { rotulo: "101–110", valor: 1 },
          { rotulo: "91–100", valor: 2 },
          { rotulo: "≤ 90 ou ≥ 220", valor: 3 },
        ],
      },
      {
        id: "fc",
        pergunta: "Frequência cardíaca (bpm)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "51–90 (normal)", valor: 0 },
          { rotulo: "41–50 ou 91–110", valor: 1 },
          { rotulo: "111–130", valor: 2 },
          { rotulo: "≤ 40 ou ≥ 131", valor: 3 },
        ],
      },
      {
        id: "consc",
        pergunta: "Nível de consciência alterado (novo) ou confusão",
        tipo: "checkbox",
        valor: 3,
      },
      {
        id: "temp",
        pergunta: "Temperatura (°C)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "36,1–38,0 (normal)", valor: 0 },
          { rotulo: "35,1–36,0 ou 38,1–39,0", valor: 1 },
          { rotulo: "≥ 39,1", valor: 2 },
          { rotulo: "≤ 35,0", valor: 3 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 4, texto: "Risco baixo — monitorização de rotina", cor: "verde" },
      { min: 5, max: 6, texto: "Risco médio — resposta clínica urgente", cor: "amarelo" },
      { min: 7, max: 20, texto: "Risco alto — resposta de emergência", cor: "vermelho" },
    ],
    observacao:
      "Qualquer parâmetro isolado pontuando 3 já indica revisão urgente, independente do total.",
  },

  // --------------------------------------------------------------------- SOFA
  {
    id: "sofa",
    nome: "SOFA (conceito)",
    sigla: "SOFA",
    especialidade: "Emergência",
    descricao:
      "Avaliação de disfunção orgânica em 6 sistemas (0–4 cada). Versão conceitual para treino — use a tabela oficial para valores laboratoriais precisos.",
    fonte: "Vincent et al., 1996",
    criterios: [
      {
        id: "resp",
        pergunta: "Respiratório (PaO₂/FiO₂)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "≥ 400", valor: 0 },
          { rotulo: "< 400", valor: 1 },
          { rotulo: "< 300", valor: 2 },
          { rotulo: "< 200 com suporte", valor: 3 },
          { rotulo: "< 100 com suporte", valor: 4 },
        ],
      },
      {
        id: "coag",
        pergunta: "Coagulação (plaquetas ×10³/µL)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "≥ 150", valor: 0 },
          { rotulo: "< 150", valor: 1 },
          { rotulo: "< 100", valor: 2 },
          { rotulo: "< 50", valor: 3 },
          { rotulo: "< 20", valor: 4 },
        ],
      },
      {
        id: "hepat",
        pergunta: "Hepático (bilirrubina mg/dL)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 1,2", valor: 0 },
          { rotulo: "1,2–1,9", valor: 1 },
          { rotulo: "2,0–5,9", valor: 2 },
          { rotulo: "6,0–11,9", valor: 3 },
          { rotulo: "≥ 12,0", valor: 4 },
        ],
      },
      {
        id: "cardio",
        pergunta: "Cardiovascular (hipotensão/vasopressor)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "PAM ≥ 70 mmHg", valor: 0 },
          { rotulo: "PAM < 70 mmHg", valor: 1 },
          { rotulo: "Dopa ≤ 5 ou dobutamina", valor: 2 },
          { rotulo: "Dopa > 5 ou nora ≤ 0,1", valor: 3 },
          { rotulo: "Dopa > 15 ou nora > 0,1", valor: 4 },
        ],
      },
      {
        id: "neuro",
        pergunta: "Neurológico (Glasgow)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "15", valor: 0 },
          { rotulo: "13–14", valor: 1 },
          { rotulo: "10–12", valor: 2 },
          { rotulo: "6–9", valor: 3 },
          { rotulo: "< 6", valor: 4 },
        ],
      },
      {
        id: "renal",
        pergunta: "Renal (creatinina mg/dL)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 1,2", valor: 0 },
          { rotulo: "1,2–1,9", valor: 1 },
          { rotulo: "2,0–3,4", valor: 2 },
          { rotulo: "3,5–4,9", valor: 3 },
          { rotulo: "≥ 5,0", valor: 4 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 6, texto: "Disfunção orgânica leve", cor: "verde" },
      { min: 7, max: 11, texto: "Disfunção moderada — mortalidade crescente", cor: "amarelo" },
      { min: 12, max: 24, texto: "Disfunção grave — mortalidade elevada", cor: "vermelho" },
    ],
    observacao:
      "Um aumento agudo de ≥ 2 pontos define disfunção orgânica na sepse (Sepsis-3).",
  },

  // --------------------------------------------------------------------- HAS-BLED
  {
    id: "has-bled",
    nome: "HAS-BLED (risco de sangramento)",
    sigla: "HAS-BLED",
    especialidade: "Cardiologia",
    descricao:
      "Risco de sangramento maior em pacientes anticoagulados por fibrilação atrial. Marque os presentes.",
    fonte: "Pisters et al., 2010",
    criterios: [
      { id: "has", pergunta: "Hipertensão (PAS > 160 mmHg)", tipo: "checkbox", valor: 1 },
      { id: "renal", pergunta: "Função renal anormal (diálise, transplante, Cr > 2,3)", tipo: "checkbox", valor: 1 },
      { id: "hepat", pergunta: "Função hepática anormal", tipo: "checkbox", valor: 1 },
      { id: "avc", pergunta: "AVC prévio", tipo: "checkbox", valor: 1 },
      { id: "sangr", pergunta: "Sangramento prévio ou predisposição", tipo: "checkbox", valor: 1 },
      { id: "inr", pergunta: "INR lábil (TTR < 60%)", tipo: "checkbox", valor: 1 },
      { id: "idade", pergunta: "Idade > 65 anos", tipo: "checkbox", valor: 1 },
      { id: "drogas", pergunta: "Fármacos (AAS/AINE) concomitantes", tipo: "checkbox", valor: 1 },
      { id: "alcool", pergunta: "Álcool (≥ 8 doses/semana)", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 2, texto: "Risco baixo de sangramento", cor: "verde" },
      { min: 3, max: 3, texto: "Risco alto — cautela e revisão regular", cor: "amarelo" },
      { min: 4, max: 9, texto: "Risco elevado — reavaliar anticoagulação", cor: "vermelho" },
    ],
    observacao:
      "Score alto não contraindica anticoagulação — indica necessidade de corrigir fatores reversíveis e monitorar.",
  },

  // --------------------------------------------------------------------- ABCD2
  {
    id: "abcd2",
    nome: "ABCD² (risco de AVC após AIT)",
    sigla: "ABCD²",
    especialidade: "Neurologia",
    descricao:
      "Risco de AVC nos dias seguintes a um ataque isquêmico transitório. Marque/selecione os itens.",
    fonte: "Johnston et al., 2007",
    criterios: [
      { id: "idade", pergunta: "Idade ≥ 60 anos", tipo: "checkbox", valor: 1 },
      { id: "pa", pergunta: "PA ≥ 140/90 mmHg", tipo: "checkbox", valor: 1 },
      {
        id: "clinica",
        pergunta: "Manifestação clínica",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Outros sintomas", valor: 0 },
          { rotulo: "Distúrbio de fala sem fraqueza", valor: 1 },
          { rotulo: "Fraqueza unilateral", valor: 2 },
        ],
      },
      {
        id: "duracao",
        pergunta: "Duração dos sintomas",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "< 10 min", valor: 0 },
          { rotulo: "10–59 min", valor: 1 },
          { rotulo: "≥ 60 min", valor: 2 },
        ],
      },
      { id: "dm", pergunta: "Diabetes mellitus", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 3, texto: "Risco baixo", cor: "verde" },
      { min: 4, max: 5, texto: "Risco moderado", cor: "amarelo" },
      { min: 6, max: 7, texto: "Risco alto — investigação/internação", cor: "vermelho" },
    ],
  },

  // --------------------------------------------------------------------- PERC
  {
    id: "perc",
    nome: "Regra PERC (exclusão de TEP)",
    sigla: "PERC",
    especialidade: "Emergência",
    descricao:
      "Em pacientes de BAIXA probabilidade, se TODOS os 8 itens forem negativos, TEP pode ser afastado sem D-dímero. Marque os presentes.",
    fonte: "Kline et al., 2004",
    criterios: [
      { id: "idade", pergunta: "Idade ≥ 50 anos", tipo: "checkbox", valor: 1 },
      { id: "fc", pergunta: "FC ≥ 100 bpm", tipo: "checkbox", valor: 1 },
      { id: "sato2", pergunta: "SatO₂ < 95% em ar ambiente", tipo: "checkbox", valor: 1 },
      { id: "edema", pergunta: "Edema unilateral de membro inferior", tipo: "checkbox", valor: 1 },
      { id: "hemop", pergunta: "Hemoptise", tipo: "checkbox", valor: 1 },
      { id: "cirurgia", pergunta: "Cirurgia/trauma recente (≤ 4 semanas)", tipo: "checkbox", valor: 1 },
      { id: "tev", pergunta: "TEV prévio (TVP/TEP)", tipo: "checkbox", valor: 1 },
      { id: "hormonio", pergunta: "Uso de hormônio (ACO/TRH)", tipo: "checkbox", valor: 1 },
    ],
    faixas: [
      { min: 0, max: 0, texto: "PERC negativo — TEP pode ser afastado (se baixa probabilidade)", cor: "verde" },
      { min: 1, max: 8, texto: "PERC positivo — não afasta; prosseguir investigação", cor: "amarelo" },
    ],
    observacao:
      "Só se aplica quando a probabilidade pré-teste já é baixa. Não use em probabilidade intermediária/alta.",
  },

  // --------------------------------------------------------------------- Centor
  {
    id: "centor",
    nome: "Centor Modificado (McIsaac)",
    sigla: "Centor",
    especialidade: "Clínica Médica",
    descricao:
      "Probabilidade de faringite estreptocócica (estrepto do grupo A). Marque/selecione os itens.",
    fonte: "McIsaac et al., 1998",
    criterios: [
      { id: "febre", pergunta: "Febre (> 38 °C) ou história de febre", tipo: "checkbox", valor: 1 },
      { id: "exsudato", pergunta: "Exsudato ou edema tonsilar", tipo: "checkbox", valor: 1 },
      { id: "linfonodo", pergunta: "Linfonodos cervicais anteriores dolorosos", tipo: "checkbox", valor: 1 },
      { id: "tosse", pergunta: "Ausência de tosse", tipo: "checkbox", valor: 1 },
      {
        id: "idade",
        pergunta: "Idade",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "3–14 anos", valor: 1 },
          { rotulo: "15–44 anos", valor: 0 },
          { rotulo: "≥ 45 anos", valor: -1 },
        ],
      },
    ],
    faixas: [
      { min: -1, max: 1, texto: "Baixa probabilidade — não testar/tratar", cor: "verde" },
      { min: 2, max: 3, texto: "Probabilidade intermediária — considerar teste", cor: "amarelo" },
      { min: 4, max: 5, texto: "Alta probabilidade — testar ± tratar", cor: "vermelho" },
    ],
  },

  // --------------------------------------------------------------------- NYHA
  {
    id: "nyha",
    nome: "Classificação Funcional NYHA",
    sigla: "NYHA",
    especialidade: "Cardiologia",
    descricao:
      "Classe funcional da insuficiência cardíaca conforme limitação aos esforços. Selecione a que descreve o paciente.",
    fonte: "New York Heart Association",
    criterios: [
      {
        id: "classe",
        pergunta: "Limitação da atividade física",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "I — sem limitação; atividade habitual não causa sintomas", valor: 1 },
          { rotulo: "II — leve limitação; sintomas aos esforços habituais", valor: 2 },
          { rotulo: "III — limitação acentuada; sintomas a esforços menores que os habituais", valor: 3 },
          { rotulo: "IV — sintomas em repouso ou a qualquer esforço", valor: 4 },
        ],
      },
    ],
    faixas: [
      { min: 1, max: 1, texto: "Classe I — sem limitação", cor: "verde" },
      { min: 2, max: 2, texto: "Classe II — limitação leve", cor: "amarelo" },
      { min: 3, max: 4, texto: "Classe III–IV — limitação importante", cor: "vermelho" },
    ],
    observacao: "Classificação funcional, não um somatório — reflete o estado atual do paciente.",
  },

  // --------------------------------------------------------------------- CCS
  {
    id: "ccs-angina",
    nome: "Classificação de Angina (CCS)",
    sigla: "CCS",
    especialidade: "Cardiologia",
    descricao:
      "Graduação da angina de peito pela Canadian Cardiovascular Society. Selecione a classe.",
    fonte: "Canadian Cardiovascular Society",
    criterios: [
      {
        id: "classe",
        pergunta: "Limitação pela angina",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "I — angina só a esforço intenso/prolongado", valor: 1 },
          { rotulo: "II — leve limitação; angina a esforço moderado", valor: 2 },
          { rotulo: "III — limitação acentuada; angina a esforço leve", valor: 3 },
          { rotulo: "IV — angina em repouso ou a mínimos esforços", valor: 4 },
        ],
      },
    ],
    faixas: [
      { min: 1, max: 1, texto: "Classe I", cor: "verde" },
      { min: 2, max: 2, texto: "Classe II", cor: "amarelo" },
      { min: 3, max: 4, texto: "Classe III–IV", cor: "vermelho" },
    ],
  },

  // --------------------------------------------------------------------- ECOG
  {
    id: "ecog",
    nome: "Performance Status ECOG",
    sigla: "ECOG",
    especialidade: "Oncologia",
    descricao:
      "Estado funcional do paciente oncológico. Selecione o grau que melhor descreve.",
    fonte: "Eastern Cooperative Oncology Group (Oken et al., 1982)",
    criterios: [
      {
        id: "grau",
        pergunta: "Capacidade funcional",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "0 — totalmente ativo, sem restrição", valor: 0 },
          { rotulo: "1 — restrição a atividades intensas; deambula e faz trabalho leve", valor: 1 },
          { rotulo: "2 — deambula, autocuidado, mas incapaz de trabalhar; < 50% do dia no leito", valor: 2 },
          { rotulo: "3 — autocuidado limitado; > 50% do dia no leito/cadeira", valor: 3 },
          { rotulo: "4 — totalmente incapaz; confinado ao leito", valor: 4 },
        ],
      },
    ],
    faixas: [
      { min: 0, max: 1, texto: "Bom estado funcional", cor: "verde" },
      { min: 2, max: 2, texto: "Estado funcional intermediário", cor: "amarelo" },
      { min: 3, max: 4, texto: "Estado funcional ruim", cor: "vermelho" },
    ],
  },

  // --------------------------------------------------------------------- Glasgow Pediátrica
  {
    id: "glasgow-ped",
    nome: "Escala de Coma de Glasgow Pediátrica",
    sigla: "ECG-Ped",
    especialidade: "Emergência",
    descricao:
      "Nível de consciência em crianças pré-verbais, com respostas adaptadas à idade.",
    fonte: "James & Trauner, adaptação pediátrica",
    criterios: [
      {
        id: "ocular",
        pergunta: "Abertura ocular",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Espontânea", valor: 4 },
          { rotulo: "Ao som/voz", valor: 3 },
          { rotulo: "À dor", valor: 2 },
          { rotulo: "Nenhuma", valor: 1 },
        ],
      },
      {
        id: "verbal",
        pergunta: "Resposta verbal (adaptada)",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Balbucia/interage (sorri, orienta ao som)", valor: 5 },
          { rotulo: "Choro irritável", valor: 4 },
          { rotulo: "Choro à dor", valor: 3 },
          { rotulo: "Gemido à dor", valor: 2 },
          { rotulo: "Nenhuma", valor: 1 },
        ],
      },
      {
        id: "motora",
        pergunta: "Resposta motora",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "Movimenta espontaneamente", valor: 6 },
          { rotulo: "Retira ao toque", valor: 5 },
          { rotulo: "Retira à dor", valor: 4 },
          { rotulo: "Flexão anormal (decorticação)", valor: 3 },
          { rotulo: "Extensão anormal (descerebração)", valor: 2 },
          { rotulo: "Nenhuma", valor: 1 },
        ],
      },
    ],
    faixas: [
      { min: 13, max: 15, texto: "Alteração leve", cor: "verde" },
      { min: 9, max: 12, texto: "Alteração moderada", cor: "amarelo" },
      { min: 3, max: 8, texto: "Alteração grave — proteção de via aérea", cor: "vermelho" },
    ],
  },

  // --------------------------------------------------------------------- Hinchey
  {
    id: "hinchey",
    nome: "Classificação de Hinchey",
    sigla: "Hinchey",
    especialidade: "Cirurgia",
    descricao:
      "Estadiamento da diverticulite aguda complicada pelo achado de imagem (TC) ou cirúrgico. Selecione o estágio observado.",
    fonte: "Hinchey, Schaal & Richards, 1978",
    criterios: [
      {
        id: "estadio",
        pergunta: "Achado na TC ou no intraoperatório",
        tipo: "opcoes",
        opcoes: [
          { rotulo: "I — Abscesso pericólico ou fleimão", valor: 1 },
          { rotulo: "II — Abscesso pélvico, intra-abdominal ou retroperitoneal (a distância)", valor: 2 },
          { rotulo: "III — Peritonite purulenta generalizada", valor: 3 },
          { rotulo: "IV — Peritonite fecal generalizada", valor: 4 },
        ],
      },
    ],
    faixas: [
      {
        min: 1,
        max: 1,
        texto:
          "Hinchey I — abscesso/fleimão pericólico. Costuma permitir manejo conservador (antibiótico); abscesso pode demandar drenagem.",
        cor: "amarelo",
      },
      {
        min: 2,
        max: 2,
        texto:
          "Hinchey II — abscesso a distância. Antibiótico + drenagem percutânea guiada quando acessível.",
        cor: "amarelo",
      },
      {
        min: 3,
        max: 3,
        texto:
          "Hinchey III — peritonite purulenta generalizada. Habitualmente indicação cirúrgica.",
        cor: "vermelho",
      },
      {
        min: 4,
        max: 4,
        texto:
          "Hinchey IV — peritonite fecal generalizada. Emergência cirúrgica (ressecção; frequentemente Hartmann).",
        cor: "vermelho",
      },
    ],
    observacao:
      "É um estadiamento (não pontuação somada). Serve de referência do estágio — a conduta é decisão médica individualizada.",
  },
];
