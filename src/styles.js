/* Fieldbook visual system — carried over from the prototype.
   The prototype rendered inside a fake phone frame for previewing;
   in production the app fills the real screen instead. */

export const GREEN = "#4d7c0f";
export const INK = "#3f3a32";
export const PAPER = "#faf6ee";
export const LINE = "#e9e1d3";

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Archivo:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body, #root { height: 100%; margin: 0; }
  body { background: #232a1f; }
  ::placeholder { color: #b5aa98; }
  input, textarea, button { font-family: 'Archivo', sans-serif; }
  button { cursor: pointer; border: none; background: none; }
  .leaflet-container { font-family: 'Archivo', sans-serif; background: #2a2a28; }
  .fld-tip { background:#1c1917; color:#faf6ee; border:none; font-weight:600; font-size:11px; padding:3px 7px; }
  .leaflet-control-zoom a { border-radius:6px !important; }
  .fb-fade { animation: fbfade .28s ease; }
  @keyframes fbfade { from { opacity:0; transform: translateY(4px);} to {opacity:1; transform:none;} }
  .fb-sheet { animation: fbsheet .3s cubic-bezier(.2,.8,.2,1); }
  @keyframes fbsheet { from { transform: translateY(100%);} to { transform: none;} }
`;

export const S = {
  /* full-screen app shell; centered column on wide screens */
  stage: {
    height: "100dvh",
    background: "radial-gradient(circle at 30% 10%, #3a4a32, #232a1f 70%)",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    fontFamily: "'Archivo', sans-serif",
  },
  phone: {
    width: "100%",
    maxWidth: 480,
    height: "100dvh",
    background: PAPER,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    background: "#1c1917",
    color: PAPER,
    padding: "max(12px, env(safe-area-inset-top)) 18px 14px",
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headRow: { display: "flex", alignItems: "center", gap: 11 },
  logo: { width: 34, height: 34, borderRadius: 10, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", color: PAPER },
  brand: { fontWeight: 800, letterSpacing: 2.5, fontSize: 15 },
  brandSub: { fontFamily: "'Fraunces', serif", fontSize: 12, opacity: 0.55, fontStyle: "italic" },
  headBtn: { color: "#9a8c78", padding: 6, display: "flex", alignItems: "center" },
  saveErr: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, background: "#7f1d1d", color: "#fff", padding: "4px 8px", borderRadius: 20 },

  scroll: { flex: 1, overflowY: "auto", padding: "20px 16px 90px", position: "relative" },

  bottomNav: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 68,
    background: "rgba(250,246,238,.94)", backdropFilter: "blur(12px)",
    borderTop: `1px solid ${LINE}`, display: "flex",
    paddingBottom: "max(6px, env(safe-area-inset-bottom))",
  },
  tabBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, paddingTop: 8 },
  tabLbl: { fontSize: 9.5, letterSpacing: 0.2 },
  navDot: { position: "absolute", top: -5, right: -8, background: "#b91c1c", color: "#fff", fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" },

  pageHead: { marginBottom: 16 },
  h1: { fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 600, margin: 0, color: INK, letterSpacing: -0.5 },
  sub: { margin: "3px 0 0", fontSize: 13, color: "#9a8c78", display: "flex", alignItems: "center", gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, display: "inline-block" },

  empty: { textAlign: "center", color: "#9a8c78", padding: "50px 20px", display: "flex", flexDirection: "column", alignItems: "center" },
  emptyHint: { fontSize: 13, margin: "4px 0 0", color: "#b5aa98" },

  cardList: { display: "flex", flexDirection: "column", gap: 10 },
  card: { background: "#fff", borderRadius: 16, padding: "15px 15px 15px 18px", display: "flex", gap: 10, position: "relative", boxShadow: "0 1px 3px rgba(60,50,30,.07)", border: `1px solid ${LINE}`, overflow: "hidden" },
  cardSel: { borderColor: GREEN, boxShadow: `0 0 0 1.5px ${GREEN}` },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  cardTitle: { fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, margin: 0, color: INK, lineHeight: 1.2 },
  chip: { display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 700, background: "#fff", border: "1.5px solid", borderRadius: 20, padding: "3px 9px", textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap", flexShrink: 0 },
  acreTag: { fontSize: 12, fontWeight: 700, color: GREEN, background: "#f0f4e6", padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" },
  metaWrap: { display: "flex", flexWrap: "wrap", gap: "5px 12px", marginTop: 8 },
  meta: { display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "#6b6253" },
  note: { margin: "9px 0 0", fontSize: 12.5, color: "#9a8c78", lineHeight: 1.5, fontStyle: "italic" },
  del: { color: "#c4b8a4", padding: 3, height: "fit-content", flexShrink: 0 },

  fab: { position: "absolute", bottom: 84, right: 18, width: 56, height: 56, borderRadius: 18, background: GREEN, color: PAPER, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(77,124,15,.45)", zIndex: 50 },

  /* zIndex 2000 keeps sheets above Leaflet's map controls (which use up to 1000) */
  sheetBg: { position: "absolute", inset: 0, background: "rgba(28,25,23,.45)", display: "flex", alignItems: "flex-end", zIndex: 2000 },
  sheet: { background: PAPER, width: "100%", borderRadius: "24px 24px 0 0", padding: "10px 18px max(18px, env(safe-area-inset-bottom))", maxHeight: "82%", display: "flex", flexDirection: "column" },
  sheetGrab: { width: 38, height: 4, borderRadius: 2, background: "#d8cfbf", margin: "0 auto 12px" },
  sheetHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sheetTitle: { fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 600, margin: 0, color: INK },
  sheetClose: { color: "#9a8c78", padding: 4 },
  formScroll: { overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 6 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  lbl: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#9a8c78" },
  input: { padding: "13px 14px", border: `1.5px solid ${LINE}`, borderRadius: 12, fontSize: 16, background: "#fff", outline: "none", color: INK, width: "100%" },
  primaryBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: GREEN, color: PAPER, padding: "15px", borderRadius: 14, fontSize: 15, fontWeight: 700, marginTop: 14, flexShrink: 0 },

  banner: { display: "flex", alignItems: "center", gap: 7, background: "#fdf6e3", color: "#8a6d1f", fontSize: 12, padding: "9px 12px", borderRadius: 10, marginBottom: 14, border: "1px solid #f0e4c0", lineHeight: 1.4 },

  /* zIndex: 0 creates a stacking context so Leaflet's internal layers can't
     escape the map card and cover sheets or buttons elsewhere on the page */
  mapCard: { position: "relative", zIndex: 0, height: 340, borderRadius: 18, overflow: "hidden", marginBottom: 16, border: `1px solid ${LINE}`, boxShadow: "0 2px 8px rgba(60,50,30,.1)" },
  map: { position: "absolute", inset: 0 },
  mapLoading: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#9a8c78", zIndex: 500 },
  mapDrawBtn: { position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 600, display: "flex", alignItems: "center", gap: 6, background: "#1c1917", color: PAPER, padding: "11px 20px", borderRadius: 30, fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,.35)" },
  mapDrawRow: { position: "absolute", bottom: 14, left: 14, right: 14, zIndex: 600, display: "flex", gap: 8 },
  mapCancel: { background: "#1c1917", color: PAPER, width: 46, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,.35)" },
  mapFinish: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: GREEN, color: PAPER, padding: "11px", borderRadius: 30, fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,.35)" },

  /* hay additions */
  hayChip: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, border: "1.5px solid", borderRadius: 20, padding: "3px 9px", textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap", flexShrink: 0, background: "#fff" },
  suggestion: { display: "flex", alignItems: "flex-start", gap: 7, background: "#f5f1e4", border: "1px dashed #d8cfbf", borderRadius: 10, padding: "8px 10px", marginTop: 9, fontSize: 12, color: "#6b6253", lineHeight: 1.45 },
  suggestionBtn: { fontSize: 11, fontWeight: 700, color: "#4d7c0f", border: "1.5px solid #4d7c0f", borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0, background: "#fff" },
  estNote: { fontSize: 10.5, color: "#b5aa98", fontStyle: "italic", marginTop: 2 },
  cutHistory: { marginTop: 9, borderTop: `1px dashed ${LINE}`, paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 },
  cutRow: { fontSize: 12, color: "#6b6253", display: "flex", justifyContent: "space-between" },

  /* markets */
  groupHead: { fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700, color: INK, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: 14, padding: "13px 16px", marginBottom: 8, border: `1px solid ${LINE}`, boxShadow: "0 1px 3px rgba(60,50,30,.06)" },
  priceLabel: { fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: INK },
  priceUnit: { fontSize: 11, color: "#b5aa98", marginTop: 1 },
  priceVal: { fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: INK, fontVariantNumeric: "tabular-nums" },
  priceChg: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, fontSize: 12.5, fontWeight: 700, marginTop: 2, fontVariantNumeric: "tabular-nums" },
  refreshBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", background: "#1c1917", color: PAPER, padding: "13px", borderRadius: 13, fontSize: 14, fontWeight: 700, marginTop: 4 },
  disclaimer: { fontSize: 11, color: "#b5aa98", lineHeight: 1.5, marginTop: 12, fontStyle: "italic" },

  /* header dropdown menu */
  menuWrap: { position: "relative" },
  menuPanel: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, boxShadow: "0 10px 30px rgba(28,25,23,.25)", padding: 6, zIndex: 3000, minWidth: 170 },
  menuItem: { display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "11px 12px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: INK, textAlign: "left" },

  /* ag news */
  chipRow: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 14 },
  topicChip: { flexShrink: 0, fontSize: 12, fontWeight: 700, padding: "7px 13px", borderRadius: 20, border: `1.5px solid ${LINE}`, background: "#fff", color: "#6b6253", whiteSpace: "nowrap" },
  topicChipOn: { background: "#1c1917", color: PAPER, borderColor: "#1c1917" },
  newsCard: { display: "block", background: "#fff", borderRadius: 14, padding: "13px 15px", marginBottom: 8, border: `1px solid ${LINE}`, boxShadow: "0 1px 3px rgba(60,50,30,.06)", textDecoration: "none" },
  newsMeta: { display: "flex", gap: 8, fontSize: 11, color: "#9a8c78", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 },
  newsTitle: { fontFamily: "'Fraunces', serif", fontSize: 15.5, fontWeight: 600, color: INK, lineHeight: 1.35, margin: 0 },

  /* auth screen */
  authStage: { height: "100dvh", background: "radial-gradient(circle at 30% 10%, #3a4a32, #232a1f 70%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Archivo', sans-serif" },
  authCard: { width: "100%", maxWidth: 380, background: PAPER, borderRadius: 24, padding: "30px 26px", boxShadow: "0 30px 70px rgba(0,0,0,.5)" },
  authLogoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 6 },
  authTitle: { fontWeight: 800, letterSpacing: 2.5, fontSize: 18, color: INK },
  authSub: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 14, color: "#9a8c78", margin: "0 0 22px" },
  authErr: { background: "#fdf0ef", border: "1px solid #f3cfcb", color: "#b91c1c", fontSize: 12.5, padding: "9px 12px", borderRadius: 10, marginBottom: 12, lineHeight: 1.4 },
  authOk: { background: "#f0f4e6", border: "1px solid #d5e3b8", color: "#4d7c0f", fontSize: 12.5, padding: "9px 12px", borderRadius: 10, marginBottom: 12, lineHeight: 1.4 },
  authSwitch: { textAlign: "center", marginTop: 16, fontSize: 13, color: "#9a8c78" },
  authLink: { color: GREEN, fontWeight: 700, padding: 4 },
};
