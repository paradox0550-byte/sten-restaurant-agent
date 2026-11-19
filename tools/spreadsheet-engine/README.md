# STEN Spreadsheet & Document Engine

The executable spreadsheet/document module is in `src/spreadsheets/`. Hosts can expose its operations to the agent through `registerSpreadsheetTools()` and a tenant-aware artifact store; see `docs/spreadsheet-engine.md`.

## Capabilities

- Create XLSX workbooks with multiple sheets, headers, filters, frozen rows, formulas and cached results.
- Read XLSX files while preserving formula text and cached values as separate fields.
- Export structured workbook content to DOCX and PDF.
- Audit formula cells for broken references, Excel error values, missing expected formulas, formula drift and cached-result mismatches against independently calculated values.
- Create/read Google Sheets using the Google Sheets API v4 with a host-supplied OAuth access token.
- Upload XLSX files to a user's Yandex Disk with a host-supplied OAuth token.

## Formula validation boundary

ExcelJS writes and reads formulas but does not calculate them. STEN therefore does not claim to execute arbitrary Excel formulas. Formula checks compare formulas against approved specifications and compare cached results with independent deterministic calculations supplied by the domain layer. A missing cached result is reported as a warning, not as a verified value. The workbook should be recalculated by a compatible spreadsheet application before final sign-off.

## Google authentication

The host must complete Google OAuth and inject a short-lived access token with an appropriate Sheets scope. Tokens must not be placed in source files, prompts, logs or workbook metadata. The adapter does not implement a user-facing OAuth consent flow or token storage.

## Yandex boundary

The supported integration is Yandex Disk REST API file upload. Users can open the resulting XLSX in Yandex Documents/Spreadsheets. The public documentation reviewed for this implementation describes file storage/upload, not a cell-level spreadsheet editing API. This adapter therefore does not claim live collaborative cell synchronization.

## Runtime security

All provider tokens are passed at call time by a trusted host. Never expose tokens to model-generated tool arguments or persist them in tenant memory. The host must authenticate the user, enforce tenant ownership, authorize file access, and apply retention/deletion controls.
