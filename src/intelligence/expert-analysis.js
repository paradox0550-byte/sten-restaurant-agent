import { buildExpertContext } from "../retrieval/context.js";
import { buildAnalysis } from "./engine.js";

/**
 * Checks caller-declared required inputs without treating 0 or false as missing.
 * Requirements are explicit because sufficiency depends on the decision being made.
 */
export function assessInputSufficiency({ required = [], provided = {} } = {}) {
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
 * Compares two decision scenarios only when their measurement bases match.
 * Delta is proposed - baseline; this function does not assume whether a
 * positive delta is good or bad.
 */
export function compareDecisionScenarios({ baseline, proposed } = {}) {
  const fields = ["scope", "period", "currency", "unit"];
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
    currency: baseline.currency,
    unit: baseline.unit,
    period: baseline.period,
    scope: baseline.scope,
    interpretation: "direction_only; positive_is_not_assumed_beneficial",
    sourceIds: [...new Set([...baseline.sourceIds, ...proposed.sourceIds])]
  };
}

/**
 * Orchestrates retrieval, evidence adaptation, input sufficiency and the
 * existing deterministic Intelligence Engine envelope. Narrative diagnosis
 * and causal interpretation remain the responsibility of the host model.
 */
export function buildExpertAnalysis({
  query,
  profile = {},
  knowledge = [],
  registry = { records: [] },
  requiredInputs = [],
  providedInputs = {},
  facts = [],
  hypotheses = [],
  causalLinks = [],
  decisionScenarios = [],
  actions = [],
  limit = 12
} = {}) {
  const retrieval = buildExpertContext({ query, profile, knowledge, registry, limit });
  const sufficiency = assessInputSufficiency({ required: requiredInputs, provided: providedInputs });
  const financialAssessments = decisionScenarios.map(compareDecisionScenarios);
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
  const analysis = buildAnalysis({ context: { query, profile, retrievalStatus: retrieval.status }, evidence, facts, hypotheses, actions });
  const financialIssues = financialAssessments.flatMap((item, index) =>
    item.status === "calculated" ? [] : item.issues.map(issue => `decisionScenarios[${index}]: ${issue}`)
  );
  const ready = retrieval.status === "ok" && sufficiency.sufficient &&
    analysis.readiness === "structured" && financialIssues.length === 0;
  return {
    stage: 12,
    status: ready ? "analysis_ready_for_review" : "analysis_needs_review",
    retrieval,
    sufficiency,
    analysis,
    causalLinks: normalizedCausalLinks,
    financialAssessments,
    integrity: {
      financialIssues,
      retrievalAvailable: retrieval.status === "ok",
      missingInputsBlockDecision: !sufficiency.sufficient,
      causalLinksAreNotProof: true
    },
    readiness: ready ? "reviewable" : "incomplete"
  };
}
