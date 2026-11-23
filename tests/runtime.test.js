import test from "node:test";
import assert from "node:assert/strict";
import {ProviderRegistry,ToolRegistry,InMemoryTenantMemory,InMemoryAuditSink,InMemoryApprovalStore,createStenRuntime} from "../src/runtime/index.js";
function setup(complete=async r=>({text:"ok",receivedTenant:r.tenantId,toolResults:r.toolResults})){
  const executedActions=[];
  const providers=new ProviderRegistry().register("mock",{complete});
  const tools=new ToolRegistry()
    .register({name:"finance.ratio",description:"Calculate a ratio.",approval:"not_required",schema:{type:"object",required:["numerator","denominator"],additionalProperties:false,properties:{numerator:{type:"number"},denominator:{type:"number"}}},execute:({numerator,denominator})=>Number.isFinite(numerator)&&Number.isFinite(denominator)&&denominator!==0?{status:"calculated",value:numerator/denominator}:{status:"unavailable",reason:"missing_or_zero_denominator"}})
    .register({name:"task.create",description:"Create a management task.",schema:{type:"object",required:["title"],additionalProperties:false,properties:{title:{type:"string"}}},execute:({title})=>{executedActions.push(title);return{status:"created",title};}});
  const memory=new InMemoryTenantMemory(),audit=new InMemoryAuditSink(),approvalStore=new InMemoryApprovalStore();
  return{runtime:createStenRuntime({providers,tools,memory,audit,approvalStore,clock:()=>"2026-11-14T00:00:00.000Z"}),providers,memory,audit,approvalStore,tools,executedActions};
}
test("tenant identity is required",async()=>{const{runtime}=setup();await assert.rejects(()=>runtime.run({providerId:"mock"}),{code:"TENANT_REQUIRED"});});
test("provider adapter is injected and vendor-neutral",async()=>{const{runtime}=setup();assert.equal((await runtime.run({tenantId:"restaurant-a",providerId:"mock"})).response.text,"ok");});
test("tools are deny-by-default and run only with explicit permission",async()=>{const{runtime}=setup();const denied=await runtime.run({tenantId:"t1",providerId:"mock",toolCalls:[{name:"finance.ratio",args:{numerator:10,denominator:2}}]});assert.equal(denied.toolResults[0].error.code,"TOOL_FORBIDDEN");const ok=await runtime.run({tenantId:"t1",providerId:"mock",permissions:["finance.ratio"],toolCalls:[{name:"finance.ratio",args:{numerator:10,denominator:2}}]});assert.deepEqual(ok.toolResults[0].result,{status:"calculated",value:5});});
test("tool arguments are validated before execution",async()=>{const{tools}=setup();await assert.rejects(()=>tools.execute({name:"finance.ratio",tenantId:"t1",permissions:["finance.ratio"],args:{numerator:"10",denominator:2}}),{code:"INVALID_TOOL_ARGUMENTS"});});
test("action tools pause for approval and execute only after the exact call id is approved",async()=>{
  const{runtime,audit,executedActions}=setup();
  const pending=await runtime.run({tenantId:"a1",providerId:"mock",permissions:["task.create"],toolCalls:[{id:"task-call-1",name:"task.create",args:{title:"Review waste"}}]});
  assert.equal(pending.status,"awaiting_approval");
  assert.equal(pending.toolResults[0].status,"awaiting_approval");
  assert.deepEqual(executedActions,[]);
  assert.ok(audit.list({tenantId:"a1"}).some(e=>e.type==="tool.approval_required"&&e.metadata.callId==="task-call-1"));
  const resumed=await runtime.run({tenantId:"a1",providerId:"mock",permissions:["task.create"],approvedToolCalls:[pending.toolResults[0].approvalRequest],toolCalls:[{id:"task-call-1",name:"task.create",args:{title:"Review waste"}}]});
  assert.equal(resumed.status,"completed");
  assert.deepEqual(resumed.toolResults[0].result,{status:"created",title:"Review waste"});assert.deepEqual(executedActions,["Review waste"]);
  const replay=await runtime.run({tenantId:"a1",providerId:"mock",permissions:["task.create"],approvedToolCalls:[pending.toolResults[0].approvalRequest],toolCalls:[{id:"task-call-1",name:"task.create",args:{title:"Review waste"}}]});
  assert.equal(replay.toolResults[0].error.code,"TOOL_APPROVAL_REPLAYED");
  assert.deepEqual(executedActions,["Review waste"]);
});
test("action tools cannot be approved by permission alone or with changed arguments",async()=>{const{runtime,executedActions}=setup();const call={id:"c1",name:"task.create",args:{title:"Send order"}};const pending=await runtime.run({tenantId:"t1",providerId:"mock",permissions:["task.create"],toolCalls:[call]});assert.equal(pending.toolResults[0].status,"awaiting_approval");const changed=await runtime.run({tenantId:"t1",providerId:"mock",permissions:["task.create"],approvedToolCalls:[pending.toolResults[0].approvalRequest],toolCalls:[{...call,args:{title:"Send different order"}}]});assert.equal(changed.toolResults[0].status,"awaiting_approval");assert.deepEqual(executedActions,[]);});
test("memory is isolated by tenant and missing stays explicit",async()=>{const{runtime}=setup();await runtime.writeMemory({tenantId:"a1",namespace:"profile",key:"seats",value:80});assert.equal((await runtime.readMemory({tenantId:"a1",namespace:"profile",key:"seats"})).value,80);assert.equal((await runtime.readMemory({tenantId:"b1",namespace:"profile",key:"seats"})).status,"not_found");});
test("memory values are copied at the adapter boundary",async()=>{const{runtime}=setup(),v={nested:{x:1}};await runtime.writeMemory({tenantId:"a1",namespace:"n",key:"k",value:v});v.nested.x=9;assert.equal((await runtime.readMemory({tenantId:"a1",namespace:"n",key:"k"})).value.nested.x,1);});
test("audit is tenant-filtered and excludes tool argument payloads",async()=>{const{runtime,audit}=setup();await runtime.run({tenantId:"a1",providerId:"mock",permissions:["finance.ratio"],toolCalls:[{name:"finance.ratio",args:{numerator:12345,denominator:4}}]});assert.ok(audit.list({tenantId:"a1"}).some(e=>e.type==="tool.execution"));assert.equal(JSON.stringify(audit.list({tenantId:"a1"})).includes("12345"),false);assert.equal(audit.list({tenantId:"b1"}).length,0);});
test("provider failures propagate to host",async()=>{const providers=new ProviderRegistry().register("broken",{async complete(){throw Error("provider down");}});const runtime=createStenRuntime({providers,tools:new ToolRegistry(),memory:new InMemoryTenantMemory(),audit:new InMemoryAuditSink()});await assert.rejects(()=>runtime.run({tenantId:"a1",providerId:"broken"}),/provider down/);});

test("agent loop executes provider-proposed read tools and continues until the provider finishes",async()=>{
  let calls=0;
  const {runtime,executedActions}=setup(async request=>{
    calls++;
    if(calls===1)return{message:{role:"assistant",content:"Calculate the ratio."},toolCalls:[{id:"ratio-1",name:"finance.ratio",args:{numerator:60,denominator:120}}]};
    assert.ok(request.messages.some(message=>message.role==="tool"));
    return{text:"Food cost ratio is 50%."};
  });
  const result=await runtime.runAgent({tenantId:"restaurant-a",providerId:"mock",permissions:["finance.ratio"],messages:[{role:"user",content:"Calculate."}]});
  assert.equal(result.status,"completed");
  assert.equal(result.steps,2);
  assert.equal(result.toolResults[0].result.value,0.5);
  assert.equal(result.response.text,"Food cost ratio is 50%.");
  assert.deepEqual(executedActions,[]);
});

test("agent loop pauses for human approval and resumes the exact pending action",async()=>{
  let calls=0;
  const {runtime,executedActions}=setup(async()=>{
    calls++;
    return calls===1
      ? {message:{role:"assistant",content:"I propose a task."},toolCalls:[{id:"task-pause-1",name:"task.create",args:{title:"Check temperature logs"}}]}
      : {text:"The task was created."};
  });
  const pending=await runtime.runAgent({tenantId:"restaurant-a",providerId:"mock",permissions:["task.create"]});
  assert.equal(pending.status,"awaiting_approval");
  assert.deepEqual(executedActions,[]);
  assert.equal(pending.pendingToolCalls.length,1);
  const resumed=await runtime.runAgent({
    tenantId:"restaurant-a",providerId:"mock",permissions:["task.create"],
    pendingToolCalls:pending.pendingToolCalls,approvedToolCalls:pending.approvalRequests
  });
  assert.equal(resumed.status,"completed");
  assert.deepEqual(executedActions,["Check temperature logs"]);
  assert.equal(resumed.toolResults[0].status,"success");
  assert.equal(resumed.response.text,"The task was created.");
});

test("approval ledger is shared across runtime instances and blocks cross-instance replay",async()=>{
  const approvalStore=new InMemoryApprovalStore();
  const executed=[];
  const tools=new ToolRegistry().register({name:"task.write",schema:{type:"object",required:["title"],additionalProperties:false,properties:{title:{type:"string"}}},execute:({title})=>{executed.push(title);return{title};}});
  const providers=new ProviderRegistry().register("mock",{async complete(){return{text:"ok"};}});
  const memory=new InMemoryTenantMemory(),audit=new InMemoryAuditSink();
  const makeRuntime=()=>createStenRuntime({providers,tools,memory,audit,approvalStore});
  const first=makeRuntime();
  const pending=await first.run({tenantId:"tenant-a",providerId:"mock",permissions:["task.write"],toolCalls:[{id:"once-1",name:"task.write",args:{title:"Close cash"}}]});
  const approval=pending.toolResults[0].approvalRequest;
  const approved=await first.run({tenantId:"tenant-a",providerId:"mock",permissions:["task.write"],approvedToolCalls:[approval],toolCalls:[{id:"once-1",name:"task.write",args:{title:"Close cash"}}]});
  assert.equal(approved.toolResults[0].status,"success");
  const second=makeRuntime();
  const replay=await second.run({tenantId:"tenant-a",providerId:"mock",permissions:["task.write"],approvedToolCalls:[approval],toolCalls:[{id:"once-1",name:"task.write",args:{title:"Close cash"}}]});
  assert.equal(replay.toolResults[0].error.code,"TOOL_APPROVAL_REPLAYED");
  assert.deepEqual(executed,["Close cash"]);
});

test("agent loop stops safely at the configured step limit",async()=>{
  const {runtime}=setup(async()=>({toolCalls:[{id:"ratio-loop",name:"finance.ratio",args:{numerator:1,denominator:2}}]}));
  const result=await runtime.runAgent({tenantId:"tenant-a",providerId:"mock",permissions:["finance.ratio"],maxSteps:2});
  assert.equal(result.status,"max_steps_reached");
  assert.equal(result.steps,2);
  assert.equal(result.toolResults.length,2);
});

test("agent loop validates the step limit",async()=>{const{runtime}=setup();await assert.rejects(()=>runtime.runAgent({tenantId:"t1",providerId:"mock",maxSteps:21}),{code:"INVALID_MAX_STEPS"});});
