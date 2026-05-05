import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase ayarlanmamış. .env.local'e SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ekleyin."
    );
  }
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

export const UPLOADS_BUCKET = process.env.SUPABASE_UPLOADS_BUCKET || "uploads";
