import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { COMMODITIES, SAMPLE_PRICES } from "../config";
import { fetchMarkets } from "../lib/functions";

/* Markets — a dark "trading terminal" view. Data logic is unchanged and still
   honest (clearly LIVE vs SAMPLE, missing commodities reported); only the
   presentation is the finance-floor reskin. */
export default function MarketsPage() {
  const [prices, setPrices] = useState(null);
  const [missing, setMissing] = useState([]);
  const [live, setLive] = useState(false);
  const [reason, setReason] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchMarkets();
    if (res?.available && res.prices && Object.keys(res.prices).length > 0) {
      setPrices(res.prices); setMissing(res.missing || []); setLive(true); setReason(null);
    } else {
      setPrices(SAMPLE_PRICES); setMissing([]); setLive(false);
      setReason(res?.reason || "Live feed unavailable.");
    }
    setUpdated(new Date()); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const groups = [...new Set(COMMODITIES.map((c) => c.group))];
  const missingNames = new Set(missing.map((m) => m.name));

  /* faint candlestick backdrop (decorative) */
  const candles = useMemo(() =>
    Array.from({ length: 34 }, (_, i) => {
      const up = Math.random() > 0.5;
      const h = 14 + Math.random() * 46;
      const wick = h + 6 + Math.random() * 14;
      return { up, h, wick, t: Math.random() * (60 - wick) };
    }), []);

  const T = {
    wrap: { position: "relative", margin: "-22px -16px -96px", minHeight: "calc(100dvh - 120px)", padding: "22px 16px 110px", background: "linear-gradient(165deg,#070b12 0%,#0b1320 55%,#0a0f18 100%)", overflow: "hidden", color: "#e6edf3" },
    grid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(56,189,248,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.07) 1px,transparent 1px)", backgroundSize: "34px 34px", animation: "fbgrid 18s linear infinite", maskImage: "linear-gradient(180deg,#000 0%,#000 60%,transparent 100%)", WebkitMaskImage: "linear-gradient(180deg,#000 0%,#000 60%,transparent 100%)" },
    candleRow: { position: "absolute", left: 0, right: 0, bottom: 120, height: 64, display: "flex", alignItems: "flex-end", gap: 8, opacity: 0.22, animation: "fbdrift 40s linear infinite", pointerEvents: "none" },
    content: { position: "relative", zIndex: 1 },
    head: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    title: { fontSize: 13, fontWeight: 700, letterSpacing: 3, color: "#7dd3fc", margin: 0, fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace" },
    sub: { fontSize: 22, fontWeight: 700, letterSpacing: -0.5, margin: "2px 0 0" },
    statusPill: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, padding: "5px 11px", borderRadius: 20, fontFamily: "ui-monospace,monospace", border: "1px solid", letterSpacing: 0.5 },
    banner: { display: "flex", alignItems: "center", gap: 7, background: "rgba(250,204,21,.08)", color: "#fde68a", fontSize: 12, padding: "10px 12px", borderRadius: 11, marginBottom: 16, border: "1px solid rgba(250,204,21,.25)", lineHeight: 1.4 },
    group: { marginBottom: 18 },
    groupHead: { fontSize: 11, fontWeight: 700, color: "#5b6b7d", marginBottom: 9, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "ui-monospace,monospace" },
    row: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(148,178,255,.04)", border: "1px solid rgba(125,211,252,.12)", borderRadius: 12, padding: "13px 15px", marginBottom: 9, backdropFilter: "blur(6px)" },
    label: { fontSize: 15, fontWeight: 600, color: "#e6edf3" },
    unit: { fontSize: 10.5, color: "#5b6b7d", marginTop: 2, fontFamily: "ui-monospace,monospace", letterSpacing: 0.5 },
    val: { fontSize: 21, fontWeight: 700, color: "#f0f6fc", fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace", letterSpacing: -0.5 },
    chg: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontSize: 12.5, fontWeight: 700, marginTop: 3, fontFamily: "ui-monospace,monospace" },
    refresh: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "linear-gradient(90deg,#0ea5e9,#22d3ee)", color: "#04121f", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700, marginTop: 6, letterSpacing: 0.5, boxShadow: "0 6px 22px rgba(34,211,238,.3)" },
    disc: { fontSize: 11, color: "#5b6b7d", lineHeight: 1.5, marginTop: 14 },
    empty: { textAlign: "center", color: "#5b6b7d", padding: "50px 20px" },
  };

  return (
    <div style={T.wrap}>
      <style>{`
        @keyframes fbgrid { from { background-position:0 0,0 0 } to { background-position:0 34px,34px 0 } }
        @keyframes fbdrift { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        @keyframes fbpulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 currentColor} 50%{opacity:.5;box-shadow:0 0 8px 1px currentColor} }
      `}</style>
      <div style={T.grid} />
      <div style={T.candleRow}>
        {[...candles, ...candles].map((c, i) => (
          <div key={i} style={{ position: "relative", width: 8, height: 64, flexShrink: 0 }}>
            <div style={{ position: "absolute", left: 3.5, bottom: c.t, width: 1, height: c.wick, background: c.up ? "#22e39b" : "#ff5d6c" }} />
            <div style={{ position: "absolute", left: 0, bottom: c.t + 3, width: 8, height: c.h, background: c.up ? "#22e39b" : "#ff5d6c", borderRadius: 1 }} />
          </div>
        ))}
      </div>

      <div style={T.content}>
        <div style={T.head}>
          <div>
            <p style={T.title}>◢ MARKETS</p>
            <h1 style={T.sub}>Commodities</h1>
          </div>
          <span style={{ ...T.statusPill, color: live ? "#22e39b" : "#fbbf24", borderColor: live ? "rgba(34,227,155,.4)" : "rgba(251,191,36,.4)", background: live ? "rgba(34,227,155,.08)" : "rgba(251,191,36,.08)" }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: "currentColor", animation: "fbpulse 1.8s ease-in-out infinite" }} />
            {live ? "LIVE" : "SAMPLE"}{updated && ` · ${updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </span>
        </div>

        {!live && !loading && (
          <div style={T.banner}><AlertTriangle size={13} /> Sample prices — not real quotes. {reason}</div>
        )}
        {live && !loading && missing.length > 0 && (
          <div style={T.banner}><AlertTriangle size={13} /> {missing.length} of {COMMODITIES.length} unavailable — free feeds rotate weekly. Shown prices are real.</div>
        )}
        {loading && <div style={T.empty}><Activity size={26} /><div style={{ marginTop: 8, fontFamily: "ui-monospace,monospace" }}>Fetching feed…</div></div>}

        {!loading && groups.map((g) => (
          <div key={g} style={T.group}>
            <div style={T.groupHead}>{g}</div>
            {COMMODITIES.filter((c) => c.group === g).map((c) => {
              const p = prices?.[c.name];
              if (!p) {
                const isMissing = live && missingNames.has(c.name);
                return (
                  <div key={c.name} style={{ ...T.row, opacity: 0.45 }}>
                    <div><div style={T.label}>{c.label}</div><div style={T.unit}>{c.unit}</div></div>
                    <div style={{ ...T.unit, fontSize: 12 }}>{isMissing ? "not in rotation" : "unavailable"}</div>
                  </div>
                );
              }
              const price = p.price / 100, prev = p.prev / 100, chg = price - prev;
              const pct = prev ? (chg / prev) * 100 : 0;
              const up = chg > 0.00005, down = chg < -0.00005;
              const col = up ? "#22e39b" : down ? "#ff5d6c" : "#8b98a5";
              const Arrow = up ? TrendingUp : down ? TrendingDown : Minus;
              return (
                <div key={c.name} style={{ ...T.row, borderColor: up ? "rgba(34,227,155,.25)" : down ? "rgba(255,93,108,.25)" : "rgba(125,211,252,.12)" }}>
                  <div><div style={T.label}>{c.label}</div><div style={T.unit}>{c.unit}</div></div>
                  <div style={{ textAlign: "right" }}>
                    <div style={T.val}>{price.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div style={{ ...T.chg, color: col, textShadow: `0 0 10px ${col}55` }}>
                      <Arrow size={13} />{chg >= 0 ? "+$" : "−$"}{Math.abs(chg).toFixed(2)} ({pct >= 0 ? "+" : ""}{pct.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <button onClick={load} style={T.refresh}><RefreshCw size={15} /> REFRESH FEED</button>
        {!loading && <p style={T.disc}>Reference only · free feeds are end-of-day or ~15-min delayed, not live tick data. Verify with your elevator or broker before marketing.</p>}
      </div>
    </div>
  );
}
