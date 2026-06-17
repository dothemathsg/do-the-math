import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

export async function scrapeUOB(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "UOB",
    "https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page"
  );
}
