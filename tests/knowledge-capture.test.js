import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryTenantMemory, captureKnowledge, confirmKnowledge } from "../src/runtime/index.js";

const candidate = {
  id: "capture-1", establishment_id: "restaurant-a", category: "operational_fact",
  entity_key: "hot-kitchen-shift-start", statement: "Горячий цех начинает работу в 10:00.",
  value: { start_time: "10:00" }, source: { type: "user_message", id: "message-101" },
  confidence: 0.98, risk: "low", ambiguous: false, explicit_user_assertion: true, effective_from: "2026-11-16"
};
const clock = () => "2026-11-16T09:00:00.000Z";

test("silently captures explicit, unambiguous, low-risk restaurant assertions", async () => {
  const memory = new InMemoryTenantMemory();
  const r = await captureKnowledge({ tenantId: "tenant-a", candidate, memory, clock });
  assert.equal(r.status, "captured_user_assertion");
  assert.equal(r.item.source.id, "message-101");
  assert.equal(r.item.effective_from, "2026-11-16");
});
test("deduplicates identical facts and does not invent end dates", async () => {
  const memory = new InMemoryTenantMemory();
  await captureKnowledge({ tenantId: "tenant-a", candidate, memory, clock });
  const r = await captureKnowledge({ tenantId: "tenant-a", candidate, memory, clock });
  assert.equal(r.status, "duplicate");
  assert.equal(r.persisted, false);
  assert.equal(r.item.effective_to, null);
});
test("ambiguous facts require confirmation", async () => {
  const r = await captureKnowledge({ tenantId: "tenant-a", candidate: { ...candidate, id: "c2", ambiguous: true }, memory: new InMemoryTenantMemory(), clock });
  assert.equal(r.status, "needs_confirmation");
});
test("conflicting values are preserved rather than overwritten", async () => {
  const memory = new InMemoryTenantMemory();
  await captureKnowledge({ tenantId: "tenant-a", candidate, memory, clock });
  const r = await captureKnowledge({ tenantId: "tenant-a", candidate: { ...candidate, id: "c3", statement: "Горячий цех начинает работу в 09:00.", value: { start_time: "09:00" }, source: { type: "user_message", id: "message-102" } }, memory, clock });
  assert.equal(r.status, "conflict_review");
  assert.deepEqual(r.conflicts, ["capture-1"]);
  const stored = await memory.get({ tenantId: "tenant-a", namespace: "knowledge", key: "restaurant:restaurant-a:operational_fact:hot-kitchen-shift-start" });
  assert.equal(stored.value.items.length, 2);
  assert.equal(stored.value.items[0].value.start_time, "10:00");
});
test("memory remains tenant-isolated", async () => {
  const memory = new InMemoryTenantMemory();
  await captureKnowledge({ tenantId: "tenant-a", candidate, memory, clock });
  const r = await memory.get({ tenantId: "tenant-b", namespace: "knowledge", key: "restaurant:restaurant-a:operational_fact:hot-kitchen-shift-start" });
  assert.equal(r.status, "not_found");
});
test("confirmation preserves original provenance and capture time", async () => {
  const memory = new InMemoryTenantMemory();
  await captureKnowledge({ tenantId: "tenant-a", candidate: { ...candidate, id: "c4", ambiguous: true }, memory, clock });
  const r = await confirmKnowledge({ tenantId: "tenant-a", establishmentId: "restaurant-a", category: "operational_fact", entityKey: candidate.entity_key, itemId: "c4", memory, clock: () => "2026-11-16T10:00:00.000Z" });
  assert.equal(r.status, "confirmed");
  assert.equal(r.item.source.id, "message-101");
  assert.equal(r.item.recorded_at, clock());
});
test("sensitive data are rejected from automatic memory", async () => {
  const r = await captureKnowledge({ tenantId: "tenant-a", candidate: { ...candidate, id: "c5", sensitivity: "health" }, memory: new InMemoryTenantMemory(), clock });
  assert.equal(r.status, "rejected_sensitive");
});
