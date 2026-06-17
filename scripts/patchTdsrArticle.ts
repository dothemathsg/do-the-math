import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function main() {
  const { data: article, error } = await supabase
    .from("articles")
    .select("content")
    .eq("slug", "tdsr-explained-how-much-can-you-borrow")
    .single();

  if (error || !article) {
    console.error("Could not fetch article:", error?.message);
    return;
  }

  const updated = (article.content as string).replace(
    "Use a mortgage calculator to estimate your instalment, then check if it fits within your TDSR.",
    'Use our <a href="/calculator">mortgage calculator</a> to estimate your instalment, then check if it fits within your TDSR.'
  );

  const { error: updateError } = await supabase
    .from("articles")
    .update({ content: updated })
    .eq("slug", "tdsr-explained-how-much-can-you-borrow");

  if (updateError) {
    console.error("Update failed:", updateError.message);
  } else {
    console.log("✓ TDSR article updated with calculator link.");
  }
}

main().catch(console.error);
