import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

export async function scrapeBOC(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "Bank of China",
    "https://www.bankofchina.com/sg/bocinfo/bi3/"
  );
}
