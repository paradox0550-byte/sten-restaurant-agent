# Excel analysis and spreadsheet engine

The package now includes an XLSX reader/writer based on ExcelJS in `src/spreadsheets/workbook.js`.

For uploaded workbooks:
1. preserve original workbook and sheet names;
2. inspect cell values, formulas and cached results separately;
3. retain source cell/range lineage in extracted facts;
4. report parsing gaps; never silently replace blanks with zero;
5. do not execute macros, external links or arbitrary workbook code.

Formula validation is an integrity audit, not a general Excel calculation engine. It checks broken references and cached errors, compares formulas to approved formula specifications, and compares cached values with independent STEN calculations. ExcelJS does not recalculate formulas; missing cached results are warnings.

See `tools/spreadsheet-engine/README.md` for XLSX, DOCX/PDF, Google Sheets and Yandex Disk adapter contracts.
