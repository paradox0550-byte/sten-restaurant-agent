export const WRITING_TYPES = Object.freeze([
  "memo", "email_reply", "meeting_minutes", "weekly_plan", "manager_tasks",
  "team_message", "guest_response", "supplier_letter", "report", "other"
]);
export const WRITING_CHANNELS = Object.freeze(["internal_chat", "email", "document", "meeting", "task_board"]);
const requiredText = (value, field) => {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(field + " must be a non-empty string.");
  return value.trim();
};
function normalizeFacts(facts = []) {
  if (!Array.isArray(facts)) throw new TypeError("facts must be an array.");
  const ids = new Set();
  return facts.map((fact, index) => {
    if (!fact || typeof fact !== "object" || Array.isArray(fact)) throw new TypeError("facts[" + index + "] must be an object.");
    const id = requiredText(fact.id, "facts[" + index + "].id");
    const statement = requiredText(fact.statement, "facts[" + index + "].statement");
    const sourceType = requiredText(fact.source?.type, "facts[" + index + "].source.type");
    const sourceId = requiredText(fact.source?.id, "facts[" + index + "].source.id");
    if (ids.has(id)) throw new TypeError("Fact ids must be unique: " + id);
    ids.add(id);
    return { id, statement, source: { type: sourceType, id: sourceId },
      effective_from: fact.effective_from ?? null, effective_to: fact.effective_to ?? null };
  });
}
export function createWritingBrief({
  request, documentType = "other", channel = "document", language = "ru",
  authorRole = null, recipientRole = null, purpose = null, facts = [],
  unknowns = [], constraints = [], styleProfile = {}
} = {}) {
  const cleanRequest = requiredText(request, "request");
  if (!WRITING_TYPES.includes(documentType)) throw new TypeError("Unsupported documentType: " + documentType);
  if (!WRITING_CHANNELS.includes(channel)) throw new TypeError("Unsupported channel: " + channel);
  if (!Array.isArray(unknowns) || !Array.isArray(constraints)) throw new TypeError("unknowns and constraints must be arrays.");
  const style = {
    voice: styleProfile.voice == null ? null : requiredText(styleProfile.voice, "styleProfile.voice"),
    formality: styleProfile.formality == null ? null : requiredText(styleProfile.formality, "styleProfile.formality"),
    length: styleProfile.length == null ? null : requiredText(styleProfile.length, "styleProfile.length"),
    avoid_phrases: (styleProfile.avoid_phrases ?? []).map((x, i) => requiredText(x, "styleProfile.avoid_phrases[" + i + "]"))
  };
  return {
    schema_version: "1.0.0", request: cleanRequest, document_type: documentType, channel,
    language: requiredText(language, "language"),
    author_role: authorRole == null ? null : requiredText(authorRole, "authorRole"),
    recipient_role: recipientRole == null ? null : requiredText(recipientRole, "recipientRole"),
    purpose: purpose == null ? null : requiredText(purpose, "purpose"),
    facts: normalizeFacts(facts),
    unknowns: unknowns.map((x, i) => requiredText(x, "unknowns[" + i + "]")),
    constraints: constraints.map((x, i) => requiredText(x, "constraints[" + i + "]")),
    style_profile: style, authority: "draft_only"
  };
}
export function buildWritingPrompt(brief) {
  if (!brief || brief.schema_version !== "1.0.0" || !Array.isArray(brief.facts)) throw new TypeError("A valid STEN writing brief is required.");
  const factIds = brief.facts.map(f => f.id);
  return [
    "Ты готовишь рабочий документ для руководителя HoReCa от имени указанной роли.",
    "Пиши естественно и по делу: текст должен звучать как нормальная профессиональная коммуникация конкретного руководителя, а не как универсальный шаблон.",
    "Подбирай длину, структуру, лексику и степень формальности под задачу, адресата и канал. Не начинай автоматически с приветственной формулы и не добавляй формальное заключение, если они не нужны.",
    "Используй только подтверждённые сведения из facts. Не добавляй имена, даты, суммы, причины, договорённости, обязательства, статусы и обещания, которых нет в исходных данных.",
    "Каждое существенное фактическое утверждение свяжи с одним или несколькими fact id из набора: " + factIds.join(", "),
    "Если информации недостаточно, не заполняй пробел правдоподобной догадкой: сформулируй нейтрально или явно отметь, что требуется уточнение.",
    "Не используй искусственные ошибки, намеренные опечатки, маскировку происхождения текста, обещания прохождения AI-детекторов или приёмы обхода антиспам-систем.",
    "Не добавляй клише, канцелярит, повторяющиеся вводные, самопохвалу и пустые фразы. Не делай текст длиннее, чем требует задача.",
    "Для поручений указывай ответственного, срок и ожидаемый результат только если они предоставлены. Иначе пометь соответствующее поле как требующее назначения.",
    "Верни JSON-объект с полями draft и claims; claims — массив объектов {text, source_ids}. Включай только проверяемые фактические утверждения.",
    "Контекст задачи (не меняй и не дополняй факты):", JSON.stringify(brief, null, 2)
  ].join("\n\n");
}
