const unique = (items) => new Set(items).size === items.length;

export function evaluateKnowledgeQuality({ procedures, checklists, registers, sources, graph, sectorMatrix }) {
  const issues = [];
  const sourceIds = new Set(sources.sources.map((item) => item.id));
  const procedureIds = new Set(procedures.procedures.map((item) => item.id));
  const checklistIds = new Set(checklists.templates.map((item) => item.id));
  const registerIds = new Set(registers.templates.map((item) => item.id));
  const nodeIds = new Set(graph.nodes.map((item) => item.id));

  if (!unique(procedures.procedures.map((item) => item.id))) issues.push("duplicate_procedure_ids");
  if (!unique(checklists.templates.map((item) => item.id))) issues.push("duplicate_checklist_ids");
  if (!unique(registers.templates.map((item) => item.id))) issues.push("duplicate_register_ids");

  for (const procedure of procedures.procedures) {
    if (!procedure.source_ids?.length) issues.push(`procedure_without_source:${procedure.id}`);
    for (const id of procedure.source_ids ?? []) if (!sourceIds.has(id)) issues.push(`unknown_source:${procedure.id}:${id}`);
    if (!checklistIds.has(procedure.checklist_id)) issues.push(`missing_checklist:${procedure.id}`);
    if (!procedure.owner?.role || !procedure.owner?.status) issues.push(`owner_provenance_missing:${procedure.id}`);
    if (!procedure.cadence?.status || !procedure.cadence?.value) issues.push(`cadence_provenance_missing:${procedure.id}`);
    if (!Array.isArray(procedure.unspecified)) issues.push(`unknowns_not_declared:${procedure.id}`);
  }
  for (const checklist of checklists.templates) {
    if (!procedureIds.has(checklist.procedure_id)) issues.push(`orphan_checklist:${checklist.id}`);
    if (!checklist.items?.length) issues.push(`empty_checklist:${checklist.id}`);
  }
  for (const link of graph.source_links) {
    if (!sourceIds.has(link.source_id)) issues.push(`graph_unknown_source:${link.source_id}`);
    for (const id of link.node_ids ?? []) if (!nodeIds.has(id)) issues.push(`graph_unknown_node:${id}`);
  }
  for (const item of sectorMatrix.sector_branches) {
    if (!item.branches?.length) issues.push(`sector_without_branches:${item.sector_id}`);
    if (!item.profile_fields?.length) issues.push(`sector_without_profile_fields:${item.sector_id}`);
  }

  const sourceLinkedProcedures = procedures.procedures.filter((item) => item.source_ids?.length && item.source_ids.every((id) => sourceIds.has(id))).length;
  const procedureChecklistLinks = procedures.procedures.filter((item) => checklistIds.has(item.checklist_id)).length;
  const graphSourceLinksValid = graph.source_links.every((link) => sourceIds.has(link.source_id) && (link.node_ids ?? []).every((id) => nodeIds.has(id)));
  return {
    status: issues.length ? "needs_work" : "pass",
    scope: "metadata_and_cross_reference_integrity_only",
    semantic_correctness_measured: false,
    legal_validity_measured: false,
    counts: {
      sources: sources.sources.length,
      procedures: procedures.procedures.length,
      checklists: checklists.templates.length,
      registers: registers.templates.length,
      sector_branches: sectorMatrix.sector_branches.length
    },
    coverage: {
      source_linked_procedures: procedures.procedures.length ? sourceLinkedProcedures / procedures.procedures.length : null,
      procedure_checklist_links: procedures.procedures.length ? procedureChecklistLinks / procedures.procedures.length : null,
      graph_source_links_valid: graphSourceLinksValid
    },
    issues
  };
}

/**
 * Ranking metrics for a labelled retrieval case. IDs may be strings or
 * retrieved objects with id/document.id. An empty relevance set is unscored.
 */
export function evaluateRetrievalRanking({ expectedIds = [], retrieved = [], k = 10 } = {}) {
  if (!expectedIds.length) return { status: "unscored", reason: "expected_ids_required" };
  const ids = retrieved.slice(0, Math.max(0, k)).map((item) =>
    typeof item === "string" ? item : item?.document?.id ?? item?.id
  ).filter(Boolean);
  const relevant = new Set(expectedIds);
  const hits = ids.filter((id) => relevant.has(id));
  const firstRelevant = ids.findIndex((id) => relevant.has(id));
  const precisionAtK = k > 0 ? hits.length / k : 0;
  const recallAtK = hits.length / relevant.size;
  let dcg = 0;
  ids.forEach((id, index) => { if (relevant.has(id)) dcg += 1 / Math.log2(index + 2); });
  const idealHits = Math.min(relevant.size, Math.max(0, k));
  const idealDcg = Array.from({ length: idealHits }, (_, index) => 1 / Math.log2(index + 2)).reduce((a, b) => a + b, 0);
  return {
    status: "scored",
    k,
    precisionAtK,
    recallAtK,
    reciprocalRank: firstRelevant < 0 ? 0 : 1 / (firstRelevant + 1),
    ndcgAtK: idealDcg ? dcg / idealDcg : 0,
    relevantFound: hits.length,
    relevantTotal: relevant.size
  };
}

/**
 * Validates claim-to-evidence lineage and conservative treatment of unknowns,
 * hypotheses and expected unresolved conflicts.
 */
export function evaluateAnswerIntegrity({
  claims = [],
  evidence = [],
  conflicts = [],
  expectedConflictPairs = []
} = {}) {
  const issues = [];
  const evidenceIds = new Set(evidence.map((item) => item.id));
  for (const [index, claim] of claims.entries()) {
    const status = claim.status;
    if (["observed", "calculated", "fact"].includes(status)) {
      if (!claim.sourceIds?.length) issues.push(`claim_without_evidence:${index}`);
      else if (claim.sourceIds.some((id) => !evidenceIds.has(id))) issues.push(`claim_unknown_evidence:${index}`);
    }
    if (status === "unknown" && claim.value !== null && claim.value !== undefined) {
      issues.push(`unknown_coerced_to_value:${index}`);
    }
    if (status === "hypothesis" && claim.label !== "HYPOTHESIS") {
      issues.push(`hypothesis_not_labelled:${index}`);
    }
  }
  const conflictKeys = new Set(conflicts.map((item) => [...(item.recordIds ?? [])].sort().join("|")));
  for (const pair of expectedConflictPairs) {
    const key = [...pair].sort().join("|");
    if (!conflictKeys.has(key)) issues.push(`expected_conflict_not_preserved:${key}`);
  }
  return {
    status: issues.length ? "needs_review" : "pass",
    claims_checked: claims.length,
    evidence_count: evidence.length,
    conflicts_checked: expectedConflictPairs.length,
    issues
  };
}
