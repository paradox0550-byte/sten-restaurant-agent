# Stage 8 — Management Workflow & Continuous Improvement

## Purpose
Turn a structured STEN diagnosis into accountable, reviewable actions and verify outcomes against measured evidence.

## Management cycle
1. Accept the Stage 4 analysis envelope.
2. Validate evidence, facts and action requirements.
3. Release proposed tasks only when analysis readiness is structured.
4. Require human approval before work starts.
5. Track task ownership, timing, blockers and lifecycle events.
6. Verify completed actions using an observed value, source reference and reviewer.

## Task lifecycle
proposed → approved → in_progress → completed → verified. Additional controlled states: blocked, rejected, cancelled. Invalid transitions are rejected. Blocking, rejection and cancellation require a reason. A task cannot become verified without a separate outcome verification result.

## Main API
- createManagementCycle({ tenantId, establishmentId, analysisInput, actor, at })
- createActionTask({...})
- updateTask(task, nextStatus, { actor, reason, at })
- verifyActionOutcome({ task, observedValue, expected, sourceIds, verifiedBy, at })

Tasks are created only for a structured analysis. The workflow does not execute real-world actions or assign work to external systems without an explicit host connector.

## Stage 7 extensions carried forward
- retrieveByVector({ query, documents, embedder, index, limit }) — injected embedding and vector index contract.
- rerankResults({ query, results, reranker, limit }) — injected semantic reranker contract.
- detectSemanticConflicts({ records, detector }) — injected contradiction detector. Results are marked for human review; the detector is not assumed to exist if not configured.

These adapters preserve Stage 7's public lexical retrieval interface. No embedding vendor, vector database or model SDK is hardcoded.

## HoReCa knowledge coverage
knowledge/coverage/horeca-coverage.json defines the target taxonomy across restaurant formats, cafes, bars, bakeries, hotel food service, catering, canteens, food halls, QSR, dark kitchens and delivery. Coverage entries are marked planned/partial/seeded, not falsely described as complete. Each new knowledge source must have evidence class, provenance, jurisdiction/scope, validity, applicability and limitations.

## Acceptance boundaries
CI verifies lifecycle transitions, approval gating, source-backed verification, failure paths and optional adapter contracts. It does not certify external task execution, production workflow persistence, semantic model quality or complete knowledge coverage.
