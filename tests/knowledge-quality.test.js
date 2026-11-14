import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { evaluateKnowledgeQuality, evaluateRetrievalRanking, evaluateAnswerIntegrity, runRetrievalEvaluation } from "../src/evaluation/knowledge-quality.js";

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

test("Stage 13 golden HoReCa cases cover cross-domain questions and claim guardrails", () => {
  const cases = read("../evals/stage-13-golden-cases.json").cases;
  assert.ok(cases.length >= 8);
  for (const item of cases) {
    assert.ok(item.id && item.query && item.domain);
    assert.ok(item.expected_ids.length > 0, item.id);
    assert.ok(item.required_inputs.length > 0, item.id);
    assert.ok(item.must_require.length > 0, item.id);
    assert.ok(item.must_not_claim.length > 0, item.id);
  }
});


test("Stage 13 runs golden queries through the actual lexical retrieval ranker", () => {
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  const cases = read("../evals/stage-13-golden-cases.json").cases;
  const report = runRetrievalEvaluation({ cases, documents: graph.nodes, k: 10 });
  assert.equal(report.scope, "labelled_cases_against_supplied_corpus_lexical_ranker_only");
  assert.equal(report.corpus_documents, graph.nodes.length);
  assert.equal(report.cases_total, cases.length);
  assert.ok(report.results.every((item) => item.retrieved_ids.length <= 10));
  assert.ok(report.results.every((item) => item.metrics.status === "scored"));
  assert.ok(report.results.every((item) => item.expected_ids_missing_from_corpus.length === 0));
  const baseline = read("../evals/stage-13-retrieval-baseline.json");
  assert.equal(report.cases_scored, baseline.cases_scored);
  console.log("[Stage 13 field-aware ranking diagnostic]", JSON.stringify({ macro: report.macro, cases: report.results.map((item) => ({ id: item.case_id, recall: item.metrics.recallAtK, ndcg: item.metrics.ndcgAtK, retrieved: item.retrieved_ids })) }));
  assert.deepEqual(report.results.map((item) => item.retrieved_ids), baseline.results.map((item) => item.retrieved_ids));
  assert.ok(Math.abs(report.macro.recallAtK - baseline.macro.recall_at_10) < 1e-12);
  assert.ok(Math.abs(report.macro.ndcgAtK - baseline.macro.ndcg_at_10) < 1e-12);
  assert.deepEqual(
    report.results.map((item) => [item.metrics.relevantFound, item.metrics.relevantTotal]),
    baseline.results.map((item) => [item.relevant_found, item.relevant_total])
  );
  const fullyRetrieved = report.results.filter((item) => item.metrics.recallAtK === 1).length;
  assert.equal(fullyRetrieved, 5);
  assert.equal(report.results.length - fullyRetrieved, 3);
  assert.equal(report.macro.recallAtK, 0.9291666666666667);
  assert.equal(report.macro.reciprocalRank, 1);
});


test("post-enrichment holdout runs through production lexical retrieval without tuning thresholds", () => {
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  const holdout = read("../evals/stage-13-blind-holdout.json");
  const golden = read("../evals/stage-13-golden-cases.json").cases;
  const goldenIds = new Set(golden.map((item) => item.id));
  const corpusIds = new Set(graph.nodes.map((item) => item.id));
  assert.equal(holdout.cases.length, 12);
  assert.ok(holdout.cases.every((item) => !goldenIds.has(item.id)));
  assert.ok(holdout.cases.every((item) => item.expected_ids.length > 0));
  assert.ok(holdout.cases.every((item) => item.expected_ids.every((id) => corpusIds.has(id))));
  assert.ok(holdout.cases.every((item) =>
    item.label_status === "provisional_model_authored_requires_expert_adjudication"
  ));

  const report = runRetrievalEvaluation({ cases: holdout.cases, documents: graph.nodes, k: 10 });
  assert.equal(report.scope, "labelled_cases_against_supplied_corpus_lexical_ranker_only");
  assert.equal(report.cases_total, 12);
  assert.equal(report.cases_scored, 12);
  assert.ok(report.results.every((item) => item.metrics.status === "scored"));
  console.log("[Stage 13 holdout — provisional, not expert-adjudicated]", JSON.stringify({
    corpus_documents: report.corpus_documents,
    cases_total: report.cases_total,
    macro: report.macro,
    cases: report.results.map((item) => ({
      case_id: item.case_id,
      relevant_found: item.metrics.relevantFound,
      relevant_total: item.metrics.relevantTotal,
      recall_at_10: item.metrics.recallAtK,
      first_relevant_rank: item.metrics.reciprocalRank ? 1 / item.metrics.reciprocalRank : null,
      expected_ids: item.expected_ids,
      retrieved_ids: item.retrieved_ids,
      missing_ids: item.expected_ids.filter((id) => !item.retrieved_ids.includes(id))
    }))
  }));
});
