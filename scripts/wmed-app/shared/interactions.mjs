// Interações medicamentosas: regras próprias da WMed por mecanismo (classe × classe) e pares específicos.
// RASCUNHO de 24/09/2026 escrito com apoio de IA: exige revisão farmacêutica e médica antes da liberação ampla.
// Não é uma base licenciada (Micromedex, Lexicomp): cobre as interações de maior impacto clínico, não todas.
// Fontes gerais: bulas aprovadas (Anvisa/FDA), CredibleMeds (QT), FDA Drug Interactions Table (CYP), Phansalkar et al. 2012 (JAMIA, interações de alta prioridade).

export const SEVERITY={contraindicada:3,grave:2,moderada:1};

// Etiquetas de mecanismo por fármaco. Os nomes seguem o acervo de medicações (public/dados/medicacoes.json) mais alguns extras comuns.
const T={
 qt:['amiodarona','sotalol','azitromicina','claritromicina','eritromicina','ciprofloxacino','levofloxacino','moxifloxacino','ondansetrona','haloperidol','domperidona','citalopram','escitalopram','fluconazol','cetoconazol','hidroxicloroquina','cloroquina','metadona','clorpromazina'],
 sero:['sertralina','fluoxetina','paroxetina','citalopram','escitalopram','venlafaxina','duloxetina','amitriptilina','trazodona','tramadol','metadona','fentanil','sumatriptana','ondansetrona','carbonato de lítio'],
 imao:['selegilina','tranilcipromina'],
 imaoRev:['linezolida','azul de metileno'],
 isrs:['sertralina','fluoxetina','paroxetina','citalopram','escitalopram','venlafaxina','duloxetina'],
 hiperK:['enalapril','captopril','losartana','valsartana','sacubitril + valsartana','espironolactona','eplerenona','amilorida','sulfametoxazol com trimetoprima','sulfametoxazol-trimetoprima','heparina sódica','tacrolimo','ciclosporina','cloreto de potássio','citrato de potássio'],
 ieca:['enalapril','captopril'],
 bra:['losartana','valsartana','sacubitril + valsartana'],
 diur:['furosemida','hidroclorotiazida','clortalidona','espironolactona'],
 anticoag:['varfarina','rivaroxabana','apixabana','dabigatrana','enoxaparina','heparina sódica'],
 antiplaq:['ácido acetilsalicílico','clopidogrel','ticagrelor','prasugrel','cilostazol'],
 aine:['ibuprofeno','naproxeno','diclofenaco','cetoprofeno','cetorolaco','meloxicam','nimesulida'],
 inib3a4:['claritromicina','eritromicina','cetoconazol','itraconazol','ritonavir','fluconazol','diltiazem','verapamil'],
 sub3a4:['sinvastatina','lovastatina','tacrolimo','ciclosporina','colchicina','ivabradina','sildenafila','tadalafila','midazolam','quetiapina','fentanil','rivaroxabana','apixabana'],
 indutor:['rifampicina','carbamazepina','fenitoína','fenobarbital','erva-de-são-joão'],
 reduzidoPorIndutor:['varfarina','rivaroxabana','apixabana','dabigatrana','tacrolimo','ciclosporina','contraceptivo oral combinado','sinvastatina','atorvastatina','midazolam','quetiapina','sofosbuvir','levotiroxina'],
 opioide:['morfina','fentanil','tramadol','codeína','metadona','oxicodona'],
 bzd:['diazepam','midazolam','clonazepam','alprazolam','lorazepam'],
 depressorSNC:['gabapentina','pregabalina','zolpidem','baclofeno','quetiapina','prometazina','álcool (etanol)'],
 betabloq:['propranolol','metoprolol','carvedilol','bisoprolol','atenolol','sotalol'],
 bccNaoDhp:['diltiazem','verapamil'],
 nodal:['digoxina','amiodarona','ivabradina'],
 hipoglic:['insulina NPH','insulina regular','insulina glargina','insulina lispro','glibenclamida','gliclazida','glimepirida'],
 quinolona:['ciprofloxacino','levofloxacino','moxifloxacino'],
 nitrato:['nitroglicerina','mononitrato de isossorbida','dinitrato de isossorbida'],
 pde5:['sildenafila','tadalafila'],
 nefrotox:['gentamicina','amicacina','vancomicina','polimixina B','anfotericina B'],
 cation:['carbonato de cálcio','sulfato ferroso','sulfato de magnésio','hidróxido de alumínio e magnésio','sulfato de zinco'],
 quelavel:['ciprofloxacino','levofloxacino','moxifloxacino','doxiciclina','tetraciclina','levotiroxina'],
 corticoide:['prednisona','dexametasona','hidrocortisona','metilprednisolona'],
};
const DRUG_TAGS=new Map();
for(const [tag,list] of Object.entries(T))for(const d of list){if(!DRUG_TAGS.has(d))DRUG_TAGS.set(d,new Set());DRUG_TAGS.get(d).add(tag);}
export const tagsOf=d=>DRUG_TAGS.get(d)||new Set();

// Regras por classe. same: exige dois fármacos distintos com a mesma etiqueta.
const R=(grupo,a,b,sev,titulo,efeito,conduta)=>({grupo,a,b,sev,titulo,efeito,conduta});
const CLASS_RULES=[
 R('imao-sero','imao','sero','contraindicada','Síndrome serotoninérgica','IMAO com fármaco serotoninérgico pode causar síndrome serotoninérgica grave (hipertermia, rigidez, instabilidade autonômica).','Não associar. Respeitar intervalo de 14 dias após suspender o IMAO (5 semanas após fluoxetina).'),
 R('imao-sero','imaoRev','sero','grave','Síndrome serotoninérgica','Linezolida e azul de metileno inibem a MAO de forma reversível e podem causar síndrome serotoninérgica com fármacos serotoninérgicos.','Evitar; se indispensável, suspender o serotoninérgico quando possível ou monitorar de perto por 2 semanas.'),
 R('sero','sero','sero','moderada','Risco de síndrome serotoninérgica','Somar fármacos serotoninérgicos aumenta o risco de agitação, tremor, clônus, hiper-reflexia e hipertermia.','Usar a menor dose eficaz, orientar sintomas e monitorar ao iniciar ou aumentar a dose.'),
 R('qt','qt','qt','grave','Prolongamento do QT','Dois fármacos com risco conhecido de torsades de pointes somam o efeito sobre o QT.','Evitar a associação. Se indispensável: ECG basal e seriado, corrigir potássio e magnésio e evitar QTc > 500 ms.'),
 R('hiperK','hiperK','hiperK','grave','Hipercalemia','Associação de fármacos que retêm potássio pode causar hipercalemia grave, sobretudo com DRC, diabetes, desidratação ou idade avançada.','Dosar potássio e creatinina em 3–7 dias e periodicamente; evitar suplemento de potássio sem indicação clara.'),
 R('ieca-bra','ieca','bra','grave','Bloqueio duplo do sistema renina-angiotensina','IECA com BRA não traz benefício cardiovascular e aumenta hipercalemia, hipotensão e lesão renal.','Não associar. Com sacubitril-valsartana, o IECA é contraindicado (ver par específico).'),
 R('anticoag-dupla','anticoag','anticoag','grave','Duplicidade de anticoagulantes','Dois anticoagulantes somam o risco de sangramento grave.','Evitar, exceto na transição planejada entre eles (ex.: heparina até INR alvo da varfarina).'),
 R('anticoag-antiplaq','anticoag','antiplaq','grave','Sangramento','Anticoagulante com antiplaquetário aumenta muito o risco de sangramento maior.','Associar só com indicação formal (ex.: stent recente), pelo menor tempo possível e com IBP para proteção gástrica.'),
 R('anticoag-aine','anticoag','aine','grave','Sangramento gastrointestinal','AINE lesa a mucosa, inibe plaquetas e, com varfarina, pode elevar o INR.','Evitar. Preferir paracetamol ou dipirona para dor.'),
 R('antiplaq-aine','antiplaq','aine','moderada','Sangramento e perda do efeito do AAS','AINE soma risco de sangramento; o ibuprofeno pode bloquear o efeito antiplaquetário do AAS.','Evitar uso regular. Se necessário, AAS 30 min antes do ibuprofeno e IBP.'),
 R('dupla-antiplaq','antiplaq','antiplaq','moderada','Dupla antiagregação','Aumenta o sangramento; é intencional após síndrome coronariana ou stent.','Confirmar a indicação e o tempo previsto; associar IBP em risco de sangramento.'),
 R('isrs-sangramento','isrs','anticoag','moderada','Sangramento com ISRS','ISRS reduzem a serotonina plaquetária e somam risco de sangramento.','Monitorar sinais de sangramento; considerar IBP.'),
 R('isrs-sangramento','isrs','antiplaq','moderada','Sangramento com ISRS','ISRS reduzem a serotonina plaquetária e somam risco de sangramento.','Monitorar sinais de sangramento; considerar IBP.'),
 R('isrs-sangramento','isrs','aine','moderada','Sangramento gastrointestinal com ISRS','ISRS com AINE aumentam de forma importante o sangramento digestivo.','Evitar AINE regular; se necessário, associar IBP.'),
 R('aine-rim','aine','ieca','moderada','Lesão renal e perda do efeito anti-hipertensivo','AINE reduz a filtração glomerular e o efeito do IECA ou BRA.','Evitar uso prolongado; hidratar e dosar creatinina e potássio.'),
 R('aine-rim','aine','bra','moderada','Lesão renal e perda do efeito anti-hipertensivo','AINE reduz a filtração glomerular e o efeito do IECA ou BRA.','Evitar uso prolongado; hidratar e dosar creatinina e potássio.'),
 R('aine-diur','aine','diur','moderada','Menor efeito do diurético e lesão renal','AINE retém sódio e reduz a resposta ao diurético.','Evitar uso prolongado; monitorar peso, pressão e creatinina.'),
 R('cyp3a4','inib3a4','sub3a4','grave','Aumento de nível por inibição do CYP3A4','O inibidor reduz a eliminação do substrato e eleva seu nível sérico e a toxicidade.','Evitar ou reduzir a dose do substrato; ver os pares específicos para contraindicações.'),
 R('indutor','indutor','reduzidoPorIndutor','grave','Perda de efeito por indução enzimática','O indutor (CYP3A4, P-gp) reduz muito o nível do outro fármaco; o efeito dura até 2–4 semanas após a suspensão.','Evitar. Se indispensável, monitorar nível ou efeito (INR, nível de imunossupressor) e ajustar dose; usar contracepção adicional.'),
 R('opioide-bzd','opioide','bzd','grave','Depressão respiratória','Opioide com benzodiazepínico aumenta sedação profunda, depressão respiratória e morte (alerta em destaque da FDA).','Evitar. Se necessário, menores doses e duração, monitorar e orientar; considerar naloxona disponível.'),
 R('snc','depressorSNC','opioide','moderada','Sedação aditiva','Soma de depressores do SNC aumenta sedação, quedas e depressão respiratória.','Menor dose eficaz; cuidado em idosos e em doença pulmonar.'),
 R('snc','depressorSNC','bzd','moderada','Sedação aditiva','Soma de depressores do SNC aumenta sedação, quedas e depressão respiratória.','Menor dose eficaz; cuidado em idosos e em doença pulmonar.'),
 R('snc','depressorSNC','depressorSNC','moderada','Sedação aditiva','Soma de depressores do SNC aumenta sedação e quedas.','Menor dose eficaz; orientar sobre direção e álcool.'),
 R('snc','opioide','opioide','moderada','Duplicidade de opioides','Dois opioides somam sedação e depressão respiratória.','Rever a necessidade; usar um opioide de base e um de resgate com critério.'),
 R('snc','bzd','bzd','moderada','Duplicidade de benzodiazepínicos','Sem ganho terapêutico e com mais sedação e quedas.','Manter um só benzodiazepínico.'),
 R('bb-bcc','betabloq','bccNaoDhp','grave','Bradicardia e bloqueio AV','Betabloqueador com diltiazem ou verapamil soma efeito cronotrópico e inotrópico negativo.','Evitar, sobretudo com disfunção ventricular ou distúrbio de condução; se usar, ECG e FC.'),
 R('nodal','betabloq','nodal','moderada','Bradicardia','Soma de efeitos sobre o nó sinusal e AV.','Monitorar FC e ECG; reduzir doses se bradicardia sintomática.'),
 R('nodal','bccNaoDhp','nodal','moderada','Bradicardia','Soma de efeitos sobre o nó sinusal e AV.','Monitorar FC e ECG.'),
 R('nodal','nodal','nodal','moderada','Bradicardia','Soma de efeitos sobre o nó sinusal e AV.','Monitorar FC e ECG.'),
 R('glicemia','hipoglic','quinolona','moderada','Disglicemia','Fluoroquinolonas podem causar hipo ou hiperglicemia grave, sobretudo em idosos e com sulfonilureia ou insulina.','Monitorar glicemia; preferir outro antibiótico em idosos diabéticos.'),
 R('nitrato-pde5','nitrato','pde5','contraindicada','Hipotensão grave','Inibidor da PDE-5 potencializa o óxido nítrico do nitrato e causa hipotensão refratária.','Não associar. Nitrato só 24 h após sildenafila ou 48 h após tadalafila.'),
 R('nefrotox','nefrotox','nefrotox','grave','Nefrotoxicidade aditiva','Dois nefrotóxicos somam o risco de lesão renal aguda (e ototoxicidade com aminoglicosídeo).','Evitar; se necessário, nível sérico, creatinina diária e hidratação.'),
 R('nefrotox','nefrotox','aine','moderada','Nefrotoxicidade aditiva','AINE reduz o fluxo renal e soma toxicidade com aminoglicosídeo, vancomicina ou polimixina.','Evitar AINE durante o tratamento.'),
 R('quelacao','quelavel','cation','moderada','Menor absorção','Cálcio, ferro, magnésio, zinco e antiácidos formam complexos no intestino e reduzem a absorção.','Separar: quinolona ou tetraciclina 2 h antes ou 6 h depois; levotiroxina 4 h longe.'),
 R('tendao','quinolona','corticoide','moderada','Ruptura de tendão','Fluoroquinolona com corticoide sistêmico aumenta tendinopatia e ruptura, sobretudo após os 60 anos.','Evitar a associação; orientar suspender se dor em tendão.'),
];

// Pares específicos (nomes exatos). Prevalecem sobre a regra de classe do mesmo grupo quando mais graves.
const P=(a,b,grupo,sev,titulo,efeito,conduta)=>({a,b,grupo,sev,titulo,efeito,conduta});
const PAIRS=[
 P('sacubitril + valsartana','enalapril','ieca-bra','contraindicada','Angioedema','Inibição da neprilisina com IECA acumula bradicinina e causa angioedema.','Não associar. Suspender o IECA 36 h antes da primeira dose.'),
 P('sacubitril + valsartana','captopril','ieca-bra','contraindicada','Angioedema','Inibição da neprilisina com IECA acumula bradicinina e causa angioedema.','Não associar. Suspender o IECA 36 h antes da primeira dose.'),
 P('sinvastatina','claritromicina','cyp3a4','contraindicada','Miopatia e rabdomiólise','Inibidor forte do CYP3A4 eleva muito o nível da sinvastatina.','Contraindicado. Suspender a sinvastatina durante o antibiótico ou usar azitromicina.'),
 P('sinvastatina','cetoconazol','cyp3a4','contraindicada','Miopatia e rabdomiólise','Inibidor forte do CYP3A4 eleva muito o nível da sinvastatina.','Contraindicado.'),
 P('sinvastatina','itraconazol','cyp3a4','contraindicada','Miopatia e rabdomiólise','Inibidor forte do CYP3A4 eleva muito o nível da sinvastatina.','Contraindicado.'),
 P('sinvastatina','ritonavir','cyp3a4','contraindicada','Miopatia e rabdomiólise','Inibidor forte do CYP3A4 eleva muito o nível da sinvastatina.','Contraindicado.'),
 P('sinvastatina','eritromicina','cyp3a4','contraindicada','Miopatia e rabdomiólise','Inibidor do CYP3A4 eleva muito o nível da sinvastatina.','Contraindicado.'),
 P('sinvastatina','diltiazem','cyp3a4','grave','Miopatia','Diltiazem eleva o nível da sinvastatina.','Limitar a sinvastatina a 10 mg/dia ou trocar por outra estatina.'),
 P('sinvastatina','verapamil','cyp3a4','grave','Miopatia','Verapamil eleva o nível da sinvastatina.','Limitar a sinvastatina a 10 mg/dia ou trocar por outra estatina.'),
 P('sinvastatina','amiodarona','estatina','moderada','Miopatia','Amiodarona eleva o nível da sinvastatina.','Limitar a sinvastatina a 20 mg/dia.'),
 P('sinvastatina','anlodipino','estatina','moderada','Miopatia','Anlodipino eleva o nível da sinvastatina.','Limitar a sinvastatina a 20 mg/dia.'),
 P('colchicina','claritromicina','cyp3a4','grave','Toxicidade da colchicina','Inibição do CYP3A4 e da P-gp eleva a colchicina (miopatia, citopenias, falência de múltiplos órgãos).','Evitar; contraindicado com disfunção renal ou hepática. Se indispensável, reduzir muito a dose.'),
 P('ivabradina','diltiazem','cyp3a4','contraindicada','Bradicardia grave','Diltiazem inibe o CYP3A4 e reduz a FC, somando-se à ivabradina.','Contraindicado.'),
 P('ivabradina','verapamil','cyp3a4','contraindicada','Bradicardia grave','Verapamil inibe o CYP3A4 e reduz a FC, somando-se à ivabradina.','Contraindicado.'),
 P('ivabradina','claritromicina','cyp3a4','contraindicada','Bradicardia grave','Inibidor forte do CYP3A4 eleva muito a ivabradina.','Contraindicado.'),
 P('ivabradina','cetoconazol','cyp3a4','contraindicada','Bradicardia grave','Inibidor forte do CYP3A4 eleva muito a ivabradina.','Contraindicado.'),
 P('rivaroxabana','cetoconazol','cyp3a4','contraindicada','Sangramento','Inibição forte do CYP3A4 e da P-gp eleva muito a rivaroxabana.','Evitar a associação.'),
 P('rivaroxabana','itraconazol','cyp3a4','contraindicada','Sangramento','Inibição forte do CYP3A4 e da P-gp eleva muito a rivaroxabana.','Evitar a associação.'),
 P('rivaroxabana','ritonavir','cyp3a4','contraindicada','Sangramento','Inibição forte do CYP3A4 e da P-gp eleva muito a rivaroxabana.','Evitar a associação.'),
 P('varfarina','amiodarona','varfarina','grave','Aumento do INR','Amiodarona inibe o metabolismo da varfarina; efeito aparece em semanas e dura meses.','Reduzir a varfarina em 30–50% e controlar INR semanalmente.'),
 P('varfarina','sulfametoxazol com trimetoprima','varfarina','grave','Aumento do INR','SMX-TMP inibe o CYP2C9 e desloca a varfarina.','Preferir outro antibiótico; se usar, INR em 3–5 dias.'),
 P('varfarina','sulfametoxazol-trimetoprima','varfarina','grave','Aumento do INR','SMX-TMP inibe o CYP2C9 e desloca a varfarina.','Preferir outro antibiótico; se usar, INR em 3–5 dias.'),
 P('varfarina','metronidazol','varfarina','grave','Aumento do INR','Metronidazol inibe o metabolismo da varfarina.','Preferir alternativa; se usar, reduzir dose e INR em 3–5 dias.'),
 P('varfarina','fluconazol','varfarina','grave','Aumento do INR','Fluconazol inibe o CYP2C9.','Controlar INR em 3–5 dias; considerar reduzir a dose.'),
 P('varfarina','ciprofloxacino','varfarina','moderada','Aumento do INR','Quinolonas e a própria infecção podem elevar o INR.','Controlar INR durante o tratamento.'),
 P('varfarina','levofloxacino','varfarina','moderada','Aumento do INR','Quinolonas e a própria infecção podem elevar o INR.','Controlar INR durante o tratamento.'),
 P('varfarina','claritromicina','varfarina','moderada','Aumento do INR','Claritromicina reduz o metabolismo da varfarina.','Controlar INR durante o tratamento.'),
 P('varfarina','paracetamol','varfarina','moderada','Aumento do INR','Paracetamol regular acima de 2 g/dia por vários dias eleva o INR.','Uso ocasional é seguro; em uso regular, controlar INR.'),
 P('alopurinol','azatioprina','purina','grave','Mielossupressão','Alopurinol inibe a xantina oxidase, que elimina a azatioprina.','Evitar; se indispensável, reduzir a azatioprina para 25–33% da dose e controlar hemograma.'),
 P('alopurinol','mercaptopurina','purina','grave','Mielossupressão','Alopurinol inibe a xantina oxidase, que elimina a mercaptopurina.','Evitar; se indispensável, reduzir a dose para 25–33% e controlar hemograma.'),
 P('metotrexato','sulfametoxazol com trimetoprima','mtx','grave','Mielossupressão','Ambos são antifolatos e o SMX-TMP reduz a eliminação renal do metotrexato.','Evitar a associação (inclusive na profilaxia) ou monitorar hemograma de perto.'),
 P('metotrexato','sulfametoxazol-trimetoprima','mtx','grave','Mielossupressão','Ambos são antifolatos e o SMX-TMP reduz a eliminação renal do metotrexato.','Evitar a associação ou monitorar hemograma de perto.'),
 P('metotrexato','dipirona','mtx','grave','Toxicidade hematológica','A bula da dipirona alerta para aumento da toxicidade hematológica do metotrexato, sobretudo em idosos.','Evitar a associação.'),
 P('clopidogrel','omeprazol','clopidogrel','moderada','Menor efeito do clopidogrel','Omeprazol inibe o CYP2C19, que ativa o clopidogrel.','Preferir pantoprazol.'),
 P('digoxina','amiodarona','digoxina','grave','Intoxicação digitálica','Amiodarona reduz a eliminação da digoxina (P-gp).','Reduzir a digoxina em 50% e dosar nível sérico.'),
 P('digoxina','verapamil','digoxina','grave','Intoxicação digitálica e bradicardia','Verapamil eleva a digoxina e soma o efeito no nó AV.','Reduzir a digoxina e dosar nível; ECG.'),
 P('digoxina','claritromicina','digoxina','grave','Intoxicação digitálica','Claritromicina inibe a P-gp e eleva a digoxina.','Preferir outro antibiótico ou dosar nível.'),
 P('digoxina','furosemida','digoxina','moderada','Toxicidade por hipocalemia','Hipocalemia e hipomagnesemia aumentam a toxicidade digitálica.','Manter potássio > 4 mEq/L e monitorar magnésio.'),
 P('digoxina','hidroclorotiazida','digoxina','moderada','Toxicidade por hipocalemia','Hipocalemia aumenta a toxicidade digitálica.','Manter potássio > 4 mEq/L.'),
 P('carbonato de lítio','enalapril','litio','grave','Intoxicação por lítio','IECA reduz a eliminação renal do lítio.','Evitar ou dosar litemia em 5–7 dias e após cada ajuste.'),
 P('carbonato de lítio','captopril','litio','grave','Intoxicação por lítio','IECA reduz a eliminação renal do lítio.','Evitar ou dosar litemia em 5–7 dias e após cada ajuste.'),
 P('carbonato de lítio','losartana','litio','grave','Intoxicação por lítio','BRA reduz a eliminação renal do lítio.','Evitar ou dosar litemia em 5–7 dias e após cada ajuste.'),
 P('carbonato de lítio','hidroclorotiazida','litio','grave','Intoxicação por lítio','Tiazídico aumenta a reabsorção de lítio (até 25–40%).','Evitar; se usar, reduzir o lítio e dosar litemia.'),
 P('carbonato de lítio','clortalidona','litio','grave','Intoxicação por lítio','Tiazídico aumenta a reabsorção de lítio.','Evitar; se usar, reduzir o lítio e dosar litemia.'),
 P('carbonato de lítio','ibuprofeno','litio','grave','Intoxicação por lítio','AINE reduz a eliminação renal do lítio.','Evitar AINE; preferir paracetamol ou dipirona.'),
 P('carbonato de lítio','diclofenaco','litio','grave','Intoxicação por lítio','AINE reduz a eliminação renal do lítio.','Evitar AINE; preferir paracetamol ou dipirona.'),
 P('carbonato de lítio','naproxeno','litio','grave','Intoxicação por lítio','AINE reduz a eliminação renal do lítio.','Evitar AINE; preferir paracetamol ou dipirona.'),
 P('tramadol','sertralina','sero','grave','Síndrome serotoninérgica e convulsão','Tramadol é serotoninérgico e reduz o limiar convulsivo; ISRS inibem sua ativação (CYP2D6) e somam o risco.','Evitar; preferir outro analgésico.'),
 P('tramadol','fluoxetina','sero','grave','Síndrome serotoninérgica e convulsão','Tramadol é serotoninérgico e reduz o limiar convulsivo; fluoxetina inibe o CYP2D6.','Evitar; preferir outro analgésico.'),
 P('tramadol','paroxetina','sero','grave','Síndrome serotoninérgica e convulsão','Tramadol é serotoninérgico e reduz o limiar convulsivo; paroxetina inibe o CYP2D6.','Evitar; preferir outro analgésico.'),
 P('ácido valproico','lamotrigina','valproato','grave','Aumento da lamotrigina e farmacodermia','Valproato dobra o nível da lamotrigina e aumenta o risco de Stevens-Johnson.','Iniciar lamotrigina com metade da dose e titular mais devagar.'),
 P('ácido valproico','meropenem','valproato','contraindicada','Perda do efeito anticonvulsivante','Carbapenêmicos reduzem o nível de valproato em até 60–90% em 24 h.','Evitar; usar outro antibiótico ou outro anticonvulsivante.'),
 P('aminofilina','ciprofloxacino','teofilina','grave','Intoxicação por teofilina','Ciprofloxacino inibe o CYP1A2 e eleva a teofilina (convulsões, arritmias).','Evitar ou reduzir a dose e dosar nível.'),
 P('teofilina','ciprofloxacino','teofilina','grave','Intoxicação por teofilina','Ciprofloxacino inibe o CYP1A2 e eleva a teofilina (convulsões, arritmias).','Evitar ou reduzir a dose e dosar nível.'),
 P('metoclopramida','levodopa + carbidopa','dopamina','grave','Piora do parkinsonismo','Metoclopramida bloqueia receptores D2 e antagoniza a levodopa.','Evitar; para náusea, preferir domperidona.'),
 P('haloperidol','levodopa + carbidopa','dopamina','grave','Piora do parkinsonismo','Antagonista D2 anula o efeito da levodopa.','Evitar; se antipsicótico for necessário, preferir quetiapina ou clozapina.'),
 P('sildenafila','doxazosina','hipotensao','moderada','Hipotensão','Alfabloqueador com inibidor da PDE-5 soma vasodilatação.','Iniciar com dose baixa, com o alfabloqueador já estável.'),
 P('metronidazol','álcool (etanol)','alcool','moderada','Reação tipo dissulfiram','Metronidazol pode causar rubor, náusea, vômitos e taquicardia com álcool.','Evitar álcool durante e até 3 dias após o tratamento.'),
 P('paracetamol','álcool (etanol)','alcool','moderada','Hepatotoxicidade','Uso crônico de álcool aumenta a formação do metabólito tóxico do paracetamol.','Limitar o paracetamol a 2 g/dia em etilistas.'),
 P('levotiroxina','omeprazol','absorcao','moderada','Menor absorção da levotiroxina','A acidez gástrica reduzida diminui a absorção.','Checar TSH 6–8 semanas após iniciar o IBP.'),
 P('espironolactona','cloreto de potássio','hiperK','grave','Hipercalemia','Diurético poupador de potássio com suplemento de potássio.','Evitar o suplemento, salvo hipocalemia documentada; dosar potássio.'),
];

const pairKey=(a,b)=>[a,b].sort().join('|');
const PAIR_MAP=new Map();for(const p of PAIRS){const k=pairKey(p.a,p.b);if(!PAIR_MAP.has(k))PAIR_MAP.set(k,[]);PAIR_MAP.get(k).push(p);}

// Todas as interações entre os fármacos da lista. Para cada par e grupo de mecanismo, fica a mais grave (no empate, o par específico).
export function checkInteractions(drugs){
 const list=[...new Set(drugs)],out=[];
 for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
  const a=list[i],b=list[j],ta=tagsOf(a),tb=tagsOf(b),byGroup=new Map();
  const keep=f=>{const cur=byGroup.get(f.grupo);if(!cur||SEVERITY[f.sev]>SEVERITY[cur.sev]||(SEVERITY[f.sev]===SEVERITY[cur.sev]&&f.origem==='par'))byGroup.set(f.grupo,f);};
  for(const r of CLASS_RULES){
   if((ta.has(r.a)&&tb.has(r.b))||(ta.has(r.b)&&tb.has(r.a)))keep({grupo:r.grupo,sev:r.sev,titulo:r.titulo,efeito:r.efeito,conduta:r.conduta,origem:'classe'});
  }
  for(const p of PAIR_MAP.get(pairKey(a,b))||[])keep({grupo:p.grupo,sev:p.sev,titulo:p.titulo,efeito:p.efeito,conduta:p.conduta,origem:'par'});
  for(const f of byGroup.values())out.push({a,b,...f});
 }
 // "Triplo golpe": IECA/BRA + diurético + AINE, risco alto de lesão renal aguda.
 const has=tag=>list.filter(d=>tagsOf(d).has(tag));
 const raas=[...has('ieca'),...has('bra')],diur=has('diur'),aine=has('aine');
 if(raas.length&&diur.length&&aine.length)out.push({a:raas[0],b:aine[0],c:diur[0],grupo:'triplo-golpe',sev:'grave',titulo:'Triplo golpe renal',efeito:'IECA ou BRA, diurético e AINE juntos reduzem a perfusão glomerular por três mecanismos e causam lesão renal aguda, sobretudo em idosos e desidratados.',conduta:'Suspender o AINE; se indispensável, dosar creatinina em poucos dias.',origem:'classe'});
 return out.sort((x,y)=>SEVERITY[y.sev]-SEVERITY[x.sev]||x.titulo.localeCompare(y.titulo));
}

// Nomes que o verificador reconhece (mecanismo conhecido), para a busca da tela.
export const INTERACTION_DRUGS=[...new Set([...DRUG_TAGS.keys(),...PAIRS.flatMap(p=>[p.a,p.b])])].sort((a,b)=>a.localeCompare(b,'pt'));
