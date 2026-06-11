/* Markets proxy — keeps the api-ninjas key server-side.
   Uses the batch `names` endpoint: free-tier keys only have access to a
   rotating weekly subset of commodities, and the batch call returns
   per-commodity results so one unavailable commodity never sinks the rest.
   Returns { available, prices, missing, reason? }:
     prices:  { corn: { price, prev, updated }, ... }  (only what succeeded)
     missing: [{ name, reason }]                        (honestly reported)   */
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
    return json({ available: false, prices: {}, missing: [], reason: "Markets API key not configured yet." });
  }

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/commodityprice?names=${COMMODITIES.join(",")}`,
      { headers: { "X-Api-Key": key } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error("unexpected response shape");

    const prices: Record<string, unknown> = {};
    const missing: { name: string; reason: string }[] = [];

    rows.forEach((row, i) => {
      const slug = COMMODITIES[i];
      if (!slug) return;
      if (row && typeof row.price === "number") {
        prices[slug] = {
          price: row.price,
          prev: row.previous_close ?? row.price,
          updated: row.updated ?? null,
        };
      } else {
        missing.push({ name: slug, reason: String(row?.error ?? "no data returned") });
      }
    });

    const any = Object.keys(prices).length > 0;
    return json({
      available: any,
      prices,
      missing,
      reason: any
        ? null
        : "No prices available — free api-ninjas plans rotate which commodities are accessible each week.",
    });
  } catch (e) {
    return json({ available: false, prices: {}, missing: [], reason: `Price feed error: ${String(e)}` });
  }
});
