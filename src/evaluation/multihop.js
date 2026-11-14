import fs from "node:fs";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

export function evaluateMultiHopCase(item, graph) {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const edges = new Set(graph.edges.map((edge) => `${edge.from}->${edge.to}`));
  const missingNodes = item.expected_path.filter((id) => !nodeIds.has(id));
  const missingEdges = [];
  for (let i = 0; i < item.expected_path.length - 1; i += 1) {
    const key = `${item.expected_path[i]}->${item.expected_path[i + 1]}`;
    if (!edges.has(key)) missingEdges.push(key);
  }
  const validGuardrails = item.must_require.length > 0 && item.must_not_claim.length > 0;
  return {
    case_id: item.id,
    path_length: item.expected_path.length,
    path_complete: missingNodes.length === 0 && missingEdges.length === 0,
    missing_nodes: missingNodes,
    missing_edges: missingEdges,
    guardrails_defined: validGuardrails,
    evaluation_scope: "structural_graph_coverage_only",
    answer_quality_measured: false
  };
}

export function runMultiHopEvaluation({ cases, graph }) {
  const results = cases.map((item) => evaluateMultiHopCase(item, graph));
  const passed = results.filter((item) => item.path_complete && item.guardrails_defined).length;
  return {
    status: passed === results.length ? "pass" : "needs_work",
    scope: "structural_graph_coverage_only",
    answer_quality_measured: false,
    cases_total: results.length,
    cases_passed: passed,
    path_coverage: results.length ? passed / results.length : null,
    results
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const cases = read("../../evals/horeca-multihop-cases.json").cases;
  const graph = read("../../knowledge/graph/operational-knowledge-graph.json");
  const report = runMultiHopEvaluation({ cases, graph });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\\n`);
  if (report.status !== "pass") process.exitCode = 1;
}
