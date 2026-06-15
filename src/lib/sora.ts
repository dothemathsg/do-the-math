import { unstable_cache } from "next/cache";

const PAGE_URL =
  "https://eservices.mas.gov.sg/statistics/dir/DomesticInterestRates.aspx";

const SORA_FALLBACK = 1.09;

export interface SoraResult {
  rate: number;
  isLive: boolean;
  date?: string;
}

function extractHiddenField(html: string, name: string): string {
  return (
    html.match(
      new RegExp(`name="${name.replace(/\$/g, "\\$")}"[^>]*value="([^"]+)"`)
    )?.[1] ?? ""
  );
}

async function scrapeMonth(
  year: number,
  month: number
): Promise<{ rate: number; date: string } | null> {
  const getRes = await fetch(PAGE_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible)", Accept: "text/html" },
    cache: "no-store",
  });
  if (!getRes.ok) return null;

  const html = await getRes.text();
  const viewState = extractHiddenField(html, "__VIEWSTATE");
  const viewStateGen = extractHiddenField(html, "__VIEWSTATEGENERATOR");
  const eventValidation = extractHiddenField(html, "__EVENTVALIDATION");
  if (!viewState) return null;

  const body = new URLSearchParams({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: viewStateGen,
    __EVENTVALIDATION: eventValidation,
    "ctl00$ContentPlaceHolder1$StartYearDropDownList": year.toString(),
    "ctl00$ContentPlaceHolder1$EndYearDropDownList": year.toString(),
    "ctl00$ContentPlaceHolder1$StartMonthDropDownList": month.toString(),
    "ctl00$ContentPlaceHolder1$EndMonthDropDownList": month.toString(),
    "ctl00$ContentPlaceHolder1$ColumnsCheckBoxList$16": "on",
    "ctl00$ContentPlaceHolder1$Button1": "Display",
  });

  const postRes = await fetch(PAGE_URL, {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible)",
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: PAGE_URL,
    },
    body: body.toString(),
    cache: "no-store",
  });
  if (!postRes.ok) return null;

  const postHtml = await postRes.text();

  // Each data row has two msbData cells: "DD Mon YYYY" (date) then the numeric rate
  const rates = [
    ...postHtml.matchAll(/<td class="msbData" align="center">([\d.]+)<\/td>/g),
  ];
  const dates = [
    ...postHtml.matchAll(
      /<td class="msbData" align="center">(\d{2} \w+ \d{4})<\/td>/g
    ),
  ];

  if (!rates.length) return null;

  return {
    rate: parseFloat(rates[rates.length - 1][1]),
    date: dates[dates.length - 1]?.[1],
  };
}

const getCachedSoraRate = unstable_cache(
  async (year: number, month: number): Promise<SoraResult> => {
    try {
      let result = await scrapeMonth(year, month);

      // If no data yet this month (early in the month), try the previous month
      if (!result) {
        const prev = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
        result = await scrapeMonth(prev.y, prev.m);
      }

      if (result) return { rate: result.rate, isLive: true, date: result.date };
    } catch {
      // fall through to fallback
    }
    return { rate: SORA_FALLBACK, isLive: false };
  },
  ["sora-rate"],
  { revalidate: 3600 }
);

export async function fetchSoraRate(): Promise<SoraResult> {
  const now = new Date();
  return getCachedSoraRate(now.getFullYear(), now.getMonth() + 1);
}
