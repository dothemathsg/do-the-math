import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  const { data: due, error: fetchErr } = await supabase
    .from("articles")
    .select("id, scheduled_at")
    .eq("status", "scheduled")
    .lte("scheduled_at", now);

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  if (!due || due.length === 0) {
    return NextResponse.json({ published: 0 });
  }

  let published = 0;
  for (const article of due) {
    const { error } = await supabase
      .from("articles")
      .update({
        status: "published",
        published_at: article.scheduled_at,
        scheduled_at: null,
      })
      .eq("id", article.id);
    if (!error) published++;
  }

  return NextResponse.json({ published });
}
