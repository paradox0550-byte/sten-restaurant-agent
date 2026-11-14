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

**Engineering framework closeout: closed.** The existing `src/evaluation/knowledge-quality.js` now provides labelled retrieval metrics, answer-integrity checks and the production lexical-ranker evaluation path. Eight labelled HoReCa golden cases run against the 94-node operational graph. The pinned baseline records Precision@10 36.25%, Recall@10 92.92%, MRR 1.00 and nDCG@10 93.36%; five of eight cases retrieve every expected ID and three are partial (inventory 4/5, schedule/service capacity 4/5, repeat complaint 5/6). All eight have at least one relevant hit. Case counts, ranked IDs and aggregate metrics are regression-tested. See `docs/stage-13-quality-evaluation.md`.

This closes implementation of the evaluation framework and its initial lexical benchmark only. Blind holdout, full source-backed and configured hybrid/vector evaluation, and expert-adjudicated end-to-end answer quality remain follow-up acceptance gates. This does not close Stage 11 or certify professional/legal answer correctness.


### Stage 13 follow-up — holdout preparation

Added a 12-query post-enrichment holdout draft at `evals/stage-13-blind-holdout.json`, executed through the existing production lexical ranker without graph/ranker tuning or score thresholds. Its first diagnostic run is pinned in `evals/stage-13-holdout-baseline.json` (Recall@10 68.06%, MRR 0.8153, nDCG@10 64.37%). Expected IDs are provisional model-authored labels and require expert adjudication; this is preparation for, not a substitute for, a genuinely blind independent evaluation. See `docs/stage-13-quality-evaluation.md`.


## Stage 14 — Final Integration & Release

**Status: in progress; no release is declared.**

Scope:
- stabilize and document the existing interfaces and provider contracts;
- review security boundaries, tenant isolation, permission gating, memory and audit limitations;
- reconcile package manifests and canonical documentation with the tracked repository;
- verify provider setup instructions and supported-host limitations;
- run the complete CI gates and resolve regressions without weakening tests or silently refreshing baselines;
- prepare a reproducible versioned package and release notes.

Current verified status (2026-11-14):
- Latest inspected main CI run `43612137666` (commit `3f293a1241c7b2f8bc23bd90234ba0ac2f975d65`) completed with failure: 90/91 tests passed. The sole failure is the strict Stage 13 golden retrieval top-10 snapshot after graph enrichment. The baseline has not been rewritten; ranking movement still requires case-by-case relevance review.
- The repository tree contains 136 tracked files and `package-manifest.json` lists the same 136 paths: no missing or unlisted paths. Stage metadata now includes Stages 1–14; Stage 14 remains in progress.
- Architecture documentation covers Stages 9–14. Provider files are templates: ChatGPT OpenAPI has a placeholder host and no paths; Claude MCP server list is empty and its Skills need host-format adaptation.
- Runtime security controls have unit coverage for tenant identity, deny-by-default tool permissions, argument validation, tenant-scoped memory and audit filtering. Memory and audit are in-memory development/test adapters; authentication, tenant derivation, durable storage and host authorization remain host responsibilities. This is a code review, not a penetration test or certification.
- No GitHub Release is published. Release remains blocked until the ranking regression is resolved, all CI gates pass, and release artifact/release-note checks are completed.

Non-goals:
- do not reopen or claim completion of Stage 11 substantive validation;
- do not add production providers, persistent vector storage, hosted memory, authentication, external services or dependencies as part of documentation closeout;
- do not deploy or claim production certification.

Stage 14 may close only after the release checklist in `docs/stage-14-final-integration-release.md` is evidenced.
