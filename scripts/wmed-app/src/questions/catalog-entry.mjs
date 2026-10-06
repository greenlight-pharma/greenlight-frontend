import {approvedQbank} from '../../shared/approved-qbank.mjs';
import {assertCatalog} from './editorial.mjs';
import {catalogStorageKey} from './attempts.mjs';
import {questionStorageKey} from './storage.mjs';

export function qbankEntry({doctor=false,original=false,scope}={},catalog=approvedQbank){
 const approved=assertCatalog(catalog);
 if(doctor&&original&&approved.length){
  const catalogId='original-learning';
  return {storageKey:catalogStorageKey(scope,catalogId),catalogId,catalog:approved};
 }
 return {storageKey:questionStorageKey(scope)};
}
