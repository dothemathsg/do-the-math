import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { scrapeOCBC } from "./banks/ocbc";

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const rates = await scrapeOCBC();
  console.log(`OCBC: ${rates.length} rate(s)`);
  rates.forEach((r) => console.log(`  ${r.product_name}: ${r.interest_rate}%`));
  await supabase.from("mortgage_rates").delete().eq("bank", "OCBC");
  const { error } = await supabase.from("mortgage_rates").insert(rates);
  if (error) throw new Error(error.message);
  console.log("Updated OCBC in DB.");
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
