# STEN 0.5.0 — Release Notes

**Package status:** working core  
**Compatibility:** Node.js 18 or newer  
**CI runtime:** Node.js 22  
**Release state:** prepared for review; not published

## Included

- Provider-neutral HoReCa expert-intelligence core with finance, labor/payroll, menu, service and operations workflows.
- Evidence Registry with provenance, validity, territory, applicability, limitations and conflict handling.
- Deterministic finance/labor/menu calculators and source-aware operational knowledge retrieval.
- Tenant-required runtime boundary, deny-by-default tool execution, argument validation, tenant-scoped development memory and audit interfaces.
- Management workflow and evidence-backed outcome verification.
- Retrieval/evidence evaluation framework and package integrity validator.

## Verification

Latest verified main CI commit: `7613b8a8f090c9cc174bfdd7afc29c5bbc305a6d`.

- Automated tests: 91 passed, 0 failed.
- Evidence Registry validation: passed; one warning remains for an intentionally unknown legal intake placeholder.
- Package integrity: passed; 137 tracked files match the 137 manifest paths.
- Golden lexical retrieval: Precision@10 36.25%, Recall@10 92.92%, MRR 1.00, nDCG@10 93.65%; pinned baseline nDCG@10 is 93.36%.

The golden labels and pinned baseline file were not rewritten. Holdout labels remain provisional and are not expert-adjudicated.

## Provider setup

- ChatGPT: copy canonical instructions and attach knowledge files as described in `providers/chatgpt/instructions.md`. The OpenAPI file is an unconfigured template with a placeholder host and no endpoints; it is not a live API.
- Claude: use the project instructions and knowledge files as described in `providers/claude/project-instructions.md`. Adapt the reference skills to the current Claude Skills packaging format before installation. MCP server configuration is intentionally empty.

## Explicit limitations

- No production API, live provider connector, hosted memory, persistent vector database or production embedding/reranking provider is included.
- In-memory memory and audit adapters are development/test implementations.
- Host authentication, tenant derivation, authorization, durable encrypted storage, retention and deletion controls must be supplied by the integrating host.
- No penetration test, production security certification, legal compliance certification or professional answer-quality certification is claimed.
- Stage 11 substantive knowledge validation remains open. Operational procedures and sector-specific corpora require expert/source/jurisdiction review. Unknown legal intake data are not confirmed requirements.

## Release decision

This file is a release candidate note set. No GitHub Release or tag is published by this change. Publication requires explicit owner approval after reviewing the stated limitations.
