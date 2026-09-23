// Educational display and similarity helpers. No diagnostic pixel thresholds.
export function tone(value, gamma=3){return Math.round(255*Math.pow(value/255,gamma))}
export function isBoundary(bits,x,y,width,height,bit){
 const at=(xx,yy)=>xx>=0&&xx<width&&yy>=0&&yy<height&&(bits[(yy*width+xx)*4]&bit)!==0;
 return at(x,y)&&(!at(x-1,y)||!at(x+1,y)||!at(x,y-1)||!at(x,y+1));
}
export function ncc(a,b){
 if(a.length!==b.length||!a.length)throw new Error('Imagens incompatíveis');
 let sa=0,sb=0;for(let i=0;i<a.length;i++){sa+=a[i];sb+=b[i]}
 const ma=sa/a.length,mb=sb/b.length;let cross=0,aa=0,bb=0;
 for(let i=0;i<a.length;i++){const x=a[i]-ma,y=b[i]-mb;cross+=x*y;aa+=x*x;bb+=y*y}
 return aa&&bb?Math.max(-1,Math.min(1,cross/Math.sqrt(aa*bb))):0;
}
export function bestProjection(reference,candidates){
 if(!candidates.length)throw new Error('Sem projeções');
 const scores=candidates.map(c=>ncc(reference,c));const index=scores.indexOf(Math.max(...scores));return {index,scores};
}
export function detectorPoint(view,u,v){
 const [tl,tr,bl]=view.detectorCornersRAS;
 return tl.map((x,i)=>x+u*(tr[i]-x)+v*(bl[i]-x));
}
