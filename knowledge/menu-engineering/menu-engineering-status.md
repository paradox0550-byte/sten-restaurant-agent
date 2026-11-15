# ABC-анализ и инженерия меню — статус источников и методики

**Статус:** source gap remains for externally validated canonical thresholds and site-specific menu policy. A proposed STEN workflow and deterministic primitives are now present; they must not be presented as a source-confirmed universal standard.

## What exists in the repository
- POS sales by date, hour, dish, category, quantity and revenue.
- Food cost and P&L foundations.
- Ability to isolate kitchen revenue and kitchen cost when source data supports it.
- Categories and production zones for Labor Intelligence.
- Existing deterministic primitives in `src/menu/engineering.js`: ABC classification with explicit basis/cumulative thresholds, contribution calculation and menu-matrix classification with explicit cutoffs.
- New end-to-end workflow in `docs/stage-11-menu-engineering.md` and `skills/menu-analysis/SKILL.md`.
- A graph node for menu engineering is explicitly classed HYPOTHESIS/proposed method pending expert adjudication.

## Required data
Per item: stable POS ID, quantity, net sales, discounts, refunds, voids, comps, selling price, current recipe version, portion/yield, ingredient quantities and purchase-cost basis, variable cost perimeter, channel, availability/stock-outs, production section and active work minutes where available.

Without current recipe/variable-cost data, STEN may analyze quantity, sales mix and revenue but must not claim contribution or profitability.

## ABC analysis
ABC basis must be selected explicitly: quantity, revenue or contribution. These answer different questions. The operator must approve period, discount/refund treatment, cumulative A/B/C thresholds, seasonality handling and treatment of new items. If these are not approved, report raw metrics and do not assign A/B/C.

## Menu engineering matrix
The four groups are Star (high popularity/high contribution), Plowhorse (high popularity/low contribution), Puzzle (low popularity/high contribution) and Dog (low popularity/low contribution). The popularity and contribution cutoffs are explicit required inputs; none are hard-coded as universal rules.

Contribution per unit is net realized selling price less the approved variable cost per portion. Total contribution is contribution per unit multiplied by units sold. Contribution is not net profit and does not automatically deduct fixed overhead or full allocated labor.

## Integrated menu and kitchen analysis
A menu recommendation must also be evaluated for:
- active minutes per dish by station;
- batch/setup work and station bottlenecks;
- shared ingredients, stock-outs, waste and spoilage;
- effect on other dishes and possible cannibalization;
- channel/daypart mix, guest value and strategic menu role.

Any approved change to price, portion, recipe, batch size or station routing should trigger a new cost and kitchen-workload calculation.

## Workflow and output
The end-to-end sequence, input contract, exception handling, recommendations and test design are maintained in `docs/stage-11-menu-engineering.md`. The skill is in `skills/menu-analysis/SKILL.md`.

## Remaining source and validation gaps
- No approved universal ABC thresholds or menu-matrix cutoffs.
- No site recipe, selling-price, demand-elasticity or station-time dataset is supplied in this repository.
- No expert-adjudicated evidence yet demonstrates that recommendations improve profit or guest outcomes.
- Proposed workflow cases are provisional and require menu-expert review.

**Rule:** missing cost is unknown, never zero. A proposed methodology is not a verified fact or a guaranteed sales/profit uplift.
