// Doses pediátricas usuais (VO) para cálculo por peso. RASCUNHO WMed de 24/09/2026 — exige revisão médica antes da liberação ampla.
// perDose: [min,max] mg/kg por tomada; perDay: [min,max] mg/kg/dia dividido em `doses` tomadas. maxDose/maxDay em mg (teto de adulto).
export const PED_DRUGS=[
 {id:'paracetamol',name:'Paracetamol',use:'Dor e febre',perDose:[10,15],interval:'a cada 6 horas (mínimo 4 h entre doses)',maxDose:1000,maxDay:4000,maxDayKg:75,forms:[['Gotas 200 mg/mL',200],['Suspensão 32 mg/mL',32]],note:'Máximo de 75 mg/kg/dia (sem passar de 4 g/dia). Cuidado com a soma de produtos combinados.',source:'https://www.ncbi.nlm.nih.gov/books/NBK482369/'},
 {id:'dipirona',name:'Dipirona',use:'Dor e febre',perDose:[15,25],interval:'a cada 6 horas',maxDose:1000,maxDay:4000,forms:[['Gotas 500 mg/mL (20 gotas/mL)',500],['Solução oral 50 mg/mL',50]],note:'Bula brasileira: não usar em menores de 3 meses ou com menos de 5 kg. Risco raro de agranulocitose.',source:'https://consultas.anvisa.gov.br/#/bulario/'},
 {id:'ibuprofeno',name:'Ibuprofeno',use:'Dor, febre e inflamação',perDose:[5,10],interval:'a cada 6 a 8 horas',maxDose:400,maxDay:2400,maxDayKg:40,minAge:'6 meses',forms:[['Gotas 50 mg/mL',50],['Gotas 100 mg/mL',100],['Suspensão 20 mg/mL',20]],note:'A partir de 6 meses. Máximo de 40 mg/kg/dia. Evitar em desidratação, doença renal e varicela.',source:'https://www.ncbi.nlm.nih.gov/books/NBK542299/'},
 {id:'amoxicilina',name:'Amoxicilina',use:'Infecções bacterianas (dose usual)',perDay:[50,50],doses:2,interval:'a cada 12 horas (ou dividir a cada 8 h)',maxDay:3000,forms:[['Suspensão 250 mg/5 mL',50],['Suspensão 400 mg/5 mL',80]],note:'Otite média aguda e pneumonia comunitária: 80–90 mg/kg/dia divididos a cada 12 h (use a opção "dose alta").',source:'https://publications.aap.org/pediatrics/article/131/3/e964/30912'},
 {id:'amoxicilina-alta',name:'Amoxicilina · dose alta',use:'Otite média aguda, pneumonia',perDay:[80,90],doses:2,interval:'a cada 12 horas',maxDay:4000,forms:[['Suspensão 400 mg/5 mL',80],['Suspensão 250 mg/5 mL',50]],note:'Dose alta das diretrizes de otite média (AAP 2013) e de pneumonia comunitária pediátrica.',source:'https://publications.aap.org/pediatrics/article/131/3/e964/30912'},
 {id:'amoxiclav',name:'Amoxicilina + clavulanato (7:1)',use:'Infecções com produtoras de betalactamase',perDay:[45,50],doses:2,interval:'a cada 12 horas',maxDay:1750,forms:[['Suspensão 400 + 57 mg/5 mL',80]],note:'Dose calculada pela amoxicilina. Para dose alta (90 mg/kg/dia) use a formulação 14:1 (ES 600 mg/5 mL) para limitar o clavulanato.',source:'https://publications.aap.org/pediatrics/article/131/3/e964/30912'},
 {id:'azitromicina',name:'Azitromicina',use:'Infecções respiratórias',perDay:[10,10],doses:1,interval:'1 vez ao dia por 3 dias (ou 10 mg/kg no 1º dia e 5 mg/kg do 2º ao 5º)',maxDay:500,forms:[['Suspensão 200 mg/5 mL',40]],note:'Máximo de 500 mg/dia.',source:'https://www.ncbi.nlm.nih.gov/books/NBK557766/'},
 {id:'cefalexina',name:'Cefalexina',use:'Pele, partes moles, infecção urinária',perDay:[25,50],doses:4,interval:'a cada 6 horas (ou dividir a cada 12 h)',maxDay:4000,forms:[['Suspensão 250 mg/5 mL',50],['Suspensão 500 mg/5 mL',100]],note:'Infecções graves podem exigir até 100 mg/kg/dia.',source:'https://www.ncbi.nlm.nih.gov/books/NBK549780/'},
 {id:'prednisolona',name:'Prednisolona',use:'Crise de asma',perDay:[1,2],doses:1,interval:'1 vez ao dia por 3 a 5 dias',maxDay:40,forms:[['Solução oral 3 mg/mL',3],['Solução oral 1 mg/mL',1]],note:'GINA: 1–2 mg/kg/dia, máximo de 40 mg/dia em crianças de 6 a 11 anos (menores: máximo usual de 20–30 mg).',source:'https://ginasthma.org/reports/'},
 {id:'dexametasona',name:'Dexametasona',use:'Crupe (laringotraqueíte)',perDose:[.15,.6],interval:'dose única',maxDose:16,forms:[['Elixir 0,1 mg/mL',.1],['Solução injetável 4 mg/mL (uso VO)',4]],note:'Dose única; 0,15 mg/kg costuma bastar no crupe leve a moderado.',source:'https://www.ncbi.nlm.nih.gov/books/NBK431070/'},
];
const round=n=>Math.round(n*100)/100;
// Dose por tomada (mg) para um peso, com teto pelo máximo por dose e por dia.
export function pedDose(drug,kg){
 if(!(kg>=.5&&kg<=150))return {error:'Informe um peso entre 0,5 e 150 kg.'};
 const doses=drug.perDay?drug.doses:null;
 let [lo,hi]=drug.perDose?drug.perDose.map(x=>x*kg):drug.perDay.map(x=>x*kg/drug.doses);
 const capDose=Math.min(drug.maxDose??Infinity,doses?(drug.maxDay??Infinity)/doses:Infinity);
 const capped=hi>capDose;lo=Math.min(lo,capDose);hi=Math.min(hi,capDose);
 const perDayMax=drug.maxDayKg?Math.min(drug.maxDayKg*kg,drug.maxDay):drug.maxDay;
 return {lo:round(lo),hi:round(hi),capped,perDayMax:perDayMax?round(perDayMax):null,volumes:drug.forms.map(([label,mgPerMl])=>({label,lo:round(lo/mgPerMl),hi:round(hi/mgPerMl)}))};
}
