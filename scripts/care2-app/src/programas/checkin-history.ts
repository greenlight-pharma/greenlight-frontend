export type CheckinItem={conditions:string[];question:string;options?:{id:string;title:string}[]};
export type CheckinDetails={version:number;urgent:boolean;measurements:Record<string,string|number>;review?:string[]};
const labels:Record<string,string>={sim:'Sim',nao:'Não',nao_se_aplica:'Não se aplica',nao_sei:'Não sei',nao_avaliado:'Não perguntado: orientação de urgência'};
export function answerLabel(item:CheckinItem,answer:string|string[]|undefined){
 return (Array.isArray(answer)?answer:[answer]).map(value=>item.options?.find(o=>o.id===value)?.title??labels[value??'']??'Não informado').join('; ');
}
export function measurementLines(d:CheckinDetails){
 const m=d.measurements,lines:string[]=[];
 const time=(key:string)=>m[key+'_time']?` às ${m[key+'_time']} (Brasília)`:' · horário não informado';
 if(m.glucose!=null)lines.push(`Glicemia: ${m.glucose} mg/dL${time('glucose')} · ${{jejum:'em jejum',antes:'antes de comer',depois:'depois de comer',nao_sei:'momento da alimentação não informado'}[String(m.glucose_context)]??'momento da alimentação não informado'}`);
 if(m.systolic!=null||m.diastolic!=null)lines.push(`Pressão: ${m.systolic??'—'} / ${m.diastolic??'—'} mmHg${time('pressure')}`);
 if(m.weight!=null)lines.push(`Peso: ${m.weight} kg${time('weight')}`);
 return lines;
}
