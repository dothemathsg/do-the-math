import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Pin this function to Singapore so outbound requests to URA clear the geo-restriction
export const preferredRegion = "sin1";
export const maxDuration = 300;

// Vercel cron: runs on the 10th of each month at 02:00 SGT (18:00 UTC day before)
// Configured in vercel.json
// URA API is geo-restricted to Singapore IPs — this route must run in sin1 region.

const ACCESS_KEY = process.env.URA_ACCESS_KEY!;
const BASE_URL = "https://eservice.ura.gov.sg/uraDataService";

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
  const url = `${BASE_URL}/insertNewToken/v1`;
  const res = await fetch(url, {
    method: "GET",
    headers: { AccessKey: ACCESS_KEY },
  });
  const raw = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Token endpoint returned non-JSON (status ${res.status}): ${raw.slice(0, 200)}`);
  }
  if (!data.Result) throw new Error(`Token missing in response: ${JSON.stringify(data)}`);
  return data.Result as string;
}

interface UraTransaction {
  area: string;
  floorRange: string;
  contractDate: string;
  typeOfSale: string;
  price: string;
  propertyType: string;
  district: string;
  tenure: string;
  noOfUnits: string;
  typeOfArea: string;
}
interface UraProject {
  project: string;
  street: string;
  tenure: string;
  transaction: UraTransaction[];
}

async function fetchBatch(token: string, batch: number): Promise<{ projects: UraProject[] }> {
  const res = await fetch(
    `${BASE_URL}/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=${batch}`,
    { headers: { AccessKey: ACCESS_KEY, Token: token } }
  );
  const data = await res.json();
  if (data.Status !== "Success") throw new Error(`Batch ${batch} failed: ${data.Message}`);
  return { projects: (data.Result ?? []) as UraProject[] };
}

export async function GET(request: Request) {
  // Protect against unauthorised calls in production
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const token = await getToken();
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
      const { projects } = await fetchBatch(token, batch);
      for (const proj of projects) {
        const district = parseInt(proj.transaction?.[0]?.district ?? "0");
        if (!district) continue;
        for (const tx of proj.transaction ?? []) {
          const contract_date = parseContractDate(tx.contractDate);
          if (!contract_date) continue;
          const price = parseInt(tx.price);
          const area_sqm = parseFloat(tx.area);
          if (!price || !area_sqm) continue;
          rows.push({
            project: proj.project,
            street: proj.street || null,
            district,
            price,
            area_sqm,
            floor_range: tx.floorRange && tx.floorRange !== "-" ? tx.floorRange : null,
            property_type: tx.propertyType || null,
            tenure: tx.tenure || null,
            type_of_sale: SALE_TYPE[tx.typeOfSale] ?? tx.typeOfSale ?? null,
            contract_date,
          });
        }
      }
    }

    let upserted = 0;
    const CHUNK = 500;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const { error } = await supabase
        .from("property_transactions")
        .upsert(rows.slice(i, i + CHUNK), {
          onConflict: "project,district,price,area_sqm,contract_date,floor_range",
          ignoreDuplicates: true,
        });
      if (!error) upserted += Math.min(CHUNK, rows.length - i);
    }

    return NextResponse.json({ ok: true, rows: rows.length, upserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
