export default {
  async fetch(req, env) {
    const ip = req.headers.get("cf-connecting-ip");
    const t0 = Date.now();
    const res = await fetch(env.API_URL + "/edge-route?ip=" + ip);
    const { pop } = await res.json();
    const rtt = Date.now() - t0;
    // fire-and-forget event to ledger
    fetch(env.API_URL + "/hooks/edge", {method:"POST",
      headers:{"x-api-key":env.API_TOKEN,"content-type":"application/json"},
      body:JSON.stringify({pop, rtt})});
    return new Response(pop);
  }
}
