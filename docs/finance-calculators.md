# Deterministic restaurant finance calculators

This addition extends the existing finance module; it does not create a second intelligence engine.

## P&L contract

`src/finance/pnl.js` uses one explicit convention: revenue is positive and expenses are negative. Required context is scope, period, currency and tax basis. Each source line has `id`, `category` and finite `amount`. Duplicate rows in a category are aggregated. Missing categories are unavailable, never zero.

Supported categories: `revenue`, `discounts_refunds`, `cogs`, `food_revenue`, `food_cogs`, `labor`, `overtime`, `opex`, `depreciation`, `interest`, `tax`.

- Net revenue = revenue + discounts/refunds.
- Gross profit = net revenue + signed COGS.
- Food Cost % = ABS(food COGS) / food-only revenue.
- COGS % = ABS(COGS) / net revenue.
- Labor % = ABS(labor + overtime) / net revenue.
- Prime Cost = signed COGS + labor + overtime.
- EBITDA = gross profit + labor + overtime + OPEX.
- Net profit = EBITDA + depreciation + interest + tax.

This is a management P&L calculation, not a statutory accounting or tax return. Tax basis is mandatory context but no tax is inferred. Missing source lines prevent dependent totals from being calculated.

## Payroll contract

`src/finance/payroll.js` calculates accrued amounts before taxes and deductions. Currency must be supplied explicitly through the `currency` option; no currency is assumed:
- hourly: regular hours × hourly rate;
- shift: shifts × rate per shift; hours per shift must be explicit;
- salary: salary periods × rate; period count must be explicit.

Overtime is calculated only when overtime hours and an explicit multiplier are supplied for hourly pay. The regular `hours` field is regular hours, excluding overtime. The module does not determine legal overtime eligibility, premiums, payroll taxes, deductions, gross/net conversion or statutory working-time norms.

## Plan/fact variance contract

`src/finance/variances.js` normalizes a bounded set of restaurant finance article aliases. Each comparison requires plan, actual, scope, period, currency, unit and definition. Delta = actual − plan; relative delta = delta / ABS(plan) × 100. A zero plan has no relative percentage.

Favorable/unfavorable classification requires an explicit direction rule per normalized article: `higher`, `lower`, `neutral`; without a rule, impact remains `unclassified`. Materiality thresholds are optional caller-supplied configuration; no universal thresholds are embedded. Results are ranked by absolute monetary delta and missing/incompatible rows are listed separately.

## Provenance

Pass source identifiers in `planSourceIds` and `actualSourceIds`; P&L line IDs are retained as metric input IDs. The host should preserve original source file, sheet, row and mapping metadata before invoking these pure functions.
