const norm=v=>String(v??"").trim().toLocaleLowerCase("ru-RU");
const first=(a,b)=>a!==undefined&&a!==null&&a!==""?a:b;
function metadata(record){
 const a=record?.applicability??{};
 return{
  jurisdiction:first(record?.territory?.jurisdictions?.join("|"),record?.territory?.scope),
  effectiveFrom:record?.validity?.effective_from??record?.validity?.effectiveFrom??null,
  effectiveTo:record?.validity?.effective_to??record?.validity?.effectiveTo??null,
  sectors:(a.sectors??[]).slice().sort().join("|"),
  formats:(a.formats??[]).slice().sort().join("|"),
  definition:first(record?.metric_definition,record?.definitions?.metric),
 };
}
function contextualDifference(a,b){
 const x=metadata(a),y=metadata(b),differences=[];
 for(const key of ["jurisdiction","sectors","formats","definition"])if(norm(x[key])!==norm(y[key])&&(x[key]||y[key]))differences.push(key);
 if(x.effectiveFrom!==y.effectiveFrom||x.effectiveTo!==y.effectiveTo)differences.push("validity_period");
 return differences;
}
/**
 * Semantic detector is injected by the host. Its output is treated as untrusted:
 * only pairs from the supplied corpus survive, and every finding requires review.
 */
export async function detectSemanticConflicts({records=[],detector}={}){
 if(!Array.isArray(records))return{status:"unavailable",reason:"records_must_be_array",conflicts:[]};
 if(!detector||typeof detector.detect!=="function")return{status:"unavailable",reason:"semantic_conflict_detector_not_configured",conflicts:[]};
 const byId=new Map(records.filter(x=>x?.id).map(x=>[x.id,x]));
 let raw;
 try{raw=await detector.detect({records});}
 catch(error){return{status:"unavailable",reason:"semantic_detector_failed",error:String(error?.message??error),conflicts:[]};}
 const candidates=Array.isArray(raw)?raw:raw?.conflicts;
 if(!Array.isArray(candidates))return{status:"unavailable",reason:"invalid_detector_response",conflicts:[]};
 const seen=new Set(),conflicts=[];
 for(const item of candidates){
  const ids=item?.recordIds??[item?.leftId??item?.record_a,item?.rightId??item?.record_b];
  if(!Array.isArray(ids)||ids.length!==2||ids[0]===ids[1])continue;
  const [left,right]=ids, a=byId.get(left),b=byId.get(right);
  if(!a||!b)continue;
  const key=[left,right].sort().join("::");if(seen.has(key))continue;seen.add(key);
  const contextualDifferences=contextualDifference(a,b);
  const proposed=norm(item.kind??item.type);
  const classification=contextualDifferences.length
   ?"contextual_difference"
   :["contradiction","direct_contradiction","semantic_contradiction"].includes(proposed)
    ?"potential_contradiction":"related_claims_review";
  conflicts.push({
   recordIds:[left,right],records:[a,b],classification,
   contextualDifferences,
   detectorReason:typeof item.reason==="string"?item.reason:null,
   confidence:Number.isFinite(Number(item.confidence))?Number(item.confidence):null,
   status:"human_review_required",
   resolution:"unresolved"
  });
 }
 return{status:conflicts.length?"review_required":"ok",conflicts};
}
