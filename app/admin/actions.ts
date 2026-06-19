"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function approvePlan(planId: string) {
  const supabase = getSupabase();
  await supabase
    .from("content_plans")
    .update({ status: "approved" })
    .eq("id", planId);
  revalidatePath("/admin");
}

export async function rejectPlan(planId: string) {
  const supabase = getSupabase();
  await supabase
    .from("content_plans")
    .update({ status: "rejected" })
    .eq("id", planId);
  revalidatePath("/admin");
}

export async function scheduleArticle(articleId: string, scheduledAt: string) {
  const supabase = getSupabase();
  await supabase
    .from("articles")
    .update({ status: "scheduled", scheduled_at: scheduledAt })
    .eq("id", articleId);
  revalidatePath("/admin");
}

export async function publishNow(articleId: string) {
  const supabase = getSupabase();
  const now = new Date().toISOString();
  await supabase
    .from("articles")
    .update({ status: "published", published_at: now, scheduled_at: null })
    .eq("id", articleId);
  revalidatePath("/admin");
}

export async function deleteDraft(articleId: string) {
  const supabase = getSupabase();
  await supabase.from("articles").delete().eq("id", articleId);
  revalidatePath("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}
