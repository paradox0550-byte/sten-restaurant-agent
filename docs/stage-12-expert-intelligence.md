# Stage 12 — Expert Intelligence

## Purpose

Connect the existing retrieval, Evidence Registry adapter, Intelligence Engine and management workflow into one auditable expert-analysis entry point. The stage improves decision quality without adding a new provider, database, vector service or runtime dependency.

## Existing components reused

- `src/retrieval/context.js`: lexical retrieval, profile applicability, evidence adaptation and explicit conflicts.
- `src/retrieval/hybrid.js` and optional reranking/conflict adapters: retrieval extensions already available to host orchestration.
- `src/evidence/adapter.js`: only reviewed/approved, sufficiently traceable evidence is adapted.
- `src/intelligence/engine.js`: evidence, fact, legal applicability and action integrity gates.
- `src/workflow/`: approval-gated management tasks and outcome verification.

## Stage 12 additions

- `src/intelligence/expert-analysis.js` exposes `buildExpertAnalysis`, the orchestration entry point.
- `assessInputSufficiency` checks caller-declared requirements. Zero and false are valid supplied values; null, undefined and blank strings are missing.
- `compareDecisionScenarios` calculates proposed minus baseline only when both values are finite, source-linked and share scope, period, currency and unit. A positive or negative delta is not automatically labelled good or bad.
- Causal links are labelled `HYPOTHESIS` and require verification. A plausible chain is not proof of causality.
- The result keeps retrieval, sufficiency, evidence/fact integrity, financial assessments and actions separately inspectable.

## Canonical expert-analysis sequence

1. Clarify the decision and establishment context.
2. Retrieve applicable professional knowledge and governed evidence.
3. Preserve retrieval exclusions, applicability gaps and source conflicts.
4. Check decision-specific required inputs.
5. Separate observed, calculated, interpreted, hypothetical and unknown information.
6. Trace candidate causes and consequences as hypotheses until verified.
7. Compare financial scenarios only on a compatible, source-linked basis.
8. Produce actions with owner role, timing and verification metric.
9. Return a reviewable result or an explicit incomplete status.

## Five anti-expansion criteria

Every proposed addition must pass all five:
1. **Benefit:** a specific STEN problem is solved.
2. **Necessity:** existing modules cannot already solve it.
3. **Minimality:** no new dependency or standalone service unless essential.
4. **Measurability:** a test demonstrates the improvement.
5. **Compatibility:** existing stages and contracts remain intact.

## Explicit limitations

- The orchestrator does not generate a diagnosis narrative; the host model supplies reasoning under the evidence contract.
- The orchestrator does not infer missing inputs, legal applicability, causal proof, benchmark targets or favorable financial direction.
- Financial comparison is not a forecast, cash-flow model, ROI model or accounting conclusion. Those require separately approved assumptions and methods.
- Retrieval availability does not prove retrieval completeness or factual correctness.
- Stage 11's operational catalog remains a draft pending mandatory substantive validation of every process, cross-process links, sector exceptions, calculations and practical answer quality.

## Acceptance criteria

- Missing required inputs block readiness without coercing values to zero.
- Financial scenario comparison rejects missing lineage and incompatible bases.
- Causal links remain explicitly hypothetical.
- Retrieval and analysis integrity are returned together.
- Existing tests and the new Stage 12 tests pass without adding dependencies.
- CI passes on the integrated commit.
