# Operational HoReCa Knowledge Graph — Stage 11 extension

## Purpose

The graph is not a folder tree and not a document index. It is a source-grounded directed multigraph: concepts and processes can have several parents, and cross-domain links connect management, service, people, finance, production, safety and audit.

## Initial source set

See `knowledge/graph/sources.json`. It records six source materials available in the working session:
- appearance standards training (DOCX);
- operational management training (20-slide PPTX);
- director calendar (XLSX, three sheets);
- business-process audit model (XLSX, one sheet, 336 rows);
- guest service standard (2025 PDF, 43 pages);
- restaurant operating regulation (DOC, historical/company-specific).

The last two files were present in the working workspace in addition to the four explicitly uploaded in the current exchange. Their generalized concepts are included; proprietary identifiers and personal data are not.

## Graph model

- `nodes` are reusable concepts, roles, processes, controls and artifacts.
- `edges` use explicit relation types such as `decomposes_into`, `cross_links`, `supports`, `feeds`, `verified_by` and `may_trigger`.
- `source_links` connect each source to the nodes it actually supports.
- Multiple incoming edges are intentional. For example, staff appearance links to training, guest experience and operational audit.
- A new branch can be added only when its source, inference status and applicability are recorded.

## Source-derived boundaries

- The audit workbook contains owner names in a separate column; these are excluded from the generalized graph.
- The director calendar contains plan/fact time observations and historical dates. Blank cells remain unknown, not zero.
- The management training describes situational leadership and task-relative work maturity. Do not turn the model into a permanent employee label or validated psychometric score.
- The appearance document asks a question about footwear but does not specify an answer. STEN must not invent one from that source.
- The guest-service PDF identifies itself as confidential and concept-specific. Only generalized topic structure is retained.
- The restaurant regulation contains dated examples, internal names, addresses, suppliers and legacy software workflows. It is PRACTICE evidence, not current law or universal procedure.

## Next graph expansion

1. Add leaf-level controls and procedures only after reviewing the exact source section, table or worksheet.
2. Add operational artifacts: checklist, journal, report, role, cadence and verification result.
3. Add cause/effect links between process failures and measurable business outcomes only where supported.
4. Add profile conditions and jurisdiction constraints before applying safety, employment, tax or legal nodes.
5. Add evaluation cases for multi-hop questions, cross-branch retrieval, source fidelity, unknown handling and contradiction detection.
