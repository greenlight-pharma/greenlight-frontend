// Guia clínico com conteúdo próprio da WMed. O corpo é Markdown (GFM); links internos usam #modulo?param=valor.
export interface Guide{id:string;title:string;area:string;summary:string;sources:[string,string][];body:string}
