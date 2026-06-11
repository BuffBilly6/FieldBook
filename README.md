# Fieldbook

Mobile-first farm operations app: Vehicles · Fencing · Fields (satellite map) · Livestock · Projects · Markets, plus an Ag News page (header menu) with supply-chain / trade headlines.

Backed by Supabase (Postgres + auth + edge functions). All data persists and syncs across devices.

## Run it

```bash
npm install
npm run dev      # local development
npm run build    # production build (output in dist/)
```

The `.env` file already contains the Supabase URL and publishable key. The publishable key is safe to expose — row-level security in the database is what protects data, and every table is locked to the signed-in user.

## First use

Open the app, tap **Create account**, and sign up with email + password. Supabase sends a confirmation email — click the link, then sign in. Your data is private to your account.

## API keys (Markets + hay weather suggestions)

The secret keys live in Supabase Edge Function secrets — never in this codebase. Until they're set, the app says so honestly: Markets shows clearly-labeled sample prices, and hay suggestions fall back to cutting-date math only.

To set them: Supabase Dashboard → your `fieldbook` project → **Edge Functions** → **Secrets**, then add:

| Secret name      | Where to get it                          |
| ---------------- | ---------------------------------------- |
| `API_NINJAS_KEY` | api-ninjas.com account → API key         |
| `OPENWEATHER_KEY`| openweathermap.org account → API keys    |

No redeploy needed — functions read secrets at request time.

## How the pieces fit

- `src/config.js` — tabs, form definitions, commodity list. Add a form field here and it appears in the UI (the database column must exist too).
- `src/hooks/useTable.js` — generic load/insert/update/delete for any table; row-level security scopes everything to the signed-in user.
- `src/lib/hay.js` — the readiness suggestion engine. It only ever *suggests*; state changes require a tap.
- `src/lib/geo.js` — polygon area math. Acreage is always labeled an estimate.
- `supabase/functions/` — source for the deployed edge functions (markets, weather, agnews). The news function uses public Google News RSS feeds — no API key needed.

## Honesty principle

The app never asserts data it doesn't have:
- Acreage is computed from a hand-drawn outline → labeled "~" and "estimated".
- Sample market prices are labeled "Sample", with the reason.
- Hay suggestions state their basis (regrowth days, forecast) and say "estimate only".
- Nothing auto-changes field state — suggestions offer a button, you decide.
