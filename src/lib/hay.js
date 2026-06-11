/* Hay readiness suggestion engine.
   PRINCIPLE: suggest, never assert, never auto-change.
   Every suggestion is an estimate built from two imperfect signals:
     1. Calendar — days since the last recorded cut (typical regrowth ~30 days,
        varies with species, fertility, and season).
     2. Forecast — how many dry-ish days are ahead (rain probability < 40%).
   The farmer's own eyes always outrank this. */

export const TYPICAL_REGROWTH_DAYS = 30;
const DRY_PROB_THRESHOLD = 0.4;

export function daysSince(dateStr) {
  if (!dateStr) return null;
  const then = new Date(dateStr + "T00:00:00");
  if (isNaN(then)) return null;
  const now = new Date(new Date().toDateString());
  return Math.floor((now - then) / 86400000);
}

/* Count consecutive forecast days, starting today, with rain probability
   below the threshold. `daily` = [{ date, rainProb, tempHigh }] */
export function dryWindow(daily) {
  if (!daily || daily.length === 0) return null;
  let n = 0;
  for (const d of daily) {
    if (d.rainProb != null && d.rainProb < DRY_PROB_THRESHOLD) n++;
    else break;
  }
  return n;
}

/* Returns { kind, text, action? } or null.
   kind: "ready" | "wait" | "growing" | "info"
   action: the hay_state the suggestion proposes (user must tap to apply). */
export function haySuggestion(field, daily) {
  if (!field.is_hay) return null;
  const days = daysSince(field.last_cut_date);
  const window = dryWindow(daily);

  if (field.hay_state === "cut") {
    if (days != null && days >= 7) {
      return {
        kind: "growing",
        action: "growing",
        text: `Cut ${days} days ago — regrowth has likely started. Mark as Growing?`,
      };
    }
    return null;
  }

  if (field.hay_state === "ready") return null; // user already decided

  /* growing */
  if (days != null && days >= TYPICAL_REGROWTH_DAYS) {
    if (window != null && window >= 3) {
      return {
        kind: "ready",
        action: "ready",
        text: `~${days} days of regrowth and ~${window} dry days ahead — may be ready to cut. Estimate only; check the stand.`,
      };
    }
    if (window != null) {
      return {
        kind: "wait",
        text: `~${days} days of regrowth, but rain is in the forecast (only ${window} dry day${window === 1 ? "" : "s"} ahead). Estimate only.`,
      };
    }
    return {
      kind: "ready",
      action: "ready",
      text: `~${days} days since last cut — may be ready. No forecast available; calendar estimate only.`,
    };
  }

  if (days == null && window != null && window >= 3) {
    return {
      kind: "info",
      text: `No cutting history for this field yet. Forecast shows ~${window} dry days if you're planning a first cut. Estimate only.`,
    };
  }

  return null;
}
