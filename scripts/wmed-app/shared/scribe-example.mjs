// 2Doctor Scribe: consulta de exemplo (fictícia, de autoria própria) e a progressão roteirizada da nota
// e do apoio ao raciocínio, para o exemplo funcionar sem microfone, sem conta e sem servidor.
// Textos em português (idioma-fonte); inglês e espanhol vêm de shared/i18n/parts/scribe.mjs.

export const EXAMPLE_LABEL = 'Consulta de exemplo';
export const EXAMPLE_INTERVAL = 1700;

// [voz, fala]: 1 = profissional, 2 = paciente.
export const EXAMPLE_TURNS = [
 [1, 'Bom dia, seu Antônio, pode sentar. O que traz o senhor aqui hoje?'],
 [2, 'Bom dia, doutora. Estou com uma dor no peito faz umas três semanas, e está começando a me preocupar.'],
 [1, 'Me conta como é essa dor.'],
 [2, 'É um aperto bem no meio do peito. Vem quando eu subo ladeira ou carrego peso, e melhora depois de uns cinco minutos parado.'],
 [1, 'A dor vai para algum lugar? Tem falta de ar, suor frio ou enjoo junto?'],
 [2, 'Às vezes desce para o braço esquerdo. Dá um pouco de falta de ar, mas suor e enjoo não.'],
 [1, 'Já teve essa dor parado, em repouso?'],
 [2, 'Ontem à noite tive, vendo televisão. Durou uns quinze minutos.'],
 [1, 'Quantos anos o senhor tem? Tem pressão alta ou diabetes? Que remédios toma?'],
 [2, 'Cinquenta e oito. Pressão alta faz dez anos e diabetes faz seis. Tomo losartana, cinquenta miligramas uma vez por dia, e metformina, oitocentos e cinquenta, duas vezes por dia.'],
 [1, 'Tem alergia a algum remédio? O senhor fuma?'],
 [2, 'Tenho alergia a penicilina, me dá manchas na pele. E fumo um maço por dia desde os vinte anos.'],
 [1, 'Alguém na família teve problema de coração?'],
 [2, 'Meu pai morreu de infarto com cinquenta e cinco.'],
 [1, 'Vou examinar o senhor. Pressão cento e sessenta por cem, frequência oitenta e oito, coração com ritmo regular e sem sopros, pulmões limpos.'],
 [1, 'Seu Antônio, essa dor pode estar vindo do coração, e o episódio em repouso me preocupa. Vou pedir um eletrocardiograma agora e uma troponina, e o senhor fica aqui em observação.'],
];

// Cada trecho entra na nota quando a conversa chega ao turno indicado: [a partir do turno, texto].
export const EXAMPLE_SECTIONS = [
 ['Queixa principal', [[2, 'Dor no peito há cerca de três semanas.']]],
 ['História da doença atual', [
  [4, 'Aperto no centro do peito desencadeado por esforço (subir ladeira, carregar peso), com melhora em cerca de 5 minutos de repouso.'],
  [6, 'Irradia às vezes para o braço esquerdo. Dispneia leve associada. Nega sudorese e náusea.'],
  [8, 'Um episódio em repouso ontem à noite, com duração de cerca de 15 minutos.'],
 ]],
 ['Antecedentes', [[10, '58 anos. Hipertensão há 10 anos. Diabetes há 6 anos.']]],
 ['Medicações e alergias', [
  [10, 'Losartana 50 mg uma vez ao dia. Metformina 850 mg duas vezes ao dia.'],
  [12, 'Alergia a penicilina (lesões na pele).'],
 ]],
 ['História familiar e hábitos', [
  [12, 'Fuma um maço por dia desde os 20 anos.'],
  [14, 'Pai falecido por infarto aos 55 anos.'],
 ]],
 ['Exame físico', [[15, 'PA 160/100 mmHg, FC 88 bpm. Ritmo cardíaco regular, sem sopros. Pulmões limpos.']]],
 ['Avaliação', [[16, 'Dor torácica de possível origem cardíaca; o episódio em repouso preocupa.']]],
 ['Plano', [[16, 'Eletrocardiograma agora e troponina. Paciente permanece em observação.']]],
];

const SCA = 'Síndrome coronariana aguda (angina instável)', ANGINA = 'Angina estável', DRGE = 'Refluxo gastroesofágico', MUSCULO = 'Dor musculoesquelética', DISSECCAO = 'Dissecção de aorta';
// Hipóteses por etapa: vale a última etapa já alcançada. [a partir do turno, hipóteses]
export const EXAMPLE_HYPOTHESES = [
 [4, [
  [ANGINA, 'medium', 'Aperto central desencadeado por esforço e aliviado em minutos com repouso.', 'Irradiação, dor em repouso e fatores de risco ainda não explorados.'],
  [MUSCULO, 'low', 'Dor que aparece ao carregar peso.', 'Alívio rápido com repouso; sem relato de dor à palpação ou ao movimento.'],
  [DRGE, 'low', 'Desconforto no centro do peito.', 'Sem relação relatada com alimentação ou posição.'],
 ]],
 [8, [
  [SCA, 'high', 'Aperto aos esforços com irradiação para o braço esquerdo e episódio novo em repouso, de 15 minutos.', 'Faltam eletrocardiograma, troponina e fatores de risco.'],
  [ANGINA, 'medium', 'Padrão aos esforços há três semanas.', 'O episódio em repouso de ontem sugere progressão.'],
  [DRGE, 'low', 'Episódio noturno em repouso.', 'Relação clara com esforço; sem queimação ou relação com alimentação relatadas.'],
 ]],
 [14, [
  [SCA, 'high', 'Dor aos esforços com irradiação, episódio em repouso de 15 minutos, hipertensão, diabetes, tabagismo e pai com infarto aos 55 anos.', 'Faltam eletrocardiograma e troponina.'],
  [ANGINA, 'medium', 'Padrão aos esforços há três semanas, com vários fatores de risco.', 'O episódio em repouso de ontem sugere progressão.'],
  [DISSECCAO, 'low', 'Hipertensão e dor torácica.', 'Sem dor lancinante ou irradiação para o dorso relatadas; pressão nos dois braços não mencionada.'],
 ]],
];
// Perguntas sugeridas: [a partir do turno, até o turno em que foi respondida (0 = fica), texto]
export const EXAMPLE_QUESTIONS = [
 [2, 4, 'Como é a dor, onde fica e o que a desencadeia?'],
 [4, 6, 'A dor irradia? Há falta de ar, sudorese ou náusea?'],
 [4, 8, 'Já teve dor em repouso ou à noite?'],
 [4, 10, 'Fatores de risco: hipertensão, diabetes, colesterol.'],
 [6, 12, 'Tabagismo.'],
 [6, 14, 'História familiar de doença cardíaca precoce.'],
 [8, 0, 'Está com dor agora?'],
 [10, 0, 'Usa aspirina ou nitrato? Já fez alguma investigação cardíaca?'],
 [15, 0, 'Pressão arterial nos dois braços.'],
];
export const EXAMPLE_ALERTS = [
 [8, 'Dor torácica em repouso por 15 minutos, depois de três semanas de dor aos esforços.'],
];

const same = (text) => text;
export const exampleTurns = (t = same) => EXAMPLE_TURNS.map(([voice, text]) => ({ voice: `demo-${voice}`, text: t(text) }));

// Fala chegando aos poucos, como na transcrição ao vivo: trechos cumulativos de `size` palavras.
export function exampleChunks(text, size = 3) {
 const words = String(text).split(' '), chunks = [];
 for (let i = size; i < words.length; i += size) chunks.push(words.slice(0, i).join(' '));
 chunks.push(String(text));
 return chunks;
}

// Estado da nota e do apoio depois de `count` falas da consulta de exemplo.
export function exampleProgress(count, t = same) {
 const n = Math.max(0, Math.min(EXAMPLE_TURNS.length, Math.floor(count || 0)));
 const note = EXAMPLE_SECTIONS.map(([title, parts]) => ({ title: t(title), text: parts.filter(([from]) => from <= n).map(([, text]) => t(text)).join(' ') }));
 const stage = EXAMPLE_HYPOTHESES.filter(([from]) => from <= n).at(-1);
 return {
  note,
  support: {
   hypotheses: (stage ? stage[1] : []).map(([name, likelihood, supporting, against]) => ({ name: t(name), likelihood, supporting: t(supporting), against: t(against) })),
   questions: EXAMPLE_QUESTIONS.filter(([from, until]) => from <= n && (!until || n < until)).map(([, , text]) => t(text)),
   alerts: EXAMPLE_ALERTS.filter(([from]) => from <= n).map(([, text]) => t(text)),
  },
 };
}

// Todos os textos do exemplo (para conferir a tradução nos testes).
export const exampleStrings = () => [
 EXAMPLE_LABEL,
 ...EXAMPLE_TURNS.map(([, text]) => text),
 ...EXAMPLE_SECTIONS.flatMap(([title, parts]) => [title, ...parts.map(([, text]) => text)]),
 ...EXAMPLE_HYPOTHESES.flatMap(([, list]) => list.flatMap(([name, , supporting, against]) => [name, supporting, against])),
 ...EXAMPLE_QUESTIONS.map(([, , text]) => text),
 ...EXAMPLE_ALERTS.map(([, text]) => text),
];
