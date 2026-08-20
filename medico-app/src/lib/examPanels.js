// [EXAMS] Dados de referência do módulo de exames, portados VERBATIM do
// medico.html (linhas 6977–7317). São listas curadas — não editar sem
// conferir com quem montou.
//
// EXAM_PANELS agrupa exames por painel clínico. Fica no frontend de
// propósito: é determinístico (mesmo exame sempre no mesmo painel), não
// infla o prompt da IA e é fácil de ajustar quando aparece exame novo.
//
// EXAM_DESCRIPTIONS descreve O QUE o exame MEDE — sem dizer o que significa
// estar alterado. Sem interpretação clínica, sem causa, sem implicação
// diagnóstica: isso é do médico.

export const EXAM_STATUS_STYLE = {
  normal:         { label: "Dentro da referência", bg: "#dcfce7", color: "#166534", icon: "✓" },
  alterado:       { label: "Fora da referência",   bg: "#fee2e2", color: "#991b1b", icon: "⚠" },
  sem_referencia: { label: "Sem referência",       bg: "#f3f4f6", color: "#6b7280", icon: "—" },
};


export const EXAM_PANELS = [
  {
    key: "hemograma",
    label: "Hemograma",
    match: [
      "hemoglobina", "hematocrito", "hemacia", "eritrocito",
      "leucocito", "neutrofil", "linfocit", "monocit", "eosinofil",
      "basofil", "bastonete", "segmentado", "mielocit", "metamielocit",
      "plaqueta", "vcm", "hcm", "chcm", "rdw", "volume globular",
      "hemoglobina globular", "indice de anisocitose",
    ],
  },
  {
    key: "glicemia",
    label: "Glicemia e Diabetes",
    match: [
      "glicose", "glicemia", "hemoglobina glicada", "hba1c", "a1c",
      "frutosamina", "insulina", "peptideo c", "curva glicemica",
    ],
  },
  {
    key: "lipidograma",
    label: "Lipidograma",
    match: [
      "colesterol", "hdl", "ldl", "vldl", "triglicerid", "lipoprotein",
      "apolipoprotein", "lp(a)", "nao-hdl",
    ],
  },
  {
    key: "funcao_renal",
    label: "Função Renal",
    match: [
      "ureia", "creatinina", "acido urico", "urato", "clearance",
      "tfg", "filtracao glomerular", "cistatina", "microalbumin",
      "relacao albumina", "albumina urinaria",
    ],
  },
  {
    key: "funcao_hepatica",
    label: "Função Hepática",
    match: [
      "tgo", "tgp", "ast", "alt", "ggt", "gama gt", "gama-gt",
      "fosfatase alcalina", "bilirrubina", "albumina",
      "proteinas totais", "globulina", "ldh", "amonia",
    ],
  },
  {
    key: "tireoide",
    label: "Tireoide",
    match: [
      "tsh", "t3", "t4", "tiroglobulin", "anti-tpo", "anti tpo",
      "anti-tireoglobulin", "tiroide", "tireoide",
    ],
  },
  {
    key: "urina",
    label: "Urina",
    match: [
      "urina tipo", "eas", "elementos anormais", "sumario de urina",
      "densidade urinaria", "ph urinario", "proteinuria",
      "hematuria", "leucocituria", "nitrito", "cilindro",
      "urinocultura", "urocultura",
    ],
  },
  {
    key: "vitaminas",
    label: "Vitaminas e Minerais",
    match: [
      "vitamina", "b12", "cobalamina", "acido folico", "folato",
      "hidroxivitamina", "25-oh", "ferro serico", "ferritina",
      "transferrina", "saturacao de transferrina", "tibc",
      "calcio", "fosforo", "magnesio", "zinco", "sodio", "potassio",
      "cloro", "bicarbonato",
    ],
  },
  {
    key: "hormonios",
    label: "Hormônios",
    match: [
      "testosterona", "estradiol", "estrogeno", "progesterona",
      "fsh", "lh", "prolactina", "cortisol", "dhea",
      "androstenediona", "hcg", "beta hcg", "pth", "paratormonio",
    ],
  },
  {
    key: "inflamacao",
    label: "Marcadores Inflamatórios",
    match: [
      "vhs", "velocidade de hemossedimentacao", "pcr", "proteina c reativa",
      "ferritina", "procalcitonina",
    ],
  },
  {
    key: "coagulacao",
    label: "Coagulação",
    match: [
      "tap", "tempo de protrombina", "inr", "rni", "ttpa",
      "tempo de tromboplastina", "fibrinogenio", "d-dimero",
      "antitrombina",
    ],
  },
  {
    key: "sorologia",
    label: "Sorologias",
    match: [
      "hiv", "hbsag", "anti-hbs", "anti-hbc", "anti-hcv", "hcv",
      "sifilis", "vdrl", "fta-abs", "toxoplasmose", "rubeola",
      "citomegalovirus", "cmv", "epstein-barr", "ebv", "dengue",
      "covid", "sars-cov", "h pylori", "helicobacter",
    ],
  },
  {
    key: "marcadores_tumorais",
    label: "Marcadores Tumorais",
    match: [
      "psa", "cea", "ca 125", "ca 15-3", "ca 19-9", "afp", "alfa-fetoproteina",
      "beta hcg",
    ],
  },
];

// Normaliza string pra match (lower + sem acentos)
// Normalização VERBATIM do original: minúsculas e sem acento, e SÓ isso.
// Não acrescentar remoção de pontuação — as listas de match acima foram
// escritas contra este comportamento ("ca 15-3", "h pylori").
export function normalizeForPanel(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export const EXAM_DESCRIPTIONS = [
  // ========== HEMOGRAMA ==========
  { match: "hemacia",                    text: "Glóbulos vermelhos. Células sanguíneas responsáveis pelo transporte de oxigênio." },
  { match: "hemoglobina globular",       text: "Quantidade média de hemoglobina por glóbulo vermelho (HCM)." },
  { match: "concentracao hemoglobina",   text: "Concentração média de hemoglobina dentro dos glóbulos vermelhos (CHCM)." },
  { match: "hemoglobina glicada",        text: "Fração da hemoglobina que tem glicose ligada. Reflete média da glicemia dos últimos ~3 meses." },
  { match: "hba1c",                      text: "Fração da hemoglobina que tem glicose ligada. Reflete média da glicemia dos últimos ~3 meses." },
  { match: "hemoglobina",                text: "Proteína dos glóbulos vermelhos responsável pelo transporte de oxigênio dos pulmões para os tecidos." },
  { match: "hematocrito",                text: "Porcentagem do volume sanguíneo ocupado por glóbulos vermelhos." },
  { match: "volume globular",            text: "Volume médio dos glóbulos vermelhos (VCM)." },
  { match: "indice de anisocitose",      text: "Variação no tamanho dos glóbulos vermelhos (RDW)." },
  { match: "leucocitos totais",          text: "Contagem total de glóbulos brancos no sangue." },
  { match: "leucocitos (urina)",         text: "Contagem de glóbulos brancos no sedimento urinário." },
  { match: "hemacias (urina)",           text: "Contagem de glóbulos vermelhos no sedimento urinário." },
  { match: "neutrofil",                  text: "Tipo de glóbulo branco, parte da resposta imune inata." },
  { match: "segmentado",                 text: "Neutrófilos maduros. Tipo de glóbulo branco da imunidade inata." },
  { match: "bastonete",                  text: "Neutrófilos jovens. Glóbulos brancos recém-liberados da medula óssea." },
  { match: "linfocit",                   text: "Tipo de glóbulo branco, parte da resposta imune adaptativa." },
  { match: "monocit",                    text: "Tipo de glóbulo branco, precursores dos macrófagos teciduais." },
  { match: "eosinofil",                  text: "Tipo de glóbulo branco envolvido em respostas alérgicas e parasitárias." },
  { match: "basofil",                    text: "Tipo de glóbulo branco, menos numeroso, envolvido em reações de hipersensibilidade." },
  { match: "mielocit",                   text: "Precursores imaturos de neutrófilos, normalmente confinados à medula óssea." },
  { match: "metamielocit",               text: "Precursores intermediários de neutrófilos." },
  { match: "plaqueta",                   text: "Fragmentos celulares envolvidos na coagulação sanguínea." },

  // ========== GLICEMIA / DIABETES ==========
  { match: "glicemia media estimada",    text: "Glicose média estimada a partir da hemoglobina glicada." },
  { match: "glicemia",                   text: "Concentração de glicose no sangue." },
  { match: "glicose",                    text: "Açúcar presente no sangue, principal fonte de energia das células." },
  { match: "frutosamina",                text: "Reflete a glicemia média das últimas 2-3 semanas." },
  { match: "insulina",                   text: "Hormônio produzido pelo pâncreas que regula a glicose sanguínea." },
  { match: "peptideo c",                 text: "Subproduto da produção endógena de insulina pelo pâncreas." },

  // ========== LIPIDOGRAMA ==========
  { match: "colesterol total",           text: "Soma de todas as frações de colesterol no sangue." },
  { match: "colesterol - hdl",           text: "Lipoproteína de alta densidade. Transporta colesterol dos tecidos para o fígado." },
  { match: "colesterol - ldl",           text: "Lipoproteína de baixa densidade. Transporta colesterol do fígado para os tecidos." },
  { match: "colesterol - vldl",          text: "Lipoproteína de muito baixa densidade. Carrega triglicerídeos do fígado." },
  { match: "hdl",                        text: "Lipoproteína de alta densidade. Transporta colesterol dos tecidos para o fígado." },
  { match: "ldl",                        text: "Lipoproteína de baixa densidade. Transporta colesterol do fígado para os tecidos." },
  { match: "vldl",                       text: "Lipoproteína de muito baixa densidade. Carrega triglicerídeos do fígado." },
  { match: "triglicerid",                text: "Forma de armazenamento de gordura no sangue e tecido adiposo." },
  { match: "apolipoprotein",             text: "Proteínas presentes na superfície das lipoproteínas (HDL, LDL, etc)." },

  // ========== FUNÇÃO RENAL ==========
  { match: "ureia",                      text: "Produto final do metabolismo de proteínas, eliminado pelos rins." },
  { match: "creatinina",                 text: "Produto do metabolismo muscular, filtrado pelos rins. Marcador de função renal." },
  { match: "acido urico",                text: "Produto final do metabolismo das purinas, eliminado pelos rins." },
  { match: "urato",                      text: "Forma ionizada do ácido úrico no sangue." },
  { match: "clearance",                  text: "Volume de plasma depurado por unidade de tempo. Mede a função renal." },
  { match: "tfg",                        text: "Taxa de filtração glomerular. Volume filtrado pelos rins por minuto." },
  { match: "filtracao glomerular",       text: "Volume filtrado pelos rins por minuto. Marcador de função renal." },
  { match: "cistatina",                  text: "Proteína produzida por todas as células nucleadas. Marcador de filtração glomerular." },
  { match: "microalbumin",               text: "Pequenas quantidades de albumina na urina." },
  { match: "albumina urinaria",          text: "Albumina detectada na urina." },

  // ========== FUNÇÃO HEPÁTICA ==========
  { match: "tgo",                        text: "Aspartato aminotransferase (AST). Enzima presente no fígado, coração e músculos." },
  { match: "ast/tgo",                    text: "Aspartato aminotransferase (AST/TGO). Enzima presente no fígado, coração e músculos." },
  { match: "ast",                        text: "Aspartato aminotransferase. Enzima presente no fígado, coração e músculos." },
  { match: "tgp",                        text: "Alanina aminotransferase (ALT). Enzima predominantemente hepática." },
  { match: "alt/tgp",                    text: "Alanina aminotransferase (ALT/TGP). Enzima predominantemente hepática." },
  { match: "alt",                        text: "Alanina aminotransferase. Enzima predominantemente hepática." },
  { match: "ggt",                        text: "Gama-glutamil transferase. Enzima do trato biliar e fígado." },
  { match: "gama gt",                    text: "Gama-glutamil transferase. Enzima do trato biliar e fígado." },
  { match: "gama-gt",                    text: "Gama-glutamil transferase. Enzima do trato biliar e fígado." },
  { match: "fosfatase alcalina",         text: "Enzima presente em fígado, ossos, intestino e placenta." },
  { match: "bilirrubina",                text: "Produto da degradação da hemoglobina, processada pelo fígado." },
  { match: "albumina",                   text: "Proteína mais abundante do plasma, sintetizada pelo fígado." },
  { match: "proteinas totais",           text: "Soma de todas as proteínas séricas (albumina + globulinas)." },
  { match: "globulina",                  text: "Grupo de proteínas séricas que inclui imunoglobulinas e proteínas de transporte." },
  { match: "ldh",                        text: "Lactato desidrogenase. Enzima presente em quase todos os tecidos do corpo." },

  // ========== TIREOIDE ==========
  { match: "tsh ultra",                  text: "Hormônio tireoestimulante (ultrassensível). Produzido pela hipófise, regula a tireoide." },
  { match: "tsh",                        text: "Hormônio tireoestimulante. Produzido pela hipófise, regula a função da tireoide." },
  { match: "t4 livre",                   text: "Tiroxina livre. Fração ativa do hormônio tireoidiano T4." },
  { match: "t4",                         text: "Tiroxina. Principal hormônio produzido pela tireoide." },
  { match: "t3 livre",                   text: "Triiodotironina livre. Fração ativa do hormônio T3." },
  { match: "t3",                         text: "Triiodotironina. Hormônio tireoidiano, forma mais ativa que o T4." },
  { match: "tiroglobulin",               text: "Proteína precursora dos hormônios tireoidianos, produzida pela tireoide." },
  { match: "anti-tpo",                   text: "Anticorpo contra peroxidase tireoidiana." },
  { match: "anti tpo",                   text: "Anticorpo contra peroxidase tireoidiana." },
  { match: "anti-tireoglobulin",         text: "Anticorpo contra tireoglobulina." },

  // ========== URINA ==========
  { match: "urina tipo",                 text: "Exame de urina tipo 1 (EAS). Análise física, química e microscópica da urina." },
  { match: "eas",                        text: "Elementos Anormais e Sedimento. Exame de rotina da urina." },
  { match: "elementos anormais",         text: "Análise química e microscópica da urina (EAS)." },
  { match: "densidade urinaria",         text: "Concentração relativa de solutos na urina." },
  { match: "ph urinario",                text: "Acidez ou alcalinidade da urina." },
  { match: "proteinuria",                text: "Presença de proteínas na urina." },
  { match: "hematuria",                  text: "Presença de sangue (hemácias) na urina." },
  { match: "leucocituria",               text: "Presença de glóbulos brancos na urina." },
  { match: "nitrito",                    text: "Composto produzido por algumas bactérias na urina." },
  { match: "cilindro",                   text: "Estruturas cilíndricas formadas nos túbulos renais, visíveis ao microscópio." },
  { match: "urinocultura",               text: "Cultura microbiológica da urina, identifica crescimento bacteriano." },
  { match: "urocultura",                 text: "Cultura microbiológica da urina, identifica crescimento bacteriano." },

  // ========== VITAMINAS / MINERAIS ==========
  { match: "25-hidroxivitamina d",       text: "Forma circulante da vitamina D. Principal marcador do status corporal de vitamina D." },
  { match: "25-oh",                      text: "25-hidroxivitamina D. Forma circulante da vitamina D." },
  { match: "hidroxivitamina",            text: "Forma circulante da vitamina D. Marcador do status corporal de vitamina D." },
  { match: "vitamina d",                 text: "Vitamina lipossolúvel envolvida no metabolismo do cálcio e função imune." },
  { match: "vitamina b12",               text: "Cobalamina. Vitamina essencial para síntese de DNA e função neurológica." },
  { match: "b12",                        text: "Cobalamina (vitamina B12). Essencial para síntese de DNA e função neurológica." },
  { match: "cobalamina",                 text: "Vitamina B12. Essencial para síntese de DNA e função neurológica." },
  { match: "acido folico",               text: "Vitamina B9. Essencial para síntese de DNA e divisão celular." },
  { match: "folato",                     text: "Forma natural da vitamina B9. Essencial para síntese de DNA e divisão celular." },
  { match: "ferritina",                  text: "Proteína de armazenamento de ferro no organismo." },
  { match: "ferro serico",               text: "Concentração de ferro circulante no sangue, ligado à transferrina." },
  { match: "transferrina",               text: "Principal proteína de transporte de ferro no sangue." },
  { match: "saturacao de transferrina",  text: "Porcentagem da transferrina que está ligada a ferro." },
  { match: "tibc",                       text: "Capacidade total de ligação ao ferro. Mede a transferrina disponível." },
  { match: "calcio",                     text: "Mineral essencial para ossos, contração muscular e coagulação." },
  { match: "fosforo",                    text: "Mineral componente de ossos, ATP e ácidos nucleicos." },
  { match: "magnesio",                   text: "Mineral cofator de centenas de reações enzimáticas no corpo." },
  { match: "zinco",                      text: "Mineral cofator de diversas enzimas e importante na função imune." },
  { match: "sodio",                      text: "Principal cátion extracelular. Regula volume e osmolaridade." },
  { match: "potassio",                   text: "Principal cátion intracelular. Essencial para função muscular e cardíaca." },
  { match: "cloro",                      text: "Principal ânion extracelular. Envolvido no equilíbrio ácido-base." },
  { match: "bicarbonato",                text: "Ânion envolvido no tamponamento ácido-base do sangue." },

  // ========== HORMÔNIOS ==========
  { match: "testosterona",               text: "Principal hormônio androgênico, produzido pelos testículos e em menor parte pelas adrenais." },
  { match: "estradiol",                  text: "Principal hormônio estrogênico, produzido pelos ovários." },
  { match: "estrogeno",                  text: "Família de hormônios sexuais femininos." },
  { match: "progesterona",               text: "Hormônio esteroide produzido pelos ovários e placenta." },
  { match: "fsh",                        text: "Hormônio folículo-estimulante. Produzido pela hipófise, regula gônadas." },
  { match: "lh",                         text: "Hormônio luteinizante. Produzido pela hipófise, regula gônadas." },
  { match: "prolactina",                 text: "Hormônio produzido pela hipófise, envolvido na lactação." },
  { match: "cortisol",                   text: "Hormônio do estresse, produzido pelas adrenais. Regula metabolismo e resposta imune." },
  { match: "dhea",                       text: "Dehidroepiandrosterona. Precursor de hormônios sexuais, produzido pelas adrenais." },
  { match: "androstenediona",            text: "Precursor de andrógenos e estrógenos." },
  { match: "beta hcg",                   text: "Subunidade beta da gonadotrofina coriônica humana." },
  { match: "hcg",                        text: "Gonadotrofina coriônica humana. Hormônio produzido pela placenta." },
  { match: "pth",                        text: "Paratormônio. Produzido pelas paratireoides, regula cálcio e fósforo." },
  { match: "paratormonio",               text: "Hormônio produzido pelas paratireoides, regula cálcio e fósforo." },

  // ========== MARCADORES INFLAMATÓRIOS ==========
  { match: "vhs",                        text: "Velocidade de hemossedimentação. Marcador inespecífico de inflamação." },
  { match: "velocidade de hemossedimentacao", text: "Marcador inespecífico de inflamação. Mede a velocidade de sedimentação das hemácias." },
  { match: "pcr",                        text: "Proteína C-reativa. Marcador de inflamação aguda, produzida pelo fígado." },
  { match: "proteina c reativa",         text: "Marcador de inflamação aguda, produzida pelo fígado." },
  { match: "procalcitonina",             text: "Marcador inflamatório, especialmente útil em infecções bacterianas." },

  // ========== COAGULAÇÃO ==========
  { match: "tap",                        text: "Tempo de protrombina. Avalia a via extrínseca da coagulação." },
  { match: "tempo de protrombina",       text: "Avalia a via extrínseca da coagulação." },
  { match: "inr",                        text: "Razão Normalizada Internacional. Padroniza o tempo de protrombina." },
  { match: "rni",                        text: "Razão Normalizada Internacional (INR). Padroniza o tempo de protrombina." },
  { match: "ttpa",                       text: "Tempo de tromboplastina parcial ativada. Avalia a via intrínseca da coagulação." },
  { match: "tempo de tromboplastina",    text: "Avalia a via intrínseca da coagulação." },
  { match: "fibrinogenio",               text: "Proteína precursora da fibrina, essencial na formação do coágulo." },
  { match: "d-dimero",                   text: "Produto da degradação da fibrina. Marcador de fibrinólise." },
  { match: "antitrombina",               text: "Anticoagulante natural, inibe a trombina e outros fatores de coagulação." },

  // ========== SOROLOGIAS ==========
  { match: "hiv",                        text: "Pesquisa de anticorpos contra o vírus HIV." },
  { match: "hbsag",                      text: "Antígeno de superfície do vírus da hepatite B." },
  { match: "anti-hbs",                   text: "Anticorpo contra o antígeno de superfície da hepatite B." },
  { match: "anti-hbc",                   text: "Anticorpo contra o antígeno do core da hepatite B." },
  { match: "anti-hcv",                   text: "Anticorpo contra o vírus da hepatite C." },
  { match: "hcv",                        text: "Pesquisa de anticorpos ou material genético do vírus da hepatite C." },
  { match: "sifilis",                    text: "Pesquisa de infecção por Treponema pallidum." },
  { match: "vdrl",                       text: "Teste não treponêmico para sífilis." },
  { match: "fta-abs",                    text: "Teste treponêmico para sífilis." },
  { match: "toxoplasmose",               text: "Pesquisa de infecção por Toxoplasma gondii." },
  { match: "rubeola",                    text: "Pesquisa de infecção ou imunidade contra o vírus da rubéola." },
  { match: "citomegalovirus",            text: "Pesquisa de infecção por citomegalovírus (CMV)." },
  { match: "cmv",                        text: "Pesquisa de infecção por citomegalovírus." },
  { match: "epstein-barr",               text: "Pesquisa de infecção pelo vírus Epstein-Barr (EBV)." },
  { match: "ebv",                        text: "Vírus Epstein-Barr. Causador da mononucleose infecciosa." },
  { match: "dengue",                     text: "Pesquisa de infecção pelo vírus da dengue." },
  { match: "covid",                      text: "Pesquisa de infecção por SARS-CoV-2." },
  { match: "sars-cov",                   text: "Vírus causador da COVID-19." },
  { match: "h pylori",                   text: "Pesquisa de infecção por Helicobacter pylori." },
  { match: "helicobacter",               text: "Bactéria que coloniza o trato gastrointestinal superior." },

  // ========== MARCADORES TUMORAIS ==========
  { match: "psa",                        text: "Antígeno prostático específico. Produzido pela próstata." },
  { match: "cea",                        text: "Antígeno carcinoembrionário. Glicoproteína do desenvolvimento fetal." },
  { match: "ca 125",                     text: "Antígeno carbohidrato 125. Glicoproteína presente em diversos tecidos." },
  { match: "ca 15-3",                    text: "Antígeno carbohidrato 15-3." },
  { match: "ca 19-9",                    text: "Antígeno carbohidrato 19-9." },
  { match: "afp",                        text: "Alfa-fetoproteína. Glicoproteína produzida durante o desenvolvimento fetal." },
  { match: "alfa-fetoproteina",          text: "Glicoproteína produzida durante o desenvolvimento fetal." },
];

// Normalização usada nos dois matches: minúsculas, sem acento, sem
// pontuação. "Hemoglobina Glicada (HbA1c)" e "hemoglobina glicada" precisam
// bater no mesmo lugar.
/** Painel do exame. Primeiro match vence; sem match cai em "Outros". */
export function classifyExamToPanel(examName) {
  const norm = normalizeForPanel(examName);
  for (const painel of EXAM_PANELS) {
    if (painel.match.some((m) => norm.includes(m))) return painel;
  }
  return { key: "outros", label: "Outros" };
}

/** Descrição neutra do exame, ou null se não cadastrado. */
export function getExamDescription(examName) {
  const norm = normalizeForPanel(examName);
  for (const item of EXAM_DESCRIPTIONS) {
    if (norm.includes(item.match)) return item.text;
  }
  return null;
}

/** Agrupa a lista de exames de uma análise nos painéis, preservando a ordem. */
export function agruparPorPainel(exames = []) {
  const grupos = new Map();
  for (const exame of exames) {
    const painel = classifyExamToPanel(exame.name || exame.nome);
    if (!grupos.has(painel.key)) {
      grupos.set(painel.key, { key: painel.key, label: painel.label, exams: [] });
    }
    grupos.get(painel.key).exams.push(exame);
  }
  return [...grupos.values()];
}
