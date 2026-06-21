/* Markets proxy — keeps the api-ninjas key server-side.
   Free-tier keys must use the SINGULAR `name` parameter (the batch `names`
   parameter is a paid-plan feature and returns HTTP 400 on free tier), and
   free keys can access only a rotating 7-commodity subset each week. So we
   query each commodity individually and report per-commodity results, which
   means one unavailable/rotated commodity never sinks the rest.
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

  /* One request per commodity (free tier only allows the singular `name`). */
  const results = await Promise.all(
    COMMODITIES.map(async (slug) => {
      try {
        const res = await fetch(
          `https://api.api-ninjas.com/v1/commodityprice?name=${slug}`,
          { headers: { "X-Api-Key": key } },
        );
        if (!res.ok) {
          // 400/403/404 here usually means this commodity isn't in the free
          // tier's rotation this week — report it, don't fail the whole call.
          return { slug, ok: false as const, reason: `not available this week (HTTP ${res.status})` };
        }
        const row = await res.json();
        const price = row?.price ?? row?.[0]?.price;
        if (typeof price === "number") {
          const r = Array.isArray(row) ? row[0] : row;
          return {
            slug,
            ok: true as const,
            price,
            prev: r.previous_close ?? (typeof r.change_24h === "number" ? price - r.change_24h : price),
            updated: r.updated ?? null,
          };
        }
        return { slug, ok: false as const, reason: "no data returned" };
      } catch (e) {
        return { slug, ok: false as const, reason: `fetch error: ${String(e)}` };
      }
    }),
  );

  const prices: Record<string, unknown> = {};
  const missing: { name: string; reason: string }[] = [];
  for (const r of results) {
    if (r.ok) prices[r.slug] = { price: r.price, prev: r.prev, updated: r.updated };
    else missing.push({ name: r.slug, reason: r.reason });
  }

  const any = Object.keys(prices).length > 0;
  return json({
    available: any,
    prices,
    missing,
    reason: any
      ? null
      : "No prices available — free api-ninjas keys rotate which 7 commodities are accessible each week.",
  });
});
