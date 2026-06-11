/* Ag news proxy — pulls supply-chain / trade headlines from Google News RSS
   (public feed, no API key required) and returns clean JSON.
   Input:  { topic } — one of: all, fertilizer, grain, trade, inputs
   Output: { available: true, items: [{ title, link, date, source }] }
           or { available: false, reason }. */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TOPIC_QUERIES: Record<string, string> = {
  all: '"agriculture" (supply OR shipping OR exports OR tariffs OR fertilizer)',
  fertilizer: "fertilizer (price OR supply OR potash OR urea OR nitrogen)",
  grain: "grain (exports OR shipping OR barge OR rail OR elevator)",
  trade: "agriculture (tariffs OR trade OR imports OR exports)",
  inputs: "farm (diesel OR propane OR \"natural gas\" OR inputs OR seed) cost",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decodeEntities(m[1]) : "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let topic = "all";
  try {
    const body = await req.json();
    if (body?.topic && TOPIC_QUERIES[body.topic]) topic = body.topic;
  } catch { /* default topic */ }

  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(TOPIC_QUERIES[topic])}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Fieldbook ag news)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, 20)
      .map(([, block]) => ({
        title: tag(block, "title"),
        link: tag(block, "link"),
        date: tag(block, "pubDate"),
        source: tag(block, "source"),
      }))
      .filter((it) => it.title && it.link);

    return json({ available: true, items });
  } catch (e) {
    return json({ available: false, reason: `News feed error: ${String(e)}` });
  }
});
