import test from "node:test";
import assert from "node:assert/strict";
import { calculateRequiredHours } from "../src/labor/productivity.js";
import { classifyABC, calculateContribution } from "../src/menu/engineering.js";
import { createRecoveryCase, markRecoveryCompleted, verifyRecovery } from "../src/service/recovery.js";

test("labor hours require approved productivity standards", () => {
  assert.equal(calculateRequiredHours({ items: [], coefficients: [] }).status, "unavailable");
  const r = calculateRequiredHours({
    items: [{ itemId: "dish-1", quantity: 20 }],
    coefficients: [{ itemId: "dish-1", unitsPerItem: 2 }],
    unitsPerLaborHour: 10
  });
  assert.equal(r.requiredHours, 4);
});

test("ABC requires explicit basis and thresholds", () => {
  assert.equal(classifyABC([{ quantity: 10 }], {}).status, "unavailable");
  const r = classifyABC(
    [{ id: "a", revenue: 80 }, { id: "b", revenue: 20 }],
    { basis: "revenue", aThrough: 0.8, bThrough: 0.95 }
  );
  assert.equal(r.rows[0].category, "A");
});

test("service case is not verified just because someone says it is complete", () => {
  const c = createRecoveryCase({ category: "order_error", sourceId: "msg-1", reportedAt: "2026-11-14T10:00:00Z", ownerRole: "shift_manager" });
  const completed = markRecoveryCompleted(c.case, [{ type: "guest_confirmation" }]);
  assert.equal(completed.case.state, "completed_unverified");
  const verified = verifyRecovery(completed.case, { verifierRole: "manager", verifiedAt: "2026-11-14T10:20:00Z", outcomeConfirmed: true });
  assert.equal(verified.case.state, "verified");
});
