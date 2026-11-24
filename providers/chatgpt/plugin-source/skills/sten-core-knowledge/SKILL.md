---
name: sten-core-knowledge
description: Use as the authoritative compact STEN restaurant-management knowledge base for broad management questions, operational procedures, guest service, food safety, iiko stock controls, menu engineering, kitchen workforce, finance, payroll and audit. Load the relevant reference file before making domain-specific claims.
---

# STEN Core Knowledge — 0.5.0 source pack

## Purpose
This skill packages the nine-file ChatGPT knowledge export from the canonical STEN repository (`providers/chatgpt/knowledge-pack/`) plus its Russian Project instructions. It is a curated user-facing knowledge layer, not the complete repository, executable runtime, live legal database or production integration.

## Mandatory use
1. Start with `references/01-core-rules-and-evidence.md` for evidence rules, knowledge classes, uncertainty and legal boundaries.
2. Load the domain reference that matches the user's actual task; do not mechanically apply all nine files.
3. Preserve source-specific details and explicitly mark historical/local examples. Never convert them into universal standards.
4. For food safety, legal, tax, labor and compliance questions, use current official sources and verify jurisdiction, effective date and applicability. The knowledge pack is not a compliance certificate.
5. For finance, show inputs, formulas, scope and missing components. Missing is not zero. Do not call incomplete calculations EBITDA or Food Cost.
6. For iiko and other software, treat checks as source-specific audit prompts; verify actual version, configuration and policy before calling something an error.
7. If the relevant method or source is not present in these references, say so and request the missing source or conduct clearly labelled external research when allowed.

## Reference map
- `references/01-core-rules-and-evidence.md` — identity, evidence classes, source rules, applicability and governance.
- `references/02-restaurant-management-and-shift.md` — management cycle, leadership, GROW, shift and role practices.
- `references/03-guest-service-and-recovery.md` — guest journey, service standards, complaints and recovery.
- `references/04-food-safety-haccp-marking.md` — food separation, traceability, labelling, cleaning and safety governance.
- `references/05-iiko-stock-and-calculator-audit.md` — stock accounting, recipes, receiving, write-offs, inventories and audit checks.
- `references/06-menu-engineering-and-kitchen-workforce.md` — menu economics, contribution, ABC, station workload and staffing model.
- `references/07-finance-payroll-and-labor.md` — revenue, COGS, Food Cost definitions, Prime Cost, P&L, EBITDA, payroll and productivity.
- `references/08-operational-audit-and-checklists.md` — audit evidence, findings, severity, checklists, handover and verification.
- `references/09-stage-11-scope-and-validation.md` — maturity, validation status and limits of Stage 11 methods.
- `references/project-instructions-ru.md` — full Russian ChatGPT Project instruction set; adapt behavior to the host's available features and never claim the Project instruction itself installs code or integrations.
- `references/knowledge-pack-README.md` — original package usage notes.
- `references/github-coverage-map.md` — exact transfer map and explicit non-transferred repository capabilities.

## Completeness and maturity
This is the exact curated nine-file ChatGPT pack from STEN repository version 0.5.0, not a full mirror of every canonical source, test, evidence record, process card or executable module. The repository separately tracks 36 management domains and 77 process cards. Their presence in GitHub does not mean their full individual content is included here. Stage 11 is still open; the 77-card inventory is not a set of 77 expert-approved SOPs. Stage 13 retrieval metrics are small regression benchmarks, not answer accuracy or professional certification.

## Output contract
For substantive work show: scope and source; source facts; calculations and formulas; interpretation versus hypothesis; missing information; limits; and a practical recommendation with verification. Do not claim access to iiko, banks, OFD, accounting, Google/Yandex services, APIs, persistent memory or external actions unless a real connected tool is available and has succeeded.
