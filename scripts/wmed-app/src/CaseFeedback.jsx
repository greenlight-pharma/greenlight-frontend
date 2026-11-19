import React,{useState,useId} from 'react';
import {ChevronDown,ArrowRight,ShieldAlert,FileText} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {orderedSbar,studentComparisonKeys,hiddenFeedbackKeys} from '../shared/case-contract.mjs';
import {useI18n} from './doctor/I18n';
const labels = {
  resumo_caso: "Resumo do caso",
  como_apresentar_caso: "Como apresentar o caso · SBAR",
  red_flags_educacionais: "Sinais de alerta",
  pontos_de_atencao: "Pontos de atenção",
  hipoteses_para_discussao: "Hipóteses diagnósticas",
  comparacao_hipoteses_aluno: "Suas hipóteses em discussão",
  alinhamento_hipoteses_didatico: "Alinhamento das hipóteses",
  elementos_de_manejo_academico: "Condutas a considerar",
  comparacao_conduta_aluno: "Sua conduta em discussão",
  alinhamento_conduta_didatico: "Alinhamento da conduta",
  pontos_fortes: "Pontos fortes",
  pontos_a_aprofundar: "Seu aprendizado",
  analise_anamnese: "Anamnese",
  analise_exame_fisico: "Exame físico",
  exames_para_discussao_academica: "Exames para discussão",
  temas_de_estudo: "Temas para estudar",
  perguntas_ao_preceptor: "Perguntas ao preceptor",
  referencias: "Referências",
  hipotese: "Hipótese",
  justificativa: "Justificativa",
  probabilidade_didatica: "Probabilidade",
  sinal: "Sinal",
  justificativa_didatica: "Por que observar",
  exame: "Exame",
  aspectos_bem_explorados: "Bem explorado",
  temas_a_aprofundar: "Para aprofundar",
  eixos_tematicos: "Eixos temáticos",
  como_e_cobrado: "Como é cobrado",
  foco_para_prova: "Foco para a prova",
};
const groups = [
  [
    "Raciocínio",
    [
      "resumo_caso",
      "red_flags_educacionais",
      "pontos_de_atencao",
      "hipoteses_para_discussao",
      "exames_para_discussao_academica",
      "elementos_de_manejo_academico",
      "como_apresentar_caso",
    ],
  ],
  ["Semiologia", ["analise_anamnese", "analise_exame_fisico"]],
  ["Estudo", ["temas_de_estudo", "referencias"]],
  [
    "Seu aprendizado",
    [
      "pontos_fortes",
      "pontos_a_aprofundar",
      "perguntas_ao_preceptor",
    ],
  ],
];
export function Value({ value }) {
  const { t } = useI18n();
  if (value == null || value === "") return <p>{t("Não informado.")}</p>;
  if (Array.isArray(value))
    return (
      <div className="feedback-items">
        {value.map((v, i) => (
          <div key={i}>
            <Value value={v} />
          </div>
        ))}
      </div>
    );
  if (typeof value === "object")
    return (
      <dl className="case-definition">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <dt>{labels[k] ? t(labels[k]) : k.replaceAll("_", " ")}</dt>
            <dd>
              {k === "probabilidade_didatica" ? (
                <span className={"probability " + String(v).toLowerCase()}>
                  {t(String(v))}
                </span>
              ) : (
                <Value value={v} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: () => null,
        a: ({ href, children }) =>
          /^https:\/\//.test(href || "") ? (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ) : (
            <span>{children}</span>
          ),
      }}
    >
      {String(value)}
    </ReactMarkdown>
  );
}

function Sbar({value}) {
 const {t}=useI18n();
 const data=orderedSbar(value);
 if(!data)return <Value value={value}/>;
 return <><ol className="case-sbar">{data.steps.map(({letter,label,value})=><li key={letter}><span className="case-sbar-letter" aria-hidden="true">{letter}</span><div><h4>{letter} · {t(label)}</h4><Value value={value}/></div></li>)}</ol>{Object.keys(data.extras).length>0&&<Value value={data.extras}/>}</>;
}
function AlertList({value}) {
 const items=Array.isArray(value)?value:[value];
 return <ol className="case-alert-list">{items.map((item,index)=>{
  const object=item&&typeof item==='object'&&!Array.isArray(item);
  const title=object&&typeof item.sinal==='string'?item.sinal:null;
  const rest=title?Object.fromEntries(Object.entries(item).filter(([key])=>key!=='sinal')):item;
  return <li key={index}><span className="case-alert-number" aria-hidden="true">{index+1}</span><div>{title&&<h5>{title}</h5>}<Value value={rest}/></div></li>;
 })}</ol>;
}
function hasContent(value){return value!=null&&value!==''&&(!Array.isArray(value)||value.length>0);}
function DetailsValue({value}) {
 const {t}=useI18n();
 if(!Array.isArray(value)||!value.some(v=>v&&typeof v==='object'&&!Array.isArray(v)))return <Value value={value}/>;
 return <div className="case-item-list">{value.map((item,index)=>{
  if(!item||typeof item!=='object'||Array.isArray(item))return <div key={index}><Value value={item}/></div>;
  const titleKey=['hipotese','exame','conduta','titulo','tema','sinal','acao','nome'].find(key=>typeof item[key]==='string');
  const probability=item.probabilidade_didatica;
  const rest=Object.fromEntries(Object.entries(item).filter(([key])=>key!==titleKey&&key!=='probabilidade_didatica'));
  return <details className="case-item" key={index}><summary><span className="case-item-number">{String(index+1).padStart(2,'0')}</span><strong>{titleKey?item[titleKey]:`${t('Item')} ${index+1}`}</strong>{probability&&<span className={'probability '+String(probability).toLowerCase()}>{t(String(probability))}</span>}<ChevronDown size={16}/></summary><div className="case-item-body"><Value value={rest}/></div></details>;
 })}</div>;
}
export default function CaseFeedback({feedback,quality,qualityError,grading,restPending,restError,relato,form,onGrade,busy}) {
 const uid=useId();
 const {t}=useI18n();
 const topicLabel=(key,fallback)=>labels[key]?t(labels[key]):fallback[key]?t(fallback[key]):key?.replaceAll('_',' ');
 const [tab,setTab]=useState(0),[selected,setSelected]=useState('resumo_caso');
 const known=new Set(groups.flatMap(group=>group[1]));
 const extras=Object.keys(feedback).filter(key=>!known.has(key)&&!studentComparisonKeys.has(key)&&!hiddenFeedbackKeys.has(key)&&key!=='erro_pii');
 const keys=[...groups[tab][1],...(tab===3?extras:[])].filter(key=>hasContent(feedback[key]));
 if(tab===3)keys.unshift('pontuacao');
 if(tab===0)keys.push('relato_original');
 const current=keys.includes(selected)?selected:keys[0];
 const alerts=hasContent(feedback.red_flags_educacionais);
 function chooseTab(index){setTab(index);setSelected('');}
 return <div className="case-feedback-v2">
  <div className="case-feedback-overview"><div><span className="eyebrow">{t('FEEDBACK DO CASO')}</span><h2>{form.queixaPrincipal||t('Análise do relato')}</h2></div><button className="case-score" onClick={()=>{setTab(3);setSelected('pontuacao')}}><strong>{quality?.score??(grading?<span className="spinner" aria-label={t("Avaliando")}/>:'—')}<small>/100</small></strong><span>{t('Qualidade do relato')}<small>{t('Experimental · ver critérios')}</small></span></button></div>
  <div className="case-category-tabs" role="tablist" aria-label={t("Seções do feedback")}>{groups.map(([label],index)=><button key={label} id={uid+'-tab-'+index} role="tab" aria-selected={tab===index} onClick={()=>chooseTab(index)}>{t(label)}</button>)}</div>
  {restError&&<p className="error" role="alert">{restError}</p>}
  <div className="case-feedback-layout">
   <nav className="case-topic-list" aria-label={t("Tópicos do feedback")}>{keys.map(key=><button key={key} aria-current={current===key?'true':undefined} onClick={()=>setSelected(key)}><span>{topicLabel(key,{pontuacao:'Minha pontuação',relato_original:'Relato registrado'})}</span>{key==='red_flags_educacionais'?<ShieldAlert size={16}/>:<ArrowRight size={15}/>}</button>)}{restPending&&<p className="case-topic-pending" role="status"><span className="spinner"/> {t('Gerando mais seções…')}</p>}</nav>

   <article key={current} className="case-topic-content markdown" role="tabpanel" aria-labelledby={uid+'-tab-'+tab}>
    <h3>{topicLabel(current,{pontuacao:'Qualidade do relato',relato_original:'Relato registrado'})}</h3>
    {current==='pontuacao'?<><p className="module-note">{t('A pontuação avalia a documentação, não sua competência médica. Não é necessário propor hipóteses ou condutas.')}</p>{quality?quality.criteria.map(c=><details className="case-item" key={c.id}><summary><strong>{t(c.label)}</strong><span>{c.aplicavel?`${c.points}/${c.max}`:t('Não aplicável')}</span><ChevronDown size={16}/></summary><div className="case-item-body"><p>{c.justificativa}</p>{c.evidencia&&<blockquote>{c.evidencia}</blockquote>}<p><b>{t('Próximo passo:')}</b> {c.melhoria}</p></div></details>):<p>{grading?t('Avaliando a qualidade do relato…'):qualityError?t(qualityError):t('Pontuação indisponível para este caso.')}</p>}{onGrade&&qualityError&&!grading&&<button onClick={onGrade}>{t('Tentar pontuação novamente')}</button>}</>:current==='relato_original'?<div className="case-original">{relato}</div>:current==='como_apresentar_caso'?<Sbar value={feedback[current]}/>:current==='red_flags_educacionais'?<AlertList value={feedback[current]}/>:current?<DetailsValue value={feedback[current]}/>:<p>{restPending?t('Esta parte do feedback ainda está sendo gerada. Continue lendo as outras abas.'):t('Não há conteúdo nesta seção.')}</p>}
    {current==='resumo_caso'&&alerts&&<aside className="case-alert-summary"><h4><ShieldAlert size={18}/> {t('Sinais de alerta')}</h4><AlertList value={feedback.red_flags_educacionais}/></aside>}
   </article>
  </div>
  <p className="case-feedback-note">{t('Hipóteses e condutas precisam ser conferidas no contexto clínico.')}</p>
 </div>;
}
