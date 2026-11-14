/**
 * Workload-to-hours calculation.
 * Units and productivity standards must be supplied and approved by the operator.
 */
export function calculateRequiredHours({ items, coefficients, unitsPerLaborHour }) {
  if (!Array.isArray(items) || !Array.isArray(coefficients)) {
    return { status: "unavailable", reason: "missing_items_or_coefficients" };
  }
  if (!Number.isFinite(unitsPerLaborHour) || unitsPerLaborHour <= 0) {
    return { status: "unavailable", reason: "missing_or_invalid_productivity_standard" };
  }
  const coefficientMap = new Map(coefficients.map(x => [x.itemId, x.unitsPerItem]));
  let workloadUnits = 0;
  for (const item of items) {
    const coefficient = coefficientMap.get(item.itemId);
    if (!Number.isFinite(item.quantity) || !Number.isFinite(coefficient)) {
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

export function calculateLaborVariance({ actualHours, requiredHours }) {
  if (!Number.isFinite(actualHours) || !Number.isFinite(requiredHours)) {
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
