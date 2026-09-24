import React from 'react';
import StudyDeck from './study/StudyDeck';
import {msg} from './i18n';
import {USMLE_AREAS,USMLE_DECK,USMLE_TOTAL_TOPICS,USMLE_TOTAL_CARDS} from './usmle/content';
// Conteúdo em inglês para todos os idiomas da interface (a prova é em inglês).
const pack={id:'usmle',title:msg('Revisão USMLE'),eyebrow:msg('CONTEÚDO ORIGINAL WMED · EM INGLÊS'),searchLabel:msg('Buscar tema USMLE'),note:msg('Rascunho em revisão médica. USMLE® é um programa da FSMB e do NBME; a WMed não tem vínculo com eles.'),areas:USMLE_AREAS,decks:USMLE_DECK,totalTopics:USMLE_TOTAL_TOPICS,totalCards:USMLE_TOTAL_CARDS};
export default function Usmle(props){return <StudyDeck pack={pack} {...props}/>;}
