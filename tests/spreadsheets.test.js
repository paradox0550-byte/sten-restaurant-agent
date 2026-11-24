import test from "node:test";
import assert from "node:assert/strict";
import {
  createWorkbook, readXlsxBuffer, readXlsxRangeBuffer, inspectXlsxBuffer, writeXlsxBuffer, validateWorkbookFormulas,
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
      const id = "artifact-1";
      store.set(`${tenantId}:${id}`, { name, mimeType, buffer });
      return { id, name };
    },
    async get({ tenantId, artifactId }) {
      return store.get(`${tenantId}:${artifactId}`) ?? null;
    },
  };
  const registry = registerSpreadsheetTools({ registry: new ToolRegistry(), artifacts });
  const created = await registry.execute({
    name: "spreadsheet.create_xlsx",
    callId: "create-report-1",
    approved: true,
    tenantId: "restaurant-a",
    permissions: ["spreadsheet.create_xlsx"],
    args: { title: "Shift report", sheets: [{ name: "Summary", rows: [["Revenue"], [1000]] }] },
  });
  assert.equal(created.artifactId, "artifact-1");
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

test("large XLSX reports can be inspected and read in bounded row windows", async () => {
  const rows = Array.from({ length: 20000 }, (_, index) => ({ sku: `SKU-${index + 1}`, name: `Dish ${index + 1}`, quantity: index % 37, revenue: (index % 37) * 250 }));
  const workbook = createWorkbook({ title: "Large sales report", sheets: [{
    name: "Sales", columns: [
      { header: "SKU", key: "sku" }, { header: "Dish", key: "name" },
      { header: "Quantity", key: "quantity" }, { header: "Revenue", key: "revenue" },
    ], rows, freezeRows: 1, autoFilter: true,
  }] });
  const bytes = await writeXlsxBuffer(workbook);
  const meta = await inspectXlsxBuffer(bytes, { previewRows: 3, maxCells: 100000 });
  assert.equal(meta.sheets[0].rowCount, 20001);
  assert.equal(meta.sheets[0].preview.length, 3);
  const page = await readXlsxRangeBuffer(bytes, { sheetName: "Sales", startRow: 19998, endRow: 20001, maxRows: 500 });
  assert.equal(page.rows.length, 4);
  assert.equal(page.rows[3][0], "SKU-20000");
  await assert.rejects(() => readXlsxRangeBuffer(bytes, { sheetName: "Sales", startRow: 1, endRow: 501, maxRows: 500 }), /maximum of 500 rows/);
});

test("agent imports uploaded XLSX, pages through it, and creates a tenant-scoped downloadable workbook", async () => {
  const { ToolRegistry } = await import("../src/runtime/index.js");
  const sourceWorkbook = createWorkbook({ title: "POS export", sheets: [{
    name: "Sales", rows: [["SKU", "Dish", "Qty"], ["A", "Burger", 15], ["B", "Salad", 4]],
  }] });
  const sourceBytes = await writeXlsxBuffer(sourceWorkbook);
  const store = new Map();
  let nextId = 0;
  const artifacts = {
    async save({ tenantId, name, mimeType, buffer }) {
      const id = `artifact-${++nextId}`;
      store.set(`${tenantId}:${id}`, { name, mimeType, buffer });
      return { id, name, downloadUrl: `https://files.example/${tenantId}/${id}` };
    },
    async get({ tenantId, artifactId }) { return store.get(`${tenantId}:${artifactId}`) ?? null; },
  };
  const registry = registerSpreadsheetTools({
    registry: new ToolRegistry(), artifacts,
    resolveUploadedFile: async ({ tenantId, uploadId }) => tenantId === "restaurant-a" && uploadId === "upload-1"
      ? { name: "pos-export.xlsx", buffer: sourceBytes } : null,
  });
  const imported = await registry.execute({
    name: "spreadsheet.import_uploaded_xlsx", tenantId: "restaurant-a",
    permissions: ["spreadsheet.import_uploaded_xlsx"], args: { uploadId: "upload-1" },
  });
  assert.equal(imported.totalCells, 9);
  assert.equal(imported.sheets[0].rowCount, 3);
  const page = await registry.execute({
    name: "spreadsheet.read_xlsx_range", tenantId: "restaurant-a",
    permissions: ["spreadsheet.read_xlsx_range"],
    args: { artifactId: imported.artifactId, sheetName: "Sales", startRow: 2, endRow: 3 },
  });
  assert.deepEqual(page.rows[1], ["B", "Salad", 4]);
  const created = await registry.execute({
    name: "spreadsheet.create_xlsx", tenantId: "restaurant-a",
    permissions: ["spreadsheet.create_xlsx"], approved: true,
    args: { title: "Low sellers", sheets: [{ name: "Analysis", rows: [["Dish", "Qty"], ["Salad", 4]] }] },
  });
  assert.equal(created.downloadUrl, `https://files.example/restaurant-a/${created.artifactId}`);
  await assert.rejects(() => registry.execute({
    name: "spreadsheet.read_xlsx_range", tenantId: "restaurant-b",
    permissions: ["spreadsheet.read_xlsx_range"],
    args: { artifactId: imported.artifactId, sheetName: "Sales", startRow: 1, endRow: 2 },
  }), /Artifact not found/);
});

