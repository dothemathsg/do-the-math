import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

export async function scrapeCIMB(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "CIMB",
    "https://www.cimb.com.sg/en/personal/banking-with-us/loans-financing/property-loan/cimb-private-property-loan.html"
  );
}
