import React from 'react';
import {useI18n} from './I18n';
const words={
 'pt-BR':{label:'Estilo da resposta',auto:'Automático',concise:'Consulta rápida',study:'Estudar'},
 en:{label:'Response style',auto:'Automatic',concise:'Quick reference',study:'Learn'},
 es:{label:'Estilo de respuesta',auto:'Automático',concise:'Consulta rápida',study:'Estudiar'},
};
export default function ResponseStyle({disabled}){const {locale,responseStyle,setResponseStyle}=useI18n();const w=words[locale]||words['pt-BR'];return <div className="doctor-response-style" role="group" aria-label={w.label}>{['auto','concise','study'].map(id=><button type="button" key={id} aria-pressed={responseStyle===id} disabled={disabled} onClick={()=>setResponseStyle(id)}>{w[id]}</button>)}</div>;}
