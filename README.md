# DUMRAUF — Business Intelligence & Management Systems

**DUMRAUF Intelligence** is a provider-neutral professional AI platform for business management, with its initial expertise rooted in the HoReCa sector. It combines restaurant management methodology, finance, people/labor, menu economics, guest experience, operations and evidence-governed reasoning.

## Canonical package structure

- `assistant/` — identity, system instructions, behavior policy and conversation starters.
- `knowledge/` — professional knowledge by domain plus the traceable evidence registry (`knowledge/evidence/`).
- `skills/` — reusable analysis and operating workflows.
- `tools/` — deterministic calculators, spreadsheet-analysis boundaries and API integration boundaries.
- `memory/` — tenant-isolated establishment and manager profile schemas and memory policy.
- `providers/` — ChatGPT and Claude adapter templates.
- `evals/` — reasoning and evidence quality cases.
- `docs/` — architecture, stage status, Russian user guide and release/security checklists.
- `src/` — executable deterministic source modules.
- `tests/` — automated tests.

## Закрытый пользовательский пилот

Инструкция для первых тестировщиков: [Пилот DUMRAUF на друзьях — подключение, сценарии и фиксация ошибок](docs/PILOT_FRIENDS_GUIDE_RU.md). Для установки в ChatGPT Project используйте отдельный приватный Project на каждого участника и девять файлов из `providers/chatgpt/knowledge-pack/`.

## Stage status — canonical summary

| Stage | Capability | Engineering status | Important boundary |
|---:|---|---|---|
| 1 | Identity and behavior | Integrated | Instructions and policy are package assets, not a deployed assistant |
| 2 | HoReCa management methodology | Integrated foundation | Not every sector or jurisdiction is fully covered |
| 3 | Knowledge, skills and calculators | Integrated foundation | Knowledge depth and source review vary by domain |
| 4 | Intelligence Engine | Integrated foundation | Deterministic structure; host model provides narrative reasoning |
| 5 | Evidence Registry | Integrated | Registry validation does not certify legal applicability |
| 6 | Runtime and integration boundary | Integrated foundation + structured knowledge capture | Host must supply authentication, extraction, persistent storage and production controls |
| 7 | Knowledge retrieval and expert context | Integrated | Lexical retrieval and applicability controls; no automatic conflict resolution |
| 8 | Management workflow | Integrated | Approval-gated task lifecycle; no external task execution by itself |
| 9 | Hybrid retrieval | Integrated reference implementation | Embeddings are injected; vector index is in-memory, not production storage |
| 10 | Semantic ranking and conflict intelligence | Integrated adapter contracts | No production model is bundled; conflicts require human review |
| 11 | HoReCa knowledge structure | Foundation integrated; validation open | Operational content, calculations and sector branches need expert review |
| 12 | Expert Intelligence | Initial single-core integration | One core at `src/intelligence/engine.js`; not proof every diagnosis is correct |
| 13 | Quality & Evaluation | Engineering framework closed | Golden benchmark is a regression fixture, not professional-quality certification |
| 14 | Final Integration & Release | Engineering integration substantially complete; release open | Artifact verification, secret/private-data clearance and explicit approval remain |

The detailed acceptance record is maintained in [Stage integration](docs/stage-integration.md). Stage 11 remains open and must not be marked complete by Stage 14.

## Expert Intelligence Core — Stage 12

`src/intelligence/engine.js` is the **single expert-analysis control plane**. Its `buildExpertAnalysis` entry point coordinates existing retrieval and evidence modules, decision-input sufficiency, fact and calculation lineage, causal hypotheses, sourced financial scenario comparison and recommendation integrity. No second expert engine is maintained.

The retrieval layer remains responsible for applicable knowledge ranking, evidence-registry joining and explicit conflict reporting. The evidence adapter remains responsible for registry eligibility. Existing finance calculators remain the source of deterministic ratio formulas. The workflow module remains responsible for approval-gated tasks and outcome verification. The expert core coordinates these capabilities rather than duplicating them.

Undeclared input requirements are `not_assessed`, not sufficient. Missing values remain missing. Financial deltas are calculated only on matching metric, definition, scope, period, currency and unit with source lineage; direction is not automatically favourable or unfavourable. Causal links remain hypotheses. See `docs/stage-12-expert-intelligence.md`.

## Management Workflow (Stage 8)

The `src/workflow/` module implements analysis-gated action planning, controlled task lifecycle and evidence-backed outcome verification. Optional embedding, reranking and semantic-conflict adapters are exposed without binding STEN to a vendor. See `docs/management-cycle.md`.

## Knowledge Retrieval & Expert Context (Stage 7)

`src/retrieval/` provides deterministic lexical ranking, conservative establishment-profile applicability checks, Evidence Registry joining and explicit conflict reporting. It does not infer legal applicability or silently resolve source conflicts. See `docs/retrieval-context.md`.

## Runtime layer (Stage 6)

A provider-neutral runtime foundation is available in `src/runtime/`. It injects provider, tool, memory, audit and approval-ledger adapters; requires tenant identity and host-granted per-call permissions; and provides a bounded provider/tool loop with human-approval pause/resume. The included memory, audit and approval-ledger adapters are development/test implementations only. Durable approvals, pending-run persistence, authentication and downstream idempotency remain host responsibilities. See `docs/runtime-integration.md` before connecting a host application.

## Continuous Restaurant Memory — Stages 6, 11 and 12

STEN is designed to learn a restaurant's changing local context during normal work; completing a profile is optional. The structured capture boundary supports conservative silent capture of explicit, low-risk and unambiguous user assertions, preserves provenance and validity dates, deduplicates repeats, and keeps conflicting versions for human review. It does not promote local facts into universal methodology or approved standards.

The capture module currently runs against the injected development/test memory adapter. It does not provide durable cross-session storage or automatic extraction from raw conversations. See [Continuous Restaurant Memory](docs/continuous-restaurant-memory.md).

## Run locally

Requires Node.js 18+.

```bash
npm install
npm test
npm run validate:evidence
npm run validate:package
npm run scan:secrets
npm run package:source
```

## User installation guide\n\nFor end-user setup in ChatGPT Projects or Claude Projects, see [the Russian user guide](docs/USER_GUIDE_RU.md). The guide distinguishes project-based use from a live API/MCP deployment. Current release security limitations are recorded in [the security checklist](docs/SECURITY_RELEASE_CHECKLIST.md).\n\n## Evidence governance

The evidence layer distinguishes LAW, RESEARCH, CORE, INDUSTRY, PRACTICE, TREND, HYPOTHESIS and CONFIGURATION. The starter registry contains two STEN CORE principles, one anonymized historical practice record and one empty legal intake template. It contains **no verified current legal requirements or scientific findings**. Legal applicability is not automatically asserted; unknown profile data remain unknown.


## Spreadsheet & Document Engine

`src/spreadsheets/` provides XLSX generation/reading, formula-integrity validation against independent deterministic calculations, DOCX/PDF exports, Google Sheets API v4 operations and Yandex Disk XLSX upload. Google OAuth tokens and Yandex Disk OAuth tokens are injected by the trusted host at call time; no credentials are stored in the repository.

Yandex integration stores XLSX files on Yandex Disk for opening in Yandex Documents. It is not live cell-level synchronization. Arbitrary Excel formula execution is not claimed. See [Spreadsheet Engine](docs/spreadsheet-engine.md).

## Business Writing — management communication

The provider-neutral `src/writing/` module prepares source-linked briefs for memos, email replies, meeting minutes, weekly plans, manager tasks, team messages, guest responses and supplier letters. It builds natural-style generation instructions, checks draft claim references/placeholders/editorial boilerplate, and creates task drafts with explicit owner/deadline/result fields. Email sender preflight checks authentication and bulk-mail hygiene signals; it does not guarantee inbox placement. Actual text generation remains the responsibility of the host model, and human approval remains required. No email is sent and no external task is assigned. See [Business Writing](docs/business-writing.md).

## Legal information and free-use terms

STEN is currently offered free of charge for users' own internal professional and business operations. The original STEN materials are licensed under a **proprietary, non-exclusive, royalty-free internal-use license**; this is not an open-source license.

- [Terms of Use](TERMS_OF_USE.md)
- [License — original STEN materials](LICENSE)
- [User Disclaimer](DISCLAIMER.md)
- [Privacy and Data Notice](PRIVACY_NOTICE.md)
- [Legal publication checklist](LEGAL_DEPLOYMENT_CHECKLIST.md)

**Rightsholder of original components:** Думрауф Александр Сергеевич  
**Legal contact:** pocketshift.support@gmail.com

Resale, paid standalone redistribution and distribution of modified STEN versions require the rightsholder's prior written permission, subject to mandatory law and the rights GitHub grants for public repositories. Read section 4 of the Terms of Use for the public-repository/fork limitation.

The license applies only to components for which the rightsholder is entitled to grant rights. Third-party components remain subject to their own licenses. The repository remains a public experimental pilot; publication does not certify that every file has completed an ownership or legal audit.

## Important boundaries

This repository is a working core, not a deployed service. Provider adapters contain templates, not live integrations. There is no hosted memory store or production API. XLSX reading/writing is available as a library module; provider cloud connections still require host authentication and deployment. Legal content must be populated from current official sources for each jurisdiction and reviewed before operational use. The registry does not certify compliance.

**No source = no fact. Missing != zero.**

## Hybrid Retrieval (Stage 9)

Stage 9 adds provider-injected embedding execution, a dependency-free in-memory cosine vector index for tests/small workloads, and hybrid lexical+vector retrieval using Reciprocal Rank Fusion. The current index is ephemeral and is not a production vector database. A real embedding model and persistent vector service must be supplied by the host. See `docs/hybrid-retrieval.md` and `evals/retrieval-quality-cases.json`.

## Semantic Ranking & Conflict Intelligence (Stage 10)

Optional host-injected reranking can reorder existing retrieval candidates without losing their source metadata. Optional semantic conflict detection validates candidate source pairs, distinguishes contextual differences (such as jurisdiction or validity periods) from potential contradictions, and requires human review. No production model is bundled and no conflict is automatically resolved. See `docs/semantic-ranking-conflicts.md`.

## HoReCa Knowledge Structure (Stage 11)

Canonical sector/format taxonomy and cross-sector management domains live in `knowledge/taxonomy/`. The tenant-scoped establishment profile captures business model, service/channel/production, building and engineering context, finance, workforce and compliance references. Source intake and applicability rules preserve jurisdiction, validity, provenance and unknowns. Defined taxonomy is not a claim that every domain or jurisdiction has a complete reviewed corpus.

**Stage 11 closeout remains open.** The restaurant process catalog, sector-specific knowledge and practical answer correctness have not passed substantive validation. New specialist methodology covers kitchen staffing by section and interval and end-to-end menu engineering, with a deterministic workload calculator, retrieval nodes and provisional specialist cases. These methods still require real-site standards and expert adjudication. See `docs/stage-11-validation.md`, `docs/stage-11-kitchen-workforce-planning.md` and `docs/stage-11-menu-engineering.md`.

## Quality & Evaluation — Stage 13

The existing `src/evaluation/knowledge-quality.js` provides metadata integrity checks, retrieval ranking metrics and answer-evidence integrity checks. Eight labelled HoReCa golden cases run against the operational graph. The current tuned lexical ranker measures Precision@10 36.25%, Recall@10 92.92%, MRR 1.00 and nDCG@10 93.65%; the pinned nDCG baseline is 93.36%. These are retrieval regression metrics on a small curated set, not a general accuracy score or expert certification. See `docs/stage-13-quality-evaluation.md`.

## Final Integration & Release — Stage 14

Stage 14 engineering integration is substantially complete. The latest verified release-candidate CI run [43765995720](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43765995720) passed on commit `f13535c528b3d17b5ae4bd687a875d84b6d9a80e`: 99/99 tests, Evidence Registry validation, package integrity, secret scan and source archive generation. The manifest contains 147/147 tracked paths. A Russian pilot test plan is included.

The package remains a **working core**, not a published release. ChatGPT and Claude adapters are templates; the ChatGPT API host is a placeholder with no actions, and Claude MCP configuration is empty. Memory and audit are in-memory development/test adapters. No live provider connection, production API, persistent vector database, hosted memory or production authentication is included.

Release preparation now includes a high-confidence secret-pattern scan, a manifest-verified source-archive generator and a CI artifact for review. A Russian pilot test plan is included so the owner can start user acceptance testing in a ChatGPT Project. These checks do not replace manual review of private operational/personal data or Git history. The final artifact must be generated from the approved release commit. GitHub Release publication still requires explicit owner approval. Stage 11 substantive knowledge validation remains open. See [Stage 14 release audit](docs/stage-14-final-integration-release.md).


## ChatGPT Project knowledge pack

A curated 9-file Markdown pack is maintained in `providers/chatgpt/knowledge-pack/` to fit a 25-file project attachment ceiling with room for the separate project instructions and future additions. See its README for the exact upload order. The source repository retains its full canonical files, code, tests and evidence registry; the pack is a compact provider export, not a replacement.


## Единый источник ChatGPT-плагина

Исходники текущего ChatGPT-плагина хранятся в `providers/chatgpt/plugin-source/`. Не редактируйте установленный плагин напрямую. Сборка воспроизводимого архива выполняется командой `npm run build:chatgpt-plugin`; CI проверяет и публикует архив как артефакт сборки. Архитектура и порядок выпуска: [единый источник DUMRAUF Intelligence](docs/CHATGPT_PLUGIN_SINGLE_SOURCE_RU.md).
