"""Precompute an educational DRR laboratory from a licensed, paired CT/labels.
No XVR model training, inference or patient uploads. CPU-only DiffDRR.
"""
from pathlib import Path
import argparse,hashlib,json,math,time
import numpy as np
import pyvista as pv
import torch,torchio as tio,trimesh
from diffdrr.data import read
from diffdrr.drr import DRR
from diffdrr.pose import RigidTransform
from scipy import ndimage
from skimage.measure import marching_cubes
from PIL import Image
P=argparse.ArgumentParser();P.add_argument('--source',type=Path,required=True);P.add_argument('--angles',default='0,15,30,45,60,75,90');P.add_argument('--size',type=int,default=384);args=P.parse_args()
OUT=Path(__file__).resolve().parents[2]/'public/xray/pelvis';OUT.mkdir(parents=True,exist_ok=True)
torch.set_num_threads(4)
parts=[('hip_left','Osso do quadril esquerdo','Observe o contorno do acetábulo e a asa do ílio.','#d9d0bc'),('hip_right','Osso do quadril direito','Compare os lados na incidência frontal.','#d9d0bc'),('sacrum','Sacro','Na vista frontal, o sacro se projeta entre os ossos do quadril.','#c5b794'),('femur_left','Fêmur esquerdo · proximal','Localize a cabeça e o colo do fêmur neste recorte.','#efe4cc'),('femur_right','Fêmur direito · proximal','Observe como a projeção muda ao variar a incidência.','#efe4cc')]
mb=pv.read(args.source);ct=mb['ct'];spacing=np.array(ct.spacing);dims=tuple(ct.dimensions)
assert np.allclose(ct.direction_matrix,np.eye(3)), 'Review source orientation'
hu=np.array(ct.active_scalars).reshape(dims,order='F').astype(np.float32);labels=np.zeros(dims,np.int16)
for i,(key,*_)in enumerate(parts,1):labels[np.asarray(mb['segmentations'][key].active_scalars).reshape(dims,order='F')>0]=i
# Crop to this acquisition's pelvic region. Inferior source already truncates proximal femora.
zmax=min(int(np.argwhere(labels>0)[:,2].max())+6,dims[2]);hu=hu[:,:,:zmax];labels=labels[:,:,:zmax]
body,n=ndimage.label(hu>-450);sizes=np.bincount(body.ravel());sizes[0]=0;body=body==sizes.argmax()
for z in range(body.shape[2]):body[:,:,z]=ndimage.binary_fill_holes(body[:,:,z])
body=ndimage.binary_dilation(body,iterations=2);hu[~body]=-1000
ix=np.argwhere(body);lo=ix.min(0);hi=ix.max(0)+1;lo[2]=0;hi[2]=zmax
sl=tuple(slice(int(a),int(b))for a,b in zip(lo,hi));hu=np.clip(hu[sl],-1000,3000).copy();labels=labels[sl].copy()
affine=np.diag([*spacing,1.]);affine[:3,3]=-(np.array(hu.shape)-1)*spacing/2
subject=read(tio.ScalarImage(tensor=torch.from_numpy(hu[None]),affine=affine),tio.LabelMap(tensor=torch.from_numpy(labels[None]),affine=affine),orientation=None,center_volume=False)
# Match voxel-centered geometry in DRR to mesh extraction.
scene=trimesh.Scene();partmeta=[]
for i,(key,name,hint,color)in enumerate(parts,1):
 mask=np.pad((labels==i).astype(np.float32),1);verts,faces,_,_=marching_cubes(mask,.5,spacing=spacing)
 verts=verts-spacing+affine[:3,3]
 # RAS -> Three.js: (R,S,-A), an orientation-preserving rotation.
 verts=np.stack([verts[:,0],verts[:,2],-verts[:,1]],axis=1)
 mesh=trimesh.Trimesh(verts,faces,process=False);mesh.visual=trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(baseColorFactor=[*bytes.fromhex(color[1:]),255],roughnessFactor=.64,metallicFactor=0))
 scene.add_geometry(mesh,node_name=key,geom_name=key)
 partmeta.append(dict(id=key,label=i,bit=1<<(i-1),name=name,hint=hint,color=color,vertices=len(verts),triangles=len(faces)))
scene.export(OUT/'pelvis.glb')
H=args.size;sdd=1100.;sid=720.;pixel=1.9*(384/H)
drr=DRR(subject,sdd=sdd,height=H,delx=pixel,patch_size=32,renderer='siddon',reverse_x_axis=True,voxel_shift=0.5).to('cpu')
records=[]
for angle in map(int,args.angles.split(',')):
 a=math.radians(angle);u=np.array([math.cos(a),math.sin(a),0]);v=np.array([0,0,1]);w=np.cross(u,v);source=-sid*w
 matrix=np.eye(4,dtype=np.float32);matrix[:3,:3]=np.stack([u,v,w],axis=1);matrix[:3,3]=source
 pose=RigidTransform(torch.tensor(matrix));start=time.monotonic()
 with torch.inference_mode():channels=drr(pose,mask_to_channels=True)[0].cpu().numpy()
 raw=channels.sum(0);values=raw[raw>0];high=float(np.percentile(values,99.6));image=(np.clip(raw/max(high,1e-6),0,1)**.8*255).astype(np.uint8)
 bits=np.zeros((H,H),np.uint8)
 for i in range(1,6):bits[channels[i]>.1]|=1<<(i-1)
 imagepath=f'rx-{angle:03}.webp';maskpath=f'mask-{angle:03}.png';Image.fromarray(image).save(OUT/imagepath,quality=94);Image.fromarray(bits).save(OUT/maskpath)
 # Persist actual detector corners from the SAME rendering transform for QA and UI.
 with torch.inference_mode():src,tgt=drr.detector(pose,None)
 t=tgt[0].numpy();corners=t[[0,H-1,H*(H-1),H*H-1]].tolist()
 records.append(dict(angle=angle,image=imagepath,mask=maskpath,sourceRAS=source.tolist(),detectorCornersRAS=corners,pose=matrix.tolist(),seconds=round(time.monotonic()-start,3),projectionMax=high))
 print('DRR',angle,records[-1]['seconds'],flush=True)
metadata=dict(version=1,title='Pelve · radiografia em 3D',kind='DRR simulada a partir de TC',renderer='DiffDRR 0.6.0 / Siddon / CPU',size=H,sdd=sdd,sid=sid,pixelSpacing=pixel,coordinateSystem='RAS, centralizado; Three.js=(R,S,-A)',affineRAS=affine.tolist(),sourceCropStart=lo.tolist(),cropShape=list(hu.shape),spacing=spacing.tolist(),source='TotalSegmentator v2.0.1 · s1397 · reamostrado pelo PyVista',license='CC BY 4.0',sourceUrl='https://zenodo.org/records/10047292',licenseUrl='https://creativecommons.org/licenses/by/4.0/',citation='Wasserthal et al. TotalSegmentator: Robust Segmentation of 104 Anatomic Structures in CT Images. 2023. doi:10.1148/ryai.230024',limitations='Recorte pélvico de TC reamostrada em cerca de 3 mm. Fêmures e limites inferiores parcialmente incluídos. Segmentações de referência, sem revisão anatômica independente nesta demonstração. Projeção de atenuação simplificada; não reproduz todos os efeitos de uma radiografia adquirida.',parts=partmeta,views=records,generatorSHA256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
metadata['files']={p.name:hashlib.sha256(p.read_bytes()).hexdigest()for p in OUT.iterdir()if p.suffix in ['.glb','.webp','.png']}
(OUT/'catalog.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
