import { chromium } from "playwright";
import type { MortgageRateInsert } from "../types";

// UOB blocks Firecrawl's proxy — use Playwright (local browser) instead.
// Table structure on /personal/borrow/property-loans/private-home-loan.page:
//   <tr><td>Year 1</td><td>3M Compounded SORA + 0.70% p.a.</td></tr>
//   <tr><td>Year 2</td><td>3M Compounded SORA + 0.70% p.a.</td></tr>
//   <tr><td>Year 3</td><td>3M Compounded SORA + 0.80% p.a.</td></tr>
//   <tr><td>Year 4 and thereafter</td><td>3M Compounded SORA + 1.00% p.a.</td></tr>

export async function scrapeUOB(): Promise<MortgageRateInsert[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(
      "https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page",
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForTimeout(5000);

    const rows = await page.evaluate(() =>
      Array.from(document.querySelectorAll("tr")).map((tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.trim() ?? "")
      )
    );

    // Collect year → spread entries
    const entries: Array<{ yearLabel: string; spread: number }> = [];
    for (const cells of rows) {
      if (cells.length < 2) continue;
      const [yearCell, rateCell] = cells;
      if (!/year\s*\d|thereafter/i.test(yearCell)) continue;
      const m = rateCell.match(/SORA\s*\+\s*(\d+\.\d+)%/i);
      if (!m) continue;
      entries.push({ yearLabel: yearCell, spread: parseFloat(m[1]) });
    }

    if (entries.length === 0) {
      throw new Error(
        "UOB: no SORA rates found — table structure may have changed"
      );
    }

    // Collapse consecutive rows with the same spread into a single product.
    // Also infer lock-in from the count of consecutive Year-N rows (not "thereafter").
    const collapsed: Array<{ label: string; spread: number; lockIn: number }> = [];
    let i = 0;
    while (i < entries.length) {
      const spread = entries[i].spread;
      const startLabel = entries[i].yearLabel;
      let j = i;
      while (j < entries.length && entries[j].spread === spread) j++;
      const count = j - i;
      const endLabel = entries[j - 1].yearLabel;

      // Build display label
      const startYr = startLabel.match(/(\d+)/)?.[1] ?? "";
      const endYr = endLabel.match(/(\d+)/)?.[1] ?? "";
      const isThereafter = /thereafter/i.test(endLabel);

      let label: string;
      let lockIn: number;
      if (isThereafter && count === 1) {
        label = "Yr 4+";
        lockIn = 0;
      } else if (startYr === endYr) {
        label = `Yr ${startYr}`;
        lockIn = 0;
      } else {
        label = `Yr ${startYr}-${endYr}`;
        // lock-in = count of non-thereafter years collapsed
        lockIn = parseInt(endYr) - parseInt(startYr) + 1;
      }

      collapsed.push({ label, spread, lockIn });
      i = j;
    }

    return collapsed.map(({ label, spread, lockIn }) => ({
      bank: "UOB",
      product_name: `3M SORA + ${spread.toFixed(2)}% (${label})`,
      interest_rate: spread,
      lock_in_years: lockIn,
      notes: `Variable rate linked to 3M Compounded SORA.${lockIn > 0 ? ` ${lockIn}-year lock-in.` : ""}`,
    }));
  } finally {
    await browser.close();
  }
}
