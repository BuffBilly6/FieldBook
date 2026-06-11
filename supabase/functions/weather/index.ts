/* Weather proxy — keeps the OpenWeatherMap key server-side.
   Input:  { lat, lon }
   Output: { available: true, daily: [{ date, rainProb, tempHigh }] }
           or { available: false, reason }.
   Powers hay readiness suggestions; the app treats it as one imperfect
   signal among others, never as ground truth. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

  const key = Deno.env.get("OPENWEATHER_KEY");
  if (!key) {
    return json({ available: false, reason: "Weather API key not configured yet." });
  }

  let lat: number, lon: number;
  try {
    const body = await req.json();
    lat = Number(body.lat);
    lon = Number(body.lon);
    if (!isFinite(lat) || !isFinite(lon)) throw new Error("bad coords");
  } catch {
    return json({ available: false, reason: "Missing or invalid lat/lon." }, 400);
  }

  try {
    /* 5-day / 3-hour forecast, metric-agnostic (we only need pop + temp). */
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();

    /* Collapse 3-hour slots into days: max rain probability, max temp. */
    const byDay = new Map<string, { rainProb: number; tempHigh: number }>();
    for (const slot of j.list ?? []) {
      const date = (slot.dt_txt ?? "").slice(0, 10);
      if (!date) continue;
      const cur = byDay.get(date) ?? { rainProb: 0, tempHigh: -Infinity };
      cur.rainProb = Math.max(cur.rainProb, slot.pop ?? 0);
      cur.tempHigh = Math.max(cur.tempHigh, slot.main?.temp_max ?? -Infinity);
      byDay.set(date, cur);
    }
    const daily = [...byDay.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, d]) => ({
        date,
        rainProb: Math.round(d.rainProb * 100) / 100,
        tempHigh: d.tempHigh === -Infinity ? null : Math.round(d.tempHigh),
      }));

    return json({ available: true, daily });
  } catch (e) {
    return json({ available: false, reason: `Weather feed error: ${String(e)}` });
  }
});
