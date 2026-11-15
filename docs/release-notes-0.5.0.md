# STEN 0.5.0 — Release Notes

**Package status:** working core  
**Compatibility:** Node.js 18 or newer  
**CI runtime:** Node.js 22  
**Release state:** verified release candidate; not published

## Included

- Provider-neutral HoReCa expert-intelligence core with finance, labor/payroll, menu, service and operations workflows.
- Evidence Registry with provenance, validity, territory, applicability, limitations and conflict handling.
- Deterministic finance/labor/menu calculators and source-aware operational knowledge retrieval.
- Kitchen staffing estimate by station and production interval, with explicit time-standard and utilization inputs.
- End-to-end menu-engineering workflow connecting sales, recipe cost, contribution, ABC, menu matrix and kitchen workload.
- Tenant-required runtime boundary, deny-by-default tool execution, argument validation, tenant-scoped development memory and audit interfaces.
- Management workflow and evidence-backed outcome verification.
- Retrieval/evidence evaluation framework and package integrity validator.
- Russian end-user installation guide for ChatGPT Projects and Claude Projects.
- Dependency-free secret-pattern scan and reproducible source-archive generator.

## Verification

Latest branch-head CI: [run 43719986139](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43719986139), branch commit `c2e296767aa06a5ff9dd677ee9b030f161b08b4e`.

- Automated tests: 99 passed, 0 failed.
- Evidence Registry validation: passed; one warning remains for an intentionally unknown legal intake placeholder. It is not treated as a legal fact.
- Package integrity: passed; 146 tracked files match the 146 manifest paths.
- Secret-pattern scan: passed on the current branch-head CI; see run logs for the exact scan coverage.
- Source archive: generated from the pull-request merge candidate and compared with the package manifest (146/146). The current CI artifact is available until 15 December 2026; SHA-256 `03f36559622a3f4bc97fed2057e063844af9f1a91c377f2713d62e55fd442551`.
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

This file is a release-candidate note set. No GitHub Release or tag is published. The PR remains draft and unmerged; `main` is unchanged. Publication requires explicit owner approval after reviewing the stated limitations and confirming redistribution rights.
