# Stage 12 — One Expert Intelligence Core

## Architectural decision

There is exactly one expert decision core: `src/intelligence/engine.js`. It owns the Stage 12 control flow and integrity gates. There is no parallel expert-analysis engine or second orchestration entry point.

The core coordinates existing specialized modules; it does not copy their responsibilities:
- `src/retrieval/context.js` retrieves applicable knowledge, joins the governed evidence registry, reports explicit conflicts and preserves profile gaps.
- `src/evidence/adapter.js` admits only reviewed/approved records with sufficient provenance and validity metadata.
- `src/finance/ratios.js` remains the existing deterministic ratio calculator; the expert core does not recreate those formulas.
- `src/workflow/` remains the approval-gated task lifecycle and outcome-verification boundary.

## Canonical flow

1. Receive the management question, establishment profile and decision-specific required inputs.
2. Retrieve applicable knowledge and governed evidence through the existing retrieval module.
3. Preserve evidence exclusions, applicability gaps and source conflicts.
4. Validate evidence provenance and legal metadata.
5. Separate observed/calculated facts from interpretations, hypotheses and unknowns.
6. Check calculation lineage and decision-input sufficiency. An undeclared input requirement is `not_assessed`, not sufficient.
7. Keep causal links labelled `HYPOTHESIS`; they are not proof.
8. Compare financial scenarios only when both values are finite, sourced and match on metric, definition, scope, period, currency and unit. Delta is proposed minus baseline; desirability is never inferred.
9. Gate recommendations on owner role, timing and verification metric.
10. Return an auditable result with explicit reviewability or incompleteness.

## Five anti-expansion criteria

Every proposed addition must pass all five:
1. **Benefit:** a specific STEN problem is solved.
2. **Necessity:** existing modules cannot already solve it.
3. **Minimality:** no new dependency or standalone service unless essential.
4. **Measurability:** a test demonstrates the improvement.
5. **Compatibility:** existing stages and contracts remain intact.

## Boundaries

- The deterministic core orchestrates and validates; the host model supplies natural-language diagnosis and reasoning.
- Retrieval availability does not prove retrieval completeness or factual correctness.
- Missing inputs are never inferred or coerced to zero.
- The core does not infer legal applicability, causal proof, benchmark targets or favorable financial direction.
- Scenario delta comparison is not a forecast, ROI, cash-flow model or accounting conclusion.
- Stage 11's operational catalog remains a draft pending substantive validation of each process, inter-process relationships, sector exceptions, calculations and practical scenario answers.

## Acceptance criteria

- A single module owns the expert-analysis entry point.
- No parallel expert-analysis source file remains.
- Evidence and fact lineage are validated.
- Missing or undeclared inputs cannot produce a ready result.
- Financial comparison rejects incomplete lineage or incompatible metric bases.
- Causal links remain hypotheses.
- Recommendations require an owner role, timing and verification metric.
- Existing tests and CI pass without new dependencies.
