/**
 * Plan/fact variance analysis. Direction is configured per normalized article;
 * no generic assumption that an increase or decrease is favorable is made.
 */
const finite = Number.isFinite;
const ALIASES = {
  revenue: ["выручка","revenue","sales","продажи"],
  discounts_refunds: ["скидки","возвраты","discounts","refunds"],
  cogs: ["себестоимость","cogs","food cost","товарная себестоимость"],
  labor: ["фот","персонал","зарплата","labor","payroll"],
  overtime: ["переработки","сверхурочные","overtime"],
  opex: ["операционные расходы","opex","аренда","коммунальные","маркетинг"]
};
const clean = value => String(value ?? "").trim().toLocaleLowerCase("ru-RU").replace(/ё/g,"е").replace(/\s+/g," ");

export function normalizeFinanceArticle(name, mapping = {}) {
  const key = clean(name);
  for (const [canonical, aliases] of Object.entries({ ...ALIASES, ...mapping })) {
    if (clean(canonical) === key || (Array.isArray(aliases) && aliases.some(alias => clean(alias) === key))) return canonical;
  }
  return null;
}

export function analyzePlanFactVariances(rows = [], { mapping = {}, directions = {}, materiality = {} } = {}) {
  const missingData = [], results = [];
  for (const [index, row] of rows.entries()) {
    const id = row?.id ?? `row-${index + 1}`;
    const category = row?.category ?? normalizeFinanceArticle(row?.article, mapping);
    if (!category) { missingData.push({ id, field: "article", reason: "unmapped_article" }); continue; }
    if (!finite(row.plan) || !finite(row.actual)) {
      missingData.push({ id, category, field: !finite(row.plan) ? "plan" : "actual", reason: "missing_or_non_numeric_value" }); continue;
    }
    const basis = ["scope","period","currency","unit","definition"];
    const absent = basis.filter(key => row[key] === undefined || row[key] === null || row[key] === "");
    if (absent.length) { missingData.push({ id, category, field: absent.join(","), reason: "comparison_basis_incomplete" }); continue; }
    const delta = row.actual - row.plan;
    const relative = row.plan === 0 ? null : delta / Math.abs(row.plan) * 100;
    const direction = directions[category] ?? "unknown";
    const favorable = direction === "lower" ? delta < 0 : direction === "higher" ? delta > 0 : null;
    const impact = direction === "neutral" ? (delta === 0 ? "no_change" : "neutral") : favorable === null ? (delta === 0 ? "no_change" : "unclassified") : favorable ? "favorable" : delta === 0 ? "no_change" : "unfavorable";
    const minAmount = materiality[category]?.amount;
    const minPercent = materiality[category]?.percent;
    const hasMaterialityRule = finite(minAmount) || finite(minPercent);
    const material = hasMaterialityRule
      ? ((finite(minAmount) && Math.abs(delta) >= minAmount) || (finite(minPercent) && relative !== null && Math.abs(relative) >= minPercent))
      : null;
    results.push({
      id, category, article: row.article ?? category, plan: row.plan, actual: row.actual,
      deltaAbsolute: delta, deltaPercent: relative,
      impact,
      directionRule: direction, material, currency: row.currency,
      unit: row.unit, period: row.period, scope: row.scope, definition: row.definition,
      sourceIds: [...new Set([...(row.planSourceIds ?? []), ...(row.actualSourceIds ?? [])])]
    });
  }
  results.sort((a,b) => Math.abs(b.deltaAbsolute) - Math.abs(a.deltaAbsolute));
  return {
    status: missingData.length ? "calculated_with_gaps" : "calculated",
    convention: "actual_minus_plan",
    results,
    favorable: results.filter(x => x.impact === "favorable"),
    unfavorable: results.filter(x => x.impact === "unfavorable"),
    unclassified: results.filter(x => x.impact === "unclassified"),
    neutral: results.filter(x => x.impact === "neutral"),
    missingData
  };
}
