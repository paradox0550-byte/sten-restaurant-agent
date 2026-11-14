import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { evaluateKnowledgeQuality } from "../src/evaluation/knowledge-quality.js";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

test("HoReCa knowledge package passes source and cross-reference integrity checks", () => {
  const report = evaluateKnowledgeQuality({
    procedures: read("../knowledge/procedures/operational-procedures.json"),
    checklists: read("../knowledge/procedures/checklist-templates.json"),
    registers: read("../knowledge/procedures/register-templates.json"),
    sources: read("../knowledge/graph/sources.json"),
    graph: read("../knowledge/graph/operational-knowledge-graph.json"),
    sectorMatrix: read("../knowledge/taxonomy/sector-domain-matrix.json")
  });
  assert.equal(report.status, "pass", JSON.stringify(report.issues));
  assert.equal(report.coverage.source_linked_procedures, 1);
  assert.equal(report.coverage.procedure_checklist_links, 1);
  assert.equal(report.semantic_correctness_measured, false);
  assert.equal(report.legal_validity_measured, false);
});

test("quality evaluator flags a procedure with a fabricated or unresolved source", () => {
  const procedures = read("../knowledge/procedures/operational-procedures.json");
  procedures.procedures[0].source_ids = ["source.does-not-exist"];
  const report = evaluateKnowledgeQuality({
    procedures,
    checklists: read("../knowledge/procedures/checklist-templates.json"),
    registers: read("../knowledge/procedures/register-templates.json"),
    sources: read("../knowledge/graph/sources.json"),
    graph: read("../knowledge/graph/operational-knowledge-graph.json"),
    sectorMatrix: read("../knowledge/taxonomy/sector-domain-matrix.json")
  });
  assert.equal(report.status, "needs_work");
  assert.ok(report.issues.some((issue) => issue.includes("unknown_source")));
});
