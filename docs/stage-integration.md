# Stage integration and closeout record

## Integrated stages
- Stage 1 — assistant identity, canonical instructions, behavior rules, knowledge governance, memory policy and core evaluations.
- Stage 2 — finance/P&L, Food/Labor/Prime Cost, FOT/payroll/productivity, menu engineering, shift/service and operational audit methodology.
- Stage 3 — cumulative knowledge base, deterministic calculators, service recovery, research register, provider adapter templates and tests.
- Stage 4 — Intelligence Engine, cross-domain diagnosis, evidence/fact validation, unknown handling, hypothesis labelling and action verification fields.
- Stage 5 — Knowledge & Evidence Layer: registry schema, provenance, validity lifecycle, territory, applicability, limitations, conflict policy and a registry-to-Intelligence-Engine adapter.

## Stage 5 integration boundary
The src/evidence/adapter.js module maps reviewed/approved registry records into the Stage 4 evidence envelope. Draft, unknown-validity and unverified records are excluded rather than promoted to facts. PRACTICE is a distinct evidence class and is not interchangeable with LAW or RESEARCH.

## Acceptance status
The repository contains a working, testable foundation for Stages 1–5. Automated CI verifies tests, registry validity and manifest paths. This does not mean every knowledge domain is populated or that the package is production-certified.

Not claimed:
- a live, exhaustive legal database for any jurisdiction;
- a complete peer-reviewed research corpus;
- automatic legal applicability matching for all establishment conditions;
- production API, hosted memory, provider deployment or compliance certification.

Legal records remain jurisdiction- and date-specific. Unknown profile data remain unknown. No registry entry certifies an establishment's compliance.

## Stage 9 — Hybrid Retrieval
Integrated: provider-injected query/document embeddings, validated in-memory cosine vector index, lexical+vector retrieval and Reciprocal Rank Fusion. The in-memory index is a reference implementation for tests and small workloads only; no production embedding provider or persistent vector database is bundled. Retrieval quality seed cases are versioned under evals/ and require a labelled corpus before production acceptance.

## Stage 10 — Semantic Ranking & Conflict Intelligence
Integrated: provider-injected semantic reranking with candidate allowlisting, provenance preservation and lexical/hybrid fallback on provider errors; semantic conflict-detection orchestration with source-pair validation, duplicate suppression and conservative contextual-difference classification. Every finding remains unresolved and requires human review. No production model/provider or automatic conflict resolution is configured. See docs/semantic-ranking-conflicts.md.

## Stage 11 — HoReCa Knowledge Structure

Integrated foundation: canonical nine-sector taxonomy, cross-sector management-domain catalog, tenant-scoped establishment profile, source intake checklist, source provenance, evidence classes, jurisdiction/validity/applicability metadata and operational knowledge graph.

**Closeout: not closed.** Substantive validation found that the 77-direction restaurant process catalog still marks all entries as requiring owner/jurisdiction review and reuses generic operation sequences extensively; the detailed curated set contains 12 procedures; eight of nine sector corpora are planned; and current answer-level quality is not measured. See `docs/stage-11-validation.md`. Stage 11 remains open for source-specific process review, sector branches, calculation validation and practical answer review.


## Stage 12 — One Expert Intelligence Core

Integrated initial single-core orchestration in `src/intelligence/engine.js`: existing retrieval and evidence adapters feed one deterministic control plane for evidence validation, fact lineage, input sufficiency, causal hypotheses, compatible sourced financial comparisons and recommendation integrity. The parallel expert-analysis implementation has been removed. This is an initial integration, not a claim that every diagnosis is correct. See `docs/stage-12-expert-intelligence.md`.

## Stage 13 — Quality & Evaluation

Started: extended the existing `src/evaluation/knowledge-quality.js` with labelled retrieval ranking metrics (precision@k, recall@k, reciprocal rank, nDCG) and answer-integrity checks for factual evidence lineage, unknown values, hypothesis labels and unresolved conflicts. Added eight labelled HoReCa golden cases. Golden cases now run against the existing lexical ranker and 94-node operational graph; the measured baseline is pinned in `evals/stage-13-retrieval-baseline.json`. The baseline exposes a substantial gap (only two of eight queries retrieve any node). Full source-backed corpus evaluation, hybrid/vector provider evaluation and expert-adjudicated answer quality remain pending. See `docs/stage-13-quality-evaluation.md`.
