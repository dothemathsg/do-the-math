import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");

  const supabase = createClient(url, key);

  // UPDATE triggers a broken updated_at trigger on this table — delete + re-insert instead
  const { error: delError } = await supabase
    .from("mortgage_rates")
    .delete()
    .eq("bank", "DBS")
    .eq("interest_rate", 4.25);

  if (delError) throw new Error(`Delete failed: ${delError.message}`);

  const { error: insError } = await supabase
    .from("mortgage_rates")
    .insert({ bank: "DBS", product_name: "Bridging Loan", interest_rate: 4.25, lock_in_years: 0 });

  if (insError) throw new Error(`Insert failed: ${insError.message}`);
  console.log("Patched DBS 4.25% → Bridging Loan, lock_in_years=0");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
