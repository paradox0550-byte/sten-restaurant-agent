/**
 * Menu engineering primitives.
 * Classification thresholds are mandatory inputs; none are hard-coded.
 */
export function classifyABC(rows, { basis, aThrough, bThrough }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { status: "unavailable", reason: "no_rows" };
  }
  if (!["quantity", "revenue", "contribution"].includes(basis)) {
    return { status: "unavailable", reason: "basis_must_be_explicit" };
  }
  if (!Number.isFinite(aThrough) || !Number.isFinite(bThrough) ||
      aThrough <= 0 || bThrough <= aThrough || bThrough > 1) {
    return { status: "unavailable", reason: "approved_cumulative_thresholds_required" };
  }
  if (rows.some(r => !Number.isFinite(r[basis]) || r[basis] < 0)) {
    return { status: "unavailable", reason: "missing_or_negative_basis_value" };
  }
  const total = rows.reduce((s, r) => s + r[basis], 0);
  if (total <= 0) return { status: "unavailable", reason: "zero_total_basis" };

  const sorted = [...rows].sort((a, b) => b[basis] - a[basis]);
  let cumulative = 0;
  const classified = sorted.map(row => {
    cumulative += row[basis];
    const share = cumulative / total;
    const category = share <= aThrough ? "A" : share <= bThrough ? "B" : "C";
    return { ...row, shareOfTotal: row[basis] / total, cumulativeShare: share, category };
  });
  return { status: "calculated", basis, total, rows: classified };
}

export function calculateContribution({ sellingPrice, variableCost }) {
  if (!Number.isFinite(sellingPrice) || !Number.isFinite(variableCost)) {
    return { status: "unavailable", reason: "missing_price_or_variable_cost" };
  }
  return { status: "calculated", contribution: sellingPrice - variableCost };
}

export function classifyMenuMatrix({ popularity, contribution, popularityCutoff, contributionCutoff }) {
  if (![popularity, contribution, popularityCutoff, contributionCutoff].every(Number.isFinite)) {
    return { status: "unavailable", reason: "approved_metrics_and_cutoffs_required" };
  }
  return {
    status: "classified",
    quadrant: popularity >= popularityCutoff
      ? (contribution >= contributionCutoff ? "high_popularity_high_contribution" : "high_popularity_low_contribution")
      : (contribution >= contributionCutoff ? "low_popularity_high_contribution" : "low_popularity_low_contribution"),
  };
}
