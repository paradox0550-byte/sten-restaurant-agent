/**
 * Complete restaurant P&L calculation under one explicit sign convention.
 * Revenue is positive; expenses are negative. Missing lines remain unavailable.
 */
const finite = value => Number.isFinite(value);
const absExpense = value => finite(value) ? Math.abs(value) : null;

function metric(value, formula, inputIds, missing = []) {
  return missing.length
    ? { status: "unavailable", value: null, formula, inputIds, missing }
    : { status: "calculated", value, formula, inputIds };
}

function readLine(lines, key) {
  const rows = lines.filter(row => row?.category === key);
  if (!rows.length) return { value: null, ids: [], missing: [key] };
  const invalid = rows.filter(row => !finite(row.amount));
  if (invalid.length) return { value: null, ids: rows.map(x => x.id).filter(Boolean), missing: [key + ":non_numeric"] };
  return { value: rows.reduce((sum, row) => sum + row.amount, 0), ids: rows.map(x => x.id).filter(Boolean), missing: [] };
}

export function calculateRestaurantPnl({ lines = [], scope, period, currency, taxBasis } = {}) {
  const requiredContext = { scope, period, currency, taxBasis };
  const missingContext = Object.entries(requiredContext).filter(([, value]) => value === undefined || value === null || value === "").map(([key]) => key);
  const categories = ["revenue", "discounts_refunds", "cogs", "food_revenue", "food_cogs", "labor", "overtime", "opex", "depreciation", "interest", "tax"];
  const input = Object.fromEntries(categories.map(key => [key, readLine(lines, key)]));
  const missing = key => input[key].missing;
  const ids = (...keys) => [...new Set(keys.flatMap(key => input[key].ids))];
  const value = key => input[key].value;
  const sum = (...keys) => keys.every(key => finite(value(key))) ? keys.reduce((n, key) => n + value(key), 0) : null;
  const revenue = sum("revenue", "discounts_refunds");
  const cogs = value("cogs"), foodRevenue = value("food_revenue"), foodCogs = value("food_cogs");
  const labor = value("labor"), overtime = value("overtime"), opex = value("opex");
  const grossProfit = revenue !== null && cogs !== null ? revenue + cogs : null;
  const laborTotal = labor !== null && overtime !== null ? labor + overtime : null;
  const ebitda = grossProfit !== null && laborTotal !== null && opex !== null ? grossProfit + laborTotal + opex : null;
  const netProfit = [ebitda, value("depreciation"), value("interest"), value("tax")].every(finite)
    ? ebitda + value("depreciation") + value("interest") + value("tax") : null;
  const ratio = (numerator, denominator, formula, inputKeys) => {
    const absent = inputKeys.flatMap(missing);
    if (!finite(numerator)) absent.push("numerator");
    if (!finite(denominator)) absent.push("denominator");
    if (finite(denominator) && denominator === 0) return { status: "unavailable", value: null, formula, inputIds: ids(...inputKeys), missing: ["zero_denominator"] };
    return metric(absent.length ? null : numerator / denominator * 100, formula, ids(...inputKeys), [...new Set(absent)]);
  };
  const amountMetric = (amount, formula, inputKeys) => metric(amount, formula, ids(...inputKeys), inputKeys.flatMap(missing));
  const result = {
    status: missingContext.length ? "insufficient_context" : "pending",
    convention: "revenue_positive_expenses_negative",
    context: requiredContext,
    missingContext,
    currency: currency ?? null,
    period: period ?? null,
    metrics: {
      netRevenue: amountMetric(revenue, "revenue + discounts_refunds", ["revenue", "discounts_refunds"]),
      cogs: amountMetric(cogs, "cogs", ["cogs"]),
      grossProfit: metric(grossProfit, "netRevenue + cogs", ids("revenue", "discounts_refunds", "cogs"), ["revenue","discounts_refunds","cogs"].flatMap(missing)),
      foodCostPercent: ratio(finite(foodCogs) ? Math.abs(foodCogs) : null, foodRevenue, "ABS(food_cogs) / food_revenue * 100", ["food_cogs","food_revenue"]),
      cogsPercent: ratio(finite(cogs) ? Math.abs(cogs) : null, revenue, "ABS(cogs) / netRevenue * 100", ["cogs","revenue","discounts_refunds"]),
      labor: amountMetric(laborTotal, "labor + overtime", ["labor","overtime"]),
      laborPercent: ratio(finite(laborTotal) ? Math.abs(laborTotal) : null, revenue, "ABS(labor + overtime) / netRevenue * 100", ["labor","overtime","revenue","discounts_refunds"]),
      primeCost: amountMetric(cogs !== null && laborTotal !== null ? cogs + laborTotal : null, "cogs + labor + overtime", ["cogs","labor","overtime"]),
      primeCostPercent: ratio(cogs !== null && laborTotal !== null ? Math.abs(cogs + laborTotal) : null, revenue, "ABS(cogs + labor + overtime) / netRevenue * 100", ["cogs","labor","overtime","revenue","discounts_refunds"]),
      opex: amountMetric(opex, "opex", ["opex"]),
      ebitda: metric(ebitda, "grossProfit + labor + overtime + opex", ids("revenue","discounts_refunds","cogs","labor","overtime","opex"), ["revenue","discounts_refunds","cogs","labor","overtime","opex"].flatMap(missing)),
      netProfit: metric(netProfit, "EBITDA + depreciation + interest + tax", ids("revenue","discounts_refunds","cogs","labor","overtime","opex","depreciation","interest","tax"), ["revenue","discounts_refunds","cogs","labor","overtime","opex","depreciation","interest","tax"].flatMap(missing))
    },
    missingData: [...new Set([...missingContext, ...categories.filter(key => input[key].missing.length).map(key => key)])]
  };
  result.status = result.missingData.length === 0 ? "calculated" : "calculated_with_gaps";
  return result;
}
