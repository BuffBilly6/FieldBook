import { useState, useRef, useEffect } from "react";

/*
  WelcomeScreen — dark, animated welcome overlay for Fieldbook.

  Plays the country promo video full-screen on app open, with a cinematic
  text reveal:  FIELDBOOK  /  an Ondarr Creative Studios Company.

  Audio: the video carries natural ambience (hawk, wind, distant cattle).
  Browsers block autoplay-with-sound, so it autoplays MUTED with a
  "Tap for sound" button to turn the ambience on.

  Dismiss: "Enter app" button, "Skip" link, or it auto-closes when the
  video ends. Shows once per browser session by default.

  Requires:  public/welcome.mp4   (optional: public/welcome-poster.jpg)
*/

const SHOW_EVERY_TIME = false; // true = every load, false = once per session
const VIDEO_SRC = "/welcome.mp4";
const POSTER_SRC = "/welcome-poster.jpg"; // optional; safe to leave if missing

export default function WelcomeScreen({ onClose }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (SHOW_EVERY_TIME) {
      setVisible(true);
      return;
    }
    if (!sessionStorage.getItem("fb_welcome_seen")) setVisible(true);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    sessionStorage.setItem("fb_welcome_seen", "1");
    setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, 500);
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) v.play().catch(() => {});
  };

  if (!visible) return null;

  return (
    <div style={{ ...styles.overlay, opacity: leaving ? 0 : 1 }}>
      <video
        ref={videoRef}
        style={styles.video}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        muted={muted}
        playsInline
        onEnded={dismiss}
      />

      {/* dark scrim for contrast */}
      <div style={styles.scrim} />

      {/* top-right skip */}
      <button style={styles.skip} onClick={dismiss}>
        Skip
      </button>

      {/* centered brand lockup */}
      <div style={styles.center}>
        <h1 style={styles.brand}>Fieldbook</h1>
        <div style={styles.rule} />
        <p style={styles.studio}>an Ondarr Creative Studios Company</p>
      </div>

      {/* bottom actions */}
      <div style={styles.bottom}>
        <button style={styles.enter} onClick={dismiss}>
          Enter app
        </button>
        <button style={styles.soundBtn} onClick={toggleSound}>
          {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#05070a",
    overflow: "hidden",
    transition: "opacity 0.5s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  scrim: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(5,7,10,0.45) 0%, rgba(5,7,10,0.15) 35%, rgba(5,7,10,0.35) 70%, rgba(5,7,10,0.85) 100%)",
    pointerEvents: "none",
  },
  skip: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 3,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#cbd5e1",
    fontSize: 13,
    padding: "6px 14px",
    borderRadius: 999,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  },
  center: {
    position: "relative",
    zIndex: 2,
    margin: "auto",
    textAlign: "center",
    padding: "0 24px",
  },
  brand: {
    margin: 0,
    fontSize: "clamp(48px, 16vw, 92px)",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#f8fafc",
    textShadow: "0 4px 40px rgba(0,0,0,0.7)",
    animation: "fbBrandIn 1.1s cubic-bezier(.2,.7,.2,1) both",
  },
  rule: {
    height: 2,
    width: 0,
    margin: "18px auto 14px",
    background: "linear-gradient(90deg, transparent, #34d399, #22d3ee, transparent)",
    boxShadow: "0 0 16px rgba(52,211,153,0.7)",
    animation: "fbRule 1s ease 0.7s both",
  },
  studio: {
    margin: 0,
    fontSize: "clamp(12px, 3.6vw, 16px)",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#cbd5e1",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    animation: "fbFadeUp 1s ease 1.1s both",
  },
  bottom: {
    position: "relative",
    zIndex: 2,
    marginTop: "auto",
    padding: "0 24px 40px",
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    animation: "fbFadeUp 1s ease 1.5s both",
  },
  enter: {
    width: "100%",
    padding: "14px 0",
    fontSize: 16,
    fontWeight: 600,
    color: "#05070a",
    background: "linear-gradient(90deg, #34d399, #22d3ee)",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(52,211,153,0.35)",
  },
  soundBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#e2e8f0",
    fontSize: 13,
    padding: "9px 16px",
    borderRadius: 999,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
  },
};

// inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("fb-welcome-kf")) {
  const el = document.createElement("style");
  el.id = "fb-welcome-kf";
  el.textContent = `
    @keyframes fbBrandIn {
      0% { opacity: 0; transform: translateY(18px) scale(0.96); filter: blur(8px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes fbRule { 0% { width: 0; opacity: 0; } 100% { width: 220px; opacity: 1; } }
    @keyframes fbFadeUp { 0% { opacity: 0; transform: translateY(14px); } 100% { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(el);
}
