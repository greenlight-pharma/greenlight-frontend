import test from 'node:test';import assert from 'node:assert/strict';
import {divideShift,clockLabel} from '../shared/shift-divider.mjs';
test('Overnight intervals cover the full shift without gaps, overlap or missing minutes',()=>{
 const s=divideShift({start:'19:00',end:'07:00',people:'3'});assert.equal(s.total,720);assert.equal(s.overnight,true);assert.deepEqual(s.periods.map(p=>p.duration),[240,240,240]);assert.equal(clockLabel(s.periods[1].end),'03:00');assert.equal(s.periods.at(-1).end,1860);
 for(let n=1;n<=12;n++){const r=divideShift({start:'08:13',end:'18:54',people:n});assert.equal(r.periods[0].start,493);assert.equal(r.periods.at(-1).end,1134);assert.equal(r.periods.reduce((v,p)=>v+p.duration,0),641);for(let i=1;i<n;i++)assert.equal(r.periods[i-1].end,r.periods[i].start);const times=r.periods.map(p=>p.duration);assert.ok(Math.max(...times)-Math.min(...times)<=1);}
});
test('Invalid times, fractional counts and ambiguous equal endpoints are rejected',()=>{
 const base={start:'08:00',end:'12:00',people:2};
 for(const start of ['','24:00','8:00','10:99',null])assert.equal(divideShift({...base,start}).error,'time');
 for(const people of [0,13,1.5,'1.5','2people','',NaN])assert.equal(divideShift({...base,people}).error,'people');
 assert.equal(divideShift({...base,end:'08:00'}).error,'equal');
 assert.equal(divideShift({start:'00:00',end:'00:02',people:3}).error,'short');
 assert.equal(divideShift({start:'23:59',end:'00:00',people:1}).periods[0].duration,1);
});
