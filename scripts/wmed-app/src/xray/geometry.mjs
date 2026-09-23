export const scenePoint=([r,a,s])=>[r,s,-a];
export function projectionFov(data,aspect=1){return 2*Math.atan(data.size*data.pixelSpacing/(2*data.sdd*Math.min(1,aspect)))*180/Math.PI}
export function matchingStructures(bits,parts){return parts.filter(p=>(bits&p.bit)!==0)}
// Returns pixel-centre coordinates in a calibrated detector, independent of rendering.
export function projectRAS(point,view,data){
 const m=view.pose;const relative=point.map((x,i)=>x-m[i][3]);
 const local=[0,1,2].map(j=>relative.reduce((v,x,i)=>v+x*m[i][j],0));
 return [(data.size-1)/2-local[0]/local[2]*data.sdd/data.pixelSpacing,(data.size-1)/2-local[1]/local[2]*data.sdd/data.pixelSpacing];
}
