/**
 * Deterministic accrued payroll estimate.
 * Totals are unavailable when any employee row is incomplete; known partial
 * amounts are exposed separately and must never be mistaken for full payroll.
 */
const finite = Number.isFinite;

export function calculatePayroll(rows, { currency = "RUB" } = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      status: "insufficient_data",
      basis: "accrued_before_tax_and_deductions",
      currency,
      totalAccrued: null,
      partialAccrued: null,
      overtimeAccrued: null,
      totalHours: null,
      employees: [],
      missingData: [{ field: "rows", reason: "non_empty_payroll_rows_required" }]
    };
  }

  const employees = [];
  const missingData = [];
  let partialAccrued = 0;
  let partialOvertime = 0;
  let totalComplete = true;
  let hoursComplete = true;
  let knownHours = 0;

  for (const [index, row] of rows.entries()) {
    const id = row?.id ?? `row-${index + 1}`;
    const type = row?.payType;
    const rate = row?.rate;
    if (!finite(rate) || rate < 0) {
      totalComplete = false;
      hoursComplete = false;
      missingData.push({ id, field: "rate", reason: "missing_or_invalid_rate" });
      continue;
    }

    let base = null;
    let hours = null;
    if (type === "hourly") {
      if (!finite(row.hours) || row.hours < 0) {
        totalComplete = false;
        hoursComplete = false;
        missingData.push({ id, field: "hours", reason: "missing_or_invalid_hours" });
        continue;
      }
      hours = row.hours;
      base = hours * rate;
    } else if (type === "shift") {
      if (!finite(row.shifts) || row.shifts < 0 || !finite(row.hoursPerShift) || row.hoursPerShift <= 0) {
        totalComplete = false;
        hoursComplete = false;
        missingData.push({ id, field: "shifts_or_hoursPerShift", reason: "explicit_shift_count_and_duration_required" });
        continue;
      }
      hours = row.shifts * row.hoursPerShift;
      base = row.shifts * rate;
    } else if (type === "salary") {
      if (!finite(row.salaryPeriods) || row.salaryPeriods < 0) {
        totalComplete = false;
        hoursComplete = false;
        missingData.push({ id, field: "salaryPeriods", reason: "explicit_salary_period_count_required" });
        continue;
      }
      base = row.salaryPeriods * rate;
      if (row.hours !== undefined && row.hours !== null) {
        if (!finite(row.hours) || row.hours < 0) {
          hoursComplete = false;
          missingData.push({ id, field: "hours", reason: "invalid_salary_hours" });
        } else hours = row.hours;
      } else hoursComplete = false;
    } else {
      totalComplete = false;
      hoursComplete = false;
      missingData.push({ id, field: "payType", reason: "unknown_pay_type" });
      continue;
    }

    let overtimePay = 0;
    let overtimeHours = 0;
    if (row.overtimeHours !== undefined && row.overtimeHours !== null) {
      if (!finite(row.overtimeHours) || row.overtimeHours < 0 || type !== "hourly" || !finite(row.overtimeMultiplier) || row.overtimeMultiplier < 1) {
        totalComplete = false;
        missingData.push({ id, field: "overtime", reason: "explicit_hourly_overtime_hours_and_multiplier_required" });
      } else {
        overtimeHours = row.overtimeHours;
        overtimePay = overtimeHours * rate * row.overtimeMultiplier;
      }
    }

    partialAccrued += base + overtimePay;
    partialOvertime += overtimePay;
    if (hours !== null) knownHours += hours;
    employees.push({
      id, payType: type, baseAccrued: base, overtimeHours,
      overtimeMultiplier: row.overtimeMultiplier ?? null,
      overtimeAccrued: overtimePay, totalAccrued: base + overtimePay, hours, currency
    });
  }

  return {
    status: totalComplete ? "calculated" : "calculated_with_gaps",
    basis: "accrued_before_tax_and_deductions",
    currency,
    totalAccrued: totalComplete ? partialAccrued : null,
    partialAccrued,
    overtimeAccrued: totalComplete ? partialOvertime : null,
    totalHours: hoursComplete ? knownHours : null,
    employees,
    missingData
  };
}
