import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(5000);

  // Get the section that has rates with surrounding context
  const sections = await page.evaluate(() => {
    const out: string[] = [];
    // Find all text nodes near SORA mentions
    const all = document.querySelectorAll("*");
    for (const el of all) {
      const t = el.textContent?.trim() ?? "";
      if (t.includes("SORA") && t.length < 800) {
        out.push(`[${el.tagName}] ${t}`);
      }
    }
    return out;
  });

  // Filter to relevant-looking ones
  const relevant = sections.filter(s => s.includes("0.") || s.includes("lock") || s.includes("year") || s.includes("Year") || s.includes("%"));
  relevant.slice(0, 40).forEach((s) => console.log(s.slice(0, 300)));

  await browser.close();
}

main().catch(console.error);
