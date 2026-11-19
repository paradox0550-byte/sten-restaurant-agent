import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("procedure library uses the canonical 36-domain map and six complexity levels", () => {
  const register = JSON.parse(fs.readFileSync("knowledge/procedures/procedure-register.json", "utf8"));
  const levels = JSON.parse(fs.readFileSync("knowledge/procedures/complexity-levels.json", "utf8"));
  const sourceCatalog = JSON.parse(fs.readFileSync("knowledge/procedures/horeca-operational-process-catalog.json", "utf8"));
  const procedureCards = JSON.parse(fs.readFileSync("knowledge/procedures/operational-procedures.json", "utf8"));
  const domainMap = JSON.parse(fs.readFileSync("knowledge/taxonomy/restaurant-management-domains.json", "utf8"));
  assert.equal(register.source_catalog.process_count, 77);
  assert.equal(register.source_catalog.items.length, 77);
  assert.equal(register.existing_procedure_cards.count, procedureCards.procedures.length);
  assert.equal(procedureCards.procedures.length, 12);\n  for (const card of procedureCards.procedures) {\n    assert.ok(card.domain_id, card.id + ": missing canonical domain");\n    assert.ok(card.complexity_level >= 1 && card.complexity_level <= 6, card.id + ": invalid complexity level");\n    assert.ok(card.source_traceability.length > 0, card.id + ": missing source traceability");\n    assert.ok(card.stop_conditions.length > 0, card.id + ": missing stop conditions");\n    assert.equal(card.approval_status, "not_approved_for_operational_use");\n    assert.equal(card.unknowns_are_blocking, true);\n  }
  assert.equal(levels.levels.length, 6);
  assert.equal(domainMap.domains.length, 36);
  assert.equal(new Set(domainMap.domains.map(d => d.id)).size, 36);
  assert.equal(register.domains.length, 36);
  for (const item of register.source_catalog.items) {
    assert.ok(sourceCatalog.processes.some(p => p.id === item.process_id), item.process_id + ": source process not found");
    assert.ok(item.complexity_level >= 1 && item.complexity_level <= 6, item.process_id + ": invalid complexity");
    assert.ok(domainMap.domains.some(d => d.id === item.domain_id), item.process_id + ": unknown domain");
    assert.equal(item.source_maturity, "inventory_only", item.process_id + ": source inventory must not be promoted");
    assert.equal(item.procedure_status, "not_yet_decomposed_or_expert_approved", item.process_id + ": inventory item was misrepresented as SOP");
  }
  for (const procedure of register.existing_procedure_cards.items) {
    assert.ok(procedureCards.procedures.some(p => p.id === procedure.procedure_id), procedure.procedure_id + ": procedure card missing");
    assert.ok(procedure.complexity_level >= 1 && procedure.complexity_level <= 6);
  }
  assert.match(register.policy.decomposition, /триггер|trigger/i);
  assert.match(register.policy.readiness, /pilot[-_]verified/);
});
