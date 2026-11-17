# iiko Stock Accounting and Accountant-Calculator Audit

## Source basis

Source: supplied *Чек-лист проверки калькулятора.pdf*, 13 pages, attributed in the file to @av.buravtsova / Anastasia Buravtsova. The checklist says its purpose is to assess the accountant-calculator's qualification and the quality of stock accounting in iiko.

This is a source-specific audit checklist. It is not a universal statement of iiko configuration or accounting policy. Document colors, document names, article names, report fields and time settings can vary by system version and restaurant configuration.

## 10 audit sections from the source

### 1. Nomenclature directory
- Exclamation marks should appear only on informational modifiers.
- Nomenclature tree should be structured; no items should remain outside groups.
- Used dishes/preparations should not show an asterisk in the «Себестоимость, руб» column.

### 2. Incoming invoices
- No unposted (blue) documents.
- No documents with total amount equal to zero.
- System invoices correspond to paper/source documents.
- «Входящий номер» field is completed, except for the market/shop receipts described in the source.

### 3. Outgoing invoices
- No unposted (blue) documents.
- No documents with total amount equal to zero.
- Shipment amount is greater than cost amount, according to the source's stated check. This rule must be interpreted against the actual document type, pricing method and internal transfer policy before treating it as a universal control.

### 4. Write-off acts
- No unposted documents.
- No zero-amount documents.
- No documents under the article «Расход продуктов» as described by the source.
- No manual documents under the article «Удаление блюд со списанием» as described by the source.

The exact article names and expected behavior require confirmation in the restaurant's current accounting policy.

### 5. Processing/transformation acts
- No unposted documents.
- Transformations should involve only substitutable items that are close in cost and have comparable properties, as the source describes.

Do not treat a cost similarity alone as proof that two products are operationally interchangeable.

### 6. Preparation, disassembly, internal transfers and returns
- No unposted documents.
- No zero-amount documents.

The checklist groups several document types. Audit each according to its actual purpose and approved workflow.

### 7. Sales realization acts
- No unposted documents.
- Document time should be at or after 23:00 in the source's example.
- No manual documents.

The 23:00 time is a historical/source-specific check and must not be applied unless it matches the restaurant's close-of-day and POS integration rules.

### 8. Stock balance report
The source asks to check for absence of:
- balances on dishes (often with unit of measure «порц»);
- balances on services;
- balances on deleted/struck-through items.

These may indicate mapping, stock-accounting or configuration issues; inspect the exact row and item before deciding that a balance is erroneous.

### 9. Month-end inventories
- No unposted inventory documents.
- Inventory exists for every warehouse.
- Document time is 23:59 in the source.
- No negative ending balances in the stock movement report (РОСВ) for each warehouse; the report's «По» date should match the corresponding inventory date.
- Ending balances in РОСВ for each warehouse match the total at step 3 of the corresponding inventory; dates must match.

The 23:59 timestamp and report path are source-specific configuration details, not a universal accounting rule.

### 10. Period lock date
The source asks to confirm that the trade enterprise settings contain the final lock date for the previous reporting period, meaning the period is closed.

## Recommended STEN audit output

For each section return:
- status: pass / finding / not checked / not applicable / unknown;
- exact document/report/warehouse/item;
- source period and date;
- observed value and expected value, if the expectation is supported;
- screenshot/export/document reference;
- amount or stock impact only if calculable;
- possible explanation, explicitly labelled hypothesis;
- owner role, corrective action and verification evidence.

Never mark a check as passed merely because the user has not supplied a report. Use **not checked / no data**.

## Required input set for an actual audit

Ask for only the smallest export needed after scoping:
- restaurant/outlet and iiko version/configuration if relevant;
- audit period;
- warehouses in scope;
- reports/documents for the checklist section being checked;
- corresponding paper/source documents when reconciliation is required;
- approved accounting rules for transfer, write-off, transformation and close-of-day.

Do not ask for all ten report groups before inspecting the first supplied file.

## Guardrails

- Do not post, reverse, delete or edit iiko documents.
- Do not infer zero from a blank amount or missing row.
- Do not treat a warning icon as an error without inspecting its item and configuration.
- Do not assume all manual documents are invalid without the approved workflow.
- Do not use source-specific 23:00 or 23:59 times unless confirmed for the current setup.
- This checklist does not replace accounting reconciliation, stocktaking or an authorized accountant's sign-off.

---

## Stage 11 professional practice expansion — POS orders, stocktake and suppliers

**Provenance:** anonymized practical materials S11-05 (historical mobile POS workflow), S11-02 (stocktake), S11-09 (procurement). Interface screenshots and local inventory schedules are not current software documentation.

### Order integrity independent of POS brand
Before sending: confirm table/guest and order ownership, exact items, quantities, modifiers, allergens or restrictions communicated by the guest, courses and agreed timing. After sending: verify correct routing and changes; follow permissioned procedures for cancellations, discounts, split bills and corrections. Never claim a particular screen or button exists in the user's software version without checking it.

### Inventory control
Prepare a frozen or reconciled cutoff, complete goods movements, identify counting zones and units, assign counters and independent review, separate open containers and sealed packs, and prevent double counting or unrecorded movements. Count actual stock, then compare to system quantities using conversion factors and recorded movements. Investigate variance by item, unit, location and document trail; document approved corrections and recheck. A historical practice of twice-monthly counting or counting on a particular weekday is not a universal requirement.

### Supplier-to-stock chain
Forecast demand using menu, expected load and existing stock; approve purchase against authorization; evaluate supplier reliability and product specifications; check deliveries for identity, quantity, condition and traceability; register acceptance or discrepancy; route approved stock to correct storage; monitor recurring claims. The lowest purchase price is not automatically the lowest total cost. Keep physical quantity variance distinct from cost variance.
