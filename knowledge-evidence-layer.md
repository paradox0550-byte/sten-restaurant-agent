# Knowledge & Evidence Layer v0.5

## Purpose
A shared, auditable evidence registry for STEN. It keeps evidence types distinct while making records traceable by topic, territory, date, establishment format and status.

## Record model
Each record stores stable ID/title, evidence class, topics, source identity/type/URL/citation, publication and access dates, source version, territory/jurisdiction, validity and effective dates, review dates, applicability scope/conditions, required establishment profile fields, limitations, links/conflicts and editorial review lifecycle. Canonical structure: `knowledge/evidence/schema.json`.

## Ingestion
1. Identify the source itself. Search snippets are not sufficient.
2. Classify it: LAW, RESEARCH, CORE, INDUSTRY, PRACTICE, TREND, HYPOTHESIS or CONFIGURATION.
3. Capture provenance and territory.
4. For LAW use official publication/regulator sources; capture act ID, edition and effective interval.
5. State covered sectors/formats and conditional object characteristics.
6. Document limitations and unknowns.
7. Begin as draft; approve only after review.
8. Validate schema/invariants. Validation is not proof that a source is true or current.
9. Link corrections, conflicts, supersession; preserve prior versions.

## Legal records
LAW cannot be approved without known jurisdiction, official source type, official URL/citation and verifiable validity dates. Unknown status is not current law. Applicability must account for date, jurisdiction, sector, format and characteristics such as building, engineering systems and capacity when demanded by the provision. Missing facts produce needs_profile_data/undetermined. A registry result never certifies compliance; specialist assessment may be required.

## Reasoning
Retrieve by topic/time/location/format; check record status, validity and review date; assess applicability from profile; separate source fact, interpretation, calculation and recommendation; disclose conflict/weak evidence/unknowns; cite record IDs and source metadata. Do not resolve conflicts by recency alone.

## Privacy
Shared registry must not contain tenant-specific configuration, employee/guest personal data, private addresses, vendor commercial terms or business secrets. Store these in isolated tenant memory/configuration, not shared knowledge.

## Starter content and coverage
Starter registry includes two STEN methodology records, one anonymized limited-scope operational practice distilled from the supplied 2025 corporate manual, and one empty legal intake template marked unknown/draft. It does not yet contain verified current law or scientific findings. These require separate primary-source research and review.
