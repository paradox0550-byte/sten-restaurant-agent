import { createHash } from "node:crypto";
import { RuntimeError, requireTenantId } from "./errors.js";
import { InMemoryApprovalStore } from "./approval-store.js";

function stableJson(value) {
  if (Array.isArray(value)) return "[" + value.map(stableJson).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.keys(value).sort().map(key => JSON.stringify(key) + ":" + stableJson(value[key])).join(",") + "}";
  return JSON.stringify(value);
}
function approvalFingerprint(request) {
  return createHash("sha256").update(stableJson(request)).digest("hex");
}
function validateRunInput({ messages, toolCalls, memoryReads, approvedToolCalls, permissions, maxSteps }) {
  if (!Array.isArray(messages) || !Array.isArray(toolCalls) || !Array.isArray(memoryReads) || !Array.isArray(approvedToolCalls) || !Array.isArray(permissions)) {
    throw new RuntimeError("INVALID_REQUEST", "messages, toolCalls, memoryReads, approvedToolCalls and permissions must be arrays.");
  }
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 20) throw new RuntimeError("INVALID_MAX_STEPS", "maxSteps must be an integer from 1 to 20.");
}
function callId(call) {
  return typeof call?.id === "string" && call.id.trim() ? call.id : null;
}

/** Provider-neutral runtime. The host injects all I/O adapters and trusted permissions. */
export function createStenRuntime({ providers, tools, memory, audit, approvalStore = new InMemoryApprovalStore(), clock = () => new Date().toISOString() } = {}) {
  if (!providers || !tools || !memory || !audit || !approvalStore || typeof approvalStore.consume !== "function") {
    throw new RuntimeError("RUNTIME_DEPENDENCIES_REQUIRED", "providers, tools, memory, audit and an approvalStore adapter are required.");
  }

  async function loadMemory(tenantId, memoryReads) {
    const context = [];
    for (const item of memoryReads) context.push(await memory.get({ ...item, tenantId }));
    return context;
  }

  async function executeCalls({ tenantId, toolCalls, permissions, approvedToolCalls }) {
    const results = [];
    const descriptions = tools.describe();
    for (const call of toolCalls) {
      const id = callId(call);
      const request = { callId: id, toolName: call?.name ?? null, tenantId, args: structuredClone(call?.args ?? {}) };
      const descriptor = descriptions.find(tool => tool.name === call?.name);
      const approvalRequired = descriptor?.requiresApproval === true;
      const approved = approvalRequired && approvedToolCalls.some(item =>
        item && item.callId === request.callId && item.toolName === request.toolName &&
        item.tenantId === tenantId && stableJson(item.args ?? {}) === stableJson(request.args)
      );
      try {
        const result = await tools.execute({ ...call, callId: id, tenantId, permissions, approved });
        if (approved) {
          const consumed = await approvalStore.consume({ tenantId, fingerprint: approvalFingerprint(request) });
          if (!consumed) {
            results.push({ id, name: call.name, status: "error", error: { code: "TOOL_APPROVAL_REPLAYED", message: "This approval has already been consumed; request a new approval." } });
            await audit.write({ tenantId, type: "tool.approval_replayed", at: clock(), outcome: "error", metadata: { tool: call.name, callId: id } });
            continue;
          }
        }
        results.push({ id, name: call.name, status: "success", result });
        await audit.write({ tenantId, type: "tool.execution", at: clock(), outcome: "success", metadata: { tool: call.name, callId: id, approved } });
      } catch (error) {
        const awaitingApproval = error.code === "TOOL_APPROVAL_REQUIRED";
        const status = awaitingApproval ? "awaiting_approval" : "error";
        results.push({
          id, name: call?.name ?? null, status,
          error: { code: error.code ?? "TOOL_EXECUTION_FAILED", message: error.message },
          ...(awaitingApproval ? { approvalRequest: request } : {})
        });
        await audit.write({ tenantId, type: awaitingApproval ? "tool.approval_required" : "tool.execution", at: clock(), outcome: status, metadata: { tool: call?.name ?? null, callId: id, code: error.code ?? "TOOL_EXECUTION_FAILED" } });
      }
    }
    return results;
  }

  async function run({ tenantId, providerId, messages = [], toolCalls = [], permissions = [], approvedToolCalls = [], memoryReads = [], maxSteps = 8 } = {}) {
    const tenant = requireTenantId(tenantId);
    validateRunInput({ messages, toolCalls, memoryReads, approvedToolCalls, permissions, maxSteps });
    const provider = providers.get(providerId);
    const memoryContext = await loadMemory(tenant, memoryReads);
    const toolResults = await executeCalls({ tenantId: tenant, toolCalls, permissions, approvedToolCalls });
    const response = await provider.complete({ tenantId: tenant, messages: structuredClone(messages), memory: memoryContext, toolResults, availableTools: tools.describe() });
    await audit.write({ tenantId: tenant, type: "provider.completion", at: clock(), outcome: "success", metadata: { provider: providerId, toolCount: toolCalls.length } });
    const status = toolResults.some(item => item.status === "awaiting_approval") ? "awaiting_approval"
      : toolResults.some(item => item.status === "error") ? "needs_attention" : "completed";
    return { status, providerId, memory: memoryContext, toolResults, response };
  }

  async function runAgent({ tenantId, providerId, messages = [], permissions = [], approvedToolCalls = [], pendingToolCalls = [], memoryReads = [], maxSteps = 8 } = {}) {
    const tenant = requireTenantId(tenantId);
    validateRunInput({ messages, toolCalls: pendingToolCalls, memoryReads, approvedToolCalls, permissions, maxSteps });
    const provider = providers.get(providerId);
    const transcript = structuredClone(messages);
    const memoryContext = await loadMemory(tenant, memoryReads);
    let totalToolCalls = 0;
    let lastResponse = null;

    // Resume a human-approved action before asking the model to plan another step.
    if (pendingToolCalls.length) {
      const resumed = await executeCalls({ tenantId: tenant, toolCalls: pendingToolCalls, permissions, approvedToolCalls });
      totalToolCalls += pendingToolCalls.length;
      const pending = resumed.filter(item => item.status === "awaiting_approval");
      if (pending.length) return { status: "awaiting_approval", providerId, steps: 0, memory: memoryContext, toolResults: resumed, pendingToolCalls, response: null };
      transcript.push({ role: "tool", content: JSON.stringify(resumed) });
      if (resumed.some(item => item.status === "error")) return { status: "needs_attention", providerId, steps: 0, memory: memoryContext, toolResults: resumed, response: null };
    }

    for (let step = 1; step <= maxSteps; step += 1) {
      lastResponse = await provider.complete({ tenantId: tenant, messages: structuredClone(transcript), memory: memoryContext, availableTools: tools.describe(), step, maxSteps });
      const generatedCalls = lastResponse?.toolCalls ?? lastResponse?.tool_calls ?? [];
      if (!Array.isArray(generatedCalls)) throw new RuntimeError("PROVIDER_TOOL_CALLS_INVALID", "Provider toolCalls must be an array.");
      if (generatedCalls.length === 0) {
        await audit.write({ tenantId: tenant, type: "agent.completed", at: clock(), outcome: "success", metadata: { provider: providerId, steps: step, toolCount: totalToolCalls } });
        return { status: "completed", providerId, steps: step, memory: memoryContext, toolResults: [], response: lastResponse };
      }
      totalToolCalls += generatedCalls.length;
      transcript.push(lastResponse.message && typeof lastResponse.message === "object"
        ? structuredClone(lastResponse.message)
        : { role: "assistant", content: typeof lastResponse.text === "string" ? lastResponse.text : "" });
      const results = await executeCalls({ tenantId: tenant, toolCalls: generatedCalls, permissions, approvedToolCalls });
      const pending = results.filter(item => item.status === "awaiting_approval");
      transcript.push({ role: "tool", content: JSON.stringify(results) });
      if (pending.length) {
        await audit.write({ tenantId: tenant, type: "agent.paused_for_approval", at: clock(), outcome: "awaiting_approval", metadata: { provider: providerId, step, pendingCount: pending.length } });
        return {
          status: "awaiting_approval", providerId, steps: step, memory: memoryContext,
          toolResults: results, pendingToolCalls: generatedCalls.filter(call => pending.some(item => item.id === callId(call))),
          approvalRequests: pending.map(item => item.approvalRequest), response: lastResponse
        };
      }
      if (results.some(item => item.status === "error")) {
        return { status: "needs_attention", providerId, steps: step, memory: memoryContext, toolResults: results, response: lastResponse };
      }
    }
    await audit.write({ tenantId: tenant, type: "agent.step_limit_reached", at: clock(), outcome: "needs_attention", metadata: { provider: providerId, maxSteps, toolCount: totalToolCalls } });
    return { status: "max_steps_reached", providerId, steps: maxSteps, memory: memoryContext, toolResults: [], response: lastResponse };
  }

  return Object.freeze({
    run,
    runAgent,
    async readMemory({ tenantId, namespace, key }) { return memory.get({ tenantId: requireTenantId(tenantId), namespace, key }); },
    async writeMemory({ tenantId, namespace, key, value }) {
      const tenant = requireTenantId(tenantId);
      const result = await memory.set({ tenantId: tenant, namespace, key, value });
      await audit.write({ tenantId: tenant, type: "memory.write", at: clock(), outcome: "success", metadata: { namespace, key } });
      return result;
    }
  });
}