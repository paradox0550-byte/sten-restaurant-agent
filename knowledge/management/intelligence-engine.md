# STEN Intelligence Engine v0.4

## Purpose

The Intelligence Engine connects professional restaurant methodology, jurisdiction-specific law, financial analysis, and operational practice into one auditable reasoning process. It is a provider-neutral orchestration layer: ChatGPT, Claude, or another model may generate the language and domain reasoning, while the engine defines the evidence contract, sequence, validation gates, and output structure.

It is not a legal opinion, accounting system, POS/ERP, safety certification, or autonomous operator.

## Four knowledge streams — one decision process

1. **Professional knowledge (CORE / INDUSTRY):** operating models, service, production, staffing, procurement, inventory, controls, leadership and training.
2. **Law (LAW):** jurisdiction-specific acts, exact provision, official source, publication/effective dates, current status, scope, exceptions and applicability conditions.
3. **Financial analysis:** source data, approved account mapping, formula, period, currency, numerator/denominator, reconciliation and monetary impact.
4. **Operational practice:** actual process, responsible role, timing, evidence of execution, constraints, guest/safety impact and verification.

RESEARCH and TREND can inform interpretation but must not silently override law, source methodology, approved configuration, or verified operational facts. HYPOTHESIS is never presented as a fact.

## Canonical reasoning sequence

1. **Understand the decision:** question, establishment, format, jurisdiction, department, period and requested outcome.
2. **Build the context:** load only the active establishment's configuration and memory; keep tenants isolated.
3. **Retrieve evidence:** select relevant knowledge by domain, evidence class, jurisdiction, date and applicability.
4. **Check evidence quality:** source, authority, effective date, scope, freshness, completeness and conflicts.
5. **Establish facts:** separate observed facts, calculations, interpretations, hypotheses and unknowns.
6. **Check legal applicability:** use establishment profile attributes; unknown attributes remain unknown. Do not treat missing as false.
7. **Analyze economics:** validate definitions and periods; calculate only with complete, compatible inputs and approved formulas.
8. **Connect operational causes:** trace plausible links across menu, production, purchasing, inventory, labor, service, facilities and management controls.
9. **Rank risks and opportunities:** consider legal/safety severity, guest impact, financial magnitude, recurrence, urgency, reversibility and confidence. Do not invent numeric weights or thresholds.
10. **Design actions:** owner role, timing, scope, expected direction/impact (quantified only when supportable), dependencies and verification metric.
11. **Communicate uncertainty:** show what is known, what is inferred, what is missing and what must be checked by a qualified specialist.
12. **Close the loop:** record outcome only after a source confirms execution and effect; update hypotheses to confirmed causes only when evidence supports it.

## Cross-domain reasoning examples

- Food Cost variance → reconcile COGS and revenue definitions → check purchase prices, yield, recipe cost, portions, waste, transfers, stock counts and sales mix → estimate impact only from complete quantities and prices → assign operational checks.
- Labor Cost variance → distinguish accrued payroll, paid payroll and advances → compare actual hours, schedule, sales/workload, role mix, overtime and service outcomes → do not conclude overstaffing from a percentage alone.
- Guest complaints → classify the observable service failure → inspect wait time, product quality, communication, staffing and process → consider recovery and repeat-visit risk → verify with complaint recurrence and guest feedback.
- Fire/food/labor compliance question → identify jurisdiction and current legal source → collect relevant building/operation profile → assess applicability → distinguish documentary checks from physical inspection and specialist calculations.

These are diagnostic paths, not proof that a particular cause exists.

## Evidence contract

Every knowledge item should carry: `id`, `title`, `domain`, `class`, `source`, `date`, `scope`, `jurisdiction` where relevant, `effectiveStatus` for law, `limitations`, `reviewDate`, and `status`.

Allowed classes: `CORE`, `LAW`, `RESEARCH`, `INDUSTRY`, `TREND`, `HYPOTHESIS`, `CONFIGURATION`.

A LAW record is usable for applicability reasoning only when jurisdiction, official source, effective status and date are populated. If not confirmed in force, return `requires_source_verification`. If profile attributes are missing, return `cannot_determine`. If rule mapping is absent or requires interpretation, return `specialist_review`.

## Financial integrity contract

Every metric must preserve entity, scope, period, currency, unit, source, formula and input lineage. Ratios require a compatible numerator and denominator. Never substitute missing values with zero. Do not silently mix kitchen/bar revenue, accrued/paid payroll, stock purchases/consumption, or unlike periods. A benchmark is context, not a target unless approved for this establishment.

## Action contract

Each action must specify:
- owner role (not an invented employee name);
- due date or timing;
- what is to be checked or changed;
- expected direction or measurable effect, if supportable;
- verification metric and source;
- authorization requirement and whether human approval is needed.

High-risk safety, legal, employment, compensation, purchasing, payment, pricing and guest-data decisions remain under authorized human control.

## Standard answer shape

1. Management conclusion
2. Verified facts and source references
3. Calculations and assumptions
4. Legal applicability (jurisdiction, act, effective date, limitations)
5. Cross-domain interpretation
6. Hypotheses and tests to distinguish them
7. Missing information / unresolved conflicts
8. Prioritized actions, owner, timing and verification
9. Confidence and specialist-review note

## Engine boundaries

`src/intelligence/engine.js` validates evidence metadata, fact lineage, legal applicability inputs, cross-domain links and action completeness. It does not retrieve laws, infer facts, calculate restaurant KPIs, or generate a legal conclusion by itself. Provider models must follow the same contract. Deterministic domain calculators remain in their own modules.
