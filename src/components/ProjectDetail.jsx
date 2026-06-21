import React, { useEffect, useState } from "react";
import {
  ChevronLeft, Plus, Check, Circle, CheckCircle2, Clock, ChevronRight,
  Trash2, Calendar, Box, Ruler, Package, ListChecks,
} from "lucide-react";
import { STATUSES, STATUS_META, PROJECT_ASSETS } from "../config";
import { S } from "../styles";
import Sheet from "./Sheet";

const byCreated = (a, b) => new Date(a.created_at) - new Date(b.created_at);

const DETAIL_TABS = [
  { id: "todo", label: "To-Do", icon: ListChecks },
  { id: "done", label: "Done", icon: Check },
  { id: "3d", label: "3D", icon: Box },
  { id: "blueprint", label: "Blueprint", icon: Ruler },
  { id: "resources", label: "Resources", icon: Package },
];

/* One project's detail view: tabbed To-Do / Done / 3D / Blueprint / Resources.
   Reusable for any project — 3D and blueprint come from PROJECT_ASSETS by name. */
export default function ProjectDetail({ name, table, onBack }) {
  const [tab, setTab] = useState("todo");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});
  const { update, insert, remove } = table;

  useEffect(() => { setAdding(false); setForm({}); }, [tab]);

  const rows = table.rows.filter((r) => r.name === name);
  const tasks = rows.filter((r) => r.kind !== "resource").sort(byCreated);
  const resources = rows.filter((r) => r.kind === "resource").sort(byCreated);
  const todo = tasks.filter((r) => r.status !== "done");
  const done = tasks.filter((r) => r.status === "done");
  const assets = PROJECT_ASSETS[name] || {};

  const toggleDone = (row) =>
    update(row.id, { status: row.status === "done" ? "todo" : "done" });
  const cycle = (row) =>
    update(row.id, { status: STATUSES[(STATUSES.indexOf(row.status) + 1) % STATUSES.length] });
  const del = (row) => {
    if (window.confirm(`Delete "${row.task || row.name}"? This can't be undone.`)) remove(row.id);
  };
  const overdue = (r) =>
    r.due && r.status !== "done" && new Date(r.due + "T00:00:00") < new Date(new Date().toDateString());

  async function add() {
    const isRes = tab === "resources";
    if (!form.title?.trim()) return;
    const values = {
      name,
      task: form.title.trim(),
      notes: form.notes?.trim() || null,
      kind: isRes ? "resource" : "task",
      status: "todo",
    };
    if (isRes) values.est_cost = form.est_cost?.trim() || null;
    else values.due = form.due || null;
    const saved = await insert(values);
    if (saved) { setForm({}); setAdding(false); }
  }

  /* render helpers (plain functions, not components — avoids remounting) */
  const renderRow = (row, showCycle) => {
    const meta = STATUS_META[row.status];
    const od = overdue(row);
    const isDone = row.status === "done";
    return (
      <div key={row.id} style={{ ...S.card, opacity: isDone ? 0.6 : 1 }}>
        <button onClick={() => toggleDone(row)} style={S.checkBtn} title={isDone ? "Mark not done" : "Mark done"}>
          {isDone ? <CheckCircle2 size={22} color="#4d7c0f" /> : <Circle size={22} color="#c4b8a4" />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.cardTop}>
            <h3 style={{ ...S.todoText, textDecoration: isDone ? "line-through" : "none" }}>
              {row.task || "Untitled"}
            </h3>
            {showCycle && !isDone && (
              <button onClick={() => cycle(row)} style={{ ...S.chip, color: meta.color, borderColor: meta.color }}>
                {row.status === "in-progress" ? <Clock size={11} /> : <ChevronRight size={11} />}
                {meta.label}
              </button>
            )}
          </div>
          <div style={S.metaWrap}>
            {row.est_cost && <span style={S.meta}>{row.est_cost}</span>}
            {row.due && (
              <span style={{ ...S.meta, color: od ? "#b91c1c" : "#6b6253", fontWeight: od ? 700 : 500 }}>
                <Calendar size={12} />{od ? "Overdue " : "Due "}
                {new Date(row.due + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          {row.notes && <p style={S.todoSub}>{row.notes}</p>}
        </div>
        <button onClick={() => del(row)} style={S.del}><Trash2 size={14} /></button>
      </div>
    );
  };

  const renderViewer = (src, kind) =>
    src ? (
      <div style={S.viewerWrap}>
        <iframe src={src} title={kind} style={S.viewer} loading="lazy" />
        <p style={S.viewerNote}>
          {kind === "3D"
            ? "Drag to orbit · scroll to zoom · toggle layers in the panel."
            : "Schematic only — not for construction."}
        </p>
      </div>
    ) : (
      <div style={S.empty}>
        {kind === "3D"
          ? <Box size={36} strokeWidth={1.4} style={{ opacity: 0.35 }} />
          : <Ruler size={36} strokeWidth={1.4} style={{ opacity: 0.35 }} />}
        <p style={{ margin: "10px 0 0" }}>No {kind} for this project yet.</p>
      </div>
    );

  const showFab = tab === "todo" || tab === "resources";

  return (
    <>
      <div style={S.detailHead}>
        <button style={S.backBtn} onClick={onBack}><ChevronLeft size={20} /> Projects</button>
        <h1 style={S.h1}>{name}</h1>
        <p style={S.sub}>{todo.length} to do · {done.length} done · {resources.length} resources</p>
      </div>

      <div style={S.tabBar}>
        {DETAIL_TABS.map((t) => {
          const on = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ ...S.tab, ...(on ? S.tabOn : {}) }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "todo" && (
        <div style={S.cardList}>
          {todo.length === 0 && <div style={S.empty}><p style={{ margin: 0 }}>Nothing to do — tap + to add a step.</p></div>}
          {todo.map((row) => renderRow(row, true))}
        </div>
      )}

      {tab === "done" && (
        <div style={S.cardList}>
          {done.length === 0 && <div style={S.empty}><p style={{ margin: 0 }}>Nothing checked off yet.</p></div>}
          {done.map((row) => renderRow(row, false))}
        </div>
      )}

      {tab === "3d" && renderViewer(assets.model, "3D")}
      {tab === "blueprint" && renderViewer(assets.blueprint, "Blueprint")}

      {tab === "resources" && (
        <div style={S.cardList}>
          {resources.length === 0 && <div style={S.empty}><p style={{ margin: 0 }}>No resources yet — tap + to add equipment or materials.</p></div>}
          {resources.map((row) => renderRow(row, false))}
        </div>
      )}

      {showFab && !adding && (
        <button style={S.fab} onClick={() => setAdding(true)}><Plus size={26} strokeWidth={2.6} /></button>
      )}

      {adding && (
        <Sheet
          title={tab === "resources" ? "Add resource" : "Add to-do"}
          onClose={() => setAdding(false)}
          footer={
            <button onClick={add} disabled={!form.title?.trim()}
              style={{ ...S.primaryBtn, opacity: form.title?.trim() ? 1 : 0.4 }}>
              <Check size={18} /> Save
            </button>
          }
        >
          <label style={S.field}>
            <span style={S.lbl}>{tab === "resources" ? "Item / equipment" : "To-do step"}<span style={{ color: "#b91c1c" }}> *</span></span>
            <input style={S.input} value={form.title || ""} placeholder={tab === "resources" ? "Power rack" : "Pour the slab"}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          {tab === "resources" ? (
            <label style={S.field}>
              <span style={S.lbl}>Est. cost</span>
              <input style={S.input} value={form.est_cost || ""} placeholder="$1,200"
                onChange={(e) => setForm({ ...form, est_cost: e.target.value })} />
            </label>
          ) : (
            <label style={S.field}>
              <span style={S.lbl}>Target date</span>
              <input type="date" style={S.input} value={form.due || ""}
                onChange={(e) => setForm({ ...form, due: e.target.value })} />
            </label>
          )}
          <label style={S.field}>
            <span style={S.lbl}>Notes</span>
            <textarea style={{ ...S.input, minHeight: 70, resize: "none" }} value={form.notes || ""}
              placeholder="Phase, spec, reminder…" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
        </Sheet>
      )}
    </>
  );
}
