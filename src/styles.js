/* Fieldbook visual system — modern, minimal, clean.
   Single sans typeface (Inter), cool neutral palette, soft surfaces,
   subtle depth and motion. Mobile-first app column centered on wide screens. */

export const GREEN = "#16a34a";   // accent
export const GREEN_D = "#15803d"; // accent pressed / text-on-light
export const INK = "#0f172a";     // primary text
export const MUT = "#64748b";     // secondary text
export const FAINT = "#94a3b8";   // tertiary / icons
export const PAPER = "#ffffff";   // surfaces
export const BG = "#f4f5f7";      // app background
export const LINE = "#e6e8ec";    // hairline borders
export const DANGER = "#dc2626";

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body, #root { height: 100%; margin: 0; }
  body { background: #eef0f3; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
  ::placeholder { color: ${FAINT}; }
  input, textarea, button { font-family: 'Inter', sans-serif; }
  button { cursor: pointer; border: none; background: none; transition: transform .12s ease, opacity .15s, background .15s, box-shadow .15s; }
  button:active { transform: scale(.975); }
  input, textarea { transition: border-color .15s, box-shadow .15s; }
  input:focus, textarea:focus { border-color: ${GREEN} !important; box-shadow: 0 0 0 3px rgba(22,163,74,.13); }
  .leaflet-container { font-family: 'Inter', sans-serif; background: #e9edf1; }
  .fld-tip { background:${INK}; color:#fff; border:none; font-weight:600; font-size:11px; padding:3px 7px; border-radius:6px; }
  .leaflet-control-zoom a { border-radius:8px !important; }
  .fb-fade { animation: fbfade .25s ease; }
  @keyframes fbfade { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
  .fb-sheet { animation: fbsheet .28s cubic-bezier(.2,.8,.2,1); }
  @keyframes fbsheet { from { transform: translateY(100%);} to { transform: none;} }
`;

const CARD_SHADOW = "0 1px 2px rgba(16,24,40,.05)";
const POP_SHADOW = "0 12px 32px rgba(16,24,40,.14)";

export const S = {
  stage: {
    minHeight: "100dvh",
    background: BG,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    color: INK,
  },
  phone: {
    width: "100%",
    maxWidth: 460,
    minHeight: "100dvh",
    background: PAPER,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 0 1px " + LINE + ", 0 24px 60px rgba(16,24,40,.10)",
  },

  header: {
    background: PAPER,
    color: INK,
    padding: "max(14px, env(safe-area-inset-top)) 18px 14px",
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${LINE}`,
  },
  headRow: { display: "flex", alignItems: "center", gap: 11 },
  logo: { width: 34, height: 34, borderRadius: 10, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 2px 6px rgba(22,163,74,.35)" },
  brand: { fontWeight: 800, letterSpacing: 0.4, fontSize: 15, color: INK },
  brandSub: { fontSize: 12, color: MUT, fontWeight: 500, marginTop: 1 },
  headBtn: { color: MUT, padding: 6, display: "flex", alignItems: "center", borderRadius: 8 },
  saveErr: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, background: "#fef2f2", color: DANGER, padding: "4px 9px", borderRadius: 20, fontWeight: 600 },

  scroll: { flex: 1, overflowY: "auto", padding: "22px 16px 96px", position: "relative" },

  bottomNav: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 66,
    background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)",
    borderTop: `1px solid ${LINE}`, display: "flex",
    paddingBottom: "max(6px, env(safe-area-inset-bottom))",
  },
  tabBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, paddingTop: 9 },
  tabLbl: { fontSize: 9.5, letterSpacing: 0.1, fontWeight: 600 },
  navDot: { position: "absolute", top: -5, right: -9, background: DANGER, color: "#fff", fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" },

  pageHead: { marginBottom: 18 },
  h1: { fontSize: 27, fontWeight: 700, margin: 0, color: INK, letterSpacing: -0.6 },
  sub: { margin: "4px 0 0", fontSize: 13, color: MUT, display: "flex", alignItems: "center", gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, display: "inline-block" },

  empty: { textAlign: "center", color: MUT, padding: "54px 20px", display: "flex", flexDirection: "column", alignItems: "center" },
  emptyHint: { fontSize: 13, margin: "4px 0 0", color: FAINT },

  cardList: { display: "flex", flexDirection: "column", gap: 11 },
  card: { background: PAPER, borderRadius: 14, padding: "15px 15px 15px 17px", display: "flex", gap: 11, position: "relative", boxShadow: CARD_SHADOW, border: `1px solid ${LINE}`, overflow: "hidden" },
  cardSel: { borderColor: GREEN, boxShadow: `0 0 0 1.5px ${GREEN}` },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3.5 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: 600, margin: 0, color: INK, lineHeight: 1.25, letterSpacing: -0.2 },
  chip: { display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 600, background: "#fff", border: "1.5px solid", borderRadius: 20, padding: "3px 9px", textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap", flexShrink: 0 },
  acreTag: { fontSize: 12, fontWeight: 600, color: GREEN_D, background: "#eafaf0", padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap" },
  metaWrap: { display: "flex", flexWrap: "wrap", gap: "5px 12px", marginTop: 8 },
  meta: { display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: MUT },
  note: { margin: "9px 0 0", fontSize: 12.5, color: MUT, lineHeight: 1.5 },
  del: { color: FAINT, padding: 3, height: "fit-content", flexShrink: 0, borderRadius: 8 },

  fab: { position: "absolute", bottom: 84, right: 18, width: 54, height: 54, borderRadius: 16, background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(22,163,74,.4)", zIndex: 50 },

  sheetBg: { position: "absolute", inset: 0, background: "rgba(15,23,42,.42)", backdropFilter: "blur(2px)", display: "flex", alignItems: "flex-end", zIndex: 2000 },
  sheet: { background: PAPER, width: "100%", borderRadius: "22px 22px 0 0", padding: "10px 18px max(18px, env(safe-area-inset-bottom))", maxHeight: "84%", display: "flex", flexDirection: "column" },
  sheetGrab: { width: 38, height: 4, borderRadius: 2, background: "#d7dbe0", margin: "0 auto 14px" },
  sheetHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontWeight: 700, margin: 0, color: INK, letterSpacing: -0.3 },
  sheetClose: { color: MUT, padding: 4, borderRadius: 8 },
  formScroll: { overflowY: "auto", display: "flex", flexDirection: "column", gap: 15, paddingBottom: 6 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  lbl: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: MUT },
  input: { padding: "12px 14px", border: `1.5px solid ${LINE}`, borderRadius: 10, fontSize: 16, background: "#fff", outline: "none", color: INK, width: "100%" },
  primaryBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: GREEN, color: "#fff", padding: "14px", borderRadius: 11, fontSize: 15, fontWeight: 600, marginTop: 16, flexShrink: 0, boxShadow: "0 6px 16px rgba(22,163,74,.3)" },

  banner: { display: "flex", alignItems: "center", gap: 7, background: "#fff7ed", color: "#9a3412", fontSize: 12, padding: "10px 12px", borderRadius: 11, marginBottom: 14, border: "1px solid #fed7aa", lineHeight: 1.4 },

  mapCard: { position: "relative", zIndex: 0, height: 340, borderRadius: 16, overflow: "hidden", marginBottom: 16, border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW },
  map: { position: "absolute", inset: 0 },
  mapLoading: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: MUT, zIndex: 500 },
  mapDrawBtn: { position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 600, display: "flex", alignItems: "center", gap: 6, background: INK, color: "#fff", padding: "11px 20px", borderRadius: 30, fontSize: 14, fontWeight: 600, boxShadow: "0 6px 18px rgba(15,23,42,.3)" },
  mapDrawRow: { position: "absolute", bottom: 14, left: 14, right: 14, zIndex: 600, display: "flex", gap: 8 },
  mapCancel: { background: INK, color: "#fff", width: 46, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(15,23,42,.3)" },
  mapFinish: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: GREEN, color: "#fff", padding: "11px", borderRadius: 30, fontSize: 14, fontWeight: 600, boxShadow: "0 6px 18px rgba(22,163,74,.35)" },

  hayChip: { display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600, border: "1.5px solid", borderRadius: 20, padding: "3px 9px", textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap", flexShrink: 0, background: "#fff" },
  suggestion: { display: "flex", alignItems: "flex-start", gap: 7, background: "#f8fafc", border: `1px dashed ${LINE}`, borderRadius: 11, padding: "9px 11px", marginTop: 9, fontSize: 12, color: MUT, lineHeight: 1.45 },
  suggestionBtn: { fontSize: 11, fontWeight: 600, color: GREEN_D, border: `1.5px solid ${GREEN}`, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0, background: "#fff" },
  estNote: { fontSize: 10.5, color: FAINT, marginTop: 2 },
  cutHistory: { marginTop: 9, borderTop: `1px dashed ${LINE}`, paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 },
  cutRow: { fontSize: 12, color: MUT, display: "flex", justifyContent: "space-between" },

  groupHead: { fontSize: 12, fontWeight: 700, color: MUT, marginBottom: 9, textTransform: "uppercase", letterSpacing: 0.6 },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: PAPER, borderRadius: 13, padding: "13px 16px", marginBottom: 8, border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW },
  priceLabel: { fontSize: 15.5, fontWeight: 600, color: INK },
  priceUnit: { fontSize: 11, color: FAINT, marginTop: 1 },
  priceVal: { fontSize: 21, fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums", letterSpacing: -0.3 },
  priceChg: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, fontSize: 12.5, fontWeight: 600, marginTop: 2, fontVariantNumeric: "tabular-nums" },
  refreshBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", background: INK, color: "#fff", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 600, marginTop: 4 },
  disclaimer: { fontSize: 11, color: FAINT, lineHeight: 1.5, marginTop: 12 },

  menuWrap: { position: "relative" },
  menuPanel: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 14, border: `1px solid ${LINE}`, boxShadow: POP_SHADOW, padding: 6, zIndex: 3000, minWidth: 172 },
  menuItem: { display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "11px 12px", borderRadius: 9, fontSize: 14, fontWeight: 500, color: INK, textAlign: "left" },

  chipRow: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 16 },
  topicChip: { flexShrink: 0, fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${LINE}`, background: "#fff", color: MUT, whiteSpace: "nowrap" },
  topicChipOn: { background: INK, color: "#fff", borderColor: INK },
  newsCard: { display: "block", background: PAPER, borderRadius: 13, padding: "14px 15px", marginBottom: 9, border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW, textDecoration: "none" },
  newsMeta: { display: "flex", gap: 8, fontSize: 11, color: MUT, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 },
  newsTitle: { fontSize: 15.5, fontWeight: 600, color: INK, lineHeight: 1.35, margin: 0, letterSpacing: -0.2 },

  authStage: { minHeight: "100dvh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', sans-serif" },
  authCard: { width: "100%", maxWidth: 380, background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 1px 2px rgba(16,24,40,.05), 0 20px 50px rgba(16,24,40,.12)", border: `1px solid ${LINE}` },
  authLogoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
  authTitle: { fontWeight: 800, letterSpacing: 0.5, fontSize: 18, color: INK },
  authSub: { fontSize: 14, color: MUT, margin: "0 0 24px" },
  authErr: { background: "#fef2f2", border: "1px solid #fecaca", color: DANGER, fontSize: 12.5, padding: "10px 12px", borderRadius: 10, marginBottom: 12, lineHeight: 1.4 },
  authOk: { background: "#ecfdf3", border: "1px solid #bbf7d0", color: GREEN_D, fontSize: 12.5, padding: "10px 12px", borderRadius: 10, marginBottom: 12, lineHeight: 1.4 },
  authSwitch: { textAlign: "center", marginTop: 18, fontSize: 13, color: MUT },
  authLink: { color: GREEN_D, fontWeight: 600, padding: 4 },

  /* projects: folder list + project detail */
  folderCard: { width: "100%", background: PAPER, borderRadius: 14, padding: 15, display: "flex", gap: 12, alignItems: "center", border: `1px solid ${LINE}`, boxShadow: CARD_SHADOW },
  folderIcon: { width: 40, height: 40, borderRadius: 11, background: "#eafaf0", color: GREEN_D, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  badge3d: { display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: GREEN_D, background: "#eafaf0", padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 },

  detailHead: { marginBottom: 16 },
  backBtn: { display: "flex", alignItems: "center", gap: 2, color: MUT, fontSize: 13, fontWeight: 600, padding: "2px 0", marginBottom: 8 },
  tabBar: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 16 },
  tab: { flexShrink: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, padding: "8px 13px", borderRadius: 20, border: `1.5px solid ${LINE}`, background: "#fff", color: MUT, whiteSpace: "nowrap" },
  tabOn: { background: INK, color: "#fff", borderColor: INK },
  phaseHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 11 },
  phaseName: { fontSize: 14, fontWeight: 600, color: INK, letterSpacing: -0.2 },
  phaseCount: { fontSize: 12, fontWeight: 500, color: MUT },

  checkBtn: { padding: 2, display: "flex", alignItems: "center", height: "fit-content", flexShrink: 0 },
  todoText: { fontSize: 15.5, fontWeight: 600, margin: 0, color: INK, lineHeight: 1.3, letterSpacing: -0.2 },
  todoSub: { margin: "7px 0 0", fontSize: 12.5, color: MUT, lineHeight: 1.5 },

  viewerWrap: { display: "flex", flexDirection: "column" },
  viewer: { width: "100%", height: "62vh", minHeight: 380, border: `1px solid ${LINE}`, borderRadius: 16, background: "#0f1216" },
  viewerNote: { fontSize: 11.5, color: FAINT, margin: "8px 2px 0", lineHeight: 1.4 },
};
