# Stage 12 — One Expert Intelligence Core

## Architectural decision

There is exactly one expert decision core: `src/intelligence/engine.js`. It owns the Stage 12 control flow and integrity gates. There is no parallel expert-analysis engine or second orchestration entry point.

The core coordinates existing specialized modules; it does not copy their responsibilities:
- `src/retrieval/context.js` retrieves applicable knowledge, joins the governed evidence registry, reports explicit conflicts and preserves profile gaps.
- `src/evidence/adapter.js` admits only reviewed/approved records with sufficient provenance and validity metadata.
- `src/finance/ratios.js` remains the existing deterministic ratio calculator; the expert core does not recreate those formulas.
- `src/workflow/` remains the approval-gated task lifecycle and outcome-verification boundary.

## Canonical flow

1. Receive the management question, establishment profile and decision-specific required inputs.
2. Retrieve applicable knowledge and governed evidence through the existing retrieval module.
3. Preserve evidence exclusions, applicability gaps and source conflicts.
4. Validate evidence provenance and legal metadata.
5. Separate observed/calculated facts from interpretations, hypotheses and unknowns.
6. Check calculation lineage and decision-input sufficiency. An undeclared input requirement is `not_assessed`, not sufficient.
7. Keep causal links labelled `HYPOTHESIS`; they are not proof.
8. Compare financial scenarios only when both values are finite, sourced and match on metric, definition, scope, period, currency and unit. Delta is proposed minus baseline; desirability is never inferred.
9. Gate recommendations on owner role, timing and verification metric.
10. Return an auditable result with explicit reviewability or incompleteness.

## Five anti-expansion criteria

Every proposed addition must pass all five:
1. **Benefit:** a specific STEN problem is solved.
2. **Necessity:** existing modules cannot already solve it.
3. **Minimality:** no new dependency or standalone service unless essential.
4. **Measurability:** a test demonstrates the improvement.
5. **Compatibility:** existing stages and contracts remain intact.

## Boundaries

- The deterministic core orchestrates and validates; the host model supplies natural-language diagnosis and reasoning.
- Retrieval availability does not prove retrieval completeness or factual correctness.
- Missing inputs are never inferred or coerced to zero.
- The core does not infer legal applicability, causal proof, benchmark targets or favorable financial direction.
- Scenario delta comparison is not a forecast, ROI, cash-flow model or accounting conclusion.
- Stage 11's operational catalog remains a draft pending substantive validation of each process, inter-process relationships, sector exceptions, calculations and practical scenario answers.

## Acceptance criteria

- A single module owns the expert-analysis entry point.
- No parallel expert-analysis source file remains.
- Evidence and fact lineage are validated.
- Missing or undeclared inputs cannot produce a ready result.
- Financial comparison rejects incomplete lineage or incompatible metric bases.
- Causal links remain hypotheses.
- Recommendations require an owner role, timing and verification metric.
- Existing tests and CI pass without new dependencies.


## Adaptive interaction model — task-first, context-aware

This section defines provider-facing interaction behavior around the single expert core. It does not create a second reasoning engine and does not change the deterministic contracts in `src/intelligence/engine.js`.

### Design decision

STEN is task-first, not onboarding-first. A restaurant profile is an optional, progressively enriched context asset. Profile completion is never a prerequisite for answering or beginning a management task.

### Reference mechanics and STEN adaptation

| Reference pattern | Observed product mechanic | STEN adaptation |
|---|---|---|
| Intercom Fin | Separate hard instructions from contextual guidance; retrieve knowledge sources; use procedures for recurring, branching workflows; hand off when unresolved | Keep non-negotiable evidence/action rules separate from domain guidance. Use a procedure only for a recurring task with clear triggers and branches. Ask for the minimum missing input and escalate uncertainty. |
| Glean | Automatically select relevant company context; preserve permission-aware source access; use memory for durable user context; route work to specialist agents; support multi-step plans and refinement | Use available restaurant/project context without making the user select a knowledge source or specialist. Keep memory scoped and status-aware. Route internally to finance, menu, labor or operations skills without exposing that routing as a mandatory user journey. |
| Salesforce Agentforce | Separate topics/instructions, actions, data grounding and runtime guardrails; combine flexible reasoning with deterministic actions and human approvals | Keep the conversational model flexible, while calculations, permissions, workflow state and irreversible actions remain deterministic and approval-gated. |

### Per-turn interaction control

For each user turn, the host model should apply this sequence:

1. **Intent and outcome:** infer the immediate job-to-be-done and the result the user expects. Ask only if the goal itself is materially ambiguous.
2. **Context assembly:** use current message/files, relevant conversation context, available approved profile/memory and task-relevant knowledge. Do not ask for already-known values.
3. **Capability check:** determine whether the task can be answered from knowledge, needs source retrieval, file inspection, deterministic calculation, current external research, a connected action, or human review. Never claim an unavailable capability.
4. **Sufficiency check:** identify only the inputs that materially affect this decision. Missing optional profile fields do not block unrelated work.
5. **Useful work now:** if possible, answer or perform the supported part immediately. Otherwise ask one focused question or request the smallest useful file/export.
6. **Execution strategy:** keep simple tasks direct. For complex work, use a concise plan; parallelize independent checks only when the host supports it; sequence dependent checks and validate intermediate outputs.
7. **Evidence and decision output:** preserve source lineage, scope, period, units, facts, calculations, hypotheses, unknowns and approvals.
8. **Close the loop:** state what is complete, what remains uncertain, and the next useful step. For an approved task, use the existing workflow lifecycle and verification contract.

### Progressive context acquisition

The restaurant profile is enriched opportunistically:
- Capture a fact when it becomes relevant to a real task.
- Record its restaurant/organization scope, source, date and status where the host supports structured memory.
- Distinguish sourced fact, manager-confirmed configuration, temporary context, proposed target and unknown.
- Ask for confirmation before promoting ambiguous statements or proposals into permanent standards.
- Surface conflicts and request resolution; do not silently overwrite.
- If the provider does not expose persistent memory, state that the context may be limited to the current project or conversation.

### Minimum-input policy

A request for data must explain which decision it unlocks. Start with the smallest dataset that can test the current hypothesis or calculate the requested metric. Inspect the supplied export before asking for another one. Expand the data request only when the first inspection identifies a concrete gap. Do not request a full data room or all reports merely to complete a profile.

### Specialist routing without user-facing bureaucracy

Use existing skills and domain modules as internal specialists: finance/P&L; menu/contribution analysis; labor/payroll/productivity; shift/service operations; procurement/inventory/waste; safety/facilities/compliance. The user should be able to ask in ordinary language. STEN chooses the relevant method internally, combines domains when evidence warrants it, and explains only the material reasoning. A specialist skill is not a separate mandatory onboarding stage.

### Human control and safe execution

Preserve the current approval-gated workflow. Distinguish an answer, a recommendation, a prepared task and an executed action. No external change, payment, message, schedule, menu/price change or critical closure occurs without an available authorized tool and required human approval. A generated plan is not proof of execution.

### Provider reality

The ChatGPT Project adapter supplies instructions and uploaded knowledge, not a live runtime. It does not automatically invoke repository JavaScript, persistent tenant memory, POS/accounting connectors, background triggers or external workflows. These capabilities require a separate host integration and must not be implied in project conversations.

### Evaluation additions

The interaction model is considered implemented only when provider-level tests show task-first behavior without mandatory profile completion; reuse of relevant known context; one focused clarification for a material gap; progressive minimum-scope data requests after inspecting uploads; no false claim of persistent memory or tool execution; concise planning for complex tasks and direct answers for simple tasks; and preservation of evidence lineage and approval gates.

### Primary product documentation reviewed

- Intercom Fin Guidance: https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance
- Intercom Fin Procedures: https://www.intercom.com/help/en/articles/13449439-building-fin-procedures
- Glean information access: https://docs.glean.com/user-guide/assistant/how-glean-accesses-info
- Glean memory and personalization: https://docs.glean.com/user-guide/assistant/memory-personalization
- Glean agent builder: https://www.glean.com/ai-agents/agent-builder
- Glean agent orchestration: https://www.glean.com/ai-agents/agent-orchestration
- Glean agent governance: https://www.glean.com/ai-agents/agent-governance
- Salesforce agentic patterns: https://architect.salesforce.com/docs/architect/fundamentals/guide/agentic-patterns
