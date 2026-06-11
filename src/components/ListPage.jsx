import React, { useEffect, useState } from "react";
import { Plus, Check, Clock, ChevronRight, Trash2, Wrench, Calendar } from "lucide-react";
import { FORMS, STATUSES, STATUS_META } from "../config";
import { S } from "../styles";
import { cleanValues } from "../hooks/useTable";
import Sheet from "./Sheet";

/* One page handles Vehicles, Fencing, Livestock, and Projects —
   same card list, different form fields (see FORMS in config.js). */
export default function ListPage({ tab, table }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});
  const formFields = FORMS[tab.id];

  useEffect(() => { setAdding(false); setForm({}); }, [tab.id]);

  const { rows, loading, insert, update, remove } = table;
  const open = rows.filter((r) => r.status !== "done");
  const done = rows.filter((r) => r.status === "done");

  async function add() {
    if (!form.name?.trim()) return;
    const values = cleanValues(form, formFields.map((f) => f.k));
    const saved = await insert(values);
    if (saved) { setForm({}); setAdding(false); }
  }

  const cycle = (row) =>
    update(row.id, { status: STATUSES[(STATUSES.indexOf(row.status) + 1) % STATUSES.length] });

  const del = (row) => {
    if (window.confirm(`Delete "${row.name}"? This can't be undone.`)) remove(row.id);
  };

  const overdue = (r) =>
    r.due && r.status !== "done" && new Date(r.due + "T00:00:00") < new Date(new Date().toDateString());

  return (
    <>
      <div style={S.pageHead}>
        <h1 style={S.h1}>{tab.label}</h1>
        <p style={S.sub}>{open.length} open · {done.length} done</p>
      </div>

      {loading && <div style={S.empty}>Loading…</div>}
      {!loading && rows.length === 0 && (
        <div style={S.empty}>
          <tab.icon size={36} strokeWidth={1.4} style={{ opacity: 0.35 }} />
          <p style={{ margin: "10px 0 0" }}>No {tab.label.toLowerCase()} yet.</p>
          <p style={S.emptyHint}>Tap + to add your first entry.</p>
        </div>
      )}

      <div style={S.cardList}>
        {[...open, ...done].map((row) => {
          const meta = STATUS_META[row.status];
          const od = overdue(row);
          return (
            <div key={row.id} style={{ ...S.card, opacity: row.status === "done" ? 0.55 : 1 }}>
              <div style={{ ...S.accentBar, background: od ? "#b91c1c" : "#4d7c0f" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.cardTop}>
                  <h3 style={{ ...S.cardTitle, textDecoration: row.status === "done" ? "line-through" : "none" }}>
                    {row.name}
                  </h3>
                  <button onClick={() => cycle(row)} style={{ ...S.chip, color: meta.color, borderColor: meta.color }}>
                    {row.status === "done" ? <Check size={11} /> : row.status === "in-progress" ? <Clock size={11} /> : <ChevronRight size={11} />}
                    {meta.label}
                  </button>
                </div>
                <div style={S.metaWrap}>
                  {row.task && <span style={S.meta}><Wrench size={12} /> {row.task}</span>}
                  {row.head_count && <span style={S.meta}>{row.head_count} head</span>}
                  {row.length && <span style={S.meta}>{row.length}</span>}
                  {row.material && <span style={S.meta}>{row.material}</span>}
                  {row.hours && <span style={S.meta}>{row.hours}</span>}
                  {row.est_cost && <span style={S.meta}>{row.est_cost}</span>}
                  {row.due && (
                    <span style={{ ...S.meta, color: od ? "#b91c1c" : "#6b6253", fontWeight: od ? 700 : 500 }}>
                      <Calendar size={12} />{od ? "Overdue " : "Due "}
                      {new Date(row.due + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
                {row.notes && <p style={S.note}>{row.notes}</p>}
              </div>
              <button onClick={() => del(row)} style={S.del}><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>

      {!adding && (
        <button style={S.fab} onClick={() => setAdding(true)}>
          <Plus size={26} strokeWidth={2.6} />
        </button>
      )}

      {adding && (
        <Sheet
          title={`New ${tab.label.replace(/s$/, "")}`}
          onClose={() => setAdding(false)}
          footer={
            <button onClick={add} disabled={!form.name?.trim()}
              style={{ ...S.primaryBtn, opacity: form.name?.trim() ? 1 : 0.4 }}>
              <Check size={18} /> Save entry
            </button>
          }
        >
          {formFields.map((f) => (
            <label key={f.k} style={S.field}>
              <span style={S.lbl}>{f.label}{f.required && <span style={{ color: "#b91c1c" }}> *</span>}</span>
              {f.type === "textarea" ? (
                <textarea style={{ ...S.input, minHeight: 70, resize: "none" }} value={form[f.k] || ""} placeholder={f.ph}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
              ) : (
                <input type={f.type || "text"} style={S.input} value={form[f.k] || ""} placeholder={f.ph}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
              )}
            </label>
          ))}
        </Sheet>
      )}
    </>
  );
}
