# HoReCa sector-domain matrix and multi-hop evaluation

## Sector-domain matrix

`knowledge/taxonomy/sector-domain-matrix.json` maps the nine current HoReCa sectors to operational branches and establishment-profile fields. Shared management domains remain cross-sector; sector branches identify where specialist procedures and metrics are needed.

The matrix is a taxonomy and coverage plan, not proof of curated knowledge. Corpus status is explicit for each sector. Hotel accommodation dependencies, franchise, multi-unit operations, and mobile/pop-up service are represented as cross-sector contexts rather than incorrectly forced into a single outlet format.

## Multi-hop evaluation

`src/evaluation/multihop.js` checks whether each declared evaluation path resolves through existing graph nodes and directed edges, and whether unsupported-claim guardrails are present.

Edges with type `analytical_path` are explicitly marked `evaluation_route_not_causal`. They describe a path that an expert analysis may need to inspect; they do not assert causal relationships. Causality must be established from case evidence.

The current harness measures **structural graph coverage only**. It does not measure answer faithfulness, retrieval recall, semantic reranking, source correctness, or model reasoning quality. Those require a representative evidence corpus and controlled answer-level evaluations. No production provider is configured.

Run with `node src/evaluation/multihop.js`; run the full suite with `npm test`.
