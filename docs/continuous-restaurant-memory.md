# Continuous Restaurant Memory — Stages 6, 11 and 12

## Product principle

A restaurant is a changing operating system. STEN should learn local operating context during normal work. Completing a profile is optional and is never a prerequisite for asking questions or receiving analysis.

Automatic capture preserves a sourced user assertion with an explicit status. It does not mean independent verification, approval as a standard, or universal validity.

## Four knowledge layers

1. Conversation context: transient messages and task context. Not automatically promoted to durable memory.
2. Restaurant memory: tenant- and establishment-scoped facts such as format, hours, departments, staffing patterns, equipment, channels and local arrangements.
3. Operational events and decisions: changes with provenance and validity periods. Prior versions remain in history.
4. STEN methodology: reusable HoReCa methods and evidence. Local facts never become global methodology without separate review, rights assessment and approval.

Approved standards are a controlled subset of restaurant memory, not a synonym for every captured fact.

## Capture lifecycle

A host/provider may extract a structured candidate from a message, file or connected source. The runtime capture boundary validates and stores that candidate; it does not itself perform language-model extraction.

- Require tenant, establishment, category, stable entity key, statement, source type and source identifier.
- Preserve recorded_at, effective_from, effective_to, confidence, sensitivity and status.
- Do not infer missing dates, values, scope or source details.
- Deduplicate identical statements and values.
- Silently capture only explicit user assertions that are low-risk, unambiguous, high-confidence and in an eligible local category.
- Mark other candidates needs_confirmation.
- Mark overlapping contradictory values conflict_review; retain both and never silently overwrite.
- Reject sensitive categories from this automatic memory path.
- Require explicit approval before promoting a candidate to an approved standard or global methodology.

## Validity and correction

recorded_at records when STEN learned the assertion. effective_from and effective_to describe when it applies operationally. Missing boundaries remain unknown. Corrections append a new record and retain prior provenance. Capture alone never resolves a conflict.

## Isolation and trust

Storage keys include tenant and establishment scope. tenantId must come from the authenticated host, never model output. A model-supplied restaurant ID is not authorization. Memory does not grant access to source systems or permission to execute tools.

## Current implementation boundary

src/runtime/knowledge-capture.js implements structured candidate validation, conservative silent-capture eligibility, duplicate detection, conflict preservation and explicit confirmation against an injected memory adapter. Tests use InMemoryTenantMemory.

The adapter remains development/test only. This change does not provide durable storage across process restarts, production authentication, access-control UI, retention/deletion controls, encryption, persistent audit, provider-side extraction, background capture or live integrations. A production host must implement and security-test those capabilities before claiming persistent automatic learning.
