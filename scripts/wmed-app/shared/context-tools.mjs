// Curated navigation suggestions, not diagnoses or model-generated URLs.
export function contextTools(text){
 const t=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),items=[];
 if(/anatom|valva|mitral|aort|coracao|pulm|renal|rim|cerebr|osso/.test(t))items.push({id:'anatomia',label:'Consultar anatomia 3D'});
 if(/celula|histol|cardiomioc|neuron|epitel/.test(t))items.push({id:'histologia',label:'Consultar histologia 3D'});
 if(/tomograf|radiolog|raio.?x|ressonancia/.test(t))items.push({id:'radiologia',label:'Explorar radiologia'});
 if(/bacter|virus|fung|protozo|microbio/.test(t))items.push({id:'microbiologia',label:'Consultar microbiologia'});
 if(/score|escala|wells|glasgow|calcul/.test(t))items.push({id:'scores',label:'Abrir scores e calculadoras'});
 if(/medic|farmac|dose|tratamento/.test(t))items.push({id:'medicacoes',label:'Consultar medicações'});
 if(/questao|enamed|prova|residencia/.test(t))items.push({id:'questoes',label:'Praticar com questões'});
 return items.slice(0,3);
}
