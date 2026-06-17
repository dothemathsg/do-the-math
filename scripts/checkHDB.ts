import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function main() {
  // All distinct property_type values in the table
  const { data: types } = await supabase
    .from("property_transactions")
    .select("property_type")
    .limit(10000);

  const counts = new Map<string, number>();
  for (const row of types ?? []) {
    const t = row.property_type ?? "(null)";
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  console.log("\nAll property_type values in DB:");
  for (const [type, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count.toString().padStart(6)}  ${type}`);
  }

  // Landed types specifically
  const landedTypes = ["Semi-Detached House", "Terrace House", "Detached House"];
  const { count: landedCount } = await supabase
    .from("property_transactions")
    .select("*", { count: "exact", head: true })
    .in("property_type", landedTypes);
  console.log("\nLanded total (exact match):", landedCount);
}

main().catch(console.error);
