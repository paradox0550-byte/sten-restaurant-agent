import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "providers/chatgpt/plugin-source");
const dist = path.join(root, "dist");
const packageDir = path.join(dist, "chatgpt-plugin");
const archive = path.join(dist, "sten-ai-chatgpt-plugin.tar.gz");

function fail(message) {
  console.error("ChatGPT plugin build failed: " + message);
  process.exit(1);
}

for (const required of ["plugin.json", ".codex-plugin/plugin.json", "README.md", "skills/SKILLS_CATALOG.md"]) {
  if (!fs.existsSync(path.join(source, required))) fail("missing required source file: " + required);
}

const manifest = JSON.parse(fs.readFileSync(path.join(source, "plugin.json"), "utf8"));
if (manifest.skills !== "./skills") fail('plugin.json must point to "./skills"');

const skillRoot = path.join(source, "skills");
const skillFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name === "SKILL.md" && !full.includes(path.sep + "references" + path.sep)) skillFiles.push(full);
  }
}
walk(skillRoot);
if (skillFiles.length !== 27) fail("expected 27 skill files after migration, found " + skillFiles.length);

const catalog = fs.readFileSync(path.join(skillRoot, "SKILLS_CATALOG.md"), "utf8");
if (!catalog.includes("27 навыков")) fail("skills catalog must declare the verified count of 27 skills");
for (const file of skillFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.trim()) fail("empty skill file: " + path.relative(source, file));
}

fs.rmSync(packageDir, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(source, packageDir, { recursive: true });
// Assemble the plugin's reference bundle from the canonical provider knowledge sources.
const referenceOutput = path.join(packageDir, "skills/sten-core-knowledge/references");
fs.mkdirSync(referenceOutput, { recursive: true });
const knowledgeNames = [
  "01-core-rules-and-evidence.md",
  "02-restaurant-management-and-shift.md",
  "03-guest-service-and-recovery.md",
  "04-food-safety-haccp-marking.md",
  "05-iiko-stock-and-calculator-audit.md",
  "06-menu-engineering-and-kitchen-workforce.md",
  "07-finance-payroll-and-labor.md",
  "08-operational-audit-and-checklists.md",
  "09-stage-11-scope-and-validation.md"
];
for (const name of knowledgeNames) {
  const canonical = path.join(root, "providers/chatgpt/knowledge-pack", name);
  if (!fs.existsSync(canonical)) fail("missing canonical knowledge source: " + name);
  fs.copyFileSync(canonical, path.join(referenceOutput, name));
}
const extraReferences = [
  ["providers/chatgpt/knowledge-pack/README.md", "knowledge-pack-README.md"],
  ["providers/chatgpt/project-instructions-ru.md", "project-instructions-ru.md"],
  ["docs/STAGE_11/GITHUB_COVERAGE_MAP.md", "github-coverage-map.md"]
];
for (const [relativeSource, outputName] of extraReferences) {
  const canonical = path.join(root, relativeSource);
  if (!fs.existsSync(canonical)) fail("missing canonical adapter reference: " + relativeSource);
  fs.copyFileSync(canonical, path.join(referenceOutput, outputName));
}
let revision = process.env.GITHUB_SHA || "unknown";
if (revision === "unknown") {
  try { revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(); }
  catch { /* local source archive may not be inside a Git checkout */ }
}
fs.writeFileSync(path.join(packageDir, "SOURCE_REVISION.txt"), "Repository: paradox0550-byte/sten-restaurant-agent\nRevision: " + revision + "\n", "utf8");
fs.rmSync(archive, { force: true });
execFileSync("tar", ["-czf", archive, "-C", dist, "chatgpt-plugin"], { stdio: "inherit" });
if (!fs.existsSync(archive) || fs.statSync(archive).size === 0) fail("archive was not created");
console.log("Built " + path.relative(root, archive) + " from " + revision + "; " + skillFiles.length + " skills validated.");