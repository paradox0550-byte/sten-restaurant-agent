# Stage 7 — Knowledge Retrieval & Expert Context

## Purpose
Select relevant professional knowledge and evidence for a restaurant-management question, using the establishment profile without treating missing profile values as negative or positive matches.

## Components
- src/retrieval/text.js — Unicode-aware Russian/Latin normalization and tokenization.
- src/retrieval/rank.js — deterministic BM25-style lexical ranking with title/topic boosts and stable tie ordering.
- src/retrieval/applicability.js — conservative sector, format and required-profile-field assessment.
- src/retrieval/conflicts.js — reports explicitly linked conflicts; does not infer which source is correct.
- src/retrieval/context.js — assembles ranked knowledge, ranked Evidence Registry records, adapted evidence, profile context and guardrails.
- src/retrieval/index.js — public exports.

## Main API
buildExpertContext({ query, profile, knowledge, registry, limit }) returns profileContext, ranked knowledge, ranked evidence, explicit conflicts and guardrails.

## Matching behavior
1. Empty query returns unavailable.
2. Lexical rank uses normalized tokens, term frequency and inverse document frequency. Title and topic matches receive modest boosts.
3. Sector/format mismatch excludes a document from applicable knowledge results.
4. Missing sector, format, required profile fields or unresolved establishment conditions yield requires_context/undetermined, never an assumed match.
5. Evidence passes through the Stage 5 adapter. Draft, quarantined, unknown-validity and unverified records remain excluded from confirmed evidence.
6. Explicit conflicts are surfaced for review. No silent precedence or automatic reconciliation is performed.

## Current limitations
- Lexical retrieval only; no embeddings, vector store, model reranker or hybrid semantic search.
- Applicability supports exact sector/format matching and missing-field checks. Complex establishment conditions need separately validated rules and specialist review.
- Conflict detection reads explicit conflicts_with links only; it does not detect every semantic contradiction.
- Quality depends on curated source documents and metadata. The current knowledge corpus is a starter set, not exhaustive.
- This layer assembles context; it does not generate the final natural-language expert answer.

## Acceptance scope
CI tests deterministic ranking, empty queries, format/sector mismatch, missing profile fields, explicit conflict reporting, evidence joining and exclusion of draft/unknown records.
