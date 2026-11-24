# Restaurant Finance, P&L, Payroll and Labor Intelligence

## 1. Source of truth and calculation discipline

The restaurant's designated accounting, POS, payroll, inventory or management-reporting system is the source of truth for its own data. DUMRAUF interprets verified records; it does not replace them.

For every calculation retain source, period, outlet, department, currency, units, formula, tax/discount/refund treatment, rounding and omissions. Preserve raw source values separately from normalized values. If a required component or denominator is missing, return unavailable/partial rather than inventing a value.

Keep these states distinct:
- **Source fact:** directly present in a supplied or connected record.
- **Calculation:** reproducible arithmetic from identified inputs.
- **Interpretation:** meaning inferred from facts.
- **Hypothesis:** possible explanation not yet confirmed.
- **Recommendation:** proposed action.
- **Unknown / no data:** required information is absent or unreliable.

## 2. Revenue, COGS and Food Cost definitions

Definitions must match the restaurant's chart of accounts and reporting policy.

### Revenue
Before calculating a ratio, establish whether revenue is gross or net and how the source treats VAT/tax, discounts, refunds, voids, complimentary items, service charges, delivery commissions and staff meals. Never silently change the denominator.

### COGS and kitchen Food Cost
Define COGS using the approved accounting perimeter: purchases, inventory movement, transfers, waste, staff meals and write-offs. Do not assume all source systems use the same formula.

**Do not equate total COGS share with kitchen Food Cost.** The canonical DUMRAUF materials identify a definition conflict: one backend field labels COGS divided by total revenue as foodCostPercent, while the frontend calculation distinguishes cogsPercent from kitchen foodCostPercent, which requires separate kitchen revenue and kitchen cost inputs. Until the restaurant's definition is explicitly aligned:
- label COGS divided by total revenue as **COGS share**;
- label **kitchen Food Cost** only when kitchen cost and comparable kitchen revenue are separately identified;
- disclose the definition and source fields used.

A percentage is valid only when numerator and denominator have matching scope, period, outlet, channel and accounting basis.

### Prime Cost
A common model is:

Prime Cost % = (COGS + Labor Cost) / comparable Revenue × 100

Use it only after confirming the approved composition of COGS, Labor Cost and Revenue. Do not mix payroll accrual with cash payments or inconsistent periods.

## 3. Labor Cost and payroll components

Define the approved labor perimeter before calculation. Confirm treatment of:
- gross wages and salaries;
- employer contributions/charges;
- bonuses, overtime and premiums;
- benefits and compensation;
- contractors and outsourced labor;
- paid leave and other accruals;
- department allocation and shared staff.

Keep distinct:
- planned hours;
- actual worked hours;
- paid hours;
- payroll accrual;
- cash paid;
- advances;
- final settlement;
- productive labor hours.

These are related but not interchangeable. A cash payment report is not automatically the payroll expense for the same period.

## 4. P&L and EBITDA calculation rules

1. Validate period, restaurant, department, currency, source and accounting basis.
2. Reconcile revenue and expense totals to source reports.
3. Confirm account mapping and the sign convention for each expense line.
4. Separate plan, actual, forecast and prior-period values.
5. Identify missing, duplicate, unmapped and parent/child rows before aggregation.
6. Calculate ratios and results only when all required inputs are complete and compatible.
7. Rank material deviations by monetary impact, not percentage alone.
8. Investigate drivers using operational evidence; do not infer causality from correlation.
9. State what cannot yet be concluded and propose a controlled action with verification.

**EBITDA** may be calculated as revenue minus COGS, labor and OPEX only when all four components are present and their definitions and period align. An incomplete subtotal must not be called EBITDA.

A conventional bridge is:
- EBITDA = Revenue − COGS − Labor − OPEX
- EBIT = EBITDA − Depreciation
- Profit before tax = EBIT − Interest
- Net profit = Profit before tax − Tax

Use the restaurant's approved reporting definition where it differs. Do not invent missing components or treat an unavailable line as zero.

### Plan/fact variance

Interpret variance according to the economic meaning and sign convention of the line:
- Revenue: actual below plan is generally unfavorable.
- Positive expense lines: actual expense above plan is generally unfavorable.
- Negative expense lines: a more negative actual may be unfavorable; inspect the accounting meaning.
- Sign changes, unknown line types or inconsistent mappings require investigation before labeling favorable/unfavorable.
- If the plan is absent or zero, do not calculate a percentage variance.

Do not apply a universal materiality or "other expenses" threshold unless the restaurant has approved it.

## 5. Payroll models and advances

### Pay models
- Hourly: confirmed hours × confirmed rate.
- Per shift: confirmed shifts × approved shift rate.
- Monthly salary: period-based, not repeated on every shift.
- Additional pay is included only when confirmed.
- If hours, rate or pay rule is missing, the cost is unavailable.

Do not distribute a monthly salary across shifts without an approved allocation rule.

### Advances and cash payments
An advance is a payment against accrued salary, not a second labor expense. Track employee, date, amount, accrual period, basis and source document.

A payroll statement and a cash disbursement order (РКО) are different source types; verify whether they represent the same payment before aggregating. Calculate the remaining amount only when accrual and all payments are complete. Unknown advances are not silently subtracted or treated as zero. Do not count the same advance twice in expenses when accrual is already recognized.

## 6. Waiter sales and incentives

Where an approved incentive rule pools personal waiter sales across linked departments, the calculation needs:
- approved department pool;
- employee identity or stable pseudonymous ID;
- period;
- POS sales source;
- incentive base;
- approved percentage/rule;
- duplicate-exclusion logic.

Do not apply a commission automatically without the current approved incentive policy. A historical operating rule does not prove that it remains active.

## 7. Labor Intelligence and productivity

Demand workload and payroll are separate models:
- POS/KDS sales describe output or demand;
- workload coefficients describe work content;
- productive standards translate workload into required hours;
- timesheets describe attendance/worked hours;
- paid hours and rates describe labor cost.

A dish count alone is not labor effort. Without approved coefficients and productivity standards, required hours remain unknown.

For a valid productivity comparison, align period, department, role, output measure, time basis and paid/actual hours. A forecast is a draft need estimate, not a named roster. Do not optimize productivity at the expense of safety, quality, guest waiting time or lawful working conditions.

## 8. Benchmarks and decision boundaries

No universal restaurant benchmark is embedded. A benchmark needs a traceable source, definition, scope, period, geography and applicability. Prefer an approved restaurant-specific target when available; label external comparisons as provisional when their comparability is incomplete.

DUMRAUF may calculate and recommend. It must not change payroll, incentives, schedules, prices, accounting mappings or source records without explicit human approval and a real authorized tool.

---

## Stage 11 professional practice expansion — operational effects and marketing calendar

**This section presents a DUMRAUF-authored operating model synthesized for general restaurant use; applicability must be validated locally.

### Marketing calendar as a controllable hypothesis
For each activity record objective, target guest segment, offer, restaurant/department, period, channel, product availability, staffing and capacity constraints, budget, owner, expected metric and data source. Before launch confirm supply, recipe economics, team briefing and ability to handle demand. After launch compare relevant plan/fact measures: covers, checks, average check, mix, contribution when cost is verified, campaign spend and repeat behavior when measurable. Separate correlation from causation and compare equivalent periods, seasonal context and operating hours.

### Spreadsheet integrity
Reject divide-by-zero results, missing denominators and mixed periods. If baseline sales are zero, percentage growth may be undefined; if baseline is absent, report “нет данных”. Do not claim ROI, profit uplift or attribution without approved cost definitions and evidence. Inventory losses and purchases must be reconciled with actual stock movements before interpreting cost changes.
