/**
 * Deterministic finance helpers. No benchmark assumptions are embedded.
 * Missing inputs return unavailable; they are never coerced to zero.
 */
export function safeRatio(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return { status: "unavailable", reason: "missing_or_non_numeric_input" };
  }
  if (denominator === 0) {
    return { status: "unavailable", reason: "zero_denominator" };
  }
  return { status: "calculated", value: numerator / denominator };
}

export function calculateCostRatios({
  revenue,
  cogs,
  kitchenRevenue,
  kitchenCogs,
  labor,
}) {
  const cogsShare = safeRatio(cogs, revenue);
  const kitchenFoodCost = safeRatio(kitchenCogs, kitchenRevenue);
  const laborCost = safeRatio(labor, revenue);

  const primeCost = Number.isFinite(cogs) && Number.isFinite(labor)
    ? safeRatio(cogs + labor, revenue)
    : { status: "unavailable", reason: "missing_cogs_or_labor" };

  return {
    cogsShare,
    kitchenFoodCost,
    laborCost,
    primeCost,
    definitions: {
      cogsShare: "COGS / total revenue",
      kitchenFoodCost: "kitchen COGS / kitchen revenue",
      laborCost: "approved labor cost / total revenue",
      primeCost: "(COGS + approved labor cost) / total revenue",
    },
  };
}

export function aggregateRatio(rows, numeratorKey, denominatorKey) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { status: "unavailable", reason: "no_rows" };
  }
  let numerator = 0;
  let denominator = 0;
  for (const row of rows) {
    if (!Number.isFinite(row?.[numeratorKey]) || !Number.isFinite(row?.[denominatorKey])) {
      return { status: "unavailable", reason: "incomplete_row" };
    }
    numerator += row[numeratorKey];
    denominator += row[denominatorKey];
  }
  return safeRatio(numerator, denominator);
}
