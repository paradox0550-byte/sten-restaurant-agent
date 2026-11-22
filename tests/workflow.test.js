import test from"node:test";import assert from"node:assert/strict";import{createActionTask,updateTask,verifyActionOutcome,createManagementCycle}from"../src/workflow/index.js";
const base=()=>createActionTask({id:"t1",tenantId:"tenant-a",establishmentId:"rest-a",title:"Review waste",ownerRole:"chef",verificationMetric:"waste kg",dueAt:"2026-11-20",createdBy:"manager"});
test("task starts proposed and retains tenant boundary",()=>{const t=base();assert.equal(t.status,"proposed");assert.equal(t.tenant_id,"tenant-a");});
test("task lifecycle requires valid transitions and actor",()=>{let t=base();t=updateTask(t,"approved",{actor:"manager"});t=updateTask(t,"in_progress",{actor:"chef"});assert.equal(t.status,"in_progress");assert.throws(()=>updateTask(t,"verified",{actor:"manager"}),/INVALID_TASK_TRANSITION/);});
test("blocking requires a reason",()=>{let t=base();t=updateTask(t,"approved",{actor:"manager"});t=updateTask(t,"in_progress",{actor:"chef"});assert.throws(()=>updateTask(t,"blocked",{actor:"chef"}),/TASK_REASON_REQUIRED/);});
test("verification requires completed task, measured value and source",()=>{const t={...base(),status:"completed"};assert.equal(verifyActionOutcome({task:t,observedValue:2,expected:v=>v<3,sourceIds:["report-1"],verifiedBy:"manager"}).status,"verified");assert.equal(verifyActionOutcome({task:t,observedValue:2,expected:v=>v<3}).status,"requires_evidence");});
test("management cycle creates tasks only after structured analysis",()=>{const c=createManagementCycle({tenantId:"tenant-a",establishmentId:"rest-a",actor:"manager",analysisInput:{evidence:[{id:"e1",class:"CORE",source:"STEN",scope:"global",date:"2026-01-01"}],facts:[],actions:[{title:"Check waste",ownerRole:"chef",verificationMetric:"waste kg",dueOrTiming:"tomorrow"}]}});assert.equal(c.status,"ready_for_approval");assert.equal(c.tasks.length,1);});
test("management cycle with incomplete evidence cannot release tasks",()=>{const c=createManagementCycle({tenantId:"tenant-a",establishmentId:"rest-a",actor:"manager",analysisInput:{facts:[{id:"f1",status:"observed",value:10}],actions:[{title:"Do work",ownerRole:"chef",verificationMetric:"x",dueOrTiming:"today"}]}});assert.equal(c.status,"needs_review");assert.equal(c.tasks.length,0);});
const identity = { tenantId: "tenant-a", establishmentId: "rest-a", actor: "manager", at: "2026-11-22T12:00:00.000Z" };
const knowledge = [{ id: "k1", title: "Restaurant finance operations", text: "Restaurant finance revenue costs and management controls", topics: ["finance"] }];
const evidence = [{ id: "e1", class: "CORE", source: "STEN core rule", scope: "global", date: "2026-01-01" }];

test("expert management cycle blocks task drafts when decision inputs are undeclared", () => {
  const cycle = createManagementCycle({ ...identity, expertAnalysisInput: { query: "restaurant finance", knowledge, requiredInputs: [], providedInputs: { evidence }, facts: [], actions: [{ title: "Check revenue", ownerRole: "manager", dueOrTiming: "next review", verificationMetric: "reconciled revenue" }] } });
  assert.equal(cycle.status, "needs_review");
  assert.equal(cycle.tasks.length, 0);
  assert.ok(cycle.integrity_issues.includes("decision inputs: not_assessed"));
});

test("expert management cycle blocks task drafts when retrieval is unavailable", () => {
  const cycle = createManagementCycle({ ...identity, expertAnalysisInput: { query: "unknown topic", knowledge: [], requiredInputs: ["period"], providedInputs: { period: "2026-10", evidence }, actions: [{ title: "Proceed", ownerRole: "manager", dueOrTiming: "today", verificationMetric: "completion evidence" }] } });
  assert.equal(cycle.status, "needs_review");
  assert.equal(cycle.tasks.length, 0);
});

test("expert management cycle does not block unrelated tasks on optional missing financial ratios", () => {
  const cycle = createManagementCycle({ ...identity, expertAnalysisInput: { query: "restaurant finance", knowledge, requiredInputs: ["period"], providedInputs: { period: "2026-10", evidence }, actions: [{ title: "Review shift handover", ownerRole: "manager", dueOrTiming: "next shift", verificationMetric: "handover completion" }], financialInputs: { revenue: 1000, cogs: null, kitchenRevenue: 700, kitchenCogs: null, labor: null }, requiredFinancialMetrics: [] } });
  assert.equal(cycle.status, "ready_for_approval");
  assert.equal(cycle.tasks.length, 1);
  assert.equal(cycle.analysis.financialRatios.cogsShare.status, "unavailable");
});

test("expert management cycle blocks a task when a declared required financial metric is unavailable", () => {
  const cycle = createManagementCycle({ ...identity, expertAnalysisInput: { query: "restaurant finance", knowledge, requiredInputs: ["period"], providedInputs: { period: "2026-10", evidence }, actions: [{ title: "Set food cost plan", ownerRole: "finance", dueOrTiming: "before budget approval", verificationMetric: "food cost percent" }], financialInputs: { revenue: 1000, cogs: null, kitchenRevenue: 700, kitchenCogs: 200, labor: 250 }, requiredFinancialMetrics: ["kitchenFoodCost", "primeCost"] } });
  assert.equal(cycle.status, "needs_review");
  assert.equal(cycle.tasks.length, 0);
  assert.ok(cycle.integrity_issues.some(issue => issue.includes("primeCost")));
});
