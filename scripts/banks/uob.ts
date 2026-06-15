import { chromium } from "playwright";
import type { MortgageRateInsert } from "../types";

// UOB rates are in a <table> of tr.table-row rows. Two row types:
//   Header row: first td is empty (&nbsp;), second td is the package name
//   Data row:   first td is "Year N" or "Thereafter", second td is the rate string
// Example data row: <td>Year 1</td><td>3M Compounded SORA + 0.70% p.a.</td>

const MIN_SPREAD = 0.01;
const MAX_SPREAD = 5.0;

export async function scrapeUOB(): Promise<MortgageRateInsert[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(
      "https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page",
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForTimeout(3000);

    const tableRows = await page.evaluate(() =>
      Array.from(document.querySelectorAll("tr.table-row")).map((row) =>
        Array.from(row.querySelectorAll("td.table-item")).map((td) => {
          // Replace <sup> elements with " TEXT" to avoid "SORAPROMOTIONAL" concatenation
          const clone = td.cloneNode(true) as Element;
          clone.querySelectorAll("sup").forEach((s) => {
            s.replaceWith(" " + (s.textContent ?? ""));
          });
          return clone.textContent?.trim() ?? "";
        })
      )
    );

    const rates: MortgageRateInsert[] = [];
    let currentPackage = "UOB Private Home Loan";

    for (const cells of tableRows) {
      if (cells.length < 2) continue;

      const first = cells[0];
      const second = cells[1];

      // Header row: first cell is empty or whitespace-only
      if (!first.replace(/ /g, "").trim()) {
        if (/SORA/i.test(second)) {
          // Strip superscript text and trim to the key phrase
          currentPackage = second
            .replace(/\s+/g, " ")
            .replace(/\s*Limited tranche.*/i, "")
            .replace(/\s*\*+\s*$/, "")
            .trim();
        }
        continue;
      }

      // Data row: first cell is "Year N" or "Thereafter"
      const yearMatch = first.match(/Year\s+(\d+)|Thereafter/i);
      if (!yearMatch) continue;

      const yearNum = yearMatch[1] ? parseInt(yearMatch[1]) : null;

      // Extract spread from "3M Compounded SORA + 0.70% p.a."
      const rateMatch = second.match(/SORA\s*\+\s*(\d+\.\d+)%/i);
      if (!rateMatch) continue;

      const spread = parseFloat(rateMatch[1]);
      if (spread < MIN_SPREAD || spread > MAX_SPREAD) continue;

      const yearLabel = yearNum ? `Year ${yearNum}` : "Thereafter";
      const spreadStr = spread.toFixed(2);

      rates.push({
        bank: "UOB",
        product_name: `3M COMPOUNDED SORA + ${spreadStr}% (${yearLabel})`,
        interest_rate: spread,
        lock_in_years: yearNum ?? 0,
        notes: `${currentPackage}. Variable rate linked to 3M Compounded SORA. Spread: +${spreadStr}%.`,
      });
    }

    // Deduplicate: same product_name may appear across multiple package sections
    const seen = new Set<string>();
    const unique = rates.filter((r) => {
      if (seen.has(r.product_name)) return false;
      seen.add(r.product_name);
      return true;
    });

    if (unique.length === 0) {
      throw new Error(
        "UOB: no valid rates found — tr.table-row / td.table-item structure may have changed"
      );
    }

    return unique;
  } finally {
    await browser.close();
  }
}
