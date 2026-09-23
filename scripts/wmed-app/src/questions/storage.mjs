// Never copy anonymous answers into an authenticated account implicitly.
export function questionStorageKey(scope){
 return typeof scope==='string'&&/^[a-f0-9]{64}$/.test(scope)?`wmed:questions:${scope}`:'wmed:questions:guest';
}
