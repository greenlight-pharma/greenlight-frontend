"""OpenMed pilot. Only caller-provisioned local weights; no automatic downloads."""
import os,json,hashlib
from pathlib import Path
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
import torch
from openmed import extract_pii, OpenMedConfig
# Clinical age/sex, dose, durations must not be indiscriminately removed.
SENSITIVE={'NAME','FIRSTNAME','LASTNAME','MIDDLENAME','PERSON','PATIENT','PHONE','EMAIL','ADDRESS','STREET','BUILDINGNUMBER','ZIPCODE','POSTCODE','SSN','ID','ID_NUM','NATIONAL_ID','IDCARD','DRIVERLICENSE','PASSPORT','CPF','CNPJ','MEDICALRECORD','MEDICAL_RECORD_NUMBER','DATEOFBIRTH','DOB','USERNAME','ACCOUNTNAME','CREDITCARD','BANKACCOUNT','IBAN','GPSCOORDINATES'}
class Engine:
 def __init__(self, model_dir):
  self.path=Path(model_dir).resolve()
  if not (self.path/'config.json').is_file() or not list(self.path.glob('*.safetensors')): raise ValueError('Provision local safetensors weights first')
  manifest=json.loads((self.path/'wmed-integrity.json').read_text())
  if manifest['revision']!='3252a8885fefc2490a124c2be7ed7bce40088326':raise ValueError('Unexpected model revision')
  for name,expected in manifest['files'].items():
   if Path(name).name!=name or hashlib.sha256((self.path/name).read_bytes()).hexdigest()!=expected:raise ValueError('Model integrity failed')
  torch.set_num_threads(4)
 def review(self,text):
  if not isinstance(text,str) or not 3<=len(text)<=6000: raise ValueError('Text length must be 3–6000')
  result=extract_pii(text,model_name=str(self.path),lang='pt',locale='pt_BR',config=OpenMedConfig(device='cpu'),confidence_threshold=.5,cache_results=False)
  findings=[]
  for e in result.entities:
   label=e.label.upper().removeprefix('B-').removeprefix('I-')
   if label in SENSITIVE and 0<=e.start<e.end<=len(text): findings.append({'start':len(text[:e.start].encode('utf-16-le'))//2,'end':len(text[:e.end].encode('utf-16-le'))//2,'label':label,'confidence':float(e.confidence)})
  return {'engine':'openmed','model':'OpenMed-PII-Portuguese-BioClinicalBERT-Base-110M-v1','findings':findings,'reviewRequired':True}
