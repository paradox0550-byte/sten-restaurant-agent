import {RuntimeError,requireTenantId} from "./errors.js";
const stableJson=value=>JSON.stringify(value,(key,item)=>item&&typeof item==="object"&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(k=>[k,item[k]])):item);
/** Provider-neutral orchestration. Network calls are delegated to injected adapters. */
export function createStenRuntime({providers,tools,memory,audit,clock=()=>new Date().toISOString()}={}){
  if(!providers||!tools||!memory||!audit)throw new RuntimeError("RUNTIME_DEPENDENCIES_REQUIRED","providers, tools, memory and audit adapters are required.");
  const consumedApprovals=new Set();
  return Object.freeze({
    async run({tenantId,providerId,messages=[],toolCalls=[],permissions=[],approvedToolCalls=[],memoryReads=[]}={}){
      const tenant=requireTenantId(tenantId);
      if(!Array.isArray(messages)||!Array.isArray(toolCalls)||!Array.isArray(memoryReads)||!Array.isArray(approvedToolCalls))throw new RuntimeError("INVALID_REQUEST","messages, toolCalls, approvedToolCalls and memoryReads must be arrays.");
      const provider=providers.get(providerId),memoryContext=[],toolResults=[];
      for(const item of memoryReads)memoryContext.push(await memory.get({...item,tenantId:tenant}));
      for(const call of toolCalls){
        const approvalRequest={callId:call.id??null,toolName:call.name,tenantId:tenant,args:structuredClone(call.args??{})};
        const approvalRequired=tools.describe().some(tool=>tool.name===call.name&&tool.requiresApproval===true);
        const approvalKey=stableJson(approvalRequest);
        const approved=approvalRequired&&approvedToolCalls.some(item=>item&&item.callId===approvalRequest.callId&&item.toolName===approvalRequest.toolName&&item.tenantId===tenant&&stableJson(item.args??{})===stableJson(approvalRequest.args));
        if(approved&&consumedApprovals.has(approvalKey)){
          toolResults.push({id:call.id??null,name:call.name,status:"error",error:{code:"TOOL_APPROVAL_REPLAYED",message:"This approval has already been consumed; request a new approval."}});
          await audit.write({tenantId:tenant,type:"tool.approval_replayed",at:clock(),outcome:"error",metadata:{tool:call.name,callId:call.id??null}});
          continue;
        }
        if(approved)consumedApprovals.add(approvalKey);
        try{
          const result=await tools.execute({...call,callId:call.id,tenantId:tenant,permissions,approved});
          toolResults.push({id:call.id??null,name:call.name,status:"success",result});
          await audit.write({tenantId:tenant,type:"tool.execution",at:clock(),outcome:"success",metadata:{tool:call.name,callId:call.id??null,approved}});
        }catch(error){
          const awaitingApproval=error.code==="TOOL_APPROVAL_REQUIRED";
          const status=awaitingApproval?"awaiting_approval":"error";
          toolResults.push({id:call.id??null,name:call.name,status,error:{code:error.code??"TOOL_EXECUTION_FAILED",message:error.message},...(awaitingApproval?{approvalRequest}: {})});
          await audit.write({tenantId:tenant,type:awaitingApproval?"tool.approval_required":"tool.execution",at:clock(),outcome:status,metadata:{tool:call.name,callId:call.id??null,code:error.code??"TOOL_EXECUTION_FAILED"}});
        }
      }
      const response=await provider.complete({tenantId:tenant,messages:structuredClone(messages),memory:memoryContext,toolResults,availableTools:tools.describe()});
      await audit.write({tenantId:tenant,type:"provider.completion",at:clock(),outcome:"success",metadata:{provider:providerId,toolCount:toolCalls.length}});
      return{status:toolResults.some(item=>item.status==="awaiting_approval")?"awaiting_approval":"completed",providerId,memory:memoryContext,toolResults,response};
    },
    async readMemory({tenantId,namespace,key}){return memory.get({tenantId:requireTenantId(tenantId),namespace,key});},
    async writeMemory({tenantId,namespace,key,value}){const tenant=requireTenantId(tenantId),result=await memory.set({tenantId:tenant,namespace,key,value});await audit.write({tenantId:tenant,type:"memory.write",at:clock(),outcome:"success",metadata:{namespace,key}});return result;}
  });
}