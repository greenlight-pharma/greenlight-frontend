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
P=argparse.ArgumentParser();P.add_argument('--source',type=Path,required=True);P.add_argument('--angles',default='0,15,30,45,60,75,90');P.add_argument('--size',type=int,default=384);P.add_argument('--region',choices=['torax','abdome','lombar'],required=True);args=P.parse_args()
OUT=Path(__file__).resolve().parents[2]/'public/xray'/args.region;OUT.mkdir(parents=True,exist_ok=True)
torch.set_num_threads(4)
# Each entry is a selectable union of non-overlapping source segmentations.
if args.region=='torax':
 title='Tórax';bounds=['lung_upper_lobe_left','lung_lower_lobe_left','lung_upper_lobe_right','lung_lower_lobe_right'];challenge='heart'
 parts=[('lung_left','Pulmão esquerdo','Observe a projeção do pulmão esquerdo e sua sobreposição ao coração.','#78a6b5',['lung_upper_lobe_left','lung_lower_lobe_left'],.28),('lung_right','Pulmão direito','Compare a extensão dos campos pulmonares entre incidências.','#819bb7',['lung_upper_lobe_right','lung_middle_lobe_right','lung_lower_lobe_right'],.28),('heart','Coração','Observe como a projeção cardíaca muda com o ângulo. Não use esta simulação para medir cardiomegalia.','#b05e63',['heart'],1),('ribs','Costelas','A projeção sobrepõe arcos costais anteriores e posteriores.','#d9d0bc',[f'rib_{side}_{n}' for side in ['left','right'] for n in range(1,13)],1),('thoracic_spine','Coluna torácica','No perfil, compare os corpos vertebrais com a projeção frontal.','#dfd4b9',[f'vertebrae_T{n}' for n in range(1,13)],1),('sternum','Esterno','Observe sua posição anterior na vista de perfil.','#e6d9be',['sternum'],1),('trachea','Traqueia','O destaque vem da segmentação da TC, não de uma detecção na radiografia.','#b4c9bb',['trachea'],1)]
elif args.region=='abdome':
 title='Abdome';bounds=['liver','spleen','kidney_left','kidney_right','hip_left','hip_right'];challenge='kidney_right'
 parts=[('liver','Fígado','Compare a projeção do fígado com a do rim direito. O contorno é fornecido pela TC.','#a76950',['liver'],.6),('spleen','Baço','Localize o baço à esquerda. Seu destaque não significa que seja distinguível isoladamente no RX.','#96718a',['spleen'],1),('kidney_left','Rim esquerdo','Compare a posição dos rins nesta aquisição. Os contornos vêm da TC.','#b86360',['kidney_left'],1),('kidney_right','Rim direito','Observe sua sobreposição ao fígado na projeção frontal.','#b86360',['kidney_right'],1),('lumbar_spine','Coluna lombar','Identifique a projeção dos corpos vertebrais lombares.','#dfd4b9',[f'vertebrae_L{n}' for n in range(1,6)],1),('pelvis','Ossos da pelve','Observe a pelve na parte inferior deste recorte.','#d9d0bc',['hip_left','hip_right','sacrum'],1),('aorta','Aorta no recorte','A máscara delimita a segmentação da TC; não implica visibilidade da aorta no RX simples.','#b55d5b',['aorta'],1)]
else:
 title='Coluna lombar';bounds=[f'vertebrae_L{n}' for n in range(1,6)]+['sacrum'];challenge='vertebrae_L3'
 parts=[(f'vertebrae_L{n}',f'Vértebra L{n}',f'Compare o corpo vertebral de L{n} na incidência frontal e no perfil.','#d7c8aa',[f'vertebrae_L{n}'],1) for n in range(1,6)]+[('sacrum','Sacro','Observe a relação do sacro com a vértebra L5.','#b9ab93',['sacrum'],1)]
mb=pv.read(args.source);ct=mb['ct'];spacing=np.array(ct.spacing);dims=tuple(ct.dimensions)
assert np.allclose(ct.direction_matrix,np.eye(3)), 'Review source orientation'
hu=np.array(ct.active_scalars).reshape(dims,order='F').astype(np.float32);labels=np.zeros(dims,np.int16)
for i,(_,_,_,_,keys,_)in enumerate(parts,1):
 for key in keys:labels[np.asarray(mb['segmentations'][key].active_scalars).reshape(dims,order='F')>0]=i
extent=np.zeros(dims,bool)
for key in bounds:extent|=np.asarray(mb['segmentations'][key].active_scalars).reshape(dims,order='F')>0
zi=np.argwhere(extent)[:,2];zmin=max(0,int(zi.min())-8);zmax=min(dims[2],int(zi.max())+9)
hu=hu[:,:,zmin:zmax];labels=labels[:,:,zmin:zmax]
body,n=ndimage.label(hu>-450);sizes=np.bincount(body.ravel());sizes[0]=0;body=body==sizes.argmax()
for z in range(body.shape[2]):body[:,:,z]=ndimage.binary_fill_holes(body[:,:,z])
body=ndimage.binary_dilation(body,iterations=2);hu[~body]=-1000
ix=np.argwhere(body);lo=ix.min(0);hi=ix.max(0)+1;lo[2]=0;hi[2]=hu.shape[2]
sl=tuple(slice(int(a),int(b))for a,b in zip(lo,hi));hu=np.clip(hu[sl],-1000,3000).copy();labels=labels[sl].copy()
affine=np.diag([*spacing,1.]);affine[:3,3]=-(np.array(hu.shape)-1)*spacing/2
subject=read(tio.ScalarImage(tensor=torch.from_numpy(hu[None]),affine=affine),tio.LabelMap(tensor=torch.from_numpy(labels[None]),affine=affine),orientation=None,center_volume=False)
# Match voxel-centered geometry in DRR to mesh extraction.
scene=trimesh.Scene();partmeta=[]
for i,(key,name,hint,color,keys,opacity)in enumerate(parts,1):
 mask=np.pad((labels==i).astype(np.float32),1);mask=ndimage.gaussian_filter(mask,.55);verts,faces,_,_=marching_cubes(mask,.5,spacing=spacing)
 verts=verts-spacing+affine[:3,3]
 # RAS -> Three.js: (R,S,-A), an orientation-preserving rotation.
 verts=np.stack([verts[:,0],verts[:,2],-verts[:,1]],axis=1)
 mesh=trimesh.Trimesh(verts,faces,process=False);mesh.visual=trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(baseColorFactor=[*bytes.fromhex(color[1:]),255],roughnessFactor=.64,metallicFactor=0))
 scene.add_geometry(mesh,node_name=key,geom_name=key)
 partmeta.append(dict(id=key,label=i,bit=1<<(i-1),name=name,hint=hint,color=color,vertices=len(verts),triangles=len(faces),opacity=opacity,sourceLabels=keys))
scene.export(OUT/'anatomy.glb')
H=args.size;sdd=1100.;sid=720.;pixel=(2.2 if args.region=='abdome' else 1.9)*(384/H)
drr=DRR(subject,sdd=sdd,height=H,delx=pixel,patch_size=32,renderer='siddon',reverse_x_axis=True,voxel_shift=0.5).to('cpu')
records=[]
for angle in map(int,args.angles.split(',')):
 a=math.radians(angle);u=np.array([math.cos(a),math.sin(a),0]);v=np.array([0,0,1]);w=np.cross(u,v);source=-sid*w
 matrix=np.eye(4,dtype=np.float32);matrix[:3,:3]=np.stack([u,v,w],axis=1);matrix[:3,3]=source
 pose=RigidTransform(torch.tensor(matrix));start=time.monotonic()
 with torch.inference_mode():channels=drr(pose,mask_to_channels=True)[0].cpu().numpy()
 raw=channels.sum(0);values=raw[raw>0];high=float(np.percentile(values,99.6));image=(np.clip(raw/max(high,1e-6),0,1)**.8*255).astype(np.uint8)
 bits=np.zeros((H,H),np.uint8)
 for i in range(1,len(parts)+1):bits[channels[i]>.1]|=1<<(i-1)
 imagepath=f'rx-{angle:03}.webp';maskpath=f'mask-{angle:03}.png';Image.fromarray(image).save(OUT/imagepath,quality=94);Image.fromarray(bits).save(OUT/maskpath)
 # Persist actual detector corners from the SAME rendering transform for QA and UI.
 with torch.inference_mode():src,tgt=drr.detector(pose,None)
 t=tgt[0].numpy();corners=t[[0,H-1,H*(H-1),H*H-1]].tolist()
 records.append(dict(angle=angle,image=imagepath,mask=maskpath,sourceRAS=source.tolist(),detectorCornersRAS=corners,pose=matrix.tolist(),seconds=round(time.monotonic()-start,3),projectionMax=high))
 print('DRR',angle,records[-1]['seconds'],flush=True)
metadata=dict(version=1,title=title+' · radiografia em 3D',regionTitle=title,model='anatomy.glb',displayZoom=1 if args.region=='abdome' else 1.15,challenge=challenge,kind='DRR simulada a partir de TC',renderer='DiffDRR 0.6.0 / Siddon / CPU',size=H,sdd=sdd,sid=sid,pixelSpacing=pixel,coordinateSystem='RAS, centralizado; Three.js=(R,S,-A)',affineRAS=affine.tolist(),sourceCropStart=(lo+np.array([0,0,zmin])).tolist(),cropShape=list(hu.shape),spacing=spacing.tolist(),source='TotalSegmentator v2.0.1 · s1397 · reamostrado pelo PyVista',license='CC BY 4.0',sourceUrl='https://zenodo.org/records/10047292',licenseUrl='https://creativecommons.org/licenses/by/4.0/',citation='Wasserthal et al. TotalSegmentator: Robust Segmentation of 104 Anatomic Structures in CT Images. 2023. doi:10.1148/ryai.230024',limitations='Recorte regional de TC reamostrada em cerca de 3 mm; estruturas podem terminar nos limites do recorte. As máscaras dos órgãos são derivadas da TC e não indicam que cada órgão seja distinguível no RX simples. Segmentações de referência, sem revisão anatômica independente nesta demonstração. Projeção de atenuação simplificada; não reproduz todos os efeitos de uma radiografia adquirida.',parts=partmeta,views=records,generatorSHA256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
metadata['files']={p.name:hashlib.sha256(p.read_bytes()).hexdigest()for p in OUT.iterdir()if p.suffix in ['.glb','.webp','.png']}
(OUT/'catalog.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
