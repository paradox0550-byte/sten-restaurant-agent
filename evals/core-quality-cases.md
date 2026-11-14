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
