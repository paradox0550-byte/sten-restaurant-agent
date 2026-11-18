/**
 * Workload-to-hours and kitchen-section staffing calculations.
 * Units, time standards, utilization and minimum coverage must be supplied
 * and approved by the operator. These outputs are planning estimates, not rosters.
 */
export function calculateRequiredHours({ items, coefficients, unitsPerLaborHour, emptyDemandConfirmed = false }) {
  if (!Array.isArray(items) || !Array.isArray(coefficients)) {
    return { status: "unavailable", reason: "missing_items_or_coefficients" };
  }
  if (items.length === 0 && emptyDemandConfirmed !== true) {\n    return { status: "unavailable", reason: "empty_workload_requires_explicit_zero_demand_confirmation" };\n  }\n  if (!Number.isFinite(unitsPerLaborHour) || unitsPerLaborHour <= 0) {
    return { status: "unavailable", reason: "missing_or_invalid_productivity_standard" };
  }
  if (coefficients.some(x => typeof x?.itemId !== "string" || !x.itemId.trim() ||\n      !Number.isFinite(x.unitsPerItem) || x.unitsPerItem <= 0) ||\n      new Set(coefficients.map(x => x.itemId)).size !== coefficients.length) {\n    return { status: "unavailable", reason: "invalid_or_duplicate_item_coefficients" };\n  }\n  const coefficientMap = new Map(coefficients.map(x => [x.itemId, x.unitsPerItem]));
  let workloadUnits = 0;
  for (const item of items) {
    const coefficient = coefficientMap.get(item.itemId);
    if (typeof item?.itemId !== "string" || !item.itemId.trim() ||\n        !Number.isFinite(item.quantity) || item.quantity < 0 || !Number.isFinite(coefficient)) {
      return { status: "unavailable", reason: "missing_quantity_or_item_coefficient" };
    }
    workloadUnits += item.quantity * coefficient;
  }
  return {
    status: "calculated",
    workloadUnits,
    requiredHours: workloadUnits / unitsPerLaborHour,
  };
}

/**
 * Estimate concurrent staff required for one kitchen section and one time bucket.
 * Each item row represents work performed by this section only. If a dish uses
 * multiple sections, its active minutes must be allocated across those sections
 * without double-counting the same operation.
 */
export function calculateKitchenSectionStaffing({
  sectionId,
  intervalMinutes,
  items,
  productiveUtilization,
  fixedWorkMinutes,
  minimumCoverage,
}) {
  if (typeof sectionId !== "string" || !sectionId.trim()) {
    return { status: "unavailable", reason: "section_id_required" };
  }
  if (!Number.isFinite(intervalMinutes) || intervalMinutes <= 0) {
    return { status: "unavailable", reason: "valid_interval_minutes_required" };
  }
  if (!Array.isArray(items)) {
    return { status: "unavailable", reason: "dish_workload_rows_required" };
  }
  if (!Number.isFinite(productiveUtilization) ||
      productiveUtilization <= 0 || productiveUtilization > 1) {
    return { status: "unavailable", reason: "approved_productive_utilization_between_zero_and_one_required" };
  }
  if (!Number.isFinite(fixedWorkMinutes) || fixedWorkMinutes < 0) {
    return { status: "unavailable", reason: "fixed_work_minutes_must_be_non_negative" };
  }
  if (!Number.isInteger(minimumCoverage) || minimumCoverage < 0) {
    return { status: "unavailable", reason: "minimum_coverage_must_be_a_non_negative_integer" };
  }

  let unitWorkMinutes = 0;
  let batchSetupMinutes = 0;
  for (const item of items) {
    if (typeof item.itemId !== "string" || !item.itemId.trim() ||
        !Number.isFinite(item.quantity) || item.quantity < 0 ||
        !Number.isFinite(item.standardMinutesPerItem) || item.standardMinutesPerItem < 0 ||
        !Number.isFinite(item.setupMinutesPerBatch) || item.setupMinutesPerBatch < 0) {
      return { status: "unavailable", reason: "missing_or_invalid_item_quantity_standard_or_batch_setup_minutes" };
    }
    unitWorkMinutes += item.quantity * item.standardMinutesPerItem;

    const setupMinutes = item.setupMinutesPerBatch;
    if (!Number.isFinite(setupMinutes) || setupMinutes < 0) {
      return { status: "unavailable", reason: "invalid_batch_setup_minutes" };
    }
    if (setupMinutes > 0) {
      if (!Number.isFinite(item.batchSize) || item.batchSize <= 0) {
        return { status: "unavailable", reason: "batch_size_required_when_batch_setup_minutes_are_used" };
      }
      batchSetupMinutes += Math.ceil(item.quantity / item.batchSize) * setupMinutes;
    }
  }

  const totalWorkloadMinutes = unitWorkMinutes + batchSetupMinutes + fixedWorkMinutes;
  const productiveCapacityPerEmployee = intervalMinutes * productiveUtilization;
  const workloadHeadcount = Math.ceil(totalWorkloadMinutes / productiveCapacityPerEmployee);
  const requiredHeadcount = Math.max(workloadHeadcount, minimumCoverage);

  return {
    status: "calculated",
    sectionId,
    intervalMinutes,
    unitWorkMinutes,
    batchSetupMinutes,
    fixedWorkMinutes,
    totalWorkloadMinutes,
    productiveCapacityPerEmployee,
    productiveUtilization,
    workloadHeadcount,
    minimumCoverage,
    requiredHeadcount,
    utilizationAtRequiredHeadcount: requiredHeadcount > 0
      ? totalWorkloadMinutes / (requiredHeadcount * productiveCapacityPerEmployee)
      : 0,
    interpretation: "modelled_concurrent_staffing_requirement_not_an_approved_roster",
  };
}

export function calculateLaborVariance({ actualHours, requiredHours }) {
  if (!Number.isFinite(actualHours) || !Number.isFinite(requiredHours) || actualHours < 0 || requiredHours < 0) {
    return { status: "unavailable", reason: "missing_actual_or_required_hours" };
  }
  return {
    status: "calculated",
    varianceHours: actualHours - requiredHours,
    interpretation: actualHours > requiredHours ? "above_modelled_requirement" :
      actualHours < requiredHours ? "below_modelled_requirement" : "at_modelled_requirement",
    note: "Modelled requirement is not a staffing instruction; validate coverage, breaks, safety, and labor rules.",
  };
}
