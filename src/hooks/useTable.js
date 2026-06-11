import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/* Generic CRUD hook for one Supabase table.
   Row-level security means queries only ever return the signed-in user's rows. */
export function useTable(table) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (error) setError(error.message);
      else setRows(data || []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [table]);

  const insert = useCallback(async (values) => {
    const { data, error } = await supabase.from(table).insert(values).select().single();
    if (error) { setError(error.message); return null; }
    setError(null);
    setRows((r) => [data, ...r]);
    return data;
  }, [table]);

  const update = useCallback(async (id, patch) => {
    const { data, error } = await supabase.from(table).update(patch).eq("id", id).select().single();
    if (error) { setError(error.message); return null; }
    setError(null);
    setRows((r) => r.map((x) => (x.id === id ? data : x)));
    return data;
  }, [table]);

  const remove = useCallback(async (id) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { setError(error.message); return false; }
    setError(null);
    setRows((r) => r.filter((x) => x.id !== id));
    return true;
  }, [table]);

  return { rows, loading, error, insert, update, remove };
}

/* Form helper: trim strings, convert empty strings to null
   (Postgres date columns reject ""). */
export function cleanValues(form, keys) {
  const out = {};
  for (const k of keys) {
    const v = (form[k] ?? "").toString().trim();
    out[k] = v === "" ? null : v;
  }
  return out;
}
