import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const publishableKey =
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ||
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined);

export const isSupabaseConfigured = Boolean(url && publishableKey);

function createSupabase(): SupabaseClient<Database> {
  if (!url || !publishableKey) {
    // Placeholder client — calls will fail until env vars are set.
    return createClient<Database>("https://placeholder.supabase.co", "placeholder-key");
  }
  return createClient<Database>(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = createSupabase();
