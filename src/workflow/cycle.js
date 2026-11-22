import { buildAnalysis, buildExpertAnalysis } from "../intelligence/engine.js";
import { createActionTask } from "./task.js";

/**
 * Legacy prepared-envelope path remains available for compatibility.
 * New decision workflows should pass expertAnalysisInput and use the full
 * Stage 12 gate before draft tasks are created.
 */
export function createManagementCycle({
  tenantId, establishmentId, analysisInput = {}, expertAnalysisInput = null, actor, at = new Date().toISOString()
} = {}) {
  if (!tenantId || !establishmentId || !actor) throw new Error("CYCLE_IDENTITY_REQUIRED");
  const isExpertPath = expertAnalysisInput !== null;
  const analysis = isExpertPath ? buildExpertAnalysis(expertAnalysisInput) : buildAnalysis(analysisInput);
  const expertReady = !isExpertPath || analysis.readiness === "reviewable";
  const structured = isExpertPath ? expertReady : analysis.readiness === "structured";
  const analysisIssues = analysis.integrity?.readinessIssues ?? [
    ...(analysis.integrity?.evidenceIssues ?? []),
    ...(analysis.integrity?.factIssues ?? []),
    ...(analysis.integrity?.actionIssues ?? [])
  ];
  const tasks = [];
  if (structured) {
    for (const [index, action] of analysis.recommendations?.entries?.() ?? analysis.actions.entries()) {
      const ownerRole = action.ownerRole ?? action.owner_role;
      const verificationMetric = action.verificationMetric ?? action.verification_metric;
      const dueAt = action.dueOrTiming ?? action.due_or_timing ?? action.due_at ?? action.dueAt;
      tasks.push(createActionTask({
        id: action.id ?? `task-${index + 1}`, tenantId, establishmentId,
        title: action.title ?? action.description ?? `Action ${index + 1}`,
        description: action.description ?? "", ownerRole, verificationMetric, dueAt,
        sourceFactIds: action.sourceFactIds ?? action.source_fact_ids ?? [],
        evidenceIds: action.evidenceIds ?? action.evidence_ids ?? [],
        hypothesisIds: action.hypothesisIds ?? action.hypothesis_ids ?? [],
        priority: action.priority ?? "normal", createdBy: actor, at
      }));
    }
  }
  return {
    status: structured ? "ready_for_approval" : "needs_review",
    gate: isExpertPath ? "stage_12_expert" : "legacy_prepared_envelope",
    tenant_id: tenantId, establishment_id: establishmentId, created_at: at, created_by: actor,
    analysis, integrity_issues: analysisIssues, tasks
  };
}
