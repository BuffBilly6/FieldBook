/* Markets proxy — keeps the api-ninjas key server-side.
   Returns { available: true, prices } or { available: false, reason }.
   The app shows clearly-labeled sample prices when unavailable. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const COMMODITIES = ["corn", "soybean", "wheat", "live_cattle", "feeder_cattle", "lean_hogs"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key = Deno.env.get("API_NINJAS_KEY");
  if (!key) {
    return json({ available: false, reason: "Markets API key not configured yet." });
  }

  try {
    const out: Record<string, unknown> = {};
    for (const name of COMMODITIES) {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/commodityprice?name=${encodeURIComponent(name)}`,
        { headers: { "X-Api-Key": key } },
      );
      if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
      const j = await res.json();
      out[name] = {
        price: j.price,
        prev: j.previous_close ?? j.price,
        exchange: j.exchange ?? null,
        updated: j.updated ?? null,
      };
    }
    return json({ available: true, prices: out });
  } catch (e) {
    return json({ available: false, reason: `Price feed error: ${String(e)}` });
  }
});
