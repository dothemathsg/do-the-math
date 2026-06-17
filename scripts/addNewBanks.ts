import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { scrapeCIMB } from "./banks/cimb";
import { scrapeMaybank } from "./banks/maybank";
import { scrapeCitibank } from "./banks/citibank";
import { scrapeBOC } from "./banks/boc";
import type { MortgageRateInsert } from "./types";

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const scrapers = [
    { name: "CIMB",          fn: scrapeCIMB },
    { name: "Maybank",       fn: scrapeMaybank },
    { name: "Citibank",      fn: scrapeCitibank },
    { name: "Bank of China", fn: scrapeBOC },
  ];

  const rates: MortgageRateInsert[] = [];

  for (const { name, fn } of scrapers) {
    try {
      const r = await fn();
      console.log(`${name}: ${r.length} rate(s)`);
      r.forEach((x) => console.log(`  ${x.product_name}: ${x.interest_rate}% (lock-in ${x.lock_in_years}yr)`));
      rates.push(...r);
    } catch (e) {
      console.error(`${name}: FAILED —`, e instanceof Error ? e.message : e);
    }
  }

  if (rates.length === 0) {
    console.log("No rates scraped.");
    return;
  }

  const banks = [...new Set(rates.map((r) => r.bank))];
  const { error: delErr } = await supabase.from("mortgage_rates").delete().in("bank", banks);
  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);

  const { error: insErr } = await supabase.from("mortgage_rates").insert(rates);
  if (insErr) throw new Error(`Insert failed: ${insErr.message}`);

  console.log(`\nInserted ${rates.length} rate(s) for: ${banks.join(", ")}`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
