import test from "node:test";
import assert from "node:assert/strict";
import {
  createWorkbook, readXlsxBuffer, writeXlsxBuffer, validateWorkbookFormulas,
  exportDocxBuffer, exportPdfBuffer, createGoogleSpreadsheet, readGoogleSheetRange, uploadToYandexDisk, registerSpreadsheetTools,
} from "../src/spreadsheets/index.js";

test("XLSX workbook can be generated and read with formulas preserved", async () => {
  const workbook = createWorkbook({
    title: "Payroll",
    sheets: [{ name: "Payroll", columns: [{ header: "Employee", key: "employee" }, { header: "Hours", key: "hours" }, { header: "Pay", key: "pay" }], rows: [
      { employee: "Alex", hours: 10, pay: { formula: "B2*500", result: 5000 } },
    ], freezeRows: 1, autoFilter: true }],
  });
  const bytes = await writeXlsxBuffer(workbook);
  const parsed = await readXlsxBuffer(bytes);
  assert.equal(parsed.sheets[0].name, "Payroll");
  assert.deepEqual(parsed.sheets[0].rows[1][2], { formula: "B2*500", result: 5000, address: "C2" });
});

test("XLSX reader rejects non-XLSX input", async () => {
  await assert.rejects(() => readXlsxBuffer(Buffer.from("not a workbook")), /not a ZIP-based XLSX/);
});

test("formula validator checks approved formula and independent result", () => {
  const workbook = createWorkbook({ sheets: [{ name: "Calc", rows: [["Hours", "Rate", "Pay"], [10, 500, { formula: "B2*A2", result: 5000 }]] }] });
  const result = validateWorkbookFormulas(workbook, {
    rules: [{ sheet: "Calc", cell: "C2", expectedFormula: "B2*A2", expectedValue: 5000 }],
    requireRulesForEveryFormula: true,
  });
  assert.equal(result.status, "passed");
  assert.equal(result.formulaCount, 1);
});

test("formula validator reports formula mismatch and missing cached result", () => {
  const workbook = createWorkbook({ sheets: [{ name: "Calc", rows: [["Value"], [{ formula: "A1+1" }]] }] });
  const result = validateWorkbookFormulas(workbook, { rules: [{ sheet: "Calc", cell: "A2", expectedFormula: "A1+2", expectedValue: 2 }] });
  assert.equal(result.status, "failed");
  assert.ok(result.issues.some((issue) => issue.code === "FORMULA_MISMATCH"));
  assert.ok(result.issues.some((issue) => issue.code === "CACHED_RESULT_MISSING"));
});

test("DOCX and PDF exports produce non-empty buffers", async () => {
  const sheets = [{ name: "Report", rows: [["Metric", "Value"], ["Revenue", 1000]] }];
  const docx = await exportDocxBuffer({ title: "STEN", sheets });
  const pdf = await exportPdfBuffer({ title: "STEN", sheets });
  assert.ok(docx.length > 100);
  assert.equal(docx.subarray(0, 2).toString(), "PK");
  assert.ok(pdf.subarray(0, 4).toString() === "%PDF");
});

test("Google Sheets adapter creates a spreadsheet and writes values", async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    return { ok: true, status: 200, json: async () => calls.length === 1
      ? { spreadsheetId: "sheet-1", properties: { title: "Demo" }, spreadsheetUrl: "https://docs.google.com/spreadsheets/d/sheet-1/edit" }
      : { totalUpdatedCells: 2 } };
  };
  const result = await createGoogleSpreadsheet({ accessToken: "test-token", title: "Demo", sheets: [{ name: "Data", rows: [["A"], ["B"]] }], fetchImpl });
  assert.equal(result.spreadsheetId, "sheet-1");
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.method, "POST");
  assert.equal(JSON.parse(calls[1].options.body).valueInputOption, "USER_ENTERED");
});

test("Google Sheets range reader requests formulas", async () => {
  let called = "";
  const fetchImpl = async (url) => { called = String(url); return { ok: true, status: 200, json: async () => ({ values: [["=A1+B1"]] }) }; };
  const result = await readGoogleSheetRange({ accessToken: "token", spreadsheetId: "id", range: "Sheet1!A1", fetchImpl });
  assert.equal(result.values[0][0], "=A1+B1");
  assert.ok(called.includes("valueRenderOption=FORMULA"));
});

test("Yandex Disk adapter requests upload link, uploads bytes and verifies metadata", async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (calls.length === 1) return { ok: true, status: 200, json: async () => ({ href: "https://upload.example/file", method: "PUT" }) };
    if (calls.length === 2) return { ok: true, status: 201, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => ({ name: "report.xlsx", size: 123, mime_type: "application/xlsx" }) };
  };
  const result = await uploadToYandexDisk({ accessToken: "oauth", path: "/STEN/report.xlsx", content: Buffer.from("xlsx"), fetchImpl });
  assert.equal(result.storage, "yandex-disk");
  assert.equal(result.spreadsheetSync, false);
  assert.equal(calls.length, 3);
  assert.equal(calls[1].options.method, "PUT");
});

test("Yandex Disk adapter rejects empty files and missing tokens", async () => {
  await assert.rejects(() => uploadToYandexDisk({ accessToken: "", path: "/x", content: Buffer.from("x") }), /OAuth token/);
  await assert.rejects(() => uploadToYandexDisk({ accessToken: "token", path: "/x", content: Buffer.alloc(0) }), /must not be empty/);
});

test("agent tools create and read tenant-scoped XLSX artifacts through the runtime registry", async () => {
  const { ToolRegistry } = await import("../src/runtime/index.js");
  const store = new Map();
  const artifacts = {
    async save({ tenantId, name, mimeType, buffer }) {
      const id = `${tenantId}:artifact-1`;
      store.set(id, { name, mimeType, buffer });
      return { id, name };
    },
    async get({ tenantId, artifactId }) {
      return store.get(`${tenantId}:${artifactId}`) ?? null;
    },
  };
  const registry = registerSpreadsheetTools({ registry: new ToolRegistry(), artifacts });
  const created = await registry.execute({
    name: "spreadsheet.create_xlsx",
    tenantId: "restaurant-a",
    permissions: ["spreadsheet.create_xlsx"],
    args: { title: "Shift report", sheets: [{ name: "Summary", rows: [["Revenue"], [1000]] }] },
  });
  assert.equal(created.artifactId, "restaurant-a:artifact-1");
  const read = await registry.execute({
    name: "spreadsheet.read_xlsx",
    tenantId: "restaurant-a",
    permissions: ["spreadsheet.read_xlsx"],
    args: { artifactId: created.artifactId },
  });
  assert.equal(read.sheets[0].rows[1][0], 1000);
  await assert.rejects(() => registry.execute({
    name: "spreadsheet.read_xlsx",
    tenantId: "restaurant-b",
    permissions: ["spreadsheet.read_xlsx"],
    args: { artifactId: created.artifactId },
  }), /Artifact not found/);
});
