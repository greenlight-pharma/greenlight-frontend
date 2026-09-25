// Numeric comparison only. No clinical thresholds, conversions, diagnosis or persistence.
export const labGuideVersion='2026-09-25.1';
export const labGuideReviewed='2026-09-25';
export const labText=(v,l='pt-BR')=>v[l==='en'?1:l==='es'?2:0];
export const labGuides=[
 {id:'hemoglobin',name:['Hemoglobina','Hemoglobin','Hemoglobina'],units:['g/dL','g/L'],source:'https://medlineplus.gov/lab-tests/hemoglobin-test/',concept:['Proteína das hemácias que transporta oxigênio. Faz parte da avaliação do hemograma.','The oxygen-carrying protein in red blood cells, assessed in the complete blood count.','Proteína de los glóbulos rojos que transporta oxígeno; se evalúa en el hemograma.'],context:['Considere idade, sintomas e os outros resultados do hemograma.','Consider age, symptoms and the other blood count results.','Considera edad, síntomas y los demás resultados del hemograma.'],limit:['Um valor isolado não explica a causa da alteração. Hemoglobina não é HbA1c.','A single value does not explain the cause. Hemoglobin is not HbA1c.','Un valor aislado no explica la causa. Hemoglobina no es HbA1c.'],example:{value:'14',lower:'12',upper:'16',unit:'g/dL'}},
 {id:'creatinine',name:['Creatinina no sangue','Blood creatinine','Creatinina en sangre'],units:['mg/dL','µmol/L'],source:'https://medlineplus.gov/lab-tests/creatinine-test/',concept:['Resíduo do metabolismo muscular, eliminado pelos rins.','A waste product of muscle metabolism, removed by the kidneys.','Producto de desecho del metabolismo muscular, eliminado por los riñones.'],context:['Massa muscular, alimentação e medicamentos podem influenciar o resultado.','Muscle mass, diet and medicines can affect the result.','Masa muscular, alimentación y medicamentos pueden influir en el resultado.'],limit:['Dentro do intervalo não exclui doença renal. A creatinina isolada não equivale à TFG estimada.','Being within range does not exclude kidney disease. Creatinine alone is not an estimated GFR.','Estar dentro del intervalo no excluye enfermedad renal. La creatinina aislada no equivale a la TFG estimada.'],example:{value:'1',lower:'0.6',upper:'1.2',unit:'mg/dL'}},
 {id:'potassium',name:['Potássio no sangue','Blood potassium','Potasio en sangre'],units:['mmol/L','mEq/L'],source:'https://medlineplus.gov/lab-tests/potassium-blood-test/',concept:['Eletrólito importante para a atividade de nervos, músculos e coração.','An electrolyte important for nerve, muscle and heart function.','Electrolito importante para la actividad de nervios, músculos y corazón.'],context:['Considere função renal, medicamentos e condições de coleta.','Consider kidney function, medicines and sample collection conditions.','Considera función renal, medicamentos y condiciones de la extracción.'],limit:['Abrir e fechar a mão repetidamente na coleta pode elevar o resultado. Esta comparação não classifica urgência.','Repeated fist clenching during collection may raise the result. This comparison does not assess urgency.','Abrir y cerrar el puño repetidamente durante la extracción puede elevar el resultado. Esta comparación no evalúa urgencia.'],example:{value:'4',lower:'3.5',upper:'5.1',unit:'mmol/L'}},
];
function decimal(value){
 if(typeof value!=='string'||!/^\d{1,6}(?:[.,]\d{1,3})?$/.test(value.trim()))return null;
 const [a,b='']=value.trim().replace(',','.').split('.');return Number(a)*1000+Number(b.padEnd(3,'0'));
}
export function compareLabReference(id,raw={}){
 const guide=labGuides.find(g=>g.id===id);if(!guide)return {error:'test'};
 if(!guide.units.includes(raw.unit))return {error:'unit'};
 const values=['value','lower','upper'].map(k=>decimal(raw[k]));
 if(values.some(v=>v===null))return {error:'number'};
 const [value,lower,upper]=values;if(lower>=upper)return {error:'range'};
 return {position:value<lower?'below':value>upper?'above':'within',value:value/1000,lower:lower/1000,upper:upper/1000,unit:raw.unit};
}
export const blankLabForm=unit=>({value:'',lower:'',upper:'',unit});
// Switching units clears rather than reinterprets or silently converts previous numbers.
export function changeLabUnit(id,unit){return labGuides.find(g=>g.id===id)?.units.includes(unit)?blankLabForm(unit):null;}
