import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const methods = [
  ["financial-control.md", "method.financial-control", "draft_for_finance_expert_review"],
  ["fot-and-labor-control.md", "method.fot-labor-control", "draft_for_hr_payroll_expert_review"],
  ["stock-control.md", "method.stock-control", "draft_for_inventory_and_accounting_review"],
  ["purchasing-control.md", "method.purchasing-control", "draft_for_procurement_expert_review"],
  ["production-control.md", "method.production-control", "draft_for_chef_and_food-safety_review"],
  ["service-management.md", "method.service-management", "draft_for_service_expert_review"],
  ["safety-and-compliance.md", "method.safety-compliance", "draft_for_safety_and_legal_review"],
  ["people-management.md", "method.people-management", "draft_for_hr_and_operations_review"],
  ["director-management-system.md", "method.director-management-system", "draft_for_director_and_owner_review"]
];

test("nine standalone restaurant management methods have independent contracts and explicit draft maturity", () => {
  for (const [file, id, status] of methods) {
    const content = fs.readFileSync(path.join("knowledge/methodologies", file), "utf8");
    assert.ok(content.includes(id), file + ": method id missing");
    assert.ok(content.includes(status), file + ": review status missing");
    for (const heading of [/^## Назначение\\b/m, /^## Источники\\b/m, /^## Приёмочные сценарии\\b/m, /^## Валидация\\b/m]) {
      assert.match(content, heading, file + ": required section missing: " + heading);
    }
    assert.match(content, /unknown|неизвестн|unavailable/i, file + ": missing-data guardrail missing");
    assert.match(content, /приёмочн|сценари/i, file + ": no acceptance scenarios");
  }
});
