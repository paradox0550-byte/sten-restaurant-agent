import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), "utf8"));

test("director calendar source is represented as six functional roles and source-scoped activities", () => {
  const catalog = read("../knowledge/procedures/director-calendar-activity-catalog.json");
  const sources = read("../knowledge/graph/sources.json");
  const graph = read("../knowledge/graph/operational-knowledge-graph.json");
  assert.equal(catalog.functional_roles.length, 6);
  assert.equal(catalog.functional_roles.reduce((sum, role) => sum + role.activities.length, 0), 41);
  assert.equal(sources.sources.find((source) => source.id === catalog.source_id).evidence_class, "PRACTICE");
  for (const role of catalog.functional_roles) {
    assert.ok(graph.nodes.some((node) => node.id === role.id));
    assert.ok(graph.edges.some((edge) => edge.from === "management.director-role" && edge.to === role.id));
    assert.ok(role.activities.every((activity) => activity.row && activity.cadence));
  }
});

test("unspecified director calendar occurrences and weekly fact cells remain unknown", () => {
  const catalog = read("../knowledge/procedures/director-calendar-activity-catalog.json");
  const activities = catalog.functional_roles.flatMap((role) => role.activities);
  assert.ok(activities.some((activity) => activity.planned_occurrences_per_period === null));
  const secondWeek = catalog.weekly_sheets.find((sheet) => sheet.sheet === "18-19.10");
  assert.ok(secondWeek.observations.some((item) => item.includes("пусты")));
  assert.ok(catalog.interpretation_rules.some((item) => item.includes("Null planned occurrence")));
});
