import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import type { MortgageRateInsert } from "../types";

// HSBC Singapore does not publish current fixed rate package rates on their
// public website — they direct users to "Contact us for the latest fixed rate
// packages." The new-property page describes product types (SORA, fixed,
// combination) but contains no actual rate numbers. Rates returned by LLM
// extraction are hallucinated and therefore filtered out (< 0.5% threshold).
// This scraper will fail until HSBC publishes rates publicly.

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

// Singapore mortgage rates are always between 0.5% and 8%. Anything outside
// this range is an LLM hallucination caused by the absence of real rate data.
const MIN_VALID_RATE = 0.5;
const MAX_VALID_RATE = 8.0;

export async function scrapeHSBC(): Promise<MortgageRateInsert[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("Missing FIRECRAWL_API_KEY in environment");

  const app = new FirecrawlApp({ apiKey });

  const result = await app.scrape(
    "https://www.hsbc.com.sg/loans/products/home/new-property/",
    {
      formats: [
        {
          type: "json",
          schema: extractSchema,
          prompt:
            "Extract all home loan packages. For each package include: product_name (e.g. '2-Year Fixed Rate'), interest_rate as a decimal number (e.g. 3.68), lock_in_years as an integer, and any notes (promotional conditions, cashback, etc.).",
        },
      ],
      waitFor: 3000,
    }
  );

  if (!result.json) {
    throw new Error("HSBC scrape returned no structured data");
  }

  const parsed = RateSchema.parse(result.json);

  const valid = parsed.rates.filter(
    (r) => r.interest_rate >= MIN_VALID_RATE && r.interest_rate <= MAX_VALID_RATE
  );
  if (valid.length === 0) {
    throw new Error(
      "HSBC does not publish current mortgage rates on their public website — rates must be obtained by contacting HSBC directly"
    );
  }

  return valid.map((r) => ({
    bank: "HSBC",
    product_name: r.product_name,
    interest_rate: r.interest_rate,
    lock_in_years: r.lock_in_years,
    notes: r.notes ?? null,
  }));
}
