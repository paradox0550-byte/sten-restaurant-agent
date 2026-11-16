# Stage integration and closeout record

This document is the canonical stage-by-stage engineering status for STEN 0.5.0. It distinguishes integrated code from validated knowledge, host deployment and release publication.

## Stage map — 1–14

| Stage | Name | Status | Scope and closeout boundary |
|---:|---|---|---|
| 1 | Assistant Identity & Governance | Integrated | Identity, canonical instructions, behavior policy, knowledge governance, memory policy and core evaluations. The package is not itself a hosted assistant. |
| 2 | HoReCa Management Methodology | Integrated foundation | Finance/P&L, Food/Labor/Prime Cost, FOT/payroll/productivity, menu engineering, shift/service and operational audit methodology. Coverage depth varies by domain and format. |
| 3 | Knowledge, Skills & Calculators | Integrated foundation | Cumulative knowledge, reusable skills, deterministic calculators, service recovery, research register, provider templates and tests. The source corpus is not complete. |
| 4 | Intelligence Engine | Integrated foundation | Cross-domain diagnosis, evidence/fact validation, unknown handling, hypothesis labels and action-verification fields. Narrative reasoning remains with the host model. |
| 5 | Knowledge & Evidence Layer | Integrated | Registry schema, provenance, validity lifecycle, territory, applicability, limitations, conflict policy and registry-to-engine adapter. Registry validity is not legal certification. |
| 6 | Runtime & Integration | Integrated foundation + structured knowledge capture | Provider/tool/memory/audit injection, tenant-required operations, permission-gated tools, provenance-aware capture and conflict preservation. Production persistence/auth remain host responsibilities. |
| 7 | Knowledge Retrieval & Expert Context | Integrated | Lexical ranking, establishment-profile applicability checks, Evidence Registry joining and explicit conflict reporting. No automatic legal applicability or conflict resolution. |
| 8 | Management Workflow | Integrated | Analysis-gated action planning, human approval, task lifecycle and evidence-backed outcome verification. External task execution requires a host connector. |
| 9 | Hybrid Retrieval | Integrated reference implementation | Provider-injected embeddings, in-memory cosine vector index, lexical/vector fusion and RRF. No production embedding provider or persistent vector database. |
| 10 | Semantic Ranking & Conflict Intelligence | Integrated adapter contracts | Provider-injected reranking and conflict detection with provenance preservation and human review. No production model is bundled; conflicts are not auto-resolved. |
| 11 | HoReCa Knowledge Structure | Foundation integrated; substantive validation open | Nine-sector taxonomy, establishment profile, source governance and operational graph exist. Process catalog, calculations, sector branches and answer quality still require expert/source/jurisdiction review. |
| 12 | One Expert Intelligence Core | Initial single-core integration | One control plane in `src/intelligence/engine.js` coordinates retrieval, evidence, finance and workflow. It does not prove every diagnosis correct. |
| 13 | Quality & Evaluation | Engineering framework closed | Retrieval metrics, answer-integrity checks, golden cases and regression gates are implemented. Expert-adjudicated answer quality, independent blind evaluation and legal validity are not certified. |
| 14 | Final Integration & Release | Engineering integration substantially complete; release not published | Documentation, package integrity, provider templates and source-level security review are integrated. Secret/private-data clearance, final archive verification and explicit release approval remain open. |

## Stages 1–5 — methodology and evidence foundation

The repository contains a working, testable foundation for Stages 1–5. Automated CI verifies tests, registry validity and package-manifest paths. This does not mean every knowledge domain is populated or that the package is production-certified.

### Stage 5 integration boundary

The `src/evidence/adapter.js` module maps reviewed/approved registry records into the Stage 4 evidence envelope. Draft, unknown-validity and unverified records are excluded rather than promoted to facts. PRACTICE is a distinct evidence class and is not interchangeable with LAW or RESEARCH.

Not claimed:
- a live, exhaustive legal database for any jurisdiction;
- a complete peer-reviewed research corpus;
- automatic legal applicability matching for all establishment conditions;
- production API, hosted memory, provider deployment or compliance certification.

Legal records remain jurisdiction- and date-specific. Unknown profile data remain unknown. No registry entry certifies an establishment's compliance.

## Continuous Restaurant Memory — Stages 6, 11 and 12

A restaurant profile is optional, not an onboarding gate. The runtime now exposes a structured capture boundary for local restaurant facts and operational changes. It silently captures only explicit, unambiguous, low-risk assertions meeting the confidence threshold; other candidates require confirmation. Source provenance and validity dates are retained. Conflicts are appended for review rather than silently overwritten. Local facts are not promoted to approved standards or global methodology by capture.

Implementation: `src/runtime/knowledge-capture.js`; policy and lifecycle: `memory/memory-policy.md` and `docs/continuous-restaurant-memory.md`. The current adapter is still in-memory development/test infrastructure; this does not provide durable production learning or extraction from raw chat messages.

## Stages 6–8 — runtime, retrieval and workflow

- Stage 6 runtime contracts are described in `docs/runtime-integration.md`. The host authenticates callers and derives tenant identity and permissions. In-memory memory/audit are development and test adapters only.
- Stage 7 lexical retrieval and applicability controls are described in `docs/retrieval-context.md`. Evidence provenance and unresolved conflicts remain visible.
- Stage 8 approval-gated management cycles and outcome verification are described in `docs/management-cycle.md`. STEN proposes and verifies tasks; it does not perform external actions without a host connector.

## Stage 9 — Hybrid Retrieval

Integrated: provider-injected query/document embeddings, validated in-memory cosine vector index, lexical+vector retrieval and Reciprocal Rank Fusion. The in-memory index is a reference implementation for tests and small workloads only; no production embedding provider or persistent vector database is bundled. See `docs/hybrid-retrieval.md`.

## Stage 10 — Semantic Ranking & Conflict Intelligence

Integrated: provider-injected semantic reranking with candidate allowlisting, provenance preservation and lexical/hybrid fallback on provider errors; semantic conflict-detection orchestration with source-pair validation, duplicate suppression and conservative contextual-difference classification. Every finding remains unresolved and requires human review. No production model/provider or automatic conflict resolution is configured. See `docs/semantic-ranking-conflicts.md`.

## Stage 11 — HoReCa Knowledge Structure

Integrated foundation: canonical nine-sector taxonomy, cross-sector management-domain catalog, tenant-scoped establishment profile, source intake checklist, source provenance, evidence classes, jurisdiction/validity/applicability metadata and operational knowledge graph.

**Closeout: not closed.** Substantive validation found that the 77-direction restaurant process catalog still marks all entries as requiring owner/jurisdiction review and reuses generic operation sequences extensively; the detailed curated set contains 12 procedures; eight of nine sector corpora are planned; and current answer-level quality is not measured. Kitchen staffing by station/interval and autonomous menu-engineering workflows have now been specified, with a deterministic section-workload calculator and guardrail tests. These additions define methods; they do not certify site-specific time standards, recipe data, thresholds or expert answer quality. See `docs/stage-11-validation.md`, `docs/stage-11-kitchen-workforce-planning.md` and `docs/stage-11-menu-engineering.md`. Stage 11 remains open for source-specific process review, sector branches, real-site calculation validation and practical expert review.

## Stage 12 — One Expert Intelligence Core

Integrated initial single-core orchestration in `src/intelligence/engine.js`: existing retrieval and evidence adapters feed one deterministic control plane for evidence validation, fact lineage, input sufficiency, causal hypotheses, compatible sourced financial comparisons and recommendation integrity. The parallel expert-analysis implementation has been removed. See `docs/stage-12-expert-intelligence.md`.

## Stage 13 — Quality & Evaluation

**Engineering framework closeout: closed.** The existing `src/evaluation/knowledge-quality.js` provides labelled retrieval metrics, answer-integrity checks and the production lexical-ranker evaluation path. Eight labelled HoReCa golden cases run against the operational graph. The current tuned lexical ranker measures Precision@10 36.25%, Recall@10 92.92%, MRR 1.00 and nDCG@10 93.65%; the pinned nDCG baseline is 93.36%. Five of eight cases retrieve every expected ID and three are partial. These are regression measurements on a small curated set, not general accuracy or expert certification. See `docs/stage-13-quality-evaluation.md`.

The 12-query post-enrichment holdout is diagnostic only. Its expected IDs are provisional model-authored labels and require expert adjudication; it is not an independent blind study. See `evals/stage-13-blind-holdout.json` and `docs/stage-13-quality-evaluation.md`.

## Stage 14 — Final Integration & Release

**Status: engineering integration substantially complete; release publication remains open.**

Latest verified integration code commit: `c6d5c8e39704177e06da1fa82644a90838ba56cd`, CI run [43621988654](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43621988654): 91/91 tests passed, Evidence Registry validation passed (with one explicit warning for an unknown legal intake placeholder), and package-integrity validation passed.

The subsequent documentation-only main commit is `625260941f913a569f62b958bbf074d0adac9518`. The release-candidate branch has moved beyond that baseline and has its own CI. Current candidate metrics and manifest counts are recorded in `docs/stage-14-final-integration-release.md`.

Provider files remain unconfigured templates: ChatGPT OpenAPI has a placeholder host and no paths; Claude MCP server list is empty and its Skills need host-format adaptation. Runtime security controls have unit coverage for tenant identity, deny-by-default tool permissions, argument validation, tenant-scoped memory and audit filtering. Memory and audit are in-memory development/test adapters; authentication, tenant derivation, durable storage and host authorization remain host responsibilities. This is a source-level review, not a penetration test or certification.

Open release gates:
- complete and evidence a secret/private-operational-data scan of the distributable contents;
- generate a source archive from the final release commit and verify its checksum and contents;
- verify final release notes and artifact contents;
- obtain explicit owner approval before publishing a tag or GitHub Release.

Non-goals:
- do not close Stage 11 substantive validation through Stage 14;
- do not add production providers, persistent vector storage, hosted memory, authentication, external services or dependencies as part of documentation closeout;
- do not deploy or claim production certification.

Stage 14 is ready for owner-led private pilot testing after the current candidate CI succeeds. It remains open for public release until redistribution rights are confirmed, a final tag archive is generated, and the owner explicitly approves publication. Stage 11 substantive expert validation remains open and is not a blocker to beginning a controlled pilot.
