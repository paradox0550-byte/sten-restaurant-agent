# Evidence registry policy

## Evidence classes
- LAW: legal force must be established from an authoritative source and the correct jurisdiction.
- RESEARCH: preserve study design, population/context, findings and limitations.
- CORE: STEN methodology, not external proof and not a legal source.
- INDUSTRY: distinguish mandatory requirements from recommendations.
- PRACTICE: observed/documented operating practice; do not generalize without support.
- TREND: dated, time-sensitive observation; state window and market.
- HYPOTHESIS: explicitly unverified; never present as fact.
- CONFIGURATION: establishment-specific facts/settings; isolate by tenant.

## Provenance
Every record identifies publisher/author, source title, source type, exact URL or citation, publication date when known, access date and source version. For legislation capture act identifier, official publication and effective interval. A search snippet alone is not a sufficient source.

## Validity lifecycle
Publication and effective dates are separate. Use in_force only when verified for the jurisdiction and interval. not_yet_effective, superseded, repealed and historical are retained for traceability. current_but_unverified and unknown are not confirmed current law. An overdue review triggers re-verification, not automatic repeal.

## Applicability
Applicability is a separate decision based on jurisdiction, date, sector/format, establishment profile and source conditions. Missing facts remain unknown, never false, zero, absent, not applicable or compliant. Outputs: applies, does_not_apply, needs_profile_data, specialist_review, undetermined. Record reasons and fields used. A broad category label alone cannot establish applicability.

## Conflicts and updates
Never silently overwrite. Create a new record/version, preserve the old record, link supersedes/superseded_by, and explain the change. Resolve conflicts using authority, jurisdiction, scope, effective date, specificity and methodology—not recency alone.

## Review cadence
- LAW: verify at ingestion and before legal answers; recheck by due date and whenever current compliance is asked.
- TREND: default review interval 90 days; configure by market/topic.
- RESEARCH: check corrections/retractions and newer systematic reviews; preserve original context.
- INDUSTRY/PRACTICE: at least annual review or when practice changes.
- CORE: version review on methodology change.
- CONFIGURATION: reconfirm with establishment owner when stale or changed.

## Output rules
Separate source fact, interpretation, calculation, assumption and recommendation. Show source date, territory, validity and limitations. A registry record never certifies a venue's compliance. Building-specific assessment, engineering calculations, design, inspection and qualified interpretation may require specialists.

## Privacy and tenant isolation
Do not place tenant CONFIGURATION, personal data, private addresses, supplier commercial terms, internal identifiers or confidential business information in the shared public registry.
