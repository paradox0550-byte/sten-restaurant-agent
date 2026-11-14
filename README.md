# STEN — Restaurant Management Intelligence

**STEN** is a provider-neutral professional AI expert package for the full HoReCa sector. It combines restaurant management methodology, finance, people/labor, menu economics, guest experience, operations and evidence-governed reasoning.

## Canonical package structure

- `assistant/` — identity, system instructions, behavior policy and conversation starters.
- `knowledge/` — professional knowledge by domain plus the traceable evidence registry (`knowledge/evidence/`).
- `skills/` — reusable analysis and operating workflows.
- `tools/` — deterministic calculators, spreadsheet-analysis boundaries and API integration boundaries.
- `memory/` — tenant-isolated establishment and manager profile schemas and memory policy.
- `providers/` — ChatGPT and Claude adapter templates.
- `evals/` — reasoning and evidence quality cases.
- `docs/` — architecture and stage integration.
- `src/` — executable deterministic source modules.
- `tests/` — automated tests.

## Expert Intelligence Core — Stage 12

`src/intelligence/engine.js` is the **single expert-analysis control plane**. Its `buildExpertAnalysis` entry point coordinates existing retrieval and evidence modules, decision-input sufficiency, fact and calculation lineage, causal hypotheses, sourced financial scenario comparison and recommendation integrity. No second expert engine is maintained.

The retrieval layer remains responsible for applicable knowledge ranking, evidence-registry joining and explicit conflict reporting. The evidence adapter remains responsible for registry eligibility. Existing finance calculators remain the source of deterministic ratio formulas. The workflow module remains responsible for approval-gated tasks and outcome verification. The expert core coordinates these capabilities rather than duplicating them.

Undeclared input requirements are `not_assessed`, not sufficient. Missing values remain missing. Financial deltas are calculated only on matching metric, definition, scope, period, currency and unit with source lineage; direction is not automatically favourable or unfavourable. Causal links remain hypotheses. See `docs/stage-12-expert-intelligence.md`.

## Management Workflow (Stage 8)

The src/workflow module implements analysis-gated action planning, controlled task lifecycle and evidence-backed outcome verification. Optional embedding, reranking and semantic-conflict adapters are exposed without binding STEN to a vendor. See docs/management-cycle.md.

## Knowledge Retrieval & Expert Context (Stage 7)

`src/retrieval/` provides deterministic lexical ranking, conservative establishment-profile applicability checks, Evidence Registry joining and explicit conflict reporting. It does not infer legal applicability or silently resolve source conflicts. See `docs/retrieval-context.md`.

## Runtime layer (Stage 6)

A provider-neutral runtime foundation is available in `src/runtime/`. It injects provider, tool, memory and audit adapters; requires tenant identity; and gates every tool call behind explicit host-granted permissions. The included memory and audit adapters are development/test implementations only. See `docs/runtime-integration.md` before connecting a host application.

## Run locally

Requires Node.js 18+.

```bash
npm test
npm run validate:evidence
```

## Evidence governance

The evidence layer distinguishes LAW, RESEARCH, CORE, INDUSTRY, PRACTICE, TREND, HYPOTHESIS and CONFIGURATION. The starter registry contains two STEN CORE principles, one anonymized historical practice record and one empty legal intake template. It contains **no verified current legal requirements or scientific findings**. Legal applicability is not automatically asserted; unknown profile data remain unknown.

## Important boundaries

This repository is a working core, not a deployed service. Provider adapters contain templates, not live integrations. There is no hosted memory store, production API or XLSX parser. Legal content must be populated from current official sources for each jurisdiction and reviewed before operational use. The registry does not certify compliance.

**No source = no fact. Missing != zero.**

## Hybrid Retrieval (Stage 9)

Stage 9 adds provider-injected embedding execution, a dependency-free in-memory cosine vector index for tests/small workloads, and hybrid lexical+vector retrieval using Reciprocal Rank Fusion. The current index is ephemeral and is not a production vector database. A real embedding model and persistent vector service must be supplied by the host. See `docs/hybrid-retrieval.md` and `evals/retrieval-quality-cases.json`.

## Semantic Ranking & Conflict Intelligence (Stage 10)

Optional host-injected reranking can reorder existing retrieval candidates without losing their source metadata. Optional semantic conflict detection validates candidate source pairs, distinguishes contextual differences (such as jurisdiction or validity periods) from potential contradictions, and requires human review. No production model is bundled and no conflict is automatically resolved. See `docs/semantic-ranking-conflicts.md`.

## HoReCa Knowledge Structure (Stage 11)

Canonical sector/format taxonomy and cross-sector management domains live in `knowledge/taxonomy/`. The tenant-scoped establishment profile captures business model, service/channel/production, building and engineering context, finance, workforce and compliance references. Source intake and applicability rules preserve jurisdiction, validity, provenance and unknowns. Defined taxonomy is not a claim that every domain or jurisdiction has a complete reviewed corpus.


## Quality & Evaluation — Stage 13

The existing `src/evaluation/knowledge-quality.js` provides metadata integrity checks plus retrieval ranking metrics and answer-evidence integrity checks. Eight labelled HoReCa golden cases are stored in `evals/stage-13-golden-cases.json`. Automated tests validate the metrics and case contracts; live retrieval baselines and expert-reviewed answer quality remain to be measured.

**Stage 11 closeout remains open.** The taxonomy and graph foundation is integrated, but the restaurant process catalog, sector-specific knowledge and practical answer correctness have not passed substantive validation. See `docs/stage-11-validation.md`.
