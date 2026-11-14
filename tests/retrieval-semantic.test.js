import test from"node:test";
import assert from"node:assert/strict";
import{rerankResults,detectSemanticConflicts}from"../src/retrieval/index.js";
const docs=[{id:"a",title:"Food cost",source:{citation:"source-a"}},{id:"b",title:"Labor cost",source:{citation:"source-b"}}];
test("semantic reranker reorders only known candidates and preserves source metadata",async()=>{
 const r=await rerankResults({query:"cost",results:docs.map(document=>({document,score:1})),reranker:{async rerank(){return[{id:"b",score:.9},{id:"unknown",score:1},{id:"a",score:.2}]}}});
 assert.equal(r.status,"ok");assert.deepEqual(r.results.map(x=>x.document.id),["b","a"]);assert.equal(r.results[0].document.source.citation,"source-b");
});
test("reranker failure falls back to original order",async()=>{
 const input=docs.map(document=>({document}));const r=await rerankResults({query:"cost",results:input,reranker:{async rerank(){throw Error("offline")}}});
 assert.equal(r.status,"fallback");assert.deepEqual(r.results,input);
});
test("missing reranker is explicit and does not pretend semantic ranking happened",async()=>{
 const r=await rerankResults({query:"cost",results:docs});assert.equal(r.status,"unavailable");assert.equal(r.reason,"reranker_not_configured");
});
test("semantic conflict detector rejects unknown IDs and requires review",async()=>{
 const r=await detectSemanticConflicts({records:docs,detector:{async detect(){return[{recordIds:["a","b"],kind:"contradiction",confidence:.82},{recordIds:["a","ghost"],kind:"contradiction"}]}}});
 assert.equal(r.status,"review_required");assert.equal(r.conflicts.length,1);assert.equal(r.conflicts[0].classification,"potential_contradiction");assert.equal(r.conflicts[0].resolution,"unresolved");
});
test("different jurisdiction or validity is contextual difference, not asserted contradiction",async()=>{
 const records=[{id:"law-a",territory:{jurisdictions:["DE"]},validity:{effective_from:"2025-01-01"}},{id:"law-b",territory:{jurisdictions:["RU"]},validity:{effective_from:"2025-01-01"}}];
 const r=await detectSemanticConflicts({records,detector:{async detect(){return[{recordIds:["law-a","law-b"],kind:"contradiction"}]}}});
 assert.equal(r.conflicts[0].classification,"contextual_difference");assert.ok(r.conflicts[0].contextualDifferences.includes("jurisdiction"));
});
test("detector errors fail closed",async()=>{
 const r=await detectSemanticConflicts({records:docs,detector:{async detect(){throw Error("offline")}}});assert.equal(r.status,"unavailable");assert.deepEqual(r.conflicts,[]);
});
