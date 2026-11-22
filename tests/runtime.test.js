import test from "node:test";
import assert from "node:assert/strict";
import {ProviderRegistry,ToolRegistry,InMemoryTenantMemory,InMemoryAuditSink,createStenRuntime} from "../src/runtime/index.js";
function setup(){
  const providers=new ProviderRegistry().register("mock",{async complete(r){return{text:"ok",receivedTenant:r.tenantId,toolResults:r.toolResults};}});
  const tools=new ToolRegistry()
    .register({name:"finance.ratio",description:"Calculate a ratio.",approval:"not_required",schema:{type:"object",required:["numerator","denominator"],additionalProperties:false,properties:{numerator:{type:"number"},denominator:{type:"number"}}},execute:({numerator,denominator})=>Number.isFinite(numerator)&&Number.isFinite(denominator)&&denominator!==0?{status:"calculated",value:numerator/denominator}:{status:"unavailable",reason:"missing_or_zero_denominator"}})
    .register({name:"task.create",description:"Create a management task.",schema:{type:"object",required:["title"],additionalProperties:false,properties:{title:{type:"string"}}},execute:({title})=>({status:"created",title})});
  const memory=new InMemoryTenantMemory(),audit=new InMemoryAuditSink();
  return{runtime:createStenRuntime({providers,tools,memory,audit,clock:()=>"2026-11-14T00:00:00.000Z"}),tools,audit};
}
test("tenant identity is required",async()=>{const{runtime}=setup();await assert.rejects(()=>runtime.run({providerId:"mock"}),{code:"TENANT_REQUIRED"});});
test("provider adapter is injected and vendor-neutral",async()=>{const{runtime}=setup();assert.equal((await runtime.run({tenantId:"restaurant-a",providerId:"mock"})).response.text,"ok");});
test("tools are deny-by-default and run only with explicit permission",async()=>{const{runtime}=setup();const denied=await runtime.run({tenantId:"t1",providerId:"mock",toolCalls:[{name:"finance.ratio",args:{numerator:10,denominator:2}}]});assert.equal(denied.toolResults[0].error.code,"TOOL_FORBIDDEN");const ok=await runtime.run({tenantId:"t1",providerId:"mock",permissions:["finance.ratio"],toolCalls:[{name:"finance.ratio",args:{numerator:10,denominator:2}}]});assert.deepEqual(ok.toolResults[0].result,{status:"calculated",value:5});});
test("tool arguments are validated before execution",async()=>{const{tools}=setup();await assert.rejects(()=>tools.execute({name:"finance.ratio",tenantId:"t1",permissions:["finance.ratio"],args:{numerator:"10",denominator:2}}),{code:"INVALID_TOOL_ARGUMENTS"});});
test("action tools pause for approval and execute only after the exact call id is approved",async()=>{
  const{runtime,audit}=setup();let executions=0;
  const pending=await runtime.run({tenantId:"a1",providerId:"mock",permissions:["task.create"],toolCalls:[{id:"task-call-1",name:"task.create",args:{title:"Review waste"}}]});
  assert.equal(pending.status,"awaiting_approval");
  assert.equal(pending.toolResults[0].status,"awaiting_approval");
  assert.equal(executions,0);
  assert.ok(audit.list({tenantId:"a1"}).some(e=>e.type==="tool.approval_required"&&e.metadata.callId==="task-call-1"));
  const resumed=await runtime.run({tenantId:"a1",providerId:"mock",permissions:["task.create"],approvedToolCallIds:["task-call-1"],toolCalls:[{id:"task-call-1",name:"task.create",args:{title:"Review waste"}}]});
  assert.equal(resumed.status,"completed");
  assert.deepEqual(resumed.toolResults[0].result,{status:"created",title:"Review waste"});
});
test("action tools cannot be approved by permission alone",async()=>{const{runtime}=setup();const result=await runtime.run({tenantId:"t1",providerId:"mock",permissions:["task.create"],toolCalls:[{id:"c1",name:"task.create",args:{title:"Send order"}}]});assert.equal(result.toolResults[0].status,"awaiting_approval");});
test("memory is isolated by tenant and missing stays explicit",async()=>{const{runtime}=setup();await runtime.writeMemory({tenantId:"a1",namespace:"profile",key:"seats",value:80});assert.equal((await runtime.readMemory({tenantId:"a1",namespace:"profile",key:"seats"})).value,80);assert.equal((await runtime.readMemory({tenantId:"b1",namespace:"profile",key:"seats"})).status,"not_found");});
test("memory values are copied at the adapter boundary",async()=>{const{runtime}=setup(),v={nested:{x:1}};await runtime.writeMemory({tenantId:"a1",namespace:"n",key:"k",value:v});v.nested.x=9;assert.equal((await runtime.readMemory({tenantId:"a1",namespace:"n",key:"k"})).value.nested.x,1);});
test("audit is tenant-filtered and excludes tool argument payloads",async()=>{const{runtime,audit}=setup();await runtime.run({tenantId:"a1",providerId:"mock",permissions:["finance.ratio"],toolCalls:[{name:"finance.ratio",args:{numerator:12345,denominator:4}}]});assert.ok(audit.list({tenantId:"a1"}).some(e=>e.type==="tool.execution"));assert.equal(JSON.stringify(audit.list({tenantId:"a1"})).includes("12345"),false);assert.equal(audit.list({tenantId:"b1"}).length,0);});
test("provider failures propagate to host",async()=>{const providers=new ProviderRegistry().register("broken",{async complete(){throw Error("provider down");}});const runtime=createStenRuntime({providers,tools:new ToolRegistry(),memory:new InMemoryTenantMemory(),audit:new InMemoryAuditSink()});await assert.rejects(()=>runtime.run({tenantId:"a1",providerId:"broken"}),/provider down/);});
