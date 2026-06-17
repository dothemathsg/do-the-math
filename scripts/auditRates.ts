import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { scrapeCIMB } from "./banks/cimb";
import { scrapeMaybank } from "./banks/maybank";
import { scrapeCitibank } from "./banks/citibank";
import { scrapeHSBC } from "./banks/hsbc";

// Re-run each Firecrawl scraper and print raw structured output
// so we can verify against what's actually on the bank websites.

async function main() {
  const scrapers = [
    { name: "CIMB",     fn: scrapeCIMB },
    { name: "Maybank",  fn: scrapeMaybank },
    { name: "Citibank", fn: scrapeCitibank },
    { name: "HSBC",     fn: scrapeHSBC },
  ];

  for (const { name, fn } of scrapers) {
    try {
      const rates = await fn();
      console.log(`\n=== ${name} (${rates.length} rates) ===`);
      rates.forEach((r) =>
        console.log(`  ${r.product_name}: ${r.interest_rate}% (lock-in ${r.lock_in_years}yr) notes: ${r.notes ?? "—"}`)
      );
    } catch (e) {
      console.error(`${name}: FAILED — ${e instanceof Error ? e.message : e}`);
    }
  }
}

main().catch(console.error);
