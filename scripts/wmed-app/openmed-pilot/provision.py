"""Run only during provisioning; runtime is offline. Downloads pinned public weights."""
import sys,json,hashlib
from pathlib import Path
from huggingface_hub import snapshot_download
REPO='OpenMed/OpenMed-PII-Portuguese-BioClinicalBERT-Base-110M-v1'
REVISION='3252a8885fefc2490a124c2be7ed7bce40088326'
p=Path(sys.argv[1]);snapshot_download(REPO,revision=REVISION,local_dir=p,allow_patterns=['*.json','*.txt','*.safetensors','README.md','LICENSE'])
files={f.name:hashlib.sha256(f.read_bytes()).hexdigest()for f in p.iterdir()if f.is_file()and f.name!='wmed-integrity.json'}
(p/'wmed-integrity.json').write_text(json.dumps({'model':REPO,'revision':REVISION,'files':files},indent=2))
print('Pinned model and integrity manifest ready.')
