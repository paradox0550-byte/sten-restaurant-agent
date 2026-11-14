export const RECOVERY_STATES = Object.freeze([
  "reported", "acknowledged", "clarifying", "remedy_proposed",
  "in_progress", "completed_unverified", "verified", "closed", "reopened"
]);

export const ESCALATION_CATEGORIES = Object.freeze([
  "food_safety", "allergen_or_dietary_risk", "injury_or_illness",
  "threat_or_violence", "discrimination_or_harassment", "unresolved_conflict"
]);

export function createRecoveryCase({ category, sourceId, reportedAt, ownerRole }) {
  if (!category || !sourceId || !reportedAt || !ownerRole) {
    return { status: "invalid", reason: "category_source_time_and_owner_required" };
  }
  return {
    status: "created",
    case: {
      category, sourceId, reportedAt, ownerRole,
      state: "reported",
      escalationRequired: ESCALATION_CATEGORIES.includes(category),
      remedy: null,
      evidence: [],
      verifiedAt: null,
    },
  };
}

export function markRecoveryCompleted(caseRecord, evidence = []) {
  if (!caseRecord || !Array.isArray(evidence) || evidence.length === 0) {
    return { status: "unavailable", reason: "completion_evidence_required" };
  }
  return {
    status: "updated",
    case: { ...caseRecord, state: "completed_unverified", evidence },
  };
}

export function verifyRecovery(caseRecord, { verifierRole, verifiedAt, outcomeConfirmed }) {
  if (!caseRecord || !verifierRole || !verifiedAt || outcomeConfirmed !== true) {
    return { status: "unavailable", reason: "independent_verification_details_required" };
  }
  return {
    status: "updated",
    case: { ...caseRecord, state: "verified", verifierRole, verifiedAt },
  };
}
