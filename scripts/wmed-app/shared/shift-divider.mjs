// Wall-clock arithmetic only. No account, identifiers, remote calls or persisted schedule.
export function divideShift({start,end,people}){
 const parse=value=>{if(typeof value!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))return null;const[h,m]=value.split(':').map(Number);return h*60+m;};
 const a=parse(start),b=parse(end),n=typeof people==='number'?people:/^\d+$/.test(String(people))?Number(people):NaN;
 if(a===null||b===null)return {error:'time'};
 if(!Number.isInteger(n)||n<1||n>12)return {error:'people'};
 if(a===b)return {error:'equal'};
 const endMinute=b>a?b:b+1440,total=endMinute-a;
 if(total<n)return {error:'short'};
 const base=Math.floor(total/n),extra=total%n;let cursor=a;
 const periods=Array.from({length:n},(_,i)=>{const duration=base+(i<extra?1:0),from=cursor;cursor+=duration;return {position:i+1,start:from,end:cursor,duration};});
 return {total,periods,overnight:endMinute>=1440};
}
export function clockLabel(minutes){const local=minutes%1440;return `${String(Math.floor(local/60)).padStart(2,'0')}:${String(local%60).padStart(2,'0')}`;}
