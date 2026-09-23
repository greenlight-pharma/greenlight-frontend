import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {helixPoint,palette} from './catalog.mjs';
const V=(x,y,z)=>new T.Vector3(x,y,z);
function material(color,extra={}){return new T.MeshStandardMaterial({color,roughness:.36,metalness:.22,...extra})}
function ball(group,pos,scale,mat,id){const mesh=new T.Mesh(new T.SphereGeometry(1,32,24),mat);mesh.position.copy(pos);mesh.scale.set(...(Array.isArray(scale)?scale:[scale,scale,scale]));mesh.userData.part=id;group.add(mesh);return mesh}
function tube(group,points,r,mat,id){const c=new T.CatmullRomCurve3(points);const m=new T.Mesh(new T.TubeGeometry(c,Math.max(40,points.length*3),r,8,false),mat);m.userData.part=id;group.add(m);return m}
function rod(group,a,b,r,mat,id){const d=b.clone().sub(a),m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),10),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());m.userData.part=id;group.add(m);return m}
function shell(group,r,mat,id,scale=[1,1,1]){const m=new T.Mesh(new T.SphereGeometry(r,64,40,Math.PI,Math.PI),mat);m.scale.set(...scale);m.userData.part=id;group.add(m);return m}
function ring(group,r,pos,mat,id){const m=new T.Mesh(new T.TorusGeometry(r,.035,8,80),mat);m.position.copy(pos);m.userData.part=id;group.add(m);return m}
function makeCell(g){
 shell(g,2.8,material('#5d8b89',{side:T.DoubleSide}), 'membrane',[1,.9,.85]);
 const edge=ring(g,2.8,V(0,0,0),material(palette.teal),'membrane');edge.scale.y=.9;
 const core=ball(g,V(-.35,.2,.1),[1.18,1.05,1.05],material('#8c7fbd'),'nucleus');
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const sub=new T.Group();sub.position.set(Math.cos(a)*1.95,Math.sin(a)*1.7,.15);sub.rotation.z=a+.6;g.add(sub);ball(sub,V(0,0,0),[.43,.21,.19],material(palette.copper),'mitochondria');for(let k=0;k<5;k++)tube(sub,[V(-.28+k*.12,-.11,.11),V(-.24+k*.12,0,.2),V(-.28+k*.12,.11,.11)],.021,material('#8a573c'),'mitochondria')}
 core.rotation.z=.2;
}
function makeNucleus(g){
 shell(g,2.2,material('#73688d',{side:T.DoubleSide}),'envelope',[1,.94,1]);
 shell(g,2.1,material('#998eb4',{side:T.DoubleSide}),'envelope',[1,.94,1]);
 ring(g,2.2,V(0,0,0),material(palette.violet),'envelope').scale.y=.94;
 ring(g,2.1,V(0,0,0),material('#d6cfe6'),'envelope').scale.y=.94;
 ball(g,V(.35,-.25,.15),.6,material(palette.copper),'nucleolus');
 for(let j=0;j<7;j++){const pts=[];for(let i=0;i<110;i++){const t=i/109*Math.PI*3.5;pts.push(V(Math.cos(t+j)*(.7+j*.12),Math.sin(t*1.25+j)*1.25,-.4+Math.cos(t*1.7+j)*.45))}tube(g,pts,.037,material(j%2?palette.teal:palette.ivory),'chromatin')}
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2;const pos=V(Math.cos(a)*1.8,Math.sin(a)*1.68,-.9);const m=ring(g,.14,pos,material(palette.copper),'pores');m.quaternion.setFromUnitVectors(V(0,0,1),pos.clone().normalize())}
}
function makeChromosome(g){
 const mats=[material(palette.teal),material(palette.violet)];
 for(let side=0;side<2;side++){
 const sign=side?1:-1,pts=[];for(let i=0;i<=60;i++){const y=-2.55+i/60*4.7;pts.push(V(sign*(.14+Math.abs(y-.25)*.32),y,Math.sin(y)*.13))}
 const c=new T.CatmullRomCurve3(pts);const geo=new T.TubeGeometry(c,160,.26,16,false);
 const vertices=geo.attributes.position;for(let i=0;i<=160;i++){const center=c.getPointAt(i/160),f=.48+.52*Math.min(1,Math.abs(center.y-.25)/.65);for(let j=0;j<=16;j++){const k=i*17+j;vertices.setXYZ(k,center.x+(vertices.getX(k)-center.x)*f,center.y+(vertices.getY(k)-center.y)*f,center.z+(vertices.getZ(k)-center.z)*f)}}geo.computeVertexNormals();
 const m=new T.Mesh(geo,mats[side]);m.userData.part=side?'sisterB':'sisterA';g.add(m);
 for(let i=0;i<56;i++){const p=c.getPoint(i/55);ball(g,p,.265*(.48+.52*Math.min(1,Math.abs(p.y-.25)/.65)),mats[side],m.userData.part)}
 for(const t of [0,1])ball(g,c.getPoint(t),.28,material(palette.copper),'telomeres');
 }
 rod(g,V(-.22,.25,.1),V(.22,.25,.1),.13,material('#efd5ac'),'centromere');
 g.rotation.z=-.12;
}
function makeNucleosome(g){
 const hist=material(palette.violet),dna=material(palette.teal),link=material(palette.copper);let last;
 for(let n=0;n<3;n++){
 const center=V((n-1)*2.35,Math.sin(n*1.8)*.35,0);
 for(let j=0;j<8;j++){const a=j%4/4*Math.PI*2;ball(g,center.clone().add(V(Math.cos(a)*.32,(j<4?-.22:.22),Math.sin(a)*.32)),.36,hist,'histones')}
 const pts=[];for(let i=0;i<=130;i++){const t=i/130*Math.PI*3.4;pts.push(center.clone().add(V(Math.cos(t)*.84,(i/130-.5)*1.15,Math.sin(t)*.84)))}
 tube(g,pts,.06,dna,'wrapped');
 if(last)tube(g,[last,last.clone().add(V(.35,.2,0)),pts[0].clone().add(V(-.35,.2,0)),pts[0]],.06,link,'linker');last=pts.at(-1);
 }
 g.rotation.x=.3;g.rotation.z=.2;
}
function makeDNA(g){
 const turns=2.8,max=turns*Math.PI*2,height=turns*2.45;const backbone=material(palette.ivory),a=material(palette.teal),t=material('#3e9f93'),gc=material(palette.copper),c=material('#b98063');
 for(let phase of [0,Math.PI]){const pts=[];for(let i=0;i<=250;i++){const p=helixPoint(i/250*max,phase);pts.push(V(p[0],p[1]-height/2,p[2]))}tube(g,pts,.085,backbone,'backbone')}
 const seq='ATGCGTACCGATGCTATCGATGCATCGAT';
 for(let i=0;i<seq.length;i++){const theta=i/(seq.length-1)*max;const p=V(...helixPoint(theta));p.y-=height/2;const q=V(...helixPoint(theta,Math.PI));q.y-=height/2;const mid=p.clone().add(q).multiplyScalar(.5),isAT='AT'.includes(seq[i]),id=isAT?'at':'gc';const gap=.1;
 rod(g,p,p.clone().lerp(q,.5-gap/2),.085,isAT?a:gc,id);rod(g,p.clone().lerp(q,.5+gap/2),q,.085,isAT?t:c,id);
 for(let j=0;j<(isAT?2:3);j++){const off=(j-(isAT?.5:1))*.08;const x=mid.clone().add(V(0,off,0));ball(g,x,.022,backbone,id)}
 ball(g,p,.115,backbone,'backbone');ball(g,q,.115,backbone,'backbone');
 }
 g.rotation.z=-.25;
}
export function buildGeneticModel(id){
 const group=new T.Group();const builder=({cell:makeCell,nucleus:makeNucleus,chromosome:makeChromosome,nucleosome:makeNucleosome,dna:makeDNA})[id];if(!builder)throw new Error("Modelo genético desconhecido");builder(group);return group;
}
export function createGeneticScene(node,id,onSelect,onError){
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,100);let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{onError();return {dispose(){}}}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;node.appendChild(renderer.domElement);
 scene.add(new T.HemisphereLight('#e5f5f1','#302439',2));
 for(const [pos,color,power]of [[[4,5,6],'#fff0dd',3],[[-4,0,3],'#9edbd4',2],[[0,3,-5],'#b2a7ee',3]]){const l=new T.DirectionalLight(color,power);l.position.set(...pos);scene.add(l)}
 const model=buildGeneticModel(id);scene.add(model);
 const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3()),sphere=box.getBoundingSphere(new T.Sphere());model.position.sub(sphere.center);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=sphere.radius*1.25;controls.maxDistance=sphere.radius*12;controls.autoRotateSpeed=.65;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let spin=false,frame,disposed=false,dirty=true,last=0,selected=null;
 const fit=()=>{const aspect=node.clientWidth/Math.max(1,node.clientHeight);camera.aspect=aspect;camera.updateProjectionMatrix();const tangent=Math.tan(T.MathUtils.degToRad(36)/2);const distance=(Math.max(size.y/2/tangent,size.x/2/(tangent*aspect))+size.z/2)*1.08;camera.position.set(0,0,distance);controls.target.set(0,0,0);controls.update();dirty=true};
 const resize=()=>{renderer.setSize(node.clientWidth,node.clientHeight);fit()};const observer=new ResizeObserver(resize);observer.observe(node);resize();
 const originals=new Map();model.traverse(o=>{if(o.isMesh){o.material=o.material.clone();originals.set(o,{color:o.material.color.clone(),emissive:o.material.emissive.clone()})}});
 function select(part){selected=part;originals.forEach((v,o)=>{o.material.color.copy(v.color);o.material.emissive.copy(v.emissive);o.material.emissiveIntensity=0;if(part&&o.userData.part===part){o.material.emissive.set('#fff0c7');o.material.emissiveIntensity=.32}else if(part){o.material.color.multiplyScalar(.4)}});dirty=true}
 const ray=new T.Raycaster();let down;
 const start=e=>{down=[e.clientX,e.clientY]};
 const click=e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const rect=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(model.children,true).find(h=>h.object.userData.part);if(hit)onSelect(hit.object.userData.part)};
 renderer.domElement.addEventListener('pointerdown',start);renderer.domElement.addEventListener('pointerup',click);controls.addEventListener('change',()=>{dirty=true});
 const contextLost=e=>{e.preventDefault();onError()};renderer.domElement.addEventListener('webglcontextlost',contextLost);
 function animate(t){if(disposed)return;frame=requestAnimationFrame(animate);if(document.hidden)return;controls.autoRotate=spin&&!reduced.matches;const moving=controls.update();if((dirty||moving||controls.autoRotate)&&t-last>1000/40){renderer.render(scene,camera);last=t;dirty=false}}frame=requestAnimationFrame(animate);
 return {fit,select,spin(v){spin=v;dirty=true},zoom(f){camera.position.multiplyScalar(f);controls.update();dirty=true},dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',start);renderer.domElement.removeEventListener('pointerup',click);renderer.domElement.removeEventListener('webglcontextlost',contextLost);const geometries=new Set(),materials=new Set();model.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material)});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()}};
}
