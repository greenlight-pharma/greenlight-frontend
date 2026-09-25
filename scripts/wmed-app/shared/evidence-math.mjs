// Educational comparison of an undesirable event at the same follow-up time.
// Reference: Oxford CEBM, Number Needed to Treat and Making a Decision.
export function riskComparison(control,intervention){
 const parse=value=>{if(!['string','number'].includes(typeof value))return NaN;if(typeof value==='string'&&!/^\d+(?:[.,]\d+)?$/.test(value.trim()))return NaN;return Number(typeof value==='string'?value.trim().replace(',','.'):value);};
 const c=parse(control),i=parse(intervention);
 if(control==null||intervention==null||!Number.isFinite(c)||!Number.isFinite(i)||c<0||i<0||c>100||i>100)return null;
 const absolute=c-i,relative=c===0?null:absolute/c*100;
 return {control:c,intervention:i,absolute,relative,riskRatio:c===0?null:i/c,direction:absolute>0?'benefit':absolute<0?'harm':'equal',numberNeeded:absolute===0?null:Math.ceil(100/Math.abs(absolute)-1e-10)};
}
