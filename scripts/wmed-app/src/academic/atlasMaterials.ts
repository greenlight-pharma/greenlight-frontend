import {Material,MeshStandardMaterial,Object3D,PropertyBinding} from 'three';
/** The source atlas GLBs export white emission, which washes out organ colour.
 * Apply only to catalogue-matched anatomy, never to Blender histology materials. */
export function applyAtlasMaterial(material:Material,color:string){
 if(!(material instanceof MeshStandardMaterial))return;
 material.color.set(color);
 material.emissive.set(0x000000);
 material.emissiveIntensity=1;
 material.roughness=.62;
 material.metalness=0;
}

export type AtlasPart={name:string;color:string};
export function findAtlasPart(node:Object3D,parts:Map<string,AtlasPart>):AtlasPart|undefined{
 let current:Object3D|null=node;
 while(current){
  // GLTFLoader strips dots from rendered names, but keeps the source name here.
  const found=parts.get(current.userData.name)||parts.get(current.name)||parts.get(PropertyBinding.sanitizeNodeName(current.name));
  if(found)return found;
  current=current.parent;
 }
}
