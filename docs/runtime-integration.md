# Stage 6 — Runtime & Integration Layer

## Purpose
Stage 6 introduces a provider-neutral execution boundary over the Stage 1–5 methodology. The host application injects provider, tool, memory and audit adapters. STEN does not make vendor network calls or persist production data itself.

## Modules
- src/runtime/provider-registry.js — register and resolve provider adapters implementing complete(request).
- src/runtime/tool-registry.js — register deterministic tools; execution requires an explicit per-call permission and argument validation.
- src/runtime/tenant-memory.js — development/test in-memory adapter, namespaced by tenantId. Replace before production.
- src/runtime/audit.js — development/test audit sink, tenant-filtered; records event metadata, not tool argument payloads.
- src/runtime/runtime.js — orchestrates memory reads, explicitly requested tool calls and one provider completion call.
- src/runtime/errors.js — stable error codes and tenant identity validation.

## Runtime contract
createStenRuntime({ providers, tools, memory, audit, clock? }) returns:
- run({ tenantId, providerId, messages?, toolCalls?, permissions?, memoryReads? })
- readMemory({ tenantId, namespace, key })
- writeMemory({ tenantId, namespace, key, value })

Every operation requires a tenantId. Tool execution is deny-by-default: a tool must be registered and its exact name must appear in permissions for that call. Tool schemas validate required fields, primitive types, enums and unexpected properties. Tool failures are returned as per-call errors and audited; provider failures propagate to the caller.

## Security and production boundaries
- Provider adapters are injected by the host; no API keys or vendor SDKs are included.
- The runtime does not implement end-user authentication. The host must authenticate the caller and derive tenantId and permissions from trusted server-side identity, never from untrusted model output.
- The in-memory memory and audit adapters are for development/tests only. They are not encrypted, durable, distributed or production-grade.
- A production deployment must supply persistent tenant-partitioned storage, access controls, encryption, retention/deletion policies, secrets management, rate limits and an independently protected audit store.
- Do not expose unrestricted filesystem, shell, SQL, network or arbitrary-code tools to the model.
- Tool permissions must be granted by trusted application policy, not by a model-generated request.

## Stage 6 acceptance scope
CI tests provider injection, tenant-required operations, permission-gated tool calls, argument validation, tenant memory isolation, copy boundaries, audit tenant filtering and provider error propagation. Passing these tests verifies the runtime foundation, not production security certification or live provider connectivity.
