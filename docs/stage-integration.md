# Stage integration and closeout record

## Integrated stages
- Stage 1 — assistant identity, canonical instructions, behavior rules, knowledge governance, memory policy and core evaluations.
- Stage 2 — finance/P&L, Food/Labor/Prime Cost, FOT/payroll/productivity, menu engineering, shift/service and operational audit methodology.
- Stage 3 — cumulative knowledge base, deterministic calculators, service recovery, research register, provider adapter templates and tests.
- Stage 4 — Intelligence Engine, cross-domain diagnosis, evidence/fact validation, unknown handling, hypothesis labelling and action verification fields.
- Stage 5 — Knowledge & Evidence Layer: registry schema, provenance, validity lifecycle, territory, applicability, limitations, conflict policy and a registry-to-Intelligence-Engine adapter.

## Stage 5 integration boundary
The src/evidence/adapter.js module maps reviewed/approved registry records into the Stage 4 evidence envelope. Draft, unknown-validity and unverified records are excluded rather than promoted to facts. PRACTICE is a distinct evidence class and is accepted by the Intelligence Engine; it is not interchangeable with LAW or RESEARCH.

## Acceptance status
The repository contains a working, testable foundation for Stages 1–5. Automated CI verifies tests, registry validity and all manifest paths. This does not mean every knowledge domain is populated or that the package is production-certified.

Not claimed:
- a live, exhaustive legal database for any jurisdiction;
- a complete peer-reviewed research corpus;
- automatic legal applicability matching for all establishment conditions;
- production API, hosted memory, provider deployment or compliance certification.

Legal records remain jurisdiction- and date-specific. Unknown profile data remain unknown. No registry entry certifies an establishment's compliance.


## Stage 9 — Hybrid Retrieval

Integrated: provider-injected query/document embeddings, validated in-memory cosine vector index, lexical+vector retrieval and Reciprocal Rank Fusion. The in-memory index is a reference implementation for tests and small workloads only; no production embedding provider or persistent vector database is bundled. Retrieval quality seed cases are versioned under `evals/` and require a labelled corpus before production acceptance.
