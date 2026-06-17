import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function main() {
  const { data } = await supabase
    .from("articles")
    .select("slug, title, published_at")
    .order("published_at", { ascending: false });
  console.log(JSON.stringify(data, null, 2));
}

main();
