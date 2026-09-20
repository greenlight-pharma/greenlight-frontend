import {describe,it,expect} from 'vitest';
import {answerLabel,measurementLines} from './checkin-history';
describe('histórico de check-in',()=>{
 it('preserva respostas antigas e mostra sintomas do snapshot',()=>{
 const item={conditions:['diabetes'],question:'Hoje',options:[{id:'sede',title:'Mais sede'}]};
 expect(answerLabel(item,'sim')).toBe('Sim');expect(answerLabel(item,['sede'])).toBe('Mais sede');expect(answerLabel(item,['nao_avaliado'])).toContain('Não perguntado');
 });
 it('mostra medições com unidades, contexto e horário',()=>{
 expect(measurementLines({version:2,urgent:false,measurements:{glucose:140,glucose_time:'08:30',glucose_context:'jejum',systolic:120,diastolic:80,weight:75.5}})).toEqual(['Glicemia: 140 mg/dL às 08:30 (Brasília) · em jejum','Pressão: 120 / 80 mmHg · horário não informado','Peso: 75.5 kg · horário não informado']);
 });
});
