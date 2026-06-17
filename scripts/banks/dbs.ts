import { firecrawlScrape } from "./firecrawlScraper";
import type { MortgageRateInsert } from "../types";

const PROMPT = [
  "Extract all home loan packages from the main rate table only.",
  "Ignore all disclaimer text, footnotes, and any historical SORA rates mentioned in asterisk notes.",
  "For each package:",
  "- product_name: use the exact product name shown (e.g. 'Two-In-One', 'Bridging Loan'); include 'SORA' for SORA-linked packages.",
  "- interest_rate: for SORA-linked packages (shown as '3M SORA + X%') extract the spread X only (e.g. 0.75); for fixed-rate and bridging loan packages extract the stated rate.",
  "- lock_in_years: integer years; use 0 if no lock-in period (e.g. bridging loans have no lock-in).",
  "- notes: any promotional conditions or cashback from the main table.",
].join(" ");

export async function scrapeDBS(): Promise<MortgageRateInsert[]> {
  return firecrawlScrape(
    "DBS",
    "https://www.dbs.com.sg/personal/rates-online/home-loans.page",
    PROMPT
  );
}
