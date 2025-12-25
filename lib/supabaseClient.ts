import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Твой нейминг остаётся: SUPABASE_URL / SUPABASE_ANON_KEY.
// Для клиента Next всё равно нужны NEXT_PUBLIC_*, поэтому читаем ОБА варианта.
const supabaseUrl =process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Add SUPABASE_URL/SUPABASE_ANON_KEY (и/или NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY) to .env.local"
  );
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

