const EXCEL_ERRORS = new Set(["#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#NUM!", "#N/A", "#NULL!"]);

function normalizeFormula(value) {
  return String(value ?? "").trim().replace(/^=/, "").replace(/\s+/g, "").toUpperCase();
}

/**
 * Audits formula integrity and compares selected formula cells with independently
 * calculated expected values supplied by the domain calculator. It does not execute
 * arbitrary Excel formulas; ExcelJS itself does not calculate formulas.
 */
export function validateWorkbookFormulas(workbook, { rules = [], requireRulesForEveryFormula = false, tolerance = 1e-8 } = {}) {
  if (!workbook?.worksheets) throw new TypeError("A valid ExcelJS workbook is required.");
  const issues = [];
  const formulaCells = [];
  const ruleKeys = new Set(rules.map((rule) => `${rule.sheet}!${rule.cell}`));

  for (const sheet of workbook.worksheets) {
    sheet.eachRow({ includeEmpty: false }, (row) => row.eachCell({ includeEmpty: false }, (cell) => {
      const value = cell.value;
      const key = `${sheet.name}!${cell.address}`;
      if (value && typeof value === "object" && "formula" in value) {
        formulaCells.push(key);
        if (/\#REF!|\[[^\]]+\]/i.test(value.formula)) {
          issues.push({ severity: "error", code: "BROKEN_FORMULA_REFERENCE", cell: key, message: "Formula contains a broken or external workbook reference." });
        }
        if (value.result && typeof value.result === "object" && value.result.error) {
          issues.push({ severity: "error", code: "FORMULA_RESULT_ERROR", cell: key, message: `Cached formula result is ${value.result.error}.` });
        }
        if (typeof value.result === "string" && EXCEL_ERRORS.has(value.result)) {
          issues.push({ severity: "error", code: "FORMULA_RESULT_ERROR", cell: key, message: `Cached formula result is ${value.result}.` });
        }
        if (requireRulesForEveryFormula && !ruleKeys.has(key)) {
          issues.push({ severity: "warning", code: "FORMULA_WITHOUT_VALIDATION_RULE", cell: key, message: "Formula has no independent validation rule." });
        }
      } else if (value && typeof value === "object" && "error" in value && EXCEL_ERRORS.has(value.error)) {
        issues.push({ severity: "error", code: "CELL_ERROR", cell: key, message: `Cell contains ${value.error}.` });
      }
    }));
  }

  for (const rule of rules) {
    const sheet = workbook.getWorksheet(rule.sheet);
    const key = `${rule.sheet}!${rule.cell}`;
    if (!sheet) {
      issues.push({ severity: "error", code: "VALIDATION_SHEET_MISSING", cell: key, message: "Validation rule refers to a missing worksheet." });
      continue;
    }
    const cell = sheet.getCell(rule.cell);
    const value = cell.value;
    if (!value || typeof value !== "object" || !("formula" in value)) {
      issues.push({ severity: "error", code: "EXPECTED_FORMULA_MISSING", cell: key, message: "Expected formula is missing from the cell." });
      continue;
    }
    if (normalizeFormula(value.formula) !== normalizeFormula(rule.expectedFormula)) {
      issues.push({ severity: "error", code: "FORMULA_MISMATCH", cell: key, message: "Formula differs from the approved formula specification.", expected: rule.expectedFormula, actual: value.formula });
    }
    if (typeof rule.expectedValue === "number") {
      if (!Number.isFinite(rule.expectedValue)) {
        issues.push({ severity: "error", code: "INVALID_EXPECTED_VALUE", cell: key, message: "Independent expected value must be finite." });
      } else if (typeof value.result === "number" && Math.abs(value.result - rule.expectedValue) > (rule.tolerance ?? tolerance)) {
        issues.push({ severity: "error", code: "CACHED_RESULT_MISMATCH", cell: key, message: "Cached spreadsheet result differs from the independent calculation.", expected: rule.expectedValue, actual: value.result });
      } else if (value.result === undefined || value.result === null) {
        issues.push({ severity: "warning", code: "CACHED_RESULT_MISSING", cell: key, message: "No cached formula result; independent expected value is available but workbook has not been recalculated." });
      }
    }
  }

  if (formulaCells.length > 0 && rules.length === 0) {
    issues.push({ severity: "warning", code: "NO_VALIDATION_RULES", message: "Formula cells were detected, but no approved formula rules were supplied." });
  }
  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  return { status: errors ? "failed" : warnings ? "passed_with_warnings" : "passed", formulaCount: formulaCells.length, checkedRuleCount: rules.length, errorCount: errors, warningCount: warnings, issues };
}
