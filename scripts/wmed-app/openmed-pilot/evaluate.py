"""Synthetic smoke evaluation; not a clinical/privacy validation dataset."""
import argparse,json,time,statistics
from pathlib import Path
from engine import Engine
p=argparse.ArgumentParser();p.add_argument('--model-dir',required=True);p.add_argument('--output',required=True);a=p.parse_args()
engine=Engine(a.model_dir);times=[];categories={k:{'expected':0,'fullyCovered':0}for k in ['nome','cpf','telefone','email']};damaged=0
names=['Carlos Mendes','Ana Beatriz Santos','João da Silva','Maria Clara Souza','Luís André Costa']
clinical=['Nega febre. Usa losartana 50 mg.','Mãe diabética. Paciente sem diabetes.','Dor há 3 dias. PA 120/80 e FC 90.','Hipótese de pneumonia, ainda não confirmada.']
for i in range(100):
 name=names[i%5];body=clinical[(i//5)%4];prefix=['Paciente ','Caso fictício: paciente ','🩺 Paciente ','Nome: ','Identificação: '][i//20]
 text=prefix+name+', 54 anos. '+body+' CPF 123.456.789-09. Telefone (11) 99999-1234. E-mail teste@example.com.'
 t=time.perf_counter();r=engine.review(text);times.append(time.perf_counter()-t)
 utf=lambda x:len(x.encode('utf-16-le'))//2
 covered=set(k for f in r['findings'] for k in range(f['start'],f['end']))
 for kind,value in [('nome',name),('cpf','123.456.789-09'),('telefone','(11) 99999-1234'),('email','teste@example.com')]:
  start=text.index(value);wanted={utf(text[:start+j]) for j,c in enumerate(value) if c.isalnum()};categories[kind]['expected']+=1;categories[kind]['fullyCovered']+=int(wanted<=covered)
 start=text.index('54 anos');end=text.index(' CPF');damaged+=int(bool(covered&set(range(utf(text[:start]),utf(text[:end])))))
report={'synthetic':True,'cases':100,'model':'OpenMed/OpenMed-PII-Portuguese-BioClinicalBERT-Base-110M-v1','revision':'3252a8885fefc2490a124c2be7ed7bce40088326','categories':categories,'casesWithClinicalSpanFlagged':damaged,'firstCallSeconds':times[0],'warmP50Seconds':statistics.median(times[1:]),'warmP95Seconds':sorted(times[1:])[93],'limitations':'Synthetic templated smoke test only. Same narrow templates; not independently adjudicated, not evidence of production privacy or clinical performance.'}
Path(a.output).write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
