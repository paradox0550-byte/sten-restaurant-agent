# GitHub → ChatGPT coverage map (repository main, 2026-11-23)

## Transferred in plugin 0.3.1

| Canonical source | Plugin destination | Transfer status |
|---|---|---|
| `providers/chatgpt/knowledge-pack/01-core-rules-and-evidence.md` | `DUMRAUF-core-knowledge/references/01-core-rules-and-evidence.md` | Full file copy |
| `02-restaurant-management-and-shift.md` | matching reference | Full file copy |
| `03-guest-service-and-recovery.md` | matching reference | Full file copy |
| `04-food-safety-haccp-marking.md` | matching reference | Full file copy |
| `05-iiko-stock-and-calculator-audit.md` | matching reference | Full file copy |
| `06-menu-engineering-and-kitchen-workforce.md` | matching reference | Full file copy |
| `07-finance-payroll-and-labor.md` | matching reference | Full file copy |
| `08-operational-audit-and-checklists.md` | matching reference | Full file copy |
| `09-stage-11-scope-and-validation.md` | matching reference | Full file copy |
| `providers/chatgpt/project-instructions-ru.md` | `references/project-instructions-ru.md` | Full file copy |
| `providers/chatgpt/knowledge-pack/README.md` | `references/knowledge-pack-README.md` | Full file copy |

## Repository capabilities not transferred as executable behavior

- `src/finance`, `src/labor`, `src/menu`, `src/spreadsheets`, `src/retrieval`, `src/evidence`, `src/intelligence`, `src/workflow`, `src/runtime`, and `src/writing` are JavaScript modules. The plugin package does not execute them. The skill gives procedural guidance; calculations are performed by the host model/data-analysis capability unless a real tool integration is separately connected.
- `tests/` and `evals/` are engineering/regression assets, not runtime knowledge. The plugin does not run the 157 GitHub tests.
- `knowledge/evidence/registry.json` is not included as a live governed Evidence Registry. The nine-file pack carries the user-facing principles and source limitations, not all evidence records or their review workflow.
- `knowledge/taxonomy/` and `knowledge/coverage/` are not fully mirrored. The 36 management domains are referenced as taxonomy scope, not a full executable graph.
- `docs/STAGE_11/PROCESS_CARDS/` contains 77 individual files. They are not included in the compact user-facing nine-file pack. The master register reports 76/77 with individual draft methodology and card 04 blocked pending clarification of МБП. All 77 remain C: not approved SOPs, pending independent expert review, site pilot and signed reviewer sign-off.
- `providers/chatgpt/actions.openapi.yaml` is a template, not a deployed API. `src/runtime` is provider-neutral foundation code, not a connected ChatGPT runtime.
- Persistent tenant memory, production authentication/authorization, durable approval ledger, pending-run recovery, protected audit storage, production vector database and live iiko/bank/OFD connectors are not delivered by this plugin.

## Quality and evidence cautions

- Stage 11 substantive validation remains open. A drafted process card is not proof of a correct or legally applicable SOP.
- Stage 13 is an engineering evaluation framework. Its 8-case lexical retrieval baseline is a small curated regression set, not general answer accuracy or expert certification. The 12-case holdout labels are provisional and not expert-adjudicated.
- The knowledge pack itself warns that current law, sanitary requirements, labor rules, tax treatment and product applicability must be checked against official current sources for the specific jurisdiction and establishment.
- The repository's source of truth is GitHub `main`; the plugin's references are a versioned snapshot. They do not auto-update when GitHub changes.

## Next integration work

1. Create a full content inventory for the 36 domains and all 77 cards; select only approved, useful user-facing materials for transfer.
2. Decide whether to add domain-specific skills (finance, labor, menu, operations, root-cause) or keep routing through the current six skills. Avoid duplicate instructions.
3. Extract selected deterministic calculations into supported ChatGPT tools only where a real host/MCP implementation exists; otherwise retain transparent model calculations with independent checks.
4. Build and run provider-level test prompts for factual grounding, calculation integrity, restaurant context separation, legal applicability, missing-data handling and refusal to claim unavailable integrations.
5. Keep release versions pinned and repeat the transfer/read-back audit whenever the canonical GitHub pack changes.
