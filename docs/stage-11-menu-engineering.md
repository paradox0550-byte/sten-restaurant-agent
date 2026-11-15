# Stage 11 — autonomous menu engineering workflow

## Purpose

Teach STEN to conduct a complete, reproducible menu-engineering analysis from source data through recommendations and a measured follow-up. "Autonomous" means STEN can independently prepare calculations, diagnose patterns and draft options when data are sufficient. It does not mean silently changing prices, recipes, POS settings or the published menu.

## Analysis contract

Before calculating, identify:
- restaurant/outlet, menu version and effective dates;
- analysis period and comparable baseline;
- currency, tax treatment and revenue definition;
- sales channel and daypart;
- item IDs, recipe versions and units;
- availability/stop-list periods and number of selling days;
- treatment of discounts, refunds, voids, comps and staff meals;
- selected classification thresholds and their approver.

Reconcile POS item quantities and net sales to source totals. Flag missing exports, duplicate rows, unmapped items, price changes and incomplete recipe costing. Do not compare unlike periods or channels without explicit normalization.

## Data model per menu item

Minimum useful fields:
- stable item ID and name;
- category and menu placement;
- units sold and days/hours available;
- gross sales, discounts, refunds/voids/comps and net sales under the chosen definition;
- current selling price and price history;
- recipe version, yield, portion and ingredient quantities;
- ingredient cost basis and last update;
- packaging and other variable costs where relevant to the chosen channel;
- allergens and dietary attributes from an authoritative recipe source;
- preparation time, station routing and production constraints;
- waste, returns/remakes and stock-out periods where recorded.

Keep recipe cost, variable cost and full allocated cost distinct. Contribution margin is not net profit: it does not automatically deduct rent, fixed payroll, utilities, marketing overhead or other fixed costs.

## Calculation sequence

1. **Data quality:** reconcile sales totals, quantities, item IDs, period, channel and menu availability.
2. **Recipe costing:** recalculate ingredient usage from approved recipe quantities, edible yield, trim/cook loss and purchase-price basis. Preserve recipe and supplier-price versions.
3. **Net realized selling price:** calculate from net item revenue divided by units sold only when discounts, refunds, comps and tax treatment are reconciled.
4. **Variable cost per portion:** use the explicitly approved cost perimeter. For dine-in this may be recipe ingredients; for delivery it may also include packaging, channel commissions or other per-order variable charges. Do not mix scopes.
5. **Contribution per unit:** `contribution_per_unit = net_realized_price - variable_cost_per_unit`.
6. **Total contribution:** `total_contribution = contribution_per_unit × units_sold`.
7. **Food-cost percentage:** `variable_food_cost / comparable net food sales × 100`, only when numerator and denominator have matching scope.
8. **Popularity:** calculate each item's share of category or defined menu group sales. State the chosen denominator and the treatment of unavailable days.
9. **Menu matrix:** classify popularity and contribution using explicit approved cutoffs. The four classic groups are:
   - Star: high popularity, high contribution;
   - Plowhorse: high popularity, low contribution;
   - Puzzle: low popularity, high contribution;
   - Dog: low popularity, low contribution.
10. **ABC analysis:** separately classify by an explicitly selected basis (quantity, revenue or contribution) and approved cumulative thresholds. ABC is not the same as the four-quadrant menu matrix.
11. **Diagnosis:** examine price, recipe cost, portion/yield, sales mix, menu placement, description, staff recommendation, availability, seasonality, channel, prep time, waste and bottlenecks.
12. **Recommendation:** propose options with estimated financial effect, operational impact, guest/value impact, risks and required approvals.
13. **Test:** define baseline, test group or controlled period, success metrics, guardrails and decision date.
14. **Re-measure:** compare actual results with the baseline and separate observed outcome from causal interpretation.

## Threshold governance

Do not hard-code a universal popularity threshold, contribution threshold or ABC cumulative cut-off. The repository's deterministic primitives require explicit thresholds. Record:
- formula and denominator;
- threshold values and why selected;
- approving role and date;
- menu category, channel and period to which they apply;
- minimum sample/volume rule, if the operator has approved one.

If no approved threshold exists, STEN may show raw metrics and sensitivity scenarios, but must label the matrix as unclassified rather than inventing a cutoff.

## Interpretation and action rules

- **Star:** protect consistency and availability; test price or portion changes cautiously; avoid damaging a proven guest favorite.
- **Plowhorse:** investigate portion, recipe cost, purchasing, price elasticity and production waste before raising price or reducing portion.
- **Puzzle:** inspect visibility, menu placement, naming/description, staff knowledge, recommendation behavior and target segment; test exposure before removing.
- **Dog:** check strategic role, category coverage, seasonality, low availability, ingredient overlap and guest purpose. Consider reformulation, repositioning, limited-time status or removal only after impact review.

For every item also assess:
- contribution in total money, not only percentage;
- sales mix and category balance;
- recipe complexity and station minutes;
- shared ingredients and stock/waste effects;
- effect on other dishes (substitution/cannibalization);
- dietary/allergen and brand/positioning role;
- guest feedback and repeat purchase where available.

Do not recommend a price increase from contribution alone. Assess demand response and competitor/positioning evidence if available. Do not claim a promotion caused uplift without a suitable comparison; distinguish correlation from measured incremental effect.

## Required deliverable

1. Executive summary and data-quality verdict.
2. Scope, period, channels and comparison basis.
3. Reconciliation of POS totals and source gaps.
4. Recipe-cost audit and cost-perimeter definitions.
5. Item-level table: units, mix, net realized price, variable cost, contribution/unit, total contribution, food-cost %, category and confidence.
6. Four-quadrant menu matrix and separately identified ABC table.
7. Category/channel/daypart cuts only where data support them.
8. Ranked opportunities with quantified assumptions and sensitivity.
9. Operational impact: prep minutes, station load, stock, waste and complexity.
10. Test plan, owner approval required, metrics and follow-up date.

## Guardrails

- Missing cost is unknown, never zero.
- Missing or unverified recipe version blocks a definitive contribution claim.
- A negative contribution is shown as calculated only when all relevant inputs and cost perimeter are valid.
- Zero sales may mean unavailable, not demanded; check stock-out and selling hours.
- Do not merge item IDs or recipe versions without a mapping.
- Do not use gross revenue with net costs or mismatched tax treatment.
- Do not compare channels with different variable-cost perimeters as if they were identical.
- Keep modelled recommendations separate from observed facts.
- No price, recipe, menu or POS change is executed without explicit human approval.

## Relationship to kitchen workforce planning

Menu engineering and kitchen staffing must share item-level recipe and station-routing data. A menu recommendation that changes volume, portion, recipe, batch size or station routing must trigger a workload recalculation. A high-contribution dish may still be operationally harmful if it overloads a bottleneck station; a low-volume item may be strategically important. Financial and production views must be considered together.

## Acceptance tests for Stage 11

- Missing recipe cost prevents definitive contribution classification.
- Thresholds are explicit and not hard-coded.
- ABC basis is distinct from menu-matrix classification.
- Net sales reconcile with discounts/refunds/comps and availability.
- Different channels retain their own variable-cost perimeter.
- Stock-outs and menu availability are visible in popularity interpretation.
- Recommendations include operational workload and guest impact.
- A test plan distinguishes observed changes from causal claims.
- The report is reproducible from versioned inputs and formulas.

## Evidence and status

This workflow is a proposed expert method built around the repository's existing deterministic menu primitives. It is not proof that a menu change will improve sales or profit. Thresholds, recipe standards, demand response and local tax/cost treatment require source-backed configuration and restaurant-owner review.
