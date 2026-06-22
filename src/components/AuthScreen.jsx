import React, { useState } from "react";
import { Tractor, Check } from "lucide-react";
import { supabase } from "../lib/supabase";

/* Landing / sign-in — a futuristic animated entry screen. */
export default function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null); setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) setNotice("Account created. Check your email for a confirmation link, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
  const A = {
    stage: { position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "hidden", background: "radial-gradient(1100px 760px at 22% 8%, #102a43, #0a0f1a 58%, #070b12 100%)", fontFamily: "'Inter', sans-serif" },
    aurora: { position: "absolute", inset: "-25%", background: "linear-gradient(120deg, rgba(22,163,74,.28), rgba(34,211,238,.24), rgba(99,102,241,.22), rgba(22,163,74,.28))", backgroundSize: "300% 300%", animation: "fbaurora 18s ease infinite", filter: "blur(70px)", opacity: 0.6 },
    grid: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(125,211,252,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(125,211,252,.07) 1px,transparent 1px)", backgroundSize: "40px 40px", animation: "fbslide 30s linear infinite", maskImage: "radial-gradient(circle at 50% 38%, #000, transparent 72%)", WebkitMaskImage: "radial-gradient(circle at 50% 38%, #000, transparent 72%)" },
    orb1: { position: "absolute", width: 300, height: 300, borderRadius: "50%", left: "-9%", top: "12%", background: "radial-gradient(circle, rgba(34,211,238,.5), transparent 70%)", filter: "blur(18px)", animation: "fbfloat 12s ease-in-out infinite" },
    orb2: { position: "absolute", width: 340, height: 340, borderRadius: "50%", right: "-11%", bottom: "4%", background: "radial-gradient(circle, rgba(22,163,74,.45), transparent 70%)", filter: "blur(18px)", animation: "fbfloat2 15s ease-in-out infinite" },
    card: { position: "relative", zIndex: 2, width: "100%", maxWidth: 380, background: "rgba(15,23,42,.55)", backdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 22, padding: "30px 26px", boxShadow: "0 30px 80px rgba(0,0,0,.55)", color: "#e6edf3" },
    logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
    logo: { width: 42, height: 42, borderRadius: 12, background: "linear-gradient(120deg,#16a34a,#22d3ee,#16a34a)", backgroundSize: "200% 100%", animation: "fbsheen 6s linear infinite", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 20px rgba(34,211,238,.55)" },
    brand: { fontWeight: 800, letterSpacing: 2, fontSize: 18, color: "#fff" },
    tag: { fontFamily: MONO, fontSize: 9, letterSpacing: 2, color: "#7dd3fc", marginTop: 3 },
    welcome: { fontSize: 14, color: "#9fb2c8", margin: "6px 0 22px" },
    err: { background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.4)", color: "#fca5a5", fontSize: 12.5, padding: "10px 12px", borderRadius: 10, marginBottom: 12, lineHeight: 1.4 },
    ok: { background: "rgba(34,197,94,.14)", border: "1px solid rgba(34,197,94,.4)", color: "#86efac", fontSize: 12.5, padding: "10px 12px", borderRadius: 10, marginBottom: 12, lineHeight: 1.4 },
    field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 },
    lbl: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, color: "#7e93aa" },
    input: { padding: "12px 14px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 11, fontSize: 16, background: "rgba(255,255,255,.07)", outline: "none", color: "#fff", width: "100%" },
    btn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "linear-gradient(90deg,#16a34a,#22d3ee)", color: "#04121f", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, marginTop: 8, boxShadow: "0 10px 30px rgba(34,211,238,.35)" },
    switch: { textAlign: "center", marginTop: 16, fontSize: 13, color: "#9fb2c8" },
    link: { color: "#7dd3fc", fontWeight: 700, padding: 4 },
  };

  return (
    <div style={A.stage}>
      <div style={A.aurora} />
      <div style={A.grid} />
      <div style={A.orb1} />
      <div style={A.orb2} />
      <form style={A.card} onSubmit={submit}>
        <div style={A.logoRow}>
          <div style={A.logo}><Tractor size={20} strokeWidth={2.4} /></div>
          <div>
            <div style={A.brand}>FIELDBOOK</div>
            <div style={A.tag}>FARM &amp; BUILD COMMAND CENTER</div>
          </div>
        </div>
        <p style={A.welcome}>{mode === "signin" ? "Welcome back." : "Set up your account."}</p>

        {error && <div style={A.err}>{error}</div>}
        {notice && <div style={A.ok}>{notice}</div>}

        <label style={A.field}>
          <span style={A.lbl}>Email</span>
          <input style={A.input} type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label style={A.field}>
          <span style={A.lbl}>Password</span>
          <input style={A.input} type="password" required minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </label>

        <button type="submit" disabled={busy} style={{ ...A.btn, opacity: busy ? 0.6 : 1 }}>
          <Check size={18} /> {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <div style={A.switch}>
          {mode === "signin" ? "First time here?" : "Already have an account?"}{" "}
          <button type="button" style={A.link}
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNotice(null); }}>
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
