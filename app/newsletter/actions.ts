"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/supabase/types";

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

  return { success: true };
}
