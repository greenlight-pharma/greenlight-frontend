// Original fictional fixtures. Deterministic demonstration, not a clinical model.
const tr=(pt,en,es)=>({'pt-BR':pt,en,es});
export const sectionKeys=['subjective','objective','assessment','plan'];
export const sectionNames={
 'pt-BR':['Subjetivo','Objetivo','Avaliação','Plano'],
 en:['Subjective','Objective','Assessment','Plan'],
 es:['Subjetivo','Objetivo','Evaluación','Plan'],
};
export const sbarKeys=['situation','background','assessment','recommendation'];
export const sbarNames={
 'pt-BR':['Situação','Contexto','Avaliação','Recomendação ou pedido'],
 en:['Situation','Background','Assessment','Recommendation or request'],
 es:['Situación','Antecedentes','Evaluación','Recomendación o solicitud'],
};
export const demoCases=[
 {id:'history',title:tr('História e achados','History and findings','Historia y hallazgos'),segments:[
  {id:'r1',section:'subjective',sbar:'situation',text:tr('Relata tosse há três dias. Nega febre e falta de ar.','Reports a cough for three days. Denies fever and shortness of breath.','Refiere tos desde hace tres días. Niega fiebre y dificultad para respirar.')},
  {id:'r2',section:'objective',sbar:'assessment',text:tr('Temperatura medida na consulta: 36,8 °C. Frequência respiratória: 16 irpm.','Temperature measured at the visit: 36.8 °C. Respiratory rate: 16 breaths/min.','Temperatura medida en la consulta: 36,8 °C. Frecuencia respiratoria: 16 respiraciones/min.')},
  {id:'r3',section:'assessment',sbar:'assessment',text:tr('Ainda não defini a causa da tosse.','I have not yet determined the cause of the cough.','Aún no he determinado la causa de la tos.')},
 ]},
 {id:'correction',title:tr('Correção no relato','Correction in the account','Corrección en el relato'),segments:[
  {id:'r1',section:'subjective',sbar:'background',text:tr('Relata uso de metformina 500 mg. Corrige em seguida: a dose é 850 mg. Não informou a frequência de uso.','Reports taking metformin 500 mg. Then corrects the dose to 850 mg. Frequency of use was not reported.','Refiere uso de metformina 500 mg. Luego corrige: la dosis es 850 mg. No informó la frecuencia de uso.')},
  {id:'r2',section:'subjective',sbar:'background',text:tr('Não lembra se já teve reação a medicamentos.','Does not remember whether they have had a reaction to medication.','No recuerda si ha tenido alguna reacción a medicamentos.')},
  {id:'r3',section:'plan',sbar:'recommendation',text:tr('Solicitei que traga a receita para conferirmos o esquema em uso.','I asked them to bring the prescription so we can check the current regimen.','Le pedí que traiga la receta para revisar el esquema actual.')},
 ]},
];
// Each passage has an explicit SBAR assignment; no generated clinical interpretation.
demoCases.push({id:'handoff',title:tr('Passagem de caso','Clinical handoff','Entrega de caso'),segments:[
 {id:'r1',section:'subjective',sbar:'situation',text:tr('Peço avaliação da equipe por tosse persistente há duas semanas.','I request a team assessment for a cough persisting for two weeks.','Solicito valoración del equipo por tos persistente desde hace dos semanas.')},
 {id:'r2',section:'subjective',sbar:'background',text:tr('Relata asma na infância. Não sabe informar o nome do inalador que usa. Nega febre.','Reports childhood asthma. Does not know the name of the inhaler currently used. Denies fever.','Refiere asma en la infancia. No sabe el nombre del inhalador que usa. Niega fiebre.')},
 {id:'r3',section:'objective',sbar:'assessment',text:tr('Na avaliação registrada: temperatura de 36,7 °C e frequência respiratória de 18 irpm.','Recorded findings: temperature 36.7 °C and respiratory rate 18 breaths/min.','En la valoración registrada: temperatura de 36,7 °C y frecuencia respiratoria de 18 respiraciones/min.')},
 {id:'r4',section:'assessment',sbar:'assessment',text:tr('Ainda não defini a causa da tosse. Não há resultado de exame de imagem neste relato.','I have not yet determined the cause of the cough. No imaging result is available in this account.','Aún no he determinado la causa de la tos. No hay resultado de imagen en este relato.')},
 {id:'r5',section:'plan',sbar:'recommendation',text:tr('Solicito que a equipe avalie o caso e confira o inalador com a pessoa antes de definir o plano. Não defini nova medicação.','I request that the team assess the case and check the inhaler with the person before deciding on a plan. I have not prescribed a new medication.','Solicito que el equipo valore el caso y revise el inhalador con la persona antes de definir el plan. No he indicado nueva medicación.')},
]});
export const missingText=tr('Não informado no relato.','Not reported in the account.','No informado en el relato.');
export const exportNotice=tr('EXEMPLO FICTÍCIO — DEMONSTRAÇÃO SCRIBE. NÃO É UM REGISTRO DE ATENDIMENTO.','FICTIONAL EXAMPLE — SCRIBE DEMO. NOT AN ENCOUNTER RECORD.','EJEMPLO FICTICIO — DEMOSTRACIÓN SCRIBE. NO ES UN REGISTRO DE ATENCIÓN.');
export const supportedLocale=locale=>Object.hasOwn(sectionNames,locale)?locale:'pt-BR';
export function createDemo(id='history',locale='pt-BR',format='SOAP'){
 const fixture=demoCases.find(item=>item.id===id);if(!fixture)throw Error('Unknown demonstration');
 if(!['SOAP','SBAR'].includes(format))throw Error('Unknown format');
 const language=supportedLocale(locale);
 const keys=format==='SBAR'?sbarKeys:sectionKeys,names=format==='SBAR'?sbarNames:sectionNames;
 const source=fixture.segments.map(s=>({...s,text:s.text[language]}));
 const sections=keys.map((key,index)=>{const refs=source.filter(s=>(format==='SBAR'?s.sbar:s.section)===key);return {key,label:names[language][index],sourceIds:refs.map(s=>s.id),text:refs.map(s=>s.text).join('\n\n')};});
 return {id,format,locale:language,title:fixture.title[language],source,sections,original:Object.fromEntries(sections.map(s=>[s.key,s.text])),organized:false,reviewed:false};
}
export function demoReducer(state,action){
 if(action.type==='load')return createDemo(action.id,action.locale,action.format??state.format);
 if(action.type==='organize')return {...state,organized:true,reviewed:false};
 if(action.type==='edit'){
  if(!state.organized||!state.sections.some(s=>s.key===action.key)||typeof action.text!=='string')return state;
  return {...state,reviewed:false,sections:state.sections.map(s=>s.key===action.key?{...s,text:action.text.slice(0,6000)}:s)};
 }
 if(action.type==='review')return {...state,reviewed:state.organized&&action.value===true};
 return state;
}
export function isEdited(state){return state.sections.some(s=>s.text!==state.original[s.key]);}
export function exportDemo(state){
 if(!state.organized||!state.reviewed)return null;
 return [exportNotice[state.locale],`${state.title} · ${state.format}`,...state.sections.map(s=>`${s.label}\n${s.text.trim()||missingText[state.locale]}`)].join('\n\n');
}
