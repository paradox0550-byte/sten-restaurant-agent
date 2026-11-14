# STEN architecture

STEN is a portable provider-neutral restaurant management intelligence package.

Layers:
1. Assistant identity, canonical instructions and behavior policy.
2. Shared professional knowledge, separated from Evidence Registry records.
3. Skills/workflows for finance, labor, menu, root-cause and operational audit.
4. Deterministic calculators and validation code.
5. Tenant-isolated establishment and manager memory schemas.
6. Provider adapters for ChatGPT and Claude.
7. Evaluation cases and quality gates.

One reasoning method, multiple providers. The provider is an execution environment, not the owner of the canonical methodology.

8. Runtime & integration boundary — provider registry, permission-gated tools, tenant-scoped memory adapter, audit sink and orchestration.

Stage 6 is an injected runtime foundation. It does not include live provider SDKs, production authentication, persistent storage or deployment configuration.

9. Knowledge Retrieval & Expert Context — deterministic lexical retrieval, establishment-profile relevance checks, Evidence Registry joining and explicit conflict surfacing.

Stage 7 is a retrieval foundation. It does not yet include vector embeddings, a vector database, automatic semantic contradiction resolution or a complete curated knowledge corpus.

10. Management Workflow — evidence-gated management cycles, approval-based action tasks, task lifecycle and measured outcome verification. Stage 8 also defines provider-neutral extension contracts for embeddings, semantic reranking and semantic conflict detection.


## 11. Hybrid retrieval and semantic controls

Stage 9 adds provider-injected embeddings, an in-memory cosine vector reference index, hybrid lexical/vector retrieval and Reciprocal Rank Fusion. The index is ephemeral and suitable for tests or small workloads, not a persistent production vector service.

Stage 10 adds optional provider-injected reranking and semantic conflict-detection orchestration. Candidate allowlisting and provenance are preserved; conflicts remain unresolved for human review. No production reranker or contradiction model is bundled.

## 12. HoReCa knowledge structure

Stage 11 integrates the sector taxonomy, establishment profile, source intake/evidence governance, operational graph and procedure structures. Substantive validation remains open: the restaurant corpus and operational procedures require source/owner/jurisdiction review, and the other sector corpora are not represented as complete.

## 13. Expert intelligence and evaluation

Stage 12 provides one deterministic expert-analysis control plane coordinating existing retrieval, evidence, finance and workflow modules. Narrative reasoning remains with the host model.

Stage 13 provides retrieval metrics, answer-integrity checks, golden cases and a provisional holdout diagnostic. The golden retrieval baseline is a regression fixture, not an independent expert-quality certification. The holdout labels still require expert adjudication.

## 14. Final integration and release

Stage 14 verifies documentation, manifests, provider setup, package completeness, security boundaries and reproducible release readiness. It does not silently close Stage 11 or claim production deployment.
