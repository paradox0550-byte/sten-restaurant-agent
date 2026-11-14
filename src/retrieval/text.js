const STOP=new Set(["и","в","во","на","по","для","при","из","к","с","со","о","об","the","a","an","and","or","of","to","for","in","on","with","by","is","are"]);
export function normalizeText(value=""){return String(value).normalize("NFKC").toLocaleLowerCase("ru-RU").replace(/ё/g,"е").replace(/[^\p{L}\p{N}]+/gu," ").trim().split(/\s+/u).filter(t=>t.length>1&&!STOP.has(t));}
export function tokenize(value=""){return normalizeText(value);}
export function documentText(d={}){return[d.id,d.title,d.summary,d.content,d.text,...(d.topics??[]),...(d.topic??[]),...(d.tags??[]),d.evidence_class].filter(Boolean).join(" ");}
