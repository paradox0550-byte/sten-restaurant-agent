# Stage 13 — Quality & Evaluation

## Goal

Measure whether STEN retrieves the right knowledge, supports factual claims, preserves contradictions and unknowns, and produces reliable answers to representative HoReCa questions. Passing structural tests alone is not evidence of expert answer quality.

## Existing evaluator extended

The existing `src/evaluation/knowledge-quality.js` remains the evaluation entry point. It now includes:

- `evaluateRetrievalRanking`: precision@k, recall@k, reciprocal rank and nDCG against labelled relevant IDs.
- `evaluateAnswerIntegrity`: checks factual claim evidence lineage, unknown-value coercion, hypothesis labels and preservation of expected unresolved conflicts.
- Existing `evaluateKnowledgeQuality` remains explicitly scoped to metadata and cross-reference integrity.

No separate evaluation engine or runtime dependency was introduced.

## Golden HoReCa set

`evals/stage-13-golden-cases.json` contains eight labelled cases covering:
- missing finance inputs and Food Cost integrity;
- stocktake-to-Food-Cost multi-hop analysis;
- schedule-to-service-capacity analysis;
- repeat complaints and service recovery;
- training effectiveness and recheck;
- unknown profile attributes and applicability;
- unknown source cadence;
- conflicting revenue sources.

Each case defines expected retrieval IDs, required inputs, required answer behavior and claims that must not be made.

## Measurement boundaries

Automated metrics measure ranking and integrity properties only. They do not independently judge whether a diagnosis is professionally correct, whether a proposed action is useful, or whether local legal requirements apply. Those dimensions require expert-reviewed answer annotations.

An unlabelled retrieval case is unscored. Missing evidence is a failure, not a neutral score. A knowledge-base change must rerun the golden set and compare metrics with the prior baseline.

## Stage 13 work remaining

1. Connect the labelled cases to the actual retrieval pipeline and record baseline metrics.
2. Add adjudicated expected evidence and reviewer-approved answer rubrics for every case.
3. Add contradiction and unknown-value regression fixtures across all domains.
4. Add sector-specific cases as each Stage 11 corpus is reviewed.
5. Establish regression thresholds only after a baseline is measured; do not invent target percentages.
6. Record failures by case, domain, source and retrieval rank, then improve existing retrieval/knowledge modules rather than layering a second engine.

## Current status

Initial evaluation primitives and golden-case specifications are committed. This is the start of Stage 13, not a claim that STEN's live answer quality has already been measured.
