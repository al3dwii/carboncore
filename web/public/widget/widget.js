(()=>{ const route=location.pathname;
 fetch("/ecolabel?route="+route).then(r=>r.json()).then(({g_co2})=>{
   const b=document.createElement("div");
   b.style="position:fixed;bottom:8px;right:8px;background:#eee;padding:4px 8px";
   b.textContent=`${g_co2} g CO₂`; document.body.appendChild(b);
   fetch("/hooks/ecolabel",{method:"POST",headers:{"content-type":"application/json"},
     body:JSON.stringify({route, g_co2})});
 });})();
