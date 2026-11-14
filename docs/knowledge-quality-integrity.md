# Knowledge quality integrity checks

Run the metadata and cross-reference quality check through the Node test suite.

The evaluator verifies:
- procedure source IDs resolve to the source catalog;
- each procedure points to an existing checklist;
- owner and cadence provenance fields are explicit;
- unknown/unspecified fields are represented;
- checklist-to-procedure links resolve;
- graph source links resolve to known sources and nodes;
- every sector branch has specialist branches and profile fields.

The evaluator deliberately does **not** claim to measure semantic correctness, legal validity, source freshness, or answer faithfulness. Those require expert review, current authoritative sources, and representative answer-level evaluation.

Output scope: `metadata_and_cross_reference_integrity_only`.
