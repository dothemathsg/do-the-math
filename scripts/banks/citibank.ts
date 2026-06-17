import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

export async function scrapeCitibank(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "Citibank",
    "https://www1.citibank.com.sg/loans/mortgage"
  );
}
