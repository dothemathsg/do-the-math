import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Server client — can use the anon key for read-only data fetching in
// Server Components. Only use service_role key in scripts that write data.
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
