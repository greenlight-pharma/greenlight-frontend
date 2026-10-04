// Recreate only rejected lazy resources. Successful and pending components keep their identity.
export function createModuleRegistry(makeLazy) {
  const entries = new Set();
  return {
    register(load) {
      const entry = { failed: false, component: null };
      const create = () => makeLazy(() => Promise.resolve().then(load).catch(error => {
        entry.failed = true;
        throw error;
      }));
      entry.component = create();
      entry.reset = () => { if (!entry.failed) return false; entry.failed = false; entry.component = create(); return true; };
      entries.add(entry);
      return entry;
    },
    retryFailed() { let count = 0; for (const entry of entries) if (entry.reset()) count++; return count; },
  };
}
