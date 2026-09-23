export function chatContent(raw='') {
 const text=String(raw);const marker=/###\s*TEMAS\s*###/i.exec(text);
 if(!marker)return {text:text.replace(/(?:^|\n)[ \t]*#{1,3}(?:T(?:E(?:M(?:A(?:S(?:#{0,2})?)?)?)?)?)?$/i,''),topics:[]};
 let topics=[];
 try{const tail=text.slice(marker.index+marker[0].length).trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'');const data=JSON.parse(tail);if(Array.isArray(data))topics=[...new Set(data.filter(t=>typeof t==='string'&&t.trim()&&t.length<=160).map(t=>t.trim()))].slice(0,6);}catch{}
 return {text:text.slice(0,marker.index).trimEnd(),topics};
}
