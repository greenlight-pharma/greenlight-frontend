// 3Dmol 2.5.3 has no public destructor. Capture only listeners registered
// synchronously by its constructor, then restore the native methods immediately.
export function createOwnedViewer(api,node){
 const registrations=[],targets=[window,document.body],originals=targets.map(t=>t.addEventListener);
 let viewer;
 try{targets.forEach((t,i)=>{t.addEventListener=function(type,callback,options){registrations.push([t,type,callback,options]);return originals[i].call(t,type,callback,options)}});viewer=api.createViewer(node,{backgroundAlpha:0,antialias:true});}
 finally{targets.forEach((t,i)=>{t.addEventListener=originals[i]})}
 return {viewer,dispose(){registrations.forEach(([t,type,fn,options])=>t.removeEventListener(type,fn,options));viewer.divwatcher?.disconnect();viewer.intwatcher?.disconnect();viewer.spin(false);viewer.clear();const canvas=node.querySelector('canvas');canvas?.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext();node.replaceChildren()}};
}
