import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import type { MortgageRateInsert } from "../types";

const RateSchema = z.object({
  rates: z.array(
    z.object({
      product_name: z.string(),
      interest_rate: z.number(),
      lock_in_years: z.number(),
      notes: z.string().optional(),
    })
  ),
});

const extractSchema = {
  type: "object",
  properties: {
    rates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_name: { type: "string" },
          interest_rate: { type: "number" },
          lock_in_years: { type: "number" },
          notes: { type: "string" },
        },
        required: ["product_name", "interest_rate", "lock_in_years"],
      },
    },
  },
  required: ["rates"],
};

// Singapore mortgage rates are always 0.5%–8%. Anything outside is hallucination.
const MIN_VALID_RATE = 0.5;
const MAX_VALID_RATE = 8.0;

const SORA_PROMPT = [
  "Extract all home loan packages from the main rate table only.",
  "Ignore all disclaimer text, footnotes, and any historical SORA rates mentioned in asterisk notes.",
  "For each package:",
  "- product_name: include lock-in period and rate type; always include 'SORA' in the name for SORA-linked packages.",
  "- interest_rate: for SORA-linked packages (shown as 'SORA + X%') extract the spread X only (e.g. 0.75); for fixed-rate packages extract the stated rate.",
  "- lock_in_years: integer years in the lock-in period; use 0 if no lock-in period.",
  "- notes: any promotional conditions or cashback from the main table.",
].join(" ");

export async function firecrawlScrape(
  bank: string,
  url: string,
  prompt = SORA_PROMPT
): Promise<MortgageRateInsert[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("Missing FIRECRAWL_API_KEY in environment");

  const app = new FirecrawlApp({ apiKey });

  const result = await app.scrape(url, {
    formats: [{ type: "json", schema: extractSchema, prompt }],
    waitFor: 3000,
  });

  if (!result.json) throw new Error(`${bank} scrape returned no structured data`);

  const parsed = RateSchema.parse(result.json);
  const valid = parsed.rates.filter(
    (r) => r.interest_rate >= MIN_VALID_RATE && r.interest_rate <= MAX_VALID_RATE
  );

  if (valid.length === 0) {
    throw new Error(`${bank}: no valid rates found — page may not list public rates`);
  }

  return valid.map((r) => ({
    bank,
    product_name: r.product_name,
    interest_rate: r.interest_rate,
    lock_in_years: r.lock_in_years,
    notes: r.notes ?? null,
  }));
}
