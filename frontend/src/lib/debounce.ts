export function debounce<T extends unknown[]>(fn:(...a:T)=>void, ms=400){
  let h:NodeJS.Timeout;
  return (...args:T)=>{ clearTimeout(h); h=setTimeout(()=>fn(...args),ms); };
}
