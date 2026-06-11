/* Calls to Supabase Edge Functions — the server-side proxies that hold the
   secret API keys (api-ninjas, OpenWeatherMap). The app never sees those keys.
   Both functions return { available: false, reason } when not configured,
   and the UI says so honestly instead of pretending. */
import { supabase } from "./supabase";

export async function fetchMarkets() {
  try {
    const { data, error } = await supabase.functions.invoke("markets");
    if (error) throw error;
    return data;
  } catch (e) {
    return { available: false, reason: "Could not reach the markets service." };
  }
}

export async function fetchWeather(lat, lon) {
  try {
    const { data, error } = await supabase.functions.invoke("weather", {
      body: { lat, lon },
    });
    if (error) throw error;
    return data;
  } catch (e) {
    return { available: false, reason: "Could not reach the weather service." };
  }
}
