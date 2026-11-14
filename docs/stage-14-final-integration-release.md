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
- Package scripts: `npm test`, `npm run validate:evidence`.
- Tracked tree: 135 files.
- `package-manifest.json`: 125 listed paths before Stage 14 reconciliation; ten tracked paths were missing from the manifest.
- No GitHub Release is currently published.
- No live provider SDK, production API, hosted memory, production authentication, persistent vector database or production embedding provider is claimed by the package manifest/README.

### Stage map

- Stages 1–10: integrated foundations and capabilities, subject to their documented production limitations.
- Stage 11: knowledge structure integrated; substantive content validation remains open.
- Stage 12: initial single-core expert orchestration integrated.
- Stage 13: evaluation engineering framework integrated; expert-adjudicated answer quality remains open.
- Stage 14: current final integration and release work; not closed.

### CI baseline and regression

Latest inspected run: [STEN CI #77](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43604092049), commit `97bfaf48c71fb39ef63b2e4f1efe9ea456b9c98e`.

- Result: failure.
- Test suite: 88 passed, 1 failed out of 89.
- Failing test: `Stage 13 runs golden queries through the actual lexical retrieval ranker`.
- Failure: retrieved ID order differs from `evals/stage-13-retrieval-baseline.json` after graph enrichment. New schedule/payroll/safety/process nodes enter the top 10 and displace/reorder prior results in multiple cases.
- This is a retrieval-ranking regression signal, not a test infrastructure failure.
- Required action: inspect the changed graph nodes and ranking behaviour case by case; decide whether the ranking is genuinely better, worse or mixed. Only then adjust ranking/metadata or deliberately version the baseline with a documented rationale. Do not simply replace the expected arrays.

### Documentation drift

- `docs/stage-integration.md` describes Stages 9–13.
- `docs/architecture.md` previously stopped at Stage 8.
- `README.md` describes much of the later work but does not provide one consolidated release-status map.
- `package-manifest.json` stage metadata previously stopped at Stage 11.
- Provider configuration files exist for ChatGPT and Claude; their actual host setup and limitations must be verified against current provider documentation and schemas.

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

- [ ] README, architecture, stage integration and package manifest agree.
- [ ] Stage status is accurate; Stage 11 is visibly still open.
- [ ] Manifest contains all intended tracked package files and no missing paths.
- [ ] ChatGPT provider schema/instructions are internally consistent.
- [ ] Claude provider configuration/instructions are internally consistent.
- [ ] Tenant, memory, audit and tool-permission boundaries reviewed.
- [ ] No secrets or private operational data included in the distributable package.
- [ ] Stage 13 retrieval ranking regression investigated and disposition documented.
- [ ] `npm test` passes.
- [ ] `npm run validate:evidence` passes.
- [ ] Manifest-path CI check passes.
- [ ] Release artifact and release notes are reproducible and accurate.
- [ ] Final CI is green on the exact release commit.
- [ ] Release readiness is explicitly approved before publication.

## Current status

**Stage 14 is in progress.** The baseline inventory and release gates are recorded. The current main branch is not release-ready while CI is failing and provider/security/package checks remain incomplete.
