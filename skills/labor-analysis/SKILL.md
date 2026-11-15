---
id: skill.labor-analysis
name: Labor, payroll and productivity analysis
version: 1.1.0
---
# Labor analysis workflow

1. Establish location, period, roles, employment/pay types, planned vs actual hours and source completeness.
2. Separate hourly, shift-based and monthly salary models; do not count monthly salary as a per-shift amount.
3. Distinguish accrued payroll, paid payroll, advances, deductions, gross and net values.
4. Verify department allocation and cross-department sales allocation rules before calculation.
5. Calculate labor ratios only with matching revenue scope and period.
6. Estimate required hours only when approved workload coefficients/productivity norms exist.
7. Identify overtime and schedule variance from supplied rules and actual hours.
8. Keep employee-level judgments out of conclusions unless supported and authorized.

## Kitchen staffing by section and production interval

1. Read the establishment's station map and route each menu item to the station(s) that perform its active work.
2. Obtain POS/KDS demand by dish, modifier, section and 15/30-minute interval; keep forecast and actual quantities distinct.
3. Obtain approved active labor minutes per dish per station, batch size/setup minutes and fixed prep/replenishment/cleaning work.
4. Validate the time standards from documented observations; separate active labor from unattended cooking and elapsed waiting time.
5. Require the approved productive-utilization factor, interval length and minimum station coverage. Do not invent any of them.
6. Calculate station workload minutes, batch setup minutes and fixed work; divide by one employee's productive minutes in that interval and round up.
7. Calculate every interval independently; expose the peak and bottleneck. Do not use a daily average to hide peak staffing demand.
8. Convert interval requirements into a feasible roster only after checking skills, simultaneous station assignments, breaks, shift overlap, equipment, safety and labor rules.
9. Compare forecast with actual tickets, actual hours, ticket-time distribution, backlog, overtime, remakes and quality.
10. Mark missing routing or time standards as unknown/partial; never coerce missing work to zero.

The calculator returns a modelled concurrent staffing requirement for one station and interval. It is not an approved roster, hiring decision or statutory staffing ratio. Cross-trained employee capacity cannot be counted in two simultaneous stations.

See `docs/stage-11-kitchen-workforce-planning.md` and `src/labor/productivity.js`.

Missing payroll rules or tax rates must be requested, not assumed.
