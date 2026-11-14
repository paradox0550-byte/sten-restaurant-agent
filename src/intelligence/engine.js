/**
 * STEN Intelligence Engine v0.4
 * Deterministic orchestration and evidence guardrails. It does not replace an LLM,
 * legal professional, accountant, or restaurant operator.
 */

const EVIDENCE_CLASSES = new Set([
  'CORE', 'LAW', 'RESEARCH', 'INDUSTRY', 'PRACTICE', 'TREND', 'HYPOTHESIS', 'CONFIGURATION'
]);
const FACT_STATUSES = new Set(['observed', 'calculated', 'interpreted', 'hypothesis', 'unknown']);

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
    if (item?.class === 'LAW' && !item?.jurisdiction) issues.push(`${prefix}: LAW requires jurisdiction`);
    if (item?.class === 'LAW' && !item?.effectiveStatus) issues.push(`${prefix}: LAW requires effective status`);
  }
  return { valid: issues.length === 0, issues, evidenceIds: [...ids] };
}

export function validateFacts(facts = [], evidence = []) {
  const evidenceIds = new Set(evidence.map(x => x.id));
  const issues = [];
  for (const [index, fact] of facts.entries()) {
    if (!fact?.id) issues.push(`facts[${index}]: missing id`);
    if (!FACT_STATUSES.has(fact?.status)) issues.push(`facts[${index}]: invalid status`);
    if (fact?.status === 'observed' && (!fact.sourceIds?.length || fact.sourceIds.some(id => !evidenceIds.has(id)))) {
      issues.push(`facts[${index}]: observed fact must reference known evidence`);
    }
    if (fact?.status === 'calculated' && (!fact.formula || !fact.inputIds?.length)) {
      issues.push(`facts[${index}]: calculation must include formula and inputIds`);
    }
    if (fact?.value === null || fact?.value === undefined) {
      if (fact?.status !== 'unknown') issues.push(`facts[${index}]: missing value must be marked unknown`);
    }
    if (fact?.unit && !fact?.period && fact?.metric?.toLowerCase().includes('rate')) {
      issues.push(`facts[${index}]: rate metric requires a period`);
    }
  }
  return { valid: issues.length === 0, issues };
}

export function assessLegalApplicability(requirement, profile = {}) {
  const missing = (requirement.requiredProfileFields ?? []).filter(key =>
    profile[key] === undefined || profile[key] === null || profile[key] === ''
  );
  if (!requirement.jurisdiction || !requirement.source || !requirement.effectiveStatus) {
    return { status: 'requires_source_verification', applicable: null, missingFields: missing,
      reason: 'Legal source, jurisdiction, or effective status is incomplete.' };
  }
  if (requirement.effectiveStatus !== 'in_force') {
    return { status: 'requires_source_verification', applicable: null, missingFields: missing,
      reason: 'The legal act is not confirmed as currently in force.' };
  }
  if (missing.length) {
    return { status: 'cannot_determine', applicable: null, missingFields: missing,
      reason: 'Required establishment profile data are missing.' };
  }
  if (typeof requirement.appliesWhen !== 'function') {
    return { status: 'specialist_review', applicable: null, missingFields: [],
      reason: 'No validated applicability rule is registered.' };
  }
  return { status: 'assessed', applicable: Boolean(requirement.appliesWhen(profile)), missingFields: [],
    reason: 'Applicability evaluated using the registered rule; this is not a compliance certificate.' };
}

const DOMAIN_LINKS = {
  revenue: ['menu', 'service', 'marketing', 'operations'],
  food_cost: ['menu', 'procurement', 'production', 'waste', 'inventory'],
  labor_cost: ['staffing', 'schedule', 'productivity', 'service', 'training'],
  prime_cost: ['food_cost', 'labor_cost', 'procurement', 'production', 'staffing'],
  guest_experience: ['service', 'staffing', 'training', 'operations'],
  safety: ['legal', 'facilities', 'training', 'operations'],
  compliance: ['legal', 'facilities', 'training', 'operations']
};

export function getCrossDomainLinks(problemDomain) {
  return DOMAIN_LINKS[problemDomain] ?? [];
}

/**
 * Builds an auditable analysis envelope. The reasoning narrative is supplied by
 * the provider model; this function enforces evidence boundaries and required steps.
 */
export function buildAnalysis({ context = {}, evidence = [], facts = [], hypotheses = [], actions = [] } = {}) {
  const evidenceCheck = validateEvidence(evidence);
  const factCheck = validateFacts(facts, evidence);
  const knownFacts = facts.filter(x => x.status === 'observed' || x.status === 'calculated');
  const unknowns = facts.filter(x => x.status === 'unknown' || x.value == null);
  const unsupportedHypotheses = hypotheses.filter(h => !h.label || h.label !== 'HYPOTHESIS');
  const actionIssues = [];
  for (const [i, action] of actions.entries()) {
    if (!action.ownerRole) actionIssues.push(`actions[${i}]: missing ownerRole`);
    if (!action.verificationMetric) actionIssues.push(`actions[${i}]: missing verificationMetric`);
    if (!action.dueOrTiming) actionIssues.push(`actions[${i}]: missing dueOrTiming`);
  }
  return {
    engineVersion: '0.4.0',
    context,
    integrity: {
      evidenceValid: evidenceCheck.valid,
      factStructureValid: factCheck.valid,
      evidenceIssues: evidenceCheck.issues,
      factIssues: factCheck.issues,
      actionIssues,
      unsupportedHypotheses: unsupportedHypotheses.map(h => h.id ?? h.text ?? 'unnamed')
    },
    evidence,
    confirmed: knownFacts,
    hypotheses: hypotheses.map(h => ({ ...h, label: 'HYPOTHESIS' })),
    unknowns,
    actions,
    readiness: evidenceCheck.valid && factCheck.valid && actionIssues.length === 0 && unsupportedHypotheses.length === 0
      ? 'structured' : 'needs_review'
  };
}
