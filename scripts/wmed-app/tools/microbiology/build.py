"""Original WMed didactic microbial meshes. Run with Blender --background --python build.py.
Geometry/textures are authored here; references inform morphology, not copied assets.
"""
import bpy, math, random, json, sys, hashlib
from pathlib import Path
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).parent))
from kit import Kit,clear,inspect_glb
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/microbiology'
CAT=json.loads((OUT/'catalog.json').read_text())
TAU=2*math.pi
class Model:
 def __init__(self,cell,cut,out):self.c=cell;self.cut=cut;self.k=Kit(cell,out);self.r=random.Random(cell['id']);self.ids={p['id'] for p in cell['parts']}
 def ell(self,part,center=(0,0,0),r=(1,1,1),cut=False,shape=None,detail=24):
  rows,cols=detail,detail*2;start,end=(-math.pi/6,7*math.pi/6) if cut else (0,TAU)
  def point(t,phi,scale):
   z=math.cos(t);rr=math.sin(t);x=rr*math.cos(phi);y=rr*math.sin(phi)
   if shape=='rod':z=z*.42+(.58 if z>=0 else -.58)
   if shape=='pear':x*=.78+.3*z;y*=.78+.3*z
   if shape=='amoeba':rr=1+.19*math.sin(3*phi+z*2)+.12*math.cos(5*phi-z);x*=rr;y*=rr
   v=[x*r[0]*scale,y*r[1]*scale,z*r[2]*scale]
   if shape=='curve':v[0]+=.5*(1-z*z)
   if shape=='tryp':v[0]+=.38*math.sin(z*3.8)
   return tuple(v[j]+center[j] for j in range(3))
  verts=[]
  for scale in ([1,.96] if cut else [1]):
   for i in range(rows+1):
    for j in range(cols+1):verts.append(point(math.pi*i/rows,start+(end-start)*j/cols,scale))
  faces=[];n=(rows+1)*(cols+1)
  for layer in range(2 if cut else 1):
   for i in range(rows):
    for j in range(cols):
     a=layer*n+i*(cols+1)+j;f=(a,a+1,a+cols+2,a+cols+1);faces.append(f if layer==0 else tuple(reversed(f)))
  if cut:
   for i in range(rows):
    for j in [0,cols]:
     a=i*(cols+1)+j;b=a+cols+1;faces.append((a,b,b+n,a+n))
  return self.k.mesh(part,verts,faces)
 def tube(self,part,points,radius=.035,sides=10):
  verts=[];faces=[]
  for i,p in enumerate(points):
   tangent=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(i-1,0)]);tangent.normalize();u=tangent.cross(Vector((0,1,0)) if abs(tangent.y)<.9 else Vector((1,0,0))).normalized();v=tangent.cross(u)
   rad=radius[i] if isinstance(radius,list) else radius
   for j in range(sides):verts.append(tuple(Vector(p)+rad*(u*math.cos(TAU*j/sides)+v*math.sin(TAU*j/sides))))
  for i in range(len(points)-1):
   for j in range(sides):a=i*sides+j;b=i*sides+(j+1)%sides;faces.append((a,b,b+sides,a+sides))
  faces.extend([tuple(range(sides-1,-1,-1)),tuple((len(points)-1)*sides+j for j in range(sides))]);return self.k.mesh(part,verts,faces)
 def coil(self,part,center,r=.35,length=1,turns=4,phase=0,axis='z',radius=.035):
  pts=[]
  for i in range(140):
   t=i/139;a=TAU*turns*t+phase;p=[r*math.cos(a),r*math.sin(a),length*(t-.5)]
   if axis=='x':p=[p[2],p[1],p[0]]
   pts.append(tuple(center[j]+p[j] for j in range(3)))
  self.tube(part,pts,radius)
 def dots(self,part,count,radii,center=(0,0,0),size=.045):
  for i in range(count):
   while True:
    p=[self.r.uniform(-1,1) for _ in range(3)]
    if sum(x*x for x in p)<.82:break
   self.ell(part,tuple(center[j]+p[j]*radii[j] for j in range(3)),(size,size*.85,size),detail=6)
 def bacteria(self):
  shape=self.c['shape'];rod=shape in ['bacillus','vibrio','polar-rod'];r=(.55,.55,1.15) if rod else (.72,.72,.72);sh='curve' if shape=='vibrio' else 'rod' if rod else None
  layers=['externa','parede','membrana','citoplasma'] if 'externa'in self.ids else ['parede','membrana','citoplasma']
  for i,p in enumerate(layers):self.ell(p,r=tuple(v*(1-([0,.15,.21][i] if len(layers)==3 else i*.06)) for v in r),shape=sh,cut=self.cut)
  if shape=='diplococcus':
   self.ell('capsula-bacteriana',r=(.83,.83,.83),cut=self.cut);self.ell('parede',(0,0,1.35),(.65,.65,.72));self.ell('capsula-bacteriana',(0,0,1.35),(.75,.75,.83))
  if shape=='polar-rod':self.tube('flagelo',[(.12+.19*math.sin(i/9),.12*math.cos(i/9),1.10+i/40)for i in range(85)],.018)
  self.coil('nucleoide',(.16 if sh=='curve' else 0,0,0),r=.20,length=1.25 if rod else .7,turns=4,radius=.03)
  self.dots('ribossomos',55,(.36,.36,.76) if rod else (.5,.5,.5),size=.026)
  if shape=='bacillus':
   for n in range(5):
    a=n*TAU/5;z=-.65+n*.30;self.tube('flagelo',[((.52+1.2*t)*math.cos(a)+.10*math.sin(t*11)*t,(.52+1.2*t)*math.sin(a)+.10*math.cos(t*11)*t,z+.7*t*math.cos(n))for t in [i/59 for i in range(60)]],.016)
   for n in range(48):
    a=n*2.399;z=self.r.uniform(-.7,.7);self.tube('pili',[(.55*math.cos(a),.55*math.sin(a),z),(.76*math.cos(a),.76*math.sin(a),z+.11)],.012,6)
  if shape=='vibrio':self.tube('flagelo',[(.12+.19*math.sin(i/9),.12*math.cos(i/9),1.10+i/40)for i in range(85)],.018)
  if shape=='cluster':
   for p in [(-1,.35,0),(-.6,.5,1.05),(.55,.7,.9),(.85,.4,-.7),(-.5,.8,-1.0)]:self.ell('parede',p,(.61,.61,.61),detail=18)
  if shape=='chain':
   for n in [-2,-1,1,2]:self.ell('parede',(n*1.28,.25*math.sin(n),.2*math.cos(n)),(.65,.65,.65),detail=18)
 def spikes(self,part,count,r=1.04):
  for n in range(count):
   z=1-2*(n+.5)/count;a=n*2.399963;v=Vector((math.sqrt(1-z*z)*math.cos(a),math.sqrt(1-z*z)*math.sin(a),z))
   if self.cut and v.y<-.45:continue
   self.tube(part,[v*r,v*(r+.17)],.025,8)
   head=v*(r+.21);self.ell(part,head,(.077,.077,.077),detail=7)
 def virus(self):
  sh=self.c['shape']
  if sh=='adeno':
   bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1.08);obj=bpy.context.object;verts=[v.co.copy() for v in obj.data.vertices];faces=[tuple(p.vertices) for p in obj.data.polygons];bpy.data.objects.remove(obj,do_unlink=True)
   kept=[f for f in faces if not self.cut or sum(verts[i].y for i in f)/3>-.35];self.k.mesh('capsideo',verts,kept)
   for v in verts:
    if self.cut and v.y<-.45:continue
    n=v.normalized();self.tube('fibras',[v,n*1.42],.022);self.ell('fibras',n*1.45,(.065,.065,.065),detail=7)
   for phase in [0,math.pi]:self.coil('genoma',(0,0,0),r=.37,length=1.3,turns=5,phase=phase,radius=.025)
   return
  self.ell('envelope',cut=self.cut,detail=32);self.spikes('espiculas',16 if sh=='hiv' else 65 if sh=='corona' else 110)
  if sh in ['herpes','hbv']:
   if sh=='herpes':self.ell('tegumento',r=(.9,.9,.9),cut=self.cut)
   bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.76);obj=bpy.context.object;verts=[v.co.copy()for v in obj.data.vertices];faces=[tuple(p.vertices)for p in obj.data.polygons];bpy.data.objects.remove(obj,do_unlink=True)
   self.k.mesh('capsideo',verts,[f for f in faces if not self.cut or sum(verts[i].y for i in f)/3>-.2])
   if sh=='herpes':
    for phase in [0,math.pi]:self.coil('genoma',(0,0,0),r=.28,length=.9,turns=5,phase=phase,radius=.023)
   else:
    for phase,end in [(0,TAU),(.09,TAU*.7)]:self.tube('genoma',[((.40+phase)*math.cos(t),(.40+phase)*math.sin(t),.05*math.sin(t*4))for t in [end*i/99 for i in range(100)]],.026)
  if sh=='corona':
   self.coil('nucleocapsideo',(0,0,0),r=.48,length=1.25,turns=6,radius=.055)
  if sh=='influenza':
   self.ell('matriz',r=(.92,.92,.92),cut=self.cut)
   for n in range(8):
    a=n*TAU/7;r=0 if n==7 else .42;self.coil('nucleocapsideo',(r*math.cos(a),r*math.sin(a),0),r=.055,length=1.22-(n%3)*.12,turns=8,radius=.035)
  if sh=='hiv':
   verts=[];faces=[];cols=60;start,end=(-math.pi/6,7*math.pi/6)if self.cut else(0,TAU)
   for i in range(25):
    z=-.62+i/24*1.24;r=.49-(z+.62)*.29
    for j in range(cols+1):a=start+(end-start)*j/cols;verts.append((r*math.cos(a),r*math.sin(a),z))
   for i in range(24):
    for j in range(cols):a=i*(cols+1)+j;faces.append((a,a+1,a+cols+2,a+cols+1))
   self.k.mesh('capsideo',verts,faces)
   for n in range(2):self.coil('genoma',((n-.5)*.15,0,-.16),r=.085,length=.78,turns=5,phase=n*2,radius=.023)
 def yeast(self):
  sh=self.c['shape'];r=(.8,.7,1)
  layers=['capsula','parede','membrana','citoplasma']if sh=='crypto'else['parede','membrana','citoplasma']
  for i,p in enumerate(layers):self.ell(p,r=tuple(v*(1.15 if p=='capsula'else 1-(i-(1 if sh=='crypto' else 0))*.065)for v in r),cut=self.cut)
  self.ell('nucleo',(-.27,-.11,.22),(.25,.24,.28));self.ell('vacuolo',(.26,-.13,-.2),(.29,.30,.32))
  if sh=='para':
   for n in range(7):
    a=n*TAU/7;self.ell('broto',(1.05*math.cos(a),.15,1.18*math.sin(a)),(.28,.26,.30));self.tube('broto',[(.73*math.cos(a),.15,.88*math.sin(a)),(1.05*math.cos(a),.15,1.18*math.sin(a))],.09)
  else:
   self.ell('broto',(.70,0,.86),(.22,.20,.25)if sh=='histo'else(.38,.34,.43));self.tube('broto',[(.47,0,.66),(.72,0,.90)],.075 if sh=='histo'else .12 if sh=='crypto'else.20)
  if 'mitocondrias'in self.ids:
   for x,y,z in [(-.3,0,-.55),(.26,.1,.5),(0,-.26,-.1)]:self.ell('mitocondrias',(x,y,z),(.10,.08,.21),detail=12)
 def mold(self):
  sh=self.c['shape'];self.tube('hifas',[(-1.2,0,-1.2),(0,0,-1.05),(1.2,.1,-1.16)],.11)
  self.tube('hifas',[(0,0,-1.05),(.38,.1,-.7),(.6,.18,-.35)],.09)
  self.tube('conidioforo',[(0,0,-1.05),(0,0,0),(0,0,.7)],.09)
  if sh=='aspergillus':
   for x in [-.8,-.4,.3,.7]:self.ell('septos',(x,-.005,-1.13),(.018,.117,.117),detail=10)
   self.ell('vesicula',(0,0,.83),(.32,.32,.34),detail=24)
   for n in range(64):
    z=-.2+1.2*(n+.5)/64;a=n*2.399963;v=Vector((math.sqrt(1-z*z)*math.cos(a),math.sqrt(1-z*z)*math.sin(a),z));base=Vector((0,0,.83))
    self.tube('fialides',[base+v*.30,base+v*.48],.038)
    for k in range(4):self.ell('conidios',base+v*(.55+k*.115),(.063,.063,.07),detail=7)
  else:
   self.ell('esporangio',(0,0,.95),(.68,.68,.68),cut=self.cut)
   self.ell('columela',(0,0,.67),(.29,.29,.34));self.dots('esporos',100,(.52,.52,.52),(0,0,.99),.041)
   for n in range(8):
    a=TAU*n/8;self.tube('rizoides',[(0,0,-1.05),(.35*math.cos(a),.35*math.sin(a),-1.43),(.65*math.cos(a),.65*math.sin(a),-1.60)],.025)
 def proto(self):
  sh=self.c['shape']
  if sh in ['leish','tricho']:
   r=(.36,.32,1.2)if sh=='leish'else(.68,.46,1.05)
   for n,p in enumerate(['membrana','citoplasma']):self.ell(p,r=tuple(v*(1-.07*n)for v in r),cut=self.cut,shape='pear'if sh=='tricho'else None)
   self.ell('nucleo',(0,-.10,.25),(.21,.18,.28))
   if sh=='leish':
    self.ell('cinetoplasto',(0,-.13,.82),(.09,.06,.10));self.tube('flagelo',[(.12*math.sin(t*4),.06*math.cos(t*3),1+t)for t in[i/40 for i in range(65)]],.02)
   else:
    for n in range(4):self.tube('flagelo',[(.08*n+t*(n-1.5)*.24,.09*math.sin(t*5+n),.92+t)for t in[i/40 for i in range(48)]],.018)
    self.tube('axostilo',[(.02,0,.8),(.03,0,-1.42)],.036);self.dots('hidrogenossomos',12,(.45,.28,.7),size=.065)
    edge=[(.48+.1*math.sin(t*15),0,.85-t*1.2)for t in[i/49 for i in range(50)]];self.tube('flagelo',edge,.018)
    verts=[]
    for x,y,z in edge:verts.extend([(.38,0,z),(x,y,z)])
    self.k.mesh('ondulante',verts,[(2*i,2*i+1,2*i+3,2*i+2)for i in range(49)])
   return
  r={'giardia':(.85,.42,1.15),'toxo':(.42,.38,1.22),'tryp':(.25,.28,1.5),'amoeba':(1,.75,.85)}[sh];shape={'giardia':'pear','toxo':'curve','tryp':'tryp','amoeba':'amoeba'}[sh]
  for i,p in enumerate(['membrana','citoplasma']):self.ell(p,r=tuple(v*(1-.055*i)for v in r),shape=shape,cut=self.cut,detail=32)
  if sh=='giardia':
   for x in [-.26,.26]:self.ell('nucleo',(x,-.12,.40),(.19,.18,.24))
   self.tube('disco',[(.53*math.cos(a),-.34,.10+.53*math.sin(a))for a in[TAU*i/80 for i in range(81)]],.045)
   for side in [-1,1]:
    for n in range(4):
     origin=(side*(.15+n*.12),-.04,.6-n*.43)
     self.tube('axonemas',[(side*.08,.01,.65),(origin[0],origin[1],origin[2]-.45)],.013)
     self.tube('flagelo',[(origin[0]+side*(.16*t+.12*math.sin(t*5)),origin[1]+.07*math.sin(t*3),origin[2]-.5-1.1*t)for t in[i/40 for i in range(60)]],.017)
  elif sh=='toxo':
   self.ell('nucleo',(.40,-.08,-.05),(.24,.22,.33))
   for n in range(8):a=n*TAU/8;self.tube('apical',[(.13*math.cos(a),.13*math.sin(a),1.05),(.12+.10*math.cos(a),.10*math.sin(a),.65)],.028)
  elif sh=='tryp':
   self.ell('nucleo',(0,-.08,0),(.19,.17,.25));self.ell('cinetoplasto',(-.17,-.1,-1.05),(.085,.065,.08))
   edge=[(.38*math.sin((z/1.5)*3.8)+.26+.18*math.sin(z*8),-.04,z)for z in[-1.35+i*2.9/99 for i in range(100)]]
   self.tube('flagelo',edge+[(edge[-1][0]+.25,-.04,1.9),(.1,-.04,2.15)],.018)
   verts=[];faces=[]
   for p in edge:verts.extend([(.38*math.sin((p[2]/1.5)*3.8)+.12,0,p[2]),p])
   for i in range(len(edge)-1):faces.append((2*i,2*i+1,2*i+3,2*i+2))
   self.k.mesh('ondulante',verts,faces)
  else:
   self.ell('nucleo',(-.27,-.10,.13),(.26,.23,.26));self.dots('vacdigestivo',7,(.65,.36,.5),size=.12)
 def build(self):
  {'bacterias':self.bacteria,'virus':self.virus,'fungos':self.mold if self.c['shape']in['aspergillus','rhizopus']else self.yeast,'protozoarios':self.proto}[self.c['group']]();return self.k.merged()

manifest=[]
only=set(sys.argv[sys.argv.index("--")+1:]) if "--" in sys.argv else set()
previous=json.loads((OUT/"manifest.json").read_text()) if (OUT/"manifest.json").exists() else {"models":[]}
for cell in CAT:
 if only and cell['id'] not in only:
  manifest.append(next(m for m in previous['models'] if m['id']==cell['id']));continue
 target=OUT/cell['id'];target.mkdir(exist_ok=True);receipt={'id':cell['id'],'variants':{}}
 for variant,cut in [('complete',False),('cutaway',True)] if cell['cutaway'] else [('complete',False)]:
  clear();model=Model(cell,cut,target);objects=model.build();bpy.ops.object.select_all(action='DESELECT')
  for obj in objects:obj.select_set(True)
  filename=target/(variant+'.glb')
  bpy.ops.export_scene.gltf(filepath=str(filename),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False)
  info=inspect_glb(filename,{p['id']for p in cell['parts']});assert info['triangles']<150000;receipt['variants'][variant]=info
  # Editable Blender source with embedded material maps; not shipped to the browser.
  for img in bpy.data.images:
   if img.filepath:img.pack()
  blend=ROOT/'../../../../outputs/wmed-microbiology-blender'/cell['id'];blend.mkdir(parents=True,exist_ok=True)
  bpy.ops.wm.save_as_mainfile(filepath=str(blend/(variant+'.blend')),compress=True)
  print('MICRO_DONE',cell['id'],variant,info['triangles'],flush=True)
 manifest.append(receipt)
(OUT/'manifest.json').write_text(json.dumps({'blender':bpy.app.version_string,'generatorSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'models':manifest},ensure_ascii=False,indent=2))
