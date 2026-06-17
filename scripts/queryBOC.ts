import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("mortgage_rates")
    .select("*")
    .eq("bank", "Bank of China");

  if (error) { console.error(error.message); process.exit(1); }
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
