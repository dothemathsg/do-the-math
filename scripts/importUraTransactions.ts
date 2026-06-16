/**
 * Fetches private residential transaction data from URA API (batches 1–4)
 * and upserts into Supabase property_transactions table.
 *
 * URA API is geo-restricted to Singapore IPs — run this on Vercel (sin1 region)
 * or from within Singapore. Will not work from outside Singapore.
 *
 * Usage: npx tsx scripts/importUraTransactions.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const ACCESS_KEY = process.env.URA_ACCESS_KEY!;
const BASE_URL = "https://eservice.ura.gov.sg/uraDataService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// URA contractDate format: "MMYY" e.g. "0126" = Jan 2026
function parseContractDate(raw: string): string | null {
  const m = raw.match(/^(\d{2})(\d{2})$/);
  if (!m) return null;
  const month = parseInt(m[1]);
  const year = parseInt(m[2]) + 2000;
  if (month < 1 || month > 12) return null;
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

const SALE_TYPE: Record<string, string> = { "1": "New Sale", "2": "Sub Sale", "3": "Resale" };

async function getToken(): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/insertNewToken/v1`,
    { headers: { "User-Agent": "DoTheMath/1.0", AccessKey: ACCESS_KEY } }
  );
  const data = await res.json();
  if (!data.Result) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.Result;
}

interface UraTransaction {
  area: string;
  floorRange: string;
  noOfUnits: string;
  contractDate: string;
  typeOfSale: string;
  price: string;
  propertyType: string;
  district: string;
  typeOfArea: string;
}

interface UraProject {
  project: string;
  street: string;
  x: string;
  y: string;
  marketSegment: string;
  tenure: string;
  transaction: UraTransaction[];
}

async function fetchBatch(token: string, batch: number): Promise<UraProject[]> {
  const res = await fetch(
    `${BASE_URL}/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=${batch}`,
    {
      headers: {
        "User-Agent": "DoTheMath/1.0",
        AccessKey: ACCESS_KEY,
        Token: token,
      },
    }
  );
  const data = await res.json();
  if (data.Status !== "Success") {
    throw new Error(`Batch ${batch} failed: ${JSON.stringify(data)}`);
  }
  return data.Result ?? [];
}

async function main() {
  console.log("Getting URA token…");
  const token = await getToken();
  console.log("Token obtained.");

  const rows: {
    project: string;
    street: string | null;
    district: number;
    price: number;
    area_sqm: number;
    floor_range: string | null;
    property_type: string | null;
    tenure: string | null;
    type_of_sale: string | null;
    contract_date: string;
  }[] = [];

  for (let batch = 1; batch <= 4; batch++) {
    console.log(`Fetching batch ${batch}/4…`);
    const projects = await fetchBatch(token, batch);
    console.log(`  ${projects.length} projects in batch ${batch}`);

    for (const project of projects) {
      const district = parseInt(project.transaction?.[0]?.district ?? "0");
      if (!district) continue;

      for (const tx of project.transaction ?? []) {
        const contractDate = parseContractDate(tx.contractDate);
        if (!contractDate) continue;

        const price = parseInt(tx.price);
        const area = parseFloat(tx.area);
        if (!price || !area) continue;

        rows.push({
          project: project.project,
          street: project.street || null,
          district,
          price,
          area_sqm: area,
          floor_range: tx.floorRange && tx.floorRange !== "-" ? tx.floorRange : null,
          property_type: tx.propertyType || null,
          tenure: tx.tenure || null,
          type_of_sale: SALE_TYPE[tx.typeOfSale] ?? tx.typeOfSale ?? null,
          contract_date: contractDate,
        });
      }
    }
  }

  console.log(`Total rows to upsert: ${rows.length}`);

  // Upsert in chunks of 500
  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("property_transactions")
      .upsert(chunk, {
        onConflict: "project,district,price,area_sqm,contract_date,floor_range",
        ignoreDuplicates: true,
      });
    if (error) console.error(`Chunk ${i / CHUNK + 1} error:`, error.message);
    else inserted += chunk.length;
    process.stdout.write(`\r  Upserted ${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }

  console.log(`\nDone. ${inserted} rows upserted.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
