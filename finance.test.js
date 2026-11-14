import test from "node:test";
import assert from "node:assert/strict";
import { safeRatio, calculateCostRatios, aggregateRatio } from "../src/finance/ratios.js";

test("missing inputs do not become zero", () => {
  assert.equal(safeRatio(undefined, 100).status, "unavailable");
  assert.equal(safeRatio(10, 0).reason, "zero_denominator");
});

test("kitchen Food Cost is distinct from total COGS share", () => {
  const r = calculateCostRatios({ revenue: 1000, cogs: 300, kitchenRevenue: 700, kitchenCogs: 140, labor: 250 });
  assert.equal(r.cogsShare.value, 0.3);
  assert.equal(r.kitchenFoodCost.value, 0.2);
  assert.equal(r.primeCost.value, 0.55);
});

test("aggregate ratio sums amounts before dividing", () => {
  const r = aggregateRatio([{ cost: 20, revenue: 100 }, { cost: 90, revenue: 900 }], "cost", "revenue");
  assert.equal(r.value, 0.11);
});
