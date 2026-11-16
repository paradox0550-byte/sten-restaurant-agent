import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

test("operational knowledge graph has unique nodes and valid directed edges", () => {
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  const ids = graph.nodes.map((node) => node.id);
  assert.equal(new Set(ids).size, ids.length);
  const known = new Set(ids);
  for (const edge of graph.edges) {
    assert.ok(known.has(edge.from), `unknown edge source: ${edge.from}`);
    assert.ok(known.has(edge.to), `unknown edge target: ${edge.to}`);
    assert.notEqual(edge.from, edge.to);
  }
});

test("every source link resolves and cross-domain links are retained", () => {
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  const sources = read("../knowledge/graph/sources.json");
  const sourceIds = new Set(sources.sources.map((source) => source.id));
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  for (const link of graph.source_links) {
    assert.ok(sourceIds.has(link.source_id));
    assert.ok(link.node_ids.length > 0);
    for (const id of link.node_ids) assert.ok(nodeIds.has(id));
  }
  assert.ok(graph.edges.some((edge) => edge.type === "cross_links"));
  assert.ok(graph.nodes.some((node) => node.id === "people.work-maturity"));
});

test("source catalog preserves PRACTICE limitations and unknowns", () => {
  const sources = read("../knowledge/graph/sources.json").sources;
  assert.equal(sources.length, 12);
  assert.ok(sources.every((source) => source.evidence_class === "PRACTICE"));
  const appearance = sources.find((source) => source.id === "source.appearance-training");
  assert.ok(appearance.limitations.some((item) => item.includes("Footwear")));
  const calendar = sources.find((source) => source.id === "source.director-calendar");
  assert.ok(calendar.limitations.some((item) => item.includes("Blank cells")));
});

test("Stage 11 specialist knowledge nodes and provisional cases are discoverable and guarded", () => {
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  const ids = new Set(graph.nodes.map((node) => node.id));
  assert.ok(ids.has("production.kitchen-staffing-by-station"));
  assert.ok(ids.has("production.menu-engineering"));
  const staffing = graph.nodes.find((node) => node.id === "production.kitchen-staffing-by-station");
  const menu = graph.nodes.find((node) => node.id === "production.menu-engineering");
  assert.equal(staffing.evidence_class, "HYPOTHESIS");
  assert.equal(menu.evidence_class, "HYPOTHESIS");
  assert.ok(staffing.keywords.includes("количество сотрудников кухни"));
  assert.ok(menu.keywords.includes("инжиниринг меню"));
  const sourceLinks = new Map(read("../knowledge/graph/operational-knowledge-graph.json").source_links.map((link) => [link.source_id, link.node_ids]));
  for (const sourceId of [
    "source.calculator-iiko-audit-checklist",
    "source.food-product-adjacency-guide",
    "source.food-marking-haccp-checklist",
    "source.shift-manager-trattoria-procedure",
    "source.bartender-club-operating-procedure",
    "source.casual-dining-service-book-outline"
  ]) {
    assert.ok(sourceIds.has(sourceId), sourceId);
    assert.ok(sourceLinks.get(sourceId)?.length > 0, sourceId);
    for (const nodeId of sourceLinks.get(sourceId)) assert.ok(ids.has(nodeId), nodeId);
  }
  const expandedCases = read("../evals/stage-11-source-expansion-cases.json").cases;
  const sourceIds = new Set(read("../knowledge/graph/sources.json").sources.map((source) => source.id));
  assert.equal(expandedCases.length, 13);
  for (const item of expandedCases) {
    assert.ok(item.id && item.query && item.domain);
    assert.ok(item.expected_source_ids.length > 0);
    assert.ok(item.must_require.length > 0);
    assert.ok(item.must_not_claim.length > 0);
    for (const sourceId of item.expected_source_ids) assert.ok(sourceIds.has(sourceId), sourceId);
  }
  const cases = read("../evals/stage-11-specialist-cases.json").cases;
  assert.equal(cases.length, 4);
  for (const item of cases) {
    assert.ok(item.id && item.query && item.domain);
    assert.ok(item.expected_ids.length > 0);
    assert.ok(item.required_inputs.length > 0);
    assert.ok(item.must_require.length > 0);
    assert.ok(item.must_not_claim.length > 0);
    assert.equal(item.label_status, "provisional_requires_" + (item.domain === "kitchen_workforce" ? "kitchen" : "menu") + "_expert_adjudication");
    for (const id of item.expected_ids) assert.ok(ids.has(id), id);
  }
});
