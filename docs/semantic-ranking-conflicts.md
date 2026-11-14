# Stage 10 — Semantic Ranking & Conflict Intelligence

## Purpose
Improve the order of retrieved candidates and flag potentially incompatible claims without silently changing source meaning, precedence, or applicability.

## Semantic reranking
`rerankResults({ query, results, reranker, limit })` accepts a host-injected `reranker.rerank({ query, documents })` implementation. Provider responses may be an array or `{ results }` containing candidate IDs (or candidate documents) and optional scores. Only IDs already present in the candidate set are accepted. Original source documents and provenance are retained. Omitted candidates are appended in their original order. Provider errors or malformed responses return the original ranking with an explicit fallback status.

## Semantic contradiction detection
`detectSemanticConflicts({ records, detector })` accepts a host-injected `detector.detect({ records })` implementation. Detector output is untrusted: unknown record IDs, malformed pairs and duplicates are discarded. Findings retain both source records and are marked `human_review_required` and `resolution: unresolved`.

Where metadata shows different jurisdiction, validity period, sector, format or metric definition, the finding is classified as `contextual_difference`, not asserted as a direct contradiction. Otherwise a detector-labelled contradiction is reported as `potential_contradiction`; other related pairs remain `related_claims_review`. This metadata check is conservative and does not prove equivalence or applicability.

## Guardrails
- No provider, model or external dependency is bundled or configured.
- No conflict is automatically resolved and no source is silently preferred.
- Semantic scores are ranking signals, not evidence quality, truth, legal authority or applicability.
- Missing metadata remains missing; differing or unknown context is not filled by inference.
- Human review and evidence governance remain mandatory before registry promotion.

## Acceptance
Tests cover candidate allowlisting, provenance preservation, fallback behavior, invalid detector IDs, duplicate suppression, contextual differences and fail-closed provider errors.
