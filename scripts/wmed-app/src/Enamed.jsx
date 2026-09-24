import React from 'react';
import StudyDeck from './study/StudyDeck';
import {msg} from './i18n';
import {REVISAO_AREAS,REVISAO_DECK,REVISAO_TOTAL_TEMAS,REVISAO_TOTAL_CARDS} from './enamed/content';
const pack={id:'enamed',title:msg('Resumos ENAMED'),eyebrow:msg('BIBLIOTECA VYTAL ACADÊMICO'),searchLabel:msg('Buscar tema ENAMED'),areas:REVISAO_AREAS,decks:REVISAO_DECK,totalTopics:REVISAO_TOTAL_TEMAS,totalCards:REVISAO_TOTAL_CARDS};
export default function Enamed(props){return <StudyDeck pack={pack} {...props}/>;}
