import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { scrapeDBS } from "./banks/dbs";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");

  const supabase = createClient(url, key);

  console.log("Scraping DBS with updated prompt…");
  const rates = await scrapeDBS();
  console.log(`Scraped ${rates.length} DBS rate(s):`);
  rates.forEach((r) =>
    console.log(`  ${r.product_name}: ${r.interest_rate}% (lock-in ${r.lock_in_years}yr)`)
  );

  const { error: deleteError } = await supabase
    .from("mortgage_rates")
    .delete()
    .eq("bank", "DBS");

  if (deleteError) throw new Error(`Delete failed: ${deleteError.message}`);

  const { error: insertError } = await supabase
    .from("mortgage_rates")
    .insert(rates);

  if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

  console.log(`\nDone — replaced DBS rates in database.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
