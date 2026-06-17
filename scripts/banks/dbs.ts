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

// JSON Schema passed to Firecrawl for LLM extraction — avoids Zod version
// conflicts with Firecrawl's bundled zod. Local validation is done with Zod below.
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

export async function scrapeDBS(): Promise<MortgageRateInsert[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("Missing FIRECRAWL_API_KEY in environment");

  const app = new FirecrawlApp({ apiKey });

  const result = await app.scrape(
    "https://www.dbs.com.sg/personal/rates-online/home-loans.page",
    {
      formats: [
        {
          type: "json",
          schema: extractSchema,
          prompt: [
            "Extract all home loan packages from the main rate table only.",
            "Ignore all disclaimer text, footnotes, and any rates mentioned inside asterisk/star notes.",
            "For each package provide:",
            "- product_name: descriptive name including lock-in period and rate type.",
            "  Always include 'SORA' in the name for SORA-linked packages (e.g. 'Two-In-One 3M SORA 2-Year').",
            "  Use the exact product name shown on the page (e.g. 'Bridging Loan').",
            "- interest_rate:",
            "  * SORA-linked packages (formula shown as '3M SORA + X%'): set interest_rate to the spread X only (e.g. 0.75). Do NOT use any historical SORA value from disclaimers.",
            "  * Fixed-rate and bridging loan packages: set interest_rate to the stated rate.",
            "- lock_in_years: integer years in the lock-in period. Use 0 if there is no lock-in period (e.g. bridging loans).",
            "- notes: promotional conditions or cashback offers from the main table.",
          ].join(" "),
        },
      ],
    }
  );

  if (!result.json) {
    throw new Error("DBS scrape returned no structured data");
  }

  const parsed = RateSchema.parse(result.json);

  return parsed.rates.map((r) => ({
    bank: "DBS",
    product_name: r.product_name,
    interest_rate: r.interest_rate,
    lock_in_years: r.lock_in_years,
    notes: r.notes ?? null,
  }));
}
