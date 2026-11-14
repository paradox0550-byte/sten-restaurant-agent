import { buildExpertContext } from "../retrieval/context.js";
import { calculateCostRatios } from "../finance/ratios.js";

/**
 * STEN Expert Intelligence Core.
 * One deterministic control plane for retrieval, evidence, diagnosis,
 * financial comparisons and recommendation integrity. Narrative reasoning
 * remains with the host model; this module enforces its evidence contract.
 */

const EVIDENCE_CLASSES = new Set([
  "CORE", "LAW", "RESEARCH", "INDUSTRY", "PRACTICE", "TREND", "HYPOTHESIS", "CONFIGURATION"
]);
const FACT_STATUSES = new Set(["observed", "calculated", "interpreted", "hypothesis", "unknown"]);
const EMPTY_REGISTRY = Object.freeze({ records: [] });

export function validateEvidence(evidence = []) {
  const issues = [];
  const ids = new Set();
  for (const [index, item] of evidence.entries()) {
    const prefix = `evidence[${index}]`;
    if (!item?.id) issues.push(`${prefix}: missing id`);
    else if (ids.has(item.id)) issues.push(`${prefix}: duplicate id ${item.id}`);
    else ids.add(item.id);
    if (!EVIDENCE_CLASSES.has(item?.class)) issues.push(`${prefix}: invalid evidence class`);
    if (!item?.source) issues.push(`${prefix}: missing source`);
    if (!item?.scope) issues.push(`${prefix}: missing scope/geography`);
    if (!item?.date) issues.push(`${prefix}: missing publication/effective date`);
    if (item?.class === "LAW" && !item?.jurisdiction) issues.push(`${prefix}: LAW requires jurisdiction`);
    if (item?.class === "LAW" && !item?.effectiveStatus) issues.push(`${prefix}: LAW requires effective status`);
  }
  return { valid: issues.length === 0, issues, evidenceIds: [...ids] };
}

export function validateFacts(facts = [], evidence = []) {
  const evidenceIds = new Set(evidence.map(x => x.id));
  const factIds = new Set(facts.map(x => x.id).filter(Boolean));
  const issues = [];
  for (const [index, fact] of facts.entries()) {
    const prefix = `facts[${index}]`;
    if (!fact?.id) issues.push(`${prefix}: missing id`);
    if (!FACT_STATUSES.has(fact?.status)) issues.push(`${prefix}: invalid status`);
    if (fact?.status === "observed" && (!fact.sourceIds?.length || fact.sourceIds.some(id => !evidenceIds.has(id)))) {
      issues.push(`${prefix}: observed fact must reference known evidence`);
    }
    if (fact?.status === "calculated") {
      if (!fact.formula || !fact.inputIds?.length) issues.push(`${prefix}: calculation must include formula and inputIds`);
      else if (fact.inputIds.some(id => !factIds.has(id) && !evidenceIds.has(id))) {
        issues.push(`${prefix}: calculation inputIds must reference known facts or evidence`);
      }
    }
    if (fact?.value === null || fact?.value === undefined) {
      if (fact?.status !== "unknown") issues.push(`${prefix}: missing value must be marked unknown`);
    }
    if (fact?.unit && !fact?.period && fact?.metric?.toLowerCase().includes("rate")) {
      issues.push(`${prefix}: rate metric requires a period`);
    }
  }
  return { valid: issues.length === 0, issues };
}

export function assessLegalApplicability(requirement, profile = {}) {
  const missing = (requirement.requiredProfileFields ?? []).filter(key =>
    profile[key] === undefined || profile[key] === null || profile[key] === ""
  );
  if (!requirement.jurisdiction || !requirement.source || !requirement.effectiveStatus) {
    return { status: "requires_source_verification", applicable: null, missingFields: missing,
      reason: "Legal source, jurisdiction, or effective status is incomplete." };
  }
  if (requirement.effectiveStatus !== "in_force") {
    return { status: "requires_source_verification", applicable: null, missingFields: missing,
      reason: "The legal act is not confirmed as currently in force." };
  }
  if (missing.length) {
    return { status: "cannot_determine", applicable: null, missingFields: missing,
      reason: "Required establishment profile data are missing." };
  }
  if (typeof requirement.appliesWhen !== "function") {
    return { status: "specialist_review", applicable: null, missingFields: [],
      reason: "No validated applicability rule is registered." };
  }
  return { status: "assessed", applicable: Boolean(requirement.appliesWhen(profile)), missingFields: [],
    reason: "Applicability evaluated using the registered rule; this is not a compliance certificate." };
}

const DOMAIN_LINKS = {
  revenue: ["menu", "service", "marketing", "operations"],
  food_cost: ["menu", "procurement", "production", "waste", "inventory"],
  labor_cost: ["staffing", "schedule", "productivity", "service", "training"],
  prime_cost: ["food_cost", "labor_cost", "procurement", "production", "staffing"],
  guest_experience: ["service", "staffing", "training", "operations"],
  safety: ["legal", "facilities", "training", "operations"],
  compliance: ["legal", "facilities", "training", "operations"]
};

export function getCrossDomainLinks(problemDomain) {
  return DOMAIN_LINKS[problemDomain] ?? [];
}

/** Empty requirement lists mean sufficiency was not assessed, not that data are sufficient. */
export function assessInputSufficiency({ required = [], provided = {} } = {}) {
  if (!Array.isArray(required) || required.length === 0) {
    return { status: "not_assessed", sufficient: null, required: [], present: [], missing: [] };
  }
  const missing = [];
  const present = [];
  for (const key of required) {
    const value = provided[key];
    const isMissing = value === undefined || value === null ||
      (typeof value === "string" && value.trim() === "");
    (isMissing ? missing : present).push(key);
  }
  return {
    sufficient: missing.length === 0,
    status: missing.length === 0 ? "sufficient" : "insufficient",
    required: [...required],
    present,
    missing
  };
}

/**
 * Compares two sourced values only when their full declared measurement basis
 * matches. Delta is proposed minus baseline; its desirability is not inferred.
 */
export function compareDecisionScenarios({ baseline, proposed } = {}) {
  const fields = ["metric", "definition", "scope", "period", "currency", "unit"];
  const issues = [];
  for (const [name, scenario] of [["baseline", baseline], ["proposed", proposed]]) {
    if (!scenario || !Number.isFinite(scenario.value)) issues.push(`${name}: finite value required`);
    if (!scenario?.sourceIds?.length) issues.push(`${name}: sourceIds required`);
    for (const field of fields) {
      if (scenario?.[field] === undefined || scenario?.[field] === null || scenario?.[field] === "") {
        issues.push(`${name}: ${field} required`);
      }
    }
  }
  if (issues.length) return { status: "insufficient_data", issues, delta: null };
  const mismatches = fields.filter(field => baseline[field] !== proposed[field]);
  if (mismatches.length) {
    return { status: "incompatible_basis", issues: mismatches.map(x => `scenario basis mismatch: ${x}`), delta: null };
  }
  return {
    status: "calculated",
    formula: "proposed.value - baseline.value",
    baseline: { ...baseline },
    proposed: { ...proposed },
    delta: proposed.value - baseline.value,
    metric: baseline.metric,
    currency: baseline.currency,
    unit: baseline.unit,
    period: baseline.period,
    scope: baseline.scope,
    interpretation: "direction_only; positive_is_not_assumed_beneficial",
    sourceIds: [...new Set([...baseline.sourceIds, ...proposed.sourceIds])]
  };
}

function buildAnalysisEnvelope({ context = {}, evidence = [], facts = [], hypotheses = [], actions = [] } = {}) {
  const evidenceCheck = validateEvidence(evidence);
  const factCheck = validateFacts(facts, evidence);
  const knownFacts = facts.filter(x => x.status === "observed" || x.status === "calculated");
  const unknowns = facts.filter(x => x.status === "unknown" || x.value == null);
  const unsupportedHypotheses = hypotheses.filter(h => !h.label || h.label !== "HYPOTHESIS");
  const actionIssues = [];
  for (const [i, action] of actions.entries()) {
    if (!action.ownerRole) actionIssues.push(`actions[${i}]: missing ownerRole`);
    if (!action.verificationMetric) actionIssues.push(`actions[${i}]: missing verificationMetric`);
    if (!action.dueOrTiming) actionIssues.push(`actions[${i}]: missing dueOrTiming`);
  }
  const ready = evidenceCheck.valid && factCheck.valid && actionIssues.length === 0 && unsupportedHypotheses.length === 0;
  return {
    engineVersion: "0.5.0",
    context,
    integrity: {
      evidenceValid: evidenceCheck.valid,
      factStructureValid: factCheck.valid,
      evidenceIssues: evidenceCheck.issues,
      factIssues: factCheck.issues,
      actionIssues,
      unsupportedHypotheses: unsupportedHypotheses.map(h => h.id ?? h.text ?? "unnamed")
    },
    evidence,
    confirmed: knownFacts,
    hypotheses: hypotheses.map(h => ({ ...h, label: "HYPOTHESIS" })),
    unknowns,
    actions,
    readiness: ready ? "structured" : "needs_review"
  };
}

/**
 * Backward-compatible entry into the same expert core for workflow callers
 * that already supply a prepared analysis envelope.
 */
export function buildAnalysis(input = {}) {
  return buildAnalysisEnvelope(input);
}

/**
 * Canonical Stage 12 entry point: retrieve -> govern evidence -> assess inputs
 * -> structure diagnosis -> compare sourced financial scenarios -> gate actions.
 * The host model supplies narrative reasoning; no facts or causes are invented here.
 */
export function buildExpertAnalysis({
  query,
  profile = {},
  knowledge = [],
  registry = EMPTY_REGISTRY,
  requiredInputs = [],
  providedInputs = {},
  facts = [],
  hypotheses = [],
  causalLinks = [],
  decisionScenarios = [],
  financialInputs = null,
  actions = [],
  limit = 12
} = {}) {
  const retrieval = buildExpertContext({ query, profile, knowledge, registry, limit });
  const sufficiency = assessInputSufficiency({ required: requiredInputs, provided: providedInputs });
  const financialAssessments = decisionScenarios.map(compareDecisionScenarios);
  const financialRatios = financialInputs && typeof financialInputs === "object"
    ? calculateCostRatios(financialInputs)
    : null;
  const normalizedCausalLinks = causalLinks.map((link, index) => ({
    ...link,
    id: link.id ?? `causal-hypothesis-${index + 1}`,
    label: "HYPOTHESIS",
    verificationRequired: true
  }));
  const retrievedEvidence = retrieval.status === "ok"
    ? retrieval.evidence.filter(item => item.adaptedEvidence).map(item => item.adaptedEvidence)
    : [];
  const suppliedEvidence = Array.isArray(providedInputs.evidence) ? providedInputs.evidence : [];
  const evidenceById = new Map([...retrievedEvidence, ...suppliedEvidence].map(item => [item.id, item]));
  const evidence = [...evidenceById.values()];
  const allHypotheses = [...hypotheses, ...normalizedCausalLinks];
  const analysis = buildAnalysisEnvelope({
    context: { query: query ?? null, profile, retrievalStatus: retrieval.status },
    evidence, facts, hypotheses: allHypotheses, actions
  });
  const financialIssues = financialAssessments.flatMap((item, index) =>
    item.status === "calculated" ? [] : item.issues.map(issue => `decisionScenarios[${index}]: ${issue}`)
  );
  const inputsAssessed = sufficiency.status !== "not_assessed";
  const ratioIssues = financialRatios
    ? Object.entries(financialRatios).filter(([key, value]) => key !== "definitions" && value.status !== "calculated").map(([key, value]) => `${key}: ${value.reason ?? "unavailable"}`)
    : [];
  const ready = retrieval.status === "ok" && inputsAssessed && sufficiency.sufficient &&
    analysis.readiness === "structured" && financialIssues.length === 0 && ratioIssues.length === 0;
  return {
    stage: 12,
    engineVersion: analysis.engineVersion,
    status: ready ? "analysis_ready_for_review" : "analysis_needs_review",
    retrieval,
    sufficiency,
    analysis,
    causalLinks: normalizedCausalLinks,
    financialAssessments,
    financialRatios,
    recommendations: analysis.actions,
    integrity: {
      financialIssues,
      ratioIssues,
      retrievalAvailable: retrieval.status === "ok",
      missingInputsBlockDecision: sufficiency.status === "insufficient",
      inputSufficiencyAssessed: inputsAssessed,
      causalLinksAreNotProof: true
    },
    readiness: ready ? "reviewable" : "incomplete"
  };
}
