# Spreadsheet & Document Engine

## Scope

The spreadsheet engine is a provider-neutral module, separate from the STEN management runtime. It creates and reads XLSX workbooks, exports DOCX/PDF, validates formula integrity, and exposes narrowly scoped cloud adapters.

## Local workbook API

```js
import {
  createWorkbook, writeXlsxBuffer, readXlsxBuffer,
  validateWorkbookFormulas, exportWorkbookDocx, exportWorkbookPdf,
} from "../src/spreadsheets/index.js";

const workbook = createWorkbook({
  title: "Payroll",
  sheets: [{
    name: "Payroll",
    columns: [{ header: "Employee", key: "employee" }, { header: "Hours", key: "hours" }, { header: "Pay", key: "pay" }],
    rows: [{ employee: "Alex", hours: 10, pay: { formula: "B2*500", result: 5000 } }],
    freezeRows: 1,
    autoFilter: true,
  }],
});
const xlsx = await writeXlsxBuffer(workbook);
const parsed = await readXlsxBuffer(xlsx);
const audit = validateWorkbookFormulas(workbook, {
  rules: [{ sheet: "Payroll", cell: "C2", expectedFormula: "B2*500", expectedValue: 5000 }],
  requireRulesForEveryFormula: true,
});
const docx = await exportWorkbookDocx(workbook, { title: "Payroll" });
const pdf = await exportWorkbookPdf(workbook, { title: "Payroll", fontPath: "/path/to/unicode-font.ttf" });
```

## Formula assurance

Formula integrity is not equivalent to formula execution. The validator:
- scans formula cells and cached Excel error values;
- flags broken/external references;
- checks formula text against approved formula specifications;
- compares cached values with independent expected values from STEN deterministic calculators;
- reports absent cached results as warnings;
- can require a validation rule for every formula.

It does not execute arbitrary formulas, VBA, macros, external links or workbook connections. No formula is considered verified merely because a formula string exists. For PDF output containing Cyrillic or other non-Latin text, pass a Unicode TTF/OTF file path through the `fontPath` option; PDFKit's built-in fonts do not cover all scripts.

## Google Sheets

The Google adapter calls Sheets API v4 to create a spreadsheet, write values/formulas using `USER_ENTERED`, and read ranges using `valueRenderOption=FORMULA`. The host supplies a valid OAuth access token. Required scopes should be restricted to the spreadsheet/Drive access actually needed. The user must grant the service identity or OAuth principal access to the target data.

## Yandex

The Yandex adapter uses the official Yandex Disk REST API upload-link flow, then uploads the generated XLSX bytes and reads back file metadata. This makes the workbook available in Disk storage for opening/editing in Yandex Documents. It does not provide live cell-level synchronization or collaborative spreadsheet API operations. OAuth token and Disk write permissions must be configured by the host/user.

## Security and operations

- No credentials are embedded in the repository.
- OAuth tokens are injected only at call time and are never returned or logged.
- The host must enforce tenant scope and user consent before cloud writes. To make spreadsheet operations callable by the agent runtime, register the exported `registerSpreadsheetTools({ registry, artifacts, getGoogleAccessToken, getYandexDiskAccessToken, getPdfFontPath })` helper. The artifact store must enforce tenant-scoped `save({ tenantId, name, mimeType, buffer })` and `get({ tenantId, artifactId })`; token/font resolvers are trusted host callbacks and must never be model-controlled.
- Cloud calls use explicit adapters and can be disabled by omitting credentials.
- Local file generation does not itself upload or share a document.


## Agent workflow for uploaded reports

A trusted host may inject `resolveUploadedFile({ tenantId, uploadId })` into `registerSpreadsheetTools()`. The resolver must authorize the upload against the authenticated tenant and return its bytes; model arguments must never contain arbitrary filesystem paths or URLs. The import tool copies the original XLSX into the tenant-scoped artifact store, applies a byte limit (25 MiB by default) and a total-cell limit (500,000 by default), and returns sheet dimensions plus a 10-row preview.

For large workbooks, the agent should:
1. inspect workbook metadata and preview before deciding what to read;
2. identify header rows, period, outlet, sales channel and units from the actual source;
3. read further data using `spreadsheet.read_xlsx_range` in windows of at most 500 rows;
4. reconcile row counts and source totals before calculating;
5. create the requested workbook with `spreadsheet.create_xlsx`;
6. return the artifact's download URL only when the host artifact store actually supplies one.

The import and range tools are registered only when a trusted upload resolver is configured. A downloadable URL is returned only when the artifact store's `save()` result includes `downloadUrl`. The repository does not include a production upload resolver, durable artifact store, signed-download service or deployed API. Those remain host deployment responsibilities.

### Menu low-seller report contract

A low-sales list is a screening report, not an automatic delisting decision. Keep source facts separate from computed metrics. At minimum, report item ID/name, units sold, net revenue (only if reconciled), share of item units, available selling days or availability, and source sheet/row lineage. Include contribution and Food Cost only when valid recipe/variable-cost data for the same period and scope are supplied. Do not invent popularity thresholds: show a ranked list by default and apply ABC/menu-engineering classes only with explicitly approved thresholds. Flag stock-outs, stop-list periods, new items, seasonality, channel mix and incomplete exports. Do not recommend removing a dish solely because it sold few units.

### Formula and quality boundary

The XLSX reader preserves formula text and cached values separately. ExcelJS does not calculate arbitrary formulas. Reconcile calculations independently in STEN's deterministic domain logic; do not treat a missing cached value as zero or as a validated result. Keep the uploaded original unchanged.
