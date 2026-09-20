import {getCountries,getCountryCallingCode,parsePhoneNumberFromString,type CountryCode} from 'libphonenumber-js/min';
export type {CountryCode};
const names=new Intl.DisplayNames(['pt-BR'],{type:'region'});
export const countryFlag=(country:string)=>Array.from(country.toUpperCase(),c=>String.fromCodePoint(127397+c.charCodeAt(0))).join('');
export const phoneCountries=getCountries().map(country=>({country,code:getCountryCallingCode(country),name:names.of(country)??country,flag:countryFlag(country)})).sort((a,b)=>a.country==='BR'?-1:b.country==='BR'?1:a.name.localeCompare(b.name,'pt-BR'));
export function internationalPhone(value:string,country:CountryCode):string|null{
 if(!/^[+\d\s().-]+$/.test(value))return null;
 const parsed=parsePhoneNumberFromString(value,{defaultCountry:country,extract:false});
 if(!parsed?.isPossible()||parsed.ext||parsed.countryCallingCode!==getCountryCallingCode(country))return null;
 return parsed.number.slice(1);
}
export function phoneParts(value:string):{country:CountryCode;local:string}{
 const digits=value.replace(/\D/g,'');
 const parsed=digits?parsePhoneNumberFromString('+'+digits):undefined;
 return parsed?.country?{country:parsed.country,local:String(parsed.nationalNumber)}:{country:'BR',local:digits.startsWith('55')?digits.slice(2):digits};
}
