import React, { useState } from "react";
import { Tractor, Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import { S } from "../styles";

export default function AuthScreen() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
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
        if (!data.session) {
          setNotice("Account created. Check your email for a confirmation link, then sign in.");
        }
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

  return (
    <div style={S.authStage}>
      <form style={S.authCard} onSubmit={submit}>
        <div style={S.authLogoRow}>
          <div style={S.logo}><Tractor size={18} strokeWidth={2.4} /></div>
          <span style={S.authTitle}>FIELDBOOK</span>
        </div>
        <p style={S.authSub}>{mode === "signin" ? "Welcome back." : "Set up your account."}</p>

        {error && <div style={S.authErr}>{error}</div>}
        {notice && <div style={S.authOk}>{notice}</div>}

        <label style={{ ...S.field, marginBottom: 12 }}>
          <span style={S.lbl}>Email</span>
          <input style={S.input} type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label style={S.field}>
          <span style={S.lbl}>Password</span>
          <input style={S.input} type="password" required minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </label>

        <button type="submit" disabled={busy} style={{ ...S.primaryBtn, width: "100%", opacity: busy ? 0.6 : 1 }}>
          <Check size={18} /> {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <div style={S.authSwitch}>
          {mode === "signin" ? "First time here?" : "Already have an account?"}{" "}
          <button type="button" style={S.authLink}
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNotice(null); }}>
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
