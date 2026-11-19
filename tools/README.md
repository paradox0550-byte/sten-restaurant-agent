# STEN tools

Deterministic helpers are implemented in `calculators/` and source modules in `../src/`.
- Finance ratios: requires validated numerator/denominator scope and units.
- Labor productivity: requires approved coefficients and workload inputs.
- Menu engineering: classification requires an explicit basis and approved thresholds.
- Service recovery: tracks case states; does not contact guests or claim resolution.
- Intelligence engine: validates evidence/facts, legal applicability guardrails and action completeness.
- Spreadsheet/document engine: creates and reads XLSX, audits formula integrity against approved specifications and independent calculations, exports DOCX/PDF, creates Google Sheets, and uploads XLSX to Yandex Disk.

See `spreadsheet-engine/README.md` and `../docs/spreadsheet-engine.md` for provider authentication boundaries and limitations.
