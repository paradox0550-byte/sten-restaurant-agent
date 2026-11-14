import test from "node:test";
import assert from "node:assert/strict";
import {
  assessInputSufficiency,
  compareDecisionScenarios,
  buildExpertAnalysis
} from "../src/intelligence/expert-analysis.js";

test("input sufficiency treats zero and false as provided values", () => {
  const result = assessInputSufficiency({
    required: ["revenue", "hasTerrace", "period"],
    provided: { revenue: 0, hasTerrace: false, period: "2026-10" }
  });
  assert.equal(result.sufficient, true);
  assert.deepEqual(result.missing, []);
});

test("input sufficiency reports absent values without converting them to zero", () => {
  const result = assessInputSufficiency({
    required: ["revenue", "period"],
    provided: { revenue: null }
  });
  assert.equal(result.sufficient, false);
  assert.deepEqual(result.missing, ["revenue", "period"]);
});

test("decision comparison calculates delta only on a compatible, sourced basis", () => {
  const baseline = { value: 1000, scope: "restaurant", period: "2026-10", currency: "EUR", unit: "EUR", sourceIds: ["actuals"] };
  const proposed = { ...baseline, value: 850, sourceIds: ["approved-plan"] };
  const result = compareDecisionScenarios({ baseline, proposed });
  assert.equal(result.status, "calculated");
  assert.equal(result.delta, -150);
  assert.equal(result.interpretation, "direction_only; positive_is_not_assumed_beneficial");
});

test("decision comparison refuses mismatched periods and missing source lineage", () => {
  const baseline = { value: 1000, scope: "restaurant", period: "2026-10", currency: "EUR", unit: "EUR", sourceIds: ["actuals"] };
  const proposed = { ...baseline, value: 900, period: "2026-11", sourceIds: [] };
  const result = compareDecisionScenarios({ baseline, proposed });
  assert.notEqual(result.status, "calculated");
  assert.equal(result.delta, null);
});

test("expert analysis preserves causal links as hypotheses and blocks incomplete inputs", () => {
  const result = buildExpertAnalysis({
    query: "Why did labor cost rise?",
    requiredInputs: ["period", "paidPayroll", "revenue"],
    providedInputs: { period: "2026-10", paidPayroll: 120000 },
    causalLinks: [{ from: "schedule", to: "labor_cost", text: "Schedule mismatch may contribute" }]
  });
  assert.equal(result.status, "analysis_needs_review");
  assert.deepEqual(result.sufficiency.missing, ["revenue"]);
  assert.equal(result.causalLinks[0].label, "HYPOTHESIS");
  assert.equal(result.integrity.causalLinksAreNotProof, true);
});
