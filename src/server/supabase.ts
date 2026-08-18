import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

function env(name: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? process.env[name] : undefined;
  const fromMeta = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[
    name
  ];
  return fromProcess || fromMeta;
}

/** Server-only Supabase client (service role). Never import into browser components. */
export function createServiceSupabase(): SupabaseClient<Database> {
  const url = env("SUPABASE_URL") || env("VITE_SUPABASE_URL");
  const secret = env("SUPABASE_SECRET_KEY");

  if (!url || !secret) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY for admin server client");
  }

  return createClient<Database>(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
