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
