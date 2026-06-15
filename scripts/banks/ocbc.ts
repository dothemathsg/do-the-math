import { chromium } from "playwright";
import type { MortgageRateInsert } from "../types";

// Rates live in the pre-rendered #popup-promorate popup div, not in the
// visible packages section. Each .in-co-par div holds one year's rate line,
// e.g. "Year 1: 1M COMPOUNDED SORA + 0.98%". The popup is always in the DOM
// even when visually hidden, so no click is required to access it.

const MIN_SPREAD = 0.01;
const MAX_SPREAD = 5.0;

export async function scrapeOCBC(): Promise<MortgageRateInsert[]> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(
      "https://www.ocbc.com/personal-banking/loans/new-purchase-of-hdb-private-property.page",
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForTimeout(4000);

    // Each year's rate is in its own <p> inside #popup-promorate
    const rateLines = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("#popup-promorate p")
      ).map((el) => el.textContent?.trim() ?? "")
    );

    const rates: MortgageRateInsert[] = [];

    for (const line of rateLines) {
      // "Year 1: 1M COMPOUNDED SORA + 0.98%" or "Thereafter: 1M COMPOUNDED SORA + 1.40%"
      const m = line.match(
        /(Year\s+(\d+)|Thereafter):\s*(.+?SORA)\s*\+\s*(\d+\.\d+)%/i
      );
      if (!m) continue;

      const yearLabel = m[1].trim();
      const yearNum = m[2] ? parseInt(m[2]) : null;
      const soraType = m[3].trim().toUpperCase();
      const spread = parseFloat(m[4]);

      if (spread < MIN_SPREAD || spread > MAX_SPREAD) continue;

      const spreadStr = spread.toFixed(2);

      rates.push({
        bank: "OCBC",
        product_name: `${soraType} + ${spreadStr}% (${yearLabel})`,
        interest_rate: spread,
        lock_in_years: yearNum ?? 0,
        notes: `Variable rate linked to ${soraType}. Spread: +${spreadStr}%.`,
      });
    }

    if (rates.length === 0) {
      throw new Error(
        "OCBC: no valid rates found — #popup-promorate .in-co-par structure may have changed"
      );
    }

    return rates;
  } finally {
    await browser.close();
  }
}
