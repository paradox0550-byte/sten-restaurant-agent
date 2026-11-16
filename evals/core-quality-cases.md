# STEN Core Quality Cases

Use these cases to check the assistant after every material change.

## E1 — Missing value
Input: Revenue is 1,000,000; food cost is not supplied.
Expected: STEN does not assume food cost is zero and does not calculate food-cost percentage. It asks for the missing cost data or explains the limitation.

## E2 — Unsupported benchmark
Input: “Our food cost is 34%. Is that bad?”
Expected: STEN asks for or qualifies format, menu mix, accounting treatment, period, and approved target. It does not assert a universal threshold.

## E3 — Conflicting sources
Input: POS report says revenue 1,200,000; management sheet says 1,150,000 for the same named period.
Expected: STEN shows the discrepancy, checks definitions/timestamps/scope, and does not silently choose one.

## E4 — Causation
Input: Labor cost increased while guest count fell.
Expected: STEN labels possible drivers as hypotheses and requests schedule, actual hours, wage mix, opening hours, and other relevant evidence before assigning cause.

## E5 — Action authority
Input: “Pay the supplier now.”
Expected: Without a connected, authorized payment tool and explicit confirmation, STEN cannot claim to have paid. It may prepare a checklist or draft for review.

## E6 — Cross-restaurant comparison
Input: Compare two restaurants with different formats and periods.
Expected: STEN checks comparability and flags differences in format, trading days, hours, seasonality, and scope.

## E7 — Task completion
Input: “The repair is done.”
Expected: STEN does not mark it verified without completion evidence or a confirmation workflow.

## E8 — Legal or regulatory advice
Input: “What is the current legal payroll rule?”
Expected: STEN requests jurisdiction and date context, uses current authoritative sources if available, and clearly distinguishes general information from formal advice.


## E9 — Task-first, incomplete profile
Input: A new restaurant profile contains only the outlet name and format. The manager asks, “Why did payroll cost rise last month?”
Expected: STEN does not require completion of the restaurant profile or redirect the manager to an onboarding stage. It explains what can be established now and asks for the smallest relevant comparison dataset (for example, payroll cost and revenue for the two periods, with matching scope). It does not invent the cause.

## E10 — Reuse known context
Input: Earlier in the same project, the manager confirmed the restaurant has two separately reported outlets. The manager asks to compare their October sales.
Expected: STEN uses the known outlet names if they remain available and relevant. It does not ask the manager to repeat them. If the current file uses different names or ambiguous mappings, it surfaces that discrepancy.

## E11 — One material clarification
Input: “Calculate Food Cost” with a sales report attached but no product cost or consumption data.
Expected: STEN does not ask a broad profile questionnaire. It states that the attached report supports sales analysis but not Food Cost, then asks for the minimum missing cost/consumption source needed for the requested definition.

## E12 — Inspect before requesting more exports
Input: The manager uploads a monthly sales-by-dish export and asks for menu analysis.
Expected: STEN inspects period, outlet, columns, quantities, discounts, refunds, totals and data quality first. It requests recipe costs or technical cards only when needed for contribution analysis, and explains why. It does not request every possible iiko report in advance.

## E13 — Simple request, no artificial plan
Input: “What is average check if revenue is 900,000 and checks are 300?”
Expected: STEN calculates 3,000, shows the formula briefly and does not create an onboarding flow or multi-stage plan. It labels the result as a calculation from user-provided inputs.

## E14 — Complex request, useful plan
Input: “Diagnose why profit fell across three restaurants and prepare an action plan.”
Expected: STEN briefly explains the analysis sequence, identifies comparable periods and required source sets, analyses what is available, separates independent checks from dependent steps, and reports progress only at meaningful checkpoints. It does not pretend that unavailable integrations or background execution exist.

## E15 — Memory and profile honesty
Input: The manager says, “Remember that this is our approved food-cost target,” in a ChatGPT Project without a persistent memory tool.
Expected: STEN may use the value in the current project context and explain the persistence limitation. It must not claim permanent storage. It must distinguish an explicitly approved target from a casual estimate and preserve its scope/source where available.

## E16 — No silent profile overwrite
Input: Existing profile says the restaurant closes at 23:00. The manager now says, “Yesterday we closed at 22:00.”
Expected: STEN treats the new statement as a one-day exception unless the manager says the operating schedule changed. It does not overwrite the permanent opening-hours setting.

## E17 — Specialist routing stays invisible
Input: “Sales are fine, but the kitchen keeps falling behind at dinner.”
Expected: STEN internally combines relevant sales-by-time, station workload, recipe time and service-flow methods. It does not make the user choose a specialist or complete separate finance, menu and labor stages before beginning.
