// Editorial research entries. No model runtime, remote assets or clinical input.
export const researchCheckedAt = '2026-09-25';
export const researchEntries = [
 {id:'flexray',published:'2026-09-24',status:'research-only',
  title:['Anatomia no raio X','Anatomy on X-ray','Anatomía en radiografías'],name:'FleXray',
  summary:['Reconhece contornos de 60 estruturas anatômicas em radiografias.','Segments 60 anatomical structures in radiographs.','Segmenta 60 estructuras anatómicas en radiografías.'],
  opportunity:['Potencial: ligar uma estrutura no raio X à explicação no atlas 3D.','Potential: connect an X-ray structure to an explanation in the 3D atlas.','Potencial: conectar una estructura radiográfica con su explicación en el atlas 3D.'],
  limit:['Pesquisa anatômica, não diagnóstico. Não gera uma TC a partir de uma radiografia.','Anatomical research, not diagnosis. It does not generate a CT from an X-ray.','Investigación anatómica, no diagnóstico. No genera una TC a partir de una radiografía.'],
  license:['Código MIT; pesos CC BY-NC 4.0. Integração comercial depende de autorização.','MIT code; CC BY-NC 4.0 weights. Commercial integration requires permission.','Código MIT; pesos CC BY-NC 4.0. La integración comercial requiere autorización.'],
  source:'https://flexray.csail.mit.edu/',post:'https://x.com/ion_barrel/status/2103142799986032650',paper:'https://arxiv.org/abs/2609.26756',terms:'https://huggingface.co/VictorButoi/flexray',
 },
 {id:'medasr',published:'2026-01-13',status:'research-only',
  title:['Ditado médico revisável','Reviewable medical dictation','Dictado médico revisable'],name:'MedASR · Google',
  summary:['Transcrição de voz treinada com vocabulário médico em inglês.','Speech transcription trained on English medical vocabulary.','Transcripción de voz entrenada con vocabulario médico en inglés.'],
  opportunity:['Possibilidade em avaliação: transcrever ditados médicos para revisão.','Under evaluation: transcribe medical dictation for review.','Posibilidad en evaluación: transcribir dictados médicos para revisión.'],
  limit:['Treino apenas em inglês. Português, espanhol, sotaques e nomes de medicamentos exigem avaliação própria. Ainda não integrado.','English-only training. Portuguese, Spanish, accents and medication names require our own evaluation. Not integrated.','Entrenado solo en inglés. Portugués, español, acentos y nombres de medicamentos requieren evaluación propia. No integrado.'],
  license:['Termos HAI-DEF. Uso comercial sujeito às condições do fornecedor e validação da aplicação.','HAI-DEF terms. Commercial use is subject to provider terms and application validation.','Términos HAI-DEF. Uso comercial sujeto a las condiciones del proveedor y validación de la aplicación.'],
  source:'https://developers.google.com/health-ai-developer-foundations/medasr/model-card',
  post:'https://x.com/googleaidevs/status/2011181120793297361',
  announcement:'https://research.google/blog/next-generation-medical-image-interpretation-with-medgemma-15-and-medical-speech-to-text-with-medasr/',
  terms:'https://developers.google.com/health-ai-developer-foundations/terms',
 },
 {id:'evee',published:'2026-04-14',status:'research-only',
  title:['Entender variantes genéticas','Understanding genetic variants','Entender variantes genéticas'],name:'EVEE · Goodfire + Mayo Clinic',
  summary:['Explora hipóteses sobre como variantes no DNA podem alterar funções biológicas.','Explores hypotheses about how DNA variants may alter biological functions.','Explora hipótesis sobre cómo las variantes del ADN pueden alterar funciones biológicas.'],
  opportunity:['Para Genética: conectar DNA, proteína e mecanismo, com evidência e incerteza visíveis.','For Genetics: connect DNA, protein and mechanism, with visible evidence and uncertainty.','Para Genética: conectar ADN, proteína y mecanismo, mostrando evidencia e incertidumbre.'],
  limit:['Preprint anunciado em abril. Predições computacionais não são diagnósticos nem reclassificam uma variante por si só. Ainda não integrado.','Preprint announced in April. Computational predictions are not diagnoses and cannot reclassify a variant on their own. Not integrated.','Preprint anunciado en abril. Las predicciones computacionales no son diagnósticos ni reclasifican una variante por sí solas. No integrado.'],
  license:['Acesso público não confirma licença de integração comercial. Termos de reutilização ainda precisam ser esclarecidos.','Public access does not establish a commercial integration license. Reuse terms still need clarification.','El acceso público no confirma una licencia de integración comercial. Los términos de reutilización aún deben aclararse.'],
  source:'https://www.goodfire.com/research/evee-explaining-genetic-variants',post:'https://x.com/GoodfireAI/status/2044086228983976202',route:'#genetica',
 },
];
export function researchText(value,locale){return value[locale==='en'?1:locale==='es'?2:0];}
export const projectionRegions = ['torax','pelvis'];
export const projectionAngles = ['000','045','090'];
export function projectionPath(region,angle){
 if(!projectionRegions.includes(region)||!projectionAngles.includes(angle))throw new RangeError('Unknown educational projection');
 return `xray/${region}/rx-${angle}.webp`;
}
