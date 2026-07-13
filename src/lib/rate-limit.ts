const attempts = new Map<string, { count:number; resetAt:number }>();
export function rateLimit(key:string, limit=8, windowMs=15*60*1000){const now=Date.now();const current=attempts.get(key);if(!current||current.resetAt<now){attempts.set(key,{count:1,resetAt:now+windowMs});return true}if(current.count>=limit)return false;current.count++;return true}
export function requestKey(request:Request,scope:string){return `${scope}:${request.headers.get("x-forwarded-for")?.split(",")[0]||"local"}`}
