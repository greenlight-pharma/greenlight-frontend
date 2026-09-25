import {calculators} from '../calculators.mjs';
// Display-only translations. Inputs, ranges, option values and formulas used by
// the calculation engine remain in shared/calculators.mjs.
const fields={
 weight:['Weight (kg)','Peso (kg)'],height:['Height (cm)','Altura (cm)'],age:['Age (years)','Edad (años)'],creatinine:['Creatinine (mg/dL)','Creatinina (mg/dL)'],female:['Sex used in the equation','Sexo utilizado en la ecuación'],na:['Sodium (mEq/L)','Sodio (mEq/L)'],cl:['Chloride (mEq/L)','Cloruro (mEq/L)'],hco:['Bicarbonate (mEq/L)','Bicarbonato (mEq/L)']
};
const copy={
 bmi:{name:['Body mass index','Índice de masa corporal'],summary:['Weight-to-height relationship in adults.','Relación entre peso y altura en adultos.'],note:['Do not use alone to assess body composition. Children and pregnancy require other references.','No usar de forma aislada para evaluar la composición corporal. La población pediátrica y el embarazo requieren otras referencias.'],formula:['Weight ÷ (height in metres)²','Peso ÷ (altura en metros)²']},
 bsa:{name:['Body surface area · Mosteller','Superficie corporal · Mosteller'],summary:['Estimated body surface area in adults.','Estimación de la superficie corporal en adultos.'],note:['Anthropometric estimate. Does not calculate medication doses.','Estimación antropométrica. No calcula dosis de medicamentos.'],formula:['√(height in cm × weight in kg ÷ 3,600)','√(altura en cm × peso en kg ÷ 3.600)']},
 egfr:{name:['Estimated GFR · CKD-EPI 2021','TFG estimada · CKD-EPI 2021'],summary:['Creatinine, age and equation sex; no race coefficient.','Creatinina, edad y sexo de la ecuación; sin coeficiente racial.'],note:['Adults with stable creatinine. Do not use in acute kidney injury or pregnancy. A single result does not diagnose chronic kidney disease.','Adultos con creatinina estable. No usar en lesión renal aguda ni embarazo. Un resultado aislado no diagnostica enfermedad renal crónica.'],formula:['142 × min(Cr/κ,1)^α × max(Cr/κ,1)^−1.200 × 0.9938^age × 1.012 (female). κ: 0.7/0.9; α: −0.241/−0.302 (female/male).','142 × min(Cr/κ,1)^α × max(Cr/κ,1)^−1,200 × 0,9938^edad × 1,012 (femenino). κ: 0,7/0,9; α: −0,241/−0,302 (femenino/masculino).']},
 gap:{name:['Anion gap','Brecha aniónica'],summary:['Difference between measured cations and anions, excluding potassium.','Diferencia entre los cationes y aniones medidos, sin potasio.'],note:['Not corrected for albumin. Compare with the laboratory reference range; hypoalbuminaemia may mask an increase.','Sin corrección por albúmina. Comparar con el intervalo de referencia del laboratorio; la hipoalbuminemia puede ocultar un aumento.'],formula:['Na − (Cl + HCO₃)','Na − (Cl + HCO₃)']},
 winter:{name:['Winter’s formula','Fórmula de Winter'],summary:['Expected PaCO₂ in metabolic acidosis.','PaCO₂ esperada en la acidosis metabólica.'],note:['Use only in metabolic acidosis and compare with measured PaCO₂. Does not recommend ventilator settings.','Aplicar solo en acidosis metabólica y comparar con la PaCO₂ medida. No indica parámetros de ventilación.'],formula:['Expected PaCO₂ = 1.5 × HCO₃ + 8 ± 2','PaCO₂ esperada = 1,5 × HCO₃ + 8 ± 2']}
};
export function localizedCalculators(locale='pt-BR'){
 if(!['en','es'].includes(locale))return calculators;
 const i=locale==='es'?1:0;
 return calculators.map(c=>({...c,...Object.fromEntries(Object.entries(copy[c.id]).map(([k,v])=>[k,v[i]])),area:c.area==='Nefrologia'?['Nephrology','Nefrología'][i]:['Internal medicine','Medicina interna'][i],unit:c.unit.replace('1,73',locale==='en'?'1.73':'1,73'),inputs:c.inputs.map(f=>({...f,label:fields[f.id][i],...(f.options?{options:f.options.map(([value])=>[value,value==='1'?['Female','Femenino'][i]:['Male','Masculino'][i]])}:{})}))}));
}
export function calculatorError(result,calculator,locale='pt-BR'){
 if(!result.error)return '';
 if(!['en','es'].includes(locale))return result.error;
 const original=calculators.find(c=>c.id===calculator.id);
 const field=original.inputs.find(f=>result.error===`Confira ${f.label.toLowerCase()}.`);
 return field?`${locale==='es'?'Revisa':'Check'}: ${calculator.inputs.find(f=>f.id===field.id).label}.`:locale==='es'?'Calculadora no encontrada.':'Calculator not found.';
}
