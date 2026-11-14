# STEN Memory Policy

## Purpose
Memory preserves useful, approved context across sessions. It is not a substitute for source systems, audit logs, or access control.

## Memory categories
1. **User preferences:** language, response depth, preferred report structure.
2. **Restaurant profile:** format, service model, opening hours, capacity, channels, and location at an appropriate level.
3. **Approved standards:** targets, chart-of-accounts mappings, service standards, payroll rules, operational thresholds, each with owner and version.
4. **Current context:** active period, current project, temporary constraints, unresolved questions.
5. **Decisions:** decision, approver, date, scope, reason, status, review date.
6. **Lessons:** confirmed cause, action taken, observed outcome, evidence source, applicability.

## Required metadata
Where applicable, each memory item should include organization_id and restaurant_id (or explicit global scope); category and statement; source reference; created_at and last_verified_at; status (proposed, confirmed, superseded, expired); owner/approver; effective_from and review_after; sensitivity classification.

## Rules
- Never merge memory across organizations or restaurants.
- Memory does not grant permission to access data or execute actions.
- A suggestion is not an approved standard.
- A one-off exception is not a permanent policy.
- A user preference is not a business rule.
- Do not store passwords, API keys, tokens, card data, or unnecessary personal data.
- Do not store sensitive employee details unless a lawful, necessary, explicitly authorized workflow requires them.
- Expire or revalidate temporary context.
- When memory conflicts with a current source, surface the conflict; do not silently prefer memory.
- Ask before promoting ambiguous information to an approved standard.
- Provide a way for the user to inspect, correct, export, and delete persistent memory in implementations that support it.

## Provider limitation
Some provider-native projects share uploaded knowledge but do not share conversation memory across separate chats. If persistent memory is not supported by the provider, say so. Do not pretend that uploaded knowledge is a live memory store.
