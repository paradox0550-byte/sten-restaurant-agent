# Stage 11.1 — Restaurant Knowledge Full Audit Workplan

## Decision record

- Primary jurisdiction: Russian Federation.
- Next jurisdiction: Germany, as a separate legal/applicability contour after the Russian restaurant baseline.
- Sector order: restaurants first; the other eight HoReCa sectors remain in the shared taxonomy and are not represented as validated.
- Review format: complete repository audit first; then present only disputed, ambiguous, unsupported or decision-dependent findings for expert review.
- Audit posture: read-only review of current knowledge and sources until findings are approved. Do not silently rewrite operational content during discovery.

## Objective

Produce a source-traceable, end-to-end audit of the restaurant knowledge corpus and its Russian applicability. Determine what is supported, what is only historical/company practice, what is incomplete, what conflicts, what is outdated, and what cannot be concluded. The audit is not a compliance certificate and does not appoint process owners for any real establishment.

## Baseline observed in repository

- `knowledge/procedures/horeca-operational-process-catalog.json`: 77 functional directions; all currently marked `expanded_methodology_requires_owner_and_jurisdiction_validation`.
- The 77 directions are not 77 independently validated SOPs: prior content-shape inspection found 15 distinct operation sequences, with generic sequences repeated across many directions.
- `knowledge/procedures/operational-procedures.json`: 12 curated detailed procedures.
- `knowledge/graph/sources.json`: 12 source records, all classed PRACTICE (six newly added source records remain draft pending expert review); several have unverified or historical dates and organization-specific scope.
- `knowledge/graph/operational-knowledge-graph.json`: 94 nodes and 128 edges at the audit baseline. Graph connectivity does not establish causation or operational validity.
- The nine-sector taxonomy exists; restaurant is the current partial corpus and eight other sectors are planned.

## Audit dimensions

Each finding must be recorded against the exact process, procedure, graph node/edge or source record. Do not treat absence of a field as a zero, a negative finding or permission to infer.

1. **Source lineage** — exact source ID, source location/section/page/sheet/row where available, date/version, evidence class, jurisdiction, scope and limitations.
2. **Operational sequence** — trigger, inputs, steps, handoffs, outputs, exception paths, records and verification. Identify generic repeated text that does not actually describe the named operation.
3. **Roles and authority** — distinguish source-stated role from inferred role and local appointment. Unknown remains unknown.
4. **Cadence and thresholds** — retain source-specific values only with their context; do not convert examples or historical values into universal norms.
5. **Controls and records** — distinguish legal requirements, source-specific practice, proposed controls and optional management practices.
6. **Calculations** — formula, numerator, denominator, units, period, currency, scope, source fields, rounding and missing-input behaviour. No calculation is accepted from incomplete inputs.
7. **Legal applicability (Russia)** — official act and exact provision, effective-from/to dates, amendment/repeal status, covered entity/activity, exceptions and unresolved applicability questions.
8. **Cross-process relationships** — classify as documented dependency, operational association or hypothesis; never present graph paths as causal proof.
9. **Answer behaviour** — expected evidence, uncertainty, conflict preservation, escalation and refusal/clarification conditions for representative user questions.
10. **Privacy and portability** — ensure internal company/person/supplier/system identifiers are not exposed and company-specific practice is not generalized.

## Russian legal baseline: mandatory freshness check

The legal review must not treat SanPiN 2.3/2.4.3590-20 as current. SanPiN 2.3/2.4.4282-26, approved by Resolution No. 18 dated 2026-06-02, entered into force on 2026-09-01 and replaced the prior public-catering sanitary rules. The legal register must capture the new act from the official publication record, verify the full text and provision-level applicability, and identify stale references in the corpus before any content is promoted.

This is a legal-review starting point, not a complete legal conclusion. Each legal finding must be checked against the official text and the specific restaurant activity/profile. Rospotrebnadzor explanatory pages are useful discovery aids, not substitutes for the binding act.

Initial legal domains to inventory, without presuming every requirement applies to every restaurant:
- sanitary and food safety / HACCP-based production control;
- technical regulation and food product circulation / traceability;
- consumer information, allergens, menu and service claims;
- cash register / fiscal operations and settlement records;
- employment, working time, payroll and personnel documentation;
- occupational safety and fire safety (fire safety remains a standalone module);
- personal data and video surveillance;
- licensing/permissions where the actual activity requires them;
- delivery, takeaway, catering and off-site food circulation.

## Work sequence

### 11.1-A — Corpus inventory and traceability
- Enumerate all 77 directions, 12 procedures, six practice sources, graph nodes/edges and existing evaluation cases.
- Build a coverage matrix mapping direction → detailed procedure → graph concepts → source anchors → relevant legal domains → known-answer tests.
- Mark orphan directions, unsupported claims, duplicated generic steps, unanchored graph facts and stale source references.

### 11.1-B — Full content audit
- Review all 77 directions against their exact source sections where the source is available.
- Review all 12 procedures step by step, preserving source facts separately from proposed controls and unknowns.
- Review every restaurant-relevant graph node and edge for source lineage, scope, evidence class and wording.
- Review finance, labor, menu, stock, service, safety, procurement, delivery, facilities and management calculations/processes for definitions and missing-input behaviour.

### 11.1-C — Russia legal evidence register
- Build a provision-level register from official publication sources.
- For every legal record capture act number/title, provision, official URL/publication identifier, publication and effective dates, status, jurisdiction, applicability, exceptions, last checked date and reviewer status.
- Separate binding requirements from recommendations, explanatory guidance, standards and company practice.
- Flag outdated/contradictory legal references; do not silently replace them before the findings are reviewed.

### 11.1-D — Answer and calculation validation
- Create representative known-answer fixtures from supported sources and explicit definitions.
- Test missing, conflicting, stale and out-of-scope inputs.
- Add answer-level cases for Russian restaurant operations and legal questions, with expected evidence and prohibited unsupported claims.
- Keep retrieval-ranking evaluation separate from professional correctness evaluation.

### 11.1-E — Expert dispute pack
- Present a concise register of disputed points only: issue, exact source evidence, conflicting evidence, impact, what is unknown, proposed safe treatment and the exact decision required.
- Group decisions by domain; do not ask the reviewer to re-approve already-supported facts.
- Keep reviewer approval and date as explicit metadata; no approval is inferred.

## Severity model

- **Critical** — potentially unsafe food handling, material legal misstatement, incorrect payroll/financial result, privacy breach, or unsupported instruction likely to cause harm.
- **High** — material process gap, incorrect responsibility/authority, missing control or misleading applicability.
- **Medium** — incomplete handoff, record, exception or verification detail that impairs repeatability.
- **Low** — terminology, discoverability or editorial inconsistency without material decision impact.
- **Unresolved** — evidence is insufficient to rate; do not force a severity or conclusion.

Severity is a review-priority label, not a legal risk score.

## Deliverables

1. Full restaurant coverage matrix for all 77 directions.
2. Source and evidence lineage audit for the 12 detailed procedures and graph.
3. Russian legal register with provision-level provenance and validity.
4. Findings register with severity, confidence, evidence and explicit unknowns.
5. Calculation/known-answer validation report.
6. Answer-quality test pack for restaurant questions.
7. Expert dispute pack containing only decisions that require human review.
8. Updated Stage 11 status report with closed, partial and open acceptance gates.

## Acceptance gates

Stage 11 may be considered for closeout only when:
- all 77 directions have a documented disposition and source trace (validated, practice-only, incomplete, obsolete, conflicting or unsupported);
- every detailed procedure has an evidence-backed review of steps, handoffs, exceptions, records and verification;
- legal claims have current official source provenance and explicit applicability limits;
- calculation fixtures pass with units, definitions, periods and missing-input cases;
- representative answer-level cases are adjudicated and regression-tested;
- unresolved findings remain visible and are not silently converted to facts;
- the reviewer has explicitly approved the disputed findings that require domain judgment.

## Guardrails and non-goals

- No universal temperature, time, KPI, staffing, payroll, tax or service thresholds without an applicable source.
- No inference of process owner, approval authority, cadence or legal duty from generic practice.
- Do not equate kitchen Food Cost with total COGS.
- Do not turn a historical corporate regulation into an industry standard.
- Do not treat retrieval metrics or passing structural tests as proof of expert correctness.
- Do not expand the audit into Germany or the other eight sectors in this work package.
- Do not change runtime logic, backend, database, cloud functions, deployment or dependencies as part of this content audit without separate approval.
- Do not close Stage 11 merely because the workplan, matrix or legal register has been created.

## Current status

**Stage 11.1 workplan prepared; substantive audit not yet completed.** The repository remains at the previously recorded Stage 11 status: integrated foundation, validation open.


## Additional source intake — 17 November 2026

Eight additional user-supplied files are now catalogued for the restaurant baseline:
1. *Чек-лист проверки бухгалтера-калькулятора* — iiko stock-accounting review, 10 sections, attributed to @av.buravtsova.
2. *Стандарт качества обслуживания гостей* (2025) — A.S. Dumrauf; 43 pages; internal/confidential; «Азиатский квартал» and «#Farш».
3. *Система операционного управления. Управленческая эффективность* — 20-slide management training deck.
4. *Инструкция «Товарное соседство»* — Olga Ogarkova / HACCP-AUDIT.
5. *Чек-лист «Маркировка в общепите»* — HACCP-AUDIT.
6. *ОР Управляющий смены.docx* — historical/local ТРАТТОРИЯ role procedure.
7. *Организация работ бармена.doc* — historical club/bar role procedure.
8. *Искусство сервиса в ресторане Casual Dining* — supplied file is only a cover and short outline.

### New audit workstreams

- **Management/leadership:** verify the five management functions, situational style, task-specific work-maturity model and GROW against current management practice; do not treat UРЗ as a validated psychometric test or permanent employee label.
- **Shift manager:** map source-stated role, reporting line, opening checklist, briefing, in-shift controls, closing, cash/equipment handover and unspecified fields against the actual restaurant's current role matrix.
- **Bartender:** separate portable controls (readiness, cleanliness, stock rotation, product availability, recipe accuracy, handover) from club-specific details (smoking, ashtrays, hookah, night service, historical two-minute target).
- **Guest service:** review each stage of the 2025 internal standard, including arrival, needs discovery, menu presentation, order, service, payment, farewell and complaint escalation. Protect its confidential and named-concept scope.
- **Food safety/marking:** map incoming product information, in-house labels, board/knife coding, cleaning inventory, waste bins, chemical containers, storage adjacency and delivery information to current official provisions and actual layout.
- **iiko accounting:** test each of the ten checklist sections against the actual iiko version, document types, warehouse map, accounting policy and month-end process.

### Source status

The new consultant checklists are PRACTICE evidence, not legal records. The shift-manager and bartender procedures are historical/local practice. The management deck is a training framework. The service standard is internal/confidential. The Casual Dining book is an outline only.

### Additional blockers

- Confirm whether the iiko document colors, article names, report fields and 23:00/23:59 timestamps still match the live configuration.
- Confirm current legal basis for every marking/storage claim; do not adopt the under-25-seats exception or historical fine figures from the supplied adjacency PDF without official legal verification.
- Obtain current product-specific temperature/time rules from authoritative sources; the supplied batch does not contain a complete matrix.
- Obtain owner/role approval for shift and bartender responsibility, delegated remedies, records and escalation.
- Adjudicate new Stage 11 answer cases with qualified restaurant, accounting and food-safety reviewers.

The consolidated ChatGPT pack is a 9-file provider export. Original source files and canonical repository documents remain unchanged.
