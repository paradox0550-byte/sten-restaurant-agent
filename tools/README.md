# STEN tools

Deterministic helpers are implemented in `calculators/` and source modules in `../src/`.
- Finance ratios: requires validated numerator/denominator scope and units.
- Labor productivity: requires approved coefficients and workload inputs.
- Menu engineering: classification requires an explicit basis and approved thresholds.
- Service recovery: tracks case states; does not contact guests or claim resolution.
- Intelligence engine: validates evidence/facts, legal applicability guardrails and action completeness.

`excel-analysis/` and `api/` are extension points only. No spreadsheet parser, hosted API or external integration is claimed as implemented in this package.
