---
id: knowledge.finance.financial-integrity
title: Financial integrity and restaurant economics
version: 1.0.0
status: foundational
language: en
source_basis:
  - source project README.md
  - docs/STEN_MASTER_SPEC.md
  - docs/STEN_PRODUCT_ARCHITECTURE.md
review_required: true
---

# Financial integrity and restaurant economics

## Source of truth
The restaurant's designated accounting, POS, payroll, inventory, or management-reporting system remains the source of truth for its own data. STEN interprets verified records; it does not replace them.

## Missing data
An absent value is unknown, not zero. Preserve nulls and missing rows. Do not calculate a ratio when a required component or denominator is absent. Do not silently fill gaps with averages.

## Calculation discipline
For every calculation, retain input values and their source; scope and period; units and currency; formula and treatment of taxes, discounts, and refunds; output and rounding method; known omissions and assumptions.

If a server-side calculation is supplied under a documented contract, do not create a competing calculation in the AI layer. Independent recalculation is allowed only when explicitly requested and must be labelled as a cross-check.

## Core concepts
Definitions must be aligned to the restaurant's chart of accounts and reporting rules:
- Revenue: specify gross/net, tax basis, discounts, refunds, and service charges.
- COGS / food and beverage cost: define purchases, inventory movement, transfers, waste, staff meals, and write-offs as applicable.
- Labor cost: define included payroll components, employer charges, bonuses, overtime, benefits, and contractor treatment.
- Prime Cost: commonly treated as COGS plus labor cost, divided by revenue; confirm each component and revenue basis before use.
- OPEX: operating expenses according to the approved chart of accounts; do not automatically classify capex, financing, or owner distributions as OPEX.
- EBITDA: calculate only from an explicit and consistent reporting definition.

## Formula transparency
A ratio such as cost percentage must identify numerator, denominator, period, and scope. Formula template: included cost amount / defined revenue base × 100. This is not permission to assume which account lines are included.

## Benchmarks and thresholds
No universal restaurant benchmark is hard-coded in this knowledge file. Thresholds found in historic specifications or examples must be treated as provisional until confirmed for the restaurant's format, geography, service model, seasonality, price segment, and accounting treatment.

## P&L analysis sequence
1. Validate period, location, currency, and source.
2. Check that totals reconcile and missing categories are visible.
3. Separate plan, actual, forecast, and prior-period values.
4. Calculate absolute and relative variances only where inputs are complete.
5. Identify the largest material deviations by monetary effect.
6. Investigate likely drivers using operational evidence.
7. State what cannot yet be concluded.
8. Propose a controlled action and a verification date.

## Menu and contribution analysis
Do not label an item profitable or unprofitable using sales popularity alone. A reliable menu decision may require selling price, recipe cost, contribution margin, sales quantity, discounts, waste, preparation constraints, and channel mix. If recipe cost or sales mix is missing, state the limitation.

## Labor and productivity
Keep planned staffing, actual hours, paid hours, payroll accruals, advances, and final payroll distinct. Productivity ratios require a defined output measure and a matching time window.
