import { config } from "dotenv";
config({ path: ".env.local" });

import { scrapeDBS } from "./banks/dbs";
import { scrapeOCBC } from "./banks/ocbc";
import { scrapeUOB } from "./banks/uob";
import { scrapeStandardChartered } from "./banks/sc";
import { scrapeHSBC } from "./banks/hsbc";
import type { MortgageRateInsert } from "./types";

const scrapers: Array<{ name: string; fn: () => Promise<MortgageRateInsert[]> }> = [
  { name: "DBS", fn: scrapeDBS },
  { name: "OCBC", fn: scrapeOCBC },
  { name: "UOB", fn: scrapeUOB },
  { name: "Standard Chartered", fn: scrapeStandardChartered },
  { name: "HSBC", fn: scrapeHSBC },
];

async function main() {
  for (const { name, fn } of scrapers) {
    console.log(`\n=== ${name} ===`);
    try {
      const rates = await fn();
      console.log(`✓ ${rates.length} rate(s) scraped`);
      console.log(JSON.stringify(rates, null, 2));
    } catch (err) {
      console.error(`✗ Failed:`, err instanceof Error ? err.message : err);
    }
  }
}

main().catch(console.error);
