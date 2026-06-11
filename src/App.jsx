import React, { useEffect, useState } from "react";
import { Tractor, AlertTriangle, LogOut } from "lucide-react";
import { supabase } from "./lib/supabase";
import { TABS } from "./config";
import { S, css } from "./styles";
import { useTable } from "./hooks/useTable";
import AuthScreen from "./components/AuthScreen";
import BottomNav from "./components/BottomNav";
import ListPage from "./components/ListPage";
import FieldsPage from "./components/FieldsPage";
import MarketsPage from "./components/MarketsPage";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <style>{css}</style>
      {session === undefined ? (
        <div style={S.authStage}>
          <div style={{ color: "#9a8c78" }}>Loading…</div>
        </div>
      ) : !session ? (
        <AuthScreen />
      ) : (
        <MainApp key={session.user.id} />
      )}
    </>
  );
}

function MainApp() {
  const [active, setActive] = useState("vehicles");

  const vehicles = useTable("vehicles");
  const fencing = useTable("fencing");
  const livestock = useTable("livestock");
  const projects = useTable("projects");
  const fields = useTable("fields");

  const listTables = { vehicles, fencing, livestock, projects };
  const tab = TABS.find((t) => t.id === active);
  const saveErr = [vehicles, fencing, livestock, projects, fields].find((t) => t.error)?.error;

  const openCount = (id) =>
    listTables[id] ? listTables[id].rows.filter((r) => r.status !== "done").length : 0;

  return (
    <div style={S.stage}>
      <div style={S.phone}>
        <header style={S.header}>
          <div style={S.headRow}>
            <div style={S.logo}><Tractor size={18} strokeWidth={2.4} /></div>
            <div>
              <div style={S.brand}>FIELDBOOK</div>
              <div style={S.brandSub}>{tab.label}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {saveErr && (
              <span style={S.saveErr} title={saveErr}>
                <AlertTriangle size={12} /> save failed
              </span>
            )}
            <button style={S.headBtn} title="Sign out" onClick={() => supabase.auth.signOut()}>
              <LogOut size={17} />
            </button>
          </div>
        </header>

        <div style={S.scroll} key={active} className="fb-fade">
          {active === "markets" ? (
            <MarketsPage />
          ) : active === "fields" ? (
            <FieldsPage fields={fields} />
          ) : (
            <ListPage tab={tab} table={listTables[active]} />
          )}
        </div>

        <BottomNav active={active} setActive={setActive} openCount={openCount} />
      </div>
    </div>
  );
}
