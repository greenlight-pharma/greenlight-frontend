import { describe, it, expect } from 'vitest';
import { idadeGestacional, dppPorIdade, proximos, calendario } from './model';
describe('Gestação',()=>{
 it('calcula semanas com base na DPP e cruza meses e ano',()=>{expect(idadeGestacional('2027-01-10','2026-09-20')).toEqual({semanas:24,dias:0});});
 it('converte idade confirmada em DPP',()=>{expect(dppPorIdade(24,0,'2026-09-20')).toBe('2027-01-10');});
 it('não mostra idade negativa nem extrapola após42semanas',()=>{expect(idadeGestacional('2028-01-01','2026-09-20')).toBeNull();expect(idadeGestacional('2026-01-01','2026-09-20')).toBeNull();});
 it('rejeita dias ou semanas inválidas',()=>{expect(()=>dppPorIdade(24,7)).toThrow();expect(()=>dppPorIdade(-1,0)).toThrow();});
 const c={id:'teste',tipo:'consulta' as const,titulo:'Consulta; obstetra\nAgenda',data:'2026-09-21',hora:'10:00',local:'Clínica, sala 2',concluido:false};
 it('lista só próximos não concluídos e ordena',()=>{expect(proximos([c,{...c,id:'2',concluido:true},{...c,id:'3',data:'2026-09-19'}],'2026-09-20')).toEqual([c]);});
 it('calendário usa timezone e alarmes, escapando texto',()=>{const s=calendario(c);expect(s).toContain('DTSTART;TZID=America/Sao_Paulo:20260921T100000');expect(s).toContain('TRIGGER:-P1D');expect(s).toContain('TRIGGER:-PT1H');expect(s).toContain('Consulta\\; obstetra\\nAgenda'); for(const line of calendario({...c,titulo:'Gestação '.repeat(20)}).split('\r\n'))expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);});
});
