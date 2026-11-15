# Skill: Autonomous Menu Engineering

## Mission

Produce a reproducible menu-engineering analysis from reconciled sales and recipe data. STEN may independently calculate, classify, diagnose and draft options when inputs are sufficient. It must never publish prices, alter recipes, change POS settings or remove menu items without explicit human approval.

## Required workflow

1. **Define scope:** restaurant/outlet, menu version, effective dates, analysis period, channel, daypart, category, currency and tax treatment.
2. **Reconcile sales:** POS item quantities and net revenue to source totals. Resolve discounts, refunds, voids, comps, staff meals, duplicate IDs and unavailable periods.
3. **Validate availability:** capture selling days/hours, stop-list periods, stock-outs, launch dates and menu changes. Low sales while unavailable are not evidence of low demand.
4. **Validate recipes:** confirm recipe ID/version, portion, ingredient quantities, edible yield, purchase-price basis and cost update date.
5. **Define cost perimeter:** distinguish recipe ingredient cost, packaging, channel commission and other variable costs. Do not mix channel scopes or call contribution "net profit".
6. **Calculate economics:** net realized selling price, variable cost per portion, contribution per unit, total contribution and food-cost percentage using matching denominators.
7. **Calculate popularity:** units sold / units sold in the defined menu group, with the group and denominator explicit.
8. **Classify ABC:** ask/confirm basis (quantity, revenue or contribution) and approved cumulative thresholds. ABC is separate from the four-quadrant menu matrix.
9. **Classify menu matrix:** require explicit approved popularity and contribution cutoffs. Map Star, Plowhorse, Puzzle and Dog; if cutoffs are absent, report metrics without pretending a classification exists.
10. **Diagnose each item:** price, portion, recipe/yield, supplier price, sales mix, menu placement, naming/description, staff recommendation, seasonality, channel, guest feedback, prep minutes, station bottlenecks, waste and stock availability.
11. **Develop options:** preserve proven guest favorites; test price, recipe, portion, placement, promotion, limited-time status or removal only with financial, guest and operational implications.
12. **Quantify scenarios:** show assumptions, contribution impact, sensitivity, cannibalization risk and any unsupported demand-response assumption.
13. **Design a test:** baseline, test/control where feasible, period, owner approval, success metric, guardrails and decision date.
14. **Verify:** compare actual result to baseline; distinguish observed change from causal impact.

## Required output

- data-quality verdict and reconciliation;
- scope and definitions;
- item-level sales, cost, contribution and popularity table;
- four-quadrant matrix and separate ABC view;
- recipe-cost anomalies and data gaps;
- ranked actions with financial and operational effects;
- impact on kitchen workload and station capacity;
- test design, approval points and follow-up criteria.

## Guardrails

- Missing cost is unknown, never zero.
- No definitive contribution if recipe version or variable-cost perimeter is unresolved.
- No universal threshold is hard-coded.
- Gross sales and net costs must not be mixed.
- Compare channels only with compatible cost definitions.
- Contribution margin is not net profit.
- A low-volume item may be strategic, seasonal or unavailable.
- A high-contribution item may overload a constrained station.
- Do not claim causal sales lift without a suitable test.
- Do not execute business changes without human approval.

See `docs/stage-11-menu-engineering.md` and `src/menu/engineering.js`.
