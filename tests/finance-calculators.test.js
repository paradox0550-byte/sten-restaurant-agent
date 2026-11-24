import test from "node:test";
import assert from "node:assert/strict";
import { calculateRestaurantPnl } from "../src/finance/pnl.js";
import { calculatePayroll } from "../src/finance/payroll.js";
import { analyzePlanFactVariances, normalizeFinanceArticle } from "../src/finance/variances.js";

const context = { scope: "restaurant-1", period: "2026-10", currency: "RUB", taxBasis: "accrual" };
const line = (category, amount, id = category) => ({ id, category, amount });

test("P&L calculates gross profit, prime cost, EBITDA and net profit with signed expenses", () => {
  const result = calculateRestaurantPnl({ ...context, lines: [
    line("revenue", 1000), line("discounts_refunds", -50), line("cogs", -300),
    line("food_revenue", 800), line("food_cogs", -240), line("labor", -200),
    line("overtime", -20), line("opex", -100), line("depreciation", -30),
    line("interest", -10), line("tax", -40)
  ] });
  assert.equal(result.metrics.netRevenue.value, 950);
  assert.equal(result.metrics.grossProfit.value, 650);
  assert.equal(result.metrics.primeCost.value, -520);
  assert.equal(result.metrics.ebitda.value, 330);
  assert.equal(result.metrics.netProfit.value, 250);
  assert.equal(result.metrics.foodCostPercent.value, 30);
});

test("P&L does not coerce missing rows to zero", () => {
  const result = calculateRestaurantPnl({ ...context, lines: [line("revenue", 1000)] });
  assert.equal(result.metrics.ebitda.status, "unavailable");
  assert.ok(result.missingData.includes("cogs"));
});

test("P&L zero denominator is unavailable", () => {
  const result = calculateRestaurantPnl({ ...context, lines: [
    line("revenue", 0), line("discounts_refunds", 0), line("cogs", 0),
    line("food_revenue", 0), line("food_cogs", 0), line("labor", 0),
    line("overtime", 0), line("opex", 0), line("depreciation", 0),
    line("interest", 0), line("tax", 0)
  ] });
  assert.equal(result.metrics.cogsPercent.status, "unavailable");
  assert.equal(result.metrics.cogsPercent.missing[0], "zero_denominator");
});

test("payroll calculates hourly, shift and salary accruals; requires explicit shift duration", () => {
  const result = calculatePayroll([
    { id: "h", payType: "hourly", rate: 300, hours: 100, overtimeHours: 5, overtimeMultiplier: 1.5 },
    { id: "s", payType: "shift", rate: 4000, shifts: 10, hoursPerShift: 12 },
    { id: "m", payType: "salary", rate: 60000, salaryPeriods: 1, hours: 160 }
  ]);
  assert.equal(result.totalAccrued, 106250);
  assert.equal(result.overtimeAccrued, 2250);
  const incomplete = calculatePayroll([{ payType: "shift", rate: 4000, shifts: 10 }]);
  assert.equal(incomplete.totalAccrued, 0);
  assert.equal(incomplete.status, "calculated_with_gaps");
  assert.equal(incomplete.missingData[0].reason, "explicit_shift_count_and_duration_required");
});

test("variance analysis normalizes articles, classifies direction and ranks by cash impact", () => {
  assert.equal(normalizeFinanceArticle("ФОТ"), "labor");
  const result = analyzePlanFactVariances([
    { id: "a", article: "Выручка", plan: 1000, actual: 1200, scope: "r1", period: "2026-10", currency: "RUB", unit: "RUB", definition: "gross revenue", planSourceIds: ["p"], actualSourceIds: ["a"] },
    { id: "b", article: "ФОТ", plan: -200, actual: -250, scope: "r1", period: "2026-10", currency: "RUB", unit: "RUB", definition: "accrued payroll" }
  ], { directions: { revenue: "higher", labor: "lower" } });
  assert.equal(result.results[0].id, "b");
  assert.equal(result.unfavorable.length, 1);
  assert.equal(result.favorable.length, 1);
  assert.equal(result.results[0].deltaAbsolute, -50);
});

test("variance analysis reports missing inputs and does not assume favorable direction", () => {
  const result = analyzePlanFactVariances([
    { article: "Новая статья", plan: 100, actual: 90 },
    { article: "Прочее", plan: 100, actual: 90, scope: "r1", period: "2026-10", currency: "RUB", unit: "RUB", definition: "other" }
  ]);
  assert.equal(result.missingData.length, 1);
  assert.equal(result.unclassified.length, 1);
  assert.equal(result.unclassified[0].impact, "unclassified");
});
