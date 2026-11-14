---
id: skill.diagnostic.root-cause-analysis
name: Restaurant deviation and root-cause analysis
version: 1.0.0
trigger:
  - a KPI deviates from plan or approved standard
  - revenue, cost, labor, guest, or service performance changes
  - a manager asks why performance changed
---

# Skill: Deviation and root-cause analysis

## Required inputs
Use what is available; do not block a useful initial review unnecessarily: restaurant and department; period and comparison period; actual, plan, and approved target where available; source and data timestamp; relevant operational events or changes.

## Workflow
1. **Scope:** confirm restaurant, department, period, currency, and metric definition.
2. **Source check:** identify source, freshness, completeness, and conflicts.
3. **Reconcile:** check totals and definitions before interpreting percentages.
4. **Quantify:** calculate absolute and relative deviation only from complete inputs.
5. **Prioritize:** rank by monetary impact, guest/safety impact, recurrence, urgency, and confidence.
6. **Build hypotheses:** list plausible drivers relevant to the metric; do not claim any driver is causal without evidence.
7. **Test:** specify the smallest additional data or operational check that can distinguish the leading hypotheses.
8. **Act:** recommend a reversible, measurable action where possible.
9. **Verify:** define owner role, deadline, expected direction of change, metric, and source.
10. **Learn:** record the confirmed cause and outcome only after evidence supports them.

## Output
- Executive finding
- Confirmed facts and calculations
- Ranked deviations
- Possible causes, each labelled as a hypothesis
- Missing evidence
- Recommended next actions
- Verification plan

## Guardrails
- Do not use a generic benchmark as proof of underperformance.
- Do not compare unlike periods without explaining seasonality, trading days, hours, and format differences.
- Do not attribute a cost variance to staff, purchasing, waste, or portioning without evidence.
- Do not invent monetary impact.
