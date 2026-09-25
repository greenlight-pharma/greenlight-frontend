// A separate build keeps the published WMed identity and data contracts intact.
export function productConfig(id = 'wmed', base = '/') {
  const doctor = id === '2doctor';
  return {
    id: doctor ? '2doctor' : 'wmed', doctor,
    name: doctor ? '2Doctor' : 'WMed',
    themeKey: doctor ? '2doctor-theme' : 'wmed-theme',
    icon: `${base}brand/${doctor ? '2doctor/' : ''}favicon.svg`,
  };
}
export const navigationGroups = [
  {id:'plantao', label:'Plantão', description:'Apoio à consulta clínica', modules:['caso','scores','medicacoes','condicoes','imagens']},
  {id:'estudos', label:'Estudos', description:'Do conceito à prática', modules:['questoes','enamed','flashcards','curso-ecg','anatomia','histologia','radiologia','microbiologia','genetica','molecular','evolucao']},
  {id:'laboratorio', label:'Laboratório de IA', description:'Explore nossos protótipos', modules:['laboratorio']},
];
export function searchNavigation(items, query = '') {
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const value = normalize(query.trim());
  return navigationGroups.map(group => ({...group, items:group.modules.map(id => items.find(item=>item.id===id)).filter(Boolean).filter(item=>!value||normalize(`${item.label} ${item.description} ${group.label}`).includes(value))})).filter(group=>group.items.length);
}
