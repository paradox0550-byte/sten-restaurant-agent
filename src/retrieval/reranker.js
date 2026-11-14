/** Optional injected semantic reranker contract. */
export async function rerankResults({query,results=[],reranker,limit=10}={}){if(!reranker||typeof reranker.rerank!=="function")return{status:"unavailable",reason:"reranker_not_configured",results};const ranked=await reranker.rerank({query,documents:results.map(x=>x.document??x)});return{status:"ok",results:ranked.slice(0,limit)};}
