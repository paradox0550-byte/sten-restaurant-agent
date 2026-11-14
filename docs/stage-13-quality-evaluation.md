# Stage 13 — Quality & Evaluation

## Engineering closeout

**Implementation status: closed.** The repository now has one evaluation entry point, a labelled HoReCa retrieval set, repeatable metrics, answer-integrity checks, and a pinned CI baseline. No parallel evaluator, retrieval engine or runtime dependency was added.

This closeout means the Stage 13 evaluation framework and its initial benchmark are implemented and regression-tested. It does **not** certify the agent as an expert system or claim that answer quality, legal validity or all HoReCa domains have passed expert acceptance.

## Implemented

The existing `src/evaluation/knowledge-quality.js` remains the single evaluation entry point:

- `evaluateRetrievalRanking`: precision@k, recall@k, reciprocal rank and nDCG against labelled relevant IDs.
- `evaluateAnswerIntegrity`: factual claim evidence lineage, unknown-value coercion, HYPOTHESIS labelling and preservation of expected unresolved conflicts.
- `evaluateKnowledgeQuality`: metadata and cross-reference integrity only.
- `runRetrievalEvaluation`: runs labelled cases through the production lexical ranker; it does not substitute a mock ranker.

The eight golden cases cover:
- missing finance inputs and Food Cost integrity;
- stocktake-to-Food-Cost multi-hop analysis;
- schedule-to-service-capacity analysis;
- repeat complaints across service, kitchen and shift;
- training effectiveness and recheck;
- unknown profile attributes and applicability;
- unknown source cadence;
- conflicting revenue sources.

## Pinned retrieval baseline

Measured against 94 operational graph nodes, lexical retrieval, top-10, eight labelled cases:

| Metric | Measured value |
|---|---:|
| Precision@10 | 36.25% |
| Recall@10 | 92.92% |
| Reciprocal rank (MRR) | 1.00 |
| nDCG@10 | 93.36% |
| Cases fully retrieving all expected IDs | 5 of 8 |
| Cases with at least one expected ID missing | 3 of 8 |

The three partial cases are:
- inventory variance: 4 of 5 expected IDs;
- schedule/service capacity: 4 of 5;
- repeat complaint: 5 of 6.

The other five cases retrieve all their expected IDs. Every case has at least one relevant result; there is no zero-hit case in this baseline. The case-level counts and macro metrics are asserted in `tests/knowledge-quality.test.js`, and ranked ID order is pinned in `evals/stage-13-retrieval-baseline.json`.

The 92.92% macro recall is the measured result for this small, curated set. It is not a general accuracy estimate. Precision@10 is low in part because the metric divides by all ten slots even when fewer than ten results are returned; this convention is retained consistently in the baseline.

## Evaluation boundaries and remaining acceptance work

The current benchmark is a lexical regression benchmark over the operational graph only. It does not measure:
- retrieval over the full source-backed knowledge corpus;
- hybrid/vector retrieval with a configured production embedding provider;
- an independent blind holdout set (the graph enrichment and golden cases are not independent);
- expert-adjudicated professional correctness, operational usefulness or sector-specific applicability of generated answers;
- jurisdiction-specific legal validity.

The answer-integrity evaluator is implemented and has focused unit tests, but the golden questions are not yet run end-to-end through a live language-model answer path with expert-scored rubrics. An automated pass therefore cannot be interpreted as a professional quality verdict.

Do not add query-derived keywords merely to force recall to 100%, and do not introduce arbitrary metric thresholds. Any future retrieval tuning must diagnose the missing expected IDs, preserve the relevance labels, rerun the same baseline, and also pass a separately authored blind holdout set.

## Follow-up acceptance work

These are explicit follow-up quality gates, not missing Stage 13 framework implementation:

1. Build an independent blind holdout of unseen HoReCa questions and have an expert adjudicate expected evidence IDs.
2. Expand contradiction and unknown-value fixtures across finance, people, service, safety, supply and facilities.
3. Evaluate the complete source-backed corpus and configured hybrid/vector path when those sources/providers exist.
4. Run answer scenarios end-to-end and have experts score factual support, operational correctness, applicability and recommendation usefulness.
5. Add sector-specific evaluation cases as the Stage 11 sector corpora are substantively reviewed.

Stage 11 remains open and is not closed by this evaluation framework. No claim is made that the 77-direction operational catalog, all nine sector branches, legal records or every calculation has passed substantive expert validation.

## CI record

The Stage 13 regression suite pins ranked result IDs, per-case relevant counts and aggregate metrics. The most recent successful CI run before this closeout is recorded in the repository workflow history; the closeout commit itself must pass CI before it is considered integrated.


## Post-enrichment holdout draft

Added `evals/stage-13-blind-holdout.json`: 12 new queries across supply quality, temperature deviations, cash reconciliation, delivery handoff, seasonal menu costing, uniform readiness, guest allergy handling, task ownership, equipment maintenance, takeaway completeness, payroll/timekeeping and sales-decline review.

The cases were authored after the graph enrichment and are not used to tune retrieval or graph metadata. Their expected IDs are **provisional model-authored labels**, checked only for existence in the graph. They have not been independently adjudicated by a HoReCa expert. The file therefore deliberately says this is not an independently administered blind study. Until a qualified reviewer approves or corrects the expected IDs, the measured scores are diagnostic only and must not be represented as validated accuracy.

A regression test runs all 12 through the production lexical ranker, verifies corpus coverage and distinct case IDs, and prints per-case and aggregate metrics in CI. It sets no arbitrary pass threshold and does not modify the graph or ranker. Do not tune against this holdout; after expert adjudication, keep a separate sealed set for final blind evaluation.


### First diagnostic result (CI)

The first run completed successfully on the unchanged 94-node graph and lexical ranker:

| Metric | Holdout diagnostic |
|---|---:|
| Precision@10 | 23.33% |
| Recall@10 | 68.06% |
| MRR | 0.8153 |
| nDCG@10 | 64.37% |

Case-level retrieval is uneven. Cash reconciliation, seasonal menu costing and uniform readiness retrieved all provisional expected IDs. Temperature deviation retrieved 1/3; takeaway completeness 1/3; delivery handoff 2/4; payroll/timekeeping 2/4. The other cases range from 2/3 to 3/4.

These values are **not a fair comparison** with the eight-case golden baseline because the questions and provisional labels differ and have not been expert-adjudicated. They are useful as a diagnostic signal only. The weaker safety and delivery cases should be reviewed first for two distinct possibilities: missing graph coverage versus lexical mismatch. Do not assume every missing expected ID is a ranker defect; the reviewer may decide an expected node is not actually relevant, or that the graph lacks the required knowledge.

The exact first-run figures are recorded in `evals/stage-13-holdout-baseline.json` and were emitted by CI run [43601928590](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43601928590). No graph or ranker tuning was made in response to this result.
