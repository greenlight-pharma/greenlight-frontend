import {useEffect,useRef} from 'react';
/** Fit the work surface below the actual app shell; scrolling does not resize it. */
export function useWorkspaceHeight(fullscreen=false){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const resize=()=>{
   const top=fullscreen?0:el.getBoundingClientRect().top+globalThis.scrollY;
   const height=`${Math.max(300,globalThis.innerHeight-top-(globalThis.innerWidth<=900?65:0))}px`;
   if(el.style.getPropertyValue('--va-workspace-height')!==height)el.style.setProperty('--va-workspace-height',height);
  };
  const observer=new ResizeObserver(resize);
  if(el.parentElement)observer.observe(el.parentElement);
  globalThis.addEventListener('resize',resize);resize();
  return()=>{observer.disconnect();globalThis.removeEventListener('resize',resize);};
 },[fullscreen]);
 return ref;
}
