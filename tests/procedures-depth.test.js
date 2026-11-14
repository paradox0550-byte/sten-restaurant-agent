import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

test("operational procedures have traceable sources, owners, cadence and verification", () => {
  const data = read("../knowledge/procedures/operational-procedures.json");
  assert.ok(data.procedures.length >= 10);
  for (const procedure of data.procedures) {
    assert.ok(procedure.id && procedure.title && procedure.domain);
    assert.ok(procedure.source_ids.length > 0);
    assert.ok(procedure.owner.role && procedure.owner.status);
    assert.ok(procedure.cadence.value && procedure.cadence.status);
    assert.ok(procedure.steps.length > 0);
    assert.ok(procedure.checklist_id);
    assert.ok(procedure.verification.length > 0);
    assert.ok(procedure.unspecified);
  }
});

test("checklists preserve unknown and not-applicable as distinct states", () => {
  const data = read("../knowledge/procedures/checklist-templates.json");
  assert.ok(data.templates.length >= 10);
  for (const checklist of data.templates) {
    assert.deepEqual(new Set(checklist.status_semantics), new Set(["done", "not_done", "not_applicable", "unknown"]));
    assert.ok(checklist.items.length > 0);
  }
});

test("multi-hop cases include expected paths and unsupported-claim guardrails", () => {
  const data = read("../evals/horeca-multihop-cases.json");
  assert.ok(data.cases.length >= 5);
  for (const item of data.cases) {
    assert.ok(item.expected_path.length >= 3);
    assert.ok(item.must_require.length > 0);
    assert.ok(item.must_not_claim.length > 0);
  }
});
