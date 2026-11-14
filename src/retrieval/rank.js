import { tokenize, documentText } from "./text.js";

const K1 = 1.5;
const B = 0.75;

// Field-aware BM25: generic terms remain searchable; corpus IDF reduces their
// influence naturally. Each field is length-normalized against its own mean.
const FIELD_GROUPS = [
  { fields: ["id"], weight: 3.0 },
  { fields: ["title", "label"], weight: 2.5 },
  { fields: ["aliases"], weight: 2.0 },
  { fields: ["keywords", "tags", "topics", "topic"], weight: 1.5 },
  { fields: ["summary"], weight: 1.25 },
  { fields: ["description", "content", "text"], weight: 1.0 },
  { fields: ["purpose"], weight: 0.8 },
  { fields: ["scope"], weight: 0.6 },
  { fields: ["limitations"], weight: 0.4 },
  { fields: ["domain", "type", "evidence_class", "procedure_id"], weight: 0.35 }
];

function asText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(" ");
  return value == null ? "" : String(value);
}

function counts(tokens) {
  const result = new Map();
  for (const token of tokens) result.set(token, (result.get(token) ?? 0) + 1);
  return result;
}

function tokensForFields(document, fields) {
  return tokenize(fields.map((field) => asText(document[field])).filter(Boolean).join(" "));
}

function averageLength(prepared, fieldGroup) {
  if (!prepared.length) return 0;
  return prepared.reduce((sum, item) => sum + item.fieldTokens[fieldGroup].length, 0) / prepared.length;
}

/**
 * Field-aware BM25 over the canonical document contract.
 * Keeps the public result shape stable for lexical and hybrid retrieval.
 */
export function rankDocuments(query, documents = [], { limit = 10 } = {}) {
  const terms = [...new Set(tokenize(query))];
  if (!terms.length) return { status: "unavailable", reason: "empty_query", results: [] };
  if (!Array.isArray(documents)) {
    return { status: "unavailable", reason: "documents_must_be_array", results: [] };
  }

  const prepared = documents.map((document, sourceOrder) => {
    const fieldTokens = FIELD_GROUPS.map((group) => tokensForFields(document, group.fields));
    const allTokens = tokenize(documentText(document));
    return {
      document,
      sourceOrder,
      allFrequencies: counts(allTokens),
      fieldFrequencies: fieldTokens.map(counts),
      fieldTokens
    };
  });

  const corpusSize = prepared.length;
  const averageLengths = FIELD_GROUPS.map((_, index) => averageLength(prepared, index));
  const documentFrequency = new Map();
  for (const term of terms) {
    documentFrequency.set(term, prepared.reduce(
      (sum, item) => sum + (item.allFrequencies.has(term) ? 1 : 0), 0
    ));
  }

  const results = prepared.map((item) => {
    let score = 0;
    const matchedTerms = [];
    for (const term of terms) {
      const df = documentFrequency.get(term) ?? 0;
      if (!df) continue;
      let termScore = 0;
      for (let fieldIndex = 0; fieldIndex < FIELD_GROUPS.length; fieldIndex += 1) {
        const group = FIELD_GROUPS[fieldIndex];
        const frequency = item.fieldFrequencies[fieldIndex].get(term) ?? 0;
        if (!frequency) continue;
        const dl = item.fieldTokens[fieldIndex].length;
        const avgDl = averageLengths[fieldIndex];
        const lengthNormalization = avgDl > 0
          ? 1 - B + B * dl / avgDl
          : 1;
        const idf = Math.log(1 + (corpusSize - df + 0.5) / (df + 0.5));
        const bm25 = (frequency * (K1 + 1)) / (frequency + K1 * lengthNormalization);
        termScore += idf * bm25 * group.weight;
      }
      if (termScore > 0) {
        matchedTerms.push(term);
        score += termScore;
      }
    }
    return {
      document: item.document,
      score,
      matchedTerms,
      matchedTermCount: matchedTerms.length,
      sourceOrder: item.sourceOrder
    };
  });

  return {
    status: "ok",
    queryTerms: terms,
    results: results
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.matchedTermCount - a.matchedTermCount || a.sourceOrder - b.sourceOrder)
      .slice(0, Math.max(0, limit))
      .map(({ sourceOrder, ...item }) => item)
  };
}
