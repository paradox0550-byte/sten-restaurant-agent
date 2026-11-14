import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {evaluateApplicability,findEvidence,validateEvidenceRecord,validateRegistry} from "../src/evidence/validate.js";
const registry=JSON.parse(fs.readFileSync(new URL("../knowledge/evidence/registry.json",import.meta.url),"utf8"));

test("starter registry passes validation",()=>{const r=validateRegistry(registry);assert.equal(r.valid,true,r.errors.join("\n"));});
test("duplicate identifiers are rejected",()=>{const r=validateRegistry({records:[registry.records[0],registry.records[0]]});assert.equal(r.valid,false);assert.ok(r.errors.some(e=>e.includes("Duplicate record id")));});
test("approved LAW requires official source and jurisdiction",()=>{const r=structuredClone(registry.records.find(x=>x.evidence_class==="LAW"));r.record_status="approved";r.validity.status="in_force";r.territory={scope:"unknown",jurisdictions:[]};r.source.url=null;r.source.citation=null;r.source.source_type="other";r.validity.effective_from=null;r.validity.last_verified_at=null;r.validity.review_due_at=null;const out=validateEvidenceRecord(r);assert.equal(out.valid,false);assert.ok(out.errors.length>=4);});
test("unknown legal applicability cannot be positive",()=>{const r=registry.records.find(x=>x.id==="law.placeholder-intake-template");assert.equal(evaluateApplicability(r,{jurisdiction:"RU"},"2026-11-14").outcome,"undetermined");});
test("missing establishment profile fields are explicit",()=>{const r=registry.records.find(x=>x.id==="practice.daily-operational-walk");const out=evaluateApplicability(r,{},"2026-11-14");assert.equal(out.outcome,"needs_profile_data");assert.deepEqual(out.missing_fields,["service_model","operating_zones"]);});
test("specialist review is not replaced by automatic compliance",()=>{const r=structuredClone(registry.records[0]);r.applicability.required_profile_fields=[];r.applicability.determination="specialist_review";assert.equal(evaluateApplicability(r,{},"2026-11-14").outcome,"specialist_review");});
test("registry supports class/topic filtering",()=>{assert.equal(findEvidence(registry,{evidence_class:"CORE",topic:"reasoning"}).length,2);});
test("tenant configuration is rejected from shared registry without tenant id",()=>{const r=structuredClone(registry.records[0]);r.id="config.test-isolation";r.evidence_class="CONFIGURATION";r.tenant_id=null;assert.ok(validateEvidenceRecord(r).errors.some(e=>e.includes("tenant_id")));});
