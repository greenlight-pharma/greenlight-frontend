// TRILHA ECG — aprender a analisar um eletrocardiograma do zero, por fases, com
// desbloqueio por domínio. Cada fase: APRENDER (visual) + TREINAR (quiz).
// Acertar o quiz (>= APROVACAO) conclui a fase e libera a próxima.
//
// A ordem NÃO é arbitrária e não deve ser reordenada por conveniência de
// produto. Ela vai da eletricidade para o vetor, do vetor para as derivações e
// só então para as ondas. Quem inverte isso ensina o aluno a decorar figuras:
// ele reconhece o padrão e não sabe dizer por que a onda é positiva ali.
//
// Ritmos, eixo, sobrecargas, bloqueios e isquemia só entram depois que o aluno
// consegue responder "para onde a eletricidade está andando agora?". O método
// de análise fecha a trilha, porque método sem entendimento vira checklist.

export type Pergunta = {
  pergunta: string;
  opcoes: string[];
  correta: number; // índice da opção certa
  explica: string;
};

// Blocos da lição ("aprender"). Renderizados em ordem pela tela; os visuais
// reusam os componentes que já existem.
export type Bloco =
  | { tipo: "texto"; titulo?: string; texto: string }
  | { tipo: "conducao"; modo: string; nota?: string } // coração 3D + traçado
  | { tipo: "vetor"; modo?: string; nota?: string } // a seta viva + derivações
  | { tipo: "eixo" } // hexaxial arrastável
  | { tipo: "derivacoes"; arteria?: boolean } // derivações e paredes
  | { tipo: "grid" } // a grade do papel
  | { tipo: "passos"; titulo?: string; itens: string[] };

export type Fase = {
  id: string;
  num: number;
  titulo: string;
  resumo: string;
  licao?: Bloco[];
  quiz?: Pergunta[];
  emBreve?: boolean;
};

// Fração de acertos para passar de fase.
export const APROVACAO = 0.8;

export const FASES: Fase[] = [
  // ------------------------------------------------------------------ 1
  {
    id: "eletricidade",
    num: 1,
    titulo: "A eletricidade do coração",
    resumo:
      "Potencial de ação, despolarização e repolarização, e o caminho fixo do impulso: nó sinusal, nó AV, feixe de His, ramos e Purkinje.",
    licao: [
      {
        tipo: "texto",
        titulo: "Cada célula é uma pilha",
        texto:
          "Em repouso, a célula do coração está carregada: negativa por dentro e positiva por fora. Quando ela descarrega, chamamos isso de despolarização, e é ela que dispara a contração. Depois a célula precisa se recarregar para poder bater de novo, e isso é a repolarização. O ECG é a sombra dessas duas coisas, vista de fora do corpo.",
      },
      {
        tipo: "texto",
        titulo: "O caminho é sempre o mesmo",
        texto:
          "O nó sinusal, no alto do átrio direito, dispara. A onda atravessa os dois átrios, encontra o nó AV e ali sofre um atraso de propósito, para os átrios terminarem de esvaziar. Depois desce pelo feixe de His, se divide nos ramos direito e esquerdo e se espalha pelas fibras de Purkinje, ativando os ventrículos.",
      },
      {
        tipo: "conducao",
        modo: "sinusal",
        nota:
          "Percorra o traçado e acompanhe as fases da condução. Repare que o nó AV segura o sinal antes de os ventrículos acenderem: essa pausa é o segmento PR.",
      },
      {
        tipo: "texto",
        titulo: "A pergunta desta fase",
        texto:
          "Para onde a eletricidade está andando neste momento? Se você conseguir responder isso em qualquer ponto do traçado, metade do ECG fica fácil. O resto da trilha é construído em cima dessa pergunta.",
      },
    ],
    quiz: [
      {
        pergunta: "Onde o impulso elétrico do coração normalmente começa?",
        opcoes: ["Nó AV", "Nó sinusal", "Feixe de His", "Fibras de Purkinje"],
        correta: 1,
        explica:
          "O nó sinusal, no alto do átrio direito, é o marcapasso natural: dispara entre 60 e 100 vezes por minuto.",
      },
      {
        pergunta: "Despolarização é:",
        opcoes: [
          "A célula se recarregando",
          "A célula descarregando, o que dispara a contração",
          "A pausa no nó AV",
          "O repouso entre os batimentos",
        ],
        correta: 1,
        explica:
          "Despolarizar é descarregar. É esse movimento de cargas que o eletrodo capta, e ele precede a contração.",
      },
      {
        pergunta: "Por que existe um atraso no nó AV?",
        opcoes: [
          "Para o coração bater mais devagar",
          "Para dar tempo de os átrios esvaziarem antes de os ventrículos contraírem",
          "Para proteger o feixe de His",
          "Não existe atraso, é imprecisão do aparelho",
        ],
        correta: 1,
        explica:
          "O atraso é funcional: sem ele, átrios e ventrículos contrairiam quase juntos e o enchimento ventricular pioraria.",
      },
      {
        pergunta: "Qual é a via mais rápida de condução dentro dos ventrículos?",
        opcoes: [
          "O músculo comum, célula a célula",
          "O sistema His-Purkinje",
          "O nó sinusal",
          "As artérias coronárias",
        ],
        correta: 1,
        explica:
          "His, ramos e Purkinje são a fiação rápida. Quando o impulso precisa ir célula a célula, tudo demora mais, e é por isso que o QRS alarga.",
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: "vetor",
    num: 2,
    titulo: "O vetor",
    resumo:
      "A eletricidade é uma seta com direção, sentido e intensidade. O ECG não vê o coração: vê o movimento dessa seta.",
    licao: [
      {
        tipo: "texto",
        titulo: "O segredo que faz parar de decorar",
        texto:
          "Imagine a eletricidade como uma seta caminhando pelo coração. Ela tem direção, sentido e intensidade. Em cada instante, milhares de células estão descarregando ao mesmo tempo, e a soma de tudo isso é uma seta só: o vetor resultante. O aparelho não enxerga músculo, nem valva, nem artéria. Ele enxerga essa seta.",
      },
      {
        tipo: "texto",
        titulo: "A regra inteira da polaridade",
        texto:
          "Quando a seta aponta PARA um eletrodo, aquela derivação registra uma onda para cima. Quando aponta ao contrário, registra para baixo. Quando fica perpendicular, a onda quase some. É só isso, e vale para P, para QRS e para T.",
      },
      {
        tipo: "vetor",
        modo: "sinusal",
        nota:
          "A seta abaixo é a mesma nos três lugares: girando no círculo, projetada em cada derivação e desenhando os traçados. Repare como o mesmo batimento sobe numa derivação e quase some onde a seta fica de lado.",
      },
      {
        tipo: "texto",
        titulo: "Os vetores que importam",
        texto:
          "O vetor atrial é pequeno e aponta para baixo e para a esquerda, e por isso a onda P costuma ser positiva em DII. Os vetores ventriculares são bem maiores e vêm em sequência: primeiro o septo, depois as paredes livres, que formam a seta grande e definem o eixo, e por fim as porções basais. Essa varredura é o que desenha Q, R e S.",
      },
    ],
    quiz: [
      {
        pergunta: "O que o aparelho de ECG realmente registra?",
        opcoes: [
          "A contração do músculo cardíaco",
          "A projeção do vetor elétrico em cada derivação",
          "O fluxo de sangue nas coronárias",
          "A pressão dentro das câmaras",
        ],
        correta: 1,
        explica:
          "O ECG é elétrico, não mecânico. Cada derivação registra o quanto da seta aponta na direção dela.",
      },
      {
        pergunta: "A onda fica negativa numa derivação quando o vetor:",
        opcoes: [
          "Aponta para essa derivação",
          "Aponta no sentido oposto ao dela",
          "É muito intenso",
          "É muito fraco",
        ],
        correta: 1,
        explica:
          "Sentido oposto significa deflexão para baixo. A intensidade muda a altura da onda, não o lado dela.",
      },
      {
        pergunta:
          "Se o vetor ficar exatamente perpendicular a uma derivação, o que ela registra?",
        opcoes: [
          "A maior onda de todas",
          "Uma onda quase nula, ou bifásica",
          "Uma onda negativa profunda",
          "Nada muda",
        ],
        correta: 1,
        explica:
          "Perpendicular quer dizer que quase nada da seta aponta naquela direção. É esse raciocínio que se usa para achar o eixo com precisão.",
      },
      {
        pergunta: "O vetor resultante é:",
        opcoes: [
          "A soma de toda a atividade elétrica daquele instante",
          "O vetor do nó sinusal",
          "A média do batimento inteiro",
          "Um valor fixo de cada pessoa",
        ],
        correta: 0,
        explica:
          "Em cada instante existem muitas frentes de despolarização. O que sobra depois de somar tudo é o vetor resultante, e ele muda ao longo do batimento.",
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: "derivacoes",
    num: 3,
    titulo: "As derivações",
    resumo:
      "Doze câmeras olhando o mesmo coração de ângulos diferentes. O que cada uma enxerga e qual parede ela observa.",
    licao: [
      {
        tipo: "texto",
        titulo: "Doze câmeras, um coração",
        texto:
          "Não existem doze corações, existe um só, filmado de doze ângulos. Seis derivações ficam no plano frontal, como se você olhasse o paciente de frente. As outras seis são os eletrodos do tórax, que olham o coração numa fatia horizontal, de cima para baixo.",
      },
      { tipo: "derivacoes" },
      {
        tipo: "texto",
        titulo: "Por que isso importa mais do que parece",
        texto:
          "Todo achado do ECG tem endereço. Um supradesnível em DII, DIII e aVF não é um supra qualquer: é a parede inferior. Sem o mapa das derivações, o aluno decora combinações soltas e esquece todas na semana seguinte.",
      },
      {
        tipo: "vetor",
        modo: "sinusal",
        nota:
          "Volte a olhar a seta com o mapa em mente: veja qual derivação enxerga o batimento de frente e qual enxerga de lado.",
      },
    ],
    quiz: [
      {
        pergunta: "DII, DIII e aVF olham qual parede?",
        opcoes: ["Anterior", "Lateral alta", "Inferior", "Septal"],
        correta: 2,
        explica:
          "São as derivações inferiores. Alterações nelas apontam para a parede inferior, em geral território da coronária direita.",
      },
      {
        pergunta: "V1 e V2 enxergam principalmente:",
        opcoes: ["Parede lateral", "Septo", "Parede inferior", "Ápice"],
        correta: 1,
        explica:
          "V1 e V2 ficam sobre o septo. V3 e V4 pegam a parede anterior, e V5 e V6 a lateral baixa.",
      },
      {
        pergunta: "Por que um achado precisa aparecer em duas derivações vizinhas?",
        opcoes: [
          "Por exigência do aparelho",
          "Porque derivações vizinhas veem a mesma parede, e uma alteração isolada costuma ser artefato",
          "Para calcular a frequência",
          "Para medir o eixo",
        ],
        correta: 1,
        explica:
          "Duas derivações da mesma parede concordando é o que separa achado de ruído.",
      },
      {
        pergunta: "As derivações do plano frontal são:",
        opcoes: [
          "V1 a V6",
          "DI, DII, DIII, aVR, aVL e aVF",
          "Só DI, DII e DIII",
          "Todas as doze",
        ],
        correta: 1,
        explica:
          "As seis do plano frontal formam o sistema hexaxial, que é onde se mede o eixo elétrico.",
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: "ondas",
    num: 4,
    titulo: "Como nasce cada onda",
    resumo:
      "A história do traçado: onda P, intervalo PR, complexo QRS, segmento ST e onda T, cada um com o seu evento dentro do coração.",
    licao: [
      {
        tipo: "texto",
        titulo: "Cada pedaço do traçado é um evento",
        texto:
          "Onda P: despolarização dos átrios. Intervalo PR: o tempo total até os ventrículos começarem, incluindo o atraso no nó AV. Complexo QRS: despolarização dos ventrículos. Segmento ST: o platô, com o ventrículo todo despolarizado e nada se movendo eletricamente. Onda T: repolarização dos ventrículos.",
      },
      {
        tipo: "conducao",
        modo: "sinusal",
        nota:
          "Acompanhe o cursor e leia, na lista de baixo, o que está acontecendo dentro do coração naquele instante exato.",
      },
      {
        tipo: "texto",
        titulo: "A repolarização atrial some",
        texto:
          "Os átrios também se recarregam, mas essa onda é pequena e acontece escondida dentro do QRS, que é muito maior. Por isso não existe uma onda visível para ela no traçado normal.",
      },
      { tipo: "grid" },
      {
        tipo: "texto",
        titulo: "A pergunta desta fase",
        texto:
          "O que está acontecendo dentro do coração durante cada pedacinho do traçado? Quando você consegue narrar o batimento inteiro assim, o ECG deixa de ser um desenho e vira uma história.",
      },
    ],
    quiz: [
      {
        pergunta: "O segmento ST corresponde a que momento elétrico?",
        opcoes: [
          "Despolarização dos átrios",
          "O ventrículo já todo despolarizado, antes de se recarregar",
          "A pausa no nó AV",
          "A repolarização dos átrios",
        ],
        correta: 1,
        explica:
          "É o platô: como não há diferença de carga se movendo, o traçado fica na linha de base. Por isso um desvio do ST chama tanta atenção.",
      },
      {
        pergunta: "O intervalo PR mede:",
        opcoes: [
          "Só a despolarização atrial",
          "Do início da onda P ao início do QRS, incluindo o atraso no nó AV",
          "Do fim da P ao fim do QRS",
          "A duração da onda T",
        ],
        correta: 1,
        explica:
          "É o tempo total de trânsito do átrio até o ventrículo. Acima de 200 ms já é bloqueio AV de primeiro grau.",
      },
      {
        pergunta: "Por que não se vê uma onda de repolarização atrial?",
        opcoes: [
          "Os átrios não se repolarizam",
          "Ela é pequena e fica escondida dentro do complexo QRS",
          "Ela aparece só em V1",
          "O aparelho a filtra de propósito",
        ],
        correta: 1,
        explica:
          "Ela existe, mas é abafada pelo QRS, que acontece ao mesmo tempo e é muito maior.",
      },
      {
        pergunta: "A onda T representa:",
        opcoes: [
          "Contração dos átrios",
          "Repolarização dos ventrículos",
          "Despolarização dos ventrículos",
          "O fechamento das valvas",
        ],
        correta: 1,
        explica:
          "É a recarga do ventrículo. Como acontece em sentido oposto ao da despolarização, a T normalmente fica do mesmo lado do QRS.",
      },
    ],
  },

  // ------------------------------------------------------------------ 5
  {
    id: "ritmos",
    num: 5,
    titulo: "Ritmos",
    resumo:
      "Só agora. Ritmo sinusal primeiro, e depois taquicardia, bradicardia, fibrilação, flutter, TSV, taquicardia e fibrilação ventricular.",
    licao: [
      {
        tipo: "texto",
        titulo: "O que define um ritmo",
        texto:
          "Três perguntas, sempre as mesmas. Qual é a frequência? Os intervalos entre os batimentos são regulares? Existe onda P antes de cada QRS, sempre com o mesmo formato? Ritmo sinusal é ter as três respostas em ordem.",
      },
      {
        tipo: "conducao",
        modo: "sinusal",
        nota: "O padrão de referência: P antes de cada QRS, com R-R constante.",
      },
      {
        tipo: "conducao",
        modo: "fibrilacao_atrial",
        nota:
          "Sem onda P, linha de base tremida e intervalos desiguais. A irregularidade é o sinal mais confiável.",
      },
      {
        tipo: "conducao",
        modo: "flutter_atrial",
        nota:
          "Dente de serra regular. Diferente da fibrilação, aqui o intervalo entre os QRS costuma ser constante.",
      },
      {
        tipo: "conducao",
        modo: "taquicardia_ventricular",
        nota:
          "Complexos largos e rápidos, sem P relacionada. Nasce dentro do ventrículo, fora da fiação rápida.",
      },
      {
        tipo: "texto",
        titulo: "Estreito ou largo, a pergunta que salva",
        texto:
          "QRS estreito quer dizer que o impulso desceu pela fiação normal, então nasceu acima dos ventrículos. QRS largo quer dizer que ele andou célula a célula, então ou nasceu no ventrículo, ou encontrou um ramo bloqueado no caminho. Essa única pergunta separa a maioria das taquicardias.",
      },
    ],
    quiz: [
      {
        pergunta: "Qual achado mais sugere fibrilação atrial?",
        opcoes: [
          "R-R irregular e ausência de onda P",
          "Onda P alta e pontiaguda",
          "PR longo e constante",
          "QRS alargado com dois picos",
        ],
        correta: 0,
        explica:
          "Sem comando único, o nó AV deixa passar impulsos ao acaso: a irregularidade dos intervalos é a marca.",
      },
      {
        pergunta: "Taquicardia com QRS largo deve ser tratada como:",
        opcoes: [
          "Sempre benigna",
          "Taquicardia ventricular até prova em contrário",
          "Sempre fibrilação atrial",
          "Artefato de movimento",
        ],
        correta: 1,
        explica:
          "É a postura segura: assumir o pior cenário e confirmar depois, porque o erro na direção oposta custa caro.",
      },
      {
        pergunta: "O que diferencia flutter de fibrilação atrial?",
        opcoes: [
          "O flutter tem circuito regular, com ondas em dente de serra e R-R geralmente constante",
          "O flutter não tem QRS",
          "A fibrilação é sempre mais lenta",
          "Não há diferença no traçado",
        ],
        correta: 0,
        explica:
          "Flutter é um circuito organizado girando no átrio; fibrilação é desorganização de vários focos.",
      },
      {
        pergunta: "Um QRS estreito indica que o impulso:",
        opcoes: [
          "Nasceu no ventrículo",
          "Desceu pela fiação normal, vindo de cima dos ventrículos",
          "Veio de um marcapasso implantado",
          "Encontrou um ramo bloqueado",
        ],
        correta: 1,
        explica:
          "Estreito significa ativação rápida e sincronizada pelo His-Purkinje, o que só acontece quando o comando vem de cima.",
      },
      {
        pergunta: "Ritmo sinusal exige:",
        opcoes: [
          "Frequência acima de 100",
          "Onda P de mesmo formato antes de cada QRS, com R-R regular",
          "QRS largo",
          "Ausência de onda T",
        ],
        correta: 1,
        explica:
          "A P constante antes de cada QRS é a assinatura de que o comando vem do nó sinusal.",
      },
    ],
  },

  // ------------------------------------------------------------------ 6
  {
    id: "eixo",
    num: 6,
    titulo: "O eixo elétrico",
    resumo:
      "Para onde aponta a seta média do QRS. Tudo aqui volta para os vetores da fase 2.",
    licao: [
      {
        tipo: "texto",
        titulo: "O eixo é a média da seta grande",
        texto:
          "Durante o QRS a seta varre várias direções. O eixo é a média dela, e o normal fica entre -30° e +90°: para baixo e para a esquerda, que é onde está a maior massa muscular. Desvios acontecem quando a massa muda de lugar, quando um ramo bloqueia, ou quando o coração gira dentro do tórax.",
      },
      {
        tipo: "texto",
        titulo: "O atalho de dois segundos",
        texto:
          "Olhe DI e aVF. Os dois positivos: eixo normal. DI positivo e aVF negativo: desviado para a esquerda. DI negativo e aVF positivo: desviado para a direita. Os dois negativos: desvio extremo, e vale conferir se os eletrodos não estão trocados.",
      },
      { tipo: "eixo" },
      {
        tipo: "vetor",
        modo: "bloqueio_divisional_anterossuperior",
        nota:
          "Aqui o eixo está desviado à esquerda. Compare com o sinusal da fase 2: a mesma sequência de eventos, com a seta apontando para outro lugar, muda a cara do traçado em cada derivação.",
      },
    ],
    quiz: [
      {
        pergunta: "DI positivo e aVF positivo indicam:",
        opcoes: ["Eixo normal", "Desvio à esquerda", "Desvio à direita", "Desvio extremo"],
        correta: 0,
        explica:
          "Os dois positivos colocam a seta no quadrante entre 0° e +90°, dentro da faixa normal.",
      },
      {
        pergunta: "DI negativo e aVF positivo indicam:",
        opcoes: ["Eixo normal", "Desvio à esquerda", "Desvio à direita", "Nada, é artefato"],
        correta: 2,
        explica:
          "A seta apontando para longe de DI e para baixo joga o eixo além de +90°.",
      },
      {
        pergunta: "A faixa considerada normal para o eixo é aproximadamente:",
        opcoes: ["-90° a 0°", "-30° a +90°", "0° a +180°", "+90° a +180°"],
        correta: 1,
        explica:
          "Entre -30° e +90°. Fora disso, procura-se a causa: sobrecarga, bloqueio divisional, doença pulmonar, ou posição do coração.",
      },
      {
        pergunta: "Quando DI e aVF estão os dois negativos, a primeira coisa a fazer é:",
        opcoes: [
          "Concluir desvio extremo e seguir",
          "Conferir se os eletrodos não foram trocados",
          "Repetir o exame em uma semana",
          "Ignorar o eixo",
        ],
        correta: 1,
        explica:
          "Troca de eletrodos dos membros é comum e imita desvio extremo. Confirmar a colocação evita um laudo errado.",
      },
    ],
  },

  // ------------------------------------------------------------------ 7
  {
    id: "sobrecargas",
    num: 7,
    titulo: "Sobrecargas",
    resumo:
      "Mais músculo gera mais voltagem e leva mais tempo. Sobrecarga atrial direita e esquerda, e hipertrofia ventricular direita e esquerda.",
    licao: [
      {
        tipo: "texto",
        titulo: "A lógica é sempre a mesma",
        texto:
          "Câmara maior significa mais células despolarizando na mesma direção, então a onda cresce. Câmara mais espessa também leva mais tempo para ativar por inteiro, então a onda alarga. Altura e largura são as duas pistas, e cada câmara deixa a sua marca numa parte diferente do traçado.",
      },
      {
        tipo: "conducao",
        modo: "sobrecarga_atrial_direita",
        nota:
          "O átrio direito despolariza primeiro: a onda P cresce em ALTURA e fica pontiaguda.",
      },
      {
        tipo: "conducao",
        modo: "sobrecarga_atrial_esquerda",
        nota:
          "O átrio esquerdo vem depois: a onda P cresce em LARGURA e ganha dois corcovos.",
      },
      {
        tipo: "conducao",
        modo: "sobrecarga_ventricular_esquerda",
        nota:
          "R muito alta nas derivações esquerdas, e a repolarização vem alterada junto, no padrão strain.",
      },
      {
        tipo: "vetor",
        modo: "sobrecarga_ventricular_direita",
        nota:
          "Com o ventrículo direito pesando mais, a seta gira para a direita. Veja o efeito em cada derivação.",
      },
    ],
    quiz: [
      {
        pergunta: "Onda P alta e pontiaguda em DII sugere:",
        opcoes: [
          "Sobrecarga atrial esquerda",
          "Sobrecarga atrial direita",
          "Bloqueio AV de primeiro grau",
          "Hipertrofia ventricular esquerda",
        ],
        correta: 1,
        explica:
          "É a P pulmonale. O átrio direito despolariza primeiro, então ele faz a onda crescer em altura.",
      },
      {
        pergunta: "Onda P larga e com dois corcovos indica:",
        opcoes: [
          "Sobrecarga atrial esquerda",
          "Sobrecarga atrial direita",
          "Fibrilação atrial",
          "Ritmo juncional",
        ],
        correta: 0,
        explica:
          "É a P mitrale. Como o átrio esquerdo despolariza depois, o atraso dele alarga a onda.",
      },
      {
        pergunta: "Na hipertrofia ventricular esquerda, o achado central é:",
        opcoes: [
          "QRS muito largo",
          "Aumento da voltagem do QRS, com alteração de ST e T acompanhando",
          "Ausência de onda P",
          "PR curto",
        ],
        correta: 1,
        explica:
          "Mais massa gera mais voltagem. A duração muda pouco: o que salta aos olhos é a altura, e o strain vem junto.",
      },
      {
        pergunta: "Por que a sobrecarga ventricular direita desvia o eixo?",
        opcoes: [
          "Porque o ventrículo direito passa a pesar mais no vetor resultante",
          "Porque o nó sinusal muda de lugar",
          "Porque o PR encurta",
          "Porque a onda T inverte",
        ],
        correta: 0,
        explica:
          "Tudo volta ao vetor: mais massa de um lado puxa a seta média para aquele lado.",
      },
    ],
  },

  // ------------------------------------------------------------------ 8
  {
    id: "bloqueios",
    num: 8,
    titulo: "Bloqueios",
    resumo:
      "Onde o sinal trava. Bloqueios AV de primeiro, segundo (Mobitz I e II) e terceiro grau, e bloqueios de ramo direito e esquerdo.",
    licao: [
      {
        tipo: "texto",
        titulo: "Duas famílias, dois lugares",
        texto:
          "Bloqueio AV é problema na passagem entre átrio e ventrículo: olhe a relação entre a onda P e o QRS. Bloqueio de ramo é problema depois dessa passagem, dentro dos ventrículos: olhe a largura e a forma do QRS. São perguntas diferentes, feitas em partes diferentes do traçado.",
      },
      {
        tipo: "conducao",
        modo: "bav_1grau",
        nota: "Todo P conduz, mas atrasado: o PR passa de 200 ms.",
      },
      {
        tipo: "conducao",
        modo: "bav_2grau_mobitz1",
        nota:
          "O PR aumenta a cada batimento até uma P falhar. Repare que as ondas P mantêm o mesmo espaçamento entre si.",
      },
      {
        tipo: "conducao",
        modo: "bav_2grau_mobitz2",
        nota:
          "Aqui o PR é sempre igual e, de repente, um batimento não passa. Sem aviso, e mais preocupante.",
      },
      {
        tipo: "conducao",
        modo: "bav_3grau",
        nota:
          "Dissociação: as ondas P seguem no ritmo delas e os QRS no deles, sem relação fixa entre si.",
      },
      {
        tipo: "conducao",
        modo: "bloqueio_ramo_direito",
        nota: "QRS alargado com dois picos, o rSR' clássico em V1.",
      },
      {
        tipo: "conducao",
        modo: "bloqueio_ramo_esquerdo",
        nota:
          "QRS alargado e entalhado. Bloqueio de ramo esquerdo novo, com dor no peito, merece atenção imediata.",
      },
    ],
    quiz: [
      {
        pergunta: "PR que aumenta progressivamente até uma onda P não conduzir é:",
        opcoes: [
          "BAV de primeiro grau",
          "Mobitz I (Wenckebach)",
          "Mobitz II",
          "BAV total",
        ],
        correta: 1,
        explica:
          "O nó AV vai ficando mais lento até falhar, depois se recupera e o ciclo recomeça. É o de comportamento mais benigno.",
      },
      {
        pergunta: "No BAV total, o que se observa?",
        opcoes: [
          "PR fixo e longo",
          "Ondas P e complexos QRS independentes, cada um no seu ritmo",
          "Ausência de ondas P",
          "QRS sempre estreito",
        ],
        correta: 1,
        explica:
          "Nada atravessa o nó AV, então cada andar do coração bate por conta própria. É a dissociação AV.",
      },
      {
        pergunta: "Por que o bloqueio de ramo alarga o QRS?",
        opcoes: [
          "Porque o coração bate mais devagar",
          "Porque um ventrículo é ativado com atraso, célula a célula, fora da fiação rápida",
          "Porque o nó sinusal falha",
          "Porque o PR aumenta",
        ],
        correta: 1,
        explica:
          "A assincronia entre os dois ventrículos é o que estica o complexo no papel.",
      },
      {
        pergunta: "Mobitz II é considerado mais grave que Mobitz I porque:",
        opcoes: [
          "É mais rápido",
          "A falha vem sem aviso e o bloqueio costuma estar abaixo do nó AV, podendo evoluir para BAV total",
          "Não tem onda P",
          "O QRS é estreito",
        ],
        correta: 1,
        explica:
          "Problema na própria fiação, e não no nó, tem pior prognóstico e frequentemente indica marcapasso.",
      },
    ],
  },

  // ------------------------------------------------------------------ 9
  {
    id: "isquemia",
    num: 9,
    titulo: "Isquemia e infarto",
    resumo:
      "Isquemia, lesão e necrose, e como localizar a parede afetada e a artéria provavelmente envolvida.",
    licao: [
      {
        tipo: "texto",
        titulo: "Três estágios, três marcas",
        texto:
          "Isquemia é falta de oxigênio e altera a recarga: aparece na onda T, que inverte e fica simétrica. Lesão é sofrimento mais intenso e desvia o segmento ST, para cima ou para baixo. Necrose é músculo morto, que não gera mais corrente, e deixa a onda Q patológica como cicatriz.",
      },
      {
        tipo: "conducao",
        modo: "t_invertida",
        nota: "Isquemia: a onda T inverte e fica simétrica, com o QRS ainda normal.",
      },
      {
        tipo: "conducao",
        modo: "supra_st",
        nota:
          "Lesão: o ST sobe e se funde à onda T, formando a cúpula. É o padrão que corre contra o relógio.",
      },
      {
        tipo: "conducao",
        modo: "onda_q_patologica",
        nota:
          "Necrose: onda Q larga e profunda, com R pequena. É a marca de um infarto antigo.",
      },
      { tipo: "derivacoes", arteria: true },
      {
        tipo: "texto",
        titulo: "A pergunta desta fase",
        texto:
          "Olhando o ECG, qual artéria provavelmente está obstruída? Você chega nela em dois passos: primeiro identifica em quais derivações o achado aparece, depois traduz isso em parede, e da parede para o território arterial. A resposta é uma probabilidade, não uma certeza.",
      },
    ],
    quiz: [
      {
        pergunta: "Supradesnível de ST em DII, DIII e aVF sugere infarto de parede:",
        opcoes: ["Anterior", "Inferior", "Lateral alta", "Septal"],
        correta: 1,
        explica:
          "São as derivações inferiores, território mais frequentemente da coronária direita.",
      },
      {
        pergunta: "A onda Q patológica indica:",
        opcoes: [
          "Isquemia aguda em curso",
          "Área de músculo que perdeu atividade elétrica, em geral infarto antigo",
          "Bloqueio de ramo",
          "Sobrecarga atrial",
        ],
        correta: 1,
        explica:
          "Onde não há mais músculo vivo não há corrente saindo, e o eletrodo passa a enxergar o vetor do lado oposto.",
      },
      {
        pergunta: "Alterações em V3 e V4 apontam para a parede:",
        opcoes: ["Inferior", "Anterior", "Lateral baixa", "Posterior"],
        correta: 1,
        explica:
          "V3 e V4 olham a parede anterior, território da artéria descendente anterior.",
      },
      {
        pergunta: "Qual é a sequência típica dos estágios no traçado?",
        opcoes: [
          "Necrose, lesão, isquemia",
          "Isquemia na onda T, lesão no segmento ST e necrose na onda Q",
          "Lesão, necrose, isquemia",
          "Todos aparecem ao mesmo tempo",
        ],
        correta: 1,
        explica:
          "Cada estágio marca uma parte diferente do traçado, e reconhecer isso ajuda a estimar há quanto tempo o evento começou.",
      },
      {
        pergunta: "Dizer qual artéria está obstruída a partir do ECG é:",
        opcoes: [
          "Uma certeza anatômica",
          "Uma probabilidade, porque a irrigação varia de pessoa para pessoa",
          "Impossível de estimar",
          "Definido apenas pela frequência cardíaca",
        ],
        correta: 1,
        explica:
          "O raciocínio de território é útil e orienta a conduta, mas a anatomia coronariana tem variações individuais.",
      },
    ],
  },

  // ------------------------------------------------------------------ 10
  {
    id: "metodo",
    num: 10,
    titulo: "O método de análise",
    resumo:
      "Nunca olhar um ECG aleatoriamente. Sempre a mesma sequência, do começo ao fim, mesmo quando o diagnóstico parece óbvio.",
    licao: [
      {
        tipo: "texto",
        titulo: "Por que a ordem importa",
        texto:
          "O olho treinado vai direto para o achado chamativo e para de procurar. É assim que se descreve um supra bonito e se deixa passar um bloqueio total ao lado. A sequência protege contra isso: você só olha o que chama atenção depois de ter olhado tudo.",
      },
      {
        tipo: "passos",
        titulo: "Sempre nesta ordem",
        itens: [
          "Frequência",
          "Ritmo",
          "Eixo",
          "Onda P",
          "Intervalo PR",
          "Complexo QRS",
          "Segmento ST",
          "Onda T",
          "Intervalo QT",
          "Conclusão",
        ],
      },
      { tipo: "grid" },
      {
        tipo: "texto",
        titulo: "Antes de qualquer conclusão",
        texto:
          "Confira a calibração e a velocidade do papel, e confirme que o traçado está legível. Um ganho fora do padrão inventa hipertrofia; uma foto tremida inventa achado. Se não dá para medir, o certo é dizer que não dá para medir.",
      },
      {
        tipo: "texto",
        titulo: "Como nunca mais esquecer",
        texto:
          "Ler não fixa. O que fixa é ver o fenômeno acontecer: a descarga saindo do nó sinusal, a seta girando, a derivação registrando e a onda nascendo, tudo ao mesmo tempo. Sempre que uma onda parecer estranha, volte para a fase 2 e pergunte para onde a seta está apontando naquele instante.",
      },
      {
        tipo: "vetor",
        modo: "sinusal",
        nota:
          "Feche a trilha com a imagem que sustenta o resto: anatomia, vetor, derivação e traçado na mesma tela.",
      },
    ],
    quiz: [
      {
        pergunta: "Qual é o primeiro passo da análise sistemática?",
        opcoes: ["Procurar supra de ST", "Frequência", "Onda T", "Intervalo QT"],
        correta: 1,
        explica:
          "Começar sempre pela frequência evita que o achado mais chamativo sequestre a leitura.",
      },
      {
        pergunta: "Por que seguir sempre a mesma sequência?",
        opcoes: [
          "Para ficar mais rápido",
          "Porque quem vai direto ao achado chamativo deixa de olhar o resto do traçado",
          "Por exigência do aparelho",
          "Para poupar papel",
        ],
        correta: 1,
        explica:
          "O método existe justamente para proteger contra o próprio olho treinado.",
      },
      {
        pergunta: "Antes de concluir qualquer coisa, é preciso conferir:",
        opcoes: [
          "O nome do paciente",
          "A calibração, a velocidade do papel e se o traçado está legível",
          "A cor do papel",
          "A marca do aparelho",
        ],
        correta: 1,
        explica:
          "Ganho fora do padrão inventa hipertrofia e traçado ruim inventa achado. A checagem técnica vem antes da clínica.",
      },
      {
        pergunta: "Quando não é possível medir a largura do QRS na imagem, o correto é:",
        opcoes: [
          "Estimar como estreito",
          "Estimar como largo",
          "Registrar que não foi possível medir",
          "Deduzir pela frequência",
        ],
        correta: 2,
        explica:
          "Ou você mediu, ou não mediu. Registrar a limitação é mais seguro para o paciente do que um número inventado.",
      },
      {
        pergunta: "A leitura feita neste aplicativo é:",
        opcoes: [
          "Um laudo",
          "Uma hipótese de estudo, para confirmar com o preceptor e com o laudo oficial",
          "Uma prescrição",
          "Um diagnóstico definitivo",
        ],
        correta: 1,
        explica:
          "É material educacional. A confirmação com o preceptor e com o exame oficial faz parte do método.",
      },
    ],
  },
];

