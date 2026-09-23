"""Extract smooth, exam-aligned surfaces from public VYTALVOL label maps.
Coordinates exactly match Scene.tsx: (x*sx, z*sz, -y*sy), centered on voxel grid.
Requires numpy scipy scikit-image trimesh. CC BY 4.0 source retained in metadata.
"""
from pathlib import Path
import gzip,json,struct,urllib.request,hashlib
import numpy as np
from scipy.ndimage import gaussian_filter
from skimage.measure import marching_cubes
import trimesh
out=Path(__file__).resolve().parents[2]/'public/radiology';out.mkdir(exist_ok=True)
for region in ['torax','abdome','cabeca']:
 url=f'https://app.vytalsaude.com.br/academico-assets/{region}.vytalvol'
 raw=urllib.request.urlopen(url,timeout=60).read();b=gzip.decompress(raw);length=struct.unpack('<I',b[8:12])[0];meta=json.loads(b[12:12+length]);nx,ny,nz=meta['dims'];sx,sy,sz=meta['spacing'];n=nx*ny*nz
 labels=np.frombuffer(b,dtype=np.uint8,offset=12+length+n*2).reshape((nz,ny,nx));scene=trimesh.Scene();counts=[]
 for part in meta['estruturas']:
  mask=(labels==part['id']);
  if mask.sum()<8:continue
  field=gaussian_filter(np.pad(mask.astype(np.float32),1),.65)
  if field.max()<.5:continue
  v,f,_,_=marching_cubes(field,.5,spacing=(sz,sy,sx),step_size=1,allow_degenerate=False)
  v-=np.array([sz,sy,sx]);v=np.stack([v[:,2]-(nx-1)*sx/2,v[:,0]-(nz-1)*sz/2,-v[:,1]+(ny-1)*sy/2],axis=1)
  color=part['cor'].lstrip('#');channels=np.array(list(bytes.fromhex(color)))/255;linear=np.where(channels<=.04045,channels/12.92,((channels+.055)/1.055)**2.4);rgba=list(np.round(linear*255).astype(int))+[255]
  mesh=trimesh.Trimesh(v,f,process=False)
  if len(f)>1200:mesh=mesh.simplify_quadric_decimation(face_count=max(1200,int(len(f)*.35)))
  mesh.visual=trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(baseColorFactor=rgba,roughnessFactor=.78,metallicFactor=0))
  scene.add_geometry(mesh,node_name=f"structure_{part['id']}",geom_name=f"structure_{part['id']}");counts.append(dict(id=part['id'],name=part['nome'],triangles=len(mesh.faces)))
 path=out/f'{region}.glb';scene.export(path)
 (out/f'{region}.json').write_text(json.dumps(dict(source=url,sourceSHA256=hashlib.sha256(raw).hexdigest(),license='CC BY 4.0',structures=counts,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),method='Gaussian sigma .65 voxels + marching cubes .5, quadric decimation 35%; linear RGB materials; surfaces aligned to source grid, no atlas registration'),ensure_ascii=False,indent=2))
 print(region,len(counts),path.stat().st_size,flush=True)
