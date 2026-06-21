import React, { useState } from "react";
import { Hammer, Plus, Check, ChevronRight, Box } from "lucide-react";
import { PROJECT_ASSETS } from "../config";
import { S } from "../styles";
import Sheet from "./Sheet";
import ProjectDetail from "./ProjectDetail";

/* Projects tab: a list of project folders. Each folder groups the rows in the
   `projects` table that share a name. Tap a folder to open its detail tabs. */
export default function ProjectsPage({ table }) {
  const [openName, setOpenName] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({});

  const names = [...new Set(table.rows.map((r) => r.name))];
  const folders = names.map((name) => {
    const rows = table.rows.filter((r) => r.name === name);
    const tasks = rows.filter((r) => r.kind !== "resource");
    return {
      name,
      open: tasks.filter((r) => r.status !== "done").length,
      done: tasks.filter((r) => r.status === "done").length,
      resources: rows.filter((r) => r.kind === "resource").length,
      has3d: !!PROJECT_ASSETS[name],
    };
  });

  async function create() {
    const name = form.name?.trim();
    if (!name) return;
    const saved = await table.insert({
      name,
      task: form.step?.trim() || "Plan the project",
      kind: "task",
      status: "todo",
    });
    if (saved) { setForm({}); setAdding(false); setOpenName(name); }
  }

  if (openName) {
    return <ProjectDetail name={openName} table={table} onBack={() => setOpenName(null)} />;
  }

  return (
    <>
      <div style={S.pageHead}>
        <h1 style={S.h1}>Projects</h1>
        <p style={S.sub}>{folders.length} {folders.length === 1 ? "project" : "projects"}</p>
      </div>

      {table.loading && <div style={S.empty}>Loading…</div>}
      {!table.loading && folders.length === 0 && (
        <div style={S.empty}>
          <Hammer size={36} strokeWidth={1.4} style={{ opacity: 0.35 }} />
          <p style={{ margin: "10px 0 0" }}>No projects yet.</p>
          <p style={S.emptyHint}>Tap + to start one.</p>
        </div>
      )}

      <div style={S.cardList}>
        {folders.map((f) => (
          <button key={f.name} style={S.folderCard} onClick={() => setOpenName(f.name)}>
            <div style={S.folderIcon}><Hammer size={20} /></div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={S.cardTop}>
                <h3 style={S.cardTitle}>{f.name}</h3>
                {f.has3d && <span style={S.badge3d}><Box size={11} /> 3D</span>}
              </div>
              <div style={S.metaWrap}>
                <span style={S.meta}>{f.open} to do</span>
                <span style={S.meta}><Check size={12} /> {f.done} done</span>
                {f.resources > 0 && <span style={S.meta}>{f.resources} resources</span>}
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </button>
        ))}
      </div>

      {!adding && (
        <button style={S.fab} onClick={() => setAdding(true)}><Plus size={26} strokeWidth={2.6} /></button>
      )}

      {adding && (
        <Sheet
          title="New project"
          onClose={() => setAdding(false)}
          footer={
            <button onClick={create} disabled={!form.name?.trim()}
              style={{ ...S.primaryBtn, opacity: form.name?.trim() ? 1 : 0.4 }}>
              <Check size={18} /> Create project
            </button>
          }
        >
          <label style={S.field}>
            <span style={S.lbl}>Project name<span style={{ color: "#dc2626" }}> *</span></span>
            <input style={S.input} value={form.name || ""} placeholder="New equipment barn"
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label style={S.field}>
            <span style={S.lbl}>First step</span>
            <input style={S.input} value={form.step || ""} placeholder="Site prep & permits"
              onChange={(e) => setForm({ ...form, step: e.target.value })} />
          </label>
        </Sheet>
      )}
    </>
  );
}
