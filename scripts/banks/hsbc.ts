import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

// HSBC Singapore does not publish current rate numbers publicly — the page
// describes product types but shows no actual percentages. Rates returned by
// LLM extraction would be hallucinated and are therefore blocked by the 0.5%
// floor in firecrawlScrape. This scraper will throw until HSBC publishes rates.

export async function scrapeHSBC(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "HSBC",
    "https://www.hsbc.com.sg/mortgages/"
  );
}
