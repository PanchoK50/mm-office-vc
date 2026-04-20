import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export function createOfficethonServerClient() {
  return createClient(
    process.env.OFFICETHON_SUPABASE_URL!,
    process.env.OFFICETHON_SUPABASE_ANON_KEY!,
  );
}
