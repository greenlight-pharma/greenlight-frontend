// Recursos que dependiam da conta Vytal (caso clínico, transcrição, análise OpenMed) e voltam na fase B com a conta WMed.
import {noStore,json,L,langOf} from './http.mjs';
export function migrating(req,res){
 noStore(res);
 if(req.method==='GET'&&/\/privacy/.test(req.url||''))return json(res,200,{enabled:false});
 return json(res,503,{code:'MIGRATING',error:L(langOf(req),'O caso clínico está sendo migrado para as contas WMed e volta em breve.','Clinical cases are moving to WMed accounts and will be back soon.')});
}
