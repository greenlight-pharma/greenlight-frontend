import test from "node:test";
import assert from "node:assert/strict";
import {
  loadProgress,
  saveProgress,
  cleanProgress,
} from "../shared/progress.mjs";
test("progress is isolated per opaque account, stores only score/date, handles malformed storage", () => {
  const map = new Map(),
    store = { getItem: (k) => map.get(k), setItem: (k, v) => map.set(k, v) },
    a = "a".repeat(64),
    b = "b".repeat(64);
  assert.equal(
    saveProgress(store, a, [
      {
        score: 75,
        date: "2026-09-23",
        relato: "must not be stored",
        email: "private",
      },
    ]),
    true,
  );
  assert.deepEqual(loadProgress(store, a), [{ score: 75, date: "2026-09-23" }]);
  assert.deepEqual(loadProgress(store, b), []);
  assert.ok(![...map.values()][0].includes("private"));
  assert.deepEqual(cleanProgress([{ score: 101, date: "2026-09-23" }]), []);
  assert.equal(saveProgress(store, undefined, []), false);
  assert.deepEqual(loadProgress({ getItem: () => "{invalid" }, a), []);
});
