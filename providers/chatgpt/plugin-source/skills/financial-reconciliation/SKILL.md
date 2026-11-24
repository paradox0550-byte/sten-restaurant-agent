---
name: financial-reconciliation
description: Use when comparing bank statements, acquiring reports, POS/iiko exports, OFD fiscal data, cash reports, refunds, bonuses, deposits or other restaurant payment and revenue sources.
---

# Financial reconciliation

## Objective
Build a traceable bridge between independent data sources and explain differences without forcing them to match. Preserve original transaction descriptions and source terminology.

## Establish before matching
Identify reporting period and timezone, legal entity, restaurant/outlet, currency, gross/net basis, transaction versus settlement date, payment channels, terminal IDs, merchant IDs, bank accounts, acquiring providers, refund treatment, commissions and cut-off rules.

## Reconciliation method
1. Inventory each source and its coverage. Record row counts and source totals.
2. Preserve raw data. Create normalized helper fields without overwriting original descriptions.
3. Classify inflows and outflows separately: sales/acquiring settlements, cash deposits, refunds, chargebacks, transfers between own accounts, loans, owner funding, bonuses/subsidies, corrections, fees and unknown items. Classification must be evidence-based; uncertain rows stay **Unclassified**.
4. Match using strongest identifiers first: transaction/reference ID, terminal/merchant ID, batch ID, amount + date/time, then documented tolerances. Never match solely because amounts look similar if multiple candidates exist.
5. Account for settlement lags, commissions, split settlements, refunds, voids, tips, cash, QR payments and payment-provider aggregation where source evidence supports them.
6. Build a bridge: source A total → identified timing differences → commissions/fees → refunds/chargebacks → transfers/non-sales → unresolved difference → source B total.
7. List unmatched records on both sides with original descriptions, dates, amounts, IDs and reason codes.
8. Recalculate all subtotals and ensure the bridge arithmetic balances. If it does not, say so.

## Strict controls
- Do not assume all bank credits are restaurant revenue.
- Do not assume OFD fiscal sales equal bank settlements: payment timing, cash, refunds, fiscalization and acquiring cut-offs differ.
- Do not classify an incoming transfer as sales without evidence.
- Do not infer that a premium/loyalty bonus is or is not in POS revenue unless the data provides a reliable transaction-level join or a clearly supported aggregate test.
- Do not net refunds against sales without showing the gross and refund amounts separately.
- Never manufacture a balancing adjustment.

## Output
1. Sources and coverage.
2. Reconciliation summary table with source totals and comparable totals.
3. Bridge of differences, each line sourced and calculated.
4. Original-name classification of bank inflows/outflows.
5. Matched / unmatched detail.
6. Unresolved items and exact evidence needed to close them.

Use statuses: **Matched**, **Timing difference**, **Explained difference**, **Unmatched**, **Needs evidence**. A reconciliation is closed only when the remaining difference is zero or explicitly accepted and documented by the user.
