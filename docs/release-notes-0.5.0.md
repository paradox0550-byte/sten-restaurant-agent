# STEN 0.5.0 — Release Notes

**Package status:** working core  
**Compatibility:** Node.js 18 or newer  
**CI runtime:** Node.js 22  
**Release state:** verified release candidate; not published

## Included

- Provider-neutral HoReCa expert-intelligence core with finance, labor/payroll, menu, service and operations workflows.
- Evidence Registry with provenance, validity, territory, applicability, limitations and conflict handling.
- Deterministic finance/labor/menu calculators and source-aware operational knowledge retrieval.
- Tenant-required runtime boundary, deny-by-default tool execution, argument validation, tenant-scoped development memory and audit interfaces.
- Management workflow and evidence-backed outcome verification.
- Retrieval/evidence evaluation framework and package integrity validator.
- Russian end-user installation guide for ChatGPT Projects and Claude Projects.
- Dependency-free secret-pattern scan and reproducible source-archive generator.

## Verification

Latest candidate CI: [run 43695928368](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43695928368), branch commit `b067b37bd0ff91f5079638be7da38d53427afd9c`.

- Automated tests: 91 passed, 0 failed.
- Evidence Registry validation: passed; one warning remains for an intentionally unknown legal intake placeholder. It is not treated as a legal fact.
- Package integrity: passed; 143 tracked files match the 143 manifest paths.
- Secret-pattern scan: passed across 143 tracked text files and 18,088 added lines in reachable Git history; no high-confidence credential patterns found.
- Source archive: generated from the pull-request merge candidate, compared with the package manifest (143/143), downloaded and independently inspected. ZIP integrity and SHA-256 passed; the digest is in the artifact sidecar `SHA256SUMS.txt`.
- Golden lexical retrieval: Precision@10 36.25%, Recall@10 92.92%, MRR 1.00, nDCG@10 93.65%; pinned baseline nDCG@10 is 93.36%.

The golden labels and pinned baseline file were not rewritten. Holdout labels remain provisional and are not expert-adjudicated.

## User setup

- Russian end-user guide: `docs/USER_GUIDE_RU.md`.
- ChatGPT Project instructions: `providers/chatgpt/project-instructions-ru.md`.
- Security checklist: `docs/SECURITY_RELEASE_CHECKLIST.md`.

## Provider setup

- ChatGPT: use a ChatGPT Project, add project instructions and upload the knowledge files. New personal GPT creation is not a universal option, so the guide does not rely on it.
- Claude: use a Claude Project, add project instructions and Project Knowledge. Adapt reference skills to the current Claude Skills packaging format before installation.
- ChatGPT OpenAPI is an unconfigured template with a placeholder host and no paths. Claude MCP configuration is intentionally empty. Neither provider has a live STEN API connection in this package.

## Explicit limitations

- No production API, live provider connector, hosted memory, persistent vector database or production embedding/reranking provider is included.
- In-memory memory and audit adapters are development/test implementations.
- Host authentication, tenant derivation, authorization, durable encrypted storage, retention and deletion controls must be supplied by the integrating host.
- No penetration test, production security certification, legal compliance certification or professional answer-quality certification is claimed.
- Stage 11 substantive knowledge validation remains open. Operational procedures and sector-specific corpora require expert/source/jurisdiction review. Unknown legal intake data are not confirmed requirements.
- Public redistribution rights for generalized methodology derived from supplied corporate practice materials require owner confirmation before publication.

## Release decision

This file is a release-candidate note set. No GitHub Release or tag is published. Publication requires explicit owner approval after reviewing the stated limitations and confirming redistribution rights.
