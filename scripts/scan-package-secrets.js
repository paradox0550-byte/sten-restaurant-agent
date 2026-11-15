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

if (findings.length) {
  console.error(`Potential secrets found in ${findings.length} location(s):`);
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} — ${finding.label}`);
  }
  console.error("Remove the secret from the current files and rotate it if it was real. Also inspect Git history.");
  process.exitCode = 1;
} else {
  console.log(`Secret pattern scan passed: ${scanned} tracked text files scanned; no high-confidence credential patterns found.`);
  console.log("This is a pattern scan of the current tracked snapshot, not a history scan or a complete personal-data audit.");
}
