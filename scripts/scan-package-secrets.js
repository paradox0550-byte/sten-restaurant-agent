import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split(String.fromCharCode(0))
  .filter(Boolean);

const textExtensions = new Set([
  ".js", ".mjs", ".cjs", ".json", ".md", ".txt", ".yaml", ".yml",
  ".toml", ".xml", ".html", ".css", ".sh", ".env", ".properties",
  ".sql", ".py", ".ts", ".tsx", ".jsx", ".csv"
]);

const patterns = [
  ["PEM private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["AWS access key ID", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["OpenAI-style API key", /\bsk-[A-Za-z0-9_-]{32,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/]
];

const findings = [];
let scanned = 0;
let historyScanned = 0;

for (const file of files) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;

  const content = fs.readFileSync(file, "utf8");
  if (content.includes("\0")) continue;
  scanned += 1;

  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    for (const [label, pattern] of patterns) {
      if (pattern.test(lines[index])) {
        findings.push({ file, line: index + 1, label });
      }
    }
  }
}

// Inspect every reachable commit diff as well. CI must use fetch-depth: 0 for this
// pass to cover the complete repository history available to the checkout.
const historyPatch = execFileSync(
  "git",
  ["log", "--all", "-p", "--format=", "--no-ext-diff", "--"],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
);
let historyFile = "unknown-history-path";
let historyLine = 0;

for (const line of historyPatch.split(/\\r?\\n/)) {
  if (line.startsWith("+++ b/")) {
    historyFile = line.slice(6);
    historyLine = 0;
    continue;
  }
  if (line.startsWith("+") && !line.startsWith("+++")) {
    historyLine += 1;
    const added = line.slice(1);
    for (const [label, pattern] of patterns) {
      if (pattern.test(added)) {
        findings.push({ file: `history:${historyFile}`, line: historyLine, label });
      }
    }
    historyScanned += 1;
  }
}

if (findings.length) {
  console.error(`Potential secrets found in ${findings.length} location(s):`);
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} — ${finding.label}`);
  }
  console.error("Remove the secret from the current files and rotate it if it was real. Also inspect Git history.");
  process.exitCode = 1;
} else {
  console.log(`Secret pattern scan passed: ${scanned} tracked text files and ${historyScanned} added history lines scanned; no high-confidence credential patterns found.`);
  console.log("This checks reachable Git history and the current snapshot for selected credential formats. It is not a complete personal-data or commercial-confidentiality audit.");
}
