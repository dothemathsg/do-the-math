import { chromium } from "playwright";
import type { MortgageRateInsert } from "../types";

// SC publishes SORA rates on their /borrow/mortgages/sora/ page in a plain
// HTML table. Structure:
//   <tr><td colspan="2">3M Compounded SORA*</td></tr>   ← header
//   <tr><td>Year 1</td><td>3M Compounded SORA + 1.00% p.a.</td></tr>
//   <tr><td>Lock-in Period</td><td>2 years</td></tr>
// All years share the same spread, so we collapse into one entry per package.

export async function scrapeStandardChartered(): Promise<MortgageRateInsert[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.sc.com/sg/borrow/mortgages/sora/", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(4000);

    const tableRows = await page.evaluate(() =>
      Array.from(document.querySelectorAll("table tbody")).map((tbody) =>
        Array.from(tbody.querySelectorAll("tr")).map((tr) =>
          Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.trim() ?? "")
        )
      )
    );

    const rates: MortgageRateInsert[] = [];

    for (const rows of tableRows) {
      let spread: number | null = null;
      let lockInYears: number | null = null;
      let packageName = "3M COMPOUNDED SORA";

      for (const cells of rows) {
        if (cells.length === 0) continue;

        const first = cells[0];
        const second = cells[1] ?? "";

        // Header row: spans 2 cols, contains package name
        if (cells.length === 1 || (cells.length === 2 && !second)) {
          if (/SORA/i.test(first)) packageName = first.replace(/\*+$/, "").trim();
          continue;
        }

        // Rate row: "Year N" or "Thereafter" + "3M Compounded SORA + X% p.a."
        if (/Year\s+\d+|Thereafter/i.test(first)) {
          const m = second.match(/SORA\s*\+\s*(\d+\.\d+)%/i);
          if (m && spread === null) spread = parseFloat(m[1]);
          continue;
        }

        // Lock-in row: "Lock-in Period" + "N years"
        if (/lock.?in/i.test(first)) {
          const m = second.match(/(\d+)/);
          if (m) lockInYears = parseInt(m[1]);
        }
      }

      if (spread === null) continue;

      const spreadStr = spread.toFixed(2);
      const lockIn = lockInYears ?? 0;

      rates.push({
        bank: "Standard Chartered",
        product_name: `${packageName} + ${spreadStr}%`,
        interest_rate: spread,
        lock_in_years: lockIn,
        notes: `Variable rate linked to ${packageName}. ${lockIn > 0 ? `${lockIn}-year lock-in.` : ""} Min loan S$100,000.`.trim(),
      });
    }

    if (rates.length === 0) {
      throw new Error(
        "Standard Chartered: no rates found — table structure on /borrow/mortgages/sora/ may have changed"
      );
    }

    return rates;
  } finally {
    await browser.close();
  }
}
