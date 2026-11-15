# Stage 11 — kitchen workforce planning by production workload

## Purpose and decision boundary

Teach STEN to estimate the required number of kitchen employees by production section and time interval from the actual or forecast dish mix. The method is workload-based, not a fixed "one cook per X dishes" ratio.

The output is a **modelled staffing requirement**, not an automatic hiring, dismissal, scheduling or labor-law instruction. A manager must validate role coverage, skills, breaks, shift rules, safety, equipment capacity and local employment requirements before publishing a schedule.

## Unit of analysis

Calculate separately for each:
- restaurant/outlet and production date;
- kitchen section or station (cold kitchen, hot line, grill, pastry, prep, pass, or the site's own map);
- production interval (normally the smallest reliable POS/KDS bucket, such as 15 or 30 minutes);
- channel/daypart where the production routing or work content differs.

Do not aggregate all kitchen dishes into one count and divide by a universal norm. A dish can consume labor in more than one section; allocate its work content to each station that actually performs it. Do not double-count the same operation.

## Required inputs

### Demand and production
- POS/KDS item quantities by dish, modifier, section and time interval;
- historical comparable periods and event/booking/occupancy forecasts where relevant;
- confirmed menu availability, stop-list and channel mix;
- prep/batch demand that is not represented by guest tickets.

### Work content
For every dish × station operation:
- standard active labor minutes per unit;
- batch size and setup minutes per batch, where relevant;
- separately identified fixed interval work: opening, replenishment, cleaning, closing and mandatory handovers;
- source and version of the standard, measurement date, sample size and reviewer.

Use observed work sampling or time studies across representative staff, shifts and load levels. Record active labor time separately from elapsed cook time, unattended equipment time and waiting. A 12-minute oven cycle does not automatically mean 12 minutes of continuous cook labor.

### Capacity and constraints
- interval duration;
- approved productive-utilization factor for the interval;
- minimum role/skill coverage and station-opening constraints;
- available employee skills and cross-training;
- equipment, workspace and pass capacity;
- breaks, overlap, shift boundaries and legally required rest.

No productivity coefficient, utilization factor, minimum coverage or service target is universal. Missing item routing, standard minutes, batch setup minutes, fixed-work minutes, utilization or minimum coverage stay unknown; the calculator returns unavailable rather than silently treating a missing value as zero.

## Deterministic calculation

For a section and interval:

1. Unit workload:
   `unit_minutes = Σ(quantity_i × standard_active_minutes_i)`
2. Batch/setup workload:
   `batch_minutes = Σ(ceil(quantity_i / batch_size_i) × setup_minutes_per_batch_i)`
3. Add separately measured fixed work:
   `total_workload_minutes = unit_minutes + batch_minutes + fixed_work_minutes`
4. One employee's modelled productive capacity:
   `capacity_per_employee = interval_minutes × approved_productive_utilization`
5. Workload-based headcount:
   `workload_headcount = ceil(total_workload_minutes / capacity_per_employee)`
6. Apply validated minimum coverage:
   `modelled_headcount = max(workload_headcount, approved_minimum_coverage)`

The productive-utilization factor must be greater than 0 and no greater than 1. It represents the share of interval time available for the measured production work after the site's defined allowances. Do not subtract breaks twice: either account for them in interval availability or in the shift-coverage layer, with the convention documented.

For multiple intervals, calculate each interval independently to expose the peak. Then convert interval requirements into a feasible roster with employee continuity, skills, breaks, handovers and labor rules. Do not sum interval headcounts to derive shift headcount.

## Example (illustrative only)

A hot section has 30 minutes in the interval:
- 18 dishes × 2.0 active minutes = 36 minutes;
- 8 dishes × 1.0 active minute = 8 minutes;
- 2 batches × 4 setup minutes = 8 minutes;
- fixed replenishment work = 6 minutes.

Total = 58 labor minutes. At an approved productive-utilization factor of 0.80, one employee contributes 24 productive minutes in the interval. Workload headcount = ceil(58 / 24) = 3.

This is a workload estimate for that interval, not a universal staffing norm. The result still needs skill coverage, minimum station coverage, equipment feasibility and actual-time validation.

## Forecasting and calibration loop

1. Build demand forecast by dish and interval from comparable weekday/daypart/season/event conditions.
2. Apply current menu mix and known modifiers; identify new or changed recipes separately.
3. Calculate each station's workload using approved time standards.
4. Identify peak interval, bottleneck station and skill constraints.
5. Draft a roster that covers interval requirements while respecting shift continuity, breaks and labor rules.
6. Compare forecast to actual POS/KDS volumes, actual hours and ticket-time distribution.
7. Recalibrate standards only from documented observations; preserve prior versions and explain changes.

Track, where available and consistently defined:
- dishes and workload minutes per paid/actual labor hour;
- ticket-time median and upper percentile by station/daypart;
- backlog and remake/error rate;
- overtime, schedule variance and unfilled station coverage;
- waste and quality deviations.

A single productivity KPI must not be optimized at the expense of food safety, quality, guest wait, staff fatigue or lawful working conditions.

## Exception handling

- Missing item-to-section routing: ask for routing; do not allocate by guess.
- Missing standard minutes: mark the dish's workload unknown and show coverage impact; do not substitute an average silently.
- New dish: require a provisional time study or explicitly labelled estimate before treating the forecast as complete.
- Mixed or shared preparation: split active work minutes across stations with traceable allocation; avoid duplicate counting.
- Sudden demand spike: show scenario range and bottleneck; escalate for manager decision.
- Equipment outage or station closure: recalculate only with a confirmed alternative routing and its capacity.
- Cross-trained employee: count their capacity in only one simultaneous station at a time.
- Incomplete POS/KDS: disclose coverage gaps; no false precision.

## Required STEN output

1. Scope, date, interval, outlet and station.
2. Source completeness and forecast confidence.
3. Dish quantities and standard minutes by station.
4. Unit, batch and fixed workload breakdown.
5. Productive capacity assumptions and their approval/source.
6. Required headcount by interval and peak interval.
7. Skill/minimum-coverage constraints and any infeasible intervals.
8. Comparison with planned and actual staffing, when supplied.
9. Risks, missing inputs and manager decisions required.
10. Versioned assumptions and evidence trail.

## Acceptance tests for Stage 11

- Same dish count with different standard minutes produces different staffing.
- Separate stations produce separate headcount results.
- Batch setup and fixed work are included exactly once.
- Peak interval is not hidden by daily averages.
- Missing routing or time standards returns unavailable/partial, not zero.
- Utilization outside (0, 1] is rejected.
- Breaks are not double-subtracted.
- Cross-trained capacity is not double-booked.
- The output clearly says modelled requirement, not automatic schedule approval.

## Evidence and status

This is a proposed STEN methodology and calculator contract. It is not a statutory staffing ratio or externally validated industry benchmark. Site-specific standards require measured observations and kitchen-manager approval. Labor-law and safety constraints require current jurisdiction-specific evidence.
