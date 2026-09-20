import {describe,it,expect} from 'vitest';
import {buscarProgramas,novoPrograma,programaLink,programaUrl,programas} from './model';
describe('Programas de cuidado',()=>{
 it('encontra a linguagem da pessoa, com e sem acentos',()=>{expect(buscarProgramas('hipertenso').map(p=>p.id)).toContain('hipertensao');expect(buscarProgramas('pos operatorio').map(p=>p.id)).toContain('pos-operatorio');expect(buscarProgramas('polifarmacia').map(p=>p.id)).toContain('polifarmacia');expect(buscarProgramas('alzheimer').map(p=>p.id)).toContain('memoria');});
 it('combina categoria e busca sem misturar resultados',()=>{expect(buscarProgramas('renal','Respiração')).toHaveLength(0);expect(buscarProgramas('','Respiração').map(p=>p.id)).toEqual(['asma','dpoc']);});
 it('gestação mantém rota e histórico anteriores',()=>{expect(programaLink('5500000000001','gestacao')).toBe('/p/5500000000001/gestacao');expect(programaLink('5500000000001','diabetes')).toBe('/programas/5500000000001/diabetes');});
 it('novo programa não cria prescrição ou cuidados genéricos e não compartilha listas',()=>{const a=novoPrograma(),b=novoPrograma();a.duvidas.push({id:'1',texto:'Teste',respondida:false});expect(b.duvidas).toHaveLength(0);expect(a.cuidados).toHaveLength(0);expect(a.compromissos).toHaveLength(0);expect(a).not.toHaveProperty('medications');});
 it('codifica parâmetros de API',()=>{expect(programaUrl('+55/1','a/b')).toBe('/care2/pessoas/%2B55%2F1/programas/a%2Fb');});
 it('não duplica entradas e oferece cuidado personalizado',()=>{expect(new Set(programas.map(p=>p.id)).size).toBe(programas.length);expect(programas.some(p=>p.id==='outros')).toBe(true);});
});
