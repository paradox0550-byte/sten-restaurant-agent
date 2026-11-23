# Stage 6 — Runtime & Integration Layer

## Purpose
Stage 6 provides a provider-neutral execution boundary over the STEN methodology. The host injects provider, tool, memory, audit and approval-ledger adapters. STEN does not make vendor network calls or persist production data by itself.

## Modules
- `src/runtime/provider-registry.js` — register and resolve provider adapters implementing `complete(request)`.
- `src/runtime/tool-registry.js` — register tools; execution requires explicit per-call permission, schema validation and (by default) explicit approval.
- `src/runtime/tenant-memory.js` — development/test in-memory adapter, namespaced by tenantId. Replace before production.
- `src/runtime/audit.js` — development/test audit sink, tenant-filtered; records event metadata, not tool argument payloads.
- `src/runtime/approval-store.js` — approval-consumption adapter. The included in-memory store is for tests/development; production hosts must inject a durable atomic implementation.
- `src/runtime/runtime.js` — explicit tool execution plus a bounded provider/tool loop with pause/resume at approval gates.
- `src/runtime/knowledge-capture.js` — structured restaurant-memory candidate validation, conservative capture, deduplication, conflict preservation and explicit confirmation.
- `src/runtime/errors.js` — stable error codes and tenant identity validation.

## Runtime contract
`createStenRuntime({ providers, tools, memory, audit, approvalStore?, clock? })` returns:
- `run({ tenantId, providerId, messages?, toolCalls?, permissions?, approvedToolCalls?, memoryReads? })` — one explicit tool batch and one provider completion.
- `runAgent({ tenantId, providerId, messages?, permissions?, approvedToolCalls?, pendingToolCalls?, memoryReads?, maxSteps? })` — bounded plan/tool/observe loop; `maxSteps` is 1–20 and defaults to 8.
- `readMemory({ tenantId, namespace, key })`
- `writeMemory({ tenantId, namespace, key, value })`

### Provider adapter contract for runAgent
The injected provider's `complete(request)` may return:
- `{ text, message?, toolCalls: [{ id, name, args }] }` when requesting tools; each call needs a stable unique ID.
- `{ text, message? }` when the assistant turn is complete.

After each tool batch, the runtime appends the assistant/tool result records to the transcript and calls the provider again. It stops on a final provider response, a human-approval pause, a tool error, or the step limit. The runtime returns all tool outcomes across the loop. Each provider turn is limited to 10 tool calls and one run is limited to 40 total tool calls to bound runaway execution. This is a host adapter contract; it does not claim compatibility with every provider's native wire format without an adapter.

### Approval pause and resume
Tool registrations default to `approval: "required"`. Deterministic, read-only tools may be explicitly allowlisted with `approval: "not_required"`. Permissions must still be granted by trusted host policy in both cases.

For an approval-gated action:
1. The runtime returns `status: "awaiting_approval"`, the exact `approvalRequests`, `pendingToolCalls` and `resumeMessages`.
2. The host displays the exact action and its arguments to an authorized person; approval must not be inferred from model text or tool permissions. The returned approval request is a data record, not a cryptographic signature: the host must protect it against tampering and bind the approval to an authenticated actor.
3. The host resumes by passing the returned `pendingToolCalls`, `approvalRequests` as `approvedToolCalls`, and `resumeMessages` as `messages`.
4. The approval is bound to tenant, tool, call ID and exact arguments. A changed payload, tool or tenant does not match.
5. The approval ledger consumes each exact approval once. Replays return `TOOL_APPROVAL_REPLAYED`. Consumption occurs immediately before execution; if execution itself fails, the host must request a fresh approval before retrying.

The included `InMemoryApprovalStore` shares replay protection only among runtime instances that share that object and only for the lifetime of the process. Production must inject a durable, atomic `consume({ tenantId, fingerprint })` implementation backed by persistent storage with a uniqueness/transaction guarantee. It must return `true` only for the first successful consumption and `false` for every replay. Persist pending calls and resume transcripts securely as well. The package does not claim durable workflow recovery by itself.

## Security and production boundaries
- Provider adapters are injected by the host; no API keys or vendor SDKs are included.
- The runtime does not implement end-user authentication. The host must authenticate the caller and derive tenantId, actor and permissions from trusted server-side identity, never from untrusted model output.
- The in-memory memory, audit and approval adapters are development/test implementations only. They are not encrypted, durable, distributed or production-grade.
- A production host must supply persistent tenant-partitioned storage, access controls, encryption, retention/deletion policies, secrets management, rate limits, durable approval consumption and an independently protected audit store.
- Do not expose unrestricted filesystem, shell, SQL, network or arbitrary-code tools to the model.
- Tool schema validation is a safety boundary, not a substitute for business-rule validation, authorization at the resource layer, or idempotency in downstream systems.
- Consequential external systems should accept idempotency keys and enforce authorization independently. The runtime cannot guarantee exactly-once external side effects if a process crashes after a remote action succeeds but before the host records the result.
- Provider errors propagate to the host. Tool errors are returned per call and audited. Missing memory remains explicit as `not_found`, not an empty factual record.

## Stage 6 acceptance scope
CI covers provider injection, tenant-required operations, permission-gated tools, default approval gates, exact-payload matching, one-time approval replay protection across runtime instances sharing an approval store, bounded agent loops, pause/resume, argument validation, tenant memory isolation, copy boundaries, audit tenant filtering and provider error propagation. Passing these tests verifies this runtime foundation; it is not production security certification, durable deployment or live provider connectivity.
