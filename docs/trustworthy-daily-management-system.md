# Trustworthy Daily Restaurant Management System

## Purpose and release principle

This document defines the product-level acceptance contract for a restaurant-management assistant that a manager can rely on during daily work. It is an architecture and governance specification, not a claim that every capability is already implemented or production-certified.

The product is a decision-support system. It must make evidence, calculations, uncertainty, applicability, responsibility and verification visible. It must never manufacture certainty to make an answer look complete.

**Release principle:** a capability is not considered ready because a file, prompt, calculator or test exists. It is ready only when its inputs, outputs, failure states, permissions, evidence trail and representative operating scenarios have been verified.

## 1. The daily management loop

Every management request should be routed through the smallest relevant loop:

1. **Identify scope** — tenant/company, establishment, outlet, department, period, shift, currency and unit.
2. **Collect evidence** — identify source systems/files, source timestamps, version, completeness and reconciliation status.
3. **Check applicability** — determine whether the method or rule applies to this sector, format, establishment conditions, jurisdiction and effective date.
4. **Calculate** — use deterministic calculation functions where possible; preserve formula, inputs, units, denominator and rounding.
5. **Diagnose** — distinguish observed facts from interpretation and hypotheses; do not infer cause from correlation alone.
6. **Prioritize** — show materiality, risk, urgency and dependencies using approved criteria; unknown severity remains unresolved.
7. **Propose** — prepare a bounded action with expected outcome, owner role, deadline proposal, approval requirement and rollback/containment where relevant.
8. **Approve and execute** — execution is performed only by an authorized person or explicitly connected, permissioned host tool.
9. **Verify** — compare observed outcome with expected result using new evidence and a reviewer.
10. **Learn** — preserve the verified result and approved local configuration without silently promoting a local practice into global methodology.

A response may stop at any stage when required evidence is missing. It must say what is known, what is not known, why the next step is blocked and the minimum evidence needed to continue.

## 2. Mandatory result envelope

Every material analytical result should be representable as a structured envelope with these fields:

- `result_id`, `created_at`, `method_version`;
- `tenant_id`, `company_id`, `establishment_id`, `outlet_id`, `department_id`;
- `period_start`, `period_end`, `shift_id` where relevant;
- `source_refs[]`: source ID, file/report/table/row/page locator, source timestamp, version and checksum where available;
- `scope`: currency, units, channel, tax basis, accounting perimeter and comparison baseline;
- `claims[]`: claim text, evidence class, value/unit, source refs, calculation ref, status and limitations;
- `calculations[]`: formula ID/version, input values and source refs, denominator, rounding and output;
- `applicability`: sector, format, jurisdiction, establishment conditions, effective date and unresolved profile fields;
- `conflicts[]`: competing records, exact difference and review status;
- `unknowns[]`: missing inputs and why they matter;
- `interpretations[]` and `hypotheses[]`, explicitly separated from facts;
- `recommendations[]`: action, expected effect, risk, owner role, approval and verification plan;
- `readiness`: ready / partial / blocked / requires_human_review;
- `review`: reviewer, decision, date and notes when human review occurred.

Do not fabricate IDs, source locators, dates, reviewers or approvals. If the current host cannot persist a field, disclose that limitation instead of implying durable auditability.

## 3. Evidence and answer rules

Use the following claim states consistently:

- `source_fact` — directly supported by a traceable source;
- `calculation` — reproducible result from compatible identified inputs;
- `interpretation` — reasoned meaning based on evidence;
- `hypothesis` — possible explanation requiring confirmation;
- `recommendation` — proposed action, not an observed fact;
- `unknown` — evidence is absent, incomplete, conflicting or unreliable.

Non-negotiable invariants:

1. No source = no fact.
2. Missing is not zero, false, safe, compliant or not applicable.
3. Never combine incompatible periods, outlets, channels, currencies, tax bases or accounting definitions without an explicit mapping.
4. Never silently resolve conflicting sources.
5. A model response, generated task, checklist mark or verbal assurance is not proof of execution.
6. A calculated ratio is not a benchmark; a benchmark needs its own source, scope and approval.
7. A source's presence in a knowledge pack does not prove it is current, authoritative or applicable.
8. Legal conclusions require current official primary sources, exact provisions, effective dates and jurisdiction/profile applicability. A knowledge assistant must not certify legal compliance.
9. A practice document remains source-specific unless a separately reviewed methodology justifies a generalization.
10. Every recommendation must expose the material assumptions and missing evidence that could change it.

## 4. Management domains and minimum acceptance contracts

### Finance and P&L
- Reconcile revenue and expense totals to designated source reports.
- Keep gross/net revenue, taxes, discounts, refunds, voids, service charges and delivery commissions explicit.
- Keep COGS share distinct from kitchen Food Cost.
- Define payroll accrual, cash paid, advances, paid hours and worked hours separately.
- Calculate Prime Cost and EBITDA only with compatible, complete components.
- Test missing inputs, zero denominator, sign conventions, duplicate rows, unmapped accounts and period mismatch.
- Rank deviations by absolute monetary impact as well as relative percentage.

### Labor, payroll and productivity
- Separate planned, scheduled, worked, paid and productive hours.
- Define labor-cost perimeter and department allocation.
- Do not infer payroll expense from cash movement alone.
- Staffing estimates must state interval, station, demand, work standards, fixed work, utilization and minimum coverage.
- Estimates are not rosters or statutory staffing ratios; approval remains with the responsible manager.
- Test overtime, split shifts, shared staff, missing punches, leave, advances and incomplete periods.

### Menu, recipe and kitchen
- Reconcile POS quantities and net sales; identify stock-outs and availability windows.
- Preserve recipe ID/version, yield, portion and cost update date.
- Keep recipe cost, variable cost and fully allocated cost distinct.
- Require approved thresholds for ABC and menu matrix classifications.
- Missing recipe cost is unknown, never zero.
- Recommendations to change price, recipe, menu availability or POS configuration require authorized approval.
- Kitchen workload must be calculated by station and time interval from measured or approved work standards.

### Service and guest recovery
- Use current menu/recipe facts for ingredients, allergens, availability and preparation time.
- Unknown allergen or safety information triggers a stop-and-escalate response.
- Complaint handling must distinguish guest statement, observed facts, agreed remedy, authority and verified completion.
- Do not generalize confidential or venue-specific scripts into public universal standards.

### Food safety, facilities and legal controls
- Separate operational practice, approved local procedure and legal requirement.
- For legal requirements, capture official source, provision, jurisdiction, effective interval and applicability conditions.
- If current applicability is not verified, label the point as a question/checkpoint, not a legal instruction.
- Critical safety incidents require immediate local escalation; the assistant must not replace the responsible person or authority.
- No compliance certificate may be generated from a checklist or incomplete document set.

### Stock, purchasing and iiko audit
- Treat source checklists as audit prompts, not assumed system configuration.
- Confirm iiko version, document types, warehouses, accounting policy and report settings.
- A finding must identify the exact document/item/warehouse/period and supporting export.
- Financial or stock impact is calculated only when source values reconcile.
- Do not mutate POS/accounting records unless a separately authorized integration explicitly permits it.

### Management, tasks and follow-through
- A diagnosis does not become an assigned task until an authorized person approves it.
- Preserve task owner, due date, blocker, approval and lifecycle events.
- Completion and verification are separate states.
- Closure requires evidence and a reviewer where the risk warrants it.
- Learning from an outcome must not convert one exceptional case into a permanent rule.

## 5. Multi-tenant and multi-establishment boundaries

- Tenant identity and permissions must be derived by the trusted host, never from model-generated text.
- Every read, write, search, memory operation, action and audit query must be tenant-scoped.
- Company, establishment, outlet and department scopes must be explicit.
- Cross-establishment comparisons require an explicit selection and compatible definitions.
- Do not sum establishments by default; present separate results before any consolidated figure.
- Shared methodology is global; local facts, employee/guest data, prices, contracts and operating settings remain tenant-local.
- Cross-tenant tests must prove that guessed IDs, altered request fields and shared caches cannot expose another tenant's data.

## 6. Human authority and autonomy

Default mode is **copilot**: analyze, draft, explain and recommend. It does not silently execute.

Actions requiring explicit authorization include personnel decisions, pay changes, schedules, purchases, payments, refunds, price/menu/recipe/SOP changes, guest compensation outside delegated limits, legal declarations and closure of critical safety incidents.

Any future operator mode must be narrow, permissioned per action, idempotent where possible, auditable, reversible where practical and protected by host-side policy. Model output alone never grants permission.

## 7. Reliability, observability and security gates

Before production use, the host must provide and independently test:

- authenticated identity and server-derived tenant/role permissions;
- persistent, encrypted, tenant-partitioned memory and business records;
- durable append-only or tamper-evident audit storage with retention and deletion policy;
- secrets management, rate limits, abuse controls and safe tool allowlists;
- backup, restore, disaster recovery and incident response;
- source file versioning, checksum and ingestion failure reporting;
- monitoring for provider failures, retrieval failures, stale evidence and calculation errors;
- privacy review and data minimization for employee and guest information;
- export and deletion paths that respect tenant boundaries.

The current in-memory tenant-memory and audit adapters are development/test components only. Their existence is not production readiness.

## 8. Quality evaluation model

Evaluate five independent layers; never collapse them into one green status:

1. **Structural integrity** — schemas, IDs, links, manifests, deterministic build and secret scan.
2. **Calculation correctness** — known-answer fixtures, units, denominators, edge cases, rounding and missing-input behavior.
3. **Evidence faithfulness** — claim-to-source traceability, conflict visibility, unknown preservation and source freshness.
4. **Operational correctness** — owner, handoff, exception, escalation, record and verification checked by a qualified domain reviewer.
5. **Production safety** — authentication, tenant isolation, permissions, persistence, audit, privacy, recovery and live-host tests.

For every high-impact workflow maintain:
- normal case;
- missing-data case;
- conflicting-source case;
- wrong-scope case;
- boundary/edge case;
- unsafe or unauthorized request;
- regression case.

Golden answers and holdout labels must be independently adjudicated. Provisional labels and retrieval metrics are not expert validation. Record reviewer role, date, disagreement and resolution.

## 9. Knowledge production pipeline

Every new methodology should follow this traceable chain:

`original_source → exact_source_anchor → extracted_source_fact_or_practice → scope_and_limitations → generalized_method_hypothesis → expert_review → deterministic_tool_or_control → evaluation_cases → approved_release`

Maintain separate layers:

- **Source library:** original documents and exact locators, access rights, versions and provenance.
- **Methodology library:** newly authored, source-grounded and independently reviewed methods.
- **Runtime knowledge:** approved global methods plus tenant-specific configuration and events.
- **Distribution packs:** curated provider-specific exports, such as the nine ChatGPT Project files. These are transport packages, not the canonical knowledge base.

A missing original source cannot be reconstructed from a merged summary and then treated as verified. Record it as unavailable and request/recover the original before making source-level claims.

## 10. Current implementation status and open gates

The repository currently contains useful foundations: deterministic finance/menu/labor functions, evidence metadata and applicability checks, lexical/hybrid retrieval contracts, task lifecycle, source-grounded procedures, and evaluation scaffolding.

The following are not yet established by repository code or current CI alone:
- complete individually traceable inventory of all original source files;
- reconciliation of every source ID across graph, evidence registry and procedure records;
- independently reviewed methodology for every active process;
- complete reviewed knowledge across all HoReCa sectors;
- current legal corpus and applicability review;
- expert-adjudicated answer-level evaluation;
- production authentication, tenant isolation, persistence and protected audit;
- live integrations with POS, payroll, accounting, storage or task systems;
- measured operational outcomes demonstrating recommendation effectiveness.

These are release gates, not wording issues. Do not mark the product production-ready until the relevant gates are evidenced.

## 11. Daily manager experience — minimum usable answer

A manager should be able to ask: "Что требует моего внимания сегодня?" The answer should return, only where supported:

1. material deviations for the selected establishment and period;
2. amount/metric, source and comparison baseline;
3. why the item matters and what is still uncertain;
4. likely drivers separated into confirmed and unconfirmed;
5. recommended next check or action;
6. proposed owner role and deadline, clearly marked as a proposal;
7. approval needed;
8. how and when the result will be verified.

If there is no connected data for today, the assistant must say that it cannot see today's live operations and ask for the required report. It must not manufacture a dashboard from historical knowledge.

## Acceptance statement

The system may be described as trustworthy for a specific workflow only when that workflow has a traceable evidence path, validated calculation/control logic, tested failure behavior, applicable scope, qualified review and a verified host security boundary. Trust is earned per capability and per deployment context; it is not a blanket property of the model or repository.
