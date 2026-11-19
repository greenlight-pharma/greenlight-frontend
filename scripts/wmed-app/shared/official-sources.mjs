// Editorial directory only. No remote search, scraping, clinical inference or patient data.
export const sourceDirectoryVersion='2026-09-25.1';
export const sourceReviewedOn='2026-09-25';
export const sourceCategories=['all','medicines','guidelines','vaccines','coding'];
export const sourceRegions=['BR','PT','US','GB','ES'];
export const sourceText=(value,locale='pt-BR')=>value[locale==='en'?1:locale==='es'?2:0];
const entry=(id,region,category,name,owner,url,language,description)=>({id,region,category,name,owner,url,language,description,reviewedOn:sourceReviewedOn,use:'external-link-only'});
export const officialSources=[
 entry('anvisa','BR','medicines','Bulário Eletrônico','ANVISA','https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico','Português',['Acesso à consulta de bulas no Brasil.','Access medicine leaflets and labels in Brazil.','Acceso a la consulta de prospectos en Brasil.']),
 entry('pcdt','BR','guidelines','PCDT','CONITEC · Ministério da Saúde','https://www.gov.br/conitec/pt-br/assuntos/avaliacao-de-tecnologias-em-saude/protocolos-clinicos-e-diretrizes-terapeuticas/pcdt','Português',['Protocolos e diretrizes do SUS. Confira a versão de cada documento.','SUS protocols and guidelines. Check each document’s version.','Protocolos y guías del SUS. Revisa la versión de cada documento.']),
 entry('pni','BR','vaccines','Calendário de vacinação','Ministério da Saúde','https://www.gov.br/saude/pt-br/vacinacao/calendario','Português',['Calendários brasileiros por etapa da vida.','Brazilian vaccination schedules by life stage.','Calendarios brasileños por etapa de la vida.']),
 entry('sigtap','BR','coding','SIGTAP','DATASUS','https://wiki.datasus.gov.br/sigtap/index.php/P%C3%A1gina_principal','Português',['Referência e acesso à tabela de procedimentos do SUS. Confira a competência.','Reference and access to the SUS procedure table. Check the reporting period.','Referencia y acceso a la tabla de procedimientos del SUS. Revisa el período.']),
 entry('infomed','PT','medicines','Infomed','INFARMED','https://extranet.infarmed.pt/INFOMED-fo/','Português',['Consulta de medicamentos de uso humano em Portugal.','Human medicine information in Portugal.','Consulta de medicamentos de uso humano en Portugal.']),
 entry('dailymed','US','medicines','DailyMed','National Library of Medicine','https://dailymed.nlm.nih.gov/dailymed/','English',['Rotulagem de medicamentos nos EUA. A base não inclui todos os produtos regulados pela FDA.','US medicine labeling. The database does not include all FDA-regulated products.','Etiquetado de medicamentos en EE. UU. No incluye todos los productos regulados por la FDA.']),
 entry('mhra','GB','medicines','MHRA Products','MHRA','https://products.mhra.gov.uk/','English',['Informações de produtos, folhetos e relatórios públicos de avaliação de medicamentos.','Medicine product information, leaflets and public assessment reports.','Información de productos, prospectos e informes públicos de evaluación de medicamentos.']),
 entry('cima','ES','medicines','CIMA','AEMPS','https://cima.aemps.es/cima/publico/home.html','Español',['Informação oficial sobre medicamentos na Espanha.','Official medicine information in Spain.','Información oficial sobre medicamentos en España.']),
 entry('who','global','guidelines','WHO Guidelines','World Health Organization','https://www.who.int/publications/who-guidelines','English / outros',['Diretrizes internacionais. Confira a adaptação ao contexto local.','International guidelines. Check applicability to local practice.','Guías internacionales. Revisa su aplicación al contexto local.']),
];
export function sourceDirectory({region='global',category='all',query='',locale='pt-BR'}={}){
 const normal=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const q=normal(query.trim());
 const matches=s=>(category==='all'||s.category===category)&&(!q||normal([s.name,s.owner,sourceText(s.description,locale)].join(' ')).includes(q));
 return {regional:officialSources.filter(s=>s.region===region&&s.region!=='global'&&matches(s)),international:officialSources.filter(s=>s.region==='global'&&matches(s)),covered:sourceRegions.includes(region)};
}
