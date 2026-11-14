function validVector(vector){return Array.isArray(vector)&&vector.length>0&&vector.every(Number.isFinite);}
function cosine(a,b){if(!validVector(a)||!validVector(b)||a.length!==b.length)throw new TypeError("Vectors must be finite, non-empty arrays with equal dimensions");let dot=0,aa=0,bb=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}return aa&&bb?dot/(Math.sqrt(aa)*Math.sqrt(bb)):0;}
export class InMemoryVectorIndex{
 #items=new Map();
 upsert(items=[]){for(const item of items){if(!item?.id||!validVector(item.vector))throw new TypeError("Each vector item requires an id and a finite non-empty vector");const existing=this.#items.values().next().value;if(existing&&existing.vector.length!==item.vector.length)throw new TypeError("All indexed vectors must have equal dimensions");this.#items.set(item.id,{...item,vector:[...item.vector]});}return{status:"ok",count:this.#items.size};}
 delete(ids=[]){for(const id of ids)this.#items.delete(id);return{status:"ok",count:this.#items.size};}
 search({vector,limit=10,filter}={}){if(!validVector(vector))throw new TypeError("A finite non-empty query vector is required");const results=[];for(const item of this.#items.values()){if(filter&&!filter(item))continue;results.push({id:item.id,score:cosine(vector,item.vector),metadata:item.metadata??null});}return results.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,Math.max(0,limit));}
 get size(){return this.#items.size;}
}
