import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;
let cachedConfigKey: string | null = null;

export function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, serviceRoleKey };
}

export function getSupabaseServerClient() {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const nextConfigKey = `${supabaseUrl}:${serviceRoleKey.slice(0, 12)}:${serviceRoleKey.slice(-12)}`;
  if (!supabase || cachedConfigKey !== nextConfigKey) {
    supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    cachedConfigKey = nextConfigKey;
  }

  return supabase;
}
