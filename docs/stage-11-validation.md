# Stage 11 — substantive validation report

## Decision

**Stage 11 is not closed.** The repository's taxonomy, profile schema, source catalog, process graph and initial restaurant procedures are integrated. The current evidence does not support certifying the operational content as fully validated.

This is a content-validation decision, not a failure of the existing structural tests.

## Verified repository facts

- The restaurant PRACTICE process catalog contains 77 functional directions.
- All 77 entries carry the status `expanded_methodology_requires_owner_and_jurisdiction_validation`.
- A content-shape audit found 15 distinct operation sequences across those 77 entries. The two most common generic sequences are reused by 40 and 20 entries respectively. Therefore the 77 entries are not 77 independently validated SOPs.
- The separately curated `operational-procedures.json` contains 12 detailed procedures, linked to checklists and source records. Some role/cadence values are explicitly inferred, scoped to historical company practice, partial or unknown.
- The source catalog contains six PRACTICE sources. These establish provenance and context; they do not establish current law or universal industry requirements.
- The operational graph has structurally resolvable nodes, edges and source links. Its analytical paths are explicitly not causal proof.
- The nine-sector taxonomy is defined. The restaurant corpus is marked partial; cafe, bar, bakery, hotel food service, catering, canteen, food hall and quick service are marked planned.
- Existing quality tests explicitly report that semantic correctness and legal validity are not measured.
- The repository contains deterministic menu primitives in `src/menu/engineering.js` and workload-to-hours primitives in `src/labor/productivity.js`. Their existence does not establish full workflow or real-site accuracy.

## New Stage 11 methodology coverage

### Kitchen workforce planning by section and interval

Added:
- `docs/stage-11-kitchen-workforce-planning.md` — source/measurement requirements, per-station workload method, interval peak analysis, exceptions, output contract and acceptance cases.
- `calculateKitchenSectionStaffing` in `src/labor/productivity.js`, mirrored in `tools/calculators/labor/productivity.js`.
- Expanded `skills/labor-analysis/SKILL.md` with POS/KDS demand by dish and time bucket, active station minutes, batch/setup work, fixed work, utilization, coverage and roster constraints.
- Known-answer and guardrail tests in `tests/labor-menu-service.test.js`.

The calculator estimates concurrent workload-based headcount for one section and interval. It is not a roster, statutory staffing ratio or validated productivity standard. Site-specific time standards and productive utilization still require measured observations and kitchen-manager approval.

### Autonomous menu engineering

Added:
- `docs/stage-11-menu-engineering.md` — complete workflow from data reconciliation and recipe costing through contribution, popularity, ABC, four-quadrant classification, recommendations, testing and follow-up.
- Expanded `skills/menu-analysis/SKILL.md` with autonomous analysis and human-approval boundaries.
- Existing deterministic menu primitives remain the calculation layer; no universal cutoffs are hard-coded.

This is a workflow/methodology expansion, not proof that recommendations increase sales or profit. Recipe cost completeness, threshold approval, demand response, data quality and expert adjudication remain required.

## Validation results by criterion

| Criterion | Current evidence | Result |
|---|---|---|
| Source provenance | Six source records, all PRACTICE, limitations recorded | Partial |
| 77-direction operational accuracy | All entries await process-owner/specialist validation; repeated generic sequences | Not validated |
| Detailed procedure depth | 12 procedures with steps, checklist and verification; several inferred/scoped fields | Partial |
| Cross-process relationships | Graph structure and seeded multi-hop paths resolve; relationships are not causality | Structural pass only |
| Sector-specific exceptions | Nine taxonomy branches; eight sector corpora planned | Not validated |
| Calculation correctness | Existing finance/menu/labor primitives; new station workload calculator has known-answer tests; real-site standards and full menu workflow remain unvalidated | Partial |
| Kitchen staffing methodology | Section × interval workload model and input guardrails documented; local time standards, roster feasibility and independent kitchen-expert review outstanding | Method defined; expert validation open |
| Menu engineering methodology | End-to-end analysis workflow documented; menu primitives require complete source data and approved thresholds; independent menu-expert adjudication outstanding | Method defined; expert validation open |
| Practical expert answers | Seed cases specify expected paths and guardrails; answer quality is explicitly not measured | Not validated |
| Legal applicability | Sources are PRACTICE and local legal validation remains separate | Not validated |

## Blocking conditions for closeout

1. Review each of the 77 directions against its exact source section and replace generic sequence reuse with source-specific operations where the source supports detail.
2. Have process owners or qualified reviewers validate operational sequence, handoffs, exceptions, records and verification.
3. Complete sector-specific operating branches and evaluations beyond the restaurant baseline.
4. Validate each calculation with known-answer test fixtures, units, periods, denominators and missing-input cases.
5. For kitchen staffing, collect representative time-study observations by dish × station, validate POS/KDS routing and forecast intervals, then compare modelled requirements with actual ticket times, workload and paid hours.
6. For menu engineering, validate recipe versions, yield and cost perimeter; approve thresholds; reconcile POS totals; adjudicate classifications and test recommendations against observed outcomes.
7. Run representative answer-level evaluations and record reviewer decisions.
8. Add jurisdiction-specific official legal evidence only where needed; do not infer legal requirements from PRACTICE material.

## Relationship to Stage 13

Stage 13 begins with reusable automated metrics for retrieval ranking and answer evidence integrity, plus labelled HoReCa golden cases. These tools can measure repeatable quality dimensions, but cannot substitute for specialist validation or retroactively close Stage 11.

**Status: integrated foundation; substantive validation open.**
