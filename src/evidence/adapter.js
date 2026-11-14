/**
 * Maps shared Evidence Registry records into the compact evidence envelope
 * consumed by the Stage 4 Intelligence Engine.
 * Draft/unknown records are deliberately excluded from confirmed evidence.
 */
const USABLE_STATUSES = new Set(["approved", "reviewed"]);
export function toIntelligenceEvidence(record) {
  if (!record || typeof record !== "object") return { evidence: null, reason: "invalid_record" };
  if (!USABLE_STATUSES.has(record.record_status)) return { evidence: null, reason: "record_not_reviewed_or_approved" };
  const validity = record.validity ?? {};
  if (validity.status === "unknown" || validity.status === "current_but_unverified") return { evidence: null, reason: "validity_unconfirmed" };
  const source = record.source ?? {};
  const sourceLabel = [source.publisher, source.title, source.url || source.citation].filter(Boolean).join(" — ");
  const date = source.published_at || validity.effective_from;
  const scope = record.territory?.scope;
  if (!record.id || !record.evidence_class || !sourceLabel || !date || !scope) return { evidence: null, reason: "required_provenance_missing" };
  return { evidence: {
    id: record.id, class: record.evidence_class, source: sourceLabel, scope, date,
    jurisdiction: record.territory?.jurisdictions?.[0] ?? null,
    effectiveStatus: validity.status ?? "unknown",
    limitations: record.limitations ?? [], applicability: record.applicability ?? {}
  }, reason: null };
}
export function adaptEvidenceRegistry(registry) {
  const evidence = [], excluded = [];
  for (const record of registry?.records ?? []) {
    const result = toIntelligenceEvidence(record);
    if (result.evidence) evidence.push(result.evidence);
    else excluded.push({ id: record?.id ?? null, reason: result.reason });
  }
  return { evidence, excluded };
}
