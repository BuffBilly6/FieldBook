import React from "react";
import { TABS } from "../config";
import { S } from "../styles";

export default function BottomNav({ active, setActive, openCount }) {
  return (
    <nav style={S.bottomNav}>
      {TABS.map((t) => {
        const on = active === t.id;
        const Icon = t.icon;
        const n = openCount(t.id);
        return (
          <button key={t.id} onClick={() => setActive(t.id)} style={S.tabBtn}>
            <div style={{ position: "relative" }}>
              <Icon size={21} strokeWidth={on ? 2.6 : 2} color={on ? "#16a34a" : "#64748b"} />
              {n > 0 && <span style={S.navDot}>{n}</span>}
            </div>
            <span style={{ ...S.tabLbl, color: on ? "#0f172a" : "#64748b", fontWeight: on ? 700 : 500 }}>
              {t.short}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
