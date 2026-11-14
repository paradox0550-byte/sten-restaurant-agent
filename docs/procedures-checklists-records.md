# Operational procedures, checklists and records

## Scope and evidence

This package expands Stage 11 with source-grounded procedures. The primary sources are the supplied 2025 guest-service standard, appearance training, operational-management training and restaurant regulation. The regulation and appearance rules are organization-specific PRACTICE sources. They are not legal advice, current compliance requirements or universal HoReCa standards.

Each procedure separates:
- facts stated by the source;
- role/cadence provenance;
- operational steps;
- checklist and record templates;
- verification evidence;
- exception handling;
- missing information.

## Status semantics

Checklist item statuses are `done`, `not_done`, `not_applicable` and `unknown`. A skipped check is not passed. Unknown is not zero. A proposed template is not an approved corporate form.

## Initial procedures

See `knowledge/procedures/operational-procedures.json` for twelve detailed procedures:
1. shift readiness and briefing;
2. guest journey and order;
3. service delivery and delay communication;
4. bill and payment;
5. guest complaint and recovery;
6. employee appearance readiness;
7. director operating control and GROW;
8. front-of-house visual walkthrough;
9. monthly stocktake;
10. monthly deep-clean/sanitation hour;
11. staff scheduling and timekeeping;
12. delivery order control.

## Templates

- `checklist-templates.json` — reusable checklist structures with explicit unknown/not-applicable states.
- `register-templates.json` — proposed logs for complaints, walkthroughs, stocktake variances, training, daily tasks and delivery exceptions.
- `role-responsibility-map.json` — role descriptions with source basis and uncertainty.

## Important source boundaries

- The restaurant regulation describes a front-of-house visual checklist twice daily at 09:55 and 15:00, completed by the shift administrator or manager, posted and archived for two months. This is retained as scoped historical practice, not a recommended universal schedule.
- It describes monthly stocktake timing, six-month retention for handwritten sheets, and annual fixed-asset inventory. These dates and retention periods require local accounting/policy validation before reuse.
- It describes a monthly deep-clean on the first Tuesday. This is not substituted for a risk-based sanitation plan or current local requirements.
- The guest-service standard includes service sequence and guest complaint handling. Only generalized operating concepts are retained; proprietary scripts are not reproduced.
- The appearance training's footwear item is a question, not an answer. Restrictions on religious symbols, tattoos, jewelry and appearance are not automatically adopted; HR/legal review is required.
- GROW is retained as a coaching conversation structure. The source's work-maturity concept is task-specific and is not a permanent employee label or validated psychometric diagnosis.

## Multi-hop evaluation

`evals/horeca-multihop-cases.json` seeds five scenarios for later evaluation. They define expected evidence paths and forbidden unsupported conclusions. They do not claim that retrieval or answer quality has already been measured.
