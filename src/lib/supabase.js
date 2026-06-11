import { createClient } from "@supabase/supabase-js";

/* The publishable key is designed to be public — row-level security in the
   database is what protects data. Env vars override these defaults. */
const url = import.meta.env.VITE_SUPABASE_URL || "https://dunxqpaldeejusgiixki.supabase.co";
const key = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_aB0_Aos9doUBk8OvJSB_CA_Vx1HXBmS";

export const supabase = createClient(url, key);
