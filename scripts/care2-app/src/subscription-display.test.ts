import {describe,it,expect} from 'vitest';
import {subscriptionDisplay,type SubscriptionStatus} from './models';
const individual={id:'individual',nome:'Individual',limitePacientes:1};
const familia={id:'familia',nome:'Família',limitePacientes:3};
const base:SubscriptionStatus={tipoConta:'pessoal',plano:familia,catalogo:[individual,familia],limite:3,teste:{ativo:true,ate:'2026-09-27'},web:{planoId:'individual',status:'ativa',acesso:true,tipo:'pix'}};
describe('plano comprado e benefício temporário',()=>{
 it('Pix Individual durante teste Família mostra compra correta sem pedir outra assinatura',()=>{
  expect(subscriptionDisplay(base)).toMatchObject({displayPlan:individual,paidPlan:individual,hasPaidAccess:true,showTrialOffer:false,trialBonus:true});
  expect(base.limite).toBe(3);
 });
 it('sem pagamento mostra teste grátis',()=>expect(subscriptionDisplay({...base,web:null})).toMatchObject({displayPlan:familia,showTrialOffer:true,trialBonus:false}));
 it('pagamento pendente não é compra confirmada',()=>expect(subscriptionDisplay({...base,web:{planoId:'individual',status:'pendente',acesso:false}}).showTrialOffer).toBe(true));
 it('após o teste mantém Individual, sem benefício extra',()=>expect(subscriptionDisplay({...base,plano:individual,teste:{ativo:false,ate:'2026-09-27'},limite:1})).toMatchObject({displayPlan:individual,trialBonus:false,showTrialOffer:false}));
 it('Família pago não aparece como teste ou compra Individual',()=>expect(subscriptionDisplay({...base,web:{planoId:'familia',status:'ativa',acesso:true}})).toMatchObject({displayPlan:familia,trialBonus:false,showTrialOffer:false}));
 it('Apple com acesso também impede mensagem para assinar novamente',()=>expect(subscriptionDisplay({...base,web:null,assinatura:{planoId:'individual',acesso:true}})).toMatchObject({displayPlan:individual,showTrialOffer:false}));
 it('cortesia profissional não é rebaixada na apresentação',()=>expect(subscriptionDisplay({...base,tipoConta:'profissional'}).displayPlan).toEqual(familia));
});

it('vencimento do plano pago não é confundido com término do teste antigo',()=>{
 const v={fase:'vence_em_breve' as const,venceEm:'2026-10-20',corteEm:'2026-10-27',limite:0,pausados:0};
 expect(subscriptionDisplay({...base,vencimento:v}).trialExpiry).toBe(false);
 expect(subscriptionDisplay({...base,vencimento:{...v,venceEm:'2026-09-27'}}).trialExpiry).toBe(true);
});
