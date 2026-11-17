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
- The host must enforce tenant scope and user consent before cloud writes.
- Cloud calls use explicit adapters and can be disabled by omitting credentials.
- Local file generation does not itself upload or share a document.
