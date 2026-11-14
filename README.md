# STEN — Restaurant Management Intelligence

Portable, provider-neutral restaurant intelligence package for HoReCa.

## Current build
- Knowledge & Evidence Layer: **v0.5.0**
- Goal: maintain a traceable registry of professional knowledge, legal requirements, scientific research, industry practice, trends, hypotheses, and restaurant-specific configuration.
- Core rule: **No source = no fact. Missing != zero.**

## Repository structure
- `knowledge/evidence/` — registry schema, lifecycle and applicability policy, controlled vocabularies, starter records.
- `src/evidence/` — dependency-free JavaScript validation and query helpers.
- `tests/` — Node.js built-in test suite.
- `docs/` — contributor and ingestion guidance.

## Quick start
Requires Node.js 18+.

```bash
node --test
```

## Evidence principles
1. Every factual knowledge record carries provenance.
2. Jurisdiction and effective dates are explicit for legal records.
3. Applicability is distinct from validity: a valid rule may not apply to every establishment.
4. Missing information is represented as unknown, never silently coerced to false or zero.
5. Conflicting or superseded sources remain traceable; no silent overwrite.
6. Research, law, professional practice, industry guidance, trends, hypotheses, and configuration are separate evidence classes.
7. A registry record is not a legal opinion, certification, or declaration of compliance.

See [Knowledge & Evidence Layer](docs/knowledge-evidence-layer.md).
