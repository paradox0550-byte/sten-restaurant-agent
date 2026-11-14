import test from"node:test";import assert from"node:assert/strict";import{rankDocuments,assessDocumentApplicability,findExplicitConflicts,buildExpertContext}from"../src/retrieval/index.js";
const docs=[{id:"a",title:"Food cost контроль кухни",content:"Себестоимость блюд и контроль закупок",topic:["finance","food_cost"],applicability:{sectors:["restaurant"],formats:["casual_dining"],required_profile_fields:["service_model"],determination:"conditional"}},{id:"b",title:"Кофейня обслуживание",content:"Бариста и кофейное меню",topic:["service"],applicability:{sectors:["cafe"],formats:["coffee_shop"],required_profile_fields:[],determination:"conditional"}}];
test("lexical retrieval ranks relevant documents deterministically",()=>{const r=rankDocuments("контроль food cost кухни",docs);assert.equal(r.status,"ok");assert.equal(r.results[0].document.id,"a");assert.deepEqual(r.results.map(x=>x.document.id),rankDocuments("контроль food cost кухни",docs).results.map(x=>x.document.id));});
test("empty query is unavailable",()=>assert.equal(rankDocuments(" ",docs).reason,"empty_query"));
test("profile mismatch excludes and missing required data remains unresolved",()=>{assert.equal(assessDocumentApplicability(docs[0],{sector:"cafe",format:"coffee_shop"}).status,"not_applicable");const x=assessDocumentApplicability(docs[0],{sector:"restaurant",format:"casual_dining"});assert.equal(x.status,"requires_context");assert.deepEqual(x.missingProfileFields,["service_model"]);});
test("explicit conflicts are surfaced once without precedence",()=>{const x=findExplicitConflicts([{id:"x",conflicts_with:["y"]},{id:"y",conflicts_with:["x"]}]);assert.equal(x.length,1);assert.equal(x[0].status,"explicit_conflict_requires_review");});
test("expert context joins profile, knowledge and adapted evidence",()=>{const registry={records:[{id:"core.abc",title:"Food cost methodology",summary:"Food cost control",evidence_class:"CORE",topic:["food_cost"],source:{publisher:"STEN",title:"Core",citation:"STEN",published_at:"2026-01-01"},territory:{scope:"global",jurisdictions:[]},validity:{status:"in_force",effective_from:"2026-01-01"},applicability:{sectors:["restaurant"],formats:["casual_dining"],required_profile_fields:[],determination:"conditional"},limitations:["Methodology only"],record_status:"approved",conflicts_with:[]}]};const r=buildExpertContext({query:"food cost",profile:{sector:"restaurant",format:"casual_dining"},knowledge:docs,registry});assert.equal(r.status,"ok");assert.equal(r.knowledge[0].document.id,"a");assert.equal(r.evidence[0].adaptedEvidence.id,"core.abc");assert.equal(r.guardrails.noAutomaticLegalApplicability,true);});
test("draft and unknown evidence stay excluded",()=>{const registry={records:[{id:"law.draft",title:"Draft law template",evidence_class:"LAW",topic:["fire"],source:{publisher:"x",title:"draft",citation:"template",published_at:null},territory:{scope:"unknown",jurisdictions:[]},validity:{status:"unknown"},applicability:{determination:"unknown"},limitations:["draft"],record_status:"draft"}]};const r=buildExpertContext({query:"fire",registry});assert.equal(r.evidence[0].adaptedEvidence,null);assert.ok(r.evidence[0].excludedReason);});


import { normalizeText, documentText } from "../src/retrieval/text.js";

test("Russian normalization handles ё, case, question words and inflectional endings", () => {
  assert.deepEqual(normalizeText("Какой фуд-кост нормальный?"), ["фуд", "кост", "нормальн"]);
  assert.equal(normalizeText("продукты")[0], normalizeText("продуктов")[0]);
  assert.equal(normalizeText("Ёлочный")[0], normalizeText("елочный")[0]);
  assert.ok(normalizeText("не применять").includes("не"), "negation must not be removed");
});

test("graph retrieval searches labels, summaries, purpose, scope and limitations", () => {
  const node = {
    id: "service.appearance",
    type: "process",
    label: "Проверка внешнего вида персонала",
    summary: "Контроль готовности сотрудников к работе",
    purpose: "Поддержание требований к внешнему виду",
    limitations: ["Периодичность определяется локальным стандартом"]
  };
  const indexedText = documentText(node);
  assert.match(indexedText, /Проверка внешнего вида персонала/);
  assert.match(indexedText, /локальным стандартом/);
  const result = rankDocuments("Как часто проводить проверку внешнего вида персонала?", [node]);
  assert.equal(result.results[0].document.id, "service.appearance");
});

test("BM25 ranks the document with relevant aliases and keywords first", () => {
  const candidates = [
    { id: "finance.food-cost", label: "Food cost", summary: "Доля стоимости продуктов в выручке", keywords: ["фуд-кост", "себестоимость"] },
    { id: "finance.cash", label: "Денежные операции", summary: "Кассовая дисциплина" }
  ];
  const result = rankDocuments("фуд-кост себестоимость", candidates);
  assert.equal(result.results[0].document.id, "finance.food-cost");
  assert.ok(result.results[0].matchedTermCount >= 2);
});


test("field-aware ranking prioritizes delivery for peak-load service deterioration", () => {
  const graph = JSON.parse(require("node:fs").readFileSync(
    new URL("../knowledge/graph/operational-knowledge-graph.json", import.meta.url), "utf8"
  ));
  const result = rankDocuments(
    "В пиковые часы ухудшается сервис. Проверь график и нагрузку",
    graph.nodes,
    { limit: 10 }
  );
  const ids = result.results.map((item) => item.document.id);
  assert.ok(ids.indexOf("delivery.order") >= 0 && ids.indexOf("delivery.order") < 3, ids.join(", "));
  assert.ok(ids.includes("people.schedule"), ids.join(", "));
});

test("field-aware ranking preserves payroll retrieval for payroll-specific questions", () => {
  const candidates = [
    { id: "people.payroll", label: "Начисление заработной платы", description: "Проверка начислений по подтверждённым часам", keywords: ["табель", "зарплата", "расчёт заработной платы"] },
    { id: "people.schedule", label: "График выхода и планирование смен", keywords: ["график смен", "плановые часы"] },
    { id: "delivery.order", label: "Приём и выдача заказа", keywords: ["пиковая нагрузка", "скорость выдачи"] }
  ];
  const result = rankDocuments("Проверь начисление заработной платы и табель", candidates);
  assert.equal(result.results[0].document.id, "people.payroll");
});
