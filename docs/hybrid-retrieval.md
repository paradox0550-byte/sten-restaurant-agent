# Stage 9 — Hybrid Retrieval

## Scope

The retrieval layer now combines the existing deterministic lexical ranker with an optional embedding/vector channel. Reciprocal Rank Fusion (RRF) combines channel orderings without assuming that BM25-like and cosine scores share a scale.

## Components

- `retrieveByVector` calls a host-supplied `embedder.embed(query)` and `index.search({ vector, limit })`.
- `InMemoryVectorIndex` is a dependency-free reference index using cosine similarity. It validates finite vectors and consistent dimensions. It is ephemeral and intended for tests and small demonstrations, not persistent production storage.
- `hybridRetrieve` runs lexical retrieval and vector retrieval; if the vector adapter is unavailable, it returns lexical results with an explicit `lexical_fallback` mode.
- `reciprocalRankFusion` merges ranked lists by document ID and preserves deterministic tie-breaking.

## Host integration contract

A production host must provide a real embedding model and a persistent vector index. The embedding model must use the same model/version and dimensions for indexed documents and query vectors. Re-embedding is required when that model changes. Store document IDs and metadata in the index; retrieve full authoritative documents from the canonical knowledge store. Apply tenant, jurisdiction, validity and profile filters before exposing results. Never treat vector similarity as evidence quality or legal applicability.

## Quality gate

Seed cases are in `evals/retrieval-quality-cases.json`. They are not a production benchmark yet: expected IDs require human review against a representative, labelled HoReCa corpus. Before selecting a production model/index, measure Recall@k, MRR and nDCG@k on that corpus and compare lexical-only against hybrid retrieval. Do not choose a provider based on anecdotal examples.

## Boundaries

Stage 9 does not implement semantic reranking, automatic semantic contradiction detection, persistent vector storage, or a complete HoReCa knowledge corpus. Those are separate acceptance criteria. Embeddings improve candidate recall; they do not establish truth.
