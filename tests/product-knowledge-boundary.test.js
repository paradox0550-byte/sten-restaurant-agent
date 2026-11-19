import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync(new URL("../package-manifest.json", import.meta.url), "utf8"));
const tenantFiles = manifest.tenant_distribution?.files ?? [];
const forbidden = [
  /HACCP-AUDIT/i, /Food Audit/i, /Service Inspector/i, /Gastro Port/i,
  /Movenpik/i, /Курорт Красная Поляна/i, /ТРАТТОРИЯ/i, /Пандан/i,
  /Dumrauf/i, /Ogark/i, /Буровцова/i, /Gmail thread\s+[a-f0-9]+/i,
  /\bS11-\d{2}\b/i, /\bsource\.[a-z0-9-]+/i, /\bpractice\.[a-z0-9-]+/i
];

test("tenant distribution is an explicit, unique allowlist", () => {
  assert.ok(tenantFiles.length >= 10);
  assert.equal(new Set(tenantFiles).size, tenantFiles.length);
  assert.ok(tenantFiles.every(file => manifest.files.includes(file)));
});

test("tenant-facing knowledge contains no configured private source identities or locators", () => {
  const leaks = [];
  for (const file of tenantFiles) {
    const content = fs.readFileSync(new URL("../" + file, import.meta.url), "utf8");
    for (const pattern of forbidden) if (pattern.test(content)) leaks.push(file + ": " + pattern);
  }
  assert.deepEqual(leaks, []);
});

test("private provenance files are excluded from the tenant distribution", () => {
  for (const file of manifest.tenant_distribution.excluded_private_or_internal_paths) {
    assert.equal(tenantFiles.includes(file), false, file);
  }
  assert.match(manifest.tenant_distribution.security_note, /public repository/);
});
