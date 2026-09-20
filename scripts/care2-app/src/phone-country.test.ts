import {it,expect} from 'vitest';
import {internationalPhone,phoneCountries,phoneParts} from './phone-country';
import {formatPhone} from './models';
it('Brasil vem primeiro, com bandeira e código',()=>{expect(phoneCountries[0]).toMatchObject({country:'BR',code:'55',flag:'🇧🇷'});});
it('envia números internacionais sem duplicar código nem cortar dígitos',()=>{
 expect(internationalPhone('912 345 678','PT')).toBe('351912345678');
 expect(internationalPhone('202 555 0123','US')).toBe('12025550123');
 expect(internationalPhone('07700 900123','GB')).toBe('447700900123');
 expect(internationalPhone('11 99999-8888','BR')).toBe('5511999998888');
 expect(internationalPhone('+351 912 345 678','PT')).toBe('351912345678');
 expect(internationalPhone('+351 912 345 678','BR')).toBe(null);
 expect(internationalPhone('123','PT')).toBe(null);
});
it('recupera país e mostra código estrangeiro sem máscara brasileira',()=>{
 expect(phoneParts('351912345678')).toEqual({country:'PT',local:'912345678'});
 expect(phoneParts('')).toEqual({country:'BR',local:''});
 expect(formatPhone('12025550123')).toBe('+12025550123');
});
