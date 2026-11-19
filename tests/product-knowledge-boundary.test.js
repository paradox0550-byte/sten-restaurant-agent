import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const packDir = new URL("../providers/chatgpt/knowledge-pack/", import.meta.url);
const files = fs.readdirSync(packDir).filter(name => name.endsWith(".md"));
const pack = files.map(name => ({name, text:fs.readFileSync(new URL(name, packDir), "utf8")}));
const forbidden = [
  /HACCP-AUDIT/i,
  /Food Audit/i,
  /Service Inspector/i,
  /Gastro Port/i,
  /Movenpik/i,
  /Курорт Красная Поляна/i,
  /ТРАТТОРИЯ/i,
  /Пандан/i,
  /Dumrauf/i,
  /Ogark/i,
  /Буровцова/i,
  /Gmail thread\s+[a-f0-9]+/i,
  /\bS11-\d{2}\b/i,
  /\bsource\.[a-z0-9-]+/i,
  /\bpractice\.[a-z0-9-]+/i
];

test("user-facing knowledge pack contains no private source identities or locators", () => {
  const leaks = [];
  for (const file of pack) for (const pattern of forbidden) {
    if (pattern.test(file.text)) leaks.push(file.name + ": " + pattern);
  }
  assert.deepEqual(leaks, []);
});

test("private source registries are not part of the ChatGPT knowledge-pack directory", () => {
  assert.equal(files.some(name => /registry|sources|evidence/i.test(name)), false);
});
