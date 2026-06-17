import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

// HDB Resale Flat Prices dataset on data.gov.sg
const DATASET_ID = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc";

// Approximate mapping of HDB towns to URA postal districts.
// Each HDB town maps to the district that best covers its main area.
const TOWN_TO_DISTRICT: Record<string, number> = {
  "ANG MO KIO":       20,
  "BEDOK":            16,
  "BISHAN":           20,
  "BUKIT BATOK":      23,
  "BUKIT MERAH":       3,
  "BUKIT PANJANG":    23,
  "BUKIT TIMAH":      21,
  "CENTRAL AREA":      2,
  "CHOA CHU KANG":    23,
  "CLEMENTI":          5,
  "GEYLANG":          14,
  "HOUGANG":          19,
  "JURONG EAST":      22,
  "JURONG WEST":      22,
  "KALLANG/WHAMPOA":  12,
  "MARINE PARADE":    15,
  "PASIR RIS":        18,
  "PUNGGOL":          19,
  "QUEENSTOWN":        3,
  "SEMBAWANG":        27,
  "SENGKANG":         19,
  "SERANGOON":        19,
  "TAMPINES":         18,
  "TOA PAYOH":        12,
  "WOODLANDS":        25,
  "YISHUN":           27,
};

interface HDBRecord {
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
}

async function fetchBatch(offset: number, limit: number): Promise<HDBRecord[]> {
  const url =
    `https://data.gov.sg/api/action/datastore_search` +
    `?resource_id=${DATASET_ID}` +
    `&sort=month%20desc` +
    `&limit=${limit}` +
    `&offset=${offset}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching HDB data`);
  const json = await res.json();
  return json.result?.records ?? [];
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch the last ~12 months of data (≈ 24,000 records at ~2,000/month)
  const TARGET_RECORDS = 24_000;
  const BATCH_SIZE = 3_000;

  console.log("Fetching recent HDB resale data from data.gov.sg…");
  const allRecords: HDBRecord[] = [];

  for (let offset = 0; allRecords.length < TARGET_RECORDS; offset += BATCH_SIZE) {
    const batch = await fetchBatch(offset, BATCH_SIZE);
    if (batch.length === 0) break;
    allRecords.push(...batch);
    console.log(`  Fetched ${allRecords.length} records…`);
    if (batch.length < BATCH_SIZE) break;
  }

  console.log(`Total fetched: ${allRecords.length}`);

  // Transform to property_transactions shape
  const unknown: string[] = [];
  const rows = allRecords.flatMap((r) => {
    const town = r.town?.toUpperCase().trim();
    const district = TOWN_TO_DISTRICT[town];
    if (!district) {
      if (!unknown.includes(town)) unknown.push(town);
      return [];
    }

    const price = Math.round(parseFloat(r.resale_price));
    const areaSqm = parseFloat(r.floor_area_sqm);
    if (isNaN(price) || isNaN(areaSqm) || areaSqm <= 0 || price <= 0) return [];

    const areaSqft = areaSqm * 10.7639;
    const psf = Math.round(price / areaSqft);

    void psf; // psf is a generated column in DB, computed from price/area_sqm automatically
    return [
      {
        project: `${r.block} ${r.street_name}`,
        street: r.street_name,
        district,
        price,
        area_sqm: areaSqm,
        floor_range: r.storey_range ?? null,
        property_type: `HDB ${r.flat_type}`,
        tenure: "Leasehold 99 years",
        type_of_sale: "HDB Resale",
        contract_date: `${r.month}-01`,
      },
    ];
  });

  if (unknown.length > 0) {
    console.warn("Unknown towns (skipped):", unknown.join(", "));
  }

  // Deduplicate by the table's unique constraint
  const seen = new Set<string>();
  const unique = rows.filter((r) => {
    const key = [r.project, r.district, r.price, r.area_sqm, r.contract_date, r.floor_range ?? ""].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`Transformed ${rows.length} rows → ${unique.length} after dedup`);

  // Clear existing HDB records before re-inserting
  const { error: delErr } = await supabase
    .from("property_transactions")
    .delete()
    .eq("type_of_sale", "HDB Resale");

  if (delErr) throw new Error(`Delete failed: ${delErr.message}`);
  console.log("Cleared existing HDB Resale rows");

  // Insert in batches of 500
  const INSERT_BATCH = 500;
  let inserted = 0;

  for (let i = 0; i < unique.length; i += INSERT_BATCH) {
    const batch = unique.slice(i, i + INSERT_BATCH);
    const { error } = await supabase
      .from("property_transactions")
      .upsert(batch, { onConflict: "project,district,price,area_sqm,contract_date,floor_range" });
    if (error) {
      console.error(`Batch ${Math.floor(i / INSERT_BATCH) + 1} error:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(
        `\r  Inserted ${inserted.toLocaleString()} / ${unique.length.toLocaleString()}`
      );
    }
  }

  console.log(`\nDone — imported ${inserted.toLocaleString()} HDB resale transactions.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
