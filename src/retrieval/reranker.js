/**
 * Provider-neutral semantic reranking.
 * The provider may return [{id, score}] or [{document, score}]. Only supplied
 * candidate IDs are accepted; source documents and provenance stay attached.
 */
export async function rerankResults({query,results=[],reranker,limit=10}={}){
  if(typeof query!=="string"||!query.trim())return{status:"unavailable",reason:"query_required",results:[]};
  if(!Array.isArray(results))return{status:"unavailable",reason:"results_must_be_array",results:[]};
  if(!reranker||typeof reranker.rerank!=="function")return{status:"unavailable",reason:"reranker_not_configured",results};
  const byId=new Map(results.map((item,index)=>{const document=item.document??item;return[document?.id,{item,document,index}]}).filter(([id])=>id));
  if(!byId.size)return{status:"ok",mode:"semantic",results:[]};
  let response;
  try{response=await reranker.rerank({query,documents:[...byId.values()].map(x=>x.document)});}
  catch(error){return{status:"fallback",reason:"reranker_failed",error:String(error?.message??error),results};}
  const ranked=Array.isArray(response)?response:response?.results;
  if(!Array.isArray(ranked))return{status:"fallback",reason:"invalid_reranker_response",results};
  const seen=new Set(),accepted=[];
  for(const entry of ranked){
    const id=entry?.id??entry?.document?.id;
    const source=byId.get(id);
    if(!source||seen.has(id))continue;
    seen.add(id);
    const score=Number(entry.score);
    accepted.push({...source.item,document:source.document,semanticScore:Number.isFinite(score)?score:null,semanticRank:accepted.length+1});
  }
  // A reranker may omit candidates; preserve them after ranked candidates.
  for(const [id,source] of byId)if(!seen.has(id))accepted.push({...source.item,document:source.document,semanticScore:null,semanticRank:null});
  return{status:"ok",mode:"semantic",results:accepted.slice(0,Math.max(0,limit)),candidateCount:byId.size,rankedCount:seen.size};
}
