# Menu Engineering and Kitchen Workforce Planning

## A. Menu engineering

### Analysis contract
Before calculation identify:
- restaurant/outlet and menu version/effective dates;
- period and comparable baseline;
- currency, tax treatment and revenue definition;
- sales channel and daypart;
- item IDs, recipe versions and units;
- availability/stop-list periods and selling days;
- discounts, refunds, voids, comps and staff meals;
- approved classification thresholds and approver.

Reconcile POS item quantities and net sales to source totals. Flag missing exports, duplicates, unmapped items, price changes and incomplete recipe costing.

### Item-level fields
- stable item ID/name/category;
- units sold and days/hours available;
- gross sales, discounts, refunds/voids/comps and net sales;
- current price and price history;
- recipe version, yield, portion and ingredient quantities;
- ingredient cost basis and last update;
- packaging and other channel-specific variable costs;
- allergens/dietary attributes from authoritative recipe source;
- preparation time, station routing and production constraints;
- waste, returns/remakes and stock-out periods where recorded.

Keep recipe cost, variable cost and fully allocated cost separate. Contribution margin is not net profit.

### Calculation sequence
1. Reconcile sales and quantities.
2. Validate recipe version, yield, portion and ingredient cost.
3. Calculate net realized price only when discounts/refunds/tax treatment reconcile.
4. Define the variable-cost perimeter for the channel.
5. `contribution_per_unit = net_realized_price - variable_cost_per_unit`.
6. `total_contribution = contribution_per_unit × units_sold`.
7. Calculate food-cost percentage only when numerator and denominator have matching scope.
8. Calculate popularity using a stated denominator and availability treatment.
9. Classify the four-quadrant matrix using approved thresholds:
   - Star — high popularity/high contribution;
   - Plowhorse — high popularity/low contribution;
   - Puzzle — low popularity/high contribution;
   - Dog — low popularity/low contribution.
10. Run ABC separately using a declared basis (quantity, revenue or contribution) and approved cumulative cutoffs.
11. Diagnose recipe, price, portion, placement, description, availability, channel, staff recommendation, seasonality, waste and station workload.
12. Present options with financial, operational, guest/value and risk implications.
13. Define a test, baseline, guardrails, success metrics and decision date.
14. Re-measure and separate observed outcomes from causal interpretation.

### Interpretation
- Star: protect consistency and availability; test changes cautiously.
- Plowhorse: examine portion, recipe cost, purchasing, waste and price elasticity before changing price/portion.
- Puzzle: examine visibility, placement, description, staff knowledge and target segment.
- Dog: examine strategic role, category coverage, seasonality, availability, shared ingredients and guest purpose before reformulation or removal.

Do not recommend a price increase from contribution alone. Do not claim a promotion caused uplift without a suitable comparison.

### Guardrails
- Missing cost is unknown, never zero.
- Missing/unverified recipe version blocks a definitive contribution claim.
- Zero sales may mean stock-out or limited availability, not lack of demand.
- Do not merge item IDs or recipe versions without a mapping.
- Do not mix gross revenue with net costs or inconsistent tax treatment.
- No price, recipe, menu or POS change without explicit approval.

## B. Kitchen workforce planning by station and interval

Do not use a universal dishes-per-cook ratio. Calculate separately for outlet, production station and demand interval (for example, 15 or 30 minutes where the source data support it).

### Required inputs
- POS/KDS item quantities by dish, modifier, station and interval;
- comparable demand history and booking/event forecasts;
- current menu availability and channel mix;
- active labor minutes per dish × station;
- batch size and setup minutes;
- fixed interval work (opening, replenishment, cleaning, closing and handover);
- approved productive-utilization factor;
- minimum station/skill coverage;
- employee skills, equipment, breaks and shift constraints.

Measure active labor separately from elapsed cook time, unattended equipment time and waiting. A 12-minute oven cycle is not automatically 12 minutes of continuous cook labor.

### Deterministic model
- `unit_minutes = Σ(quantity_i × active_minutes_i)`
- `batch_minutes = Σ(ceil(quantity_i / batch_size_i) × setup_minutes_i)`
- `total_workload = unit_minutes + batch_minutes + fixed_work_minutes`
- `capacity_per_employee = interval_minutes × approved_utilization`
- `workload_headcount = ceil(total_workload / capacity_per_employee)`
- `modelled_headcount = max(workload_headcount, approved_minimum_coverage)`

Utilization must be greater than 0 and no more than 1. Do not subtract breaks twice. Calculate each interval independently to expose peak demand; do not sum interval headcounts into shift headcount.

### Exceptions and output
Missing station routing or time standard means unavailable/partial, not zero. New dishes require a provisional measured standard or clearly labelled estimate. Cross-trained employees cannot be counted in two simultaneous stations. Equipment outages require confirmed alternative routing and capacity.

Output scope, period, interval, station, data completeness, workload breakdown, assumptions, required concurrent staffing, peak interval, skill/coverage constraints, comparison with planned/actual staffing, risks and manager decisions.

This is a modelled requirement, not a roster or legal staffing instruction. A manager must validate skills, shift continuity, breaks, safety, equipment and labor rules.

## C. Shared menu/labor dependency

Menu changes that alter volume, portion, recipe, batch size or station routing should trigger workload recalculation. Financial attractiveness does not prove operational feasibility. Keep contribution, guest value, quality, waste and production bottlenecks in one decision view.
