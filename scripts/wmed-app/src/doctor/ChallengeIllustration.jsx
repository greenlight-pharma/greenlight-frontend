import React,{useId} from 'react';
import {pickText} from '../../shared/country-hub.mjs';
import {validIllustration} from '../../shared/challenge-content.mjs';
export default function ChallengeIllustration({image,locale}){
 const id=useId();if(!validIllustration(image))return null;
 return <figure className="challenge-illustration"><svg viewBox={`0 0 400 ${image.steps.length*78}`} role="img" aria-labelledby={id}><title id={id}>{pickText(image.alt,locale)}</title>{image.steps.map((step,i)=><g key={i}><rect x="12" y={8+i*78} width="376" height="62" rx="12" fill={i===image.highlight?'#00645c':'#e8f2ee'}/><text x="200" y={47+i*78} textAnchor="middle" fill={i===image.highlight?'white':'#17332f'} fontSize="22">{i+1}. {pickText(step,locale)}</text></g>)}</svg></figure>;
}
