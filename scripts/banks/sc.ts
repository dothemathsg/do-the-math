import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import type { MortgageRateInsert } from "../types";

// Standard Chartered Singapore does not publish current mortgage rates for new
// purchases on their public website. The MortgageOne product page only shows
// an interactive calculator with blank rate input fields. The loanrepricing
// page has some indicative rates for existing customers repricing their loans,
// but no new-purchase package rates are publicly available.

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

const MIN_VALID_RATE = 0.5;
const MAX_VALID_RATE = 8.0;

export async function scrapeStandardChartered(): Promise<MortgageRateInsert[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("Missing FIRECRAWL_API_KEY in environment");

  const app = new FirecrawlApp({ apiKey });

  const result = await app.scrape(
    "https://www.sc.com/sg/borrow/mortgages/loanrepricing/",
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
    throw new Error("Standard Chartered scrape returned no structured data");
  }

  const parsed = RateSchema.parse(result.json);

  const valid = parsed.rates.filter(
    (r) => r.interest_rate >= MIN_VALID_RATE && r.interest_rate <= MAX_VALID_RATE
  );
  if (valid.length === 0) {
    throw new Error(
      "Standard Chartered does not publish current mortgage rates on their public website"
    );
  }

  return valid.map((r) => ({
    bank: "Standard Chartered",
    product_name: r.product_name,
    interest_rate: r.interest_rate,
    lock_in_years: r.lock_in_years,
    notes: r.notes ?? null,
  }));
}
