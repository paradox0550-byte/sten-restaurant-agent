# Contributing evidence records

1. Copy the record structure from `knowledge/evidence/registry.json`.
2. Assign a stable lowercase ID; never reuse retired IDs.
3. Do not add personal data, venue/company names, confidential content or tenant settings to shared registry.
4. Include limitations; unknown dates/URLs stay null, never guessed.
5. Legal records require official source, jurisdiction and effective interval.
6. Research records preserve study design, population, method and limitations.
7. Keep draft until reviewed.
8. Run `npm test` and `npm run validate:evidence`.
9. Link prior/successor records when source changes, is repealed or superseded.
