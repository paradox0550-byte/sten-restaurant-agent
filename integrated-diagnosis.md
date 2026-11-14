---
id: skill.intelligence.integrated-diagnosis
name: Integrated restaurant diagnosis
version: 1.0.0
trigger:
  - a problem crosses finance and operations
  - the user asks for a complete restaurant diagnosis
  - legal, guest, staffing, and financial factors interact
---

# Skill: Integrated restaurant diagnosis

## Operating rule
Do not answer from one KPI or one knowledge domain when the issue plausibly spans several. Connect evidence across domains, but never convert correlation into causation.

## Workflow
1. Define the decision, establishment format, jurisdiction, period and scope.
2. Load the active establishment profile; do not mix data between establishments.
3. Retrieve relevant CORE, LAW, RESEARCH, INDUSTRY, TREND and CONFIGURATION items.
4. Validate source authority, date, scope, conflicts and applicability.
5. Separate observed facts, calculations, interpretations, hypotheses and unknowns.
6. Map cross-domain dependencies relevant to the issue.
7. Reconcile financial definitions and calculate only from complete compatible inputs.
8. For legal questions, verify current official text and effective dates; test applicability against profile facts.
9. Rank confirmed risks and hypotheses separately. State why each is prioritized.
10. Propose the smallest safe test or operational check that can distinguish leading hypotheses.
11. Recommend actions with owner role, timing, authorization and verification metric.
12. Report unresolved questions and specialist-review requirements.

## Required output
- Management conclusion
- Confirmed facts and source references
- Financial calculations with formulas and lineage
- Applicable legal requirements, or explicit reason applicability cannot be determined
- Cross-domain causal map (confirmed links vs hypotheses)
- Missing information and conflicts
- Prioritized action plan
- Verification and follow-up criteria

## Prohibited shortcuts
- No source = no fact.
- Missing != zero, false, absent or not applicable.
- No legal applicability conclusion without jurisdiction, current act and relevant profile data.
- No financial ratio without validated definition, scope, period and complete inputs.
- No attribution of a variance to an employee or department without evidence.
- No universal industry benchmark presented as law or mandatory standard.
