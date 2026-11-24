import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "package-manifest.json"), "utf8"));
const declared = [...(manifest.tenant_distribution?.files ?? [])].sort();
if (!declared.length) throw new Error("tenant_distribution.files must be a non-empty allowlist");

const version = packageJson.version;
const prefix = `dumrauf-knowledge-pack-${version}`;
const outputDir = path.join(root, "dist");
const archivePath = path.join(outputDir, `${prefix}.zip`);
fs.mkdirSync(outputDir, { recursive: true });
if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);

execFileSync("git", [
  "archive", "--format=zip", "-o", archivePath, `--prefix=${prefix}/`, "HEAD", "--", ...declared
], { stdio: "inherit" });

const listing = execFileSync("unzip", ["-Z1", archivePath], { encoding: "utf8" })
  .split(/\r?\n/).filter((entry) => entry && !entry.endsWith("/"))
  .map((entry) => entry.startsWith(`${prefix}/`) ? entry.slice(prefix.length + 1) : entry).sort();
const missing = declared.filter((file) => !listing.includes(file));
const extra = listing.filter((file) => !declared.includes(file));
if (missing.length || extra.length) {
  console.error("Tenant archive does not match its allowlist.");
  if (missing.length) console.error("Missing:", missing.join(", "));
  if (extra.length) console.error("Unexpected:", extra.join(", "));
  process.exit(1);
}

const archive = fs.readFileSync(archivePath);
const digest = crypto.createHash("sha256").update(archive).digest("hex");
fs.writeFileSync(path.join(outputDir, "SHA256SUMS.txt"), `${digest}  ${path.basename(archivePath)}\n`);
fs.writeFileSync(path.join(outputDir, "CONTENTS.txt"), listing.map((file) => `${prefix}/${file}`).join("\n") + "\n");
console.log(`Tenant knowledge pack created and verified: ${archivePath}`);
console.log(`Allowlisted files: ${declared.length}; archive files: ${listing.length}`);
console.log(`SHA-256: ${digest}`);
