import { RuntimeError, requireTenantId } from "./errors.js";

/** Development/test only. Production hosts must inject an atomic, durable implementation. */
export class InMemoryApprovalStore {
  #consumed = new Set();
  async consume({ tenantId, fingerprint } = {}) {
    const tenant = requireTenantId(tenantId);
    if (typeof fingerprint !== "string" || !fingerprint) throw new RuntimeError("APPROVAL_FINGERPRINT_REQUIRED", "An approval fingerprint is required.");
    const key = JSON.stringify([tenant, fingerprint]);
    if (this.#consumed.has(key)) return false;
    this.#consumed.add(key);
    return true;
  }
}