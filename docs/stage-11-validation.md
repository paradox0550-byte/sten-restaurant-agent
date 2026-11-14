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

## Validation results by criterion

| Criterion | Current evidence | Result |
|---|---|---|
| Source provenance | Six source records, all PRACTICE, limitations recorded | Partial |
| 77-direction operational accuracy | All entries await process-owner/specialist validation; repeated generic sequences | Not validated |
| Detailed procedure depth | 12 procedures with steps, checklist and verification; several inferred/scoped fields | Partial |
| Cross-process relationships | Graph structure and seeded multi-hop paths resolve; relationships are not causality | Structural pass only |
| Sector-specific exceptions | Nine taxonomy branches; eight sector corpora planned | Not validated |
| Calculation correctness | Existing deterministic finance/labor/menu calculators and tests exist; full process-by-process calculation audit not demonstrated | Partial |
| Practical expert answers | Seed cases specify expected paths and guardrails; answer quality is explicitly not measured | Not validated |
| Legal applicability | Sources are PRACTICE and local legal validation remains separate | Not validated |

## Blocking conditions for closeout

1. Review each of the 77 directions against its exact source section and replace generic sequence reuse with source-specific operations where the source supports detail.
2. Have process owners or qualified reviewers validate operational sequence, handoffs, exceptions, records and verification.
3. Complete sector-specific operating branches and evaluations beyond the restaurant baseline.
4. Validate each calculation with known-answer test fixtures, units, periods, denominators and missing-input cases.
5. Run representative answer-level evaluations and record reviewer decisions.
6. Add jurisdiction-specific official legal evidence only where needed; do not infer legal requirements from PRACTICE material.

## Relationship to Stage 13

Stage 13 begins with reusable automated metrics for retrieval ranking and answer evidence integrity, plus labelled HoReCa golden cases. These tools can measure repeatable quality dimensions, but cannot substitute for specialist validation or retroactively close Stage 11.

**Status: integrated foundation; substantive validation open.**
