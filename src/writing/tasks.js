const requiredText = (value, field) => {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(field + " must be a non-empty string.");
  return value.trim();
};
export function createManagerTaskDraft({
  title, description, assignee = null, dueDate = null,
  successCriteria = null, sourceRefs = []
} = {}) {
  const cleanTitle = requiredText(title, "title");
  const cleanDescription = requiredText(description, "description");
  if (assignee != null) assignee = requiredText(assignee, "assignee");
  if (dueDate != null) {
    dueDate = requiredText(dueDate, "dueDate");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) throw new TypeError("dueDate must be a valid YYYY-MM-DD date.");
    const [year, month, day] = dueDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new TypeError("dueDate must be a valid YYYY-MM-DD date.");
    }
  }
  if (successCriteria != null) successCriteria = requiredText(successCriteria, "successCriteria");
  if (!Array.isArray(sourceRefs) || sourceRefs.some(x => typeof x !== "string" || !x.trim())) throw new TypeError("sourceRefs must be an array of non-empty strings.");
  const missing = [];
  if (!assignee) missing.push("assignee");
  if (!dueDate) missing.push("due_date");
  if (!successCriteria) missing.push("success_criteria");
  return { schema_version: "1.0.0", title: cleanTitle, description: cleanDescription,
    assignee, due_date: dueDate, success_criteria: successCriteria,
    source_refs: [...new Set(sourceRefs.map(x => x.trim()))],
    status: missing.length ? "needs_completion" : "draft_ready", missing_fields: missing,
    execution: "draft_only", assigned: false, notification_sent: false };
}
