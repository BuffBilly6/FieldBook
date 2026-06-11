import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle, Crosshair, Pencil, X, Check, MapPin, Square,
  Trash2, Sprout, Scissors, Calendar, Lightbulb,
} from "lucide-react";
import { HAY_META, FIELD_COLOR } from "../config";
import { S } from "../styles";
import { ringAreaSqMeters, toAcres, centroid } from "../lib/geo";
import { haySuggestion, daysSince } from "../lib/hay";
import { fetchWeather } from "../lib/functions";
import { useTable, cleanValues } from "../hooks/useTable";
import Sheet from "./Sheet";

const polyColor = (f) => (f.is_hay && f.hay_state ? HAY_META[f.hay_state].color : FIELD_COLOR);

export default function FieldsPage({ fields }) {
  const { rows, loading, insert, update, remove } = fields;
  const cuttings = useTable("field_cuttings");

  const mapEl = useRef(null), mapRef = useRef(null), layersRef = useRef({});
  const drawLayerRef = useRef(null), drawPtsRef = useRef([]), drawingRef = useRef(false);
  const [selected, setSelected] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [draftArea, setDraftArea] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [tilesBlocked, setTilesBlocked] = useState(false);

  /* Weather forecast for hay suggestions — one fetch per farm, keyed off the
     centroid of all hay fields. { status, daily } */
  const [weather, setWeather] = useState({ status: "idle", daily: null });

  useEffect(() => { drawingRef.current = drawing; }, [drawing]);

  /* ---- map setup -------------------------------------------------------- */
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { zoomControl: true, attributionControl: false })
      .setView([39.5, -98.35], 4);
    mapRef.current = map;
    const sat = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 21 }
    );
    let errs = 0;
    sat.on("tileerror", () => { if (++errs > 3) setTilesBlocked(true); });
    sat.addTo(map);
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 21, opacity: 0.9 }
    ).addTo(map);
    map.on("click", (e) => {
      if (!drawingRef.current) return;
      drawPtsRef.current.push([e.latlng.lat, e.latlng.lng]);
      const pts = drawPtsRef.current;
      if (drawLayerRef.current) map.removeLayer(drawLayerRef.current);
      if (pts.length >= 2)
        drawLayerRef.current = L.polyline([...pts, pts[0]], { color: "#facc15", weight: 2.5, dashArray: "6 5" }).addTo(map);
      if (pts.length >= 3) setDraftArea(toAcres(ringAreaSqMeters(pts)));
      L.circleMarker(e.latlng, { radius: 5, color: "#facc15", fillColor: "#facc15", fillOpacity: 1 }).addTo(map)._draft = true;
    });
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  /* ---- keep polygons in sync with data, colored by hay state ------------ */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.keys(layersRef.current).forEach((id) => {
      if (!rows.find((f) => f.id === id)) {
        map.removeLayer(layersRef.current[id]);
        delete layersRef.current[id];
      }
    });
    rows.forEach((f) => {
      if (!f.boundary || f.boundary.length < 3) return;
      const sel = f.id === selected;
      const color = polyColor(f);
      const style = {
        color: sel ? "#facc15" : color,
        weight: sel ? 4 : 2.5,
        fillColor: color,
        fillOpacity: sel ? 0.4 : 0.25,
      };
      const tip = `${f.name}${f.acres ? ` · ~${f.acres} ac` : ""}${f.is_hay && f.hay_state ? ` · ${HAY_META[f.hay_state].label}` : ""}`;
      if (layersRef.current[f.id]) {
        layersRef.current[f.id].setStyle(style);
        layersRef.current[f.id].setTooltipContent(tip);
      } else {
        const poly = L.polygon(f.boundary, style).addTo(map);
        poly.on("click", (e) => { L.DomEvent.stop(e); setSelected(f.id); });
        poly.bindTooltip(tip, { direction: "center", className: "fld-tip" });
        layersRef.current[f.id] = poly;
      }
    });
  }, [rows, selected]);

  /* ---- fit map to saved fields on first load ---------------------------- */
  const fitOnce = useRef(false);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitOnce.current || loading) return;
    const all = rows.filter((f) => f.boundary?.length >= 3).flatMap((f) => f.boundary);
    if (all.length) { map.fitBounds(all, { padding: [30, 30] }); fitOnce.current = true; }
  }, [rows, loading]);

  /* ---- weather for hay suggestions -------------------------------------- */
  useEffect(() => {
    if (loading || weather.status !== "idle") return;
    const hayFields = rows.filter((f) => f.is_hay && f.boundary?.length >= 3);
    if (hayFields.length === 0) return;
    const [lat, lon] = centroid(hayFields.flatMap((f) => f.boundary));
    setWeather({ status: "loading", daily: null });
    fetchWeather(lat, lon).then((res) => {
      if (res?.available) setWeather({ status: "ok", daily: res.daily });
      else setWeather({ status: "unavailable", daily: null });
    });
  }, [rows, loading, weather.status]);

  /* ---- drawing ----------------------------------------------------------- */
  function clearDraft() {
    const map = mapRef.current;
    if (!map) return;
    if (drawLayerRef.current) { map.removeLayer(drawLayerRef.current); drawLayerRef.current = null; }
    map.eachLayer((l) => { if (l._draft) map.removeLayer(l); });
    drawPtsRef.current = [];
  }
  const startDraw = () => { setSelected(null); setDrawing(true); drawPtsRef.current = []; setDraftArea(0); };
  const cancelDraw = () => { clearDraft(); setDrawing(false); setDraftArea(0); };
  function finishDraw() {
    if (drawPtsRef.current.length < 3) return;
    setForm({ boundary: [...drawPtsRef.current], acres: draftArea.toFixed(2) });
    setShowForm(true);
    setDrawing(false);
  }

  /* ---- save / delete ------------------------------------------------------ */
  async function save() {
    if (!form.name?.trim()) return;
    const values = {
      ...cleanValues(form, ["name", "crop", "activity", "notes"]),
      boundary: form.boundary,
      acres: parseFloat(form.acres) || null,
      is_hay: !!form.is_hay,
      hay_state: form.is_hay ? "growing" : null,
    };
    const saved = await insert(values);
    if (saved) {
      clearDraft(); setForm({}); setShowForm(false); setSelected(saved.id);
      mapRef.current?.fitBounds(saved.boundary, { padding: [30, 30] });
    }
  }
  const del = (f) => {
    if (!window.confirm(`Delete "${f.name}" and its cutting history? This can't be undone.`)) return;
    remove(f.id);
    if (selected === f.id) setSelected(null);
  };
  const flyTo = (f) => {
    setSelected(f.id);
    if (f.boundary?.length >= 3) mapRef.current?.fitBounds(f.boundary, { padding: [30, 30] });
  };

  /* ---- hay state cycling — only ever user-initiated ----------------------- */
  const setHayState = useCallback(async (f, next) => {
    if (next === "cut") {
      const today = new Date().toISOString().slice(0, 10);
      const n = (f.cutting_number || 0) + 1;
      await cuttings.insert({ field_id: f.id, cutting_number: n, cut_date: today });
      await update(f.id, { hay_state: "cut", cutting_number: n, last_cut_date: today });
    } else {
      await update(f.id, { hay_state: next });
    }
  }, [cuttings, update]);

  const cycleHay = (f) => {
    const next = f.hay_state === "growing" ? "ready" : f.hay_state === "ready" ? "cut" : "growing";
    if (next === "cut" && !window.confirm(`Log cutting #${(f.cutting_number || 0) + 1} for "${f.name}" today?`)) return;
    setHayState(f, next);
  };

  const totalAcres = rows.reduce((s, f) => s + (parseFloat(f.acres) || 0), 0);
  const daily = weather.status === "ok" ? weather.daily : null;

  return (
    <>
      <div style={S.pageHead}>
        <h1 style={S.h1}>Fields</h1>
        <p style={S.sub}>{rows.length} fields · ~{totalAcres.toFixed(1)} acres (estimated)</p>
      </div>

      {tilesBlocked && (
        <div style={S.banner}><AlertTriangle size={13} /> Satellite imagery couldn't load — outlines &amp; acreage still work.</div>
      )}
      {drawing && (
        <div style={{ ...S.banner, background: "#1c1917", color: "#facc15", border: "none" }}>
          <Crosshair size={13} /> Tap the field corners — 3+ then Finish.
        </div>
      )}
      {weather.status === "unavailable" && rows.some((f) => f.is_hay) && (
        <div style={S.banner}>
          <AlertTriangle size={13} /> Weather feed not configured — hay suggestions use cutting dates only.
        </div>
      )}

      <div style={S.mapCard}>
        <div ref={mapEl} style={S.map} />
        {!drawing ? (
          <button style={S.mapDrawBtn} onClick={startDraw}><Pencil size={15} /> Draw field</button>
        ) : (
          <div style={S.mapDrawRow}>
            <button style={S.mapCancel} onClick={cancelDraw}><X size={15} /></button>
            <button style={{ ...S.mapFinish, opacity: drawPtsRef.current.length >= 3 ? 1 : 0.5 }} onClick={finishDraw}>
              <Check size={15} /> Finish · ~{draftArea.toFixed(1)} ac
            </button>
          </div>
        )}
      </div>

      <div style={S.cardList}>
        {!loading && rows.length === 0 && (
          <div style={S.empty}>
            <Square size={32} strokeWidth={1.4} style={{ opacity: 0.35 }} />
            <p style={{ margin: "10px 0 0" }}>No fields mapped yet.</p>
            <p style={S.emptyHint}>Tap “Draw field” and trace one on the map.</p>
          </div>
        )}
        {rows.map((f) => {
          const fieldCuts = cuttings.rows.filter((c) => c.field_id === f.id);
          const sugg = f.is_hay ? haySuggestion(f, daily) : null;
          const hayMeta = f.is_hay && f.hay_state ? HAY_META[f.hay_state] : null;
          const cutDays = daysSince(f.last_cut_date);
          return (
            <div key={f.id} onClick={() => flyTo(f)} style={{ ...S.card, ...(selected === f.id ? S.cardSel : {}) }}>
              <div style={{ ...S.accentBar, background: polyColor(f) }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cardTop}>
                  <h3 style={S.cardTitle}>{f.name}</h3>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {hayMeta && (
                      <button
                        onClick={(e) => { e.stopPropagation(); cycleHay(f); }}
                        style={{ ...S.hayChip, color: hayMeta.color, borderColor: hayMeta.color }}
                        title="Tap to move to the next hay state"
                      >
                        <Scissors size={11} /> {hayMeta.label}
                      </button>
                    )}
                    <span style={S.acreTag}>~{f.acres} ac</span>
                  </div>
                </div>
                <div style={S.metaWrap}>
                  {f.crop && <span style={S.meta}><Sprout size={12} /> {f.crop}</span>}
                  {f.activity && <span style={S.meta}>{f.activity}</span>}
                  {f.is_hay && f.last_cut_date && (
                    <span style={S.meta}>
                      <Calendar size={12} /> Cut #{f.cutting_number} · {cutDays === 0 ? "today" : `${cutDays}d ago`}
                    </span>
                  )}
                </div>

                {sugg && (
                  <div style={S.suggestion} onClick={(e) => e.stopPropagation()}>
                    <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 1, color: "#b45309" }} />
                    <div style={{ flex: 1 }}>
                      {sugg.text}
                      {sugg.action && (
                        <div style={{ marginTop: 6 }}>
                          <button style={S.suggestionBtn} onClick={() => setHayState(f, sugg.action)}>
                            Mark {HAY_META[sugg.action].label}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {f.is_hay && fieldCuts.length > 0 && (
                  <div style={S.cutHistory} onClick={(e) => e.stopPropagation()}>
                    {fieldCuts.slice(0, 3).map((c) => (
                      <div key={c.id} style={S.cutRow}>
                        <span>Cutting #{c.cutting_number}</span>
                        <span>{new Date(c.cut_date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    ))}
                    {fieldCuts.length > 3 && <div style={{ ...S.cutRow, color: "#b5aa98" }}>+{fieldCuts.length - 3} earlier cuts</div>}
                  </div>
                )}

                {f.notes && <p style={S.note}>{f.notes}</p>}
                <p style={S.estNote}>Acreage estimated from your drawn boundary.</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); del(f); }} style={S.del}><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>

      {showForm && (
        <Sheet
          title={<><MapPin size={17} color="#65a30d" style={{ verticalAlign: -3, marginRight: 6 }} />New field · ~{form.acres} ac</>}
          onClose={() => { cancelDraw(); setShowForm(false); }}
          footer={
            <button onClick={save} disabled={!form.name?.trim()} style={{ ...S.primaryBtn, opacity: form.name?.trim() ? 1 : 0.4 }}>
              <Check size={18} /> Save field
            </button>
          }
        >
          {[{ k: "name", label: "Field name", ph: "South 20", req: true },
            { k: "crop", label: "Crop / Use", ph: "Winter rye" },
            { k: "activity", label: "Current activity", ph: "Plant cover crop" }].map((fl) => (
            <label key={fl.k} style={S.field}>
              <span style={S.lbl}>{fl.label}{fl.req && <span style={{ color: "#b91c1c" }}> *</span>}</span>
              <input style={S.input} placeholder={fl.ph} value={form[fl.k] || ""}
                onChange={(e) => setForm({ ...form, [fl.k]: e.target.value })} />
            </label>
          ))}
          <label style={{ ...S.field, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <span style={S.lbl}>Hay field (track cutting cycle)</span>
            <input type="checkbox" checked={!!form.is_hay} style={{ width: 22, height: 22, accentColor: "#4d7c0f" }}
              onChange={(e) => setForm({ ...form, is_hay: e.target.checked })} />
          </label>
          <label style={S.field}>
            <span style={S.lbl}>Notes</span>
            <textarea style={{ ...S.input, minHeight: 60, resize: "none" }} value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
        </Sheet>
      )}
    </>
  );
}
