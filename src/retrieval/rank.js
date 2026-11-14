import { tokenize, documentText } from "./text.js";

function counts(tokens) {
  const result = new Map();
  for (const token of tokens) result.set(token, (result.get(token) ?? 0) + 1);
  return result;
}

function fieldTokens(document, fields) {
  return tokenize(fields.map((field) => document[field]).filter(Boolean).join(" "));
}

/**
 * BM25 retrieval over the complete searchable document representation.
 * Graph nodes and knowledge documents share this contract; no parallel index
 * or external dependency is required.
 */
export function rankDocuments(query, documents = [], { limit = 10 } = {}) {
  const terms = tokenize(query);
  if (!terms.length) return { status: "unavailable", reason: "empty_query", results: [] };
  if (!Array.isArray(documents)) {
    return { status: "unavailable", reason: "documents_must_be_array", results: [] };
  }

  const prepared = documents.map((document, sourceOrder) => {
    const tokens = tokenize(documentText(document));
    return {
      document,
      sourceOrder,
      tokens,
      frequencies: counts(tokens),
      titleTokens: fieldTokens(document, ["title", "label"]),
      keywordTokens: tokenize([
        ...(document.keywords ?? []),
        ...(document.aliases ?? []),
        ...(document.topics ?? []),
        ...(document.topic ?? [])
      ].join(" "))
    };
  });

  const corpusSize = prepared.length;
  const averageLength = corpusSize
    ? prepared.reduce((sum, item) => sum + item.tokens.length, 0) / corpusSize
    : 0;
  const documentFrequency = new Map();
  for (const term of new Set(terms)) {
    documentFrequency.set(term, prepared.reduce(
      (sum, item) => sum + (item.frequencies.has(term) ? 1 : 0), 0
    ));
  }

  const k1 = 1.5;
  const b = 0.6;
  const results = prepared.map((item) => {
    let score = 0;
    const matchedTerms = [];
    for (const term of new Set(terms)) {
      const frequency = item.frequencies.get(term) ?? 0;
      if (!frequency) continue;
      matchedTerms.push(term);
      const df = documentFrequency.get(term) ?? 0;
      const inverseDocumentFrequency = Math.log(
        1 + (corpusSize - df + 0.5) / (df + 0.5)
      );
      const lengthNormalization = averageLength
        ? 1 - b + b * item.tokens.length / averageLength
        : 1;
      const bm25 = inverseDocumentFrequency
        * (frequency * (k1 + 1)) / (frequency + k1 * lengthNormalization);
      const titleBoost = item.titleTokens.includes(term) ? 1.5 : 0;
      const keywordBoost = item.keywordTokens.includes(term) ? 1.0 : 0;
      score += bm25 + titleBoost + keywordBoost;
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
    queryTerms: [...new Set(terms)],
    results: results
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || b.matchedTermCount - a.matchedTermCount || a.sourceOrder - b.sourceOrder)
      .slice(0, Math.max(0, limit))
      .map(({ sourceOrder, ...item }) => item)
  };
}
