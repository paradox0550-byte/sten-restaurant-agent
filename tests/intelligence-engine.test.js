import test from "node:test";
import assert from "node:assert/strict";
import {
  validateEvidence, validateFacts, assessLegalApplicability, getCrossDomainLinks,
  buildAnalysis, assessInputSufficiency, compareDecisionScenarios, buildExpertAnalysis
} from "../src/intelligence/engine.js";

const law = { id: "law-1", class: "LAW", source: "Official legal publication", scope: "national", jurisdiction: "RU", date: "2026-01-01", effectiveStatus: "in_force" };

test("evidence validation requires jurisdiction and effective status for law", () => {
  assert.equal(validateEvidence([law]).valid, true);
  assert.equal(validateEvidence([{ ...law, jurisdiction: undefined }]).valid, false);
});

test("observed facts require traceable source and unknown is not zero", () => {
  assert.equal(validateFacts([{ id: "f1", status: "observed", value: 12, sourceIds: ["law-1"] }], [law]).valid, true);
  assert.equal(validateFacts([{ id: "f2", status: "observed", value: 0 }], [law]).valid, false);
  assert.equal(validateFacts([{ id: "f3", status: "unknown", value: null }], [law]).valid, true);
});

test("calculated facts must trace inputs to known facts or evidence", () => {
  assert.equal(validateFacts([{ id: "f1", status: "calculated", value: 2, formula: "a / b", inputIds: ["law-1"] }], [law]).valid, true);
  assert.equal(validateFacts([{ id: "f2", status: "calculated", value: 2, formula: "a / b", inputIds: ["missing"] }], [law]).valid, false);
});

test("legal applicability remains unknown when profile data are missing", () => {
  const req = { jurisdiction: "RU", source: "Official act", effectiveStatus: "in_force", requiredProfileFields: ["hasGas"], appliesWhen: p => p.hasGas === true };
  assert.equal(assessLegalApplicability(req, {}).status, "cannot_determine");
  assert.equal(assessLegalApplicability(req, { hasGas: false }).applicable, false);
});

test("cross-domain mapping connects labor cost with operational drivers", () => {
  assert.ok(getCrossDomainLinks("labor_cost").includes("productivity"));
  assert.deepEqual(getCrossDomainLinks("not-a-domain"), []);
});

test("analysis envelope flags incomplete actions and unsupported hypotheses", () => {
  const result = buildAnalysis({ evidence: [law], facts: [{ id: "f1", status: "observed", value: 1, sourceIds: ["law-1"] }], hypotheses: [{ id: "h1", label: "HYPOTHESIS", text: "Possible driver" }], actions: [{ ownerRole: "Manager", dueOrTiming: "Next shift", verificationMetric: "Repeat issue count" }] });
  assert.equal(result.readiness, "structured");
  const incomplete = buildAnalysis({ actions: [{ ownerRole: "Manager" }] });
  assert.equal(incomplete.readiness, "needs_review");
});

test("input sufficiency treats zero and false as present", () => {
  const result = assessInputSufficiency({ required: ["revenue", "hasTerrace", "period"], provided: { revenue: 0, hasTerrace: false, period: "2026-10" } });
  assert.equal(result.sufficient, true);
  assert.deepEqual(result.missing, []);
});

test("empty required-input list is unassessed, not sufficient", () => {
  assert.equal(assessInputSufficiency().status, "not_assessed");
});

test("input sufficiency reports missing values without converting them to zero", () => {
  const result = assessInputSufficiency({ required: ["revenue", "period"], provided: { revenue: null } });
  assert.equal(result.sufficient, false);
  assert.deepEqual(result.missing, ["revenue", "period"]);
});

test("scenario comparison requires source lineage and identical metric basis", () => {
  const baseline = { value: 1000, metric: "labor_cost", definition: "paid payroll", scope: "restaurant", period: "2026-10", currency: "EUR", unit: "EUR", sourceIds: ["actuals"] };
  const proposed = { ...baseline, value: 850, sourceIds: ["approved-plan"] };
  const result = compareDecisionScenarios({ baseline, proposed });
  assert.equal(result.status, "calculated");
  assert.equal(result.delta, -150);
  assert.equal(result.interpretation, "direction_only; positive_is_not_assumed_beneficial");
});

test("scenario comparison refuses mismatched periods and missing source lineage", () => {
  const baseline = { value: 1000, metric: "labor_cost", definition: "paid payroll", scope: "restaurant", period: "2026-10", currency: "EUR", unit: "EUR", sourceIds: ["actuals"] };
  const proposed = { ...baseline, value: 900, period: "2026-11", sourceIds: [] };
  const result = compareDecisionScenarios({ baseline, proposed });
  assert.notEqual(result.status, "calculated");
  assert.equal(result.delta, null);
});

test("single expert core integrates retrieval, evidence, sufficiency, diagnosis and recommendations", () => {
  const result = buildExpertAnalysis({
    query: "labor cost payroll",
    profile: { sector: "restaurant", format: "casual dining", jurisdiction: "DE" },
    knowledge: [{ id: "k1", title: "Labor cost payroll", text: "Payroll and labor cost controls", topics: ["labor"] }],
    requiredInputs: ["period", "paidPayroll", "revenue"],
    providedInputs: { period: "2026-10", paidPayroll: 120000 },
    causalLinks: [{ from: "schedule", to: "labor_cost", text: "Schedule mismatch may contribute" }],
    actions: [{ ownerRole: "Manager", dueOrTiming: "Next review", verificationMetric: "Payroll variance" }]
  });
  assert.equal(result.status, "analysis_needs_review");
  assert.deepEqual(result.sufficiency.missing, ["revenue"]);
  assert.equal(result.causalLinks[0].label, "HYPOTHESIS");
  assert.equal(result.analysis.hypotheses[0].label, "HYPOTHESIS");
  assert.equal(result.integrity.causalLinksAreNotProof, true);
  assert.equal(result.recommendations.length, 1);
});

test("expert core does not claim readiness when input requirements were not declared", () => {
  const result = buildExpertAnalysis({ query: "restaurant operations" });
  assert.equal(result.sufficiency.status, "not_assessed");
  assert.equal(result.readiness, "incomplete");
});

test("expert core delegates restaurant ratios to the existing finance calculator", () => {
  const result = buildExpertAnalysis({
    query: "food cost analysis",
    requiredInputs: ["period"],
    providedInputs: { period: "2026-10" },
    financialInputs: { revenue: 1000, cogs: 300, kitchenRevenue: 700, kitchenCogs: 210, labor: 250 }
  });
  assert.equal(result.financialRatios.cogsShare.value, 0.3);
  assert.equal(result.financialRatios.kitchenFoodCost.value, 0.3);
  assert.equal(result.financialRatios.laborCost.value, 0.25);
  assert.equal(result.financialRatios.primeCost.value, 0.55);
});

test("expert core preserves unavailable financial ratios instead of assuming missing inputs are zero", () => {
  const result = buildExpertAnalysis({
    query: "food cost analysis",
    requiredInputs: ["period"],
    providedInputs: { period: "2026-10" },
    financialInputs: { revenue: 1000, cogs: null, kitchenRevenue: 700, kitchenCogs: 210, labor: 250 }
  });
  assert.equal(result.financialRatios.cogsShare.status, "unavailable");
  assert.equal(result.financialRatios.primeCost.status, "unavailable");
  assert.equal(result.readiness, "incomplete");
});

test("expert analysis does not let optional unavailable ratios block an unrelated decision", () => {
  const result = buildExpertAnalysis({
    query: "shift handover control",
    knowledge: [{ id: "k-shift", title: "Shift handover control", text: "Shift handover checklist unresolved issues and manager review", topics: ["shift"] }],
    requiredInputs: ["period"],
    providedInputs: { period: "2026-10" },
    financialInputs: { revenue: 1000, cogs: null, kitchenRevenue: 700, kitchenCogs: null, labor: null },
    actions: [{ ownerRole: "Manager", dueOrTiming: "Next shift", verificationMetric: "handover completion" }]
  });
  assert.equal(result.financialRatios.cogsShare.status, "unavailable");
  assert.equal(result.readiness, "reviewable");
  assert.deepEqual(result.integrity.ratioIssues, []);
});

test("expert analysis blocks a declared required financial metric that is unavailable", () => {
  const result = buildExpertAnalysis({
    query: "food cost analysis",
    knowledge: [{ id: "k-fin", title: "Food cost", text: "Kitchen revenue and kitchen COGS food cost", topics: ["finance"] }],
    requiredInputs: ["period"],
    providedInputs: { period: "2026-10" },
    financialInputs: { revenue: 1000, cogs: 300, kitchenRevenue: 700, kitchenCogs: null, labor: 250 },
    requiredFinancialMetrics: ["kitchenFoodCost"],
    actions: [{ ownerRole: "Manager", dueOrTiming: "Before menu approval", verificationMetric: "Food cost %" }]
  });
  assert.equal(result.readiness, "incomplete");
  assert.ok(result.integrity.ratioIssues.some(issue => issue.includes("kitchenFoodCost")));
});
