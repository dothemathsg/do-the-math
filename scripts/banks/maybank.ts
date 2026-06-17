import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

export async function scrapeMaybank(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "Maybank",
    "https://www.maybank.com.sg/en/personal-banking/loans/home-loans.page"
  );
}
