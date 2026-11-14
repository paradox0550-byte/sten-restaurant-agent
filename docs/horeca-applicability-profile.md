# HoReCa applicability and profile rules — Stage 11

## Classification is not applicability
The taxonomy classifies the business model. It does not prove that a law, permit, technical rule or practice applies. Each source is evaluated independently against evidence class, territory, validity dates, sector, format, establishment conditions and required profile fields.

## Establishment profile
The canonical schema is `memory/restaurant-profile.schema.json`. It captures identity and jurisdiction; primary sector and multiple formats; business, service, sales-channel and production models; operating scale; building context; engineering and equipment; departments and production sites; finance; workforce; and compliance references.

Null or omitted fields remain unknown. Optional `field_status` can explicitly state `known`, `unknown`, `not_applicable` or `requires_confirmation`. Not-applicable must be justified, never defaulted.

## Applicability states
- `potentially_applicable`: metadata supports relevance within the stated scope; not a compliance finding.
- `not_applicable`: verified scope mismatch excludes the record for this question.
- `requires_context`: required facts are missing or contradictory.
- `specialist_review`: legal/technical assessment is required.
- `undetermined`: source metadata or scope is insufficient.

Never convert missing profile data into a negative match. A retrieved requirement is not proof of compliance or non-compliance.

## Source classes and intake
Keep LAW, RESEARCH, CORE, INDUSTRY, PRACTICE, TREND, HYPOTHESIS and CONFIGURATION separate. Every record needs source identity, citation/URL where available, publication/access dates, jurisdiction/scope, validity, applicability, limitations, status and reviewer lifecycle.

- LAW: official primary source, exact act/provision, jurisdiction, edition, effective dates and applicability conditions; specialist review where interpretation matters.
- RESEARCH: bibliographic identity/DOI, design, sample, geography, dates, outcomes, limitations and transferability.
- INDUSTRY: issuing body, date, declared market, methodology and commercial interests.
- PRACTICE: owner/context, operating scope, date/version and transfer limits; never universalize one operator's SOP.
- TREND: geography, time window, sample/source and review date.
- CORE: versioned STEN methodology, not an external fact.
- HYPOTHESIS: falsifiable claim and validation plan, not a fact.
- CONFIGURATION: tenant-specific data isolated from the shared corpus.

## Lifecycle and boundary
Lifecycle: draft → reviewed → approved → archived/quarantined. Schema validation is not truth validation. Preserve source versions and conflicts. This stage closes the taxonomy/profile/governance structure; it does not claim a complete curated corpus, complete laws for every jurisdiction or compliance certification.
