import test from "node:test";
import assert from "node:assert/strict";
import { createWritingBrief, buildWritingPrompt, reviewWritingDraft, checkEmailSenderReadiness, createManagerTaskDraft } from "../src/writing/index.js";
const fact = { id: "fact-1", statement: "Не все отчёты по закрытию смен за прошлую неделю поступили.", source: { type: "manager_input", id: "message-12" } };

test("creates a source-linked Russian manager writing brief", () => {
  const brief = createWritingBrief({ request: "Подготовить сообщение менеджерам.", documentType: "team_message", channel: "internal_chat", authorRole: "управляющий", recipientRole: "менеджеры", facts: [fact], unknowns: ["Причины отсутствия отчётов не установлены."] });
  assert.equal(brief.facts[0].source.id, "message-12");
  assert.equal(brief.authority, "draft_only");
});
test("rejects duplicate fact ids and missing provenance", () => {
  assert.throws(() => createWritingBrief({ request: "Текст", facts: [fact, fact] }), /unique/);
  assert.throws(() => createWritingBrief({ request: "Текст", facts: [{ id: "x", statement: "Факт" }] }), /source.type/);
});
test("rejects unsupported document types and channels", () => {
  assert.throws(() => createWritingBrief({ request: "Текст", documentType: "fake" }), /Unsupported/);
  assert.throws(() => createWritingBrief({ request: "Текст", channel: "sms_magic" }), /Unsupported/);
});
test("builds provider-neutral prompt with natural style and source rules", () => {
  const prompt = buildWritingPrompt(createWritingBrief({ request: "Ответить поставщику", documentType: "email_reply", facts: [fact] }));
  assert.match(prompt, /не как универсальный шаблон/);
  assert.match(prompt, /fact-1/);
  assert.match(prompt, /Не используй искусственные ошибки/);
});
test("rejects invalid brief when building a prompt", () => {
  assert.throws(() => buildWritingPrompt({}), /valid STEN writing brief/);
});
test("accepts a draft whose factual claims reference known source ids", () => {
  const brief = createWritingBrief({ request: "Сообщение", facts: [fact] });
  const result = reviewWritingDraft({ brief, draft: "Коллеги, не все отчёты по закрытию смен поступили.", claims: [{ text: "Не все отчёты поступили.", source_ids: ["fact-1"] }] });
  assert.equal(result.status, "ready_for_human_review");
  assert.equal(result.checks.human_approval_required, true);
});
test("flags claims without source references and unknown source ids", () => {
  const result = reviewWritingDraft({ brief: createWritingBrief({ request: "Сообщение", facts: [fact] }), draft: "Коллеги, отчёты не поступили.", claims: [{ text: "Все менеджеры нарушили регламент.", source_ids: ["not-in-brief"] }] });
  assert.equal(result.status, "needs_revision");
  assert.equal(result.issues.includes("unsupported_claims"), true);
});
test("flags unresolved placeholders and boilerplate for editorial review", () => {
  const result = reviewWritingDraft({ brief: createWritingBrief({ request: "Служебная записка" }), draft: "В рамках повышения эффективности прошу [укажите дату].", claims: [] });
  assert.equal(result.status, "needs_revision");
  assert.equal(result.issues.includes("unresolved_placeholders"), true);
  assert.equal(result.issues.includes("possible_boilerplate"), true);
});
test("email preflight distinguishes individual and bulk sender requirements", () => {
  const individual = checkEmailSenderReadiness({ domain: "restaurant.example", spf: true, dkim: true, dmarc: true });
  assert.equal(individual.status, "preflight_checks_passed");
  const bulk = checkEmailSenderReadiness({ domain: "restaurant.example", bulk: true, spf: true, dkim: true, dmarc: true });
  assert.equal(bulk.status, "not_ready");
  assert.equal(bulk.issues.some(i => i.code === "UNSUBSCRIBE_NOT_CONFIRMED"), true);
});
test("rejects invalid sender domains", () => {
  assert.throws(() => checkEmailSenderReadiness({ domain: "not a domain" }), /valid fully-qualified/);
});
test("creates task draft without inventing assignee or deadline", () => {
  const task = createManagerTaskDraft({ title: "Проверить закрытие смен", description: "Сверить отчёты менеджеров." });
  assert.equal(task.status, "needs_completion");
  assert.deepEqual(task.missing_fields, ["assignee", "due_date", "success_criteria"]);
  assert.equal(task.execution, "draft_only");
});
test("creates complete task draft when control fields are supplied", () => {
  const task = createManagerTaskDraft({ title: "Сверить отчёты", description: "Проверить комплектность отчётности.", assignee: "Менеджер смены", dueDate: "2026-11-20", successCriteria: "Все отчёты проверены, расхождения перечислены.", sourceRefs: ["message-12"] });
  assert.equal(task.status, "draft_ready");
  assert.equal(task.assigned, false);
});
