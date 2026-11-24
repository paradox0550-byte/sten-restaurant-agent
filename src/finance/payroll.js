/**
 * Deterministic accrued payroll estimate. No implicit shift length, overtime
 * multiplier, tax treatment, or gross/net conversion is assumed.
 */
const finite = Number.isFinite;

export function calculatePayroll(rows = [], { currency = "RUB" } = {}) {
  const employees = [];
  const missingData = [];
  let total = 0, complete = true, totalHours = 0, overtimeTotal = 0;
  for (const [index, row] of rows.entries()) {
    const id = row?.id ?? `row-${index + 1}`;
    const type = row?.payType;
    const rate = row?.rate;
    if (!finite(rate) || rate < 0) {
      complete = false; missingData.push({ id, field: "rate", reason: "missing_or_invalid_rate" }); continue;
    }
    let base = null, hours = null;
    if (type === "hourly") {
      if (!finite(row.hours) || row.hours < 0) {
        complete = false; missingData.push({ id, field: "hours", reason: "missing_or_invalid_hours" }); continue;
      }
      hours = row.hours; base = hours * rate;
    } else if (type === "shift") {
      if (!finite(row.shifts) || row.shifts < 0 || !finite(row.hoursPerShift) || row.hoursPerShift <= 0) {
        complete = false; missingData.push({ id, field: "shifts_or_hoursPerShift", reason: "explicit_shift_count_and_duration_required" }); continue;
      }
      hours = row.shifts * row.hoursPerShift; base = row.shifts * rate;
    } else if (type === "salary") {
      if (!finite(row.salaryPeriods) || row.salaryPeriods < 0) {
        complete = false; missingData.push({ id, field: "salaryPeriods", reason: "explicit_salary_period_count_required" }); continue;
      }
      base = row.salaryPeriods * rate;
      hours = finite(row.hours) && row.hours >= 0 ? row.hours : null;
      if (hours === null) missingData.push({ id, field: "hours", reason: "salary_cost_calculated_but_hours_unavailable" });
    } else {
      complete = false; missingData.push({ id, field: "payType", reason: "unknown_pay_type" }); continue;
    }
    let overtimePay = 0, overtimeHours = 0;
    if (row.overtimeHours !== undefined && row.overtimeHours !== null) {
      if (!finite(row.overtimeHours) || row.overtimeHours < 0 || type !== "hourly" || !finite(row.overtimeMultiplier) || row.overtimeMultiplier < 1) {
        complete = false; missingData.push({ id, field: "overtime", reason: "explicit_hourly_overtime_hours_and_multiplier_required" });
      } else {
        overtimeHours = row.overtimeHours;
        overtimePay = overtimeHours * rate * row.overtimeMultiplier;
      }
    }
    const accrued = base + overtimePay;
    total += accrued; overtimeTotal += overtimePay;
    if (hours !== null) totalHours += hours;
    employees.push({ id, payType: type, baseAccrued: base, overtimeHours, overtimeMultiplier: row.overtimeMultiplier ?? null, overtimeAccrued: overtimePay, totalAccrued: accrued, hours, currency });
  }
  return {
    status: complete && missingData.length === 0 ? "calculated" : "calculated_with_gaps",
    basis: "accrued_before_tax_and_deductions",
    currency, totalAccrued: total, overtimeAccrued: overtimeTotal, totalHours,
    employees, missingData
  };
}
