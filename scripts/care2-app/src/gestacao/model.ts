export type Compromisso = { id: string; tipo: 'consulta'|'exame'|'outro'; titulo: string; data: string; hora: string; local: string; concluido: boolean };
export type Duvida = { id: string; texto: string; respondida: boolean };
export type Gestacao = { status: 'ativa'|'encerrada'; dpp: string; consentimento: boolean; compromissos: Compromisso[]; duvidas: Duvida[] };
export type Registro = { data: Gestacao|null; version: number };
export const hoje = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function idadeGestacional(dpp: string, dia = hoje()) {
  const remaining = (Date.parse(dpp+'T12:00:00Z') - Date.parse(dia+'T12:00:00Z')) / 86400000;
  const total = Math.round(280 - remaining);
  if (!Number.isFinite(total) || total < 0 || total > 294) return null;
  return { semanas: Math.floor(total/7), dias: total%7 };
}
export function dppPorIdade(semanas: number, dias: number, referencia = hoje()) {
  if (!Number.isInteger(semanas) || semanas < 0 || semanas > 42 || !Number.isInteger(dias) || dias < 0 || dias > 6 || semanas*7+dias > 294) throw new Error('Confira as semanas e os dias informados no pré-natal.');
  return new Date(Date.parse(referencia+'T12:00:00Z') + (280-semanas*7-dias)*86400000).toISOString().slice(0,10);
}
export const proximos = (xs: Compromisso[], dia = hoje()) => xs.filter(x=>!x.concluido && x.data>=dia).sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora));
export function calendario(c: Compromisso) {
  const escape = (s:string) => s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
  const stamp = c.data.replaceAll('-','')+'T'+c.hora.replace(':','')+'00';
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Vytal//Care Gestacao//PT-BR','CALSCALE:GREGORIAN','BEGIN:VTIMEZONE','TZID:America/Sao_Paulo','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:-0300','TZOFFSETTO:-0300','TZNAME:BRT','END:STANDARD','END:VTIMEZONE','BEGIN:VEVENT',`UID:${escape(c.id)}@care.vytalsaude.com.br`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;TZID=America/Sao_Paulo:${stamp}`,'DURATION:PT1H',`SUMMARY:${escape(c.titulo)}`,`LOCATION:${escape(c.local)}`,'DESCRIPTION:Compromisso cadastrado no Vytal Care. Confira o horario com o servico.', 'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:Compromisso amanha','END:VALARM','BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:Compromisso em uma hora','END:VALARM','END:VEVENT','END:VCALENDAR'].map(line=>{let output='',part='';for(const char of line){if(new TextEncoder().encode(part+char).length>75){output+=part+'\r\n';part=' ';}part+=char;}return output+part;}).join('\r\n')+'\r\n';
}
