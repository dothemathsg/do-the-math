"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";
import { sendNotification } from "@/lib/mailer";

type State = { success: true } | { error: string } | null;

function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function subscribe(_prev: State, formData: FormData): Promise<State> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already subscribed — we'll keep the updates coming." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  try {
    await sendNotification(
      "New newsletter subscriber — Do The Math",
      `<p style="font-family:sans-serif;font-size:14px;">
        <strong>${email}</strong> just subscribed to the Do The Math newsletter.
      </p>`
    );
  } catch (e) {
    console.error("Newsletter notification failed:", e);
  }

  return { success: true };
}
