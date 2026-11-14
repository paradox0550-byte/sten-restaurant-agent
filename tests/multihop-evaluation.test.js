import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { runMultiHopEvaluation } from "../src/evaluation/multihop.js";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

test("all seeded HoReCa multi-hop routes resolve through graph nodes and edges", () => {
  const cases = read("../evals/horeca-multihop-cases.json").cases;
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  const report = runMultiHopEvaluation({ cases, graph });
  assert.equal(report.status, "pass", JSON.stringify(report.results.filter((x) => !x.path_complete)));
  assert.equal(report.cases_passed, cases.length);
  assert.equal(report.answer_quality_measured, false);
});

test("multi-hop seed cases retain evidence requirements and unsupported-claim guardrails", () => {
  const cases = read("../evals/horeca-multihop-cases.json").cases;
  for (const item of cases) {
    assert.ok(item.must_require.length > 0, item.id);
    assert.ok(item.must_not_claim.length > 0, item.id);
    assert.ok(item.expected_path.length >= 3, item.id);
  }
});

test("sector matrix distinguishes taxonomy branches from curated corpus status", () => {
  const matrix = read("../knowledge/taxonomy/sector-domain-matrix.json");
  assert.equal(matrix.sector_branches.length, 9);
  assert.ok(matrix.sector_branches.every((sector) => sector.branches.length >= 5));
  assert.ok(matrix.sector_branches.every((sector) => ["planned", "partial", "seeded", "reviewed"].includes(sector.corpus_status)));
  assert.ok(matrix.profile_policy.some((rule) => rule.includes("Unknown fields")));
});
