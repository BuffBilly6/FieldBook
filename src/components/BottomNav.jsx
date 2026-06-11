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
              <Icon size={21} strokeWidth={on ? 2.6 : 2} color={on ? "#4d7c0f" : "#9a8c78"} />
              {n > 0 && <span style={S.navDot}>{n}</span>}
            </div>
            <span style={{ ...S.tabLbl, color: on ? "#3f3a32" : "#9a8c78", fontWeight: on ? 700 : 500 }}>
              {t.short}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
