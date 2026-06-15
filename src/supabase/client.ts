import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Browser client — uses the anon key, safe to expose publicly.
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
