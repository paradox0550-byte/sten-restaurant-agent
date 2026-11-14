const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T/;

export function validateEvidenceRecord(record) {
  const errors = [];
  const warnings = [];
  const requireValue = (value, path) => {
    if (value === undefined || value === null || value === "") errors.push(`Missing required value: ${path}`);
  };
  const validDate = (value, path, optional = false) => {
    if ((value === null || value === undefined || value === "") && optional) return;
    if (typeof value !== "string" || !DATE_RE.test(value) || Number.isNaN(Date.parse(value))) errors.push(`Invalid date: ${path}`);
  };
  if (!record || typeof record !== "object" || Array.isArray(record)) return {valid:false,errors:["Record must be an object"],warnings};
  for (const key of ["id","title","evidence_class","topic","source","territory","validity","applicability","limitations","record_status","created_at","updated_at"]) requireValue(record[key],key);
  if (typeof record.id === "string" && !/^[a-z0-9][a-z0-9._-]{2,100}$/.test(record.id)) errors.push("Invalid id format");
  if (record.evidence_class && !["LAW","RESEARCH","CORE","INDUSTRY","PRACTICE","TREND","HYPOTHESIS","CONFIGURATION"].includes(record.evidence_class)) errors.push("Unsupported evidence_class");
  if (!Array.isArray(record.topic) || !record.topic.length) errors.push("topic must be a non-empty array");
  if (!Array.isArray(record.limitations) || !record.limitations.length) errors.push("limitations must be a non-empty array");
  const source = record.source || {};
  for (const key of ["publisher","title","source_type","accessed_at"]) requireValue(source[key],`source.${key}`);
  if (source.url === undefined) errors.push("Missing required value: source.url");
  if (source.published_at === undefined) errors.push("Missing required value: source.published_at");
  validDate(source.accessed_at,"source.accessed_at");
  validDate(source.published_at,"source.published_at",true);
  const validity = record.validity || {};
  const statuses = ["in_force","not_yet_effective","superseded","repealed","historical","current_but_unverified","not_applicable","unknown"];
  if (validity.status && !statuses.includes(validity.status)) errors.push("Unsupported validity.status");
  for (const key of ["published_on","effective_from","effective_to","last_verified_at","review_due_at"]) validDate(validity[key],`validity.${key}`,true);
  if (validity.effective_from && validity.effective_to && validity.effective_to < validity.effective_from) errors.push("effective_to precedes effective_from");
  if (record.evidence_class === "LAW") {
    const assertedLaw = record.record_status === "approved" || validity.status === "in_force";
    if (assertedLaw && (!record.territory?.jurisdictions?.length || record.territory.scope === "unknown")) errors.push("LAW record requires a known jurisdiction");
    if (assertedLaw && !source.url && !source.citation) errors.push("LAW record requires an official source URL or precise citation");
    if (validity.status === "in_force" && (!validity.effective_from || !validity.last_verified_at || !validity.review_due_at)) errors.push("In-force LAW requires effective_from, last_verified_at and review_due_at");
    if (record.record_status === "approved" && !["official_act","official_guidance"].includes(source.source_type)) errors.push("Approved LAW requires official source_type");
  }
  if (record.evidence_class === "RESEARCH" && !["peer_reviewed","systematic_review"].includes(source.source_type)) warnings.push("Research should normally use peer_reviewed or systematic_review source_type");
  if (record.evidence_class === "CONFIGURATION" && !record.tenant_id) errors.push("CONFIGURATION must carry tenant_id and stay outside shared registry");
  if (record.evidence_class === "HYPOTHESIS" && record.record_status === "approved") warnings.push("Approved hypothesis must remain visibly marked unverified in outputs");
  if (validity.status === "in_force" && validity.review_due_at && validity.review_due_at < new Date().toISOString().slice(0,10)) warnings.push("Review overdue; re-verify before use");
  if (validity.status === "unknown" || record.applicability?.determination === "unknown") warnings.push("Unknown validity/applicability: do not use as confirmed requirement or fact");
  if (!DATE_TIME_RE.test(record.created_at || "")) errors.push("created_at must be an ISO date-time");
  if (!DATE_TIME_RE.test(record.updated_at || "")) errors.push("updated_at must be an ISO date-time");
  return {valid:errors.length===0,errors,warnings};
}

export function validateRegistry(registry) {
  const errors = [], warnings = [];
  if (!registry || !Array.isArray(registry.records)) return {valid:false,errors:["registry.records must be an array"],warnings};
  const ids = new Set();
  for (const record of registry.records) {
    const result = validateEvidenceRecord(record);
    errors.push(...result.errors.map(e => `${record?.id ?? "unknown"}: ${e}`));
    warnings.push(...result.warnings.map(w => `${record?.id ?? "unknown"}: ${w}`));
    if (record?.id && ids.has(record.id)) errors.push(`Duplicate record id: ${record.id}`);
    if (record?.id) ids.add(record.id);
  }
  for (const record of registry.records) for (const linked of [...(record.related_records||[]),...(record.conflicts_with||[])]) if (!ids.has(linked)) warnings.push(`${record.id}: unresolved linked record ${linked}`);
  return {valid:errors.length===0,errors,warnings};
}

export function evaluateApplicability(record, profile, assessmentDate) {
  const required = record?.applicability?.required_profile_fields || [];
  const missing = required.filter(field => {
    const value = field.split(".").reduce((obj,key)=>obj?.[key],profile);
    return value === undefined || value === null || value === "";
  });
  if (missing.length) return {outcome:"needs_profile_data",missing_fields:missing,reasons:["Required establishment profile data is missing"]};
  if (!assessmentDate || !DATE_RE.test(assessmentDate)) return {outcome:"undetermined",missing_fields:[],reasons:["A valid assessment date is required"]};
  const validity = record.validity || {};
  if (["unknown","current_but_unverified","repealed","superseded","historical","not_applicable"].includes(validity.status)) return {outcome:"undetermined",missing_fields:[],reasons:[`Validity status ${validity.status} does not establish current applicability`]};
  if (validity.effective_from && assessmentDate < validity.effective_from) return {outcome:"undetermined",missing_fields:[],reasons:["Assessment date precedes effective_from"]};
  if (validity.effective_to && assessmentDate > validity.effective_to) return {outcome:"undetermined",missing_fields:[],reasons:["Assessment date is after effective_to"]};
  if (record.applicability?.determination === "specialist_review") return {outcome:"specialist_review",missing_fields:[],reasons:["Qualified specialist review is required"]};
  if (record.applicability?.determination === "unknown") return {outcome:"undetermined",missing_fields:[],reasons:["Applicability is not established"]};
  if (record.evidence_class === "LAW" && !record.territory?.jurisdictions?.length) return {outcome:"undetermined",missing_fields:[],reasons:["Legal jurisdiction is missing"]};
  return {outcome:"undetermined",missing_fields:[],reasons:["Fine-grained scope matching is not implemented; no automatic positive applicability claim is made"]};
}

export function findEvidence(registry, filters={}) {
  return (registry?.records||[]).filter(record =>
    (!filters.evidence_class || record.evidence_class === filters.evidence_class) &&
    (!filters.topic || record.topic?.includes(filters.topic)) &&
    (!filters.jurisdiction || record.territory?.jurisdictions?.includes(filters.jurisdiction)) &&
    (!filters.record_status || record.record_status === filters.record_status)
  );
}
