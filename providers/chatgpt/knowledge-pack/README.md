# STEN — ChatGPT Knowledge Pack

**Purpose:** a compact, curated knowledge set for a ChatGPT Project.  
**Upload target:** 9 Markdown files in this folder, plus the separate Project instruction file if the interface has a separate instruction field. This stays comfortably below a 25-file attachment ceiling.

## Upload order

1. `01-core-rules-and-evidence.md` — identity, evidence, memory and decision boundaries.
2. `02-restaurant-management-and-shift.md` — management cycle, situational leadership, manager of shift and bartender role.
3. `03-guest-service-and-recovery.md` — service lifecycle, selling, guest communication and complaints.
4. `04-food-safety-haccp-marking.md` — product adjacency, marking, boards, knives, cleaning inventory and chemicals.
5. `05-iiko-stock-and-calculator-audit.md` — integrated inventory and recipe-costing control framework.
6. `06-menu-engineering-and-kitchen-workforce.md` — menu economics and workload-based kitchen staffing.
7. `07-finance-payroll-and-labor.md` — P&L, cost definitions, payroll, advances, schedules and productivity.
8. `08-operational-audit-and-checklists.md` — audits, corrective actions, handovers, evidence and verification.
9. `09-stage-11-scope-and-validation.md` — Stage 11 coverage, source register, limitations and closeout gates.

## Connect the pack to a ChatGPT Project

1. Create a dedicated Project for one restaurant or one clearly defined tenant.
2. Paste the contents of ../project-instructions-ru.md into the Project's separate instruction field.
3. Upload exactly the nine Markdown files listed above as Project knowledge.
4. Confirm that all nine filenames are present and that the instructions were saved.
5. Start a new chat inside that Project and test the evidence rules with a small, non-sensitive source file.

The Project instruction file is not a tenth knowledge attachment. The manifest and this README are maintenance documents; they are not required Project uploads.

A path or filename mentioned in Project instructions does not grant the Project access to that GitHub file. ChatGPT Projects do not execute this repository's JavaScript modules or automatically connect GitHub, POS, iiko, MCP, APIs, persistent tenant memory or the source registry.

## Consolidation rules

- These files consolidate knowledge for retrieval; the original source files remain in the repository and are not deleted.
- Source-specific practices are not automatically universal standards.
- Legal and sanitary claims from training/checklist materials are not treated as current law until checked against the official act and the actual establishment.
- The 2025 guest-service standard is marked as internal/confidential source material for the named restaurants.
- The service book upload contains only a cover and short outline in the supplied file; it is not treated as a complete book.
- If a fact is missing, report it as unknown. Do not fill it with zero or a generic benchmark.

## Release and consistency checks

Before publishing an updated pack, verify all of the following together:
- the nine filenames in this README match knowledge-manifest.yaml;
- the nine files exist in this directory and are Markdown;
- project-instructions-ru.md describes the same nine-file upload process;
- docs/USER_GUIDE_RU.md does not prescribe a competing list of individual source files;
- financial, legal and operational claims remain aligned with their canonical sources;
- source-specific scope, confidentiality and unresolved validation status are preserved.

## Canonical repository sources

This pack is a provider-oriented derivative. The canonical detailed methods, schemas, calculations, source registry, tests and evaluation cases remain in their original repository paths. Update the pack when those canonical sources change; do not edit only the pack and leave the canonical method stale.


## User-friendly connection instructions

The full Russian, non-technical, 14-step connection algorithm is maintained at [docs/CONNECTION_ALGORITHM_RU.md](../../../docs/CONNECTION_ALGORITHM_RU.md). It includes direct links to each of the nine knowledge files, the separate Project instruction file, a first-chat smoke test and troubleshooting.

GitHub account registration is not required to open or download files from this public repository. A ChatGPT account is required to create a Project. Check the current per-project file limit before installation: the nine-file pack requires a plan with at least nine project file slots; the current OpenAI Help Center lists 5 for Free and 25 for Go/Plus. Do not silently omit files and describe a partial upload as a complete STEN setup.


## Intellectual-property and distribution boundary

Only STEN-authored methods belong in the user-facing pack. Private expert materials, source names, author/company identifiers, original filenames, email locators and provenance records must remain in the restricted research vault and must never be included in tenant context or package exports. See docs/private-research-vault-and-product-knowledge.md.
