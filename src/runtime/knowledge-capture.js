import { RuntimeError, requireTenantId } from "./errors.js";

const AUTO_CATEGORIES = new Set(["restaurant_profile", "operational_fact", "temporary_context", "user_preference"]);
const BLOCKED_SENSITIVITY = new Set(["personal_sensitive", "credential", "payment_data", "health"]);
const ACTIVE = new Set(["captured_user_assertion", "confirmed", "needs_confirmation", "conflict_review"]);
const req = (v, f) => { if (typeof v !== "string" || !v.trim()) throw new RuntimeError("MEMORY_CANDIDATE_INVALID", f + " is required."); return v.trim(); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const overlaps = (a, b) => (a.effective_from ?? "") <= (b.effective_to ?? "9999") && (b.effective_from ?? "") <= (a.effective_to ?? "9999");

export async function captureKnowledge({ tenantId, candidate, memory, clock = () => new Date().toISOString() } = {}) {
  const tenant = requireTenantId(tenantId);
  if (!memory || typeof memory.get !== "function" || typeof memory.set !== "function") throw new RuntimeError("MEMORY_ADAPTER_REQUIRED", "A tenant-scoped memory adapter is required.");
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new RuntimeError("MEMORY_CANDIDATE_INVALID", "candidate must be an object.");
  const establishmentId = req(candidate.establishment_id, "establishment_id");
  const category = req(candidate.category, "category");
  const entityKey = req(candidate.entity_key, "entity_key");
  const statement = req(candidate.statement, "statement");
  const source = { type: req(candidate.source?.type, "source.type"), id: req(candidate.source?.id, "source.id") };
  const confidence = candidate.confidence;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new RuntimeError("MEMORY_CANDIDATE_INVALID", "confidence must be from 0 to 1.");
  for (const field of ["effective_from", "effective_to"]) if (candidate[field] != null && !/^\d{4}-\d{2}-\d{2}$/.test(candidate[field])) throw new RuntimeError("MEMORY_CANDIDATE_INVALID", field + " must be YYYY-MM-DD or null.");
  if (candidate.effective_from && candidate.effective_to && candidate.effective_to < candidate.effective_from) throw new RuntimeError("MEMORY_CANDIDATE_INVALID", "effective_to cannot precede effective_from.");

  const key = "restaurant:" + establishmentId + ":" + category + ":" + entityKey;
  const stored = await memory.get({ tenantId: tenant, namespace: "knowledge", key });
  const record = stored.status === "found" ? stored.value : { schema_version: "1.0.0", items: [] };
  if (!Array.isArray(record.items)) throw new RuntimeError("MEMORY_RECORD_INVALID", "Stored items must be an array.");
  const item = {
    id: req(candidate.id, "id"), tenant_id: tenant, establishment_id: establishmentId, scope: "establishment",
    category, entity_key: entityKey, statement, value: candidate.value ?? null, source,
    recorded_at: clock(), effective_from: candidate.effective_from ?? null, effective_to: candidate.effective_to ?? null,
    confidence, sensitivity: candidate.sensitivity ?? "ordinary", status: "needs_confirmation"
  };
  const duplicate = record.items.find(p => ACTIVE.has(p.status) && p.statement === statement && same(p.value, item.value) && p.effective_from === item.effective_from && p.effective_to === item.effective_to);
  if (duplicate) return { status: "duplicate", item: structuredClone(duplicate), persisted: false };
  const conflicts = record.items.filter(p => ACTIVE.has(p.status) && overlaps(p, item) && !same(p.value, item.value));
  if (conflicts.length) {
    item.status = "conflict_review";
    item.review_reason = "A different active value exists for an overlapping validity period.";
    item.conflicts_with = conflicts.map(p => p.id);
  } else {
    const eligible = AUTO_CATEGORIES.has(category) && confidence >= 0.9 && candidate.ambiguous !== true &&
      candidate.risk === "low" && candidate.explicit_user_assertion === true;
    item.status = eligible ? "captured_user_assertion" : "needs_confirmation";
    if (!eligible) item.review_reason = "Requires confirmation: candidate does not meet every silent-capture condition.";
  }
  record.items.push(item);
  await memory.set({ tenantId: tenant, namespace: "knowledge", key, value: record });
  return { status: item.status, item: structuredClone(item), persisted: true, conflicts: item.conflicts_with ?? [] };
}

export async function confirmKnowledge({ tenantId, establishmentId, category, entityKey, itemId, memory, clock = () => new Date().toISOString() } = {}) {
  const tenant = requireTenantId(tenantId);
  const key = "restaurant:" + req(establishmentId, "establishmentId") + ":" + req(category, "category") + ":" + req(entityKey, "entityKey");
  const stored = await memory.get({ tenantId: tenant, namespace: "knowledge", key });
  if (stored.status !== "found" || !Array.isArray(stored.value.items)) return { status: "not_found" };
  const record = stored.value;
  const item = record.items.find(entry => entry.id === itemId);
  if (!item) return { status: "not_found" };
  if (item.status === "conflict_review" || item.status === "rejected_sensitive") return { status: "blocked", reason: item.status };
  if (item.status === "captured_user_assertion") return { status: "already_captured" };
  item.status = "confirmed";
  item.confirmed_at = clock();
  await memory.set({ tenantId: tenant, namespace: "knowledge", key, value: record });
  return { status: "confirmed", item: structuredClone(item) };
}
