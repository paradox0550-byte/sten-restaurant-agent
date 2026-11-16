const requiredText = (value, field) => {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(field + " must be a non-empty string.");
  return value.trim();
};
const STYLE_FLAGS = [
  "в рамках повышения эффективности", "в целях оптимизации деятельности",
  "настоящим довожу до вашего сведения", "надеюсь на понимание",
  "благодарю за понимание и сотрудничество", "данное письмо"
];
export function reviewWritingDraft({ brief, draft, claims = [] } = {}) {
  if (!brief || brief.schema_version !== "1.0.0" || !Array.isArray(brief.facts)) throw new TypeError("A valid STEN writing brief is required.");
  const text = requiredText(draft, "draft");
  if (!Array.isArray(claims)) throw new TypeError("claims must be an array.");
  const known = new Set(brief.facts.map(f => f.id));
  const unsupportedClaims = [], malformedClaims = [];
  for (const [index, claim] of claims.entries()) {
    if (!claim || typeof claim !== "object" || typeof claim.text !== "string" || !claim.text.trim() || !Array.isArray(claim.source_ids)) {
      malformedClaims.push(index); continue;
    }
    const invalid = claim.source_ids.filter(id => !known.has(id));
    if (claim.source_ids.length === 0 || invalid.length) unsupportedClaims.push({ index, text: claim.text, unknown_source_ids: invalid });
  }
  const placeholders = [];
  if (/\bTODO\b|\{\{[^}]+\}\}|\[(?:укажите|вставьте|добавьте|имя|дата|сумма)[^\]]*\]/i.test(text)) placeholders.push("unresolved_placeholder");
  const lower = text.toLocaleLowerCase("ru");
  const styleFlags = STYLE_FLAGS.filter(phrase => lower.includes(phrase));
  const issues = [];
  if (claims.length === 0) issues.push("claims_not_provided");
  if (malformedClaims.length) issues.push("malformed_claims");
  if (unsupportedClaims.length) issues.push("unsupported_claims");
  if (placeholders.length) issues.push("unresolved_placeholders");
  if (styleFlags.length) issues.push("possible_boilerplate");
  return {
    status: issues.some(x => ["malformed_claims", "unsupported_claims", "unresolved_placeholders"].includes(x))
      ? "needs_revision" : issues.length ? "human_review_required" : "ready_for_human_review",
    issues, unsupported_claims: unsupportedClaims, malformed_claim_indexes: malformedClaims,
    placeholders, style_flags: styleFlags,
    checks: { source_ids_exist: unsupportedClaims.length === 0 && malformedClaims.length === 0,
      human_approval_required: true, delivery_performed: false, ai_detector_result: "not_assessed" }
  };
}
export function checkEmailSenderReadiness({
  domain, bulk = false, spf = null, dkim = null, dmarc = null,
  unsubscribe = null, recipientConsent = null, complaintMonitoring = null
} = {}) {
  const cleanDomain = requiredText(domain, "domain").toLowerCase();
  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(cleanDomain)) {
    throw new TypeError("domain must be a valid fully-qualified domain name.");
  }
  const issues = [];
  for (const key of ["spf", "dkim", "dmarc"]) if ({spf,dkim,dmarc}[key] !== true) {
    issues.push({ code: key.toUpperCase() + "_NOT_CONFIRMED", severity: bulk ? "blocking" : "warning" });
  }
  if (bulk) for (const [key, value] of [["unsubscribe",unsubscribe],["recipientConsent",recipientConsent],["complaintMonitoring",complaintMonitoring]]) {
    if (value !== true) issues.push({ code: key.replace(/[A-Z]/g, m => "_" + m).toUpperCase() + "_NOT_CONFIRMED", severity: "blocking" });
  }
  return { domain: cleanDomain,
    status: issues.some(i => i.severity === "blocking") ? "not_ready" : issues.length ? "review_required" : "preflight_checks_passed",
    bulk, issues,
    disclaimer: "This is a configuration preflight only. It does not guarantee inbox placement or bypass spam filtering." };
}
