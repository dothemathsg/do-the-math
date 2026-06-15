import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { scrapeDBS } from "./banks/dbs";
import { scrapeOCBC } from "./banks/ocbc";
import { scrapeUOB } from "./banks/uob";
import { scrapeStandardChartered } from "./banks/sc";
import { scrapeHSBC } from "./banks/hsbc";
import type { MortgageRateInsert } from "./types";

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  return createClient(url, key);
}

async function main() {
  const supabase = createSupabaseClient();

  const scrapers: Array<{ name: string; fn: () => Promise<MortgageRateInsert[]> }> = [
    { name: "DBS", fn: scrapeDBS },
    { name: "OCBC", fn: scrapeOCBC },
    { name: "UOB", fn: scrapeUOB },
    { name: "Standard Chartered", fn: scrapeStandardChartered },
    { name: "HSBC", fn: scrapeHSBC },
  ];

  const rates: MortgageRateInsert[] = [];

  for (const { name, fn } of scrapers) {
    try {
      const result = await fn();
      console.log(`${name}: scraped ${result.length} rate(s)`);
      rates.push(...result);
    } catch (err) {
      console.error(`${name}: scraper failed —`, err instanceof Error ? err.message : err);
    }
  }

  if (rates.length === 0) {
    console.log("No rates to insert. Exiting.");
    return;
  }

  // Deduplicate by (bank, interest_rate, lock_in_years) — keeps first occurrence
  const seen = new Set<string>();
  const unique = rates.filter((r) => {
    const key = `${r.bank}|${r.interest_rate}|${r.lock_in_years}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length < rates.length) {
    console.log(`Deduped ${rates.length - unique.length} duplicate(s) — inserting ${unique.length} rate(s)`);
  }

  const banks = [...new Set(unique.map((r) => r.bank))];

  const { error: deleteError } = await supabase
    .from("mortgage_rates")
    .delete()
    .in("bank", banks);

  if (deleteError) {
    throw new Error(`Failed to clear existing rates: ${deleteError.message}`);
  }

  const { error: insertError } = await supabase
    .from("mortgage_rates")
    .insert(unique);

  if (insertError) {
    throw new Error(`Failed to insert rates: ${insertError.message}`);
  }

  console.log(`Inserted ${unique.length} rate(s) for: ${banks.join(", ")}`);
}

main().catch((err) => {
  console.error("Fatal error:", err instanceof Error ? err.message : err);
  process.exit(1);
});
