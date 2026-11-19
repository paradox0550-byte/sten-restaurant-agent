import test from "node:test";
import assert from "node:assert/strict";
import { calculateRequiredHours, calculateKitchenSectionStaffing, calculateLaborVariance } from "../src/labor/productivity.js";
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

test("kitchen staffing is calculated by section workload and approved productive capacity", () => {
  const r = calculateKitchenSectionStaffing({
    sectionId: "hot",
    intervalMinutes: 30,
    items: [
      { itemId: "soup", quantity: 18, standardMinutesPerItem: 2, setupMinutesPerBatch: 0 },
      { itemId: "steak", quantity: 8, standardMinutesPerItem: 1, batchSize: 4, setupMinutesPerBatch: 4 }
    ],
    fixedWorkMinutes: 6,
    productiveUtilization: 0.8,
    minimumCoverage: 1
  });
  assert.equal(r.status, "calculated");
  assert.equal(r.unitWorkMinutes, 44);
  assert.equal(r.batchSetupMinutes, 8);
  assert.equal(r.totalWorkloadMinutes, 58);
  assert.equal(r.productiveCapacityPerEmployee, 24);
  assert.equal(r.workloadHeadcount, 3);
  assert.equal(r.requiredHeadcount, 3);
});

test("same dish count with different station time standards changes staffing", () => {
  const common = {
    sectionId: "cold",
    intervalMinutes: 30,
    items: [{ itemId: "dish", quantity: 10, standardMinutesPerItem: 1, setupMinutesPerBatch: 0 }],
    fixedWorkMinutes: 0,
    minimumCoverage: 0,
    productiveUtilization: 1
  };
  const quick = calculateKitchenSectionStaffing(common);
  const complex = calculateKitchenSectionStaffing({
    ...common,
    items: [{ itemId: "dish", quantity: 10, standardMinutesPerItem: 4, setupMinutesPerBatch: 0 }]
  });
  assert.equal(quick.requiredHeadcount, 1);
  assert.equal(complex.requiredHeadcount, 2);
});

test("kitchen staffing refuses missing standards and invalid utilization instead of assuming zero", () => {
  const base = {
    sectionId: "hot",
    intervalMinutes: 30,
    items: [{ itemId: "dish", quantity: 10 }],
    productiveUtilization: 0.8
  };
  assert.equal(calculateKitchenSectionStaffing(base).status, "unavailable");
  assert.equal(calculateKitchenSectionStaffing({ ...base, items: [{ itemId: "dish", quantity: 10, standardMinutesPerItem: 2, setupMinutesPerBatch: 0 }], fixedWorkMinutes: 0, minimumCoverage: 0, productiveUtilization: 1.1 }).status, "unavailable");
});

test("batch setup requires a batch size and is included once per batch", () => {
  const base = {
    sectionId: "prep",
    intervalMinutes: 60,
    productiveUtilization: 1,
    fixedWorkMinutes: 0,
    minimumCoverage: 0,
    items: [{ itemId: "sauce", quantity: 11, standardMinutesPerItem: 0, setupMinutesPerBatch: 5, batchSize: 10 }]
  };
  assert.equal(calculateKitchenSectionStaffing({ ...base, items: [{ ...base.items[0], batchSize: undefined }] }).status, "unavailable");
  assert.equal(calculateKitchenSectionStaffing(base).batchSetupMinutes, 10);
});

test("minimum station coverage is applied without replacing workload calculation", () => {
  const r = calculateKitchenSectionStaffing({
    sectionId: "grill",
    intervalMinutes: 30,
    items: [{ itemId: "dish", quantity: 1, standardMinutesPerItem: 2, setupMinutesPerBatch: 0 }],
    fixedWorkMinutes: 0,
    productiveUtilization: 1,
    minimumCoverage: 2
  });
  assert.equal(r.workloadHeadcount, 1);
  assert.equal(r.requiredHeadcount, 2);
});

test("ABC requires explicit basis and thresholds", () => {
  assert.equal(classifyABC([{ quantity: 10 }], {}).status, "unavailable");
  const r = classifyABC(
    [{ id: "a", revenue: 80 }, { id: "b", revenue: 20 }],
    { basis: "revenue", aThrough: 0.8, bThrough: 0.95 }
  );
  assert.equal(r.rows[0].category, "A");
});

test("contribution requires actual price and variable cost inputs", () => {
  assert.equal(calculateContribution({ sellingPrice: 100 }).status, "unavailable");
  assert.equal(calculateContribution({ sellingPrice: 100, variableCost: 35 }).contribution, 65);
});

test("service case is not verified just because someone says it is complete", () => {
  const c = createRecoveryCase({ category: "order_error", sourceId: "msg-1", reportedAt: "2026-11-14T10:00:00Z", ownerRole: "shift_manager" });
  const completed = markRecoveryCompleted(c.case, [{ type: "guest_confirmation" }]);
  assert.equal(completed.case.state, "completed_unverified");
  const verified = verifyRecovery(completed.case, { verifierRole: "manager", verifiedAt: "2026-11-14T10:20:00Z", outcomeConfirmed: true });
  assert.equal(verified.case.state, "verified");
});

test("kitchen staffing requires explicit fixed work and minimum coverage inputs", () => {
  const base = {
    sectionId: "hot",
    intervalMinutes: 30,
    items: [{ itemId: "dish", quantity: 2, standardMinutesPerItem: 3, setupMinutesPerBatch: 0 }],
    productiveUtilization: 0.8,
    fixedWorkMinutes: 0,
    minimumCoverage: 0
  };
  assert.equal(calculateKitchenSectionStaffing({ ...base, fixedWorkMinutes: undefined }).status, "unavailable");
  assert.equal(calculateKitchenSectionStaffing({ ...base, minimumCoverage: undefined }).status, "unavailable");
  assert.equal(calculateKitchenSectionStaffing({ ...base, items: [{ itemId: "dish", quantity: 2, standardMinutesPerItem: 3 }] }).status, "unavailable");
});


test("empty workload is not silently treated as zero demand", () => {
  assert.equal(calculateRequiredHours({ items: [], coefficients: [], unitsPerLaborHour: 10 }).status, "unavailable");
  assert.equal(calculateRequiredHours({ items: [], coefficients: [], unitsPerLaborHour: 10, emptyDemandConfirmed: true }).requiredHours, 0);
  const staffing = {
    sectionId: "hot",
    intervalMinutes: 30,
    items: [],
    productiveUtilization: 0.8,
    fixedWorkMinutes: 0,
    minimumCoverage: 0
  };
  assert.equal(calculateKitchenSectionStaffing(staffing).status, "unavailable");
  assert.equal(calculateKitchenSectionStaffing({ ...staffing, emptyDemandConfirmed: true }).requiredHeadcount, 0);
});

test("labor workload rejects negative quantities, invalid coefficients and negative hours", () => {
  assert.equal(calculateRequiredHours({
    items: [{ itemId: "dish", quantity: -1 }],
    coefficients: [{ itemId: "dish", unitsPerItem: 2 }],
    unitsPerLaborHour: 10
  }).status, "unavailable");
  assert.equal(calculateRequiredHours({
    items: [{ itemId: "dish", quantity: 1 }],
    coefficients: [{ itemId: "dish", unitsPerItem: -2 }],
    unitsPerLaborHour: 10
  }).status, "unavailable");
  assert.equal(calculateLaborVariance({ actualHours: -1, requiredHours: 2 }).status, "unavailable");
});
