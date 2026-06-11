import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Newspaper } from "lucide-react";
import { S } from "../styles";
import { fetchAgNews } from "../lib/functions";

/* Ag supply-chain news: fertilizer, grain shipping, tariffs & trade, inputs.
   Headlines come from public outlets via Google News RSS, selected by
   keywords — the app says so plainly rather than presenting them as curated. */

const TOPICS = [
  { id: "all", label: "All" },
  { id: "fertilizer", label: "Fertilizer" },
  { id: "grain", label: "Grain & Shipping" },
  { id: "trade", label: "Tariffs & Trade" },
  { id: "inputs", label: "Fuel & Inputs" },
];

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsPage() {
  const [topic, setTopic] = useState("all");
  const [items, setItems] = useState([]);
  const [available, setAvailable] = useState(true);
  const [reason, setReason] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (t) => {
    setLoading(true);
    const res = await fetchAgNews(t);
    if (res?.available) {
      setItems(res.items || []);
      setAvailable(true);
      setReason(null);
    } else {
      setItems([]);
      setAvailable(false);
      setReason(res?.reason || "News feed unavailable.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(topic); }, [topic, load]);

  return (
    <>
      <div style={S.pageHead}>
        <h1 style={S.h1}>Ag News</h1>
        <p style={S.sub}>Supply, shipping &amp; trade headlines</p>
      </div>

      <div style={S.chipRow}>
        {TOPICS.map((t) => (
          <button key={t.id} onClick={() => setTopic(t.id)}
            style={{ ...S.topicChip, ...(topic === t.id ? S.topicChipOn : {}) }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div style={S.empty}>Loading headlines…</div>}

      {!loading && !available && (
        <div style={S.banner}><AlertTriangle size={13} /> {reason}</div>
      )}

      {!loading && available && items.length === 0 && (
        <div style={S.empty}>
          <Newspaper size={36} strokeWidth={1.4} style={{ opacity: 0.35 }} />
          <p style={{ margin: "10px 0 0" }}>No headlines found for this topic right now.</p>
        </div>
      )}

      {!loading && items.map((it, i) => (
        <a key={i} href={it.link} target="_blank" rel="noopener noreferrer" style={S.newsCard}>
          <div style={S.newsMeta}>
            <span>{it.source || "Unknown source"}</span>
            {it.date && <span>· {timeAgo(it.date)}</span>}
          </div>
          <p style={S.newsTitle}>{it.title}</p>
        </a>
      ))}

      {!loading && (
        <>
          <button onClick={() => load(topic)} style={S.refreshBtn}>
            <RefreshCw size={15} /> Refresh headlines
          </button>
          <p style={S.disclaimer}>
            Headlines are pulled from public news feeds and matched by keywords —
            not curated or fact-checked. Tap any headline to read the full story at its source.
          </p>
        </>
      )}
    </>
  );
}
