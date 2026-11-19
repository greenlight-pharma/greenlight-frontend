import test from 'node:test';
import assert from 'node:assert/strict';
import { createModuleRegistry } from '../shared/module-retry.mjs';
const makeLazy = load => ({ load });
test('failed module retries on request, preserving successful and pending identities', async () => {
 const registry = createModuleRegistry(makeLazy); let attempts = 0, resolve;
 const bad = registry.register(async () => { if (++attempts === 1) throw Error('offline'); return { default: 'ready' }; });
 const good = registry.register(async () => ({ default: 'loaded' }));
 const pending = registry.register(() => new Promise(r => { resolve = r; }));
 const initial = [bad.component, good.component, pending.component];
 await good.component.load(); const wait = pending.component.load();
 await assert.rejects(bad.component.load(), /offline/);
 assert.equal(attempts, 1); assert.equal(registry.retryFailed(), 1);
 assert.notEqual(bad.component, initial[0]); assert.equal(good.component, initial[1]); assert.equal(pending.component, initial[2]);
 assert.deepEqual(await bad.component.load(), { default: 'ready' });
 assert.equal(registry.retryFailed(), 0); resolve({ default: 'pending ready' }); await wait;
});
test('sync failures and repeated rejection stay contained without an automatic loop', async () => {
 const registry = createModuleRegistry(makeLazy); let calls = 0;
 const failed = registry.register(() => { calls++; throw Error('unavailable'); });
 await assert.rejects(failed.component.load()); assert.equal(calls,1);
 registry.retryFailed(); assert.equal(calls,1);
 await assert.rejects(failed.component.load()); assert.equal(calls,2);
 assert.equal(registry.retryFailed(),1);
});
