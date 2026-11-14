import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { evaluateKnowledgeQuality, evaluateRetrievalRanking, evaluateAnswerIntegrity } from "../src/evaluation/knowledge-quality.js";

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

test("retrieval evaluator measures precision, recall, reciprocal rank and nDCG", () => {
  const report = evaluateRetrievalRanking({
    expectedIds: ["a", "b", "c"],
    retrieved: ["x", "b", "a", "y"],
    k: 4
  });
  assert.equal(report.status, "scored");
  assert.equal(report.precisionAtK, 0.5);
  assert.equal(report.recallAtK, 2 / 3);
  assert.equal(report.reciprocalRank, 0.5);
  assert.ok(report.ndcgAtK > 0 && report.ndcgAtK < 1);
});

test("retrieval evaluator refuses to score an unlabelled case", () => {
  assert.equal(evaluateRetrievalRanking({ retrieved: ["a"] }).status, "unscored");
});

test("answer evaluator rejects unsupported factual claims and unknown-to-zero coercion", () => {
  const report = evaluateAnswerIntegrity({
    evidence: [{ id: "source-1" }],
    claims: [
      { status: "observed", value: 10, sourceIds: ["missing-source"] },
      { status: "unknown", value: 0 },
      { status: "hypothesis", label: "FACT" }
    ]
  });
  assert.equal(report.status, "needs_review");
  assert.ok(report.issues.includes("claim_unknown_evidence:0"));
  assert.ok(report.issues.includes("unknown_coerced_to_value:1"));
  assert.ok(report.issues.includes("hypothesis_not_labelled:2"));
});

test("answer evaluator requires expected source conflicts to remain visible", () => {
  const report = evaluateAnswerIntegrity({
    conflicts: [{ recordIds: ["source-b", "source-a"], status: "unresolved" }],
    expectedConflictPairs: [["source-a", "source-b"]]
  });
  assert.equal(report.status, "pass");
  const missing = evaluateAnswerIntegrity({ expectedConflictPairs: [["source-a", "source-b"]] });
  assert.equal(missing.status, "needs_review");
});
