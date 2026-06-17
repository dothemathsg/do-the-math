import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const banks = ["Bank of China", "CIMB", "Maybank", "Citibank", "HSBC"];

  for (const bank of banks) {
    const { error, count } = await supabase
      .from("mortgage_rates")
      .delete({ count: "exact" })
      .eq("bank", bank);
    if (error) {
      console.error(`Failed to delete ${bank}: ${error.message}`);
    } else {
      console.log(`Deleted ${count} row(s) for ${bank}`);
    }
  }
}

main().catch(console.error);
