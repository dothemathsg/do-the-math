import { getAnthropic } from "./anthropic";
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import type { Database } from "@/supabase/types";

function getSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Known public rate pages per bank — add more as needed
const MORTGAGE_RATE_PAGES: Record<string, string> = {
  DBS:                  "https://www.dbs.com.sg/personal/loans/home-loans/home-loan-rates",
  POSB:                 "https://www.dbs.com.sg/personal/loans/home-loans/home-loan-rates",
  OCBC:                 "https://www.ocbc.com/personal-banking/loans/home-loan/home-loan-rate.page",
  UOB:                  "https://www.uob.com.sg/personal/borrow/property-loan/home-loan-rates.page",
  "Standard Chartered": "https://www.sc.com/sg/borrow/mortgages/home-loans/",
  HSBC:                 "https://www.hsbc.com.sg/mortgages/products/home-loan/",
  Maybank:              "https://www.maybank2u.com.sg/en/borrow/home/home-loan.page",
  "Hong Leong Finance": "https://www.hlf.com.sg/personal/loans/home-loans/",
  Citibank:             "https://www.citibank.com.sg/singapore/loans/home-loans/",
};

export interface RateVerdict {
  insurer: string;
  plan: string;
  category: string;
  storedValue: string;
  verdict: "likely_accurate" | "may_be_outdated" | "unverifiable";
  confidence: "high" | "medium" | "low";
  notes: string;
  sourceUrl: string;
}

export interface ReviewReport {
  mortgage: RateVerdict[];
  insurance: RateVerdict[];
  scrapedUrls: Array<{ url: string; success: boolean }>;
  errors: string[];
  reviewedAt: string;
}

async function scrapeUrl(firecrawl: FirecrawlApp, url: string): Promise<string | null> {
  try {
    const result = await firecrawl.scrapeUrl(url, { formats: ["markdown"] });
    return result.markdown?.slice(0, 5000) ?? null;
  } catch {
    return null;
  }
}

async function askClaude(
  scraped: string | null,
  sourceUrl: string,
  rates: Array<{ plan: string; value: string }>,
  context: string
): Promise<Array<{ plan: string; verdict: RateVerdict["verdict"]; confidence: RateVerdict["confidence"]; notes: string }>> {
  if (!scraped) {
    return rates.map((r) => ({
      plan: r.plan,
      verdict: "unverifiable" as const,
      confidence: "low" as const,
      notes: `Could not scrape ${sourceUrl || "source page"}.`,
    }));
  }

  const prompt = `You are a rates accuracy reviewer for Do The Math, a Singapore personal finance platform.

SOURCE URL: ${sourceUrl}

SCRAPED CONTENT:
${scraped}

STORED RATES TO VERIFY:
${JSON.stringify(rates, null, 2)}

For each stored rate, assess whether it appears accurate based on the scraped content.
Notes:
- Insurance quote pages usually require form input — if so, check plan names and general pricing tiers
- Mortgage rate pages often publish rate tables directly — verify the exact figure if visible
- "unverifiable" is the correct verdict when the page cannot confirm the rate, NOT when you think it is wrong

Return ONLY a valid JSON array, no markdown fences, no explanation:
[
  {
    "plan": "<exact plan name from input>",
    "verdict": "likely_accurate" | "may_be_outdated" | "unverifiable",
    "confidence": "high" | "medium" | "low",
    "notes": "<1-2 sentences explaining the verdict>"
  }
]

Verdict definitions:
- likely_accurate: page shows matching or very close price/rate
- may_be_outdated: page shows a clearly different price or the product has changed
- unverifiable: pricing requires form input, plan not found, or page didn't load`;

  try {
    const response = await getAnthropic().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    const cleaned = text.replace(/^```json\n?|```$/gm, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return rates.map((r) => ({
      plan: r.plan,
      verdict: "unverifiable" as const,
      confidence: "low" as const,
      notes: `Claude review failed for ${context}.`,
    }));
  }
}

export async function runRatesReview(): Promise<ReviewReport> {
  if (!process.env.FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY not set");
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");

  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const supabase = getSupabase();
  const scrapedUrls: Array<{ url: string; success: boolean }> = [];
  const errors: string[] = [];

  // ── MORTGAGE ────────────────────────────────────────────────────────────────
  const { data: mortgageRates, error: mortErr } = await supabase
    .from("mortgage_rates")
    .select("*")
    .order("bank");

  if (mortErr) errors.push(`Mortgage fetch: ${mortErr.message}`);

  // Group by bank
  const mortgageByBank = new Map<string, typeof mortgageRates>();
  for (const r of mortgageRates ?? []) {
    if (!mortgageByBank.has(r.bank)) mortgageByBank.set(r.bank, []);
    mortgageByBank.get(r.bank)!.push(r);
  }

  // Scrape all unique bank URLs in parallel
  const bankEntries = [...mortgageByBank.entries()];
  const mortgageScrapes = await Promise.all(
    bankEntries.map(async ([bank, rates]) => {
      const url = MORTGAGE_RATE_PAGES[bank] ?? null;
      let content: string | null = null;
      if (url) {
        content = await scrapeUrl(firecrawl, url);
        scrapedUrls.push({ url, success: !!content });
      }
      return { bank, url: url ?? "", content, rates: rates ?? [] };
    })
  );

  // Claude reviews in parallel
  const mortgageVerdicts = await Promise.all(
    mortgageScrapes.map(async ({ bank, url, content, rates }) => {
      const rateInputs = rates.map((r) => ({
        plan: r.product_name,
        value: `${r.interest_rate}% p.a., ${r.lock_in_years}-year lock-in`,
      }));
      const verdicts = await askClaude(content, url, rateInputs, bank);
      return verdicts.map((v) => ({
        insurer: bank,
        plan: v.plan,
        category: "mortgage",
        storedValue: rateInputs.find((r) => r.plan === v.plan)?.value ?? "",
        verdict: v.verdict,
        confidence: v.confidence,
        notes: v.notes,
        sourceUrl: url,
      } satisfies RateVerdict));
    })
  );

  // ── INSURANCE ───────────────────────────────────────────────────────────────
  const { data: insuranceRates, error: insErr } = await supabase
    .from("insurance_rates")
    .select("*")
    .eq("is_active", true)
    .order("category");

  if (insErr) errors.push(`Insurance fetch: ${insErr.message}`);

  // Group by unique quote_url — avoids scraping the same page multiple times
  const byUrl = new Map<string, typeof insuranceRates>();
  for (const r of insuranceRates ?? []) {
    const key = r.quote_url ?? `__no_url__${r.insurer}__${r.category}`;
    if (!byUrl.has(key)) byUrl.set(key, []);
    byUrl.get(key)!.push(r);
  }

  // Scrape all unique insurance URLs in parallel
  const insuranceUrlEntries = [...byUrl.entries()];
  const insuranceScrapes = await Promise.all(
    insuranceUrlEntries.map(async ([urlKey, rates]) => {
      const isReal = urlKey.startsWith("http");
      let content: string | null = null;
      if (isReal) {
        content = await scrapeUrl(firecrawl, urlKey);
        scrapedUrls.push({ url: urlKey, success: !!content });
      }
      return { url: isReal ? urlKey : "", content, rates: rates ?? [] };
    })
  );

  // Claude reviews in parallel
  const insuranceVerdicts = await Promise.all(
    insuranceScrapes.map(async ({ url, content, rates }) => {
      const insurer = rates[0]?.insurer ?? "";
      const category = rates[0]?.category ?? "";
      const priceUnit = rates[0]?.price_unit ?? "";
      const rateInputs = rates.map((r) => ({
        plan: `${r.plan_name} (${r.tier})`,
        value: `S$${r.price} ${priceUnit}`,
      }));
      const verdicts = await askClaude(content, url, rateInputs, `${insurer} ${category}`);
      return verdicts.map((v) => ({
        insurer,
        plan: v.plan,
        category,
        storedValue: rateInputs.find((r) => r.plan === v.plan)?.value ?? "",
        verdict: v.verdict,
        confidence: v.confidence,
        notes: v.notes,
        sourceUrl: url,
      } satisfies RateVerdict));
    })
  );

  return {
    mortgage: mortgageVerdicts.flat(),
    insurance: insuranceVerdicts.flat(),
    scrapedUrls,
    errors,
    reviewedAt: new Date().toISOString(),
  };
}
