import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { COMMODITIES, SAMPLE_PRICES } from "../config";
import { S } from "../styles";
import { fetchMarkets } from "../lib/functions";

/* HONESTY RULE: prices are either clearly LIVE or clearly SAMPLE.
   We never show sample numbers without saying so. */
export default function MarketsPage() {
  const [prices, setPrices] = useState(null);
  const [live, setLive] = useState(false);
  const [reason, setReason] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchMarkets();
    if (res?.available && res.prices) {
      setPrices(res.prices);
      setLive(true);
      setReason(null);
    } else {
      setPrices(SAMPLE_PRICES);
      setLive(false);
      setReason(res?.reason || "Live feed unavailable.");
    }
    setUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const groups = [...new Set(COMMODITIES.map((c) => c.group))];

  return (
    <>
      <div style={S.pageHead}>
        <h1 style={S.h1}>Markets</h1>
        <p style={S.sub}>
          <span style={{ ...S.liveDot, background: live ? "#4d7c0f" : "#d6a93b" }} />
          {live ? "Live" : "Sample"}{updated && ` · ${updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </p>
      </div>

      {!live && !loading && (
        <div style={S.banner}>
          <AlertTriangle size={13} /> Sample prices — not real quotes. {reason}
        </div>
      )}
      {loading && <div style={S.empty}>Loading prices…</div>}

      {!loading && groups.map((g) => (
        <div key={g} style={{ marginBottom: 18 }}>
          <div style={S.groupHead}>{g}</div>
          {COMMODITIES.filter((c) => c.group === g).map((c) => {
            const p = prices?.[c.name];
            if (!p) return null;
            const chg = p.price - p.prev;
            const pct = p.prev ? (chg / p.prev) * 100 : 0;
            const up = chg > 0.0001, down = chg < -0.0001;
            const col = up ? "#4d7c0f" : down ? "#b91c1c" : "#9a8c78";
            const Arrow = up ? TrendingUp : down ? TrendingDown : Minus;
            return (
              <div key={c.name} style={S.priceRow}>
                <div>
                  <div style={S.priceLabel}>{c.label}</div>
                  <div style={S.priceUnit}>{c.unit}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={S.priceVal}>
                    {p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ ...S.priceChg, color: col }}>
                    <Arrow size={13} />{chg >= 0 ? "+" : ""}{chg.toFixed(2)} ({pct >= 0 ? "+" : ""}{pct.toFixed(2)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <button onClick={load} style={S.refreshBtn}><RefreshCw size={15} /> Refresh prices</button>
      {!loading && (
        <p style={S.disclaimer}>
          Reference only. Free feeds are end-of-day or ~15-min delayed, not live tick data.
          Verify with your elevator or broker before marketing.
        </p>
      )}
    </>
  );
}
