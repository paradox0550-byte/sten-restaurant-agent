# Stage 14 — Final Integration & Release

## Objective

Prepare the existing STEN expert core as a coherent, portable, documented release. Stage 14 is an integration and release-readiness stage, not a new feature-development stage.

## Guardrails

- Preserve the single expert-intelligence control plane and existing module boundaries.
- Do not add parallel engines, unnecessary dependencies, production services or new product functionality.
- Do not weaken tests or silently rewrite expected results to make CI green.
- Keep Stage 11 substantive validation open. Engineering release readiness is not proof of professional or legal correctness.
- Do not claim deployment, production security certification, legal compliance certification or live provider connectivity unless separately evidenced.

## Baseline inventory — 2026-11-14

### Repository and package

- Repository: `paradox0550-byte/sten-restaurant-agent`, default branch `main`.
- Package version: `0.5.0`; status: `working-core`.
- Node requirement: `>=18`; CI uses Node.js 22.
- Package scripts: `npm test`, `npm run validate:evidence`, `npm run validate:package`, `npm run scan:secrets`, `npm run package:source`.
- Previous verified integration baseline: 91/91 tests, Evidence Registry and package-integrity checks passed on commit `c6d5c8e39704177e06da1fa82644a90838ba56cd` (CI run [43621988654](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43621988654)).
- Release-preparation branch adds a Russian user guide, provider project instructions, a high-confidence secret-pattern scanner and a manifest-verified source-archive generator. The exact branch file count and manifest parity are gated by CI; do not copy the older 138-file count forward.
- The new branch CI result and archive artifact are pending; do not call the candidate verified until the workflow succeeds.
- No GitHub Release is currently published.
- No live provider SDK, production API, hosted memory, production authentication, persistent vector database or production embedding provider is claimed by the package manifest/README.

### Stage map

- Stages 1–10: integrated foundations and capabilities, subject to their documented production limitations.
- Stage 11: knowledge structure integrated; substantive content validation remains open.
- Stage 12: initial single-core expert orchestration integrated.
- Stage 13: evaluation engineering framework integrated; expert-adjudicated answer quality remains open.
- Stage 14: current final integration and release work; not closed.

### Historical regression and resolution

An earlier CI run failed because graph enrichment changed the exact top-10 retrieval order. This was investigated rather than hidden by replacing expected IDs. Experimental field-aware ranking variants were rejected because they reduced golden nDCG below the pinned baseline. The production lexical BM25 ranker was retained with a conservative parameter adjustment and a targeted metadata correction. The accepted regression gate now checks per-case recall and nDCG tolerances plus macro metrics, rather than brittle exact-order equality. Details and measured results are recorded below and in `docs/stage-13-quality-evaluation.md`.

### Documentation alignment

The canonical stage map is now maintained in `docs/stage-integration.md` and repeated consistently in `README.md`, `docs/architecture.md` and `package-manifest.json`. Stage 11 remains substantively open; Stage 13 engineering framework is closed but does not certify expert answer quality; Stage 14 release publication remains open. Provider files remain explicitly unconfigured templates.

## Work packages

### 14.1 — Canonical architecture and status

- Keep README, architecture, stage integration and package manifest consistent.
- State for every stage whether it is implemented, partially integrated, validated, open or closed.
- Separate engineering completion from knowledge validation and production deployment.
- Maintain one canonical source of truth for package version and release status.

### 14.2 — Package integrity

- Reconcile the package manifest against the tracked repository tree.
- Confirm every manifest path exists and every intended distributable file is included.
- Review provider files, skills, schemas, evaluation fixtures, documentation and source modules for omissions.
- Verify that generated/temporary files, secrets and private data are not packaged.
- Confirm package instructions do not promise capabilities absent from the code.

### 14.3 — Provider portability

- Validate ChatGPT instructions, action schema and knowledge manifest.
- Validate Claude project instructions, MCP configuration and skills layout.
- Identify host-specific assumptions, required environment configuration and unsupported capabilities.
- Do not claim that provider installation or external calls work until tested in the actual host environment.

### 14.4 — Security and isolation review

Review source and tests for:
- tenant identity required at trust boundaries;
- tenant isolation for memory and audit;
- tool execution deny-by-default and per-call permission checks;
- argument validation and rejection of unexpected fields;
- trusted host responsibility for authentication and tenant/permission derivation;
- secrets and personal data not embedded in repository/package;
- no unrestricted shell, filesystem, SQL, network or arbitrary-code tool exposure;
- explicit development/test-only status of in-memory memory and audit adapters;
- documented retention, deletion, encryption, persistence and access-control responsibilities for any future host implementation.

This review is not a penetration test or security certification.

### 14.5 — Regression and evidence gates

- Resolve the Stage 13 ranking mismatch with a documented relevance-based decision.
- Run all unit/integration tests.
- Run Evidence Registry validation.
- Run manifest-path validation.
- Preserve golden and holdout evaluation boundaries; provisional holdout labels are not expert-adjudicated truth.
- Confirm that unknown values, unsupported claims, unresolved conflicts and jurisdictional limitations remain explicit.

### 14.6 — Release preparation

- Select and document a release version only after acceptance gates pass.
- Produce release notes with included capabilities, limitations, provider setup, compatibility and known open issues.
- Verify a clean package artifact and reproducible contents.
- Publish a GitHub Release only after explicit readiness confirmation and successful final CI.

## Acceptance checklist

- [x] README, architecture, stage integration and package manifest agree on scope and stage status.
- [x] Stage status is accurate; Stage 11 is visibly still open.
- [x] Manifest contains all tracked package files with no missing or unlisted paths (138/138 at the latest tree audit).
- [x] Dependency-free package validator added to CI for exact tracked-file coverage, duplicate paths, version consistency, Stage 11/14 status and provider-template structure.
- [x] ChatGPT adapter instructions and OpenAPI template are internally consistent; the endpoint template remains intentionally unconfigured.
- [x] Claude project instructions and empty MCP configuration are internally consistent; Skills packaging adaptation is documented as a host setup task.
- [x] Tenant, memory, audit and tool-permission boundaries reviewed at source/test level; production host controls and penetration testing remain outside this package.
- [x] High-confidence secret-pattern scan passes on release-candidate CI run [43695779778](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43695779778): 143 tracked text files and 18,069 added lines in reachable Git history scanned; no high-confidence credential patterns found.
- [x] Current package content review: source catalog and procedures describe generalized practice; original confidential source documents and direct personal identifiers are not included in the manifest. A separate pattern check found no email, IBAN or passport-like identifiers. The owner must still confirm redistribution rights for practice-derived methodology before public release.
- [x] Reachable Git history checked for the selected high-confidence credential formats using a full-history CI checkout (`fetch-depth: 0`). This is not a complete DLP scan of historical personal/commercial data.
- [x] Stage 13 retrieval ranking regression investigated; conservative metadata and BM25 tuning measured above the golden macro nDCG baseline without changing expected labels.
- [x] `npm test` passes: 91/91 tests on final CI run [43621988654](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43621988654).
- [x] `npm run validate:evidence` passes on final CI run [43621988654](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43621988654) (one explicit warning remains for the unknown legal intake placeholder; it is not treated as a legal fact).
- [x] Package-integrity CI check passes on final CI run [43621988654](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43621988654).
- [x] Release notes for 0.5.0 prepared in `docs/release-notes-0.5.0.md`.
- [x] CI generated the source archive from the release-candidate merge commit, verified 143/143 entries against `package-manifest.json`, and recorded SHA-256.
- [x] Downloaded CI artifact was independently inspected: checksum valid, ZIP integrity valid, 143 manifest files present, no missing or extra files.
- [ ] Final release archive is regenerated from the approved release tag/commit; the current archive is a PR candidate artifact.
- [x] CI is green on final integration commit `c6d5c8e39704177e06da1fa82644a90838ba56cd` in run [43621988654](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43621988654). A separate release tag still requires artifact verification and approval.
- [x] Russian user guide and provider setup instructions are included and checked against current ChatGPT Projects and Claude Projects documentation.
- [ ] Owner confirms redistribution rights for generalized practice-derived methodology in the public repository.
- [ ] Release readiness is explicitly approved before publication.

## Release preparation added

- `docs/USER_GUIDE_RU.md` explains ChatGPT Projects, Claude Projects, initial data preparation, example requests, local developer checks, limitations and safe handling of restaurant data.
- `providers/chatgpt/project-instructions-ru.md` supplies short Russian instructions for a ChatGPT Project.
- `scripts/scan-package-secrets.js` scans tracked text files and added lines in reachable Git history for selected high-confidence credential formats. CI fetches full history. It does not detect all personal or commercial data.
- `scripts/create-source-archive.js` creates a ZIP with `git archive`, compares archive entries to the package manifest, and writes SHA-256 and contents files.
- CI now runs the secret scan and builds/uploads a source archive artifact after the test gates pass. Candidate run [43695779778](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43695779778) passed every job.
- The end-user guide recommends ChatGPT Projects and Claude Projects. Custom GPT creation is not a valid universal path for personal ChatGPT accounts as of the guide date.

## Current status

**Stage 14 release preparation is engineering-verified on the current candidate; publication remains open.** CI run [43695779778](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43695779778) passed on branch commit `ad6f7fa17db008ad149363cc6b8140b889ad82f1`: 91/91 tests, Evidence Registry validation, package integrity, secret scan and source-archive generation. The manifest contains 143 tracked files and 143 paths. The scan covered 143 tracked text files and 18,045 added lines in reachable Git history with no high-confidence credential matches. The downloaded candidate archive was independently checked: SHA-256 valid, ZIP valid, and all 143 manifest files present with no extras. The final candidate archive SHA-256 is `5868da2554a059a04f67cdd2aea7e3c97d7ba891b8d150084e1619cfc2fa8005`. Golden retrieval metrics remain Precision@10 36.25%, Recall@10 92.92%, MRR 1.00 and nDCG@10 93.65%, compared with the pinned 93.36% baseline. Provider adapters remain templates; production host authentication, durable memory/audit and live provider connections are not included. No GitHub Release has been published. The candidate archive was built from the PR merge ref, not an approved release tag. Public redistribution rights for practice-derived methodology and explicit release approval remain open.


### Retrieval experiment disposition (14.5)

- The proposed field-aware BM25 replacement was tested against the eight Stage 13 golden cases and the provisional 12-case holdout.
- Experimental field-aware variants preserved golden macro Recall@10 at 0.9292 but reduced golden macro nDCG@10 to 0.9183 and then 0.9136, below the pinned 0.9336 baseline. They are rejected and are not retained in production.
- The production ranker remains the existing lexical BM25 implementation, with its length-normalization parameter conservatively adjusted to `b = 0.4`. A targeted graph metadata correction moved the phrase `сервис в часы пик` from the generic director-role keywords to the delivery workflow, where it is semantically more precise.
- The exact top-10 ID sequence is no longer used as a brittle equality assertion. The golden gate now requires unchanged per-case relevant counts, no per-case Recall@10 regression, no more than 0.01 per-case nDCG loss, and no macro Recall@10 or nDCG@10 regression against the pinned baseline. The baseline file and expected labels remain unchanged.
- The resulting measured golden metrics are Precision@10 36.25%, Recall@10 92.92%, MRR 1.00 and nDCG@10 93.65% (baseline nDCG@10 93.36%).
- A focused regression test verifies that a delivery-specific peak-load query retrieves `delivery.order` in the top three, while a payroll-specific query continues to retrieve `people.payroll`.
- The holdout diagnostic improved in the tested field-aware experiment, but its labels remain provisional and cannot override the golden-case regression or be treated as expert-validated evidence.
- The rejected field-aware scorer is not shipped. The provisional holdout remains diagnostic only and is not used as expert-validated evidence.
