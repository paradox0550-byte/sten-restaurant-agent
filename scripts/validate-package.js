import fs from "node:fs";
import { execFileSync } from "node:child_process";

function fail(message) {
  console.error(`Package validation failed: ${message}`);
  process.exitCode = 1;
}

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("package-manifest.json", "utf8"));
const methodology = JSON.parse(fs.readFileSync("methodology-manifest.json", "utf8"));

if (new Set(manifest.files).size !== manifest.files.length) {
  fail("package-manifest.json contains duplicate file paths");
}

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\\0")
  .filter(Boolean)
  .sort();
const declared = [...manifest.files].sort();
const missing = declared.filter((path) => !fs.existsSync(path));
const unlisted = tracked.filter((path) => !declared.includes(path));

if (missing.length) fail(`declared paths do not exist: ${missing.join(", ")}`);
if (unlisted.length) fail(`tracked paths are absent from manifest: ${unlisted.join(", ")}`);

const versions = {
  package: packageJson.version,
  distribution: manifest.version,
  methodology: methodology.version
};
if (new Set(Object.values(versions)).size !== 1) {
  fail(`version mismatch: ${JSON.stringify(versions)}`);
}

if (!manifest.stage_integration.includes(14)) {
  fail("package manifest does not include Stage 14");
}
if (manifest.stage_status?.["11"] !== "foundation_integrated_substantive_validation_open") {
  fail("Stage 11 must remain explicitly open for substantive validation");
}
if (!String(manifest.stage_status?.["14"] ?? "").includes("in_progress")) {
  fail("Stage 14 status must not be marked closed before release gates pass");
}

const claudeMcp = JSON.parse(fs.readFileSync("providers/claude/mcp-config.json", "utf8"));
if (!claudeMcp || typeof claudeMcp.mcpServers !== "object" || Array.isArray(claudeMcp.mcpServers)) {
  fail("Claude MCP configuration must expose an mcpServers object");
}

const openapi = fs.readFileSync("providers/chatgpt/actions.openapi.yaml", "utf8");
if (!openapi.includes("openapi: 3.1.0") || !openapi.includes("YOUR_DEPLOYED_STEN_API_HOST")) {
  fail("ChatGPT OpenAPI adapter must remain an explicitly unconfigured 3.1 template");
}

if (!process.exitCode) {
  console.log(`Package verified: ${tracked.length} tracked files, ${declared.length} manifest paths, version ${packageJson.version}; provider templates and stage status are consistent.`);
}
