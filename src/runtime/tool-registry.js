import {RuntimeError,requireTenantId} from "./errors.js";
function validateArguments(schema={},args={}){if(!args||typeof args!=="object"||Array.isArray(args))return "arguments must be an object";for(const k of schema.required??[])if(args[k]===undefined||args[k]===null)return `missing required argument: ${k}`;if(schema.additionalProperties===false){const allowed=new Set(Object.keys(schema.properties??{}));const extra=Object.keys(args).find(k=>!allowed.has(k));if(extra)return `unknown argument: ${extra}`;}for(const [k,r] of Object.entries(schema.properties??{})){if(args[k]===undefined||args[k]===null)continue;const v=args[k];const ok=r.type==="number"?Number.isFinite(v):r.type==="integer"?Number.isInteger(v):r.type==="string"?typeof v==="string":r.type==="boolean"?typeof v==="boolean":r.type==="array"?Array.isArray(v):r.type==="object"?typeof v==="object"&&!Array.isArray(v):true;if(!ok)return `invalid type for argument: ${k}`;if(r.enum&&!r.enum.includes(v))return `invalid value for argument: ${k}`;}return null;}
export class ToolRegistry{
  #tools=new Map();
  register({name,description="",schema={type:"object"},approval="required",execute}){
    if(!name||typeof execute!=="function")throw new RuntimeError("INVALID_TOOL","Tool requires name and execute function.");
    if(!["required","not_required"].includes(approval))throw new RuntimeError("INVALID_TOOL_APPROVAL_MODE","Tool approval must be required or not_required.");
    if(this.#tools.has(name))throw new RuntimeError("DUPLICATE_TOOL",`Tool already registered: ${name}`);
    this.#tools.set(name,{name,description,schema,approval,execute});return this;
  }
  describe(){return [...this.#tools.values()].map(({name,description,schema,approval})=>({name,description,schema,approval,requiresApproval:approval==="required"}));}
  async execute({name,args={},tenantId,permissions=[],approved=false}={}){
    const tenant=requireTenantId(tenantId),tool=this.#tools.get(name);
    if(!tool)throw new RuntimeError("TOOL_NOT_FOUND",`Tool is not registered: ${name}`);
    if(!permissions.includes(name))throw new RuntimeError("TOOL_FORBIDDEN",`Tool is not allowed: ${name}`);
    if(tool.approval==="required"&&approved!==true)throw new RuntimeError("TOOL_APPROVAL_REQUIRED",`Explicit approval is required for tool: ${name}`);
    const invalid=validateArguments(tool.schema,args);
    if(invalid)throw new RuntimeError("INVALID_TOOL_ARGUMENTS",invalid,{tool:name});
    return tool.execute({...args,tenantId:tenant});
  }
}