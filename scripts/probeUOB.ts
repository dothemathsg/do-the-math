import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(5000);

  // Dump all text that contains a % sign (rate-like content)
  const lines = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const out: string[] = [];
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent?.trim() ?? "";
      if (t.includes("%") && t.length < 200) out.push(t);
    }
    return [...new Set(out)];
  });

  console.log("=== Lines containing % ===");
  lines.forEach((l) => console.log(JSON.stringify(l)));

  await browser.close();
}

main().catch(console.error);
