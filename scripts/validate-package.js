import fs from "node:fs";
import { execFileSync } from "node:child_process";

function fail(message) {
  console.error(`Package validation failed: ${message}`);
  process.exitCode = 1;
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (error) {
    fail(`cannot read valid JSON from ${path}: ${error.message}`);
    return {};
  }
}

const packageJson = readJson("package.json");
const manifest = readJson("package-manifest.json");
const methodology = readJson("methodology-manifest.json");
const chatgptPlugin = readJson("providers/chatgpt/plugin-source/plugin.json");
const codexPlugin = readJson("providers/chatgpt/plugin-source/.codex-plugin/plugin.json");

if (!Array.isArray(manifest.files)) fail("package-manifest.json must declare files as an array");
if (new Set(manifest.files ?? []).size !== (manifest.files ?? []).length) fail("package-manifest.json contains duplicate file paths");
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split(String.fromCharCode(0)).filter(Boolean).sort();
const declared = [...(manifest.files ?? [])].sort();
const missing = declared.filter((file) => !fs.existsSync(file));
const unlisted = tracked.filter((file) => !declared.includes(file));
if (missing.length) fail(`declared paths do not exist: ${missing.join(", ")}`);
if (unlisted.length) fail(`tracked paths are absent from source manifest: ${unlisted.join(", ")}`);

const tenantFiles = manifest.tenant_distribution?.files ?? [];
const tenantSet = new Set(tenantFiles);
if (!tenantFiles.length || tenantSet.size !== tenantFiles.length) fail("tenant_distribution.files must be a non-empty unique allowlist");
for (const file of tenantFiles) {
  if (!declared.includes(file)) fail(`tenant distribution path is not in source manifest: ${file}`);
  if (!fs.existsSync(file)) fail(`tenant distribution path does not exist: ${file}`);
}
const forbiddenTenantPaths = tenantFiles.filter((file) => /(^|\\/)(evidence|research|source-crosswalk|sources\\.json|registry\\.json)(\\/|$)/i.test(file));
if (forbiddenTenantPaths.length) fail(`tenant distribution includes internal provenance paths: ${forbiddenTenantPaths.join(", ")}`);
if (!String(manifest.tenant_distribution?.security_note ?? "").includes("public repository")) {
  fail("tenant distribution must disclose that archive exclusion does not make public repository files private");
}

const versions = {
  package: packageJson.version,
  distribution: manifest.version,
  methodology: methodology.version,
  chatgptPlugin: chatgptPlugin.version,
  codexPlugin: codexPlugin.version
};
const invalidVersions = Object.entries(versions).filter(([, version]) => typeof version !== "string" || !/^\\d+\\.\\d+\\.\\d+(?:-[0-9A-Za-z.-]+)?$/.test(version));
if (invalidVersions.length) fail(`invalid semantic version fields: ${JSON.stringify(invalidVersions)}`);
if (new Set(Object.values(versions)).size !== 1) fail(`version mismatch across release manifests: ${JSON.stringify(versions)}`);

if (!manifest.stage_integration?.includes(14)) fail("package manifest does not include Stage 14");
if (manifest.stage_status?.["11"] !== "foundation_integrated_substantive_validation_open") fail("Stage 11 must remain explicitly open for substantive validation");
if (!String(manifest.stage_status?.["14"] ?? "").includes("in_progress")) fail("Stage 14 status must not be marked closed before release gates pass");

const claudeMcp = readJson("providers/claude/mcp-config.json");
if (!claudeMcp || typeof claudeMcp.mcpServers !== "object" || Array.isArray(claudeMcp.mcpServers)) fail("Claude MCP configuration must expose an mcpServers object");
const openapi = fs.readFileSync("providers/chatgpt/actions.openapi.yaml", "utf8");
if (!openapi.includes("openapi: 3.1.0") || !openapi.includes("YOUR_DEPLOYED_DUMRAUF_API_HOST")) fail("ChatGPT OpenAPI adapter must remain an explicitly unconfigured 3.1 template");

if (!process.exitCode) console.log(`Package verified: ${tracked.length} tracked source files, ${declared.length} source-manifest paths, ${tenantFiles.length} tenant-facing files, ${Object.keys(versions).length} synchronized release versions (${packageJson.version}).`);
