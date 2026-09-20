import {describe,it,expect} from 'vitest';
import {diasDesde,limparValores,personalizacao,serieMedicoes,serieRegistros,vazio} from './personalizacao';
import {programas} from './model';
describe('Acompanhamento específico',()=>{
 it('cobre cada programa sem substituir o pré-natal existente',()=>{expect(Object.keys(personalizacao).sort()).toEqual(programas.filter(p=>p.id!=='gestacao').map(p=>p.id).sort());});
 it('distingue campos e fluxos, não só o título',()=>{expect(personalizacao.diabetes.measurement).toBe('glicemia');expect(personalizacao.hipertensao.measurement).toBe('pressao');expect(personalizacao.polifarmacia.workflow).toBe('medications');expect(personalizacao['pos-operatorio'].workflow).toBe('surgery');expect(personalizacao.renal.fields.some(f=>f.id==='tfg')).toBe(true);});
 it('conta dias de recuperação e lida com cirurgia programada',()=>{expect(diasDesde('2026-09-15','2026-09-20')).toBe(5);expect(diasDesde('2026-09-21','2026-09-20')).toBe(-1);expect(diasDesde('','2026-09-20')).toBeNull();});
 it('não converte campos vazios em zero e mantém zero válido',()=>{expect(limparValores({dor:0,observacao:''})).toEqual({dor:0});});
 it('gráficos filtram dados ausentes, separam pressão e glicemia e ordenam',()=>{const xs=[{id:1,tipo:'glicemia' as const,valor:null,medidoEm:'2026-09-20T12:00:00Z'},{id:2,tipo:'pressao' as const,sistolica:120,diastolica:80,medidoEm:'2026-09-19T12:00:00Z'},{id:3,tipo:'glicemia' as const,valor:110,medidoEm:'2026-09-20T12:00:00Z'},{id:4,tipo:'glicemia' as const,valor:100,medidoEm:'2026-09-18T12:00:00Z'}];expect(serieMedicoes(xs,'glicemia').map(p=>p.values)).toEqual([[100],[110]]);expect(serieMedicoes(xs,'pressao')[0].values).toEqual([120,80]);});
 it('série pessoal não mistura textos e preserva o horário e dor zero',()=>{expect(serieRegistros([{id:'1',data:'2026-09-20',hora:'10:00',valores:{dor:0}},{id:'2',data:'2026-09-20',hora:'09:00',valores:{observacao:'texto'}}],'dor')).toEqual([{date:'2026-09-20T10:00:00-03:00',values:[0]}]);});
 it('não compartilha perfil e registros entre pessoas',()=>{const a=vazio(),b=vazio();a.perfil.plano='a';expect(b.perfil).toEqual({});});
});
