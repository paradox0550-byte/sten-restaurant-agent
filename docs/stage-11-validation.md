# Stage 11 — substantive validation report

## Decision

**Stage 11 is not closed.** The repository's taxonomy, profile schema, source catalog, process graph and initial restaurant procedures are integrated. The current evidence does not support certifying the operational content as fully validated.

This is a content-validation decision, not a failure of the existing structural tests.

## Verified repository facts

- The restaurant PRACTICE process catalog contains 77 functional directions.
- All 77 entries carry the status `expanded_methodology_requires_owner_and_jurisdiction_validation`.
- A content-shape audit found 15 distinct operation sequences across those 77 entries. The two most common generic sequences are reused by 40 and 20 entries respectively. Therefore the 77 entries are not 77 independently validated SOPs.
- The separately curated `operational-procedures.json` contains 12 detailed procedures, linked to checklists and source records. Some role/cadence values are explicitly inferred, scoped to historical company practice, partial or unknown.
- The source catalog now contains 12 PRACTICE sources after the 17 November 2026 intake; the six newly catalogued sources have metadata-only draft evidence records pending substantive review. These establish provenance and context; they do not establish current law or universal industry requirements.
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


## Additional Stage 11 source expansion — 17 November 2026

Eight supplied files were reviewed and consolidated into the ChatGPT knowledge pack:
- iiko accountant-calculator audit checklist (13 pages; 10 audit sections);
- guest-service standard (2025, A.S. Dumrauf, 43 pages; internal/confidential and scoped to «Азиатский квартал» and «#Farш»);
- operational-management training deck (20 slides; management functions, leadership styles, task-specific work maturity and GROW);
- product-adjacency instruction (2 pages; Olga Ogarkova / HACCP-AUDIT);
- marking checklist (6 pages; HACCP-AUDIT);
- shift-manager operating procedure (4 pages; historical/local ТРАТТОРИЯ context);
- bartender operating procedure (6 pages; historical club/bar context);
- Casual Dining service book copy (2 pages; cover and outline only, not full chapter content).

New documented coverage:
- management cycle, situational leadership, task-specific work maturity and GROW;
- shift manager opening/service/closing responsibilities;
- bartender preparation, stock, service, cleaning, handover and qualification checks;
- waiter service journey, sales stages, guest communication and complaint recovery;
- storage separation, product adjacency, in-house preparation marking, boards/knives, cleaning inventory and chemical containers;
- ten-section iiko stock-accounting audit.

These additions improve source coverage but do not close Stage 11. Source-specific rules, old times, document settings, legal exceptions and fine figures remain unverified. The 25-file ChatGPT Project constraint is addressed by a curated 9-file knowledge pack plus separate project instructions; original repository files remain intact.

## Additional validation gates

- Validate management/shift role authority and opening/closing controls with the current restaurant owner.
- Validate bartender steps against the current bar format, local policy, equipment and law.
- Review guest-service scripts and remedies against the actual concept and delegated authority.
- Validate product storage/marking controls against current official sanitary and technical rules, product categories and actual facility layout.
- Reconcile the iiko checklist with the current version, warehouses, document types, accounting policy and real exports.
- Add expert-adjudicated known-answer cases for all new domains.
- Preserve source-specific values and unknowns; do not promote historical examples into universal norms.

The service book outline is not sufficient evidence for chapter-level procedures. The source material does not include a complete temperature/time matrix or a current legal compliance register.


## Full-repository audit — 18 November 2026

A fresh read-only inventory was performed against main at 7bbdf999c2aa31e1448f03e5a6042bdf9da92183 (174 tracked files). The following findings supersede earlier content-shape counts where they differ.

### Confirmed findings

1. The process catalog contains 77 unique process IDs: 22 management, 5 core and 50 supporting directions.
2. The catalog contains 486 operation entries but only 54 distinct operation descriptions. The 486 completion-evidence entries all use one identical generic sentence. The repeated sequence is scaffolding, not evidence of 77 distinct operating methods.
3. All 77 entries had previously been labelled expanded_methodology_requires_owner_and_jurisdiction_validation, which overstated their maturity. In the audit branch they are explicitly marked inventory_only and catalog_only_source_mapping_and_specialist_validation_open. They must not be used or described as completed SOPs.
4. knowledge/procedures/operational-procedures.json contains 12 more detailed procedures. Their existence does not validate the 77-direction catalog and several retain source-specific, inferred or unknown fields.
5. knowledge/graph/operational-knowledge-graph.json currently contains 96 nodes and 135 edges. Graph connectivity is not process validation or causal proof.
6. knowledge/graph/sources.json contains 12 PRACTICE source records. knowledge/evidence/registry.json contains 10 records (2 CORE, 1 LAW template, 7 PRACTICE); six graph source IDs do not have matching PRACTICE records in the evidence registry, while one PRACTICE record (daily operational walk) is not represented in the graph source catalog. This cross-registry mismatch must be reconciled before claims of complete provenance.
7. The coverage map defines nine sectors but marks only restaurant as partial; the other eight sectors remain planned. The repository is not a reviewed all-HoReCa corpus.
8. Stage 13's automated evaluation remains a retrieval/integrity framework. Its holdout labels are provisional and not expert-adjudicated; no automated score certifies professional correctness.
9. Current GitHub Actions run #229 on the current main SHA completed successfully. This confirms the current engineering CI workflow only; it does not close Stage 11 or establish production readiness.

### Corrective change in audit branch

The 77 process entries have been relabelled as inventory-only scaffolds. A regression test now requires all 77 to retain this explicit non-SOP status. This is an honesty/quality-gate correction, not a claim that the 77 methodologies have been authored.

### Required reconstruction model

The knowledge corpus must be treated as three separate layers:

- Source library: preserve each original document as an individually traceable source, including page/section/sheet/row anchors, version/date, author/publisher where relevant, scope, confidentiality and rights status.
- Expert methodology library: derive new STEN methods from supported source facts plus clearly labelled research or expert reasoning. Each method must have its own operational sequence, decision rules, inputs, outputs, exceptions, records, controls, calculations and verification.
- ChatGPT Project distribution pack: the nine files are a transport/attachment-limit format only. They are generated views over the governed methodology library and must not be treated as the canonical knowledge store or as a limit on the number of methods.

### Full audit completion gates

- Reconcile every original document consolidated into the nine files; no source may disappear behind a combined file.
- Build a source-to-method-to-process-to-tool-to-evaluation traceability matrix.
- Review all 77 catalog directions individually. Split directions when they contain multiple independent workflows; merge only true duplicates. The final number of methods is determined by operational reality, not a target count.
- Replace generic steps only where the source or validated domain method supports a specific sequence. Preserve unknowns where it does not.
- Reconcile the graph source catalog and Evidence Registry one-to-one, including explicit orphan and superseded records.
- Audit all 12 detailed procedures, checklists, role mappings, record templates, graph nodes/edges, calculations, skills, tools, retrieval and answer policies for consistency.
- Review all legal claims separately against current official jurisdiction-specific sources. Historical source wording is not legal evidence.
- Add known-answer tests for every deterministic calculation and representative scenario tests for every approved methodology.
- Keep all disputed or unsupported content visible as open; do not promote it to approved because a file exists or CI passes.

Status: repository audit has identified concrete structural and provenance defects. The reconstruction and specialist validation work remains open. No production or legal certification is implied.


## Domain management frameworks and hierarchical procedure library — 19 November 2026

The nine documents under `knowledge/methodologies/` are now explicitly classified as domain management frameworks/playbooks, not as the final set of operational procedures:
1. Financial control — source reconciliation, P&L perimeter, periodization, ratios, variance diagnosis and verified follow-up.
2. FOT and labor control — demand, workload, schedule, actual attendance, timesheet, accrual and productivity.
3. Stock control — master data, receiving, movement, stocktake, variance and authorized adjustment.
4. Purchasing — demand planning, supplier comparison, approval, receiving, invoice/payment reconciliation and supplier review.
5. Production — forecast, station readiness, recipe/version control, order routing, quality release, waste and throughput.
6. Service — guest journey, accurate product information, complaint recovery, authority and verification.
7. Safety — risk register, local control plan, incident containment, escalation, corrective action and restart approval.
8. People management — role design, recruitment, lawful admission, onboarding, task-based capability, feedback and exit.
9. Director system — daily/weekly/monthly management rhythm, authority matrix, executive panel, task lifecycle and verified outcomes.

These frameworks define cross-cutting management logic and specialist review gates. They do not replace atomic procedures. The canonical hierarchy is now `domain → process → procedure → work instruction/checklist → record/evidence`. A single domain may contain dozens of independent procedures.

### Source and maturity boundaries

- The corporate operating regulation is identified as the 01.09.2025 fast-food edition. Its contents provide anchors: finance pp.31–35; payroll pp.36–43; procurement pp.44–48; safety pp.26–28; production pp.16–25; personnel pp.58–60; stocktake appendix 4 / p.69; hiring/payroll/personnel appendices 17 and 22–29. This source is organization-specific and its full page-level review remains open.
- The iiko calculator checklist (13 pages), product-adjacency guide (2 pages), food-marking checklist (6 pages), shift-manager procedure (4 pages), and 2025 guest-service standard (43 pages) have distinct provenance and limitations. Guest-service full page-level anchor review remains open.
- The director calendar workbook and business-process model workbook are still not recovered. No calendar frequencies, owner names, time budgets or workbook-specific process details have been inferred.
- These are source-grounded management-method prototypes, not approved SOPs. All nine remain draft pending named specialist review and pilot evidence. No legal, accounting, payroll, food-safety or operational certification is implied.
- No deterministic calculator, backend, cloud, API Gateway, deployment or dependency was changed in this methodology slice.


### Hierarchical procedure library correction — 19 November 2026

- Added five proposed complexity levels: L1 execution task; L2 standard procedure; L3 coordinated cross-role process; L4 specialist control; L5 management system/decision.
- Added `docs/knowledge-library-hierarchy.md`, `docs/operational-complexity-levels.md`, machine-readable complexity levels, and `knowledge/procedures/procedure-register.json`.
- The register maps all 77 source-catalog directions to a preliminary complexity level. Every one remains `inventory_only` and `not_yet_decomposed_or_expert_approved`; the complexity assignment is explicitly model-proposed, not a source fact.
- The current operational procedure file contains 12 source-linked procedure cards. These are a starting subset, not a complete operating library.
- One source direction may be decomposed into multiple procedure cards when triggers, roles, inputs, outputs, records, risks or approval rights differ. The count of final procedures is not capped at 77 or 25.
- The 25-file limit applies only to an individual ChatGPT Project distribution package. The canonical repository library is not capped at 25; distribution packs should be generated by role, format and task.
- Added a regression test checking all 77 mappings, the five levels, and the distinction between source inventory and procedure cards.
- The nine prior documents have a visible notice clarifying that they are domain frameworks/playbooks, not atomic SOPs.

The procedure library is now architected hierarchically. Full decomposition of all 77 directions, additional source recovery, page-level anchors, expert review and field pilots remain open.