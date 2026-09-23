// Estação de Revisão ENAMED — apostila curada de alto rendimento, organizada
// pelas 8 grandes áreas da Matriz de Referência (Portaria Inep nº 478/2025).
// Conteúdo ESTÁTICO e curado (não gerado por IA), com flashcards por área.
//
// AVISO: material de estudo e reflexão, não exaustivo. Não substitui diretrizes
// vigentes (SBC, SBD, MS, FEBRASGO, SBP) nem a prática clínica. Valores e
// condutas devem ser conferidos nas fontes oficiais. Requer revisão clínica
// antes da liberação ampla. Prioridade (alta/média/base) deriva da lógica da
// matriz, não de peso oficial por área.

export type RevisaoPrio = "alta" | "media" | "base";
export interface RevisaoTema {
  t: string; // título do tema
  r: string; // conteúdo em markdown leve (**negrito**, listas "- ", parágrafos)
}
export interface RevisaoAreaData {
  nome: string;
  prio: RevisaoPrio;
  temas: RevisaoTema[];
}
export interface RevisaoArea extends RevisaoAreaData {
  id: string;
}

// Prioridade visual de cada área (cor do "dot" e do rótulo).
export const REVISAO_PRIORIDADE: Record<
  RevisaoPrio,
  { label: string; dot: string; soft: string }
> = {
  alta: { label: "Prioridade alta", dot: "#B23A48", soft: "#F7E7E9" },
  media: { label: "Prioridade média", dot: "#B7791F", soft: "#FBF1DF" },
  base: { label: "Base de apoio", dot: "#1565A6", soft: "#E4EFF8" },
};

// Conteúdo aprofundado por área (id -> {nome, prio, temas}).
const AREAS_DATA: Record<string, RevisaoAreaData> = {
  mfc: {
    nome: "Medicina da Família e Comunidade",
    prio: "alta",
    temas: [
      { t: "Método clínico centrado na pessoa e abordagem familiar", r: `**Definição.** O Método Clínico Centrado na Pessoa (MCCP) integra o componente biomédico com a experiência subjetiva do adoecimento.

**Componentes:**
- **Explorar saúde, doença e experiência** — investigar o "FIFE": **F**eelings (sentimentos/medos), **I**deas (o que acha que tem), **F**unction (impacto funcional), **E**xpectations (expectativas).
- **Entender a pessoa como um todo** — contexto familiar, trabalho, cultura, ciclo de vida.
- **Elaborar plano conjunto** (terreno comum).
- **Fortalecer a relação** (vínculo, longitudinalidade).

**Ferramentas de abordagem familiar:**
- **Genograma** — estrutura familiar (≥3 gerações), relações e doenças.
- **Ciclo de vida familiar** e suas crises esperadas.
- **APGAR familiar** — funcionalidade (Adaptação, Participação, Crescimento, Afeto, Resolução).
- **P.R.A.C.T.I.C.E. e F.I.R.O.** — modelos complementares.

**Pegadinha de prova.** O MCCP **não abandona** o raciocínio biomédico — integra as duas dimensões. A resposta correta acolhe a experiência **e** conduz clinicamente.` },
      { t: "Atributos da APS e organização da Rede (RAS)", r: `**APS** resolve ~**80-85%** dos problemas de saúde e ordena a Rede de Atenção (RAS).

**Atributos essenciais (Starfield):**
- **Primeiro contato** — porta de entrada preferencial e resolutiva.
- **Longitudinalidade** — acompanhamento no tempo, com vínculo (o mais distintivo).
- **Integralidade** — oferta ampla e reconhecimento de necessidades biopsicossociais.
- **Coordenação** — integração do cuidado recebido em outros pontos (centro de comunicação).

**Atributos derivados:** orientação familiar, orientação comunitária, competência cultural.

**Pegadinha.** "Porta de entrada" = preferencial e resolutiva, não só acesso geográfico. A coordenação sustenta referência/contrarreferência.` },
      { t: "Rastreamento: princípios e vieses (Wilson-Jungner)", r: `**Rastreamento** = teste em **assintomáticos** para detectar doença pré-clínica.

**Critérios de Wilson & Jungner:**
- Problema de saúde **importante** (prevalente/grave).
- **Fase pré-clínica detectável**.
- Teste **sensível, específico, seguro, aceitável, acessível**.
- **Tratamento eficaz** que muda prognóstico se precoce.
- **Benefício > dano**, custo justificável.
- História natural conhecida.

**Vieses que falseiam o benefício:**
- **Lead time bias** (antecipação diagnóstica) — sobrevida "aumenta" só porque diagnosticou antes.
- **Length bias** (duração) — capta tumores indolentes.
- **Sobrediagnóstico** — detecta doença que nunca causaria dano → sobretratamento.

**Pegadinha.** Detectar mais cedo **nem sempre** reduz mortalidade. Rastreamento só se justifica com evidência de **redução de mortalidade**.` },
      { t: "Puericultura: crescimento e desenvolvimento", r: `**Consultas (MS):** 1ª semana, 1º, 2º, 4º, 6º, 9º, 12º, 18º, 24º meses; depois anual.

**Crescimento (curvas OMS, escore-z):** peso, estatura, perímetro cefálico e IMC. Normal entre **z −2 e +2**. **Velocidade** (curva) importa mais que ponto isolado.

**Marcos:** sorriso social ~2m; sustento cefálico ~3-4m; senta sem apoio ~6-9m; anda ~12m; primeiras palavras ~12m; frases de 2 palavras ~24m.

**Sinais de alerta:** não sustentar cabeça aos 4m, não sentar aos 9m, não andar aos 18m, não falar palavras aos 18m. **Regressão de marco = sempre patológica.**

**Ações:** vacinação, suplementação (vitamina D, ferro profilático), triagens, orientação anticipatória (acidentes, sono).

**Pegadinha.** Atraso em **um** marco pode ser normal; preocupa atraso em **múltiplos domínios** ou **regressão**.` },
      { t: "Suplementação e prevenção na infância", r: `**Ferro profilático:** recomendado a partir dos ~3-6 meses (ou conforme protocolo/aleitamento) até 24 meses, em doses profiláticas; dose maior em prematuros/baixo peso.

**Vitamina D:** suplementação desde a 1ª semana de vida até ~12-24 meses (prevenção de raquitismo), conforme protocolo.

**Vitamina A:** suplementação periódica em áreas/idades de risco (programa nacional).

**Prevenção de acidentes:** orientação por faixa etária (posição supina para dormir — prevenção de morte súbita; segurança no transporte; afogamento; quedas).

**Pegadinha.** Aleitamento exclusivo não fornece vitamina D suficiente → suplementar mesmo em amamentados. Posição **supina** para dormir reduz morte súbita do lactente.` },
      { t: "Pré-natal de risco habitual", r: `**Consultas:** mínimo **6**, início até **12 semanas**.

**Exames (1º tri):** tipagem/Rh, Coombs indireto (se Rh−), hemograma, glicemia jejum, **HIV, VDRL, HBsAg, toxoplasmose**, urina I + urocultura, USG. **TOTG 75g (24-28 sem)**. **Estreptococo B (35-37 sem)**.

**Suplementação:** **ácido fólico 0,4 mg/dia** (pré-concepção a 12 sem); **ferro** (2º tri).

**Vacinas:** **dTpa** (cada gestação ≥20 sem), hepatite B, influenza. Vírus vivo **contraindicado**.

**Toda consulta:** PA, peso, altura uterina, BCF, movimentos fetais, edema.

**Pegadinha.** Ácido fólico previne defeito de tubo neural (começar antes da concepção). Rh− + Coombs − → imunoglobulina anti-D conforme protocolo.` },
      { t: "Manejo longitudinal das DCNT na APS", r: `**Linha de cuidado:** estratificação de risco → metas individualizadas → autocuidado apoiado → abordagem de fatores de risco (tabaco, álcool, sedentarismo, dieta, obesidade) → manejo integrado.

**Princípios:** longitudinalidade, proatividade (busca ativa de faltosos), integralidade (rastrear comorbidades: DM → DRC, retinopatia, pé diabético).

**Modelo de Atenção às Condições Crônicas (MACC):** organiza por estratos de risco, ênfase em promoção/prevenção e autocuidado.

**Pegadinha.** Não é só "controlar o número": combina meta clínica + adesão + determinantes + autocuidado.` },
      { t: "Referência, contrarreferência e matriciamento", r: `- **Referência** — encaminhamento a nível de maior complexidade.
- **Contrarreferência** — retorno à APS com informações para continuidade.

**Matriciamento / apoio matricial** — especialista **apoia** a equipe da APS (discussão de casos, teleconsultoria, atendimento conjunto), reduzindo encaminhamentos.

**Ferramentas:** regulação, protocolos de encaminhamento, prontuário compartilhado (e-SUS).

**Pegadinha.** Encaminhar não é "se livrar" — a APS mantém a **coordenação**. Matriciamento é apoio, não transferência de responsabilidade.` },
      { t: "Prevenção quaternária e desprescrição", r: `**Prevenção quaternária (P4):** proteger de sobremedicalização (sobrediagnóstico, sobretratamento, iatrogenia).

**Níveis de prevenção:** primária (evitar doença) · secundária (rastreio) · terciária (reduzir sequelas) · **quaternária (evitar dano da medicina)**.

**Aplicações:** evitar exames sem indicação, não medicalizar condições naturais (luto, envelhecimento), **desprescrever** (polifarmácia no idoso, cascata de prescrição), decisão compartilhada, comunicar incertezas.

**Ferramentas:** NNT/NNH, *Choosing Wisely*, critérios de Beers/STOPP-START (idoso).

**Pegadinha.** P4 não é negar cuidado nem economia — é proteção baseada em evidência. Cenário clássico: paciente **pede** exame/antibiótico sem indicação → P4 + comunicação.` },
      { t: "Saúde do idoso e avaliação geriátrica", r: `**Avaliação Geriátrica Ampla (AGA):** funcionalidade (AVDs/AIVDs), cognição, humor, mobilidade/quedas, nutrição, polifarmácia, suporte social, continência, visão/audição.

**Grandes síndromes geriátricas ("Is"):** **I**nstabilidade (quedas), **I**mobilidade, **I**ncontinência, **I**nsuficiência cognitiva (demência/delirium), **I**atrogenia.

**Fragilidade:** perda de peso, exaustão, fraqueza (força de preensão), lentidão da marcha, baixa atividade (fenótipo de Fried).

**Quedas:** avaliar causas (medicamentos, hipotensão postural, ambiente, sensorial); prevenir (revisão de fármacos, exercício, adaptação do lar).

**Pegadinha.** No idoso, apresentação atípica é regra (infecção sem febre, IAM sem dor). **Delirium** (agudo, flutuante) ≠ demência (crônica, progressiva). Priorizar **funcionalidade** sobre número de diagnósticos.` },
      { t: "Cuidados paliativos e comunicação de más notícias", r: `**Cuidados paliativos:** abordagem que melhora qualidade de vida de pacientes com doença ameaçadora à vida, por prevenção/alívio do sofrimento (físico, psíquico, social, espiritual). **Não é só fim de vida** — pode ser concomitante ao tratamento.

**Controle de sintomas:** dor (escada analgésica da OMS), dispneia, náusea, constipação.

**Dor (escada OMS):** não opioides (dipirona, AINE) → opioides fracos → **opioides fortes (morfina)** + adjuvantes. Na dor intensa, pode iniciar direto por opioide forte.

**Comunicação de más notícias — protocolo SPIKES:** **S**etting (ambiente), **P**erception (o que sabe), **I**nvitation (quanto quer saber), **K**nowledge (informar), **E**motions (acolher), **S**trategy (plano).

**Pegadinha.** Cuidado paliativo ≠ "desistir". Morfina bem indicada na dor/dispneia não "apressa a morte". Respeitar autonomia e diretivas antecipadas de vontade.` },
      { t: "Tabagismo, álcool e abordagem de dependências", r: `**Tabagismo:** principal causa evitável de morte. Abordagem **"5 As"**: **A**sk, **A**dvise, **A**ssess, **A**ssist, **A**rrange. Tratamento: aconselhamento + **terapia de reposição de nicotina**, bupropiona, vareniclina.

**Álcool:** rastreio **AUDIT**; intervenção breve é eficaz. Uso de risco vs. dependência.

**Estágios de mudança (Prochaska):** pré-contemplação → contemplação → preparação → ação → manutenção (→ recaída). **Entrevista motivacional** adequa a abordagem ao estágio.

**Pegadinha.** Intervenção **breve** na APS reduz consumo. Adequar a abordagem ao **estágio de motivação** — orientar abstinência a quem está em pré-contemplação costuma falhar.` },
      { t: "Dermatologia na atenção primária", r: `**Lesões elementares:** mácula (plana), pápula (elevada <1cm), placa, vesícula/bolha, pústula, nódulo.

**Comuns na APS:**
- **Dermatite atópica** — prurido, xerose, flexuras; hidratação + corticoide tópico.
- **Escabiose (sarna)** — prurido noturno, túneis, contatos afetados; permetrina/ivermectina (tratar contatos).
- **Micoses superficiais** — tinha, candidíase, pitiríase versicolor; antifúngico tópico.
- **Piodermites** — impetigo (crostas melicéricas), erisipela/celulite (antibiótico).

**Câncer de pele:** **CBC** (mais comum, perolado), CEC, **melanoma** (regra **ABCDE**: Assimetria, Bordas, Cor, Diâmetro >6mm, Evolução).

**Pegadinha.** Melanoma: regra ABCDE + mudança da lesão → biópsia. Escabiose: tratar **contatos** e ambiente. Impetigo = crosta melicérica. Erisipela é emergência quando extensa/sistêmica.` },
      { t: "Oftalmologia e otorrinolaringologia na APS", r: `**Olho vermelho:**
- **Conjuntivite** (viral/bacteriana/alérgica) — hiperemia difusa, secreção; geralmente benigna.
- **Sinais de alarme (encaminhar):** dor intensa, baixa de visão, fotofobia, halos → **glaucoma agudo, uveíte, ceratite**.

**Glaucoma agudo:** dor ocular intensa, midríase média, visão turva, náusea — **emergência**.

**Otorrino:**
- **Otite média aguda** — otalgia, abaulamento timpânico; amoxicilina se indicado.
- **Otite externa** — dor à tração do pavilhão; tópico.
- **Rinossinusite** — maioria viral; antibiótico só se critérios (>10 dias, piora, sintomas graves).
- **Faringite estreptocócica** — critérios de Centor.

**Pegadinha.** Olho vermelho **com dor + baixa visão** = encaminhar (não é conjuntivite banal). Glaucoma agudo é emergência. Rinossinusite é quase sempre viral (não antibiotizar cedo).` },
      { t: "Ortopedia e queixas musculoesqueléticas", r: `**Lombalgia:** maioria **mecânica/inespecífica** (bom prognóstico) — manter atividade, analgesia; imagem **não** de rotina.
**Sinais de alarme (red flags):** trauma, febre, emagrecimento, déficit neurológico, idade >50 nova, câncer prévio, síndrome da cauda equina (retenção urinária, anestesia em sela) → investigar.

**Ombro:** tendinopatia do manguito rotador, capsulite adesiva.
**Joelho:** osteoartrite, lesões meniscais/ligamentares (trauma).
**Fraturas:** imobilização, analgesia; expostas → emergência (ATB, limpeza).

**Pegadinha.** Lombalgia sem red flags **não** precisa de imagem — manter atividade. **Cauda equina** (anestesia em sela + retenção urinária) = emergência cirúrgica. Red flags mudam a conduta.` },
      { t: "Medicina legal e ética médica", r: `**Documentos médicos:** atestado, declaração, laudo, parecer, relatório. **Declaração de óbito (DO):** preenchida pelo médico; define causa básica → causas consequenciais.

**Óbitos:**
- **Morte natural** — médico assistente ou SVO (sem assistência).
- **Morte violenta/suspeita** (acidente, homicídio, suicídio) → **IML** (não é o assistente que preenche).

**Ética (Código de Ética Médica):** autonomia, beneficência, não maleficência, justiça. **Sigilo médico** (exceções: dever legal como notificação, justa causa, autorização). Consentimento informado.

**Atestado de óbito:** médico **não** deve atestar óbito de morte violenta como natural.

**Pegadinha.** Morte violenta/suspeita → **IML**, não o médico assistente. Sigilo tem exceções (notificação compulsória é dever legal). DO: causa básica é a que iniciou a cadeia. Menor/urgência: atender mesmo sem consentimento formal quando há risco.` },
      { t: "Violência e vulnerabilidades", r: `**Notificação compulsória** de **todas as violências** (contra criança, mulher, idoso, pessoa com deficiência) — mesmo suspeita.

**Violência sexual:** acolhimento, profilaxias (**PEP HIV, ISTs, contracepção de emergência**), coleta conforme protocolo, notificação. Não exige BO para atendimento em saúde.

**Maus-tratos infantis:** sinais de alerta (lesões incompatíveis com a história, negligência); notificar e acionar Conselho Tutelar.

**Idoso:** negligência, violência financeira, física.

**Pegadinha.** Violência é **notificação compulsória** (dever do profissional). Atendimento à violência sexual **não** depende de boletim de ocorrência. PEP até 72h. Acionar rede de proteção (Conselho Tutelar para menores).` },
    ],
  },
  coletiva: {
    nome: "Saúde Coletiva e SUS",
    prio: "alta",
    temas: [
      { t: "Princípios doutrinários do SUS", r: `**Base legal:** CF/1988 (art. 196-200), **Lei 8.080/90** (organização) e **Lei 8.142/90** (participação/financiamento).

**Doutrinários:**
- **Universalidade** — saúde é **direito de todos e dever do Estado**, sem contribuição.
- **Integralidade** — ações de **promoção, proteção, recuperação e reabilitação**; indivíduo como um todo.
- **Equidade** — **tratar desigualmente os desiguais**, priorizando quem mais precisa.

**Pegadinha.** **Igualdade** = todos igual; **equidade** = priorizar necessidade. Equidade deriva da "igualdade de assistência sem preconceitos ou privilégios".` },
      { t: "Princípios organizativos e controle social", r: `**Organizativos:**
- **Descentralização** — comando único em cada esfera (municipalização).
- **Regionalização e hierarquização** — níveis de complexidade em base territorial.
- **Participação social** (Lei 8.142/90).

**Controle social:**
- **Conselhos de Saúde** — permanentes, **deliberativos**, **paritários (50% usuários)**; fiscalizam inclusive finanças.
- **Conferências de Saúde** — a cada **4 anos**, propõem diretrizes.

**Financiamento:** repasses **fundo a fundo**; exige Fundo, Conselho, Plano de Saúde, relatório de gestão.

**Pegadinha.** Usuários = **50%**; Conselho é **deliberativo**, Conferência é **propositiva**.` },
      { t: "Leis 8.080/90 e 8.142/90", r: `**Lei 8.080/90** (Lei Orgânica da Saúde):
- Regula ações e serviços de saúde em todo o território.
- Define objetivos, competências das esferas, princípios (universalidade, integralidade, equidade, etc.).
- Trata da organização, direção e gestão do SUS.

**Lei 8.142/90:**
- **Participação da comunidade** (Conselhos e Conferências).
- **Transferências intergovernamentais** de recursos (fundo a fundo).

**Decreto 7.508/2011:** regulamenta a 8.080 — regiões de saúde, RENASES, RENAME, Contrato Organizativo (COAP), mapa da saúde.

**Pegadinha.** A participação social foi vetada na 8.080 e **restituída pela 8.142**. Decreto 7.508 trouxe as **regiões de saúde** e o conceito de porta de entrada.` },
      { t: "Vigilância em saúde (tipos)", r: `- **Epidemiológica** — detecção/prevenção de agravos; base da notificação e investigação de surtos.
- **Sanitária** — risco de **produtos, serviços e ambientes** (ANVISA; poder de polícia).
- **Ambiental** — fatores do meio (água, ar, solo, vetores, desastres).
- **Saúde do trabalhador** — relação trabalho-saúde (CEREST).

**Conceitos:** endemia (esperado), epidemia/surto (acima do esperado), pandemia (vários países).

**Pegadinha.** Sanitária = produtos/serviços; epidemiológica = doenças/notificação; ambiental = meio.` },
      { t: "Indicadores de saúde e epidemiologia", r: `**Mortalidade:**
- Geral = óbitos/população × 1.000.
- **Infantil** = óbitos <1 ano / nascidos vivos × 1.000 (neonatal precoce 0-6d, tardio 7-27d, pós-neonatal 28-364d).
- **Materna** = óbitos maternos / NV × 100.000.

**Morbidade:**
- **Incidência** = casos **novos** / população em risco (risco).
- **Prevalência** = casos **existentes** / população (carga). **Prev ≈ Inc × Duração**.

**Letalidade** = óbitos / **doentes** × 100 (gravidade).

**Pegadinha.** Mortalidade usa **população**; letalidade usa **doentes**. Tratamento que cronifica **aumenta prevalência**.` },
      { t: "Sistemas de informação em saúde", r: `- **SIM** — mortalidade (fonte: **Declaração de Óbito**).
- **SINASC** — nascidos vivos (**Declaração de Nascido Vivo**).
- **SINAN** — agravos de **notificação**.
- **SIH** — internações (AIH); **SIA** — ambulatorial.
- **e-SUS APS / SISAB** — Atenção Básica.
- **SI-PNI** — imunizações.

**Pegadinha.** DO→SIM, DNV→SINASC, ficha→SINAN. Mortalidade infantil: numerador no **SIM**, denominador no **SINASC**.` },
      { t: "Notificação compulsória", r: `**Notificação** = comunicação obrigatória (suspeita ou confirmada) de agravos da lista nacional; registrada no **SINAN**.

**Prazos:**
- **Imediata (24h):** surtos, sarampo, meningites, raiva, cólera, febre amarela, **óbito materno/infantil**, **violências, tentativa de suicídio**, botulismo.
- **Semanal:** demais (hanseníase, tuberculose, hepatites, etc.).

**Quem:** todo profissional de saúde. A **suspeita já obriga**. **Notificação negativa** confirma o sistema funcionando.

**Pegadinha.** Notifica-se pela **suspeita**. **Violência e tentativa de suicídio** são notificáveis. Sigilo médico **não impede** notificação (exceção legal).` },
      { t: "PNAB e Estratégia Saúde da Família", r: `**PNAB** define a AB/APS; **ESF** é o modelo prioritário.

**eSF:** médico, enfermeiro, técnico de enfermagem, **ACS** (± saúde bucal). Território adscrito, população definida.

**Apoio matricial:** NASF → atual **eMulti**.

**Funções:** porta de entrada, coordenadora e **ordenadora da rede**.

**Financiamento atual (Previne Brasil):** **capitação ponderada** + **pagamento por desempenho** + incentivos.

**Pegadinha.** ESF é prioritária, não única. ACS é característico. Atenção às mudanças de financiamento (Previne) e NASF→eMulti.` },
      { t: "Determinantes sociais da saúde", r: `**DSS** = condições em que se nasce, vive, trabalha e envelhece.

**Modelo Dahlgren-Whitehead (camadas):** individual (idade/sexo/genética) → estilos de vida → redes sociais → condições de vida/trabalho (emprego, educação, saneamento, moradia) → macroestrutura socioeconômica.

**Iniquidade** = desigualdade **injusta e evitável** (dimensão ética). Nem toda desigualdade é iniquidade.

**Pegadinha.** Reduzir iniquidades exige **intersetorialidade** e equidade. "Estilo de vida" é só uma camada — culpar o indivíduo ignora determinantes estruturais.` },
      { t: "Níveis de prevenção e história natural da doença", r: `**História natural:** período pré-patogênico (fatores de risco) → patogênico (biológico precoce → sinais/sintomas → desfecho).

**Níveis de prevenção (Leavell & Clark):**
- **Primária** — promoção da saúde + proteção específica (vacinas). Atua no pré-patogênico.
- **Secundária** — diagnóstico precoce/rastreio + limitação do dano.
- **Terciária** — reabilitação.
- **Quaternária** — evitar iatrogenia (adição moderna).

**Pegadinha.** Vacina = proteção específica (primária). Rastreamento = secundária. Reabilitação = terciária. Promoção da saúde é **inespecífica** (educação, saneamento), diferente de proteção específica.` },
      { t: "Tipos de estudo epidemiológico", r: `**Observacionais:**
- **Ecológico** — unidade é a população (risco: falácia ecológica).
- **Transversal** — exposição e desfecho ao mesmo tempo (prevalência).
- **Caso-controle** — parte do **desfecho** → mede **odds ratio**; bom para doenças raras.
- **Coorte** — parte da **exposição** → mede **incidência e risco relativo**; bom para exposições raras.

**Experimentais:**
- **Ensaio clínico randomizado (ECR)** — maior nível de evidência individual; randomização controla confusão.
- **Revisão sistemática/metanálise** — topo da pirâmide.

**Medidas:** RR e OR (associação); risco atribuível; NNT.

**Pegadinha.** Caso-controle → **OR**, retrospectivo, doença rara. Coorte → **RR/incidência**, exposição rara. Transversal não estabelece causalidade (temporalidade).` },
      { t: "Testes diagnósticos: sensibilidade e especificidade", r: `- **Sensibilidade** — capacidade de detectar **doentes** (poucos falsos-negativos). Teste **S**ensível **N**egativo a**Out** (**SnNout**): bom para **excluir**.
- **Especificidade** — capacidade de identificar **sadios** (poucos falsos-positivos). **SpPin**: bom para **confirmar**.
- **VPP/VPN** — dependem da **prevalência** (VPP sobe com prevalência).
- **Razão de verossimilhança (LR)** — independe da prevalência.

**Rastreamento** prioriza **sensibilidade** (não perder casos); confirmação prioriza **especificidade**.

**Pegadinha.** VPP e VPN **variam com a prevalência**; sensibilidade e especificidade são propriedades do teste. Teste sensível serve para **triar/excluir**.` },
      { t: "Saúde do trabalhador e ambiental", r: `**Nexo causal:** relação entre agravo e trabalho. **Notificação** de acidentes/doenças do trabalho (SINAN, CAT).

**Classificação de Schilling:** I (trabalho é causa necessária — ex.: intoxicação por chumbo), II (trabalho é fator contributivo — ex.: HAS agravada), III (trabalho agrava doença preexistente).

**Acidente de trabalho** inclui o **trajeto**. **CAT** (Comunicação de Acidente de Trabalho) é obrigatória.

**Saúde ambiental:** água, ar, solo, resíduos, vetores, mudanças climáticas, desastres.

**Pegadinha.** CAT é obrigatória mesmo sem afastamento. Acidente de trajeto conta. LER/DORT são exemplos frequentes.` },
      { t: "Imunização: princípios e rede de frio", r: `**Tipos de vacina:** vivas atenuadas (BCG, tríplice viral, febre amarela, rotavírus, varicela) vs. inativadas/subunidades (hepatite B, VIP, pentavalente, HPV).

**Vivas atenuadas:** contraindicadas em **imunossuprimidos graves e gestantes** (regra geral); intervalo entre vivas injetáveis (mesmo dia ou ≥30 dias).

**Rede de frio:** conservação **+2°C a +8°C** na ponta. Falha na cadeia inutiliza doses.

**Falsas contraindicações:** doença leve, febre baixa, desnutrição, uso de antibiótico, prematuridade (vacinar pela idade cronológica).

**Pegadinha.** Vírus vivo em imunossuprimido/gestante = cuidado. Resfriado leve **não** contraindica. Aproveitar oportunidade vacinal.` },
      { t: "Políticas e programas de saúde", r: `**Programas/políticas frequentes:**
- **Rede Cegonha / atenção materno-infantil.**
- **Programa Nacional de Imunizações (PNI).**
- **Política de saúde mental (RAPS).**
- **Programas de HIV/IST, tuberculose, hanseníase.**
- **Saúde da pessoa idosa, da mulher, do homem, da população negra, indígena, LGBT.**

**Atenção às condições crônicas (linhas de cuidado).**

**Judicialização da saúde:** acesso via Judiciário — tensão entre direito individual e coletividade/RENAME.

**Pegadinha.** Conhecer o público de cada política. RENAME/RENASES definem o que o SUS oferece. Equidade orienta políticas para populações vulneráveis específicas.` },
      { t: "Bioestatística aplicada", r: `**Medidas de tendência central:** média (sensível a outliers), mediana (robusta), moda.

**Dispersão:** desvio-padrão, variância, amplitude.

**Testes de hipótese:** **valor de p** (<0,05 = estatisticamente significativo, rejeita H0); **intervalo de confiança (IC95%)** — se cruza 1 (RR/OR) ou 0 (diferença), não significativo.

**Erros:** **tipo I (α)** = falso-positivo (rejeitar H0 verdadeira); **tipo II (β)** = falso-negativo. **Poder** = 1−β.

**Pegadinha.** IC95% que **cruza 1** (para RR/OR) = sem significância. p<0,05 é significância estatística, mas **não** garante relevância clínica. Erro tipo I = falso-positivo.` },
    ],
  },
  clinica: {
    nome: "Clínica Médica",
    prio: "alta",
    temas: [
      { t: "Hipertensão arterial: diagnóstico e tratamento", r: `**Diagnóstico:** PA **≥140/90** em ≥2 medidas em ocasiões diferentes. Confirmar com **MAPA** (vigília ≥135/85) ou **MRPA** (≥130/80). Detecta avental branco e mascarada.

**Classificação:** normal <120/80; pré-HAS 121-139/81-89; **estágio 1** 140-159/90-99; **estágio 2** 160-179/100-109; **estágio 3** ≥180/110.

**Metas:** geral **<140/90**; **<130/80** se alto risco e tolerado. Idoso frágil: menos rígida.

**Tratamento:** não farmacológico sempre (DASH, sódio, peso, álcool, exercício). Farmacológico: **IECA/BRA, BCC, tiazídicos** (1ª linha); **combinação dupla precoce** na maioria.

**Pegadinha.** Não diagnosticar com **uma** medida (salvo PA muito alta com LOA). IECA + BRA **não** se associam. Negros/idosos: BCC e diuréticos preferenciais.` },
      { t: "Diabetes mellitus: diagnóstico e manejo", r: `**Diagnóstico (confirmar se assintomático):** jejum **≥126**, TOTG 2h **≥200**, **HbA1c ≥6,5%**, ou aleatória ≥200 + sintomas.

**Pré-diabetes:** jejum 100-125; TOTG 140-199; HbA1c 5,7-6,4%.

**Metas:** HbA1c **<7%** (individualizar; <6,5% jovens, <8% idoso frágil).

**Tratamento:** estilo de vida + **metformina** (1ª linha). **iSGLT2 / GLP-1** priorizados se **DCV, IC ou DRC**. Insulina se hiperglicemia franca/falência oral.

**Rastreio de complicações:** fundo de olho, microalbuminúria/TFG, pé diabético, perfil lipídico.

**Pegadinha.** HbA1c reflete ~3 meses (falseada por anemia/hemoglobinopatia). iSGLT2/GLP-1 entram cedo se doença CV/renal. Um exame alterado isolado em assintomático → confirmar.` },
      { t: "Estratificação de risco cardiovascular e dislipidemia", r: `**Risco CV global** guia metas (escores de risco). Categorias: baixo, intermediário, alto, muito alto.
- **Muito alto:** doença aterosclerótica clínica (IAM, AVC, DAP).
- **Alto:** DM com fatores/LOA, DRC, LDL muito alto.

**Metas de LDL:** muito alto **<50**; alto **<70**; intermediário **<100**; baixo **<130 mg/dL**.

**Tratamento:** **estatina** (base; intensidade pelo risco) → **ezetimiba** → **iPCSK9**. TG **≥500** → risco de pancreatite (fibrato).

**Pegadinha.** IAM/AVC prévio = muito alto risco **automático** (sem calcular escore). LDL é o alvo, não colesterol total.` },
      { t: "Asma e DPOC", r: `**Asma:** obstrução **reversível** (espirometria: ↑VEF1 ≥12% e 200mL pós-BD). Tratamento por etapas (GINA) com **corticoide inalatório ± formoterol**; **não usar SABA isolado**.

**DPOC:** obstrução **pouco reversível** (**VEF1/CVF <0,70** pós-BD), ligada ao tabagismo. Manutenção: **LABA/LAMA** ± CI (eosinofilia/exacerbações). **Cessar tabagismo** e **oxigenoterapia** (hipoxêmicos) reduzem mortalidade.

**Exacerbação DPOC:** broncodilatador, corticoide, antibiótico se sinais de infecção (escarro purulento).

**Pegadinha.** Asma reversível × DPOC fixo. Na DPOC, só param a progressão: **parar de fumar** e **O2 domiciliar** (hipoxemia crônica).` },
      { t: "Doença renal crônica", r: `**Definição:** alteração de estrutura/função renal por **≥3 meses**. TFG <60 e/ou marcadores (albuminúria).

**Rastreio (HAS, DM):** **TFG (CKD-EPI)** + **albuminúria (RAC)**.

**Estadiamento (KDIGO):** TFG G1-G5 + albuminúria A1-A3. Pior prognóstico quanto menor TFG e maior albuminúria.

**Conduta:** controlar PA/glicemia; **IECA/BRA** se albuminúria; **iSGLT2** (nefroproteção); evitar nefrotóxicos; encaminhar em G4/declínio rápido.

**Pegadinha.** Exige **cronicidade** (senão é LRA). IECA/BRA podem ↑creatinina até ~30% (aceitável). Só creatinina não estadia.` },
      { t: "Insuficiência cardíaca", r: `**Classificação por FEVE:** ICFEr ≤40%; levemente reduzida 41-49%; **preservada ≥50%**.

**Diagnóstico:** clínica + **eco** + **BNP/NT-proBNP**. Principal causa: isquêmica.

**Tratamento ICFEr (4 pilares, reduzem mortalidade):** **IECA/BRA ou ARNI** + **betabloqueador** + **espironolactona** + **iSGLT2**. Diurético de alça para **congestão** (sintomático).

**NYHA I-IV** (funcional).

**Pegadinha.** Diurético **não** reduz mortalidade (só sintoma). ARNI **não** com IECA (angioedema; washout). Betabloqueador inicia **compensado**.` },
      { t: "Fibrilação atrial e arritmias", r: `**Fibrilação atrial (FA):** ritmo irregularmente irregular, sem onda P. Risco principal: **AVC cardioembólico**.

**Manejo:** controle de **frequência** (betabloqueador, BCC) vs. **ritmo** (cardioversão/antiarrítmico); **anticoagulação** conforme risco.

**Anticoagulação — escore CHA₂DS₂-VASc:** IC, HAS, Idade ≥75 (2pts), DM, AVC/AIT prévio (2pts), doença vascular, idade 65-74, sexo feminino. Anticoagular geralmente se **≥2 (homem) / ≥3 (mulher)**. Risco de sangramento: **HAS-BLED**.

**Instabilidade** (hipotensão, dor, IC, alteração de consciência) → **cardioversão elétrica** imediata.

**Pegadinha.** FA de alto risco embólico → anticoagular (DOAC ou varfarina), **não** AAS. Instabilidade = choque sincronizado.` },
      { t: "Pneumonia adquirida na comunidade", r: `**Clínica:** tosse, febre, dispneia, dor pleurítica; estertores. Principal agente: **pneumococo**.

**Gravidade (CURB-65):** **C**onfusão, **U**reia >50, **R**FR ≥30, **B**PA <90/60, **65** anos. 0-1 ambulatorial; ≥2 considerar internação.

**Tratamento ambulatorial:** **amoxicilina** (± macrolídeo) ou betalactâmico; hígido sem comorbidade. Internado: betalactâmico + macrolídeo ou quinolona respiratória.

**Pegadinha.** CURB-65 orienta local de tratamento. Derrame parapneumônico → avaliar toracocentese (empiema). Radiografia confirma, mas não atrasar antibiótico no grave.` },
      { t: "Distúrbios da tireoide", r: `**Hipotireoidismo:** **TSH alto, T4 livre baixo** (primário). Causa comum: **Hashimoto** (anti-TPO). Clínica: fadiga, ganho de peso, intolerância ao frio, bradicardia. Tratamento: **levotiroxina**.
- **Subclínico:** TSH alto, T4 normal — tratar conforme TSH/sintomas/gestação.

**Hipertireoidismo:** **TSH baixo, T4/T3 alto**. Causa comum: **Doença de Graves** (TRAb, bócio, oftalmopatia). Clínica: perda de peso, taquicardia, tremor, intolerância ao calor. Tratamento: **metimazol**, betabloqueador, iodo radioativo/cirurgia.

**Pegadinha.** TSH é o melhor teste inicial. Hipo primário: **TSH↑ T4↓**. Na gestação, hipotireoidismo deve ser tratado (risco fetal). Tempestade tireoidiana é emergência.` },
      { t: "Anemias", r: `**Classificação por VCM:**
- **Microcítica:** **ferropriva** (mais comum — ferritina baixa), talassemia, doença crônica.
- **Normocítica:** doença crônica, hemolítica, aguda.
- **Macrocítica:** **deficiência de B12/folato** (megaloblástica), hipotireoidismo, álcool.

**Ferropriva:** investigar **causa** (sangramento — TGI no adulto, menstrual na mulher). Tratamento: ferro oral + tratar causa.

**B12:** anemia + sintomas neurológicos (mielinose); causas: anemia perniciosa, veganismo, má absorção.

**Pegadinha.** Anemia ferropriva no homem/pós-menopausa → **investigar TGI** (câncer). Não repor só ferro sem achar a causa. B12 baixa dá sintoma **neurológico** (não repor folato isolado, que mascara).` },
      { t: "Doença do refluxo e dispepsia", r: `**DRGE:** pirose e regurgitação. Diagnóstico clínico; endoscopia se **sinais de alarme** (disfagia, emagrecimento, anemia, sangramento, idade >40-45 com sintomas novos). Tratamento: medidas comportamentais + **IBP**.

**Dispepsia:** investigar **H. pylori** (testar e tratar em <45 anos sem alarme); endoscopia se alarme.

**H. pylori:** associado a úlcera péptica e câncer gástrico. Erradicação: IBP + 2 antibióticos.

**Pegadinha.** **Sinais de alarme** → endoscopia (excluir neoplasia). Úlcera péptica: H. pylori e AINE são as causas. Úlcera gástrica exige controle de cura (risco de câncer).` },
      { t: "Infecção do trato urinário", r: `**Cistite:** disúria, polaciúria, urgência. Mulher jovem não complicada: tratamento empírico curto (nitrofurantoína, fosfomicina). **E. coli** é o principal agente.

**Pielonefrite:** febre, dor lombar, Giordano+. Antibiótico sistêmico; internar se grave/gestante.

**Bacteriúria assintomática:** tratar **apenas** em **gestantes** e antes de procedimento urológico invasivo.

**ITU complicada:** homem, gestante, sonda, anomalia, imunossupressão.

**Pegadinha.** Bacteriúria assintomática **não** se trata (exceto gestante/pré-procedimento). Gestante com bacteriúria → tratar (risco de pielonefrite/prematuridade). ITU em homem é sempre complicada.` },
      { t: "Cefaleias", r: `**Primárias:**
- **Migrânea (enxaqueca):** unilateral, pulsátil, foto/fonofobia, náusea, piora com esforço; ± aura. Tratamento: analgésico/triptano (crise); profilaxia se frequente.
- **Tensional:** bilateral, em peso, sem náusea.
- **Em salvas (cluster):** unilateral periorbitária, intensa, com sintomas autonômicos.

**Sinais de alarme (secundária — investigar/imagem):** início súbito "a pior da vida" (HSA), febre + rigidez de nuca (meningite), déficit focal, idade >50 nova (arterite temporal), imunossuprimido, piora progressiva, papiledema.

**Pegadinha.** Cefaleia **súbita e intensa** ("thunderclap") = investigar **hemorragia subaracnóidea** (TC + punção). Sinais de alarme mudam a conduta de sintomático para investigação.` },
      { t: "Acidente vascular cerebral (visão clínica)", r: `**Isquêmico (~85%):** déficit focal súbito. TC exclui hemorragia. **Trombólise até 4,5h**, trombectomia selecionada. Ver detalhes no módulo de Urgência.

**Hemorrágico:** TC com sangue. Controle pressórico, neurocirurgia conforme caso.

**AIT:** déficit transitório sem infarto — **urgência** (alto risco de AVC subsequente; escore ABCD²). Investigar e prevenir.

**Prevenção secundária:** antiagregante (isquêmico não cardioembólico), anticoagulação (FA), estatina, controle de fatores de risco.

**Pegadinha.** AIT não é "susto" — é sinal de alerta que exige investigação rápida. Na fase aguda do isquêmico, não baixar PA agressivamente (salvo trombólise/níveis muito altos).` },
      { t: "Tromboembolismo venoso (TVP e TEP)", r: `**TVP:** dor/edema assimétrico de membro. Escore de **Wells**; **D-dímero** (alto VPN) e **USG Doppler**.

**TEP:** dispneia súbita, dor torácica, taquicardia, hipoxemia. Wells/PERC; **angio-TC** de tórax. D-dímero exclui em baixa probabilidade.

**Tratamento:** **anticoagulação** (DOAC, HBPM); trombólise no TEP com instabilidade (maciço).

**Profilaxia:** avaliar risco em internados/cirúrgicos (mecânica/farmacológica).

**Pegadinha.** D-dímero **negativo** com baixa probabilidade **exclui** (alto VPN); positivo não confirma. TEP com **instabilidade** (hipotensão) → trombólise. Sempre avaliar profilaxia de TEV.` },
      { t: "Tuberculose", r: `**Agente:** *Mycobacterium tuberculosis*. **Transmissão** respiratória. Sintomático respiratório = **tosse ≥3 semanas**.

**Diagnóstico:** **TRM-TB (teste rápido molecular)** é o inicial preferencial; baciloscopia (BAAR) e cultura. RX de tórax (cavitação em ápices).

**Tratamento (esquema básico):** **RIPE** — **R**ifampicina, **I**soniazida, **P**irazinamida, **E**tambutol — 2 meses (ataque) + 4 meses RI (manutenção). **TDO** (tratamento diretamente observado).

**TB latente (ILTB):** PPD/IGRA + sem doença ativa → isoniazida ou rifapentina em grupos de risco.

**Notificação compulsória.** Rastrear **HIV** em todo caso.

**Pegadinha.** Tosse ≥3 semanas = investigar TB (TRM-TB). RIPE por 6 meses. Rifampicina → urina alaranjada, interage com anticoncepcional. Coinfecção HIV-TB deve ser sempre pesquisada.` },
      { t: "HIV/AIDS e ISTs", r: `**Diagnóstico HIV:** testes rápidos/sorologia (2 testes); carga viral e **CD4** para estadiamento/seguimento.

**TARV:** iniciar para **todos**, independente de CD4, precocemente (esquema preferencial no Brasil inclui **dolutegravir**). Meta: carga viral indetectável (**I = I**, indetectável = intransmissível).

**Profilaxias:** **PrEP** (pré-exposição, risco elevado), **PEP** (pós-exposição, até 72h).

**Sífilis:** treponêmico + não treponêmico (**VDRL**); tratamento **penicilina benzatina** (estágios). Sífilis na gestação → risco de sífilis congênita.

**Pegadinha.** TARV para todos, imediato. **PEP até 72h.** Sífilis: penicilina benzatina; gestante deve ser tratada (e o parceiro). Toda IST é oportunidade de testar HIV/sífilis/hepatites.` },
      { t: "Dengue e arboviroses", r: `**Dengue:** febre + mialgia, cefaleia, dor retro-orbitária, exantema. **Sinais de alarme:** dor abdominal intensa, vômitos persistentes, sangramento de mucosa, letargia, hepatomegalia, aumento do hematócrito com queda de plaquetas.

**Classificação:** dengue sem sinais de alarme (grupo A/B), **com sinais de alarme (C)**, **grave (D)** (choque, sangramento grave, disfunção orgânica).

**Manejo:** **hidratação** (pilar); grupos C/D → hidratação venosa e observação/internação. **Prova do laço**. Evitar AINE/AAS (sangramento).

**Chikungunya:** artralgia intensa e persistente. **Zika:** exantema, risco de microcefalia (gestante) e Guillain-Barré.

**Pegadinha.** Reconhecer **sinais de alarme** da dengue (fase crítica na defervescência). Não usar AINE/AAS. Hidratação é o pilar. Zika na gestação → malformação.` },
      { t: "Hepatites virais", r: `- **Hepatite A:** transmissão **fecal-oral**, aguda, autolimitada; vacina no calendário.
- **Hepatite B:** transmissão **sexual/sangue/vertical**; pode cronificar. Marcadores: **HBsAg** (infecção), anti-HBs (imunidade/vacina), HBeAg (replicação), anti-HBc (contato). Vacina previne.
- **Hepatite C:** sangue; **alta cronificação**; hoje **curável** com antivirais de ação direta.

**Interpretação sorológica B:** HBsAg+ = infecção; anti-HBs+ isolado = vacinado; anti-HBc total+ = contato prévio.

**Pegadinha.** Anti-HBs isolado positivo = **imunidade vacinal**. HBsAg+ >6 meses = crônica. Hepatite C tem tratamento curativo. Hepatite A é fecal-oral (autolimitada).` },
      { t: "Doenças negligenciadas (hanseníase, leishmaniose, outras)", r: `**Hanseníase:** *M. leprae*. **Lesões de pele com alteração de sensibilidade** (térmica/dolorosa/tátil), espessamento de nervo. Classificação: paucibacilar (≤5 lesões) × multibacilar. Tratamento: **PQT (poliquimioterapia)**. Notificação compulsória.

**Leishmaniose:** tegumentar (úlcera cutânea de bordas elevadas) e **visceral/calazar** (febre, hepatoesplenomegalia, pancitopenia — grave).

**Doença de Chagas:** *T. cruzi* (vetor barbeiro); fase aguda e crônica (cardiopatia, megacólon/megaesôfago).

**Esquistossomose, parasitoses intestinais:** conforme epidemiologia local.

**Pegadinha.** Hanseníase = **mancha com perda de sensibilidade** (dado-chave) → PQT. Calazar é a forma visceral grave. Chagas crônico → cardiopatia e megavísceras.` },
      { t: "Distúrbios hidroeletrolíticos", r: `**Sódio:**
- **Hiponatremia** — mais comum; sintomas neurológicos se aguda/grave. Corrigir **devagar** (risco de mielinólise pontina se rápido).
- **Hipernatremia** — déficit de água; repor com cautela.

**Potássio:**
- **Hipercalemia** — risco de **arritmia**; ECG (onda T apiculada → alargamento QRS). Tratamento: **gluconato de cálcio** (estabiliza membrana), insulina+glicose, beta-2, resina/diálise.
- **Hipocalemia** — fraqueza, arritmia; repor K (e magnésio).

**Pegadinha.** Hiponatremia se corrige **lentamente** (mielinólise). Hipercalemia com alteração de ECG = emergência → **gluconato de cálcio** primeiro (protege o coração), depois desloca/remove o K.` },
      { t: "Lúpus e doenças reumatológicas comuns", r: `**Lúpus (LES):** multissistêmico, mulher jovem. Manifestações: cutâneas (**rash malar**, fotossensibilidade), articulares, renais (nefrite), hematológicas, serosites. **FAN** sensível; anti-dsDNA e anti-Sm específicos.

**Artrite reumatoide:** poliartrite **simétrica** de pequenas articulações, rigidez matinal >1h; **fator reumatoide** e **anti-CCP**. Tratamento: **metotrexato** (DMARD).

**Osteoartrite:** degenerativa, dor mecânica (piora com uso), sem inflamação sistêmica.

**Gota:** monoartrite aguda (podagra — 1º metatarso), cristais de urato; ácido úrico.

**Pegadinha.** AR = simétrica, pequenas articulações, rigidez matinal prolongada (anti-CCP específico). Osteoartrite = dor mecânica sem inflamação. Gota = podagra + urato. Rash malar → pensar LES.` },
      { t: "Cetoacidose, complicações do diabetes e pé diabético", r: `**Complicações crônicas:**
- **Microvasculares:** retinopatia (rastrear fundo de olho), nefropatia (albuminúria/TFG), neuropatia.
- **Macrovasculares:** DAC, AVC, doença arterial periférica.

**Pé diabético:** neuropatia + isquemia + infecção. Rastrear com monofilamento; educar (calçados, inspeção diária). Úlcera → risco de amputação.

**CAD e EHH:** ver módulo de Urgência (hidratação, insulina, potássio).

**Pegadinha.** Rastrear complicações do DM a cada consulta (fundo de olho, albuminúria, pés). Pé diabético: prevenção (monofilamento, autocuidado) evita amputação. Neuropatia mascara a dor da úlcera.` },
    ],
  },
  urgencia: {
    nome: "Urgência e Emergência",
    prio: "alta",
    temas: [
      { t: "Parada cardiorrespiratória e RCP", r: `**Cadeia de sobrevivência:** reconhecer/acionar → **RCP precoce** → **desfibrilação precoce** → SAV → pós-PCR.

**RCP de qualidade:** **100-120/min**, profundidade **5-6 cm**, retorno total do tórax, mínima interrupção. **30:2** (sem via aérea avançada).

**Ritmos:**
- **Chocáveis (FV / TV sem pulso):** **desfibrilar** + RCP + adrenalina + amiodarona (refratária).
- **Não chocáveis (AESP / assistolia):** RCP + **adrenalina**, **não** chocar.

**Adrenalina 1mg IV a cada 3-5min.** Causas reversíveis: **5H/5T**.

**Pegadinha.** Adrenalina em **todos** os ritmos; choque **só** em FV/TVsp. Assistolia/AESP não desfibrila. Compressões de qualidade + desfibrilação precoce salvam.` },
      { t: "Síndrome coronariana aguda", r: `**Inicial:** **ECG em 10 min** + **troponina** + AAS.

- **Com supra de ST (SCACSST):** oclusão total → **reperfusão imediata** (ICP primária <90-120min ou trombólise até 12h).
- **Sem supra (SCASSST):** IAMSSST (troponina+) ou angina instável (troponina−). Estratificar (**GRACE/TIMI**), antiagregação dupla, anticoagulação, cateterismo conforme risco.

**Pegadinha.** Supra de ST → reperfusão **sem esperar troponina**. **Nitrato contraindicado** em IAM de VD e uso de sildenafil. Troponina diferencia IAMSSST de angina instável.` },
      { t: "Sepse e choque séptico", r: `**Sepse (Sepsis-3):** infecção + disfunção orgânica (↑SOFA ≥2).
**Choque séptico:** vasopressor para PAM ≥65 **+ lactato >2** apesar de volume.

**qSOFA (≥2):** FR ≥22, consciência alterada, PAS ≤100.

**Bundle inicial:** **lactato**, **hemoculturas antes do ATB**, **antibiótico amplo precoce (1ª hora)**, **cristaloide 30 mL/kg**, **noradrenalina** se refratário. Controlar foco.

**Pegadinha.** **Antibiótico precoce** é o que mais salva. Choque séptico = vasopressor **+** lactato apesar de volume. qSOFA é triagem.` },
      { t: "AVC agudo: reperfusão", r: `**Reconhecer:** FAST/Cincinnati. **TC de crânio urgente** (excluir hemorragia).

**Isquêmico:** **trombólise IV até 4,5h**; **trombectomia** (grande vaso, até 24h selecionado). Controle pressórico permissivo (mais rígido se trombolisar).

**Hemorrágico:** controle de PA, reverter anticoagulação, neurocirurgia conforme caso.

**Pegadinha.** **Sempre TC antes de trombolisar.** Sintomas ao acordar usam último horário visto bem. Não baixar PA agressivamente no isquêmico agudo (salvo trombólise). Tempo é cérebro.` },
      { t: "Anafilaxia", r: `**Diagnóstico:** início rápido com ≥2 sistemas (pele, respiratório, CV, GI) ou hipotensão pós-alérgeno.

**Tratamento:** **Adrenalina IM na coxa** (0,3-0,5mg adulto; 0,01mg/kg criança; 1:1000), **repetir a cada 5-15min**. Decúbito com pernas elevadas, O2, volume. Anti-histamínico/corticoide/broncodilatador = **adjuvantes**.

**Reação bifásica:** observação prolongada.

**Pegadinha.** Erro clássico: dar anti-histamínico/corticoide e **atrasar adrenalina** (mata). Adrenalina é **IM na coxa**, não SC, não deltoide. Sem contraindicação absoluta na anafilaxia.` },
      { t: "Atendimento ao politraumatizado (ABCDE)", r: `- **A** — via aérea + **coluna cervical**. Glasgow ≤8 → intubar.
- **B** — ventilação: tratar **pneumotórax hipertensivo** (descompressão clínica, antes do RX), aberto, hemotórax maciço, tórax instável.
- **C** — circulação + **controle de hemorragia**; 2 acessos, cristaloide + **hemoderivados**.
- **D** — Glasgow, pupilas.
- **E** — exposição + **evitar hipotermia** (tríade letal: hipotermia, acidose, coagulopatia).

**Secundária:** exame completo + história **AMPLA**.

**Pegadinha.** Sequência rígida. **Pneumotórax hipertensivo é clínico** (descomprimir antes do RX). Hipotensão no trauma = hemorragia. Reanimar com hemoderivados, não só cristaloide.` },
      { t: "Choque: classificação e manejo", r: `**Tipos:**
- **Hipovolêmico** — perda de volume/sangue (hemorragia, desidratação). JVP baixa. → volume/sangue.
- **Cardiogênico** — falência de bomba (IAM). JVP alta, congestão. → suporte, revascularização.
- **Distributivo** — vasodilatação (**séptico**, anafilático, neurogênico). → volume + vasopressor.
- **Obstrutivo** — TEP, tamponamento, pneumotórax hipertensivo. → tratar a causa.

**Sinais:** hipotensão, taquicardia, oligúria, alteração de consciência, lactato/enchimento capilar.

**Pegadinha.** Diferenciar pelo perfil hemodinâmico (JVP/congestão). Cardiogênico: cuidado com volume. Obstrutivo exige intervenção específica (drenar tamponamento/pneumotórax).` },
      { t: "Emergências hipertensivas e glicêmicas", r: `**Emergência hipertensiva:** PA muito alta **+ lesão aguda de órgão-alvo** → anti-hipertensivo IV, redução **controlada** (~25% na 1ª hora; exceção: **dissecção de aorta**, baixar rápido). Sem lesão = **urgência** (oral).

**Hipoglicemia:** glicose VO (consciente) ou **glicose hipertônica IV**. 1ª medida em rebaixamento sem causa clara.

**CAD:** hiperglicemia + acidose com ânion-gap + cetose (DM1). **Hidratação + insulina IV + repor potássio**.

**EHH:** hiperglicemia extrema (>600) + hiperosmolaridade, sem cetoacidose (DM2/idoso). Hidratação é o pilar.

**Pegadinha.** Define emergência a **lesão de órgão**, não o número. **Repor K na CAD** (insulina baixa o K). Sempre checar glicemia em rebaixamento.` },
      { t: "Intoxicações exógenas e antídotos", r: `**Abordagem geral:** ABCDE, descontaminação (carvão ativado se <1h e via aérea protegida), antídoto específico, suporte.

**Antídotos-chave:**
- **Opioide** → **naloxona**.
- **Benzodiazepínico** → flumazenil (cuidado: convulsão).
- **Paracetamol** → **N-acetilcisteína**.
- **Organofosforado** → **atropina** (+ pralidoxima).
- **Metanol/etilenoglicol** → etanol/fomepizol.
- **Ferro** → desferroxamina.

**Síndromes:** colinérgica (organofosforado — miose, sialorreia, bradicardia), anticolinérgica, opioide (miose, depressão respiratória).

**Pegadinha.** Rebaixamento + miose + FR baixa = **opioide** → naloxona. Paracetamol tem antídoto tempo-dependente (NAC). Organofosforado → atropina até atropinização.` },
      { t: "Queimaduras e afogamento", r: `**Queimaduras — profundidade:** 1º grau (epiderme, eritema), 2º (bolhas, dor), 3º (indolor, esbranquiçada/carbonizada).

**Superfície (regra dos 9)** e reposição volêmica (**Parkland**) nos extensos. Cuidado com **via aérea** (queimadura de face/inalação) e complicações.

**Critérios de gravidade:** extensão, face/mãos/períneo, inalação, elétrica/química, extremos de idade.

**Afogamento:** hipoxemia é o problema central; priorizar **ventilação/oxigenação** e RCP (começar por vias aéreas/ventilação).

**Pegadinha.** Queimadura de via aérea (rouquidão, fuligem, pelos nasais chamuscados) → risco de obstrução, intubar precocemente. Parkland guia volume nas grandes queimaduras.` },
      { t: "Insuficiência respiratória e ventilação", r: `**Tipos:** **hipoxêmica** (tipo I — falha de oxigenação, ex.: SDRA, pneumonia) × **hipercápnica** (tipo II — falha de ventilação, ex.: DPOC, depressão do SNC).

**Suporte de O2:** cânula, máscara, alto fluxo; **VNI (ventilação não invasiva)** em DPOC exacerbada e edema agudo de pulmão. **Intubação** se falha, rebaixamento (Glasgow ≤8), fadiga.

**Edema agudo de pulmão cardiogênico:** dispneia, estertores, hipertensão; **VNI + nitrato + diurético**, sentar o paciente.

**Pegadinha.** VNI é 1ª linha no EAP cardiogênico e na exacerbação de DPOC (evita intubação). Tipo I = oxigenação; tipo II = ventilação (retém CO2). Glasgow ≤8 → intubar.` },
      { t: "Abdome agudo e dor abdominal na emergência", r: `**Abordagem:** estabilizar, história/exame, **beta-hCG na mulher**, exames (hemograma, amilase/lipase, lactato, função renal/hepática), imagem (USG/TC).

**Causas que não podem passar:** ectópica rota, aneurisma roto, isquemia mesentérica, apendicite, obstrução com estrangulamento, perfuração, pancreatite grave, IAM de parede inferior (dor epigástrica).

**Pancreatite aguda:** dor epigástrica em faixa, **amilase/lipase ≥3x**; causas: **biliar e álcool**; gravidade (Ranson/APACHE). Manejo: hidratação, analgesia, jejum.

**Pegadinha.** IAM inferior pode simular abdome agudo (fazer ECG). Sempre beta-hCG na mulher. Lipase ≥3x = pancreatite (biliar/álcool). Dor desproporcional no idoso = isquemia mesentérica.` },
      { t: "Distúrbios do equilíbrio ácido-base", r: `**Passos:** ver **pH** (acidose <7,35 / alcalose >7,45), depois se é **respiratória (pCO2)** ou **metabólica (HCO3)**, e a **compensação**.

- **Acidose metabólica** — HCO3 baixo. **Ânion-gap elevado** (cetoacidose, lactato, uremia, intoxicações) × normal (perda de bicarbonato, diarreia).
- **Alcalose metabólica** — HCO3 alto (vômitos, diuréticos).
- **Acidose respiratória** — pCO2 alto (hipoventilação, DPOC).
- **Alcalose respiratória** — pCO2 baixo (hiperventilação).

**Ânion-gap** = Na − (Cl + HCO3).

**Pegadinha.** Acidose metabólica com **ânion-gap alto** → "MUDPILES/cetoacidose/lactato/uremia". Diarreia dá acidose de AG normal (perde bicarbonato). Sempre avaliar compensação esperada.` },
    ],
  },
  go: {
    nome: "Ginecologia e Obstetrícia",
    prio: "alta",
    temas: [
      { t: "Pré-natal: rotina e exames", r: `**Consultas:** ≥6, início até 12 sem. IG e DPP (Naegele).

**1º tri:** tipagem/Rh, Coombs, hemograma, glicemia, **HIV, VDRL, HBsAg, toxoplasmose**, urina+urocultura, USG. **2º tri:** **TOTG 24-28 sem**, USG morfológica. **3º tri:** repetir sorologias, **estreptococo B 35-37 sem**.

**Suplementação:** **ácido fólico** (pré-concepção-12sem), ferro. **Vacinas:** dTpa, hepatite B, influenza.

**Toda consulta:** PA, peso, altura uterina, BCF, movimentos.

**Pegadinha.** dTpa a cada gestação (protege RN da coqueluche). Ácido fólico previne tubo neural. Vírus vivo contraindicado.` },
      { t: "Síndromes hipertensivas da gestação", r: `**Pré-eclâmpsia:** PA **≥140/90 após 20 sem** + proteinúria **ou** disfunção orgânica.

**Gravidade:** PA ≥160/110, sintomas neurológicos, epigastralgia, plaquetopenia, alteração hepática/renal. **HELLP:** Hemólise + ↑enzimas hepáticas + plaquetopenia.

**Conduta:** **sulfato de magnésio** (previne/trata eclâmpsia; antídoto **gluconato de cálcio**), anti-hipertensivo se ≥160/110, **resolução** conforme IG/gravidade. **Prevenção:** **AAS** em alto risco (1º tri), cálcio.

**Pegadinha.** Pode não ter proteinúria (basta disfunção orgânica). Sulfato **não** é anti-hipertensivo. Cura = **parto**. Intoxicação por Mg: arreflexia → depressão respiratória.` },
      { t: "Diabetes gestacional", r: `**Rastreio:** glicemia jejum na 1ª consulta (≥126 = DM prévio; 92-125 = DMG); **TOTG 75g 24-28 sem** se jejum <92.

**Diagnóstico (1 valor):** jejum **≥92**, 1h **≥180**, 2h **≥153**.

**Manejo:** dieta + exercício (1ª linha); **insulina** se não atingir metas. Metas: jejum <95, 1h <140, 2h <120.

**Repercussões:** macrossomia, distocia, hipoglicemia neonatal. **Reavaliar 6-12 sem pós-parto** (TOTG).

**Pegadinha.** **Um** valor alterado fecha DMG. **Insulina** é o fármaco de escolha. Reavaliar após parto (risco de DM2).` },
      { t: "Hemorragias da gestação", r: `**1ª metade:** abortamento (colo aberto/fechado), **ectópica** (dor+atraso+sangramento; rota = emergência), mola (hCG muito alto, "tempestade de neve").

**2ª metade:**
- **Placenta prévia** — sangramento **INDOLOR**, vermelho-vivo, recorrente. USG; **não tocar**.
- **DPP (descolamento)** — **dor + hipertonia** + sangramento (pode ser oculto); associado a **HAS/trauma**. Sofrimento fetal. Emergência.

**Pegadinha.** Prévia = **indolor**; DPP = **dor + hipertonia**. Idade fértil + dor + atraso = excluir **ectópica** (beta-hCG + USG). Não tocar na suspeita de prévia.` },
      { t: "Rastreio de câncer de colo e mama", r: `**Colo:** **citopatológico dos 25-64 anos** com vida sexual; após 2 anuais normais, **a cada 3 anos**. Agente: **HPV** (vacina previne).

**Mama:** no SUS, **mamografia 50-69 anos, bienal**; exame clínico. Sociedades defendem início aos 40. Alto risco (BRCA) → precoce.

**Sinais de alerta mama:** nódulo endurecido, retração, descarga sanguinolenta, linfonodo axilar.

**Pegadinha.** Colo: 25-64, trienal após 2 normais. Mama SUS: **50-69, bienal** (ler "segundo o MS"). HPV é causa necessária do câncer de colo.` },
      { t: "Planejamento reprodutivo e contracepção", r: `**Escolha** por preferência, eficácia e **elegibilidade OMS (1-4)**.

- **Barreira** — única que previne **IST** (dupla proteção).
- **Combinados** — contraindicados: **tabagismo ≥35a**, **enxaqueca com aura**, HAS não controlada, **TEV/trombofilia**.
- **Progestagênio isolado** — opção na amamentação/risco de TEV.
- **LARC (DIU cobre/hormonal, implante)** — **mais eficazes**, reversíveis.
- **Emergência** — levonorgestrel até 72-120h.

**Pegadinha.** **Enxaqueca com aura + estrogênio = risco de AVC** (contraindicado). LARCs são os mais eficazes (independem de adesão). Preservativo = única proteção contra IST.` },
      { t: "Sangramento uterino anormal", r: `Excluir **gravidez** primeiro (beta-hCG).

**PALM-COEIN:** estruturais (**P**ólipo, **A**denomiose, **L**eiomioma, **M**alignidade) · não estruturais (**C**oagulopatia, **O**vulatória, **E**ndometrial, **I**atrogênica, **N**ão classificada).

**Investigar endométrio (biópsia)** se risco de malignidade: **>45 anos**, obesidade, SOP, anovulação, tamoxifeno, espessamento.

**Conduta:** direcionada; hormonal (combinado, progestagênio, **DIU-LNG**), antifibrinolítico, cirúrgico se estrutural.

**Pegadinha.** **Pós-menopausa: qualquer sangramento = investigar câncer de endométrio** (biópsia). Sempre afastar gravidez em idade fértil.` },
      { t: "Infecções ginecológicas e ISTs", r: `**Corrimentos:**
- **Candidíase** — prurido, corrimento branco "leite coalhado", pH <4,5. → azólico.
- **Vaginose bacteriana** — corrimento acinzentado, odor de peixe, **clue cells**, pH >4,5. → metronidazol.
- **Tricomoníase** — corrimento amarelo-esverdeado, colo "em framboesa", IST. → metronidazol (tratar parceiro).

**Úlceras genitais:** sífilis (cancro duro, indolor), herpes (vesículas dolorosas), cancroide (doloroso).

**DIP (doença inflamatória pélvica):** dor pélvica, febre, dor à mobilização do colo; ISTs (clamídia, gonococo). Antibiótico amplo.

**Pegadinha.** VB: odor de peixe + clue cells + pH>4,5. Abordagem sindrômica das ISTs. DIP não tratada → infertilidade/ectópica. Sífilis: cancro **indolor**.` },
      { t: "Assistência ao parto e puerpério", r: `**Períodos do parto:** dilatação, expulsivo, dequitação (placenta), 4º período (1ª hora, hemostasia).

**Partograma:** acompanha a evolução; identifica distocias.

**Hemorragia pós-parto (HPP):** principal causa = **atonia uterina**. Manejo: massagem, **ocitocina**, misoprostol, ácido tranexâmico; investigar 4 "T" (Tônus, Trauma, Tecido, Trombina).

**Puerpério:** involução uterina, loquiação, apoio à amamentação, contracepção, rastrear **depressão pós-parto**.

**Pegadinha.** HPP: pensar **atonia** primeiro (útero amolecido) → ocitocina + massagem. Ocitocina profilática no 3º período reduz HPP.` },
      { t: "Climatério e menopausa", r: `**Menopausa:** cessação da menstruação por **12 meses** (média ~50 anos). Climatério: transição.

**Sintomas:** fogachos, atrofia urogenital, alterações do sono/humor, risco ósseo (osteoporose) e cardiovascular aumentados.

**Terapia hormonal (TH):** alívio de sintomas vasomotores; **janela de oportunidade** (<60 anos / <10 anos de menopausa). Contraindicações: câncer de mama, TEV, doença hepática, sangramento não esclarecido.

**Pegadinha.** TH tem **contraindicações** (câncer de mama, TEV) e janela de tempo. Atrofia vaginal isolada → estrogênio **tópico**. Rastrear osteoporose (densitometria) na pós-menopausa com fatores de risco.` },
      { t: "Infertilidade e endometriose", r: `**Infertilidade:** ausência de gravidez após **12 meses** de tentativas (6 meses se >35 anos). Investigar casal: fator ovulatório, tubário, uterino, masculino (espermograma).

**Endometriose:** tecido endometrial fora do útero. **Dismenorreia progressiva, dispareunia, dor pélvica crônica, infertilidade.** Diagnóstico: clínica + imagem (± laparoscopia). Tratamento: hormonal (supressão), cirúrgico.

**SOP (síndrome dos ovários policísticos):** critérios de Rotterdam (2 de 3): oligo/anovulação, hiperandrogenismo, ovários policísticos. Associada a resistência insulínica.

**Pegadinha.** Endometriose: **dismenorreia progressiva + dispareunia + infertilidade**. SOP: irregularidade menstrual + hiperandrogenismo + resistência à insulina. Investigar infertilidade após 12 meses (ou 6 se >35a).` },
    ],
  },
  pediatria: {
    nome: "Pediatria",
    prio: "alta",
    temas: [
      { t: "Crescimento e desenvolvimento", r: `**Crescimento:** peso, estatura, PC, IMC nas curvas OMS (escore-z −2 a +2). Velocidade importa mais que ponto isolado.

**Marcos:** sorriso social 2m; sustento cefálico 3-4m; senta sem apoio 6-9m; pinça 9m; anda 12m; primeiras palavras 12m; frases 2 palavras 24m.

**Alerta:** não sentar aos 9m, não andar aos 18m, não falar aos 18m; **regressão = sempre patológica**.

**Pegadinha.** Prematuro: **corrigir idade** até ~2 anos. Regressão de habilidade é bandeira vermelha.` },
      { t: "Calendário vacinal da criança", r: `- **Nascer:** BCG, Hepatite B.
- **2m:** Penta, VIP, Pneumo 10, Rotavírus.
- **3m:** Meningo C.
- **4m:** Penta, VIP, Pneumo 10, Rotavírus.
- **5m:** Meningo C.
- **6m:** Penta, VIP; influenza (anual).
- **9m:** Febre amarela.
- **12m:** Tríplice viral, reforços Pneumo/Meningo C.
- **15m:** DTP, VOP, Hepatite A, Tetra viral.
- **4a:** DTP, VOP, varicela, FA reforço.

**Pegadinha.** BCG + HepB ao nascer. Tríplice viral aos 12m. Rotavírus tem **limite de idade**. Vírus vivo contraindicado em imunossupressão. Falsas contraindicações não impedem vacinar.` },
      { t: "IVAS e pneumonia na infância", r: `**IVAS:** maioria **viral** → sintomático. Faringite estreptocócica (exsudato, sem tosse) → penicilina/amoxicilina (previne febre reumática). Otite média: amoxicilina se indicado.

**Pneumonia — taquipneia (AIDPI):** <2m ≥60; 2-11m ≥50; 1-5a ≥40. **Tiragem subcostal = gravidade**. Pneumococo é a principal bacteriana. Ambulatorial: **amoxicilina**.

**Bronquiolite (VSR):** lactente, sibilância, pródromo viral; suporte (O2, hidratação), **não** rotina de broncodilatador/corticoide.

**Pegadinha.** Taquipneia = sinal mais sensível de pneumonia. <2m com pneumonia → internar. Bronquiolite é suporte.` },
      { t: "Diarreia e desidratação", r: `**Planos:**
- **A** (sem desidratação): TRO em casa + alimentação + **zinco**.
- **B** (desidratação): **TRO supervisionada** ~75 mL/kg em 4h.
- **C** (grave/choque): **hidratação venosa** imediata.

**Manter alimentação/aleitamento.** Antibiótico só em casos específicos (disenteria/cólera/grave).

**Pegadinha.** TRO é o pilar. Manter alimentação. Zinco recomendado. Não usar antidiarreico de rotina. Plano C = veia.` },
      { t: "Aleitamento e alimentação complementar", r: `**Exclusivo até 6 meses** (sem água/chá), **complementado até 2 anos+**. Colostro rico em **IgA**.

**Pega correta** previne fissuras. **Mastite não contraindica** amamentar (esvaziar a mama). Livre demanda.

**Contraindicações:** HIV (Brasil), HTLV, algumas drogas, galactosemia.

**Complementar (6m):** alimentos variados, evitar açúcar/ultraprocessados, ofertar ferro.

**Pegadinha.** Exclusivo sem água nem chá. HIV materno contraindica (Brasil). Mastite → manter amamentação.` },
      { t: "Síndromes do recém-nascido", r: `**Icterícia:** fisiológica (**após 24h**, autolimitada) × patológica (**<24h**, direta elevada = colestase, ascensão rápida). Risco: **kernicterus**. Tratamento: fototerapia.

**Desconforto respiratório:** membrana hialina (prematuro), taquipneia transitória (cesárea), aspiração meconial, sepse.

**Sepse neonatal:** precoce (<72h, estreptococo B) × tardia; sinais inespecíficos.

**Triagens:** pezinho, olhinho (reflexo vermelho), orelhinha, coraçãozinho.

**Pegadinha.** **Icterícia <24h = sempre patológica.** **Bilirrubina direta elevada = colestase** (investigar atresia de vias biliares — tempo crítico).` },
      { t: "Sinais de alarme e criança grave", r: `**Sinais gerais de perigo (AIDPI):** não bebe/mama, vomita tudo, convulsões, letargia/inconsciência → **referência urgente**.

**Avaliação:** triângulo pediátrico (aparência, respiração, circulação); ABCDE. **Hipotensão é sinal TARDIO** na criança (compensa por taquicardia).

**Sinais precoces de choque:** taquicardia, **enchimento capilar lento**, extremidades frias.

**Pegadinha.** Não esperar a PA cair — taquicardia e enchimento capilar lento vêm antes. Deterioração **respiratória** é a via mais comum para parada na criança.` },
      { t: "Doenças exantemáticas", r: `- **Sarampo:** febre alta, tosse, coriza, conjuntivite, **manchas de Koplik**, exantema craniocaudal. Notificação imediata.
- **Rubéola:** exantema + linfadenopatia retroauricular; risco na gestação (síndrome congênita).
- **Escarlatina:** estreptococo; língua em framboesa, exantema em lixa.
- **Exantema súbito (roséola):** febre alta que cessa → exantema; HHV-6.
- **Eritema infeccioso:** "face esbofeteada"; parvovírus B19.
- **Varicela:** vesículas em várias fases ("céu estrelado").

**Pegadinha.** **Koplik = sarampo** (patognomônico). Sarampo é notificação **imediata**. Rubéola/parvovírus preocupam na gestação.` },
      { t: "Puericultura: prevenção e triagens", r: `**Triagens neonatais** (obrigatórias): pezinho (fenilcetonúria, hipotireoidismo congênito, anemia falciforme, fibrose cística, etc.), olhinho, orelhinha, coraçãozinho.

**Prevenção:** posição **supina** para dormir (morte súbita), segurança no transporte, prevenção de acidentes por faixa etária, suplementação (ferro, vitamina D).

**Cólica do lactente, refluxo fisiológico:** orientação e sinais de alarme.

**Pegadinha.** Hipotireoidismo congênito: triar e tratar precoce evita déficit cognitivo (tempo crítico). Posição supina reduz morte súbita.` },
      { t: "Emergências pediátricas comuns", r: `**Crise convulsiva febril:** 6m-5a, febre, convulsão tônico-clônica breve, geralmente benigna (simples). Investigar se atípica/prolongada/focal (excluir meningite).

**Laringite/crupe:** tosse "de cachorro", estridor; corticoide, nebulização com adrenalina se grave.

**Epiglotite:** toxemia, sialorreia, posição em tripé (Haemophilus) — emergência de via aérea.

**Corpo estranho:** engasgo súbito; manobras de desobstrução.

**Pegadinha.** Convulsão febril **simples** é benigna (não é epilepsia). Febre + rigidez/toxemia → excluir **meningite**. Epiglotite = não examinar garganta (risco de obstrução).` },
      { t: "Cardiopatias congênitas e sopros", r: `**Sopro inocente** (funcional): sistólico suave, assintomático, sem repercussão — comum e benigno.

**Cardiopatias:**
- **Acianóticas** (shunt E→D): **CIV** (mais comum), CIA, PCA.
- **Cianóticas:** **Tetralogia de Fallot** (mais comum cianótica), transposição de grandes vasos.

**Teste do coraçãozinho** (oximetria) triা cardiopatia crítica no RN.

**Sinais de alerta:** cianose, cansaço às mamadas, sudorese, baixo ganho ponderal, sopro com repercussão.

**Pegadinha.** Sopro inocente é comum e benigno (não investigar exaustivamente se assintomático). Cianose + cardiopatia → emergência neonatal. CIV é a acianótica mais comum; Fallot a cianótica mais comum.` },
      { t: "Erros inatos, triagem e crescimento anormal", r: `**Triagem neonatal (pezinho):** fenilcetonúria, hipotireoidismo congênito, anemia falciforme, fibrose cística, hiperplasia adrenal congênita, deficiência de biotinidase.

**Baixa estatura:** diferenciar variantes normais (baixa estatura familiar, retardo constitucional) de patológicas (hipotireoidismo, deficiência de GH, doença crônica, Turner). Avaliar velocidade de crescimento e idade óssea.

**Puberdade:** precoce (<8 anos meninas / <9 meninos) × atrasada. Investigar conforme.

**Pegadinha.** Hipotireoidismo congênito e fenilcetonúria: triar e tratar **precoce** evita déficit intelectual. Velocidade de crescimento baixa é mais preocupante que estatura baixa isolada. Turner em menina baixa + disgenesia.` },
      { t: "Maus-tratos e desenvolvimento atípico", r: `**Maus-tratos infantis:** suspeitar quando lesões **incompatíveis com a história/idade**, atraso em buscar atendimento, lesões em estágios diferentes, negligência. **Notificar e acionar Conselho Tutelar.**

**Transtorno do espectro autista (TEA):** déficit de comunicação social + comportamentos repetitivos/restritos; sinais precoces (não aponta, não responde ao nome, pouco contato visual). Triagem (M-CHAT). Intervenção precoce.

**TDAH:** desatenção e/ou hiperatividade-impulsividade em ≥2 ambientes, com prejuízo.

**Pegadinha.** Lesão incompatível com a história = suspeitar de maus-tratos (notificar). TEA: sinais no desenvolvimento social; intervenção precoce muda prognóstico. Notificação de violência é compulsória.` },
    ],
  },
  mental: {
    nome: "Saúde Mental",
    prio: "media",
    temas: [
      { t: "Depressão e ansiedade na APS", r: `**Depressão:** ≥2 semanas de **humor deprimido/anedonia** + sintomas (**SIGECAPS**: sono, interesse, culpa, energia, concentração, apetite, psicomotor, suicídio). ≥5 = episódio.

**Tratamento:** leve-moderada na **APS** (psicoeducação, psicoterapia, **ISRS** 1ª linha). Avaliar em 4-6 sem; manter ≥6 meses após remissão.

**Ansiedade (TAG, pânico, fobias):** TCC + ISRS/IRSN; **benzodiazepínico só curto prazo** (dependência).

**Pegadinha.** ISRS é 1ª linha (não tricíclico). Antidepressivo leva **semanas**. Benzodiazepínico não é manutenção. Rastrear suicídio.` },
      { t: "Risco de suicídio", r: `**Perguntar NÃO induz** — ponto mais cobrado.

**Avaliar:** ideação (passiva/ativa), **plano**, **meios/acesso**, **tentativas prévias** (maior preditor), intenção, fatores de proteção.

**Manejo:** garantir **segurança imediata**, **restrição de meios**, acionar rede/RAPS, encaminhamento urgente se alto risco. Não deixar sozinho se risco alto.

**Notificação:** **tentativa de suicídio é notificação compulsória.**

**Pegadinha.** Perguntar diretamente é correto. Tentativa prévia = maior risco. Notificação obrigatória.` },
      { t: "Uso de álcool e outras drogas", r: `Abordagem **sem julgamento**, **redução de danos**. Rastreio: **AUDIT** (álcool).

**Abstinência alcoólica:** tremor, ansiedade, sudorese → convulsão, **delirium tremens** (emergência). Tratamento: **benzodiazepínico**; **tiamina ANTES da glicose** (previne Wernicke).

**RAPS/CAPS-AD** para moderado-grave. Intervenções breves eficazes.

**Pegadinha.** **Tiamina antes da glicose.** Benzodiazepínico trata abstinência alcoólica. Delirium tremens = emergência. Redução de danos é a linha do SUS.` },
      { t: "RAPS e Reforma Psiquiátrica", r: `**RAPS** (Lei 10.216/2001): cuidado **territorial, comunitário, em liberdade** (antimanicomial).

**Pontos:** APS, **CAPS**, Unidades de Acolhimento, Residências Terapêuticas, leitos em hospital geral, urgência.

**CAPS:** I/II (porte), **III (24h)**, **CAPSi (infância)**, **CAPS AD (álcool/drogas)**.

**Internação:** último recurso, menor tempo; involuntária com critérios legais + comunicação ao MP.

**Pegadinha.** CAPS é comunitário, **não** hospital psiquiátrico. CAPS III e AD III = 24h. CAPSi = infância; CAPS AD = drogas.` },
      { t: "Primeiro episódio psicótico", r: `**Sintomas:** positivos (delírios, alucinações, desorganização) e negativos (embotamento, isolamento).

**Afastar orgânico/tóxico:** substâncias, infecções (encefalite), metabólico, **delirium** (consciência flutuante, causa clínica).

**Conduta:** acolher, segurança, encaminhar ao especializado. **Intervenção precoce melhora prognóstico**.

**Pegadinha.** Sempre **afastar causa orgânica/substância** antes de rotular esquizofrenia. **Delirium** (flutuante + causa clínica) é o grande diferencial — emergência clínica.` },
      { t: "Manejo e critérios de encaminhamento", r: `**Na APS:** casos leves-moderados (acolhimento, psicoeducação, ISRS, seguimento).

**Encaminhar:** risco de suicídio/violência, sintomas graves/psicóticos, **mania**, refratariedade, comorbidade complexa (uso grave, bipolar, personalidade grave), diagnóstico incerto.

**Matriciamento:** especialista **apoia** a APS (reduz encaminhamentos).

**Pegadinha.** Não encaminhar tudo — APS é resolutiva. Matriciamento = apoio, não transferência. Encaminhar por risco/gravidade/refratariedade.` },
      { t: "Transtorno bipolar e mania", r: `**Mania:** humor elevado/irritável ≥1 semana + **DIGFAST** (Distraibilidade, Insônia/menor necessidade de sono, Grandiosidade, Fuga de ideias, Aumento de atividade, fala Speeded, Thoughtless/risco). Hipomania: mais leve, ≥4 dias.

**Bipolar tipo I** (mania) × **tipo II** (hipomania + depressão).

**Tratamento:** **estabilizadores do humor** (lítio, valproato), antipsicóticos. **Cuidado: antidepressivo isolado pode virar mania** (fazer viragem).

**Pegadinha.** Depressão + história de mania/hipomania = **bipolar** (não usar antidepressivo isolado). Lítio: monitorar níveis (intoxicação). Mania com risco = encaminhamento/internação.` },
      { t: "Somatização e transtornos alimentares", r: `**Transtorno de sintomas somáticos:** sintomas físicos + preocupação desproporcional; manejo na APS (vínculo, consultas regulares, evitar exames excessivos — prevenção quaternária).

**Anorexia nervosa:** restrição, baixo peso (IMC baixo), medo de engordar, distorção da imagem. Risco clínico grave (bradicardia, distúrbios eletrolíticos).

**Bulimia:** compulsão + purgação, peso frequentemente normal.

**Pegadinha.** Anorexia tem **alta mortalidade** (complicações clínicas + suicídio). Somatização: acolher, não multiplicar exames. Sinais de gravidade da anorexia exigem manejo clínico.` },
      { t: "Demências e transtornos neurocognitivos", r: `**Demência:** declínio cognitivo **progressivo** com prejuízo funcional, **consciência preservada** (diferencia de delirium).

- **Alzheimer** — mais comum; memória recente primeiro, insidioso.
- **Vascular** — em degraus, fatores de risco CV.
- **Corpos de Lewy** — flutuação, alucinações visuais, parkinsonismo.
- **Frontotemporal** — alterações de comportamento/linguagem.

**Avaliação:** MEEM/MoCA, funcionalidade; excluir causas reversíveis (hipotireoidismo, B12, depressão — "pseudodemência").

**Delirium × demência:** delirium é **agudo e flutuante** (causa clínica); demência é **crônica e progressiva**.

**Pegadinha.** Excluir causas **reversíveis** (B12, tireoide, depressão) antes de firmar demência. Delirium é agudo (emergência clínica). Alzheimer começa pela memória recente.` },
      { t: "Transtornos de personalidade e neurodesenvolvimento no adulto", r: `**Transtornos de personalidade:** padrões persistentes e inflexíveis (ex.: borderline — instabilidade afetiva, impulsividade, risco de autolesão; antissocial). Manejo: vínculo, psicoterapia; cuidado com o risco de suicídio no borderline.

**TDAH no adulto:** desatenção persistente com prejuízo; diagnóstico requer sintomas desde a infância.

**Estresse e trauma:** **TEPT** (revivência, evitação, hipervigilância após trauma); transtorno de estresse agudo.

**Pegadinha.** Borderline tem alto risco de autolesão/suicídio (avaliar sempre). TEPT: sintomas após evento traumático. Transtornos de personalidade: abordagem longitudinal, evitar iatrogenia (polifarmácia).` },
    ],
  },
  cirurgia: {
    nome: "Cirurgia Geral",
    prio: "media",
    temas: [
      { t: "Abdome agudo", r: `**Tipos:** inflamatório (**apendicite** — mais comum, colecistite, diverticulite), obstrutivo (bridas, hérnia, tumor), perfurativo (úlcera — **pneumoperitônio**), hemorrágico (ectópica), vascular (isquemia mesentérica).

**Exame:** irritação peritoneal (Blumberg, defesa), **Murphy** (colecistite), psoas/McBurney (apendicite).

**Avaliar:** estabilidade, beta-hCG na mulher, lactato, imagem.

**Pegadinha.** Apendicite (dor migra para FID). **Mulher fértil + dor = beta-hCG.** Isquemia mesentérica: "dor desproporcional" no idoso com FA. Ar subdiafragmático = perfuração.` },
      { t: "Hérnias da parede abdominal", r: `**Inguinal** é a mais comum. **Femoral:** mulher, maior risco de encarceramento.

- **Redutível** — retorna. Eletivo.
- **Encarcerada** — irredutível **sem** isquemia; pode obstruir.
- **Estrangulada** — irredutível **com isquemia** → **emergência**.

**Alarme:** dor intensa, hérnia tensa, obstrução (vômito, distensão), sinais sistêmicos.

**Pegadinha.** Encarcerada = sem isquemia; estrangulada = com isquemia (emergência). Não reduzir à força se sinais de estrangulamento.` },
      { t: "Patologia biliar", r: `**Colelitíase** assintomática: **não** opera de rotina.
- **Cólica biliar:** dor em HD pós-gordura → colecistectomia eletiva.
- **Colecistite:** dor + febre + **Murphy** → ATB + colecistectomia.
- **Coledocolitíase:** icterícia, dilatação de vias → **CPRE** + cirurgia.
- **Colangite:** **tríade de Charcot** (dor+febre+icterícia) → ATB + drenagem (emergência).
- **Pancreatite biliar.**

**Indicação em assintomático:** vesícula em **porcelana**, cálculo grande, hemólise.

**Pegadinha.** Assintomático não opera (salvo exceções). Charcot = colangite. Murphy = colecistite.` },
      { t: "Pré e pós-operatório", r: `**Pré-op:** estratificar risco (**ASA**, risco cardíaco **Lee/RCRI**, METs); otimizar comorbidades; revisar anticoagulantes/antiagregantes; jejum (sólidos ~6-8h, líquidos claros ~2h). **Exames guiados por risco**, não rotina.

**Pós-op:** analgesia multimodal, **profilaxia de TEV** (Caprini), mobilização precoce, vigilância (ISC, deiscência, **íleo**, respiratório). **ERAS** (recuperação acelerada).

**Pegadinha.** Não pedir exames de rotina para todos (P4 no centro cirúrgico). Profilaxia de TEV essencial. Mobilização precoce previne TEV/pneumonia.` },
      { t: "Trauma: princípios cirúrgicos", r: `**ABCDE** com reanimação simultânea (ver Urgência). **Controle de hemorragia** = prioridade no C.

**Choque hemorrágico (classes I-IV)** pela perda volêmica. Fontes ocultas: **tórax, abdome, pelve, ossos longos, retroperitônio**.

**Reposição:** cristaloide + **hemoderivados precoces** (evitar excesso de cristaloide). Damage control em graves.

**Transferência precoce** se sem recurso definitivo.

**Pegadinha.** Hipotensão no trauma = hemorragia. Reanimar com hemoderivados. Transferir cedo o grave.` },
      { t: "Feridas e infecção de sítio cirúrgico", r: `**Classificação:** limpa · limpa-contaminada · contaminada · infectada — define profilaxia.

**ISC:** superficial, profunda, órgão/cavidade. Surge ~**5-7º dia**. Sinais flogísticos, secreção purulenta, febre.

**Prevenção:** **antibioticoprofilaxia na indução (30-60min antes da incisão)**, redose conforme duração, ≤24h; assepsia; tricotomia com tricótomo; **controle glicêmico**, **normotermia**.

**Pegadinha.** Profilaxia é **antes** da incisão, não depois. Ferida limpa geralmente dispensa ATB (salvo prótese). Normotermia e glicemia reduzem ISC.` },
      { t: "Apendicite e diverticulite", r: `**Apendicite:** dor periumbilical → **migra para FID** (McBurney), anorexia, febre baixa, Blumberg. Diagnóstico clínico ± imagem (USG/TC). Tratamento: **apendicectomia**.

**Diverticulite:** dor em **FIE**, febre, alteração do hábito (idoso). TC confirma e classifica (Hinchey). Não complicada: ATB ± dieta; complicada (abscesso, perfuração): drenagem/cirurgia.

**Pegadinha.** Apendicite = **FID** (jovem); diverticulite = **FIE** (idoso). Colonoscopia na diverticulite só **após** resolução do quadro agudo (risco de perfuração).` },
      { t: "Obstrução intestinal e abdome cirúrgico", r: `**Obstrução de delgado:** **bridas/aderências** (pós-op — causa mais comum), hérnias, tumor. Clínica: dor em cólica, distensão, vômitos, parada de eliminação; RX com níveis hidroaéreos.

**Obstrução de cólon:** neoplasia (principal no idoso), volvo. 

**Manejo:** "drip and suck" (sonda nasogástrica, hidratação, jejum); cirurgia se estrangulamento/falha/isquemia.

**Pegadinha.** Bridas = causa mais comum de obstrução de delgado (pós-operatório). Sinais de estrangulamento/isquemia (dor intensa, febre, acidose) → cirurgia urgente. Obstrução de cólon no idoso → excluir câncer.` },
      { t: "Cirurgia vascular e urgências vasculares", r: `**Isquemia arterial aguda:** dor súbita, palidez, ausência de pulso, parestesia, paralisia, frialdade (**6 P**). Emergência — revascularização/tempo crítico.

**Doença arterial periférica crônica:** claudicação intermitente, ITB reduzido; fatores de risco CV.

**Aneurisma de aorta abdominal:** frequentemente assintomático; **roto** = dor abdominal/lombar + hipotensão + massa pulsátil = emergência.

**TVP:** ver módulo de Clínica (anticoagulação).

**Pegadinha.** Isquemia arterial aguda (6 P) = emergência (tempo para salvar o membro). AAA roto = tríade dor + hipotensão + massa pulsátil. Claudicação = doença arterial periférica (tratar fatores de risco).` },
      { t: "Urologia cirúrgica e escroto agudo", r: `**Escroto agudo:**
- **Torção testicular** — dor súbita intensa, testículo elevado, reflexo cremastérico ausente. **Emergência** (janela ~6h para salvar). Não atrasar com exames.
- **Epididimite** — dor mais gradual, febre, melhora ao elevar (Prehn +).
- **Torção de apêndice testicular** — "ponto azul".

**Litíase urinária:** cólica renal (dor lombar em cólica, irradia para virilha, hematúria); TC sem contraste; analgesia, hidratação; maioria elimina espontaneamente.

**Hiperplasia prostática benigna:** sintomas obstrutivos no idoso.

**Pegadinha.** **Torção testicular = emergência** (não atrasar por USG se clínica clássica — explorar). Prehn e reflexo cremastérico ajudam a diferenciar de epididimite. Cólica renal: TC sem contraste é padrão.` },
    ],
  },
};

export const REVISAO_AREA_ORDER = [
  "mfc",
  "coletiva",
  "clinica",
  "urgencia",
  "go",
  "pediatria",
  "mental",
  "cirurgia",
];

export const REVISAO_AREAS: RevisaoArea[] = REVISAO_AREA_ORDER.map((id) => ({
  id,
  ...AREAS_DATA[id],
}));

export const REVISAO_TOTAL_TEMAS = REVISAO_AREAS.reduce(
  (n, a) => n + a.temas.length,
  0,
);

// Flashcards por TEMA — 5 para cada um dos 113 temas (565 no total),
// derivados do conteúdo curado do próprio tema. Índice externo = posição do
// tema na área; interno = os 5 cards [pergunta, resposta].
export const REVISAO_CARDS_POR_TEMA: Record<string, [string, string][][]> = {
  mfc: [
    [
      ["O que significa a sigla FIFE na exploração da experiência do adoecimento?", "Feelings (sentimentos e medos), Ideas (o que a pessoa acha que tem), Function (impacto funcional) e Expectations (expectativas). É a base do componente de explorar saúde, doença e experiência no MCCP."],
      ["Quais são os quatro componentes do Método Clínico Centrado na Pessoa?", "Explorar saúde, doença e experiência; entender a pessoa como um todo (contexto familiar, trabalho, cultura, ciclo de vida); elaborar plano conjunto (terreno comum); e fortalecer a relação, com vínculo e longitudinalidade."],
      ["O que o genograma representa e quantas gerações deve incluir?", "Representa a estrutura familiar, as relações e as doenças. Deve abranger no mínimo três gerações."],
      ["O que avalia o APGAR familiar e quais são suas cinco dimensões?", "Avalia a funcionalidade da família. As dimensões são Adaptação, Participação, Crescimento, Afeto e Resolução."],
      ["Pegadinha de prova: o MCCP substitui o raciocínio biomédico?", "Não. O MCCP integra o componente biomédico com a experiência subjetiva do adoecimento. A resposta correta acolhe a experiência e conduz clinicamente."],
    ],
    [
      ["Que percentual dos problemas de saúde a APS resolve?", "Cerca de 80 a 85% dos problemas de saúde, além de ordenar a Rede de Atenção à Saúde (RAS)."],
      ["Quais são os quatro atributos essenciais da APS segundo Starfield?", "Primeiro contato, longitudinalidade, integralidade e coordenação."],
      ["Qual atributo da APS é considerado o mais distintivo e o que significa?", "A longitudinalidade: acompanhamento da pessoa ao longo do tempo, com vínculo."],
      ["Quais são os atributos derivados da APS?", "Orientação familiar, orientação comunitária e competência cultural."],
      ["Pegadinha: o que significa exatamente ser porta de entrada na APS?", "Significa ser porta de entrada preferencial e resolutiva, e não apenas acesso geográfico. É a coordenação que sustenta a referência e a contrarreferência."],
    ],
    [
      ["Qual é a definição de rastreamento?", "É a aplicação de um teste em pessoas assintomáticas para detectar doença em fase pré-clínica."],
      ["Cite os principais critérios de Wilson e Jungner para instituir um rastreamento.", "Problema de saúde importante (prevalente ou grave), fase pré-clínica detectável, teste sensível, específico, seguro, aceitável e acessível, tratamento eficaz que muda o prognóstico se precoce, benefício maior que o dano com custo justificável e história natural conhecida."],
      ["O que é o lead time bias no rastreamento?", "É o viés de antecipação diagnóstica: a sobrevida parece aumentar apenas porque o diagnóstico foi feito mais cedo, sem que a data do óbito mude."],
      ["Diferencie length bias de sobrediagnóstico.", "O length bias (viés de duração) faz o rastreamento captar preferencialmente tumores indolentes, de evolução lenta. O sobrediagnóstico é detectar doença que nunca causaria dano, levando a sobretratamento."],
      ["Pegadinha: detectar a doença mais cedo garante redução de mortalidade?", "Não. Rastreamento só se justifica quando há evidência de redução de mortalidade, não apenas de antecipação diagnóstica."],
    ],
    [
      ["Qual é o calendário mínimo de consultas de puericultura recomendado pelo Ministério da Saúde?", "Primeira semana de vida e depois no 1º, 2º, 4º, 6º, 9º, 12º, 18º e 24º meses; a partir daí, consultas anuais."],
      ["Que parâmetros são acompanhados nas curvas da OMS e qual a faixa de escore-z considerada normal?", "Peso, estatura, perímetro cefálico e IMC. Considera-se normal o escore-z entre menos 2 e mais 2, sendo a velocidade de crescimento na curva mais importante que um ponto isolado."],
      ["Cite os marcos do desenvolvimento e suas idades esperadas.", "Sorriso social por volta de 2 meses, sustento cefálico de 3 a 4 meses, sentar sem apoio de 6 a 9 meses, andar e primeiras palavras por volta de 12 meses e frases de duas palavras aos 24 meses."],
      ["Quais são os sinais de alerta do desenvolvimento na puericultura?", "Não sustentar a cabeça aos 4 meses, não sentar aos 9 meses, não andar aos 18 meses e não falar palavras aos 18 meses. Regressão de um marco já adquirido é sempre patológica."],
      ["Pegadinha: atraso em um único marco já indica patologia?", "Não. Atraso isolado em um marco pode ser normal; o que preocupa é o atraso em múltiplos domínios ou a regressão de marcos."],
    ],
    [
      ["Em que período se faz a suplementação profilática de ferro no lactente?", "Aproximadamente dos 3 a 6 meses (conforme protocolo e aleitamento) até os 24 meses, em doses profiláticas. Prematuros e recém-nascidos de baixo peso recebem dose maior."],
      ["Quando iniciar e até quando manter a suplementação de vitamina D?", "Desde a primeira semana de vida até cerca de 12 a 24 meses, conforme protocolo, para prevenção de raquitismo."],
      ["Como é feita a suplementação de vitamina A na infância?", "De forma periódica, em áreas e faixas etárias de risco, dentro do programa nacional."],
      ["Que orientações de prevenção de acidentes devem ser dadas por faixa etária?", "Posição supina para dormir, segurança no transporte, prevenção de afogamento e de quedas."],
      ["Pegadinha: o aleitamento materno exclusivo dispensa a suplementação de vitamina D?", "Não. O aleitamento exclusivo não fornece vitamina D suficiente, sendo necessário suplementar mesmo os lactentes amamentados. E a posição supina para dormir reduz a morte súbita do lactente."],
    ],
    [
      ["Qual o número mínimo de consultas de pré-natal e até quando deve ser o início?", "Mínimo de 6 consultas, com início até 12 semanas de gestação."],
      ["Quais exames compõem a rotina do primeiro trimestre no pré-natal de risco habitual?", "Tipagem sanguínea e Rh, Coombs indireto se Rh negativo, hemograma, glicemia de jejum, HIV, VDRL, HBsAg, toxoplasmose, urina tipo I com urocultura e ultrassonografia."],
      ["Em que semanas se realizam o TOTG 75 g e a pesquisa de estreptococo do grupo B?", "TOTG 75 g entre 24 e 28 semanas e pesquisa de estreptococo B entre 35 e 37 semanas."],
      ["Qual a dose e o período de uso do ácido fólico na gestação e por quê?", "0,4 mg por dia, da pré-concepção até 12 semanas, para prevenir defeito de fechamento do tubo neural. O ferro é suplementado no segundo trimestre."],
      ["Quais vacinas são indicadas na gestação e qual a regra da dTpa?", "dTpa a cada gestação, a partir de 20 semanas, além de hepatite B e influenza. Vacinas de vírus vivo são contraindicadas."],
    ],
    [
      ["Como se organiza a linha de cuidado das doenças crônicas não transmissíveis na APS?", "Estratificação de risco, metas individualizadas, autocuidado apoiado, abordagem dos fatores de risco (tabaco, álcool, sedentarismo, dieta e obesidade) e manejo integrado."],
      ["Quais princípios da APS sustentam o manejo longitudinal das DCNT?", "Longitudinalidade, proatividade com busca ativa de faltosos e integralidade, com rastreio de comorbidades."],
      ["No diabetes, que complicações devem ser rastreadas como parte da integralidade do cuidado?", "Doença renal crônica, retinopatia e pé diabético."],
      ["O que caracteriza o Modelo de Atenção às Condições Crônicas (MACC)?", "Organiza o cuidado por estratos de risco, com ênfase em promoção, prevenção e autocuidado."],
      ["Pegadinha: manejar uma condição crônica é apenas controlar o número-alvo?", "Não. Combina meta clínica, adesão, abordagem dos determinantes e autocuidado."],
    ],
    [
      ["Diferencie referência de contrarreferência.", "Referência é o encaminhamento a um nível de maior complexidade. Contrarreferência é o retorno à APS com as informações necessárias para a continuidade do cuidado."],
      ["O que é matriciamento ou apoio matricial?", "É o especialista apoiando a equipe da APS por meio de discussão de casos, teleconsultoria e atendimento conjunto, o que reduz encaminhamentos."],
      ["Que ferramentas apoiam a articulação entre APS e demais pontos da rede?", "Regulação, protocolos de encaminhamento e prontuário compartilhado (e-SUS)."],
      ["Pegadinha: ao encaminhar um paciente, a APS deixa de ser responsável por ele?", "Não. A APS mantém a coordenação do cuidado mesmo após o encaminhamento."],
      ["O matriciamento transfere a responsabilidade do caso para o especialista?", "Não. Matriciamento é apoio à equipe, não transferência de responsabilidade."],
    ],
    [
      ["O que é prevenção quaternária?", "É proteger a pessoa da sobremedicalização, evitando sobrediagnóstico, sobretratamento e iatrogenia."],
      ["Descreva os quatro níveis de prevenção incluindo a quaternária.", "Primária evita a doença, secundária faz rastreio, terciária reduz sequelas e quaternária evita o dano causado pela própria medicina."],
      ["Cite aplicações práticas da prevenção quaternária na APS.", "Evitar exames sem indicação, não medicalizar condições naturais como luto e envelhecimento, desprescrever em polifarmácia do idoso e cascatas de prescrição, decisão compartilhada e comunicação de incertezas."],
      ["Que ferramentas apoiam a desprescrição e a prevenção quaternária?", "NNT e NNH, a iniciativa Choosing Wisely e os critérios de Beers e STOPP-START para o idoso."],
      ["Pegadinha: prevenção quaternária é negar cuidado ou economizar recursos?", "Não. É proteção baseada em evidência. O cenário clássico é o paciente que pede exame ou antibiótico sem indicação, respondido com prevenção quaternária e boa comunicação."],
    ],
    [
      ["Que domínios compõem a Avaliação Geriátrica Ampla?", "Funcionalidade em AVDs e AIVDs, cognição, humor, mobilidade e quedas, nutrição, polifarmácia, suporte social, continência, visão e audição."],
      ["Quais são as grandes síndromes geriátricas conhecidas como os cinco Is?", "Instabilidade (quedas), imobilidade, incontinência, insuficiência cognitiva (demência e delirium) e iatrogenia."],
      ["Quais são os critérios do fenótipo de fragilidade de Fried?", "Perda de peso, exaustão, fraqueza avaliada pela força de preensão, lentidão da marcha e baixa atividade física."],
      ["Como avaliar e prevenir quedas no idoso?", "Avaliar causas como medicamentos, hipotensão postural, ambiente e déficits sensoriais; prevenir com revisão de fármacos, exercício e adaptação do lar."],
      ["Como diferenciar delirium de demência e por que a apresentação atípica é regra no idoso?", "Delirium é agudo e flutuante; demência é crônica e progressiva. No idoso a apresentação atípica é a regra, como infecção sem febre e infarto sem dor, e deve-se priorizar a funcionalidade sobre o número de diagnósticos."],
    ],
    [
      ["Como se definem cuidados paliativos?", "Abordagem que melhora a qualidade de vida de pacientes com doença ameaçadora à vida por meio da prevenção e alívio do sofrimento físico, psíquico, social e espiritual. Não se restringem ao fim de vida e podem ser concomitantes ao tratamento."],
      ["Quais sintomas são alvo prioritário do controle em cuidados paliativos?", "Dor, dispneia, náusea e constipação."],
      ["Como se organiza a escada analgésica da OMS?", "Não opioides como dipirona e anti-inflamatórios, depois opioides fracos e por fim opioides fortes como a morfina, sempre com adjuvantes. Na dor intensa pode-se iniciar diretamente pelo opioide forte."],
      ["O que significa cada letra do protocolo SPIKES?", "Setting (ambiente), Perception (o que a pessoa já sabe), Invitation (quanto quer saber), Knowledge (informar), Emotions (acolher) e Strategy (plano)."],
      ["Pegadinha: prescrever morfina para dor ou dispneia apressa a morte?", "Não. A morfina bem indicada não apressa a morte, e cuidado paliativo não significa desistir. Deve-se respeitar a autonomia e as diretivas antecipadas de vontade."],
    ],
    [
      ["O que representa cada letra da abordagem dos 5 As no tabagismo?", "Ask (perguntar), Advise (aconselhar), Assess (avaliar), Assist (auxiliar) e Arrange (acompanhar). O tabagismo é a principal causa evitável de morte."],
      ["Quais são as opções de tratamento farmacológico do tabagismo?", "Terapia de reposição de nicotina, bupropiona e vareniclina, sempre associadas a aconselhamento."],
      ["Qual instrumento é usado para rastrear uso problemático de álcool na APS?", "O AUDIT, que ajuda a distinguir uso de risco de dependência. A intervenção breve é eficaz."],
      ["Quais são os estágios de mudança de Prochaska?", "Pré-contemplação, contemplação, preparação, ação e manutenção, com possibilidade de recaída. A entrevista motivacional adequa a abordagem ao estágio."],
      ["Pegadinha: por que orientar abstinência a quem está em pré-contemplação costuma falhar?", "Porque a abordagem precisa ser adequada ao estágio de motivação da pessoa. Na APS, a intervenção breve ajustada ao estágio é o que reduz consumo."],
    ],
    [
      ["Quais são as principais lesões elementares dermatológicas?", "Mácula (plana), pápula (elevada e menor que 1 cm), placa, vesícula e bolha, pústula e nódulo."],
      ["Como se apresenta e como se trata a dermatite atópica?", "Cursa com prurido, xerose e acometimento de flexuras. O tratamento é hidratação associada a corticoide tópico."],
      ["Quais são os achados típicos da escabiose e como tratar?", "Prurido de predomínio noturno, túneis e contatos também afetados. Trata-se com permetrina ou ivermectina, incluindo os contatos."],
      ["Quais são as piodermites comuns na APS e seus achados?", "Impetigo, com crostas melicéricas, e erisipela ou celulite, que exigem antibiótico. A erisipela é emergência quando extensa ou com repercussão sistêmica."],
      ["O que avalia a regra ABCDE e qual o câncer de pele mais comum?", "Assimetria, bordas, cor, diâmetro maior que 6 mm e evolução, aplicada ao melanoma; lesão suspeita ou em mudança indica biópsia. O carcinoma basocelular, de aspecto perolado, é o mais comum."],
    ],
    [
      ["Quais são os tipos de conjuntivite e como se apresentam?", "Viral, bacteriana e alérgica, com hiperemia difusa e secreção. Em geral têm curso benigno."],
      ["Quais sinais de alarme no olho vermelho indicam encaminhamento?", "Dor intensa, baixa de visão, fotofobia e halos, que sugerem glaucoma agudo, uveíte ou ceratite."],
      ["Como se apresenta o glaucoma agudo?", "Dor ocular intensa, midríase média, visão turva e náusea. É uma emergência."],
      ["Como diferenciar otite média aguda de otite externa?", "A otite média aguda cursa com otalgia e abaulamento timpânico, tratada com amoxicilina quando indicado. A otite externa causa dor à tração do pavilhão auricular e tem tratamento tópico."],
      ["Quando indicar antibiótico na rinossinusite?", "Somente se houver critérios: duração acima de 10 dias, piora após melhora inicial ou sintomas graves. A maioria dos casos é viral. Na faringite, usa-se os critérios de Centor."],
    ],
    [
      ["Qual é a natureza da maioria das lombalgias e qual a conduta inicial?", "A maioria é mecânica ou inespecífica, com bom prognóstico. A conduta é manter a atividade e prescrever analgesia, sem imagem de rotina."],
      ["Quais são os sinais de alarme (red flags) na lombalgia?", "Trauma, febre, emagrecimento, déficit neurológico, primeiro episódio após os 50 anos, câncer prévio e síndrome da cauda equina. A presença deles indica investigação."],
      ["Como se reconhece a síndrome da cauda equina e qual a conduta?", "Retenção urinária associada a anestesia em sela. É emergência cirúrgica."],
      ["Quais são as queixas musculoesqueléticas mais comuns de ombro e joelho na APS?", "No ombro, tendinopatia do manguito rotador e capsulite adesiva. No joelho, osteoartrite e lesões meniscais ou ligamentares associadas a trauma."],
      ["Qual a conduta diante de fraturas, e o que muda nas fraturas expostas?", "Imobilização e analgesia. As fraturas expostas são emergência e exigem antibiótico e limpeza."],
    ],
    [
      ["Quais são os documentos médicos e o que a declaração de óbito define?", "Atestado, declaração, laudo, parecer e relatório. A declaração de óbito é preenchida pelo médico e define a causa básica, que originou a cadeia, e as causas consequenciais."],
      ["Quem preenche a declaração de óbito nos casos de morte natural?", "O médico assistente ou, quando não houve assistência, o Serviço de Verificação de Óbitos (SVO)."],
      ["Para onde devem ser encaminhados os casos de morte violenta ou suspeita?", "Para o IML. Nesses casos não cabe ao médico assistente preencher a declaração de óbito, e ele não deve atestar morte violenta como natural."],
      ["Quais são os princípios do Código de Ética Médica citados?", "Autonomia, beneficência, não maleficência e justiça, somados ao consentimento informado."],
      ["Quais são as exceções ao sigilo médico?", "Dever legal, como a notificação compulsória, justa causa e autorização do paciente. Em situações de urgência ou envolvendo menores, atende-se mesmo sem consentimento formal quando há risco."],
    ],
    [
      ["Quais violências são de notificação compulsória e em que condição?", "Todas as violências, contra criança, mulher, idoso e pessoa com deficiência, mesmo em caso de suspeita."],
      ["Qual a conduta no atendimento à violência sexual?", "Acolhimento, profilaxias com PEP para HIV, profilaxia de outras ISTs e contracepção de emergência, coleta conforme protocolo e notificação."],
      ["O atendimento em saúde à vítima de violência sexual depende de boletim de ocorrência?", "Não. O atendimento não exige boletim de ocorrência. A PEP deve ser iniciada em até 72 horas."],
      ["Quais sinais alertam para maus-tratos infantis e qual a conduta?", "Lesões incompatíveis com a história relatada e sinais de negligência. Deve-se notificar e acionar o Conselho Tutelar."],
      ["Que formas de violência contra o idoso devem ser reconhecidas?", "Negligência, violência financeira e violência física, com notificação e acionamento da rede de proteção."],
    ],
  ],
  coletiva: [
    [
      ["Qual é a base legal do SUS citada para os princípios doutrinários?", "A Constituição Federal de 1988, nos artigos 196 a 200, a Lei 8.080/90, que trata da organização, e a Lei 8.142/90, que trata da participação e do financiamento."],
      ["O que estabelece o princípio da universalidade no SUS?", "A saúde é direito de todos e dever do Estado, garantida sem necessidade de contribuição prévia."],
      ["O que abrange o princípio da integralidade?", "Abrange ações de promoção, proteção, recuperação e reabilitação, considerando o indivíduo como um todo."],
      ["Como se define equidade no SUS?", "Equidade é tratar desigualmente os desiguais, priorizando quem mais precisa. Deriva da igualdade de assistência sem preconceitos ou privilégios."],
      ["Qual a diferença entre igualdade e equidade, segundo a pegadinha de prova?", "Igualdade significa tratar todos do mesmo modo; equidade significa priorizar conforme a necessidade de cada um."],
    ],
    [
      ["Quais são os princípios organizativos do SUS?", "Descentralização com comando único em cada esfera (municipalização), regionalização e hierarquização por níveis de complexidade em base territorial, e participação social prevista na Lei 8.142/90."],
      ["Qual a composição e o caráter dos Conselhos de Saúde?", "São permanentes, deliberativos e paritários, com 50% de usuários. Fiscalizam inclusive as finanças."],
      ["De quanto em quanto tempo ocorrem as Conferências de Saúde e qual seu papel?", "Ocorrem a cada 4 anos e têm caráter propositivo, propondo diretrizes para a política de saúde."],
      ["Quais requisitos o ente precisa cumprir para receber repasses fundo a fundo?", "Precisa ter Fundo de Saúde, Conselho de Saúde, Plano de Saúde e relatório de gestão."],
      ["Qual a pegadinha clássica sobre Conselho versus Conferência de Saúde?", "O Conselho é deliberativo e a Conferência é propositiva. Além disso, a participação de usuários no Conselho é de 50%."],
    ],
    [
      ["O que a Lei 8.080/90 regula?", "É a Lei Orgânica da Saúde: regula ações e serviços de saúde em todo o território, define objetivos, competências das esferas, princípios como universalidade, integralidade e equidade, e trata da organização, direção e gestão do SUS."],
      ["Quais são os dois grandes temas da Lei 8.142/90?", "A participação da comunidade, por meio de Conselhos e Conferências, e as transferências intergovernamentais de recursos no modelo fundo a fundo."],
      ["O que o Decreto 7.508/2011 regulamenta e quais conceitos traz?", "Regulamenta a Lei 8.080 e traz regiões de saúde, RENASES, RENAME, Contrato Organizativo (COAP) e mapa da saúde."],
      ["Por que a participação social não aparece na Lei 8.080/90?", "Porque foi vetada na 8.080 e restituída depois pela Lei 8.142/90."],
      ["Qual norma introduziu as regiões de saúde e o conceito de porta de entrada?", "O Decreto 7.508/2011."],
    ],
    [
      ["Qual é o objeto da vigilância epidemiológica?", "A detecção e prevenção de agravos; é a base da notificação e da investigação de surtos."],
      ["O que compete à vigilância sanitária?", "O risco relacionado a produtos, serviços e ambientes, exercida pela ANVISA com poder de polícia."],
      ["O que abrange a vigilância ambiental e a vigilância em saúde do trabalhador?", "A ambiental trata dos fatores do meio, como água, ar, solo, vetores e desastres. A do trabalhador trata da relação entre trabalho e saúde, apoiada pelos CEREST."],
      ["Diferencie endemia, epidemia/surto e pandemia.", "Endemia é a ocorrência esperada; epidemia ou surto é a ocorrência acima do esperado; pandemia é a ocorrência em vários países."],
      ["Como não confundir os tipos de vigilância na prova?", "Sanitária cuida de produtos e serviços; epidemiológica cuida de doenças e notificação; ambiental cuida do meio."],
    ],
    [
      ["Como se calcula a mortalidade infantil e quais suas faixas?", "Óbitos em menores de 1 ano divididos por nascidos vivos, multiplicado por 1.000. As faixas são neonatal precoce de 0 a 6 dias, tardio de 7 a 27 dias e pós-neonatal de 28 a 364 dias."],
      ["Como se calculam a mortalidade geral e a razão de mortalidade materna?", "Mortalidade geral é óbitos divididos pela população vezes 1.000. A materna é óbitos maternos divididos por nascidos vivos vezes 100.000."],
      ["Qual a diferença entre incidência e prevalência?", "Incidência é o número de casos novos sobre a população em risco e mede risco. Prevalência é o número de casos existentes sobre a população e mede carga. Vale a relação prevalência aproximadamente igual a incidência vezes duração."],
      ["Como se calcula a letalidade e o que ela expressa?", "Óbitos divididos pelo número de doentes vezes 100. Expressa a gravidade da doença."],
      ["Por que um tratamento que cronifica a doença aumenta a prevalência?", "Porque a prevalência é proporcional à duração da doença; ao prolongar a sobrevida sem cura, o número de casos existentes aumenta. Lembrar que mortalidade usa população no denominador e letalidade usa doentes."],
    ],
    [
      ["Qual sistema registra a mortalidade e qual é seu documento-fonte?", "O SIM, alimentado pela Declaração de Óbito."],
      ["Qual sistema registra nascidos vivos e com base em qual documento?", "O SINASC, alimentado pela Declaração de Nascido Vivo."],
      ["Qual sistema recebe os agravos de notificação?", "O SINAN, alimentado pelas fichas de notificação."],
      ["Quais sistemas registram internações e atendimentos ambulatoriais?", "O SIH registra as internações por meio da AIH e o SIA registra a produção ambulatorial."],
      ["De quais sistemas vêm numerador e denominador da mortalidade infantil?", "O numerador, com os óbitos de menores de 1 ano, vem do SIM; o denominador, com os nascidos vivos, vem do SINASC. Atenção também ao e-SUS APS/SISAB na Atenção Básica e ao SI-PNI nas imunizações."],
    ],
    [
      ["O que é notificação compulsória e onde ela é registrada?", "É a comunicação obrigatória de agravos da lista nacional, na suspeita ou na confirmação, registrada no SINAN."],
      ["Cite agravos de notificação imediata em 24 horas.", "Surtos, sarampo, meningites, raiva, cólera, febre amarela, óbito materno e infantil, violências, tentativa de suicídio e botulismo."],
      ["Qual o prazo de notificação dos demais agravos, como hanseníase e tuberculose?", "Notificação semanal."],
      ["Quem tem o dever de notificar e a partir de que momento?", "Todo profissional de saúde, e a suspeita já obriga a notificação, não sendo necessária a confirmação."],
      ["O sigilo médico impede a notificação compulsória?", "Não. A notificação é exceção legal ao sigilo. Vale lembrar que violência e tentativa de suicídio são notificáveis e que a notificação negativa confirma que o sistema está funcionando."],
    ],
    [
      ["Qual modelo a PNAB define como prioritário para a Atenção Básica?", "A Estratégia Saúde da Família, a ESF."],
      ["Qual é a composição da equipe de Saúde da Família?", "Médico, enfermeiro, técnico de enfermagem e agente comunitário de saúde, podendo incluir saúde bucal, atuando em território adscrito e com população definida."],
      ["Qual equipe substituiu o NASF no apoio matricial?", "A eMulti."],
      ["Quais funções a Atenção Básica exerce na rede?", "É porta de entrada, coordenadora do cuidado e ordenadora da rede."],
      ["Como funciona o financiamento da Atenção Básica no Previne Brasil?", "Combina capitação ponderada, pagamento por desempenho e incentivos. Lembrar que a ESF é prioritária, mas não é a única forma de organizar a Atenção Básica."],
    ],
    [
      ["O que são determinantes sociais da saúde?", "São as condições em que as pessoas nascem, vivem, trabalham e envelhecem."],
      ["Quais são as camadas do modelo de Dahlgren e Whitehead?", "Da mais interna para a mais externa: fatores individuais como idade, sexo e genética; estilos de vida; redes sociais e comunitárias; condições de vida e trabalho, como emprego, educação, saneamento e moradia; e a macroestrutura socioeconômica."],
      ["O que caracteriza uma iniquidade em saúde?", "É a desigualdade injusta e evitável, com uma dimensão ética envolvida."],
      ["Toda desigualdade em saúde é uma iniquidade?", "Não. Apenas as desigualdades injustas e evitáveis configuram iniquidade."],
      ["Por que atribuir a saúde apenas ao estilo de vida é um erro?", "Porque o estilo de vida é só uma das camadas dos determinantes; culpar o indivíduo ignora determinantes estruturais. Reduzir iniquidades exige intersetorialidade e equidade."],
    ],
    [
      ["Quais são os períodos da história natural da doença?", "O período pré-patogênico, com os fatores de risco, e o período patogênico, que vai do estágio biológico precoce aos sinais e sintomas até o desfecho."],
      ["O que compõe a prevenção primária e em que período ela atua?", "Promoção da saúde e proteção específica, como as vacinas, atuando no período pré-patogênico."],
      ["O que caracteriza a prevenção secundária?", "Diagnóstico precoce e rastreamento, além da limitação do dano."],
      ["O que são prevenção terciária e quaternária?", "A terciária é a reabilitação. A quaternária, adição moderna ao modelo, visa evitar a iatrogenia."],
      ["Qual a diferença entre promoção da saúde e proteção específica?", "A promoção da saúde é inespecífica, como educação e saneamento; a proteção específica é dirigida a um agravo, como a vacinação. Ambas ficam na prevenção primária de Leavell e Clark."],
    ],
    [
      ["Qual é a unidade de análise do estudo ecológico e seu principal risco?", "A unidade é a população, e o principal risco é a falácia ecológica."],
      ["O que mede um estudo transversal e qual sua limitação?", "Mede exposição e desfecho ao mesmo tempo, fornecendo prevalência. Não estabelece causalidade porque não garante temporalidade."],
      ["De onde parte o estudo caso-controle e qual medida ele fornece?", "Parte do desfecho e mede odds ratio. É adequado para doenças raras."],
      ["De onde parte o estudo de coorte e qual medida ele fornece?", "Parte da exposição e mede incidência e risco relativo. É adequado para exposições raras."],
      ["Quais desenhos ocupam o topo da hierarquia de evidência?", "A revisão sistemática com metanálise está no topo da pirâmide, e o ensaio clínico randomizado é o maior nível de evidência entre estudos individuais, pois a randomização controla confusão. As medidas de associação incluem RR, OR, risco atribuível e NNT."],
    ],
    [
      ["O que é sensibilidade de um teste e para que serve?", "É a capacidade de detectar os doentes, com poucos falsos-negativos. Pela regra SnNout, um teste sensível com resultado negativo serve para excluir a doença."],
      ["O que é especificidade e qual sua aplicação prática?", "É a capacidade de identificar os sadios, com poucos falsos-positivos. Pela regra SpPin, um teste específico com resultado positivo serve para confirmar a doença."],
      ["De que depende o valor preditivo positivo de um teste?", "Depende da prevalência da doença na população: o VPP sobe conforme a prevalência aumenta. O mesmo vale para o VPN."],
      ["Qual medida de desempenho diagnóstico independe da prevalência?", "A razão de verossimilhança, a LR."],
      ["Qual característica do teste se prioriza no rastreamento e qual na confirmação?", "O rastreamento prioriza sensibilidade, para não perder casos; a confirmação prioriza especificidade. Sensibilidade e especificidade são propriedades do teste, enquanto VPP e VPN variam com a prevalência."],
    ],
    [
      ["O que é nexo causal em saúde do trabalhador e onde se registram os agravos?", "É a relação entre o agravo e o trabalho. Acidentes e doenças do trabalho são notificados no SINAN e comunicados pela CAT."],
      ["O que define a categoria I da classificação de Schilling?", "O trabalho é causa necessária do agravo, como na intoxicação por chumbo."],
      ["O que definem as categorias II e III de Schilling?", "Na II o trabalho é fator contributivo, como na hipertensão agravada pelo trabalho. Na III o trabalho agrava uma doença preexistente."],
      ["O acidente de trajeto é considerado acidente de trabalho?", "Sim, o acidente de trabalho inclui o trajeto."],
      ["A CAT é obrigatória mesmo quando não há afastamento?", "Sim, a Comunicação de Acidente de Trabalho é obrigatória mesmo sem afastamento. LER e DORT são exemplos frequentes em prova."],
    ],
    [
      ["Quais vacinas do calendário são de vírus vivo atenuado?", "BCG, tríplice viral, febre amarela, rotavírus e varicela."],
      ["Cite exemplos de vacinas inativadas ou de subunidades.", "Hepatite B, VIP, pentavalente e HPV."],
      ["Quais as contraindicações gerais das vacinas vivas atenuadas?", "Como regra geral, imunossuprimidos graves e gestantes. Entre vivas injetáveis, aplicar no mesmo dia ou com intervalo de pelo menos 30 dias."],
      ["Qual a temperatura de conservação das vacinas na ponta da rede de frio?", "De mais 2 graus Celsius a mais 8 graus Celsius. Falha na cadeia inutiliza as doses."],
      ["Quais são falsas contraindicações à vacinação?", "Doença leve, febre baixa, desnutrição, uso de antibiótico e prematuridade, caso em que se vacina pela idade cronológica. Um resfriado leve não contraindica; deve-se aproveitar a oportunidade vacinal."],
    ],
    [
      ["Quais políticas e programas de saúde são mais cobrados em prova?", "Rede Cegonha e atenção materno-infantil, Programa Nacional de Imunizações, política de saúde mental com a RAPS, e programas de HIV/IST, tuberculose e hanseníase."],
      ["Quais políticas são voltadas a populações específicas?", "As de saúde da pessoa idosa, da mulher, do homem, da população negra, indígena e LGBT."],
      ["Como o SUS organiza a atenção às condições crônicas?", "Por meio de linhas de cuidado."],
      ["O que é a judicialização da saúde e qual tensão ela gera?", "É o acesso a bens e serviços de saúde pela via do Judiciário, gerando tensão entre o direito individual e a coletividade, com referência à RENAME."],
      ["O que definem a RENAME e a RENASES?", "Definem o que o SUS oferece em medicamentos e em ações e serviços de saúde. A equidade é o princípio que orienta políticas dirigidas a populações vulneráveis específicas."],
    ],
    [
      ["Quais são as medidas de tendência central e suas características?", "Média, sensível a valores extremos; mediana, robusta a outliers; e moda."],
      ["Quais são as medidas de dispersão citadas?", "Desvio-padrão, variância e amplitude."],
      ["O que significa um valor de p menor que 0,05?", "Indica significância estatística, levando à rejeição da hipótese nula. Não garante, porém, relevância clínica."],
      ["Como interpretar um intervalo de confiança de 95%?", "Se o IC95% cruza o valor 1 para RR ou OR, ou cruza 0 para diferenças, o resultado não é estatisticamente significativo."],
      ["Diferencie erro tipo I, erro tipo II e poder do estudo.", "O erro tipo I, alfa, é o falso-positivo, rejeitar uma hipótese nula verdadeira. O erro tipo II, beta, é o falso-negativo. O poder do estudo é 1 menos beta."],
    ],
  ],
  clinica: [
    [
      ["Quais os valores de PA e o número de medidas necessários para diagnosticar hipertensão arterial?", "PA maior ou igual a 140/90 mmHg em pelo menos duas medidas em ocasiões diferentes. Não se diagnostica com uma única medida, salvo PA muito alta com lesão de órgão-alvo."],
      ["Quais os cortes de MAPA (vigília) e MRPA que confirmam o diagnóstico de hipertensão?", "MAPA na vigília maior ou igual a 135/85 mmHg e MRPA maior ou igual a 130/80 mmHg. Esses métodos detectam hipertensão do avental branco e a mascarada."],
      ["Como se classificam os estágios 1, 2 e 3 da hipertensão arterial?", "Estágio 1: 140-159/90-99. Estágio 2: 160-179/100-109. Estágio 3: maior ou igual a 180/110 mmHg."],
      ["Quais são as metas pressóricas gerais e para alto risco cardiovascular?", "Meta geral abaixo de 140/90 mmHg e abaixo de 130/80 mmHg em alto risco, se tolerado. No idoso frágil a meta é menos rígida."],
      ["Quais as classes de primeira linha no tratamento farmacológico da hipertensão e qual combinação é proibida?", "Primeira linha: IECA ou BRA, bloqueadores de canal de cálcio e tiazídicos, com combinação dupla precoce na maioria. IECA e BRA não se associam; em negros e idosos, BCC e diuréticos são preferenciais."],
    ],
    [
      ["Quais são os quatro critérios laboratoriais que fecham o diagnóstico de diabetes mellitus?", "Glicemia de jejum maior ou igual a 126, TOTG de 2 horas maior ou igual a 200, HbA1c maior ou igual a 6,5% ou glicemia aleatória maior ou igual a 200 com sintomas. Em assintomático, um exame alterado isolado deve ser confirmado."],
      ["Quais os valores que definem pré-diabetes?", "Glicemia de jejum entre 100 e 125, TOTG entre 140 e 199 e HbA1c entre 5,7 e 6,4%."],
      ["Qual a meta de HbA1c no diabetes e como individualizá-la?", "Meta geral abaixo de 7%, individualizando para abaixo de 6,5% em jovens e até abaixo de 8% no idoso frágil."],
      ["Qual o tratamento de primeira linha do diabetes tipo 2 e quando priorizar iSGLT2 ou GLP-1?", "Estilo de vida mais metformina é a primeira linha. iSGLT2 e GLP-1 entram cedo e são priorizados quando há doença cardiovascular, insuficiência cardíaca ou doença renal crônica."],
      ["Por que a HbA1c pode ser falseada e que período ela reflete?", "A HbA1c reflete cerca de 3 meses de controle glicêmico e pode ser falseada por anemia e hemoglobinopatias."],
    ],
    [
      ["Quais condições classificam automaticamente o paciente como de risco cardiovascular muito alto?", "Doença aterosclerótica clínica, como infarto do miocárdio, AVC e doença arterial periférica. Nesses casos não é preciso calcular escore de risco."],
      ["Quais as metas de LDL por categoria de risco cardiovascular?", "Muito alto risco abaixo de 50, alto abaixo de 70, intermediário abaixo de 100 e baixo abaixo de 130 mg/dL."],
      ["Quais situações caracterizam o paciente de alto risco cardiovascular?", "Diabetes com fatores de risco ou lesão de órgão-alvo, doença renal crônica e LDL muito elevado."],
      ["Qual a sequência de tratamento farmacológico da dislipidemia?", "Estatina como base, com intensidade definida pelo risco, seguida de ezetimiba e, se necessário, inibidor de PCSK9."],
      ["A partir de qual valor de triglicérides há risco de pancreatite e qual a conduta?", "Triglicérides maior ou igual a 500 mg/dL indica risco de pancreatite, situação em que se usa fibrato."],
    ],
    [
      ["Qual o critério espirométrico de reversibilidade que caracteriza a asma?", "Aumento do VEF1 de pelo menos 12% e 200 mL após broncodilatador, indicando obstrução reversível."],
      ["Qual o critério espirométrico que define a DPOC?", "Relação VEF1/CVF abaixo de 0,70 após broncodilatador, caracterizando obstrução pouco reversível, ligada ao tabagismo."],
      ["Qual o pilar do tratamento da asma e qual erro terapêutico deve ser evitado?", "Tratamento por etapas com corticoide inalatório associado ou não ao formoterol. Não se deve usar SABA isolado."],
      ["Quais as duas medidas que reduzem mortalidade na DPOC?", "Cessação do tabagismo e oxigenoterapia nos pacientes hipoxêmicos. São as únicas que interrompem a progressão da doença."],
      ["Qual o tratamento da exacerbação de DPOC e quando indicar antibiótico?", "Broncodilatador e corticoide, com antibiótico se houver sinais de infecção, como escarro purulento."],
    ],
    [
      ["Qual a definição de doença renal crônica?", "Alteração de estrutura ou função renal por pelo menos 3 meses, com TFG abaixo de 60 e/ou marcadores como albuminúria. A cronicidade é obrigatória; sem ela trata-se de lesão renal aguda."],
      ["Quais exames são usados no rastreio de doença renal crônica em hipertensos e diabéticos?", "TFG estimada pelo CKD-EPI e albuminúria pela relação albumina/creatinina."],
      ["Como o KDIGO estadia a doença renal crônica?", "Por TFG de G1 a G5 combinada com albuminúria de A1 a A3. O prognóstico é pior quanto menor a TFG e maior a albuminúria."],
      ["Quais medicamentos têm papel nefroprotetor na doença renal crônica?", "IECA ou BRA quando há albuminúria e iSGLT2 pela nefroproteção, além de controle de pressão e glicemia e evitar nefrotóxicos."],
      ["Qual elevação de creatinina é aceitável após início de IECA ou BRA e quando encaminhar ao nefrologista?", "Aumento de até cerca de 30% da creatinina é aceitável. Encaminhar no estágio G4 ou diante de declínio rápido da função renal."],
    ],
    [
      ["Como se classifica a insuficiência cardíaca conforme a fração de ejeção?", "FEVE reduzida com valor menor ou igual a 40%, levemente reduzida entre 41 e 49% e preservada maior ou igual a 50%."],
      ["Como se faz o diagnóstico de insuficiência cardíaca e qual sua principal causa?", "Clínica associada a ecocardiograma e BNP ou NT-proBNP. A principal causa é a isquêmica."],
      ["Quais são os quatro pilares do tratamento da IC com fração de ejeção reduzida?", "IECA/BRA ou ARNI, betabloqueador, espironolactona e iSGLT2. Todos reduzem mortalidade."],
      ["Qual o papel do diurético de alça na insuficiência cardíaca?", "Trata a congestão e alivia sintomas, mas não reduz mortalidade."],
      ["Quais os cuidados ao prescrever ARNI e betabloqueador na insuficiência cardíaca?", "ARNI não pode ser usado junto com IECA pelo risco de angioedema, exigindo washout. O betabloqueador deve ser iniciado com o paciente compensado."],
    ],
    [
      ["Como se reconhece a fibrilação atrial no eletrocardiograma e qual seu principal risco?", "Ritmo irregularmente irregular sem onda P. O principal risco é o AVC cardioembólico."],
      ["Quais itens do escore CHA2DS2-VASc valem 2 pontos?", "Idade maior ou igual a 75 anos e AVC ou AIT prévio. Os demais itens valem 1 ponto cada."],
      ["A partir de qual pontuação de CHA2DS2-VASc se indica anticoagulação na fibrilação atrial?", "Em geral a partir de 2 pontos no homem e 3 pontos na mulher."],
      ["Qual a conduta na fibrilação atrial com instabilidade hemodinâmica?", "Cardioversão elétrica sincronizada imediata. São sinais de instabilidade hipotensão, dor, insuficiência cardíaca e alteração de consciência."],
      ["Qual antitrombótico é adequado na fibrilação atrial de alto risco embólico?", "Anticoagulação plena com DOAC ou varfarina, nunca AAS. O risco de sangramento é avaliado pelo HAS-BLED."],
    ],
    [
      ["Qual o principal agente da pneumonia adquirida na comunidade e sua apresentação clínica?", "O pneumococo. Cursa com tosse, febre, dispneia, dor pleurítica e estertores."],
      ["Quais são os cinco componentes do CURB-65?", "Confusão, ureia acima de 50, frequência respiratória maior ou igual a 30, pressão arterial abaixo de 90/60 e idade de 65 anos ou mais."],
      ["Como o escore CURB-65 orienta a conduta na pneumonia?", "Pontuação 0 a 1 permite tratamento ambulatorial e pontuação maior ou igual a 2 leva a considerar internação. O escore define o local de tratamento."],
      ["Qual o esquema antibiótico para pneumonia em paciente hígido tratado ambulatorialmente?", "Amoxicilina, associada ou não a macrolídeo, ou outro betalactâmico, em paciente sem comorbidade."],
      ["Qual o esquema antibiótico da pneumonia no paciente internado e o que fazer diante de derrame pleural?", "Betalactâmico com macrolídeo ou quinolona respiratória. Diante de derrame parapneumônico, avaliar toracocentese para excluir empiema."],
    ],
    [
      ["Qual o padrão laboratorial do hipotireoidismo primário e sua causa mais comum?", "TSH alto com T4 livre baixo. A causa comum é a tireoidite de Hashimoto, marcada pelo anti-TPO."],
      ["Qual o padrão laboratorial do hipertireoidismo e a causa mais comum?", "TSH baixo com T4 e T3 elevados. A causa comum é a doença de Graves, com TRAb, bócio e oftalmopatia."],
      ["O que caracteriza o hipotireoidismo subclínico e como decidir o tratamento?", "TSH alto com T4 normal. O tratamento é decidido conforme o valor do TSH, os sintomas e a presença de gestação."],
      ["Qual o tratamento do hipotireoidismo e do hipertireoidismo?", "Hipotireoidismo é tratado com levotiroxina. Hipertireoidismo com metimazol, betabloqueador e, conforme o caso, iodo radioativo ou cirurgia."],
      ["Por que o hipotireoidismo deve sempre ser tratado na gestação?", "Pelo risco fetal associado. O TSH é o melhor teste inicial, e a tempestade tireoidiana é uma emergência."],
    ],
    [
      ["Como se classificam as anemias pelo VCM?", "Microcítica na ferropriva, talassemia e doença crônica; normocítica na doença crônica, hemolítica e aguda; macrocítica na deficiência de B12 ou folato, hipotireoidismo e álcool."],
      ["Qual o achado laboratorial típico da anemia ferropriva e a conduta obrigatória?", "Ferritina baixa. É obrigatório investigar a causa do sangramento, geralmente trato gastrointestinal no adulto e menstrual na mulher, além de repor ferro."],
      ["Por que a anemia ferropriva em homem ou mulher pós-menopausa exige investigação do trato gastrointestinal?", "Porque pode indicar câncer. Nunca se deve repor apenas ferro sem identificar a causa."],
      ["Quais achados sugerem anemia por deficiência de vitamina B12 e quais suas causas?", "Anemia associada a sintomas neurológicos por mielinose. As causas incluem anemia perniciosa, veganismo e má absorção."],
      ["Por que não se deve repor folato isoladamente diante de suspeita de deficiência de B12?", "Porque a reposição isolada de folato mascara o quadro, enquanto o déficit de B12 continua causando sintoma neurológico."],
    ],
    [
      ["Quais são os sintomas típicos da DRGE e como se faz o diagnóstico?", "Pirose e regurgitação. O diagnóstico é clínico, reservando a endoscopia para casos com sinais de alarme."],
      ["Quais são os sinais de alarme que indicam endoscopia na DRGE?", "Disfagia, emagrecimento, anemia, sangramento e idade acima de 40 a 45 anos com sintomas novos. Servem para excluir neoplasia."],
      ["Qual a conduta na dispepsia em paciente com menos de 45 anos sem sinais de alarme?", "Testar e tratar H. pylori. A endoscopia fica reservada aos casos com sinais de alarme."],
      ["Qual o esquema de erradicação do H. pylori e sua importância clínica?", "IBP associado a dois antibióticos. O H. pylori está associado a úlcera péptica e câncer gástrico."],
      ["Quais as principais causas de úlcera péptica e por que a úlcera gástrica exige controle de cura?", "H. pylori e AINE são as causas principais. A úlcera gástrica exige controle de cura pelo risco de câncer."],
    ],
    [
      ["Qual o principal agente da cistite e o tratamento na mulher jovem não complicada?", "E. coli é o principal agente. O tratamento é empírico e curto, com nitrofurantoína ou fosfomicina."],
      ["Quais achados caracterizam pielonefrite e quando internar?", "Febre, dor lombar e Giordano positivo. Trata-se com antibiótico sistêmico, internando casos graves e gestantes."],
      ["Em quais situações a bacteriúria assintomática deve ser tratada?", "Apenas em gestantes e antes de procedimento urológico invasivo. Fora dessas situações, não se trata."],
      ["Quais fatores caracterizam uma infecção urinária como complicada?", "Sexo masculino, gestação, sonda vesical, anomalia do trato urinário e imunossupressão. ITU em homem é sempre complicada."],
      ["Por que a bacteriúria na gestante deve ser tratada?", "Pelo risco de pielonefrite e prematuridade."],
    ],
    [
      ["Quais características definem a crise de migrânea e qual seu tratamento?", "Dor unilateral e pulsátil com fotofobia, fonofobia e náusea, que piora com esforço, podendo ter aura. Trata-se a crise com analgésico ou triptano e indica-se profilaxia se frequente."],
      ["Como diferenciar cefaleia tensional da cefaleia em salvas?", "A tensional é bilateral, em peso e sem náusea. A em salvas é unilateral periorbitária, muito intensa e acompanhada de sintomas autonômicos."],
      ["Quais são os sinais de alarme que sugerem cefaleia secundária?", "Início súbito descrito como a pior da vida, febre com rigidez de nuca, déficit focal, primeira crise após os 50 anos, imunossupressão, piora progressiva e papiledema."],
      ["Qual a conduta diante de cefaleia súbita e intensa do tipo thunderclap?", "Investigar hemorragia subaracnóidea com tomografia e punção lombar."],
      ["O que mudam os sinais de alarme na abordagem de uma cefaleia?", "Mudam a conduta de tratamento apenas sintomático para investigação com imagem."],
    ],
    [
      ["Qual a proporção do AVC isquêmico e as janelas de reperfusão citadas?", "Cerca de 85% dos casos são isquêmicos. A trombólise é feita até 4,5 horas e a trombectomia em casos selecionados."],
      ["Por que a tomografia é obrigatória na avaliação inicial do AVC?", "Para excluir hemorragia. No AVC hemorrágico a tomografia mostra sangue e a conduta envolve controle pressórico e neurocirurgia conforme o caso."],
      ["O que é o AIT e por que ele é considerado uma urgência?", "Déficit neurológico transitório sem infarto estabelecido. É urgência pelo alto risco de AVC subsequente, avaliado pelo escore ABCD2, exigindo investigação e prevenção rápidas."],
      ["Como se faz a prevenção secundária após AVC isquêmico?", "Antiagregante nos casos não cardioembólicos, anticoagulação quando há fibrilação atrial, estatina e controle dos fatores de risco."],
      ["Como manejar a pressão arterial na fase aguda do AVC isquêmico?", "Não baixar a pressão agressivamente, exceto se houver indicação de trombólise ou níveis muito elevados."],
    ],
    [
      ["Quais exames e escore são usados na investigação de trombose venosa profunda?", "Escore de Wells, D-dímero, que tem alto valor preditivo negativo, e ultrassonografia com Doppler. A apresentação é dor e edema assimétrico de membro."],
      ["Qual a apresentação clínica do TEP e o exame confirmatório?", "Dispneia súbita, dor torácica, taquicardia e hipoxemia. A confirmação é feita por angiotomografia de tórax, usando Wells e PERC na estratificação."],
      ["Como interpretar o D-dímero na suspeita de tromboembolismo venoso?", "Um D-dímero negativo em paciente de baixa probabilidade exclui o diagnóstico pelo alto valor preditivo negativo, mas um resultado positivo não confirma."],
      ["Qual o tratamento do tromboembolismo venoso e quando indicar trombólise?", "Anticoagulação com DOAC ou heparina de baixo peso molecular. A trombólise fica reservada ao TEP com instabilidade hemodinâmica, o TEP maciço."],
      ["Como abordar a profilaxia de tromboembolismo venoso?", "Avaliar o risco em todo paciente internado ou cirúrgico e indicar profilaxia mecânica ou farmacológica conforme o caso."],
    ],
    [
      ["O que define um sintomático respiratório na investigação de tuberculose?", "Tosse por 3 semanas ou mais. O agente é o Mycobacterium tuberculosis, de transmissão respiratória."],
      ["Qual o exame inicial preferencial para o diagnóstico de tuberculose?", "O teste rápido molecular, o TRM-TB, complementado por baciloscopia, cultura e radiografia de tórax, que pode mostrar cavitação em ápices."],
      ["Qual o esquema básico de tratamento da tuberculose e sua duração?", "RIPE, com rifampicina, isoniazida, pirazinamida e etambutol por 2 meses de ataque, seguido de 4 meses de rifampicina e isoniazida, totalizando 6 meses, sob tratamento diretamente observado."],
      ["Como se diagnostica e trata a infecção latente por tuberculose?", "PPD ou IGRA positivo sem doença ativa, tratando grupos de risco com isoniazida ou rifapentina."],
      ["Quais efeitos e cuidados são associados à rifampicina e o que sempre rastrear no caso de tuberculose?", "A rifampicina deixa a urina alaranjada e interage com anticoncepcional. Todo caso de tuberculose exige rastreio de HIV e notificação compulsória."],
    ],
    [
      ["Como se faz o diagnóstico e o seguimento da infecção pelo HIV?", "Diagnóstico com dois testes, rápidos ou sorológicos, e acompanhamento com carga viral e CD4 para estadiamento e seguimento."],
      ["Quando iniciar a terapia antirretroviral e qual a meta do tratamento?", "Iniciar para todos, independentemente do CD4 e o mais precoce possível, com esquema preferencial no Brasil incluindo dolutegravir. A meta é carga viral indetectável, pois indetectável é igual a intransmissível."],
      ["Qual a diferença entre PrEP e PEP e qual o prazo da PEP?", "A PrEP é profilaxia pré-exposição para pessoas com risco elevado, e a PEP é pós-exposição, devendo ser iniciada em até 72 horas."],
      ["Como se diagnostica e trata a sífilis?", "Diagnóstico com teste treponêmico associado a não treponêmico, como o VDRL. O tratamento é penicilina benzatina, conforme o estágio."],
      ["Por que toda gestante com sífilis deve ser tratada e o que fazer diante de qualquer IST?", "Porque a sífilis na gestação traz risco de sífilis congênita, devendo tratar também o parceiro. Toda IST é oportunidade de testar HIV, sífilis e hepatites."],
    ],
    [
      ["Quais são os sinais de alarme da dengue?", "Dor abdominal intensa, vômitos persistentes, sangramento de mucosa, letargia, hepatomegalia e aumento do hematócrito com queda de plaquetas."],
      ["Como se classificam os casos de dengue?", "Sem sinais de alarme nos grupos A e B, com sinais de alarme no grupo C e dengue grave no grupo D, com choque, sangramento grave ou disfunção orgânica."],
      ["Qual o pilar do manejo da dengue e o que fazer nos grupos C e D?", "A hidratação é o pilar do tratamento. Os grupos C e D recebem hidratação venosa com observação ou internação."],
      ["Por que se deve evitar AINE e AAS na dengue e em que momento ocorre a fase crítica?", "Pelo risco de sangramento. A fase crítica ocorre na defervescência, quando surgem os sinais de alarme."],
      ["Como diferenciar chikungunya e zika no quadro das arboviroses?", "A chikungunya cursa com artralgia intensa e persistente. A zika cursa com exantema e traz risco de microcefalia na gestante e de síndrome de Guillain-Barré."],
    ],
    [
      ["Quais as formas de transmissão das hepatites A, B e C?", "A hepatite A é fecal-oral, a B é sexual, sanguínea e vertical, e a C é por via sanguínea."],
      ["Qual hepatite é aguda e autolimitada e quais podem cronificar?", "A hepatite A é aguda e autolimitada, com vacina no calendário. A hepatite B pode cronificar e a C tem alta taxa de cronificação."],
      ["O que significam HBsAg, anti-HBs, HBeAg e anti-HBc?", "HBsAg indica infecção, anti-HBs indica imunidade por vacina ou cura, HBeAg indica replicação e anti-HBc indica contato prévio com o vírus."],
      ["Como interpretar anti-HBs isolado positivo e HBsAg positivo por mais de 6 meses?", "Anti-HBs isolado positivo indica imunidade vacinal. HBsAg positivo por mais de 6 meses caracteriza hepatite B crônica."],
      ["Qual o cenário atual do tratamento da hepatite C?", "A hepatite C é hoje curável com antivirais de ação direta."],
    ],
    [
      ["Qual o achado clínico chave da hanseníase?", "Lesão de pele com alteração de sensibilidade térmica, dolorosa ou tátil, além de espessamento de nervo. O agente é o M. leprae."],
      ["Como se classifica a hanseníase e qual seu tratamento?", "Paucibacilar com até 5 lesões e multibacilar acima disso. O tratamento é a poliquimioterapia, e a doença é de notificação compulsória."],
      ["Quais as duas formas de leishmaniose e suas apresentações?", "A tegumentar, com úlcera cutânea de bordas elevadas, e a visceral ou calazar, forma grave com febre, hepatoesplenomegalia e pancitopenia."],
      ["Qual o agente e o vetor da doença de Chagas e quais suas manifestações crônicas?", "O agente é o T. cruzi, transmitido pelo barbeiro. Na fase crônica ocorrem cardiopatia e megacólon ou megaesôfago."],
      ["Quais outras doenças negligenciadas devem ser consideradas conforme a epidemiologia local?", "Esquistossomose e parasitoses intestinais, avaliadas de acordo com a epidemiologia local."],
    ],
    [
      ["Por que a hiponatremia deve ser corrigida lentamente?", "Pelo risco de mielinólise pontina se a correção for rápida. É o distúrbio mais comum e causa sintomas neurológicos quando aguda ou grave."],
      ["O que caracteriza a hipernatremia e como corrigi-la?", "Corresponde a déficit de água e deve ser reposta com cautela."],
      ["Quais alterações eletrocardiográficas indicam hipercalemia?", "Onda T apiculada, evoluindo para alargamento do QRS. O principal risco é a arritmia."],
      ["Qual a primeira medida na hipercalemia com alteração de ECG e por quê?", "Gluconato de cálcio, porque estabiliza a membrana e protege o coração. Depois se desloca o potássio com insulina e glicose e beta-2 e se remove com resina ou diálise."],
      ["Quais os sintomas da hipocalemia e como repor?", "Fraqueza e arritmia. A reposição é de potássio associada à correção do magnésio."],
    ],
    [
      ["Quais manifestações e anticorpos caracterizam o lúpus eritematoso sistêmico?", "Doença multissistêmica de mulher jovem, com rash malar, fotossensibilidade, manifestações articulares, nefrite, alterações hematológicas e serosites. O FAN é sensível, enquanto anti-dsDNA e anti-Sm são específicos."],
      ["Qual o padrão articular da artrite reumatoide e quais seus marcadores?", "Poliartrite simétrica de pequenas articulações com rigidez matinal acima de 1 hora. Os marcadores são fator reumatoide e anti-CCP, este mais específico."],
      ["Qual o tratamento de base da artrite reumatoide?", "Metotrexato, um DMARD."],
      ["Como diferenciar osteoartrite de artrite reumatoide pela dor?", "A osteoartrite é degenerativa, com dor mecânica que piora com o uso e sem inflamação sistêmica, enquanto a artrite reumatoide cursa com rigidez matinal prolongada e acometimento simétrico."],
      ["Qual a apresentação clássica da gota?", "Monoartrite aguda em podagra, no primeiro metatarso, com cristais de urato e elevação do ácido úrico."],
    ],
    [
      ["Quais são as complicações microvasculares do diabetes e como rastreá-las?", "Retinopatia, rastreada com fundo de olho, nefropatia, com albuminúria e TFG, e neuropatia."],
      ["Quais são as complicações macrovasculares do diabetes?", "Doença arterial coronariana, AVC e doença arterial periférica."],
      ["Quais os três componentes do pé diabético?", "Neuropatia, isquemia e infecção. A úlcera traz risco de amputação."],
      ["Como rastrear e prevenir o pé diabético?", "Rastrear com monofilamento e educar quanto a calçados adequados e inspeção diária dos pés. A prevenção evita amputação."],
      ["Por que a neuropatia diabética aumenta o risco de evolução da úlcera no pé?", "Porque mascara a dor da úlcera, retardando a percepção da lesão. Por isso as complicações do diabetes devem ser rastreadas a cada consulta."],
    ],
  ],
  urgencia: [
    [
      ["Qual é a sequência da cadeia de sobrevivência na parada cardiorrespiratória?", "Reconhecer e acionar ajuda, RCP precoce, desfibrilação precoce, suporte avançado de vida e cuidados pós-parada."],
      ["Quais são os parâmetros de uma RCP de qualidade?", "Compressões de 100 a 120 por minuto, profundidade de 5 a 6 cm, retorno total do tórax e mínima interrupção. A relação é 30:2 sem via aérea avançada."],
      ["Quais ritmos de parada são chocáveis e como são tratados?", "Fibrilação ventricular e taquicardia ventricular sem pulso. O tratamento é desfibrilação associada a RCP, adrenalina e amiodarona nos casos refratários."],
      ["Qual a conduta nos ritmos não chocáveis de parada?", "Em AESP e assistolia faz-se RCP e adrenalina. Não se desfibrila esses ritmos."],
      ["Qual a dose e o intervalo da adrenalina na parada cardiorrespiratória?", "1 mg por via intravenosa a cada 3 a 5 minutos, em todos os ritmos de parada. As causas reversíveis são pesquisadas pelos 5H e 5T."],
    ],
    [
      ["Quais são as três medidas iniciais diante da suspeita de síndrome coronariana aguda?", "Realizar ECG em até 10 minutos, dosar troponina e administrar AAS."],
      ["Qual a conduta na síndrome coronariana aguda com supra de ST?", "Há oclusão total, portanto indica-se reperfusão imediata: intervenção coronariana percutânea primária em menos de 90 a 120 minutos ou trombólise em até 12 horas."],
      ["Como se diferencia IAM sem supra de ST da angina instável?", "Pela troponina: se estiver positiva trata-se de IAMSSST; se negativa, angina instável."],
      ["Qual o manejo da síndrome coronariana aguda sem supra de ST?", "Estratificar o risco por escores como GRACE ou TIMI, iniciar antiagregação dupla e anticoagulação, e indicar cateterismo conforme o risco."],
      ["Em quais situações o nitrato é contraindicado na síndrome coronariana aguda?", "No infarto de ventrículo direito e em pacientes que usaram sildenafil. Além disso, no supra de ST a reperfusão não deve esperar o resultado da troponina."],
    ],
    [
      ["Como se define sepse pelo Sepsis-3?", "Infecção associada a disfunção orgânica, caracterizada por aumento do SOFA maior ou igual a 2 pontos."],
      ["Qual a definição de choque séptico?", "Necessidade de vasopressor para manter PAM maior ou igual a 65 mmHg somada a lactato acima de 2, apesar da reposição volêmica."],
      ["Quais são os três critérios do qSOFA?", "Frequência respiratória maior ou igual a 22, alteração do nível de consciência e pressão arterial sistólica menor ou igual a 100. Dois ou mais critérios são positivos, e o qSOFA serve como triagem."],
      ["O que compõe o bundle inicial da sepse?", "Dosar lactato, colher hemoculturas antes do antibiótico, iniciar antibiótico de amplo espectro na primeira hora, infundir cristaloide 30 mL/kg e usar noradrenalina se refratário, além de controlar o foco."],
      ["Qual medida do manejo da sepse tem maior impacto na sobrevida?", "O antibiótico precoce, administrado ainda na primeira hora e após a coleta de hemoculturas."],
    ],
    [
      ["Qual exame é obrigatório antes de qualquer terapia de reperfusão no AVC agudo?", "A tomografia de crânio urgente, para excluir hemorragia. Nunca se trombolisa sem TC prévia."],
      ["Quais são as janelas de reperfusão no AVC isquêmico?", "Trombólise intravenosa até 4,5 horas e trombectomia em oclusão de grande vaso, em casos selecionados até 24 horas."],
      ["Como se define o tempo de início nos casos de AVC percebidos ao acordar?", "Usa-se o último horário em que o paciente foi visto bem."],
      ["Como manejar a pressão arterial no AVC isquêmico agudo?", "O controle é permissivo, sem baixar a pressão agressivamente, tornando-se mais rígido apenas quando há indicação de trombólise."],
      ["Qual a conduta no AVC hemorrágico?", "Controle da pressão arterial, reversão da anticoagulação e avaliação neurocirúrgica conforme o caso."],
    ],
    [
      ["Quais são os critérios diagnósticos de anafilaxia?", "Início rápido com acometimento de dois ou mais sistemas, entre pele, respiratório, cardiovascular e gastrointestinal, ou hipotensão após exposição a alérgeno."],
      ["Qual a dose e a via da adrenalina na anafilaxia?", "Adrenalina intramuscular na coxa, 0,3 a 0,5 mg no adulto e 0,01 mg/kg na criança, na diluição 1:1000, repetindo a cada 5 a 15 minutos."],
      ["Qual o papel de anti-histamínicos e corticoides na anafilaxia?", "São apenas adjuvantes. O erro clássico é administrá-los e atrasar a adrenalina, o que pode ser fatal."],
      ["Quais medidas de suporte acompanham a adrenalina na anafilaxia?", "Decúbito com as pernas elevadas, oxigênio, reposição volêmica e broncodilatador como adjuvante."],
      ["Por que a anafilaxia exige observação prolongada?", "Pelo risco de reação bifásica. Vale lembrar que não existe contraindicação absoluta ao uso de adrenalina na anafilaxia."],
    ],
    [
      ["O que se avalia na etapa A do atendimento ao politraumatizado?", "Via aérea com proteção da coluna cervical. Glasgow menor ou igual a 8 é indicação de intubação."],
      ["Quais condições devem ser tratadas na etapa B do ABCDE?", "Pneumotórax hipertensivo, pneumotórax aberto, hemotórax maciço e tórax instável."],
      ["Por que o pneumotórax hipertensivo não espera radiografia?", "Porque o diagnóstico é clínico e a descompressão deve ser feita antes do raio X."],
      ["O que compõe as etapas C, D e E do atendimento ao politraumatizado?", "C é circulação com controle de hemorragia, dois acessos, cristaloide e hemoderivados; D é avaliação de Glasgow e pupilas; E é exposição evitando hipotermia."],
      ["Qual é a tríade letal do trauma e o que fazer na avaliação secundária?", "A tríade letal é hipotermia, acidose e coagulopatia. Na secundária faz-se exame completo e história AMPLA."],
    ],
    [
      ["Quais são os quatro tipos de choque?", "Hipovolêmico, cardiogênico, distributivo e obstrutivo."],
      ["Como se apresenta e se trata o choque hipovolêmico?", "Decorre de perda de volume ou sangue, por hemorragia ou desidratação, com estase jugular baixa. O tratamento é reposição de volume ou sangue."],
      ["O que caracteriza o choque cardiogênico?", "Falência de bomba, geralmente por infarto, com estase jugular alta e congestão. O manejo é de suporte e revascularização, com cautela na infusão de volume."],
      ["Quais são as causas de choque distributivo e obstrutivo?", "Distributivo por vasodilatação, como o séptico, o anafilático e o neurogênico, tratado com volume e vasopressor. Obstrutivo por TEP, tamponamento e pneumotórax hipertensivo, tratado pela causa."],
      ["Quais sinais clínicos indicam estado de choque?", "Hipotensão, taquicardia, oligúria, alteração de consciência e alterações de lactato e enchimento capilar."],
    ],
    [
      ["O que diferencia emergência de urgência hipertensiva?", "A emergência tem pressão muito elevada associada a lesão aguda de órgão-alvo; sem lesão é urgência, tratada por via oral. O que define é a lesão de órgão, não o valor da pressão."],
      ["Como reduzir a pressão na emergência hipertensiva?", "Com anti-hipertensivo intravenoso e redução controlada, em torno de 25 por cento na primeira hora. A exceção é a dissecção de aorta, em que se baixa rapidamente."],
      ["Qual a conduta na hipoglicemia?", "Glicose por via oral no paciente consciente ou glicose hipertônica intravenosa. Checar glicemia é a primeira medida em rebaixamento de consciência sem causa clara."],
      ["Como se define e se trata a cetoacidose diabética?", "Hiperglicemia com acidose de ânion-gap e cetose, típica do DM1. O tratamento é hidratação, insulina intravenosa e reposição de potássio, já que a insulina baixa o potássio."],
      ["O que caracteriza o estado hiperglicêmico hiperosmolar?", "Hiperglicemia extrema acima de 600 com hiperosmolaridade e sem cetoacidose, típico do DM2 e do idoso. A hidratação é o pilar do tratamento."],
    ],
    [
      ["Qual a abordagem geral das intoxicações exógenas?", "ABCDE, descontaminação com carvão ativado se menos de 1 hora e via aérea protegida, antídoto específico e suporte."],
      ["Quais são os antídotos para opioide, benzodiazepínico e paracetamol?", "Naloxona para opioide, flumazenil para benzodiazepínico com cuidado pelo risco de convulsão, e N-acetilcisteína para paracetamol."],
      ["Qual o antídoto da intoxicação por organofosforado?", "Atropina, até atingir a atropinização, associada à pralidoxima."],
      ["Quais os antídotos para metanol, etilenoglicol e ferro?", "Etanol ou fomepizol para metanol e etilenoglicol; desferroxamina para ferro."],
      ["Que quadro clínico sugere intoxicação por opioide?", "Rebaixamento de consciência com miose e frequência respiratória baixa, indicando naloxona. A síndrome colinérgica do organofosforado cursa com miose, sialorreia e bradicardia."],
    ],
    [
      ["Como se classificam as queimaduras por profundidade?", "Primeiro grau atinge a epiderme com eritema, segundo grau cursa com bolhas e dor, e terceiro grau é indolor com aspecto esbranquiçado ou carbonizado."],
      ["Como se estima a extensão e se calcula a reposição volêmica nas queimaduras?", "A superfície é estimada pela regra dos nove e a reposição volêmica nos casos extensos é guiada pela fórmula de Parkland."],
      ["Quais são os critérios de gravidade da queimadura?", "Extensão, acometimento de face, mãos ou períneo, lesão inalatória, queimadura elétrica ou química e extremos de idade."],
      ["Que sinais indicam queimadura de via aérea e qual a conduta?", "Rouquidão, fuligem e pelos nasais chamuscados indicam risco de obstrução, exigindo intubação precoce."],
      ["Qual a prioridade no atendimento ao afogamento?", "A hipoxemia é o problema central, então prioriza-se ventilação e oxigenação, iniciando a reanimação pelas vias aéreas e ventilação."],
    ],
    [
      ["Qual a diferença entre insuficiência respiratória tipo I e tipo II?", "O tipo I é hipoxêmico, por falha de oxigenação, como em SDRA e pneumonia. O tipo II é hipercápnico, por falha de ventilação com retenção de CO2, como em DPOC e depressão do sistema nervoso central."],
      ["Em quais situações a ventilação não invasiva é indicada?", "Na exacerbação de DPOC e no edema agudo de pulmão, sendo primeira linha nesses casos e evitando a intubação."],
      ["Quais são as indicações de intubação na insuficiência respiratória?", "Falha do suporte, rebaixamento com Glasgow menor ou igual a 8 e fadiga respiratória."],
      ["Como se apresenta o edema agudo de pulmão cardiogênico?", "Com dispneia, estertores e hipertensão."],
      ["Qual o tratamento do edema agudo de pulmão cardiogênico?", "Ventilação não invasiva, nitrato e diurético, além de sentar o paciente."],
    ],
    [
      ["Qual exame é obrigatório na avaliação de dor abdominal em mulher em idade fértil?", "O beta-hCG, sempre, para afastar gravidez e gestação ectópica."],
      ["Quais causas de abdome agudo não podem passar despercebidas?", "Ectópica rota, aneurisma roto, isquemia mesentérica, apendicite, obstrução com estrangulamento, perfuração, pancreatite grave e infarto de parede inferior manifestado como dor epigástrica."],
      ["Como se faz o diagnóstico de pancreatite aguda?", "Dor epigástrica em faixa com amilase ou lipase pelo menos três vezes acima do valor de referência. As principais causas são biliar e alcoólica."],
      ["Qual o manejo inicial da pancreatite aguda e como avaliar gravidade?", "Hidratação, analgesia e jejum, com a gravidade estimada por escores como Ranson e APACHE."],
      ["Que hipótese considerar em idoso com dor abdominal desproporcional ao exame físico?", "Isquemia mesentérica."],
    ],
    [
      ["Quais são os passos da interpretação de um distúrbio ácido-base?", "Avaliar o pH, definindo acidose abaixo de 7,35 e alcalose acima de 7,45, depois verificar se é respiratório pelo pCO2 ou metabólico pelo HCO3, e por fim avaliar a compensação."],
      ["Como se calcula o ânion-gap?", "Ânion-gap é igual ao sódio menos a soma de cloro e bicarbonato."],
      ["Quais causas de acidose metabólica cursam com ânion-gap elevado?", "Cetoacidose, acidose lática, uremia e intoxicações, lembradas pelo mnemônico MUDPILES."],
      ["Por que a diarreia causa acidose metabólica com ânion-gap normal?", "Porque há perda de bicarbonato, ao contrário das causas de ânion-gap elevado."],
      ["O que caracteriza os distúrbios respiratórios e a alcalose metabólica?", "Acidose respiratória tem pCO2 alto por hipoventilação ou DPOC e alcalose respiratória tem pCO2 baixo por hiperventilação. A alcalose metabólica cursa com HCO3 alto, por vômitos ou diuréticos."],
    ],
  ],
  go: [
    [
      ["Qual o número mínimo de consultas de pré-natal e até quando deve ser o início?", "No mínimo 6 consultas, com início até 12 semanas. Em toda consulta se avalia PA, peso, altura uterina, BCF e movimentos fetais."],
      ["Quais exames sorológicos compõem a rotina do primeiro trimestre do pré-natal?", "HIV, VDRL, HBsAg e toxoplasmose, além de tipagem sanguínea/Rh, Coombs, hemograma, glicemia, urina com urocultura e ultrassonografia."],
      ["Em que idade gestacional se faz o TOTG e em que idade se pesquisa o estreptococo do grupo B?", "O TOTG é feito entre 24 e 28 semanas, junto com a ultrassonografia morfológica do segundo trimestre. A pesquisa de estreptococo B é entre 35 e 37 semanas, no terceiro trimestre, quando também se repetem as sorologias."],
      ["Qual suplementação é indicada no pré-natal e qual sua principal finalidade?", "Ácido fólico da pré-concepção até 12 semanas, para prevenir defeitos do tubo neural, além de ferro."],
      ["Por que a dTpa é repetida a cada gestação e qual a restrição vacinal na gravidez?", "A dTpa é aplicada a cada gestação para proteger o recém-nascido da coqueluche. Vacinas de vírus vivo são contraindicadas; hepatite B e influenza fazem parte da rotina."],
    ],
    [
      ["Quais são os critérios diagnósticos de pré-eclâmpsia?", "PA maior ou igual a 140/90 após 20 semanas associada a proteinúria ou a disfunção de órgão-alvo."],
      ["Quais achados caracterizam pré-eclâmpsia com sinais de gravidade?", "PA maior ou igual a 160/110, sintomas neurológicos, epigastralgia, plaquetopenia e alteração hepática ou renal."],
      ["O que define a síndrome HELLP?", "Hemólise, elevação de enzimas hepáticas e plaquetopenia."],
      ["Qual o papel do sulfato de magnésio na pré-eclâmpsia e qual seu antídoto?", "O sulfato de magnésio previne e trata a eclâmpsia, não sendo anti-hipertensivo. O antídoto é o gluconato de cálcio; a intoxicação evolui de arreflexia para depressão respiratória."],
      ["Como se previne a pré-eclâmpsia em gestante de alto risco e qual é o tratamento definitivo?", "Prevenção com AAS iniciado no primeiro trimestre e cálcio. O tratamento definitivo é o parto, com resolução conforme idade gestacional e gravidade; anti-hipertensivo se PA maior ou igual a 160/110."],
    ],
    [
      ["Como é feito o rastreio de diabetes gestacional na primeira consulta?", "Glicemia de jejum na primeira consulta: valor maior ou igual a 126 indica diabetes prévio e entre 92 e 125 fecha diabetes gestacional. Se o jejum for menor que 92, faz-se TOTG 75 g entre 24 e 28 semanas."],
      ["Quais os pontos de corte do TOTG 75 g para diagnóstico de diabetes gestacional?", "Jejum maior ou igual a 92, uma hora maior ou igual a 180 e duas horas maior ou igual a 153. Um único valor alterado já fecha o diagnóstico."],
      ["Qual o tratamento de primeira linha do diabetes gestacional e quando escalonar?", "Dieta e exercício são a primeira linha. Se as metas não forem atingidas, indica-se insulina, o fármaco de escolha na gestação."],
      ["Quais são as metas glicêmicas no diabetes gestacional?", "Jejum abaixo de 95, uma hora pós-prandial abaixo de 140 e duas horas abaixo de 120."],
      ["Quais as repercussões do diabetes gestacional e qual a conduta após o parto?", "Macrossomia, distocia e hipoglicemia neonatal. Reavaliar com TOTG entre 6 e 12 semanas do pós-parto pelo risco de diabetes tipo 2."],
    ],
    [
      ["Quais são as principais causas de sangramento na primeira metade da gestação?", "Abortamento, avaliado pelo colo aberto ou fechado, gestação ectópica e mola hidatiforme."],
      ["Que quadro deve levantar suspeita de gestação ectópica e como investigar?", "Mulher em idade fértil com dor, atraso menstrual e sangramento. Investigar com beta-hCG e ultrassonografia; a ectópica rota é emergência."],
      ["Quais achados sugerem gestação molar?", "Beta-hCG muito elevado e imagem ultrassonográfica em tempestade de neve."],
      ["Como se apresenta a placenta prévia e qual cuidado no exame?", "Sangramento indolor, vermelho-vivo e recorrente na segunda metade da gestação. O diagnóstico é ultrassonográfico e o toque vaginal não deve ser realizado."],
      ["Como diferenciar descolamento prematuro de placenta da placenta prévia?", "O descolamento cursa com dor e hipertonia uterina, sangramento que pode ser oculto e sofrimento fetal, associado a hipertensão e trauma. A placenta prévia é indolor. O descolamento é emergência."],
    ],
    [
      ["Qual a faixa etária e a periodicidade do rastreio do câncer de colo do útero?", "Citopatológico dos 25 aos 64 anos em mulheres com vida sexual; após dois exames anuais normais, passa a ser trienal."],
      ["Qual agente é causa necessária do câncer de colo do útero?", "O HPV, cuja infecção é prevenível pela vacina."],
      ["Como o Ministério da Saúde orienta o rastreio do câncer de mama no SUS?", "Mamografia bienal dos 50 aos 69 anos, associada ao exame clínico das mamas."],
      ["Em que situações o rastreio mamográfico começa mais cedo?", "Sociedades defendem início aos 40 anos, e mulheres de alto risco, como portadoras de mutação BRCA, iniciam de forma precoce."],
      ["Quais são os sinais de alerta para câncer de mama no exame?", "Nódulo endurecido, retração da pele, descarga papilar sanguinolenta e linfonodo axilar palpável."],
    ],
    [
      ["Que critérios orientam a escolha do método contraceptivo?", "Preferência da usuária, eficácia do método e critérios de elegibilidade da OMS, categorizados de 1 a 4."],
      ["Qual método contraceptivo oferece proteção contra infecções sexualmente transmissíveis?", "Apenas os métodos de barreira, como o preservativo, garantindo a dupla proteção."],
      ["Quais são as contraindicações ao uso de contraceptivo hormonal combinado?", "Tabagismo em mulheres com 35 anos ou mais, enxaqueca com aura, hipertensão não controlada e tromboembolismo venoso ou trombofilia."],
      ["Por que a enxaqueca com aura contraindica o estrogênio e qual alternativa usar?", "A associação de enxaqueca com aura e estrogênio aumenta o risco de acidente vascular cerebral. O progestagênio isolado é opção, também útil na amamentação e no risco de tromboembolismo."],
      ["Quais são os métodos contraceptivos mais eficazes e qual o prazo da contracepção de emergência?", "Os LARCs, que incluem DIU de cobre, DIU hormonal e implante, são os mais eficazes por independerem da adesão e são reversíveis. O levonorgestrel de emergência pode ser usado em até 72 a 120 horas."],
    ],
    [
      ["Qual a primeira conduta diante de sangramento uterino anormal em mulher em idade fértil?", "Excluir gravidez com beta-hCG antes de qualquer investigação."],
      ["O que representa o acrônimo PALM no sistema PALM-COEIN?", "As causas estruturais de sangramento uterino anormal: pólipo, adenomiose, leiomioma e malignidade."],
      ["Quais causas não estruturais compõem o COEIN?", "Coagulopatia, disfunção ovulatória, causa endometrial, iatrogênica e não classificada."],
      ["Quando indicar biópsia de endométrio na investigação do sangramento uterino anormal?", "Diante de risco de malignidade: idade acima de 45 anos, obesidade, síndrome dos ovários policísticos, anovulação, uso de tamoxifeno ou espessamento endometrial."],
      ["Qual a conduta diante de sangramento na pós-menopausa e quais opções terapêuticas existem no sangramento uterino anormal?", "Qualquer sangramento na pós-menopausa exige investigação de câncer de endométrio com biópsia. O tratamento é direcionado à causa: hormonal com combinado, progestagênio ou DIU de levonorgestrel, antifibrinolítico e cirurgia nas causas estruturais."],
    ],
    [
      ["Quais achados caracterizam a candidíase vulvovaginal e qual o tratamento?", "Prurido, corrimento branco em leite coalhado e pH menor que 4,5. Trata-se com azólico."],
      ["Qual a tríade diagnóstica da vaginose bacteriana e o tratamento?", "Corrimento acinzentado com odor de peixe, presença de clue cells e pH maior que 4,5. Trata-se com metronidazol."],
      ["Como se apresenta a tricomoníase e qual a particularidade do tratamento?", "Corrimento amarelo-esverdeado e colo em framboesa; é uma infecção sexualmente transmissível. Trata-se com metronidazol, incluindo o parceiro."],
      ["Como diferenciar as principais úlceras genitais?", "Sífilis cursa com cancro duro e indolor, herpes com vesículas dolorosas e cancroide com úlcera dolorosa."],
      ["Como se manifesta a doença inflamatória pélvica e qual a consequência de não tratá-la?", "Dor pélvica, febre e dor à mobilização do colo, causada por infecções sexualmente transmissíveis como clamídia e gonococo, tratada com antibiótico de amplo espectro. Sem tratamento, evolui para infertilidade e gestação ectópica."],
    ],
    [
      ["Quais são os períodos do parto?", "Dilatação, expulsivo, dequitação da placenta e o quarto período, que corresponde à primeira hora após o parto, voltado à hemostasia."],
      ["Para que serve o partograma?", "Acompanha a evolução do trabalho de parto e permite identificar distocias."],
      ["Qual a principal causa de hemorragia pós-parto e o achado que a sugere?", "A atonia uterina, sugerida pelo útero amolecido."],
      ["Como se maneja a hemorragia pós-parto e quais causas devem ser investigadas?", "Massagem uterina, ocitocina, misoprostol e ácido tranexâmico, investigando os quatro T: tônus, trauma, tecido e trombina. A ocitocina profilática no terceiro período reduz a hemorragia."],
      ["Quais pontos devem ser acompanhados no puerpério?", "Involução uterina, loquiação, apoio à amamentação, contracepção e rastreio de depressão pós-parto."],
    ],
    [
      ["Como se define menopausa e qual a diferença para climatério?", "Menopausa é a cessação da menstruação por 12 meses, em média por volta dos 50 anos. Climatério é o período de transição."],
      ["Quais são os principais sintomas e riscos do climatério?", "Fogachos, atrofia urogenital e alterações do sono e do humor, com aumento do risco de osteoporose e cardiovascular."],
      ["Qual a principal indicação da terapia hormonal no climatério e qual é a janela de oportunidade?", "Alívio dos sintomas vasomotores, dentro da janela de oportunidade, ou seja, abaixo de 60 anos ou com menos de 10 anos de menopausa."],
      ["Quais são as contraindicações à terapia hormonal?", "Câncer de mama, tromboembolismo venoso, doença hepática e sangramento não esclarecido."],
      ["Qual a conduta na atrofia vaginal isolada e quando rastrear osteoporose?", "Atrofia vaginal isolada é tratada com estrogênio tópico. A densitometria óssea é indicada na pós-menopausa com fatores de risco."],
    ],
    [
      ["Como se define infertilidade e a partir de quando investigar?", "Ausência de gravidez após 12 meses de tentativas, ou 6 meses quando a mulher tem mais de 35 anos."],
      ["Que fatores devem ser investigados na avaliação do casal infértil?", "Fator ovulatório, tubário, uterino e masculino, este último avaliado pelo espermograma."],
      ["O que é endometriose e qual seu quadro clínico típico?", "Presença de tecido endometrial fora do útero, que cursa com dismenorreia progressiva, dispareunia, dor pélvica crônica e infertilidade."],
      ["Como se diagnostica e trata a endometriose?", "Diagnóstico por clínica associada a imagem, podendo recorrer à laparoscopia. Tratamento hormonal de supressão ou cirúrgico."],
      ["Quais são os critérios de Rotterdam para síndrome dos ovários policísticos?", "Dois de três: oligo ou anovulação, hiperandrogenismo e ovários policísticos. A síndrome se associa à resistência insulínica."],
    ],
  ],
  pediatria: [
    [
      ["Quais medidas são acompanhadas nas curvas da OMS e qual a faixa de escore-z considerada normal?", "Peso, estatura, perímetro cefálico e IMC são plotados nas curvas da OMS. A faixa de normalidade vai de escore-z -2 a +2."],
      ["Na avaliação do crescimento, o que vale mais: um ponto isolado ou a velocidade?", "A velocidade de crescimento importa mais que o ponto isolado na curva. Um único valor não define o padrão de crescimento da criança."],
      ["Em que idades se esperam sorriso social, sustento cefálico, sentar sem apoio e pinça?", "Sorriso social aos 2 meses, sustento cefálico entre 3 e 4 meses, sentar sem apoio entre 6 e 9 meses e pinça aos 9 meses."],
      ["Quais são os sinais de alerta de atraso do desenvolvimento por idade?", "Não sentar aos 9 meses, não andar aos 18 meses e não falar aos 18 meses. Regressão de habilidade já adquirida é sempre patológica."],
      ["Como avaliar os marcos do desenvolvimento em uma criança nascida prematura?", "É preciso corrigir a idade até cerca de 2 anos. Essa é uma pegadinha clássica: sem a correção, o prematuro parece atrasado."],
    ],
    [
      ["Quais vacinas são aplicadas ao nascer?", "BCG e Hepatite B. É pegadinha frequente de prova a dupla ao nascimento."],
      ["Quais vacinas compõem o esquema dos 2 e dos 4 meses?", "Penta, VIP, Pneumocócica 10 e Rotavírus, nas duas idades. Meningo C entra aos 3 e aos 5 meses."],
      ["O que é aplicado aos 9 e aos 12 meses?", "Aos 9 meses, febre amarela. Aos 12 meses, tríplice viral mais os reforços de Pneumo e Meningo C."],
      ["Quais vacinas estão previstas aos 15 meses e aos 4 anos?", "Aos 15 meses: DTP, VOP, Hepatite A e tetra viral. Aos 4 anos: DTP, VOP, varicela e reforço de febre amarela."],
      ["Quais as principais armadilhas do calendário vacinal infantil?", "Rotavírus tem limite de idade para aplicação e vacina de vírus vivo é contraindicada em imunossupressão. Falsas contraindicações não devem impedir a vacinação."],
    ],
    [
      ["Qual a conduta na maioria das infecções de vias aéreas superiores na infância?", "A maioria é viral, portanto o tratamento é sintomático. Antibiótico fica reservado a quadros bacterianos definidos."],
      ["Como reconhecer e tratar a faringite estreptocócica?", "Sugerem estreptococo o exsudato e a ausência de tosse. O tratamento é penicilina ou amoxicilina, que previne febre reumática."],
      ["Quais os pontos de corte de taquipneia do AIDPI por faixa etária?", "Menor de 2 meses: 60 ou mais incursões por minuto; de 2 a 11 meses: 50 ou mais; de 1 a 5 anos: 40 ou mais."],
      ["Qual o agente bacteriano principal e o tratamento ambulatorial da pneumonia na criança?", "O pneumococo é a principal bactéria e a amoxicilina é a opção ambulatorial. Tiragem subcostal indica gravidade e lactente menor de 2 meses com pneumonia deve ser internado."],
      ["Como se apresenta e como se trata a bronquiolite por VSR?", "Lactente com pródromo viral e sibilância. O manejo é de suporte, com oxigênio e hidratação, sem uso rotineiro de broncodilatador ou corticoide."],
    ],
    [
      ["Em que consiste o plano A no manejo da diarreia?", "Indicado para criança sem desidratação: terapia de reidratação oral em casa, manutenção da alimentação e zinco."],
      ["Qual o volume e o tempo da reidratação oral no plano B?", "Cerca de 75 mL/kg em 4 horas, com terapia de reidratação oral supervisionada no serviço de saúde."],
      ["Quando está indicado o plano C e o que ele prevê?", "Na desidratação grave ou choque. Exige hidratação venosa imediata; plano C significa veia."],
      ["A alimentação deve ser suspensa durante o episódio de diarreia?", "Não. A alimentação e o aleitamento devem ser mantidos durante todo o quadro."],
      ["Qual o papel do antibiótico e do antidiarreico na diarreia infantil?", "O antibiótico só é indicado em situações específicas, como disenteria, cólera ou quadro grave. Antidiarreico não deve ser usado de rotina, pois a reidratação oral é o pilar."],
    ],
    [
      ["Até quando o aleitamento deve ser exclusivo e até quando deve ser complementado?", "Exclusivo até os 6 meses, sem água nem chá, e complementado até 2 anos ou mais."],
      ["Qual componente imunológico se destaca no colostro?", "O colostro é rico em IgA."],
      ["A mastite contraindica a amamentação?", "Não. A mastite não contraindica amamentar; ao contrário, orienta-se esvaziar a mama."],
      ["Quais são as contraindicações ao aleitamento materno?", "HIV materno (no Brasil), HTLV, algumas drogas e galactosemia."],
      ["Como orientar a alimentação complementar a partir dos 6 meses?", "Ofertar alimentos variados e fontes de ferro, evitando açúcar e ultraprocessados. A pega correta segue importante para prevenir fissuras, com amamentação em livre demanda."],
    ],
    [
      ["Como diferenciar icterícia neonatal fisiológica de patológica pelo tempo de início?", "A fisiológica aparece após 24 horas de vida e é autolimitada. Icterícia com menos de 24 horas é sempre patológica."],
      ["O que sugere bilirrubina direta elevada no recém-nascido?", "Indica colestase e obriga investigação, inclusive de atresia de vias biliares, cujo tempo de diagnóstico é crítico."],
      ["Qual a complicação temida da hiperbilirrubinemia e qual o tratamento?", "O kernicterus é a complicação temida. O tratamento é a fototerapia."],
      ["Quais as principais causas de desconforto respiratório no recém-nascido?", "Doença da membrana hialina no prematuro, taquipneia transitória após cesárea, aspiração meconial e sepse."],
      ["Como se classifica a sepse neonatal e quais são as triagens obrigatórias do recém-nascido?", "A sepse precoce ocorre nas primeiras 72 horas, associada ao estreptococo do grupo B, e a tardia depois disso, com sinais inespecíficos. As triagens são pezinho, olhinho (reflexo vermelho), orelhinha e coraçãozinho."],
    ],
    [
      ["Quais são os sinais gerais de perigo do AIDPI?", "Não conseguir beber ou mamar, vomitar tudo, convulsões e letargia ou inconsciência. Qualquer um deles indica referência urgente."],
      ["Quais os componentes do triângulo de avaliação pediátrica?", "Aparência, respiração e circulação. Ele orienta a avaliação inicial, seguida do ABCDE."],
      ["Por que a hipotensão é um achado tardio na criança em choque?", "Porque a criança compensa por taquicardia por bastante tempo. Não se deve esperar a pressão cair para reconhecer a gravidade."],
      ["Quais os sinais precoces de choque na criança?", "Taquicardia, enchimento capilar lento e extremidades frias."],
      ["Qual a via mais comum de evolução para parada cardiorrespiratória na criança?", "A deterioração respiratória é a via mais comum para a parada em pediatria."],
    ],
    [
      ["Qual achado é patognomônico do sarampo e qual a conduta de vigilância?", "As manchas de Koplik são patognomônicas. O sarampo é de notificação imediata."],
      ["Como se apresenta clinicamente o sarampo?", "Febre alta, tosse, coriza e conjuntivite, com manchas de Koplik e exantema de progressão craniocaudal."],
      ["Que exantemáticas preocupam especialmente na gestação e por quê?", "Rubéola, pelo risco de síndrome da rubéola congênita, e parvovírus B19. A rubéola cursa com exantema e linfadenopatia retroauricular."],
      ["Como diferenciar escarlatina de eritema infeccioso pelos achados de pele?", "A escarlatina, causada por estreptococo, cursa com língua em framboesa e exantema em lixa. O eritema infeccioso, por parvovírus B19, dá a face esbofeteada."],
      ["O que caracteriza o exantema súbito e a varicela?", "No exantema súbito (roséola, HHV-6), a febre alta cessa e então surge o exantema. Na varicela há vesículas em várias fases ao mesmo tempo, o chamado céu estrelado."],
    ],
    [
      ["Quais doenças são pesquisadas no teste do pezinho?", "Fenilcetonúria, hipotireoidismo congênito, anemia falciforme e fibrose cística, entre outras."],
      ["Quais são as quatro triagens neonatais obrigatórias?", "Pezinho, olhinho, orelhinha e coraçãozinho."],
      ["Por que o rastreio precoce do hipotireoidismo congênito é considerado tempo crítico?", "Porque triar e tratar precocemente evita déficit cognitivo. O atraso no diagnóstico gera dano irreversível."],
      ["Qual orientação de sono reduz o risco de morte súbita do lactente?", "Colocar o bebê para dormir em posição supina."],
      ["Que medidas preventivas e suplementações compõem a puericultura?", "Segurança no transporte, prevenção de acidentes conforme a faixa etária e suplementação de ferro e vitamina D. Cólica do lactente e refluxo fisiológico exigem orientação e atenção aos sinais de alarme."],
    ],
    [
      ["Qual a faixa etária e o quadro típico da convulsão febril simples?", "Ocorre entre 6 meses e 5 anos, com febre e crise tônico-clônica breve, geralmente benigna."],
      ["Quando investigar uma convulsão associada a febre?", "Quando for atípica, prolongada ou focal, sobretudo para excluir meningite. Febre com rigidez ou toxemia também obriga afastar meningite."],
      ["A convulsão febril simples significa epilepsia?", "Não. A convulsão febril simples é benigna e não caracteriza epilepsia."],
      ["Como se apresenta e como se trata a laringite ou crupe?", "Tosse de cachorro e estridor. O tratamento é corticoide, com nebulização de adrenalina nos casos graves."],
      ["Quais os sinais de epiglotite e qual cuidado é obrigatório?", "Toxemia, sialorreia e posição em tripé, associada ao Haemophilus, configurando emergência de via aérea. Não se deve examinar a garganta pelo risco de obstrução."],
    ],
    [
      ["Como se caracteriza o sopro inocente na criança?", "É sistólico, suave, em criança assintomática e sem repercussão. É comum e benigno, não exigindo investigação exaustiva."],
      ["Quais são as cardiopatias acianóticas e qual a mais comum?", "São as de shunt esquerda-direita: CIV, CIA e PCA. A CIV é a mais comum."],
      ["Quais são as principais cardiopatias cianóticas?", "Tetralogia de Fallot, a mais comum das cianóticas, e transposição das grandes artérias."],
      ["Para que serve o teste do coraçãozinho?", "É a oximetria de pulso que tria cardiopatia congênita crítica no recém-nascido."],
      ["Quais sinais de alerta sugerem cardiopatia com repercussão no lactente?", "Cianose, cansaço às mamadas, sudorese, baixo ganho ponderal e sopro com repercussão. Cianose com cardiopatia é emergência neonatal."],
    ],
    [
      ["Quais condições são rastreadas na triagem neonatal do pezinho?", "Fenilcetonúria, hipotireoidismo congênito, anemia falciforme, fibrose cística, hiperplasia adrenal congênita e deficiência de biotinidase."],
      ["Quais são as variantes normais de baixa estatura?", "A baixa estatura familiar e o retardo constitucional do crescimento e da puberdade."],
      ["Quais causas patológicas devem ser consideradas na baixa estatura?", "Hipotireoidismo, deficiência de GH, doença crônica e síndrome de Turner. Turner deve ser lembrada em menina baixa com disgenesia."],
      ["Que parâmetros orientam a investigação de baixa estatura?", "Velocidade de crescimento e idade óssea. Velocidade de crescimento baixa preocupa mais que estatura baixa isolada."],
      ["Quais são os limites de idade que definem puberdade precoce?", "Antes dos 8 anos em meninas e antes dos 9 anos em meninos. A puberdade atrasada também exige investigação."],
    ],
    [
      ["Quais achados levantam suspeita de maus-tratos infantis?", "Lesões incompatíveis com a história ou com a idade, atraso em buscar atendimento, lesões em estágios diferentes de evolução e negligência."],
      ["Qual a conduta diante da suspeita de maus-tratos ou violência contra a criança?", "Notificar e acionar o Conselho Tutelar. A notificação de violência é compulsória."],
      ["Como se define o transtorno do espectro autista?", "Déficit de comunicação social somado a comportamentos repetitivos e restritos."],
      ["Quais os sinais precoces de TEA e qual instrumento de triagem é usado?", "Não apontar, não responder ao nome e pouco contato visual. A triagem é feita com o M-CHAT, e a intervenção precoce muda o prognóstico."],
      ["Quais os critérios centrais do TDAH?", "Desatenção e/ou hiperatividade-impulsividade presentes em pelo menos dois ambientes, com prejuízo funcional."],
    ],
  ],
  mental: [
    [
      ["Qual o critério temporal e nuclear para episódio depressivo?", "Pelo menos 2 semanas de humor deprimido ou anedonia. Somando os sintomas do SIGECAPS, 5 ou mais caracterizam o episódio."],
      ["O que significa o mnemônico SIGECAPS na avaliação da depressão?", "Sono, interesse, culpa, energia, concentração, apetite, alteração psicomotora e suicídio. São os sintomas somados ao humor deprimido ou anedonia."],
      ["Qual o tratamento da depressão leve a moderada na atenção primária?", "Manejo na própria APS com psicoeducação, psicoterapia e ISRS como primeira linha. Reavaliar em 4 a 6 semanas e manter por pelo menos 6 meses após a remissão."],
      ["Qual a abordagem de primeira linha nos transtornos de ansiedade como TAG, pânico e fobias?", "TCC associada a ISRS ou IRSN. Benzodiazepínico apenas por curto prazo, pelo risco de dependência."],
      ["Quais as pegadinhas clássicas no tratamento da depressão e da ansiedade?", "ISRS é primeira linha, não tricíclico, e o antidepressivo leva semanas para agir. Benzodiazepínico não é medicação de manutenção e o risco de suicídio deve sempre ser rastreado."],
    ],
    [
      ["Perguntar sobre suicídio induz o comportamento no paciente?", "Não. Perguntar não induz, e esse é o ponto mais cobrado. Perguntar diretamente é a conduta correta."],
      ["O que deve ser avaliado na estimativa do risco de suicídio?", "Ideação passiva ou ativa, plano, meios e acesso a eles, tentativas prévias, intenção e fatores de proteção."],
      ["Qual o fator isolado de maior valor preditivo para suicídio?", "Tentativa prévia é o maior preditor de risco."],
      ["Como manejar o paciente com risco de suicídio?", "Garantir segurança imediata, fazer restrição de meios e acionar a rede/RAPS. Encaminhamento urgente se alto risco, sem deixar o paciente sozinho."],
      ["A tentativa de suicídio é de notificação compulsória?", "Sim. A tentativa de suicídio é de notificação compulsória e essa obrigatoriedade é ponto frequente de prova."],
    ],
    [
      ["Qual a postura e a diretriz que orientam o cuidado ao usuário de álcool e outras drogas no SUS?", "Abordagem sem julgamento, com redução de danos como linha do SUS. Intervenções breves são eficazes."],
      ["Qual instrumento é usado para rastreio do uso de álcool?", "O AUDIT é o instrumento de rastreio para álcool."],
      ["Como evolui a síndrome de abstinência alcoólica?", "Começa com tremor, ansiedade e sudorese e pode evoluir para convulsão e delirium tremens, que é emergência."],
      ["Qual o tratamento medicamentoso da abstinência alcoólica e o cuidado obrigatório na reposição?", "Benzodiazepínico é o tratamento da abstinência. A tiamina deve ser administrada antes da glicose, para prevenir Wernicke."],
      ["Qual serviço da rede atende os casos moderados a graves de uso de álcool e outras drogas?", "O CAPS AD, dentro da RAPS, é o ponto para casos moderados a graves."],
    ],
    [
      ["Qual lei sustenta a RAPS e qual o modelo de cuidado que ela define?", "A Lei 10.216/2001. Define cuidado territorial, comunitário e em liberdade, de orientação antimanicomial."],
      ["Quais são os pontos que compõem a RAPS?", "Atenção primária, CAPS, Unidades de Acolhimento, Residências Terapêuticas, leitos em hospital geral e os serviços de urgência."],
      ["Quais são as modalidades de CAPS e o que diferencia cada uma?", "CAPS I e II variam pelo porte, CAPS III funciona 24 horas, CAPSi atende a infância e CAPS AD atende álcool e drogas."],
      ["Qual o lugar da internação psiquiátrica dentro da Reforma Psiquiátrica?", "É o último recurso e pelo menor tempo possível. A internação involuntária exige critérios legais e comunicação ao Ministério Público."],
      ["Por que é errado tratar o CAPS como hospital psiquiátrico?", "O CAPS é serviço comunitário e territorial, não hospital psiquiátrico. CAPS III e AD III funcionam 24 horas mantendo essa lógica."],
    ],
    [
      ["Como se dividem os sintomas do primeiro episódio psicótico?", "Sintomas positivos como delírios, alucinações e desorganização, e sintomas negativos como embotamento e isolamento."],
      ["O que deve ser afastado antes de rotular um primeiro episódio psicótico como esquizofrenia?", "Causas orgânicas e tóxicas: substâncias, infecções como encefalite, alterações metabólicas e delirium."],
      ["Como o delirium se diferencia de um quadro psicótico primário?", "O delirium cursa com consciência flutuante e tem causa clínica identificável. É o grande diferencial e configura emergência clínica."],
      ["Qual a conduta diante de um primeiro episódio psicótico?", "Acolher, garantir segurança e encaminhar ao serviço especializado."],
      ["Qual o impacto do tempo de início do cuidado no primeiro episódio psicótico?", "A intervenção precoce melhora o prognóstico."],
    ],
    [
      ["Quais casos de saúde mental devem ser conduzidos na própria atenção primária?", "Casos leves a moderados, com acolhimento, psicoeducação, uso de ISRS e seguimento."],
      ["Quais situações indicam encaminhamento ao serviço especializado em saúde mental?", "Risco de suicídio ou violência, sintomas graves ou psicóticos, mania, refratariedade, comorbidade complexa e diagnóstico incerto."],
      ["O que é matriciamento em saúde mental?", "É o especialista apoiando a equipe da atenção primária. Reduz encaminhamentos, pois é apoio e não transferência do caso."],
      ["Quais comorbidades complexas justificam encaminhamento a partir da APS?", "Uso grave de substâncias, transtorno bipolar e transtornos de personalidade graves."],
      ["Por que encaminhar todos os casos de saúde mental é considerado erro de conduta?", "Porque a atenção primária é resolutiva para casos leves e moderados. O encaminhamento deve ser guiado por risco, gravidade ou refratariedade."],
    ],
    [
      ["Quais os critérios de duração e humor que definem mania e hipomania?", "Mania: humor elevado ou irritável por pelo menos 1 semana. Hipomania: quadro mais leve, com pelo menos 4 dias."],
      ["O que o mnemônico DIGFAST descreve na mania?", "Distraibilidade, insônia com menor necessidade de sono, grandiosidade, fuga de ideias, aumento de atividade, fala acelerada e comportamento de risco."],
      ["O que diferencia o transtorno bipolar tipo I do tipo II?", "O tipo I cursa com mania e o tipo II com hipomania associada a episódios depressivos."],
      ["Qual a base do tratamento do transtorno bipolar?", "Estabilizadores do humor como lítio e valproato, além de antipsicóticos. Com lítio é preciso monitorar níveis pelo risco de intoxicação."],
      ["Por que não usar antidepressivo isolado em paciente com história de mania ou hipomania?", "Porque o antidepressivo isolado pode causar viragem para mania. Depressão com história de mania ou hipomania indica transtorno bipolar."],
    ],
    [
      ["Como se caracteriza e se maneja o transtorno de sintomas somáticos?", "Sintomas físicos com preocupação desproporcional. Manejo na APS com vínculo e consultas regulares, evitando exames excessivos como prevenção quaternária."],
      ["Quais os elementos diagnósticos da anorexia nervosa?", "Restrição alimentar, baixo peso com IMC reduzido, medo de engordar e distorção da imagem corporal."],
      ["Quais complicações clínicas tornam a anorexia nervosa um quadro grave?", "Bradicardia e distúrbios eletrolíticos. Sinais de gravidade exigem manejo clínico."],
      ["O que caracteriza a bulimia e como o peso costuma se apresentar?", "Episódios de compulsão seguidos de purgação, com peso frequentemente normal."],
      ["Por que a anorexia nervosa é destacada pela mortalidade?", "Tem alta mortalidade, tanto por complicações clínicas quanto por suicídio."],
    ],
    [
      ["Qual a definição de demência e o que a distingue do delirium quanto à consciência?", "Declínio cognitivo progressivo com prejuízo funcional e consciência preservada. No delirium a consciência flutua."],
      ["Como se apresentam Alzheimer e demência vascular?", "Alzheimer é a mais comum, insidiosa e acomete primeiro a memória recente. A vascular evolui em degraus, com fatores de risco cardiovascular."],
      ["O que caracteriza a demência por corpos de Lewy e a frontotemporal?", "Corpos de Lewy: flutuação, alucinações visuais e parkinsonismo. Frontotemporal: alterações de comportamento e de linguagem."],
      ["Como se avalia a suspeita de demência e quais causas reversíveis devem ser excluídas?", "Aplicar MEEM ou MoCA e avaliar funcionalidade. Excluir hipotireoidismo, deficiência de B12 e depressão, esta última chamada de pseudodemência."],
      ["Qual a diferença de curso entre delirium e demência?", "Delirium é agudo e flutuante, com causa clínica, configurando emergência. A demência é crônica e progressiva."],
    ],
    [
      ["O que define os transtornos de personalidade?", "Padrões persistentes e inflexíveis de funcionamento, como o borderline com instabilidade afetiva e impulsividade, e o antissocial."],
      ["Qual o risco que sempre deve ser avaliado no transtorno de personalidade borderline?", "Alto risco de autolesão e de suicídio, que precisa ser avaliado sistematicamente."],
      ["Como se maneja o paciente com transtorno de personalidade?", "Com vínculo e psicoterapia, em abordagem longitudinal, evitando iatrogenia como a polifarmácia."],
      ["O que o diagnóstico de TDAH no adulto exige?", "Desatenção persistente com prejuízo e presença de sintomas desde a infância."],
      ["Quais os sintomas que caracterizam o TEPT?", "Revivência, evitação e hipervigilância após um evento traumático. O transtorno de estresse agudo é o quadro relacionado mais precoce."],
    ],
  ],
  cirurgia: [
    [
      ["Quais são os cinco tipos de abdome agudo e um exemplo de causa de cada um?", "Inflamatório (apendicite, a mais comum, colecistite, diverticulite), obstrutivo (bridas, hérnia, tumor), perfurativo (úlcera), hemorrágico (gravidez ectópica) e vascular (isquemia mesentérica)."],
      ["Qual é a causa mais comum de abdome agudo inflamatório e como sua dor se comporta?", "A apendicite. A dor migra para a fossa ilíaca direita."],
      ["Que exame não pode faltar em toda mulher em idade fértil com dor abdominal?", "O beta-hCG. Mulher fértil com dor abdominal exige beta-hCG antes de seguir a investigação."],
      ["Qual quadro sugere isquemia mesentérica no abdome agudo?", "Dor desproporcional ao exame físico em idoso com fibrilação atrial."],
      ["O que significa ar subdiafragmático (pneumoperitônio) na imagem de um abdome agudo?", "Indica perfuração de víscera, típica do abdome agudo perfurativo por úlcera."],
    ],
    [
      ["Qual é a hérnia da parede abdominal mais comum e qual tem maior risco de encarceramento?", "A inguinal é a mais comum. A femoral, mais frequente em mulheres, tem maior risco de encarceramento."],
      ["Como se define uma hérnia redutível e qual a conduta?", "É a que retorna à cavidade. A conduta é cirúrgica eletiva."],
      ["Qual a diferença entre hérnia encarcerada e estrangulada?", "A encarcerada é irredutível sem isquemia e pode obstruir. A estrangulada é irredutível com isquemia e constitui emergência."],
      ["Quais são os sinais de alarme em uma hérnia da parede abdominal?", "Dor intensa, hérnia tensa, sinais de obstrução (vômito, distensão) e sinais sistêmicos."],
      ["Pode-se tentar reduzir manualmente uma hérnia com sinais de estrangulamento?", "Não. Não se deve reduzir à força quando há sinais de estrangulamento."],
    ],
    [
      ["Qual a conduta na colelitíase assintomática?", "Não se opera de rotina. A cirurgia fica reservada para exceções específicas."],
      ["Quais são as exceções que indicam colecistectomia em paciente assintomático?", "Vesícula em porcelana, cálculo grande e hemólise."],
      ["Que quadro biliar o sinal de Murphy caracteriza e qual o tratamento?", "Colecistite, com dor, febre e Murphy positivo. Tratamento com antibiótico e colecistectomia."],
      ["O que é a tríade de Charcot e a que diagnóstico ela aponta?", "Dor, febre e icterícia. Aponta colangite, que exige antibiótico e drenagem em caráter de emergência."],
      ["Como se apresenta a coledocolitíase e qual a conduta?", "Icterícia com dilatação de vias biliares. Conduta com CPRE seguida de cirurgia."],
    ],
    [
      ["Que elementos compõem a estratificação de risco no pré-operatório?", "Classificação ASA, risco cardíaco pelo Lee/RCRI e capacidade funcional em METs, além de otimizar comorbidades e revisar anticoagulantes e antiagregantes."],
      ["Quais são os tempos de jejum pré-operatório citados no material?", "Cerca de 6 a 8 horas para sólidos e cerca de 2 horas para líquidos claros."],
      ["Exames pré-operatórios devem ser pedidos de rotina para todos os pacientes?", "Não. Os exames são guiados pelo risco do paciente, e não solicitados como rotina universal."],
      ["Quais são os pilares do cuidado pós-operatório?", "Analgesia multimodal, profilaxia de tromboembolismo venoso (escore de Caprini), mobilização precoce e vigilância de complicações."],
      ["Que complicações devem ser vigiadas no pós-operatório e o que a mobilização precoce previne?", "Vigiar infecção de sítio cirúrgico, deiscência, íleo e complicações respiratórias. A mobilização precoce previne tromboembolismo venoso e pneumonia."],
    ],
    [
      ["Qual é a prioridade dentro do C do ABCDE no atendimento ao trauma?", "O controle da hemorragia, com reanimação simultânea à avaliação."],
      ["O que classifica o choque hemorrágico nas classes I a IV?", "A perda volêmica do paciente."],
      ["Quais são as fontes ocultas de sangramento a procurar no trauma?", "Tórax, abdome, pelve, ossos longos e retroperitônio."],
      ["Como deve ser feita a reposição volêmica no trauma grave?", "Cristaloide associado a hemoderivados precoces, evitando excesso de cristaloide. Nos casos graves, aplica-se damage control."],
      ["O que significa hipotensão em um paciente vítima de trauma?", "Significa hemorragia até prova em contrário. Reanimar com hemoderivados e transferir cedo o paciente grave sem recurso definitivo."],
    ],
    [
      ["Como se classificam as feridas cirúrgicas e para que serve essa classificação?", "Em limpa, limpa-contaminada, contaminada e infectada. A classificação define a profilaxia antibiótica."],
      ["Quais são os níveis de infecção de sítio cirúrgico e quando ela costuma surgir?", "Superficial, profunda e de órgão/cavidade. Surge por volta do 5º ao 7º dia."],
      ["Quais são as manifestações de uma infecção de sítio cirúrgico?", "Sinais flogísticos, secreção purulenta e febre."],
      ["Qual o momento correto da antibioticoprofilaxia cirúrgica e por quanto tempo mantê-la?", "Na indução, de 30 a 60 minutos antes da incisão, com redose conforme a duração e manutenção por até 24 horas. Nunca depois da incisão."],
      ["Que medidas perioperatórias reduzem a infecção de sítio cirúrgico?", "Assepsia, tricotomia com tricótomo, controle glicêmico e normotermia. Ferida limpa geralmente dispensa antibiótico, salvo uso de prótese."],
    ],
    [
      ["Como evolui a dor da apendicite e como se faz o diagnóstico?", "A dor começa periumbilical e migra para a fossa ilíaca direita (ponto de McBurney), com anorexia, febre baixa e Blumberg. O diagnóstico é clínico, com apoio eventual de ultrassom ou tomografia."],
      ["Qual o tratamento da apendicite?", "A apendicectomia."],
      ["Como se apresenta a diverticulite e qual exame confirma e classifica o quadro?", "Dor em fossa ilíaca esquerda, febre e alteração do hábito intestinal no idoso. A tomografia confirma e classifica por Hinchey."],
      ["Como se trata a diverticulite não complicada e a complicada?", "A não complicada com antibiótico e eventual ajuste de dieta. A complicada, com abscesso ou perfuração, exige drenagem ou cirurgia."],
      ["Quando se deve realizar colonoscopia no paciente com diverticulite?", "Apenas após a resolução do quadro agudo, pelo risco de perfuração."],
    ],
    [
      ["Qual a causa mais comum de obstrução de intestino delgado?", "Bridas e aderências pós-operatórias. Também podem causar hérnias e tumores."],
      ["Como se apresenta clinicamente a obstrução intestinal e o que mostra o raio-X?", "Dor em cólica, distensão, vômitos e parada de eliminação de gases e fezes. O raio-X mostra níveis hidroaéreos."],
      ["Quais as principais causas de obstrução de cólon?", "Neoplasia, principal no idoso, e volvo."],
      ["Em que consiste o manejo inicial conservador da obstrução intestinal?", "No drip and suck: sonda nasogástrica, hidratação e jejum."],
      ["Quando a obstrução intestinal passa a ter indicação cirúrgica?", "Diante de estrangulamento, isquemia ou falha do tratamento conservador. Dor intensa, febre e acidose indicam cirurgia urgente."],
    ],
    [
      ["Quais são os 6 P da isquemia arterial aguda?", "Dor súbita, palidez, ausência de pulso, parestesia, paralisia e frialdade. É emergência com tempo crítico para revascularização e salvamento do membro."],
      ["Como se manifesta a doença arterial periférica crônica?", "Com claudicação intermitente e índice tornozelo-braquial reduzido, em paciente com fatores de risco cardiovascular."],
      ["Qual a conduta central na doença arterial periférica crônica?", "Tratar os fatores de risco cardiovascular do paciente."],
      ["Como costuma se comportar o aneurisma de aorta abdominal não roto?", "É frequentemente assintomático."],
      ["Qual a tríade do aneurisma de aorta abdominal roto?", "Dor abdominal ou lombar, hipotensão e massa pulsátil. Configura emergência."],
    ],
    [
      ["Quais achados sugerem torção testicular e qual a janela para salvar o testículo?", "Dor súbita intensa, testículo elevado e reflexo cremastérico ausente. A janela é de cerca de 6 horas."],
      ["Diante de clínica clássica de torção testicular, deve-se aguardar o ultrassom?", "Não. Não se deve atrasar a conduta por exames; a indicação é explorar cirurgicamente."],
      ["Como diferenciar epididimite de torção testicular no escroto agudo?", "A epididimite tem dor mais gradual, febre e melhora ao elevar o testículo (sinal de Prehn positivo). O reflexo cremastérico também ajuda na diferenciação."],
      ["Que sinal caracteriza a torção de apêndice testicular?", "O ponto azul."],
      ["Como se apresenta a litíase urinária e qual o exame padrão e o manejo?", "Cólica renal com dor lombar em cólica que irradia para a virilha e hematúria. O padrão é a tomografia sem contraste; o manejo inclui analgesia e hidratação, com eliminação espontânea na maioria dos casos."],
    ],
  ],
};

export interface RevisaoCard {
  q: string;
  a: string;
  ti: number; // índice do tema de origem
  ci: number; // índice do card dentro do tema
}

// Deck da área = os cards de todos os seus temas. Cada card carrega a origem
// (tema + posição) para que a chave de progresso do "já domino" seja estável
// mesmo que o conteúdo mude de tamanho ou ordem.
export const REVISAO_DECK: Record<string, RevisaoCard[]> = Object.fromEntries(
  REVISAO_AREA_ORDER.map((id) => [
    id,
    (REVISAO_CARDS_POR_TEMA[id] || []).flatMap((cards, ti) =>
      cards.map(([q, a], ci) => ({ q, a, ti, ci })),
    ),
  ]),
);

export const REVISAO_TOTAL_CARDS = Object.values(REVISAO_DECK).reduce(
  (n, d) => n + d.length,
  0,
);
